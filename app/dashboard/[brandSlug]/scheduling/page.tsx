"use client"

import { useMemo, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  AiChat02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Facebook02Icon,
  Image02Icon,
  InstagramIcon,
  Link04Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DS2Spinner } from "@/components/ds2/spinner"
import { StudioImagePickerDialog } from "@/components/ds2/studio-image-picker-dialog"
import { showInfo, showSuccess } from "@/components/ds2/toast"

type SupportedPlatform = "instagram" | "facebook" | "linkedin" | "pinterest"

type CalendarStatus = "draft" | "scheduled" | "posted" | "failed"

interface ScheduledPost {
  id: string
  platforms: SupportedPlatform[]
  preview: string
  hashtags: string[]
  scheduledAt: string
  status: CalendarStatus
  imageGradient: string
  imageId?: string
  imageUrl?: string
}

interface StudioImageChoice {
  id: string
  imageUrl?: string
  prompt: string
  aspectRatio: string
  createdAt: number
}

const TODAY = new Date()

const PLATFORM_ICONS: Record<SupportedPlatform, typeof InstagramIcon> = {
  instagram: InstagramIcon,
  facebook: Facebook02Icon,
  linkedin: Link04Icon,
  pinterest: Link04Icon,
}

const PLATFORM_LABELS: Record<SupportedPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  pinterest: "Pinterest",
}

const ALL_PLATFORM_KEYS: SupportedPlatform[] = [
  "instagram",
  "facebook",
  "linkedin",
  "pinterest",
]

const STATUS_COLORS: Record<CalendarStatus, string> = {
  draft: "#6d8d9f",
  scheduled: "#e8956a",
  posted: "#a4f464",
  failed: "#e85454",
}

const FALLBACK_GRADIENT = "linear-gradient(135deg, #163344, #0b2230)"

function normalizeHashtags(input: string): string[] {
  const tags = input
    .split(/[\s,]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag.toLowerCase() : `#${tag.toLowerCase()}`))

  return Array.from(new Set(tags))
}

