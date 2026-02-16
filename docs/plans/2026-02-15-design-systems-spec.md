# PixelPrism Design Systems Spec

## Project Context

- **Product:** Social media marketing tool for SMBs (content creation, scheduling, analytics)
- **Stack:** Next.js 16 + Tailwind v4 + shadcn (radix-lyra style, hugeicons)
- **Brand colors:** `#f4b964` (warm gold), `#021823` (deep oceanic dark)
- **Mode:** Dark mode only
- **Components:** All from shadcn — no building from scratch
- **Routes:** `/design-system-1` through `/design-system-5`

## Logo

Geometric prism/pyramid with gold-to-dark gradient and orbital ring. Brand name: PixelPrism. Logo file: `/main-logo.png`

## Font Files

All fonts are in `/public/fonts/`. Use variable woff2 files where available for web:

| Font | Variable File Path | Usage |
|---|---|---|
| Satoshi | `Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff2` | Systems 1, 5 body |
| Clash Display | `ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Variable.woff2` | System 2 headings |
| General Sans | `GeneralSans_Complete/Fonts/WEB/fonts/GeneralSans-Variable.woff2` | System 2 body |
| Neue Montreal | OTF only: `NeueMontreal-*.otf` (Regular, Medium, Bold, Light) | System 3 |
| Gambetta | `Gambetta_Complete/Fonts/WEB/fonts/Gambetta-Variable.woff2` | System 4 headings |
| Switzer | `Switzer_Complete/Fonts/WEB/fonts/Switzer-Variable.woff2` | System 4 body |
| Cabinet Grotesk | `CabinetGrotesk_Complete/Fonts/WEB/fonts/CabinetGrotesk-Variable.woff2` | System 5 headings |
| JetBrains Mono | `JetBrainsMono_Complete/Fonts/WEB/fonts/JetBrainsMono-Variable.woff2` | All systems (data/mono) |

## Shared Requirements for ALL Pages

Each design system page (`/design-system-N`) must showcase:

1. **Typography scale** — all heading levels (Display, H1-H4), body, body small, label/overline, code/data, caption. Show each with the font name, weight, size, and a sample sentence.
2. **Color palette** — visual swatches of all tokens (background, card, popover, primary, secondary, muted, accent, foreground, border, destructive, chart colors). Show hex/rgba values.
3. **Buttons** — all variants (primary, secondary, ghost, destructive, disabled) in default, hover, active, and disabled states. Include icon buttons if the system defines them.
4. **Cards** — sample card with title, description, and action buttons. Show hover state.
5. **Inputs & Form elements** — text input, textarea, select, checkbox, switch/toggle, with labels. Show focus states.
6. **Badges/Tags** — various status badges (scheduled, live, draft, failed).
7. **Table** — sample data table with header, sortable columns, status cells, numeric data, pagination. ~5 rows of mock social media post data.
8. **Charts** — at least 2 chart types (line chart + bar chart minimum). Use mock analytics data (followers over time, engagement by platform).
9. **Notifications/Toasts** — trigger buttons that show toast notifications (info, success, error).
10. **Loading states** — skeleton, spinner, progress bar demos.
11. **Dialog/Modal** — trigger button that opens a sample modal.
12. **Dropdown menu** — sample dropdown with items.
13. **Tooltip** — elements with tooltips.
14. **Navigation** — a sample nav bar/section showing the nav item hover style.

Each page should set its own CSS variables (overriding the shadcn defaults) and load its own fonts via @font-face. The page itself should use a dark background and feel like a living style guide.

### Mock Data

Use this consistent mock data across all 5 systems:

**Table data (Social Posts):**
| Post | Platform | Status | Reach | Engagement | Date |
|---|---|---|---|---|---|
| Summer Collection Launch | Instagram | Live | 12,450 | 8.2% | Feb 12, 2026 |
| Behind the Scenes | TikTok | Scheduled | -- | -- | Feb 16, 2026 |
| Customer Spotlight: Maria | Facebook | Live | 3,820 | 5.1% | Feb 10, 2026 |
| Product Tutorial #4 | Instagram | Draft | -- | -- | -- |
| Weekend Flash Sale | Instagram | Failed | 0 | 0% | Feb 14, 2026 |

