"use client"

import { useState } from "react"
import { useAction } from "@/lib/convex-mock"
import { api } from "@/convex/_generated/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DS2Spinner } from "@/components/ds2/spinner"
import { showError } from "@/components/ds2/toast"
import {
  TIER_DETAILS,
  TIER_ORDER,
  CREDIT_PACKS,
  type UpgradeContext,
  type SubscriptionTier,
} from "@/lib/polar"

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  context: UpgradeContext | null
  currentTier: SubscriptionTier
}

function getUpgradeTiers(currentTier: SubscriptionTier) {
  const idx = TIER_ORDER.indexOf(currentTier)
  if (idx === -1) return TIER_ORDER.filter((t) => t !== "free" && t !== "none")
  return TIER_ORDER.slice(idx + 1).filter((t) => t !== "none")
}

function getRecommendedTier(currentTier: SubscriptionTier): SubscriptionTier | null {
  const upgrades = getUpgradeTiers(currentTier)
  return upgrades[0] ?? null
}

function getContextHeader(context: UpgradeContext, currentTier: SubscriptionTier) {
  const tierName = TIER_DETAILS[currentTier === "none" ? "free" : currentTier]?.name ?? "Free"

  switch (context.kind) {
    case "brands":
      return {
        title: "Ready for more brands?",
        description: `Your ${tierName} plan supports ${context.maxCount} brand${context.maxCount === 1 ? "" : "s"}. Upgrade to manage multiple businesses from one dashboard.`,
      }
    case "social_accounts":
      return {
        title: "Connect more accounts",
        description: `You're using all ${context.maxCount} social connection${context.maxCount === 1 ? "" : "s"} on ${tierName}. Upgrade to reach your audience everywhere.`,
      }
    case "credits":
      if (context.creditsAvailable <= 0) {
        return {
          title: "Out of credits",
          description: `You've used all your credits this month. Top up instantly or upgrade for more every month.`,
        }
      }
      return {
        title: "Not enough credits",
        description: `This generation needs ${context.creditsNeeded} credits. You have ${context.creditsAvailable} remaining.`,
      }
  }
}

function getRelevantFeature(context: UpgradeContext): "brands" | "social" | "credits" {
  switch (context.kind) {
    case "brands":
      return "brands"
    case "social_accounts":
      return "social"
    case "credits":
      return "credits"
  }
}

