"use node"

import { action, internalAction } from "./_generated/server"
import { api, internal } from "./_generated/api"
import { v } from "convex/values"

const POSTFORME_BASE = process.env.POSTFORME_API_BASE || "https://api.postforme.dev/v1"

type SupportedPlatform = "instagram" | "facebook" | "linkedin" | "pinterest"
type ConnectionType =
  | "instagram_direct"
  | "instagram_facebook"
  | "linkedin_personal"
  | "linkedin_organization"

function normalizePlatform(platform: string): SupportedPlatform | null {
  if (platform === "instagram") return "instagram"
  if (platform === "facebook") return "facebook"
  if (platform === "linkedin") return "linkedin"
  if (platform === "pinterest") return "pinterest"
  return null
}

function numberFromUnknown(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function toIsoFromMillis(ms?: number): string | undefined {
  if (!ms) return undefined
  return new Date(ms).toISOString()
}

function composeCaption(caption: string, hashtags?: string[]) {
  const normalized = (hashtags || [])
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))

  if (normalized.length === 0) {
    return caption
  }

  return `${caption}\n\n${normalized.join(" ")}`
}

function toDayString(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10)
}

function periodCutoffTs(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000
}

function percentChange(current: number, baseline: number): number | undefined {
  if (baseline <= 0) {
    return undefined
  }
  return ((current - baseline) / baseline) * 100
}

async function postForMeRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const apiKey = process.env.POSTFORME_API_KEY
  if (!apiKey) throw new Error("POSTFORME_API_KEY is not configured")

  const response = await fetch(`${POSTFORME_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "")
    throw new Error(`PostForMe API error (${response.status}): ${bodyText || response.statusText}`)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

function inferExtensionFromContentType(contentType: string) {
  const type = contentType.toLowerCase()
  if (type.includes("image/jpeg") || type.includes("image/jpg")) return "jpg"
  if (type.includes("image/png")) return "png"
  if (type.includes("image/webp")) return "webp"
  if (type.includes("image/gif")) return "gif"
  if (type.includes("video/mp4")) return "mp4"
  if (type.includes("video/quicktime")) return "mov"
  return "bin"
}

async function uploadMediaFromUrlToPostForMe(sourceUrl: string): Promise<string> {
  const sourceResponse = await fetch(sourceUrl)
  if (!sourceResponse.ok) {
    throw new Error(
      `Failed to fetch source media URL (${sourceResponse.status})`
    )
  }

  const contentType =
    sourceResponse.headers.get("content-type") || "application/octet-stream"
  const sourceBytes = await sourceResponse.arrayBuffer()
  const byteLength = sourceBytes.byteLength
  if (byteLength === 0) {
    throw new Error("Source media is empty")
  }

  const extension = inferExtensionFromContentType(contentType)
  const payload = await postForMeRequest<{
    uploadUrl?: string
    upload_url?: string
    mediaUrl?: string
    media_url?: string
  }>("/media/create-upload-url", {
    method: "POST",
    body: JSON.stringify({
      filename: `pixelprism-${Date.now()}.${extension}`,
      contentType,
      size: byteLength,
    }),
  })

  const uploadUrl = payload.uploadUrl || payload.upload_url
  const mediaUrl = payload.mediaUrl || payload.media_url

  if (!uploadUrl || !mediaUrl) {
    throw new Error("PostForMe media upload URL creation failed")
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: sourceBytes,
    headers: {
      "Content-Type": contentType,
    },
  })

  if (!uploadResponse.ok) {
    throw new Error(
      `Uploading media to PostForMe failed (${uploadResponse.status})`
    )
  }

  return mediaUrl
}

async function fetchInstagramFollowersFromGraph(
  accessToken?: string
): Promise<number | undefined> {
  if (!accessToken) return undefined

  try {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username,followers_count,media_count&access_token=${encodeURIComponent(
        accessToken
      )}`
    )
    if (!response.ok) return undefined

    const payload = (await response.json()) as { followers_count?: unknown }
    const followers = numberFromUnknown(payload.followers_count)
    return Number.isFinite(followers) ? followers : undefined
  } catch {
    return undefined
  }
}

