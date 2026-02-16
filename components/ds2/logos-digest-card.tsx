import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiChat02Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

function LogosDigestCard({
  insightText,
  timestamp,
  ctaLabel = "Chat with Logos",
  ctaHref,
}: {
  insightText: string
  timestamp: string
  ctaLabel?: string
  ctaHref?: string
}) {
  const relativeTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true })

  const cta = (
    <Button className="sb-btn-ghost-inline mt-3">
      {ctaLabel} <span className="sb-arrow ml-2">&rarr;</span>
    </Button>
  )

  return (
    <Card style={{ borderLeft: "4px solid #e8956a" }}>
      <CardContent>
        <div className="flex gap-4">
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              background: "rgba(244,185,100,0.08)",
              border: "1px solid rgba(244,185,100,0.12)",
            }}
          >
            <HugeiconsIcon icon={AiChat02Icon} size={20} color="#f4b964" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="sb-body" style={{ color: "#d4dce2" }}>
              {insightText}
            </p>
            <p className="sb-caption mt-2" style={{ color: "#6d8d9f" }}>
              {relativeTime}
            </p>
            {ctaHref ? <Link href={ctaHref}>{cta}</Link> : cta}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { LogosDigestCard }
