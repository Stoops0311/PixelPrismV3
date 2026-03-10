import { query, mutation } from "./_generated/server"
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

// ============================================================
// QUERIES
// ============================================================

export const getByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []
    const product = await ctx.db.get(args.productId)
    if (!product || product.userId !== user._id) {
      throw new Error("Product not found")
    }

    const images = await ctx.db
      .query("productImages")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect()

    return images.sort((a, b) => a.order - b.order)
  },
})

// ============================================================
// MUTATIONS
// ============================================================

export const create = mutation({
  args: {
    productId: v.id("products"),
    imageUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    originalFileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    mimeType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")
    const product = await ctx.db.get(args.productId)
    if (!product || product.userId !== user._id) {
      throw new Error("Product not found")
    }

    // Check current image count
    const existingImages = await ctx.db
      .query("productImages")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect()

    if (existingImages.length >= 3) {
      throw new Error("Maximum 3 reference images per product")
    }

    const order = existingImages.length

    const imageId = await ctx.db.insert("productImages", {
      productId: args.productId,
      brandId: product.brandId,
      userId: user._id,
      imageUrl: args.imageUrl,
      thumbnailUrl: args.thumbnailUrl,
      originalFileName: args.originalFileName,
      fileSize: args.fileSize,
      width: args.width,
      height: args.height,
      mimeType: args.mimeType,
      order,
      uploadedAt: Date.now(),
    })

    // Increment product's reference image count
    await ctx.db.patch(args.productId, {
      referenceImagesCount: product.referenceImagesCount + 1,
      updatedAt: Date.now(),
    })

    return imageId
  },
})

export const remove = mutation({
  args: { imageId: v.id("productImages") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")
    const image = await ctx.db.get(args.imageId)
    if (!image || image.userId !== user._id) {
      throw new Error("Image not found")
    }

    const productId = image.productId

    // Delete the image
    await ctx.db.delete(args.imageId)

    // Get remaining images for this product and reorder
    const remaining = await ctx.db
      .query("productImages")
      .withIndex("by_product", (q) => q.eq("productId", productId))
      .collect()

    const sorted = remaining.sort((a, b) => a.order - b.order)
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].order !== i) {
        await ctx.db.patch(sorted[i]._id, { order: i })
      }
    }

    // Decrement product's reference image count
    const product = await ctx.db.get(productId)
    if (product) {
      await ctx.db.patch(productId, {
        referenceImagesCount: Math.max(0, product.referenceImagesCount - 1),
        updatedAt: Date.now(),
      })
    }
  },
})
