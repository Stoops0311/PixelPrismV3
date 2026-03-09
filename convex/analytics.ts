import { internalMutation, internalQuery, mutation, query } from "./_generated/server"
import { internal } from "./_generated/api"
import { v } from "convex/values"

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

export const getOverview = query({
  args: {
    brandId: v.id("brands"),
    period: v.optional(
      v.union(v.literal("7d"), v.literal("30d"), v.literal("90d"), v.literal("all"))
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) throw new Error("Brand not found")

    const period = args.period ?? "30d"
    return await ctx.db
      .query("analyticsCache")
      .withIndex("by_brand_and_period", (q: any) =>
        q.eq("brandId", args.brandId).eq("period", period)
      )
      .unique()
  },
})

export const getFollowerGrowth = query({
  args: {
    brandId: v.id("brands"),
    period: v.optional(
      v.union(v.literal("7d"), v.literal("30d"), v.literal("90d"), v.literal("all"))
    ),
    platform: v.optional(
      v.union(
        v.literal("instagram"),
        v.literal("facebook"),
        v.literal("linkedin"),
        v.literal("pinterest"),
        v.literal("aggregate")
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) throw new Error("Brand not found")

    const days = args.period === "7d" ? 7 : args.period === "90d" ? 90 : args.period === "all" ? null : 30
    const cutoff =
      days === null
        ? null
        : new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10)

    const rows = args.platform
      ? await ctx.db
          .query("followerGrowth")
          .withIndex("by_brand_platform_and_date", (q: any) =>
            q.eq("brandId", args.brandId).eq("platform", args.platform)
          )
          .collect()
      : await ctx.db
          .query("followerGrowth")
          .withIndex("by_brand_and_date", (q: any) => q.eq("brandId", args.brandId))
          .collect()

    return rows
      .filter((r) => (cutoff ? r.date >= cutoff : true))
      .sort((a, b) => (a.date < b.date ? -1 : 1))
  },
})

export const getTopContent = query({
  args: {
    brandId: v.id("brands"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) throw new Error("Brand not found")

    const rows = await ctx.db
      .query("topContent")
      .withIndex("by_brand", (q: any) => q.eq("brandId", args.brandId))
      .collect()

    return rows
      .sort((a, b) => b.engagements - a.engagements)
      .slice(0, args.limit ?? 10)
  },
})

export const refreshForBrand = mutation({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) throw new Error("Brand not found")

    await ctx.scheduler.runAfter(0, internal.postformeActions.syncBrandAnalytics, {
      brandId: args.brandId,
    })

    return { queued: true }
  },
})

export const listFollowerGrowthByBrandInternal = internalQuery({
  args: {
    brandId: v.id("brands"),
    platform: v.optional(
      v.union(
        v.literal("instagram"),
        v.literal("facebook"),
        v.literal("linkedin"),
        v.literal("pinterest"),
        v.literal("aggregate")
      )
    ),
  },
  handler: async (ctx, args) => {
    const rows = args.platform
      ? await ctx.db
          .query("followerGrowth")
          .withIndex("by_brand_platform_and_date", (q: any) =>
            q.eq("brandId", args.brandId).eq("platform", args.platform)
          )
          .collect()
      : await ctx.db
          .query("followerGrowth")
          .withIndex("by_brand_and_date", (q: any) => q.eq("brandId", args.brandId))
          .collect()

    return rows.sort((a, b) => (a.date < b.date ? -1 : 1))
  },
})

