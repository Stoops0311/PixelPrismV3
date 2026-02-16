# PixelPrism Dashboard Build Tasks

## What Is PixelPrism?

PixelPrism is a social media marketing tool built for small and medium businesses (SMBs) who want to grow their brand through organic marketing. It is not an enterprise analytics suite — it is a hands-on companion that helps business owners build their presence, create content, and understand what's working.

### Core Concept

The app revolves around three pillars:

1. **Brand Voice & AI Companion ("Logos")** — An AI chatbot that lives inside each brand. During onboarding, Logos helps the user define their brand's voice, tone, and audience. After that, Logos stays available as a marketing companion: offering post suggestions, analyzing performance, generating weekly reports, and celebrating wins. Logos is the soul of the product.

2. **AI Image Generation** — Users add products to their brands and generate marketing images for those products using AI. Generation costs credits (a currency tied to their subscription). Users control style, quality, aspect ratio, and quantity — and see the cost in real-time before committing.

3. **Scheduling & Analytics** — Users connect their social media accounts, schedule posts using generated images, and track how their brand is growing across platforms. Logos interprets the analytics and gives actionable advice.

### Data Hierarchy

```
User (subscription is account-level: Starter / Professional / Enterprise — determines brand limit, credit allowance, social account limit)
  └── Brands
        ├── Brand Voice (defined via Logos conversation)
        ├── Products
        │     └── Generated Images (costs credits, generated in Studio)
        ├── Connected Social Accounts
        ├── Scheduled Posts
        └── Analytics (per-platform)
```

### Tech Stack

- **Framework:** Next.js 16, App Router, React 19, TypeScript
- **Styling:** Tailwind CSS v4 (CSS-based config, no `tailwind.config.ts`), custom design system "Studio Brutalist" (DS-2)
- **Components:** shadcn/ui (37 primitives installed) + 11 custom DS2 components
- **Icons:** Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`)
- **Auth:** Clerk (`@clerk/nextjs`)
- **Backend:** Convex (realtime database)
- **Payments:** Polar (subscription tiers + credits)
- **Package manager:** Bun

### Design System — "Studio Brutalist" (DS-2)

The design system is fully documented in `docs/vibe-spec.md`. Key rules that must NEVER be broken:

- **Zero border-radius on everything.** No exceptions. No `rounded-sm`. Zero.
- **Spring easing** `cubic-bezier(0.34, 1.56, 0.64, 1)` on all interactive transitions. Never `ease` or `ease-in-out`.
- **Gold-tinted borders** (`#f4b964` at varying opacities). Never gray or white borders.
- **Dual-layer shadows** on all elements (except toasts).
- **translateY micro-interactions** on all clickable elements: `-2px` hover, `+1px` active.
- **Hard invert pattern** on primary buttons: filled becomes outlined on hover.
- **Fonts:** Neue Montreal (headings/labels), General Sans (body text from H4 down), JetBrains Mono (all data/numbers).
- **Colors:** Background `#071a26`, Card `#0e2838`, Popover `#163344`, Primary gold `#f4b964`, Accent coral `#e8956a`, Muted teal `#6d8d9f`.

### Critical Reference Files

| File | Purpose |
|------|---------|
| `docs/vibe-spec.md` | **Authoritative design spec.** Read before building anything. |
| `docs/dashboard-ux-story.md` | **Full UX story for the dashboard.** Page-by-page interaction design, component specs, anti-patterns. |
| `styles/ds2-theme.css` | All DS-2 CSS: variables, fonts, component overrides, keyframes |
| `app/design-ref/page.tsx` | Living reference showing how DS-2 components look and are used |
| `components.json` | shadcn configuration |
| `CLAUDE.md` | Project-level instructions for Claude Code instances |

### Existing DS2 Components (reuse these)

Located in `components/ds2/`:
- `DS2PageLayout` — Page wrapper with nav, theme provider, centered content
- `DS2Navigation` — Top navbar (used on landing page, NOT in dashboard)
- `DS2Section` — Section container with label/title/subtitle
- `DS2ThemeProvider` — Wraps children in `.sb-root` class + Sonner toaster
- `DS2StatCard` — KPI card with label, value, trend, badge, action
- `DS2DataTable` — Typed table with columns, pagination, row hover patterns
- `DS2AreaChart` — Area chart with DS-2 styling
- `DS2BarChart` — Bar chart with DS-2 styling
- `StatusBadge` — Pre-configured status badges (Live, Scheduled, Draft, Failed, Trending, New, Pro)
- `DS2Spinner` — Loading spinner with bouncing square dots
- Toast helpers: `showSuccess`, `showError`, `showInfo` in `components/ds2/toast.ts`

