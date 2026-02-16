"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InstagramIcon,
  TiktokIcon,
  Facebook02Icon,
  Image02Icon,
  Calendar03Icon,
  Award02Icon,
  AiChat02Icon,
  GridViewIcon,
  Rocket01Icon,
  PackageIcon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DS2StatCard } from "@/components/ds2/stat-card"
import { DS2DataTable } from "@/components/ds2/data-table"
import type { DS2Column } from "@/components/ds2/data-table"
import { StatusBadge } from "@/components/ds2/status-badge"
import { LogosDigestCard } from "@/components/ds2/logos-digest-card"
import {
  MOCK_BRANDS,
  MOCK_USER,
  MOCK_CREDITS,
  MOCK_UPCOMING_POSTS,
  MOCK_ACTIVITY_FEED,
  MOCK_LOGOS_DIGEST,
  MOCK_BRAND_SPARKLINES,
} from "@/lib/mock-data"
import type { UpcomingPost, ActivityEntry } from "@/types/dashboard"
import { format } from "date-fns"

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

const ACTIVITY_ICONS: Record<string, typeof Image02Icon> = {
  image: Image02Icon,
  post: Calendar03Icon,
  milestone: Award02Icon,
  logos: AiChat02Icon,
  brand: GridViewIcon,
}

// ── Brand Summary Card (page-local) ─────────────────────────────────────

