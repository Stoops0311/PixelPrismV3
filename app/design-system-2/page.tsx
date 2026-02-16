"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts"

// ─── Mock Data ───────────────────────────────────────────────────────────────

const tableData = [
  { post: "Summer Collection Launch", platform: "Instagram", status: "Live", reach: "12,450", engagement: "8.2%", date: "Feb 12, 2026" },
  { post: "Behind the Scenes", platform: "TikTok", status: "Scheduled", reach: "--", engagement: "--", date: "Feb 16, 2026" },
  { post: "Customer Spotlight: Maria", platform: "Facebook", status: "Live", reach: "3,820", engagement: "5.1%", date: "Feb 10, 2026" },
  { post: "Product Tutorial #4", platform: "Instagram", status: "Draft", reach: "--", engagement: "--", date: "--" },
  { post: "Weekend Flash Sale", platform: "Instagram", status: "Failed", reach: "0", engagement: "0%", date: "Feb 14, 2026" },
]

const followersData = [
  { day: "Mon", instagram: 10200, tiktok: 5400, facebook: 8100 },
  { day: "Tue", instagram: 10350, tiktok: 5520, facebook: 8090 },
  { day: "Wed", instagram: 10500, tiktok: 5800, facebook: 8150 },
  { day: "Thu", instagram: 10450, tiktok: 6100, facebook: 8200 },
  { day: "Fri", instagram: 10800, tiktok: 6400, facebook: 8180 },
  { day: "Sat", instagram: 11200, tiktok: 6900, facebook: 8250 },
  { day: "Sun", instagram: 11500, tiktok: 7200, facebook: 8300 },
]

const engagementData = [
  { type: "Likes", count: 4520 },
  { type: "Comments", count: 890 },
  { type: "Shares", count: 340 },
  { type: "Saves", count: 1200 },
  { type: "Clicks", count: 2100 },
]

// ─── Chart Configs ───────────────────────────────────────────────────────────

const followersConfig: ChartConfig = {
  instagram: { label: "Instagram", color: "#f4b964" },
  tiktok: { label: "TikTok", color: "#64dcf4" },
  facebook: { label: "Facebook", color: "#e8956a" },
}

const engagementConfig: ChartConfig = {
  count: { label: "Count", color: "#f4b964" },
}

// ─── Square Dot for Charts (DS-3 DNA in smooth curves) ──────────────────────

function SquareDot(props: any) {
  const { cx, cy, stroke } = props
  if (!cx || !cy) return null
  return (
    <rect
      x={cx - 3}
      y={cy - 3}
      width={6}
      height={6}
      fill={stroke}
      stroke={stroke}
      strokeWidth={1}
    />
  )
}

// ─── Custom Bar with Hover Inversion (DS-3 DNA) ─────────────────────────────

function InvertBar(props: any) {
  const { x, y, width, height, fill, isHovered } = props
  if (isHovered) {
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill="transparent" stroke={fill} strokeWidth={2} />
        <rect x={x} y={y} width={width} height={height} fill="transparent" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }} />
      </g>
    )
  }
  return (
    <rect x={x} y={y} width={width} height={height} fill={fill} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }} />
  )
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; border: string; dot?: string }> = {
    Live: { bg: "rgba(244,185,100,0.12)", text: "#f4b964", border: "rgba(244,185,100,0.20)", dot: "#f4b964" },
    Scheduled: { bg: "rgba(232,149,106,0.12)", text: "#e8956a", border: "rgba(232,149,106,0.20)" },
    Draft: { bg: "rgba(109,141,159,0.12)", text: "#6d8d9f", border: "rgba(109,141,159,0.20)" },
    Failed: { bg: "rgba(232,84,84,0.12)", text: "#e85454", border: "rgba(232,84,84,0.20)" },
  }
  const s = styles[status]
  if (!s) return null
  return (
    <span
      className="sb-badge inline-flex items-center gap-1.5"
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        padding: "4px 12px",
        fontFamily: "'Neue Montreal', sans-serif",
        fontWeight: 500,
        fontSize: "11px",
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
      }}
    >
      {status === "Live" && (
        <span
          className="sb-pulse-dot"
          style={{
            width: 6,
            height: 6,
            background: s.dot,
            display: "inline-block",
          }}
        />
      )}
      {status}
    </span>
  )
}

// ─── Section Wrapper ─────────────────────────────────────────────────────────

