"use client"

import { useState, useMemo } from "react"
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InstagramIcon,
  TiktokIcon,
  Facebook02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Add01Icon,
  Image02Icon,
  AiChat02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { showSuccess, showInfo } from "@/components/ds2/toast"

// ── Types ─────────────────────────────────────────────────────────────────

interface ScheduledPost {
  id: string
  platforms: ("instagram" | "tiktok" | "facebook")[]
  preview: string
  scheduledAt: string // ISO 8601
  status: "scheduled" | "posted" | "failed"
  imageGradient: string
}

// ── Constants ─────────────────────────────────────────────────────────────

const TODAY = new Date(2026, 1, 16) // Feb 16, 2026 (Monday start week)

const PLATFORM_ICONS: Record<string, typeof InstagramIcon> = {
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  facebook: Facebook02Icon,
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
}

const CONNECTED_ACCOUNTS = ["instagram", "tiktok", "facebook"] as const

const STATUS_COLORS: Record<string, string> = {
  scheduled: "#e8956a",
  posted: "#a4f464",
  failed: "#e85454",
}

// ── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_POSTS: ScheduledPost[] = [
  {
    id: "p1",
    platforms: ["instagram"],
    preview: "New seasonal blend just dropped! Our Guatemala single-origin is perfect for...",
    scheduledAt: "2026-02-10T09:00:00",
    status: "posted",
    imageGradient: "linear-gradient(135deg, #163344, #0b2230)",
  },
  {
    id: "p2",
    platforms: ["tiktok", "instagram"],
    preview: "Behind the scenes at our roastery — watch the magic happen from green bean to...",
    scheduledAt: "2026-02-11T14:30:00",
    status: "posted",
    imageGradient: "linear-gradient(135deg, #1a3a4f, #0e2838)",
  },
  {
    id: "p3",
    platforms: ["instagram"],
    preview: "Rise and grind! Our morning pour-over ritual in 60 seconds. Save this for later...",
    scheduledAt: "2026-02-12T07:00:00",
    status: "posted",
    imageGradient: "linear-gradient(135deg, #0e2838, #163344)",
  },
  {
    id: "p4",
    platforms: ["facebook"],
    preview: "Community spotlight: Meet Sarah, our barista of the month who creates incredible...",
    scheduledAt: "2026-02-13T11:00:00",
    status: "posted",
    imageGradient: "linear-gradient(135deg, #163344, #1a3a4f)",
  },
  {
    id: "p5",
    platforms: ["instagram", "facebook"],
    preview: "Flash sale alert! 20% off all whole bean bags this weekend. Use code SUNRISE20...",
    scheduledAt: "2026-02-14T10:00:00",
    status: "failed",
    imageGradient: "linear-gradient(135deg, #1a3a4f, #0b2230)",
  },
  {
    id: "p6",
    platforms: ["tiktok"],
    preview: "3 latte art designs anyone can learn at home. Which one is your favorite? Comment...",
    scheduledAt: "2026-02-14T16:00:00",
    status: "posted",
    imageGradient: "linear-gradient(135deg, #0b2230, #163344)",
  },
  {
    id: "p7",
    platforms: ["instagram"],
    preview: "Weekend vibes at the cafe. Nothing beats a cold brew on a Saturday morning...",
    scheduledAt: "2026-02-15T08:30:00",
    status: "scheduled",
    imageGradient: "linear-gradient(135deg, #163344, #0e2838)",
  },
  {
    id: "p8",
    platforms: ["instagram", "tiktok", "facebook"],
    preview: "Big announcement coming tomorrow! Stay tuned for something special from Sunrise...",
    scheduledAt: "2026-02-16T10:00:00",
    status: "scheduled",
    imageGradient: "linear-gradient(135deg, #0e2838, #1a3a4f)",
  },
]

// ── PostCard ──────────────────────────────────────────────────────────────

