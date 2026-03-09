"use client"


interface Brand {
  initials: string
  initialsColor: string
  name: string
  followers: string
  engagement: string
  active?: boolean
}

const brands: Brand[] = [
  {
    initials: "SC",
    initialsColor: "#f4b964",
    name: "Sunrise Coffee Co",
    followers: "5,247",
    engagement: "4.7%",
    active: true,
  },
  {
    initials: "CS",
    initialsColor: "#64dcf4",
    name: "Coastal Surf Shop",
    followers: "3,821",
    engagement: "3.2%",
  },
  {
    initials: "MY",
    initialsColor: "#e8956a",
    name: "Mountain Yoga Studio",
    followers: "8,456",
    engagement: "5.1%",
  },
]

export function MockBrandSwitcher() {
  return (
    <div
      aria-hidden="true"
      className="mock-panel mock-brand-switcher"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: 340,
        background: "#0e2838",
      }}
    >
      {/* ── Header ───────────────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(244,185,100,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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
          Brands
        </div>
        <div
          style={{
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            color: "#6d8d9f",
          }}
        >
          3 active
        </div>
      </div>

      {/* ── Brand List ───────────────────────────────────────────── */}
      <div
        className="mock-brand-list"
        style={{ flex: 1, overflow: "hidden" }}
      >
        {brands.map((brand, idx) => (
          <div
            key={brand.initials}
            className="mock-brand-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderLeft: brand.active
                ? "2px solid #f4b964"
                : "2px solid transparent",
              background: brand.active
                ? "rgba(244,185,100,0.04)"
                : "transparent",
              borderBottom:
                idx < brands.length - 1
                  ? "1px solid rgba(244,185,100,0.06)"
                  : "none",
              position: "relative",
            }}
          >
            {/* Active glow */}
            {brand.active && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at left center, rgba(244,185,100,0.06) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Initials square */}
            <div
              style={{
                width: 28,
                height: 28,
                background: brand.active
                  ? brand.initialsColor
                  : `${brand.initialsColor}22`,
                border: `1px solid ${brand.initialsColor}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 9,
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 700,
                color: brand.active ? "#071a26" : brand.initialsColor,
                letterSpacing: "0.04em",
                position: "relative",
                zIndex: 1,
              }}
            >
              {brand.initials}
            </div>

            {/* Brand info */}
            <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 500,
                  color: brand.active ? "#eaeef1" : "#d4dce2",
                  letterSpacing: "0.01em",
                  lineHeight: 1.2,
                  marginBottom: 3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {brand.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    color: "#6d8d9f",
                    letterSpacing: "0.02em",
                  }}
                >
                  {brand.followers}
                </span>
                <span
                  style={{
                    width: 2,
                    height: 2,
                    background: "rgba(244,185,100,0.22)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    color: brand.active ? "#f4b964" : "#6d8d9f",
                    letterSpacing: "0.02em",
                  }}
                >
                  {brand.engagement}
                </span>
                <span
                  style={{
                    fontSize: 8,
                    fontFamily: "'General Sans', sans-serif",
                    color: "#6d8d9f",
                  }}
                >
                  eng.
                </span>
              </div>
            </div>

            {/* Active indicator */}
            {brand.active && (
              <div
                style={{
                  width: 6,
                  height: 6,
                  background: "#f4b964",
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                }}
              />
            )}
          </div>
        ))}

        {/* Add Brand button */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid rgba(244,185,100,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "default",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "rgba(244,185,100,0.45)",
              lineHeight: 1,
            }}
          >
            +
          </span>
          <span
            style={{
              fontSize: 10,
              fontFamily: "'General Sans', sans-serif",
              color: "#6d8d9f",
              letterSpacing: "0.02em",
            }}
          >
            Add Brand
          </span>
        </div>
      </div>

      {/* ── Plan Usage ───────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(244,185,100,0.08)",
          padding: "12px 16px",
          background: "#0b2230",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontFamily: "'Neue Montreal', sans-serif",
            fontWeight: 500,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "#6d8d9f",
            marginBottom: 2,
          }}
        >
          Plan Usage
        </div>

        {/* Brands usage */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontFamily: "'General Sans', sans-serif",
                color: "#6d8d9f",
              }}
            >
              Brands
            </span>
            <span
              style={{
                fontSize: 9,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: "#f4b964",
              }}
            >
              2 of 4
            </span>
          </div>
          <div className="mock-progress-bar">
            <div className="mock-progress-fill" style={{ width: "50%" }} />
          </div>
        </div>

        {/* Social accounts usage */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontFamily: "'General Sans', sans-serif",
                color: "#6d8d9f",
              }}
            >
              Social Accounts
            </span>
            <span
              style={{
                fontSize: 9,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: "#f4b964",
              }}
            >
              5 of 10
            </span>
          </div>
          <div className="mock-progress-bar">
            <div className="mock-progress-fill" style={{ width: "50%" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
