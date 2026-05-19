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

async function assertBrandOwnership(ctx: any, brandId: any) {
  const user = await getCurrentUser(ctx)
  if (!user) throw new Error("Not authenticated")
  const brand = await ctx.db.get(brandId)
  if (!brand || brand.userId !== user._id) {
    throw new Error("Brand not found")
  }
  return { user, brand }
}

export const list = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) return []

    const logos = await ctx.db
      .query("brandLogos")
      .withIndex("by_brand_ordered", (q: any) => q.eq("brandId", args.brandId))
      .collect()

    return logos.sort((a, b) => a.order - b.order)
  },
})

export const create = mutation({
  args: {
    brandId: v.id("brands"),
    imageUrl: v.string(),
    originalFileName: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await assertBrandOwnership(ctx, args.brandId)

    const existing = await ctx.db
      .query("brandLogos")
      .withIndex("by_brand", (q: any) => q.eq("brandId", args.brandId))
      .collect()
    const nextOrder =
      existing.length > 0
        ? Math.max(...existing.map((l) => l.order)) + 1
        : 0

    const logoId = await ctx.db.insert("brandLogos", {
      userId: user._id,
      brandId: args.brandId,
      imageUrl: args.imageUrl,
      originalFileName: args.originalFileName,
      fileSize: args.fileSize,
      mimeType: args.mimeType,
      order: nextOrder,
      createdAt: Date.now(),
    })

    return logoId
  },
})

export const remove = mutation({
  args: { logoId: v.id("brandLogos") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    const logo = await ctx.db.get(args.logoId)
    if (!logo || logo.userId !== user._id) {
      throw new Error("Logo not found")
    }

    await ctx.db.delete(args.logoId)
  },
})

export const reorder = mutation({
  args: {
    brandId: v.id("brands"),
    orderedIds: v.array(v.id("brandLogos")),
  },
  handler: async (ctx, args) => {
    const { user } = await assertBrandOwnership(ctx, args.brandId)

    for (let i = 0; i < args.orderedIds.length; i++) {
      const logo = await ctx.db.get(args.orderedIds[i])
      if (!logo || logo.userId !== user._id || logo.brandId !== args.brandId) {
        throw new Error("Invalid logo in reorder list")
      }
      await ctx.db.patch(args.orderedIds[i], { order: i })
    }
  },
})
