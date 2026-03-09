"use client"

import type { CSSProperties } from "react"

const FALLBACK_COLOR = "#0e2838"

interface ColorGridProps {
  colors: string[]        // 16 hex values (fewer = padded with fallback)
  size?: number           // explicit px dimension (width & height); omit for fill mode
  fill?: boolean          // if true, takes 100% of parent (ignores size)
  className?: string
  style?: CSSProperties
}

export function ColorGrid({ colors, size = 48, fill = false, className, style }: ColorGridProps) {
  const cells: string[] = Array.from({ length: 16 }, (_, i) => colors[i] ?? FALLBACK_COLOR)

  return (
    <div
      className={className}
      style={{
        width: fill ? "100%" : size,
        height: fill ? "100%" : size,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        border: fill ? "none" : "1px solid rgba(244,185,100,0.12)",
        flexShrink: 0,
        ...style,
      }}
    >
      {cells.map((color, i) => (
        <div key={i} style={{ background: color }} />
      ))}
    </div>
  )
}
