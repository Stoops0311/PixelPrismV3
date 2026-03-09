import { query, mutation, internalQuery, internalMutation } from "./_generated/server"
import { internal } from "./_generated/api"
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

const CREDIT_COSTS = { standard: 0.5, mid: 1, premium: 1.5 } as const

const MODEL_MAP = {
  standard: "qwen/qwen-image-2512",
  mid: "bytedance/seedream-4",
  premium: "bytedance/seedream-4.5",
} as const

// ============================================================
// PUBLIC QUERIES
// ============================================================

export const listByBrand = query({
  args: {
    brandId: v.id("brands"),
    status: v.optional(
      v.union(
        v.literal("generating"),
        v.literal("ready"),
        v.literal("failed")
      )
    ),
    productId: v.optional(v.id("products")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) {
      throw new Error("Brand not found")
    }

    const limit = args.limit ?? 50

    let images
    if (args.status) {
      images = await ctx.db
        .query("generatedImages")
        .withIndex("by_brand_and_status", (q: any) =>
          q.eq("brandId", args.brandId).eq("status", args.status)
        )
        .collect()
    } else {
      images = await ctx.db
        .query("generatedImages")
        .withIndex("by_brand", (q: any) => q.eq("brandId", args.brandId))
        .collect()
    }

    // Filter by productId if provided
    if (args.productId) {
      images = images.filter((img) => img.productId === args.productId)
    }

    // Sort by createdAt descending and apply limit
    return images
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
  },
})

export const listByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    const product = await ctx.db.get(args.productId)
    if (!product || product.userId !== user._id) {
      throw new Error("Product not found")
    }

    const images = await ctx.db
      .query("generatedImages")
      .withIndex("by_product", (q: any) => q.eq("productId", args.productId))
      .collect()

    return images.sort((a, b) => b.createdAt - a.createdAt)
  },
})

export const getById = query({
  args: { imageId: v.id("generatedImages") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    const image = await ctx.db.get(args.imageId)
    if (!image || image.userId !== user._id) {
      throw new Error("Image not found")
    }

    return image
  },
})

// ============================================================
// PUBLIC MUTATIONS
// ============================================================

