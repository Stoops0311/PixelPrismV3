# Logos Chat Page -- UX Redesign Document

**Status:** Proposed Redesign
**Date:** 2026-02-16
**Context:** The current Logos Chat page "feels off." This document diagnoses the specific problems and proposes concrete, implementable solutions grounded in the DS-2 design system and the dashboard UX story.

---

## 1. Diagnosis: What Specifically Feels "Off"

After comparing the current implementation (`app/dashboard/[brandSlug]/logos/page.tsx`) against the authoritative spec (`docs/dashboard-ux-story.md` Section 4.2), the gold-standard Global Overview page (`app/dashboard/page.tsx`), and the DS-2 vibe spec, here are the specific problems:

### 1.1 The Page Has No Identity

The Logos Chat page is the most distinctive page in the entire app -- the UX story says so explicitly. But the current implementation looks like a generic chat widget dropped into the dashboard layout. There is no visual signal that you have entered Logos' space. Compare this to the Global Overview, which immediately establishes itself with a time-of-day greeting, a structured section hierarchy with coral overline labels, and purpose-built components. The Logos page has none of that structural confidence.

**Specific evidence:**
- No page title or contextual header. The page jumps straight from the brand voice banner to chat messages with no visual introduction.
- No Logos geometric mark or brand presence anywhere on the page. The spec calls for a small mark in the left margin of AI messages and beside insight cards.
- The chat area uses a bare `div` with `overflow-y-auto` -- no `ScrollArea` component, missing the DS-2 treatment that all scrollable containers should have.

### 1.2 The Layout Math Is Wrong

The height calculation `calc(100vh - 64px - 96px)` is fragile and incorrect. The 64px accounts for the dashboard header, but the 96px is a guess at padding. The actual layout uses `py-12 lg:py-16` (48px / 64px) from the layout's `<main>` wrapper, plus the padding is applied to the parent, not subtracted from the child. This means:

- On large screens: the chat area is either too short (visible gap at bottom) or too tall (scrollbar appears on the page itself), depending on exact viewport.
- The input area is "pinned to bottom" via flexbox, but because the container height is miscalculated, it doesn't actually pin to the viewport bottom. It pins to wherever the broken calc lands.
- The entire page still has the layout's `max-w-7xl mx-auto` constraint, meaning the chat is contained within 1280px. For a chat page, this is fine for readability, but the page padding should be reduced to give messages more breathing room.

### 1.3 Messages Lack Spatial Rhythm

Every message -- Logos and user -- uses the same 12px vertical padding and the same spacing. The UX story specifies:

- Logos messages: `rgba(244,185,100,0.04)` background with 3px gold left border -- **implemented correctly**
- User messages: `#163344` background, right-aligned -- **implemented correctly**
- But the `space-y-4` (16px) between messages is too uniform. Conversations have natural rhythm: rapid back-and-forth should feel tighter (8-12px), while a pause or topic shift should feel wider (24-32px). The current implementation treats every message gap identically.

### 1.4 The Suggested Prompts Are Weak

The suggested prompts are raw `<button>` elements with inline `onMouseEnter`/`onMouseLeave` handlers for hover state. Problems:

- They use `!px-4 !py-2 !min-h-0 !text-xs` override spam on the ghost button class, fighting the design system instead of working with it.
- They are only visible when `isTyping` is false, meaning they flash away the instant the user sends a message. The spec says they should appear "below the last message" and "after Logos finishes a response" -- they should be contextually attached to Logos' last message, not floating at the bottom of the scroll area.
- No entrance animation. The spec calls for a staggered fade-in (100ms between each, from `translateY(4px)`).
- Clicking a prompt fills the input but does NOT send it. The spec says "clicking a suggestion fills the input and sends it."

### 1.5 The Input Area Is Underbuilt

The input area uses a raw `Card > CardContent > flex` layout with a `Textarea` and two ghost buttons. Problems:

