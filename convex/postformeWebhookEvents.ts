import { internalMutation } from "./_generated/server"
import { internal } from "./_generated/api"
import { v } from "convex/values"

function toSupportedPlatform(
  value: unknown
): "instagram" | "facebook" | "linkedin" | "pinterest" | null {
  const raw = String(value || "").toLowerCase()
  if (raw === "instagram") return "instagram"
  if (raw === "facebook") return "facebook"
  if (raw === "linkedin") return "linkedin"
  if (raw === "pinterest") return "pinterest"
  return null
}

export const processEvent = internalMutation({
  args: {
    eventId: v.string(),
    eventType: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const alreadyProcessed = await ctx.db
      .query("webhookLogs")
      .withIndex("by_event_id", (q) => q.eq("eventId", args.eventId))
      .unique()

    if (alreadyProcessed) return

    const data = args.data || {}

    if (args.eventType === "social.post.result.created") {
      const postForMePostId = String(
        data.post_id || data.social_post_id || data.post?.id || ""
      )
      const platform = toSupportedPlatform(data.platform || data.social_account?.platform)
      const success = Boolean(data.success)
      const platformPostId = data.platform_data?.id || data.platform_post_id || undefined
      const platformPostUrl = data.platform_data?.url || data.platform_post_url || undefined
      const publishedAt = data.published_at
        ? Date.parse(String(data.published_at))
        : undefined
      const errorMessage = data.error?.message || data.error || undefined

      if (postForMePostId && platform) {
        await ctx.runMutation(internal.scheduledPosts.applyPostResultInternal, {
          postForMePostId,
          platform,
          success,
          platformPostId,
          platformPostUrl,
          publishedAt,
          errorMessage,
        })
      }
    }

    if (args.eventType === "social.post.updated") {
      const postForMePostId = String(data.id || data.post_id || data.social_post_id || "")
      const statusRaw = String(data.status || "").toLowerCase()
      const status =
        statusRaw === "processed"
          ? "published"
          : statusRaw === "processing"
            ? "publishing"
            : statusRaw === "failed"
              ? "failed"
              : "scheduled"

      if (postForMePostId) {
        await ctx.runMutation(internal.scheduledPosts.markPostStatusByPostForMeIdInternal, {
          postForMePostId,
          status,
          publishedAt: data.published_at ? Date.parse(String(data.published_at)) : undefined,
          error: data.error?.message || data.error || undefined,
        })
      }
    }

    if (args.eventType === "social.account.updated") {
      const statusRaw = String(data.status || "").toLowerCase()
      if (statusRaw === "disconnected") {
        const accountId = String(data.id || data.social_account_id || "")
        if (accountId) {
          await ctx.runMutation(internal.socialAccounts.markDisconnectedByPostForMeIdInternal, {
            postForMeAccountId: accountId,
            reason: data.disconnect_reason || "Disconnected by provider",
          })
        }
      }
    }

    await ctx.runMutation(internal.webhookLogs.logProcessed, {
      eventId: args.eventId,
      eventType: args.eventType,
      source: "postforme",
    })
  },
})
