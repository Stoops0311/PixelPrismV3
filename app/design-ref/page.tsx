"use client"

import { useState } from "react"
import { DS2PageLayout } from "@/components/ds2/page-layout"
import { DS2Section } from "@/components/ds2/section"
import { DS2StatCard } from "@/components/ds2/stat-card"
import { DS2DataTable, type DS2Column } from "@/components/ds2/data-table"
import { DS2AreaChart, type AreaSeries } from "@/components/ds2/chart-area"
import { DS2BarChart } from "@/components/ds2/chart-bar"
import { StatusBadge } from "@/components/ds2/status-badge"
import { DS2Spinner } from "@/components/ds2/spinner"
import { showSuccess, showError, showInfo } from "@/components/ds2/toast"

import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { type ChartConfig } from "@/components/ui/chart"

// ── Sample Data ─────────────────────────────────────────────────────────────

const tableData = [
  { campaign: "Summer Collection Launch", status: "live", platform: "Instagram", reach: "24.5K", engagement: "3.2%" },
  { campaign: "Product Review Series", status: "scheduled", platform: "TikTok", reach: "18.1K", engagement: "4.7%" },
  { campaign: "Brand Story Highlights", status: "draft", platform: "Facebook", reach: "—", engagement: "—" },
  { campaign: "Flash Sale Countdown", status: "live", platform: "Instagram", reach: "31.2K", engagement: "5.1%" },
  { campaign: "Behind the Scenes", status: "failed", platform: "YouTube", reach: "2.1K", engagement: "0.8%" },
]

const tableColumns: DS2Column[] = [
  { key: "campaign", label: "Campaign" },
  {
    key: "status",
    label: "Status",
    render: (val: string) => (
      <StatusBadge status={val as "live" | "scheduled" | "draft" | "failed"} />
    ),
  },
  { key: "platform", label: "Platform" },
  { key: "reach", label: "Reach", align: "right", isData: true },
  { key: "engagement", label: "Engagement", align: "right", isData: true },
]

const followersData = [
  { day: "Mon", instagram: 1200, tiktok: 800, facebook: 400 },
  { day: "Tue", instagram: 1350, tiktok: 920, facebook: 380 },
  { day: "Wed", instagram: 1100, tiktok: 1100, facebook: 450 },
  { day: "Thu", instagram: 1500, tiktok: 950, facebook: 420 },
  { day: "Fri", instagram: 1800, tiktok: 1300, facebook: 500 },
  { day: "Sat", instagram: 2100, tiktok: 1600, facebook: 550 },
  { day: "Sun", instagram: 1900, tiktok: 1400, facebook: 480 },
]

const areaSeries: AreaSeries[] = [
  { key: "instagram", label: "Instagram", color: "#f4b964" },
  { key: "tiktok", label: "TikTok", color: "#64dcf4" },
  { key: "facebook", label: "Facebook", color: "#e8956a" },
]

const areaChartConfig: ChartConfig = {
  instagram: { label: "Instagram", color: "#f4b964" },
  tiktok: { label: "TikTok", color: "#64dcf4" },
  facebook: { label: "Facebook", color: "#e8956a" },
}

const engagementData = [
  { type: "Likes", count: 4200 },
  { type: "Comments", count: 1800 },
  { type: "Shares", count: 960 },
  { type: "Saves", count: 2400 },
  { type: "Views", count: 8100 },
]

const barChartConfig: ChartConfig = {
  count: { label: "Count" },
}

// ── Component ───────────────────────────────────────────────────────────────

