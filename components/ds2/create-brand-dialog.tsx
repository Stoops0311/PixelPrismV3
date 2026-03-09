"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@/lib/convex-mock"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { UpgradeDialog } from "@/components/ds2/upgrade-dialog"
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog"
import type { SubscriptionTier } from "@/lib/polar"

// ── Constants ───────────────────────────────────────────────────────────

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

// ── Component ───────────────────────────────────────────────────────────

interface CreateBrandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (brandSlug: string) => void
}

export function CreateBrandDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateBrandDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [brandName, setBrandName] = useState("")
  const [brandDescription, setBrandDescription] = useState("")
  const [industry, setIndustry] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [brandVoice, setBrandVoice] = useState("Professional")
  const [isCreating, setIsCreating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"forward" | "back">("forward")
  const upgrade = useUpgradeDialog()

  const brands = useQuery(api.brands.list)
  const user = useQuery(api.users.current)
  const createBrand = useMutation(api.brands.create)

  const brandsUsed = brands?.length ?? 0
  const brandsMax = user?.maxBrands ?? 1
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

  function handleOpenChange(nextOpen: boolean) {
    // If trying to open but at brand limit, show upgrade instead
    if (nextOpen && brandsUsed >= brandsMax) {
      upgrade.showUpgrade({ kind: "brands", currentCount: brandsUsed, maxCount: brandsMax })
      return
    }
    onOpenChange(nextOpen)
    if (!nextOpen) resetDialog()
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
      const result = await createBrand({
        name: brandName.trim(),
        description: brandDescription.trim() || "No description",
        industry: industry || "General",
        targetAudience: targetAudience.trim() || "General audience",
        brandVoice: brandVoice,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      setShowSuccess(true)
      const slug = result.slug
      setTimeout(() => {
        onOpenChange(false)
        resetDialog()
        onSuccess?.(slug)
      }, 600)
    } catch {
      // Error is handled by Convex
    } finally {
      if (!showSuccess) setIsCreating(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
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
                    onClick={() => onOpenChange(false)}
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

      <UpgradeDialog
        open={upgrade.open}
        onOpenChange={upgrade.onOpenChange}
        context={upgrade.context}
        currentTier={(user?.subscriptionTier ?? "free") as SubscriptionTier}
      />
    </>
  )
}