function PostCard({
  post,
  index,
  onClick,
}: {
  post: ScheduledPost
  index: number
  onClick: () => void
}) {
  const time = format(new Date(post.scheduledAt), "h:mm a")
  const statusColor = STATUS_COLORS[post.status]

  return (
    <button
      type="button"
      onClick={onClick}
      className="sb-post-card group w-full text-left cursor-pointer"
      style={{
        background: "#0e2838",
        border: "1px solid rgba(244,185,100,0.12)",
        borderLeft: `3px solid ${statusColor}`,
        padding: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
        animation: "sb-card-enter 400ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Row 1: time + platform icons */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="sb-data" style={{ fontSize: 11, color: "#6d8d9f" }}>
          {time}
        </span>
        <div className="flex items-center gap-1">
          {post.platforms.map((p) => {
            const iconDef = PLATFORM_ICONS[p]
            return iconDef ? (
              <HugeiconsIcon key={p} icon={iconDef} size={12} color="#6d8d9f" />
            ) : null
          })}
        </div>
      </div>
      {/* Row 2: thumbnail + preview */}
      <div className="flex items-center gap-2">
        <div
          className="sb-post-thumbnail shrink-0"
          style={{
            width: 36,
            height: 36,
            background: post.imageGradient,
            border: "1px solid rgba(244,185,100,0.08)",
            transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        <span
          className="sb-body-sm line-clamp-1"
          style={{ color: "#d4dce2" }}
        >
          {post.preview}
        </span>
      </div>
    </button>
  )
}

// ── WeeklyCalendar ────────────────────────────────────────────────────────

function WeeklyCalendar({
  weekStart,
  posts,
  onSlotClick,
  onPostClick,
}: {
  weekStart: Date
  posts: ScheduledPost[]
  onSlotClick: (date: Date) => void
  onPostClick: (post: ScheduledPost) => void
}) {
  const days = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 }),
  })

  return (
    <div
      className="grid grid-cols-7"
      style={{ border: "1px solid rgba(244,185,100,0.12)" }}
    >
      {days.map((day) => {
        const isToday = isSameDay(day, TODAY)
        const dayPosts = posts
          .filter((p) => isSameDay(new Date(p.scheduledAt), day))
          .sort(
            (a, b) =>
              new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
          )

        return (
          <div
            key={day.toISOString()}
            className="sb-calendar-day"
            style={{
              borderRight: "1px solid rgba(244,185,100,0.06)",
              borderLeft: isToday ? "3px solid #f4b964" : undefined,
              background: isToday ? "rgba(244,185,100,0.02)" : undefined,
              minHeight: 320,
            }}
          >
            {/* Day header */}
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{
                borderBottom: "1px solid rgba(244,185,100,0.06)",
              }}
            >
              <span className="sb-label" style={{ color: "#6d8d9f" }}>
                {format(day, "EEE")}
              </span>
              <span
                className="sb-data"
                style={{
                  fontSize: 13,
                  color: isToday ? "#f4b964" : "#eaeef1",
                }}
              >
                {format(day, "d")}
              </span>
            </div>

            {/* Posts */}
            <div className="p-2 space-y-2">
              {dayPosts.length > 0 ? (
                <>
                  {dayPosts.map((post, i) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={i}
                      onClick={() => onPostClick(post)}
                    />
                  ))}
                  <button
                    type="button"
                    aria-label={`Add post on ${format(day, "EEEE, MMMM d")}`}
                    onClick={() => onSlotClick(day)}
                    className="sb-empty-slot w-full cursor-pointer flex items-center justify-center"
                    style={{ height: 32 }}
                  >
                    <HugeiconsIcon icon={Add01Icon} size={14} color="rgba(244,185,100,0.20)" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  aria-label={`Add post on ${format(day, "EEEE, MMMM d")}`}
                  onClick={() => onSlotClick(day)}
                  className="sb-empty-slot w-full cursor-pointer flex items-center justify-center"
                  style={{ height: 60 }}
                >
                  <HugeiconsIcon icon={Add01Icon} size={16} color="rgba(244,185,100,0.14)" />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── MonthlyCalendar ───────────────────────────────────────────────────────

function MonthlyCalendar({
  month,
  posts,
  onDayClick,
}: {
  month: Date
  posts: ScheduledPost[]
  onDayClick: (day: Date) => void
}) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  return (
    <div>
      {/* Weekday headers */}
      <div
        className="grid grid-cols-7"
        style={{ borderBottom: "1px solid rgba(244,185,100,0.08)" }}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="px-3 py-2 text-center">
            <span className="sb-label" style={{ color: "#6d8d9f" }}>
              {d}
            </span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div
        className="grid grid-cols-7"
        style={{ border: "1px solid rgba(244,185,100,0.12)" }}
      >
        {days.map((day) => {
          const isToday = isSameDay(day, TODAY)
          const isCurrentMonth =
            day.getMonth() === month.getMonth() &&
            day.getFullYear() === month.getFullYear()
          const dayPosts = posts.filter((p) =>
            isSameDay(new Date(p.scheduledAt), day)
          )

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDayClick(day)}
              aria-label={`${format(day, "EEEE, MMMM d")} — ${dayPosts.length} post${dayPosts.length !== 1 ? "s" : ""}`}
              className={`sb-month-cell text-left cursor-pointer ${isToday ? "sb-month-cell--today" : ""}`}
              style={{
                borderRight: "1px solid rgba(244,185,100,0.06)",
                borderBottom: "1px solid rgba(244,185,100,0.06)",
                padding: "8px 10px",
                minHeight: 80,
                opacity: isCurrentMonth ? 1 : 0.4,
              }}
            >
              <span
                className="sb-data"
                style={{
                  fontSize: 12,
                  color: isToday ? "#f4b964" : "#eaeef1",
                }}
              >
                {format(day, "d")}
              </span>
              {dayPosts.length > 0 && (
                <div className="mt-1.5">
                  <div className="flex items-center gap-1">
                    {dayPosts.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        style={{
                          width: 8,
                          height: 8,
                          background: p.imageGradient,
                          border: "1px solid rgba(244,185,100,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="sb-caption"
                    style={{ color: "#6d8d9f", marginTop: 2, display: "block" }}
                  >
                    {dayPosts.length} post{dayPosts.length !== 1 ? "s" : ""}
                    {dayPosts.length > 3 && ` (+${dayPosts.length - 3} more)`}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── PostComposerSheet ─────────────────────────────────────────────────────

function PostComposerSheet({
  open,
  onOpenChange,
  caption,
  onCaptionChange,
  date,
  onDateChange,
  time,
  onTimeChange,
  platforms,
  onPlatformToggle,
  selectedPost,
  onSchedule,
  onSaveDraft,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  caption: string
  onCaptionChange: (v: string) => void
  date: string
  onDateChange: (v: string) => void
  time: string
  onTimeChange: (v: string) => void
  platforms: Record<string, boolean>
  onPlatformToggle: (platform: string) => void
  selectedPost: ScheduledPost | null
  onSchedule: () => void
  onSaveDraft: () => void
}) {
  const charLimit = 2200
  const overLimit = caption.length > charLimit

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!w-[420px] !max-w-[420px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="sb-h3">
            {selectedPost ? "Edit Post" : "New Post"}
          </SheetTitle>
          <SheetDescription>
            {selectedPost
              ? "Update your scheduled post."
              : "Compose and schedule a new post."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-4 space-y-5 flex-1">
          {/* Image drop zone */}
          <div>
            <Label className="mb-2 block">Image</Label>
            <div
              className="flex flex-col items-center justify-center gap-2 py-8"
              style={{
                border: "2px dashed rgba(244,185,100,0.12)",
                background: "rgba(244,185,100,0.02)",
              }}
            >
              <HugeiconsIcon icon={Image02Icon} size={28} color="#6d8d9f" />
              <span className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                Drag an image here
              </span>
              <Button className="sb-btn-ghost !py-1 !px-3 !min-h-[32px] !text-xs">
                Choose from Studio
              </Button>
            </div>
          </div>

          {/* Caption */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Caption</Label>
              <span
                className="sb-data"
                style={{ fontSize: 11, color: overLimit ? "#e8956a" : "#6d8d9f" }}
              >
                {caption.length}/{charLimit.toLocaleString()}
              </span>
            </div>
            <Textarea
              rows={4}
              placeholder="Write your caption..."
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
            />
          </div>

          {/* Platform selector */}
          <div>
            <Label className="mb-2 block">Platforms</Label>
            <div className="space-y-2">
              {CONNECTED_ACCOUNTS.map((platform) => {
                const iconDef = PLATFORM_ICONS[platform]
                return (
                  <label
                    key={platform}
                    className={`sb-field-card flex items-center gap-3 !p-3 cursor-pointer ${
                      platforms[platform] ? "sb-field-card--selected" : ""
                    }`}
                  >
                    <Checkbox
                      checked={platforms[platform] || false}
                      onCheckedChange={() => onPlatformToggle(platform)}
                    />
                    {iconDef && (
                      <HugeiconsIcon icon={iconDef} size={18} color="#6d8d9f" />
                    )}
                    <span className="sb-body-sm" style={{ color: "#d4dce2" }}>
                      {PLATFORM_LABELS[platform]}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-2 block">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-2 block">Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => onTimeChange(e.target.value)}
              />
            </div>
          </div>

          {/* Logos suggestion placeholder */}
          <div
            className="flex items-start gap-3 p-4"
            style={{
              background: "rgba(244,185,100,0.04)",
              border: "1px solid rgba(244,185,100,0.08)",
            }}
          >
            <HugeiconsIcon
              icon={AiChat02Icon}
              size={20}
              color="#f4b964"
              className="shrink-0 mt-0.5"
            />
            <div>
              <span className="sb-label" style={{ color: "#f4b964" }}>
                Logos Suggestion
              </span>
              <p
                className="sb-body-sm mt-1"
                style={{ color: "#6d8d9f" }}
              >
                Start typing your caption (10+ characters) and Logos will suggest
                on-brand rewrites after a short pause.
              </p>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row gap-3">
          <Button className="sb-btn-secondary flex-1" onClick={onSaveDraft}>
            Save Draft
          </Button>
          <Button className="sb-btn-primary flex-1" onClick={onSchedule}>
            Schedule
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function SchedulingPage() {
  const [viewMode, setViewMode] = useState<"week" | "month">("week")
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(TODAY, { weekStartsOn: 1 })
  )
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1))
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerCaption, setComposerCaption] = useState("")
  const [composerDate, setComposerDate] = useState("")
  const [composerTime, setComposerTime] = useState("")
  const [composerPlatforms, setComposerPlatforms] = useState<
    Record<string, boolean>
  >({ instagram: false, tiktok: false, facebook: false })
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)
  const [navDirection, setNavDirection] = useState<"forward" | "back">("forward")
  const [navKey, setNavKey] = useState(0)

  // Navigation
  const navigateBack = () => {
    setNavDirection("back")
    setNavKey((k) => k + 1)
    if (viewMode === "week") {
      setCurrentWeekStart((prev) => subWeeks(prev, 1))
    } else {
      setCurrentMonth((prev) => subMonths(prev, 1))
    }
  }

  const navigateForward = () => {
    setNavDirection("forward")
    setNavKey((k) => k + 1)
    if (viewMode === "week") {
      setCurrentWeekStart((prev) => addWeeks(prev, 1))
    } else {
      setCurrentMonth((prev) => addMonths(prev, 1))
    }
  }

  const goToday = () => {
    setNavDirection("forward")
    setNavKey((k) => k + 1)
    setCurrentWeekStart(startOfWeek(TODAY, { weekStartsOn: 1 }))
    setCurrentMonth(startOfMonth(TODAY))
  }

  // Date range label
  const dateLabel = useMemo(() => {
    if (viewMode === "week") {
      const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
      return `${format(currentWeekStart, "MMM d")} \u2013 ${format(end, "d, yyyy")}`
    }
    return format(currentMonth, "MMMM yyyy")
  }, [viewMode, currentWeekStart, currentMonth])

  // Open composer helpers
  const openNewPost = () => {
    setSelectedPost(null)
    setComposerCaption("")
    setComposerDate("")
    setComposerTime("")
    setComposerPlatforms({ instagram: false, tiktok: false, facebook: false })
    setComposerOpen(true)
  }

  const openComposerForDate = (date: Date) => {
    setSelectedPost(null)
    setComposerCaption("")
    setComposerDate(format(date, "yyyy-MM-dd"))
    setComposerTime("09:00")
    setComposerPlatforms({ instagram: false, tiktok: false, facebook: false })
    setComposerOpen(true)
  }

  const openComposerForPost = (post: ScheduledPost) => {
    setSelectedPost(post)
    setComposerCaption(post.preview)
    const d = new Date(post.scheduledAt)
    setComposerDate(format(d, "yyyy-MM-dd"))
    setComposerTime(format(d, "HH:mm"))
    const plats: Record<string, boolean> = {
      instagram: false,
      tiktok: false,
      facebook: false,
    }
    post.platforms.forEach((p) => {
      plats[p] = true
    })
    setComposerPlatforms(plats)
    setComposerOpen(true)
  }

  const togglePlatform = (platform: string) => {
    setComposerPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }))
  }

  const handleSchedule = () => {
    setComposerOpen(false)
    showSuccess("Post scheduled", "Your post has been added to the calendar.")
  }

  const handleSaveDraft = () => {
    setComposerOpen(false)
    showInfo("Draft saved", "Your draft has been saved for later.")
  }

  // Month day click -> switch to weekly view
  const handleMonthDayClick = (day: Date) => {
    setNavDirection("forward")
    setNavKey((k) => k + 1)
    setCurrentWeekStart(startOfWeek(day, { weekStartsOn: 1 }))
    setViewMode("week")
  }

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Content Calendar</p>
          <h1 className="sb-h1" style={{ color: "#eaeef1" }}>
            Scheduling
          </h1>
          <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
            Plan and schedule content across your platforms.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Connected accounts */}
          <div className="flex items-center gap-2">
            {CONNECTED_ACCOUNTS.map((platform) => {
              const iconDef = PLATFORM_ICONS[platform]
              return iconDef ? (
                <Tooltip key={platform}>
                  <TooltipTrigger asChild>
                    <span
                      className="sb-spring flex items-center justify-center"
                      style={{
                        width: 32,
                        height: 32,
                        border: "1px solid rgba(244,185,100,0.12)",
                        background: "rgba(244,185,100,0.04)",
                        cursor: "help",
                      }}
                    >
                      <HugeiconsIcon icon={iconDef} size={16} color="#6d8d9f" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{PLATFORM_LABELS[platform]} connected</p>
                  </TooltipContent>
                </Tooltip>
              ) : null
            })}
          </div>
          <Button className="sb-btn-primary" onClick={openNewPost}>
            <HugeiconsIcon icon={Add01Icon} size={16} className="mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* ── Controls bar ──────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between pb-5"
        style={{ borderBottom: "1px solid rgba(244,185,100,0.08)" }}
      >
        {/* Left: view toggle */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(val) => val && setViewMode(val as "week" | "month")}
        >
          <ToggleGroupItem value="week" style={{ padding: "8px 16px" }}>
            Week
          </ToggleGroupItem>
          <ToggleGroupItem value="month" style={{ padding: "8px 16px" }}>
            Month
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Center: navigation */}
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={viewMode === "week" ? "Previous week" : "Previous month"}
                className="sb-btn-ghost !p-2 !min-h-[36px]"
                onClick={navigateBack}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{viewMode === "week" ? "Previous week" : "Previous month"}</p>
            </TooltipContent>
          </Tooltip>
          <span
            className="sb-data"
            style={{ color: "#eaeef1", minWidth: 220, textAlign: "center" }}
          >
            {dateLabel}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={viewMode === "week" ? "Next week" : "Next month"}
                className="sb-btn-ghost !p-2 !min-h-[36px]"
                onClick={navigateForward}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{viewMode === "week" ? "Next week" : "Next month"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right: today button */}
        <Button className="sb-btn-secondary !py-2 !px-4 !min-h-[36px] !text-xs" onClick={goToday}>
          Today
        </Button>
      </div>

      {/* ── Calendar ──────────────────────────────────────────────── */}
      <div
        key={`${viewMode}-${navKey}`}
        style={{
          animation: `${navDirection === "forward" ? "sb-step-in" : "sb-step-back"} 250ms cubic-bezier(0.34, 1.56, 0.64, 1) both`,
        }}
      >
        {viewMode === "week" ? (
          <WeeklyCalendar
            weekStart={currentWeekStart}
            posts={MOCK_POSTS}
            onSlotClick={openComposerForDate}
            onPostClick={openComposerForPost}
          />
        ) : (
          <MonthlyCalendar
            month={currentMonth}
            posts={MOCK_POSTS}
            onDayClick={handleMonthDayClick}
          />
        )}
      </div>

      {/* ── Composer Sheet ────────────────────────────────────────── */}
      <PostComposerSheet
        open={composerOpen}
        onOpenChange={setComposerOpen}
        caption={composerCaption}
        onCaptionChange={setComposerCaption}
        date={composerDate}
        onDateChange={setComposerDate}
        time={composerTime}
        onTimeChange={setComposerTime}
        platforms={composerPlatforms}
        onPlatformToggle={togglePlatform}
        selectedPost={selectedPost}
        onSchedule={handleSchedule}
        onSaveDraft={handleSaveDraft}
      />
    </div>
  )
}