export default function DesignRefPage() {
  const [tablePage, setTablePage] = useState(1)
  const [gpuCount, setGpuCount] = useState(8)
  const [sliderValue, setSliderValue] = useState([400])
  const [computeEnv, setComputeEnv] = useState("kubernetes")

  return (
    <DS2PageLayout
      brandName="PixelPrism"
      navItems={[
        { label: "Colors", href: "#colors" },
        { label: "Cards", href: "#cards" },
        { label: "Forms", href: "#forms" },
        { label: "Data", href: "#data" },
        { label: "Charts", href: "#charts" },
        { label: "Components", href: "#components" },
      ]}
    >
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="sb-display" style={{ color: "#eaeef1" }}>
          Design Reference
        </h1>
        <p className="sb-body" style={{ color: "#6d8d9f", marginTop: 12 }}>
          Component reference for Studio Brutalist — every primitive, pattern,
          and composition rendered with DS-2 theming.
        </p>
      </div>

      {/* ── Card + Form ──────────────────────────────────────────── */}
      <div id="cards" className="grid grid-cols-2 gap-6">
        {/* Card */}
        <div>
          <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Card</p>
          <Card>
            <div
              style={{
                height: 180,
                background: "linear-gradient(135deg, #163344 0%, #0b2230 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="sb-label" style={{ color: "#6d8d9f" }}>Image Placeholder</span>
            </div>
            <CardContent className="pt-5">
              <CardTitle className="sb-h4" style={{ color: "#eaeef1" }}>
                Observability Plus is replacing Monitoring
              </CardTitle>
              <CardDescription className="sb-body-sm mt-2" style={{ color: "#6d8d9f" }}>
                Switch to the improved way to explore your data, with natural language.
                Monitoring will no longer be available on the Pro plan in November, 2025.
              </CardDescription>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-[rgba(244,185,100,0.06)]">
              <Button className="sb-btn-primary !px-4 !py-2 !min-h-[36px] !text-xs">
                Create Query +
              </Button>
              <StatusBadge status="new">Warning</StatusBadge>
            </CardFooter>
          </Card>
        </div>

        {/* Form */}
        <div id="forms">
          <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Form</p>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="sb-h4" style={{ color: "#eaeef1" }}>
                  User Information
                </CardTitle>
                <CardDescription className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                  Please fill in your details below
                </CardDescription>
              </div>
              <Button className="sb-btn-ghost !p-1 !min-h-0 !h-auto">
                <span style={{ fontSize: 18 }}>&#8942;</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Framework</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select a framework" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="remix">Remix</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Comments</Label>
                <Textarea placeholder="Add any additional comments" />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 border-t border-[rgba(244,185,100,0.06)]">
              <Button className="sb-btn-primary !px-4 !py-2 !min-h-[36px] !text-xs">Submit</Button>
              <Button className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs">Cancel</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* ── Complex Form + Fields ────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Complex Form */}
        <div>
          <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Complex Form</p>
          <Card>
            <CardHeader>
              <CardTitle className="sb-h4" style={{ color: "#eaeef1" }}>Payment Method</CardTitle>
              <CardDescription className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                All transactions are secure and encrypted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name on Card</Label>
                <Input placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input placeholder="123" />
                </div>
              </div>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>Enter your 16-digit number.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="MM" /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i} value={String(i + 1).padStart(2, "0")}>
                          {String(i + 1).padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="YYYY" /></SelectTrigger>
                    <SelectContent>
                      {[2025, 2026, 2027, 2028, 2029].map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div>
                <p className="sb-h4" style={{ color: "#eaeef1", marginBottom: 4 }}>Billing Address</p>
                <p className="sb-body-sm" style={{ color: "#6d8d9f", marginBottom: 12 }}>
                  The billing address associated with your payment.
                </p>
                <div className="flex items-center gap-2">
                  <Checkbox id="same-address" defaultChecked />
                  <label htmlFor="same-address" className="sb-body-sm" style={{ color: "#eaeef1", cursor: "pointer" }}>
                    Same as shipping address
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Comments</Label>
                <Textarea placeholder="Add any additional comments" />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 border-t border-[rgba(244,185,100,0.06)]">
              <Button className="sb-btn-primary !px-4 !py-2 !min-h-[36px] !text-xs">Submit</Button>
              <Button className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs">Cancel</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Fields */}
        <div>
          <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Fields</p>
          <Card>
            <CardHeader>
              <CardTitle className="sb-h4" style={{ color: "#eaeef1" }}>Compute Environment</CardTitle>
              <CardDescription className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                Select the compute environment for your cluster.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Radio-style field cards */}
              <RadioGroup value={computeEnv} onValueChange={setComputeEnv}>
                <label
                  className={`sb-field-card flex items-center justify-between ${computeEnv === "kubernetes" ? "sb-field-card--selected" : ""}`}
                >
                  <div>
                    <p className="sb-h4" style={{ color: "#eaeef1" }}>Kubernetes</p>
                    <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                      Run GPU workloads on a K8s configured cluster. This is the default.
                    </p>
                  </div>
                  <RadioGroupItem value="kubernetes" />
                </label>
                <label
                  className="sb-field-card sb-field-card--disabled flex items-center justify-between"
                >
                  <div>
                    <p className="sb-h4" style={{ color: "#eaeef1" }}>Virtual Machine</p>
                    <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                      Access a VM configured cluster to run workloads. (Coming soon)
                    </p>
                  </div>
                  <RadioGroupItem value="vm" disabled />
                </label>
              </RadioGroup>

              {/* Number stepper */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="sb-h4" style={{ color: "#eaeef1" }}>Number of GPUs</p>
                    <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>You can add more later.</p>
                  </div>
                  <div className="sb-number-stepper">
                    <button type="button" onClick={() => setGpuCount(Math.max(1, gpuCount - 1))}>−</button>
                    <input type="text" value={gpuCount} readOnly />
                    <button type="button" onClick={() => setGpuCount(gpuCount + 1)}>+</button>
                  </div>
                </div>
              </div>

              {/* Switch */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="sb-h4" style={{ color: "#eaeef1" }}>Wallpaper Tinting</p>
                  <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>Allow the wallpaper to be tinted.</p>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-3 p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(244,185,100,0.08)" }}>
                <Checkbox id="terms" defaultChecked />
                <label htmlFor="terms" className="sb-body" style={{ color: "#eaeef1", cursor: "pointer" }}>
                  I agree to the terms and conditions
                </label>
              </div>

              {/* Slider */}
              <div>
                <p className="sb-h4" style={{ color: "#eaeef1" }}>Price Range</p>
                <p className="sb-body-sm" style={{ color: "#6d8d9f", marginBottom: 12 }}>
                  Set your budget range ($200 - $800).
                </p>
                <Slider
                  min={200}
                  max={800}
                  step={50}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                />
                <p className="sb-data mt-2" style={{ color: "#f4b964" }}>${sliderValue[0]}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 border-t border-[rgba(244,185,100,0.06)]">
              <Button className="sb-btn-primary !px-4 !py-2 !min-h-[36px] !text-xs">Submit</Button>
              <Button className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs">Cancel</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* ── Item + Button Group ──────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Item */}
        <div>
          <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Item</p>
          <Card>
            <div className="sb-item">
              <div>
                <p className="sb-h4" style={{ color: "#eaeef1" }}>Two-factor authentication</p>
                <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>Verify via email or phone number.</p>
              </div>
              <Button className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs">Enable</Button>
            </div>
            <div className="sb-item">
              <div className="flex items-center gap-3">
                <span style={{ color: "#6d8d9f", fontSize: 18 }}>&#9745;</span>
                <p className="sb-body" style={{ color: "#eaeef1" }}>Your order has been shipped.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Button Group */}
        <div>
          <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Button Group</p>
          <Card>
            <CardContent className="space-y-4 pt-5">
              {/* Nav arrows + actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button className="sb-btn-secondary !px-3 !py-2 !min-h-[36px] !text-xs">&larr;</Button>
                <Button className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs">Archive</Button>
                <Button className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs">Report</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs">
                      Snooze &#9662;
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>1 hour</DropdownMenuItem>
                    <DropdownMenuItem>4 hours</DropdownMenuItem>
                    <DropdownMenuItem>Tomorrow</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="sb-btn-secondary !px-3 !py-2 !min-h-[36px] !text-xs">&larr;</Button>
                <Button className="sb-btn-secondary !px-3 !py-2 !min-h-[36px] !text-xs">&rarr;</Button>
              </div>

              {/* Numbered pages + split buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button className="sb-btn-primary !px-3 !py-2 !min-h-[36px] !text-xs">1</Button>
                <Button className="sb-btn-secondary !px-3 !py-2 !min-h-[36px] !text-xs">2</Button>
                <Button className="sb-btn-secondary !px-3 !py-2 !min-h-[36px] !text-xs">3</Button>
                <span className="w-4" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs">
                      Follow &#9662;
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Follow</DropdownMenuItem>
                    <DropdownMenuItem>Mute</DropdownMenuItem>
                    <DropdownMenuItem>Block</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs">
                      &#9881; Copilot &#9662;
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Suggest</DropdownMenuItem>
                    <DropdownMenuItem>Explain</DropdownMenuItem>
                    <DropdownMenuItem>Fix</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Empty + Input Group ──────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Empty */}
        <div>
          <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Empty</p>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex -space-x-2 mb-4">
                <Avatar><AvatarFallback style={{ background: "#163344", color: "#6d8d9f", borderRadius: 0, border: "1px solid rgba(244,185,100,0.12)" }}>JD</AvatarFallback></Avatar>
                <Avatar><AvatarFallback style={{ background: "#163344", color: "#6d8d9f", borderRadius: 0, border: "1px solid rgba(244,185,100,0.12)" }}>AK</AvatarFallback></Avatar>
                <Avatar><AvatarFallback style={{ background: "#163344", color: "#6d8d9f", borderRadius: 0, border: "1px solid rgba(244,185,100,0.12)" }}>&#9830;</AvatarFallback></Avatar>
              </div>
              <p className="sb-h4" style={{ color: "#eaeef1" }}>No Team Members</p>
              <p className="sb-body-sm" style={{ color: "#6d8d9f", marginTop: 4 }}>
                Invite your team to collaborate on this project.
              </p>
              <div className="flex gap-3 mt-6">
                <Button className="sb-btn-primary !px-4 !py-2 !min-h-[36px] !text-xs">Show Dialog</Button>
                <Button className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs">Connect Mouse</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Input Group */}
        <div>
          <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Input Group</p>
          <div className="space-y-3">
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <span style={{ color: "#6d8d9f" }}>&#128269;</span>
              </InputGroupAddon>
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon align="inline-end">
                <span className="sb-caption" style={{ color: "#6d8d9f" }}>12 results</span>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupAddon align="inline-start">
                <span className="sb-caption" style={{ color: "#6d8d9f" }}>https://</span>
              </InputGroupAddon>
              <InputGroupInput placeholder="example.com" />
              <InputGroupAddon align="inline-end">
                <span style={{ color: "#6d8d9f" }}>&#9432;</span>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupAddon align="inline-start">
                <span style={{ color: "#6d8d9f" }}>&#127760;</span>
              </InputGroupAddon>
              <InputGroupInput placeholder="https://" />
              <InputGroupAddon align="inline-end">
                <span style={{ color: "#6d8d9f" }}>&#9734;</span>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupButton>+</InputGroupButton>
              </InputGroupAddon>
              <InputGroupInput placeholder="Send a message..." />
              <InputGroupAddon align="inline-end">
                <span style={{ color: "#6d8d9f" }}>&#9776;</span>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupTextarea placeholder="Ask, Search or Chat..." />
              <InputGroupAddon align="block-end" className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <InputGroupButton>+</InputGroupButton>
                  <span className="sb-caption" style={{ color: "#6d8d9f" }}>Auto</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="sb-caption" style={{ color: "#6d8d9f" }}>52% used</span>
                  <span style={{ color: "#f4b964", fontSize: 14 }}>&#9650;</span>
                </div>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>

      {/* ── Sheet + Badge ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Sheet */}
        <div>
          <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Sheet</p>
          <Card>
            <CardContent className="pt-5">
              <div className="grid grid-cols-4 gap-3">
                {(["top", "right", "bottom", "left"] as const).map((side) => (
                  <Sheet key={side}>
                    <SheetTrigger asChild>
                      <Button className="sb-btn-secondary !px-3 !py-2 !min-h-[40px] !text-xs capitalize">
                        {side}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side={side}>
                      <SheetHeader>
                        <SheetTitle>Sheet — {side}</SheetTitle>
                        <SheetDescription>
                          This sheet slides in from the {side}.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="p-4">
                        <p className="sb-body" style={{ color: "#6d8d9f" }}>
                          Sheet content goes here. This panel is reusable across the app.
                        </p>
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badge */}
        <div id="components">
          <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 12 }}>Badge</p>
          <Card>
            <CardContent className="space-y-4 pt-5">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="live" />
                <StatusBadge status="scheduled" />
                <StatusBadge status="draft" />
                <StatusBadge status="failed" />
                <StatusBadge status="trending" />
                <StatusBadge status="new" />
                <StatusBadge status="pro" />
              </div>
              <Separator />
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">&#8634; Syncing</Badge>
                <Badge variant="outline">&#8635; Updating</Badge>
                <Badge variant="outline">&#9696; Loading</Badge>
                <Badge variant="outline">&#128279; Link</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Typography ───────────────────────────────────────────── */}
      <DS2Section
        id="typography"
        label="Typography"
        title="Type Scale"
        subtitle="Dual-font system: Neue Montreal for headings and labels, General Sans from H4 downward, JetBrains Mono for data."
      >
        <div className="space-y-4">
          {[
            { cls: "sb-display", label: "Display", meta: "Neue Montreal · 80px · 700" },
            { cls: "sb-h1", label: "Heading 1", meta: "Neue Montreal · 44px · 700" },
            { cls: "sb-h2", label: "Heading 2", meta: "Neue Montreal · 32px · 700" },
            { cls: "sb-h3", label: "Heading 3", meta: "Neue Montreal · 22px · 500" },
            { cls: "sb-h4", label: "Heading 4", meta: "General Sans · 17px · 600" },
            { cls: "sb-body", label: "Body", meta: "General Sans · 15px · 400" },
            { cls: "sb-body-sm", label: "Body Small", meta: "General Sans · 13px · 400" },
            { cls: "sb-label", label: "LABEL / OVERLINE", meta: "Neue Montreal · 11px · 500" },
            { cls: "sb-nav", label: "NAVIGATION", meta: "Neue Montreal · 13px · 500" },
            { cls: "sb-data", label: "1,234.56", meta: "JetBrains Mono · 14px · 700" },
            { cls: "sb-code", label: "const x = 42", meta: "JetBrains Mono · 13px · 400" },
            { cls: "sb-caption", label: "Caption text", meta: "General Sans · 11px · 400" },
          ].map((t) => (
            <div key={t.cls} className="flex items-baseline justify-between border-b border-[rgba(244,185,100,0.06)] pb-3">
              <span className={t.cls} style={{ color: "#eaeef1" }}>{t.label}</span>
              <span className="sb-caption" style={{ color: "#6d8d9f" }}>{t.meta}</span>
            </div>
          ))}
        </div>
      </DS2Section>

      {/* ── Color Palette ──────────────────────────────────────────── */}
      <DS2Section
        id="colors"
        label="Foundation"
        title="Color Palette"
        subtitle="Three-depth surface system with gold-tinted accents. Chart palette cycles through five colors."
      >
        <div className="space-y-8">
          <div>
            <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>Core Palette</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { name: "Background", hex: "#071a26", color: "#071a26" },
                { name: "Card", hex: "#0e2838", color: "#0e2838" },
                { name: "Popover", hex: "#163344", color: "#163344" },
                { name: "Primary (Gold)", hex: "#f4b964", color: "#f4b964" },
                { name: "Accent (Coral)", hex: "#e8956a", color: "#e8956a" },
              ].map((s) => (
                <div key={s.name} className="space-y-2">
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      backgroundColor: s.color,
                      border: "1px solid rgba(244,185,100, 0.12)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
                    }}
                  />
                  <p className="sb-label" style={{ color: "#eaeef1" }}>{s.name}</p>
                  <p className="sb-data" style={{ color: "#6d8d9f", fontSize: 11 }}>{s.hex}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>Text & UI</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { name: "Foreground", hex: "#eaeef1", color: "#eaeef1" },
                { name: "Secondary FG", hex: "#d4dce2", color: "#d4dce2" },
                { name: "Muted FG", hex: "#6d8d9f", color: "#6d8d9f" },
                { name: "Destructive", hex: "#e85454", color: "#e85454" },
                { name: "Muted BG", hex: "#0b2230", color: "#0b2230" },
              ].map((s) => (
                <div key={s.name} className="space-y-2">
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      backgroundColor: s.color,
                      border: "1px solid rgba(244,185,100, 0.12)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
                    }}
                  />
                  <p className="sb-label" style={{ color: "#eaeef1" }}>{s.name}</p>
                  <p className="sb-data" style={{ color: "#6d8d9f", fontSize: 11 }}>{s.hex}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>Chart Palette</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { name: "Chart 1 — Gold", hex: "#f4b964", color: "#f4b964" },
                { name: "Chart 2 — Cyan", hex: "#64dcf4", color: "#64dcf4" },
                { name: "Chart 3 — Coral", hex: "#e8956a", color: "#e8956a" },
                { name: "Chart 4 — Lime", hex: "#a4f464", color: "#a4f464" },
                { name: "Chart 5 — Light Gold", hex: "#f4d494", color: "#f4d494" },
              ].map((s) => (
                <div key={s.name} className="space-y-2">
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      backgroundColor: s.color,
                      border: "1px solid rgba(244,185,100, 0.12)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
                    }}
                  />
                  <p className="sb-label" style={{ color: "#eaeef1" }}>{s.name}</p>
                  <p className="sb-data" style={{ color: "#6d8d9f", fontSize: 11 }}>{s.hex}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>Structural Tokens</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Border", value: "rgba(244,185,100, 0.12)" },
                { name: "Input", value: "rgba(244,185,100, 0.14)" },
                { name: "Ring", value: "rgba(244,185,100, 0.45)" },
                { name: "Radius", value: "0px (always)" },
              ].map((t) => (
                <div
                  key={t.name}
                  className="p-4 border border-[rgba(244,185,100,0.12)] bg-[#0e2838]"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)" }}
                >
                  <p className="sb-label" style={{ color: "#eaeef1", marginBottom: 4 }}>{t.name}</p>
                  <p className="sb-caption" style={{ color: "#6d8d9f" }}>{t.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DS2Section>

      {/* ── Shadow Tiers ──────────────────────────────────────────── */}
      <DS2Section
        id="shadows"
        label="Foundation"
        title="Shadow Tiers"
        subtitle="Every shadow uses dual layers: broad ambient + tight contact. The system creates physical depth."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Base", css: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)", usage: "Cards, containers" },
            { name: "Elevated", css: "0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10)", usage: "Hover states, dropdowns" },
            { name: "Modal", css: "0 12px 40px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.12)", usage: "Dialogs, modals" },
            { name: "Toast", css: "0 4px 16px rgba(0,0,0,0.18)", usage: "Toasts (single-layer)" },
          ].map((s) => (
            <div
              key={s.name}
              className="p-6 bg-[#0e2838] border border-[rgba(244,185,100,0.12)]"
              style={{ boxShadow: s.css }}
            >
              <p className="sb-h4" style={{ color: "#eaeef1", marginBottom: 4 }}>{s.name}</p>
              <p className="sb-caption" style={{ color: "#6d8d9f", marginBottom: 8 }}>{s.usage}</p>
              <p className="sb-code" style={{ color: "#f4b964", fontSize: 10, wordBreak: "break-all" }}>{s.css}</p>
            </div>
          ))}
        </div>
      </DS2Section>

      {/* ── Border Opacity Scale ──────────────────────────────────── */}
      <DS2Section
        id="borders"
        label="Foundation"
        title="Border Opacity Scale"
        subtitle="All borders use #f4b964 at varying opacities. Never gray or white borders."
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { opacity: "6%", rgba: "rgba(244,185,100, 0.06)", usage: "Barely visible separators" },
            { opacity: "8%", rgba: "rgba(244,185,100, 0.08)", usage: "Section dividers" },
            { opacity: "12%", rgba: "rgba(244,185,100, 0.12)", usage: "Card borders (default)" },
            { opacity: "14%", rgba: "rgba(244,185,100, 0.14)", usage: "Input borders (resting)" },
            { opacity: "22%", rgba: "rgba(244,185,100, 0.22)", usage: "Hover-brightened" },
            { opacity: "45%", rgba: "rgba(244,185,100, 0.45)", usage: "Focus rings, active" },
          ].map((b) => (
            <div key={b.opacity} className="space-y-2">
              <div
                className="h-20 bg-[#0e2838]"
                style={{
                  border: `2px solid ${b.rgba}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
                }}
              />
              <p className="sb-data" style={{ color: "#f4b964" }}>{b.opacity}</p>
              <p className="sb-caption" style={{ color: "#6d8d9f" }}>{b.usage}</p>
            </div>
          ))}
        </div>
      </DS2Section>

      {/* ── Buttons ──────────────────────────────────────────────── */}
      <DS2Section
        id="buttons"
        label="Actions"
        title="Buttons"
        subtitle="Four variants: primary (hard-invert), secondary (glass), ghost (arrow), destructive (fill-on-hover)."
      >
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-3">
            <Button className="sb-btn-primary w-full">Primary</Button>
            <Button className="sb-btn-primary w-full" disabled>Disabled</Button>
          </div>
          <div className="space-y-3">
            <Button className="sb-btn-secondary w-full">Secondary</Button>
            <Button className="sb-btn-secondary w-full" disabled>Disabled</Button>
          </div>
          <div className="space-y-3">
            <Button className="sb-btn-ghost w-full">Ghost <span className="sb-arrow ml-2">&rarr;</span></Button>
            <Button className="sb-btn-ghost w-full" disabled>Disabled</Button>
          </div>
          <div className="space-y-3">
            <Button className="sb-btn-destructive w-full">Destructive</Button>
            <Button className="sb-btn-destructive w-full" disabled>Disabled</Button>
          </div>
        </div>
      </DS2Section>

      {/* ── Stat Cards ───────────────────────────────────────────── */}
      <DS2Section
        id="stat-cards"
        label="Metrics"
        title="Stat Cards"
        subtitle="Composable metric cards with trends, badges, and actions."
      >
        <div className="grid grid-cols-3 gap-6">
          <DS2StatCard
            label="Total Followers"
            value="24,521"
            trend={{ value: "12.5%", direction: "up" }}
            badge={<StatusBadge status="live" />}
            action={{ label: "View Analytics", onClick: () => {} }}
          />
          <DS2StatCard
            label="Engagement Rate"
            value="4.7%"
            description="Across all platforms this week"
            trend={{ value: "0.3%", direction: "down" }}
          />
          <DS2StatCard
            label="Scheduled Posts"
            value="18"
            badge={<StatusBadge status="scheduled" />}
            action={{ label: "Manage Queue", onClick: () => {} }}
          />
        </div>
      </DS2Section>

      {/* ── Table ────────────────────────────────────────────────── */}
      <DS2Section
        id="data"
        label="Data"
        title="Data Table"
        subtitle="Row dimming, gold hover bar, pagination, status badges."
      >
        <DS2DataTable
          columns={tableColumns}
          data={tableData}
          pagination={{
            page: tablePage,
            pageSize: 5,
            total: 12,
            onPageChange: setTablePage,
          }}
        />
      </DS2Section>

      {/* ── Charts ───────────────────────────────────────────────── */}
      <div id="charts" className="grid grid-cols-2 gap-6">
        <DS2Section
          id="area-chart"
          label="Visualization"
          title="Area Chart"
          subtitle="Smooth curves with square data points."
        >
          <DS2AreaChart
            data={followersData}
            series={areaSeries}
            xAxisKey="day"
            config={areaChartConfig}
          />
        </DS2Section>

        <DS2Section
          id="bar-chart"
          label="Visualization"
          title="Bar Chart"
          subtitle="Fill-inversion on hover."
        >
          <DS2BarChart
            data={engagementData}
            dataKey="count"
            nameKey="type"
            config={barChartConfig}
          />
        </DS2Section>
      </div>

      {/* ── Accordion ────────────────────────────────────────────── */}
      <DS2Section
        id="accordion"
        label="Disclosure"
        title="Accordion"
        subtitle="Collapsible content sections with spring easing."
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I schedule a post?</AccordionTrigger>
            <AccordionContent>
              Navigate to the Campaign dashboard, click &quot;New Post&quot;, compose your content,
              and select a date and time from the scheduling panel. You can schedule up to
              30 days in advance.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I manage multiple accounts?</AccordionTrigger>
            <AccordionContent>
              Yes, PixelPrism supports connecting multiple social media accounts across
              Instagram, TikTok, Facebook, and YouTube. Each account can be managed
              independently or as part of a unified campaign.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What analytics are available?</AccordionTrigger>
            <AccordionContent>
              We provide real-time metrics including reach, engagement rate, follower growth,
              and content performance. Data can be viewed per-platform or aggregated across
              all connected accounts.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DS2Section>

      {/* ── Alert + Breadcrumb ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">
        <DS2Section
          id="alerts"
          label="Feedback"
          title="Alerts"
          subtitle="Informational and destructive callouts."
        >
          <div className="space-y-4">
            <Alert>
              <AlertTitle>Campaign Published</AlertTitle>
              <AlertDescription>
                Your &quot;Summer Collection Launch&quot; campaign is now live across all connected platforms.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Sync Failed</AlertTitle>
              <AlertDescription>
                Unable to connect to Instagram API. Please check your access token and try again.
              </AlertDescription>
            </Alert>
          </div>
        </DS2Section>

        <DS2Section
          id="breadcrumb"
          label="Navigation"
          title="Breadcrumb"
          subtitle="Multi-level navigation trail."
        >
          <div className="space-y-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Campaigns</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Summer Collection Launch</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Integrations</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Instagram</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Access Token</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </DS2Section>
      </div>

      {/* ── Dialog + Dropdown/Tooltip ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">
        <DS2Section
          id="dialog"
          label="Overlay"
          title="Dialog"
          subtitle="Modal confirmation pattern."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button className="sb-btn-destructive">Delete Campaign</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="sb-h3" style={{ color: "#eaeef1" }}>
                  Delete Campaign?
                </DialogTitle>
                <DialogDescription className="sb-body" style={{ color: "#6d8d9f" }}>
                  This action cannot be undone. The campaign and all associated analytics
                  data will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-3">
                <Button className="sb-btn-secondary">Cancel</Button>
                <Button className="sb-btn-destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DS2Section>

        <DS2Section
          id="dropdown-tooltip"
          label="Overlay"
          title="Dropdown & Tooltip"
          subtitle="Contextual menus and hover hints."
        >
          <div className="flex gap-4 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="sb-btn-secondary">Actions &#9662;</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Campaign</DropdownMenuLabel>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-[#e85454]">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="sb-btn-secondary">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a tooltip with spring entrance animation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="sb-data" style={{ color: "#f4b964", cursor: "help" }}>24.5K</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total reach this week</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DS2Section>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <DS2Section
        id="tabs"
        label="Navigation"
        title="Tabs"
        subtitle="Default (pill) and line variants."
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="sb-caption mb-2" style={{ color: "#6d8d9f" }}>Default variant</p>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>Campaign overview content.</p>
              </TabsContent>
              <TabsContent value="analytics">
                <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>Analytics dashboard content.</p>
              </TabsContent>
              <TabsContent value="settings">
                <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>Campaign settings content.</p>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <p className="sb-caption mb-2" style={{ color: "#6d8d9f" }}>Line variant</p>
            <Tabs defaultValue="posts">
              <TabsList variant="line">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="reels">Reels</TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>Posts feed content.</p>
              </TabsContent>
              <TabsContent value="stories">
                <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>Stories content.</p>
              </TabsContent>
              <TabsContent value="reels">
                <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>Reels content.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DS2Section>

      {/* ── Toggle Group ─────────────────────────────────────────── */}
      <DS2Section
        id="toggle-group"
        label="Selection"
        title="Toggle Group"
        subtitle="Grouped toggle buttons for view modes and filters."
      >
        <div className="flex gap-6">
          <ToggleGroup type="single" defaultValue="grid">
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            <ToggleGroupItem value="list">List</ToggleGroupItem>
            <ToggleGroupItem value="board">Board</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="multiple" defaultValue={["instagram", "tiktok"]}>
            <ToggleGroupItem value="instagram">Instagram</ToggleGroupItem>
            <ToggleGroupItem value="tiktok">TikTok</ToggleGroupItem>
            <ToggleGroupItem value="facebook">Facebook</ToggleGroupItem>
            <ToggleGroupItem value="youtube">YouTube</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </DS2Section>

      {/* ── Pagination ───────────────────────────────────────────── */}
      <DS2Section
        id="pagination"
        label="Navigation"
        title="Pagination"
        subtitle="Page navigation with active state."
      >
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </DS2Section>

      {/* ── Loading States ───────────────────────────────────────── */}
      <DS2Section
        id="loading"
        label="Feedback"
        title="Loading States"
        subtitle="Skeleton, spinner, and progress bar."
      >
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="sb-caption mb-3" style={{ color: "#6d8d9f" }}>Skeleton</p>
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div>
            <p className="sb-caption mb-3" style={{ color: "#6d8d9f" }}>Spinner</p>
            <div className="flex items-center justify-center h-24">
              <DS2Spinner />
            </div>
          </div>
          <div>
            <p className="sb-caption mb-3" style={{ color: "#6d8d9f" }}>Progress</p>
            <div className="space-y-4 pt-4">
              <Progress value={33} />
              <Progress value={66} />
              <Progress value={100} />
            </div>
          </div>
        </div>
      </DS2Section>

      {/* ── Hover Card ───────────────────────────────────────────── */}
      <DS2Section
        id="hover-card"
        label="Overlay"
        title="Hover Card"
        subtitle="Rich preview on hover."
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="sb-body" style={{ color: "#f4b964", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 }}>
              @pixelprism
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback style={{ background: "#163344", color: "#f4b964", borderRadius: 0, border: "1px solid rgba(244,185,100,0.12)" }}>PP</AvatarFallback>
              </Avatar>
              <div>
                <p className="sb-h4" style={{ color: "#eaeef1" }}>PixelPrism</p>
                <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                  Social media marketing platform for SMBs. Schedule, analyze, and grow.
                </p>
                <div className="flex gap-4 mt-2">
                  <span className="sb-data" style={{ color: "#eaeef1", fontSize: 12 }}>24.5K <span className="sb-caption" style={{ color: "#6d8d9f" }}>followers</span></span>
                  <span className="sb-data" style={{ color: "#eaeef1", fontSize: 12 }}>1.2K <span className="sb-caption" style={{ color: "#6d8d9f" }}>posts</span></span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </DS2Section>

      {/* ── Toasts ───────────────────────────────────────────────── */}
      <DS2Section
        id="toasts"
        label="Feedback"
        title="Toasts"
        subtitle="Notification toasts with colored left stripes."
      >
        <div className="flex gap-4">
          <Button
            className="sb-btn-secondary"
            onClick={() => showInfo("Campaign Saved", "Your changes have been saved as a draft.")}
          >
            Info Toast
          </Button>
          <Button
            className="sb-btn-secondary"
            onClick={() => showSuccess("Published!", "Campaign is now live on all platforms.")}
          >
            Success Toast
          </Button>
          <Button
            className="sb-btn-secondary"
            onClick={() => showError("Sync Failed", "Unable to connect to Instagram API.")}
          >
            Error Toast
          </Button>
        </div>
      </DS2Section>
    </DS2PageLayout>
  )
}
