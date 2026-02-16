"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, SentIcon } from "@hugeicons/core-free-icons"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { BrandVoiceBanner } from "@/components/ds2/brand-voice-banner"
import {
  MOCK_CHAT_MESSAGES,
  MOCK_BRAND_VOICE,
} from "@/lib/mock-data"
import type { ChatMessage } from "@/types/dashboard"

// ── Logos Geometric Mark ──────────────────────────────────────────────────

function LogosMark({ size = 16, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={active ? "sb-logos-mark-active" : undefined}
    >
      <rect x="0" y="0" width="10" height="10" fill="#f4b964" opacity="0.6" />
      <rect x="6" y="6" width="10" height="10" fill="#f4b964" opacity="0.9" />
    </svg>
  )
}

// ── Variable Message Spacing ──────────────────────────────────────────────

function getMessageSpacing(current: ChatMessage, previous?: ChatMessage): number {
  if (!previous) return 0
  if (current.report) return 32
  if (current.role !== previous.role) return 20
  return 8
}

// ── Format Time ───────────────────────────────────────────────────────────

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}

// ── Typing Indicator ──────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-2.5"
      style={{
        background: "rgba(244,185,100,0.04)",
        borderLeft: "3px solid rgba(244,185,100,0.12)",
        padding: "14px 20px",
        width: "fit-content",
        animation: "sb-msg-receive 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      }}
    >
      <LogosMark size={14} />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="sb-pulse-dot"
          style={{
            width: 6,
            height: 6,
            background: "#f4b964",
            animationDelay: `${i * 200}ms`,
          }}
        />
      ))}
    </div>
  )
}

// ── Report Card (embedded in Logos message) ───────────────────────────────

