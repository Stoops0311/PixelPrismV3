"use client"

import { useCallback } from "react"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Image02Icon,
  MagicWand01Icon,
  Calendar03Icon,
  Download04Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GeneratedImage } from "@/types/dashboard"

// ── Aspect ratio to height map ──────────────────────────────────────────

const ASPECT_HEIGHTS: Record<string, number> = {
  "1:1": 220,
  "4:5": 260,
  "16:9": 160,
  "9:16": 320,
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
  const height = ASPECT_HEIGHTS[image.aspectRatio] ?? 220

  const statusColor =
    image.status === "ready"
      ? "#f4b964"
      : image.status === "scheduled"
        ? "#e8956a"
        : "#6d8d9f"

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({
          id: image.id,
          gradient: image.gradient,
          aspectRatio: image.aspectRatio,
          productName: image.productName,
        })
      )
      e.dataTransfer.effectAllowed = "copy"
      onDragStart?.()
    },
    [image, onDragStart]
  )

  return (
    <div
      style={{
        breakInside: "avoid",
        marginBottom: 24,
        animation: "sb-image-arrive 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        animationDelay: `${index * 60}ms`,
      }}
    >
      <Card
        className="overflow-hidden group"
        data-interactive
        draggable={draggable}
        onDragStart={draggable ? handleDragStart : undefined}
        onDragEnd={draggable ? onDragEnd : undefined}
        style={{
          cursor: draggable ? "grab" : "pointer",
        }}
      >
        {/* Image area */}
        <div
          className="relative w-full flex items-center justify-center transition-transform duration-300"
          style={{
            height,
            background: image.gradient,
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <HugeiconsIcon
            icon={Image02Icon}
            size={24}
            color="rgba(255,255,255,0.2)"
          />

          {/* Hover overlay */}
          {showOverlayActions && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "rgba(7, 26, 38, 0.7)" }}
            >
              {onUseAsReference && (
                <Button
                  className="sb-btn-ghost !py-2 !px-3 !min-h-[32px] !text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onUseAsReference(image)
                  }}
                >
                  <HugeiconsIcon icon={MagicWand01Icon} size={14} />
                  <span className="ml-1">Use as Reference</span>
                </Button>
              )}
              {onSchedule && (
                <Button
                  className="sb-btn-primary !px-3 !py-2 !min-h-[32px] !text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSchedule(image)
                  }}
                >
                  <HugeiconsIcon icon={Calendar03Icon} size={14} />
                  <span className="ml-1">Schedule</span>
                </Button>
              )}
              {onDownload && (
                <Button
                  className="sb-btn-secondary !px-3 !py-2 !min-h-[32px] !text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownload(image)
                  }}
                >
                  <HugeiconsIcon icon={Download04Icon} size={14} />
                  <span className="ml-1">Download</span>
                </Button>
              )}
              {onDelete && (
                <Button
                  className="sb-btn-ghost !py-2 !px-3 !min-h-[32px] !text-xs"
                  style={{ color: "#e85454" }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(image)
                  }}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderTop: "1px solid rgba(244,185,100,0.08)" }}
        >
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
            {image.productName || "Brand Image"}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="sb-caption"
              style={{
                color: "#6d8d9f",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
              }}
            >
              {format(new Date(image.createdAt), "MMM d")}
            </span>
            <div
              role="status"
              aria-label={image.status}
              title={image.status.charAt(0).toUpperCase() + image.status.slice(1)}
              style={{
                width: 6,
                height: 6,
                background: statusColor,
              }}
            />
          </div>
        </div>
      </Card>
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
    <div className="[column-count:2]" style={{ columnGap: 24 }}>
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
