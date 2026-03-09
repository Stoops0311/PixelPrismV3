"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  ShoppingBag01Icon,
  Image02Icon,
  Calendar03Icon,
  Analytics01Icon,
  Home01Icon,
  GridViewIcon,
  CreditCardIcon,
  Link04Icon,
  Settings01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { BrandSwitcher } from "@/components/ds2/brand-switcher"
import type { Brand, DashboardUser, BrandNavCounts } from "@/types/dashboard"

interface AppSidebarProps {
  brands: Brand[]
  currentBrand: Brand | null
  onBrandChange: (brandSlug: string) => void
  user: DashboardUser
  brandNavCounts?: BrandNavCounts
}

const BRAND_NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardSquare01Icon, path: "" },
  { label: "Products", icon: ShoppingBag01Icon, path: "/products", countKey: "products" as const },
  { label: "Studio", icon: Image02Icon, path: "/studio", countKey: "studio" as const },
  { label: "Scheduling", icon: Calendar03Icon, path: "/scheduling", countKey: "scheduling" as const },
  { label: "Analytics", icon: Analytics01Icon, path: "/analytics" },
  { label: "Social Accounts", icon: Link04Icon, path: "/settings/social", countKey: "social" as const },
]

const ACCOUNT_NAV_ITEMS = [
  { label: "Overview", icon: Home01Icon, href: "/dashboard" },
  { label: "All Brands", icon: GridViewIcon, href: "/dashboard/brands" },
  { label: "Billing & Credits", icon: CreditCardIcon, href: "/dashboard/billing" },
]

export function AppSidebar({
  brands,
  currentBrand,
  onBrandChange,
  user,
  brandNavCounts,
}: AppSidebarProps) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const clerk = useClerk()

  return (
    <Sidebar side="left" collapsible="icon">
      {/* ── Logo + Brand Switcher ────────────────────── */}
      <SidebarHeader>
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between px-1"}`}>
          <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
            {/* Logo mark */}
            <div
              className="w-8 h-8 shrink-0 flex items-center justify-center"
              style={{
                background: "#f4b964",
                boxShadow: "0 0 12px rgba(244, 185, 100, 0.25)",
              }}
            >
              <span
                style={{
                  color: "#071a26",
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                P
              </span>
            </div>
            {!collapsed && (
              <span
                className="sb-h4 truncate"
                style={{ color: "#eaeef1", letterSpacing: "-0.02em" }}
              >
                PixelPrism
              </span>
            )}
          </div>
          {!collapsed && (
            <SidebarTrigger className="hidden lg:flex" />
          )}
        </div>

        <BrandSwitcher
          brands={brands}
          currentBrand={currentBrand}
          onBrandChange={onBrandChange}
        />
      </SidebarHeader>

      <SidebarSeparator />

      {/* ── Main Navigation ──────────────────────────── */}
      <SidebarContent>
        {/* Brand-scoped navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Brand</SidebarGroupLabel>
          <SidebarMenu>
            {BRAND_NAV_ITEMS.map((item) => {
              const href = currentBrand
                ? `/dashboard/${currentBrand.slug}${item.path}`
                : "/dashboard"

              // Determine active state
              let isActive = false
              if (currentBrand) {
                const brandBase = `/dashboard/${currentBrand.slug}`
                if (item.path === "") {
                  // Dashboard — active only on exact brand path
                  isActive = pathname === brandBase
                } else {
                  isActive = pathname.startsWith(`${brandBase}${item.path}`)
                }
              }

              const count = item.countKey ? brandNavCounts?.[item.countKey] : undefined

              // Tooltip includes count when available
              const tooltipText = count !== undefined
                ? `${item.label} (${count})`
                : item.label

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={tooltipText}
                  >
                    <Link href={href}>
                      <span className="sb-icon-wrapper">
                        <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>

                  {/* Count badge (hidden when collapsed via shadcn class) */}
                  {count !== undefined && (
                    <SidebarMenuBadge>{count}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Account-level navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            {ACCOUNT_NAV_ITEMS.map((item) => {
              let isActive = false
              if (item.href === "/dashboard") {
                isActive = pathname === "/dashboard"
              } else {
                isActive = pathname.startsWith(item.href)
              }

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* ── User Profile Footer ──────────────────────── */}
      <SidebarFooter>
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 shrink-0">
                {user.imageUrl && (
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                )}
                <AvatarFallback
                  style={{
                    background: "#163344",
                    color: "#6d8d9f",
                    border: "1px solid rgba(244,185,100,0.12)",
                    fontFamily: "'Neue Montreal', sans-serif",
                    fontWeight: 500,
                    fontSize: "11px",
                  }}
                >
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right" hidden={!collapsed}>
              {user.name}
            </TooltipContent>
          </Tooltip>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div
                className="truncate"
                style={{
                  color: "#eaeef1",
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                }}
              >
                {user.name}
              </div>
              <div className="sb-caption truncate" style={{ color: "#6d8d9f" }}>
                {user.email}
              </div>
            </div>
          )}

          {!collapsed && (
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 transition-all duration-200 hover:text-[#f4b964] hover:-translate-y-px active:translate-y-px cursor-pointer"
                style={{
                  color: "#6d8d9f",
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onClick={() => clerk.openUserProfile()}
              >
                <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} className="size-4" />
              </button>
              <button
                className="p-1.5 transition-all duration-200 hover:text-[#e85454] hover:-translate-y-px active:translate-y-px cursor-pointer"
                style={{
                  color: "#6d8d9f",
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} className="size-4" />
              </button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
