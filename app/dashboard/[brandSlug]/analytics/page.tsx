// @ts-nocheck — Convex mock: remove when restoring real Convex (see lib/convex-mock.ts)
"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useMutation, useQuery } from "@/lib/convex-mock"
import { api } from "@/convex/_generated/api"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InstagramIcon,
  Facebook02Icon,
  Link04Icon,
  AiChat02Icon,
  AnalyticsUpIcon,
  Analytics01Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DS2StatCard } from "@/components/ds2/stat-card"
import { DS2AreaChart } from "@/components/ds2/chart-area"
import { DS2BarChart } from "@/components/ds2/chart-bar"
import { DS2DataTable } from "@/components/ds2/data-table"
import { DS2EmptyContainer } from "@/components/ds2/empty-container"
import { DS2Spinner } from "@/components/ds2/spinner"
import { MobileStatStrip } from "@/components/ds2/mobile/mobile-stat-strip"
import { MobileAreaChart, MobileBarChart } from "@/components/ds2/mobile/mobile-chart"
import { MobileDataCards } from "@/components/ds2/mobile/mobile-data-cards"
import { showError, showSuccess } from "@/components/ds2/toast"
import type { DS2Column } from "@/components/ds2/data-table"
import type { ChartConfig } from "@/components/ui/chart"
import type { TopContent } from "@/types/dashboard"
import { format } from "date-fns"

// ── Platform Helpers ──────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, { icon: typeof InstagramIcon; label: string }> = {
  instagram: { icon: InstagramIcon, label: "Instagram" },
  facebook: { icon: Facebook02Icon, label: "Facebook" },
  linkedin: { icon: Link04Icon, label: "LinkedIn" },
  pinterest: { icon: Link04Icon, label: "Pinterest" },
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#e8956a",
  facebook: "#64dcf4",
  linkedin: "#f4b964",
  pinterest: "#f4d494",
}

// ── HeadlineMetric (page-local) ───────────────────────────────────────────

function HeadlineMetric({
  change,
  changePercent,
  totalFollowers,
}: {
  change: number
  changePercent?: number
  totalFollowers: number
}) {
  return (
    <div className="flex items-end gap-6 flex-wrap">
      <div>
        <span className="sb-caption" style={{ color: "#6d8d9f", display: "block", marginBottom: 4 }}>
          total followers
        </span>
        <span className="sb-data" style={{ color: "#eaeef1", display: "block", marginBottom: 10 }}>
          {totalFollowers.toLocaleString()}
        </span>
        <span
          className="sb-counter-roll"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: 36,
            color: "#f4b964",
            lineHeight: 1.1,
            display: "block",
          }}
        >
          +{change.toLocaleString()}
        </span>
        <span className="sb-body" style={{ color: "#6d8d9f", marginTop: 4, display: "block" }}>
          followers this period
        </span>
      </div>
      <span
        className="sb-data inline-flex items-center gap-1.5 sb-counter-roll"
        style={{ color: "#f4b964", marginBottom: 6 }}
      >
        {changePercent !== undefined ? (
          <>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <polygon points="5,1 9,7 1,7" />
            </svg>
            {changePercent > 0 ? "+" : ""}
            {changePercent}%
          </>
        ) : (
          "No baseline"
        )}
      </span>
    </div>
  )
}

// ── AIAnalyticsCard (page-local) ──────────────────────────────────────────

