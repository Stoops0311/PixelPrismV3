"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Image02Icon, Add01Icon, PackageIcon } from "@hugeicons/core-free-icons"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import type { Product } from "@/types/dashboard"
import { DS2EmptyStateCard } from "@/components/ds2/empty-state-card"

// ── Product Card ─────────────────────────────────────────────────────────

function ProductCard({ product, brandSlug }: { product: Product; brandSlug: string }) {
  return (
    <Link href={`/dashboard/${brandSlug}/products/${product.id}`}>
      <Card className="cursor-pointer overflow-hidden group">
        {/* Product image placeholder */}
        <div className="w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover/card:scale-[1.02]"
            style={{
              background: product.gradient,
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <span className="sb-label" style={{ color: "rgba(255,255,255,0.3)" }}>
              Product Image
            </span>
          </div>
        </div>

        <CardContent className="pt-4">
          <h4 className="sb-h4" style={{ color: "#eaeef1" }}>
            {product.name}
          </h4>
          <p
            className="sb-body-sm mt-1.5 line-clamp-2"
            style={{ color: "#6d8d9f" }}
          >
            {product.description}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <HugeiconsIcon icon={Image02Icon} size={14} color="#6d8d9f" />
            <span className="sb-caption" style={{ color: "#6d8d9f" }}>
              {product.imageCount} images
            </span>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="sb-btn-secondary w-full"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              window.location.href = `/dashboard/${brandSlug}/studio?product=${product.id}`
            }}
          >
            Open in Studio
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

// ── Add Product Dialog ───────────────────────────────────────────────────

function AddProductDialog({ triggerOnly = false }: { triggerOnly?: boolean }) {
  const [step, setStep] = useState(1)
  const [open, setOpen] = useState(false)
  const [direction, setDirection] = useState<"forward" | "back">("forward")

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setStep(1); setDirection("forward") } }}>
      <DialogTrigger asChild>
        <Button className="sb-btn-primary">
          <HugeiconsIcon icon={Add01Icon} size={16} className="mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sb-h3" style={{ color: "#eaeef1" }}>
            {step === 1 ? "Add Product" : "Upload Image"}
          </DialogTitle>
          <DialogDescription className="sb-body-sm" style={{ color: "#6d8d9f" }}>
            {step === 1
              ? "Tell us about your product."
              : "Add a product image (optional)."}
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
              <Input placeholder="e.g. Summer Cold Brew" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe your product in a few sentences..." rows={3} />
            </div>
          </div>
        ) : (
          <div
            className="py-4"
            key="step-2"
            style={{
              animation: "sb-step-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div
              className="flex items-center justify-center h-40"
              style={{
                border: "2px dashed rgba(244,185,100,0.12)",
                background: "rgba(244,185,100,0.02)",
              }}
            >
              <div className="text-center">
                <HugeiconsIcon icon={Image02Icon} size={32} color="#6d8d9f" />
                <p className="sb-body-sm mt-2" style={{ color: "#6d8d9f" }}>
                  Drag an image here or click to browse
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-3">
          {step === 2 && (
            <Button
              className="sb-btn-secondary"
              onClick={() => { setDirection("back"); setStep(1) }}
            >
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button
              className="sb-btn-primary"
              onClick={() => { setDirection("forward"); setStep(2) }}
            >
              Next
            </Button>
          ) : (
            <Button
              className="sb-btn-primary"
              onClick={() => setOpen(false)}
            >
              Create Product
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const params = useParams()
  const brandSlug = params.brandSlug as string
  const searchParams = useSearchParams()
  const forceEmpty = searchParams.get('empty') === 'true'

  const showEmpty = forceEmpty || MOCK_PRODUCTS.length === 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="sb-h1" style={{ color: "#eaeef1" }}>Products</h1>
          <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
            Manage your brand&apos;s products and generate marketing images.
          </p>
          <p className="mt-2">
            <span className="sb-data" style={{ color: "#d4dce2" }}>
              {MOCK_PRODUCTS.length}
            </span>
            <span className="sb-caption ml-2" style={{ color: "#6d8d9f" }}>
              products
            </span>
          </p>
        </div>
        <AddProductDialog />
      </div>

      {/* Product Grid Section */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Catalog</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Your Products</h3>

        {showEmpty ? (
          <DS2EmptyStateCard
            icon={PackageIcon}
            heading="No products yet"
            description="Add your first product to start generating marketing images."
            cta={{
              label: "Add Product",
              onClick: () => {
                // Trigger the dialog
                const btn = document.querySelector('[data-add-product-trigger]') as HTMLButtonElement
                btn?.click()
              },
              variant: "primary"
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PRODUCTS.map((product, index) => (
              <div
                key={product.id}
                style={{
                  animation: "sb-card-enter 400ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
                  animationDelay: `${index * 60}ms`,
                }}
              >
                <ProductCard
                  product={product}
                  brandSlug={brandSlug}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
