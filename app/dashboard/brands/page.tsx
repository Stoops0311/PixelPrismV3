"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery, useMutation } from "convex/react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DS2Spinner } from "@/components/ds2/spinner"
import { formatDistanceToNow } from "date-fns"
import type { Doc, Id } from "@/convex/_generated/dataModel"

// ── Helpers ─────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// ── Brand Creation Constants ─────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  "E-commerce",
  "Food & Beverage",
  "Health & Wellness",
  "Fashion & Beauty",
  "Technology",
  "Home & Living",
  "Fitness",
  "Creative Services",
  "Education",
  "Travel & Hospitality",
  "Retail",
  "Other",
] as const

const VOICE_PRESETS = [
  "Professional",
  "Friendly",
  "Playful",
  "Bold",
  "Minimal",
] as const

function LogosMark() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x={0} y={2} width={8} height={8} fill="#f4b964" opacity={0.7} />
      <rect x={4} y={0} width={8} height={8} fill="#f4b964" />
    </svg>
  )
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
  const [step, setStep] = useState<1 | 2>(1)
  const [brandName, setBrandName] = useState("")
  const [brandDescription, setBrandDescription] = useState("")
  const [industry, setIndustry] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [brandVoice, setBrandVoice] = useState("Professional")
  const [isCreating, setIsCreating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"forward" | "back">("forward")

  const brands = useQuery(api.brands.list)
  const user = useQuery(api.users.current)
  const createBrand = useMutation(api.brands.create)
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

  const canContinue = brandName.trim().length >= 2

  function resetDialog() {
    setStep(1)
    setBrandName("")
    setBrandDescription("")
    setIndustry("")
    setTargetAudience("")
    setBrandVoice("Professional")
    setIsCreating(false)
    setShowSuccess(false)
    setAnimationDirection("forward")
  }

  function goToStep2() {
    if (!canContinue) return
    setAnimationDirection("forward")
    setStep(2)
  }

  function goToStep1() {
    setAnimationDirection("back")
    setStep(1)
  }

  async function handleCreate() {
    if (isCreating) return
    setIsCreating(true)
    try {
      await createBrand({
        name: brandName.trim(),
        description: brandDescription.trim() || "No description",
        industry: industry || "General",
        targetAudience: targetAudience.trim() || "General audience",
        brandVoice: brandVoice,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      setShowSuccess(true)
      setTimeout(() => {
        setDialogOpen(false)
        resetDialog()
      }, 600)
    } catch {
      // Error is handled by Convex
    } finally {
      if (!showSuccess) setIsCreating(false)
    }
  }

  async function handleDelete(brandId: Id<"brands">) {
    try {
      await removeBrand({ brandId })
    } catch {
      // Error is handled by Convex
    }
  }

  return (
    <div className="space-y-32">
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

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetDialog()
          }}
        >
          <DialogTrigger asChild>
            <Button className="sb-btn-primary flex-shrink-0">
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              Create Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            {/* Progress bar */}
            <div className="flex gap-1" style={{ marginBottom: 8 }}>
              <div
                className="flex-1"
                style={{
                  height: 2,
                  background: "#f4b964",
                  transition: "background 300ms ease",
                }}
              />
              <div
                className="flex-1"
                style={{
                  height: 2,
                  background: step === 2 ? "#f4b964" : "rgba(244,185,100,0.12)",
                  transition: "background 300ms ease",
                }}
              />
            </div>

            {/* Step content with animation */}
            <div
              key={step}
              style={{
                animation: `${animationDirection === "forward" ? "sb-step-in" : "sb-step-back"} 350ms cubic-bezier(0.34, 1.56, 0.64, 1) both`,
              }}
            >
              {step === 1 ? (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <LogosMark />
                    </div>
                    <DialogTitle className="sb-h3" style={{ color: "#eaeef1" }}>
                      Let&apos;s create something.
                    </DialogTitle>
                    <DialogDescription className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                      Give your brand a name to get started.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="sb-label">Brand Name</Label>
                      <Input
                        placeholder="e.g. Sunrise Coffee Co"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && canContinue) goToStep2()
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="sb-label">Description</Label>
                      <Textarea
                        placeholder="What does your brand do? (optional)"
                        rows={3}
                        value={brandDescription}
                        onChange={(e) => setBrandDescription(e.target.value)}
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
                    <Button
                      className="sb-btn-primary"
                      disabled={!canContinue}
                      onClick={goToStep2}
                    >
                      Continue
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <LogosMark />
                    </div>
                    <DialogTitle className="sb-h3" style={{ color: "#eaeef1" }}>
                      Help the assistant understand{" "}
                      <span style={{ color: "#f4b964" }}>{brandName.trim()}</span>
                    </DialogTitle>
                    <DialogDescription className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                      This helps your AI companion write better content.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Industry select */}
                    <div className="space-y-2">
                      <Label className="sb-label">Industry</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Target audience */}
                    <div className="space-y-2">
                      <Label className="sb-label">Target Audience</Label>
                      <Input
                        placeholder="e.g. Coffee lovers, ages 25-40"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>

                    {/* Brand voice toggle */}
                    <div className="space-y-2">
                      <Label className="sb-label">Brand Voice</Label>
                      <ToggleGroup
                        type="single"
                        value={brandVoice}
                        onValueChange={(val) => {
                          if (val) setBrandVoice(val)
                        }}
                        className="flex flex-wrap gap-2"
                      >
                        {VOICE_PRESETS.map((voice) => (
                          <ToggleGroupItem
                            key={voice}
                            value={voice}
                            className="sb-caption px-3 py-1.5"
                          >
                            {voice}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>

                    {/* Assistant hint */}
                    <div
                      style={{
                        padding: "10px 12px",
                        background: "rgba(244,185,100,0.04)",
                        border: "1px solid rgba(244,185,100,0.08)",
                      }}
                    >
                      <p className="sb-caption" style={{ color: "#6d8d9f" }}>
                        You can refine all of this later in Brand Settings.
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      className="sb-btn-ghost"
                      onClick={goToStep1}
                      disabled={isCreating}
                    >
                      Back
                    </Button>
                    <Button
                      className="sb-btn-primary"
                      onClick={handleCreate}
                      disabled={isCreating}
                    >
                      {showSuccess ? (
                        "Done"
                      ) : isCreating ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin"
                            width={14}
                            height={14}
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <circle
                              cx={7}
                              cy={7}
                              r={5.5}
                              stroke="currentColor"
                              strokeOpacity={0.25}
                              strokeWidth={2}
                            />
                            <path
                              d="M12.5 7a5.5 5.5 0 00-5.5-5.5"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                            />
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        "Create Brand"
                      )}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
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
            <Button className="sb-btn-primary" onClick={() => setDialogOpen(true)}>
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
    </div>
  )
}