function ReportCard({
  report,
}: {
  report: NonNullable<ChatMessage["report"]>
}) {
  return (
    <div
      className="mt-4"
      style={{
        background: "#163344",
        borderTop: "2px solid rgba(244,185,100,0.22)",
        padding: "20px",
      }}
    >
      <p className="sb-label mb-1" style={{ color: "#e8956a" }}>
        Weekly Report
      </p>
      <p className="sb-h4 mb-4" style={{ color: "#eaeef1" }}>
        {report.title}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {report.stats.map((stat) => (
          <div
            key={stat.label}
            className="p-3"
            style={{
              background: "rgba(244,185,100,0.04)",
              border: "1px solid rgba(244,185,100,0.08)",
            }}
          >
            <p className="sb-caption mb-1" style={{ color: "#6d8d9f" }}>
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="sb-data"
                style={{
                  color: "#eaeef1",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {stat.value}
              </span>
              {stat.trend && (
                <span
                  className="sb-caption"
                  style={{
                    color: stat.trend === "up" ? "#f4b964" : "#e8956a",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                >
                  {stat.trend === "up" ? "\u25B2" : "\u25BC"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="sb-body-sm" style={{ color: "#d4dce2", lineHeight: 1.7 }}>
        {report.summary}
      </p>
    </div>
  )
}

// ── Chat Message ──────────────────────────────────────────────────────────

function MessageBubble({
  message,
  isLatestLogos,
}: {
  message: ChatMessage
  isLatestLogos: boolean
}) {
  const isLogos = message.role === "logos"

  const renderContent = (text: string) => {
    const parts = text.split(/(\b\d[\d,.]*%?|\+\d[\d,.]*%?)/g)
    return parts.map((part, i) => {
      if (/^[+]?\d[\d,.]*%?$/.test(part)) {
        return (
          <span
            key={i}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.02em",
            }}
          >
            {part}
          </span>
        )
      }
      return part
    })
  }

  if (isLogos) {
    return (
      <div
        className="max-w-[75%]"
        style={{
          background: "rgba(244,185,100,0.04)",
          borderLeft: message.isNew
            ? "3px solid rgba(244,185,100,0.35)"
            : "3px solid rgba(244,185,100,0.12)",
          padding: "16px 20px",
        }}
      >
        {/* Timestamp + Logos mark row */}
        <div className="flex items-center gap-2 mb-2">
          <LogosMark size={14} active={isLatestLogos} />
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
            {formatTime(message.timestamp)}
          </span>
          {message.isNew && (
            <span
              className="sb-label"
              style={{
                color: "#f4b964",
                fontSize: 9,
                background: "rgba(244,185,100,0.08)",
                border: "1px solid rgba(244,185,100,0.12)",
                padding: "2px 6px",
              }}
            >
              NEW
            </span>
          )}
        </div>

        {/* Message body */}
        <p
          className="sb-body"
          style={{ color: "#d4dce2", lineHeight: 1.7 }}
        >
          {renderContent(message.content)}
        </p>
        {message.report && <ReportCard report={message.report} />}
      </div>
    )
  }

  return (
    <div className="flex justify-end">
      <div
        className="max-w-[65%]"
        style={{
          background: "#163344",
          padding: "16px 20px",
        }}
      >
        <p className="sb-body" style={{ color: "#d4dce2", lineHeight: 1.7 }}>
          {message.content}
        </p>
        <p className="sb-caption mt-2" style={{ color: "#6d8d9f", textAlign: "right" }}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}

// ── Suggested Prompts ─────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "What should I post this week?",
  "How\u2019s my Instagram doing?",
  "Help me refine my brand voice",
]

function SuggestedPrompts({
  prompts,
  onSelect,
  visible,
}: {
  prompts: string[]
  onSelect: (prompt: string) => void
  visible: boolean
}) {
  return (
    <div
      className="flex flex-wrap gap-2 pt-3"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {prompts.map((prompt, index) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          style={{
            fontFamily: "'General Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: "#6d8d9f",
            background: "transparent",
            border: "1px solid rgba(244,185,100,0.12)",
            padding: "8px 16px",
            cursor: "pointer",
            transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(4px)",
            transitionDelay: visible ? `${index * 100}ms` : "0ms",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.borderColor = "rgba(244,185,100,0.22)"
            el.style.color = "#f4b964"
            el.style.transform = "translateY(-2px)"
            el.style.background = "rgba(244,185,100,0.04)"
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.borderColor = "rgba(244,185,100,0.12)"
            el.style.color = "#6d8d9f"
            el.style.transform = "translateY(0)"
            el.style.background = "transparent"
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(1px)"
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function LogosChatPage() {
  const [messages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Find the last Logos message id for shimmer mark
  const lastLogosId = [...messages].reverse().find((m) => m.role === "logos")?.id

  const scrollToBottom = useCallback(() => {
    // ScrollArea viewport is the first child with data-slot="scroll-area-viewport"
    const viewport = scrollRef.current?.querySelector("[data-slot='scroll-area-viewport']")
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const handleSend = useCallback((text?: string) => {
    const value = text ?? inputValue
    if (!value.trim()) return
    setInputValue("")
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 2000)
  }, [inputValue])

  const handlePromptClick = useCallback((prompt: string) => {
    handleSend(prompt)
  }, [handleSend])

  return (
    <div
      className="flex flex-col w-full"
      style={{
        height: "calc(100vh - 64px)",
        marginTop: "-48px",
        marginBottom: "-48px",
        paddingTop: "16px",
        paddingBottom: "0px",
      }}
    >
      {/* Brand Voice Banner */}
      <div className="mb-3 flex-shrink-0">
        <BrandVoiceBanner
          tone={MOCK_BRAND_VOICE.tone}
          audience={MOCK_BRAND_VOICE.audience}
          values={MOCK_BRAND_VOICE.values}
          avoid={MOCK_BRAND_VOICE.avoid}
          onEditClick={() => {}}
          defaultCollapsed
        />
      </div>

      {/* Message List */}
      <ScrollArea className="flex-1 min-h-0" ref={scrollRef}>
        <div className="px-2 py-4">
          {messages.map((msg, index) => {
            const prev = index > 0 ? messages[index - 1] : undefined
            const spacing = getMessageSpacing(msg, prev)
            const animClass =
              msg.role === "logos" ? "sb-msg-receive" : "sb-msg-send"

            return (
              <div
                key={msg.id}
                style={{
                  marginTop: spacing,
                  animation: msg.isNew
                    ? `${animClass} 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
                    : undefined,
                }}
              >
                <MessageBubble
                  message={msg}
                  isLatestLogos={msg.id === lastLogosId}
                />
              </div>
            )
          })}

          {isTyping && (
            <div style={{ marginTop: 20 }}>
              <TypingIndicator />
            </div>
          )}

          {/* Suggested Prompts — below last message */}
          <SuggestedPrompts
            prompts={SUGGESTED_PROMPTS}
            onSelect={handlePromptClick}
            visible={!isTyping}
          />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div
        className="flex-shrink-0 pt-3 pb-2"
        style={{ borderTop: "1px solid rgba(244,185,100,0.08)" }}
      >
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton size="icon-sm" aria-label="Attach image or product">
                  <HugeiconsIcon icon={Add01Icon} size={18} color="#6d8d9f" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Attach image or product</TooltipContent>
            </Tooltip>
          </InputGroupAddon>

          <InputGroupTextarea
            placeholder="Ask Logos anything about your brand..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            rows={1}
            style={{
              fontFamily: "'General Sans', sans-serif",
              fontSize: 14,
              color: "#eaeef1",
              maxHeight: "120px",
            }}
          />

          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              aria-label="Send message"
              style={{
                opacity: inputValue.trim() ? 1 : 0.35,
                transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <HugeiconsIcon
                icon={SentIcon}
                size={18}
                color={inputValue.trim() ? "#f4b964" : "#6d8d9f"}
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <div className="flex justify-end mt-1.5 px-1">
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 11,
              }}
            >
              52%
            </span>
            {" "}context used
          </span>
        </div>
      </div>
    </div>
  )
}
