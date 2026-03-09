"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InstagramIcon,
  TiktokIcon,
  Facebook02Icon,
  AiChat02Icon,
  Image02Icon,
  Calendar03Icon,
  ArrowRight01Icon,
  Link04Icon,
  Rocket01Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DS2StatCard } from "@/components/ds2/stat-card"
import { StatusBadge } from "@/components/ds2/status-badge"
import { DS2EmptyContainer } from "@/components/ds2/empty-container"
import { DS2Spinner } from "@/components/ds2/spinner"
import {
  MOCK_BRAND_LOGOS_INSIGHTS,
  MOCK_MINI_CALENDAR_POSTS,
  MOCK_PLATFORM_PERFORMANCE,
} from "@/lib/mock-data"
import type {
  MiniCalendarPost,
  PlatformPerformance,
  LogosDigest,
} from "@/types/dashboard"
import { format, addDays, isSameDay, startOfDay } from "date-fns"

// ── Helpers ──────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

const PLATFORM_ICONS: Record<string, typeof InstagramIcon> = {
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  facebook: Facebook02Icon,
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#e8956a",
  tiktok: "#64dcf4",
  facebook: "#64dcf4",
}

// ── LogosInsightCard ─────────────────────────────────────────────────────

function LogosInsightCard({ insight }: { insight: LogosDigest }) {
  return (
    <Card className="sb-logos-insight-card">
      <CardContent>
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              background: "rgba(244,185,100,0.10)",
              border: "1px solid rgba(244,185,100,0.20)",
            }}
          >
            <HugeiconsIcon icon={AiChat02Icon} size={20} color="#f4b964" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="sb-label mb-1" style={{ color: "#f4b964" }}>
              AI Insight
            </p>
            <p className="sb-body" style={{ color: "#d4dce2", lineHeight: 1.6 }}>
              {insight.insightText}
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button className="sb-btn-ghost-inline">
            View Recommendations
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ── MiniContentCalendar ──────────────────────────────────────────────────

