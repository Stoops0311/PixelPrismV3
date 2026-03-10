import { mutation, query, internalMutation, internalQuery } from "./_generated/server"
import { internal } from "./_generated/api"
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

const platformValidator = v.union(
  v.literal("instagram"),
  v.literal("facebook"),
  v.literal("linkedin"),
  v.literal("pinterest")
)

export const listByBrand = query({
  args: {
    brandId: v.id("brands"),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("scheduled"),
        v.literal("publishing"),
        v.literal("published"),
        v.literal("failed")
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) throw new Error("Brand not found")

    const rows = args.status
      ? await ctx.db
          .query("scheduledPosts")
          .withIndex("by_brand_and_status", (q: any) =>
            q.eq("brandId", args.brandId).eq("status", args.status)
          )
          .collect()
      : await ctx.db
          .query("scheduledPosts")
          .withIndex("by_brand", (q: any) => q.eq("brandId", args.brandId))
          .collect()

    return rows.sort((a, b) => {
      const aTs = a.scheduledFor ?? a.createdAt
      const bTs = b.scheduledFor ?? b.createdAt
      return aTs - bTs
    })
  },
})

export const listUpcoming = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []
    const limit = args.limit ?? 20
    const now = Date.now()
    const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000

    const posts = await ctx.db
      .query("scheduledPosts")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect()

    const upcoming = posts
      .filter(
        (p) =>
          (p.status === "scheduled" || p.status === "draft") &&
          p.scheduledFor &&
          p.scheduledFor >= now &&
          p.scheduledFor <= sevenDaysFromNow
      )
      .sort((a, b) => (a.scheduledFor ?? 0) - (b.scheduledFor ?? 0))
      .slice(0, limit)

    const brandIds = [...new Set(upcoming.map((p) => p.brandId))]
    const brands = await Promise.all(brandIds.map((id) => ctx.db.get(id)))
    const brandMap = Object.fromEntries(
      brands.filter(Boolean).map((b: any) => [b._id, b])
    )

    return upcoming.map((post) => ({
      ...post,
      brandName: (brandMap[post.brandId as string]?.name as string) ?? "Unknown",
      brandSlug: (brandMap[post.brandId as string]?.slug as string) ?? "",
      brandInitials: ((brandMap[post.brandId as string]?.name as string) ?? "?")
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    }))
  },
})

export const create = mutation({
  args: {
    brandId: v.id("brands"),
    caption: v.string(),
    imageId: v.optional(v.id("generatedImages")),
    imageUrl: v.optional(v.string()),
    socialAccountIds: v.array(v.id("socialAccounts")),
    selectedPlatforms: v.array(platformValidator),
    hashtags: v.optional(v.array(v.string())),
    timezone: v.string(),
    scheduledFor: v.optional(v.number()),
    asDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) throw new Error("Brand not found")

    if (args.caption.trim().length === 0) {
      throw new Error("Caption cannot be empty")
    }

    if (args.socialAccountIds.length === 0) {
      throw new Error("Select at least one connected account")
    }

    if (!args.asDraft && !args.scheduledFor) {
      throw new Error("Scheduled date/time is required")
    }

    const now = Date.now()
    if (args.scheduledFor && args.scheduledFor < now - 60 * 1000) {
      throw new Error("Scheduled time must be in the future")
    }

    const accounts = await Promise.all(
      args.socialAccountIds.map((id) => ctx.db.get(id))
    )
    const validAccounts = accounts.filter(
      (acc) => acc && acc.brandId === args.brandId && acc.status === "connected"
    )

    if (validAccounts.length !== args.socialAccountIds.length) {
      throw new Error("One or more social accounts are not connected")
    }

    const status = args.asDraft ? "draft" : "scheduled"

    const postId = await ctx.db.insert("scheduledPosts", {
      userId: user._id,
      brandId: args.brandId,
      imageId: args.imageId,
      imageUrl: args.imageUrl,
      caption: args.caption,
      hashtags: args.hashtags,
      selectedPlatforms: args.selectedPlatforms,
      socialAccountIds: args.socialAccountIds,
      timezone: args.timezone,
      scheduledFor: args.scheduledFor,
      status,
      platformResults: args.selectedPlatforms.map((platform) => ({
        platform,
        status: "pending" as const,
      })),
      createdAt: now,
      updatedAt: now,
    })

    if (args.imageUrl) {
      await ctx.scheduler.runAfter(0, internal.postformeActions.cacheMediaForScheduledPost, {
        scheduledPostId: postId,
      })
    }

    await ctx.runMutation(internal.brands.incrementCount, {
      brandId: args.brandId,
      field: "scheduledPostsCount",
      amount: 1,
    })

    if (!args.asDraft) {
      const delayMs = Math.max(0, (args.scheduledFor || now) - now)
      await ctx.scheduler.runAfter(delayMs, internal.postformeActions.publishScheduledPost, {
        scheduledPostId: postId,
      })
    }

    return postId
  },
})

