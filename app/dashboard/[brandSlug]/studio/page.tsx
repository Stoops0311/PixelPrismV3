"use client"

import { useState, useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Image02Icon,
  GridViewIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DS2DataTable, type DS2Column } from "@/components/ds2/data-table"
import { StatusBadge } from "@/components/ds2/status-badge"
import { ImageGenerationPanel } from "@/components/ds2/image-generation-panel"
import { MasonryGallery } from "@/components/ds2/masonry-gallery"
import { showSuccess, showInfo } from "@/components/ds2/toast"
import {
  MOCK_PRODUCTS,
  MOCK_GENERATED_IMAGES,
  MOCK_CREDITS,
} from "@/lib/mock-data"
import type { GeneratedImage, GenerationConfig } from "@/types/dashboard"

// ── Status map for badge rendering ──────────────────────────────────────

const STATUS_MAP: Record<string, string> = {
  ready: "live",
  scheduled: "scheduled",
  posted: "paid",
}

// ── List view columns ───────────────────────────────────────────────────

function buildListColumns(
  onUseAsReference: (img: GeneratedImage) => void,
  onSchedule: (img: GeneratedImage) => void,
  onDownload: (img: GeneratedImage) => void,
  onDelete: (img: GeneratedImage) => void,
): DS2Column<GeneratedImage>[] {
  return [
    {
      key: "thumbnail",
      label: "",
      render: (_: unknown, row: GeneratedImage) => (
        <div
          className="flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            background: row.gradient,
            border: "1px solid rgba(244,185,100,0.12)",
          }}
        >
          <HugeiconsIcon icon={Image02Icon} size={14} color="rgba(255,255,255,0.2)" />
        </div>
      ),
    },
    {
      key: "productName",
      label: "Product",
      render: (val: string | undefined) => (
        <span style={{ color: "#d4dce2" }}>{val || "Brand Image"}</span>
      ),
    },
    { key: "aspectRatio", label: "Ratio", isData: true },
    {
      key: "status",
      label: "Status",
      render: (val: string) => (
        <StatusBadge status={STATUS_MAP[val] || val}>
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </StatusBadge>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      isData: true,
      render: (val: string) => format(new Date(val), "MMM d, yyyy"),
    },
    {
      key: "actions",
      label: "",
      align: "right" as const,
      render: (_: unknown, row: GeneratedImage) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="sb-btn-ghost !p-1 !min-h-[32px]">&#8942;</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUseAsReference(row)}>
              Use as Reference
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSchedule(row)}>
              Schedule Post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(row)}>
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[#e85454]"
              onClick={() => onDelete(row)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function StudioPage() {
  const searchParams = useSearchParams()
  const preSelectedProductId = searchParams.get("product")
  const preSelectedProduct = preSelectedProductId
    ? MOCK_PRODUCTS.find((p) => p.id === preSelectedProductId)
    : undefined

  // Generation state
  const [referenceImage, setReferenceImage] = useState<GeneratedImage | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Filter state
  const [filterProduct, setFilterProduct] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filtered images
  const filteredImages = useMemo(() => {
    let images = [...MOCK_GENERATED_IMAGES]
    if (filterProduct !== "all") {
      images = images.filter((img) => img.productId === filterProduct)
    }
    if (filterStatus !== "all") {
      images = images.filter((img) => img.status === filterStatus)
    }
    if (sortBy === "newest") {
      images.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } else {
      images.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    }
    return images
  }, [filterProduct, filterStatus, sortBy])

  // Generation handler
  const handleGenerate = useCallback((config: GenerationConfig) => {
    setIsGenerating(true)
    setGenerationProgress(0)

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 15
      })
    }, 300)

    setTimeout(() => {
      clearInterval(interval)
      setGenerationProgress(100)
      setIsGenerating(false)
      showSuccess(
        "Images generated",
        `${config.quantity} images added to your gallery`
      )
    }, 2500)
  }, [])

  // Action handlers
  const handleUseAsReference = useCallback((image: GeneratedImage) => {
    setReferenceImage(image)
    showInfo("Reference image set", "New generations will use this style")
  }, [])

  const handleSchedule = useCallback((image: GeneratedImage) => {
    showInfo("Schedule", `Scheduling ${image.productName || "Brand Image"}...`)
  }, [])

  const handleDownload = useCallback((image: GeneratedImage) => {
    showInfo("Download", `Downloading ${image.productName || "Brand Image"}...`)
  }, [])

  const handleDelete = useCallback((_image: GeneratedImage) => {
    showInfo("Deleted", `Image removed from gallery`)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilterProduct("all")
    setFilterStatus("all")
    setSortBy("newest")
  }, [])

  // List columns
  const listColumns = useMemo(
    () =>
      buildListColumns(
        handleUseAsReference,
        handleSchedule,
        handleDownload,
        handleDelete
      ),
    [handleUseAsReference, handleSchedule, handleDownload, handleDelete]
  )

  const hasActiveFilters =
    filterProduct !== "all" || filterStatus !== "all"

  return (
    <div
      data-studio-layout
      className="flex"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* ── Left: Generation Panel ────────────────────────────────────── */}
      <div
        className="shrink-0 overflow-y-auto"
        style={{
          width: 380,
          minWidth: 340,
          maxWidth: 440,
          borderRight: "1px solid rgba(244,185,100,0.08)",
          height: "100%",
          padding: "32px 24px",
        }}
      >
        <ImageGenerationPanel
          products={MOCK_PRODUCTS}
          preSelectedProduct={preSelectedProduct}
          availableCredits={MOCK_CREDITS}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          referenceImage={referenceImage}
          onReferenceImageChange={setReferenceImage}
          isDragging={isDragging}
        />
      </div>

      {/* ── Right: Gallery ──────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "32px 32px" }}
      >
        {/* Filter bar */}
        <div
          className="flex flex-wrap items-center gap-3 mb-8 pb-5"
          style={{ borderBottom: "1px solid rgba(244,185,100,0.08)" }}
        >
          {/* Product filter */}
          <Select value={filterProduct} onValueChange={setFilterProduct}>
            <SelectTrigger
              className="w-[180px]"
              style={{ minHeight: 40, fontSize: 13 }}
            >
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {MOCK_PRODUCTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <ToggleGroup
            type="single"
            value={filterStatus}
            onValueChange={(val) => val && setFilterStatus(val)}
          >
            <ToggleGroupItem value="all" style={{ fontSize: 12, padding: "8px 12px" }}>
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="ready" style={{ fontSize: 12, padding: "8px 12px" }}>
              Ready
            </ToggleGroupItem>
            <ToggleGroupItem value="scheduled" style={{ fontSize: 12, padding: "8px 12px" }}>
              Scheduled
            </ToggleGroupItem>
            <ToggleGroupItem value="posted" style={{ fontSize: 12, padding: "8px 12px" }}>
              Posted
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort */}
          <Select value={sortBy} onValueChange={(val) => setSortBy(val as "newest" | "oldest")}>
            <SelectTrigger
              className="w-[130px]"
              style={{ minHeight: 40, fontSize: 13 }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggle */}
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(val) => val && setViewMode(val as "grid" | "list")}
          >
            <ToggleGroupItem value="grid" style={{ padding: "8px 10px" }}>
              <HugeiconsIcon icon={GridViewIcon} size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" style={{ padding: "8px 10px" }}>
              <HugeiconsIcon icon={Menu01Icon} size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Image count */}
        <div className="flex items-center justify-between mb-6">
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
            {filteredImages.length} image{filteredImages.length !== 1 ? "s" : ""}
          </span>
          {hasActiveFilters && (
            <Button
              className="sb-btn-ghost !py-1 !px-2 !min-h-[28px] !text-xs"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Gallery content */}
        {filteredImages.length > 0 ? (
          viewMode === "grid" ? (
            <MasonryGallery
              images={filteredImages}
              onUseAsReference={handleUseAsReference}
              onSchedule={handleSchedule}
              onDownload={handleDownload}
              onDelete={handleDelete}
              draggable
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            />
          ) : (
            <DS2DataTable columns={listColumns} data={filteredImages} />
          )
        ) : MOCK_GENERATED_IMAGES.length === 0 ? (
          /* No images at all — empty state */
          <div className="mt-8">
            <div className="text-center mb-8">
              <HugeiconsIcon
                icon={Image02Icon}
                size={48}
                color="#6d8d9f"
              />
              <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
                No images generated yet.
              </p>
              <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                Configure your options and hit Generate.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center"
                  style={{
                    height: i % 2 === 0 ? 160 : 200,
                    border: "2px dashed rgba(244,185,100,0.12)",
                    background: "rgba(244,185,100,0.02)",
                    animation: "sb-empty-pulse 2s ease-in-out infinite",
                    animationDelay: `${i * 150}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Filters returned nothing */
          <div className="flex flex-col items-center justify-center py-16">
            <HugeiconsIcon icon={Image02Icon} size={40} color="#6d8d9f" />
            <p
              className="sb-body mt-3"
              style={{ color: "#6d8d9f" }}
            >
              No images match this filter.
            </p>
            <Button
              className="sb-btn-ghost mt-4"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
