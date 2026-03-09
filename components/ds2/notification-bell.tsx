"use client"

import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Notification03Icon,
  ZapIcon,
  Tick02Icon,
  Alert02Icon,
  SentIcon,
} from "@hugeicons/core-free-icons"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

const ICON_MAP: Record<string, any> = {
  post: SentIcon,
  zap: ZapIcon,
  alert: Alert02Icon,
  heart: Tick02Icon,
}

function timeAgo(ms: number): string {
  const seconds = Math.floor((Date.now() - ms) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NotificationBell() {
  const router = useRouter()
  const unreadCount = useQuery(api.notifications.unreadCount)
  const notifications = useQuery(api.notifications.listRecent, { limit: 20 })
  const markRead = useMutation(api.notifications.markRead)
  const markAllRead = useMutation(api.notifications.markAllRead)

  const hasUnread = (unreadCount ?? 0) > 0

  function handleClick(notif: {
    _id: Id<"notifications">
    href?: string
    read: boolean
  }) {
    if (!notif.read) {
      markRead({ notificationId: notif._id })
    }
    if (notif.href) {
      router.push(notif.href)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 transition-all duration-200 text-[#6d8d9f] hover:text-[#eaeef1] hover:-translate-y-0.5 active:translate-y-px cursor-pointer"
          style={{
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <HugeiconsIcon
            icon={Notification03Icon}
            strokeWidth={2}
            className="size-5"
          />
          {hasUnread && (
            <div
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 sb-pulse-dot"
              style={{ background: "#f4b964" }}
            />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0"
        style={{
          background: "#071a26",
          border: "1px solid rgba(244, 185, 100, 0.12)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "rgba(244, 185, 100, 0.08)" }}
        >
          <span className="sb-label" style={{ color: "#eaeef1" }}>
            Notifications
          </span>
          {hasUnread && (
            <button
              onClick={() => markAllRead()}
              className="sb-caption hover:underline cursor-pointer"
              style={{ color: "#f4b964" }}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="max-h-80">
          {!notifications || notifications.length === 0 ? (
            <div
              className="px-4 py-8 text-center sb-caption"
              style={{ color: "#6d8d9f" }}
            >
              No notifications yet
            </div>
          ) : (
            notifications.map((notif) => {
              const IconComponent = ICON_MAP[notif.icon ?? ""] ?? Notification03Icon
              return (
                <button
                  key={notif._id}
                  type="button"
                  className="w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[rgba(244,185,100,0.04)] cursor-pointer"
                  style={{
                    background: notif.read
                      ? "transparent"
                      : "rgba(244, 185, 100, 0.03)",
                    borderLeft: notif.read
                      ? "2px solid transparent"
                      : "2px solid #f4b964",
                  }}
                  onClick={() => handleClick(notif)}
                >
                  <div
                    className="shrink-0 mt-0.5 p-1.5"
                    style={{
                      background: "rgba(244, 185, 100, 0.08)",
                    }}
                  >
                    <HugeiconsIcon
                      icon={IconComponent}
                      strokeWidth={2}
                      className="size-4"
                      style={{ color: "#f4b964" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="sb-label truncate"
                      style={{
                        color: notif.read ? "#8fa8b8" : "#eaeef1",
                      }}
                    >
                      {notif.title}
                    </div>
                    <div
                      className="sb-caption mt-0.5 line-clamp-2"
                      style={{ color: "#6d8d9f" }}
                    >
                      {notif.body}
                    </div>
                    <div
                      className="sb-caption mt-1"
                      style={{ color: "#4a6a7a", fontSize: 11 }}
                    >
                      {timeAgo(notif.createdAt)}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
