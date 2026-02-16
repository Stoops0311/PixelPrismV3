"use client"

import { useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InstagramIcon,
  TiktokIcon,
  Facebook02Icon,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MOCK_BRAND_DETAILS, MOCK_SUBSCRIPTION } from "@/lib/mock-data"
import type { BrandDetail } from "@/types/dashboard"
import { formatDistanceToNow } from "date-fns"

// ── Platform Icon Map ────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, { icon: typeof InstagramIcon; label: string }> = {
  instagram: { icon: InstagramIcon, label: "Instagram" },
  tiktok: { icon: TiktokIcon, label: "TikTok" },
  facebook: { icon: Facebook02Icon, label: "Facebook" },
}

// ── Brand Card (page-local) ──────────────────────────────────────────────

function BrandCard({ brand }: { brand: BrandDetail }) {
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
                  {brand.initials}
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
                <DropdownMenuItem variant="destructive">
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
            {brand.connectedPlatforms.map((platform) => {
              const p = PLATFORM_ICONS[platform]
              if (!p) return null
              return (
                <Tooltip key={platform}>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <HugeiconsIcon
                        icon={p.icon}
                        size={18}
                        color="#6d8d9f"
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{p.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>
                Followers
              </p>
              <p className="sb-data" style={{ color: "#eaeef1", marginTop: 2 }}>
                {brand.followers.toLocaleString()}
              </p>
            </div>
            <div style={{ borderLeft: "1px solid rgba(244,185,100,0.08)", paddingLeft: 16 }}>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>
                Posts
              </p>
              <p className="sb-data" style={{ color: "#eaeef1", marginTop: 2 }}>
                {brand.postsThisMonth}
              </p>
            </div>
            <div style={{ borderLeft: "1px solid rgba(244,185,100,0.08)", paddingLeft: 16 }}>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>
                Credits
              </p>
              <p className="sb-data" style={{ color: "#eaeef1", marginTop: 2 }}>
                {brand.creditsUsed}
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="sb-caption" style={{ color: "#6d8d9f" }} suppressHydrationWarning>
            Active {formatDistanceToNow(new Date(brand.lastActive), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function BrandsListPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const brandsUsed = MOCK_BRAND_DETAILS.length
  const brandsMax = MOCK_SUBSCRIPTION.maxBrands
  const usagePercent = (brandsUsed / brandsMax) * 100

  return (
    <div className="space-y-8">
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="sb-btn-primary flex-shrink-0">
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              Create Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle
                className="sb-h3"
                style={{ color: "#eaeef1" }}
              >
                Create New Brand
              </DialogTitle>
              <DialogDescription
                className="sb-body-sm"
                style={{ color: "#6d8d9f" }}
              >
                Set up a new brand to start creating content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input placeholder="e.g. Sunrise Coffee Co" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="A short description of your brand..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="sb-btn-secondary"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="sb-btn-primary" disabled>
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_BRAND_DETAILS.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  )
}