function AIAnalyticsCard({ insights }: { insights: { id: string; text: string }[] }) {
  return (
    <Card>
      <CardContent>
        <div
          style={{
            borderLeft: "4px solid #f4b964",
            paddingLeft: 20,
          }}
        >
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-5">
            <div
              style={{
                width: 40,
                height: 40,
                background: "rgba(244,185,100,0.10)",
                border: "1px solid rgba(244,185,100,0.20)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HugeiconsIcon icon={AiChat02Icon} size={20} color="#f4b964" />
            </div>
            <h4 className="sb-h4" style={{ color: "#eaeef1" }}>
              AI Analysis
            </h4>
          </div>

          {/* Bullet Points */}
          <ul className="space-y-3">
            {insights.map((insight) => (
              <li key={insight.id} className="flex items-start gap-3">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: "#f4b964",
                    flexShrink: 0,
                    marginTop: 7,
                  }}
                />
                <span className="sb-body-sm" style={{ color: "#d4dce2" }}>
                  {insight.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Table Columns ─────────────────────────────────────────────────────────

const topContentColumns: DS2Column<TopContent>[] = [
  {
    key: "platform",
    label: "Platform",
    render: (val: string) => {
      const p = PLATFORM_ICONS[val]
      if (!p) return val
      return (
        <HugeiconsIcon
          icon={p.icon}
          size={18}
          color={PLATFORM_COLORS[val] ?? "#6d8d9f"}
        />
      )
    },
  },
  {
    key: "preview",
    label: "Content",
    render: (val: string) => (
      <span
        className="sb-body-sm"
        style={{
          color: "#d4dce2",
          display: "block",
          maxWidth: 200,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {val}
      </span>
    ),
  },
  {
    key: "engagements",
    label: "Engagements",
    align: "right" as const,
    isData: true,
    render: (val: number) => (
      <span className="sb-data" style={{ color: "#eaeef1" }}>
        {val.toLocaleString()}
      </span>
    ),
  },
  {
    key: "reach",
    label: "Reach",
    align: "right" as const,
    isData: true,
    render: (val: number) => (
      <span className="sb-data" style={{ color: "#eaeef1" }}>
        {val.toLocaleString()}
      </span>
    ),
  },
  {
    key: "publishedAt",
    label: "Date",
    render: (val: string) => (
      <span className="sb-data" style={{ color: "#6d8d9f", fontSize: 12, fontWeight: 500 }}>
        {format(new Date(val), "MMM d")}
      </span>
    ),
  },
]

// ── Page ──────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const params = useParams()
  const brandSlug = params.brandSlug as string
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [platformFilter, setPlatformFilter] = useState<
    "all" | "instagram" | "facebook" | "linkedin" | "pinterest"
  >("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const brand = useQuery(api.brands.getBySlug, { slug: brandSlug })
  const connectedAccounts = useQuery(
    api.socialAccounts.listConnectedByBrand,
    brand ? { brandId: brand._id } : "skip"
  )
  const overview = useQuery(
    api.analytics.getOverview,
    brand ? { brandId: brand._id, period: dateRange } : "skip"
  )
  const followerGrowth = useQuery(
    api.analytics.getFollowerGrowth,
    brand ? { brandId: brand._id, period: dateRange } : "skip"
  )
  const topContentRows = useQuery(
    api.analytics.getTopContent,
    brand ? { brandId: brand._id, limit: 10 } : "skip"
  )
  const refreshAnalytics = useMutation(api.analytics.refreshForBrand)

  const rangeCutoffTs = useMemo(() => {
    if (dateRange === "all") return 0
    const days = dateRange === "7d" ? 7 : dateRange === "90d" ? 90 : 30
    return Date.now() - days * 24 * 60 * 60 * 1000
  }, [dateRange])

  // ── Data ──────────────────────────────────────────────────────────────
  const connectedPlatforms = useMemo(() => {
    const fromAccounts = new Set<string>((connectedAccounts ?? []).map((a) => a.platform))
    if (fromAccounts.size > 0) return Array.from(fromAccounts)

    const fromTop = new Set<string>((topContentRows ?? []).map((row) => row.platform))
    if (fromTop.size > 0) return Array.from(fromTop)

    return ["instagram", "facebook", "linkedin", "pinterest"]
  }, [connectedAccounts, topContentRows])

  const audienceGrowth = overview
    ? {
        change: overview.followerChange,
        changePercent:
          typeof overview.followerChangePercent === "number"
            ? Math.round(overview.followerChangePercent)
            : undefined,
      }
    : null

  const stats = overview
    ? {
        engagementRate: {
          value: `${(overview.engagementRate || 0).toFixed(1)}%`,
          trend:
            overview.syncStatus === "error"
              ? "data sync issue"
              : `updated ${new Date(overview.lastSyncedAt).toLocaleTimeString()}`,
          direction: overview.syncStatus === "error" ? ("down" as const) : ("neutral" as const),
        },
        totalReach: {
          value: (overview.totalReach || 0).toLocaleString(),
          trend: dateRange === "all" ? "all time" : `${dateRange} window`,
          direction: "neutral" as const,
        },
        postsPublished: {
          value: overview.postsPublished.toLocaleString(),
          trend: dateRange === "all" ? "all time" : `${dateRange} window`,
          direction: "neutral" as const,
        },
        totalFollowers: {
          value: overview.followerCount.toLocaleString(),
          trend: "connected accounts total",
          direction: "neutral" as const,
        },
        bestPost: {
          value: (overview.bestPostEngagements || 0).toLocaleString(),
          trend: "top engagement",
          direction: "neutral" as const,
          preview: overview.bestPostPreview || "No top post yet",
          platform:
            overview.bestPostPlatform === "facebook" ||
            overview.bestPostPlatform === "linkedin" ||
            overview.bestPostPlatform === "pinterest"
              ? overview.bestPostPlatform
              : "instagram",
        },
      }
    : null

  const allGrowthData = useMemo(() => {
    if (!followerGrowth || followerGrowth.length === 0) return []

    const grouped = new Map<string, Record<string, number | string>>()
    for (const row of followerGrowth) {
      if (row.platform === "aggregate") continue
      const existing = grouped.get(row.date) || { date: row.date }
      existing[row.platform] = row.followerCount
      grouped.set(row.date, existing)
    }

    if (grouped.size > 0) {
      return Array.from(grouped.values()).sort((a, b) =>
        String(a.date) < String(b.date) ? -1 : 1
      )
    }

    return followerGrowth
      .filter((row) => row.platform === "aggregate")
      .map((row) => ({ date: row.date, instagram: row.followerCount }))
  }, [followerGrowth])

  const engagementData = useMemo(() => {
    const rows = (topContentRows ?? []).filter((row) =>
      dateRange === "all" ? true : row.publishedAt >= rangeCutoffTs
    )

    const likes = rows.reduce((sum, row) => sum + (row.likes || 0), 0)
    const comments = rows.reduce((sum, row) => sum + (row.comments || 0), 0)
    const shares = rows.reduce((sum, row) => sum + (row.shares || 0), 0)
    const saves = rows.reduce((sum, row) => sum + (row.saves || 0), 0)

    return [
      { type: "Likes", count: likes },
      { type: "Comments", count: comments },
      { type: "Shares", count: shares },
      { type: "Saves", count: saves },
    ]
  }, [dateRange, rangeCutoffTs, topContentRows])

  const topContent = useMemo(() => {
    if (!topContentRows || topContentRows.length === 0) return []
    const rows = topContentRows.filter((row) =>
      dateRange === "all" ? true : row.publishedAt >= rangeCutoffTs
    )

    return rows.map((row) => ({
      id: row._id,
      platform: row.platform,
      preview: row.preview,
      engagements: row.engagements,
      reach: row.reach,
      publishedAt: new Date(row.publishedAt).toISOString(),
    }))
  }, [dateRange, rangeCutoffTs, topContentRows])

  const insights = useMemo(() => {
    const lines: { id: string; text: string }[] = []
    if (overview?.syncError) {
      lines.push({ id: "sync", text: overview.syncError })
    }

    if (overview?.bestPostPreview) {
      lines.push({
        id: "best-post",
        text: `Top content this period is on ${overview.bestPostPlatform || "instagram"}. Replicate this format for next campaign.`,
      })
    }

    if ((overview?.engagementRate || 0) > 0) {
      lines.push({
        id: "engagement",
        text: `Average engagement rate is ${(overview?.engagementRate || 0).toFixed(1)}% over the ${dateRange === "all" ? "all-time" : dateRange} period.`,
      })
    }

    return lines
  }, [dateRange, overview])

  const growthData =
    dateRange === "all"
      ? allGrowthData
      : allGrowthData.slice(dateRange === "7d" ? -7 : dateRange === "30d" ? -30 : -90)

  // Build series from connected platforms, filtered by platform filter
  const activePlatforms =
    platformFilter === "all"
      ? connectedPlatforms
      : connectedPlatforms.filter((p) => p === platformFilter)

  const areaSeries = activePlatforms.map((p) => ({
    key: p,
    label: PLATFORM_ICONS[p]?.label ?? p,
    color: PLATFORM_COLORS[p] ?? "#f4b964",
  }))

  // Build chart config from active platforms
  const areaConfig: ChartConfig = {}
  for (const s of areaSeries) {
    areaConfig[s.key] = { label: s.label, color: s.color }
  }

  // Engagement chart config
  const engagementConfig: ChartConfig = {
    count: { label: "Engagements" },
  }

  const handleRefresh = async () => {
    if (!brand) return
    try {
      setIsRefreshing(true)
      await refreshAnalytics({ brandId: brand._id })
      showSuccess("Refresh queued", "Analytics refresh started in the background.")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to refresh analytics"
      showError("Refresh failed", message)
    } finally {
      setIsRefreshing(false)
    }
  }

  if (
    brand === undefined ||
    connectedAccounts === undefined ||
    overview === undefined ||
    followerGrowth === undefined ||
    topContentRows === undefined
  ) {
    return (
      <div className="flex items-center justify-center py-32">
        <DS2Spinner />
      </div>
    )
  }

  if (!brand) {
    return (
      <div>
        <h1 className="sb-h1" style={{ color: "#eaeef1" }}>
          Brand not found
        </h1>
        <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
          No brand matches the slug &ldquo;{brandSlug}&rdquo;.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-0 space-y-10 lg:space-y-32 py-4 lg:py-0">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 lg:gap-3 mb-2">
          <HugeiconsIcon icon={AnalyticsUpIcon} className="size-5 lg:size-6" color="#f4b964" />
          <h1 className="text-xl lg:text-[44px] font-bold" style={{ color: "#eaeef1", fontFamily: "'Neue Montreal', sans-serif" }}>
            Analytics
          </h1>
        </div>
        <p className="text-sm lg:text-base" style={{ color: "#6d8d9f", fontFamily: "'General Sans', sans-serif" }}>
          <span className="hidden lg:inline">Follower growth, engagement metrics, and content performance for{" "}
          <span style={{ color: "#d4dce2" }}>{brand.name}</span>.</span>
          <span className="lg:hidden">{brand.name} performance</span>
        </p>
      </div>

      {/* ── Headline Metric ────────────────────────────────────────────── */}
      {audienceGrowth && (
        <div key={dateRange + platformFilter + "headline"}>
          <HeadlineMetric
            change={audienceGrowth.change}
            changePercent={audienceGrowth.changePercent}
            totalFollowers={overview?.followerCount || 0}
          />
        </div>
      )}

      {/* ── Filter Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>Range</span>
          <ToggleGroup
          type="single"
          value={dateRange}
          onValueChange={(val) => {
            if (val) setDateRange(val as "7d" | "30d" | "90d" | "all")
          }}
        >
          <ToggleGroupItem value="7d">7d</ToggleGroupItem>
          <ToggleGroupItem value="30d">30d</ToggleGroupItem>
          <ToggleGroupItem value="90d">90d</ToggleGroupItem>
          <ToggleGroupItem value="all">All</ToggleGroupItem>
        </ToggleGroup>
        </div>

        <div className="flex items-center gap-2">
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>Platform</span>
          <ToggleGroup
          type="single"
          value={platformFilter}
          onValueChange={(val) => {
            if (val)
              setPlatformFilter(
                val as "all" | "instagram" | "facebook" | "linkedin" | "pinterest"
              )
          }}
        >
          <ToggleGroupItem value="all">All Platforms</ToggleGroupItem>
          {connectedPlatforms.map((p) => (
            <ToggleGroupItem key={p} value={p}>
              <HugeiconsIcon
                icon={PLATFORM_ICONS[p]?.icon ?? InstagramIcon}
                size={16}
              />
              <span className="ml-1.5 hidden sm:inline">
                {PLATFORM_ICONS[p]?.label ?? p}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        </div>

        <Button
          className="sb-btn-secondary"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Refreshing..." : "Refresh Analytics"}
        </Button>
      </div>

      {/* ── Primary Chart: Follower Growth ─────────────────────────────── */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
          Growth
        </p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>
          Follower Growth
        </h3>
        {!audienceGrowth ? (
          <DS2EmptyContainer minHeight="h-80">
            <div className="text-center space-y-4">
              <HugeiconsIcon icon={Analytics01Icon} size={40} color="#6d8d9f" />
              <div>
                <p className="sb-h4" style={{ color: "#d4dce2" }}>
                  No follower data available
                </p>
                <p className="sb-body-sm mt-2" style={{ color: "#6d8d9f" }}>
                  Connect a social account to see your follower growth over time.
                </p>
              </div>
              <Button
                className="sb-btn-primary"
                onClick={() => window.location.href = `/dashboard/${brandSlug}/settings/social`}
              >
                Connect Account
              </Button>
            </div>
          </DS2EmptyContainer>
        ) : (
          <>
            {/* Desktop chart */}
            <div className="hidden lg:block">
              <DS2AreaChart
                data={growthData}
                series={areaSeries}
                xAxisKey="date"
                height={320}
                config={areaConfig}
              />
            </div>
            {/* Mobile chart */}
            <MobileAreaChart
              data={growthData}
              series={areaSeries}
              xAxisKey="date"
              config={areaConfig}
            />
          </>
        )}
      </div>

      {/* ── Stat Cards Row ─────────────────────────────────────────────── */}
      {stats && (
        <>
          {/* Mobile: scrollable stat strip */}
          <MobileStatStrip
            stats={[
              { label: "Engagement", value: stats.engagementRate.value, trend: { value: stats.engagementRate.trend, direction: stats.engagementRate.direction } },
              { label: "Reach", value: stats.totalReach.value, trend: { value: stats.totalReach.trend, direction: stats.totalReach.direction } },
              { label: "Published", value: stats.postsPublished.value, trend: { value: stats.postsPublished.trend, direction: stats.postsPublished.direction } },
              { label: "Followers", value: stats.totalFollowers.value, trend: { value: stats.totalFollowers.trend, direction: stats.totalFollowers.direction } },
              { label: "Best Post", value: stats.bestPost.value, trend: { value: stats.bestPost.trend, direction: stats.bestPost.direction } },
            ]}
          />
          {/* Desktop: grid of stat cards */}
          <div
            key={dateRange + platformFilter + "stats"}
            className="hidden lg:grid grid-cols-5 gap-6"
          >
            <div className="sb-stagger-enter" style={{ animationDelay: "0ms" }}>
              <DS2StatCard label="Engagement Rate" value={stats.engagementRate.value} trend={{ value: stats.engagementRate.trend, direction: stats.engagementRate.direction }} />
            </div>
            <div className="sb-stagger-enter" style={{ animationDelay: "60ms" }}>
              <DS2StatCard label="Total Reach" value={stats.totalReach.value} trend={{ value: stats.totalReach.trend, direction: stats.totalReach.direction }} />
            </div>
            <div className="sb-stagger-enter" style={{ animationDelay: "120ms" }}>
              <DS2StatCard label="Posts Published" value={stats.postsPublished.value} trend={{ value: stats.postsPublished.trend, direction: stats.postsPublished.direction }} />
            </div>
            <div className="sb-stagger-enter" style={{ animationDelay: "180ms" }}>
              <DS2StatCard label="Total Followers" value={stats.totalFollowers.value} trend={{ value: stats.totalFollowers.trend, direction: stats.totalFollowers.direction }} />
            </div>
            <div className="sb-stagger-enter sb-best-post-card" style={{ animationDelay: "240ms" }}>
              <DS2StatCard label="Best Post" value={stats.bestPost.value} description={stats.bestPost.preview} trend={{ value: stats.bestPost.trend, direction: stats.bestPost.direction }} />
            </div>
          </div>
        </>
      )}

      {/* ── Two-Column: Engagement + Top Content ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left: Engagement Breakdown */}
        <div>
          <p className="sb-label mb-1 lg:mb-2" style={{ color: "#e8956a" }}>
            Engagement
          </p>
          <h3 className="text-lg lg:text-[22px] font-bold lg:font-medium mb-3 lg:mb-6" style={{ color: "#eaeef1", fontFamily: "'Neue Montreal', sans-serif" }}>
            Engagement Breakdown
          </h3>
          {engagementData.every((item) => item.count === 0) ? (
            <DS2EmptyContainer minHeight="h-72">
              <div className="text-center space-y-3">
                <p className="sb-h4" style={{ color: "#d4dce2" }}>
                  No engagement metrics yet
                </p>
                <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                  Publish content or refresh analytics to populate likes, comments, shares, and saves.
                </p>
              </div>
            </DS2EmptyContainer>
          ) : (
            <>
              <div className="hidden lg:block">
                <DS2BarChart data={engagementData} dataKey="count" nameKey="type" height={300} config={engagementConfig} />
              </div>
              <MobileBarChart data={engagementData} dataKey="count" nameKey="type" config={engagementConfig} />
            </>
          )}
        </div>

        {/* Right: Top Content */}
        <div>
          <p className="sb-label mb-1 lg:mb-2" style={{ color: "#e8956a" }}>
            Content
          </p>
          <h3 className="text-lg lg:text-[22px] font-bold lg:font-medium mb-3 lg:mb-6" style={{ color: "#eaeef1", fontFamily: "'Neue Montreal', sans-serif" }}>
            Top Performing Content
          </h3>
          {topContent.length === 0 ? (
            <DS2EmptyContainer minHeight="h-72">
              <div className="text-center space-y-3">
                <p className="sb-h4" style={{ color: "#d4dce2" }}>
                  No posts found for this range
                </p>
                <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                  Try switching to All time or click Refresh Analytics to load older account posts.
                </p>
              </div>
            </DS2EmptyContainer>
          ) : (
            <>
              {/* Desktop: table */}
              <div className="hidden lg:block">
                <DS2DataTable columns={topContentColumns} data={topContent} />
              </div>
              {/* Mobile: card list */}
              <MobileDataCards
                cards={topContent.map((tc) => ({
                  title: tc.preview || "No caption",
                  subtitle: PLATFORM_ICONS[tc.platform]?.label ?? tc.platform,
                  accentColor: PLATFORM_COLORS[tc.platform],
                  fields: [
                    { label: "Engagements", value: tc.engagements.toLocaleString(), isData: true },
                    { label: "Reach", value: tc.reach.toLocaleString(), isData: true },
                    { label: "Rate", value: `${tc.engagementRate}%`, isData: true, accent: true },
                    { label: "Published", value: tc.publishedAt ? format(new Date(tc.publishedAt), "MMM d") : "—" },
                  ],
                }))}
              />
            </>
          )}
        </div>
      </div>

      {/* ── AI Analysis ─────────────────────────────────────────────────── */}
      {insights.length > 0 && <AIAnalyticsCard insights={insights} />}
    </div>
  )
}

// Re-export format for mobile cards usage