- It does not use the `InputGroup` component as specified. The spec explicitly says "Use `InputGroup` with textarea variant (matching the 'Ask, Search or Chat...' pattern from the design reference)."
- The `+` attachment button has no tooltip explaining what it does.
- The send button color logic is handled via inline styles instead of CSS classes.
- No character/context indicator showing conversation context usage ("52% used").
- The textarea has `!border-0 !shadow-none !ring-0` overrides fighting the design system. When placed inside an `InputGroup`, these overrides are unnecessary because `InputGroupTextarea` already handles border removal.
- The textarea is stuck at `rows={1}` and `resize-none` with no auto-grow behavior. A chat input should expand up to 3-4 lines as the user types, then scroll internally.

### 1.6 The Report Card Is Detached

The embedded weekly report card (`ReportCard` component) is visually correct in isolation but feels disconnected from the message flow:

- It uses `Card` inside a Logos message, creating a card-inside-a-tinted-area visual that lacks contrast. The card's `#0e2838` background against the message's `rgba(244,185,100,0.04)` tinted background creates a barely-perceptible depth change.
- The stat grid uses `grid-cols-2 gap-3` which is functional but lacks the structured feel of a proper report. The stats should feel more like a data dashboard embedded in conversation.
- No "New" badge for unread reports as specified.

### 1.7 Missing Animations

The spec defines four specific chat animations. None are implemented:

1. **User message send:** `translateY(20px) -> translateY(0)`, 250ms spring -- NOT IMPLEMENTED
2. **Logos message receive:** `opacity: 0, translateY(8px) -> opacity: 1, translateY(0)`, 300ms spring -- NOT IMPLEMENTED
3. **Suggested prompts:** staggered fade-in, 100ms gap, from `translateY(4px)` -- NOT IMPLEMENTED
4. **Typing indicator:** Three gold squares pulsing in sequence -- PARTIALLY IMPLEMENTED (the animation exists but uses a local `@keyframes` instead of the existing `sb-pulse` keyframe in the theme CSS)

### 1.8 No "New Message" Highlight

The spec says: "If Logos has sent a new message since the user's last visit (e.g., a weekly report), that message is highlighted with a subtle gold left border and a 'New' badge." This is completely absent.

### 1.9 The Brand Voice Banner Is Disconnected

The `BrandVoiceBanner` component is technically correct but feels bolted on:

- It sits in a `mb-4 flex-shrink-0` wrapper that gives it a 16px bottom margin, but no top connection to the page structure. It floats without context.
- The edit button is only visible when `onEditClick` is provided. In the current page, `onEditClick` is not passed, so the edit button is absent. The spec says there should be an "Edit ghost button."
- The banner lacks the "link to the voice editor" that the spec mentions.

---

## 2. The Redesigned UX Story

### Page Purpose (one sentence)

Talk to an AI companion that knows your brand and speaks with informed confidence about your strategy.

### User Arrives With...

One of three mindsets (from the spec, verbatim):
- **Seeking advice:** "Logos, what should I post this week?"
- **Reviewing a report:** "Show me what you found in my weekly analysis."
- **Refining brand voice:** "Let's adjust how we talk about our products."

The emotional state is conversational and trust-oriented. The user is not in "dashboard mode" (scanning data) or "creation mode" (building something). They are in **dialogue mode** -- they want to talk to someone who understands their brand. The interface must reflect this: warm, focused, unhurried.

### The Attention Flow

1. **First 0.5s -- The conversation history is front and center.** The most recent message is visible near the bottom. If there is a new unread message from Logos (weekly report, proactive insight), it has a subtle gold left border glow and a "NEW" badge. The user's eye is drawn here first because it is the only element with color emphasis.

2. **First 3s -- The input area is obvious and inviting.** A full-width `InputGroup` at the bottom of the viewport, pinned. Placeholder text reads "Ask Logos anything about your brand..." The gold send arrow is visible. The user immediately knows where to type.

3. **First 10s -- The user either reads the latest message or starts typing.** Zero decision overhead. The brand voice banner at the top provides context but does not compete for attention -- it is slim, muted, and collapsible.

4. **After initial scan -- Suggested prompts provide direction.** Below the most recent Logos message, 2-3 contextual prompt pills sit quietly. They are not flashy. They are easy to ignore if the user knows what they want. They are easy to reach if the user needs inspiration.

### Component Map