function firstFiniteNumber(...values: unknown[]): number | undefined {
  for (const value of values) {
    if (value === null || value === undefined) continue
    const parsed = numberFromUnknown(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

async function fetchAllSocialFeedRows(
  socialAccountId: string,
  limit = 100,
  maxPages = 20
): Promise<any[]> {
  const rows: any[] = []
  let cursor: string | undefined

  for (let page = 0; page < maxPages; page += 1) {
    const query = new URLSearchParams()
    query.set("limit", String(limit))
    query.append("expand[]", "metrics")
    if (cursor) query.set("cursor", cursor)

    const response = await postForMeRequest<any>(
      `/social-account-feeds/${socialAccountId}?${query.toString()}`
    )

    const pageRows: any[] = response?.data || []
    rows.push(...pageRows)

    const hasMore = Boolean(response?.meta?.has_more)
    if (!hasMore) break

    const nextUrl = String(response?.meta?.next || "")
    if (!nextUrl) break

    try {
      const nextCursor = new URL(nextUrl).searchParams.get("cursor")
      if (!nextCursor || nextCursor === cursor) break
      cursor = nextCursor
    } catch {
      break
    }
  }

  return rows
}

export const createAuthUrl = action({
  args: {
    brandId: v.id("brands"),
    brandSlug: v.string(),
    platform: v.union(
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("linkedin"),
      v.literal("pinterest")
    ),
    connectionType: v.optional(
      v.union(
        v.literal("instagram_direct"),
        v.literal("instagram_facebook"),
        v.literal("linkedin_personal"),
        v.literal("linkedin_organization")
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.current, {})
    if (!user) throw new Error("Not authenticated")

    const brand = await ctx.runQuery(api.brands.getById, { brandId: args.brandId })
    if (!brand) throw new Error("Brand not found")

    const existing = await ctx.runQuery(api.socialAccounts.listByBrand, {
      brandId: args.brandId,
    })

    const connectedCount = existing.filter((a: any) => a.status === "connected").length
    const maxAllowed =
      user.subscriptionTier === "free"
        ? Math.max(1, user.maxSocialAccounts)
        : user.maxSocialAccounts

    if (connectedCount >= maxAllowed) {
      throw new Error(
        `Social account limit reached. Your plan allows ${maxAllowed} account(s).`
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const allowRedirectOverride =
      process.env.POSTFORME_ALLOW_REDIRECT_OVERRIDE === "true"

    const state = Buffer.from(
      JSON.stringify({
        brandId: args.brandId,
        brandSlug: args.brandSlug,
        connectionType: args.connectionType,
      }),
      "utf8"
    ).toString("base64url")

    const platform_data: Record<string, unknown> = {}
    if (args.platform === "instagram" && args.connectionType) {
      platform_data.instagram = {
        connection_type:
          args.connectionType === "instagram_facebook" ? "facebook" : "instagram",
      }
    }
    if (args.platform === "linkedin" && args.connectionType) {
      platform_data.linkedin = {
        connection_type:
          args.connectionType === "linkedin_organization" ? "organization" : "personal",
      }
    }

    const external_id = `pixelprism:${args.brandId}`

    const requestBody: Record<string, unknown> = {
      platform: args.platform,
      external_id,
      permissions: ["posts", "feeds"],
      platform_data,
      state,
    }

    if (allowRedirectOverride) {
      requestBody.redirect_url_override = `${appUrl}/dashboard/connect-callback`
    }

    const response = await postForMeRequest<{ url: string }>("/social-accounts/auth-url", {
      method: "POST",
      body: JSON.stringify(requestBody),
    })

    return response.url
  },
})

export const syncAccountsForBrand = action({
  args: {
    brandId: v.id("brands"),
    preferredConnectionType: v.optional(
      v.union(
        v.literal("instagram_direct"),
        v.literal("instagram_facebook"),
        v.literal("linkedin_personal"),
        v.literal("linkedin_organization")
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.current, {})
    if (!user) throw new Error("Not authenticated")

    const externalId = `pixelprism:${args.brandId}`
    const encoded = encodeURIComponent(externalId)
    const response = await postForMeRequest<{ data?: any[]; items?: any[] }>(
      `/social-accounts?external_id[]=${encoded}&limit=100`
    )

    const rows = response.data || response.items || []

    let synced = 0
    for (const row of rows) {
      const platform = normalizePlatform(String(row.platform || ""))
      if (!platform) continue

      const postForMeAccountId =
        String(row.id || row.account_id || row.social_account_id || "").trim()
      if (!postForMeAccountId) continue

      let connectionType: ConnectionType | undefined
      if (platform === "instagram") {
        connectionType =
          args.preferredConnectionType === "instagram_facebook"
            ? "instagram_facebook"
            : "instagram_direct"
      }
      if (platform === "linkedin") {
        connectionType =
          args.preferredConnectionType === "linkedin_organization"
            ? "linkedin_organization"
            : "linkedin_personal"
      }

      await ctx.runMutation(internal.socialAccounts.upsertFromPostForMeInternal, {
        userId: user._id,
        brandId: args.brandId,
        postForMeAccountId,
        platform,
        connectionType,
        username: row.username || undefined,
        displayName: row.name || row.display_name || undefined,
        profilePhotoUrl: row.profile_photo_url || row.avatar_url || undefined,
        externalId: row.external_id || undefined,
        metadata: row.metadata || undefined,
        followerCount: numberFromUnknown(
          row.metrics?.followers ?? row.followers ?? row.follower_count ?? 0
        ),
      })

      synced += 1
    }

    return { synced }
  },
})

export const publishScheduledPost = internalAction({
  args: { scheduledPostId: v.id("scheduledPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.runQuery(internal.scheduledPosts.getForPublishingInternal, {
      scheduledPostId: args.scheduledPostId,
    })
    if (!post) return
    if (post.status === "draft" || post.status === "published") return

    const accounts = await ctx.runQuery(internal.socialAccounts.listByIdsInternal, {
      socialAccountIds: post.socialAccountIds,
    })

    const connectedAccounts = accounts.filter((a: any) => a.status === "connected")
    if (connectedAccounts.length === 0) {
      await ctx.runMutation(internal.scheduledPosts.markScheduleFailedInternal, {
        scheduledPostId: args.scheduledPostId,
        error: "No connected accounts available for this post",
      })
      return
    }

    const socialAccounts = connectedAccounts.map((a: any) => a.postForMeAccountId)
    const outboundCaption = composeCaption(post.caption, post.hashtags)

    try {
      let media: Array<{ url: string }> | undefined
      let activeMediaUrl: string | undefined
      if (post.imageUrl) {
        const hostedMediaUrl =
          post.postForMeMediaUrl ||
          (await uploadMediaFromUrlToPostForMe(post.imageUrl))

        if (!post.postForMeMediaUrl) {
          await ctx.runMutation(internal.scheduledPosts.setPostForMeMediaUrlInternal, {
            scheduledPostId: args.scheduledPostId,
            postForMeMediaUrl: hostedMediaUrl,
          })
        }

        activeMediaUrl = hostedMediaUrl
        media = [{ url: hostedMediaUrl }]
      }

      let response: any
      try {
        response = await postForMeRequest<any>("/social-posts", {
          method: "POST",
          body: JSON.stringify({
            caption: outboundCaption,
            social_accounts: socialAccounts,
            scheduled_at: toIsoFromMillis(post.scheduledFor),
            media,
          }),
        })
      } catch (initialError: any) {
        const message = String(initialError?.message || "")
        const shouldRetryMedia =
          !!post.imageUrl &&
          message.toLowerCase().includes("media") &&
          message.toLowerCase().includes("failed")

        if (!shouldRetryMedia) {
          throw initialError
        }

        if (!post.imageUrl) {
          throw initialError
        }

        const freshMediaUrl = await uploadMediaFromUrlToPostForMe(post.imageUrl)
        if (freshMediaUrl !== activeMediaUrl) {
          await ctx.runMutation(internal.scheduledPosts.setPostForMeMediaUrlInternal, {
            scheduledPostId: args.scheduledPostId,
            postForMeMediaUrl: freshMediaUrl,
          })
        }

        response = await postForMeRequest<any>("/social-posts", {
          method: "POST",
          body: JSON.stringify({
            caption: outboundCaption,
            social_accounts: socialAccounts,
            scheduled_at: toIsoFromMillis(post.scheduledFor),
            media: [{ url: freshMediaUrl }],
          }),
        })
      }

      const postForMePostId = String(
        response?.id || response?.post_id || response?.social_post_id || ""
      )
      if (!postForMePostId) {
        throw new Error("PostForMe did not return a post id")
      }

      await ctx.runMutation(internal.scheduledPosts.markPublishingInternal, {
        scheduledPostId: args.scheduledPostId,
        postForMePostId,
      })
    } catch (error: any) {
      await ctx.runMutation(internal.scheduledPosts.markScheduleFailedInternal, {
        scheduledPostId: args.scheduledPostId,
        error: error?.message || "Failed to schedule post",
      })
    }
  },
})

export const cacheMediaForScheduledPost = internalAction({
  args: { scheduledPostId: v.id("scheduledPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.runQuery(internal.scheduledPosts.getForPublishingInternal, {
      scheduledPostId: args.scheduledPostId,
    })

    if (!post?.imageUrl) return
    if (post.postForMeMediaUrl) return

    try {
      const hostedMediaUrl = await uploadMediaFromUrlToPostForMe(post.imageUrl)
      await ctx.runMutation(internal.scheduledPosts.setPostForMeMediaUrlInternal, {
        scheduledPostId: args.scheduledPostId,
        postForMeMediaUrl: hostedMediaUrl,
      })
    } catch {
      // Best-effort pre-upload. Publish step retries media upload if needed.
    }
  },
})

export const syncBrandAnalytics = internalAction({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const accounts = await ctx.runQuery(internal.socialAccounts.listConnectedByBrandInternal, {
      brandId: args.brandId,
    })

    const aggregateRows = await ctx.runQuery(internal.analytics.listFollowerGrowthByBrandInternal, {
      brandId: args.brandId,
      platform: "aggregate",
    })

    const upsertPeriodOverview = async (
      period: "7d" | "30d" | "90d" | "all",
      rows: Array<{ publishedAt: number; engagements: number; reach: number; preview: string; platform: SupportedPlatform }>,
      followerTotal: number,
      syncStatus: "ok" | "error",
      syncError?: string
    ) => {
      const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "all" ? null : 30
      const cutoff = days === null ? 0 : periodCutoffTs(days)
      const periodRows = rows.filter((row) => row.publishedAt >= cutoff)

      const totalReach = periodRows.reduce((sum, row) => sum + row.reach, 0)
      const totalEngagements = periodRows.reduce((sum, row) => sum + row.engagements, 0)
      const postsPublished = periodRows.length
      const engagementRate = totalReach > 0 ? (totalEngagements / totalReach) * 100 : 0

      const bestPost = periodRows
        .slice()
        .sort((a, b) => b.engagements - a.engagements)[0]

      const cutoffDate = days === null ? "0000-00-00" : toDayString(cutoff)
      const followerRowsForPeriod = aggregateRows.filter((row) => row.date >= cutoffDate)
      const baseline =
        days === null
          ? aggregateRows[0]?.followerCount ?? followerTotal
          : followerRowsForPeriod[0]?.followerCount ?? followerTotal
      const followerChange = followerTotal - baseline

      await ctx.runMutation(internal.analytics.upsertOverviewInternal, {
        brandId: args.brandId,
        period,
        followerCount: followerTotal,
        followerChange,
        followerChangePercent: percentChange(followerTotal, baseline),
        engagementRate,
        totalReach,
        postsPublished,
        bestPostPreview: bestPost?.preview,
        bestPostPlatform: bestPost?.platform,
        bestPostEngagements: bestPost?.engagements,
        syncStatus,
        syncError,
      })
    }

    if (accounts.length === 0) {
      await upsertPeriodOverview("7d", [], 0, "ok")
      await upsertPeriodOverview("30d", [], 0, "ok")
      await upsertPeriodOverview("90d", [], 0, "ok")
      await upsertPeriodOverview("all", [], 0, "ok")

      await ctx.runMutation(internal.brands.updateAnalyticsSnapshot, {
        brandId: args.brandId,
        totalFollowers: 0,
        avgEngagementRate: 0,
        lastActiveAt: Date.now(),
      })
      return
    }

    type ContentRow = {
      postForMePostId: string
      platform: SupportedPlatform
      preview: string
      imageUrl?: string
      engagements: number
      reach: number
      engagementRate?: number
      likes?: number
      comments?: number
      shares?: number
      saves?: number
      publishedAt: number
    }

    const followerTotalsByPlatform: Record<SupportedPlatform, number> = {
      instagram: 0,
      facebook: 0,
      linkedin: 0,
      pinterest: 0,
    }
    const topRows: ContentRow[] = []
    const now = Date.now()
    const today = toDayString(now)

    let hadAnyFeedSuccess = false
    let hadAnyFeedError = false

    const parseFollowerCount = (
      account: any,
      accountSnapshot: any,
      instagramGraphFollowers?: number
    ): number | undefined => {
      return firstFiniteNumber(
        instagramGraphFollowers,
        accountSnapshot?.metrics?.followers,
        accountSnapshot?.metrics?.followers_count,
        accountSnapshot?.metrics?.follower_count,
        accountSnapshot?.follower_count,
        accountSnapshot?.followers,
        accountSnapshot?.data?.metrics?.followers,
        account.followerCount
      )
    }

    for (const account of accounts as any[]) {
      let accountSnapshot: any = null
      let items: any[] = []
      let accountError: string | undefined

      try {
        accountSnapshot = await postForMeRequest<any>(
          `/social-accounts/${account.postForMeAccountId}?expand[]=metrics`
        )
      } catch {
        accountSnapshot = null
      }

      try {
        items = await fetchAllSocialFeedRows(account.postForMeAccountId, 100, 20)
      } catch {
        hadAnyFeedError = true
        accountError = "Failed to sync social feed from PostForMe"
      }

      const instagramGraphFollowers =
        account.platform === "instagram"
          ? await fetchInstagramFollowersFromGraph(accountSnapshot?.access_token)
          : undefined

      const accountFollowers = parseFollowerCount(
        account,
        accountSnapshot,
        instagramGraphFollowers
      )

      if (account.platform in followerTotalsByPlatform) {
        followerTotalsByPlatform[account.platform as SupportedPlatform] +=
          accountFollowers ?? numberFromUnknown(account.followerCount)
      }

      const accountEngagementRate = firstFiniteNumber(
        accountSnapshot?.metrics?.engagement_rate,
        accountSnapshot?.metrics?.engagementRate,
        account.engagementRate
      )

      const accountHadSuccess =
        items.length > 0 || accountSnapshot !== null || instagramGraphFollowers !== undefined

      if (accountHadSuccess) {
        hadAnyFeedSuccess = true
      } else {
        hadAnyFeedError = true
      }

      await ctx.runMutation(internal.socialAccounts.updateMetricsInternal, {
        socialAccountId: account._id,
        followerCount: accountFollowers ?? account.followerCount,
        engagementRate: accountEngagementRate,
        lastSyncedAt: now,
        lastSyncStatus: accountHadSuccess ? "ok" : "error",
        lastSyncError: accountHadSuccess ? undefined : accountError || "Failed to sync account",
      })

      for (const item of items) {
        const metrics = item.metrics || {}
        const engagements = numberFromUnknown(
          metrics.engagements ?? metrics.engagement ?? metrics.total_engagements
        )
        const reach = numberFromUnknown(metrics.reach ?? metrics.impressions)
        const likes = numberFromUnknown(metrics.likes)
        const comments = numberFromUnknown(metrics.comments)
        const shares = numberFromUnknown(metrics.shares)
        const saves = numberFromUnknown(metrics.saves)

        const platform = normalizePlatform(String(item.platform || account.platform || ""))
        if (!platform) continue

        topRows.push({
          postForMePostId: String(item.external_post_id || item.social_post_id || item.id || ""),
          platform,
          preview: String(item.caption || item.text || "Post"),
          imageUrl: item.media?.[0]?.url || undefined,
          engagements,
          reach,
          engagementRate: reach > 0 ? (engagements / reach) * 100 : undefined,
          likes,
          comments,
          shares,
          saves,
          publishedAt: item.posted_at ? Date.parse(item.posted_at) : now,
        })
      }
    }

    const followerCount = Object.values(followerTotalsByPlatform).reduce(
      (sum, value) => sum + value,
      0
    )

    for (const platform of Object.keys(followerTotalsByPlatform) as SupportedPlatform[]) {
      const platformRows = await ctx.runQuery(internal.analytics.listFollowerGrowthByBrandInternal, {
        brandId: args.brandId,
        platform,
      })
      const previous = platformRows.length > 0 ? platformRows[platformRows.length - 1].followerCount : 0

      await ctx.runMutation(internal.analytics.upsertFollowerPointInternal, {
        brandId: args.brandId,
        socialAccountId: undefined,
        platform,
        date: today,
        followerCount: followerTotalsByPlatform[platform],
        changeFromPrevious: followerTotalsByPlatform[platform] - previous,
      })
    }

    const previousAggregate =
      aggregateRows.length > 0 ? aggregateRows[aggregateRows.length - 1].followerCount : 0

    topRows.sort((a, b) => b.engagements - a.engagements)

    await ctx.runMutation(internal.analytics.upsertFollowerPointInternal, {
      brandId: args.brandId,
      socialAccountId: undefined,
      platform: "aggregate",
      date: today,
      followerCount,
      changeFromPrevious: followerCount - previousAggregate,
    })

    await ctx.runMutation(internal.analytics.replaceTopContentInternal, {
      brandId: args.brandId,
      rows: topRows.slice(0, 25),
    })

    const syncStatus: "ok" | "error" = hadAnyFeedSuccess ? "ok" : "error"
    const syncError = hadAnyFeedSuccess
      ? hadAnyFeedError
        ? "Some connected accounts failed to sync."
        : undefined
      : "Failed to sync analytics from PostForMe for all connected accounts."

    await upsertPeriodOverview("7d", topRows, followerCount, syncStatus, syncError)
    await upsertPeriodOverview("30d", topRows, followerCount, syncStatus, syncError)
    await upsertPeriodOverview("90d", topRows, followerCount, syncStatus, syncError)
    await upsertPeriodOverview("all", topRows, followerCount, syncStatus, syncError)

    const overallReach = topRows.reduce((sum, row) => sum + row.reach, 0)
    const overallEngagement = topRows.reduce((sum, row) => sum + row.engagements, 0)
    const overallEngagementRate =
      overallReach > 0 ? (overallEngagement / overallReach) * 100 : 0

    await ctx.runMutation(internal.brands.updateAnalyticsSnapshot, {
      brandId: args.brandId,
      totalFollowers: followerCount,
      avgEngagementRate: overallEngagementRate,
      lastActiveAt: now,
    })

  },
})
