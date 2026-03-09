"use client"

import React from "react"

interface MobileCardField {
  label: string
  value: React.ReactNode
  isData?: boolean
  accent?: boolean
}

interface MobileDataCard {
  /** Primary label / title for the card */
  title: React.ReactNode
  /** Optional subtitle or secondary text */
  subtitle?: React.ReactNode
  /** Key-value fields rendered in a compact grid */
  fields: MobileCardField[]
  /** Optional left accent color (defaults to gold) */
  accentColor?: string
  /** Optional click handler */
  onClick?: () => void
}

/**
 * Mobile card list that replaces DS2DataTable on narrow viewports.
 * Each table row becomes a compact stacked card with labeled fields.
 */
export function MobileDataCards({ cards }: { cards: MobileDataCard[] }) {
  if (cards.length === 0) return null

  return (
    <div className="lg:hidden" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {cards.map((card, i) => (
        <div
          key={i}
          onClick={card.onClick}
          role={card.onClick ? "button" : undefined}
          tabIndex={card.onClick ? 0 : undefined}
          style={{
            background: "#0e2838",
            border: "1px solid rgba(244, 185, 100, 0.12)",
            borderLeft: `3px solid ${card.accentColor || "rgba(244, 185, 100, 0.3)"}`,
            padding: "12px 14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
            cursor: card.onClick ? "pointer" : undefined,
            transition: "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 200ms ease",
          }}
          onMouseEnter={(e) => {
            if (card.onClick) {
              e.currentTarget.style.transform = "translateY(-1px)"
              e.currentTarget.style.borderLeftColor = card.accentColor || "#f4b964"
            }
          }}
          onMouseLeave={(e) => {
            if (card.onClick) {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.borderLeftColor = card.accentColor || "rgba(244, 185, 100, 0.3)"
            }
          }}
        >
          {/* Title row */}
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#eaeef1",
                lineHeight: 1.3,
                fontFamily: "'General Sans', sans-serif",
              }}
            >
              {card.title}
            </div>
            {card.subtitle && (
              <div
                style={{
                  fontSize: 12,
                  color: "#6d8d9f",
                  marginTop: 2,
                  fontFamily: "'General Sans', sans-serif",
                }}
              >
                {card.subtitle}
              </div>
            )}
          </div>

          {/* Fields grid — 2 columns for compact display */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px 12px",
            }}
          >
            {card.fields.map((field, fi) => (
              <div key={fi}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#6d8d9f",
                    fontFamily: "'Neue Montreal', sans-serif",
                  }}
                >
                  {field.label}
                </span>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: field.isData ? 700 : 500,
                    color: field.accent ? "#f4b964" : "#d4dce2",
                    fontFamily: field.isData ? "'JetBrains Mono', monospace" : "'General Sans', sans-serif",
                    marginTop: 1,
                  }}
                >
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
