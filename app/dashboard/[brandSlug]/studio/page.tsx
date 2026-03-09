"use client"

import { useState, useMemo, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Image02Icon,
  GridViewIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DS2DataTable, type DS2Column } from "@/components/ds2/data-table"
import { StatusBadge } from "@/components/ds2/status-badge"
import { ColorGrid } from "@/components/ds2/color-grid"
import { ProductMultiSelect } from "@/components/ds2/product-multi-select"
import { ImageGenerationPanel } from "@/components/ds2/image-generation-panel"
import { MasonryGallery } from "@/components/ds2/masonry-gallery"
import { DS2Spinner } from "@/components/ds2/spinner"
import { showSuccess, showInfo, showError } from "@/components/ds2/toast"
import type { GeneratedImage, GenerationConfig, Product } from "@/types/dashboard"

import { hashColorGrid } from "@/lib/color-grid"

// ── Status map for badge rendering ──────────────────────────────────────

const STATUS_MAP: Record<string, string> = {
  ready: "live",
  scheduled: "scheduled",
  posted: "paid",
  generating: "pending",
  failed: "overdue",
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
      render: (_: unknown, row: GeneratedImage) =>
        row.imageUrl ? (
          <img
            src={row.imageUrl}
            alt=""
            style={{ width: 48, height: 48, objectFit: "cover", display: "block" }}
          />
        ) : (
          <ColorGrid colors={row.colorGrid} size={48} />
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
  const params = useParams()
  const router = useRouter()
  const brandSlug = params.brandSlug as string
  const searchParams = useSearchParams()

  // ── Convex queries ──────────────────────────────────────────────────
  const brand = useQuery(api.brands.getBySlug, { slug: brandSlug })
  const rawProducts = useQuery(api.products.listByBrand, brand ? { brandId: brand._id } : "skip")
  const rawImages = useQuery(api.images.listByBrand, brand ? { brandId: brand._id } : "skip")
  const balance = useQuery(api.credits.getBalance)
  const user = useQuery(api.users.current)
  const createBatch = useMutation(api.images.createBatch)
  const removeImage = useMutation(api.images.remove)

  // ── Map Convex products to Product type for ImageGenerationPanel ────
  const products: Product[] = useMemo(() => {
    if (!rawProducts) return []
    return rawProducts.map((p) => ({
      id: p._id,
      name: p.name,
      description: p.description,
      imageCount: p.generatedImagesCount,
      creditsSpent: p.creditsSpent,
      createdAt: new Date(p.createdAt).toISOString(),
      colorGrid: p.colorGrid ?? hashColorGrid(p._id),
    }))
  }, [rawProducts])

  // ── Build a product name lookup for images ──────────────────────────
  const productNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (rawProducts) {
      for (const p of rawProducts) {
        map[p._id] = p.name
      }
    }
    return map
  }, [rawProducts])

  // ── Map Convex images to GeneratedImage type ────────────────────────
  const allImages: GeneratedImage[] = useMemo(() => {
    if (!rawImages) return []
    return rawImages.map((img) => ({
      id: img._id,
      productId: img.productId,
      productName: img.productId ? productNameMap[img.productId] : undefined,
      imageUrl: img.imageUrl,
      colorGrid: hashColorGrid(img._id),
      aspectRatio: img.aspectRatio as GeneratedImage["aspectRatio"],
      status: img.status as GeneratedImage["status"],
      errorMessage: img.errorMessage,
      createdAt: new Date(img.createdAt).toISOString(),
      creditsUsed: img.creditsUsed,
    }))
  }, [rawImages, productNameMap])

  // ── Pre-selected product from URL ───────────────────────────────────
  const preSelectedProductId = searchParams.get("product")
  const preSelectedProduct = preSelectedProductId
    ? products.find((p) => p.id === preSelectedProductId)
    : undefined

  // Generation state
  const [referenceImage, setReferenceImage] = useState<GeneratedImage | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Filter state
  const [filterProductIds, setFilterProductIds] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filtered images
  const filteredImages = useMemo(() => {
    let images = [...allImages]
    if (filterProductIds.length > 0) {
      images = images.filter((img) => img.productId && filterProductIds.includes(img.productId))
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
  }, [allImages, filterProductIds, filterStatus, sortBy])

  // Generation handler — calls Convex mutation
  const handleGenerate = useCallback(async (config: GenerationConfig) => {
    if (!brand) return

    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate progress (real-time updates come via useQuery subscription)
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 15
      })
    }, 300)

    try {
      await createBatch({
        brandId: brand._id,
        prompt: config.prompt,
        qualityTier: config.quality === "hd" ? "mid" : config.quality === "ultra" ? "premium" : "standard",
        aspectRatio: config.aspectRatio,
        quantity: config.quantity,
        productId: (config.productIds?.[0] ?? undefined) as Id<"products"> | undefined,
        referenceImageId: config.referenceImageId ? (config.referenceImageId as Id<"generatedImages">) : undefined,
        stylePreset: config.stylePreset || undefined,
      })

      clearInterval(interval)
      setGenerationProgress(100)
      showSuccess(
        "Images generating",
        `${config.quantity} images queued — they'll appear in the gallery as they complete`
      )
    } catch (err: unknown) {
      clearInterval(interval)
      const message = err instanceof Error ? err.message : "Something went wrong"
      showError("Generation failed", message)
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress(0)
      }, 500)
    }
  }, [brand, createBatch])

  // Action handlers
  const handleUseAsReference = useCallback((image: GeneratedImage) => {
    setReferenceImage(image)
    showInfo("Reference image set", "New generations will use this style")
  }, [])

  const handleSchedule = useCallback((image: GeneratedImage) => {
    const url = new URL(
      `/dashboard/${brandSlug}/scheduling`,
      window.location.origin
    )
    url.searchParams.set("imageId", image.id)
    if (image.imageUrl) {
      url.searchParams.set("imageUrl", image.imageUrl)
    }

    showInfo("Scheduling", "Opening scheduling composer with selected image")
    router.push(`${url.pathname}${url.search}`)
  }, [brandSlug, router])

  const handleDownload = useCallback(async (image: GeneratedImage) => {
    if (!image.imageUrl) {
      showError("Download unavailable", "This image is not ready yet")
      return
    }

    try {
      const response = await fetch(image.imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image (${response.status})`)
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = objectUrl
      anchor.download = `${brandSlug}-${image.id}.webp`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(objectUrl)

      showInfo("Download started", "Image download has started")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not download image"
      showError("Download failed", message)
    }
  }, [brandSlug])

  const handleDelete = useCallback(async (image: GeneratedImage) => {
    try {
      await removeImage({ imageId: image.id as Id<"generatedImages"> })
      showInfo("Deleted", "Image removed from gallery")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not remove image"
      showError("Delete failed", message)
    }
  }, [removeImage])

  const handleClearFilters = useCallback(() => {
    setFilterProductIds([])
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
    filterProductIds.length > 0 || filterStatus !== "all"

  // ── Loading state ───────────────────────────────────────────────────
  if (brand === undefined || rawProducts === undefined || rawImages === undefined || balance === undefined) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 64px)" }}>
        <DS2Spinner />
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 64px)" }}>
        <p className="sb-body" style={{ color: "#6d8d9f" }}>Brand not found.</p>
      </div>
    )
  }

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
          products={products}
          preSelectedProduct={preSelectedProduct}
          availableCredits={balance.total}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          referenceImage={referenceImage}
          onReferenceImageChange={setReferenceImage}
          isDragging={isDragging}
          brandId={brand._id}
          currentTier={user?.subscriptionTier ?? "free"}
          galleryImages={allImages}
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
          <ProductMultiSelect
            products={products}
            selectedIds={filterProductIds}
            onSelectionChange={setFilterProductIds}
            variant="filter"
          />

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
            <ToggleGroupItem value="generating" style={{ fontSize: 12, padding: "8px 12px" }}>
              Generating
            </ToggleGroupItem>
            <ToggleGroupItem value="failed" style={{ fontSize: 12, padding: "8px 12px" }}>
              Failed
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
        ) : allImages.length === 0 ? (
          /* No images at all — empty state */
          <div className="flex flex-col items-center justify-center" style={{ minHeight: "50vh" }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 80,
                height: 80,
                background: "rgba(244,185,100,0.04)",
                border: "1px solid rgba(244,185,100,0.12)",
                marginBottom: 20,
              }}
            >
              <HugeiconsIcon icon={Image02Icon} size={32} color="rgba(244,185,100,0.3)" />
            </div>
            <p className="sb-body" style={{ color: "#6d8d9f" }}>
              Your generated images will appear here
            </p>
            <p className="sb-caption mt-2" style={{ color: "#4a6a7a" }}>
              Write a prompt and hit Generate to get started
            </p>
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
