import { cn } from "@/lib/utils"

interface DS2EmptyContainerProps {
  children: React.ReactNode
  minHeight?: string
  className?: string
}

/**
 * Lightweight wrapper for inline empty states with dashed gold border.
 * Used for empty sections within existing layouts (mini calendar, recent studio, etc.)
 */
export function DS2EmptyContainer({
  children,
  minHeight = "h-48",
  className,
}: DS2EmptyContainerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "border-2 border-dashed",
        "rounded-none", // Zero border-radius
        minHeight,
        "p-8",
        className
      )}
      style={{
        borderColor: "rgba(244, 185, 100, 0.12)",
        backgroundColor: "rgba(244, 185, 100, 0.02)",
      }}
    >
      {children}
    </div>
  )
}
