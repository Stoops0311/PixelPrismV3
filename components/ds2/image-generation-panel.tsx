"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Image02Icon,
  Cancel01Icon,
  ArrowRight02Icon,
  MagicWand01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { showInfo } from "@/components/ds2/toast"
import { ColorGrid } from "@/components/ds2/color-grid"
import { ProductMultiSelect } from "@/components/ds2/product-multi-select"
import { AddProductDialog } from "@/components/ds2/add-product-dialog"
import { UpgradeDialog } from "@/components/ds2/upgrade-dialog"
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog"
import type { SubscriptionTier } from "@/lib/polar"
import type { Id } from "@/convex/_generated/dataModel"
import type { Product, GeneratedImage, GenerationConfig } from "@/types/dashboard"

// ── Style options ───────────────────────────────────────────────────────

const STYLE_OPTIONS = [
  { id: "none", label: "None", image: null, gradient: "linear-gradient(135deg, #1a2530, #0d1a24)", promptSuffix: "" },
  { id: "product-shot", label: "Product Shot", image: "/style-previews/product-shot.png", gradient: "linear-gradient(135deg, #2a3a4a, #1a2a3a)", promptSuffix: ", professional product photography, studio lighting, clean background, high detail, commercial quality, sharp focus" },
  { id: "lifestyle", label: "Lifestyle", image: "/style-previews/lifestyle.png", gradient: "linear-gradient(135deg, #3a4a2a, #2a3a1a)", promptSuffix: ", lifestyle photography, natural lighting, soft focus, warm tones, cozy atmosphere, candid feel" },
  { id: "flat-lay", label: "Flat Lay", image: "/style-previews/flat-lay.png", gradient: "linear-gradient(135deg, #4a3a2a, #3a2a1a)", promptSuffix: ", flat lay photography, top-down view, organized arrangement, minimalist composition, clean styling" },
  { id: "abstract", label: "Abstract", image: "/style-previews/abstract.png", gradient: "linear-gradient(135deg, #3a2a4a, #2a1a3a)", promptSuffix: ", abstract art style, vibrant colors, geometric shapes, artistic interpretation, creative composition" },
]

const QUALITY_OPTIONS = [
  { id: "standard" as const, label: "Standard", cost: 0.5 },
  { id: "hd" as const, label: "HD", cost: 1 },
  { id: "ultra" as const, label: "Ultra", cost: 1.5 },
]

const ASPECT_OPTIONS = ["1:1", "9:16", "16:9", "3:4", "4:3", "3:2"] as const

const QUALITY_COSTS: Record<string, number> = { standard: 0.5, hd: 1, ultra: 1.5 }

// ── Component ───────────────────────────────────────────────────────────

interface ImageGenerationPanelProps {
  products: Product[]
  preSelectedProduct?: Product
  availableCredits: number
  onGenerate: (config: GenerationConfig) => void
  isGenerating: boolean
  generationProgress: number
  referenceImage: GeneratedImage | null
  onReferenceImageChange: (image: GeneratedImage | null) => void
  isDragging?: boolean
  brandId?: Id<"brands">
  currentTier?: SubscriptionTier
  galleryImages?: GeneratedImage[]
}

