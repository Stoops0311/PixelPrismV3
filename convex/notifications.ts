import { query, mutation, internalMutation } from "./_generated/server"
import { v } from "convex/values"

// ============================================================
// AUTH HELPER
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

// ============================================================
// VALIDATORS
// ============================================================

const notificationType = v.union(
  v.literal("post_published"),
  v.literal("post_engagement"),
  v.literal("credits_received"),
  v.literal("credits_low")
)

// ============================================================
// INTERNAL MUTATIONS (called from other backend functions)
// ============================================================

export const createInternal = internalMutation({
  args: {
    userId: v.id("users"),
    type: notificationType,
    title: v.string(),
    body: v.string(),
    icon: v.optional(v.string()),
    href: v.optional(v.string()),
    brandId: v.optional(v.id("brands")),
    relatedId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      read: false,
      createdAt: Date.now(),
    })
  },
})

// ============================================================
// PUBLIC QUERIES
// ============================================================

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    const limit = Math.min(args.limit ?? 20, 50)

    return await ctx.db
      .query("notifications")
      .withIndex("by_user_and_created", (q: any) => q.eq("userId", user._id))
      .order("desc")
      .take(limit)
  },
})

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q: any) =>
        q.eq("userId", user._id).eq("read", false)
      )
      .collect()

    return unread.length
  },
})

// ============================================================
// PUBLIC MUTATIONS
// ============================================================

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    const notif = await ctx.db.get(args.notificationId)
    if (!notif || notif.userId !== user._id) return
    if (notif.read) return

    await ctx.db.patch(args.notificationId, {
      read: true,
      readAt: Date.now(),
    })
  },
})

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q: any) =>
        q.eq("userId", user._id).eq("read", false)
      )
      .collect()

    const now = Date.now()
    await Promise.all(
      unread.map((n) =>
        ctx.db.patch(n._id, { read: true, readAt: now })
      )
    )
  },
})
