"use client"

import { Suspense } from "react"
import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAction } from "@/lib/convex-mock"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { DS2Spinner } from "@/components/ds2/spinner"
import { showError } from "@/components/ds2/toast"

type CallbackState = {
  brandId?: string
  brandSlug?: string
  connectionType?:
    | "instagram_direct"
    | "instagram_facebook"
    | "linkedin_personal"
    | "linkedin_organization"
}

function decodeState(value: string | null): CallbackState | null {
  if (!value) return null

  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/")
    const base64 = padded + "=".repeat((4 - (padded.length % 4)) % 4)
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(json) as CallbackState
    return parsed
  } catch {
    return null
  }
}

function ConnectCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const syncAccountsForBrand = useAction(api.postformeActions.syncAccountsForBrand)
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return
    hasProcessed.current = true

    const run = async () => {
      const state = decodeState(searchParams.get("state"))
      let savedState: CallbackState | null = null
      try {
        const raw = localStorage.getItem("pixelprism:postforme:pending-connect")
        if (raw) {
          savedState = JSON.parse(raw) as CallbackState
        }
      } catch {
        savedState = null
      }

      const brandId =
        state?.brandId ||
        searchParams.get("brandId") ||
        savedState?.brandId ||
        null
      const brandSlug =
        state?.brandSlug ||
        searchParams.get("brandSlug") ||
        savedState?.brandSlug ||
        null
      const connectionType =
        state?.connectionType ||
        searchParams.get("connectionType") ||
        savedState?.connectionType ||
        null

      if (!brandId) {
        localStorage.removeItem("pixelprism:postforme:pending-connect")
        showError("Connection failed", "Missing brand context in callback")
        router.replace("/dashboard")
        return
      }

      try {
        await syncAccountsForBrand({
          brandId: brandId as Id<"brands">,
          preferredConnectionType:
            connectionType === "instagram_direct" ||
            connectionType === "instagram_facebook" ||
            connectionType === "linkedin_personal" ||
            connectionType === "linkedin_organization"
              ? connectionType
              : undefined,
        })

        localStorage.removeItem("pixelprism:postforme:pending-connect")
        if (brandSlug) {
          router.replace(`/dashboard/${brandSlug}/settings/social`)
        } else {
          router.replace("/dashboard")
        }
      } catch (error: unknown) {
        localStorage.removeItem("pixelprism:postforme:pending-connect")
        const message =
          error instanceof Error ? error.message : "Unable to sync connected account"
        showError("Connection failed", message)
        router.replace("/dashboard")
      }
    }

    void run()
  }, [router, searchParams, syncAccountsForBrand])

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <DS2Spinner />
    </div>
  )
}

export default function ConnectCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><DS2Spinner /></div>}>
      <ConnectCallbackInner />
    </Suspense>
  )
}