export function ImageGenerationPanel({
  products,
  preSelectedProduct,
  availableCredits,
  onGenerate,
  isGenerating,
  generationProgress,
  referenceImage,
  onReferenceImageChange,
  isDragging = false,
  brandId,
  currentTier = "free",
  galleryImages = [],
}: ImageGenerationPanelProps) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    preSelectedProduct ? [preSelectedProduct.id] : []
  )
  const [prompt, setPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("none")
  const [quality, setQuality] = useState<"standard" | "hd" | "ultra">("hd")
  const [aspectRatio, setAspectRatio] = useState<typeof ASPECT_OPTIONS[number]>("1:1")
  const [quantity, setQuantity] = useState(4)
  const [isDragOver, setIsDragOver] = useState(false)
  const [flashStyle, setFlashStyle] = useState<string | null>(null)
  const [costFlash, setCostFlash] = useState(false)
  const [referenceGlow, setReferenceGlow] = useState(false)
  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false)
  const [refPickerOpen, setRefPickerOpen] = useState(false)
  const upgrade = useUpgradeDialog()
  const dropZoneHintRef = useRef(false)
  const prevCostRef = useRef(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Pre-select product from URL
  useEffect(() => {
    if (preSelectedProduct) {
      setSelectedProductIds([preSelectedProduct.id])
    }
  }, [preSelectedProduct])

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.max(100, el.scrollHeight) + "px"
  }, [prompt])

  // Cost calculation
  const totalCost = QUALITY_COSTS[quality] * quantity
  const remainingAfter = availableCredits - totalCost
  const insufficientCredits = totalCost > availableCredits

  // Flash cost on change
  useEffect(() => {
    if (prevCostRef.current !== 0 && prevCostRef.current !== totalCost) {
      setCostFlash(true)
      const t = setTimeout(() => setCostFlash(false), 200)
      return () => clearTimeout(t)
    }
    prevCostRef.current = totalCost
  }, [totalCost])

  // Style card selection with flash
  const handleStyleSelect = useCallback((styleId: string) => {
    // Toggle: clicking already-selected style deselects to "none"
    if (styleId === selectedStyle && styleId !== "none") {
      setSelectedStyle("none")
      return
    }
    setSelectedStyle(styleId)
    setFlashStyle(styleId)
    setTimeout(() => setFlashStyle(null), 300)
  }, [selectedStyle])

  // Get the prompt suffix for the selected style
  const selectedStyleOption = STYLE_OPTIONS.find((s) => s.id === selectedStyle)

  // Generate
  const handleGenerate = useCallback(() => {
    onGenerate({
      prompt,
      style: selectedStyle,
      stylePreset: selectedStyleOption?.promptSuffix ?? "",
      quality,
      aspectRatio,
      quantity,
      productIds: selectedProductIds.length > 0 ? selectedProductIds : undefined,
      referenceImageId: referenceImage?.id,
    })
  }, [prompt, selectedStyle, selectedStyleOption, quality, aspectRatio, quantity, selectedProductIds, referenceImage, onGenerate])

  // Drop zone handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    try {
      const imageData = JSON.parse(e.dataTransfer.getData("application/json"))
      onReferenceImageChange(imageData)
      setReferenceGlow(true)
      setTimeout(() => setReferenceGlow(false), 600)
      showInfo("Reference image set", "New generations will use this style")
    } catch {
      // Invalid data
    }
  }, [onReferenceImageChange])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <h3 className="sb-h3" style={{ color: "#eaeef1" }}>
        Generate
      </h3>

      {/* Prompt — front and center */}
      <div>
        <label className="sb-label block mb-2" style={{ color: "#e8956a" }}>
          Prompt
        </label>
        <Textarea
          ref={textareaRef}
          placeholder="Describe the image you want to generate..."
          className="min-h-[100px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ resize: "none", overflow: "hidden" }}
        />
      </div>

      {/* Style selector (optional — defaults to None) */}
      <div>
        <label className="sb-label block mb-2" style={{ color: "#e8956a" }}>
          Style (optional)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {STYLE_OPTIONS.filter((s) => s.id !== "none").map((style) => {
            const isSelected = selectedStyle === style.id
            const isFlashing = flashStyle === style.id
            return (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style.id)}
                className="text-left cursor-pointer"
                style={{
                  border: `1px solid ${
                    isSelected
                      ? "rgba(244,185,100,0.22)"
                      : "rgba(244,185,100,0.12)"
                  }`,
                  background: isSelected
                    ? "rgba(244,185,100,0.04)"
                    : "rgba(255,255,255,0.02)",
                  padding: 8,
                  transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  animation: isFlashing
                    ? "sb-style-flash 300ms cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : undefined,
                }}
              >
                {style.image ? (
                  <img
                    src={style.image}
                    alt={style.label}
                    style={{
                      height: 48,
                      width: "100%",
                      objectFit: "cover",
                      marginBottom: 6,
                      border: "1px solid rgba(244,185,100,0.06)",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 48,
                      background: style.gradient,
                      marginBottom: 6,
                      border: "1px solid rgba(244,185,100,0.06)",
                    }}
                  />
                )}
                <span
                  className="sb-caption"
                  style={{ color: isSelected ? "#eaeef1" : "#6d8d9f" }}
                >
                  {style.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: "rgba(244,185,100,0.08)" }} />

      {/* Product selector */}
      <div>
        <label className="sb-label block mb-2" style={{ color: "#e8956a" }}>
          Products (optional)
        </label>
        <ProductMultiSelect
          products={products}
          selectedIds={selectedProductIds}
          onSelectionChange={setSelectedProductIds}
          variant="form"
          onAddProduct={() => setNewProductDialogOpen(true)}
        />
        <AddProductDialog
          brandId={brandId}
          open={newProductDialogOpen}
          onOpenChange={setNewProductDialogOpen}
          onCreated={(productId) => {
            setSelectedProductIds((prev) => [...prev, productId])
          }}
        />
      </div>

      {/* Reference image drop zone */}
      <div>
        <label className="sb-label block mb-2" style={{ color: "#e8956a" }}>
          Reference Image (optional)
        </label>
        {referenceImage ? (
          <div
            className="relative"
            style={{
              animation: referenceGlow
                ? "sb-reference-glow 600ms ease-out"
                : undefined,
            }}
          >
            <div
              className="w-full flex items-center justify-center"
              style={{
                height: 120,
                background: referenceImage.imageUrl ? undefined : "#071a26",
                border: "1px solid rgba(244,185,100,0.22)",
                overflow: "hidden",
              }}
            >
              {referenceImage.imageUrl ? (
                <img
                  src={referenceImage.imageUrl}
                  alt="Reference"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <HugeiconsIcon icon={Image02Icon} size={24} color="rgba(255,255,255,0.2)" />
              )}
            </div>
            <button
              onClick={() => onReferenceImageChange(null)}
              className="absolute top-2 right-2 p-1 cursor-pointer"
              style={{
                background: "rgba(7,26,38,0.8)",
                border: "1px solid rgba(232,84,84,0.20)",
                color: "#e85454",
                transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
            <p className="sb-caption mt-1" style={{ color: "#6d8d9f" }}>
              {referenceImage.productName || "Brand Image"} &middot; {referenceImage.aspectRatio}
            </p>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => setRefPickerOpen(true)}
            className="flex items-center justify-center gap-2 cursor-pointer"
            style={{
              height: 80,
              border: isDragOver || isDragging
                ? "2px dashed rgba(244,185,100,0.22)"
                : "2px dashed rgba(244,185,100,0.08)",
              background: isDragOver || isDragging
                ? "rgba(244,185,100,0.04)"
                : "rgba(244,185,100,0.02)",
              transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              animation: isDragOver || isDragging
                ? "sb-drop-zone-pulse 800ms ease-in-out infinite"
                : !dropZoneHintRef.current
                  ? "sb-drop-zone-hint 2s ease-in-out"
                  : undefined,
            }}
            onAnimationEnd={() => { dropZoneHintRef.current = true }}
          >
            <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
              {isDragOver
                ? "Drop here to use as reference"
                : "Drag from gallery or click to browse"}
            </p>
            {!isDragOver && (
              <HugeiconsIcon icon={ArrowRight02Icon} size={14} color="#6d8d9f" />
            )}
          </div>
        )}

        {/* Reference image picker dialog */}
        <Dialog open={refPickerOpen} onOpenChange={setRefPickerOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="sb-h4" style={{ color: "#eaeef1" }}>
                Choose Reference Image
              </DialogTitle>
            </DialogHeader>
            {galleryImages.filter((img) => img.status === "ready" && img.imageUrl).length > 0 ? (
              <div
                className="grid grid-cols-3 gap-2 max-h-[360px] overflow-y-auto"
                style={{ padding: "4px 0" }}
              >
                {galleryImages
                  .filter((img) => img.status === "ready" && img.imageUrl)
                  .map((img) => (
                    <button
                      key={img.id}
                      className="cursor-pointer group relative"
                      onClick={() => {
                        onReferenceImageChange(img)
                        setRefPickerOpen(false)
                        setReferenceGlow(true)
                        setTimeout(() => setReferenceGlow(false), 600)
                        showInfo("Reference image set", "New generations will use this style")
                      }}
                      style={{
                        border: "1px solid rgba(244,185,100,0.08)",
                        background: "#071a26",
                        padding: 0,
                        overflow: "hidden",
                        transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    >
                      <img
                        src={img.imageUrl!}
                        alt={img.productName || "Generated image"}
                        style={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                          display: "block",
                          opacity: 0.85,
                          transition: "opacity 200ms ease",
                        }}
                        className="group-hover:opacity-100"
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                        style={{ background: "rgba(7,26,38,0.5)" }}
                      >
                        <HugeiconsIcon icon={MagicWand01Icon} size={20} color="#f4b964" />
                      </div>
                    </button>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <HugeiconsIcon icon={Image02Icon} size={32} color="rgba(244,185,100,0.3)" />
                <p className="sb-body-sm mt-3" style={{ color: "#6d8d9f" }}>
                  No generated images yet
                </p>
                <p className="sb-caption mt-1" style={{ color: "#4a6a7a" }}>
                  Generate some images first, then use them as references
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: "rgba(244,185,100,0.08)" }} />

      {/* Quality */}
      <div>
        <label className="sb-label block mb-2" style={{ color: "#e8956a" }}>
          Quality
        </label>
        <div className="flex gap-2">
          {QUALITY_OPTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => setQuality(q.id)}
              className="flex-1 text-center cursor-pointer"
              style={{
                padding: "10px 8px",
                border: `1px solid ${
                  quality === q.id
                    ? "rgba(244,185,100,0.22)"
                    : "rgba(244,185,100,0.12)"
                }`,
                background:
                  quality === q.id ? "#f4b964" : "rgba(255,255,255,0.02)",
                color: quality === q.id ? "#071a26" : "#d4dce2",
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                letterSpacing: "0.06em",
                transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {q.label}{" "}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  opacity: 0.7,
                }}
              >
                ({q.cost})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="sb-label block mb-2" style={{ color: "#e8956a" }}>
          Aspect Ratio
        </label>
        <div className="flex gap-2">
          {ASPECT_OPTIONS.map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className="flex-1 text-center cursor-pointer"
              style={{
                padding: "10px 8px",
                border: `1px solid ${
                  aspectRatio === ratio
                    ? "rgba(244,185,100,0.22)"
                    : "rgba(244,185,100,0.12)"
                }`,
                background:
                  aspectRatio === ratio ? "#f4b964" : "rgba(255,255,255,0.02)",
                color: aspectRatio === ratio ? "#071a26" : "#d4dce2",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: "13px",
                transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="sb-label block mb-2" style={{ color: "#e8956a" }}>
          Quantity
        </label>
        <div className="sb-number-stepper">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            &minus;
          </button>
          <input type="text" value={quantity} readOnly />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
          >
            +
          </button>
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: "rgba(244,185,100,0.08)" }} />

      {/* Cost breakdown */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="sb-body-sm" style={{ color: "#6d8d9f" }}>
            {quantity} &times; {quality.toUpperCase()} &times; {aspectRatio}
          </span>
          <span
            className="sb-data"
            style={{
              color: insufficientCredits ? "#e8956a" : "#f4b964",
              animation: costFlash ? "sb-cost-flash 200ms ease-out" : undefined,
            }}
          >
            = {totalCost} credits
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
            {availableCredits} remaining
          </span>
          <span
            className="sb-caption"
            style={{ color: insufficientCredits ? "#e85454" : "#6d8d9f" }}
          >
            {insufficientCredits
              ? "Not enough credits"
              : `→ ${remainingAfter} after`}
          </span>
        </div>
      </div>

      {/* Generate / Get More Credits buttons */}
      <div className="flex gap-3">
        {insufficientCredits && (
          <Button
            className="sb-btn-secondary flex-1"
            onClick={() =>
              upgrade.showUpgrade({
                kind: "credits",
                creditsNeeded: totalCost,
                creditsAvailable: availableCredits,
              })
            }
          >
            Get More Credits
          </Button>
        )}
        <div className={`relative ${insufficientCredits ? "flex-1" : "w-full"}`}>
          <Button
            className="sb-btn-primary w-full"
            disabled={insufficientCredits || isGenerating || !prompt.trim()}
            onClick={handleGenerate}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
          {isGenerating && (
            <div className="absolute bottom-0 left-0 right-0">
              <Progress value={generationProgress} />
            </div>
          )}
        </div>
      </div>

      <UpgradeDialog
        open={upgrade.open}
        onOpenChange={upgrade.onOpenChange}
        context={upgrade.context}
        currentTier={currentTier}
      />
    </div>
  )
}
