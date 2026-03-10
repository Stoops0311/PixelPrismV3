"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DS2ThemeProvider } from "@/components/ds2/theme-provider"
import { AppSidebar } from "@/components/ds2/sidebar"
import { DashboardHeader } from "@/components/ds2/dashboard-header"
import { DS2Spinner } from "@/components/ds2/spinner"
import type { Brand, DashboardUser, BrandNavCounts } from "@/types/dashboard"

const SIDEBAR_STORAGE_KEY = "pixelprism-sidebar-open"

/** Map route segments to breadcrumb labels */
const ROUTE_LABELS: Record<string, string> = {
  products: "Products",
  gallery: "Gallery",
  studio: "Studio",
  scheduling: "Scheduling",
  analytics: "Analytics",
  social: "Social Accounts",
  settings: "Settings",
  brands: "All Brands",
  billing: "Billing & Credits",
}

function buildBreadcrumbs(
  pathname: string,
  brands: Brand[]
) {
  const crumbs: { label: string; href?: string }[] = []

  // Strip /dashboard prefix
  const rest = pathname.replace(/^\/dashboard\/?/, "")

  if (!rest) {
    // /dashboard — Global Overview
    crumbs.push({ label: "Overview" })
    return crumbs
  }

  const segments = rest.split("/").filter(Boolean)

  // Check if first segment is a known global route
  if (segments[0] === "brands" || segments[0] === "billing") {
    crumbs.push({ label: ROUTE_LABELS[segments[0]] || segments[0] })
    return crumbs
  }

  // Brand-scoped routes: [brandSlug] / [page]
  const brandSlug = segments[0]
  const brand = brands.find((b) => b.slug === brandSlug)

  if (brand) {
    crumbs.push({ label: brand.name, href: `/dashboard/${brand.slug}` })

    if (segments[1]) {
      // Check for product detail: /dashboard/[brandSlug]/products/[id]
      if (segments[1] === "products" && segments[2]) {
        crumbs.push({
          label: ROUTE_LABELS[segments[1]] || segments[1],
          href: `/dashboard/${brand.slug}/products`,
        })
        crumbs.push({ label: "Product" })
      } else if (segments[1] === "settings" && segments[2]) {
        crumbs.push({
          label: ROUTE_LABELS[segments[1]] || segments[1],
          href: `/dashboard/${brand.slug}/settings`,
        })
        crumbs.push({ label: ROUTE_LABELS[segments[2]] || segments[2] })
      } else {
        crumbs.push({ label: ROUTE_LABELS[segments[1]] || segments[1] })
      }
    } else {
      // On brand dashboard, replace the brand crumb with non-link version
      crumbs[0] = { label: brand.name }
    }
  }

  return crumbs
}

/** Map a Convex brand document to the Brand shape expected by sidebar/UI */
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

/** Map a Convex user document to the DashboardUser shape */
function toUser(doc: any): DashboardUser {
  const name = doc.name || doc.email.split("@")[0]
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return {
    id: doc._id,
    name,
    email: doc.email,
    initials,
    imageUrl: doc.imageUrl,
  }
}

/** Map subscription tier string to plan label */
function tierToPlan(tier: string): "Free" | "Starter" | "Professional" | "Enterprise" {
  switch (tier) {
    case "starter":
      return "Starter"
    case "professional":
      return "Professional"
    case "enterprise":
      return "Enterprise"
    default:
      return "Free"
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoaded: clerkLoaded } = useAuth()

  // Convex queries
  const convexUser = useQuery(api.users.current)
  const convexBrands = useQuery(api.brands.list)
  const creditBalance = useQuery(api.credits.getBalance)

  // Load sidebar state from localStorage
  const [sidebarOpen, setSidebarOpen] = useState(true)
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (stored !== null) {
      setSidebarOpen(JSON.parse(stored))
    }
  }, [])

  const handleSidebarOpenChange = useCallback((open: boolean) => {
    setSidebarOpen(open)
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(open))
  }, [])

  // Transform Convex data to UI shapes
  const brands = useMemo<Brand[]>(
    () => (convexBrands ?? []).map(toBrand),
    [convexBrands]
  )

  const user = useMemo<DashboardUser | null>(
    () => (convexUser ? toUser(convexUser) : null),
    [convexUser]
  )

  const credits = creditBalance?.total ?? 0
  const plan = convexUser ? tierToPlan(convexUser.subscriptionTier) : undefined

  // Build nav counts from first brand (if available)
  const currentBrandDoc = useMemo(() => {
    if (!convexBrands?.length) return null
    const match = pathname.match(/\/dashboard\/([^/]+)/)
    if (match) {
      const slug = match[1]
      if (slug === "brands" || slug === "billing") return convexBrands[0]
      return convexBrands.find((b) => b.slug === slug) ?? convexBrands[0]
    }
    return convexBrands[0]
  }, [pathname, convexBrands])

  const brandNavCounts = useMemo<BrandNavCounts>(() => {
    if (!currentBrandDoc) return {}
    return {
      products: currentBrandDoc.productsCount ?? 0,
      studio: currentBrandDoc.generatedImagesCount ?? 0,
      scheduling: currentBrandDoc.scheduledPostsCount ?? 0,
      social: currentBrandDoc.connectedPlatformCount ?? 0,
    }
  }, [currentBrandDoc])

  // Derive current brand from URL
  const currentBrand = useMemo<Brand | null>(() => {
    if (!brands.length) return null
    const match = pathname.match(/\/dashboard\/([^/]+)/)
    if (match) {
      const slug = match[1]
      if (slug === "brands" || slug === "billing") return brands[0]
      return brands.find((b) => b.slug === slug) ?? brands[0]
    }
    return brands[0]
  }, [pathname, brands])

  const handleBrandChange = useCallback(
    (brandSlug: string) => {
      // If we're on a brand-scoped page, navigate to same page for new brand
      const match = pathname.match(/\/dashboard\/[^/]+(\/.+)?/)
      const subpath = match?.[1] ?? ""
      router.push(`/dashboard/${brandSlug}${subpath}`)
    },
    [pathname, router]
  )

  const breadcrumbs = useMemo(
    () => buildBreadcrumbs(pathname, brands),
    [pathname, brands]
  )

  // Show loading state while data loads
  if (!clerkLoaded || convexUser === undefined || convexBrands === undefined) {
    return (
      <DS2ThemeProvider>
        <div className="flex items-center justify-center min-h-screen">
          <DS2Spinner size="lg" />
        </div>
      </DS2ThemeProvider>
    )
  }

  // Fallback user if not found yet
  const displayUser = user ?? {
    id: "",
    name: "User",
    email: "",
    initials: "U",
  }

  return (
    <DS2ThemeProvider>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider
          defaultOpen={sidebarOpen}
          open={sidebarOpen}
          onOpenChange={handleSidebarOpenChange}
        >
          <AppSidebar
            brands={brands}
            currentBrand={currentBrand}
            onBrandChange={handleBrandChange}
            user={displayUser}
            brandNavCounts={brandNavCounts}
          />
          <SidebarInset>
            <DashboardHeader
              breadcrumbs={breadcrumbs}
              credits={credits}
              plan={plan}


            />
            <main data-slot="dashboard-main" className="w-full flex-1 flex flex-col">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </DS2ThemeProvider>
  )
}
