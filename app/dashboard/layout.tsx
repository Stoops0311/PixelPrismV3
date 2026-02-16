"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DS2ThemeProvider } from "@/components/ds2/theme-provider"
import { AppSidebar } from "@/components/ds2/sidebar"
import { DashboardHeader } from "@/components/ds2/dashboard-header"
import {
  MOCK_BRANDS,
  MOCK_USER,
  MOCK_CREDITS,
  MOCK_SUBSCRIPTION,
  MOCK_BRAND_COUNTS,
  MOCK_PRODUCTS,
} from "@/lib/mock-data"

const SIDEBAR_STORAGE_KEY = "pixelprism-sidebar-open"

/** Map route segments to breadcrumb labels */
const ROUTE_LABELS: Record<string, string> = {
  logos: "Logos",
  products: "Products",
  gallery: "Gallery",
  studio: "Studio",
  scheduling: "Scheduling",
  analytics: "Analytics",
  brands: "All Brands",
  billing: "Billing & Credits",
}

function buildBreadcrumbs(pathname: string) {
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
  const brand = MOCK_BRANDS.find((b) => b.slug === brandSlug)

  if (brand) {
    crumbs.push({ label: brand.name, href: `/dashboard/${brand.slug}` })

    if (segments[1]) {
      // Check for product detail: /dashboard/[brandSlug]/products/[id]
      if (segments[1] === "products" && segments[2]) {
        crumbs.push({
          label: ROUTE_LABELS[segments[1]] || segments[1],
          href: `/dashboard/${brand.slug}/products`,
        })
        const product = MOCK_PRODUCTS.find((p) => p.id === segments[2])
        crumbs.push({ label: product?.name || "Product" })
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

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

  // Derive current brand from URL
  const currentBrand = useMemo(() => {
    const match = pathname.match(/\/dashboard\/([^/]+)/)
    if (match) {
      const slug = match[1]
      // Skip known global routes
      if (slug === "brands" || slug === "billing") return MOCK_BRANDS[0]
      return MOCK_BRANDS.find((b) => b.slug === slug) ?? MOCK_BRANDS[0]
    }
    return MOCK_BRANDS[0]
  }, [pathname])

  const handleBrandChange = useCallback(
    (brandSlug: string) => {
      // If we're on a brand-scoped page, navigate to same page for new brand
      const match = pathname.match(/\/dashboard\/[^/]+(\/.+)?/)
      const subpath = match?.[1] ?? ""
      router.push(`/dashboard/${brandSlug}${subpath}`)
    },
    [pathname, router]
  )

  const breadcrumbs = useMemo(() => buildBreadcrumbs(pathname), [pathname])

  return (
    <DS2ThemeProvider>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider
          defaultOpen={sidebarOpen}
          open={sidebarOpen}
          onOpenChange={handleSidebarOpenChange}
        >
          <AppSidebar
            brands={MOCK_BRANDS}
            currentBrand={currentBrand}
            onBrandChange={handleBrandChange}
            user={MOCK_USER}
            logosHasNotification={true}
            brandNavCounts={MOCK_BRAND_COUNTS}
          />
          <SidebarInset>
            <DashboardHeader
              breadcrumbs={breadcrumbs}
              credits={MOCK_CREDITS}
              plan={MOCK_SUBSCRIPTION.plan}
              hasNotifications={true}
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
