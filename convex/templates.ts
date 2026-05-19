import { query, mutation, internalQuery } from "./_generated/server"
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

const fieldValidator = v.object({
  id: v.string(),
  name: v.string(),
  type: v.union(
    v.literal("text"),
    v.literal("longtext"),
    v.literal("list"),
    v.literal("image")
  ),
  placeholder: v.optional(v.string()),
})

export const list = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []
    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) return []

    const templates = await ctx.db
      .query("templates")
      .withIndex("by_brand", (q: any) => q.eq("brandId", args.brandId))
      .collect()

    return templates.sort((a, b) => b.updatedAt - a.updatedAt)
  },
})

export const getById = query({
  args: { templateId: v.id("templates") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return null

    const template = await ctx.db.get(args.templateId)
    if (!template || template.userId !== user._id) return null
    return template
  },
})

export const getInternal = internalQuery({
  args: { templateId: v.id("templates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.templateId)
  },
})

export const create = mutation({
  args: {
    brandId: v.id("brands"),
    name: v.string(),
    description: v.string(),
    styleDescription: v.string(),
    referenceImageUrls: v.array(v.string()),
    aspectRatio: v.string(),
    fields: v.array(fieldValidator),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    const brand = await ctx.db.get(args.brandId)
    if (!brand || brand.userId !== user._id) {
      throw new Error("Brand not found")
    }

    if (args.referenceImageUrls.length === 0) {
      throw new Error("At least one reference image is required")
    }
    if (args.referenceImageUrls.length > 3) {
      throw new Error("At most 3 reference images allowed")
    }
    if (!args.name.trim()) {
      throw new Error("Template name is required")
    }

    const now = Date.now()
    const templateId = await ctx.db.insert("templates", {
      userId: user._id,
      brandId: args.brandId,
      name: args.name.trim(),
      description: args.description,
      styleDescription: args.styleDescription,
      referenceImageUrls: args.referenceImageUrls,
      thumbnailUrl: args.referenceImageUrls[0],
      aspectRatio: args.aspectRatio,
      fields: args.fields,
      createdAt: now,
      updatedAt: now,
    })

    return templateId
  },
})

export const update = mutation({
  args: {
    templateId: v.id("templates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    styleDescription: v.optional(v.string()),
    aspectRatio: v.optional(v.string()),
    fields: v.optional(v.array(fieldValidator)),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    const template = await ctx.db.get(args.templateId)
    if (!template || template.userId !== user._id) {
      throw new Error("Template not found")
    }

    const { templateId, ...updates } = args
    const patch: Record<string, any> = {}
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        patch[key] = value
      }
    }
    if (typeof patch.name === "string") {
      patch.name = patch.name.trim()
      if (!patch.name) {
        throw new Error("Template name is required")
      }
    }
    patch.updatedAt = Date.now()

    await ctx.db.patch(templateId, patch)
    return templateId
  },
})

export const remove = mutation({
  args: { templateId: v.id("templates") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    const template = await ctx.db.get(args.templateId)
    if (!template || template.userId !== user._id) {
      throw new Error("Template not found")
    }

    await ctx.db.delete(args.templateId)
  },
})