function BrandSummaryCard({ brand }: { brand: typeof MOCK_BRANDS[number] }) {
  const sparklineData = MOCK_BRAND_SPARKLINES[brand.id] ?? []

  // Build SVG polyline points for a 200x40 viewbox
  const svgWidth = 200
  const svgHeight = 40
  const padding = 2
  const values = sparklineData.map((p) => p.followers)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values
    .map((v, i) => {
      const x = padding + (i / (values.length - 1)) * (svgWidth - padding * 2)
      const y = svgHeight - padding - ((v - min) / range) * (svgHeight - padding * 2)
      return `${x},${y}`
    })
    .join(" ")

  // Fill polygon: close the path along the bottom
  const fillPoints = `${padding},${svgHeight} ${points} ${svgWidth - padding},${svgHeight}`

  return (
    <Link href={`/dashboard/${brand.slug}`}>
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

          <div className="grid grid-cols-2 gap-6 mb-4">
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

          {values.length > 1 && (
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              width="100%"
              height={40}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`spark-fill-${brand.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f4b964" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#f4b964" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points={fillPoints}
                fill={`url(#spark-fill-${brand.id})`}
              />
              <polyline
                points={points}
                fill="none"
                stroke="#f4b964"
                strokeWidth="2"
                className="sparkline-draw"
              />
            </svg>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

// ── Activity Feed (page-local) ──────────────────────────────────────────

function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  return (
    <div>
      {entries.map((entry) => {
        const iconDef = ACTIVITY_ICONS[entry.icon]
        return (
          <div key={entry.id} className="sb-item">
            <div className="flex items-start gap-4">
              <span
                className="flex-shrink-0"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.02em",
                  color: "#6d8d9f",
                  minWidth: 72,
                }}
              >
                {format(new Date(entry.timestamp), "h:mm a")}
              </span>
              {iconDef && (
                <HugeiconsIcon
                  icon={iconDef}
                  size={16}
                  color="#6d8d9f"
                  className="flex-shrink-0 mt-0.5"
                />
              )}
              <p className="sb-body-sm" style={{ color: "#d4dce2" }}>
                {entry.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

const totalFollowers = MOCK_BRANDS.reduce((sum, b) => sum + b.followers, 0)
const avgEngagement = (
  MOCK_BRANDS.reduce((sum, b) => sum + b.engagementRate, 0) / MOCK_BRANDS.length
).toFixed(1)

const upcomingPostColumns: DS2Column<UpcomingPost>[] = [
  {
    key: "brandInitials",
    label: "Brand",
    render: (_val: string, row: UpcomingPost) => (
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback
            style={{
              background: "rgba(244,185,100,0.08)",
              color: "#f4b964",
              fontFamily: "'Neue Montreal', sans-serif",
              fontWeight: 700,
              fontSize: 10,
            }}
          >
            {row.brandInitials}
          </AvatarFallback>
        </Avatar>
        <span className="sb-body-sm" style={{ color: "#d4dce2" }}>
          {row.brandName}
        </span>
      </div>
    ),
  },
  {
    key: "platform",
    label: "Platform",
    render: (val: string) => {
      const iconDef = PLATFORM_ICONS[val]
      return iconDef ? (
        <HugeiconsIcon icon={iconDef} size={18} color="#6d8d9f" />
      ) : (
        <span className="sb-body-sm" style={{ color: "#6d8d9f" }}>{val}</span>
      )
    },
  },
  {
    key: "preview",
    label: "Preview",
    render: (val: string) => (
      <span
        className="sb-body-sm"
        style={{
          color: "#d4dce2",
          display: "block",
          maxWidth: 320,
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
    key: "scheduledAt",
    label: "Scheduled",
    isData: true,
    render: (val: string) => {
      const d = new Date(val)
      return (
        <span className="sb-data" style={{ color: "#d4dce2", fontSize: 12, fontWeight: 500 }}>
          {format(d, "MMM d")} &middot; {format(d, "h:mm a")}
        </span>
      )
    },
  },
  {
    key: "status",
    label: "Status",
    render: (val: string) => <StatusBadge status={val} />,
  },
]

function GlobalOverviewContent() {
  const firstName = MOCK_USER.name.split(" ")[0]
  const searchParams = useSearchParams()
  const router = useRouter()
  const forceEmpty = searchParams.get('empty') === 'true'

  const brands = forceEmpty ? [] : MOCK_BRANDS
  const showEmpty = brands.length === 0

  const totalFollowers = showEmpty ? 0 : brands.reduce((sum, b) => sum + b.followers, 0)
  const avgEngagement = showEmpty ? 0 : brands.reduce((sum, b) => sum + b.engagementRate, 0) / brands.length

  if (showEmpty) {
    return (
      <div className="space-y-8">
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
            value={MOCK_CREDITS.toString()}
            description="Professional plan"
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
                description: "Tell Logos about your business and define your brand voice"
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

        {/* D. Logos Welcome */}
        <div>
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
            AI Companion
          </p>
          <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>
            Meet Logos
          </h3>
          <LogosDigestCard
            insightText="Welcome to PixelPrism. I'm Logos, your AI marketing companion. Create your first brand and I'll help you build your online presence."
            timestamp={new Date().toISOString()}
            ctaLabel="Get Started"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
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
          value={MOCK_CREDITS.toString()}
          description="Professional plan"
          trend={{ value: "15 this month", direction: "up" }}
          valueStyle={{ color: "#f4b964" }}
        />
        <DS2StatCard
          label="Total Followers"
          value={totalFollowers.toLocaleString()}
          trend={{ value: "8.3%", direction: "up" }}
        />
        <DS2StatCard
          label="Engagement Rate"
          value={`${avgEngagement}%`}
          trend={{ value: "0.5%", direction: "up" }}
        />
      </div>

      {/* C. Brand Summary Cards */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Portfolio</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Your Brands</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_BRANDS.map((brand) => (
            <BrandSummaryCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>

      {/* D. Logos Weekly Digest */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>AI Insights</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Logos Weekly Digest</h3>
        <LogosDigestCard
          insightText={MOCK_LOGOS_DIGEST.insightText}
          timestamp={MOCK_LOGOS_DIGEST.timestamp}
          ctaLabel="Chat with Logos"
        />
      </div>

      {/* E. Upcoming Posts */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Scheduling</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Upcoming Posts</h3>
        <DS2DataTable columns={upcomingPostColumns} data={MOCK_UPCOMING_POSTS} />
      </div>

      {/* F. Activity Feed */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Timeline</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Recent Activity</h3>
        <Card>
          <CardContent>
            <ActivityFeed entries={MOCK_ACTIVITY_FEED} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function GlobalOverviewPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <GlobalOverviewContent />
    </Suspense>
  )
}
