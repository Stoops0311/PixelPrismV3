"use client"

import { useState, useRef, useCallback, type ReactNode } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { HugeiconsIcon } from "@hugeicons/react"
import { Image02Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useUploadThing } from "@/lib/uploadthing"
import { extractColorGrid } from "@/lib/color-grid"
import { showSuccess, showError } from "@/components/ds2/toast"

// ── Types ────────────────────────────────────────────────────────────────

interface UploadedImage {
  file: File
  previewUrl: string
  uploadedUrl?: string
  status: "uploading" | "done" | "error"
  progress: number
}

interface AddProductDialogProps {
  brandId?: Id<"brands">
  trigger?: ReactNode
  onCreated?: (productId: Id<"products">) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// ── Component ────────────────────────────────────────────────────────────

export function AddProductDialog({
  brandId,
  trigger,
  onCreated,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddProductDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled
    ? (v: boolean) => controlledOnOpenChange?.(v)
    : setInternalOpen

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<"forward" | "back">("forward")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const createProduct = useMutation(api.products.create)
  const createProductImage = useMutation(api.productImages.create)
  const updateProduct = useMutation(api.products.update)

  const { startUpload } = useUploadThing("productImage", {
    onUploadProgress: (progress) => {
      setImages((prev) =>
        prev.map((img) =>
          img.status === "uploading" ? { ...img, progress } : img
        )
      )
    },
  })

  const resetForm = useCallback(() => {
    setStep(1)
    setDirection("forward")
    setName("")
    setDescription("")
    // Revoke object URLs
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    setImages([])
    setIsCreating(false)
  }, [images])

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    },
    [setOpen, resetForm]
  )

  const handleFilesSelected = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const remaining = 3 - images.length
      if (remaining <= 0) return
      const toUpload = fileArray.slice(0, remaining)

      // Create preview entries
      const newImages: UploadedImage[] = toUpload.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        status: "uploading" as const,
        progress: 0,
      }))

      setImages((prev) => [...prev, ...newImages])

      // Upload via UploadThing
      try {
        const results = await startUpload(toUpload)
        if (results) {
          setImages((prev) =>
            prev.map((img) => {
              const matchIdx = toUpload.findIndex((f) => f === img.file)
              if (matchIdx !== -1 && results[matchIdx]) {
                return {
                  ...img,
                  uploadedUrl: results[matchIdx].ufsUrl,
                  status: "done" as const,
                  progress: 100,
                }
              }
              return img
            })
          )
        }
      } catch {
        setImages((prev) =>
          prev.map((img) =>
            img.status === "uploading"
              ? { ...img, status: "error" as const }
              : img
          )
        )
      }
    },
    [images.length, startUpload]
  )

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => {
      const removed = prev[index]
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer.files.length > 0) {
        handleFilesSelected(e.dataTransfer.files)
      }
    },
    [handleFilesSelected]
  )

  const handleCreate = async () => {
    if (!brandId || !name.trim()) return
    setIsCreating(true)
    try {
      const productId = await createProduct({
        brandId,
        name: name.trim(),
        description: description.trim(),
      })

      // Create productImage records for each successfully uploaded image
      const uploadedImages = images.filter(
        (img) => img.status === "done" && img.uploadedUrl
      )
      for (let i = 0; i < uploadedImages.length; i++) {
        const img = uploadedImages[i]
        await createProductImage({
          productId,
          imageUrl: img.uploadedUrl!,
          originalFileName: img.file.name,
          fileSize: img.file.size,
          mimeType: img.file.type,
        })
      }

      // Extract color grid from the first uploaded image and store it
      if (uploadedImages[0]?.uploadedUrl) {
        extractColorGrid(uploadedImages[0].uploadedUrl, productId).then((colorGrid) => {
          updateProduct({ productId, colorGrid }).catch(() => {
            // Non-critical — falls back to hash-based grid in the UI
          })
        })
      }

      handleOpenChange(false)

      showSuccess("Product created", `${name.trim()} is ready to use.`)

      onCreated?.(productId)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong"
      showError("Failed to create product", message)
    } finally {
      setIsCreating(false)
    }
  }

  const hasUploading = images.some((img) => img.status === "uploading")
  const canCreate = name.trim().length > 0 && !hasUploading

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sb-h3" style={{ color: "#eaeef1" }}>
            {step === 1 ? "Add Product" : "Upload Images"}
          </DialogTitle>
          <DialogDescription
            className="sb-body-sm"
            style={{ color: "#6d8d9f" }}
          >
            {step === 1
              ? "Tell us about your product."
              : "Add up to 3 reference images (optional)."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div
            className="space-y-4 py-4"
            key="step-1"
            style={{
              animation: `${direction === "back" ? "sb-step-back" : "sb-step-in"} 300ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
            }}
          >
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                ref={nameInputRef}
                placeholder="e.g. Summer Cold Brew"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your product in a few sentences..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div
            className="py-4 space-y-4"
            key="step-2"
            style={{
              animation: "sb-step-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Uploaded image thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, index) => (
                  <div key={img.previewUrl} className="relative">
                    <div
                      className="w-full overflow-hidden"
                      style={{
                        aspectRatio: "1 / 1",
                        border:
                          img.status === "error"
                            ? "2px solid rgba(232,84,84,0.4)"
                            : "1px solid rgba(244,185,100,0.12)",
                      }}
                    >
                      <img
                        src={img.previewUrl}
                        alt={img.file.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Upload progress overlay */}
                      {img.status === "uploading" && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(7,26,38,0.6)" }}
                        >
                          <div
                            className="w-3/4 h-1"
                            style={{
                              background: "rgba(244,185,100,0.2)",
                            }}
                          >
                            <div
                              style={{
                                width: `${img.progress}%`,
                                height: "100%",
                                background: "#f4b964",
                                transition: "width 200ms ease-out",
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {img.status === "error" && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(7,26,38,0.6)" }}
                        >
                          <p
                            className="sb-caption"
                            style={{ color: "#e85454" }}
                          >
                            Failed
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 p-0.5 cursor-pointer"
                      style={{
                        background: "#071a26",
                        border: "1px solid rgba(232,84,84,0.3)",
                        color: "#e85454",
                      }}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload drop zone — hidden when 3 images uploaded */}
            {images.length < 3 && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center cursor-pointer"
                style={{
                  height: images.length > 0 ? 80 : 160,
                  border: "2px dashed rgba(244,185,100,0.12)",
                  background: "rgba(244,185,100,0.02)",
                  transition:
                    "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <HugeiconsIcon
                    icon={Image02Icon}
                    size={images.length > 0 ? 20 : 32}
                    color="#6d8d9f"
                  />
                  <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                    {images.length > 0
                      ? `Add ${3 - images.length} more`
                      : "Drag images here or click to browse"}
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFilesSelected(e.target.files)
                e.target.value = ""
              }}
            />
          </div>
        )}

        <DialogFooter className="flex gap-3">
          {step === 2 && (
            <Button
              className="sb-btn-secondary"
              onClick={() => {
                setDirection("back")
                setStep(1)
              }}
            >
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button
              className="sb-btn-primary"
              onClick={() => {
                setDirection("forward")
                setStep(2)
              }}
              disabled={!name.trim()}
            >
              Next
            </Button>
          ) : (
            <Button
              className="sb-btn-primary"
              onClick={handleCreate}
              disabled={!canCreate || isCreating || !brandId}
            >
              {isCreating ? "Creating..." : "Create Product"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
