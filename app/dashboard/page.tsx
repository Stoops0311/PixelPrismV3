"use client"

import { Suspense, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GridViewIcon,
  PackageIcon,
  Calendar03Icon,
  Image02Icon,
  ArrowRight01Icon,
  AlertCircleIcon,
  CreditCardIcon,
  Notification03Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DS2StatCard } from "@/components/ds2/stat-card"
import { StatusBadge } from "@/components/ds2/status-badge"
import { DS2EmptyContainer } from "@/components/ds2/empty-container"
import { DS2Spinner } from "@/components/ds2/spinner"
import type { Brand } from "@/types/dashboard"
import { format, isSameDay, startOfDay, isToday, isTomorrow, formatDistanceToNow } from "date-fns"

// ── Helpers ──────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function toBrand(doc: any): Brand {
  const initials = doc.name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return {
    id: doc._id,
    slug: doc.slug,
    name: doc.name,
    initials,
    followers: doc.totalFollowers ?? 0,
    engagementRate: doc.avgEngagementRate ?? 0,
  }
}

function tierToPlan(tier: string): string {
  switch (tier) {
    case "starter":
      return "Starter"
    case "enterprise":
      return "Enterprise"
    default:
      return "Professional"
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
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

// ── Activity Feed Types ──────────────────────────────────────────────────

interface ActivityItem {
  id: string
  type: "post_published" | "post_engagement" | "credits_received" | "credits_low" | "image_generated" | "brand_created"
  description: string
  brandName?: string
  brandSlug?: string
  brandInitials?: string
  timestamp: number
  href?: string
}

const ACTIVITY_TYPE_CONFIG: Record<
  ActivityItem["type"],
  { color: string; icon: typeof Calendar03Icon }
> = {
  post_published: { color: "#e8956a", icon: Calendar03Icon },
  post_engagement: { color: "#f4b964", icon: Notification03Icon },
  image_generated: { color: "#f4b964", icon: Image02Icon },
  brand_created: { color: "#eaeef1", icon: GridViewIcon },
  credits_received: { color: "#64dcf4", icon: CreditCardIcon },
  credits_low: { color: "#e85454", icon: AlertCircleIcon },
}

// ── Upcoming Posts Section ───────────────────────────────────────────────

function UpcomingPostsFeed({
  posts,
}: {
  posts: any[] | undefined
}) {
  const router = useRouter()

  if (posts === undefined) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <DS2Spinner />
        </CardContent>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent>
          <DS2EmptyContainer minHeight="h-32">
            <div className="flex flex-col items-center text-center space-y-3">
              <HugeiconsIcon icon={Calendar03Icon} size={32} color="#6d8d9f" />
              <div>
                <p className="sb-body-sm" style={{ color: "#d4dce2" }}>
                  Nothing scheduled across your brands.
                </p>
                <p className="sb-body-sm mt-1" style={{ color: "#6d8d9f" }}>
                  Visit a brand to schedule your first post.
                </p>
              </div>
              <Button
                className="sb-btn-secondary"
                onClick={() => router.push("/dashboard/brands")}
              >
                Go to Brands
              </Button>
            </div>
          </DS2EmptyContainer>
        </CardContent>
      </Card>
    )
  }

  // Group posts by day
  const grouped: { date: Date; label: string; posts: any[] }[] = []

  for (const post of posts.slice(0, 8)) {
    const postDate = startOfDay(new Date(post.scheduledFor))
    const existing = grouped.find((g) => isSameDay(g.date, postDate))
    if (existing) {
      existing.posts.push(post)
    } else {
      let label: string
      if (isToday(postDate)) {
        label = `TODAY \u2014 ${format(postDate, "MMM d")}`
      } else if (isTomorrow(postDate)) {
        label = `TOMORROW \u2014 ${format(postDate, "MMM d")}`
      } else {
        label = `${format(postDate, "EEEE").toUpperCase()} \u2014 ${format(postDate, "MMM d")}`
      }
      grouped.push({ date: postDate, label, posts: [post] })
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="sb-post-row-group">
          {grouped.map((group, gi) => (
            <div key={group.label}>
              {/* Day header */}
              <div
                className="flex items-center gap-3 px-4 py-2"
                style={{
                  borderBottom: "1px solid rgba(244,185,100,0.06)",
                  ...(gi > 0 ? { borderTop: "1px solid rgba(244,185,100,0.06)" } : {}),
                }}
              >
                <span
                  className="sb-label"
                  style={{
                    color: isToday(group.date) ? "#f4b964" : "#6d8d9f",
                    fontSize: 10,
                    whiteSpace: "nowrap",
                  }}
                >
                  {group.label}
                </span>
                <div
                  className="flex-1"
                  style={{
                    height: 1,
                    background: "rgba(244,185,100,0.06)",
                  }}
                />
              </div>

              {/* Post rows */}
              {group.posts.map((post: any) => (
                <div
                  key={post._id}
                  className="sb-post-row flex items-center gap-3 px-4 py-3"
                  style={{
                    borderBottom: "1px solid rgba(244,185,100,0.04)",
                    paddingLeft: 16,
                  }}
                  onClick={() =>
                    router.push(`/dashboard/${post.brandSlug}/scheduling`)
                  }
                >
                  {/* Brand avatar */}
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 28,
                      height: 28,
                      background: "rgba(244,185,100,0.08)",
                      border: "1px solid rgba(244,185,100,0.12)",
                    }}
                  >
                    <span
                      className="sb-label"
                      style={{ color: "#f4b964", fontSize: 9 }}
                    >
                      {post.brandInitials}
                    </span>
                  </div>

                  {/* Brand name */}
                  <span
                    className="sb-caption flex-shrink-0"
                    style={{ color: "#6d8d9f", minWidth: 60 }}
                  >
                    {post.brandName}
                  </span>

                  {/* Platform chips */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {(post.selectedPlatforms ?? []).slice(0, 3).map((p: string) => (
                      <span
                        key={p}
                        className="sb-label"
                        style={{
                          color: PLATFORM_COLORS[p] ?? "#6d8d9f",
                          fontSize: 9,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {PLATFORM_ABBREV[p] ?? p.slice(0, 2).toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* Time */}
                  <span
                    className="sb-data flex-shrink-0"
                    style={{ color: "#d4dce2", fontSize: 12 }}
                  >
                    {format(new Date(post.scheduledFor), "h:mm a")}
                  </span>

                  {/* Caption preview */}
                  <span
                    className="sb-body-sm flex-1 truncate"
                    style={{ color: "#6d8d9f" }}
                  >
                    {post.caption?.slice(0, 60) || "No caption"}
                  </span>

                  {/* Status badge */}
                  <StatusBadge
                    status={post.status === "draft" ? "draft" : "scheduled"}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        {posts.length > 8 && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid rgba(244,185,100,0.06)" }}
          >
            <span className="sb-caption" style={{ color: "#6d8d9f" }}>
              Showing next 7 days &middot;{" "}
              <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>
                {posts.length}
              </span>{" "}
              posts
            </span>
            <button className="sb-btn-ghost-inline sb-caption flex items-center gap-1" style={{ color: "#6d8d9f" }}>
              View all scheduled posts
              <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Activity Timeline Section ────────────────────────────────────────────

function ActivityTimeline({
  activities,
}: {
  activities: ActivityItem[]
}) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent>
          <DS2EmptyContainer minHeight="h-32">
            <div className="flex flex-col items-center text-center space-y-3">
              <HugeiconsIcon icon={Notification03Icon} size={32} color="#6d8d9f" />
              <div>
                <p className="sb-body-sm" style={{ color: "#d4dce2" }}>
                  No activity yet.
                </p>
                <p className="sb-body-sm mt-1" style={{ color: "#6d8d9f" }}>
                  Your activity will appear here as you create brands, generate images, and publish posts.
                </p>
              </div>
            </div>
          </DS2EmptyContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="sb-timeline-spine py-4" style={{ marginLeft: 16 }}>
          {activities.map((activity, i) => {
            const config = ACTIVITY_TYPE_CONFIG[activity.type] ?? ACTIVITY_TYPE_CONFIG.post_published

            return (
              <div
                key={activity.id}
                className="relative flex items-start gap-3 py-3 pr-4"
                style={{
                  borderBottom:
                    i < activities.length - 1
                      ? "1px solid rgba(244,185,100,0.04)"
                      : "none",
                }}
              >
                {/* Timeline dot */}
                <div
                  className="sb-timeline-dot"
                  style={{ background: config.color }}
                />

                {/* Event icon */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 24,
                    height: 24,
                    background: `${config.color}14`,
                  }}
                >
                  <HugeiconsIcon icon={config.icon} size={14} color={config.color} />
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0">
                  <p className="sb-body-sm" style={{ color: "#d4dce2" }}>
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="sb-caption" style={{ color: "#6d8d9f" }}>
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                    {activity.brandName && (
                      <>
                        <span style={{ color: "rgba(244,185,100,0.12)" }}>&middot;</span>
                        <span className="sb-caption" style={{ color: "#6d8d9f" }}>
                          {activity.brandName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Page Content ─────────────────────────────────────────────────────────

function GlobalOverviewContent() {
  const convexUser = useQuery(api.users.current)
  const convexBrands = useQuery(api.brands.list)
  const creditBalance = useQuery(api.credits.getBalance)
  const upcomingPosts = useQuery(api.scheduledPosts.listUpcoming, { limit: 8 })
  const notifications = useQuery(api.notifications.listRecent, { limit: 10 })
  const searchParams = useSearchParams()
  const router = useRouter()
  const forceEmpty = searchParams.get('empty') === 'true'

  // Build activity feed from notifications + brand creation events
  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = []

    // Add notifications
    if (notifications) {
      for (const n of notifications) {
        items.push({
          id: n._id,
          type: n.type as ActivityItem["type"],
          description: n.body ?? n.title,
          brandName: undefined, // notifications don't join brand name
          timestamp: n.createdAt,
          href: n.href,
        })
      }
    }

    // Add brand creation events
    if (convexBrands && !forceEmpty) {
      for (const b of convexBrands) {
        items.push({
          id: `brand-${b._id}`,
          type: "brand_created",
          description: `Created brand "${b.name}"`,
          brandName: b.name,
          brandSlug: b.slug,
          brandInitials: getInitials(b.name),
          timestamp: b.createdAt ?? 0,
        })
      }
    }

    // Sort by timestamp descending, take first 8
    return items
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8)
  }, [notifications, convexBrands, forceEmpty])

  // Loading state
  if (convexUser === undefined || convexBrands === undefined || creditBalance === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <DS2Spinner size="lg" />
      </div>
    )
  }

  const firstName = convexUser?.name?.split(" ")[0] ?? "there"
  const credits = creditBalance?.total ?? 0
  const planLabel = tierToPlan(convexUser?.subscriptionTier ?? "free")

  const brands: Brand[] = forceEmpty ? [] : (convexBrands ?? []).map(toBrand)
  const showEmpty = brands.length === 0

  const totalFollowers = showEmpty ? 0 : brands.reduce((sum, b) => sum + b.followers, 0)
  const avgEngagement = showEmpty ? 0 : brands.reduce((sum, b) => sum + b.engagementRate, 0) / brands.length

  if (showEmpty) {
    return (
      <div className="space-y-32">
        {/* A. Greeting */}
        <div suppressHydrationWarning>
          <h1 className="sb-h1" style={{ color: "#eaeef1" }}>
            {getGreeting()}, {firstName}
          </h1>
          <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
            Welcome to PixelPrism. Let&apos;s get your brand started.
          </p>
        </div>

        {/* B. Stat Cards (Empty State) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DS2StatCard
            label="Credits Remaining"
            value={credits.toString()}
            description={`${planLabel} plan`}
            trend={{ value: "Ready to use", direction: "neutral" }}
            valueStyle={{ color: "#f4b964" }}
          />
          <Card>
            <CardContent>
              <p className="sb-label mb-2" style={{ color: "#6d8d9f" }}>
                Your Brands
              </p>
              <p className="sb-data" style={{ color: "#d4dce2" }}>
                0
              </p>
              <p className="sb-caption mt-2" style={{ color: "#6d8d9f" }}>
                Create your first brand to get started
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-sb-elevated transition-shadow duration-300" onClick={() => router.push('/dashboard/brands')}>
            <CardContent className="flex items-center justify-center h-full min-h-[140px]">
              <Button className="sb-btn-primary">
                Create Your First Brand
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* C. Walkthrough Panels */}
        <div>
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
            How it Works
          </p>
          <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>
            Get Started with PixelPrism
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: GridViewIcon,
                step: "1",
                title: "Create a brand",
                description: "Tell us about your business and define your brand voice"
              },
              {
                icon: PackageIcon,
                step: "2",
                title: "Add products & generate images",
                description: "Upload products and use AI to create marketing images"
              },
              {
                icon: Calendar03Icon,
                step: "3",
                title: "Schedule posts",
                description: "Connect social accounts and watch your audience grow"
              }
            ].map((item, i) => (
              <Card key={i}>
                <CardContent>
                  <div
                    className="flex items-center justify-center mb-4"
                    style={{
                      width: 64,
                      height: 64,
                      background: "rgba(244,185,100,0.08)",
                      border: "1px solid rgba(244,185,100,0.12)",
                    }}
                  >
                    <HugeiconsIcon icon={item.icon} size={32} color="#f4b964" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="sb-label flex items-center justify-center"
                      style={{
                        width: 24,
                        height: 24,
                        background: "#f4b964",
                        color: "#071a26",
                      }}
                    >
                      {item.step}
                    </div>
                    <h4 className="sb-h4" style={{ color: "#eaeef1" }}>
                      {item.title}
                    </h4>
                  </div>
                  <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-32">
      {/* A. Greeting */}
      <div suppressHydrationWarning>
        <h1 className="sb-h1" style={{ color: "#eaeef1" }}>
          {getGreeting()}, {firstName}
        </h1>
        <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
          Here&apos;s what&apos;s happening across your brands.
        </p>
      </div>

      {/* B. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DS2StatCard
          label="Credits Remaining"
          value={credits.toString()}
          description={`${planLabel} plan`}
          trend={{ value: `${creditBalance?.allocation ?? 0}/mo allocation`, direction: "neutral" }}
          valueStyle={{ color: "#f4b964" }}
        />
        <DS2StatCard
          label="Total Followers"
          value={totalFollowers.toLocaleString()}
          trend={{ value: `${brands.length} brand(s)`, direction: "neutral" }}
        />
        <DS2StatCard
          label="Engagement Rate"
          value={`${avgEngagement.toFixed(1)}%`}
          trend={{ value: "Avg across brands", direction: "neutral" }}
        />
      </div>

      {/* C. Brand Summary Cards */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Portfolio</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Your Brands</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/dashboard/${brand.slug}`}>
              <Card className="cursor-pointer">
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback
                        style={{
                          background: "rgba(244,185,100,0.08)",
                          color: "#f4b964",
                          fontFamily: "'Neue Montreal', sans-serif",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {brand.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="sb-h4" style={{ color: "#eaeef1" }}>
                      {brand.name}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="sb-caption" style={{ color: "#6d8d9f" }}>Followers</p>
                      <p className="sb-data" style={{ color: "#eaeef1" }}>
                        {brand.followers.toLocaleString()}
                      </p>
                    </div>
                    <div style={{ borderLeft: "1px solid rgba(244,185,100,0.08)", paddingLeft: 24 }}>
                      <p className="sb-caption" style={{ color: "#6d8d9f" }}>Engagement</p>
                      <p className="sb-data" style={{ color: "#eaeef1" }}>
                        {brand.engagementRate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* D. Upcoming Posts (Cross-Brand) */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Scheduling</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Upcoming Posts</h3>
        <UpcomingPostsFeed posts={forceEmpty ? [] : upcomingPosts} />
      </div>

      {/* E. Recent Activity */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Timeline</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Recent Activity</h3>
        <ActivityTimeline activities={forceEmpty ? [] : activities} />
      </div>
    </div>
  )
}

export default function GlobalOverviewPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><DS2Spinner size="lg" /></div>}>
      <GlobalOverviewContent />
    </Suspense>
  )
}