export const saveDraft = mutation({
  args: {
    brandId: v.id("brands"),
    caption: v.string(),
    imageId: v.optional(v.id("generatedImages")),
    imageUrl: v.optional(v.string()),
    socialAccountIds: v.array(v.id("socialAccounts")),
    selectedPlatforms: v.array(platformValidator),
    hashtags: v.optional(v.array(v.string())),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) throw new Error("Brand not found")

    const now = Date.now()
    const postId = await ctx.db.insert("scheduledPosts", {
      userId: user._id,
      brandId: args.brandId,
      imageId: args.imageId,
      imageUrl: args.imageUrl,
      caption: args.caption,
      hashtags: args.hashtags,
      selectedPlatforms: args.selectedPlatforms,
      socialAccountIds: args.socialAccountIds,
      timezone: args.timezone,
      status: "draft",
      platformResults: args.selectedPlatforms.map((platform) => ({
        platform,
        status: "pending" as const,
      })),
      createdAt: now,
      updatedAt: now,
    })

    if (args.imageUrl) {
      await ctx.scheduler.runAfter(0, internal.postformeActions.cacheMediaForScheduledPost, {
        scheduledPostId: postId,
      })
    }

    return postId
  },
})

export const createInternal = internalMutation({
  args: {
    brandId: v.id("brands"),
    userId: v.id("users"),
    caption: v.string(),
    imageId: v.optional(v.id("generatedImages")),
    imageUrl: v.optional(v.string()),
    socialAccountIds: v.array(v.id("socialAccounts")),
    selectedPlatforms: v.array(platformValidator),
    hashtags: v.optional(v.array(v.string())),
    timezone: v.string(),
    scheduledFor: v.optional(v.number()),
    asDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const status = args.asDraft ? "draft" : "scheduled"

    return await ctx.db.insert("scheduledPosts", {
      userId: args.userId,
      brandId: args.brandId,
      imageId: args.imageId,
      imageUrl: args.imageUrl,
      caption: args.caption,
      hashtags: args.hashtags,
      selectedPlatforms: args.selectedPlatforms,
      socialAccountIds: args.socialAccountIds,
      timezone: args.timezone,
      scheduledFor: args.scheduledFor,
      status,
      platformResults: args.selectedPlatforms.map((platform) => ({
        platform,
        status: "pending" as const,
      })),
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    scheduledPostId: v.id("scheduledPosts"),
    caption: v.string(),
    imageId: v.optional(v.id("generatedImages")),
    imageUrl: v.optional(v.string()),
    socialAccountIds: v.array(v.id("socialAccounts")),
    selectedPlatforms: v.array(platformValidator),
    hashtags: v.optional(v.array(v.string())),
    timezone: v.string(),
    scheduledFor: v.optional(v.number()),
    asDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")
    const post = await ctx.db.get(args.scheduledPostId)

    if (!post || post.userId !== user._id) {
      throw new Error("Post not found")
    }

    if (post.status !== "draft" && post.status !== "scheduled") {
      throw new Error("Only draft or scheduled posts can be edited")
    }

    if (args.caption.trim().length === 0) {
      throw new Error("Caption cannot be empty")
    }

  if (args.socialAccountIds.length === 0) {
      throw new Error("Select at least one connected account")
    }

    const accounts = await Promise.all(
      args.socialAccountIds.map((id) => ctx.db.get(id))
    )
    const validAccounts = accounts.filter(
      (acc) => acc && acc.brandId === post.brandId && acc.status === "connected"
    )

    if (validAccounts.length !== args.socialAccountIds.length) {
      throw new Error("One or more social accounts are not connected")
    }

    const now = Date.now()
    const nextStatus = args.asDraft ? "draft" : "scheduled"

    if (!args.asDraft && !args.scheduledFor) {
      throw new Error("Scheduled date/time is required")
    }

    if (args.scheduledFor && args.scheduledFor < now - 60 * 1000) {
      throw new Error("Scheduled time must be in the future")
    }

    await ctx.db.patch(args.scheduledPostId, {
      caption: args.caption,
      imageId: args.imageId,
      imageUrl: args.imageUrl,
      socialAccountIds: args.socialAccountIds,
      selectedPlatforms: args.selectedPlatforms,
      hashtags: args.hashtags,
      timezone: args.timezone,
      scheduledFor: args.scheduledFor,
      status: nextStatus,
      platformResults: args.selectedPlatforms.map((platform) => ({
        platform,
        status: "pending" as const,
      })),
      syncError: undefined,
      updatedAt: now,
    })

    if (args.imageUrl) {
      await ctx.scheduler.runAfter(0, internal.postformeActions.cacheMediaForScheduledPost, {
        scheduledPostId: args.scheduledPostId,
      })
    }

    if (!args.asDraft) {
      const delayMs = Math.max(0, (args.scheduledFor || now) - now)
      await ctx.scheduler.runAfter(delayMs, internal.postformeActions.publishScheduledPost, {
        scheduledPostId: args.scheduledPostId,
      })
    }

    return args.scheduledPostId
  },
})

export const markPublishingInternal = internalMutation({
  args: {
    scheduledPostId: v.id("scheduledPosts"),
    postForMePostId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.scheduledPostId, {
      status: "publishing",
      postForMePostId: args.postForMePostId,
      updatedAt: Date.now(),
      syncError: undefined,
    })
  },
})

export const markScheduleFailedInternal = internalMutation({
  args: {
    scheduledPostId: v.id("scheduledPosts"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.scheduledPostId, {
      status: "failed",
      syncError: args.error,
      updatedAt: Date.now(),
    })
  },
})

export const setPostForMeMediaUrlInternal = internalMutation({
  args: {
    scheduledPostId: v.id("scheduledPosts"),
    postForMeMediaUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.scheduledPostId, {
      postForMeMediaUrl: args.postForMeMediaUrl,
      updatedAt: Date.now(),
    })
  },
})

