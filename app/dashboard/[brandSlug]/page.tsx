// @ts-nocheck — Convex mock: remove when restoring real Convex (see lib/convex-mock.ts)
"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useQuery } from "@/lib/convex-mock"
import { api } from "@/convex/_generated/api"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Image02Icon,
  Calendar03Icon,
  Link04Icon,
  Rocket01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DS2StatCard } from "@/components/ds2/stat-card"
import { StatusBadge } from "@/components/ds2/status-badge"
import { DS2EmptyContainer } from "@/components/ds2/empty-container"
import { DS2Spinner } from "@/components/ds2/spinner"
import { MobileStatStrip } from "@/components/ds2/mobile/mobile-stat-strip"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { format, addDays, isSameDay, startOfDay } from "date-fns"

// ── Helpers ──────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

const PLATFORM_ABBREV: Record<string, string> = {
  instagram: "IG",
  facebook: "FB",
  linkedin: "LI",
  pinterest: "PI",
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#e8956a",
  facebook: "#64dcf4",
  linkedin: "#f4b964",
  pinterest: "#a4f464",
}

interface WeekPost {
  id: string
  platform: string
  platforms: string[]
  preview: string
  scheduledAt: string
  status: string
  time: string
}

// ── WeekStrip ────────────────────────────────────────────────────────────

