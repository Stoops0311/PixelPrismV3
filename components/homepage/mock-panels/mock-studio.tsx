"use client"


const styleChips = [
  { label: "Product Shot", active: true },
  { label: "Lifestyle",    active: false },
  { label: "Flat Lay",     active: false },
]

const aspectChips = [
  { label: "1:1",  active: true },
  { label: "9:16", active: false },
  { label: "16:9", active: false },
  { label: "3:4",  active: false },
]

const thumbs: {
  gradient: string
  badge?: { label: string; color: string; bg: string; dot?: boolean }
}[] = [
  {
    gradient: "linear-gradient(135deg, #2a4a3a 0%, #3a6a2a 100%)",
    badge: { label: "READY", color: "#071a26", bg: "#a4f464" },
  },
  {
    gradient: "linear-gradient(135deg, #3a2a1a 0%, #5a3a1a 100%)",
    badge: { label: "READY", color: "#071a26", bg: "#a4f464" },
  },
  {
    gradient: "linear-gradient(135deg, #1a3a5a 0%, #2a5a3a 100%)",
    badge: { label: "GENERATING", color: "#071a26", bg: "#f4b964", dot: true },
  },
  {
    gradient: "linear-gradient(135deg, #4a2a1a 0%, #3a1a0a 100%)",
  },
]

export function MockStudio() {
  return (
    <div
      aria-hidden="true"
      className="mock-panel"
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        minHeight: 340,
      }}
    >
      {/* ── Left Panel: Generation Form ──────────────────────────── */}
      <div
        className="mock-studio__panel-left"
        style={{
          width: 230,
          flexShrink: 0,
          borderRight: "1px solid rgba(244,185,100,0.08)",
          padding: "14px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "#0e2838",
        }}
      >
        {/* Label */}
        <div
          style={{
            fontSize: 9,
            fontFamily: "'Neue Montreal', sans-serif",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#f4b964",
          }}
        >
          AI Studio
        </div>

        {/* Prompt textarea */}
        <div
          style={{
            background: "#071a26",
            border: "1px solid rgba(244,185,100,0.14)",
            padding: "8px 10px",
            minHeight: 64,
            fontSize: 10,
            fontFamily: "'General Sans', sans-serif",
            color: "#6d8d9f",
            lineHeight: 1.55,
          }}
        >
          A warm flat-lay of Ethiopian cold brew on rustic wood with morning light...
        </div>

        {/* Style chips */}
        <div>
          <div
            style={{
              fontSize: 9,
              fontFamily: "'Neue Montreal', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#6d8d9f",
              marginBottom: 6,
            }}
          >
            Style
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {styleChips.map((chip) => (
              <div
                key={chip.label}
                style={{
                  padding: "3px 8px",
                  fontSize: 9,
                  fontFamily: "'General Sans', sans-serif",
                  fontWeight: chip.active ? 600 : 400,
                  background: chip.active ? "#f4b964" : "rgba(244,185,100,0.06)",
                  color: chip.active ? "#071a26" : "#6d8d9f",
                  border: chip.active
                    ? "1px solid #f4b964"
                    : "1px solid rgba(244,185,100,0.12)",
                  cursor: "default",
                  userSelect: "none",
                }}
              >
                {chip.label}
              </div>
            ))}
          </div>
        </div>

        {/* Aspect ratio chips */}
        <div>
          <div
            style={{
              fontSize: 9,
              fontFamily: "'Neue Montreal', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#6d8d9f",
              marginBottom: 6,
            }}
          >
            Aspect Ratio
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {aspectChips.map((chip) => (
              <div
                key={chip.label}
                style={{
                  padding: "3px 7px",
                  fontSize: 9,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  background: chip.active ? "rgba(244,185,100,0.15)" : "rgba(244,185,100,0.04)",
                  color: chip.active ? "#f4b964" : "#6d8d9f",
                  border: chip.active
                    ? "1px solid rgba(244,185,100,0.45)"
                    : "1px solid rgba(244,185,100,0.08)",
                  cursor: "default",
                  userSelect: "none",
                }}
              >
                {chip.label}
              </div>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Credit cost */}
        <div
          style={{
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            color: "#6d8d9f",
            letterSpacing: "0.02em",
          }}
        >
          Cost: 1 credit
        </div>

        {/* Generate button */}
        <div
          style={{
            background: "#f4b964",
            color: "#071a26",
            padding: "8px 12px",
            fontSize: 10,
            fontFamily: "'Neue Montreal', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textAlign: "center",
            cursor: "default",
            userSelect: "none",
            boxShadow: "0 2px 8px rgba(244,185,100,0.20)",
          }}
        >
          Generate Images
        </div>
      </div>

      {/* ── Right Panel: Gallery ──────────────────────────────────── */}
      <div
        className="mock-studio__panel-right"
        style={{
          flex: 1,
          padding: "14px",
          background: "#071a26",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflow: "hidden",
        }}
      >
        {/* Gallery label row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: 9,
              fontFamily: "'Neue Montreal', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#6d8d9f",
            }}
          >
            Results
          </div>
          <div
            style={{
              fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace",
              color: "#6d8d9f",
            }}
          >
            4 images
          </div>
        </div>

        {/* Gallery grid */}
        <div
          className="mock-studio__gallery"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            flex: 1,
          }}
        >
          {thumbs.map((thumb, i) => (
            <div
              key={i}
              className="mock-img-thumb"
              style={{
                background: thumb.gradient,
                aspectRatio: "1",
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                padding: "5px 6px",
              }}
            >
              {/* Aspect ratio label */}
              <span
                style={{
                  fontSize: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.02em",
                }}
              >
                1:1
              </span>

              {/* Status badge */}
              {thumb.badge && (
                <div
                  className="mock-badge"
                  style={{
                    background: thumb.badge.bg,
                    color: thumb.badge.color,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  {thumb.badge.dot && <span className="mock-generating-dot" />}
                  {thumb.badge.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
