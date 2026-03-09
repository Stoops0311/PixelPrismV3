import { internalMutation, internalQuery } from "./_generated/server"
import { v } from "convex/values"

// Check if webhook event was already processed
export const checkProcessed = internalQuery({
  args: { eventId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("webhookLogs")
      .withIndex("by_event_id", (q) => q.eq("eventId", args.eventId))
      .unique()
  },
})

// Log a processed webhook event
export const logProcessed = internalMutation({
  args: {
    eventId: v.string(),
    eventType: v.string(),
    source: v.union(
      v.literal("clerk"),
      v.literal("polar"),
      v.literal("postforme")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("webhookLogs", {
      eventId: args.eventId,
      eventType: args.eventType,
      source: args.source,
      processedAt: Date.now(),
    })
  },
})
