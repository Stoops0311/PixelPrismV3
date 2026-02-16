"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { SquareDot } from "./chart-primitives"

interface AreaSeries {
  key: string
  label: string
  color: string
}

function DS2AreaChart({
  data,
  series,
  xAxisKey = "day",
  height = 300,
  config,
}: {
  data: any[]
  series: AreaSeries[]
  xAxisKey?: string
  height?: number
  config: ChartConfig
}) {
  return (
    <div className="space-y-4">
      <div
        className="border border-[rgba(244,185,100,0.12)] bg-[#0e2838] p-5"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)" }}
      >
        <ChartContainer config={config} className="w-full" style={{ height }}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`sb-fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255, 0.04)" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: "#6d8d9f", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6d8d9f", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2.5}
                fill={`url(#sb-fill-${s.key})`}
                dot={<SquareDot />}
                activeDot={<SquareDot size={10} />}
              />
            ))}
          </AreaChart>
        </ChartContainer>
        <div className="flex gap-6 mt-4 pl-4">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className="inline-block"
                style={{ width: 6, height: 6, backgroundColor: s.color }}
              />
              <span className="sb-caption" style={{ color: "#6d8d9f" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { DS2AreaChart }
export type { AreaSeries }