**Chart data (Followers over 7 days):**
| Day | Instagram | TikTok | Facebook |
|---|---|---|---|
| Mon | 10200 | 5400 | 8100 |
| Tue | 10350 | 5520 | 8090 |
| Wed | 10500 | 5800 | 8150 |
| Thu | 10450 | 6100 | 8200 |
| Fri | 10800 | 6400 | 8180 |
| Sat | 11200 | 6900 | 8250 |
| Sun | 11500 | 7200 | 8300 |

**Chart data (Engagement by type):**
| Type | Count |
|---|---|
| Likes | 4520 |
| Comments | 890 |
| Shares | 340 |
| Saves | 1200 |
| Clicks | 2100 |

---

## Design System 1: "Precision" — Technical & Data-Forward

**Route:** `/design-system-1`
**Philosophy:** The tool feels engineered. Every pixel is intentional. Nothing decorative. Think Linear, Vercel, Raycast.

### Typography

| Role | Font | Weight | Size | Letter Spacing | Line Height |
|---|---|---|---|---|---|
| Display | Satoshi | Black (900) | 64px / 48px | -0.03em | 1.0 |
| H1 | Satoshi | Bold (700) | 36px | -0.02em | 1.15 |
| H2 | Satoshi | Bold (700) | 28px | -0.02em | 1.2 |
| H3 | Satoshi | Semibold (600) | 22px | -0.01em | 1.25 |
| H4 | Satoshi | Medium (500) | 18px | -0.01em | 1.3 |
| Body | Satoshi | Regular (400) | 15px | 0 | 1.6 |
| Body Small | Satoshi | Regular (400) | 13px | 0 | 1.5 |
| Label / Overline | JetBrains Mono | Medium (500) | 11px | 0.08em (uppercase) | 1.4 |
| Code / Data | JetBrains Mono | Regular (400) | 13px | 0 | 1.5 |
| Caption | Satoshi | Medium (500) | 11px | 0.02em | 1.4 |

### Color Palette

| Token | Value |
|---|---|
| `--background` | `#021823` |
| `--card` | `#071f2d` |
| `--popover` | `#0c2a3a` |
| `--primary` | `#f4b964` |
| `--primary-foreground` | `#021823` |
| `--secondary` | `#0c2a3a` |
| `--secondary-foreground` | `#c5d0d8` |
| `--muted` | `#0a2230` |
| `--muted-foreground` | `#6b8a9e` |
| `--accent` | `rgba(244,185,100, 0.08)` |
| `--accent-foreground` | `#f4b964` |
| `--foreground` | `#e8edf0` |
| `--border` | `rgba(244,185,100, 0.12)` |
| `--input` | `rgba(244,185,100, 0.15)` |
| `--ring` | `rgba(244,185,100, 0.40)` |
| `--destructive` | `#f46464` |
| `--chart-1` | `#f4b964` |
| `--chart-2` | `#d4944a` |
| `--chart-3` | `#b47030` |
| `--chart-4` | `#f4d494` |
| `--chart-5` | `#c48040` |

### Border Radius
`--radius`: `0.25rem` (4px). Near-sharp. Buttons 4px, cards 4px, inputs 4px, badges 2px.

### Buttons

**Primary:** bg `#f4b964`, text `#021823`, 4px radius. Hover: brightness(1.1) + `box-shadow: 0 0 0 1px rgba(244,185,100, 0.3)`, 150ms ease-out. Active: scale(0.98) + brightness(0.95), 80ms. Font: Satoshi Medium 14px, tracking 0.01em. Padding: 10px 20px, min-height 40px.

**Secondary:** transparent bg, 1px solid `rgba(244,185,100, 0.25)` border, text `#e8edf0`. Hover: bg `rgba(244,185,100, 0.06)`, border opacity 0.4. Active: scale(0.98).

**Ghost:** transparent, no border, text `#6b8a9e`. Hover: text `#f4b964`, bg `rgba(244,185,100, 0.04)`. Active: scale(0.98).

**Destructive:** bg `rgba(244,100,100, 0.12)`, text `#f46464`, 1px border `rgba(244,100,100, 0.2)`. Hover: bg opacity increase, border brightens.

**Disabled:** 40% opacity, pointer-events: none.

### Hover & Interactions

- Cards: border transparent → `rgba(244,185,100, 0.15)`, 150ms ease-out
- Links: underline slides in from left (pseudo scaleX 0→1, transform-origin left), 200ms
- Table rows: bg transparent → `rgba(244,185,100, 0.03)`, 100ms
- Dropdown items: left 3px gold bar slides in + bg tint, 120ms
- Click feel: scale(0.98) on :active, 80ms. Crisp, mechanical, no bounce.