function TierFeatureList({
  tier,
  relevantFeature,
}: {
  tier: keyof typeof TIER_DETAILS
  relevantFeature: "brands" | "social" | "credits"
}) {
  const details = TIER_DETAILS[tier]
  const features = [
    { key: "brands", label: `${details.maxBrands} brand${details.maxBrands === 1 ? "" : "s"}` },
    { key: "social", label: `${details.maxSocialAccounts} social account${details.maxSocialAccounts === 1 ? "" : "s"}` },
    { key: "credits", label: `${details.monthlyCredits} credits/mo` },
  ]

  // Move the relevant feature to the top
  features.sort((a, b) => {
    if (a.key === relevantFeature) return -1
    if (b.key === relevantFeature) return 1
    return 0
  })

  return (
    <ul className="flex flex-col gap-2">
      {features.map((f) => (
        <li key={f.key} className="flex items-center gap-2">
          {f.key === relevantFeature ? (
            <span
              className="flex-shrink-0"
              style={{ color: "#f4b964", fontSize: "10px", lineHeight: 1 }}
            >
              &#9670;
            </span>
          ) : (
            <span
              className="flex-shrink-0"
              style={{
                width: "4px",
                height: "4px",
                background: "rgba(244, 185, 100, 0.45)",
              }}
            />
          )}
          <span className="sb-body-sm" style={{ color: "#d4dce2" }}>
            {f.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function UpgradeDialog({
  open,
  onOpenChange,
  context,
  currentTier,
}: UpgradeDialogProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const generatePlanCheckoutLink = useAction(api.polar.generatePlanCheckoutLink)
  const generateTopUpCheckoutLink = useAction(api.polar.generateTopUpCheckoutLink)

  if (!context) return null

  const normalizedTier: keyof typeof TIER_DETAILS = (currentTier === "none" ? "free" : currentTier) as keyof typeof TIER_DETAILS
  const upgradeTiers = getUpgradeTiers(normalizedTier)
  const recommendedTier = getRecommendedTier(normalizedTier)
  const header = getContextHeader(context, normalizedTier)
  const relevantFeature = getRelevantFeature(context)
  const isCreditsContext = context.kind === "credits"
  const hasUpgradeTiers = upgradeTiers.length > 0

  const handlePlanCheckout = async (tier: "starter" | "professional" | "enterprise") => {
    try {
      setLoadingAction(`plan:${tier}`)
      const result = await generatePlanCheckoutLink({
        tier,
        origin: window.location.origin,
        successUrl: window.location.href,
      })
      window.location.href = result.url
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to start checkout"
      showError("Checkout failed", message)
      setLoadingAction(null)
    }
  }

  const handleCreditsCheckout = async (packKey: "credits_100" | "credits_300" | "credits_1000") => {
    try {
      setLoadingAction(`credits:${packKey}`)
      const result = await generateTopUpCheckoutLink({
        packKey,
        origin: window.location.origin,
        successUrl: window.location.href,
      })
      window.location.href = result.url
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to start checkout"
      showError("Checkout failed", message)
      setLoadingAction(null)
    }
  }

  // Show only upgrade tiers (current plan info is in the banner)
  const displayTiers: (keyof typeof TIER_DETAILS)[] = upgradeTiers.slice(0, 3) as (keyof typeof TIER_DETAILS)[]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-none p-0 gap-0"
        style={{ maxWidth: "780px", width: "calc(100vw - 32px)", maxHeight: "calc(100vh - 48px)", overflowY: "auto" }}
      >
        {/* Context Banner */}
        <div
          className="px-6 py-3"
          style={{
            background: "rgba(232, 149, 106, 0.08)",
            borderBottom: "1px solid rgba(232, 149, 106, 0.14)",
          }}
        >
          <DialogHeader className="space-y-1">
            <DialogTitle
              className="sb-title-sm"
              style={{ color: "#eaeef1", fontSize: "18px" }}
            >
              {header.title}
            </DialogTitle>
            <DialogDescription className="sb-body-sm" style={{ color: "#d4dce2" }}>
              {header.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Credits Quick Top-Up Section (credits context only) */}
        {isCreditsContext && (
          <div className="px-6 pt-5 pb-1">
            <p
              className="sb-label mb-3"
              style={{
                color: "#e8956a",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                fontSize: "11px",
              }}
            >
              Quick top-up
            </p>
            <div className="grid grid-cols-3 gap-3">
              {CREDIT_PACKS.map((pack) => {
                const isLoading = loadingAction === `credits:${pack.key}`
                const isDisabled = loadingAction !== null && !isLoading
                return (
                  <div
                    key={pack.key}
                    className="flex flex-col items-center p-4 transition-all"
                    style={{
                      background: "rgba(244, 185, 100, 0.03)",
                      border: "1px solid rgba(244, 185, 100, 0.08)",
                      transitionDuration: "300ms",
                      transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(244, 185, 100, 0.18)"
                      e.currentTarget.style.transform = "translateY(-2px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(244, 185, 100, 0.08)"
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    <span
                      className="sb-data"
                      style={{ fontSize: "20px", color: "#f4b964", lineHeight: 1 }}
                    >
                      {pack.credits}
                    </span>
                    <span
                      className="sb-caption mt-1"
                      style={{ color: "#6d8d9f" }}
                    >
                      credits
                    </span>
                    <span
                      className="sb-data mt-2"
                      style={{ fontSize: "14px", color: "#d4dce2" }}
                    >
                      ${pack.price}
                    </span>
                    <Button
                      className="sb-btn-secondary w-full mt-3"
                      size="sm"
                      disabled={isDisabled}
                      onClick={() => handleCreditsCheckout(pack.key)}
                    >
                      {isLoading ? <DS2Spinner /> : "Buy"}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Divider between credits and tier upgrade */}
        {isCreditsContext && hasUpgradeTiers && (
          <div className="px-6 pt-4 pb-1">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="sb-caption" style={{ color: "#6d8d9f", whiteSpace: "nowrap" }}>
                or get more every month
              </span>
              <Separator className="flex-1" />
            </div>
          </div>
        )}

        {/* Tier Cards */}
        {hasUpgradeTiers && (
          <div className="px-6 pt-4 pb-2">
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${displayTiers.length}, minmax(0, 1fr))`,
              }}
            >
              {displayTiers.map((tier, index) => {
                const details = TIER_DETAILS[tier]
                const isRecommended = tier === recommendedTier
                const isLoading = loadingAction === `plan:${tier}`
                const isDisabled = loadingAction !== null && !isLoading

                return (
                  <div
                    key={tier}
                    className="flex flex-col p-4 relative min-w-0"
                    style={{
                      background: "#0e2838",
                      border: isRecommended
                        ? "2px solid rgba(244, 185, 100, 0.22)"
                        : "1px solid rgba(244, 185, 100, 0.12)",
                      boxShadow: isRecommended
                        ? "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10), 0 0 24px rgba(244,185,100,0.08)"
                        : "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
                      animation: `sb-tier-card-enter 300ms cubic-bezier(0.34, 1.56, 0.64, 1) ${100 + index * 60}ms both${isRecommended ? `, sb-tier-highlight 600ms ease 450ms 1` : ""}`,
                      transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                      marginTop: isRecommended ? "-4px" : "0",
                      marginBottom: isRecommended ? "-4px" : "0",
                      paddingTop: isRecommended ? "20px" : "16px",
                      paddingBottom: isRecommended ? "20px" : "16px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.borderColor = "rgba(244, 185, 100, 0.22)"
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10), 0 0 20px rgba(244,185,100,0.12)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.borderColor = isRecommended
                        ? "rgba(244, 185, 100, 0.22)"
                        : "rgba(244, 185, 100, 0.12)"
                      e.currentTarget.style.boxShadow = isRecommended
                        ? "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10), 0 0 24px rgba(244,185,100,0.08)"
                        : "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)"
                    }}
                  >
                    {/* Recommended Badge */}
                    {isRecommended && (
                      <span
                        className="absolute top-3 right-3 sb-label px-3 py-1"
                        style={{
                          fontSize: "10px",
                          fontWeight: 500,
                          letterSpacing: "0.10em",
                          textTransform: "uppercase",
                          background: "rgba(244, 185, 100, 0.12)",
                          border: "1px solid rgba(244, 185, 100, 0.20)",
                          color: "#f4b964",
                        }}
                      >
                        Recommended
                      </span>
                    )}

                    {/* Tier Name */}
                    <h3
                      className="sb-title-sm"
                      style={{ color: "#eaeef1", fontWeight: 500 }}
                    >
                      {details.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mt-2">
                      <span
                        className="sb-data"
                        style={{
                          fontSize: isRecommended ? "32px" : "24px",
                          color: "#f4b964",
                          lineHeight: 1,
                        }}
                      >
                        ${details.price}
                      </span>
                      <span className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                        /mo
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className="sb-caption mt-2"
                      style={{ color: "#6d8d9f" }}
                    >
                      {details.description}
                    </p>

                    {/* Separator */}
                    <Separator className="my-3" />

                    {/* Features */}
                    <TierFeatureList tier={tier} relevantFeature={relevantFeature} />

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* CTA */}
                    <Button
                      className={`w-full mt-4 ${isRecommended ? "sb-btn-primary" : "sb-btn-secondary"}`}
                      disabled={isDisabled}
                      onClick={() =>
                        handlePlanCheckout(tier as "starter" | "professional" | "enterprise")
                      }
                    >
                      {isLoading ? (
                        <DS2Spinner />
                      ) : (
                        "Upgrade"
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Enterprise at max — no upgrade tiers available */}
        {!hasUpgradeTiers && !isCreditsContext && (
          <div className="px-6 py-8 text-center">
            <p className="sb-body" style={{ color: "#d4dce2" }}>
              You're on our highest tier. Contact support if you need additional capacity.
            </p>
          </div>
        )}

        {/* Dismiss */}
        <div className="px-6 py-4 flex justify-center">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="sb-body-sm transition-all"
            style={{
              color: "#6d8d9f",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              transition: "color 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#d4dce2"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#6d8d9f"
            }}
          >
            Keep current plan
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
