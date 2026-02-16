import * as React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function DS2StatCard({
  label,
  value,
  description,
  trend,
  badge,
  action,
  valueStyle,
}: {
  label: string
  value: string
  description?: string
  trend?: { value: string; direction: "up" | "down" | "neutral" }
  badge?: React.ReactNode
  action?: { label: string; onClick: () => void }
  valueStyle?: React.CSSProperties
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <p className="sb-label" style={{ color: "#6d8d9f" }}>{label}</p>
          {badge}
        </div>
        <CardTitle className="sb-data-lg" style={{ color: "#eaeef1", ...valueStyle }}>
          {value}
        </CardTitle>
        {description && (
          <CardDescription className="sb-body-sm" style={{ color: "#6d8d9f" }}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {trend && (
        <CardContent>
          <span
            className="sb-data inline-flex items-center gap-1.5"
            style={{
              color: trend.direction === "up" ? "#f4b964" : trend.direction === "down" ? "#e85454" : "#6d8d9f",
            }}
          >
            {trend.direction === "up" && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <polygon points="5,1 9,7 1,7" />
              </svg>
            )}
            {trend.direction === "down" && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <polygon points="1,3 9,3 5,9" />
              </svg>
            )}
            {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
            {trend.value}
          </span>
        </CardContent>
      )}
      {action && (
        <CardFooter className="border-t border-[rgba(244,185,100,0.06)]">
          <Button
            className="sb-btn-ghost-inline"
            onClick={action.onClick}
          >
            {action.label} <span className="sb-arrow ml-2">&rarr;</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export { DS2StatCard }