### Notifications/Toasts
Slide from top-right, 200ms ease-out. Card bg `#071f2d`, 4px radius, 1px border. 3px left stripe (gold=info, green=success, red=error). Auto-dismiss 5s with progress bar. Max 3 stacked.

### Loading
- Skeleton: shimmer from `#071f2d` → `#0c2a3a` → `#071f2d`, 1.5s linear
- Spinner: thin gold ring, 2px stroke, 20px, 0.8s rotation
- Progress: 3px bar, track `#0a2230`, fill `#f4b964`, no radius

### Depth
Zero shadows. Color stepping only: L0 `#021823`, L1 `#071f2d`, L2 `#0c2a3a`, L3 `#112f42`. Modal overlay: `rgba(2,24,35, 0.80)` + backdrop-blur(4px).

### Tables
- Header: bg `#0a2230`, JetBrains Mono Medium 11px uppercase tracking 0.08em, color `#6b8a9e`
- Rows: 48px height, Satoshi Regular 14px, 1px bottom border `rgba(244,185,100, 0.06)`
- Row hover: bg `rgba(244,185,100, 0.03)`, 100ms
- Selected: bg `rgba(244,185,100, 0.06)` + left 2px gold
- Numeric: right-aligned JetBrains Mono 13px. Positive gold, negative red.
- Status: dot (6px) + text, colored by status
- Pagination: ghost buttons, current page gold text

### Charts
- Grid: `rgba(244,185,100, 0.06)`, dashed, horizontal only
- Axis labels: JetBrains Mono 11px, `#6b8a9e`
- Line: 2px stroke, dots 4px on hover only. Tooltip: dark popover, instant.
- Bar: 4px radius top, hover brightness(1.15)
- Animations: lines draw 600ms ease-out, bars grow 400ms stagger 50ms

---

## Design System 2: "Warm Studio" — Approachable & Creative

**Route:** `/design-system-2`
**Philosophy:** Notion meets Framer. Friendly, creative, inviting. Smooth spring animations.

### Typography

| Role | Font | Weight | Size | Letter Spacing | Line Height |
|---|---|---|---|---|---|
| Display | Clash Display | Semibold (600) | 56px / 44px | -0.02em | 1.05 |
| H1 | Clash Display | Semibold (600) | 34px | -0.015em | 1.2 |
| H2 | Clash Display | Medium (500) | 26px | -0.01em | 1.25 |
| H3 | General Sans | Semibold (600) | 20px | -0.005em | 1.3 |
| H4 | General Sans | Medium (500) | 17px | 0 | 1.35 |
| Body | General Sans | Regular (400) | 15px | 0.005em | 1.65 |
| Body Small | General Sans | Regular (400) | 13px | 0.005em | 1.55 |
| Label | General Sans | Medium (500) | 12px | 0.04em (uppercase) | 1.4 |
| Code / Data | JetBrains Mono | Regular (400) | 13px | 0 | 1.5 |
| Caption | General Sans | Regular (400) | 11px | 0.01em | 1.4 |

### Color Palette

| Token | Value |
|---|---|
| `--background` | `#0a1e2a` |
| `--card` | `#122838` |
| `--popover` | `#1a3347` |
| `--primary` | `#f4b964` |
| `--primary-foreground` | `#0a1e2a` |
| `--secondary` | `#1a3347` |
| `--secondary-foreground` | `#d4dce2` |
| `--muted` | `#0f2534` |
| `--muted-foreground` | `#7d97a8` |
| `--accent` | `#e8956a` |
| `--accent-foreground` | `#0a1e2a` |
| `--foreground` | `#f0f2f4` |
| `--border` | `rgba(244,185,100, 0.10)` |
| `--input` | `rgba(244,185,100, 0.12)` |
| `--ring` | `rgba(244,185,100, 0.40)` |
| `--destructive` | `#e85454` |
| `--chart-1` | `#f4b964` |
| `--chart-2` | `#e8956a` |
| `--chart-3` | `#d4784a` |
| `--chart-4` | `#f4d494` |
| `--chart-5` | `#c4a060` |

Coral accent `#e8956a` for secondary highlights, "new" badges, warnings.

### Border Radius
`--radius`: `0.75rem` (12px). Buttons 10px, cards 12px, inputs 8px, badges pill, modals 16px.

### Buttons

