# PixelPrism Dashboard UX Story

**Design System:** Studio Brutalist (DS-2)
**Document Status:** Authoritative UX Specification
**Last Updated:** 2026-02-16

---

## Table of Contents

1. [Philosophy and Emotional Design](#1-philosophy-and-emotional-design)
2. [Navigation Architecture](#2-navigation-architecture)
3. [Global Level Pages](#3-global-level-pages)
   - 3.1 [Global Overview](#31-global-overview)
   - 3.2 [Brands List](#32-brands-list)
   - 3.3 [Billing and Credits](#33-billing-and-credits)
4. [Brand Level Pages](#4-brand-level-pages)
   - 4.1 [Brand Dashboard](#41-brand-dashboard)
   - 4.2 [Logos Chat](#42-logos-chat)
   - 4.3 [Products](#43-products)
   - 4.4 [Studio](#44-studio)
   - 4.5 [Scheduling](#45-scheduling)
   - 4.6 [Analytics](#46-analytics)
5. [Empty States and Onboarding](#5-empty-states-and-onboarding)
6. [Logos AI Presence](#6-logos-ai-presence)
7. [Micro-Interactions Catalog](#7-micro-interactions-catalog)
8. [Component Specifications](#8-component-specifications)
9. [Anti-Patterns](#9-anti-patterns)

---

## 1. Philosophy and Emotional Design

### The Core Feeling

PixelPrism should feel like having a sharp, capable friend who happens to be a marketing expert. Not software. Not a dashboard. A collaborator.

Most SMB marketing tools make their users feel small -- buried in analytics they don't understand, surrounded by features they'll never use, reminded at every turn that they can't afford the "real" tier. PixelPrism does the opposite. It makes small business owners feel like they have a world-class marketing department. The AI companion Logos is the embodiment of this: it doesn't just analyze data, it interprets it, celebrates wins, and offers specific next steps.

### The Emotional Arc

The emotional journey through a typical PixelPrism session:

1. **Arrival: Grounded confidence.** The dashboard loads and immediately tells you where things stand. No hunting. No confusion. You know the state of your brand in under three seconds.

2. **Work: Quiet competence.** Generating images, scheduling posts, reviewing analytics -- every workflow feels direct. Two clicks to get anything done. The interface recedes and the work comes forward.

3. **Discovery: Warm surprise.** Logos surfaces an insight you hadn't thought of. A chart reveals a trend you can act on. A scheduled post performed better than expected. These moments aren't buried in notification centers -- they're woven into the surfaces you already look at.

4. **Departure: Momentum.** You leave feeling like things are handled. Posts are scheduled. Images are queued. Logos is watching. The app works while you don't.

### Why Studio Brutalist Works Here

The zero-radius, sharp-edged geometry might seem at odds with a "warm collaborator" feeling. It isn't. The brutalist frame is what makes the warmth land. Consider:

- Gold-tinted borders on dark surfaces feel like light leaking through cracks in something solid. It communicates strength and warmth simultaneously.
- Spring easing on hard rectangles creates a tension that feels alive. A sharp card that bounces slightly when you interact with it has more personality than a rounded card that slides smoothly.
- The dual-font system carries the emotional shift. Neue Montreal commands attention for headings and labels -- it says "this is structured, this is real." General Sans softens the body text -- it says "but we're having a conversation." JetBrains Mono for data says "and the numbers are precise."

The design system gives PixelPrism an identity that is unmistakably not Hootsuite, not Buffer, not Later. It is its own thing. That distinctiveness is itself a form of respect for the user -- we built this for you, not from a template.

---

## 2. Navigation Architecture

### The Structural Decision: Sidebar + Contextual Header

The dashboard uses a **collapsible left sidebar** paired with a **contextual top header**.

**Why a sidebar, not a top nav alone:**

The app has two navigation tiers (global and brand-scoped) with 9+ distinct pages. A horizontal top bar cannot hold this many items without either cramming them into dropdowns (hiding navigation behind clicks) or spreading them across the full width (destroying visual hierarchy). A sidebar gives vertical real estate to separate global from brand-level navigation, house the brand switcher, and provide a persistent home for Logos.

**Why collapsible (icon+text to icon-only):**

Studio, Scheduling, and Logos Chat are width-hungry views. A fixed 280px sidebar would steal too much from a content calendar or image grid. Collapsing to 64px (icon-only with tooltips) recovers that space while keeping all navigation one click away. The collapse is user-controlled -- a toggle button at the bottom of the sidebar, not automatic based on viewport.

The sidebar never auto-collapses on resize. If the viewport shrinks below a threshold (below 1024px), the sidebar becomes an overlay Sheet that slides in from the left, triggered by a hamburger icon in the top header. On mobile, there is no persistent sidebar -- only the overlay.

### Sidebar Layout (Expanded State, 260px Width)

```
+------------------------------------------+
|  [Logo] PixelPrism           [Collapse]  |   <- 64px header zone
+------------------------------------------+
|                                          |
|  BRAND SWITCHER                          |   <- Brand selector dropdown
|  [Avatar] Sunrise Coffee Co     [v]     |
|  3 platforms connected                   |
|                                          |
+--- gold divider (8% opacity) -----------+
|                                          |
|  BRAND                                   |   <- Section label (coral overline)
|                                          |
|  [icon]  Dashboard                       |
|  [icon]  Logos             [dot]        |   <- Gold pulse dot when Logos has insights
|  [icon]  Products           (12)        |   <- Count badge for product count
|  [icon]  Studio             (47)        |   <- Count badge for image count (renamed from Gallery)
|  [icon]  Scheduling         (3)         |   <- Count badge for upcoming posts
|  [icon]  Analytics                       |
|                                          |
+--- gold divider (8% opacity) -----------+
|                                          |
|  ACCOUNT                                 |   <- Section label (coral overline)
|                                          |
|  [icon]  Overview                        |
|  [icon]  All Brands                      |
|  [icon]  Billing & Credits               |
|                                          |
+------------------------------------------+
|                                          |
|  [Avatar] Jane Doe                       |   <- User profile/settings
|  jane@sunrise.coffee                     |
|  [Professional]                          |   <- Account-level tier badge (StatusBadge)
|  [icon] Settings  [icon] Sign Out        |
|                                          |
+------------------------------------------+
```

### Sidebar Layout (Collapsed State, 64px Width)

```
+--------+
| [Logo] |   <- Logo icon only, no text
+--------+
|        |
| [Avtr] |   <- Brand avatar only, tooltip shows brand name
|        |
+--------+
|        |
| [icon] |   <- Dashboard (tooltip)
| [icon] |   <- Logos (gold dot preserved)
| [icon] |   <- Products
| [icon] |   <- Studio (renamed from Gallery)
| [icon] |   <- Scheduling
| [icon] |   <- Analytics
|        |
+--------+
|        |
| [icon] |   <- Overview
| [icon] |   <- All Brands
| [icon] |   <- Billing
|        |
+--------+
|        |
| [Avtr] |   <- User avatar only
|        |
+--------+
```

### Sidebar Styling

The sidebar is a fixed-position element anchored to the left edge of the viewport.

- **Background:** `#0e2838` (card surface) -- one depth layer above the page background, which establishes it as a persistent frame, not floating content.
- **Right border:** `rgba(244, 185, 100, 0.08)` -- the section divider weight, subtle but present.
- **Shadow:** None on the sidebar itself. The border is the only depth cue. Adding a shadow to a full-height element creates visual noise.
- **Active nav item:** Gold left accent bar (3px, `#f4b964`), text color shifts from muted (`#6d8d9f`) to foreground (`#eaeef1`), background tint of `rgba(244, 185, 100, 0.04)`. The gold bar animates in with `scaleY` from top, matching the table row pattern from DS-2.
- **Hover nav item:** Text color brightens to `#d4dce2`, `translateY(-1px)` -- a subtler lift than the standard `-2px` because sidebar items are tightly packed. Background tint of `rgba(244, 185, 100, 0.02)`.
- **Section labels:** Coral overline text (`#e8956a`), `sb-label` typography (Neue Montreal, 11px, uppercase, 0.10em tracking). These read as structural markers, not clickable items.
- **Count badges:** JetBrains Mono, 11px, `#6d8d9f`, inside a subtle container with `rgba(244, 185, 100, 0.06)` background and `rgba(244, 185, 100, 0.08)` border. These are informational, not actionable. They update in real-time as data changes.

### Sidebar Collapse Animation

The collapse transition is the most complex animation in the sidebar and must feel physical.

**Duration:** 300ms
**Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring)

**What happens:**
1. Width animates from 260px to 64px. The main content area expands to fill the recovered space simultaneously.
2. Text labels fade out at 150ms (halfway through the width transition). They don't shrink -- they simply become `opacity: 0`. This prevents the awkward "text wrapping as it gets narrower" problem.
3. Icons remain centered throughout. Their horizontal position is always `32px from left edge` -- this means they don't move at all during collapse. Only the text beside them disappears.
4. Section labels and dividers fade out with the text.
5. The brand switcher collapses to show only the brand avatar.
6. The user profile collapses to show only the user avatar.
7. Count badges disappear with the text. In collapsed state, counts are visible via tooltip on hover.

**The expand is the reverse**, but text labels fade in at 200ms into the 300ms transition (delayed until the sidebar is wide enough to show them without wrapping).

### Brand Switcher

The brand switcher is the most important interactive element in the sidebar. It sits directly below the PixelPrism logo and above all navigation, because it determines the context for everything below it.

**Expanded appearance:** A clickable region showing the brand's avatar (a square, 36x36, zero border-radius, with the brand's initials or uploaded logo), the brand name in `sb-h4` weight, and a secondary line in `sb-caption` muted text (e.g., connected platform count or brand tagline). A subtle chevron-down indicates it's interactive.

**Interaction:** Clicking opens a dropdown (Select component pattern) that lists all brands the user owns. Each brand in the list shows:
- Brand avatar (32x32)
- Brand name
- Follower count across all platforms (JetBrains Mono, `sb-caption` size)

The dropdown also has a "Create New Brand" action at the bottom, separated by a gold divider. This action uses the ghost button style with a `+` icon. If the user is near or at their account-level brand limit, the action shows a parenthetical: "Create New Brand (2 of 3 used)."

**Brand switching transition:** When the user selects a different brand:
1. The dropdown closes with the standard 250ms spring easing.
2. The sidebar's brand info crossfades (150ms fade out of old, 150ms fade in of new).
3. The main content area performs a coordinated transition:
   - Current content fades out and shifts down slightly (`opacity: 0, translateY(8px)`, 200ms).
   - New content fades in and settles from above (`opacity: 0, translateY(-8px)` to `opacity: 1, translateY(0)`, 250ms spring).
4. The URL updates to reflect the new brand context (e.g., `/dashboard/[brandSlug]/...`).
5. All brand-scoped data refetches. During the fetch, skeleton states appear in the main content area. The sidebar's count badges show skeleton shimmer briefly.

This transition should feel like turning a page in a book, not like loading a new app.

### Contextual Top Header

With the sidebar handling primary navigation, the 64px top bar is repurposed as a contextual header. It provides:

- **Breadcrumb trail** (left-aligned): Shows the current navigation path. Example: `Sunrise Coffee Co / Products / Summer Collection`. Uses the existing Breadcrumb component. The brand name in the breadcrumb is a link back to the brand dashboard.
- **Page title** is NOT in the header -- it belongs in the main content area where it has room to breathe. The breadcrumb provides enough context.
- **Action buttons** (right-aligned): Page-specific primary actions. On the Products page, this is "New Product." On Studio, this is "Generate" (duplicating the panel's button for quick access). On Scheduling, this is "New Post." These use `sb-btn-primary` with the hard invert pattern. Maximum of two action buttons per page -- if more are needed, the second is a dropdown.
- **Credits indicator** (right-aligned, before action buttons): A compact display showing remaining credits. JetBrains Mono for the number, a small spark/bolt icon in gold. This is always visible because credits are the currency of the product -- the user should never have to navigate away to check them. Clicking it navigates to Billing & Credits.
- **Notifications bell** (right-aligned, after action buttons): Minimal -- a bell icon with a gold dot when Logos has generated a new weekly report or when a scheduled post has been published. Clicking opens a dropdown with recent notifications.

**Header styling:**
- `position: sticky; top: 0; z-index: 50;`
- Background: `#071a26` at 95% opacity with `backdrop-blur-sm` (matching existing DS2Navigation pattern)
- Bottom border: `rgba(244, 185, 100, 0.08)`
- Height: 64px
- Left padding matches the sidebar's width (260px expanded, 64px collapsed) so the header content aligns with the main content area below it. The header spans the full viewport width but its content is inset.

### URL Structure

```
/dashboard                           -> Global Overview
/dashboard/brands                    -> Brands List
/dashboard/billing                   -> Billing & Credits

/dashboard/[brandSlug]               -> Brand Dashboard
/dashboard/[brandSlug]/logos         -> Logos Chat
/dashboard/[brandSlug]/products      -> Products List
/dashboard/[brandSlug]/products/[id] -> Product Detail
/dashboard/[brandSlug]/studio        -> Studio (Generate & Gallery, renamed from Gallery)
/dashboard/[brandSlug]/scheduling    -> Content Calendar
/dashboard/[brandSlug]/analytics     -> Analytics
```

The `[brandSlug]` is a URL-safe version of the brand name. When a user selects a brand from the switcher, the URL updates to include that brand's slug. This means brand context is shareable via URL -- a user can bookmark a specific brand's analytics page.

---

## 3. Global Level Pages

### 3.1 Global Overview

**Page Purpose:** Show me the health of my entire PixelPrism account in one glance.

**User Arrives With:** "How are things going across all my brands?" This is either the first page they see after login, or the page they come to when they want the big picture. Their mindset is executive -- they want summaries, not details.

**The Attention Flow:**

1. **First 0.5s -- Credit balance and subscription status.** Top-left stat card cluster. The credit balance is the single most operationally important number because it determines what the user can do. JetBrains Mono, large (28px), gold color. Subscription tier badge sits beside it.

2. **First 3s -- Brand performance summary cards.** A horizontal row of cards, one per brand (max 3-4 visible, horizontal scroll if more). Each card shows: brand avatar, brand name, total followers (aggregated), engagement rate (aggregated), and a micro sparkline showing the last 7 days of follower growth. This tells the user "are my brands growing?" without requiring a click.

3. **First 10s -- Logos weekly digest.** Below the brand cards, a full-width card with a distinctive left gold accent bar (4px, the toast accent pattern but on a card). This contains Logos' aggregated weekly insight: "Across your brands, engagement is up 12% this week. Sunrise Coffee's Instagram reel about cold brew drove most of that growth." This is the human moment on the page -- Logos speaking directly to the user.

4. **Below the fold -- Upcoming scheduled posts.** A compact list showing the next 5 posts across all brands, with brand avatar, platform icon, post preview text (truncated), and scheduled time. This answers "what's going out soon?"

5. **Below that -- Recent activity feed.** A simple timeline of recent events: image generated, post published, new follower milestone hit, Logos report available. This is the "pulse" of the account. Each entry is a single row, not a card.

**Component Map:**

| Region | Component | Content | Rationale |
|--------|-----------|---------|-----------|
| Top row (3 cards) | `DS2StatCard` | Credits remaining, Total followers (all brands), Total engagement rate | These are the three numbers that summarize account health. Credits first because it's operationally urgent. |
| Second row | Custom `BrandSummaryCard` (new) | One card per brand with avatar, name, followers, engagement, sparkline | Brands are the primary organizational unit. Seeing them side-by-side enables comparison. |
| Third row | Custom `LogosDigestCard` (new) | Weekly AI insight text, "Read Full Report" ghost button link | Logos' presence on the overview page establishes it as a first-class feature, not a hidden tool. |
| Fourth row | `DS2DataTable` (compact variant) | Upcoming posts across all brands | Table is the right pattern for a chronological list with multiple attributes per row. |
| Fifth row | Custom `ActivityFeed` (new) | Recent events timeline | A simple list, not a table. Each row is timestamp + icon + description. |

**Micro-Interaction Moments:**

- **Brand cards lift on hover** (`translateY(-2px)`, shadow base to elevated, border brightens to 22%). Clicking a brand card navigates to that brand's dashboard with the spring-eased page transition.
- **Credit balance pulses gold once** on page load if credits were recently added (e.g., subscription renewed). This is a 1-second animation: the number scales to 1.02 and the gold color brightens, then settles. Subtle celebration.
- **Sparklines in brand cards animate on viewport entry.** The line draws from left to right over 600ms with a custom easing. This is one of the few places where a non-spring easing is appropriate -- the line draw should feel smooth, not bouncy.

**Delight Opportunities:**

1. **Greeting based on time of day.** The page title area shows "Good morning, Jane" / "Good afternoon" / "Good evening" in `sb-h1`. This is trivial to implement and immediately personalizes the experience.
2. **Milestone callouts.** If any brand crossed a follower milestone (1K, 5K, 10K, etc.) since the last login, a brief gold-bordered alert appears at the top of the page: "Sunrise Coffee hit 5,000 followers on Instagram!" with a subtle confetti-like particle animation using gold squares (not circles -- staying on brand).

**Anti-Patterns to Avoid:**

- Do NOT show a grid of identical metric cards for every possible metric. Three cards maximum. More than three and the user's eyes glaze over -- nothing feels important when everything is presented identically.
- Do NOT put a "getting started" checklist on this page for returning users. The overview is for people who already have brands and data. Onboarding has its own flow (see Section 5).
- Do NOT auto-play Logos insights as a chat. The digest card is a static, scannable summary. The chat lives in its own page.

---

### 3.2 Brands List

**Page Purpose:** Manage all my brands in one place.

**User Arrives With:** "I need to create, configure, or switch to a specific brand." This page is reached from the sidebar's "All Brands" item or from the brand switcher's "Manage Brands" option. The user is in management mode -- they're here to do something structural, not to consume data.

**The Attention Flow:**

1. **First 0.5s -- Brand count and "Create Brand" button.** Page title "Your Brands" with the count in JetBrains Mono beside it (e.g., "3 brands"). The "Create Brand" primary button sits in the top header's action slot. This is the most likely primary action on this page.

2. **First 3s -- Brand cards grid.** Each brand is a full card (not a table row) because brands are rich objects with visual identity. Cards are arranged in a 3-column grid (`gap-6`). Each card shows:
   - Brand avatar (48x48, square)
   - Brand name (`sb-h3`)
   - Connected platforms (small platform icons in a row)
   - Key stats: followers, posts this month, images generated (JetBrains Mono, `sb-data` size)
   - Last active timestamp (`sb-caption`, muted)

3. **First 10s -- The user clicks into a brand or creates one.** Each card is fully clickable (navigates to that brand's dashboard). A kebab menu (three dots) in the card header provides secondary actions: Edit Brand, Duplicate, Archive, Delete.

**Component Map:**

| Region | Component | Content |
|--------|-----------|---------|
| Page header | Top bar breadcrumb ("Brands") + "Create Brand" `sb-btn-primary` | |
| Main content | Grid of custom `BrandCard` components | One per brand, 3-column layout |
| Empty state | Custom empty state (see Section 5) | Only shown when user has zero brands |

**Micro-Interaction Moments:**

- **Brand cards use the full DS-2 card hover pattern:** `translateY(-2px)`, shadow base to elevated, border 12% to 22%, gold bloom. Clicking performs `translateY(1px)` active state, then navigates.
- **Kebab menu uses the dropdown pattern** with gold left accent on focused items. Delete option is destructive red.
- **Creating a new brand** opens a Dialog (not a new page). The dialog uses modal shadow tier. It's a two-step form: Brand Name + Description -> Upload Logo. Each step animates in from the right with the spring easing. (Subscription tier is account-level, not selected per brand.)

**Delight Opportunities:**

1. **Brand card avatars have a subtle gold border glow on hover** (the shadow bloom pattern applied to the avatar specifically). This makes the brand feel "selected" before you click.
2. **The "Create Brand" button on first hover after page load** performs a slightly exaggerated spring bounce (overshoot 1.2x instead of the standard). First impressions of the primary action should feel energetic.

**Anti-Patterns to Avoid:**

- Do NOT use a table for brands. Brands are not tabular data -- they're entities with visual identity. Cards respect this.
- Do NOT show subscription upgrade prompts on every brand card. If the user has hit their account-level brand limit, show a single, clear message at the top of the page: "You're using 3 of 3 brands on the Starter plan." -- not per-card badges.

---

### 3.3 Billing and Credits

**Page Purpose:** Understand what I'm paying for and how many credits I have left.

**User Arrives With:** One of two mindsets: "I need more credits" (action-oriented, in a hurry) or "I want to understand my usage" (analytical, browsing). The page must serve both without forcing either through hoops.

**The Attention Flow:**

1. **First 0.5s -- Credit balance, front and center.** A large `DS2StatCard` variant: the credit count in JetBrains Mono at 36px, gold color. Below it, a progress bar showing credits used / total for the current billing cycle. The progress bar uses the DS-2 Progress component with the gold fill. A "Buy Credits" primary button sits beside the stat card, not below it -- the action-oriented user needs this in their peripheral vision immediately.

2. **First 3s -- Current plan card.** Adjacent to the credits stat, a card showing: plan name (Starter/Professional/Enterprise), price, renewal date, and what's included (brand limit, credit allowance, social account limit). A "Change Plan" secondary button.

3. **First 10s -- Usage breakdown.** Below the top cards, a tabbed section:
   - **Credits tab:** Bar chart showing daily credit usage over the last 30 days. Below the chart, a table of recent credit transactions (date, action, credits used, product name). Each row shows a descriptive action like "4 images generated for Summer Collection (HD, 16:9)" -- not just "4 credits."
   - **Brands tab:** How many of the allowed brands are in use. Simple progress indicator.
   - **Social Accounts tab:** How many connected accounts vs. the plan limit.

4. **Below the fold -- Billing history.** A simple data table of past invoices. Date, amount, status (paid/pending/failed), download link. This is utilitarian -- styled cleanly but not given visual prominence.

**Component Map:**

| Region | Component | Content |
|--------|-----------|---------|
| Top left | `DS2StatCard` (large variant) | Credit balance + progress bar |
| Top right | Card | Current plan details + change plan button |
| Mid section | Tabs (line variant) + `DS2BarChart` + `DS2DataTable` | Usage breakdown by credits, brands, accounts |
| Bottom | `DS2DataTable` | Billing history / invoices |

**Micro-Interaction Moments:**

- **Credit progress bar animates on load** from 0 to current value over 400ms with spring easing. If credits are below 20%, the bar color shifts from gold to coral (`#e8956a`). Below 5%, it shifts to destructive red (`#e85454`).
- **"Buy Credits" button has enhanced urgency styling** when credits are below 10%: the button's resting state adds a subtle coral border glow (shadow bloom pattern with coral instead of gold). This doesn't change the button's appearance dramatically -- it just adds a warm pulse.
- **Bar chart bars animate in** sequentially from left to right, each bar growing from the bottom, staggered by 30ms. Spring easing makes each bar overshoot slightly before settling.

**Anti-Patterns to Avoid:**

- Do NOT hide the credit balance behind a tab or accordion. It must be visible at the top of the page at all times.
- Do NOT show confusing "credit math" (e.g., "1 credit = 0.23 base units"). Show concrete numbers: "You have 47 credits. An HD image costs 3 credits."
- Do NOT use aggressive upsell modals. Plan upgrades are offered as a secondary action, never interrupting the user's current task.

---

## 4. Brand Level Pages

When a user selects a brand (either from the brand switcher or by clicking a brand card), they enter the brand-scoped context. The sidebar's "Brand" section becomes active, and all subsequent navigation stays within this brand until the user switches.

### 4.1 Brand Dashboard

**Page Purpose:** Show me how this brand is doing right now and what needs my attention.

**User Arrives With:** "What's happening with [brand name]?" This is the landing page for a brand context. The user wants a pulse check -- not deep analytics, not a to-do list. They want to know if things are healthy and if anything needs attention.

**The Attention Flow:**

1. **First 0.5s -- The "pulse" stat row.** Three `DS2StatCard` components in a row:
   - **Total Followers** (aggregated across all connected platforms): value in JetBrains Mono 28px, trend arrow and percentage, `StatusBadge` showing "Live" with the pulsing square dot.
   - **Engagement Rate** (weighted average across platforms): value in JetBrains Mono, trend, description "Across all platforms this week."
   - **Credits Remaining** (for this brand? no -- credits are account-level): value in JetBrains Mono, with a caption "Account-wide" to clarify scope.

   These three cards answer: "Am I growing? Are people engaging? Can I still create?"

2. **First 3s -- Logos insight card.** Full-width card directly below the stats. This is Logos' most recent insight for this brand, displayed as a short paragraph (2-3 sentences max) with the AI companion's avatar beside it. The card has a 4px gold left border (the toast accent pattern on a persistent card). Example: "Your Instagram engagement spiked 34% after Tuesday's product shot. That warm-toned, close-up style is resonating -- I'd suggest generating more images in that direction." A "Chat with Logos" ghost button links to the full Logos page.

   This is the single most differentiated element on the dashboard. No other SMB tool has an AI that proactively talks to you about your brand on the dashboard. It must feel personal, not robotic. The text is natural language, not bullet points.

3. **First 10s -- Two-column layout below.** Left column (60% width): a mini content calendar showing the next 7 days with scheduled posts. Right column (40% width): a "Recent from Studio" strip showing the 4 most recently generated images as thumbnails.

4. **Below the fold -- Platform performance.** A row of compact cards, one per connected platform (Instagram, TikTok, Facebook, etc.). Each shows: platform icon, follower count, weekly change, and a micro area chart (last 14 days). These use `DS2AreaChart` in a compact mode -- no legends, no axis labels, just the curve and the gradient fill.

**Component Map:**

| Region | Component | Content | Why Here |
|--------|-----------|---------|----------|
| Row 1 | 3x `DS2StatCard` | Followers, Engagement, Credits | The pulse. Eyes go here first because it's top-left and has the largest numbers. |
| Row 2 | `LogosInsightCard` (new) | AI-generated brand insight | Below stats because it's context for the numbers. "Here's what those numbers mean." |
| Row 3 left | `MiniCalendar` (new) | Next 7 days of scheduled posts | Shows upcoming work. Left because it's more operationally important than the gallery. |
| Row 3 right | `RecentStudio` (new) | 4 recent image thumbnails | Visual relief from the data above. Right because it's supplementary. |
| Row 4 | Platform performance cards | Per-platform mini charts | Below the fold because it's detail, not summary. Users who want this will scroll. |

**Micro-Interaction Moments:**

- **Stat cards stagger their load animation.** The three stats don't appear simultaneously -- they fade in left to right with a 100ms stagger. Each card enters with `translateY(8px), opacity: 0` and settles to `translateY(0), opacity: 1` over 300ms spring. This creates a "cascade" that draws the eye across the row.
- **Logos insight card has a subtle typing reveal** on first load. The text doesn't just appear -- it fades in word-by-word over 800ms, mimicking the feeling that Logos is speaking to you. This only happens once per session; subsequent visits show the text immediately.
- **Mini calendar days with scheduled posts** show a small gold square indicator (6x6, consistent with the "Live" dot pattern). Hovering a day reveals a tooltip with post details. Clicking navigates to the Scheduling page with that day focused.
- **Recent studio thumbnails lift on hover** (`translateY(-2px)`) and their border brightens. Clicking opens a lightbox-style preview (Dialog component, modal shadow tier, dark overlay).

**Next Step Transitions:**

From the brand dashboard, the three most common next actions are:
1. **Generate new images** -> Navigates to Studio (generation panel ready, optionally with a product pre-selected).
2. **Schedule a post** -> Navigates to Scheduling page.
3. **Chat with Logos** -> Navigates to Logos page.

Each of these is accessible via: clicking the relevant sidebar item, clicking a contextual link within the dashboard content (e.g., "Chat with Logos" on the insight card), or clicking the primary action button in the top header (which on this page could be a split button: "Generate Images" primary + "Schedule Post" dropdown).

**Delight Opportunities:**

1. **The Logos insight card has a faint animated gradient** along its left gold border -- a slow shimmer that moves top-to-bottom over 3 seconds, looping. This is barely perceptible but makes the card feel alive, like Logos is always thinking.
2. **Follower milestone celebrations** appear as a brief gold particle burst above the follower stat card when a round number is crossed. Particles are tiny squares (2x2 to 4x4 pixels), not circles.

**Anti-Patterns to Avoid:**

- Do NOT show all analytics on the dashboard. The dashboard is a summary. Deep analytics live on the Analytics page.
- Do NOT put a "setup checklist" on the brand dashboard for established brands. If social accounts aren't connected or no products exist, use empty states in the relevant sections (see Section 5).
- Do NOT auto-start the Logos chat. The insight card is a one-way communication. The user initiates the conversation by navigating to the Logos page.

---

### 4.2 Logos Chat

**Page Purpose:** Have a conversation with my AI marketing companion about this brand.

**User Arrives With:** One of three mindsets:
- **Seeking advice:** "Logos, what should I post this week?"
- **Reviewing a report:** "Show me what you found in my weekly analysis."
- **Refining brand voice:** "Let's adjust how we talk about our products."

Logos is not a generic chatbot. It is an AI companion that knows this specific brand -- its voice, its products, its audience, its performance history. The chat interface must reflect this intimacy.

**The Attention Flow:**

1. **First 0.5s -- The conversation history.** The chat occupies the full main content width. The most recent message is visible at the bottom of the scrollable area. If Logos has sent a new message since the user's last visit (e.g., a weekly report), that message is highlighted with a subtle gold left border and a "New" badge.

2. **First 3s -- The input area.** A full-width input at the bottom of the page, pinned. It uses the `InputGroup` component with the textarea variant (matching the "Ask, Search or Chat..." pattern from the design reference). The input has:
   - A `+` button for attaching images or products to discuss.
   - A send button (gold arrow icon).
   - A character/context indicator ("52% used" style) showing how much of the conversation context is available.

3. **First 10s -- The user either reads the latest message or types.** No decision-making needed. The interface is a chat -- the mental model is already established.

**Chat Message Design:**

**Logos messages (AI):**
- Left-aligned, no avatar (the entire page is Logos' space -- an avatar on every message is redundant).
- Background: `rgba(244, 185, 100, 0.04)` -- barely-there gold tint. This distinguishes AI messages from user messages without being visually heavy.
- Left border: 3px `rgba(244, 185, 100, 0.12)`.
- Text: General Sans, `sb-body` (15px, 400). Relaxed line-height (1.7) for readability.
- When Logos includes data (e.g., "Your engagement rate is 4.7%"), the numbers use JetBrains Mono inline. This is critical -- data is always in the data font, even mid-sentence.
- When Logos includes a chart or table, these are rendered as embedded DS-2 components (mini area chart, compact data table) within the message bubble. These are not images -- they're interactive.

**User messages:**
- Right-aligned.
- Background: `#163344` (popover depth -- one step lighter than the page).
- No left border.
- Text: General Sans, same as Logos messages.

**Logos typing indicator:**
- Three gold squares (6x6 each, consistent with the dot pattern) that pulse in sequence. Not three dots. Three squares. The pulse uses the same `scale(1) -> scale(1.3) -> scale(1)` animation as the "Live" status dot but staggered by 200ms per square.

**Conversation Features:**

- **Suggested prompts:** When the conversation is empty or when Logos finishes a response, 2-3 suggested follow-up questions appear below the last message as ghost-styled pill buttons. Examples: "What should I post this week?" / "How's my Instagram doing?" / "Help me refine my brand voice." Clicking a suggestion fills the input and sends it.
- **Weekly report message:** Logos automatically generates a weekly report every Monday. This message is structured differently from regular conversation -- it uses a card-like layout within the chat: a title ("Weekly Report -- Feb 10-16"), key stats in a mini stat grid, top performing post with image, and a 2-sentence summary. The user can ask follow-up questions about any part of the report.
- **Brand voice context:** At the top of the chat (above the message list), a slim banner shows the brand's current voice profile: "Voice: Warm, approachable, slightly playful. Audience: 25-40, coffee enthusiasts." This can be collapsed. It reminds the user what context Logos is working with and links to the voice editor.

**Component Map:**

| Region | Component | Content |
|--------|-----------|---------|
| Top banner | Custom `BrandVoiceBanner` (new) | Brand voice summary, collapsible |
| Main area | Custom `ChatMessageList` (new) | Scrollable conversation history |
| Each AI message | Custom `LogosMessage` (new) | Text + optional embedded charts/tables |
| Each user message | Custom `UserMessage` (new) | Text + optional attached images |
| Suggested prompts | Row of ghost-styled buttons | 2-3 contextual suggestions |
| Bottom input | `InputGroup` (textarea variant) | Message input + attachment + send |

**Micro-Interaction Moments:**

- **Message send animation:** When the user sends a message, it slides up from the input area into the conversation with `translateY(20px) -> translateY(0)`, 250ms spring. Simultaneously, the input clears and the Logos typing indicator appears.
- **Message receive animation:** When Logos' response arrives, it fades in with `opacity: 0, translateY(8px) -> opacity: 1, translateY(0)`, 300ms spring.
- **Embedded charts within Logos messages** animate their data on viewport entry, the same as standalone charts.
- **Suggested prompts appear** with a staggered fade-in (100ms between each), sliding up from `translateY(4px)`.

**Anti-Patterns to Avoid:**

- Do NOT use a small chat widget or sidebar panel. Logos is a first-class feature, not a support chatbot. It gets a full page.
- Do NOT show Logos' avatar on every message. This is a two-person conversation in a dedicated space -- context is already established.
- Do NOT use markdown rendering that looks like developer documentation. Logos' messages should feel like a person writing, not a system generating formatted output. Lists are fine; code blocks are not (this is a marketing tool, not a dev tool).
- Do NOT put a "clear conversation" button in an easy-to-reach place. Conversation history is valuable context. If needed, it can live in a settings dropdown.

---

### 4.3 Products

**Page Purpose:** Manage my brand's products and generate marketing images for them.

**User Arrives With:** "I need to create images for a product" or "I need to add a new product." Products are the bridge between the brand and image generation -- they're not the end goal, they're the vehicle.

**The Attention Flow:**

1. **First 0.5s -- Product count and "Add Product" button.** Page title "Products" with count. The "Add Product" primary button is in the top header action slot. If the user has products, they see the grid immediately.

2. **First 3s -- Product card grid.** A 3-column grid of product cards. Each card shows:
   - Product image (the primary marketing image, or a placeholder gradient if none exists)
   - Product name (`sb-h4`)
   - Brief description (`sb-body-sm`, truncated to 2 lines)
   - Image count badge: "12 images" in `sb-caption` with a small gallery icon
   - "Open in Studio" secondary button at the card bottom (navigates to Studio with this product pre-selected)

3. **First 10s -- The user either clicks a product card (to view its details/images) or clicks "Open in Studio" on a specific product.**

**Product Detail View (sub-page):**

When the user clicks a product card, they navigate to `/dashboard/[brandSlug]/products/[productId]`. This page shows:

- **Product header:** Large product image (left, 40% width), product name + description + metadata (right, 60% width). Metadata includes creation date, total images generated, total credits spent on this product.
- **"Open in Studio" primary button:** Below the header. Navigates to the Studio page (`/dashboard/[brandSlug]/studio`) with this product pre-selected in the generation panel's product dropdown. Image generation is not done on the product detail page -- Studio is the single place for all generation.
- **Generated images gallery:** Below the button, a compact masonry grid of all images generated for this product (reuses the `MasonryGallery` component, filtered to this product). This lets users browse product-specific images without leaving the product page, but generation happens in Studio.

**Component Map:**

| Region | Component | Content |
|--------|-----------|---------|
| Grid view | Custom `ProductCard` (new) | Product cards in 3-column grid |
| Detail: header | Custom layout | Product image + metadata |
| Detail: CTA | `Button` (`sb-btn-primary`) | "Open in Studio" -- navigates to Studio with product pre-selected |
| Detail: images | `MasonryGallery` (filtered) | Generated images for this product (browse only, generation in Studio) |

**Micro-Interaction Moments:**

- **Product cards hover:** Standard DS-2 card lift + shadow elevation + border brighten. The product image within the card scales to `1.02` on hover (CSS transform), creating a subtle zoom effect that makes the card feel like it's "opening up."
- **"Open in Studio" button hover:** Standard primary button hover (hard invert + `translateY(-2px)` + gold bloom). Communicates navigation to Studio.

**Anti-Patterns to Avoid:**

- Do NOT put image generation controls on the product detail page. Generation lives exclusively in Studio. The product page links to Studio with the product pre-selected.
- Do NOT auto-generate images on product creation. Generation should always be an explicit action with clear cost communication, performed in Studio.

---

### 4.4 Studio

> **Rename note:** This page was previously called "Gallery" in the UX story. It has been renamed to **Studio** and expanded to include image generation capabilities that previously lived exclusively on the Product detail page (Section 4.3). The standalone Products page remains for product CRUD management. URL changed from `/dashboard/[brandSlug]/gallery` to `/dashboard/[brandSlug]/studio`. The old URL should redirect.

**Page Purpose:** Generate new marketing images and browse your brand's image library, all in one creative workspace.

**User Arrives With:** One of three mindsets:
- "I need to create new images" (generation-focused)
- "I want to find an image I already made" (browsing)
- "I liked that one -- make more like it" (iterative creation via the reference image workflow)

**The Layout: Side-by-Side Split**

Studio uses a permanent side-by-side layout: generation panel on the left (35% width), gallery grid on the right (65% width). This keeps creation and results in constant view, enabling an iterative workflow where generated images immediately appear in the gallery and can be fed back as references for the next generation.

```
+--[ Generation Panel (35%) ]--------+--[ Gallery Grid (65%) ]-------------+
|                                     |                                      |
|  GENERATE                           |  [Filter bar: product, status, sort] |
|                                     |                                      |
|  Product (optional)                 |  +------+  +------+  +------+       |
|  [Select a product...        v]     |  | img  |  | img  |  | img  |       |
|                                     |  |      |  +------+  |      |       |
|  Reference Image (optional)         |  |      |  +------+  +------+       |
|  +-----------------------------+    |  +------+  | img  |  +------+       |
|  | Drop an image here or       |    |  +------+  |      |  | img  |       |
|  | click to browse gallery  -> |    |  | img  |  +------+  |      |       |
|  +-----------------------------+    |  |      |  +------+  |      |       |
|                                     |  +------+  | img  |  +------+       |
|  Style                              |            +------+                  |
|  [Product Shot] [Lifestyle]         |                                      |
|  [Flat Lay]     [Abstract]          |  ... masonry infinite scroll ...     |
|                                     |                                      |
|  Quality                            |                                      |
|  [Standard] [HD] [Ultra]            |                                      |
|                                     |                                      |
|  Aspect Ratio                       |                                      |
|  [1:1] [4:5] [16:9] [9:16]         |                                      |
|                                     |                                      |
|  Quantity  [-] 4 [+]                |                                      |
|                                     |                                      |
|  4 images, HD, 16:9 = 12 credits   |                                      |
|  47 credits remaining after this    |                                      |
|                                     |                                      |
|  [ ====== Generate ====== ]        |                                      |
|                                     |                                      |
+-------------------------------------+--------------------------------------+
```

**The Attention Flow:**

1. **First 0.5s -- The split layout establishes the workspace.** The generation panel on the left is immediately recognizable as a tool panel. The gallery grid on the right fills with images. Together they communicate: "this is where you create and browse."

2. **First 3s -- The gallery dominates visual attention.** Despite being 65% width, the gallery draws the eye because images are visually heavier than form controls. The generation panel is available but doesn't demand attention until the user needs it.

3. **First 10s -- The user either browses the gallery or starts configuring a generation.** If they came from a product page via "Open in Studio," the product is pre-selected and they jump straight to configuration.

**Generation Panel (Left, 35% Width):**

The panel is fixed position (doesn't scroll with the gallery). It scrolls independently if content overflows.

- **Section header:** "Generate" in `sb-h3`.
- **Product selector (optional):** A `Select` dropdown listing all brand products, with an "All / No product" default. When a product is selected, a small thumbnail (32x32) of the product's primary image appears beside the selector. Logos may surface a style suggestion based on past performance for the selected product (appears as a subtle hint below the selector).
- **Reference image area (optional):** A drop zone (dashed gold border at 8% opacity) that accepts:
  - Images dragged from the gallery grid on the right
  - Click to open a picker that shows the gallery in a compact grid
  - When a reference image is loaded, it shows as a thumbnail (120px wide, maintaining aspect ratio) with an "X" button to remove. Caption below: "New images will use this as style reference."
- **Style selector:** A set of visual option cards (e.g., "Product Shot," "Lifestyle," "Flat Lay," "Abstract") -- each is a small square thumbnail with a label. Selected state uses gold border at 45% opacity. These are the same style options that previously lived on the Product detail page.
- **Quality selector:** `ToggleGroup` -- "Standard" / "HD" / "Ultra" with credit costs shown beside each option (JetBrains Mono).
- **Aspect ratio selector:** `ToggleGroup` -- "1:1" / "4:5" / "16:9" / "9:16" with credit costs.
- **Quantity:** Number stepper for how many images to generate.
- **Cost summary:** A summary line in JetBrains Mono: "4 images, HD, 16:9 = 12 credits." Below it: "47 credits remaining after this." Cost updates in real-time as options change (counter-roll animation, 200ms).
- **Generate button:** Full-width `sb-btn-primary` at the bottom of the panel. During generation, button text changes to "Generating..." with a gold progress bar at the button bottom.

**Gallery Grid (Right, 65% Width):**

The gallery grid is the same masonry layout previously specified for the Gallery page, with the addition of the "Use as Reference" interaction.

- **Filter bar** at the top of the grid: product filter (Select dropdown), status filter (ToggleGroup: All / Ready / Scheduled / Posted), sort (Select: Newest / Oldest / Most Used), view toggle (ToggleGroup: Grid / List icons).
- **Masonry layout:** Column-based (2 columns in the 65% width, since the full-page Gallery previously used 3 at full width). Images maintain native aspect ratio. CSS `column-count` with `break-inside: avoid`.
- **Image cards:** Image fills the card edge to edge. Slim footer: product name (`sb-caption`), generation date (`sb-caption`, muted), status indicator (small colored square -- gold for "ready," coral for "scheduled," teal for "posted").
- **Hover overlay:** Semi-transparent dark overlay (`rgba(7, 26, 38, 0.7)`) with action buttons centered: **"Use as Reference"** (ghost, sparkle/wand icon), "Schedule Post" (primary), "Download" (secondary), "Delete" (ghost, destructive). Overlay fades in over 200ms.
- **Infinite scroll** with skeleton loading state. No pagination.

**List View (alternative):**

When toggled, images show as rows in a `DS2DataTable`:
- Thumbnail (64x64, square crop) | Product name | Aspect ratio | Status badge | Date | Actions dropdown (includes "Use as Reference")

**Image-as-Reference Interactions:**

This is the key new workflow that makes Studio more than Gallery + Generation side by side. Two methods, both well-signposted:

**Method 1: Click "Use as Reference"**

On the image hover overlay, a ghost button labeled "Use as Reference" (with a sparkle/wand icon) appears alongside the other actions. Clicking it:

1. A ghost copy of the image (40% opacity) animates from its gallery position toward the generation panel's reference area. It slides left with spring easing over 400ms, shrinking as it travels, and lands in the reference drop zone.
2. The reference area border glows briefly with gold at 22% opacity (the "selection confirmed" pattern).
3. A toast appears: "Reference image set. New generations will use this style."

**Method 2: Drag from Gallery**

Images in the gallery grid are draggable. When the user starts dragging:

1. The generation panel's reference drop zone highlights with a pulsing dashed gold border (12% -> 22% opacity oscillation, 800ms loop) and the label changes to "Drop here to use as reference."
2. A ghost preview (60% opacity) follows the cursor.
3. On drop: same gold glow confirmation on the reference zone, same toast.

**Drag to schedule** also remains: images can be dragged to the Scheduling sidebar item to open the post composer with the image pre-attached. This is an advanced interaction for power users.

**Discoverability Micro-Interactions:**

These subtle cues help users discover the reference workflow without a tutorial:

- **First visit hint (per session):** The reference drop zone does one slow border pulse (6% -> 14% -> 6% over 2s) and the placeholder text reads "Drop an image here or click to browse" with a small arrow icon pointing right toward the gallery.
- **Connector line hint:** When hovering an image in the gallery while the reference zone is empty, a faint 1px gold line (6% opacity) briefly appears between the hovered image and the reference zone, hinting at the relationship. This only triggers on the first 3 hovers per session -- after that it stops to avoid being annoying.
- **Sparkle/wand icon** on the "Use as Reference" button differentiates it visually from the utility actions (Schedule/Download/Delete), signaling it has a creative purpose.

**Component Map:**

| Region | Component | Content |
|--------|-----------|---------|
| Left panel | Custom `ImageGenerationPanel` (new) | Product selector, reference image zone, style/quality/ratio/quantity, cost summary, generate button |
| Right: filter bar | `Select` + `ToggleGroup` | Product, status, sort, view filters |
| Right: grid view | `MasonryGallery` (new) | Images in masonry layout with reference drag support |
| Right: list view | `DS2DataTable` | Tabular image list |
| Image hover overlay | Custom `ImageOverlay` (new) | "Use as Reference" + Schedule + Download + Delete |
| Reference drop zone | Custom drop zone within `ImageGenerationPanel` | Drag target + click-to-browse for reference images |

**Micro-Interaction Moments:**

- **Image cards hover:** `scale(1.015)` transform (not `translateY(-2px)` -- scale is contained within card bounds on tightly packed masonry grids).
- **Filter changes:** Matching images fade in (`opacity: 0 -> 1`, 200ms), non-matching fade out (`opacity: 1 -> 0`, 150ms). Grid reflows with 300ms spring transition on container.
- **Image lightbox:** Clicking an image (not the overlay action buttons) opens a full-screen lightbox (Dialog, dark overlay at 90% opacity). Image scales up from grid position to center. Arrow keys navigate. Lightbox shows full image with metadata: product, date, dimensions, credit cost, status, and all action buttons including "Use as Reference."
- **Style selector cards:** Clicking performs a brief gold border flash (opacity jumps to 45% then eases to the selected-state 22% over 300ms).
- **Generate button, during generation:** Button text changes to "Generating..." with a gold progress bar at the bottom, filling left-to-right. Percentage appears after 3 seconds.
- **Image arrival:** When generated images arrive (via real-time subscription from Convex), each image fades into the gallery grid one at a time with `scale(0.95), opacity: 0 -> scale(1), opacity: 1`, staggered by 200ms. This creates a "developing" feeling, like photos appearing in a darkroom. New images appear at the top of the gallery (newest first sort).
- **Credit cost updates in real-time** as options change. Counter-roll animation on the cost number (200ms, JetBrains Mono).
- **Reference image set (click):** Ghost copy animates from gallery to reference zone (400ms spring, shrinking). Gold glow on zone. Toast confirmation.
- **Reference image set (drag):** Reference zone pulses on drag start. Ghost follows cursor. On drop: gold glow + toast.
- **Connector line hint:** Faint gold line between hovered gallery image and empty reference zone (first 3 hovers/session, 300ms fade).

**Anti-Patterns to Avoid:**

- Do NOT use uniform-height grid cells. Images have different aspect ratios; respect them.
- Do NOT show full file metadata (dimensions, file size, format) on the grid card. That detail belongs in the lightbox.
- Do NOT paginate the gallery side. Use infinite scroll with a skeleton loading state. Pagination breaks the browsing flow.
- Do NOT make the generation panel collapsible or hideable. It's always visible. The side-by-side layout is the identity of the Studio page.
- Do NOT bury the credit cost. It must be visible in the generation panel before the user clicks "Generate." Surprise costs destroy trust.
- Do NOT require a product selection before generating. Product is optional. Users can generate brand-level images without tying them to a specific product.
- Do NOT auto-generate images. Generation is always an explicit action with clear cost communication.

---

### 4.5 Scheduling

**Page Purpose:** Plan and schedule my social media posts across all connected accounts.

**User Arrives With:** "I need to schedule a post" or "I want to see what's coming up this week." The user is in planning mode -- they're thinking about timing, content, and which platforms to hit.

**The Attention Flow:**

1. **First 0.5s -- The content calendar dominates.** This page is calendar-first. A weekly or monthly calendar view fills the main content area. Today is highlighted with a gold left border on the day column (weekly view) or a gold background tint on the day cell (monthly view).

2. **First 3s -- View controls and "New Post" button.** Top bar contains: view toggle (Week / Month), date navigation (arrows + current date range in JetBrains Mono), and the "New Post" primary button. Connected account indicators (small platform avatars) show which accounts are active.

3. **First 10s -- The user either clicks a time slot to create a post or clicks an existing scheduled post to edit it.**

**Calendar Design:**

**Weekly view (default):**
- 7 columns (Mon-Sun), header row with day names and dates.
- Each day column shows scheduled posts as cards stacked vertically, ordered by time.
- Each post card shows: time (JetBrains Mono), thumbnail of the attached image (32x32), post text preview (truncated, 1 line), and platform icon(s).
- Post cards use status colors: scheduled (coral border left), posted (teal/muted), failed (red border left, red dot).
- Empty time slots are clickable -- clicking opens the post composer for that day/time.

**Monthly view:**
- Standard calendar grid. Each day cell shows a count of scheduled posts and tiny thumbnail dots (max 3 visible, "+2 more" indicator).
- Clicking a day in monthly view switches to weekly view with that day's week.

**Post Composer (Sheet from right):**

When creating or editing a post, a Sheet slides in from the right (matching the existing Sheet component). This keeps the calendar visible on the left so the user maintains temporal context.

The composer contains:
- **Image attachment area:** Drag-and-drop zone or "Choose from Studio" button. Shows the attached image as a preview.
- **Caption/text input:** Textarea with character count per platform (Instagram: 2200, TikTok: 4000, etc.). If the text exceeds a platform's limit, the character count turns coral with a warning.
- **Platform selector:** Checkboxes for each connected account. Each checkbox shows the platform icon and account name.
- **Date and time picker:** Date selector + time input. Defaults to the clicked time slot.
- **Logos suggestion:** Below the text input, a subtle card with a Logos suggestion: "Based on your brand voice, you might rephrase this as: [suggestion]." This appears after the user types 10+ characters and pauses for 2 seconds. It can be dismissed or applied with a single click.
- **Preview panel:** A live preview of how the post will look on the selected platform(s). Uses a tab for each platform.
- **"Schedule" primary button + "Save Draft" secondary button** at the bottom.

**Connected Accounts Management:**

A secondary view accessible via a "Manage Accounts" link in the scheduling header. Shows all connected social accounts with:
- Platform icon and account name
- Connection status (StatusBadge: "Live" with pulsing dot, or "Disconnected" in red)
- Last sync timestamp
- "Reconnect" / "Disconnect" buttons
- "Connect New Account" button using OAuth flow

**Component Map:**

| Region | Component | Content |
|--------|-----------|---------|
| Header controls | `ToggleGroup` (Week/Month) + date nav + "New Post" button | View controls |
| Main area | Custom `ContentCalendar` (new) | Weekly or monthly calendar view |
| Post cards on calendar | Custom `ScheduledPostCard` (new) | Individual post summaries on calendar |
| Composer | `Sheet` (right side) | Post creation/editing form |
| Accounts view | Card grid | Connected social accounts |

**Micro-Interaction Moments:**

- **Switching week/month view:** The calendar crossfades with a spring easing. Weekly view columns compress into monthly cells (or vice versa). This should feel like zooming in/out on a timeline.
- **Dragging a post card** to a different time slot (within weekly view) shows a ghost preview following the cursor. Valid drop targets (other time slots) highlight with a `rgba(244, 185, 100, 0.04)` tint. Dropping triggers the gold left bar animation on the new slot.
- **Post card hover:** Standard DS-2 card hover (lift + shadow + border brighten). Additionally, the thumbnail image within the card scales to 1.05.
- **Logos suggestion appearing:** The suggestion card slides in from below (`translateY(8px) -> translateY(0)`, 250ms spring) with a fade. It doesn't push content -- it occupies a reserved space.
- **Post published confirmation:** When a scheduled post goes live (real-time notification), its card on the calendar briefly flashes gold (background opacity 0 -> 8% -> 0 over 600ms) and the status changes to the "Live" badge with the pulsing dot.

**Anti-Patterns to Avoid:**

- Do NOT default to monthly view. Monthly view is too zoomed out for a scheduling workflow -- you can't see post details. Weekly view shows enough context without losing specificity.
- Do NOT open the post composer as a new page. The calendar context must remain visible. A Sheet from the right preserves spatial context.
- Do NOT require the user to select a platform before entering content. Let them write first, select platforms second. Many users write the same post for multiple platforms.
- Do NOT hide the connected accounts status. If an account is disconnected, the user needs to know immediately -- they might be scheduling posts to a broken connection.

---

### 4.6 Analytics

**Page Purpose:** Understand how my brand is performing across all platforms with enough depth to make decisions.

**User Arrives With:** "How am I doing?" or "Is what I'm doing working?" The user is in analytical mode. They want trends, not snapshots. They want to understand what's working and what isn't.

**The Attention Flow:**

1. **First 0.5s -- The headline metric.** A single large number at the top of the page: total audience growth this period (e.g., "+1,247 followers this month"). This is the number that matters most to an SMB owner doing organic marketing. It's displayed in JetBrains Mono at 36px, gold color, with a trend indicator and a comparison to the previous period.

2. **First 3s -- Date range selector and platform filter.** Immediately below the headline metric:
   - Date range: Preset buttons ("7 days" / "30 days" / "90 days" / "Custom") using ToggleGroup
   - Platform filter: ToggleGroup with platform icons (All / Instagram / TikTok / Facebook / etc.)

   These filters apply globally to every chart and metric on the page.

3. **First 10s -- The primary chart.** A large `DS2AreaChart` showing follower growth over the selected period, broken down by platform (one line per platform, using the chart color palette). This chart gets 50% of the visible viewport below the filters.

4. **Below the chart -- Metric cards row.** Four `DS2StatCard` components:
   - **Engagement Rate**: percentage, with trend
   - **Total Reach**: number, with trend
   - **Posts Published**: count, with comparison to previous period
   - **Best Performing Post**: thumbnail + engagement count, clickable

5. **Further down -- Detailed breakdowns.** Two columns:
   - **Left: Engagement breakdown bar chart** (`DS2BarChart`). Shows likes, comments, shares, saves as bars. Allows the user to see which type of engagement their content drives.
   - **Right: Top performing content table** (`DS2DataTable`). Columns: thumbnail, caption (truncated), platform, reach, engagement rate, date. Sorted by engagement rate by default. Rows are clickable to view the full post details.

6. **Bottom section -- Logos analytics insights.** A card similar to the dashboard's insight card but more detailed. Logos provides 3-5 bullet points of analysis: what's working, what's declining, and specific recommendations. Example bullets:
   - "Your Tuesday and Thursday posts get 2.3x more engagement than other days."
   - "Product shots outperform lifestyle images by 40% on Instagram."
   - "Consider posting more Reels -- your Reel engagement is 3x your photo engagement."

**Component Map:**

| Region | Component | Content |
|--------|-----------|---------|
| Top | Custom large stat display | Headline growth metric |
| Filters | `ToggleGroup` x2 | Date range + platform filter |
| Primary chart | `DS2AreaChart` (large) | Follower growth over time, by platform |
| Stat row | 4x `DS2StatCard` | Engagement, reach, posts, best post |
| Left column | `DS2BarChart` | Engagement type breakdown |
| Right column | `DS2DataTable` | Top performing content |
| Bottom | `LogosAnalyticsCard` (new) | AI-generated analysis bullets |

**Micro-Interaction Moments:**

- **Date range toggle:** When the user changes the date range, all charts and metrics on the page update simultaneously. During the data fetch (typically < 500ms), the charts show a skeleton shimmer state that matches the chart's shape (a rectangular shimmer for bar charts, a wavy shimmer for area charts). Numbers in stat cards do a counter-roll animation from old value to new value.
- **Platform filter toggle:** Toggling a platform on/off adds/removes its line from the area chart with an animated transition. The line grows/shrinks from left to right over 400ms. Other lines reposition smoothly.
- **Chart hover:** The area chart shows a vertical crosshair at the cursor position with a tooltip showing the exact values for each platform at that date. The tooltip uses the DS-2 popover styling (popover background, gold-tinted border, JetBrains Mono for numbers).
- **Stat card with "Best Performing Post":** The thumbnail in this card has a subtle continuous shimmer effect on its gold border -- this draws the eye to the most actionable insight on the page.
- **Table row hover:** Standard DS-2 table row pattern -- gold left bar scaleY animation, row background tint, siblings dim.

**Anti-Patterns to Avoid:**

- Do NOT show more than one primary chart above the fold. Multiple charts competing for attention means none of them get it. The follower growth chart is THE chart. Everything else is secondary.
- Do NOT show raw API data. Every number should be contextualized. "4,521 impressions" is less useful than "4,521 impressions (+12% vs. last week)."
- Do NOT use pie charts. The DS-2 system does not include pie charts. They are notoriously bad for comparison. Use bar charts for composition breakdowns.
- Do NOT put the Logos insights in a collapsible section. They should be fully visible -- the AI's analysis is one of the most valuable parts of this page.

---

## 5. Empty States and Onboarding

Empty states are the app's first impression for new users. They're also the moment where the user is most likely to leave. Every empty state must do three things: explain what this space is for, show what it will look like with data, and give a clear single action to get started.

### Tier 1: Brand-New User (No Brands)

**Where they land:** Global Overview.

**What they see:**

The page is not blank. The three stat card positions show placeholder cards with muted borders (6% opacity) and content that guides:

- Card 1: "Your Credits" -- shows their starting credit balance from their subscription tier. This is real data, not a placeholder. The user already has something.
- Card 2: "Your Brands" -- shows "0 brands" with a subtitle: "Create your first brand to get started."
- Card 3: "Start Building" -- a card that contains a "Create Your First Brand" primary button.

Below the cards, a full-width section shows a visual walkthrough of what PixelPrism does:

1. "Create a brand and tell Logos about it" -- illustration of the brand creation flow
2. "Add products and generate marketing images" -- illustration of the image generation panel
3. "Schedule posts and watch your audience grow" -- illustration of the content calendar

This walkthrough uses three horizontal panels with minimal illustrations (geometric line art in gold on dark background -- matching DS-2's sharp aesthetic). It's not a video. It's not a carousel. It's a static, scannable visual story.

At the bottom of the page, the Logos insight card says: "Welcome to PixelPrism. I'm Logos, your AI marketing companion. Create your first brand and I'll help you build your online presence."

### Tier 2: One Brand, No Products/Images

**Where they land:** Brand Dashboard.

**What they see:**

The stat cards show real data for followers (0 if no social accounts connected) and engagement (0). The credits card shows the account balance.

The Logos insight card is active and personal: "Let's get [brand name] set up. First, I'd like to learn about your brand voice -- head to our chat and I'll ask you a few questions. Or, if you're ready to create, add your first product."

The mini calendar section shows an empty state: "No posts scheduled yet. Connect your social accounts and start scheduling." with a "Connect Accounts" secondary button.

The recent gallery shows an empty state: "No images generated yet. Head to Studio to start creating." with an "Open Studio" secondary button.

Empty state containers use dashed borders (`border-dashed`) at 12% gold opacity, with centered content. They are the same height as they would be with content, so the page layout doesn't collapse into a blank void.

### Tier 3: One Brand, Has Products, No Images

**Product page empty state:** The product detail view shows the product header with full metadata, the "Open in Studio" primary button, and below it where the image gallery would be: "No images generated yet. Open this product in Studio to start creating." The empty gallery area shows a grid of placeholder rectangles (6, in a 3x2 grid) with muted dashed borders that pulse subtly, hinting at where images will appear.

**Studio page empty state:** The generation panel on the left is fully functional and ready. The gallery grid on the right shows an empty state: "No images generated yet. Configure your options and hit Generate." The empty gallery area shows placeholder rectangles (6, in a 2x3 grid within the 65% width) with muted dashed borders that pulse subtly.

### Tier 4: Established User, Empty Specific View

For established users who encounter an empty state in a specific view (e.g., Studio gallery with a filter that returns no results):

- "No images match this filter." with a "Clear Filters" ghost button.
- The empty state is brief and actionable. No illustrations, no walkthroughs. The user knows how the app works -- just tell them why this space is empty and how to fix it.

### Onboarding Flow: Logos Brand Voice Setup

When a user creates a new brand and first visits the Logos chat for that brand, Logos initiates a structured conversation:

1. "Let's build your brand voice together. I'll ask you a few questions, and from your answers I'll create a voice profile that guides everything I help you with."
2. "What does your brand do? Tell me in one or two sentences, the way you'd describe it to a friend."
3. "Who are your ideal customers? Think about their age, interests, and what problems they're trying to solve."
4. "How would you describe the personality of your brand? Fun and casual? Professional and authoritative? Warm and approachable?"
5. "Are there any brands or accounts you admire for their social media presence?"

After the user answers, Logos generates a voice profile summary and asks for confirmation. The profile is displayed as a card within the chat:

```
+------------------------------------------------+
|  BRAND VOICE PROFILE                           |
+------------------------------------------------+
|  Tone: Warm, approachable, slightly playful    |
|  Audience: 25-40, coffee enthusiasts           |
|  Values: Quality, sustainability, community    |
|  Avoid: Corporate jargon, aggressive sales     |
+------------------------------------------------+
|  [Looks Good]  [Let's Adjust]                  |
+------------------------------------------------+
```

"Looks Good" confirms and saves the profile. "Let's Adjust" continues the conversation for refinement.

This onboarding is conversational, not a form. It happens inside the Logos chat, not in a modal or wizard. This is deliberate -- it establishes the chat as the natural place to shape the brand.

---

## 6. Logos AI Presence

Logos is PixelPrism's most distinctive feature. Its presence in the interface must be carefully calibrated: present enough to feel like a companion, subtle enough to never feel like an interruption.

### The Logos Presence Spectrum

From most subtle to most prominent:

1. **Sidebar icon + notification dot** (always visible)
   - The Logos nav item in the sidebar has a distinct icon (a small abstract "L" or speech-bubble geometric shape).
   - When Logos has something new to say (weekly report, proactive insight, brand voice suggestion), a 6x6 gold pulsing square appears beside the icon.
   - This is the primary "Logos has something for you" signal. It does not make noise. It does not pop over content. It simply pulses gently.

2. **Dashboard insight card** (visible on Brand Dashboard and Global Overview)
   - A persistent card that shows Logos' latest insight for the current context.
   - Updated when new data is available (post-analytics refresh, weekly report generation).
   - Not interactive beyond a "Chat with Logos" link.

3. **Contextual suggestions** (appear in specific workflows)
   - In the post composer: Logos suggests caption refinements based on brand voice.
   - On the Products page: Logos suggests image generation styles based on past performance.
   - On Analytics: Logos provides interpretation of the data.
   - These suggestions appear as subtle cards within the workflow interface, not as overlays or popups. They can be dismissed.

4. **Full chat page** (user-initiated)
   - The dedicated Logos chat page is the most prominent presence.
   - The user navigates here intentionally.

### What Logos Never Does

- **Never sends browser notifications.** The pulsing dot in the sidebar is the notification system.
- **Never speaks before being spoken to** on the chat page (exception: the initial onboarding flow and weekly reports, which are system-initiated messages). Logos doesn't say "Hello! How can I help?" every time you open the chat. It shows the conversation history and waits.
- **Never covers content with a popup.** All Logos suggestions are inline, within the existing layout.
- **Never uses aggressive language.** No "You should..." or "You must..." -- instead "You might consider..." or "This has been working well..."
- **Never presents uncertain data as fact.** If Logos isn't confident in an insight, it says so: "Based on limited data, it seems like..."

### Logos Visual Identity

Logos does not have a human avatar. It has a geometric mark -- an abstract shape that feels precise and warm, consistent with DS-2. The mark is used:
- As the icon in the sidebar nav item
- Beside insight cards on the dashboard
- As the "sender" indicator on AI messages in the chat (a small mark in the left margin, not a full avatar)

The mark should be angular (zero border-radius, naturally) and use the gold color. It could be as simple as two overlapping rectangles forming an "L" shape, or an abstract prism shape that references the PixelPrism brand.

---

## 7. Micro-Interactions Catalog

This section catalogs every notable micro-interaction in the dashboard, organized by type. All interactions use the DS-2 spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) and `translateY` patterns unless otherwise noted.

### 7.1 Navigation Interactions

| Interaction | Trigger | Animation | Duration |
|-------------|---------|-----------|----------|
| Sidebar nav item hover | Mouse enter | `translateY(-1px)`, text color `#6d8d9f` -> `#d4dce2`, bg tint appears | 200ms |
| Sidebar nav item active | Click / current route | Gold left bar `scaleY(0->1)` from top, text color -> `#eaeef1`, bg tint at 4% | 250ms |
| Sidebar collapse | Toggle button click | Width 260px -> 64px, text opacity 1->0 at 150ms, main content width expands | 300ms |
| Sidebar expand | Toggle button click | Width 64px -> 260px, text opacity 0->1 at 200ms, main content width contracts | 300ms |
| Brand switcher open | Click brand selector | Dropdown appears with standard select animation (scale + fade, spring) | 250ms |
| Brand switch transition | Select new brand | Content area crossfade (old: down+fade, new: up+settle), sidebar info crossfade | 450ms total |
| Page navigation | Click nav item | Current page fades out (`translateY(4px), opacity: 0`), new page fades in (`translateY(-4px)` -> settle) | 250ms |
| Breadcrumb link hover | Mouse enter | Text color brightens, subtle underline appears (center-out, matching nav underline pattern) | 200ms |

### 7.2 Card and Container Interactions

| Interaction | Trigger | Animation | Duration |
|-------------|---------|-----------|----------|
| Stat card load | Page load | Stagger in left-to-right, 100ms gap. Each: `translateY(8px), opacity: 0` -> settle | 300ms each |
| Card hover | Mouse enter | `translateY(-2px)`, shadow base->elevated, border 12%->22%, gold bloom | 300ms |
| Card active | Mouse down | `translateY(1px)`, shadow elevated->base | 80ms |
| Studio gallery image hover | Mouse enter | `scale(1.015)`, overlay fades in at 200ms | 300ms |
| Insight card border shimmer | Always (on dashboard) | Gold left border shimmer travels top-to-bottom | 3000ms loop |
| Empty state placeholder pulse | Always | Dashed border opacity oscillates 8%->14%->8% | 2000ms loop |

### 7.3 Data and Chart Interactions

| Interaction | Trigger | Animation | Duration |
|-------------|---------|-----------|----------|
| Chart line draw | Viewport entry | Line draws left-to-right with smooth easing (exception: not spring) | 600ms |
| Bar chart bar grow | Viewport entry | Each bar grows from bottom, staggered 30ms | 300ms each |
| Stat counter update | Data change | Number rolls from old to new value (JetBrains Mono) | 200ms |
| Credit cost recalculate | Config change | Cost number counter-rolls to new value, brief gold flash | 200ms |
| Table row hover | Mouse enter | Gold left bar scaleY(0->1), bg tint, siblings opacity->0.85 | 200ms |
| Table row dim | Sibling hovered | opacity 1->0.85 | 200ms |
| Skeleton shimmer | Loading state | Left-to-right shimmer sweep on muted background | 1500ms loop |
| Chart tooltip appear | Hover on chart | Fade in + `scale(0.94) -> scale(1)` | 250ms |

### 7.4 Chat and AI Interactions

| Interaction | Trigger | Animation | Duration |
|-------------|---------|-----------|----------|
| User message send | Send button / Enter | Message slides up from input area (`translateY(20px)` -> settle) | 250ms |
| Logos message receive | Response arrives | Fade in + `translateY(8px)` -> settle | 300ms |
| Logos typing indicator | Waiting for response | Three gold squares pulsing in sequence, 200ms stagger | 1500ms loop |
| Suggested prompts appear | After Logos response | Stagger fade-in, 100ms gap, each from `translateY(4px)` | 200ms each |
| Logos suggestion card (composer) | User pauses typing 2s | Card slides up from below (`translateY(8px)`), fade in | 250ms |
| Weekly report first view | Chat page load (new report) | Gold left border flash on report message | 400ms |

### 7.5 Scheduling Interactions

| Interaction | Trigger | Animation | Duration |
|-------------|---------|-----------|----------|
| Calendar view switch | Toggle week/month | Crossfade between views | 300ms |
| Date navigation | Arrow click | Calendar content slides left/right | 250ms |
| Post card drag start | Mouse down + move | Card lifts with shadow, ghost follows cursor | Immediate |
| Post card drop | Mouse up on valid target | Card settles into new position, gold bar flash on target slot | 250ms |
| Composer sheet open | "New Post" / click slot | Sheet slides from right, spring easing | 300ms |
| Post published flash | Real-time notification | Card bg gold flash (0->8%->0 opacity) | 600ms |

### 7.6 Studio Interactions

| Interaction | Trigger | Animation | Duration |
|-------------|---------|-----------|----------|
| Reference image set (click) | "Use as Reference" button | Ghost copy (40% opacity) slides from gallery to reference zone, shrinking. Gold glow on zone. Toast. | 400ms spring |
| Reference image set (drag) | Drop on reference zone | Image settles into zone, gold glow confirmation. Toast. | 250ms spring |
| Reference zone drag highlight | Drag start in gallery | Dashed border pulses 12%->22% opacity | 800ms loop |
| Connector line hint | Hover gallery image (first 3/session) | 1px gold line (6% opacity) fades between image and reference zone | 300ms fade |
| First visit drop zone hint | Page load (once/session) | Dashed border pulse 6%->14%->6% | 2000ms once |
| Style selector flash | Click style card | Gold border flash: opacity 45% -> eases to 22% | 300ms |
| Generate button loading | Click Generate | Text -> "Generating...", gold progress bar fills at button bottom | Duration of generation |
| Image arrival in gallery | Real-time from Convex | Each image: `scale(0.95), opacity: 0` -> `scale(1), opacity: 1`, staggered 200ms | 300ms each |
| Credit cost update | Config change | Cost number counter-rolls to new value, brief gold flash | 200ms |

### 7.7 Button States (Global)

These apply to every button everywhere in the dashboard:

| State | Pattern |
|-------|---------|
| Rest | Default styling per variant (primary/secondary/ghost/destructive) |
| Hover | Hard invert (primary), glass brighten (secondary), text brighten (ghost), fill (destructive) + `translateY(-2px)` + shadow base->elevated + gold bloom (primary) |
| Focus | Gold ring: `0 0 0 3px rgba(244, 185, 100, 0.08)` |
| Active | `translateY(1px)`, 80ms |
| Disabled | opacity 0.5, no hover/active transitions, cursor not-allowed |
| Loading | Text changes to loading text, gold progress bar at button bottom (for long operations), spinner for quick operations |

---

## 8. Component Specifications

### 8.1 Existing Components (Direct Usage)

These DS-2 and shadcn components are used as-is throughout the dashboard:

| Component | Dashboard Usage |
|-----------|----------------|
| `DS2StatCard` | Stat rows on Overview, Brand Dashboard, Analytics, Billing |
| `DS2DataTable` | Upcoming posts table, billing history, top content table, image list view |
| `DS2AreaChart` | Follower growth (Analytics), platform performance mini-charts (Brand Dashboard) |
| `DS2BarChart` | Credit usage (Billing), engagement breakdown (Analytics) |
| `DS2Section` | Section containers throughout (with label/title/subtitle pattern) |
| `DS2Spinner` | Inline loading states |
| `StatusBadge` | Post status, account tier (sidebar user profile), connection status |
| `Button` (with `sb-btn-*` classes) | All actions throughout |
| `Card` | Containers everywhere |
| `Dialog` | Brand creation, image lightbox, confirmations |
| `Sheet` | Post composer (right), mobile sidebar (left) |
| `Select` | Brand switcher, filters |
| `ToggleGroup` | View toggles, platform filters, date ranges |
| `Tabs` (line variant) | Usage breakdown sections (Billing), analytics sub-views |
| `Input` / `Textarea` | Forms throughout |
| `InputGroup` (textarea variant) | Logos chat input |
| `Breadcrumb` | Contextual top header |
| `DropdownMenu` | Kebab menus, notification dropdown |
| `Tooltip` | Collapsed sidebar labels, chart data points |
| `Progress` | Credit usage bar, generation progress |
| `Skeleton` | Loading states throughout |
| `Alert` | Milestone celebrations, system warnings |
| `Accordion` | FAQ sections, settings groups |
| `Avatar` | Brand avatars, user avatar |
| `Separator` | Section dividers |
| `Checkbox` / `Switch` | Settings, platform selection |
| `HoverCard` | Rich previews on social account handles |
| `ScrollArea` | Chat message list, studio gallery overflow |

### 8.2 New Components Needed

These components need to be built for the dashboard. All must conform to DS-2 styling.

#### `DS2Sidebar`

The main sidebar component. Manages expanded/collapsed state, houses the brand switcher, nav items, and user profile.

**Props:**
```typescript
interface DS2SidebarProps {
  brands: Brand[]
  currentBrand: Brand | null
  onBrandChange: (brand: Brand) => void
  currentPath: string
  user: User
  collapsed: boolean
  onToggleCollapse: () => void
  logosHasNotification: boolean
  brandNavCounts?: {
    products?: number
    studio?: number
    scheduling?: number
  }
}
```

**Key Implementation Notes:**
- Fixed position, left 0, full viewport height.
- Width transitions with spring easing between 260px and 64px.
- Text elements use CSS `opacity` transition (not `display: none`) for smooth collapse.
- Icons remain at `left: 32px` always (centered in both states).
- Uses `ScrollArea` for the nav section if it overflows (many brands).
- Must NOT use the shadcn `Sidebar` component. Build custom to ensure full DS-2 compliance and avoid the complexity overhead of shadcn's sidebar (which includes providers, contexts, and opinionated mobile behavior we don't want).

#### `BrandSwitcher`

The dropdown brand selector at the top of the sidebar.

**Props:**
```typescript
interface BrandSwitcherProps {
  brands: Brand[]
  currentBrand: Brand | null
  onSelect: (brand: Brand) => void
  collapsed: boolean
}
```

**Behavior:** Uses the `Select` component internally but with custom trigger and item rendering. Collapsed mode shows only the brand avatar; clicking opens the same dropdown. No subscription tier is shown per brand -- tier is account-level and displayed in the user profile area at the sidebar bottom.

#### `BrandSummaryCard`

A summary card for each brand on the Global Overview.

**Props:**
```typescript
interface BrandSummaryCardProps {
  brand: Brand
  totalFollowers: number
  engagementRate: number
  sparklineData: number[]  // 7 data points for weekly sparkline
  onClick: () => void
}
```

**Visuals:** Card component with brand avatar, name, two stat values (JetBrains Mono), and a mini sparkline (SVG, no axis, just the line and gradient fill). Uses the standard card hover pattern. No tier badge -- subscription tier is account-level, not per-brand.

#### `LogosInsightCard`

The AI insight card that appears on dashboards.

**Props:**
```typescript
interface LogosInsightCardProps {
  message: string
  timestamp: Date
  brandName: string
  ctaLabel?: string
  ctaHref?: string
  showShimmer?: boolean  // For the left border animation
}
```

**Visuals:** Full-width card with 4px gold left border. Logos geometric mark in the top-left corner. Message text in General Sans. Timestamp in caption. CTA as ghost button.

#### `ChatMessageList`

The scrollable chat interface for the Logos page.

**Props:**
```typescript
interface ChatMessageListProps {
  messages: ChatMessage[]
  isTyping: boolean
  suggestedPrompts?: string[]
  onSendMessage: (text: string) => void
  onPromptClick: (prompt: string) => void
}
```

**Key Implementation Notes:**
- Uses `ScrollArea` with auto-scroll to bottom on new messages.
- Messages alternate between `LogosMessage` and `UserMessage` sub-components.
- Typing indicator appears below the last message.
- Suggested prompts appear below the typing indicator position.
- The input is pinned to the bottom of the container (not inside the scroll area).

#### `ContentCalendar`

The weekly/monthly calendar for the Scheduling page.

**Props:**
```typescript
interface ContentCalendarProps {
  view: 'week' | 'month'
  currentDate: Date
  scheduledPosts: ScheduledPost[]
  onDateChange: (date: Date) => void
  onViewChange: (view: 'week' | 'month') => void
  onSlotClick: (date: Date, time?: string) => void
  onPostClick: (post: ScheduledPost) => void
  onPostDrag: (post: ScheduledPost, newDate: Date) => void
}
```

**Key Implementation Notes:**
- Built custom (no third-party calendar library). Calendar libraries impose their own styling that would fight DS-2.
- Weekly view: 7 columns, each a vertical stack of time slots. Posts are absolutely positioned cards within their day column.
- Monthly view: Standard grid. Each cell is a day container with compact post indicators.
- Today is always visually marked (gold left border in weekly, gold bg tint in monthly).
- Transitions between views use crossfade animation.
- Drag-and-drop uses native HTML5 drag API with custom ghost preview.

#### `MasonryGallery`

The image grid for the Studio page (right side) and product detail view (compact, filtered).

**Props:**
```typescript
interface MasonryGalleryProps {
  images: GeneratedImage[]
  columns?: number  // Default 2 in Studio (65% width), 3 on product detail (full width)
  onImageClick: (image: GeneratedImage) => void
  onUseAsReference?: (image: GeneratedImage) => void  // Studio only: "Use as Reference" button
  onSchedule: (image: GeneratedImage) => void
  onDownload: (image: GeneratedImage) => void
  onDelete: (image: GeneratedImage) => void
  draggable?: boolean  // Enable drag-to-reference and drag-to-schedule. Default true in Studio.
}
```

**Key Implementation Notes:**
- CSS multi-column layout (`column-count`) rather than a JavaScript masonry library. CSS columns handle variable-height items naturally and are more performant.
- Each image card uses `break-inside: avoid` to prevent splitting across columns.
- Hover overlay with action buttons uses absolute positioning within the card. When `onUseAsReference` is provided, a "Use as Reference" ghost button (sparkle/wand icon) appears in the overlay alongside Schedule/Download/Delete.
- When `draggable` is true, image cards support HTML5 drag API. On drag start, the generation panel's reference drop zone highlights as a valid target.
- Infinite scroll: uses IntersectionObserver to load more images as the user scrolls.

#### `ImageGenerationPanel`

The generation panel that lives on the left side of the Studio page. Product selection and reference images are both optional.

**Props:**
```typescript
interface ImageGenerationPanelProps {
  products: Product[]              // All brand products for the selector
  preSelectedProduct?: Product     // Pre-selected when navigating from Product detail
  availableCredits: number
  onGenerate: (config: GenerationConfig) => void
  isGenerating: boolean
  generationProgress?: number
  referenceImage?: GeneratedImage  // Set via "Use as Reference" or drag-and-drop
  onReferenceImageChange: (image: GeneratedImage | null) => void
}
```

**Key Implementation Notes:**
- Fixed position within the Studio layout (doesn't scroll with gallery). Scrolls independently if content overflows.
- All configuration options visible in one panel (no tabs or steps).
- Product selector is optional -- users can generate without selecting a product (brand-level images).
- Reference image drop zone accepts drag-and-drop from the gallery grid and click-to-browse.
- Real-time cost calculation updates as options change.
- Uses existing DS-2 components: `ToggleGroup` for quality/ratio, number stepper for quantity.
- Style selector uses a custom card-based grid (each style is a clickable card with a thumbnail).
- Generate button shows progress bar during generation.

#### `ActivityFeed`

A simple timeline of recent events for the Global Overview.

**Props:**
```typescript
interface ActivityFeedProps {
  events: ActivityEvent[]
  maxItems?: number
}
```

**Visuals:** Simple list, no cards. Each row: timestamp (JetBrains Mono, caption size, muted) | icon (contextual: image icon for generation, calendar for scheduling, chart for analytics) | description (General Sans, body-sm). Rows separated by barely-visible dividers (6% gold border).

#### `BrandVoiceBanner`

Collapsible banner at the top of the Logos chat showing the brand's voice profile.

**Props:**
```typescript
interface BrandVoiceBannerProps {
  voiceProfile: BrandVoiceProfile
  onEditClick: () => void
  defaultCollapsed?: boolean
}
```

**Visuals:** Slim horizontal bar, card background, collapsible with accordion-style animation. Voice attributes displayed as inline labels. "Edit" ghost button.

### 8.3 Components NOT Needed

The shadcn `Sidebar` component should NOT be installed. Its provider/context pattern, opinionated mobile behavior, and default styling would require extensive overriding to match DS-2. Building a custom `DS2Sidebar` is less code and ensures full control.

The `NavigationMenu` component is not needed. The sidebar handles all navigation. The top header uses `Breadcrumb`, not a nav menu.

No third-party calendar component is needed. `ContentCalendar` is built custom to ensure DS-2 compliance.

No third-party chat UI library is needed. The chat interface is simple enough (message list + input) that building custom is cleaner than adapting a library.

---

## 9. Anti-Patterns

These are the "never do" rules for the PixelPrism dashboard. Violating any of these means the implementation has drifted from the design intent.

### 9.1 Navigation Anti-Patterns

1. **Never use horizontal tabs as primary navigation.** Tabs are for content modes within a page (line variant) or filters (default variant). The sidebar is the only primary navigation structure.

2. **Never nest more than 3 levels in the URL.** `/dashboard/[brand]/products/[id]` is three levels (the maximum). If a feature requires deeper nesting, rethink the information architecture.

3. **Never hide the brand context.** The user must always know which brand they're looking at. The sidebar brand switcher is always visible (expanded: full info, collapsed: avatar). The breadcrumb always starts with the brand name.

4. **Never auto-collapse the sidebar on page navigation.** The sidebar state is user-controlled and persistent across page loads (stored in local storage).

5. **Never show a "hamburger menu" on desktop.** The sidebar is always visible on screens >= 1024px. Hamburger menus are for mobile only.

### 9.2 Data Display Anti-Patterns

6. **Never show more than 4 stat cards in a single row.** Four is the maximum for a row before the cards become too narrow to display their content meaningfully. Use 3 when possible.

7. **Never display a number without context.** "4,521" is meaningless. "4,521 followers (+12%)" has context. Every data point needs either a trend, a comparison, or a descriptive label.

8. **Never use pie charts or donut charts.** The DS-2 system uses area charts and bar charts only. Pie charts are excluded by design.

9. **Never show monetary values without currency context.** "$47 remaining" not "47 remaining." Credits are the exception -- they're a synthetic unit and should be labeled as "47 credits" not "$47."

10. **Never use red for anything other than errors and destructive actions.** Red (`#e85454`) is reserved for failed states, delete actions, and error messages. Never use it for data that's declining (use coral `#e8956a` for mild warnings, or simply show the downward trend without color alarm).

### 9.3 Interaction Anti-Patterns

11. **Never open a new browser tab for internal navigation.** All navigation within the dashboard is in-app. External links (e.g., "View on Instagram") open in new tabs; internal navigation never does.

12. **Never use confirmation dialogs for reversible actions.** If an action can be undone (archive, pause, unschedule), do it immediately and show a toast with an "Undo" action. Confirmation dialogs are reserved for irreversible actions only (delete, disconnect account).

13. **Never show a loading spinner for operations under 300ms.** If data typically loads in under 300ms, show the content directly. Adding a spinner for fast operations creates perceived slowness.

14. **Never leave the user without feedback after an action.** Every button click, every form submission, every drag-and-drop must produce feedback: a toast, a state change, an animation, or a redirect. Silence after action is the worst UX failure.

15. **Never use infinite scroll on pages with actionable items at the bottom.** Studio's gallery grid uses infinite scroll (browse mode). The Analytics page does NOT -- it has the Logos insights card at the bottom that the user needs to reach. Use pagination or a "Load More" button when content exists below the scrollable area.

### 9.4 Emotional Anti-Patterns

16. **Never use aggressive upgrade prompts.** When the user hits a plan limit (brands, credits, social accounts), show a calm, informational message: "You've used all 3 of your Starter plan brands. Upgrade to Professional for up to 10." Never use modal overlays, countdown timers, or loss-aversion language ("You're missing out!").

17. **Never celebrate trivially.** Confetti and celebrations for "first post scheduled" or "first image generated" are patronizing. Reserve celebrations for genuine milestones: 1K/5K/10K followers, first viral post, brand voice setup complete.

18. **Never make the user feel behind.** No "you haven't posted in X days" guilt messaging. If activity is low, Logos can gently note: "Your audience engages most on Tuesdays -- want me to suggest something to post?"

19. **Never make Logos apologize.** "Sorry, I don't have enough data" is weak. "I'll have better insights after a few more posts" is confident and forward-looking.

20. **Never show an empty chart.** If there's no data for a chart, don't render an empty grid with flat zero lines. Show a meaningful empty state: "Follower data will appear here once you connect a social account."

### 9.5 Design System Anti-Patterns

These reiterate the inviolable rules from `vibe-spec.md` in the context of the dashboard:

21. **Never use `rounded-*` classes anywhere.** Zero border-radius, always, on everything. The sidebar, the brand switcher dropdown, the chat bubbles, the calendar cells, the studio image overlays. Zero.

22. **Never use `ease` or `ease-in-out` for interactive transitions.** Spring easing on everything interactive. The only exception is data visualization animations (chart line draws) which may use smooth non-spring easing.

23. **Never use gray or white borders.** Every border is `#f4b964` at an opacity from the defined scale.

24. **Never use single-layer shadows.** Except on toasts.

25. **Never display data numbers in General Sans or Neue Montreal.** Data is JetBrains Mono. Always.

---

*This document governs the UX design of the PixelPrism dashboard. When in doubt, refer to `vibe-spec.md` for design system rules and this document for interaction and layout decisions. When this document and an implementation disagree, this document is correct.*
