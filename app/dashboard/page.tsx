"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GridViewIcon,
  PackageIcon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DS2StatCard } from "@/components/ds2/stat-card"
import { LogosDigestCard } from "@/components/ds2/logos-digest-card"
import { DS2Spinner } from "@/components/ds2/spinner"
import type { Brand } from "@/types/dashboard"

// ── Helpers ──────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

// ── Page ─────────────────────────────────────────────────────────────────

/** Map a Convex brand document to the Brand shape expected by UI */
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

/** Map subscription tier string to plan label */
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

function GlobalOverviewContent() {
  const convexUser = useQuery(api.users.current)
  const convexBrands = useQuery(api.brands.list)
  const creditBalance = useQuery(api.credits.getBalance)
  const searchParams = useSearchParams()
  const router = useRouter()
  const forceEmpty = searchParams.get('empty') === 'true'

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

        {/* D. AI Welcome */}
        <div>
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>
            AI Companion
          </p>
          <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>
            Meet Your Assistant
          </h3>
          <LogosDigestCard
            insightText="Welcome to PixelPrism. Your AI marketing assistant helps you build your online presence from day one."
            timestamp={new Date().toISOString()}
            ctaLabel="Get Started"
          />
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

      {/* D. AI Weekly Digest */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>AI Insights</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Weekly AI Digest</h3>
        <LogosDigestCard
          insightText="As you create content and grow your audience, your AI assistant provides weekly insights and recommendations."
          timestamp={new Date().toISOString()}
          ctaLabel="View Insights"
        />
      </div>

      {/* E. Upcoming Posts */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Scheduling</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Upcoming Posts</h3>
        <Card>
          <CardContent>
            <p className="sb-body" style={{ color: "#6d8d9f" }}>
              No posts scheduled yet. Connect social accounts to start scheduling.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* F. Activity Feed */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Timeline</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Recent Activity</h3>
        <Card>
          <CardContent>
            <p className="sb-body" style={{ color: "#6d8d9f" }}>
              Your activity will appear here as you create brands, generate images, and schedule posts.
            </p>
          </CardContent>
        </Card>
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
