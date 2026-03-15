import { Polar } from "@convex-dev/polar"
import { action, internalMutation, query } from "./_generated/server"
import { api, components, internal } from "./_generated/api"
import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"

// Tier configuration — credits, limits, and pricing per plan
const TIER_CONFIG = {
  starter: {
    monthlyCredits: 50,
    maxBrands: 1,
    maxSocialAccounts: 2,
    price: 20,
  },
  professional: {
    monthlyCredits: 100,
    maxBrands: 2,
    maxSocialAccounts: 5,
    price: 30,
  },
  enterprise: {
    monthlyCredits: 300,
    maxBrands: 4,
    maxSocialAccounts: 10,
    price: 45,
  },
} as const

const IS_PRODUCTION = process.env.POLAR_SERVER === "production"

// Sandbox product IDs (dev/testing)
const TIER_PRODUCT_IDS_SANDBOX = {
  starter: "672efa21-55b2-4300-aa9b-c1cee55b89bd",
  professional: "9a52da8d-879c-4810-a867-ff3c405dfc51",
  enterprise: "d0669c49-bf83-485d-bfff-b265ca85895c",
} as const

const TOP_UP_PACKS_SANDBOX = {
  credits_100: { productId: "2d3d6eff-dffd-46f9-b39b-a9d8057fc071", credits: 100, price: 35 },
  credits_300: { productId: "17cb86d6-4501-499b-9024-53db81d7d873", credits: 300, price: 90 },
  credits_1000: { productId: "f7e9b4b8-01d0-4756-af3f-9ba55fe43eeb", credits: 1000, price: 250 },
} as const

// Production product IDs
const TIER_PRODUCT_IDS_PROD = {
  starter: "0d9f747d-976a-4629-8fb4-5e7851f46a62",
  professional: "69546893-b2d2-4ff5-8c80-b4a47b735958",
  enterprise: "5b5c79a3-2fa2-4352-8b09-e41c2a8f4c66",
} as const

const TOP_UP_PACKS_PROD = {
  credits_100: { productId: "3ffe69ef-5b1e-4520-ac33-d0d797ef375d", credits: 100, price: 35 },
  credits_300: { productId: "1f8e438d-0666-4bed-9f84-36a19378dbe8", credits: 300, price: 90 },
  credits_1000: { productId: "3a902b5b-41ee-4dcb-8eb6-f8978d04d652", credits: 1000, price: 250 },
} as const

// Active set — driven by POLAR_SERVER env var in Convex dashboard
const TIER_PRODUCT_IDS = IS_PRODUCTION ? TIER_PRODUCT_IDS_PROD : TIER_PRODUCT_IDS_SANDBOX
export const TOP_UP_PACKS = IS_PRODUCTION ? TOP_UP_PACKS_PROD : TOP_UP_PACKS_SANDBOX

function resolveTierFromProductId(productId: string) {
  if (productId === TIER_PRODUCT_IDS.starter) return "starter"
  if (productId === TIER_PRODUCT_IDS.professional) return "professional"
  if (productId === TIER_PRODUCT_IDS.enterprise) return "enterprise"
  return null
}

function resolveTopUpByProductId(productId: string) {
  const all = Object.values(TOP_UP_PACKS)
  return all.find((pack) => pack.productId === productId) || null
}

export const polar = new Polar(components.polar, {
  getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
    const user = await (ctx as any).runQuery(api.users.current)
    if (!user) throw new Error("Not authenticated")
    return { userId: user._id as string, email: user.email as string }
  },
  products: {
    starter: TIER_PRODUCT_IDS.starter,
    professional: TIER_PRODUCT_IDS.professional,
    enterprise: TIER_PRODUCT_IDS.enterprise,
    credits_100: TOP_UP_PACKS.credits_100.productId,
    credits_300: TOP_UP_PACKS.credits_300.productId,
    credits_1000: TOP_UP_PACKS.credits_1000.productId,
  },
  server: IS_PRODUCTION ? "production" : "sandbox",
})

export const {
  getConfiguredProducts,
  listAllProducts,
  generateCheckoutLink,
  generateCustomerPortalUrl,
  changeCurrentSubscription,
  cancelCurrentSubscription,
} = polar.api()

export const syncProducts = action({
  args: {},
  handler: async (ctx) => {
    await polar.syncProducts(ctx)
  },
})

export const currentWithSubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()
    if (!user) return null

    let subscription = null
    try {
      subscription = await polar.getCurrentSubscription(ctx, {
        userId: user._id,
      })
    } catch {
      // Polar SDK may throw if user has no customer record yet
    }

    return {
      ...user,
      subscription,
      isPremium: !!subscription && subscription.status === "active",
    }
  },
})