export const markPostStatusByPostForMeIdInternal = internalMutation({
  args: {
    postForMePostId: v.string(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("publishing"),
      v.literal("published"),
      v.literal("failed")
    ),
    publishedAt: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("scheduledPosts")
      .withIndex("by_postforme_post_id", (q: any) =>
        q.eq("postForMePostId", args.postForMePostId)
      )
      .unique()
    if (!post) return

    await ctx.db.patch(post._id, {
      status: args.status,
      publishedAt: args.publishedAt,
      syncError: args.error,
      updatedAt: Date.now(),
    })
  },
})

export const applyPostResultInternal = internalMutation({
  args: {
    postForMePostId: v.string(),
    platform: platformValidator,
    success: v.boolean(),
    platformPostId: v.optional(v.string()),
    platformPostUrl: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("scheduledPosts")
      .withIndex("by_postforme_post_id", (q: any) =>
        q.eq("postForMePostId", args.postForMePostId)
      )
      .unique()
    if (!post) return

    const currentResults = post.platformResults ?? []
    const nextResults = currentResults.map((r) => {
      if (r.platform !== args.platform) return r
      return {
        ...r,
        status: args.success ? ("success" as const) : ("failed" as const),
        platformPostId: args.platformPostId,
        platformPostUrl: args.platformPostUrl,
        publishedAt: args.publishedAt,
        errorMessage: args.errorMessage,
      }
    })

    const hasAnySuccess = nextResults.some((r) => r.status === "success")
    const allFinal = nextResults.every(
      (r) => r.status === "success" || r.status === "failed"
    )
    const hasAnyPending = nextResults.some((r) => r.status === "pending")
    const hasAnyFailed = nextResults.some((r) => r.status === "failed")

    let nextStatus = post.status
    if (allFinal && hasAnySuccess) {
      nextStatus = "published"
    } else if (allFinal && !hasAnySuccess && hasAnyFailed) {
      nextStatus = "failed"
    } else if (hasAnyPending) {
      nextStatus = "publishing"
    }

    await ctx.db.patch(post._id, {
      platformResults: nextResults,
      status: nextStatus,
      publishedAt:
        nextStatus === "published"
          ? args.publishedAt || post.publishedAt || Date.now()
          : post.publishedAt,
      updatedAt: Date.now(),
    })

    // Send notification when post is fully published
    if (nextStatus === "published" && post.status !== "published") {
      const successPlatforms = nextResults
        .filter((r) => r.status === "success")
        .map((r) => r.platform)
      const platformNames = successPlatforms
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(", ")

      const brand = await ctx.db.get(post.brandId)
      await ctx.runMutation(internal.notifications.createInternal, {
        userId: post.userId,
        type: "post_published",
        title: "Post published",
        body: `Your post went live on ${platformNames}!`,
        icon: "post",
        href: brand
          ? `/dashboard/${brand.slug}/scheduling`
          : "/dashboard",
        brandId: post.brandId,
        relatedId: String(post._id),
      })
    }
  },
})

export const getForPublishingInternal = internalQuery({
  args: { scheduledPostId: v.id("scheduledPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.scheduledPostId)
  },
})
