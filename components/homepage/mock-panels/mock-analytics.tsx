"use client"


interface StatCard {
  label: string
  value: string
  delta: string
  deltaColor: string
}

const stats: StatCard[] = [
  {
    label: "Engagement Rate",
    value: "4.7%",
    delta: "↑ 0.8% this week",
    deltaColor: "#a4f464",
  },
  {
    label: "Total Reach",
    value: "12.3K",
    delta: "↑ 22% this month",
    deltaColor: "#a4f464",
  },
  {
    label: "Posts Published",
    value: "24",
    delta: "Last 30 days",
    deltaColor: "#6d8d9f",
  },
]

const X_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function MockAnalytics() {
  const W = 600
  const H = 170
  const PAD_L = 8
  const PAD_R = 8
  const PAD_T = 12
  const PAD_B = 24

  const chartW = W - PAD_L - PAD_R
  const chartH = H - PAD_T - PAD_B

  // Gold engagement line — dips mid-week, peaks weekend
  const goldPath =
    `M ${PAD_L},${PAD_T + chartH * 0.72}` +
    ` C ${PAD_L + chartW * 0.13},${PAD_T + chartH * 0.55}` +
    ` ${PAD_L + chartW * 0.20},${PAD_T + chartH * 0.35}` +
    ` ${PAD_L + chartW * 0.30},${PAD_T + chartH * 0.20}` +
    ` C ${PAD_L + chartW * 0.40},${PAD_T + chartH * 0.06}` +
    ` ${PAD_L + chartW * 0.50},${PAD_T + chartH * 0.38}` +
    ` ${PAD_L + chartW * 0.60},${PAD_T + chartH * 0.25}` +
    ` C ${PAD_L + chartW * 0.70},${PAD_T + chartH * 0.12}` +
    ` ${PAD_L + chartW * 0.80},${PAD_T + chartH * 0.08}` +
    ` ${PAD_L + chartW},${PAD_T + chartH * 0.04}`

  const goldArea =
    goldPath +
    ` L ${PAD_L + chartW},${PAD_T + chartH}` +
    ` L ${PAD_L},${PAD_T + chartH} Z`

  // Cyan reach line — lower amplitude, smoother
  const cyanPath =
    `M ${PAD_L},${PAD_T + chartH * 0.85}` +
    ` C ${PAD_L + chartW * 0.13},${PAD_T + chartH * 0.78}` +
    ` ${PAD_L + chartW * 0.20},${PAD_T + chartH * 0.68}` +
    ` ${PAD_L + chartW * 0.30},${PAD_T + chartH * 0.60}` +
    ` C ${PAD_L + chartW * 0.40},${PAD_T + chartH * 0.52}` +
    ` ${PAD_L + chartW * 0.50},${PAD_T + chartH * 0.64}` +
    ` ${PAD_L + chartW * 0.60},${PAD_T + chartH * 0.55}` +
    ` C ${PAD_L + chartW * 0.70},${PAD_T + chartH * 0.46}` +
    ` ${PAD_L + chartW * 0.80},${PAD_T + chartH * 0.38}` +
    ` ${PAD_L + chartW},${PAD_T + chartH * 0.28}`

  // Square data point dots along gold line (approximate positions)
  const goldDots: [number, number][] = [
    [PAD_L,                       PAD_T + chartH * 0.72],
    [PAD_L + chartW * (1 / 6),   PAD_T + chartH * 0.22],
    [PAD_L + chartW * (2 / 6),   PAD_T + chartH * 0.08],
    [PAD_L + chartW * (3 / 6),   PAD_T + chartH * 0.30],
    [PAD_L + chartW * (4 / 6),   PAD_T + chartH * 0.14],
    [PAD_L + chartW * (5 / 6),   PAD_T + chartH * 0.06],
    [PAD_L + chartW,              PAD_T + chartH * 0.04],
  ]

  return (
    <div
      aria-hidden="true"
      className="mock-panel mock-analytics"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: 340,
        background: "#0e2838",
        padding: 14,
        gap: 14,
      }}
    >
      {/* ── Header label ─────────────────────────────────────────── */}
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
        Analytics Overview
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────── */}
      <div
        className="mock-analytics__stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="mock-stat-card">
            <div
              style={{
                fontSize: 8,
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "#6d8d9f",
                lineHeight: 1.3,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 22,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: "#f4b964",
                letterSpacing: "0.02em",
                lineHeight: 1.1,
                marginTop: 2,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 9,
                fontFamily: "'General Sans', sans-serif",
                color: stat.deltaColor,
                marginTop: 2,
              }}
            >
              {stat.delta}
            </div>
          </div>
        ))}
      </div>

      {/* ── Area Chart ───────────────────────────────────────────── */}
      <div
        className="mock-analytics__chart"
        style={{
          flex: 1,
          background: "#071a26",
          border: "1px solid rgba(244,185,100,0.08)",
          display: "flex",
          flexDirection: "column",
          padding: "10px 8px 4px",
          gap: 6,
          overflow: "hidden",
        }}
      >
        {/* Legend */}
        <div style={{ display: "flex", gap: 12, paddingLeft: 4 }}>
          {[
            { label: "Engagement", color: "#f4b964" },
            { label: "Reach",      color: "#64dcf4" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 8,
                fontFamily: "'General Sans', sans-serif",
                color: "#6d8d9f",
              }}
            >
              <span style={{ color: item.color, fontSize: 10, lineHeight: 1 }}>●</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* SVG chart */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ width: "100%", flex: 1, display: "block" }}
        >
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4b964" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f4b964" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Background grid lines */}
          {[0.25, 0.5, 0.75].map((frac) => (
            <line
              key={frac}
              x1={PAD_L}
              y1={PAD_T + chartH * frac}
              x2={PAD_L + chartW}
              y2={PAD_T + chartH * frac}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}

          {/* X axis baseline */}
          <line
            x1={PAD_L}
            y1={PAD_T + chartH}
            x2={PAD_L + chartW}
            y2={PAD_T + chartH}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />

          {/* Gold area fill */}
          <path d={goldArea} fill="url(#goldGrad)" />

          {/* Cyan line */}
          <path
            d={cyanPath}
            fill="none"
            stroke="#64dcf4"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          {/* Gold engagement line */}
          <path
            d={goldPath}
            fill="none"
            stroke="#f4b964"
            strokeWidth="2"
          />

          {/* Square dots on gold line */}
          {goldDots.map(([x, y], i) => (
            <rect
              key={i}
              x={x - 2}
              y={y - 2}
              width="4"
              height="4"
              fill="#f4b964"
            />
          ))}

          {/* X axis labels */}
          {X_LABELS.map((label, i) => {
            const x = PAD_L + (chartW / 6) * i
            return (
              <text
                key={label}
                x={x}
                y={H - 4}
                fontSize="8"
                fill="#6d8d9f"
                fontFamily="'General Sans', sans-serif"
                textAnchor="middle"
              >
                {label}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