### Button Styling

Buttons use CSS classes, NOT shadcn variants:
```tsx
<Button className="sb-btn-primary">Primary</Button>
<Button className="sb-btn-secondary">Secondary</Button>
<Button className="sb-btn-ghost">Ghost</Button>
<Button className="sb-btn-destructive">Destructive</Button>
```

### Path Aliases

`@/*` maps to project root. Example: `@/components/ui/button`, `@/components/ds2/stat-card`, `@/lib/utils`.

---

## Task List

All tasks produce **static/mock-data pages** with proper DS-2 styling and working navigation. No backend wiring, no real API calls, no Convex queries — just the visual shell with hardcoded sample data.

Every task should read `docs/vibe-spec.md` and the relevant section of `docs/dashboard-ux-story.md` before writing any code.

---

### Task 1: Dashboard Layout Shell + Custom Sidebar

**Priority:** Must be done first. Everything depends on this.

**Read:** `docs/dashboard-ux-story.md` Section 2 (Navigation Architecture) + Section 8.2 (`DS2Sidebar`, `BrandSwitcher` component specs)

**What to build:**

**1a. Route structure** — Create the Next.js App Router folder structure:
```
app/dashboard/
  layout.tsx          ← Shared layout (sidebar + header + main content area)
  page.tsx            ← Global Overview (placeholder)
  brands/page.tsx     ← Brands List (placeholder)
  billing/page.tsx    ← Billing & Credits (placeholder)
  [brandSlug]/
    page.tsx          ← Brand Dashboard (placeholder)
    logos/page.tsx     ← Logos Chat (placeholder)
    products/page.tsx  ← Products List (placeholder)
    studio/page.tsx    ← Studio (placeholder, renamed from Gallery)
    scheduling/page.tsx ← Scheduling (placeholder)
    analytics/page.tsx  ← Analytics (placeholder)
```

Each placeholder page should render a simple page shell inside the layout: page title in `sb-h1` and a subtitle in `sb-body` with muted color saying what will go here. Wrap everything in the DS2ThemeProvider / `.sb-root`.

**1b. DS2Sidebar component** (`components/ds2/sidebar.tsx`):
- Fixed position, left-anchored, full viewport height
- Two states: expanded (260px) and collapsed (64px)
- User-controlled toggle via button at bottom of sidebar
- Collapse state persisted in localStorage
- Spring-eased width transition (300ms)
- Text labels fade at 150ms (collapse) / appear at 200ms (expand) via opacity, NOT display:none
- Icons always centered at 32px from left edge — they don't move during collapse
- Background: `#0e2838`, right border: `rgba(244, 185, 100, 0.08)`, NO shadow
- **Sections:**
  - Logo header zone (64px height): PixelPrism logo/text + collapse toggle
  - Brand Switcher area (see 1c)
  - Gold divider (`rgba(244, 185, 100, 0.08)`)
  - "BRAND" section label (coral `#e8956a`, `sb-label` typography)
  - Brand nav items: Dashboard, Logos (with notification dot), Products (with count), Studio (with count, renamed from Gallery), Scheduling (with count), Analytics
  - Gold divider
  - "ACCOUNT" section label
  - Account nav items: Overview, All Brands, Billing & Credits
  - User profile footer: avatar, name, email, account-level tier badge (StatusBadge — "Professional"), settings + sign out icons
- **Nav item states:**
  - Active: 3px gold left bar (scaleY animation from top), text `#eaeef1`, bg `rgba(244, 185, 100, 0.04)`
  - Hover: text `#d4dce2`, `translateY(-1px)`, bg `rgba(244, 185, 100, 0.02)`
  - Default: text `#6d8d9f`
- Count badges: JetBrains Mono 11px, inside subtle container (`rgba(244, 185, 100, 0.06)` bg, `rgba(244, 185, 100, 0.08)` border)
- Logos notification dot: 6x6 gold pulsing square (reuse the Live badge pulse animation)
- Below 1024px: sidebar becomes a Sheet overlay from left, triggered by hamburger icon in header
- Use Hugeicons for all nav icons

