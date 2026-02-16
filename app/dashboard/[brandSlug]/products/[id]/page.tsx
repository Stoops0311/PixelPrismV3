"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Image02Icon, ArrowLeft01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MOCK_PRODUCTS, MOCK_GENERATED_IMAGES } from "@/lib/mock-data"
import type { GeneratedImage } from "@/types/dashboard"

// ── Aspect ratio to height map for masonry ───────────────────────────────

const ASPECT_HEIGHTS: Record<string, number> = {
  "1:1": 220,
  "4:5": 260,
  "16:9": 160,
  "9:16": 320,
}

// ── Gallery Image Card ───────────────────────────────────────────────────

function GalleryImageCard({ image }: { image: GeneratedImage }) {
  const height = ASPECT_HEIGHTS[image.aspectRatio] ?? 220

  const statusColor =
    image.status === "ready"
      ? "#f4b964"
      : image.status === "scheduled"
        ? "#e8956a"
        : "#6d8d9f"

  return (
    <div style={{ breakInside: "avoid", marginBottom: 24 }}>
      <Card className="overflow-hidden cursor-pointer" data-interactive>
        {/* Image placeholder */}
        <div
          className="w-full flex items-center justify-center"
          style={{
            height,
            background: image.gradient,
          }}
        >
          <HugeiconsIcon icon={Image02Icon} size={24} color="rgba(255,255,255,0.2)" />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: "1px solid rgba(244,185,100,0.08)" }}
        >
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
            {format(new Date(image.createdAt), "MMM d, yyyy")}
          </span>
          <div className="flex items-center gap-2">
            <span className="sb-caption" style={{ color: "#6d8d9f" }}>
              {image.aspectRatio}
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

// ── Page ─────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams()
  const brandSlug = params.brandSlug as string
  const productId = params.id as string

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) ?? MOCK_PRODUCTS[0]
  const productImages = MOCK_GENERATED_IMAGES.filter(
    (img) => img.productId === product.id
  )

  return (
    <div>
      {/* Back navigation */}
      <Link
        href={`/dashboard/${brandSlug}/products`}
        className="sb-btn-ghost-inline inline-flex items-center gap-1.5 mb-8"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        <span>Back to Products</span>
      </Link>

      {/* Product Header — two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left: Product image (40%) */}
        <div className="md:col-span-2">
          <div
            className="w-full flex items-center justify-center"
            style={{
              aspectRatio: "1",
              background: product.gradient,
              border: "1px solid rgba(244,185,100,0.12)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
            }}
          >
            <HugeiconsIcon icon={Image02Icon} size={48} color="rgba(255,255,255,0.2)" />
          </div>
        </div>

        {/* Right: Product info (60%) */}
        <div className="md:col-span-3 flex flex-col justify-center">
          <h2 className="sb-h2" style={{ color: "#eaeef1" }}>
            {product.name}
          </h2>
          <p className="sb-body mt-4" style={{ color: "#d4dce2" }}>
            {product.description}
          </p>

          {/* Metadata row */}
          <div
            className="flex items-center gap-8 mt-8 pt-6"
            style={{ borderTop: "1px solid rgba(244,185,100,0.08)" }}
          >
            <div>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>Created</p>
              <p className="sb-data mt-1" style={{ color: "#d4dce2" }}>
                {format(new Date(product.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <div className="pl-8" style={{ borderLeft: "1px solid rgba(244,185,100,0.08)" }}>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>Images</p>
              <p className="sb-data mt-1" style={{ color: "#eaeef1" }}>
                {product.imageCount}
              </p>
            </div>
            <div className="pl-8" style={{ borderLeft: "1px solid rgba(244,185,100,0.08)" }}>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>Credits Spent</p>
              <p className="sb-data mt-1" style={{ color: "#eaeef1" }}>
                {product.creditsSpent}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open in Studio CTA */}
      <div className="mt-10">
        <Link href={`/dashboard/${brandSlug}/studio?product=${product.id}`}>
          <Button className="sb-btn-primary w-full gap-2">
            Open in Studio
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
          </Button>
        </Link>
        <p className="sb-caption mt-2 text-center" style={{ color: "#6d8d9f" }}>
          Generate new images for this product in the Studio workspace
        </p>
      </div>

      {/* Product Image Gallery — Masonry */}
      <div className="mt-20">
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Gallery</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>
          Generated Images
        </h3>

        {productImages.length > 0 ? (
          <div
            className="[column-count:1] md:[column-count:2] lg:[column-count:3]"
            style={{ columnGap: 24 }}
          >
            {productImages.map((image) => (
              <GalleryImageCard key={image.id} image={image} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{
                  height: i % 2 === 0 ? 180 : 220,
                  border: "2px dashed rgba(244,185,100,0.12)",
                  background: "rgba(244,185,100,0.02)",
                  animation: "sb-empty-pulse 2s ease-in-out infinite",
                  animationDelay: `${i * 150}ms`,
                }}
              >
                {i === 2 && (
                  <div className="text-center px-4">
                    <HugeiconsIcon icon={Image02Icon} size={32} color="#6d8d9f" />
                    <p className="sb-body-sm mt-2" style={{ color: "#6d8d9f" }}>
                      No images yet. Open in Studio to start creating.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