**Primary:** bg `#f4b964`, text `#0a1e2a`, 10px radius. Hover: translateY(-1px) + box-shadow bloom `0 4px 12px rgba(244,185,100, 0.25)`, 250ms spring (cubic-bezier 0.34,1.56,0.64,1). Active: translateY(1px) + shadow collapse, 100ms. Font: General Sans Medium 14px. Padding: 11px 22px.

**Secondary:** Glass-morphism: bg `rgba(255,255,255, 0.05)` + backdrop-blur(8px), 1px border `rgba(244,185,100, 0.12)`. Hover: bg 0.08, border 0.2, translateY(-1px).

**Ghost:** transparent, text `#7d97a8`. Hover: bg `rgba(244,185,100, 0.05)`, text `#f0f2f4`.

**Icon Button:** 40px circle, transparent. Hover: bg `rgba(244,185,100, 0.08)`, icon rotate 3deg + gold, 200ms spring.

**Destructive:** bg `rgba(232,84,84, 0.10)`, text `#e85454`. Hover: glow `0 0 8px rgba(232,84,84, 0.12)`.

### Hover & Interactions

- Cards: translateY(-2px) + shadow grows `0 2px 8px` → `0 8px 24px`, 300ms spring
- Links: color → gold + underline opacity fade, 250ms
- Table rows: bg warm tint + left 3px gold slides in, 200ms
- Click feel: translateY(1px) on active, spring release with overshoot
- Checkboxes/toggles: scale pulse 0.9→1.05→1.0, 250ms

### Notifications/Toasts
Slide up from bottom-center, 300ms spring overshoot. Rounded pill/card 12px. Color-coded. Stacking up to 3. Exit: scale down + fade, 200ms.

### Loading
- Skeleton: warm pulse shimmer, gold-tinted, 2s ease
- Spinner: 3 bouncing gold dots, staggered
- Progress: rounded 6px, gradient gold→coral, shimmer
- Page: logo pulse scale 0.95↔1.05

### Depth
Layered shadows: L1 `0 2px 8px + 0 1px 2px`, L2 `0 4px 16px + 0 2px 4px`, L3 `0 12px 40px + 0 4px 8px`. Subtle noise texture 2-3% opacity. Modal: blur(8px) overlay.

### Tables
- Header: bg `#0f2534`, General Sans Medium 12px uppercase, 1px bottom border
- Rows: 52px, General Sans Regular 14px. Hover: bg tint + left gold bar slides in, 200ms
- Status: pill badges (gold/green/coral bg tints)
- Numeric: positive gold, negative coral
- Pagination: rounded ghost buttons, active gold pill

### Charts
- Grid: `rgba(255,255,255, 0.04)`, horizontal
- Line: 2.5px stroke, smooth curve, gradient fill 15%→0%. Points appear on hover with spring.
- Bar: 8px radius top, hover lift translateY(-1px)
- Pie/donut: segments pull out 4px on hover + shadow. Center: Clash Display stat.
- Animations: lines draw 800ms, bars spring with stagger 50ms, pie fans from noon 600ms spring

---

## Design System 3: "Bold Statement" — High-Impact Editorial

**Route:** `/design-system-3`
**Philosophy:** shoo.dev meets Bloomberg. Massive headlines, hard color-swap hovers, zero radius. Editorial confidence.

### Typography

| Role | Font | Weight | Size | Letter Spacing | Line Height |
|---|---|---|---|---|---|
| Display | Neue Montreal | Bold (700) | 96px / 72px | -0.04em | 0.95 |
| H1 | Neue Montreal | Bold (700) | 48px | -0.03em | 1.05 |
| H2 | Neue Montreal | Bold (700) | 36px | -0.025em | 1.1 |
| H3 | Neue Montreal | Medium (500) | 24px | -0.015em | 1.2 |
| H4 | Neue Montreal | Medium (500) | 18px | -0.01em | 1.3 |
| Body | Neue Montreal | Regular (400) | 16px | 0 | 1.6 |
| Body Small | Neue Montreal | Regular (400) | 14px | 0 | 1.55 |
| Label / Overline | Neue Montreal | Medium (500) | 11px | 0.12em (UPPERCASE) | 1.3 |
| Data / Stat | JetBrains Mono | Bold (700) | 14px | 0.02em | 1.2 |
| Caption | Neue Montreal | Regular (400) | 12px | 0.02em | 1.4 |
| Nav links | Neue Montreal | Medium (500) | 14px | 0.06em (UPPERCASE) | 1.0 |

