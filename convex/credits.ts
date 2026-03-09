import { query, internalMutation } from "./_generated/server"
import { internal } from "./_generated/api"
import { v } from "convex/values"

// ============================================================
// AUTH HELPER
// ============================================================

async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("Not authenticated")
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
    .unique()
  if (!user) throw new Error("User not found")
  return user
}

// ============================================================
// PUBLIC QUERIES
// ============================================================

export const getBalance = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    return {
      monthly: user.monthlyCreditsRemaining,
      topUp: user.topUpCreditsRemaining,
      total: user.monthlyCreditsRemaining + user.topUpCreditsRemaining,
      allocation: user.monthlyCreditsAllocation,
      renewalDate: user.subscriptionRenewalDate,
    }
  },
})

export const getTransactions = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    const limit = args.limit ?? 20

    const results = await ctx.db
      .query("creditTransactions")
      .withIndex("by_user_and_date", (q: any) => q.eq("userId", user._id))
      .order("desc")
      .paginate({ numItems: limit, cursor: args.cursor ?? null })

    return {
      transactions: results.page,
      continueCursor: results.continueCursor,
      isDone: results.isDone,
    }
  },
})

export const checkSufficientCredits = query({
  args: { amount: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    const available = user.monthlyCreditsRemaining + user.topUpCreditsRemaining
    return {
      sufficient: available >= args.amount,
      available,
      needed: args.amount,
    }
  },
})

export const getDailyUsage = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    const days = Math.min(Math.max(args.days ?? 30, 1), 90)
    const now = Date.now()
    const cutoff = now - days * 24 * 60 * 60 * 1000

    const txns = await ctx.db
      .query("creditTransactions")
      .withIndex("by_user_and_date", (q: any) => q.eq("userId", user._id))
      .order("desc")
      .collect()

    const recent = txns.filter((t) => t.createdAt >= cutoff)
    const bucket = new Map<string, number>()

    for (const txn of recent) {
      const date = new Date(txn.createdAt)
      const dayKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`

      if (!bucket.has(dayKey)) bucket.set(dayKey, 0)

      if (txn.amount < 0) {
        bucket.set(dayKey, (bucket.get(dayKey) || 0) + Math.abs(txn.amount))
      }
    }

    const result: Array<{ date: string; credits: number }> = []
    for (let i = days - 1; i >= 0; i--) {
      const ts = now - i * 24 * 60 * 60 * 1000
      const date = new Date(ts)
      const dayKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`
      result.push({
        date: dayKey,
        credits: Number((bucket.get(dayKey) || 0).toFixed(2)),
      })
    }

    return result
  },
})

// ============================================================
// INTERNAL MUTATIONS
// ============================================================

export const deductInternal = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    brandId: v.optional(v.id("brands")),
    generatedImageId: v.optional(v.id("generatedImages")),
    description: v.string(),
    operationDetails: v.optional(
      v.object({
        model: v.optional(v.string()),
        qualityTier: v.optional(v.string()),
        prompt: v.optional(v.string()),
        aspectRatio: v.optional(v.string()),
        referenceImageCount: v.optional(v.number()),
        productName: v.optional(v.string()),
        status: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user) throw new Error("User not found")

    const totalAvailable =
      user.monthlyCreditsRemaining + user.topUpCreditsRemaining
    if (totalAvailable < args.amount) {
      throw new Error("Insufficient credits")
    }

    const balanceBefore = {
      monthly: user.monthlyCreditsRemaining,
      topUp: user.topUpCreditsRemaining,
    }

    let newMonthly: number
    let newTopUp: number

    if (user.monthlyCreditsRemaining >= args.amount) {
      newMonthly = user.monthlyCreditsRemaining - args.amount
      newTopUp = user.topUpCreditsRemaining
    } else {
      const remainder = args.amount - user.monthlyCreditsRemaining
      newMonthly = 0
      newTopUp = user.topUpCreditsRemaining - remainder
    }

    const balanceAfter = { monthly: newMonthly, topUp: newTopUp }

    await ctx.db.patch(args.userId, {
      monthlyCreditsRemaining: newMonthly,
      topUpCreditsRemaining: newTopUp,
    })

    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      brandId: args.brandId,
      type: "generation",
      amount: -args.amount,
      balanceBefore,
      balanceAfter,
      generatedImageId: args.generatedImageId,
      operationDetails: args.operationDetails,
      description: args.description,
      createdAt: Date.now(),
    })

    // Low credits warning (dedupe: max 1 per 24h)
    const newTotal = newMonthly + newTopUp
    if (newTotal <= 10 && newTotal > 0) {
      const ONE_DAY = 24 * 60 * 60 * 1000
      const recent = await ctx.db
        .query("notifications")
        .withIndex("by_user_and_created", (q: any) =>
          q.eq("userId", args.userId)
        )
        .order("desc")
        .take(1)
      const lastNotif = recent[0]
      const shouldSkip =
        lastNotif &&
        lastNotif.type === "credits_low" &&
        Date.now() - lastNotif.createdAt < ONE_DAY

      if (!shouldSkip) {
        await ctx.runMutation(internal.notifications.createInternal, {
          userId: args.userId,
          type: "credits_low",
          title: "Credits running low",
          body: `You have ${newTotal} credits remaining.`,
          icon: "alert",
          href: "/dashboard/billing",
        })
      }
    }

    return { balanceBefore, balanceAfter }
  },
})

