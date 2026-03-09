"use client"


interface PostChip {
  platform: "IG" | "FB" | "LI" | "PI"
  time: string
}

interface DayColumn {
  day: string
  date: number
  today?: boolean
  posts: PostChip[]
}

const PLATFORM_COLORS: Record<string, string> = {
  IG: "#e8956a", // coral
  FB: "#64dcf4", // cyan
  LI: "#f4b964", // gold
  PI: "#a4f464", // lime
}

const columns: DayColumn[] = [
  {
    day: "MON",
    date: 10,
    posts: [{ platform: "IG", time: "9:00 AM" }],
  },
  {
    day: "TUE",
    date: 11,
    posts: [
      { platform: "IG", time: "11:00 AM" },
      { platform: "LI", time: "2:00 PM" },
    ],
  },
  {
    day: "WED",
    date: 12,
    today: true,
    posts: [
      { platform: "FB", time: "10:00 AM" },
      { platform: "IG", time: "7:00 PM" },
    ],
  },
  {
    day: "THU",
    date: 13,
    posts: [{ platform: "LI", time: "3:00 PM" }],
  },
  {
    day: "FRI",
    date: 14,
    posts: [
      { platform: "IG", time: "9:00 AM" },
      { platform: "FB", time: "12:00 PM" },
      { platform: "PI", time: "5:00 PM" },
    ],
  },
  {
    day: "SAT",
    date: 15,
    posts: [],
  },
  {
    day: "SUN",
    date: 16,
    posts: [{ platform: "IG", time: "11:00 AM" }],
  },
]

export function MockCalendar() {
  return (
    <div
      aria-hidden="true"
      className="mock-panel mock-calendar"
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
          padding: "10px 14px",
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
          Content Schedule
        </div>
        <div
          style={{
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            color: "#6d8d9f",
          }}
        >
          Mar 10 – 16, 2026
        </div>
      </div>

      {/* ── Calendar Grid ────────────────────────────────────────── */}
      <div
        className="mock-calendar__grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {columns.map((col, colIdx) => (
          <div
            key={col.day}
            className="mock-calendar__col"
            style={{
              display: "flex",
              flexDirection: "column",
              borderRight:
                colIdx < columns.length - 1
                  ? "1px solid rgba(244,185,100,0.06)"
                  : "none",
              background: col.today
                ? "rgba(244,185,100,0.03)"
                : "transparent",
            }}
          >
            {/* Day header */}
            <div
              style={{
                padding: "8px 6px 6px",
                borderTop: col.today
                  ? "2px solid #f4b964"
                  : "2px solid transparent",
                borderBottom: "1px solid rgba(244,185,100,0.06)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: col.today ? "#f4b964" : "#6d8d9f",
                  lineHeight: 1,
                  marginBottom: 3,
                }}
              >
                {col.day}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: col.today ? "#f4b964" : "#eaeef1",
                  lineHeight: 1,
                }}
              >
                {col.date}
              </div>
            </div>

            {/* Posts */}
            <div
              style={{
                flex: 1,
                padding: "6px 4px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                overflow: "hidden",
              }}
            >
              {col.posts.map((post, postIdx) => {
                const color = PLATFORM_COLORS[post.platform]
                return (
                  <div
                    key={postIdx}
                    className="mock-calendar__chip"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      padding: "3px 5px 3px 6px",
                      background: "rgba(244,185,100,0.03)",
                      borderLeft: `2px solid ${color}`,
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 8,
                        fontFamily: "'Neue Montreal', sans-serif",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color,
                        textTransform: "uppercase",
                        lineHeight: 1,
                      }}
                    >
                      {post.platform}
                    </span>
                    <span
                      style={{
                        fontSize: 8,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 400,
                        color: "#6d8d9f",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.time}
                    </span>
                  </div>
                )
              })}

              {/* Empty day filler */}
              {col.posts.length === 0 && (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 1,
                      background: "rgba(244,185,100,0.08)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer bar ───────────────────────────────────────────── */}
      <div
        style={{
          padding: "7px 14px",
          borderTop: "1px solid rgba(244,185,100,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#0b2230",
        }}
      >
        {[
          { label: "8 scheduled", color: "#f4b964" },
          { label: "2 drafts", color: "#6d8d9f" },
        ].map((item) => (
          <span
            key={item.label}
            style={{
              fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              color: item.color,
              letterSpacing: "0.02em",
            }}
          >
            {item.label}
          </span>
        ))}
        <div style={{ flex: 1 }} />
        <span
          style={{
            fontSize: 9,
            fontFamily: "'General Sans', sans-serif",
            color: "#6d8d9f",
          }}
        >
          Next: Today 7:00 PM
        </span>
      </div>
    </div>
  )
}