### Color Palette

| Token | Value |
|---|---|
| `--background` | `#021823` |
| `--card` | `#061e2b` |
| `--popover` | `#0d2a3a` |
| `--primary` | `#f4b964` |
| `--primary-foreground` | `#021823` |
| `--secondary` | `#0d2a3a` |
| `--secondary-foreground` | `#ffffff` |
| `--muted` | `#081c28` |
| `--muted-foreground` | `#5a7586` |
| `--accent` | `#64dcf4` |
| `--accent-foreground` | `#021823` |
| `--foreground` | `#c5d0d8` |
| `--border` | `rgba(255,255,255, 0.08)` |
| `--input` | `rgba(255,255,255, 0.10)` |
| `--ring` | `#f4b964` |
| `--destructive` | `#f44040` |
| `--chart-1` | `#f4b964` |
| `--chart-2` | `#64dcf4` |
| `--chart-3` | `#f46464` |
| `--chart-4` | `#a4f464` |
| `--chart-5` | `#c864f4` |

Cyan `#64dcf4` as secondary accent. White `#ffffff` for headlines only, body stays `#c5d0d8`.

### Border Radius
`--radius`: `0rem` (0px). Zero. Everything sharp.

### Buttons

**Primary:** bg `#f4b964`, text `#021823`, 0px radius. UPPERCASE, tracking 0.08em, Neue Montreal Medium 13px. Padding: 12px 28px, min-height 48px. **Hover: HARD INVERT** — bg transparent, 2px gold border, text gold. 150ms color transition. Active: bg `rgba(244,185,100, 0.15)`.

**Secondary:** transparent, 1px `rgba(255,255,255, 0.15)` border, white text UPPERCASE. Hover: border → `#ffffff`, bg `rgba(255,255,255, 0.04)`.

**Ghost/Text:** text `#c5d0d8` + arrow (→). Hover: text → `#ffffff`, arrow translates right 4px, 200ms.

**Destructive:** bg `#f44040`, text `#ffffff`. Hover: hard invert — transparent bg, red border, red text.

### Hover & Interactions

- Cards: border `rgba(255,255,255,0.08)` → `rgba(244,185,100, 0.3)`, 150ms
- Links: already underlined 1px, hover thickens to 2px + color gold, 150ms
- Table rows: bg `rgba(255,255,255, 0.02)`, INSTANT (0ms)
- Nav: gold underline draws from center, 200ms
- Click feel: NO transform. Background color inversion IS the feedback. Decisive, not bouncy.

### Notifications/Toasts
Full-width banner from top, 200ms. 0px radius. 48px height. 4px left color stripe. 1 at a time, crossfade replace. Auto-dismiss 6s.

### Loading
- Skeleton: pulsing blocks (not shimmer), hard blink, 1.2s steps
- Spinner: rotating SQUARE, 16px, gold, 0.8s
- Progress: NProgress top-of-viewport 2px gold line
- Data: cells show `--` then hard-swap to values

### Depth
Zero shadows. Color stepping: L0 `#021823`, L1 `#061e2b`, L2 `#0d2a3a`, L3 `#143446`. Borders are structural — always visible 1px. Modal: `rgba(2,24,35, 0.90)`, no blur.

### Tables
- Header: bg `#061e2b`, Neue Montreal Medium 11px UPPERCASE tracking 0.12em, 2px bottom gold border
- Rows: 44px compact, Neue Montreal Regular 14px. Hover: instant bg swap, 0ms.
- Status: text only (no pills), UPPERCASE 11px tracked, colored dot 4px
- Numeric: JetBrains Mono Bold 14px. Positive `+` gold, negative `-` red. Big numbers white.
- Pagination: "1 — 10 of 247" JetBrains Mono, arrow buttons

### Charts
- Grid: BOTH horizontal AND vertical, `rgba(255,255,255, 0.04)`, solid
- Axis: JetBrains Mono 10px UPPERCASE tracked
- Line: 2px, sharp linear interpolation (angular, not curved). Data points: 6px squares.
- Bar: 0px radius, hover inverts (fill↔outline)
- Tooltip: sharp rect, instant (0ms), no animation
- Animations: minimal, lines 400ms linear, bars 300ms linear, no stagger

---

## Design System 4: "Luxury Minimal" — Refined & Quiet (WILD CARD)

**Route:** `/design-system-4`
**Philosophy:** High-end fashion brand doing software. Light weights, extreme negative space, gold used sparingly. Deliberately slow transitions.