export const refundInternal = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    generatedImageId: v.optional(v.id("generatedImages")),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user) throw new Error("User not found")

    const balanceBefore = {
      monthly: user.monthlyCreditsRemaining,
      topUp: user.topUpCreditsRemaining,
    }

    // Refund to monthly first (capped at allocation), overflow to top-up
    const monthlySpace =
      user.monthlyCreditsAllocation - user.monthlyCreditsRemaining
    const toMonthly = Math.min(args.amount, monthlySpace)
    const toTopUp = args.amount - toMonthly

    const newMonthly = user.monthlyCreditsRemaining + toMonthly
    const newTopUp = user.topUpCreditsRemaining + toTopUp
    const balanceAfter = { monthly: newMonthly, topUp: newTopUp }

    await ctx.db.patch(args.userId, {
      monthlyCreditsRemaining: newMonthly,
      topUpCreditsRemaining: newTopUp,
    })

    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "refund",
      amount: args.amount,
      balanceBefore,
      balanceAfter,
      generatedImageId: args.generatedImageId,
      description: args.description,
      createdAt: Date.now(),
    })

    return { balanceBefore, balanceAfter }
  },
})

export const resetMonthly = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user) throw new Error("User not found")

    const balanceBefore = {
      monthly: user.monthlyCreditsRemaining,
      topUp: user.topUpCreditsRemaining,
    }

    const newMonthly = user.monthlyCreditsAllocation
    const newRenewalDate = Date.now() + 30 * 24 * 60 * 60 * 1000

    await ctx.db.patch(args.userId, {
      monthlyCreditsRemaining: newMonthly,
      subscriptionRenewalDate: newRenewalDate,
    })

    const balanceAfter = {
      monthly: newMonthly,
      topUp: user.topUpCreditsRemaining,
    }

    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "renewal",
      amount: user.monthlyCreditsAllocation,
      balanceBefore,
      balanceAfter,
      description: `Monthly credit renewal (${user.subscriptionTier} plan)`,
      createdAt: Date.now(),
    })
  },
})

export const addTopUp = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    topUpId: v.id("creditTopUps"),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user) throw new Error("User not found")

    const balanceBefore = {
      monthly: user.monthlyCreditsRemaining,
      topUp: user.topUpCreditsRemaining,
    }

    const newTopUp = user.topUpCreditsRemaining + args.amount

    await ctx.db.patch(args.userId, {
      topUpCreditsRemaining: newTopUp,
    })

    const balanceAfter = {
      monthly: user.monthlyCreditsRemaining,
      topUp: newTopUp,
    }

    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "top_up",
      amount: args.amount,
      balanceBefore,
      balanceAfter,
      topUpId: args.topUpId,
      description: args.description,
      createdAt: Date.now(),
    })

    return { balanceBefore, balanceAfter }
  },
})

// ============================================================
// CRON-CALLED INTERNAL MUTATION
// ============================================================

export const processRenewals = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()

    // Find users whose renewal date has passed
    const usersToRenew = await ctx.db
      .query("users")
      .withIndex("by_renewal_date")
      .filter((q: any) =>
        q.and(
          q.neq(q.field("subscriptionTier"), "none"),
          q.lte(q.field("subscriptionRenewalDate"), now)
        )
      )
      .collect()

    for (const user of usersToRenew) {
      // Inline the reset logic to stay within a single mutation
      const balanceBefore = {
        monthly: user.monthlyCreditsRemaining,
        topUp: user.topUpCreditsRemaining,
      }

      const newMonthly = user.monthlyCreditsAllocation
      const newRenewalDate = now + 30 * 24 * 60 * 60 * 1000

      await ctx.db.patch(user._id, {
        monthlyCreditsRemaining: newMonthly,
        subscriptionRenewalDate: newRenewalDate,
      })

      const balanceAfter = {
        monthly: newMonthly,
        topUp: user.topUpCreditsRemaining,
      }

      await ctx.db.insert("creditTransactions", {
        userId: user._id,
        type: "renewal",
        amount: user.monthlyCreditsAllocation,
        balanceBefore,
        balanceAfter,
        description: `Monthly credit renewal (${user.subscriptionTier} plan)`,
        createdAt: now,
      })

      // Notify user of credit renewal
      await ctx.runMutation(internal.notifications.createInternal, {
        userId: user._id,
        type: "credits_received",
        title: "Credits renewed",
        body: `You received ${user.monthlyCreditsAllocation} monthly credits.`,
        icon: "zap",
        href: "/dashboard/billing",
      })
    }

    return { renewed: usersToRenew.length }
  },
})
