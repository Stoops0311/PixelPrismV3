"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete02Icon, MagicWand01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DS2Spinner } from "@/components/ds2/spinner"
import { CreateTemplateWizard } from "@/components/ds2/create-template-wizard"
import { showError, showSuccess } from "@/components/ds2/toast"

export default function TemplatesPage() {
  const params = useParams()
  const brandSlug = params.brandSlug as string
  const brand = useQuery(api.brands.getBySlug, { slug: brandSlug })
  const templates = useQuery(
    api.templates.list,
    brand ? { brandId: brand._id } : "skip"
  )
  const removeTemplate = useMutation(api.templates.remove)

  const [wizardOpen, setWizardOpen] = useState(false)
  const [editing, setEditing] = useState<Doc<"templates"> | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Doc<"templates"> | null>(null)

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await removeTemplate({ templateId: pendingDelete._id })
      showSuccess("Template deleted", `${pendingDelete.name} removed.`)
      setPendingDelete(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed"
      showError("Could not delete template", message)
    }
  }

  if (brand === undefined) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <DS2Spinner />
      </div>
    )
  }

  if (!brand) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <p className="sb-body" style={{ color: "#6d8d9f" }}>
          Brand not found.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: "32px 32px", maxWidth: 1200 }}>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="sb-h2" style={{ color: "#eaeef1" }}>
            {brand.name} &middot; Templates
          </h2>
          <p
            className="sb-body mt-2"
            style={{ color: "#6d8d9f", maxWidth: 640 }}
          >
            Save reusable layouts from example images. When a template is selected
            in the studio, the prompt becomes a fill-in form instead of free text.
          </p>
        </div>
        <Button
          className="sb-btn-primary flex items-center gap-2"
          onClick={() => {
            setEditing(null)
            setWizardOpen(true)
          }}
        >
          <HugeiconsIcon icon={Add01Icon} size={14} />
          New Template
        </Button>
      </div>

      {templates === undefined ? (
        <div className="flex items-center justify-center py-16">
          <DS2Spinner />
        </div>
      ) : templates.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{
            padding: "64px 24px",
            border: "1px dashed rgba(244,185,100,0.18)",
            background: "rgba(244,185,100,0.02)",
          }}
        >
          <HugeiconsIcon icon={MagicWand01Icon} size={32} color="#f4b964" />
          <p className="sb-body mt-4" style={{ color: "#eaeef1" }}>
            No templates yet.
          </p>
          <p
            className="sb-caption mt-2"
            style={{ color: "#6d8d9f", maxWidth: 420, textAlign: "center" }}
          >
            Drop in 1-3 example images of the look you want to repeat. We&apos;ll
            read them with Gemini and turn them into a reusable template.
          </p>
          <Button
            className="sb-btn-primary mt-6 flex items-center gap-2"
            onClick={() => {
              setEditing(null)
              setWizardOpen(true)
            }}
          >
            <HugeiconsIcon icon={Add01Icon} size={14} />
            Create your first template
          </Button>
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}
        >
          {templates.map((t) => (
            <TemplateCard
              key={t._id}
              template={t}
              onEdit={() => {
                setEditing(t)
                setWizardOpen(true)
              }}
              onDelete={() => setPendingDelete(t)}
            />
          ))}
        </div>
      )}

      <CreateTemplateWizard
        brandId={brand._id}
        open={wizardOpen}
        onOpenChange={(v) => {
          setWizardOpen(v)
          if (!v) setEditing(null)
        }}
        existingTemplate={editing}
      />

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(v) => !v && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} will be permanently removed. Existing
              generated images are unaffected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              style={{ background: "#e85454", color: "#fff" }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function TemplateCard({
  template,
  onEdit,
  onDelete,
}: {
  template: Doc<"templates">
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div
      className="group cursor-pointer flex flex-col"
      onClick={onEdit}
      style={{
        border: "1px solid rgba(244,185,100,0.12)",
        background: "rgba(255,255,255,0.02)",
        transition: "all 200ms ease",
      }}
    >
      <div
        className="w-full overflow-hidden relative"
        style={{ aspectRatio: "1 / 1", background: "#071a26" }}
      >
        <img
          src={template.thumbnailUrl}
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          style={{
            background: "rgba(7,26,38,0.85)",
            border: "1px solid rgba(232,84,84,0.25)",
            color: "#e85454",
          }}
          aria-label="Delete template"
        >
          <HugeiconsIcon icon={Delete02Icon} size={12} />
        </button>
      </div>
      <div className="p-4">
        <h4 className="sb-h4" style={{ color: "#eaeef1" }}>
          {template.name}
        </h4>
        {template.description && (
          <p
            className="sb-body-sm mt-1 line-clamp-2"
            style={{ color: "#6d8d9f" }}
          >
            {template.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3">
          <span
            className="sb-caption"
            style={{
              color: "#6d8d9f",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {template.aspectRatio}
          </span>
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
            &middot;
          </span>
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
            {template.fields.length} field{template.fields.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  )
}