export const generateTopUpCheckoutLink = action({
  args: {
    packKey: v.union(
      v.literal("credits_100"),
      v.literal("credits_300"),
      v.literal("credits_1000")
    ),
    origin: v.string(),
    successUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.current)
    if (!user) throw new Error("Not authenticated")

    const pack = TOP_UP_PACKS[args.packKey]
    const checkout = await polar.createCheckoutSession(ctx as any, {
      productIds: [pack.productId],
      userId: String(user._id),
      email: user.email,
      origin: args.origin,
      successUrl: args.successUrl,
      metadata: {
        kind: "credit_top_up",
        packKey: args.packKey,
        credits: String(pack.credits),
        userId: String(user._id),
      },
    })

    return { url: checkout.url }
  },
})

export const generatePlanCheckoutLink = action({
  args: {
    tier: v.union(
      v.literal("starter"),
      v.literal("professional"),
      v.literal("enterprise")
    ),
    origin: v.string(),
    successUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.current)
    if (!user) throw new Error("Not authenticated")

    const productId = TIER_PRODUCT_IDS[args.tier]
    let currentSubscription = null
    try {
      currentSubscription = await polar.getCurrentSubscription(ctx as any, {
        userId: String(user._id),
      })
    } catch {
      // Polar SDK may throw if product record not synced yet
    }

    const checkout = await polar.createCheckoutSession(ctx as any, {
      productIds: [productId],
      userId: String(user._id),
      email: user.email,
      origin: args.origin,
      successUrl: args.successUrl,
      subscriptionId: currentSubscription?.id,
      metadata: {
        kind: "subscription",
        tier: args.tier,
        userId: String(user._id),
      },
    })

    return { url: checkout.url }
  },
})

export const processPaidOrderInternal = internalMutation({
  args: {
    eventId: v.string(),
    orderId: v.string(),
    productId: v.optional(v.string()),
    customerId: v.string(),
    userId: v.optional(v.string()),
    totalAmountCents: v.number(),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const alreadyProcessed = await ctx.db
      .query("webhookLogs")
      .withIndex("by_event_id", (q) => q.eq("eventId", args.eventId))
      .unique()
    if (alreadyProcessed) return

    const productId = args.productId || ""
    const pack = resolveTopUpByProductId(productId)

    if (pack && args.userId) {
      const typedUserId = args.userId as Id<"users">
      const user = await ctx.db.get(typedUserId)

      if (user) {
        const existingTopUp = await ctx.db
          .query("creditTopUps")
          .withIndex("by_polar_payment_id", (q) =>
            q.eq("polarPaymentId", args.orderId)
          )
          .unique()

        if (!existingTopUp) {
          const now = Date.now()
          const topUpId = await ctx.db.insert("creditTopUps", {
            userId: typedUserId,
            creditsAmount: pack.credits,
            pricePaid: args.totalAmountCents / 100,
            currency: (args.currency || "USD").toUpperCase(),
            status: "completed",
            polarPaymentId: args.orderId,
            creditsRemaining: pack.credits,
            creditsUsed: 0,
            purchasedAt: now,
            completedAt: now,
          })

          await ctx.runMutation(internal.credits.addTopUp, {
            userId: typedUserId,
            amount: pack.credits,
            topUpId,
            description: `Credit top-up (${pack.credits} credits)`,
          })

          await ctx.runMutation(internal.notifications.createInternal, {
            userId: typedUserId,
            type: "credits_received",
            title: "Credits added",
            body: `${pack.credits} credits have been added to your account.`,
            icon: "zap",
            href: "/dashboard/billing",
          })
        }
      }
    }

    await ctx.runMutation(internal.webhookLogs.logProcessed, {
      eventId: args.eventId,
      eventType: "order.paid",
      source: "polar",
    })
  },
})