### Typography

| Role | Font | Weight | Size | Letter Spacing | Line Height |
|---|---|---|---|---|---|
| Display | Gambetta | Light (300) | 72px / 56px | -0.01em | 1.1 |
| H1 | Gambetta | Regular (400) | 40px | -0.01em | 1.15 |
| H2 | Gambetta | Regular (400) | 30px | 0 | 1.2 |
| H3 | Switzer | Light (300) | 20px | 0.02em | 1.35 |
| H4 | Switzer | Regular (400) | 16px | 0.03em | 1.4 |
| Body | Switzer | Light (300) | 15px | 0.01em | 1.75 |
| Body Small | Switzer | Light (300) | 13px | 0.015em | 1.65 |
| Label / Overline | Switzer | Regular (400) | 10px | 0.14em (UPPERCASE) | 1.3 |
| Code / Data | JetBrains Mono | Light (300) | 13px | 0.02em | 1.5 |
| Caption | Switzer | Light (300) | 11px | 0.02em | 1.5 |
| Nav | Switzer | Light (300) | 13px | 0.08em (UPPERCASE) | 1.0 |

### Color Palette

| Token | Value |
|---|---|
| `--background` | `#021823` |
| `--card` | `#081c28` |
| `--popover` | `#0e2636` |
| `--primary` | `#f4b964` |
| `--primary-foreground` | `#021823` |
| `--secondary` | `#0a2030` |
| `--secondary-foreground` | `#8a9daa` |
| `--muted` | `#071a25` |
| `--muted-foreground` | `#4a6475` |
| `--accent` | `rgba(244,185,100, 0.08)` |
| `--accent-foreground` | `#f4b964` |
| `--foreground` | `#d4dce2` |
| `--border` | `rgba(244,185,100, 0.06)` |
| `--input` | `rgba(244,185,100, 0.08)` |
| `--ring` | `rgba(244,185,100, 0.30)` |
| `--destructive` | `#c45454` |
| `--chart-1` | `#f4b964` |
| `--chart-2` | `rgba(244,185,100, 0.60)` |
| `--chart-3` | `rgba(244,185,100, 0.35)` |
| `--chart-4` | `rgba(244,185,100, 0.18)` |
| `--chart-5` | `#4a6475` |

Gold scarcity principle: gold appears sparingly. No pure white anywhere. Brightest text `#d4dce2`. Chart colors: monochrome gold at different opacities.

### Border Radius
`--radius`: `0rem` (0px). Sharp, but refined not aggressive.

### Buttons

**Primary:** TRANSPARENT bg, 1px gold border, gold text. Hover: gold bg fills in SLOWLY (400ms ease) — text inverts to dark. The slow fill is the signature. Switzer Light 12px UPPERCASE tracking 0.12em. Padding: 14px 32px.

**Secondary:** transparent, 1px `rgba(244,185,100, 0.15)` border, text `#8a9daa`. Hover: border 0.30, text brightens, 400ms.

**Ghost:** text `#4a6475`. Hover: text → `#8a9daa`, 400ms. That's it.

**Text link:** text `#8a9daa`, no underline. Hover: 0.5px underline from center, text brightens, 500ms.

**Destructive:** 1px `#c45454` border, text `#c45454`. Hover: same slow fill, 400ms.

**Disabled:** 25% opacity. Nearly invisible.

### Hover & Interactions

- Everything is SLOW. Minimum 300ms, most 400-500ms.
- Cards: top border fades in gold 12%, 500ms
- Links: underline draws from center, 500ms
- Table rows: non-hovered rows dimmed 0.7 opacity, hovered brightens to 1.0, 400ms
- Nav: letter-spacing expands 0.08→0.12em + text brightens, 400ms
- Click feel: opacity 0.8 on active, 50ms. Returns 400ms. No transform. Minimal.

### Notifications/Toasts
Fade in bottom-center, 500ms. No slide. Just materializes. No icon. Just text. Only 1 at a time. Auto-dismiss 4s, fade out 500ms. Left border barely tinted by type.

### Loading
- Skeleton: static `rgba(244,185,100, 0.03)` blocks, crossfade to content 600ms. No shimmer.
- Spinner: single thin line (1px), gold 40% opacity, 2s per rotation. 24px.
- Progress: 1.5px hair-thin gold line, no track.
- Data: `···` in muted, crossfade to value.