export const createBatch = mutation({
  args: {
    brandId: v.id("brands"),
    prompt: v.string(),
    qualityTier: v.union(
      v.literal("standard"),
      v.literal("mid"),
      v.literal("premium")
    ),
    aspectRatio: v.union(
      v.literal("1:1"),
      v.literal("4:5"),
      v.literal("16:9"),
      v.literal("9:16"),
      v.literal("3:4"),
      v.literal("4:3"),
      v.literal("3:2"),
      v.literal("2:3"),
      v.literal("21:9")
    ),
    quantity: v.number(),
    productId: v.optional(v.id("products")),
    referenceImageId: v.optional(v.id("generatedImages")),
    stylePreset: v.optional(v.string()),
    negativePrompt: v.optional(v.string()),
    seed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    // Verify brand ownership
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) {
      throw new Error("Brand not found")
    }

    // Validate quantity
    if (args.quantity < 1 || args.quantity > 10) {
      throw new Error("Quantity must be between 1 and 10")
    }

    // Rate limit: max 50 images per hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recentImages = await ctx.db
      .query("generatedImages")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect()
    const recentCount = recentImages.filter(
      (img) => img.createdAt > oneHourAgo
    ).length
    if (recentCount >= 50) {
      throw new Error(
        "Rate limit exceeded. You can generate up to 50 images per hour."
      )
    }

    // Calculate cost
    const costPerImage = CREDIT_COSTS[args.qualityTier]
    const totalCost = args.quantity * costPerImage

    // Check sufficient credits
    const availableCredits =
      user.monthlyCreditsRemaining + user.topUpCreditsRemaining
    if (availableCredits < totalCost) {
      throw new Error("Insufficient credits")
    }

    // Get reference images if productId provided
    let referenceImageUrls: string[] = []
    if (args.productId) {
      const product = await ctx.db.get(args.productId)
      if (!product || product.userId !== user._id) {
        throw new Error("Product not found")
      }

      const productImages = await ctx.db
        .query("productImages")
        .withIndex("by_product", (q: any) =>
          q.eq("productId", args.productId)
        )
        .collect()
      referenceImageUrls = productImages.map((img) => img.imageUrl)
    }

    // Prepend user-selected reference image if provided
    if (args.referenceImageId) {
      const refImage = await ctx.db.get(args.referenceImageId)
      if (refImage && refImage.userId === user._id && refImage.imageUrl) {
        referenceImageUrls = [refImage.imageUrl, ...referenceImageUrls]
      }
    }

    // Deduct credits
    await ctx.runMutation(internal.credits.deductInternal, {
      userId: user._id,
      amount: totalCost,
      brandId: args.brandId,
      description: `Generated ${args.quantity} ${args.qualityTier} image${args.quantity > 1 ? "s" : ""}`,
      operationDetails: {
        model: MODEL_MAP[args.qualityTier],
        qualityTier: args.qualityTier,
        prompt: args.prompt,
        aspectRatio: args.aspectRatio,
        referenceImageCount: referenceImageUrls.length,
        status: "success",
      },
    })

    // Build fullPrompt — stylePreset contains the actual prompt suffix (e.g. ", professional product photography...")
    const fullPrompt = args.prompt + (args.stylePreset || "")

    const model = MODEL_MAP[args.qualityTier]
    const now = Date.now()

    // Create N image records and schedule generation
    const imageIds = []
    for (let i = 0; i < args.quantity; i++) {
      const imageId = await ctx.db.insert("generatedImages", {
        userId: user._id,
        brandId: args.brandId,
        productId: args.productId,
        prompt: args.prompt,
        stylePreset: args.stylePreset,
        fullPrompt,
        negativePrompt: args.negativePrompt,
        model,
        qualityTier: args.qualityTier,
        aspectRatio: args.aspectRatio,
        seed: args.seed,
        referenceImageUrls:
          referenceImageUrls.length > 0 ? referenceImageUrls : undefined,
        referenceImageCount: referenceImageUrls.length,
        status: "generating",
        creditsUsed: costPerImage,
        refunded: false,
        retryCount: 0,
        createdAt: now,
      })

      // Schedule the generation action
      await ctx.scheduler.runAfter(
        0,
        internal.imageActions.generate,
        { imageId }
      )

      imageIds.push(imageId)
    }

    return imageIds
  },
})

export const remove = mutation({
  args: { imageId: v.id("generatedImages") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    const image = await ctx.db.get(args.imageId)
    if (!image || image.userId !== user._id) {
      throw new Error("Image not found")
    }

    await ctx.db.delete(args.imageId)
  },
})

// ============================================================
// INTERNAL QUERIES
// ============================================================

export const getInternal = internalQuery({
  args: { imageId: v.id("generatedImages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.imageId)
  },
})

// ============================================================
// INTERNAL MUTATIONS
// ============================================================

export const markComplete = internalMutation({
  args: {
    imageId: v.id("generatedImages"),
    imageUrl: v.string(),
    replicateOutputUrls: v.optional(v.array(v.string())),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId)
    if (!image) throw new Error("Image not found")

    await ctx.db.patch(args.imageId, {
      status: "ready",
      imageUrl: args.imageUrl,
      replicateOutputUrls: args.replicateOutputUrls,
      width: args.width,
      height: args.height,
      completedAt: Date.now(),
    })

    // Increment brand's generatedImagesCount
    const brand = await ctx.db.get(image.brandId)
    if (brand) {
      await ctx.db.patch(image.brandId, {
        generatedImagesCount: brand.generatedImagesCount + 1,
      })
    }

    // If productId exists, increment product stats
    if (image.productId) {
      const product = await ctx.db.get(image.productId)
      if (product) {
        await ctx.db.patch(image.productId, {
          generatedImagesCount: product.generatedImagesCount + 1,
          creditsSpent: product.creditsSpent + image.creditsUsed,
          updatedAt: Date.now(),
        })
      }
    }
  },
})

export const markFailed = internalMutation({
  args: {
    imageId: v.id("generatedImages"),
    errorMessage: v.string(),
    refunded: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.imageId, {
      status: "failed",
      errorMessage: args.errorMessage,
      refunded: args.refunded,
    })
  },
})

export const incrementRetry = internalMutation({
  args: { imageId: v.id("generatedImages") },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId)
    if (!image) throw new Error("Image not found")

    await ctx.db.patch(args.imageId, {
      retryCount: image.retryCount + 1,
    })
  },
})