```
+----------------------------------------------------------------+
|  [Brand Voice Banner]  -- slim, collapsible, card bg           |
|  Voice: Warm, approachable... | Audience: 25-40... [Edit]     |
+----------------------------------------------------------------+
|                                                                 |
|  Scrollable Message Area (ScrollArea)                           |
|                                                                 |
|  +--- Logos Message --------+                                   |
|  | [mark] 9:00 AM                                              |
|  | Good morning! I've been analyzing...                        |
|  +---------------------------+                                  |
|                                                                 |
|                         +--- User Message ---+                  |
|                         | That's great!       |                 |
|                         | 9:02 AM             |                 |
|                         +--------------------+                  |
|                                                                 |
|  +--- Logos Message --------+                                   |
|  | [mark] 9:03 AM                                              |
|  | Your top performer was the close-up...                      |
|  | 847 engagements ... 5.2% rate ...                           |
|  +---------------------------+                                  |
|                                                                 |
|  +--- Logos Message (Report) --- NEW --------+                  |
|  | [mark] 9:06 AM                                              |
|  | Here's your weekly performance summary:                     |
|  | +------------------------------------------+                |
|  | | WEEKLY REPORT -- FEB 10-16               |                |
|  | | +----------+ +----------+                |                |
|  | | | Followers | | Engage.  |                |                |
|  | | | +127  ^   | | 4.7% ^  |                |                |
|  | | +----------+ +----------+                |                |
|  | | +----------+ +----------+                |                |
|  | | | Reach     | | Posts    |                |                |
|  | | | 12,430 ^  | | 5       |                |                |
|  | | +----------+ +----------+                |                |
|  | | Strong week overall...                   |                |
|  | +------------------------------------------+                |
|  +------------------------------------------------------------+|
|                                                                 |
|  [Suggested Prompts]                                            |
|  [What should I post?] [How's Instagram?] [Refine voice]      |
|                                                                 |
+----------------------------------------------------------------+
|  +--Input Area (InputGroup, pinned to bottom)----------------+ |
|  | [+]  Ask Logos anything about your brand...       [->]    | |
|  +-----------------------------------------------------------+ |
|  Context: 52% used                                              |
+----------------------------------------------------------------+
```

---

## 3. Specific Fixes and Implementation

### 3.1 Fix the Layout: Full-Bleed Chat Container

**Problem:** The chat page lives inside the dashboard layout's `<main className="px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto">`. This padding and max-width are appropriate for data pages but wrong for a chat interface. Chat needs to fill the available height precisely and should have reduced vertical padding.

**Solution:** The chat page should use negative margins or a different approach to reclaim the vertical space. The cleanest solution is to make the Logos page opt out of the standard padding by detecting it at the layout level, but since this is a page-level fix, we use CSS to counteract the parent padding:

```tsx
// The page container should be positioned to fill the viewport precisely
<div
  className="flex flex-col w-full"
  style={{
    height: "calc(100vh - 64px)",  // Only subtract the header height
    marginTop: "-48px",             // Counteract py-12
    marginBottom: "-48px",          // Counteract py-12
    paddingTop: "16px",             // Restore a smaller top pad for the banner
    paddingBottom: "0px",           // Input area manages its own bottom padding
  }}
>
```

**Better approach -- add a data attribute to the layout:** The layout can check if the current route is `/logos` and apply a different padding class. But for the immediate fix, the page-level override works.

The `max-w-7xl` constraint should remain -- chat readability degrades past ~900px line length. But the chat messages themselves should have a narrower max-width within the container (messages at `max-w-[75%]` for Logos, `max-w-[65%]` for user).

### 3.2 Use ScrollArea for the Message List

**Before:**
```tsx
<div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0">
```

**After:**
```tsx
import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="flex-1 min-h-0">
  <div className="space-y-3 px-2 py-4">
    {/* messages */}
  </div>
</ScrollArea>
```

The `ScrollArea` component provides a styled scrollbar that is consistent with the DS-2 aesthetic. The raw `overflow-y-auto` gives the browser's default scrollbar, which is a grey rectangle that clashes with the dark theme.

### 3.3 Redesign Message Bubbles