### Depth
Zero shadows. Surfaces barely differentiated: L0 `#021823`, L1 `#081c28`, L2 `#0e2636`, L3 `#143040`. Negative space is the design tool. 32-40px card padding, 64-80px section gaps. Modal: `rgba(2,24,35, 0.92)`, no blur.

### Tables
- Header: no bg differentiation, Switzer Regular 10px UPPERCASE tracking 0.14em, `#4a6475`
- Rows: 56px (tallest), Switzer Light 14px, `#8a9daa` (muted by default). Hover: row brightens, others stay dim. 400ms.
- Borders: `rgba(244,185,100, 0.03)` — ghost lines
- Status: Switzer Regular 10px UPPERCASE same color, tiny 3px colored dot only
- Numeric: JetBrains Mono Light 13px, muted. Barely tinted positive/negative.
- Empty: Gambetta Light 20px muted text. No icons, no CTA.
- Pagination: Switzer Light 12px, barely visible arrows, gold text 40% for current.

### Charts
- Grid: `rgba(244,185,100, 0.03)` ghost lines, horizontal only
- Axis: Switzer Light 10px UPPERCASE tracked, `#4a6475`. No axis lines.
- Color: monochrome gold (100%, 60%, 35%, 18%, `#4a6475`)
- Line: 1.5px, smooth. No visible data points. Hover: thin vertical guideline + 4px circle fades in. Fill 8%→0%.
- Bar: thin (max 24px), hover opacity pulse
- Tooltip: NO container. Just floating text: Gambetta Regular 16px gold value + Switzer Light 10px label. 400ms fade.
- Legend: thin horizontal lines (not squares), Switzer Light 10px
- Animations: slow — lines 1200ms, bars fade 800ms stagger 80ms

---

## Design System 5: "Neo-Playful" — Raw & Energetic (WILD CARD)

**Route:** `/design-system-5`
**Philosophy:** Creative agency meets indie dev. Dashed borders, chunky type, bouncy springs, hard offset shadows. Personality-forward.

### Typography

| Role | Font | Weight | Size | Letter Spacing | Line Height |
|---|---|---|---|---|---|
| Display | Cabinet Grotesk | Extrabold (800) | 80px / 60px | -0.03em | 0.95 |
| H1 | Cabinet Grotesk | Bold (700) | 42px | -0.025em | 1.05 |
| H2 | Cabinet Grotesk | Bold (700) | 32px | -0.02em | 1.1 |
| H3 | Satoshi | Bold (700) | 22px | -0.01em | 1.25 |
| H4 | Satoshi | Medium (500) | 17px | 0 | 1.3 |
| Body | Satoshi | Regular (400) | 15px | 0.005em | 1.6 |
| Body Small | Satoshi | Regular (400) | 13px | 0.005em | 1.55 |
| Label / Tag | JetBrains Mono | Medium (500) | 11px | 0.06em (UPPERCASE) | 1.3 |
| Code / Data | JetBrains Mono | Regular (400) | 13px | 0 | 1.5 |
| Caption | JetBrains Mono | Regular (400) | 10px | 0.04em | 1.4 |
| Badge text | JetBrains Mono | Bold (700) | 10px | 0.08em (UPPERCASE) | 1.0 |

### Color Palette

| Token | Value |
|---|---|
| `--background` | `#021823` |
| `--card` | `#0c2435` |
| `--popover` | `#153348` |
| `--primary` | `#f4b964` |
| `--primary-foreground` | `#021823` |
| `--secondary` | `#153348` |
| `--secondary-foreground` | `#e0e8ed` |
| `--muted` | `#0a1e2e` |
| `--muted-foreground` | `#5e8195` |
| `--accent` | `#64f4b9` |
| `--accent-foreground` | `#021823` |
| `--foreground` | `#f0f4f7` |
| `--border` | `rgba(244,185,100, 0.20)` |
| `--input` | `rgba(244,185,100, 0.22)` |
| `--ring` | `#f4b964` |
| `--destructive` | `#f46482` |
| `--chart-1` | `#f4b964` |
| `--chart-2` | `#64f4b9` |
| `--chart-3` | `#f46482` |
| `--chart-4` | `#64b4f4` |
| `--chart-5` | `#f4dc64` |

Mint `#64f4b9` for success/positive. Coral `#f46482` for errors. Borders at 20% — deliberately visible.

### Border Radius
`--radius`: `0.5rem` (8px). Buttons 8px, cards 10px, badges pill, modals 12px. Some asymmetric radius allowed.

