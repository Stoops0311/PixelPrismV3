"use client"

import { useState, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StudioImageChoice {
  id: string
  imageUrl?: string
  prompt: string
  aspectRatio: string
  createdAt: number
}

function timeAgo(ms: number): string {
  const seconds = Math.floor((Date.now() - ms) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

type SortOption = "newest" | "oldest"

interface StudioImagePickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: StudioImageChoice[]
  selectedImageId?: string
  onSelect: (image: StudioImageChoice) => void
}

export function StudioImagePickerDialog({
  open,
  onOpenChange,
  images,
  selectedImageId,
  onSelect,
}: StudioImagePickerDialogProps) {
  const [search, setSearch] = useState("")
  const [ratioFilter, setRatioFilter] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>("newest")

  // Collect unique aspect ratios from images
  const availableRatios = useMemo(() => {
    const set = new Set<string>()
    for (const img of images) {
      if (img.aspectRatio) set.add(img.aspectRatio)
    }
    return Array.from(set).sort()
  }, [images])

  const filtered = useMemo(() => {
    let result = images

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((img) => img.prompt.toLowerCase().includes(q))
    }

    // Aspect ratio filter
    if (ratioFilter) {
      result = result.filter((img) => img.aspectRatio === ratioFilter)
    }

    // Sort
    if (sort === "oldest") {
      result = [...result].sort((a, b) => a.createdAt - b.createdAt)
    }
    // "newest" is already the default order from the query

    return result
  }, [images, search, ratioFilter, sort])

  function handleSelect(img: StudioImageChoice) {
    onSelect(img)
    onOpenChange(false)
    setSearch("")
    setRatioFilter(null)
  }

  function handleClose() {
    onOpenChange(false)
    setSearch("")
    setRatioFilter(null)
  }

  const hasActiveFilters = !!search || !!ratioFilter

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(v) }}>
      <DialogContent
        className="sm:max-w-xl p-0 gap-0"
        style={{
          background: "#071a26",
          border: "1px solid rgba(244, 185, 100, 0.12)",
          maxHeight: "70vh",
        }}
      >
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="sb-title-sm" style={{ color: "#eaeef1" }}>
            Select Image
          </DialogTitle>
        </DialogHeader>

        {/* Search + Filters */}
        <div className="px-5 pt-3 pb-2 space-y-2.5">
          {/* Search input */}
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 z-10 pointer-events-none"
              style={{ color: "#6d8d9f" }}
            />
            <input
              type="text"
              placeholder="Search by prompt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sb-body-sm"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(244, 185, 100, 0.14)",
                color: "#eaeef1",
                padding: "10px 14px 10px 36px",
                outline: "none",
                fontFamily: "'General Sans', sans-serif",
                fontSize: "14px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(244, 185, 100, 0.45)"
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(244, 185, 100, 0.08)"
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(244, 185, 100, 0.14)"
                e.currentTarget.style.boxShadow = "none"
              }}
            />
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Aspect ratio chips */}
            {availableRatios.length > 1 && (
              <>
                <button
                  onClick={() => setRatioFilter(null)}
                  className="px-2.5 py-1 sb-caption transition-colors cursor-pointer"
                  style={{
                    border: `1px solid ${!ratioFilter ? "rgba(244, 185, 100, 0.35)" : "rgba(244, 185, 100, 0.1)"}`,
                    background: !ratioFilter ? "rgba(244, 185, 100, 0.08)" : "transparent",
                    color: !ratioFilter ? "#f4b964" : "#6d8d9f",
                  }}
                >
                  All
                </button>
                {availableRatios.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setRatioFilter(ratioFilter === ratio ? null : ratio)}
                    className="px-2.5 py-1 sb-caption transition-colors cursor-pointer"
                    style={{
                      border: `1px solid ${ratioFilter === ratio ? "rgba(244, 185, 100, 0.35)" : "rgba(244, 185, 100, 0.1)"}`,
                      background: ratioFilter === ratio ? "rgba(244, 185, 100, 0.08)" : "transparent",
                      color: ratioFilter === ratio ? "#f4b964" : "#6d8d9f",
                    }}
                  >
                    {ratio}
                  </button>
                ))}
              </>
            )}

            {/* Sort toggle — push to right */}
            <button
              onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
              className="ml-auto px-2.5 py-1 sb-caption transition-colors cursor-pointer"
              style={{
                border: "1px solid rgba(244, 185, 100, 0.1)",
                color: "#6d8d9f",
              }}
            >
              {sort === "newest" ? "Newest" : "Oldest"}
            </button>
          </div>
        </div>

        {/* Grid */}
        <ScrollArea className="flex-1 px-5 pb-5" style={{ maxHeight: "calc(70vh - 170px)" }}>
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                {hasActiveFilters ? "No images match your filters." : "No ready images in studio yet."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => { setSearch(""); setRatioFilter(null) }}
                  className="sb-caption mt-2 hover:underline cursor-pointer"
                  style={{ color: "#f4b964" }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((img) => {
                const isSelected = img.id === selectedImageId
                const isNew = Date.now() - img.createdAt < 60 * 60 * 1000
                return (
                  <button
                    key={img.id}
                    type="button"
                    className="text-left transition-all duration-200 group cursor-pointer"
                    style={{
                      border: isSelected
                        ? "1px solid rgba(244, 185, 100, 0.45)"
                        : "1px solid rgba(244, 185, 100, 0.1)",
                      background: isSelected
                        ? "rgba(244, 185, 100, 0.06)"
                        : "rgba(244, 185, 100, 0.02)",
                      transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    onClick={() => handleSelect(img)}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.borderColor = "rgba(244, 185, 100, 0.25)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.borderColor = "rgba(244, 185, 100, 0.1)"
                      }
                    }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      {img.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img.imageUrl}
                          alt={img.prompt || "Studio image"}
                          className="w-full h-[140px] object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div
                          className="w-full h-[140px] flex items-center justify-center"
                          style={{ background: "rgba(244, 185, 100, 0.05)" }}
                        >
                          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
                            No preview
                          </span>
                        </div>
                      )}
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 p-1"
                          style={{ background: "#f4b964" }}
                        >
                          <HugeiconsIcon icon={Tick02Icon} className="size-3" style={{ color: "#071a26" }} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <p
                        className="sb-body-sm line-clamp-2"
                        style={{ color: "#8fa8b8", minHeight: "2.5em" }}
                      >
                        {img.prompt || "Untitled image"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="sb-data" style={{ fontSize: 11, color: "#6d8d9f" }}>
                          {img.aspectRatio}
                        </span>
                        <span style={{ color: "#3a5565", fontSize: 11 }}>·</span>
                        <span className="sb-caption" style={{ color: "#4a6a7a" }}>
                          {timeAgo(img.createdAt)}
                        </span>
                        {isNew && (
                          <span className="sb-caption" style={{ color: "#f4b964", fontSize: 11 }}>
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
