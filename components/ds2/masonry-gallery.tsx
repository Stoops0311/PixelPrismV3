"use client"

import { useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Image02Icon,
  MagicWand01Icon,
  Calendar03Icon,
  Download04Icon,
  Delete02Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons"
import { DS2Spinner } from "@/components/ds2/spinner"
import { ColorGrid } from "@/components/ds2/color-grid"
import type { GeneratedImage } from "@/types/dashboard"

// ── Aspect ratio CSS map ────────────────────────────────────────────────

const ASPECT_RATIOS: Record<string, string> = {
  "1:1": "1 / 1",
  "16:9": "16 / 9",
  "9:16": "9 / 16",
  "3:4": "3 / 4",
  "4:3": "4 / 3",
  "3:2": "3 / 2",
}

// ── Props ───────────────────────────────────────────────────────────────

interface MasonryGalleryProps {
  images: GeneratedImage[]
  columns?: number
  onImageClick?: (image: GeneratedImage) => void
  onUseAsReference?: (image: GeneratedImage) => void
  onSchedule?: (image: GeneratedImage) => void
  onDownload?: (image: GeneratedImage) => void
  onDelete?: (image: GeneratedImage) => void
  draggable?: boolean
  showOverlayActions?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
}

// ── StudioImageCard ─────────────────────────────────────────────────────

function StudioImageCard({
  image,
  index,
  onUseAsReference,
  onSchedule,
  onDownload,
  onDelete,
  draggable,
  showOverlayActions = true,
  onDragStart,
  onDragEnd,
}: {
  image: GeneratedImage
  index: number
  onUseAsReference?: (image: GeneratedImage) => void
  onSchedule?: (image: GeneratedImage) => void
  onDownload?: (image: GeneratedImage) => void
  onDelete?: (image: GeneratedImage) => void
  draggable?: boolean
  showOverlayActions?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
}) {
  const cssRatio = ASPECT_RATIOS[image.aspectRatio] ?? "1 / 1"

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({
          id: image.id,
          imageUrl: image.imageUrl,
          colorGrid: image.colorGrid,
          aspectRatio: image.aspectRatio,
          productName: image.productName,
        })
      )
      e.dataTransfer.effectAllowed = "copy"
      onDragStart?.()
    },
    [image, onDragStart]
  )

  const isGenerating = image.status === "generating"
  const isFailed = image.status === "failed"
  const isReady = image.status === "ready"

  return (
    <div
      style={{
        breakInside: "avoid",
        marginBottom: 12,
        animation: "sb-image-arrive 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        animationDelay: `${index * 40}ms`,
      }}
    >
      <div
        className="relative overflow-hidden group"
        draggable={draggable && isReady}
        onDragStart={draggable && isReady ? handleDragStart : undefined}
        onDragEnd={draggable ? onDragEnd : undefined}
        style={{
          cursor: draggable && isReady ? "grab" : isReady ? "pointer" : "default",
          border: "1px solid rgba(244,185,100,0.08)",
        }}
      >
        {/* Image / placeholder area */}
        <div
          className="relative w-full"
          style={{
            aspectRatio: image.imageUrl ? undefined : cssRatio,
            background: "#071a26",
          }}
        >
          {image.imageUrl ? (
            <img
              src={image.imageUrl}
              alt={image.productName || "Generated image"}
              style={{ width: "100%", display: "block" }}
              loading="lazy"
            />
          ) : (
            <>
              {/* Color grid fills the placeholder — the PixelPrism moment */}
              <ColorGrid fill colors={image.colorGrid} className="absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                {isGenerating ? (
                  <DS2Spinner />
                ) : isFailed ? (
                  <div className="flex flex-col items-center gap-2">
                    <HugeiconsIcon icon={Alert02Icon} size={24} color="#e85454" />
                    <span className="sb-caption" style={{ color: "#e85454", maxWidth: 140, textAlign: "center" }}>
                      {image.errorMessage || "Generation failed"}
                    </span>
                  </div>
                ) : (
                  <HugeiconsIcon icon={Image02Icon} size={24} color="rgba(255,255,255,0.15)" />
                )}
              </div>
            </>
          )}

          {/* Hover action bar — bottom gradient with small icons */}
          {showOverlayActions && isReady && (
            <div
              className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: "linear-gradient(transparent, rgba(7,26,38,0.85))",
              }}
            >
              {onUseAsReference && (
                <button
                  className="cursor-pointer"
                  title="Use as reference"
                  onClick={(e) => { e.stopPropagation(); onUseAsReference(image) }}
                  style={{
                    padding: "6px",
                    background: "rgba(7,26,38,0.6)",
                    border: "1px solid rgba(244,185,100,0.12)",
                    color: "#d4dce2",
                    transition: "all 150ms ease",
                  }}
                >
                  <HugeiconsIcon icon={MagicWand01Icon} size={14} />
                </button>
              )}
              {onSchedule && (
                <button
                  className="cursor-pointer"
                  title="Schedule post"
                  onClick={(e) => { e.stopPropagation(); onSchedule(image) }}
                  style={{
                    padding: "6px",
                    background: "rgba(7,26,38,0.6)",
                    border: "1px solid rgba(244,185,100,0.12)",
                    color: "#d4dce2",
                    transition: "all 150ms ease",
                  }}
                >
                  <HugeiconsIcon icon={Calendar03Icon} size={14} />
                </button>
              )}
              {onDownload && (
                <button
                  className="cursor-pointer"
                  title="Download"
                  onClick={(e) => { e.stopPropagation(); onDownload(image) }}
                  style={{
                    padding: "6px",
                    background: "rgba(7,26,38,0.6)",
                    border: "1px solid rgba(244,185,100,0.12)",
                    color: "#d4dce2",
                    transition: "all 150ms ease",
                  }}
                >
                  <HugeiconsIcon icon={Download04Icon} size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  className="cursor-pointer"
                  title="Delete"
                  onClick={(e) => { e.stopPropagation(); onDelete(image) }}
                  style={{
                    padding: "6px",
                    background: "rgba(7,26,38,0.6)",
                    border: "1px solid rgba(232,84,84,0.12)",
                    color: "#e85454",
                    transition: "all 150ms ease",
                  }}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                </button>
              )}
            </div>
          )}

          {/* Failed overlay with delete */}
          {isFailed && onDelete && (
            <button
              className="absolute top-2 right-2 cursor-pointer"
              title="Delete"
              onClick={(e) => { e.stopPropagation(); onDelete(image) }}
              style={{
                padding: "4px",
                background: "rgba(7,26,38,0.8)",
                border: "1px solid rgba(232,84,84,0.20)",
                color: "#e85454",
              }}
            >
              <HugeiconsIcon icon={Delete02Icon} size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── MasonryGallery ──────────────────────────────────────────────────────

export function MasonryGallery({
  images,
  onUseAsReference,
  onSchedule,
  onDownload,
  onDelete,
  draggable = false,
  showOverlayActions = true,
  onDragStart,
  onDragEnd,
}: MasonryGalleryProps) {
  return (
    <div className="[column-count:3]" style={{ columnGap: 12 }}>
      {images.map((image, index) => (
        <StudioImageCard
          key={image.id}
          image={image}
          index={index}
          onUseAsReference={onUseAsReference}
          onSchedule={onSchedule}
          onDownload={onDownload}
          onDelete={onDelete}
          draggable={draggable}
          showOverlayActions={showOverlayActions}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  )
}
