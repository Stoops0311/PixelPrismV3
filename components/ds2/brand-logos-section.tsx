"use client"

import { useCallback, useRef, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { HugeiconsIcon } from "@hugeicons/react"
import { Image02Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { useUploadThing } from "@/lib/uploadthing"
import { showSuccess, showError } from "@/components/ds2/toast"

interface BrandLogosSectionProps {
  brandId: Id<"brands"> | undefined
  /** When true, render a more compact layout suitable for embedding in a dialog. */
  compact?: boolean
}

export function BrandLogosSection({ brandId, compact = false }: BrandLogosSectionProps) {
  const logos = useQuery(
    api.brandLogos.list,
    brandId ? { brandId } : "skip"
  )
  const createLogo = useMutation(api.brandLogos.create)
  const removeLogo = useMutation(api.brandLogos.remove)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingCount, setUploadingCount] = useState(0)

  const { startUpload } = useUploadThing("brandLogo")

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!brandId) return
      const arr = Array.from(files)
      if (arr.length === 0) return
      setUploadingCount(arr.length)

      try {
        const results = await startUpload(arr)
        if (!results) throw new Error("Upload failed")
        for (let i = 0; i < results.length; i++) {
          const r = results[i]
          const file = arr[i]
          if (!r?.ufsUrl || !file) continue
          await createLogo({
            brandId,
            imageUrl: r.ufsUrl,
            originalFileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          })
        }
        showSuccess(
          arr.length === 1 ? "Logo added" : "Logos added",
          arr.length === 1
            ? "Available in the studio sidebar."
            : `${arr.length} logos added.`
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed"
        showError("Failed to add logo", message)
      } finally {
        setUploadingCount(0)
      }
    },
    [brandId, startUpload, createLogo]
  )

  const handleDelete = useCallback(
    async (logoId: Id<"brandLogos">) => {
      try {
        await removeLogo({ logoId })
        showSuccess("Logo removed", "")
      } catch (err) {
        const message = err instanceof Error ? err.message : "Delete failed"
        showError("Could not remove logo", message)
      }
    },
    [removeLogo]
  )

  const tileSize = compact ? 72 : 120
  type LogoRow = NonNullable<typeof logos> extends Array<infer T> ? T : never
  const list: LogoRow[] = logos ?? []
  const isLoading = brandId !== undefined && logos === undefined

  return (
    <div className="flex flex-col gap-4">
      {!compact && (
        <div>
          <h3 className="sb-h4" style={{ color: "#eaeef1" }}>
            Logos
          </h3>
          <p className="sb-body-sm mt-1" style={{ color: "#6d8d9f" }}>
            Upload one or more logos. They&apos;ll be available in the studio sidebar
            and composited into generated images when you toggle &ldquo;Include brand logos&rdquo; on.
          </p>
        </div>
      )}

      {isLoading ? (
        <p className="sb-caption" style={{ color: "#6d8d9f" }}>
          Loading…
        </p>
      ) : (
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${tileSize}px, 1fr))`,
          }}
        >
          {list.map((logo) => (
            <div key={logo._id} className="relative group">
              <div
                className="w-full overflow-hidden flex items-center justify-center"
                style={{
                  aspectRatio: "1 / 1",
                  background: "#071a26",
                  border: "1px solid rgba(244,185,100,0.12)",
                  padding: 8,
                }}
              >
                <img
                  src={logo.imageUrl}
                  alt={logo.originalFileName}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleDelete(logo._id)}
                className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                style={{
                  background: "rgba(7,26,38,0.85)",
                  border: "1px solid rgba(232,84,84,0.25)",
                  color: "#e85454",
                }}
                aria-label="Delete logo"
              >
                <HugeiconsIcon icon={Delete02Icon} size={12} />
              </button>
            </div>
          ))}

          {/* Uploading skeletons */}
          {Array.from({ length: uploadingCount }).map((_, i) => (
            <div
              key={`uploading-${i}`}
              className="w-full flex items-center justify-center"
              style={{
                aspectRatio: "1 / 1",
                background: "rgba(244,185,100,0.04)",
                border: "1px dashed rgba(244,185,100,0.22)",
              }}
            >
              <div
                className="w-2 h-2"
                style={{
                  background: "#f4b964",
                  animation: "sb-pulse 1s ease-in-out infinite",
                }}
              />
            </div>
          ))}

          {/* Upload tile */}
          <button
            type="button"
            disabled={!brandId || uploadingCount > 0}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
            }}
            className="cursor-pointer flex flex-col items-center justify-center gap-1"
            style={{
              aspectRatio: "1 / 1",
              border: "2px dashed rgba(244,185,100,0.18)",
              background: "rgba(244,185,100,0.02)",
              color: "#6d8d9f",
              transition: "all 200ms ease",
            }}
          >
            <HugeiconsIcon icon={Image02Icon} size={compact ? 16 : 22} />
            <span
              className="sb-caption"
              style={{ color: "#6d8d9f", textAlign: "center", padding: "0 6px" }}
            >
              {list.length === 0 ? "Add first logo" : "Add"}
            </span>
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ""
        }}
      />
    </div>
  )
}
