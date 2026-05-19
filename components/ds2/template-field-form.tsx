"use client"

import { useCallback, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Image02Icon,
  Add01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUploadThing } from "@/lib/uploadthing"
import { showError } from "@/components/ds2/toast"

export type TemplateFieldType = "text" | "longtext" | "list" | "image"

export interface TemplateField {
  id: string
  name: string
  type: TemplateFieldType
  placeholder?: string
}

export type TemplateFieldValue = string | string[]
export type TemplateFieldValues = Record<string, TemplateFieldValue>

interface TemplateFieldFormProps {
  fields: TemplateField[]
  values: TemplateFieldValues
  onChange: (values: TemplateFieldValues) => void
  compact?: boolean
}

export function TemplateFieldForm({
  fields,
  values,
  onChange,
  compact = false,
}: TemplateFieldFormProps) {
  const setField = useCallback(
    (id: string, value: TemplateFieldValue) => {
      onChange({ ...values, [id]: value })
    },
    [values, onChange]
  )

  if (fields.length === 0) {
    return (
      <p
        className="sb-caption"
        style={{ color: "#6d8d9f", padding: "8px 0" }}
      >
        This template has no editable fields.
      </p>
    )
  }

  return (
    <div className={compact ? "flex flex-col gap-4" : "flex flex-col gap-5"}>
      {fields.map((field) => (
        <FieldRow
          key={field.id}
          field={field}
          value={values[field.id]}
          onChange={(v) => setField(field.id, v)}
        />
      ))}
    </div>
  )
}

interface FieldRowProps {
  field: TemplateField
  value: TemplateFieldValue | undefined
  onChange: (value: TemplateFieldValue) => void
}

function FieldRow({ field, value, onChange }: FieldRowProps) {
  return (
    <div>
      <label
        className="sb-label block mb-2"
        style={{ color: "#e8956a" }}
      >
        {field.name}
      </label>
      {field.type === "text" && (
        <Input
          placeholder={field.placeholder ?? ""}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.type === "longtext" && (
        <Textarea
          placeholder={field.placeholder ?? ""}
          rows={3}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ resize: "vertical" }}
        />
      )}
      {field.type === "list" && (
        <ListField value={value} onChange={onChange} placeholder={field.placeholder} />
      )}
      {field.type === "image" && (
        <ImageField
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      )}
    </div>
  )
}

// ── List field ────────────────────────────────────────────────────────────

function ListField({
  value,
  onChange,
  placeholder,
}: {
  value: TemplateFieldValue | undefined
  onChange: (v: TemplateFieldValue) => void
  placeholder?: string
}) {
  const items: string[] = Array.isArray(value)
    ? value
    : typeof value === "string" && value.length > 0
      ? value.split("\n")
      : [""]

  const update = (next: string[]) => {
    onChange(next.length > 0 ? next : [""])
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <Input
            placeholder={placeholder ?? `Item ${idx + 1}`}
            value={item}
            onChange={(e) => {
              const next = [...items]
              next[idx] = e.target.value
              update(next)
            }}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => update(items.filter((_, i) => i !== idx))}
              className="cursor-pointer shrink-0"
              style={{
                padding: 8,
                border: "1px solid rgba(232,84,84,0.20)",
                color: "#e85454",
                background: "transparent",
                transition: "all 200ms ease",
              }}
              aria-label="Remove item"
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => update([...items, ""])}
        className="cursor-pointer self-start flex items-center gap-2"
        style={{
          padding: "6px 10px",
          border: "1px solid rgba(244,185,100,0.22)",
          color: "#f4b964",
          background: "transparent",
          fontSize: 12,
          letterSpacing: "0.04em",
          transition: "all 200ms ease",
        }}
      >
        <HugeiconsIcon icon={Add01Icon} size={14} />
        Add item
      </button>
    </div>
  )
}

// ── Image field ───────────────────────────────────────────────────────────

function ImageField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const { startUpload } = useUploadThing("templateFieldImage", {
    onUploadProgress: (p) => setProgress(p),
  })

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files)
      if (arr.length === 0) return
      setUploading(true)
      setProgress(0)
      try {
        const results = await startUpload([arr[0]])
        const uploaded = results?.[0]?.ufsUrl
        if (!uploaded) throw new Error("Upload failed")
        onChange(uploaded)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed"
        showError("Image upload failed", message)
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    [startUpload, onChange]
  )

  if (value) {
    return (
      <div className="relative">
        <div
          className="w-full overflow-hidden flex items-center justify-center"
          style={{
            height: 120,
            border: "1px solid rgba(244,185,100,0.22)",
            background: "#071a26",
          }}
        >
          <img
            src={value}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-2 right-2 p-1 cursor-pointer"
          style={{
            background: "rgba(7,26,38,0.8)",
            border: "1px solid rgba(232,84,84,0.20)",
            color: "#e85454",
          }}
          aria-label="Remove image"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
        }}
        className="flex flex-col items-center justify-center gap-2 cursor-pointer"
        style={{
          height: 100,
          border: "2px dashed rgba(244,185,100,0.12)",
          background: "rgba(244,185,100,0.02)",
          transition: "all 200ms ease",
        }}
      >
        {uploading ? (
          <>
            <div className="w-3/4 h-1" style={{ background: "rgba(244,185,100,0.2)" }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#f4b964",
                  transition: "width 200ms ease-out",
                }}
              />
            </div>
            <p className="sb-caption" style={{ color: "#6d8d9f" }}>
              Uploading… {Math.round(progress)}%
            </p>
          </>
        ) : (
          <>
            <HugeiconsIcon icon={Image02Icon} size={22} color="#6d8d9f" />
            <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
              {placeholder || "Drag an image or click to browse"}
            </p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ""
        }}
      />
    </div>
  )
}
