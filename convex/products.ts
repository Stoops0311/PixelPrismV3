import { query, mutation, internalMutation } from "./_generated/server"
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

export const listByBrand = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) {
      throw new Error("Brand not found")
    }

    const products = await ctx.db
      .query("products")
      .withIndex("by_brand", (q) => q.eq("brandId", args.brandId))
      .collect()

    // Sort by createdAt descending (newest first)
    return products.sort((a, b) => b.createdAt - a.createdAt)
  },
})

export const getById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return null
    const product = await ctx.db.get(args.productId)
    if (!product || product.userId !== user._id) {
      throw new Error("Product not found")
    }
    return product
  },
})

// ============================================================
// MUTATIONS
// ============================================================

export const create = mutation({
  args: {
    brandId: v.id("brands"),
    name: v.string(),
    description: v.string(),
    gradientPreview: v.optional(v.string()),
    colorGrid: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) {
      throw new Error("Brand not found")
    }

    const productId = await ctx.db.insert("products", {
      brandId: args.brandId,
      userId: user._id,
      name: args.name,
      description: args.description,
      gradientPreview: args.gradientPreview,
      colorGrid: args.colorGrid,
      referenceImagesCount: 0,
      generatedImagesCount: 0,
      creditsSpent: 0,
      createdAt: Date.now(),
    })

    // Increment brand's denormalized product count
    await ctx.db.patch(brand._id, {
      productsCount: brand.productsCount + 1,
    })

    return productId
  },
})

export const update = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    gradientPreview: v.optional(v.string()),
    colorGrid: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")
    const product = await ctx.db.get(args.productId)
    if (!product || product.userId !== user._id) {
      throw new Error("Product not found")
    }

    const updates: Record<string, any> = { updatedAt: Date.now() }
    if (args.name !== undefined) updates.name = args.name
    if (args.description !== undefined) updates.description = args.description
    if (args.gradientPreview !== undefined) updates.gradientPreview = args.gradientPreview
    if (args.colorGrid !== undefined) updates.colorGrid = args.colorGrid

    await ctx.db.patch(args.productId, updates)
  },
})

export const remove = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")
    const product = await ctx.db.get(args.productId)
    if (!product || product.userId !== user._id) {
      throw new Error("Product not found")
    }

    // Delete all productImages for this product
    const productImages = await ctx.db
      .query("productImages")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect()
    for (const img of productImages) {
      await ctx.db.delete(img._id)
    }

    // Delete all generatedImages for this product
    const generatedImages = await ctx.db
      .query("generatedImages")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect()
    for (const img of generatedImages) {
      await ctx.db.delete(img._id)
    }

    // Decrement brand's denormalized product count
    const brand = await ctx.db.get(product.brandId)
    if (brand) {
      await ctx.db.patch(brand._id, {
        productsCount: Math.max(0, brand.productsCount - 1),
      })
    }

    // Delete the product itself
    await ctx.db.delete(args.productId)
  },
})

// ============================================================
// INTERNAL MUTATIONS
// ============================================================

export const incrementGeneratedCount = internalMutation({
  args: {
    productId: v.id("products"),
    creditsAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId)
    if (!product) throw new Error("Product not found")

    await ctx.db.patch(args.productId, {
      generatedImagesCount: product.generatedImagesCount + 1,
      creditsSpent: product.creditsSpent + args.creditsAmount,
      updatedAt: Date.now(),
    })
  },
})
