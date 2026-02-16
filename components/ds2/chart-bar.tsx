"use client"

import { useState } from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { InvertBar } from "./chart-primitives"

const DEFAULT_COLORS = ["#f4b964", "#64dcf4", "#e8956a", "#a4f464", "#f4d494"]

function DS2BarChart({
  data,
  dataKey,
  nameKey = "type",
  colors = DEFAULT_COLORS,
  height = 300,
  config,
}: {
  data: any[]
  dataKey: string
  nameKey?: string
  colors?: string[]
  height?: number
  config: ChartConfig
}) {
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)

  return (
    <div
      className="border border-[rgba(244,185,100,0.12)] bg-[#0e2838] p-5"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)" }}
    >
      <ChartContainer config={config} className="w-full" style={{ height }}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          onMouseMove={(state: any) => {
            if (state && state.activeTooltipIndex !== undefined) {
              setHoveredBarIndex(state.activeTooltipIndex)
            }
          }}
          onMouseLeave={() => setHoveredBarIndex(null)}
        >
          <CartesianGrid
            strokeDasharray="0"
            stroke="rgba(255,255,255, 0.04)"
            vertical={false}
          />
          <XAxis
            dataKey={nameKey}
            tick={{
              fill: "#6d8d9f",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fill: "#6d8d9f",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
            }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <Bar
            dataKey={dataKey}
            fill="#f4b964"
            radius={0}
            shape={(props: any) => {
              const color = colors[props.index % colors.length]
              return (
                <InvertBar
                  {...props}
                  fill={color}
                  isHovered={props.index === hoveredBarIndex}
                />
              )
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export { DS2BarChart }
