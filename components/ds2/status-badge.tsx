import * as React from "react"

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  live: { bg: "rgba(244,185,100,0.12)", text: "#f4b964", border: "rgba(244,185,100,0.20)" },
  scheduled: { bg: "rgba(232,149,106,0.12)", text: "#e8956a", border: "rgba(232,149,106,0.20)" },
  draft: { bg: "rgba(109,141,159,0.12)", text: "#6d8d9f", border: "rgba(109,141,159,0.20)" },
  failed: { bg: "rgba(232,84,84,0.12)", text: "#e85454", border: "rgba(232,84,84,0.20)" },
  trending: { bg: "rgba(244,185,100,0.15)", text: "#f4b964", border: "rgba(244,185,100,0.20)" },
  new: { bg: "rgba(232,149,106,0.15)", text: "#e8956a", border: "rgba(232,149,106,0.20)" },
  pro: { bg: "rgba(100,220,244,0.12)", text: "#64dcf4", border: "rgba(100,220,244,0.20)" },
  paid: { bg: "rgba(100,200,130,0.12)", text: "#64c882", border: "rgba(100,200,130,0.20)" },
  pending: { bg: "rgba(232,149,106,0.12)", text: "#e8956a", border: "rgba(232,149,106,0.20)" },
}

function StatusBadge({
  status,
  children,
}: {
  status: string
  children?: React.ReactNode
}) {
  const key = status.toLowerCase()
  const colors = STATUS_COLORS[key]
  if (!colors) return null

  const displayText = children ?? status

  return (
    <span
      className="sb-badge inline-flex items-center gap-1.5"
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        padding: "4px 12px",
        fontFamily: "'Neue Montreal', sans-serif",
        fontWeight: 500,
        fontSize: "11px",
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
      }}
    >
      {key === "live" && (
        <span
          className="sb-pulse-dot"
          style={{
            width: 6,
            height: 6,
            background: colors.text,
            display: "inline-block",
          }}
        />
      )}
      {displayText}
    </span>
  )
}

export { StatusBadge, STATUS_COLORS }
