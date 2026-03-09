"use client"

import { useRef } from "react"

interface MobileStat {
  label: string
  value: string
  trend?: { value: string; direction: "up" | "down" | "neutral" }
  accent?: boolean
}

/**
 * Horizontal scrollable stat strip for mobile.
 * Replaces the 3-5 column stat card grid on narrow viewports.
 * Each stat is a compact pill-like card with snap scrolling.
 */
export function MobileStatStrip({ stats }: { stats: MobileStat[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="lg:hidden -mx-4">
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 4,
          // Hide scrollbar
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label + i}
            style={{
              scrollSnapAlign: "start",
              flexShrink: 0,
              minWidth: 140,
              maxWidth: 180,
              background: "#0e2838",
              border: "1px solid rgba(244, 185, 100, 0.12)",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#6d8d9f",
                fontFamily: "'Neue Montreal', sans-serif",
              }}
            >
              {stat.label}
            </span>
            <span
              className="sb-data"
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: stat.accent ? "#f4b964" : "#eaeef1",
                lineHeight: 1.1,
              }}
            >
              {stat.value}
            </span>
            {stat.trend && (
              <span
                className="sb-data"
                style={{
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  color:
                    stat.trend.direction === "up"
                      ? "#f4b964"
                      : stat.trend.direction === "down"
                        ? "#e85454"
                        : "#6d8d9f",
                }}
              >
                {stat.trend.direction === "up" && (
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                    <polygon points="5,1 9,7 1,7" />
                  </svg>
                )}
                {stat.trend.direction === "down" && (
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                    <polygon points="1,3 9,3 5,9" />
                  </svg>
                )}
                {stat.trend.direction === "up" ? "+" : stat.trend.direction === "down" ? "-" : ""}
                {stat.trend.value}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Hide scrollbar via style tag */}
      <style>{`
        .lg\\:hidden > div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
