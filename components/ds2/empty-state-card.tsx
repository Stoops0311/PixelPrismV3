import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconType = any

interface DS2EmptyStateCardProps {
  icon: IconType
  heading: string
  description?: string
  cta?: {
    label: string
    onClick: () => void
    variant?: "primary" | "secondary" | "ghost" | "destructive"
  }
  imagePlaceholders?: {
    count: number
    gridCols: number
    heights?: number[]
  }
  className?: string
}

/**
 * Full-featured empty state component with icon, heading, description,
 * CTA button, and optional pulsing placeholder grid.
 *
 * Used for page-level empty states (products, analytics, etc.)
 */
export function DS2EmptyStateCard({
  icon,
  heading,
  description,
  cta,
  imagePlaceholders,
  className,
}: DS2EmptyStateCardProps) {
  const buttonClass = cta?.variant
    ? `sb-btn-${cta.variant}`
    : "sb-btn-primary"

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-8", className)}>
      {/* Icon */}
      <HugeiconsIcon
        icon={icon}
        size={40}
        color="#6d8d9f"
        className="mb-6"
      />

      {/* Heading */}
      <h3 className="sb-h3 text-center mb-2">{heading}</h3>

      {/* Description */}
      {description && (
        <p className="sb-body-sm text-center mb-6 max-w-md" style={{ color: "#6d8d9f" }}>
          {description}
        </p>
      )}

      {/* CTA Button */}
      {cta && (
        <Button
          onClick={cta.onClick}
          className={cn(buttonClass, "mb-8")}
        >
          {cta.label}
        </Button>
      )}

      {/* Optional Placeholder Grid */}
      {imagePlaceholders && (
        <div
          className={cn(
            "grid gap-4 w-full max-w-4xl mt-4",
            `grid-cols-${imagePlaceholders.gridCols}`
          )}
          style={{
            gridTemplateColumns: `repeat(${imagePlaceholders.gridCols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: imagePlaceholders.count }).map((_, i) => {
            const height = imagePlaceholders.heights?.[i] || 180
            const delay = i * 150

            return (
              <div
                key={i}
                className="border-2 border-dashed rounded-none"
                style={{
                  borderColor: "rgba(244, 185, 100, 0.12)",
                  backgroundColor: "rgba(244, 185, 100, 0.02)",
                  height: `${height}px`,
                  animation: `sb-empty-pulse 2s ease-in-out infinite`,
                  animationDelay: `${delay}ms`,
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
