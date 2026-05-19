"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useAction, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Image02Icon,
  Cancel01Icon,
  Add01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DS2Spinner } from "@/components/ds2/spinner"
import { showError, showSuccess } from "@/components/ds2/toast"
import { useUploadThing } from "@/lib/uploadthing"
import type { TemplateField, TemplateFieldType } from "@/components/ds2/template-field-form"

const ASPECT_RATIOS = [
  "1:1",
  "4:5",
  "16:9",
  "9:16",
  "3:4",
  "4:3",
  "3:2",
  "2:3",
  "21:9",
]

const FIELD_TYPE_LABELS: Record<TemplateFieldType, string> = {
  text: "Text",
  longtext: "Long text",
  list: "List",
  image: "Image",
}

type WizardStep = "upload" | "extracting" | "review"

interface CreateTemplateWizardProps {
  brandId: Id<"brands"> | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (templateId: Id<"templates">) => void
  /** Pass an existing template to open in edit mode (skips upload + extraction). */
  existingTemplate?: Doc<"templates"> | null
}

interface UploadedImage {
  file: File
  previewUrl: string
  uploadedUrl?: string
  status: "uploading" | "done" | "error"
  progress: number
}

function slugify(raw: string, fallback: string): string {
  const s = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_\s-]/g, "")
    .replace(/[\s-]+/g, "_")
    .replace(/^[0-9_]+/, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
  return s || fallback
}

