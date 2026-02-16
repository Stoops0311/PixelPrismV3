"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InstagramIcon,
  TiktokIcon,
  Facebook02Icon,
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
import type { DS2Column } from "@/components/ds2/data-table"
import type { ChartConfig } from "@/components/ui/chart"
import type { TopContent } from "@/types/dashboard"
import {
  MOCK_BRAND_DETAILS,
  MOCK_FOLLOWER_GROWTH,
  MOCK_ENGAGEMENT_BREAKDOWN,
  MOCK_TOP_CONTENT,
  MOCK_LOGOS_ANALYTICS_INSIGHTS,
  MOCK_AUDIENCE_GROWTH,
  MOCK_ANALYTICS_STATS,
} from "@/lib/mock-data"
import { format } from "date-fns"

// ── Platform Helpers ──────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, { icon: typeof InstagramIcon; label: string }> = {
  instagram: { icon: InstagramIcon, label: "Instagram" },
  tiktok: { icon: TiktokIcon, label: "TikTok" },
  facebook: { icon: Facebook02Icon, label: "Facebook" },
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#e8956a",
  tiktok: "#64dcf4",
  facebook: "#64dcf4",
}

// ── HeadlineMetric (page-local) ───────────────────────────────────────────

function HeadlineMetric({
  change,
  changePercent,
}: {
  change: number
  changePercent: number
}) {
  return (
    <div className="flex items-end gap-6 flex-wrap">
      <div>
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
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <polygon points="5,1 9,7 1,7" />
        </svg>
        +{changePercent}%
      </span>
    </div>
  )
}

// ── LogosAnalyticsCard (page-local) ───────────────────────────────────────

function LogosAnalyticsCard({ insights }: { insights: { id: string; text: string }[] }) {
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
              Logos Analysis
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
  const searchParams = useSearchParams()
  const forceEmpty = searchParams.get('empty') === 'true'

  const brand = MOCK_BRAND_DETAILS.find((b) => b.slug === brandSlug)

  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d")
  const [platformFilter, setPlatformFilter] = useState<
    "all" | "instagram" | "tiktok" | "facebook"
  >("all")

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

  // ── Data ──────────────────────────────────────────────────────────────

  const audienceGrowth = forceEmpty ? null : MOCK_AUDIENCE_GROWTH[brand.id]
  const stats = forceEmpty ? null : MOCK_ANALYTICS_STATS[brand.id]
  const allGrowthData = forceEmpty ? [] : (MOCK_FOLLOWER_GROWTH[brand.id] ?? [])
  const engagementData = forceEmpty ? [] : (MOCK_ENGAGEMENT_BREAKDOWN[brand.id] ?? [])
  const topContent = forceEmpty ? [] : (MOCK_TOP_CONTENT[brand.id] ?? [])
  const insights = forceEmpty ? [] : (MOCK_LOGOS_ANALYTICS_INSIGHTS[brand.id] ?? [])

  // Slice growth data by date range
  const growthData = allGrowthData.slice(
    dateRange === "7d" ? -7 : dateRange === "30d" ? -30 : -90
  )

  // Build series from connected platforms, filtered by platform filter
  const activePlatforms =
    platformFilter === "all"
      ? brand.connectedPlatforms
      : brand.connectedPlatforms.filter((p) => p === platformFilter)

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

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <HugeiconsIcon icon={AnalyticsUpIcon} size={24} color="#f4b964" />
          <h1 className="sb-h1" style={{ color: "#eaeef1" }}>
            Analytics
          </h1>
        </div>
        <p className="sb-body" style={{ color: "#6d8d9f" }}>
          Follower growth, engagement metrics, and content performance for{" "}
          <span style={{ color: "#d4dce2" }}>{brand.name}</span>.
        </p>
      </div>

      {/* ── Headline Metric ────────────────────────────────────────────── */}
      {audienceGrowth && (
        <div key={dateRange + platformFilter + "headline"}>
          <HeadlineMetric
            change={audienceGrowth.change}
            changePercent={audienceGrowth.changePercent}
          />
        </div>
      )}

      {/* ── Filter Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 flex-wrap">
        <ToggleGroup
          type="single"
          value={dateRange}
          onValueChange={(val) => {
            if (val) setDateRange(val as "7d" | "30d" | "90d")
          }}
        >
          <ToggleGroupItem value="7d">7d</ToggleGroupItem>
          <ToggleGroupItem value="30d">30d</ToggleGroupItem>
          <ToggleGroupItem value="90d">90d</ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="single"
          value={platformFilter}
          onValueChange={(val) => {
            if (val)
              setPlatformFilter(
                val as "all" | "instagram" | "tiktok" | "facebook"
              )
          }}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          {brand.connectedPlatforms.map((p) => (
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

      {/* ── Primary Chart: Follower Growth ─────────────────────────────── */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
          Growth
        </p>
        <h3 className="sb-h3 mb-4" style={{ color: "#eaeef1" }}>
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
                onClick={() => window.location.href = '/dashboard/billing'}
              >
                Connect Account
              </Button>
            </div>
          </DS2EmptyContainer>
        ) : (
          <DS2AreaChart
            data={growthData}
            series={areaSeries}
            xAxisKey="date"
            height={320}
            config={areaConfig}
          />
        )}
      </div>

      {/* ── Stat Cards Row ─────────────────────────────────────────────── */}
      {stats && (
        <div
          key={dateRange + platformFilter + "stats"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="sb-stagger-enter" style={{ animationDelay: "0ms" }}>
            <DS2StatCard
              label="Engagement Rate"
              value={stats.engagementRate.value}
              trend={{
                value: stats.engagementRate.trend,
                direction: stats.engagementRate.direction,
              }}
            />
          </div>
          <div className="sb-stagger-enter" style={{ animationDelay: "60ms" }}>
            <DS2StatCard
              label="Total Reach"
              value={stats.totalReach.value}
              trend={{
                value: stats.totalReach.trend,
                direction: stats.totalReach.direction,
              }}
            />
          </div>
          <div className="sb-stagger-enter" style={{ animationDelay: "120ms" }}>
            <DS2StatCard
              label="Posts Published"
              value={stats.postsPublished.value}
              trend={{
                value: stats.postsPublished.trend,
                direction: stats.postsPublished.direction,
              }}
            />
          </div>
          <div
            className="sb-stagger-enter sb-best-post-card"
            style={{ animationDelay: "180ms" }}
          >
            <DS2StatCard
              label="Best Post"
              value={stats.bestPost.value}
              description={`${stats.bestPost.preview}`}
              trend={{
                value: stats.bestPost.trend,
                direction: stats.bestPost.direction,
              }}
            />
          </div>
        </div>
      )}

      {/* ── Two-Column: Engagement + Top Content ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Engagement Breakdown */}
        <div>
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
            Engagement
          </p>
          <h3 className="sb-h3 mb-4" style={{ color: "#eaeef1" }}>
            Engagement Breakdown
          </h3>
          <DS2BarChart
            data={engagementData}
            dataKey="count"
            nameKey="type"
            height={300}
            config={engagementConfig}
          />
        </div>

        {/* Right: Top Content */}
        <div>
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
            Content
          </p>
          <h3 className="sb-h3 mb-4" style={{ color: "#eaeef1" }}>
            Top Performing Content
          </h3>
          <DS2DataTable columns={topContentColumns} data={topContent} />
        </div>
      </div>

      {/* ── Logos Analysis ──────────────────────────────────────────────── */}
      {insights.length > 0 && <LogosAnalyticsCard insights={insights} />}
    </div>
  )
}