**Logos Messages -- Key Changes:**

1. **Add the Logos geometric mark.** A small gold angular mark (two overlapping rectangles forming an "L" shape) in the top-left corner of each message, sized at 16x16px. This is subtle but establishes Logos' identity per the spec (Section 6: "A small mark in the left margin, not a full avatar").

2. **Move the timestamp above the message.** Currently timestamps are at the bottom of each bubble, which makes them an afterthought. In conversational interfaces, time context at the top helps the user orient themselves chronologically, especially when scrolling through history.

3. **Increase message padding** from `12px 16px` to `16px 20px`. The current padding feels tight for the 15px body text at 1.7 line-height.

4. **Variable spacing between messages.** Instead of uniform `space-y-4`, use:
   - `8px` between consecutive messages from the same sender (rapid back-and-forth)
   - `20px` between a role change (user -> logos or logos -> user)
   - `32px` before a report message (it's a new topic)

**Implementation for variable spacing:**
```tsx
function getMessageSpacing(current: ChatMessage, previous?: ChatMessage): number {
  if (!previous) return 0
  if (current.report) return 32
  if (current.role !== previous.role) return 20
  return 8
}
```

**Logos message refined styling:**
```tsx
<div
  className="max-w-[75%]"
  style={{
    background: "rgba(244, 185, 100, 0.04)",
    borderLeft: "3px solid rgba(244, 185, 100, 0.12)",
    padding: "16px 20px",
  }}
>
  {/* Timestamp + Logos mark row */}
  <div className="flex items-center gap-2 mb-2">
    <LogosMark size={14} />
    <span className="sb-caption" style={{ color: "#6d8d9f" }}>
      {formatTime(message.timestamp)}
    </span>
    {message.isNew && (
      <span
        className="sb-label"
        style={{
          color: "#f4b964",
          fontSize: 9,
          background: "rgba(244, 185, 100, 0.08)",
          border: "1px solid rgba(244, 185, 100, 0.12)",
          padding: "2px 6px",
        }}
      >
        NEW
      </span>
    )}
  </div>
  {/* Message body */}
  <p className="sb-body" style={{ color: "#d4dce2", lineHeight: 1.7 }}>
    {renderContent(message.content)}
  </p>
</div>
```

**User message refined styling:**
```tsx
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
```

### 3.4 The Logos Geometric Mark

A small SVG component that provides Logos' visual identity throughout the chat:

```tsx
function LogosMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {/* Two overlapping rectangles forming an abstract "L" prism */}
      <rect x="0" y="0" width="10" height="10" fill="#f4b964" opacity="0.6" />
      <rect x="6" y="6" width="10" height="10" fill="#f4b964" opacity="0.9" />
    </svg>
  )
}
```

This mark is angular (zero border-radius), gold-colored, and small enough to sit in the message margin without competing with the text. The overlapping rectangles reference PixelPrism's name while staying within DS-2's geometric vocabulary.

### 3.5 Redesign the Report Card

The embedded weekly report should feel like a data card from the dashboard that has been inlined into conversation. It should use the same visual language as `DS2StatCard`.

**Key changes:**

1. **Use popover-depth background** (`#163344`) instead of card background (`#0e2838`). Since the report card sits inside a Logos message (which already has a gold-tinted background), it needs to be one depth layer up to create contrast.

2. **Add a coral overline label** ("WEEKLY REPORT") matching the section label pattern used throughout the dashboard (`sb-label` typography, `#e8956a` color).

3. **Stat cells should use the data-large pattern** for values -- JetBrains Mono, slightly larger than the surrounding body text, with gold color for positive trends and coral for negative.

4. **Add a gold top border** on the report card (2px solid `rgba(244,185,100, 0.22)`) to visually separate it from the message text above.

```tsx
function ReportCard({ report }: { report: NonNullable<ChatMessage["report"]> }) {
  return (
    <div
      className="mt-4"
      style={{
        background: "#163344",
        borderTop: "2px solid rgba(244, 185, 100, 0.22)",
        padding: "20px",
      }}
    >
      {/* Report label */}
      <p className="sb-label mb-1" style={{ color: "#e8956a" }}>
        Weekly Report
      </p>
      <p className="sb-h4 mb-4" style={{ color: "#eaeef1" }}>
        {report.title}
      </p>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {report.stats.map((stat) => (
          <div
            key={stat.label}
            className="p-3"
            style={{
              background: "rgba(244, 185, 100, 0.04)",
              border: "1px solid rgba(244, 185, 100, 0.08)",
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
                  fontWeight: 700
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

      {/* Summary */}
      <p className="sb-body-sm" style={{ color: "#d4dce2", lineHeight: 1.7 }}>
        {report.summary}
      </p>
    </div>
  )
}
```

### 3.6 Redesign the Suggested Prompts

**Before:** Raw `<button>` elements with inline hover handlers, uniform ghost styling, appearing at the bottom of the scroll area.

**After:** Contextual prompt pills that appear below Logos' most recent message, with proper entrance animation, using the DS-2 interaction patterns.

```tsx
function SuggestedPrompts({
  prompts,
  onSelect,
  visible
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
            border: "1px solid rgba(244, 185, 100, 0.12)",
            padding: "8px 16px",
            cursor: "pointer",
            transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0)"
              : "translateY(4px)",
            transitionDelay: visible ? `${index * 100}ms` : "0ms",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.borderColor = "rgba(244, 185, 100, 0.22)"
            el.style.color = "#f4b964"
            el.style.transform = "translateY(-2px)"
            el.style.background = "rgba(244, 185, 100, 0.04)"
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.borderColor = "rgba(244, 185, 100, 0.12)"
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
```

**Behavioral change:** Clicking a prompt should immediately send it, not just fill the input. This removes a step and matches the spec.

### 3.7 Rebuild the Input Area with InputGroup

**Before:** A `Card` wrapping a flex container with raw `Textarea` and ghost buttons.

**After:** The proper `InputGroup` component with `InputGroupTextarea`, `InputGroupAddon`, and `InputGroupButton`, matching the "Ask, Search or Chat..." pattern from the design reference.

```tsx
<div
  className="flex-shrink-0 pt-3 pb-2"
  style={{ borderTop: "1px solid rgba(244, 185, 100, 0.08)" }}
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
        maxHeight: "120px",  // 4 lines max before internal scroll
      }}
    />

    <InputGroupAddon align="inline-end">
      <InputGroupButton
        size="icon-sm"
        onClick={handleSend}
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

  {/* Context indicator */}
  <div className="flex justify-end mt-1.5 px-1">
    <span className="sb-caption" style={{ color: "#6d8d9f" }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        fontSize: 11
      }}>
        52%
      </span>
      {" "}context used
    </span>
  </div>
</div>
```

### 3.8 Implement All Four Chat Animations

**User message send animation:**
```tsx
// When adding a new user message, wrap it in an animated container
<div
  key={msg.id}
  style={{
    animation: msg.isNew
      ? "sb-msg-send 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
      : "none",
  }}
>
  <MessageBubble message={msg} />
</div>
```

**Add to `ds2-theme.css`:**
```css
@keyframes sb-msg-send {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes sb-msg-receive {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes sb-prompt-appear {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Logos message receive animation:**
```tsx
<div
  key={msg.id}
  style={{
    animation: msg.isNew
      ? "sb-msg-receive 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
      : "none",
  }}
>
  <MessageBubble message={msg} />
</div>
```

### 3.9 Fix the Typing Indicator

**Before:** Uses a local `@keyframes sb-logos-pulse` inside a `<style>` tag.

**After:** Uses the existing `sb-pulse` keyframe from `ds2-theme.css` (which matches the Live status dot animation -- same animation spec as in the UX story).

```tsx
function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-2.5"
      style={{
        background: "rgba(244, 185, 100, 0.04)",
        borderLeft: "3px solid rgba(244, 185, 100, 0.12)",
        padding: "14px 20px",
        width: "fit-content",
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
```

### 3.10 Enhance the Brand Voice Banner

The banner needs three additions:

1. **Always pass `onEditClick`** (even if it just shows a toast or navigates to a future voice editor).
2. **Add brand voice attribute tags** instead of a single text line. Display each attribute (Tone, Audience, Values, Avoid) as a labeled tag.
3. **Add a subtle gold left border** on the expanded state to connect it visually to Logos' message styling.

```tsx
<BrandVoiceBanner
  tone={MOCK_BRAND_VOICE.tone}
  audience={MOCK_BRAND_VOICE.audience}
  values={MOCK_BRAND_VOICE.values}
  avoid={MOCK_BRAND_VOICE.avoid}
  onEditClick={() => {
    showInfo("Brand voice editor coming soon")
  }}
/>
```

The `BrandVoiceBanner` component itself should be updated to display the expanded content with labeled sections:

```tsx
// Inside the expanded area
<div className="px-4 pb-3 space-y-2" style={{ borderTop: "1px solid rgba(244,185,100,0.06)" }}>
  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3">
    <div>
      <span className="sb-label" style={{ color: "#6d8d9f", fontSize: 10 }}>Tone</span>
      <p className="sb-body-sm" style={{ color: "#d4dce2" }}>{tone}</p>
    </div>
    <div>
      <span className="sb-label" style={{ color: "#6d8d9f", fontSize: 10 }}>Audience</span>
      <p className="sb-body-sm" style={{ color: "#d4dce2" }}>{audience}</p>
    </div>
    {values && (
      <div>
        <span className="sb-label" style={{ color: "#6d8d9f", fontSize: 10 }}>Values</span>
        <p className="sb-body-sm" style={{ color: "#d4dce2" }}>{values}</p>
      </div>
    )}
    {avoid && (
      <div>
        <span className="sb-label" style={{ color: "#6d8d9f", fontSize: 10 }}>Avoid</span>
        <p className="sb-body-sm" style={{ color: "#e85454" }}>{avoid}</p>
      </div>
    )}
  </div>
</div>
```

---

## 4. Micro-Interaction Moments (Summary)

| Moment | Animation | Duration | Easing |
|--------|-----------|----------|--------|
| User sends a message | `translateY(20px), opacity: 0` -> settle | 250ms | Spring |
| Logos response arrives | `translateY(8px), opacity: 0` -> settle | 300ms | Spring |
| Suggested prompts appear | Stagger fade-in from `translateY(4px)`, 100ms gap | 200ms each | Spring |
| Typing indicator | Three 6x6 gold squares pulsing via `sb-pulse`, 200ms stagger | 1500ms loop | ease-in-out |
| Prompt pill hover | `translateY(-2px)`, border 12% -> 22%, color -> gold, bg tint | 250ms | Spring |
| Prompt pill active | `translateY(1px)` | 80ms | ease |
| Send button enabled | Send icon color transition `#6d8d9f` -> `#f4b964` | 250ms | Spring |
| New message badge | Gold border-left glow on unread Logos messages | Persistent until scrolled into view | -- |
| Report card stat values | Numbers rendered in JetBrains Mono 18px, trend arrows in gold/coral | Static | -- |
| Input area focus | `InputGroup` border brightens from 14% -> 45% gold opacity, outer glow ring | 250ms | Spring |
| Banner collapse/expand | Height and opacity transition | 300ms | Spring |

---

## 5. Delight Opportunities

1. **The Logos mark subtly shimmers on its most recent message.** The gold opacity of the overlapping rectangles in the `LogosMark` SVG oscillates between 0.6/0.9 and 0.9/0.6 on a slow 3s cycle -- matching the shimmer pattern on the Logos Insight Card's gold border from the Brand Dashboard. This makes Logos' latest response feel "alive" without being distracting. Apply only to the most recent Logos message.

2. **Smart placeholder text rotation.** Instead of always showing "Ask Logos anything about your brand...", the placeholder can rotate contextually based on the last message topic:
   - After a report message: "Ask about any metric in the report..."
   - After a content suggestion: "Want more ideas like this?"
   - Default: "Ask Logos anything about your brand..."

3. **Keyboard shortcut hint.** A barely-visible `sb-caption` text below the input on first visit: "Press Enter to send, Shift+Enter for a new line." This fades after the user sends their first message in the session.

---

## 6. Anti-Patterns to Enforce

1. **No Logos avatar on every message.** The geometric mark is enough. A full avatar per message is visual clutter in a two-person conversation.
2. **No markdown code blocks.** Logos is a marketing companion, not a developer tool. Lists are fine. Code blocks never appear.
3. **No "clear conversation" button in easy reach.** Conversation history is context. If needed, bury it in a settings menu accessible from the brand voice banner area.
4. **No "Hello! How can I help?" on page load.** Logos shows conversation history and waits. The greeting only appears during the initial brand voice onboarding flow (see dashboard-ux-story.md Section 5).
5. **No rounded corners anywhere.** Not on message bubbles. Not on the typing indicator. Not on suggested prompt pills. Zero means zero.
6. **No generic chat UI library.** The chat is custom-built to DS-2 specs. Third-party chat UIs would fight the design system.

---

## 7. CSS Additions for `ds2-theme.css`

```css
/* ── Chat Animations ───────────────────────────────────────────────────── */

@keyframes sb-msg-send {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes sb-msg-receive {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes sb-prompt-appear {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Logos Mark Shimmer ──────────────────────────────────────────────── */

@keyframes sb-logos-mark-shimmer {
  0%, 100% { opacity: 0.6; }
  50%      { opacity: 0.9; }
}

.sb-logos-mark-active rect:first-child {
  animation: sb-logos-mark-shimmer 3s ease-in-out infinite;
}
.sb-logos-mark-active rect:last-child {
  animation: sb-logos-mark-shimmer 3s ease-in-out infinite 1.5s;
}
```

---

## 8. Files That Need Changes

| File | Change Summary |
|------|---------------|
| `app/dashboard/[brandSlug]/logos/page.tsx` | Complete rewrite per this spec |
| `components/ds2/brand-voice-banner.tsx` | Add labeled attribute display, always show edit button, add expanded gold left border |
| `styles/ds2-theme.css` | Add chat animation keyframes (`sb-msg-send`, `sb-msg-receive`, `sb-prompt-appear`, `sb-logos-mark-shimmer`) |
| `types/dashboard.ts` | Add `isNew?: boolean` field to `ChatMessage` interface for unread message highlighting |
| `lib/mock-data.ts` | Add `isNew: true` to the last Logos message in `MOCK_CHAT_MESSAGES` |

---

## 9. Before/After Summary

| Aspect | Before (Current) | After (Redesigned) |
|--------|-------------------|--------------------|
| **Page identity** | Generic chat widget in a dashboard | Logos' space -- geometric mark, purposeful layout, alive |
| **Layout height** | Broken `calc(100vh - 64px - 96px)` | Correct viewport-filling flexbox with measured offsets |
| **Scroll container** | Raw `overflow-y-auto` div | `ScrollArea` with DS-2 styled scrollbar |
| **Message spacing** | Uniform 16px gaps | Variable: 8px same-sender, 20px role-change, 32px before reports |
| **Logos visual identity** | Nothing -- no mark, no identity | 16px geometric mark on every Logos message, shimmer on latest |
| **Report card** | Card-inside-message, low contrast | Popover-depth background, coral overline, larger stat values |
| **Suggested prompts** | Raw buttons with override spam, no animation | Styled pills with stagger animation, click-to-send behavior |
| **Input area** | Raw Card + Textarea + ghost buttons | Proper `InputGroup` with tooltip, auto-grow, context indicator |
| **Animations** | None (except partial typing indicator) | All four spec animations implemented |
| **Typing indicator** | Local `@keyframes`, correct visually | Uses global `sb-pulse` from theme, includes Logos mark |
| **New message highlight** | Missing entirely | Gold left border glow + "NEW" badge on unread messages |
| **Brand voice banner** | Missing edit button, single text line | Labeled attributes, edit button always visible, expanded border |
| **Timestamps** | Bottom of each message | Top of Logos messages (with mark), bottom-right of user messages |

---

*This redesign does not change the fundamental architecture of the chat page. It does not add new features or new data flows. Every change is about making the existing concept feel right -- making the bones that are already there come alive with the precision and warmth that Studio Brutalist demands.*
