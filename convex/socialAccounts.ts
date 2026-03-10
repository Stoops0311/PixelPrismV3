import { mutation, query, internalMutation, internalQuery } from "./_generated/server"
import { v } from "convex/values"

async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
    .unique()
  if (!user) return null
  return user
}

export const listByBrand = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) {
      throw new Error("Brand not found")
    }

    return await ctx.db
      .query("socialAccounts")
      .withIndex("by_brand", (q: any) => q.eq("brandId", args.brandId))
      .collect()
  },
})

export const listConnectedByBrand = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) {
      throw new Error("Brand not found")
    }

    return await ctx.db
      .query("socialAccounts")
      .withIndex("by_brand_and_status", (q: any) =>
        q.eq("brandId", args.brandId).eq("status", "connected")
      )
      .collect()
  },
})

export const listConnectedForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []

    const accounts = await ctx.db
      .query("socialAccounts")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect()

    return accounts.filter((acc) => acc.status === "connected")
  },
})

export const disconnect = mutation({
  args: {
    socialAccountId: v.id("socialAccounts"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")
    const account = await ctx.db.get(args.socialAccountId)
    if (!account || account.userId !== user._id) {
      throw new Error("Social account not found")
    }

    await ctx.db.patch(args.socialAccountId, {
      status: "disconnected",
      disconnectedAt: Date.now(),
      disconnectReason: args.reason,
    })

    const connectedAccounts = await ctx.db
      .query("socialAccounts")
      .withIndex("by_brand_and_status", (q: any) =>
        q.eq("brandId", account.brandId).eq("status", "connected")
      )
      .collect()

    await ctx.db.patch(account.brandId, {
      connectedPlatformCount: connectedAccounts.length,
      lastActiveAt: Date.now(),
    })

    return args.socialAccountId
  },
})

export const getByPostForMeIdInternal = internalQuery({
  args: { postForMeAccountId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("socialAccounts")
      .withIndex("by_postforme_id", (q: any) =>
        q.eq("postForMeAccountId", args.postForMeAccountId)
      )
      .unique()
  },
})

export const listByIdsInternal = internalQuery({
  args: { socialAccountIds: v.array(v.id("socialAccounts")) },
  handler: async (ctx, args) => {
    const rows = await Promise.all(args.socialAccountIds.map((id) => ctx.db.get(id)))
    return rows.filter(Boolean)
  },
})

export const listConnectedByBrandInternal = internalQuery({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("socialAccounts")
      .withIndex("by_brand_and_status", (q: any) =>
        q.eq("brandId", args.brandId).eq("status", "connected")
      )
      .collect()
  },
})

export const upsertFromPostForMeInternal = internalMutation({
  args: {
    userId: v.id("users"),
    brandId: v.id("brands"),
    postForMeAccountId: v.string(),
    platform: v.union(
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("linkedin"),
      v.literal("pinterest")
    ),
    connectionType: v.optional(
      v.union(
        v.literal("instagram_direct"),
        v.literal("instagram_facebook"),
        v.literal("linkedin_personal"),
        v.literal("linkedin_organization")
      )
    ),
    username: v.optional(v.string()),
    displayName: v.optional(v.string()),
    profilePhotoUrl: v.optional(v.string()),
    externalId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    followerCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("socialAccounts")
      .withIndex("by_postforme_id", (q: any) =>
        q.eq("postForMeAccountId", args.postForMeAccountId)
      )
      .unique()

    const now = Date.now()

    if (existing) {
      await ctx.db.patch(existing._id, {
        brandId: args.brandId,
        platform: args.platform,
        connectionType: args.connectionType,
        username: args.username,
        displayName: args.displayName,
        profilePhotoUrl: args.profilePhotoUrl,
        externalId: args.externalId,
        metadata: args.metadata,
        followerCount: args.followerCount,
        status: "connected",
        connectedAt: existing.connectedAt || now,
        disconnectedAt: undefined,
        disconnectReason: undefined,
      })
    } else {
      await ctx.db.insert("socialAccounts", {
        userId: args.userId,
        brandId: args.brandId,
        postForMeAccountId: args.postForMeAccountId,
        platform: args.platform,
        connectionType: args.connectionType,
        username: args.username,
        displayName: args.displayName,
        profilePhotoUrl: args.profilePhotoUrl,
        externalId: args.externalId,
        metadata: args.metadata,
        followerCount: args.followerCount,
        status: "connected",
        connectedAt: now,
      })
    }

    const connectedAccounts = await ctx.db
      .query("socialAccounts")
      .withIndex("by_brand_and_status", (q: any) =>
        q.eq("brandId", args.brandId).eq("status", "connected")
      )
      .collect()

    await ctx.db.patch(args.brandId, {
      connectedPlatformCount: connectedAccounts.length,
      lastActiveAt: now,
    })
  },
})

export const markDisconnectedByPostForMeIdInternal = internalMutation({
  args: {
    postForMeAccountId: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("socialAccounts")
      .withIndex("by_postforme_id", (q: any) =>
        q.eq("postForMeAccountId", args.postForMeAccountId)
      )
      .unique()
    if (!account) return

    await ctx.db.patch(account._id, {
      status: "disconnected",
      disconnectedAt: Date.now(),
      disconnectReason: args.reason,
    })

    const connectedAccounts = await ctx.db
      .query("socialAccounts")
      .withIndex("by_brand_and_status", (q: any) =>
        q.eq("brandId", account.brandId).eq("status", "connected")
      )
      .collect()

    await ctx.db.patch(account.brandId, {
      connectedPlatformCount: connectedAccounts.length,
      lastActiveAt: Date.now(),
    })
  },
})

export const updateMetricsInternal = internalMutation({
  args: {
    socialAccountId: v.id("socialAccounts"),
    followerCount: v.optional(v.number()),
    engagementRate: v.optional(v.number()),
    lastSyncedAt: v.number(),
    lastSyncStatus: v.union(v.literal("ok"), v.literal("error")),
    lastSyncError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.socialAccountId)
    if (!account) return

    await ctx.db.patch(args.socialAccountId, {
      followerCount: args.followerCount,
      engagementRate: args.engagementRate,
      lastSyncedAt: args.lastSyncedAt,
      lastSyncStatus: args.lastSyncStatus,
      lastSyncError: args.lastSyncError,
    })
  },
})