### Buttons

**Primary:** bg `#f4b964`, text `#021823`, 8px radius. **2px solid `#021823` dark border** (sticker/cutout). Satoshi Bold 14px. Hover: border becomes dashed + subtle wiggle (rotate ±0.5deg, 2 cycles 300ms). Active: scale(0.93), spring to 1.02→1.0, 200ms.

**Secondary:** transparent, 2px dashed `rgba(244,185,100, 0.35)` border. **Hover: dashed→solid** + bg fills. The dashed→solid is the signature.

**Ghost:** text `#5e8195`. Hover: text brightens + dashed underline appears.

**Mint CTA:** bg `#64f4b9`, text `#021823`, 2px dark border. Same wiggle hover.

**Pill/Tag:** full-round, JetBrains Mono 10px UPPERCASE. 1px border + bg tint. Hover: scale(1.05) spring.

**Destructive:** dashed `#f46482` border. Hover: dashed→solid + bg fill.

**Disabled:** 35% opacity, border becomes dotted.

### Hover & Interactions

- Cards: tilt `perspective(800px) rotateX(1deg) rotateY(-0.5deg)` + shadow shifts, 300ms spring
- Links: dashed underline by default, hover becomes solid + gold
- Table rows: left 3px gold bar springs in + row slides right 2px, 200ms spring
- Dropdown items: slide right 4px + bg fills, 150ms spring
- Badges: bounce scale(1.08)→1.0, 250ms
- Toggle: knob bounces + squishes (scaleX 1.15, scaleY 0.9) during travel, 350ms
- Click feel: BOUNCY. scale(0.93) down 80ms, spring to 1.03→1.0 with overshoot, 250ms.

### Notifications/Toasts
Pop from bottom-right with bounce: translateY(100%) scale(0.8) rotate(-2deg) → 0 scale(1) rotate(0), 350ms spring. 10px radius, 2px border. Emoji icons. Segmented progress bar (5 blocks). Stack up to 4 with slight rotation offsets. Exit: slide out + rotate(3deg) + scale(0.9).

### Loading
- Skeleton: dashed border blocks that pulse opacity 0.08→0.20, 1.5s. Empty inside.
- Spinner: 3 chasing squares in triangle pattern, 1s
- Progress: segmented, blocks drop in with bounce like Tetris
- Data: tiny bouncing pixel-square animation per cell

### Depth
Hard offset shadows ONLY (no blur): cards `4px 4px 0px rgba(244,185,100, 0.08)`, buttons `3px 3px 0px #021823`, hover offset grows to `6px 6px`. Dot grid bg at 2-3% opacity, 16px spacing. Borders always visible, 2px. Modal: `rgba(2,24,35, 0.75)`, no blur, hard shadow.

### Tables
- Header: bg `#0a1e2e`, JetBrains Mono Medium 10px UPPERCASE tracking 0.08em. 2px dashed bottom border.
- Rows: 48px, Satoshi Regular 14px. Hover: left gold bar springs in + row slides right 2px, 200ms. Dashed row dividers.
- Selected: dashed→solid border transition
- Status pills: thick personality — gold/mint/coral bg tints + borders. LIVE has pulsing dot. DRAFT has dashed border.
- Numeric: JetBrains Mono Medium 14px. Positive mint, negative coral. Values bounce on update.
- Empty: Cabinet Grotesk Bold 24px slightly rotated (-1deg) + emoji + CTA.
- Pagination: pill buttons, gold active, bouncy hover.

### Charts
- Grid: DASHED, both directions, `rgba(244,185,100, 0.06)`. Graph paper feel.
- Axis: JetBrains Mono 10px, visible 2px lines
- Color: full vibrant multi-hue (gold, mint, coral, sky, yellow)
- Line: 2.5px, smooth. Data points: 5px diamonds (rotated squares). Hover: diamond scales with bounce.
- Bar: 8px radius top, 1px darker outline. Hover: lift translateY(-2px) + hard shadow.
- Pie/donut: segments pop out 6px on hover with spring + hard shadow.
- Tooltip: 8px radius, 2px border, hard shadow 3px 3px, spring bounce in. Slightly rotated 0.5deg.
- Legend: diamonds (rotated squares), JetBrains Mono 10px. Toggled-off: dashed outline.
- Animations: everything bounces — lines 600ms spring, bars 400ms stagger 40ms, pie pops 150ms each.