**1c. BrandSwitcher component** (`components/ds2/brand-switcher.tsx`):
- Sits below the logo, above nav items
- Shows: brand avatar (36x36 square, zero radius), brand name (`sb-h4`), secondary line (`sb-caption` muted — connected platform count or tagline), chevron-down. No subscription tier — tier is account-level, shown in user profile area at sidebar bottom.
- Click opens a dropdown listing mock brands: avatar, name, follower count (JetBrains Mono). No tier badge per brand.
- "Create New Brand" action at bottom separated by gold divider, ghost button style with `+` icon. Shows brand limit parenthetical if near/at limit: "Create New Brand (2 of 3 used)"
- Collapsed state: only brand avatar visible, click still opens dropdown
- Use mock data: 2-3 fake brands ("Sunrise Coffee Co", "Coastal Surf Shop", "Mountain Yoga Studio")

**1d. Contextual top header** (part of `layout.tsx` or its own component):
- 64px height, `position: sticky; top: 0; z-index: 50`
- Background: `#071a26` at 95% opacity + `backdrop-blur-sm`
- Bottom border: `rgba(244, 185, 100, 0.08)`
- Left side: Breadcrumb trail using existing `Breadcrumb` component (brand name → current page)
- Right side: Credits indicator (JetBrains Mono number + gold spark/bolt icon), action button slot (varies by page), notifications bell icon with optional gold dot
- Content area left padding matches sidebar width (260px / 64px) so content aligns with main area below

