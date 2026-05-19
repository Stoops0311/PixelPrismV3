"use client"

import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { DS2Spinner } from "@/components/ds2/spinner"
import { BrandLogosSection } from "@/components/ds2/brand-logos-section"

export default function LogosPage() {
  const params = useParams()
  const brandSlug = params.brandSlug as string
  const brand = useQuery(api.brands.getBySlug, { slug: brandSlug })

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
    <div style={{ padding: "32px 32px", maxWidth: 1100 }}>
      <div className="mb-8">
        <h2 className="sb-h2" style={{ color: "#eaeef1" }}>
          {brand.name} &middot; Logos
        </h2>
        <p className="sb-body mt-2" style={{ color: "#6d8d9f", maxWidth: 640 }}>
          Add the logos that should appear on your branded images. They&apos;ll show up
          in the studio sidebar as a togglable group &mdash; turn it on and the model
          composites every selected logo into the header area of each new generation.
        </p>
      </div>

      <BrandLogosSection brandId={brand._id} />
    </div>
  )
}
