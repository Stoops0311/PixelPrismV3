"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, Edit02Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BrandVoiceBannerProps {
  tone: string
  audience: string
  values?: string
  avoid?: string
  onEditClick?: () => void
  defaultCollapsed?: boolean
}

function BrandVoiceBanner({
  tone,
  audience,
  values,
  avoid,
  onEditClick,
  defaultCollapsed = false,
}: BrandVoiceBannerProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  return (
    <Card>
      <CardContent className="!p-0">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-between px-4 py-3"
          style={{
            transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <span className="sb-label" style={{ color: "#e8956a" }}>
            Brand Voice
          </span>
          <div className="flex items-center gap-2">
            {onEditClick && (
              <Button
                className="sb-btn-ghost !p-1 !min-h-0 !h-auto !text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditClick()
                }}
              >
                <HugeiconsIcon icon={Edit02Icon} size={14} color="#6d8d9f" />
              </Button>
            )}
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              color="#6d8d9f"
              style={{
                transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
                transition: "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </div>
        </button>
        <div
          style={{
            overflow: "hidden",
            maxHeight: collapsed ? 0 : 200,
            opacity: collapsed ? 0 : 1,
            transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div
            className="px-4 pb-3"
            style={{
              borderTop: "1px solid rgba(244,185,100,0.06)",
              borderLeft: collapsed ? "none" : "3px solid rgba(244,185,100,0.12)",
            }}
          >
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3">
              <div>
                <span className="sb-label" style={{ color: "#6d8d9f", fontSize: 10 }}>Tone</span>
                <p className="sb-body-sm" style={{ color: "#d4dce2" }}>{tone}</p>
              </div>
              <div>
                <span className="sb-label" style={{ color: "#6d8d9f", fontSize: 10 }}>Audience</span>
                <p className="sb-body-sm" style={{ color: "#d4dce2" }}>{audience}</p>
              </div>
              {values && (
                <div>
                  <span className="sb-label" style={{ color: "#6d8d9f", fontSize: 10 }}>Values</span>
                  <p className="sb-body-sm" style={{ color: "#d4dce2" }}>{values}</p>
                </div>
              )}
              {avoid && (
                <div>
                  <span className="sb-label" style={{ color: "#6d8d9f", fontSize: 10 }}>Avoid</span>
                  <p className="sb-body-sm" style={{ color: "#e85454" }}>{avoid}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { BrandVoiceBanner }
