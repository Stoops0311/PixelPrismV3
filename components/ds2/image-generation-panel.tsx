"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Image02Icon,
  Cancel01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { showInfo } from "@/components/ds2/toast"
import type { Product, GeneratedImage, GenerationConfig } from "@/types/dashboard"

// ── Style options ───────────────────────────────────────────────────────

const STYLE_OPTIONS = [
  { id: "product-shot", label: "Product Shot", gradient: "linear-gradient(135deg, #2a3a4a, #1a2a3a)" },
  { id: "lifestyle", label: "Lifestyle", gradient: "linear-gradient(135deg, #3a4a2a, #2a3a1a)" },
  { id: "flat-lay", label: "Flat Lay", gradient: "linear-gradient(135deg, #4a3a2a, #3a2a1a)" },
  { id: "abstract", label: "Abstract", gradient: "linear-gradient(135deg, #3a2a4a, #2a1a3a)" },
]

const QUALITY_OPTIONS = [
  { id: "standard" as const, label: "Std", cost: 1 },
  { id: "hd" as const, label: "HD", cost: 3 },
  { id: "ultra" as const, label: "Ultra", cost: 5 },
]

const ASPECT_OPTIONS = ["1:1", "4:5", "16:9", "9:16"] as const

const QUALITY_COSTS: Record<string, number> = { standard: 1, hd: 3, ultra: 5 }

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
}: ImageGenerationPanelProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    preSelectedProduct?.id ?? "none"
  )
  const [selectedStyle, setSelectedStyle] = useState("product-shot")
  const [quality, setQuality] = useState<"standard" | "hd" | "ultra">("hd")
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:5" | "16:9" | "9:16">("1:1")
  const [quantity, setQuantity] = useState(4)
  const [isDragOver, setIsDragOver] = useState(false)
  const [flashStyle, setFlashStyle] = useState<string | null>(null)
  const [costFlash, setCostFlash] = useState(false)
  const [referenceGlow, setReferenceGlow] = useState(false)
  const dropZoneHintRef = useRef(false)
  const prevCostRef = useRef(0)

  // Pre-select product from URL
  useEffect(() => {
    if (preSelectedProduct) {
      setSelectedProductId(preSelectedProduct.id)
    }
  }, [preSelectedProduct])

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
    setSelectedStyle(styleId)
    setFlashStyle(styleId)
    setTimeout(() => setFlashStyle(null), 300)
  }, [])

  // Generate
  const handleGenerate = useCallback(() => {
    onGenerate({
      style: selectedStyle,
      quality,
      aspectRatio,
      quantity,
      productId: selectedProductId === "none" ? undefined : selectedProductId,
      referenceImageId: referenceImage?.id,
    })
  }, [selectedStyle, quality, aspectRatio, quantity, selectedProductId, referenceImage, onGenerate])

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

      {/* Product selector */}
      <div>
        <label className="sb-label block mb-2" style={{ color: "#e8956a" }}>
          Product (optional)
        </label>
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No product — Brand image</SelectItem>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block shrink-0"
                    style={{
                      width: 20,
                      height: 20,
                      background: p.gradient,
                      border: "1px solid rgba(244,185,100,0.12)",
                    }}
                  />
                  {p.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: "rgba(244,185,100,0.08)" }} />

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
                background: referenceImage.gradient,
                border: "1px solid rgba(244,185,100,0.22)",
              }}
            >
              <HugeiconsIcon icon={Image02Icon} size={24} color="rgba(255,255,255,0.2)" />
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
                : "Drop an image here or click to browse"}
            </p>
            {!isDragOver && (
              <HugeiconsIcon icon={ArrowRight02Icon} size={14} color="#6d8d9f" />
            )}
          </div>
        )}
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: "rgba(244,185,100,0.08)" }} />

      {/* Style selector */}
      <div>
        <label className="sb-label block mb-2" style={{ color: "#e8956a" }}>
          Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {STYLE_OPTIONS.map((style) => {
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
                <div
                  style={{
                    height: 48,
                    background: style.gradient,
                    marginBottom: 6,
                    border: "1px solid rgba(244,185,100,0.06)",
                  }}
                />
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

      {/* Generate button */}
      <div className="relative">
        <Button
          className="sb-btn-primary w-full"
          disabled={insufficientCredits || isGenerating}
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
  )
}
