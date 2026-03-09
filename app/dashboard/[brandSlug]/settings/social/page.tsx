"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatusBadge } from "@/components/ds2/status-badge"
import { DS2Spinner } from "@/components/ds2/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { InstagramIcon, Facebook02Icon, Link04Icon, Add01Icon } from "@hugeicons/core-free-icons"
import { showError, showSuccess } from "@/components/ds2/toast"

type ConnectOption = {
  id: string
  title: string
  platform: "instagram" | "facebook" | "linkedin" | "pinterest"
  connectionType?:
    | "instagram_direct"
    | "instagram_facebook"
    | "linkedin_personal"
    | "linkedin_organization"
  description: string
}

const CONNECT_OPTIONS: ConnectOption[] = [
  {
    id: "instagram-direct",
    title: "Instagram Direct",
    platform: "instagram",
    connectionType: "instagram_direct",
    description: "Connect an Instagram account directly.",
  },
  {
    id: "instagram-facebook",
    title: "Instagram From Facebook",
    platform: "instagram",
    connectionType: "instagram_facebook",
    description: "Connect Instagram through Facebook authorization.",
  },
  {
    id: "facebook",
    title: "Facebook",
    platform: "facebook",
    description: "Connect Facebook pages for scheduling and analytics.",
  },
  {
    id: "linkedin-personal",
    title: "LinkedIn Personal",
    platform: "linkedin",
    connectionType: "linkedin_personal",
    description: "Connect LinkedIn personal profile posting.",
  },
  {
    id: "linkedin-organization",
    title: "LinkedIn Organization",
    platform: "linkedin",
    connectionType: "linkedin_organization",
    description: "Connect LinkedIn organization page posting.",
  },
  {
    id: "pinterest",
    title: "Pinterest",
    platform: "pinterest",
    description: "Connect Pinterest accounts for visual content publishing.",
  },
]

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "instagram") {
    return <HugeiconsIcon icon={InstagramIcon} size={18} color="#e8956a" />
  }
  if (platform === "facebook") {
    return <HugeiconsIcon icon={Facebook02Icon} size={18} color="#64dcf4" />
  }
  return <HugeiconsIcon icon={Link04Icon} size={18} color="#f4b964" />
}

export default function SocialAccountsSettingsPage() {
  const params = useParams()
  const brandSlug = params.brandSlug as string

  const brand = useQuery(api.brands.getBySlug, { slug: brandSlug })
  const accounts = useQuery(
    api.socialAccounts.listByBrand,
    brand ? { brandId: brand._id } : "skip"
  )
  const currentUser = useQuery(api.users.current)

  const createAuthUrl = useAction(api.postformeActions.createAuthUrl)
  const disconnectAccount = useMutation(api.socialAccounts.disconnect)

  const [connecting, setConnecting] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  const connectedCount = useMemo(
    () => (accounts ?? []).filter((acc) => acc.status === "connected").length,
    [accounts]
  )

  const maxAccounts = currentUser?.maxSocialAccounts ?? 0

  if (brand === undefined || accounts === undefined || currentUser === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <DS2Spinner />
      </div>
    )
  }

  if (!brand) {
    return (
      <div>
        <h1 className="sb-h1" style={{ color: "#eaeef1" }}>Brand not found</h1>
      </div>
    )
  }

  const handleConnect = async (option: ConnectOption) => {
    try {
      setConnecting(option.id)

      localStorage.setItem(
        "pixelprism:postforme:pending-connect",
        JSON.stringify({
          brandId: brand._id,
          brandSlug,
          connectionType: option.connectionType,
          createdAt: Date.now(),
        })
      )

      const url = await createAuthUrl({
        brandId: brand._id,
        platform: option.platform,
        connectionType: option.connectionType,
        brandSlug,
      })
      window.location.href = url
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to start OAuth flow"
      showError("Connection failed", message)
      setConnecting(null)
    }
  }

  const handleDisconnect = async (socialAccountId: Id<"socialAccounts">) => {
    try {
      setDisconnecting(String(socialAccountId))
      await disconnectAccount({ socialAccountId })
      showSuccess("Disconnected", "Social account disconnected successfully")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to disconnect account"
      showError("Disconnect failed", message)
    } finally {
      setDisconnecting(null)
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Publishing Setup</p>
        <h1 className="sb-h1" style={{ color: "#eaeef1" }}>Social Accounts</h1>
        <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
          Connect channels to publish and sync analytics. {connectedCount}/{maxAccounts} connected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CONNECT_OPTIONS.map((option) => (
          <Card key={option.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={option.platform} />
                  <CardTitle className="sb-h4" style={{ color: "#eaeef1" }}>
                    {option.title}
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                {option.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="sb-btn-primary w-full"
                onClick={() => handleConnect(option)}
                disabled={connecting !== null || connectedCount >= maxAccounts}
              >
                <HugeiconsIcon icon={Add01Icon} size={14} className="mr-2" />
                {connecting === option.id ? "Connecting..." : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Connected</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Active Accounts</h3>

        <div className="space-y-4">
          {accounts.length === 0 ? (
            <Card>
              <CardContent>
                <p className="sb-body" style={{ color: "#6d8d9f" }}>
                  No accounts connected yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            accounts.map((account) => (
              <Card key={account._id}>
                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={account.platform} />
                        <p className="sb-h4" style={{ color: "#eaeef1" }}>
                          {account.displayName || account.username || account.platform}
                        </p>
                        <StatusBadge status={account.status === "connected" ? "live" : "failed"}>
                          {account.status}
                        </StatusBadge>
                      </div>
                      <p className="sb-body-sm mt-1" style={{ color: "#6d8d9f" }}>
                        {account.username ? `@${account.username}` : "No username available"}
                      </p>
                    </div>

                    {account.status === "connected" ? (
                      <Button
                        className="sb-btn-secondary"
                        onClick={() => handleDisconnect(account._id)}
                        disabled={disconnecting === String(account._id)}
                      >
                        {disconnecting === String(account._id) ? "Disconnecting..." : "Disconnect"}
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