function MiniContentCalendar({ posts, brandSlug }: { posts: MiniCalendarPost[]; brandSlug: string }) {
  const router = useRouter()
  const today = startOfDay(new Date())
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i))

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon icon={Calendar03Icon} size={16} color="#6d8d9f" />
            <p className="sb-label" style={{ color: "#6d8d9f" }}>
              Content Calendar
            </p>
          </div>
          <DS2EmptyContainer minHeight="h-40">
            <div className="text-center space-y-3">
              <HugeiconsIcon icon={Link04Icon} size={32} color="#6d8d9f" />
              <div>
                <p className="sb-body-sm" style={{ color: "#d4dce2" }}>
                  No posts scheduled yet.
                </p>
                <p className="sb-body-sm mt-1" style={{ color: "#6d8d9f" }}>
                  Connect your social accounts and start scheduling.
                </p>
              </div>
                <Button
                  className="sb-btn-secondary"
                  onClick={() => router.push(`/dashboard/${brandSlug}/settings/social`)}
                >
                Connect Accounts
              </Button>
            </div>
          </DS2EmptyContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={Calendar03Icon} size={16} color="#6d8d9f" />
          <p className="sb-label" style={{ color: "#6d8d9f" }}>
            Content Calendar
          </p>
        </div>
        <div className="space-y-0">
          {days.map((day) => {
            const isToday = isSameDay(day, today)
            const dayPosts = posts.filter((p) =>
              isSameDay(startOfDay(new Date(p.scheduledAt)), day)
            )

            return (
              <div
                key={day.toISOString()}
                className="flex items-center gap-3 py-2.5"
                style={{
                  borderLeft: isToday
                    ? "3px solid #f4b964"
                    : "3px solid transparent",
                  paddingLeft: 12,
                }}
              >
                <div className="flex-shrink-0" style={{ minWidth: 40 }}>
                  <p
                    className="sb-caption"
                    style={{
                      color: isToday ? "#f4b964" : "#6d8d9f",
                      fontWeight: isToday ? 600 : 400,
                    }}
                  >
                    {format(day, "EEE")}
                  </p>
                  <p
                    className="sb-data"
                    style={{
                      color: isToday ? "#eaeef1" : "#6d8d9f",
                      fontSize: 14,
                    }}
                  >
                    {format(day, "d")}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-1">
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      title={`${post.platform}: ${post.preview}`}
                      style={{
                        width: 6,
                        height: 6,
                        background:
                          post.status === "scheduled" ? "#e8956a" : "#6d8d9f",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                  {dayPosts.length > 0 && (
                    <span
                      className="sb-caption ml-1"
                      style={{ color: "#6d8d9f" }}
                    >
                      {dayPosts.length} {dayPosts.length === 1 ? "post" : "posts"}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ── RecentStudioStrip ────────────────────────────────────────────────────

function RecentStudioStrip({ images }: { images: { _id: string; imageUrl?: string; prompt?: string; productId?: string; aspectRatio?: string; createdAt: number }[] }) {
  const router = useRouter()
  const params = useParams()
  const brandSlug = params.brandSlug as string
  const displayImages = images.slice(0, 4)

  if (images.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon icon={Image02Icon} size={16} color="#6d8d9f" />
            <p className="sb-label" style={{ color: "#6d8d9f" }}>
              Recent Studio
            </p>
          </div>
          <DS2EmptyContainer minHeight="h-40">
            <div className="text-center space-y-3">
              <HugeiconsIcon icon={Rocket01Icon} size={32} color="#6d8d9f" />
              <div>
                <p className="sb-body-sm" style={{ color: "#d4dce2" }}>
                  No images generated yet.
                </p>
                <p className="sb-body-sm mt-1" style={{ color: "#6d8d9f" }}>
                  Head to Studio to start creating.
                </p>
              </div>
              <Button
                className="sb-btn-secondary"
                onClick={() => router.push(`/dashboard/${brandSlug}/studio`)}
              >
                Open Studio
              </Button>
            </div>
          </DS2EmptyContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={Image02Icon} size={16} color="#6d8d9f" />
          <p className="sb-label" style={{ color: "#6d8d9f" }}>
            Recent Studio
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {displayImages.map((image) => (
            <div
              key={image._id}
              className="sb-studio-thumb relative cursor-pointer"
              style={{
                background: image.imageUrl
                  ? `url(${image.imageUrl}) center/cover`
                  : "linear-gradient(135deg, #1a3a4a 0%, #2a5a3a 50%, #1a4a3a 100%)",
                border: "1px solid rgba(244,185,100,0.12)",
                aspectRatio: "1 / 1",
                overflow: "hidden",
              }}
            >
              {image.prompt && (
                <div
                  className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
                  style={{
                    background:
                      "linear-gradient(transparent, rgba(7,26,38,0.85))",
                  }}
                >
                  <p
                    className="sb-caption"
                    style={{
                      color: "#d4dce2",
                      fontSize: 10,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {image.prompt}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── PlatformPerformanceCard ──────────────────────────────────────────────

function PlatformPerformanceCard({
  perf,
  index,
}: {
  perf: PlatformPerformance
  index: number
}) {
  const iconDef = PLATFORM_ICONS[perf.platform]
  const color = PLATFORM_COLORS[perf.platform] ?? "#f4b964"

  // Sparkline SVG
  const svgWidth = 200
  const svgHeight = 40
  const padding = 2
  const values = perf.sparkline.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values
    .map((v, i) => {
      const x = padding + (i / (values.length - 1)) * (svgWidth - padding * 2)
      const y =
        svgHeight -
        padding -
        ((v - min) / range) * (svgHeight - padding * 2)
      return `${x},${y}`
    })
    .join(" ")

  const fillPoints = `${padding},${svgHeight} ${points} ${svgWidth - padding},${svgHeight}`
  const sparkId = `spark-perf-${perf.platform}-${index}`

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-3 mb-3">
          {iconDef && (
            <HugeiconsIcon icon={iconDef} size={20} color={color} />
          )}
          <span
            className="sb-label"
            style={{ color: "#eaeef1", textTransform: "capitalize" }}
          >
            {perf.platform}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="sb-caption" style={{ color: "#6d8d9f" }}>
              Followers
            </p>
            <p className="sb-data" style={{ color: "#eaeef1", fontSize: 16 }}>
              {perf.followers.toLocaleString()}
            </p>
            <span
              className="sb-caption"
              style={{
                color: perf.followerChange >= 0 ? "#f4b964" : "#e85454",
              }}
            >
              {perf.followerChange >= 0 ? "+" : ""}
              {perf.followerChange.toLocaleString()} this week
            </span>
          </div>
          <div style={{ borderLeft: "1px solid rgba(244,185,100,0.08)", paddingLeft: 16 }}>
            <p className="sb-caption" style={{ color: "#6d8d9f" }}>
              Engagement
            </p>
            <p className="sb-data" style={{ color: "#eaeef1", fontSize: 16 }}>
              {perf.engagementRate}%
            </p>
          </div>
        </div>

        {values.length > 1 && (
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            width="100%"
            height={40}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.12" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={fillPoints} fill={`url(#${sparkId})`} />
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              className="sparkline-draw"
            />
          </svg>
        )}
      </CardContent>
    </Card>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function BrandDashboardPage() {
  const params = useParams()
  const brandSlug = params.brandSlug as string
  const searchParams = useSearchParams()
  const forceEmpty = searchParams.get('empty') === 'true'

  // Real Convex data
  const brand = useQuery(api.brands.getBySlug, { slug: brandSlug })
  const credits = useQuery(api.credits.getBalance)
  const recentImages = useQuery(
    api.images.listByBrand,
    brand ? { brandId: brand._id, status: "ready" as const, limit: 4 } : "skip"
  )

  // Still loading
  if (brand === undefined || credits === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <DS2Spinner />
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <h2 className="sb-h2" style={{ color: "#eaeef1" }}>
            Brand not found
          </h2>
          <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
            No brand matches the slug &ldquo;{brandSlug}&rdquo;.
          </p>
        </div>
      </div>
    )
  }

  // Mock data for features not yet implemented (keyed by old mock IDs — won't match real brands)
  // These will show empty/default states for real brands, which is correct
  const mockBrandId = "" // Real brands won't match any mock IDs
  const insight = MOCK_BRAND_LOGOS_INSIGHTS[mockBrandId]
  const calendarPosts = forceEmpty ? [] : (MOCK_MINI_CALENDAR_POSTS[mockBrandId] ?? [])
  const platformPerf = MOCK_PLATFORM_PERFORMANCE[mockBrandId] ?? []

  const studioImages = forceEmpty ? [] : (recentImages ?? [])

  return (
    <div className="space-y-32">
      {/* A. Greeting */}
      <div suppressHydrationWarning>
        <h1 className="sb-h1" style={{ color: "#eaeef1" }}>
          {getGreeting()}, {brand.name}
        </h1>
        <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
          Here&apos;s your brand pulse for today.
        </p>
      </div>

      {/* B. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Followers",
            value: brand.totalFollowers.toLocaleString(),
            badge: brand.totalFollowers > 0 ? <StatusBadge status="live" /> : undefined,
            trend: undefined,
            valueStyle: undefined,
          },
          {
            label: "Engagement Rate",
            value: brand.avgEngagementRate != null ? `${brand.avgEngagementRate}%` : "—",
            badge: undefined,
            trend: brand.avgEngagementRate != null
              ? { value: "vs last week", direction: "neutral" as const }
              : undefined,
            valueStyle: undefined,
          },
          {
            label: "Credits Remaining",
            value: credits.total.toString(),
            badge: undefined,
            trend: { value: `of ${credits.allocation} monthly`, direction: "neutral" as const },
            valueStyle: { color: "#f4b964" },
          },
        ].map((card, i) => (
          <div
            key={card.label}
            className="sb-stagger-enter"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <DS2StatCard
              label={card.label}
              value={card.value}
              badge={card.badge}
              trend={card.trend}
              valueStyle={card.valueStyle}
            />
          </div>
        ))}
      </div>

      {/* C. AI Insight Card */}
      {insight && (
        <div>
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
            AI Insights
          </p>
          <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>
            AI Insight
          </h3>
          <LogosInsightCard insight={insight} />
        </div>
      )}

      {/* D. Content Calendar + Recent Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
            Scheduling
          </p>
          <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>
            Upcoming Week
          </h3>
          <MiniContentCalendar posts={calendarPosts} brandSlug={brandSlug} />
        </div>
        <div className="lg:col-span-2">
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
            Studio
          </p>
          <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>
            Recent Images
          </h3>
          <RecentStudioStrip images={studioImages} />
        </div>
      </div>

      {/* E. Platform Performance */}
      {platformPerf.length > 0 && (
        <div>
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
            Performance
          </p>
          <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>
            Platform Breakdown
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {platformPerf.map((perf, i) => (
              <PlatformPerformanceCard key={perf.platform} perf={perf} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