export function CreateTemplateWizard({
  brandId,
  open,
  onOpenChange,
  onCreated,
  existingTemplate,
}: CreateTemplateWizardProps) {
  const isEdit = !!existingTemplate

  const [step, setStep] = useState<WizardStep>(isEdit ? "review" : "upload")
  const [images, setImages] = useState<UploadedImage[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [styleDescription, setStyleDescription] = useState("")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [fields, setFields] = useState<TemplateField[]>([])
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showStyleDescription, setShowStyleDescription] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const extract = useAction(api.templateActions.extractTemplate)
  const createTemplate = useMutation(api.templates.create)
  const updateTemplate = useMutation(api.templates.update)

  const { startUpload } = useUploadThing("templateReference", {
    onUploadProgress: (progress) => {
      setImages((prev) =>
        prev.map((img) =>
          img.status === "uploading" ? { ...img, progress } : img
        )
      )
    },
  })

  // Hydrate form when entering edit mode or when the dialog reopens
  useEffect(() => {
    if (!open) return
    if (existingTemplate) {
      setStep("review")
      setName(existingTemplate.name)
      setDescription(existingTemplate.description)
      setStyleDescription(existingTemplate.styleDescription)
      setAspectRatio(existingTemplate.aspectRatio)
      setFields(existingTemplate.fields)
      setReferenceImageUrls(existingTemplate.referenceImageUrls)
    } else {
      setStep("upload")
      setImages([])
      setName("")
      setDescription("")
      setStyleDescription("")
      setAspectRatio("1:1")
      setFields([])
      setReferenceImageUrls([])
    }
    setShowStyleDescription(false)
  }, [open, existingTemplate])

  const close = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    onOpenChange(false)
  }, [images, onOpenChange])

  // ── Upload step ──────────────────────────────────────────────────────
  const handleFilesSelected = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const remaining = 3 - images.length
      if (remaining <= 0) return
      const toUpload = fileArray.slice(0, remaining)

      const newImages: UploadedImage[] = toUpload.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        status: "uploading" as const,
        progress: 0,
      }))
      setImages((prev) => [...prev, ...newImages])

      try {
        const results = await startUpload(toUpload)
        if (results) {
          setImages((prev) =>
            prev.map((img) => {
              const idx = toUpload.findIndex((f) => f === img.file)
              if (idx !== -1 && results[idx]) {
                return {
                  ...img,
                  uploadedUrl: results[idx].ufsUrl,
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

  const handleExtract = useCallback(async () => {
    if (!brandId) return
    const uploaded = images.filter((i) => i.status === "done" && i.uploadedUrl)
    if (uploaded.length === 0) return

    const urls = uploaded.map((i) => i.uploadedUrl!)
    setReferenceImageUrls(urls)
    setStep("extracting")
    try {
      const result = await extract({ brandId, imageUrls: urls })
      setName(result.name)
      setDescription(result.description)
      setStyleDescription(result.styleDescription)
      setAspectRatio(result.detectedAspectRatio)
      setFields(result.fields)
      setStep("review")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Extraction failed"
      showError("Couldn't analyze template", message)
      setStep("upload")
    }
  }, [brandId, images, extract])

  // ── Field editing ────────────────────────────────────────────────────
  const updateField = useCallback(
    (index: number, patch: Partial<TemplateField>) => {
      setFields((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], ...patch }
        return next
      })
    },
    []
  )

  const removeField = useCallback((index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addField = useCallback(() => {
    setFields((prev) => {
      const baseId = "field"
      let candidate = baseId
      let suffix = prev.length + 1
      const ids = new Set(prev.map((f) => f.id))
      while (ids.has(candidate)) {
        candidate = `${baseId}_${suffix++}`
      }
      return [
        ...prev,
        {
          id: candidate,
          name: `Field ${prev.length + 1}`,
          type: "text",
          placeholder: "",
        },
      ]
    })
  }, [])

  // ── Save ─────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!brandId) return
    if (!name.trim()) {
      showError("Name required", "Give your template a short name.")
      return
    }
    setIsSaving(true)
    try {
      // Normalize field IDs to ensure uniqueness + valid slugs
      const seen = new Set<string>()
      const normalizedFields: TemplateField[] = fields.map((f, i) => {
        const id = slugify(f.id || f.name, `field_${i + 1}`)
        let unique = id
        let s = 2
        while (seen.has(unique)) {
          unique = `${id}_${s++}`
        }
        seen.add(unique)
        return {
          id: unique,
          name: f.name.trim() || `Field ${i + 1}`,
          type: f.type,
          placeholder: f.placeholder?.trim() || undefined,
        }
      })

      if (isEdit && existingTemplate) {
        await updateTemplate({
          templateId: existingTemplate._id,
          name: name.trim(),
          description: description.trim(),
          styleDescription: styleDescription.trim(),
          aspectRatio,
          fields: normalizedFields,
        })
        showSuccess("Template updated", `${name.trim()} saved.`)
        onCreated?.(existingTemplate._id)
      } else {
        const templateId = await createTemplate({
          brandId,
          name: name.trim(),
          description: description.trim(),
          styleDescription: styleDescription.trim(),
          referenceImageUrls,
          aspectRatio,
          fields: normalizedFields,
        })
        showSuccess("Template created", `${name.trim()} is ready to use.`)
        onCreated?.(templateId)
      }
      close()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed"
      showError("Couldn't save template", message)
    } finally {
      setIsSaving(false)
    }
  }, [
    brandId,
    name,
    description,
    styleDescription,
    aspectRatio,
    fields,
    referenceImageUrls,
    createTemplate,
    updateTemplate,
    isEdit,
    existingTemplate,
    onCreated,
    close,
  ])

  const canExtract =
    images.length > 0 &&
    images.every((i) => i.status === "done") &&
    !!brandId

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : close())}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sb-h3" style={{ color: "#eaeef1" }}>
            {isEdit
              ? "Edit Template"
              : step === "upload"
                ? "New Template"
                : step === "extracting"
                  ? "Analyzing examples"
                  : "Review template"}
          </DialogTitle>
          <DialogDescription
            className="sb-body-sm"
            style={{ color: "#6d8d9f" }}
          >
            {isEdit
              ? "Adjust the name, fields, or aspect ratio."
              : step === "upload"
                ? "Upload 1-3 example images. Gemini will read them and extract a reusable template."
                : step === "extracting"
                  ? "Reading your examples, picking out fields, capturing the style…"
                  : "Make any adjustments. The fields below are what users will fill in to regenerate images in this template."}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="py-2 space-y-4">
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
                      {img.status === "uploading" && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(7,26,38,0.6)" }}
                        >
                          <div
                            className="w-3/4 h-1"
                            style={{ background: "rgba(244,185,100,0.2)" }}
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
                      aria-label="Remove image"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 3 && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  if (e.dataTransfer.files.length > 0)
                    handleFilesSelected(e.dataTransfer.files)
                }}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center cursor-pointer"
                style={{
                  height: images.length > 0 ? 80 : 160,
                  border: "2px dashed rgba(244,185,100,0.12)",
                  background: "rgba(244,185,100,0.02)",
                  transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
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
                      ? `Add ${3 - images.length} more (optional)`
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

        {step === "extracting" && (
          <div
            className="flex flex-col items-center justify-center gap-4"
            style={{ padding: "48px 0" }}
          >
            <DS2Spinner />
            <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
              Reading your examples with Gemini…
            </p>
          </div>
        )}

        {step === "review" && (
          <div className="py-2 space-y-5">
            {/* Thumbnails of reference images */}
            {referenceImageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {referenceImageUrls.map((url, i) => (
                  <div
                    key={url}
                    className="overflow-hidden"
                    style={{
                      aspectRatio: "1 / 1",
                      border: "1px solid rgba(244,185,100,0.12)",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Reference ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Course Promo Square"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this template for?"
              />
            </div>

            <div className="space-y-2">
              <Label>Aspect ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Style description</Label>
                <button
                  type="button"
                  onClick={() => setShowStyleDescription((v) => !v)}
                  className="sb-caption cursor-pointer"
                  style={{ color: "#f4b964" }}
                >
                  {showStyleDescription ? "Hide" : "Show / edit"}
                </button>
              </div>
              {showStyleDescription && (
                <Textarea
                  rows={6}
                  value={styleDescription}
                  onChange={(e) => setStyleDescription(e.target.value)}
                  placeholder="Detailed paragraph: layout, colors, typography, mood..."
                  style={{ resize: "vertical" }}
                />
              )}
              {!showStyleDescription && (
                <p
                  className="sb-caption"
                  style={{ color: "#6d8d9f", fontStyle: "italic" }}
                >
                  {styleDescription
                    ? `${styleDescription.slice(0, 140)}${styleDescription.length > 140 ? "…" : ""}`
                    : "(none yet)"}
                </p>
              )}
            </div>

            {/* Fields editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Fields</Label>
                <button
                  type="button"
                  onClick={addField}
                  className="cursor-pointer flex items-center gap-1"
                  style={{
                    padding: "4px 10px",
                    border: "1px solid rgba(244,185,100,0.22)",
                    color: "#f4b964",
                    background: "transparent",
                    fontSize: 12,
                  }}
                >
                  <HugeiconsIcon icon={Add01Icon} size={12} />
                  Add field
                </button>
              </div>

              {fields.length === 0 && (
                <p className="sb-caption" style={{ color: "#6d8d9f" }}>
                  No fields yet. Add at least one field if anything in this
                  template should change between generations.
                </p>
              )}

              {fields.map((field, i) => (
                <div
                  key={i}
                  className="grid gap-2 items-center"
                  style={{
                    gridTemplateColumns: "1fr 140px 40px",
                    padding: "8px",
                    border: "1px solid rgba(244,185,100,0.08)",
                  }}
                >
                  <Input
                    value={field.name}
                    onChange={(e) =>
                      updateField(i, { name: e.target.value })
                    }
                    placeholder="Field name"
                  />
                  <Select
                    value={field.type}
                    onValueChange={(v) =>
                      updateField(i, { type: v as TemplateFieldType })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        Object.keys(FIELD_TYPE_LABELS) as TemplateFieldType[]
                      ).map((t) => (
                        <SelectItem key={t} value={t}>
                          {FIELD_TYPE_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => removeField(i)}
                    className="cursor-pointer"
                    style={{
                      padding: 8,
                      border: "1px solid rgba(232,84,84,0.20)",
                      color: "#e85454",
                      background: "transparent",
                    }}
                    aria-label="Remove field"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-3">
          {step === "upload" && (
            <>
              <Button className="sb-btn-secondary" onClick={close}>
                Cancel
              </Button>
              <Button
                className="sb-btn-primary"
                onClick={handleExtract}
                disabled={!canExtract}
              >
                Continue
              </Button>
            </>
          )}
          {step === "review" && (
            <>
              <Button className="sb-btn-secondary" onClick={close}>
                Cancel
              </Button>
              <Button
                className="sb-btn-primary"
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
              >
                {isSaving
                  ? "Saving…"
                  : isEdit
                    ? "Save changes"
                    : "Save template"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
