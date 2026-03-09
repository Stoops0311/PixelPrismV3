import { query, mutation, internalMutation } from "./_generated/server"
import { v } from "convex/values"

// ============================================================
// HELPERS
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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// ============================================================
// QUERIES
// ============================================================

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()
    if (!user) return []

    return await ctx.db
      .query("brands")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()
    if (!user) return null

    return await ctx.db
      .query("brands")
      .withIndex("by_user_and_slug", (q) =>
        q.eq("userId", user._id).eq("slug", args.slug)
      )
      .unique()
  },
})

export const getById = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    const brand = await ctx.db.get(args.brandId)
    if (!brand) throw new Error("Brand not found")
    if (brand.userId !== user._id) throw new Error("Brand not found")

    return brand
  },
})

// ============================================================
// MUTATIONS
// ============================================================

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    industry: v.string(),
    targetAudience: v.string(),
    brandVoice: v.string(),
    timezone: v.string(),
    logoUrl: v.optional(v.string()),
    fullDescription: v.optional(v.string()),
    brandMission: v.optional(v.string()),
    brandValues: v.optional(v.string()),
    keyDifferentiators: v.optional(v.string()),
    competitorAwareness: v.optional(v.string()),
    contentThemes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    // Check brand limit
    const existingBrands = await ctx.db
      .query("brands")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()

    if (existingBrands.length >= user.maxBrands) {
      throw new Error(
        `Brand limit reached. Your ${user.subscriptionTier} plan allows ${user.maxBrands} brand(s).`
      )
    }

    // Generate unique slug
    let slug = generateSlug(args.name)
    if (!slug) slug = "brand"

    let finalSlug = slug
    let suffix = 2
    while (true) {
      const existing = await ctx.db
        .query("brands")
        .withIndex("by_user_and_slug", (q) =>
          q.eq("userId", user._id).eq("slug", finalSlug)
        )
        .unique()
      if (!existing) break
      finalSlug = `${slug}-${suffix}`
      suffix++
    }

    return await ctx.db.insert("brands", {
      userId: user._id,
      name: args.name,
      slug: finalSlug,
      description: args.description,
      logoUrl: args.logoUrl,
      industry: args.industry,
      fullDescription: args.fullDescription,
      targetAudience: args.targetAudience,
      brandVoice: args.brandVoice,
      brandMission: args.brandMission,
      brandValues: args.brandValues,
      keyDifferentiators: args.keyDifferentiators,
      competitorAwareness: args.competitorAwareness,
      contentThemes: args.contentThemes,
      timezone: args.timezone,
      totalFollowers: 0,
      connectedPlatformCount: 0,
      productsCount: 0,
      generatedImagesCount: 0,
      scheduledPostsCount: 0,
      createdAt: Date.now(),
    })
  },
})

export const update = mutation({
  args: {
    brandId: v.id("brands"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    industry: v.optional(v.string()),
    fullDescription: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    brandVoice: v.optional(v.string()),
    brandMission: v.optional(v.string()),
    brandValues: v.optional(v.string()),
    keyDifferentiators: v.optional(v.string()),
    competitorAwareness: v.optional(v.string()),
    contentThemes: v.optional(v.string()),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    const brand = await ctx.db.get(args.brandId)
    if (!brand) throw new Error("Brand not found")
    if (brand.userId !== user._id) throw new Error("Brand not found")

    const { brandId, ...updates } = args

    // Filter out undefined values
    const patch: Record<string, any> = {}
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        patch[key] = value
      }
    }

    // If name changed, regenerate slug
    if (patch.name && patch.name !== brand.name) {
      let slug = generateSlug(patch.name)
      if (!slug) slug = "brand"

      let finalSlug = slug
      let suffix = 2
      while (true) {
        const existing = await ctx.db
          .query("brands")
          .withIndex("by_user_and_slug", (q) =>
            q.eq("userId", user._id).eq("slug", finalSlug)
          )
          .unique()
        // Allow the current brand to keep its own slug
        if (!existing || existing._id === brandId) break
        finalSlug = `${slug}-${suffix}`
        suffix++
      }
      patch.slug = finalSlug
    }

    await ctx.db.patch(brandId, patch)
    return brandId
  },
})

export const remove = mutation({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    const brand = await ctx.db.get(args.brandId)
    if (!brand) throw new Error("Brand not found")
    if (brand.userId !== user._id) throw new Error("Brand not found")

    // Delete all products and their images for this brand
    const products = await ctx.db
      .query("products")
      .withIndex("by_brand", (q) => q.eq("brandId", args.brandId))
      .collect()

    for (const product of products) {
      const productImages = await ctx.db
        .query("productImages")
        .withIndex("by_product", (q) => q.eq("productId", product._id))
        .collect()
      for (const image of productImages) {
        await ctx.db.delete(image._id)
      }
      await ctx.db.delete(product._id)
    }

    // Delete all generated images for this brand
    const generatedImages = await ctx.db
      .query("generatedImages")
      .withIndex("by_brand", (q) => q.eq("brandId", args.brandId))
      .collect()
    for (const image of generatedImages) {
      await ctx.db.delete(image._id)
    }

    // Delete the brand
    await ctx.db.delete(args.brandId)
  },
})

// ============================================================
// INTERNAL MUTATIONS (for other Convex files)
// ============================================================

export const incrementCount = internalMutation({
  args: {
    brandId: v.id("brands"),
    field: v.union(
      v.literal("productsCount"),
      v.literal("generatedImagesCount"),
      v.literal("scheduledPostsCount"),
      v.literal("connectedPlatformCount")
    ),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const brand = await ctx.db.get(args.brandId)
    if (!brand) throw new Error("Brand not found")

    const currentValue = brand[args.field] as number
    await ctx.db.patch(args.brandId, {
      [args.field]: currentValue + args.amount,
    })
  },
})

export const decrementCount = internalMutation({
  args: {
    brandId: v.id("brands"),
    field: v.union(
      v.literal("productsCount"),
      v.literal("generatedImagesCount"),
      v.literal("scheduledPostsCount"),
      v.literal("connectedPlatformCount")
    ),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const brand = await ctx.db.get(args.brandId)
    if (!brand) throw new Error("Brand not found")

    const currentValue = brand[args.field] as number
    await ctx.db.patch(args.brandId, {
      [args.field]: Math.max(0, currentValue - args.amount),
    })
  },
})

export const updateAnalyticsSnapshot = internalMutation({
  args: {
    brandId: v.id("brands"),
    totalFollowers: v.number(),
    avgEngagementRate: v.optional(v.number()),
    lastActiveAt: v.number(),
  },
  handler: async (ctx, args) => {
    const brand = await ctx.db.get(args.brandId)
    if (!brand) throw new Error("Brand not found")

    await ctx.db.patch(args.brandId, {
      totalFollowers: args.totalFollowers,
      avgEngagementRate: args.avgEngagementRate,
      lastActiveAt: args.lastActiveAt,
    })
  },
})