function WeekStrip({
  posts,
  brandSlug,
  hasConnectedAccounts,
}: {
  posts: WeekPost[]
  brandSlug: string
  hasConnectedAccounts: boolean
}) {
  const router = useRouter()
  const today = startOfDay(new Date())
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i))

  const scheduledCount = posts.filter((p) => p.status === "scheduled").length
  const draftCount = posts.filter((p) => p.status === "draft").length

  // Find next upcoming post
  const now = new Date()
  const nextPost = posts
    .filter((p) => new Date(p.scheduledAt) > now && p.status === "scheduled")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0]

  if (posts.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="h-full flex items-center justify-center">
          <DS2EmptyContainer minHeight="h-48">
            {hasConnectedAccounts ? (
              <div className="flex flex-col items-center text-center space-y-3">
                <HugeiconsIcon icon={Calendar03Icon} size={32} color="#6d8d9f" />
                <div>
                  <p className="sb-body-sm" style={{ color: "#d4dce2" }}>
                    Your week is wide open.
                  </p>
                  <p className="sb-body-sm mt-1" style={{ color: "#6d8d9f" }}>
                    Schedule your first post to fill it up.
                  </p>
                </div>
                <Button
                  className="sb-btn-secondary"
                  onClick={() => router.push(`/dashboard/${brandSlug}/scheduling`)}
                >
                  Schedule Post
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-3">
                <HugeiconsIcon icon={Link04Icon} size={32} color="#6d8d9f" />
                <div>
                  <p className="sb-body-sm" style={{ color: "#d4dce2" }}>
                    Connect your social accounts first.
                  </p>
                  <p className="sb-body-sm mt-1" style={{ color: "#6d8d9f" }}>
                    Then start scheduling posts to grow your audience.
                  </p>
                </div>
                <Button
                  className="sb-btn-secondary"
                  onClick={() => router.push(`/dashboard/${brandSlug}/settings/social`)}
                >
                  Connect Accounts
                </Button>
              </div>
            )}
          </DS2EmptyContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Desktop: Horizontal 7-column strip */}
        <div className="sb-week-strip hidden lg:grid grid-cols-7 flex-1">
          {days.map((day) => {
            const isToday = isSameDay(day, today)
            const dayPosts = posts.filter((p) =>
              isSameDay(startOfDay(new Date(p.scheduledAt)), day)
            )
            const visiblePosts = dayPosts.slice(0, 3)
            const overflowCount = dayPosts.length - 3

            return (
              <div
                key={day.toISOString()}
                className="sb-week-col flex flex-col p-3"
                onClick={() =>
                  router.push(
                    `/dashboard/${brandSlug}/scheduling?date=${format(day, "yyyy-MM-dd")}`
                  )
                }
                style={{
                  borderTop: isToday ? "3px solid #f4b964" : "3px solid transparent",
                  background: isToday ? "rgba(244,185,100,0.04)" : "transparent",
                  borderRight: "1px solid rgba(244,185,100,0.06)",
                }}
              >
                {/* Day label */}
                <div className="mb-3">
                  <p
                    className="sb-label"
                    style={{
                      color: isToday ? "#f4b964" : "#6d8d9f",
                      fontSize: 10,
                    }}
                  >
                    {isToday ? "TODAY" : format(day, "EEE").toUpperCase()}
                  </p>
                  <p
                    className="sb-data"
                    style={{
                      color: isToday ? "#eaeef1" : "#d4dce2",
                      fontSize: 18,
                    }}
                  >
                    {format(day, "d")}
                  </p>
                </div>

                {/* Post chips */}
                <div className="flex flex-col gap-1.5 flex-1">
                  {visiblePosts.map((post) => (
                    <Tooltip key={post.id}>
                      <TooltipTrigger asChild>
                        <div
                          className="sb-post-chip flex items-center gap-1.5 px-2 py-1"
                          style={{
                            borderLeft:
                              post.status === "scheduled"
                                ? `2px solid ${PLATFORM_COLORS[post.platform] ?? "#e8956a"}`
                                : "2px dashed #6d8d9f",
                            background: "rgba(244,185,100,0.03)",
                          }}
                        >
                          <span
                            className="sb-label"
                            style={{
                              color: PLATFORM_COLORS[post.platform] ?? "#6d8d9f",
                              fontSize: 9,
                              letterSpacing: "0.06em",
                            }}
                          >
                            {PLATFORM_ABBREV[post.platform] ?? post.platform.slice(0, 2).toUpperCase()}
                          </span>
                          <span
                            className="sb-caption"
                            style={{ color: "#6d8d9f", fontSize: 10 }}
                          >
                            {post.time}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="sb-body-sm" style={{ maxWidth: 200 }}>
                          {post.preview || "No caption"}
                        </p>
                        <p className="sb-caption mt-1" style={{ color: "#6d8d9f" }}>
                          {post.status === "draft" ? "Draft" : "Scheduled"} &middot;{" "}
                          {post.platforms.map((p) => PLATFORM_ABBREV[p] ?? p).join(", ")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {overflowCount > 0 && (
                    <div
                      className="px-2 py-1"
                      style={{ borderLeft: "2px solid transparent" }}
                    >
                      <span className="sb-caption" style={{ color: "#6d8d9f", fontSize: 10 }}>
                        +{overflowCount} more
                      </span>
                    </div>
                  )}
                  {dayPosts.length === 0 && (
                    <div className="flex-1 flex items-center justify-center" style={{ opacity: 0.4 }}>
                      <span className="sb-caption" style={{ color: "#6d8d9f", fontSize: 10 }}>
                        &mdash;
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile: Vertical rows */}
        <div className="lg:hidden p-4">
          {days.map((day) => {
            const isToday = isSameDay(day, today)
            const dayPosts = posts.filter((p) =>
              isSameDay(startOfDay(new Date(p.scheduledAt)), day)
            )

            return (
              <div
                key={day.toISOString()}
                className="sb-week-col flex items-start gap-3 py-3"
                onClick={() =>
                  router.push(
                    `/dashboard/${brandSlug}/scheduling?date=${format(day, "yyyy-MM-dd")}`
                  )
                }
                style={{
                  borderLeft: isToday ? "3px solid #f4b964" : "3px solid transparent",
                  paddingLeft: 12,
                  background: isToday ? "rgba(244,185,100,0.04)" : "transparent",
                  borderBottom: "1px solid rgba(244,185,100,0.06)",
                }}
              >
                <div className="flex-shrink-0" style={{ minWidth: 44 }}>
                  <p
                    className="sb-label"
                    style={{
                      color: isToday ? "#f4b964" : "#6d8d9f",
                      fontSize: 10,
                    }}
                  >
                    {isToday ? "TODAY" : format(day, "EEE").toUpperCase()}
                  </p>
                  <p
                    className="sb-data"
                    style={{
                      color: isToday ? "#eaeef1" : "#d4dce2",
                      fontSize: 16,
                    }}
                  >
                    {format(day, "d")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {dayPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="sb-post-chip flex items-center gap-1.5 px-2 py-1"
                      style={{
                        borderLeft:
                          post.status === "scheduled"
                            ? `2px solid ${PLATFORM_COLORS[post.platform] ?? "#e8956a"}`
                            : "2px dashed #6d8d9f",
                        background: "rgba(244,185,100,0.03)",
                      }}
                    >
                      <span
                        className="sb-label"
                        style={{
                          color: PLATFORM_COLORS[post.platform] ?? "#6d8d9f",
                          fontSize: 9,
                        }}
                      >
                        {PLATFORM_ABBREV[post.platform] ?? post.platform.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="sb-caption" style={{ color: "#6d8d9f", fontSize: 10 }}>
                        {post.time}
                      </span>
                    </div>
                  ))}
                  {dayPosts.length > 3 && (
                    <span className="sb-caption self-center" style={{ color: "#6d8d9f", fontSize: 10 }}>
                      +{dayPosts.length - 3} more
                    </span>
                  )}
                  {dayPosts.length === 0 && (
                    <span className="sb-caption self-center" style={{ color: "#6d8d9f", opacity: 0.5, fontSize: 10 }}>
                      &mdash;
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary footer */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: "1px solid rgba(244,185,100,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <span className="sb-caption" style={{ color: "#6d8d9f" }}>
              <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>
                {scheduledCount}
              </span>{" "}
              scheduled
            </span>
            {draftCount > 0 && (
              <>
                <span style={{ color: "rgba(244,185,100,0.12)" }}>&middot;</span>
                <span className="sb-caption" style={{ color: "#6d8d9f" }}>
                  <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>
                    {draftCount}
                  </span>{" "}
                  {draftCount === 1 ? "draft" : "drafts"}
                </span>
              </>
            )}
            {nextPost && (
              <>
                <span style={{ color: "rgba(244,185,100,0.12)" }}>&middot;</span>
                <span className="sb-caption" style={{ color: "#f4b964" }}>
                  Next:{" "}
                  <span className="sb-data" style={{ fontSize: 12 }}>
                    {isSameDay(new Date(nextPost.scheduledAt), today)
                      ? format(new Date(nextPost.scheduledAt), "h:mm a")
                      : isSameDay(new Date(nextPost.scheduledAt), addDays(today, 1))
                        ? `Tomorrow ${format(new Date(nextPost.scheduledAt), "h:mm a")}`
                        : format(new Date(nextPost.scheduledAt), "EEE h:mm a")}
                  </span>
                </span>
              </>
            )}
          </div>
          <button
            className="sb-btn-ghost-inline sb-caption flex items-center gap-1"
            style={{ color: "#6d8d9f" }}
            onClick={() => router.push(`/dashboard/${brandSlug}/scheduling`)}
          >
            Full Calendar
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
          </button>
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
  const connectedAccounts = useQuery(
    api.socialAccounts.listConnectedByBrand,
    brand ? { brandId: brand._id } : "skip"
  )
  // Fetch both scheduled and draft posts (no status filter)
  const allPosts = useQuery(
    api.scheduledPosts.listByBrand,
    brand ? { brandId: brand._id } : "skip"
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

  const studioImages = forceEmpty ? [] : (recentImages ?? [])
  const hasConnectedAccounts = (connectedAccounts?.length ?? 0) > 0

  // Map real posts to WeekPost format, filter to scheduled/draft only
  const weekPosts: WeekPost[] = forceEmpty
    ? []
    : (allPosts ?? [])
        .filter((p) => p.status === "scheduled" || p.status === "draft")
        .map((post) => ({
          id: post._id,
          platform: post.selectedPlatforms[0] ?? "instagram",
          platforms: post.selectedPlatforms,
          preview: post.caption.slice(0, 80),
          scheduledAt: post.scheduledFor
            ? new Date(post.scheduledFor).toISOString()
            : new Date(post.createdAt).toISOString(),
          status: post.status,
          time: post.scheduledFor
            ? format(new Date(post.scheduledFor), "h:mm a")
            : "No time",
        }))

  const statCards = [
    {
      label: "Total Followers",
      value: brand.totalFollowers.toLocaleString(),
      badge: brand.totalFollowers > 0 ? <StatusBadge status="live" /> : undefined,
      trend: undefined as { value: string; direction: "up" | "down" | "neutral" } | undefined,
      valueStyle: undefined as React.CSSProperties | undefined,
    },
    {
      label: "Engagement Rate",
      value: brand.avgEngagementRate != null ? `${brand.avgEngagementRate}%` : "\u2014",
      badge: undefined,
      trend: brand.avgEngagementRate != null
        ? { value: "vs last week", direction: "neutral" as const }
        : undefined,
      valueStyle: undefined as React.CSSProperties | undefined,
    },
    {
      label: "Credits Remaining",
      value: credits.total.toString(),
      badge: undefined,
      trend: { value: `of ${credits.allocation} monthly`, direction: "neutral" as const },
      valueStyle: { color: "#f4b964" } as React.CSSProperties,
    },
  ]

  return (
    <div className="px-4 lg:px-0 space-y-10 lg:space-y-32 py-4 lg:py-0">
      {/* A. Greeting — smaller on mobile */}
      <div suppressHydrationWarning>
        <h1
          className="sb-h1"
          style={{ color: "#eaeef1", fontSize: undefined }}
        >
          <span className="hidden lg:inline">{getGreeting()}, {brand.name}</span>
          <span className="lg:hidden" style={{ fontSize: 24, fontWeight: 700 }}>{getGreeting()}</span>
        </h1>
        <p className="sb-body mt-2 lg:mt-3" style={{ color: "#6d8d9f", fontSize: undefined }}>
          <span className="hidden lg:inline">Here&apos;s your brand pulse for today.</span>
          <span className="lg:hidden" style={{ fontSize: 14 }}>{brand.name} &middot; brand pulse</span>
        </p>
      </div>

      {/* B. Stat Cards — scrollable strip on mobile, grid on desktop */}
      <MobileStatStrip
        stats={statCards.map((c) => ({
          label: c.label,
          value: c.value,
          trend: c.trend,
          accent: c.label === "Credits Remaining",
        }))}
      />
      <div className="hidden lg:grid grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="sb-stagger-enter h-full"
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

      {/* C. Week Strip + Recent Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 items-stretch">
        <div className="lg:col-span-3 flex flex-col">
          <div className="mb-3 lg:mb-6">
            <p className="sb-label mb-1 lg:mb-2" style={{ color: "#e8956a" }}>
              Scheduling
            </p>
            <h3 className="text-lg lg:text-[22px] font-bold lg:font-medium" style={{ color: "#eaeef1", fontFamily: "'Neue Montreal', sans-serif" }}>
              Upcoming Week
            </h3>
          </div>
          <div className="flex-1">
            <WeekStrip
              posts={weekPosts}
              brandSlug={brandSlug}
              hasConnectedAccounts={forceEmpty ? false : hasConnectedAccounts}
            />
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col">
          <div className="mb-3 lg:mb-6">
            <p className="sb-label mb-1 lg:mb-2" style={{ color: "#e8956a" }}>
              Studio
            </p>
            <h3 className="text-lg lg:text-[22px] font-bold lg:font-medium" style={{ color: "#eaeef1", fontFamily: "'Neue Montreal', sans-serif" }}>
              Recent Images
            </h3>
          </div>
          <div className="flex-1">
            <RecentStudioStrip images={studioImages} />
          </div>
        </div>
      </div>
    </div>
  )
}
