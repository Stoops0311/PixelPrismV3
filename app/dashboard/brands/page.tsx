// @ts-nocheck — Convex mock: remove when restoring real Convex (see lib/convex-mock.ts)
"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery, useMutation } from "@/lib/convex-mock"
import { api } from "@/convex/_generated/api"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MoreHorizontalCircle01Icon,
  PlusSignIcon,
  Delete02Icon,
  Copy01Icon,
  Archive02Icon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DS2Spinner } from "@/components/ds2/spinner"
import { CreateBrandDialog } from "@/components/ds2/create-brand-dialog"
import { UpgradeDialog } from "@/components/ds2/upgrade-dialog"
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog"
import { formatDistanceToNow } from "date-fns"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import type { SubscriptionTier } from "@/lib/polar"

// ── Helpers ─────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// ── Brand Card (page-local) ──────────────────────────────────────────────

function BrandCard({
  brand,
  onDelete,
}: {
  brand: Doc<"brands">
  onDelete: (brandId: Id<"brands">) => void
}) {
  const initials = getInitials(brand.name)

  return (
    <Link href={`/dashboard/${brand.slug}`}>
      <Card className="cursor-pointer h-full">
        <CardContent>
          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback
                  style={{
                    background: "rgba(244,185,100,0.08)",
                    color: "#f4b964",
                    fontFamily: "'Neue Montreal', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="sb-h4" style={{ color: "#eaeef1" }}>
                  {brand.name}
                </h3>
                <p className="sb-body-sm" style={{ color: "#6d8d9f", marginTop: 2 }}>
                  {brand.description}
                </p>
              </div>
            </div>

            {/* Kebab menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 cursor-pointer transition-all hover:bg-[rgba(244,185,100,0.04)]"
                  style={{
                    transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <HugeiconsIcon
                    icon={MoreHorizontalCircle01Icon}
                    size={20}
                    color="#6d8d9f"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <DropdownMenuItem>
                  <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                  Edit Brand
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Copy01Icon} size={16} />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Archive02Icon} size={16} />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(brand._id)}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Platform icons */}
          <div
            className="flex items-center gap-3 mb-5"
            style={{
              paddingBottom: 12,
              borderBottom: "1px solid rgba(244,185,100,0.06)",
            }}
          >
            {brand.connectedPlatformCount > 0 ? (
              <span className="sb-caption" style={{ color: "#6d8d9f" }}>
                {brand.connectedPlatformCount} platform{brand.connectedPlatformCount !== 1 ? "s" : ""} connected
              </span>
            ) : (
              <span className="sb-caption" style={{ color: "#6d8d9f" }}>
                No platforms connected
              </span>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>
                Followers
              </p>
              <p className="sb-data" style={{ color: "#eaeef1", marginTop: 2 }}>
                {brand.totalFollowers.toLocaleString()}
              </p>
            </div>
            <div style={{ borderLeft: "1px solid rgba(244,185,100,0.08)", paddingLeft: 16 }}>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>
                Products
              </p>
              <p className="sb-data" style={{ color: "#eaeef1", marginTop: 2 }}>
                {brand.productsCount}
              </p>
            </div>
            <div style={{ borderLeft: "1px solid rgba(244,185,100,0.08)", paddingLeft: 16 }}>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>
                Images
              </p>
              <p className="sb-data" style={{ color: "#eaeef1", marginTop: 2 }}>
                {brand.generatedImagesCount}
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="sb-caption" style={{ color: "#6d8d9f" }} suppressHydrationWarning>
            {brand.lastActiveAt
              ? `Active ${formatDistanceToNow(new Date(brand.lastActiveAt), { addSuffix: true })}`
              : `Created ${formatDistanceToNow(new Date(brand.createdAt), { addSuffix: true })}`}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function BrandsListPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const upgrade = useUpgradeDialog()

  const brands = useQuery(api.brands.list)
  const user = useQuery(api.users.current)
  const removeBrand = useMutation(api.brands.remove)

  // Loading state
  if (brands === undefined || user === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <DS2Spinner />
      </div>
    )
  }

  const brandsUsed = brands.length
  const brandsMax = user?.maxBrands ?? 1
  const usagePercent = brandsMax > 0 ? (brandsUsed / brandsMax) * 100 : 0

  function handleCreateBrandClick() {
    if (brandsUsed >= brandsMax) {
      upgrade.showUpgrade({ kind: "brands", currentCount: brandsUsed, maxCount: brandsMax })
      return
    }
    setDialogOpen(true)
  }

  async function handleDelete(brandId: Id<"brands">) {
    try {
      await removeBrand({ brandId })
    } catch {
      // Error is handled by Convex
    }
  }

  return (
    <div className="px-4 lg:px-0 space-y-8 lg:space-y-32 py-4 lg:py-0">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h1 className="sb-h1" style={{ color: "#eaeef1" }}>
            Your Brands
          </h1>
          <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
            Manage and organize your brand portfolio.
          </p>
        </div>

        {/* Brands Remaining Indicator */}
        <div
          className="flex-shrink-0 hidden sm:flex flex-col items-end gap-2"
          style={{ minWidth: 160 }}
        >
          <div className="flex items-baseline gap-1.5">
            <span
              className="sb-data"
              style={{ color: "#eaeef1", fontSize: 18, fontWeight: 700, lineHeight: 1 }}
            >
              {brandsUsed}
            </span>
            <span className="sb-body-sm" style={{ color: "#6d8d9f" }}>
              of {brandsMax}
            </span>
          </div>
          <div style={{ width: 120 }}>
            <Progress value={usagePercent} />
          </div>
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
            brands used
          </span>
        </div>

        <Button className="sb-btn-primary flex-shrink-0" onClick={handleCreateBrandClick}>
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          Create Brand
        </Button>

        <CreateBrandDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>

      {/* Brand Cards Grid */}
      {brands.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div
              className="flex items-center justify-center mb-4"
              style={{
                width: 48,
                height: 48,
                background: "rgba(244,185,100,0.08)",
                border: "1px solid rgba(244,185,100,0.12)",
              }}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={20} color="#f4b964" />
            </div>
            <h3 className="sb-h4" style={{ color: "#eaeef1", marginBottom: 4 }}>
              Create your first brand
            </h3>
            <p className="sb-body-sm" style={{ color: "#6d8d9f", marginBottom: 16 }}>
              Get started by setting up a brand to create and schedule content.
            </p>
            <Button className="sb-btn-primary" onClick={handleCreateBrandClick}>
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              Create Brand
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <BrandCard key={brand._id} brand={brand} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <UpgradeDialog
        open={upgrade.open}
        onOpenChange={upgrade.onOpenChange}
        context={upgrade.context}
        currentTier={(user?.subscriptionTier ?? "free") as SubscriptionTier}
      />
    </div>
  )
}