export const upsertOverviewInternal = internalMutation({
  args: {
    brandId: v.id("brands"),
    period: v.union(v.literal("7d"), v.literal("30d"), v.literal("90d"), v.literal("all")),
    followerCount: v.number(),
    followerChange: v.number(),
    followerChangePercent: v.optional(v.number()),
    engagementRate: v.optional(v.number()),
    totalReach: v.optional(v.number()),
    postsPublished: v.number(),
    bestPostPreview: v.optional(v.string()),
    bestPostPlatform: v.optional(
      v.union(
        v.literal("instagram"),
        v.literal("facebook"),
        v.literal("linkedin"),
        v.literal("pinterest")
      )
    ),
    bestPostEngagements: v.optional(v.number()),
    syncStatus: v.union(v.literal("ok"), v.literal("error")),
    syncError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("analyticsCache")
      .withIndex("by_brand_and_period", (q: any) =>
        q.eq("brandId", args.brandId).eq("period", args.period)
      )
      .unique()

    const patch = {
      followerCount: args.followerCount,
      followerChange: args.followerChange,
      followerChangePercent: args.followerChangePercent,
      engagementRate: args.engagementRate,
      totalReach: args.totalReach,
      postsPublished: args.postsPublished,
      bestPostPreview: args.bestPostPreview,
      bestPostPlatform: args.bestPostPlatform,
      bestPostEngagements: args.bestPostEngagements,
      lastSyncedAt: Date.now(),
      syncStatus: args.syncStatus,
      syncError: args.syncError,
    }

    if (existing) {
      await ctx.db.patch(existing._id, patch)
      return existing._id
    }

    return await ctx.db.insert("analyticsCache", {
      brandId: args.brandId,
      period: args.period,
      ...patch,
    })
  },
})

export const replaceTopContentInternal = internalMutation({
  args: {
    brandId: v.id("brands"),
    rows: v.array(
      v.object({
        scheduledPostId: v.optional(v.id("scheduledPosts")),
        postForMePostId: v.string(),
        platform: v.union(
          v.literal("instagram"),
          v.literal("facebook"),
          v.literal("linkedin"),
          v.literal("pinterest")
        ),
        preview: v.string(),
        imageUrl: v.optional(v.string()),
        engagements: v.number(),
        reach: v.number(),
        engagementRate: v.optional(v.number()),
        likes: v.optional(v.number()),
        comments: v.optional(v.number()),
        shares: v.optional(v.number()),
        saves: v.optional(v.number()),
        publishedAt: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("topContent")
      .withIndex("by_brand", (q: any) => q.eq("brandId", args.brandId))
      .collect()
    for (const row of existing) {
      await ctx.db.delete(row._id)
    }

    const now = Date.now()
    for (const row of args.rows) {
      await ctx.db.insert("topContent", {
        brandId: args.brandId,
        ...row,
        lastUpdatedAt: now,
      })
    }
  },
})

export const upsertFollowerPointInternal = internalMutation({
  args: {
    brandId: v.id("brands"),
    socialAccountId: v.optional(v.id("socialAccounts")),
    platform: v.union(
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("linkedin"),
      v.literal("pinterest"),
      v.literal("aggregate")
    ),
    date: v.string(),
    followerCount: v.number(),
    changeFromPrevious: v.number(),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("followerGrowth")
      .withIndex("by_brand_platform_and_date", (q: any) =>
        q.eq("brandId", args.brandId).eq("platform", args.platform)
      )
      .collect()

    const existing = rows.find(
      (r) =>
        r.date === args.date &&
        (r.socialAccountId || undefined) === (args.socialAccountId || undefined)
    )

    if (existing) {
      await ctx.db.patch(existing._id, {
        followerCount: args.followerCount,
        changeFromPrevious: args.changeFromPrevious,
        recordedAt: Date.now(),
      })
      return
    }

    await ctx.db.insert("followerGrowth", {
      brandId: args.brandId,
      socialAccountId: args.socialAccountId,
      platform: args.platform,
      date: args.date,
      followerCount: args.followerCount,
      changeFromPrevious: args.changeFromPrevious,
      recordedAt: Date.now(),
    })
  },
})

export const enqueueBrandSyncs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const brands = await ctx.db.query("brands").collect()
    for (const brand of brands) {
      await ctx.scheduler.runAfter(0, internal.postformeActions.syncBrandAnalytics, {
        brandId: brand._id,
      })
    }
  },
})