**1e. Main content area:**
- Takes remaining viewport width after sidebar
- Scrollable, with padding matching DS-2 page structure (`px-8`, `py-16`)
- Max width `max-w-7xl`, centered
- Responds to sidebar collapse/expand (width transition matches sidebar's 300ms spring)

**Mock data to hardcode:** 2-3 brands with names/avatar initials, a fake user (name, email, account tier "Professional"), sample counts (12 products, 47 images, 3 upcoming posts), credit balance (247).

---

### Task 2: Global Overview Page

**Read:** `docs/dashboard-ux-story.md` Section 3.1 (Global Overview)

**File:** `app/dashboard/page.tsx`

**What to build:**

- **Time-of-day greeting** in `sb-h1`: "Good morning, Jane" / "Good afternoon" / "Good evening" based on current hour
- **Top stat row** — 3x `DS2StatCard`:
  - Credits Remaining: "247" with gold color, trend +15 this month
  - Total Followers (all brands): "12,847" with trend up 8.3%
  - Engagement Rate: "4.2%" with trend up 0.5%
- **Brand summary cards** — Horizontal row of cards (one per mock brand). Each shows: brand avatar (square, initials), brand name, total followers (JetBrains Mono), engagement rate (JetBrains Mono), and a placeholder for sparkline (a simple SVG line or just a muted "sparkline goes here"). No tier badge per brand — subscription tier is account-level. Cards hover with standard DS-2 card pattern. Clicking would navigate to that brand's dashboard.
- **Logos weekly digest card** — Full-width card with 4px gold left border. Logos geometric mark or icon in corner. One paragraph of mock insight text in General Sans. Timestamp in `sb-caption`. "Chat with Logos" ghost button.
- **Upcoming posts** — Compact `DS2DataTable` with 5 mock rows: brand avatar, platform icon, post preview text (truncated), scheduled time (JetBrains Mono). Use StatusBadge for status column.
- **Activity feed** — Simple list (NOT a table, NOT cards). Each row: timestamp (JetBrains Mono, `sb-caption`, muted) | icon | description (General Sans, `sb-body-sm`). Rows separated by barely-visible dividers. 5-6 mock entries like "Image generated for Summer Collection", "Post published on Instagram", etc.

**Anti-patterns to avoid:** No more than 3 stat cards in the top row. No "getting started" checklist. No auto-play Logos chat.

---

### Task 3: Brands List Page

**Read:** `docs/dashboard-ux-story.md` Section 3.2 (Brands List)

**File:** `app/dashboard/brands/page.tsx`

**What to build:**

- **Page header** via the top bar breadcrumb: "Brands". Count shown as "3 brands" in JetBrains Mono. "Create Brand" primary button in header action slot.
- **Brand cards grid** — 3-column grid (`gap-6`). Each card:
  - Brand avatar (48x48, square, initials)
  - Brand name (`sb-h3`)
  - Connected platforms: small platform icon row (mock: Instagram, TikTok icons)
  - Key stats: followers, posts this month, images generated (JetBrains Mono, `sb-data`)
  - Last active timestamp (`sb-caption`, muted)
  - Kebab menu (three dots) with dropdown: Edit Brand, Duplicate, Archive, Delete (destructive red)
- Full card is clickable (navigates to brand dashboard). Standard DS-2 card hover: `translateY(-2px)`, shadow base→elevated, border 12%→22%, gold bloom.
- "Create Brand" button opens a Dialog (mocked — just the dialog shell with a two-step form: Brand Name + Description → Upload Logo. No "Select Subscription Tier" step — tier is account-level. No real submission).

**Anti-patterns:** Cards not a table. No per-card upgrade prompts. No tier badges per card. Single clear account-level message if brand limit reached: "You're using 3 of 3 brands on the Starter plan."

---

### Task 4: Billing & Credits Page

**Read:** `docs/dashboard-ux-story.md` Section 3.3 (Billing and Credits)

**File:** `app/dashboard/billing/page.tsx`

**What to build:**

- **Top row — two cards side by side:**
  - Left: Large credit stat card. Credit count "247" in JetBrains Mono 36px gold. Progress bar showing usage (153 of 400 used). "Buy Credits" primary button beside the stat (not below).
  - Right: Current plan card. Plan name "Professional", price "$29/mo", renewal date, what's included (10 brands, 400 credits/mo, 15 social accounts). "Change Plan" secondary button.
- **Usage breakdown** — Tabs (line variant):
  - Credits tab: `DS2BarChart` of daily credit usage (30 mock data points). Below it, `DS2DataTable` of recent credit transactions: date, action description ("4 images generated for Summer Collection (HD, 16:9)"), credits used (JetBrains Mono). 5-6 mock rows.
  - Brands tab: Simple progress indicator — "3 of 10 brands used"
  - Social Accounts tab: Simple progress indicator — "7 of 15 accounts connected"
- **Billing history** — `DS2DataTable` at the bottom. Columns: date, amount ($29.00), status (StatusBadge: paid/pending), download link. 3-4 mock rows.

**Micro-interaction:** Credit progress bar should animate from 0 to value on load (CSS animation). If credits below 20%, bar color shifts to coral. Below 5%, shifts to red.

---

### Task 5: Brand Dashboard Page

**Read:** `docs/dashboard-ux-story.md` Section 4.1 (Brand Dashboard)

**File:** `app/dashboard/[brandSlug]/page.tsx`

**What to build:**

This is the page users land on when they select a brand. It's a pulse check — "how is this brand doing right now?"

- **Pulse stat row** — 3x `DS2StatCard`:
  - Total Followers: "5,247" with StatusBadge "Live" (pulsing dot), trend up 12.5%
  - Engagement Rate: "4.7%" with trend down 0.3%, description "Across all platforms this week"
  - Credits Remaining: "247" with caption "Account-wide"
- **Logos Insight Card** — Full-width card, 4px gold left border with a slow shimmer animation (CSS gradient moving top-to-bottom on the border over 3s, looping). Logos icon/mark in corner. Mock insight text: "Your Instagram engagement spiked 34% after Tuesday's product shot. That warm-toned, close-up style is resonating -- I'd suggest generating more images in that direction." Timestamp. "Chat with Logos" ghost button.
- **Two-column layout below:**
  - Left (60%): Mini content calendar — next 7 days shown as a simple row/grid. Days with scheduled posts show a 6x6 gold square indicator. 2-3 mock posts on different days. Clicking would go to Scheduling.
  - Right (40%): Recent from Studio strip — 4 image placeholder thumbnails (colored gradient rectangles) with `sb-caption` labels. Clicking would go to Studio.
- **Platform performance row** — One compact card per connected platform (mock 3: Instagram, TikTok, Facebook). Each shows: platform icon, follower count (JetBrains Mono), weekly change (+/- with trend arrow), and a mini `DS2AreaChart` in compact mode (no legend, no axis labels, just the curve and gradient fill, small height ~80px).

**Special attention needed:** The Logos Insight Card shimmer border is a signature moment. The stat cards should stagger their load animation (fade in left-to-right, 100ms gap, each from `translateY(8px)` settling to `translateY(0)`).

---

### Task 6: Logos Chat Page

**Read:** `docs/dashboard-ux-story.md` Section 4.2 (Logos Chat) + Section 6 (Logos AI Presence)

**File:** `app/dashboard/[brandSlug]/logos/page.tsx`

This is the most distinctive page in the app. It must feel like talking to a knowledgeable friend, not using a chatbot widget.

**What to build:**

- **Brand Voice Banner** (`components/ds2/brand-voice-banner.tsx`):
  - Slim horizontal bar at top of chat, card background, collapsible (accordion-style)
  - Shows: "Voice: Warm, approachable, slightly playful. Audience: 25-40, coffee enthusiasts."
  - "Edit" ghost button
  - Default expanded, click to collapse

- **Chat Message List** — Full main content width, scrollable area:
  - **Logos messages** (left-aligned): No avatar per message. Background `rgba(244, 185, 100, 0.04)`, left border 3px `rgba(244, 185, 100, 0.12)`. Text in General Sans `sb-body` with relaxed line-height (1.7). Any numbers in messages use JetBrains Mono inline.
  - **User messages** (right-aligned): Background `#163344`, no left border.
  - Mock a conversation: 4-6 messages alternating between Logos and user. Include one Logos message with inline data numbers, and one that references a "weekly report" with a card-like layout inside the message (title, mini stat grid, summary).
  - **Logos typing indicator**: Three 6x6 gold squares pulsing in sequence (staggered by 200ms). Use the same scale(1)→scale(1.3)→scale(1) animation as the Live status dot.

- **Suggested prompts** — Below the last message, 2-3 ghost-styled pill buttons: "What should I post this week?", "How's my Instagram doing?", "Help me refine my brand voice"

- **Input area** — Pinned to bottom. Use `InputGroup` with textarea variant (matching the design-ref "Ask, Search or Chat..." pattern). `+` button for attachments, gold send arrow.

**Anti-patterns:** Full page, NOT a sidebar widget. No Logos avatar on every message. No markdown code blocks. No "clear conversation" button in easy reach. Logos doesn't say "Hello! How can I help?" on load — it shows conversation history.

---

### Task 7: Products Page

**Read:** `docs/dashboard-ux-story.md` Section 4.3 (Products)

**Files:** `app/dashboard/[brandSlug]/products/page.tsx`

**What to build:**

- **Product card grid** — 3-column grid. Each card:
  - Product image (gradient placeholder, filling the card top edge-to-edge)
  - Product name (`sb-h4`)
  - Brief description (`sb-body-sm`, truncated 2 lines)
  - Image count: "12 images" in `sb-caption` with small gallery icon
  - "Open in Studio" secondary button at card bottom (navigates to Studio with this product pre-selected)
  - Hover: standard DS-2 card hover + product image scales to 1.02

- Mock 4-5 products: "Summer Cold Brew", "Espresso Blend", "Ceramic Pour-Over Set", "Gift Card", "Coffee Subscription Box"

- **Page header:** "Products" with count "5 products" (JetBrains Mono). "Add Product" primary button in header action slot.

- "Add Product" opens a Dialog with a simple form (product name input, description textarea, image upload placeholder). No real submission.

Product cards link to `/dashboard/[brandSlug]/products/[id]` — the detail page is built in Task 7b below.

---

### Task 7b: Product Detail Page

**Read:** `docs/dashboard-ux-story.md` Section 4.3 (Products — "Product Detail View" subsection)

**File:** `app/dashboard/[brandSlug]/products/[id]/page.tsx`

**Depends on:** Task 7 (Products grid page must exist for navigation context)

The product detail page shows product info and its generated images. Image generation does NOT happen here — it lives exclusively in Studio (Task 8). This page links to Studio with the product pre-selected.

**What to build:**

- **Product header** — Two-column layout:
  - Left (40%): Large product image (gradient placeholder, square)
  - Right (60%): Product name (`sb-h2`), description (`sb-body`), metadata row: creation date (`sb-caption` muted), total images generated (JetBrains Mono), total credits spent on this product (JetBrains Mono)

- **"Open in Studio" primary button** — Below the header. Full-width `sb-btn-primary`. Navigates to `/dashboard/[brandSlug]/studio` with this product pre-selected in the generation panel's product dropdown. Standard primary button hover (hard invert + `translateY(-2px)` + gold bloom).

- **Product image gallery** — Below the button, a compact masonry grid of all images generated for this product. Reuse the `MasonryGallery` component from Task 8, filtered to this product. 3 columns at full page width. Mock 6-8 images with varied aspect ratios. Browse only — no "Use as Reference" or drag interactions on this page (those are Studio-only).

**Anti-patterns:**
- Do NOT put image generation controls on this page. Generation lives exclusively in Studio.
- Do NOT auto-generate on product creation. Always explicit with clear cost, performed in Studio.

---

### Task 8: Studio Page (renamed from Gallery)

**Read:** `docs/dashboard-ux-story.md` Section 4.4 (Studio)

**File:** `app/dashboard/[brandSlug]/studio/page.tsx` + `components/ds2/image-generation-panel.tsx`

> **Rename note:** This page was previously called "Gallery." It has been renamed to **Studio** and expanded to include image generation alongside browsing. The `ImageGenerationPanel` component that was previously planned for the Product detail page now lives here instead. Studio is the single place for all image generation.

**What to build:**

This page uses a **side-by-side split layout**: generation panel on the left (35% width), gallery grid on the right (65% width).

**8a. ImageGenerationPanel component** (`components/ds2/image-generation-panel.tsx`):
Fixed-position left panel that scrolls independently. All options visible on ONE screen — no tabs, no steps.

  - **Section header:** "Generate" in `sb-h3`.
  - **Product selector (optional):** `Select` dropdown listing all brand products + "No product" default. When selected, small 32x32 thumbnail appears beside it. Product is NOT required — users can generate brand-level images without a product.
  - **Reference image area (optional):** A drop zone (dashed gold border at 8% opacity). Accepts: images dragged from the gallery grid, or click to open a picker. When a reference is set, shows 120px-wide thumbnail with "X" to remove. Caption: "New images will use this as style reference."
  - **Style selector:** Grid of visual option cards ("Product Shot", "Lifestyle", "Flat Lay", "Abstract"). Each is a small square card with a gradient placeholder thumbnail and a label. Selected state: gold border at 45% opacity. Unselected: standard 12% border. Click triggers gold border flash (45% -> eases to 22% over 300ms).
  - **Quality selector:** `ToggleGroup` — "Standard" / "HD" / "Ultra". Each shows credit cost in JetBrains Mono (e.g., "Standard (1 cr)" / "HD (3 cr)" / "Ultra (5 cr)").
  - **Aspect ratio selector:** `ToggleGroup` — "1:1" / "4:5" / "16:9" / "9:16". Each shows credit cost if it differs.
  - **Quantity:** Number stepper (matching design-ref pattern — `sb-number-stepper` with −/+/input). Min 1, max configurable.
  - **Total cost display:** Summary line: "4 images, HD, 16:9 = 12 credits" in JetBrains Mono. Below: "247 credits remaining → 235 after this" in muted JetBrains Mono. Cost updates in real-time as options change (counter-roll animation, 200ms).
  - **Generate button:** Full-width `sb-btn-primary`. During mock "generation": text changes to "Generating...", gold progress bar fills at button bottom. After 2-3 second mock delay, success state.
  - **Insufficient credits warning:** If total cost > remaining credits, cost text turns coral (`#e8956a`), generate button disabled, message: "Not enough credits. You need X more." with "Buy Credits" ghost button.

**Props for ImageGenerationPanel:**
```typescript
interface ImageGenerationPanelProps {
  products: Array<{ name: string; id: string; image?: string }>
  preSelectedProduct?: { name: string; id: string }
  availableCredits: number
  onGenerate: (config: GenerationConfig) => void
  isGenerating: boolean
  generationProgress?: number
  referenceImage?: { id: string; url: string; alt: string }
  onReferenceImageChange: (image: { id: string; url: string; alt: string } | null) => void
}

interface GenerationConfig {
  style: string
  quality: 'standard' | 'hd' | 'ultra'
  aspectRatio: '1:1' | '4:5' | '16:9' | '9:16'
  quantity: number
  productId?: string
  referenceImageId?: string
}
```

**8b. Gallery grid (right side, 65% width):**

- **Filter bar** — Slim horizontal bar at top:
  - Product filter: `Select` dropdown — "All Products" + product names
  - Status filter: `ToggleGroup` — "All" / "Ready" / "Scheduled" / "Posted"
  - Sort: `Select` — "Newest" / "Oldest" / "Most Used"
  - View toggle: `ToggleGroup` with grid/list icons

- **Masonry image grid** — CSS multi-column layout (`column-count: 2` in the 65% width, `break-inside: avoid`). NOT a uniform grid — images have different aspect ratios (mock with different-height colored gradient rectangles).
  - Each image card: image fills edge-to-edge, slim footer with product name (`sb-caption`), date (`sb-caption` muted), status indicator (small colored square: gold=ready, coral=scheduled, teal=posted)
  - Hover: `scale(1.015)` (NOT translateY), semi-transparent dark overlay fades in with centered action buttons: **"Use as Reference"** (ghost, sparkle/wand icon), "Schedule Post" (primary), "Download" (secondary), "Delete" (ghost destructive)
  - Images are **draggable** (HTML5 drag API) — can be dragged into the generation panel's reference drop zone

- **List view** (when toggled): `DS2DataTable` with columns: thumbnail (64x64), product name, aspect ratio, status badge, date, actions dropdown (includes "Use as Reference").

- Mock 12-15 image entries with varied aspect ratios and statuses.

**8c. Image-as-Reference interactions:**

Two methods for setting a reference image:

1. **Click "Use as Reference":** Ghost button in hover overlay. Clicking animates a ghost copy (40% opacity) from gallery position to reference drop zone (spring easing, 400ms, shrinking). Gold glow on zone. Toast: "Reference image set."
2. **Drag from gallery:** On drag start, reference drop zone highlights with pulsing dashed gold border (12% -> 22% opacity, 800ms loop), label: "Drop here to use as reference." Ghost preview (60% opacity) follows cursor. On drop: gold glow + toast.

**Discoverability micro-interactions:**
- First visit (per session): reference drop zone does one slow border pulse (6% -> 14% -> 6%, 2s). Placeholder text: "Drop an image here or click to browse" with arrow icon.
- Connector line hint: when hovering a gallery image with empty reference zone, faint 1px gold line (6% opacity) briefly appears between them. First 3 hovers per session only.

**Image arrival animation** (for when mock images "appear"): each image fades in with `scale(0.95), opacity: 0 → scale(1), opacity: 1`, staggered by 200ms.

**Anti-patterns:** No uniform-height grid cells. No pagination — infinite scroll (can be added later). No file metadata on grid cards. Do NOT make the generation panel collapsible — always visible. Do NOT bury credit cost. Do NOT require product selection.

---

### Task 9: Scheduling Page

**Read:** `docs/dashboard-ux-story.md` Section 4.5 (Scheduling)

**File:** `app/dashboard/[brandSlug]/scheduling/page.tsx`

**What to build:**

- **Header controls:**
  - View toggle: `ToggleGroup` — "Week" (default) / "Month"
  - Date navigation: left/right arrows + current date range in JetBrains Mono (e.g., "Feb 10 - 16, 2026")
  - "New Post" primary button in header action slot
  - Connected account indicators: small platform avatars showing which accounts are active

- **Weekly calendar view** (default):
  - 7 columns (Mon-Sun), header row with day names + dates
  - Today highlighted with gold left border on the day column
  - Scheduled posts as cards stacked in their day column: time (JetBrains Mono), image thumbnail (32x32), post text (truncated 1 line), platform icon(s)
  - Post cards use status colors: coral left border = scheduled, teal = posted, red = failed
  - Empty time slots are visually indicated (subtle dashed border)
  - Post card hover: standard DS-2 card hover + thumbnail scales 1.05

- **Monthly calendar view:**
  - Standard grid. Each day cell shows post count + tiny thumbnail dots (max 3 visible, "+2 more")
  - Today has gold background tint

- Mock 6-8 scheduled posts spread across the current week. Mix of platforms (Instagram, TikTok, Facebook) and statuses.

- **Post Composer Sheet** — triggered by "New Post" button or clicking a time slot. Sheet slides from right. Contains:
  - Image attachment area (placeholder drop zone or "Choose from Studio" button)
  - Caption textarea with character count
  - Platform selector: checkboxes with platform icons
  - Date + time inputs
  - "Schedule" primary button + "Save Draft" secondary button
  - Placeholder for Logos suggestion card below the textarea

**Anti-patterns:** Default to weekly view, not monthly. Composer is a Sheet, not a new page. Don't require platform selection before entering content.

---

### Task 10: Analytics Page

**Read:** `docs/dashboard-ux-story.md` Section 4.6 (Analytics)

**File:** `app/dashboard/[brandSlug]/analytics/page.tsx`

**What to build:**

- **Headline metric** — Single large number at page top: "+1,247 followers this month" in JetBrains Mono 36px, gold color. Trend indicator and comparison to previous period.

- **Filters below headline:**
  - Date range: `ToggleGroup` — "7 days" / "30 days" / "90 days" / "Custom"
  - Platform filter: `ToggleGroup` with platform icons — All / Instagram / TikTok / Facebook

- **Primary chart** — Large `DS2AreaChart` showing follower growth over 30 days, broken down by platform (one line per platform using chart color palette: gold, cyan, coral). Give this chart ~50% of visible viewport.

- **Stat cards row** — 4x `DS2StatCard`:
  - Engagement Rate: "4.7%" with trend
  - Total Reach: "45,210" with trend
  - Posts Published: "23" with comparison "vs 18 last month"
  - Best Performing Post: mock thumbnail + "3.2K engagements"

- **Two-column detail section:**
  - Left: `DS2BarChart` — Engagement breakdown (Likes, Comments, Shares, Saves, Views)
  - Right: `DS2DataTable` — Top performing content. Columns: thumbnail, caption (truncated), platform, reach (JetBrains Mono), engagement rate (JetBrains Mono), date. 5 mock rows.

- **Logos Analytics Card** at bottom — Similar to the insight card but with 3-5 bullet points of mock analysis:
  - "Your Tuesday and Thursday posts get 2.3x more engagement than other days."
  - "Product shots outperform lifestyle images by 40% on Instagram."
  - "Consider posting more Reels -- your Reel engagement is 3x your photo engagement."

**Anti-patterns:** Only ONE primary chart above the fold. No pie/donut charts. No raw numbers without context. Logos insights fully visible, not collapsed.

---

### Task 11: Empty States

**Read:** `docs/dashboard-ux-story.md` Section 5 (Empty States and Onboarding)

This task adds proper empty states to the pages built in Tasks 2-10. It should be done AFTER those pages exist.

**What to build:**

For each page, add a conditional empty state that can be toggled (e.g., via a mock data flag or query param) to see what the page looks like with no data.

- **Global Overview (no brands):** Stat cards show credits (real), "0 brands" with "Create your first brand to get started", and a "Create Your First Brand" primary button card. Visual walkthrough below: three horizontal panels explaining the app flow. Logos card says: "Welcome to PixelPrism. I'm Logos, your AI marketing companion."

- **Brand Dashboard (no products/images):** Stats show real followers (0 if no social), engagement (0), credits. Logos card active with onboarding message. Mini calendar shows "No posts scheduled yet. Connect your social accounts." with "Connect Accounts" button. Recent from Studio shows "No images generated yet. Head to Studio to start creating." with "Open Studio" button. Empty containers use dashed borders at 12% gold opacity, same height as filled state.

- **Products (no products):** Centered empty state: "No products yet. Add your first product to start generating images." with "Add Product" primary button.

- **Product detail (no images):** Product header + "Open in Studio" button present. Gallery area below: "No images generated yet. Open this product in Studio to start creating." Grid of 6 placeholder rectangles (3x2) with muted dashed borders that pulse subtly.

- **Studio (no images):** Generation panel on left fully functional. Gallery grid on right: "No images generated yet. Configure your options and hit Generate." 6 placeholder rectangles (2x3 in 65% width) with muted dashed borders that pulse.

- **Studio (filter returns nothing):** "No images match this filter." with "Clear Filters" ghost button.

- **Scheduling (no posts):** Empty calendar with placeholder message. "No posts scheduled. Create your first post to get started."

- **Analytics (no data):** "Follower data will appear here once you connect a social account." — no empty chart grids, meaningful text instead.

---

## Task Dependencies

```
Task 1 (Sidebar + Layout)
  ├── Task 2 (Global Overview)
  ├── Task 3 (Brands List)
  ├── Task 4 (Billing & Credits)
  ├── Task 5 (Brand Dashboard)
  ├── Task 6 (Logos Chat)
  ├── Task 7 (Products Grid)
  │     └── Task 7b (Product Detail)
  ├── Task 8 (Studio — renamed from Gallery, includes ImageGenerationPanel)
  ├── Task 9 (Scheduling)
  └── Task 10 (Analytics)
        └── Task 11 (Empty States) — after all pages exist
```

Task 1 must be completed first. Tasks 2-10 can be done in any order after Task 1. Task 7b depends on Task 7. Task 8 (Studio) builds the `ImageGenerationPanel` component that Task 7b's product detail page links to. Task 11 depends on all pages existing.

---

## General Rules for All Tasks

1. **Read `docs/vibe-spec.md` before writing any code.** It is the law.
2. **Read the relevant section of `docs/dashboard-ux-story.md`** for your specific task.
3. **Use mock/hardcoded data everywhere.** No Convex queries, no API calls. Just realistic-looking fake data.
4. **All pages must be wrapped in the dashboard layout** (sidebar + header from Task 1).
5. **Reuse existing DS2 components** (`DS2StatCard`, `DS2DataTable`, `DS2AreaChart`, `DS2BarChart`, `StatusBadge`, etc.) instead of building from scratch.
6. **Use `sb-*` CSS classes for typography** (`sb-h1`, `sb-h2`, `sb-h3`, `sb-h4`, `sb-body`, `sb-body-sm`, `sb-label`, `sb-nav`, `sb-data`, `sb-caption`, `sb-code`).
7. **Use `sb-btn-*` CSS classes for buttons** (`sb-btn-primary`, `sb-btn-secondary`, `sb-btn-ghost`, `sb-btn-destructive`).
8. **Use Hugeicons** for all icons: `import { IconName } from "@hugeicons/core-free-icons"` and `import { HugeiconsIcon } from "@hugeicons/react"`.
9. **Zero border-radius everywhere.** If you see `rounded-*` in your code, it's wrong.
10. **Run `bun run build`** after completing your task to verify no TypeScript errors.
