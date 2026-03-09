"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, CartesianGrid, BarChart, Bar } from "recharts"
import { SquareDot, InvertBar } from "../chart-primitives"

interface MobileAreaChartProps {
  data: any[]
  series: { key: string; label: string; color: string }[]
  xAxisKey?: string
  config: ChartConfig
}

/**
 * Compact area chart for mobile.
 * - 180px height (vs 300px desktop)
 * - No Y-axis (saves ~50px horizontal space)
 * - Compact legend below
 */
export function MobileAreaChart({
  data,
  series,
  xAxisKey = "day",
  config,
}: MobileAreaChartProps) {
  return (
    <div className="lg:hidden">
      <div
        style={{
          background: "#0e2838",
          border: "1px solid rgba(244, 185, 100, 0.12)",
          padding: "12px 8px 8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
        }}
      >
        <ChartContainer config={config} className="w-full" style={{ height: 180 }}>
          <AreaChart data={data} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`sb-mob-fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255, 0.04)" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: "#6d8d9f", fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            {/* No YAxis on mobile — saves ~50px */}
            <ChartTooltip content={<ChartTooltipContent />} />
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#sb-mob-fill-${s.key})`}
                dot={<SquareDot size={4} />}
                activeDot={<SquareDot size={8} />}
              />
            ))}
          </AreaChart>
        </ChartContainer>

        {/* Compact legend */}
        <div style={{ display: "flex", gap: 12, paddingLeft: 4, paddingTop: 8 }}>
          {series.map((s) => (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, backgroundColor: s.color, display: "inline-block" }} />
              <span style={{ fontSize: 10, color: "#6d8d9f", fontFamily: "'General Sans', sans-serif" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface MobileBarChartProps {
  data: any[]
  dataKey: string
  nameKey?: string
  colors?: string[]
  config: ChartConfig
}

const DEFAULT_COLORS = ["#f4b964", "#64dcf4", "#e8956a", "#a4f464", "#f4d494"]

/**
 * Compact bar chart for mobile.
 * - 180px height (vs 300px desktop)
 * - No Y-axis
 * - Maintains the InvertBar hover pattern
 */
export function MobileBarChart({
  data,
  dataKey,
  nameKey = "type",
  colors = DEFAULT_COLORS,
  config,
}: MobileBarChartProps) {
  return (
    <div className="lg:hidden">
      <div
        style={{
          background: "#0e2838",
          border: "1px solid rgba(244, 185, 100, 0.12)",
          padding: "12px 8px 8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
        }}
      >
        <ChartContainer config={config} className="w-full" style={{ height: 180 }}>
          <BarChart data={data} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255, 0.04)" vertical={false} />
            <XAxis
              dataKey={nameKey}
              tick={{ fill: "#6d8d9f", fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Bar
              dataKey={dataKey}
              fill="#f4b964"
              radius={0}
              shape={(props: any) => {
                const color = colors[props.index % colors.length]
                return <InvertBar {...props} fill={color} isHovered={false} />
              }}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