export const syncSubscriptionFromWebhookInternal = internalMutation({
  args: {
    eventId: v.string(),
    subscriptionId: v.string(),
    customerId: v.string(),
    productId: v.string(),
    status: v.string(),
    cancelAtPeriodEnd: v.boolean(),
    currentPeriodEnd: v.optional(v.number()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const alreadyProcessed = await ctx.db
      .query("webhookLogs")
      .withIndex("by_event_id", (q) => q.eq("eventId", args.eventId))
      .unique()
    if (alreadyProcessed) return

    const tier = resolveTierFromProductId(args.productId)
    if (!tier || !args.userId) {
      await ctx.runMutation(internal.webhookLogs.logProcessed, {
        eventId: args.eventId,
        eventType: `subscription.${args.status}`,
        source: "polar",
      })
      return
    }

    const typedUserId = args.userId as Id<"users">
    const user = await ctx.db.get(typedUserId)

    if (!user) {
      await ctx.runMutation(internal.webhookLogs.logProcessed, {
        eventId: args.eventId,
        eventType: `subscription.${args.status}`,
        source: "polar",
      })
      return
    }

    if (args.status === "active" || args.status === "trialing") {
      await ctx.runMutation(internal.polar.syncSubscriptionToUser, {
        userId: typedUserId,
        tier,
        polarSubscriptionId: args.subscriptionId,
        polarCustomerId: args.customerId,
        currentPeriodEnd:
          args.currentPeriodEnd || Date.now() + 30 * 24 * 60 * 60 * 1000,
      })
    }

    if (args.status === "canceled" || args.cancelAtPeriodEnd) {
      await ctx.runMutation(internal.polar.handleSubscriptionCanceled, {
        userId: typedUserId,
        polarSubscriptionId: args.subscriptionId,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      })
    }

    await ctx.runMutation(internal.webhookLogs.logProcessed, {
      eventId: args.eventId,
      eventType: `subscription.${args.status}`,
      source: "polar",
    })
  },
})

// ============================================================
// SUBSCRIPTION LIFECYCLE HANDLERS
// ============================================================

/**
 * Sync subscription data from a Polar webhook event to the user record.
 * Called when a subscription is created or updated (renewal, plan change).
 */
export const syncSubscriptionToUser = internalMutation({
  args: {
    userId: v.id("users"),
    tier: v.union(
      v.literal("starter"),
      v.literal("professional"),
      v.literal("enterprise")
    ),
    polarSubscriptionId: v.string(),
    polarCustomerId: v.string(),
    currentPeriodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const config = TIER_CONFIG[args.tier]

    const user = await ctx.db.get(args.userId)
    if (!user) {
      console.error(
        `syncSubscriptionToUser: user ${args.userId} not found`
      )
      return
    }

    // Update user with tier info and reset monthly credits
    await ctx.db.patch(args.userId, {
      subscriptionTier: args.tier,
      monthlyCreditsAllocation: config.monthlyCredits,
      monthlyCreditsRemaining: config.monthlyCredits,
      maxBrands: config.maxBrands,
      maxSocialAccounts: config.maxSocialAccounts,
      subscriptionRenewalDate: args.currentPeriodEnd,
    })

    // Create or update subscription record
    const existingSub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique()

    if (existingSub) {
      await ctx.db.patch(existingSub._id, {
        tier: args.tier,
        status: "active",
        polarSubscriptionId: args.polarSubscriptionId,
        polarCustomerId: args.polarCustomerId,
        renewalDate: args.currentPeriodEnd,
        currentPeriodEnd: args.currentPeriodEnd,
        updatedAt: Date.now(),
      })
    } else {
      await ctx.db.insert("subscriptions", {
        userId: args.userId,
        polarSubscriptionId: args.polarSubscriptionId,
        polarCustomerId: args.polarCustomerId,
        tier: args.tier,
        status: "active",
        pricePerMonth: config.price,
        currency: "USD",
        currentPeriodStart: Date.now(),
        currentPeriodEnd: args.currentPeriodEnd,
        renewalDate: args.currentPeriodEnd,
        cancelAtPeriodEnd: false,
        createdAt: Date.now(),
      })
    }

    // Record credit transaction for the allocation
    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "renewal",
      amount: config.monthlyCredits,
      balanceBefore: {
        monthly: user.monthlyCreditsRemaining,
        topUp: user.topUpCreditsRemaining,
      },
      balanceAfter: {
        monthly: config.monthlyCredits,
        topUp: user.topUpCreditsRemaining,
      },
      description: `Subscription activated (${args.tier} plan)`,
      createdAt: Date.now(),
    })
  },
})

/**
 * Handle subscription cancellation from Polar.
 * Sets cancelAtPeriodEnd — user keeps access until period ends.
 */
export const handleSubscriptionCanceled = internalMutation({
  args: {
    userId: v.id("users"),
    polarSubscriptionId: v.string(),
    cancelAtPeriodEnd: v.boolean(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique()

    if (!subscription) {
      console.error(
        `handleSubscriptionCanceled: no subscription found for user ${args.userId}`
      )
      return
    }

    await ctx.db.patch(subscription._id, {
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      canceledAt: Date.now(),
      status: args.cancelAtPeriodEnd ? "active" : "canceled",
      updatedAt: Date.now(),
    })

    // If immediate cancellation (not at period end), downgrade user now
    if (!args.cancelAtPeriodEnd) {
      await ctx.db.patch(args.userId, {
        subscriptionTier: "free",
        monthlyCreditsAllocation: 5,
        monthlyCreditsRemaining: 5,
        maxBrands: 1,
        maxSocialAccounts: 1,
        subscriptionRenewalDate: undefined,
      })
    }
  },
})
