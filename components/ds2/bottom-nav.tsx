"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  ShoppingBag01Icon,
  Image02Icon,
  Calendar03Icon,
  Menu01Icon,
  Analytics01Icon,
  Link04Icon,
  Home01Icon,
  GridViewIcon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BrandSwitcher } from "@/components/ds2/brand-switcher"
import { useHaptics } from "@/hooks/use-haptics"
import type { Brand, BrandNavCounts } from "@/types/dashboard"

interface BottomNavProps {
  currentBrand: Brand | null
  brands: Brand[]
  onBrandChange: (brandSlug: string) => void
  brandNavCounts?: BrandNavCounts
}

const BOTTOM_NAV_ITEMS = [
  { label: "Home", icon: DashboardSquare01Icon, path: "" },
  { label: "Products", icon: ShoppingBag01Icon, path: "/products" },
  { label: "Studio", icon: Image02Icon, path: "/studio" },
  { label: "Schedule", icon: Calendar03Icon, path: "/scheduling" },
]

const MORE_BRAND_ITEMS = [
  { label: "Analytics", icon: Analytics01Icon, path: "/analytics" },
  { label: "Social Accounts", icon: Link04Icon, path: "/settings/social" },
]

const MORE_ACCOUNT_ITEMS = [
  { label: "Overview", icon: Home01Icon, href: "/dashboard" },
  { label: "All Brands", icon: GridViewIcon, href: "/dashboard/brands" },
  { label: "Billing & Credits", icon: CreditCardIcon, href: "/dashboard/billing" },
]

export function BottomNavBar({
  currentBrand,
  brands,
  onBrandChange,
  brandNavCounts,
}: BottomNavProps) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { tapLight } = useHaptics()

  const brandBase = currentBrand
    ? `/dashboard/${currentBrand.slug}`
    : "/dashboard"

  // Smart hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < 80) {
        setVisible(true)
      } else if (currentY > lastScrollY + 8) {
        setVisible(false)
      } else if (currentY < lastScrollY - 4) {
        setVisible(true)
      }
      setLastScrollY(currentY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Check if any "More" item is active
  const isMoreActive =
    MORE_BRAND_ITEMS.some((item) =>
      pathname.startsWith(`${brandBase}${item.path}`)
    ) ||
    MORE_ACCOUNT_ITEMS.some((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href)
    )

  return (
    <nav
      className="fixed z-50 lg:hidden"
      style={{
        bottom: visible ? "calc(12px + env(safe-area-inset-bottom, 0px))" : "-80px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: 420,
        background: "rgba(10, 32, 46, 0.92)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        borderRadius: 28,
        border: "1px solid rgba(244, 185, 100, 0.1)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        transition: "bottom 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease",
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: 56,
          padding: "0 4px",
        }}
      >
        {BOTTOM_NAV_ITEMS.map((item) => {
          const href = currentBrand
            ? `${brandBase}${item.path}`
            : "/dashboard"

          let isActive = false
          if (item.path === "") {
            isActive =
              pathname === brandBase ||
              (pathname === "/dashboard" && !currentBrand)
          } else {
            isActive = pathname.startsWith(`${brandBase}${item.path}`)
          }

          return (
            <Link
              key={item.label}
              href={href}
              onClick={() => tapLight()}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "6px 10px",
                textDecoration: "none",
                transition: "transform 150ms ease",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  background: isActive
                    ? "rgba(244, 185, 100, 0.15)"
                    : "transparent",
                  transition: "background 200ms ease, transform 150ms ease",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="size-[20px]"
                  style={{
                    color: isActive ? "#f4b964" : "#5a7d8f",
                    transition: "color 200ms ease",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#f4b964" : "#5a7d8f",
                  letterSpacing: "0.01em",
                  lineHeight: 1,
                  transition: "color 200ms ease",
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* More button */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              onClick={() => tapLight()}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "6px 10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  background: isMoreActive
                    ? "rgba(244, 185, 100, 0.15)"
                    : "transparent",
                  transition: "background 200ms ease",
                }}
              >
                <HugeiconsIcon
                  icon={Menu01Icon}
                  strokeWidth={isMoreActive ? 2.5 : 1.8}
                  className="size-[20px]"
                  style={{
                    color: isMoreActive ? "#f4b964" : "#5a7d8f",
                    transition: "color 200ms ease",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isMoreActive ? 600 : 500,
                  color: isMoreActive ? "#f4b964" : "#5a7d8f",
                  letterSpacing: "0.01em",
                  lineHeight: 1,
                  transition: "color 200ms ease",
                }}
              >
                More
              </span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="sb-more-sheet"
            style={{
              background: "#0e2838",
              borderColor: "rgba(244, 185, 100, 0.12)",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <SheetTitle className="sr-only">More navigation</SheetTitle>

            {/* Sheet handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: "rgba(244, 185, 100, 0.2)",
                }}
              />
            </div>

            {/* Brand Switcher */}
            <div className="px-4 py-3">
              <BrandSwitcher
                brands={brands}
                currentBrand={currentBrand}
                onBrandChange={(slug) => {
                  onBrandChange(slug)
                  setMoreOpen(false)
                }}
              />
            </div>

            {/* Separator */}
            <div
              style={{
                height: 1,
                background: "rgba(244, 185, 100, 0.08)",
                margin: "0 16px",
              }}
            />

            {/* Brand-scoped items */}
            <div className="px-2 py-2">
              <p
                className="sb-label px-3 py-2"
                style={{ color: "#e8956a" }}
              >
                Brand
              </p>
              {MORE_BRAND_ITEMS.map((item) => {
                const href = `${brandBase}${item.path}`
                const isActive = pathname.startsWith(href)
                return (
                  <Link
                    key={item.label}
                    href={href}
                    className="sb-more-nav-item"
                    data-active={isActive}
                    onClick={() => {
                      tapLight()
                      setMoreOpen(false)
                    }}
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={2}
                      className="size-5"
                    />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Separator */}
            <div
              style={{
                height: 1,
                background: "rgba(244, 185, 100, 0.08)",
                margin: "0 16px",
              }}
            />

            {/* Account items */}
            <div className="px-2 py-2 pb-4">
              <p
                className="sb-label px-3 py-2"
                style={{ color: "#e8956a" }}
              >
                Account
              </p>
              {MORE_ACCOUNT_ITEMS.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="sb-more-nav-item"
                    data-active={isActive}
                    onClick={() => {
                      tapLight()
                      setMoreOpen(false)
                    }}
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={2}
                      className="size-5"
                    />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