function hashtagsToInput(hashtags?: string[]) {
  return (hashtags || []).join(" ")
}

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
      <div className="flex items-center justify-between mb-1.5">
        <span className="sb-data" style={{ fontSize: 11, color: "#6d8d9f" }}>
          {time}
        </span>
        <div className="flex items-center gap-1">
          {post.platforms.map((p) => {
            const iconDef = PLATFORM_ICONS[p]
            return <HugeiconsIcon key={p} icon={iconDef} size={12} color="#6d8d9f" />
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="sb-post-thumbnail shrink-0 overflow-hidden"
          style={{
            width: 36,
            height: 36,
            background: post.imageUrl ? "#071a26" : post.imageGradient,
            border: "1px solid rgba(244,185,100,0.08)",
          }}
        >
          {post.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageUrl} alt="Post preview" className="w-full h-full object-cover" />
          ) : null}
        </div>
        <span className="sb-body-sm line-clamp-1" style={{ color: "#d4dce2" }}>
          {post.preview}
        </span>
      </div>
    </button>
  )
}

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
    <div className="grid grid-cols-7" style={{ border: "1px solid rgba(244,185,100,0.12)" }}>
      {days.map((day) => {
        const isToday = isSameDay(day, TODAY)
        const dayPosts = posts
          .filter((p) => isSameDay(new Date(p.scheduledAt), day))
          .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

        return (
          <div
            key={day.toISOString()}
            style={{
              borderRight: "1px solid rgba(244,185,100,0.06)",
              borderLeft: isToday ? "3px solid #f4b964" : undefined,
              background: isToday ? "rgba(244,185,100,0.02)" : undefined,
              minHeight: 320,
            }}
          >
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ borderBottom: "1px solid rgba(244,185,100,0.06)" }}
            >
              <span className="sb-label" style={{ color: "#6d8d9f" }}>
                {format(day, "EEE")}
              </span>
              <span className="sb-data" style={{ fontSize: 13, color: isToday ? "#f4b964" : "#eaeef1" }}>
                {format(day, "d")}
              </span>
            </div>

            <div className="p-2 space-y-2">
              {dayPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} onClick={() => onPostClick(post)} />
              ))}

              <button
                type="button"
                aria-label={`Add post on ${format(day, "EEEE, MMMM d")}`}
                onClick={() => onSlotClick(day)}
                className="sb-empty-slot w-full cursor-pointer flex items-center justify-center"
                style={{ height: dayPosts.length > 0 ? 32 : 60 }}
              >
                <HugeiconsIcon icon={Add01Icon} size={16} color="rgba(244,185,100,0.18)" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

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
      <div className="grid grid-cols-7" style={{ borderBottom: "1px solid rgba(244,185,100,0.08)" }}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="px-3 py-2 text-center">
            <span className="sb-label" style={{ color: "#6d8d9f" }}>{d}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7" style={{ border: "1px solid rgba(244,185,100,0.12)" }}>
        {days.map((day) => {
          const isToday = isSameDay(day, TODAY)
          const isCurrentMonth =
            day.getMonth() === month.getMonth() && day.getFullYear() === month.getFullYear()
          const dayPosts = posts.filter((p) => isSameDay(new Date(p.scheduledAt), day))

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDayClick(day)}
              className="text-left cursor-pointer"
              style={{
                borderRight: "1px solid rgba(244,185,100,0.06)",
                borderBottom: "1px solid rgba(244,185,100,0.06)",
                padding: "8px 10px",
                minHeight: 80,
                opacity: isCurrentMonth ? 1 : 0.4,
              }}
            >
              <span className="sb-data" style={{ fontSize: 12, color: isToday ? "#f4b964" : "#eaeef1" }}>
                {format(day, "d")}
              </span>
              {dayPosts.length > 0 ? (
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
                  <span className="sb-caption" style={{ color: "#6d8d9f", marginTop: 2, display: "block" }}>
                    {dayPosts.length} post{dayPosts.length !== 1 ? "s" : ""}
                  </span>
                </div>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PostComposerSheet({
  open,
  onOpenChange,
  caption,
  onCaptionChange,
  hashtags,
  onHashtagsChange,
  date,
  onDateChange,
  time,
  onTimeChange,
  platforms,
  onPlatformToggle,
  selectedPost,
  selectedImage,
  onChooseImage,
  studioImages,
  connectedPlatforms,
  brandSlug,
  onSchedule,
  onSaveDraft,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  caption: string
  onCaptionChange: (v: string) => void
  hashtags: string
  onHashtagsChange: (v: string) => void
  date: string
  onDateChange: (v: string) => void
  time: string
  onTimeChange: (v: string) => void
  platforms: Record<SupportedPlatform, boolean>
  onPlatformToggle: (platform: SupportedPlatform) => void
  selectedPost: ScheduledPost | null
  selectedImage: StudioImageChoice | null
  onChooseImage: (image: StudioImageChoice | null) => void
  studioImages: StudioImageChoice[]
  connectedPlatforms: SupportedPlatform[]
  brandSlug: string
  onSchedule: () => void
  onSaveDraft: () => void
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const charLimit = 2200

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setPickerOpen(false)
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="!w-[460px] !max-w-[460px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="sb-h3">{selectedPost ? "Edit Post" : "New Post"}</SheetTitle>
          <SheetDescription>
            {selectedPost ? "Update your scheduled post." : "Compose and schedule a new post."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-4 space-y-5 flex-1">
          <div>
            <Label className="mb-2 block">Image</Label>
            <div
              className="p-3"
              style={{
                border: "1px dashed rgba(244,185,100,0.2)",
                background: "rgba(244,185,100,0.02)",
              }}
            >
              {selectedImage?.imageUrl ? (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage.imageUrl}
                    alt="Selected"
                    className="w-full h-48 object-cover border border-[rgba(244,185,100,0.12)]"
                  />
                  {selectedImage.prompt && (
                    <p className="sb-body-sm truncate" style={{ color: "#8fa8b8" }}>
                      {selectedImage.prompt}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    {selectedImage.aspectRatio && (
                      <span className="sb-data" style={{ fontSize: 11, color: "#6d8d9f" }}>
                        {selectedImage.aspectRatio}
                      </span>
                    )}
                    <div className="flex gap-2 ml-auto">
                      <Button className="sb-btn-ghost !min-h-[34px] !px-3 !text-xs" onClick={() => setPickerOpen(true)}>
                        Change
                      </Button>
                      <Button className="sb-btn-secondary !min-h-[34px] !px-3 !text-xs" onClick={() => onChooseImage(null)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <HugeiconsIcon icon={Image02Icon} size={28} color="#6d8d9f" />
                  <span className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                    No image selected
                  </span>
                  <Button className="sb-btn-secondary !py-1 !px-3 !min-h-[32px] !text-xs" onClick={() => setPickerOpen(true)}>
                    Browse Studio
                  </Button>
                </div>
              )}
            </div>

            <StudioImagePickerDialog
              open={pickerOpen}
              onOpenChange={setPickerOpen}
              images={studioImages}
              selectedImageId={selectedImage?.id}
              onSelect={onChooseImage}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Caption</Label>
              <span className="sb-data" style={{ fontSize: 11, color: caption.length > charLimit ? "#e8956a" : "#6d8d9f" }}>
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

          <div>
            <Label className="mb-2 block">Hashtags (stored separately)</Label>
            <Input
              placeholder="#launch #newdrop #sale"
              value={hashtags}
              onChange={(e) => onHashtagsChange(e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-2 block">Platforms</Label>
            {connectedPlatforms.length > 0 ? (
              <div className="space-y-2">
                {connectedPlatforms.map((platform) => {
                  const iconDef = PLATFORM_ICONS[platform]
                  return (
                    <label
                      key={platform}
                      className={`sb-field-card flex items-center gap-3 !p-3 cursor-pointer ${
                        platforms[platform] ? "sb-field-card--selected" : ""
                      }`}
                    >
                      <Checkbox checked={platforms[platform]} onCheckedChange={() => onPlatformToggle(platform)} />
                      <HugeiconsIcon icon={iconDef} size={18} color="#6d8d9f" />
                      <span className="sb-body-sm" style={{ color: "#d4dce2" }}>{PLATFORM_LABELS[platform]}</span>
                    </label>
                  )
                })}
              </div>
            ) : (
              <div
                className="p-4 text-center"
                style={{
                  border: "1px dashed rgba(244, 185, 100, 0.15)",
                  background: "rgba(244, 185, 100, 0.02)",
                }}
              >
                <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
                  No platforms connected yet.
                </p>
                <a
                  href={`/dashboard/${brandSlug}/settings/social`}
                  className="sb-caption mt-1 inline-block hover:underline"
                  style={{ color: "#f4b964" }}
                >
                  Connect a platform
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-2 block">Date</Label>
              <Input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
            </div>
            <div>
              <Label className="mb-2 block">Time</Label>
              <Input type="time" value={time} onChange={(e) => onTimeChange(e.target.value)} />
            </div>
          </div>

          <div
            className="flex items-start gap-3 p-4"
            style={{
              background: "rgba(244,185,100,0.04)",
              border: "1px solid rgba(244,185,100,0.08)",
            }}
          >
            <HugeiconsIcon icon={AiChat02Icon} size={20} color="#f4b964" className="shrink-0 mt-0.5" />
            <div>
              <span className="sb-label" style={{ color: "#f4b964" }}>AI Suggestion</span>
              <p className="sb-body-sm mt-1" style={{ color: "#6d8d9f" }}>
                Caption and hashtags are manual for now. AI assist can be layered in later.
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

export default function SchedulingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const brandSlug = params.brandSlug as string
  const queryImageId = searchParams.get("imageId")
  const queryImageUrl = searchParams.get("imageUrl")

  const queryImageSelection: StudioImageChoice | null =
    queryImageId || queryImageUrl
      ? {
          id: queryImageId || queryImageUrl || "query-image",
          imageUrl: queryImageUrl || undefined,
          prompt: "",
          aspectRatio: "1:1",
          createdAt: 0,
        }
      : null

  const brand = useQuery(api.brands.getBySlug, { slug: brandSlug })
  const connectedAccounts = useQuery(
    api.socialAccounts.listConnectedByBrand,
    brand ? { brandId: brand._id } : "skip"
  )
  const scheduledPosts = useQuery(
    api.scheduledPosts.listByBrand,
    brand ? { brandId: brand._id } : "skip"
  )
  const studioImagesRaw = useQuery(
    api.images.listByBrand,
    brand ? { brandId: brand._id, status: "ready", limit: 60 } : "skip"
  )

  const createScheduledPost = useMutation(api.scheduledPosts.create)
  const saveDraftPost = useMutation(api.scheduledPosts.saveDraft)
  const updateScheduledPost = useMutation(api.scheduledPosts.update)

  const [viewMode, setViewMode] = useState<"week" | "month">("week")
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(TODAY, { weekStartsOn: 1 }))
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(TODAY))
  const [composerOpen, setComposerOpen] = useState(Boolean(queryImageSelection))

  const [composerCaption, setComposerCaption] = useState("")
  const [composerHashtags, setComposerHashtags] = useState("")
  const [composerDate, setComposerDate] = useState(
    queryImageSelection ? format(TODAY, "yyyy-MM-dd") : ""
  )
  const [composerTime, setComposerTime] = useState(queryImageSelection ? "09:00" : "")
  const [composerPlatforms, setComposerPlatforms] = useState<Record<SupportedPlatform, boolean>>({
    instagram: false,
    facebook: false,
    linkedin: false,
    pinterest: false,
  })
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)
  const [selectedImage, setSelectedImage] = useState<StudioImageChoice | null>(
    queryImageSelection
  )
  const [navDirection, setNavDirection] = useState<"forward" | "back">("forward")
  const [navKey, setNavKey] = useState(0)

  const studioImages: StudioImageChoice[] = useMemo(
    () =>
      (studioImagesRaw || []).map((img) => ({
        id: String(img._id),
        imageUrl: img.imageUrl,
        prompt: img.prompt ?? "",
        aspectRatio: img.aspectRatio ?? "1:1",
        createdAt: img.createdAt,
      })),
    [studioImagesRaw]
  )

  const connectedPlatformKeys = useMemo(() => {
    const set = new Set<SupportedPlatform>()
    for (const account of connectedAccounts ?? []) {
      set.add(account.platform as SupportedPlatform)
    }
    return Array.from(set)
  }, [connectedAccounts])

  const calendarPosts: ScheduledPost[] = useMemo(() => {
    if (!scheduledPosts) return []

    return scheduledPosts.map((post) => ({
      id: String(post._id),
      platforms: post.selectedPlatforms as SupportedPlatform[],
      preview: post.caption,
      hashtags: post.hashtags || [],
      scheduledAt: new Date(post.scheduledFor || post.createdAt).toISOString(),
      status:
        post.status === "draft"
          ? "draft"
          : post.status === "published"
            ? "posted"
            : post.status === "failed"
              ? "failed"
              : "scheduled",
      imageGradient: FALLBACK_GRADIENT,
      imageId: post.imageId ? String(post.imageId) : undefined,
      imageUrl: post.imageUrl,
    }))
  }, [scheduledPosts])

  if (brand === undefined || connectedAccounts === undefined || scheduledPosts === undefined || studioImagesRaw === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <DS2Spinner />
      </div>
    )
  }

  if (!brand) {
    return (
      <div>
        <h1 className="sb-h1" style={{ color: "#eaeef1" }}>Brand not found</h1>
      </div>
    )
  }

  const navigateBack = () => {
    setNavDirection("back")
    setNavKey((k) => k + 1)
    if (viewMode === "week") setCurrentWeekStart((prev) => subWeeks(prev, 1))
    else setCurrentMonth((prev) => subMonths(prev, 1))
  }

  const navigateForward = () => {
    setNavDirection("forward")
    setNavKey((k) => k + 1)
    if (viewMode === "week") setCurrentWeekStart((prev) => addWeeks(prev, 1))
    else setCurrentMonth((prev) => addMonths(prev, 1))
  }

  const goToday = () => {
    setNavDirection("forward")
    setNavKey((k) => k + 1)
    setCurrentWeekStart(startOfWeek(TODAY, { weekStartsOn: 1 }))
    setCurrentMonth(startOfMonth(TODAY))
  }

  const dateLabel =
    viewMode === "week"
      ? `${format(currentWeekStart, "MMM d")} - ${format(
          endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
          "d, yyyy"
        )}`
      : format(currentMonth, "MMMM yyyy")

  const openNewPost = () => {
    setSelectedPost(null)
    setComposerCaption("")
    setComposerHashtags("")
    setComposerDate("")
    setComposerTime("")
    setComposerPlatforms({ instagram: false, facebook: false, linkedin: false, pinterest: false })
    setSelectedImage(queryImageSelection)
    setComposerOpen(true)
  }

  const openComposerForDate = (date: Date) => {
    setSelectedPost(null)
    setComposerCaption("")
    setComposerHashtags("")
    setComposerDate(format(date, "yyyy-MM-dd"))
    setComposerTime("09:00")
    setComposerPlatforms({ instagram: false, facebook: false, linkedin: false, pinterest: false })
    setSelectedImage(queryImageSelection)
    setComposerOpen(true)
  }

  const openComposerForPost = (post: ScheduledPost) => {
    setSelectedPost(post)
    setComposerCaption(post.preview)
    setComposerHashtags(hashtagsToInput(post.hashtags))
    const d = new Date(post.scheduledAt)
    setComposerDate(format(d, "yyyy-MM-dd"))
    setComposerTime(format(d, "HH:mm"))

    const plats: Record<SupportedPlatform, boolean> = {
      instagram: false,
      facebook: false,
      linkedin: false,
      pinterest: false,
    }
    post.platforms.forEach((p) => {
      plats[p] = true
    })
    setComposerPlatforms(plats)

    const linkedStudioImage = post.imageId
      ? studioImages.find((img) => img.id === post.imageId)
      : undefined

    setSelectedImage(
      linkedStudioImage ||
        (post.imageUrl
          ? {
              id: post.imageId || `post-${post.id}`,
              imageUrl: post.imageUrl,
              prompt: "",
              aspectRatio: "1:1",
              createdAt: Date.now(),
            }
          : null)
    )
    setComposerOpen(true)
  }

  const togglePlatform = (platform: SupportedPlatform) => {
    setComposerPlatforms((prev) => ({ ...prev, [platform]: !prev[platform] }))
  }

  const getSelectedPlatforms = () =>
    Object.entries(composerPlatforms)
      .filter(([, enabled]) => enabled)
      .map(([platform]) => platform as SupportedPlatform)

  const buildAccountIdsForPlatforms = (platforms: SupportedPlatform[]) =>
    (connectedAccounts ?? [])
      .filter((acc) => platforms.includes(acc.platform as SupportedPlatform))
      .map((acc) => acc._id)

  const handleSchedule = async () => {
    const selectedPlatforms = getSelectedPlatforms()
    if (selectedPlatforms.length === 0) {
      showInfo("No platforms selected", "Choose at least one platform")
      return
    }

    if (!composerDate || !composerTime) {
      showInfo("Schedule required", "Pick a date and time before scheduling")
      return
    }

    const selectedAccountIds = buildAccountIdsForPlatforms(selectedPlatforms)
    if (selectedAccountIds.length === 0) {
      showInfo("No connected accounts", "Connect accounts for selected platforms first")
      return
    }

    const scheduledFor = new Date(`${composerDate}T${composerTime}:00`).getTime()
    const hashtags = normalizeHashtags(composerHashtags)
    const selectedImageId =
      selectedImage && studioImages.some((img) => img.id === selectedImage.id)
        ? (selectedImage.id as Id<"generatedImages">)
        : undefined

    try {
      if (selectedPost) {
        await updateScheduledPost({
          scheduledPostId: selectedPost.id as Id<"scheduledPosts">,
          caption: composerCaption,
          hashtags,
          imageId: selectedImageId,
          imageUrl: selectedImage?.imageUrl,
          socialAccountIds: selectedAccountIds,
          selectedPlatforms,
          timezone: brand.timezone,
          scheduledFor,
          asDraft: false,
        })
        showSuccess("Post updated", "Your post has been updated and rescheduled")
      } else {
        await createScheduledPost({
          brandId: brand._id,
          caption: composerCaption,
          hashtags,
          imageId: selectedImageId,
          imageUrl: selectedImage?.imageUrl,
          socialAccountIds: selectedAccountIds,
          selectedPlatforms,
          timezone: brand.timezone,
          scheduledFor,
        })
        showSuccess("Post scheduled", "Your post has been added to the calendar")
      }

      setComposerOpen(false)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to schedule post"
      showInfo("Schedule failed", message)
    }
  }

  const handleSaveDraft = async () => {
    const selectedPlatforms = getSelectedPlatforms()
    const selectedAccountIds = buildAccountIdsForPlatforms(selectedPlatforms)
    const hashtags = normalizeHashtags(composerHashtags)
    const selectedImageId =
      selectedImage && studioImages.some((img) => img.id === selectedImage.id)
        ? (selectedImage.id as Id<"generatedImages">)
        : undefined

    try {
      if (selectedPost) {
        await updateScheduledPost({
          scheduledPostId: selectedPost.id as Id<"scheduledPosts">,
          caption: composerCaption || "Untitled draft",
          hashtags,
          imageId: selectedImageId,
          imageUrl: selectedImage?.imageUrl,
          socialAccountIds: selectedAccountIds,
          selectedPlatforms,
          timezone: brand.timezone,
          scheduledFor:
            composerDate && composerTime
              ? new Date(`${composerDate}T${composerTime}:00`).getTime()
              : undefined,
          asDraft: true,
        })
      } else {
        await saveDraftPost({
          brandId: brand._id,
          caption: composerCaption || "Untitled draft",
          hashtags,
          imageId: selectedImageId,
          imageUrl: selectedImage?.imageUrl,
          socialAccountIds: selectedAccountIds,
          selectedPlatforms,
          timezone: brand.timezone,
        })
      }

      setComposerOpen(false)
      showInfo("Draft saved", "Your draft has been saved for later")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to save draft"
      showInfo("Save failed", message)
    }
  }

  const handleMonthDayClick = (day: Date) => {
    setNavDirection("forward")
    setNavKey((k) => k + 1)
    setCurrentWeekStart(startOfWeek(day, { weekStartsOn: 1 }))
    setViewMode("week")
  }

  return (
    <div className="space-y-32">
      <div className="flex items-start justify-between">
        <div>
          <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Content Calendar</p>
          <h1 className="sb-h1" style={{ color: "#eaeef1" }}>Scheduling</h1>
          <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
            Plan and schedule content across your platforms.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {(connectedPlatformKeys.length ? connectedPlatformKeys : ALL_PLATFORM_KEYS).map((platform) => {
              const iconDef = PLATFORM_ICONS[platform]
              return (
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
              )
            })}
          </div>
          <Button className="sb-btn-primary" onClick={openNewPost}>
            <HugeiconsIcon icon={Add01Icon} size={16} className="mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between pb-5" style={{ borderBottom: "1px solid rgba(244,185,100,0.08)" }}>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(val) => val && setViewMode(val as "week" | "month")}
        >
          <ToggleGroupItem value="week" style={{ padding: "8px 16px" }}>Week</ToggleGroupItem>
          <ToggleGroupItem value="month" style={{ padding: "8px 16px" }}>Month</ToggleGroupItem>
        </ToggleGroup>

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

          <span className="sb-data" style={{ color: "#eaeef1", minWidth: 220, textAlign: "center" }}>
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

        <Button className="sb-btn-secondary !py-2 !px-4 !min-h-[36px] !text-xs" onClick={goToday}>
          Today
        </Button>
      </div>

      <div
        key={`${viewMode}-${navKey}`}
        style={{
          animation: `${navDirection === "forward" ? "sb-step-in" : "sb-step-back"} 250ms cubic-bezier(0.34, 1.56, 0.64, 1) both`,
        }}
      >
        {viewMode === "week" ? (
          <WeeklyCalendar
            weekStart={currentWeekStart}
            posts={calendarPosts}
            onSlotClick={openComposerForDate}
            onPostClick={openComposerForPost}
          />
        ) : (
          <MonthlyCalendar month={currentMonth} posts={calendarPosts} onDayClick={handleMonthDayClick} />
        )}
      </div>

      <PostComposerSheet
        open={composerOpen}
        onOpenChange={setComposerOpen}
        caption={composerCaption}
        onCaptionChange={setComposerCaption}
        hashtags={composerHashtags}
        onHashtagsChange={setComposerHashtags}
        date={composerDate}
        onDateChange={setComposerDate}
        time={composerTime}
        onTimeChange={setComposerTime}
        platforms={composerPlatforms}
        onPlatformToggle={togglePlatform}
        selectedPost={selectedPost}
        selectedImage={selectedImage}
        onChooseImage={setSelectedImage}
        studioImages={studioImages.filter((img) => !!img.imageUrl)}
        connectedPlatforms={connectedPlatformKeys}
        brandSlug={params.brandSlug as string}
        onSchedule={handleSchedule}
        onSaveDraft={handleSaveDraft}
      />
    </div>
  )
}