function Section({ id, label, title, subtitle, children }: { id: string; label: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-8">
      <div>
        <p className="sb-label" style={{ color: "#e8956a", marginBottom: 8 }}>{label}</p>
        <h2 className="sb-h2" style={{ color: "#eaeef1" }}>{title}</h2>
        {subtitle && <p className="sb-body" style={{ color: "#6d8d9f", marginTop: 8 }}>{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

// ─── Color Swatch ────────────────────────────────────────────────────────────

function Swatch({ name, hex, color }: { name: string; hex: string; color: string }) {
  return (
    <div className="space-y-2">
      <div
        style={{
          width: "100%",
          aspectRatio: "1",
          backgroundColor: color,
          border: "1px solid rgba(244,185,100, 0.12)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
        }}
      />
      <p className="sb-label" style={{ color: "#eaeef1" }}>{name}</p>
      <p className="sb-data" style={{ color: "#6d8d9f", fontSize: 11 }}>{hex}</p>
    </div>
  )
}

// ─── Square Bouncing Dots Spinner ────────────────────────────────────────────

function SquareDotsSpinner() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="sb-dot" />
      <span className="sb-dot" style={{ animationDelay: "-0.16s" }} />
      <span className="sb-dot" style={{ animationDelay: "0s" }} />
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DesignSystem2Page() {
  const [progressValue, setProgressValue] = useState(0)
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgressValue((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 60)
    return () => clearInterval(timer)
  }, [])

  const navItems = ["Overview", "Typography", "Colors", "Components", "Data", "Feedback"]
  const engagementColors = ["#f4b964", "#64dcf4", "#e8956a", "#a4f464", "#f4d494"]

  return (
    <>
      <style>{`
        /* ── Font Faces ─────────────────────────────────── */
        @font-face {
          font-family: 'Neue Montreal';
          src: url('/fonts/NeueMontreal-Light.otf') format('opentype');
          font-weight: 300; font-style: normal; font-display: swap;
        }
        @font-face {
          font-family: 'Neue Montreal';
          src: url('/fonts/NeueMontreal-Regular.otf') format('opentype');
          font-weight: 400; font-style: normal; font-display: swap;
        }
        @font-face {
          font-family: 'Neue Montreal';
          src: url('/fonts/NeueMontreal-Medium.otf') format('opentype');
          font-weight: 500; font-style: normal; font-display: swap;
        }
        @font-face {
          font-family: 'Neue Montreal';
          src: url('/fonts/NeueMontreal-Bold.otf') format('opentype');
          font-weight: 700; font-style: normal; font-display: swap;
        }
        @font-face {
          font-family: 'General Sans';
          src: url('/fonts/GeneralSans_Complete/Fonts/WEB/fonts/GeneralSans-Variable.woff2') format('woff2');
          font-weight: 200 700; font-style: normal; font-display: swap;
        }
        @font-face {
          font-family: 'JetBrains Mono';
          src: url('/fonts/JetBrainsMono_Complete/Fonts/WEB/fonts/JetBrainsMono-Variable.woff2') format('woff2');
          font-weight: 100 800; font-style: normal; font-display: swap;
        }

        /* ── CSS Variable Overrides ─────────────────────── */
        .sb-root {
          --background: #071a26;
          --card: #0e2838;
          --popover: #163344;
          --primary: #f4b964;
          --primary-foreground: #071a26;
          --secondary: #163344;
          --secondary-foreground: #d4dce2;
          --muted: #0b2230;
          --muted-foreground: #6d8d9f;
          --accent: #e8956a;
          --accent-foreground: #071a26;
          --foreground: #eaeef1;
          --border: rgba(244,185,100, 0.12);
          --input: rgba(244,185,100, 0.14);
          --ring: rgba(244,185,100, 0.45);
          --destructive: #e85454;
          --chart-1: #f4b964;
          --chart-2: #64dcf4;
          --chart-3: #e8956a;
          --chart-4: #a4f464;
          --chart-5: #f4d494;
          --radius: 0rem;

          background-color: #071a26;
          color: #eaeef1;
          font-family: 'General Sans', sans-serif;
          font-weight: 400;
          font-size: 15px;
          line-height: 1.65;
        }

        /* ── Noise Texture ──────────────────────────────── */
        .sb-root::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        /* ── Typography — Dual Font System ──────────────── */
        .sb-display {
          font-family: 'Neue Montreal', sans-serif;
          font-weight: 700; font-size: 80px;
          letter-spacing: -0.035em; line-height: 0.95;
        }
        @media (max-width: 768px) { .sb-display { font-size: 64px; } }
        .sb-h1 {
          font-family: 'Neue Montreal', sans-serif;
          font-weight: 700; font-size: 44px;
          letter-spacing: -0.025em; line-height: 1.05;
        }
        .sb-h2 {
          font-family: 'Neue Montreal', sans-serif;
          font-weight: 700; font-size: 32px;
          letter-spacing: -0.02em; line-height: 1.1;
        }
        .sb-h3 {
          font-family: 'Neue Montreal', sans-serif;
          font-weight: 500; font-size: 22px;
          letter-spacing: -0.01em; line-height: 1.2;
        }
        /* H4 switches to General Sans */
        .sb-h4 {
          font-family: 'General Sans', sans-serif;
          font-weight: 600; font-size: 17px;
          letter-spacing: -0.005em; line-height: 1.3;
        }
        .sb-body {
          font-family: 'General Sans', sans-serif;
          font-weight: 400; font-size: 15px;
          letter-spacing: 0.005em; line-height: 1.65;
        }
        .sb-body-sm {
          font-family: 'General Sans', sans-serif;
          font-weight: 400; font-size: 13px;
          letter-spacing: 0.005em; line-height: 1.55;
        }
        .sb-label {
          font-family: 'Neue Montreal', sans-serif;
          font-weight: 500; font-size: 11px;
          letter-spacing: 0.10em; line-height: 1.3;
          text-transform: uppercase;
        }
        .sb-data {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700; font-size: 14px;
          letter-spacing: 0.02em; line-height: 1.2;
        }
        .sb-caption {
          font-family: 'General Sans', sans-serif;
          font-weight: 400; font-size: 11px;
          letter-spacing: 0.01em; line-height: 1.4;
        }
        .sb-nav {
          font-family: 'Neue Montreal', sans-serif;
          font-weight: 500; font-size: 13px;
          letter-spacing: 0.06em; line-height: 1.0;
          text-transform: uppercase;
        }
        .sb-code {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 400; font-size: 13px;
          letter-spacing: 0em; line-height: 1.5;
        }

        /* ── Spring Easing ──────────────────────────────── */
        .sb-spring {
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* ── Primary Button — Hard Invert + Shadow Bloom ── */
        .sb-btn-primary {
          background-color: #f4b964 !important;
          color: #071a26 !important;
          border: 2px solid #f4b964 !important;
          border-radius: 0 !important;
          font-family: 'Neue Montreal', sans-serif !important;
          font-weight: 500 !important;
          font-size: 13px !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          padding: 12px 28px !important;
          min-height: 48px !important;
          height: auto !important;
          box-shadow: none !important;
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .sb-btn-primary:hover {
          background-color: transparent !important;
          color: #f4b964 !important;
          border-color: #f4b964 !important;
          box-shadow: 0 4px 12px rgba(244,185,100, 0.20) !important;
        }
        .sb-btn-primary:active {
          background-color: rgba(244,185,100, 0.12) !important;
          box-shadow: none !important;
          transform: translateY(1px);
        }

        /* ── Secondary Button (Glass) ───────────────────── */
        .sb-btn-secondary {
          background: rgba(255,255,255, 0.04) !important;
          backdrop-filter: blur(8px) !important;
          color: #d4dce2 !important;
          border: 1px solid rgba(244,185,100, 0.12) !important;
          border-radius: 0 !important;
          font-family: 'Neue Montreal', sans-serif !important;
          font-weight: 500 !important;
          font-size: 13px !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          padding: 12px 28px !important;
          min-height: 48px !important;
          height: auto !important;
          box-shadow: none !important;
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .sb-btn-secondary:hover {
          background: rgba(255,255,255, 0.08) !important;
          border-color: rgba(244,185,100, 0.22) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
        }
        .sb-btn-secondary:active {
          box-shadow: none !important;
          transform: translateY(1px);
        }

        /* ── Ghost Button — General Sans body font ──────── */
        .sb-btn-ghost {
          background: transparent !important;
          color: #6d8d9f !important;
          border: none !important;
          border-radius: 0 !important;
          font-family: 'General Sans', sans-serif !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          padding: 12px 28px !important;
          min-height: 48px !important;
          height: auto !important;
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .sb-btn-ghost:hover {
          color: #f4b964 !important;
          background: rgba(244,185,100, 0.04) !important;
        }
        .sb-btn-ghost .sb-arrow {
          transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
        }
        .sb-btn-ghost:hover .sb-arrow {
          transform: translateX(4px);
        }

        /* ── Destructive Button ─────────────────────────── */
        .sb-btn-destructive {
          background: rgba(232,84,84, 0.12) !important;
          color: #e85454 !important;
          border: 1px solid rgba(232,84,84, 0.20) !important;
          border-radius: 0 !important;
          font-family: 'Neue Montreal', sans-serif !important;
          font-weight: 500 !important;
          font-size: 13px !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          padding: 12px 28px !important;
          min-height: 48px !important;
          height: auto !important;
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .sb-btn-destructive:hover {
          background: #e85454 !important;
          color: #071a26 !important;
          box-shadow: 0 4px 12px rgba(232,84,84, 0.20) !important;
        }

        /* ── Card Overrides — Square + Layered Shadows ──── */
        .sb-root [data-slot="card"] {
          background-color: #0e2838 !important;
          border: 1px solid rgba(244,185,100, 0.12) !important;
          border-radius: 0 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10) !important;
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .sb-root [data-slot="card"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10) !important;
          border-color: rgba(244,185,100, 0.22) !important;
        }

        /* ── Input Overrides ────────────────────────────── */
        .sb-root [data-slot="input"],
        .sb-root [data-slot="textarea"] {
          background-color: rgba(255,255,255, 0.03) !important;
          border: 1px solid rgba(244,185,100, 0.14) !important;
          border-radius: 0 !important;
          color: #eaeef1 !important;
          font-family: 'General Sans', sans-serif !important;
          font-size: 14px !important;
          min-height: 48px !important;
          padding: 12px 16px !important;
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .sb-root [data-slot="input"]:focus,
        .sb-root [data-slot="textarea"]:focus {
          border-color: rgba(244,185,100, 0.45) !important;
          box-shadow: 0 0 0 3px rgba(244,185,100, 0.08) !important;
          outline: none !important;
        }
        .sb-root [data-slot="input"]::placeholder,
        .sb-root [data-slot="textarea"]::placeholder {
          color: #6d8d9f !important;
        }

        /* ── Select Overrides ───────────────────────────── */
        .sb-root [data-slot="select-trigger"] {
          background-color: rgba(255,255,255, 0.03) !important;
          border: 1px solid rgba(244,185,100, 0.14) !important;
          border-radius: 0 !important;
          font-family: 'General Sans', sans-serif !important;
          font-size: 14px !important;
          min-height: 48px !important;
          color: #eaeef1 !important;
        }
        .sb-root [data-slot="select-content"] {
          background: #163344 !important;
          border: 1px solid rgba(244,185,100, 0.12) !important;
          border-radius: 0 !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.20) !important;
        }
        .sb-root [data-slot="select-item"] {
          border-radius: 0 !important;
          font-family: 'General Sans', sans-serif !important;
        }

        /* ── Checkbox / Switch ──────────────────────────── */
        .sb-root [data-slot="checkbox"] {
          border-radius: 0 !important;
          border-color: rgba(244,185,100, 0.20) !important;
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .sb-root [data-slot="checkbox"][data-state="checked"] {
          background-color: #f4b964 !important;
          border-color: #f4b964 !important;
        }
        .sb-root [data-slot="switch"] {
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .sb-root [data-slot="switch"][data-state="checked"] {
          background-color: #f4b964 !important;
        }

        /* ── Label Override ─────────────────────────────── */
        .sb-root [data-slot="label"] {
          font-family: 'Neue Montreal', sans-serif !important;
          font-weight: 500 !important;
          font-size: 11px !important;
          letter-spacing: 0.10em !important;
          text-transform: uppercase !important;
          color: #eaeef1 !important;
        }

        /* ── Table Overrides ────────────────────────────── */
        .sb-root [data-slot="table-head"] {
          background-color: #0b2230;
          font-family: 'Neue Montreal', sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: #6d8d9f;
          height: 48px;
          border-bottom: 2px solid #f4b964;
        }
        .sb-root [data-slot="table-row"] {
          height: 52px;
          border-bottom: 1px solid rgba(244,185,100, 0.06);
          transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sb-root [data-slot="table-body"] [data-slot="table-row"]:hover {
          background-color: rgba(244,185,100, 0.04);
          box-shadow: inset 3px 0 0 #f4b964;
        }
        .sb-root [data-slot="table-cell"] {
          font-family: 'General Sans', sans-serif;
          font-size: 14px;
        }

        /* ── Row Dimming (non-hovered rows dim) ─────────── */
        .sb-table-dimming [data-slot="table-body"]:hover [data-slot="table-row"] {
          opacity: 0.85;
          transition: opacity 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sb-table-dimming [data-slot="table-body"]:hover [data-slot="table-row"]:hover {
          opacity: 1;
        }

        /* ── Dialog Overrides ───────────────────────────── */
        .sb-root [data-slot="dialog-overlay"] {
          background-color: rgba(7,26,38, 0.80) !important;
          backdrop-filter: blur(6px) !important;
          -webkit-backdrop-filter: blur(6px) !important;
        }
        .sb-root [data-slot="dialog-content"] {
          border-radius: 0 !important;
          border: 1px solid rgba(244,185,100, 0.12) !important;
          background-color: #0e2838 !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.12) !important;
          font-family: 'General Sans', sans-serif !important;
        }

        /* ── Dropdown Overrides ─────────────────────────── */
        .sb-root [data-slot="dropdown-menu-content"] {
          border-radius: 0 !important;
          border: 1px solid rgba(244,185,100, 0.12) !important;
          background: #163344 !important;
          font-family: 'General Sans', sans-serif !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10) !important;
        }
        .sb-root [data-slot="dropdown-menu-item"] {
          border-radius: 0 !important;
          font-size: 13px !important;
          transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .sb-root [data-slot="dropdown-menu-item"]:focus {
          background-color: rgba(244,185,100, 0.06) !important;
          color: #f4b964 !important;
          border-left: 3px solid #f4b964;
          padding-left: calc(0.5rem - 3px);
        }

        /* ── Tooltip Overrides ──────────────────────────── */
        .sb-root [data-slot="tooltip-content"] {
          border-radius: 0 !important;
          background-color: #163344 !important;
          color: #eaeef1 !important;
          border: 1px solid rgba(244,185,100, 0.12) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18) !important;
          font-family: 'General Sans', sans-serif !important;
          font-size: 13px !important;
          animation: sb-tooltip-in 250ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        @keyframes sb-tooltip-in {
          from { opacity: 0; transform: scale(0.94) translateY(2px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ── Skeleton — Warm Shimmer in Square Blocks ──── */
        .sb-root [data-slot="skeleton"] {
          border-radius: 0 !important;
          background: linear-gradient(90deg, #0b2230 25%, #163344 50%, #0b2230 75%) !important;
          background-size: 200% 100% !important;
          animation: sb-shimmer 2s ease infinite !important;
        }
        @keyframes sb-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Progress Bar ───────────────────────────────── */
        .sb-root [data-slot="progress"] {
          border-radius: 0 !important;
          height: 4px !important;
          background: #0b2230 !important;
        }
        .sb-root [data-slot="progress-indicator"] {
          border-radius: 0 !important;
          background: linear-gradient(90deg, #f4b964, #e8956a) !important;
          position: relative;
          overflow: hidden;
        }
        .sb-root [data-slot="progress-indicator"]::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: sb-progress-shimmer 1.5s ease infinite;
        }
        @keyframes sb-progress-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* ── Separator Override ──────────────────────────── */
        .sb-root [data-slot="separator"] {
          background: rgba(244,185,100, 0.08) !important;
        }

        /* ── Square Bouncing Dots Spinner ────────────────── */
        @keyframes sb-bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .sb-dot {
          width: 4px;
          height: 4px;
          background: #f4b964;
          display: inline-block;
          animation: sb-bounce 1.2s infinite ease-in-out both;
          animation-delay: -0.32s;
        }

        /* ── Pulsing Square Dot ─────────────────────────── */
        @keyframes sb-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .sb-pulse-dot {
          animation: sb-pulse 1.5s ease-in-out infinite;
        }

        /* ── Nav Link Hover ─────────────────────────────── */
        .sb-nav-link {
          position: relative;
          color: #d4dce2;
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sb-nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%; right: 50%;
          height: 2px;
          background-color: #f4b964;
          transition: left 250ms cubic-bezier(0.34, 1.56, 0.64, 1), right 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sb-nav-link:hover {
          color: #ffffff;
          transform: translateY(-1px);
        }
        .sb-nav-link:hover::after {
          left: 0; right: 0;
        }

        /* ── Sonner/Toast Overrides ──────────────────────── */
        .sb-root [data-sonner-toast] {
          border-radius: 0 !important;
          border: 1px solid rgba(244,185,100, 0.10) !important;
          background-color: #0e2838 !important;
          color: #eaeef1 !important;
          font-family: 'General Sans', sans-serif !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18) !important;
        }

        /* ── Click Feel ─────────────────────────────────── */
        .sb-root [data-slot="card"]:active {
          transform: translateY(1px) !important;
          transition: transform 80ms ease !important;
        }
      `}</style>

      <div className="sb-root min-h-screen relative">
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: 0,
              border: "1px solid rgba(244,185,100, 0.10)",
              backgroundColor: "#0e2838",
              color: "#eaeef1",
              fontFamily: "'General Sans', sans-serif",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            },
          }}
        />

        {/* ── Navigation ──────────────────────────────────── */}
        <nav className="sticky top-0 z-50 border-b border-[rgba(244,185,100,0.12)] bg-[#071a26]/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/main-logo.png" alt="PixelPrism" className="h-8 w-auto" />
              <span className="sb-h3" style={{ fontSize: 18, color: "#eaeef1" }}>PixelPrism</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="sb-nav sb-nav-link cursor-pointer">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 space-y-32">

          {/* ── Hero ────────────────────────────────────────── */}
          <header id="overview" className="space-y-6 pt-8">
            <p className="sb-label" style={{ color: "#e8956a", letterSpacing: "0.10em" }}>Design System 02</p>
            <h1 className="sb-display" style={{ color: "#eaeef1", maxWidth: "800px" }}>
              Studio<br />Brutalist
            </h1>
            <p className="sb-body" style={{ color: "#6d8d9f", maxWidth: "620px", marginTop: 16 }}>
              Equal parts both parents. Sharp shapes meet soft depth. Hard-invert hovers with shadow bloom.
              Square containers with layered shadows. Smooth curves with square data points. The visual tension is the design.
            </p>
            <div className="flex gap-4 mt-8">
              <Button className="sb-btn-primary">Get Started</Button>
              <Button className="sb-btn-ghost">
                Learn More <span className="sb-arrow ml-2">&rarr;</span>
              </Button>
            </div>
          </header>

          <Separator />

          {/* ── Typography ──────────────────────────────────── */}
          <Section id="typography" label="Foundation" title="Typography" subtitle="Dual font system: Neue Montreal for headings (DS-3 confidence), General Sans for body (DS-2 warmth). The font switch at H3→H4 — editorial above, conversational below.">
            <div className="space-y-12">
              {[
                { cls: "sb-display", label: "Display", font: "Neue Montreal", weight: "Bold (700)", size: "80px / 64px", text: "Aa" },
                { cls: "sb-h1", label: "H1", font: "Neue Montreal", weight: "Bold (700)", size: "44px", text: "The quick brown fox jumps" },
                { cls: "sb-h2", label: "H2", font: "Neue Montreal", weight: "Bold (700)", size: "32px", text: "Engagement analytics at scale" },
                { cls: "sb-h3", label: "H3", font: "Neue Montreal", weight: "Medium (500)", size: "22px", text: "Campaign performance metrics" },
                { cls: "sb-h4", label: "H4 (font switch →)", font: "General Sans", weight: "Semibold (600)", size: "17px", text: "Schedule posts across platforms" },
                { cls: "sb-body", label: "Body", font: "General Sans", weight: "Regular (400)", size: "15px", text: "Build and manage your social media presence with precision tools designed for modern marketing teams. Every metric, every insight, every action — razor-sharp but never sterile." },
                { cls: "sb-body-sm", label: "Body Small", font: "General Sans", weight: "Regular (400)", size: "13px", text: "Secondary text for supporting information and captions." },
                { cls: "sb-label", label: "Label / Overline", font: "Neue Montreal", weight: "Medium (500)", size: "11px / UPPERCASE / 0.10em", text: "Section Label Example" },
                { cls: "sb-nav", label: "Nav", font: "Neue Montreal", weight: "Medium (500)", size: "13px / UPPERCASE / 0.06em", text: "Navigation Item" },
                { cls: "sb-data", label: "Data / Stat", font: "JetBrains Mono", weight: "Bold (700)", size: "14px / 0.02em", text: "+12,450" },
                { cls: "sb-code", label: "Code", font: "JetBrains Mono", weight: "Regular (400)", size: "13px", text: 'engagement_rate: "8.2%"' },
                { cls: "sb-caption", label: "Caption", font: "General Sans", weight: "Regular (400)", size: "11px / 0.01em", text: "Updated 2 minutes ago" },
              ].map((item) => (
                <div key={item.label} className="border-b border-[rgba(244,185,100,0.06)] pb-8 space-y-2">
                  <p className="sb-label" style={{ color: "#6d8d9f" }}>
                    {item.label} &mdash; {item.font} {item.weight}, {item.size}
                  </p>
                  <p className={item.cls} style={{ color: item.cls === "sb-data" || item.cls === "sb-code" ? "#f4b964" : "#eaeef1" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Separator />

          {/* ── Color Palette ───────────────────────────────── */}
          <Section id="colors" label="Foundation" title="Color Palette" subtitle="Slightly warmer background than DS-3. Mixed chart palette: gold/cyan/coral/lime from both parents.">
            <div className="space-y-8">
              <div>
                <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>Core Palette</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <Swatch name="Background" hex="#071a26" color="#071a26" />
                  <Swatch name="Card" hex="#0e2838" color="#0e2838" />
                  <Swatch name="Popover" hex="#163344" color="#163344" />
                  <Swatch name="Primary (Gold)" hex="#f4b964" color="#f4b964" />
                  <Swatch name="Accent (Coral)" hex="#e8956a" color="#e8956a" />
                </div>
              </div>
              <div>
                <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>Text & UI</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <Swatch name="Foreground" hex="#eaeef1" color="#eaeef1" />
                  <Swatch name="Secondary FG" hex="#d4dce2" color="#d4dce2" />
                  <Swatch name="Muted FG" hex="#6d8d9f" color="#6d8d9f" />
                  <Swatch name="Destructive" hex="#e85454" color="#e85454" />
                  <Swatch name="Muted BG" hex="#0b2230" color="#0b2230" />
                </div>
              </div>
              <div>
                <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>Chart Palette &mdash; Mixed (Both Parents)</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <Swatch name="Chart 1 — Gold" hex="#f4b964" color="#f4b964" />
                  <Swatch name="Chart 2 — Cyan" hex="#64dcf4" color="#64dcf4" />
                  <Swatch name="Chart 3 — Coral" hex="#e8956a" color="#e8956a" />
                  <Swatch name="Chart 4 — Lime" hex="#a4f464" color="#a4f464" />
                  <Swatch name="Chart 5 — Light Gold" hex="#f4d494" color="#f4d494" />
                </div>
              </div>
              <div>
                <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>Structural Tokens</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { name: "Border", value: "rgba(244,185,100, 0.12)" },
                    { name: "Input", value: "rgba(244,185,100, 0.14)" },
                    { name: "Ring", value: "rgba(244,185,100, 0.45)" },
                    { name: "Radius", value: "0px (with shadows)" },
                  ].map((t) => (
                    <div key={t.name} className="p-4 border border-[rgba(244,185,100,0.12)] bg-[#0e2838]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)" }}>
                      <p className="sb-label" style={{ color: "#eaeef1", marginBottom: 4 }}>{t.name}</p>
                      <p className="sb-caption" style={{ color: "#6d8d9f" }}>{t.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Separator />

          {/* ── Buttons ─────────────────────────────────────── */}
          <Section id="components" label="Components" title="Buttons" subtitle="Hard-invert hover PLUS shadow bloom — the signature 50/50. Spring easing + translateY click feel.">
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="sb-label" style={{ color: "#6d8d9f" }}>Primary &mdash; Hard Invert + Shadow Bloom</p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button className="sb-btn-primary">Primary Action</Button>
                  <Button className="sb-btn-primary" disabled>Disabled</Button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="sb-label" style={{ color: "#6d8d9f" }}>Secondary &mdash; Glass + Shadow</p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button className="sb-btn-secondary">View Analytics</Button>
                  <Button className="sb-btn-secondary" disabled>Disabled</Button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="sb-label" style={{ color: "#6d8d9f" }}>Ghost &mdash; General Sans (Body Font)</p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button className="sb-btn-ghost">
                    View Details <span className="sb-arrow ml-2">&rarr;</span>
                  </Button>
                  <Button className="sb-btn-ghost">
                    Read More <span className="sb-arrow ml-2">&rarr;</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="sb-label" style={{ color: "#6d8d9f" }}>Destructive &mdash; Inverts to Filled Red</p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button className="sb-btn-destructive">Delete Campaign</Button>
                  <Button className="sb-btn-destructive" disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </Section>

          <Separator />

          {/* ── Cards ───────────────────────────────────────── */}
          <Section id="cards" label="Components" title="Cards" subtitle="The core visual tension: 0px radius containers with layered shadows. translateY(-2px) + shadow grows on hover.">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Campaign Performance", desc: "Track reach, engagement, and conversions across all platforms in real-time.", stat: "+24.5%", statLabel: "vs last week", badge: "Live" },
                { title: "Audience Growth", desc: "Monitor follower growth patterns and identify your fastest-growing channels.", stat: "11,500", statLabel: "total followers", badge: "Trending" },
                { title: "Content Calendar", desc: "Plan and schedule posts with intelligent timing suggestions.", stat: "12", statLabel: "posts this week", badge: "New" },
              ].map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <p className="sb-label" style={{ color: "#6d8d9f" }}>{item.statLabel}</p>
                      {item.badge === "Live" && <StatusBadge status="Live" />}
                      {item.badge === "Trending" && (
                        <span style={{ background: "rgba(244,185,100,0.15)", color: "#f4b964", border: "1px solid rgba(244,185,100,0.20)", padding: "4px 12px", fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Trending
                        </span>
                      )}
                      {item.badge === "New" && (
                        <span style={{ background: "rgba(232,149,106,0.15)", color: "#e8956a", border: "1px solid rgba(232,149,106,0.20)", padding: "4px 12px", fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          New
                        </span>
                      )}
                    </div>
                    <CardTitle className="sb-h3" style={{ color: "#eaeef1" }}>{item.stat}</CardTitle>
                    <CardDescription className="sb-body-sm" style={{ color: "#6d8d9f" }}>{item.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="sb-body-sm" style={{ color: "#d4dce2" }}>{item.desc}</p>
                  </CardContent>
                  <CardFooter className="border-t border-[rgba(244,185,100,0.06)]">
                    <Button className="sb-btn-ghost !p-0 !min-h-0 !h-auto !text-xs">
                      View Report <span className="sb-arrow ml-2">&rarr;</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Section>

          <Separator />

          {/* ── Form Elements ───────────────────────────────── */}
          <Section id="forms" label="Components" title="Form Elements" subtitle="Sharp inputs with warm gold borders. Glass-effect backgrounds. General Sans body font for readability.">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input placeholder="Enter campaign name..." />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Write a brief description..." className="!min-h-[120px]" />
                </div>
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">X (Twitter)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Publish Options</Label>
                  <div className="flex items-center gap-3">
                    <Checkbox id="sb-auto" />
                    <Label htmlFor="sb-auto" className="!text-[13px] !tracking-normal !normal-case cursor-pointer" style={{ color: "#d4dce2", fontFamily: "'General Sans', sans-serif" }}>Auto-publish when scheduled</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="sb-notify" />
                    <Label htmlFor="sb-notify" className="!text-[13px] !tracking-normal !normal-case cursor-pointer" style={{ color: "#d4dce2", fontFamily: "'General Sans', sans-serif" }}>Send notification on publish</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Feature Toggles</Label>
                  <div className="flex items-center justify-between">
                    <Label className="!text-[13px] !tracking-normal !normal-case" style={{ color: "#d4dce2", fontFamily: "'General Sans', sans-serif" }}>Analytics tracking</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="!text-[13px] !tracking-normal !normal-case" style={{ color: "#d4dce2", fontFamily: "'General Sans', sans-serif" }}>A/B testing</Label>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Separator />

          {/* ── Badges ──────────────────────────────────────── */}
          <Section id="badges" label="Components" title="Badges" subtitle="Square shape (0px radius) with DS-2's warm color tint system. Pro badge uses cyan accent for premium feel.">
            <div className="space-y-6">
              <div>
                <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Status Badges</p>
                <div className="flex flex-wrap gap-4">
                  <StatusBadge status="Live" />
                  <StatusBadge status="Scheduled" />
                  <StatusBadge status="Draft" />
                  <StatusBadge status="Failed" />
                </div>
              </div>
              <div>
                <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Feature Badges</p>
                <div className="flex flex-wrap gap-4">
                  <span style={{ background: "rgba(232,149,106,0.15)", color: "#e8956a", border: "1px solid rgba(232,149,106,0.20)", padding: "4px 12px", fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    New
                  </span>
                  <span style={{ background: "rgba(244,185,100,0.15)", color: "#f4b964", border: "1px solid rgba(244,185,100,0.20)", padding: "4px 12px", fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Trending
                  </span>
                  <span style={{ background: "rgba(100,220,244,0.12)", color: "#64dcf4", border: "1px solid rgba(100,220,244,0.20)", padding: "4px 12px", fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Pro
                  </span>
                </div>
              </div>
            </div>
          </Section>

          <Separator />

          {/* ── Table ───────────────────────────────────────── */}
          <Section id="data" label="Data Display" title="Table" subtitle="DS-2's generous 52px rows with DS-3's gold header border. Non-hovered rows dim to 0.85 opacity.">
            <div className="border border-[rgba(244,185,100,0.12)] sb-table-dimming" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)" }}>
              <Table>
                <TableHeader>
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead>Post</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Reach</TableHead>
                    <TableHead className="text-right">Engagement</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, i) => (
                    <TableRow key={row.post}>
                      <TableCell className="font-medium" style={{ color: "#eaeef1" }}>{row.post}</TableCell>
                      <TableCell style={{ color: "#d4dce2" }}>{row.platform}</TableCell>
                      <TableCell><StatusBadge status={row.status} /></TableCell>
                      <TableCell className="text-right">
                        {row.reach === "--" ? (
                          <span className="sb-data" style={{ color: "#6d8d9f" }}>--</span>
                        ) : parseInt(row.reach.replace(",", "")) > 0 ? (
                          <span className="sb-data" style={{ color: "#f4b964" }}>+{row.reach}</span>
                        ) : (
                          <span className="sb-data" style={{ color: "#6d8d9f" }}>0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.engagement === "--" ? (
                          <span className="sb-data" style={{ color: "#6d8d9f" }}>--</span>
                        ) : parseFloat(row.engagement) > 0 ? (
                          <span className="sb-data" style={{ color: "#f4b964" }}>+{row.engagement}</span>
                        ) : (
                          <span className="sb-data" style={{ color: "#e85454" }}>0%</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right sb-data" style={{ color: "#6d8d9f", fontSize: 12, fontWeight: 400 }}>
                        {row.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(244,185,100,0.06)]">
                <span className="sb-data" style={{ color: "#6d8d9f", fontSize: 12 }}>1 &mdash; 5 of 247</span>
                <div className="flex gap-2">
                  <Button className="sb-btn-secondary !min-h-[36px] !px-3 !py-1 !text-xs">&larr;</Button>
                  <Button className="sb-btn-secondary !min-h-[36px] !px-3 !py-1 !text-xs">&rarr;</Button>
                </div>
              </div>
            </div>
          </Section>

          <Separator />

          {/* ── Charts ──────────────────────────────────────── */}
          <Section id="charts" label="Data Display" title="Charts" subtitle="The visual contradiction: smooth monotone curves with square data points. Gradient fills from DS-2. Mixed palette from both parents.">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Line/Area Chart */}
              <div className="space-y-4">
                <p className="sb-label" style={{ color: "#6d8d9f" }}>Followers Over 7 Days &mdash; Smooth Curves, Square Points</p>
                <div className="border border-[rgba(244,185,100,0.12)] bg-[#0e2838] p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  <ChartContainer config={followersConfig} className="h-[300px] w-full">
                    <AreaChart data={followersData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="sb-fillInstagram" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f4b964" stopOpacity={0.12} />
                          <stop offset="100%" stopColor="#f4b964" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="sb-fillTiktok" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#64dcf4" stopOpacity={0.12} />
                          <stop offset="100%" stopColor="#64dcf4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="sb-fillFacebook" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e8956a" stopOpacity={0.12} />
                          <stop offset="100%" stopColor="#e8956a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255, 0.04)" vertical={false} />
                      <XAxis
                        dataKey="day"
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
                      <Area type="monotone" dataKey="instagram" stroke="#f4b964" strokeWidth={2.5} fill="url(#sb-fillInstagram)" dot={<SquareDot />} activeDot={{ r: 5, strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="tiktok" stroke="#64dcf4" strokeWidth={2.5} fill="url(#sb-fillTiktok)" dot={<SquareDot />} activeDot={{ r: 5, strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="facebook" stroke="#e8956a" strokeWidth={2.5} fill="url(#sb-fillFacebook)" dot={<SquareDot />} activeDot={{ r: 5, strokeWidth: 2 }} />
                    </AreaChart>
                  </ChartContainer>
                  <div className="flex gap-6 mt-4 pl-4">
                    {[
                      { label: "Instagram", color: "#f4b964" },
                      { label: "TikTok", color: "#64dcf4" },
                      { label: "Facebook", color: "#e8956a" },
                    ].map((l) => (
                      <div key={l.label} className="flex items-center gap-2">
                        <span className="inline-block" style={{ width: 6, height: 6, backgroundColor: l.color }} />
                        <span className="sb-caption" style={{ color: "#6d8d9f" }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="space-y-4">
                <p className="sb-label" style={{ color: "#6d8d9f" }}>Engagement by Type &mdash; Hover Inverts Fill↔Outline</p>
                <div className="border border-[rgba(244,185,100,0.12)] bg-[#0e2838] p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  <ChartContainer config={engagementConfig} className="h-[300px] w-full">
                    <BarChart
                      data={engagementData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      onMouseMove={(state: any) => {
                        if (state && state.activeTooltipIndex !== undefined) {
                          setHoveredBarIndex(state.activeTooltipIndex)
                        }
                      }}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255, 0.04)" vertical={false} />
                      <XAxis
                        dataKey="type"
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
                      <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                      <Bar
                        dataKey="count"
                        fill="#f4b964"
                        radius={0}
                        shape={(props: any) => {
                          const color = engagementColors[props.index % engagementColors.length]
                          return <InvertBar {...props} fill={color} isHovered={props.index === hoveredBarIndex} />
                        }}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </Section>

          <Separator />

          {/* ── Notifications / Toasts ──────────────────────── */}
          <Section id="feedback" label="Feedback" title="Notifications" subtitle="Slide up from bottom-center with spring overshoot. 0px radius, structural border. Left 4px color stripe. Max 3 stacked.">
            <div className="flex flex-wrap gap-4">
              <Button
                className="sb-btn-primary"
                onClick={() => {
                  toast.info("Campaign analytics have been refreshed.", {
                    duration: 6000,
                    style: { borderLeft: "4px solid #f4b964" },
                  })
                }}
              >
                Info Toast
              </Button>
              <Button
                className="sb-btn-primary"
                onClick={() => {
                  toast.success("Post published successfully to Instagram.", {
                    duration: 6000,
                    style: { borderLeft: "4px solid #a4f464" },
                  })
                }}
              >
                Success Toast
              </Button>
              <Button
                className="sb-btn-destructive"
                onClick={() => {
                  toast.error("Failed to connect to TikTok API.", {
                    duration: 6000,
                    style: { borderLeft: "4px solid #e85454" },
                  })
                }}
              >
                Error Toast
              </Button>
            </div>
          </Section>

          <Separator />

          {/* ── Loading States ──────────────────────────────── */}
          <Section id="loading" label="Feedback" title="Loading States" subtitle="Cherry-picked from both: DS-2's warm shimmer in square blocks. Square bouncing dots. Gradient progress with shimmer overlay.">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <p className="sb-label" style={{ color: "#6d8d9f" }}>Skeleton &mdash; Warm Shimmer, Square Blocks</p>
                <div className="space-y-3 p-4 border border-[rgba(244,185,100,0.12)] bg-[#0e2838]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="sb-label" style={{ color: "#6d8d9f" }}>Spinner &mdash; Square Bouncing Dots</p>
                <div className="flex items-center justify-center p-12 border border-[rgba(244,185,100,0.12)] bg-[#0e2838]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  <SquareDotsSpinner />
                </div>
              </div>

              <div className="space-y-4">
                <p className="sb-label" style={{ color: "#6d8d9f" }}>Progress &mdash; Gradient + Shimmer (4px)</p>
                <div className="space-y-4 p-4 border border-[rgba(244,185,100,0.12)] bg-[#0e2838]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  <Progress value={progressValue} />
                  <p className="sb-data" style={{ color: "#f4b964" }}>{progressValue}%</p>
                </div>
              </div>
            </div>
          </Section>

          <Separator />

          {/* ── Dialog ──────────────────────────────────────── */}
          <Section id="dialog" label="Overlays" title="Dialog" subtitle="80% dark overlay + backdrop-blur(6px) — halfway between both parents. Layered shadow on modal.">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="sb-btn-primary">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="sb-h3" style={{ color: "#eaeef1" }}>Delete Campaign</DialogTitle>
                  <DialogDescription className="sb-body-sm" style={{ color: "#d4dce2" }}>
                    This action cannot be undone. This will permanently delete the campaign
                    and remove all associated analytics data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3 mt-4">
                  <Button className="sb-btn-secondary !min-h-[40px]">Cancel</Button>
                  <Button className="sb-btn-destructive !min-h-[40px]">Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Section>

          <Separator />

          {/* ── Dropdown Menu ───────────────────────────────── */}
          <Section id="dropdown" label="Overlays" title="Dropdown Menu" subtitle="Gold left bar + bg tint on hover. Layered shadow. Spring easing.">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="sb-btn-primary">Open Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[200px]">
                <DropdownMenuLabel className="sb-label" style={{ color: "#6d8d9f" }}>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[rgba(244,185,100,0.06)]" />
                <DropdownMenuItem className="sb-body-sm cursor-pointer" style={{ color: "#d4dce2" }}>Edit Campaign</DropdownMenuItem>
                <DropdownMenuItem className="sb-body-sm cursor-pointer" style={{ color: "#d4dce2" }}>Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="sb-body-sm cursor-pointer" style={{ color: "#d4dce2" }}>View Analytics</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[rgba(244,185,100,0.06)]" />
                <DropdownMenuItem variant="destructive" className="sb-body-sm cursor-pointer" style={{ color: "#e85454" }}>
                  Delete Campaign
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Section>

          <Separator />

          {/* ── Tooltips ────────────────────────────────────── */}
          <Section id="tooltips" label="Overlays" title="Tooltips" subtitle="Square tooltips with layered shadow and spring bounce-in animation. General Sans body font.">
            <TooltipProvider>
              <div className="flex flex-wrap gap-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="sb-btn-secondary">Hover for Info</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Campaign performance details</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="sb-btn-secondary">Analytics Tooltip</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>+24.5% increase this week</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="sb-data cursor-help" style={{ color: "#64dcf4", borderBottom: "1px dashed rgba(100,220,244,0.3)", paddingBottom: 2 }}>
                      11,500
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total followers across all platforms</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><StatusBadge status="Live" /></span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This post is currently live and receiving engagement</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </Section>

          <Separator />

          {/* ── Footer ──────────────────────────────────────── */}
          <footer className="pt-8 pb-16 border-t border-[rgba(244,185,100,0.08)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/main-logo.png" alt="PixelPrism" className="h-6 w-auto opacity-50" />
                <span className="sb-label" style={{ color: "#6d8d9f" }}>PixelPrism Design System 2</span>
              </div>
              <span className="sb-caption" style={{ color: "#6d8d9f" }}>Studio Brutalist &mdash; Sharp but Alive</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
