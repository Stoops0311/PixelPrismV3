# PixelPrism Merged Design Systems Spec

## Project Context

- **Product:** Social media marketing tool for SMBs (content creation, scheduling, analytics)
- **Stack:** Next.js 16 + Tailwind v4 + shadcn (radix-lyra style, hugeicons)
- **Brand colors:** `#f4b964` (warm gold), `#021823` (deep oceanic dark)
- **Mode:** Dark mode only
- **Components:** All from shadcn — no building from scratch
- **Routes:** `/design-system-1`, `/design-system-2`, `/design-system-3`
- **Source DNA:** Merges of original DS-2 "Warm Studio" + DS-3 "Bold Statement"

## Design Ancestry

These 3 systems are mergers of two parent systems:

**Parent A — "Warm Studio" (DS-2):** Notion meets Framer. Spring animations, 12px radius, layered shadows, coral accent, glass-morphism, noise texture, bouncing dots, warm badge tints.

**Parent B — "Bold Statement" (DS-3):** shoo.dev meets Bloomberg. Neue Montreal, 0px radius, hard-invert hovers, UPPERCASE tracked labels, zero shadows, color stepping, angular charts, rotating square spinner.

**User preferences carried forward:**
- Neue Montreal typography (from DS-3) — massive headlines, tight tracking
- 0px radius / square shapes (from DS-3) — blocky, decisive
- Hard-invert button hovers (from DS-3)
- UPPERCASE tracked labels (from DS-3)
- Warm color-tinted badge backgrounds with subtle borders (from DS-2) — NOT pill shape
- Spring animations where appropriate (from DS-2)
- Coral accent warmth (from DS-2)

## Font Files

All fonts in `/public/fonts/`:

| Font | Variable File Path | Usage |
|---|---|---|
| Neue Montreal | OTF only: `NeueMontreal-*.otf` (Regular, Medium, Bold, Light) | All 3 systems (headings, and body in A) |
| General Sans | `GeneralSans_Complete/Fonts/WEB/fonts/GeneralSans-Variable.woff2` | Systems B, C body text |
| JetBrains Mono | `JetBrainsMono_Complete/Fonts/WEB/fonts/JetBrainsMono-Variable.woff2` | All systems (data/mono/labels) |

## Shared Requirements for ALL Pages

Each page must showcase (same as before):

1. Typography scale (Display, H1-H4, body, body small, label/overline, code/data, caption)
2. Color palette with swatches
3. Buttons (primary, secondary, ghost, destructive, disabled)
4. Cards with hover states
5. Inputs & Form elements (text, textarea, select, checkbox, switch)
6. Badges/Tags (Live, Scheduled, Draft, Failed + feature badges)
7. Table with mock data, pagination
8. Charts (line + bar minimum)
9. Notifications/Toasts (info, success, error)
10. Loading states (skeleton, spinner, progress)
11. Dialog/Modal
12. Dropdown menu
13. Tooltip
14. Navigation bar

### Mock Data (same across all 3)

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

## Design System 1: "Warm Brutalist" (70% Bold Statement / 30% Warm Studio)

**Route:** `/design-system-1`
**Philosophy:** DS-3's editorial backbone with DS-2's warmth injected into color and micro-interactions. A Bloomberg terminal that feels inviting instead of cold.

### Typography

Single font system: Neue Montreal for everything.

| Role | Font | Weight | Size | Letter Spacing | Line Height |
|---|---|---|---|---|---|
| Display | Neue Montreal | Bold (700) | 96px / 72px mobile | -0.04em | 0.95 |
| H1 | Neue Montreal | Bold (700) | 48px | -0.03em | 1.05 |
| H2 | Neue Montreal | Bold (700) | 36px | -0.025em | 1.1 |
| H3 | Neue Montreal | Medium (500) | 24px | -0.015em | 1.2 |
| H4 | Neue Montreal | Medium (500) | 18px | -0.01em | 1.3 |
| Body | Neue Montreal | Regular (400) | 16px | 0em | 1.6 |
| Body Small | Neue Montreal | Regular (400) | 14px | 0em | 1.55 |
| Label / Overline | Neue Montreal | Medium (500) | 11px | 0.12em (UPPERCASE) | 1.3 |
| Data / Stat | JetBrains Mono | Bold (700) | 14px | 0.02em | 1.2 |
| Caption | Neue Montreal | Regular (400) | 12px | 0.02em | 1.4 |
| Nav | Neue Montreal | Medium (500) | 14px | 0.06em (UPPERCASE) | 1.0 |

### Color Palette

| Token | Value | Notes |
|---|---|---|
| `--background` | `#021823` | Same deep dark from DS-3 |
| `--card` | `#061e2b` | DS-3's card |
| `--popover` | `#0d2a3a` | DS-3's popover |
| `--primary` | `#f4b964` | Brand gold |
| `--primary-foreground` | `#021823` | |
| `--secondary` | `#0d2a3a` | |
| `--secondary-foreground` | `#ffffff` | |
| `--muted` | `#081c28` | |
| `--muted-foreground` | `#5a7586` | DS-3's muted |
| `--accent` | `#e8956a` | **Coral from DS-2** — this is the warmth injection |
| `--accent-foreground` | `#021823` | |
| `--foreground` | `#c5d0d8` | DS-3's body text color |
| `--border` | `rgba(244,185,100, 0.10)` | **Warmer border from DS-2** (not the cold white/0.08 of DS-3) |
| `--input` | `rgba(244,185,100, 0.12)` | Warm input tint |
| `--ring` | `#f4b964` | |
| `--destructive` | `#f44040` | |
| `--chart-1` | `#f4b964` | Gold |
| `--chart-2` | `#e8956a` | **Coral** (warm palette, not DS-3's multi-hue) |
| `--chart-3` | `#d4784a` | Copper |
| `--chart-4` | `#f4d494` | Light gold |
| `--chart-5` | `#c4a060` | Amber |

**Key difference from DS-3:** Coral accent replaces cyan. Borders use warm gold tint instead of cold white. Chart palette is warm monochrome (gold→coral→copper) instead of high-contrast multi-hue.

### Border Radius
`--radius`: `0rem` (0px). Zero. Everything sharp. Inherited from DS-3.

### Buttons

**Primary:** bg `#f4b964`, text `#021823`, 0px radius. UPPERCASE, tracking 0.08em, Neue Montreal Medium 13px. Padding: 12px 28px, min-height 48px. **Hover: HARD INVERT with SPRING** — bg transparent, 2px gold border, text gold. **250ms cubic-bezier(0.34, 1.56, 0.64, 1)** instead of DS-3's 150ms linear. The spring easing gives the hard swap a softer feel. Active: bg `rgba(244,185,100, 0.15)`.

**Secondary (Glass Brutalist):** DS-2's glass-morphism adapted to 0px radius. bg `rgba(255,255,255, 0.05)` + backdrop-blur(8px), 1px border `rgba(244,185,100, 0.12)`, UPPERCASE tracked text. Hover: bg 0.08, border 0.2, 250ms spring. 0px radius. This is the DS-2 warmth element — frosted glass in a sharp container.

**Ghost/Text:** text `#c5d0d8` UPPERCASE + arrow (→). Hover: text → `#ffffff`, arrow translates right 4px, 200ms spring.

**Destructive:** bg `#f44040`, text `#ffffff`, 0px radius. Hover: hard invert — transparent bg, red border, red text. 250ms spring.

**Disabled:** 40% opacity, pointer-events: none.

### Hover & Interactions

Spring easing everywhere: `cubic-bezier(0.34, 1.56, 0.64, 1)` — this is the DS-2 DNA in an otherwise DS-3 structure.

- Cards: border `rgba(244,185,100, 0.10)` → `rgba(244,185,100, 0.30)`, **250ms spring** (not DS-3's 150ms linear)
- Links: underline expands from center, 250ms spring
- Table rows: bg transparent → `rgba(244,185,100, 0.04)`, left 3px gold bar slides in, **200ms spring** (not DS-3's instant 0ms)
- Nav: gold underline draws from center, 250ms spring
- Dropdown items: left 3px gold bar + bg tint, 200ms spring
- Click feel: NO transform (from DS-3). Background color inversion is the feedback. But the color transition has spring easing for organic feel.

### Badges

**Square shape (0px radius) with DS-2's warm color treatment.**

- **Live:** bg `rgba(244,185,100, 0.12)`, text `#f4b964`, 1px border `rgba(244,185,100, 0.20)`. Pulsing gold dot (6px square, not circle).
- **Scheduled:** bg `rgba(232,149,106, 0.12)`, text `#e8956a`, 1px border `rgba(232,149,106, 0.20)`.
- **Draft:** bg `rgba(90,117,134, 0.12)`, text `#5a7586`, 1px border `rgba(90,117,134, 0.20)`.
- **Failed:** bg `rgba(244,64,64, 0.12)`, text `#f44040`, 1px border `rgba(244,64,64, 0.20)`.
- **Feature badges:** "New" in coral tint, "Trending" in gold tint, "Pro" in accent tint.
- All badges: Neue Montreal Medium 11px UPPERCASE tracking 0.08em, 0px radius, padding 4px 10px.

### Notifications/Toasts

DS-3's structure with DS-2's animation: Slide from top-center with **spring overshoot** (not DS-3's flat 200ms). 0px radius. 48px min-height. 4px left color stripe (gold=info, green=success, red=error). 1 at a time. Auto-dismiss 6s. Font: Neue Montreal. The spring bounce on entry is the warmth.

### Loading States

Mix of both:
- **Skeleton:** DS-3's pulsing blocks (hard blink, not shimmer), BUT with warm gold-tinted bg `rgba(244,185,100, 0.04)` instead of cold grey. 1.2s steps.
- **Spinner:** DS-3's rotating SQUARE, 16px, gold, 0.8s.
- **Progress:** 2px gold line (DS-3's NProgress style), BUT with gradient `#f4b964` → `#e8956a` (coral gradient from DS-2).

### Depth & Layering

**Zero shadows** (from DS-3). Color stepping: L0 `#021823`, L1 `#061e2b`, L2 `#0d2a3a`, L3 `#143446`. Borders structural, always 1px visible.

**One DS-2 addition:** Subtle noise texture overlay at 2% opacity on the page background. This adds organic warmth to the otherwise clinical color-stepping approach.

Modal overlay: `rgba(2,24,35, 0.90)`, no blur (DS-3).

### Tables

DS-3 structure with DS-2 warmth:
- **Header:** bg `#061e2b`, Neue Montreal Medium 11px UPPERCASE tracking 0.12em, `#5a7586`. **2px bottom gold border** (from DS-3).
- **Rows:** 44px compact, Neue Montreal Regular 14px. Hover: bg `rgba(244,185,100, 0.04)` + left 3px gold bar, **200ms spring** (not DS-3's instant).
- **Row borders:** `rgba(244,185,100, 0.06)` — warm tint (DS-2 DNA).
- **Status:** Square badges with warm color tints (described above), NOT DS-3's text-only approach.
- **Numeric:** JetBrains Mono Bold 14px. Positive `+` gold, negative `-` red. Right-aligned.
- **Pagination:** "1 — 5 of 247" JetBrains Mono, square arrow buttons (secondary style).

### Charts

DS-3's angular structure with DS-2's warm palette:
- **Grid:** Both horizontal AND vertical (DS-3), `rgba(244,185,100, 0.06)` warm tint, solid lines.
- **Axis labels:** JetBrains Mono 10px UPPERCASE, `#5a7586`.
- **Line chart:** 2px stroke, **linear interpolation** (angular, from DS-3). Square data points 6px. Warm palette: gold `#f4b964`, coral `#e8956a`, copper `#d4784a`.
- **Bar chart:** 0px radius, hover inverts fill↔outline (DS-3). Warm palette colors.
- **Tooltip:** Sharp rect, 0px radius, bg `#0d2a3a`, 1px border, **200ms spring fade** (not DS-3's instant). The spring is the warmth.
- **Animations:** Lines 400ms with spring easing, bars 300ms with spring easing.

---

## Design System 2: "Studio Brutalist" (50/50 Merge)

**Route:** `/design-system-2`
**Philosophy:** Equal parts both parents. DS-3's typography and square shapes coexist with DS-2's depth system and animation philosophy. A design tool that's razor-sharp but never feels sterile.

### Typography

**Dual font system:** Neue Montreal for headings (DS-3 confidence), General Sans for body (DS-2 warmth).

| Role | Font | Weight | Size | Letter Spacing | Line Height |
|---|---|---|---|---|---|
| Display | Neue Montreal | Bold (700) | 80px / 64px mobile | -0.035em | 0.95 |
| H1 | Neue Montreal | Bold (700) | 44px | -0.025em | 1.05 |
| H2 | Neue Montreal | Bold (700) | 32px | -0.02em | 1.1 |
| H3 | Neue Montreal | Medium (500) | 22px | -0.01em | 1.2 |
| H4 | General Sans | Semibold (600) | 17px | -0.005em | 1.3 |
| Body | General Sans | Regular (400) | 15px | 0.005em | 1.65 |
| Body Small | General Sans | Regular (400) | 13px | 0.005em | 1.55 |
| Label / Overline | Neue Montreal | Medium (500) | 11px | 0.10em (UPPERCASE) | 1.3 |
| Data / Stat | JetBrains Mono | Bold (700) | 14px | 0.02em | 1.2 |
| Caption | General Sans | Regular (400) | 11px | 0.01em | 1.4 |
| Nav | Neue Montreal | Medium (500) | 13px | 0.06em (UPPERCASE) | 1.0 |
| Code | JetBrains Mono | Regular (400) | 13px | 0em | 1.5 |

**Key:** Headings hit hard (Neue Montreal Bold, tight tracking), body is comfortable to read (General Sans Regular, slightly positive tracking). The font switch happens at H3→H4 boundary — H3 and above are editorial, H4 and below are conversational.

### Color Palette

| Token | Value | Notes |
|---|---|---|
| `--background` | `#071a26` | Slightly warmer than DS-3's #021823 |
| `--card` | `#0e2838` | Warmer card |
| `--popover` | `#163344` | |
| `--primary` | `#f4b964` | Brand gold |
| `--primary-foreground` | `#071a26` | |
| `--secondary` | `#163344` | |
| `--secondary-foreground` | `#d4dce2` | DS-2's softer white |
| `--muted` | `#0b2230` | |
| `--muted-foreground` | `#6d8d9f` | Midpoint between DS-2 and DS-3 muted |
| `--accent` | `#e8956a` | Coral from DS-2 |
| `--accent-foreground` | `#071a26` | |
| `--foreground` | `#eaeef1` | Slightly brighter than DS-3 |
| `--border` | `rgba(244,185,100, 0.12)` | Warm |
| `--input` | `rgba(244,185,100, 0.14)` | |
| `--ring` | `rgba(244,185,100, 0.45)` | |
| `--destructive` | `#e85454` | DS-2's destructive |
| `--chart-1` | `#f4b964` | Gold |
| `--chart-2` | `#64dcf4` | Cyan from DS-3 |
| `--chart-3` | `#e8956a` | Coral from DS-2 |
| `--chart-4` | `#a4f464` | Lime from DS-3 |
| `--chart-5` | `#f4d494` | Light gold |

**Key difference:** Background is slightly warmer. Chart palette takes the best of both — DS-3's high-contrast cyan and lime mixed with DS-2's coral. This gives you vibrant, distinguishable chart colors with warmth.

### Border Radius
`--radius`: `0rem` (0px). **Everything square** — buttons, cards, inputs, modals, badges, tooltips. The sharpness is non-negotiable. But shadows add the depth that radius would normally provide.

### Buttons

**Primary:** bg `#f4b964`, text `#071a26`, 0px radius. UPPERCASE, tracking 0.08em, Neue Montreal Medium 13px. Padding: 12px 28px, min-height 48px. **Hover: HARD INVERT** — bg transparent, 2px gold border, text gold. **250ms spring**. Active: bg `rgba(244,185,100, 0.12)`. **PLUS: box-shadow `0 4px 12px rgba(244,185,100, 0.20)` on hover** — the DS-2 shadow bloom added to the DS-3 invert. This is the signature 50/50.

**Secondary (Glass):** bg `rgba(255,255,255, 0.04)` + backdrop-blur(8px), 1px border `rgba(244,185,100, 0.12)`, 0px radius, UPPERCASE tracked. Hover: bg 0.08, border 0.22, `box-shadow: 0 4px 16px rgba(0,0,0,0.15)`, 250ms spring. Active: shadow collapses.

**Ghost/Text:** General Sans Medium 14px (body font, not heading font), text `#6d8d9f`. Hover: text → `#f4b964`, bg `rgba(244,185,100, 0.04)`. Arrow translates right on hover. 250ms spring.

**Destructive:** bg `rgba(232,84,84, 0.12)`, text `#e85454`, 1px border `rgba(232,84,84, 0.20)`, 0px radius. Hover: hard invert — bg fills `#e85454`, text inverts to `#071a26`, shadow `0 4px 12px rgba(232,84,84, 0.20)`.

**Disabled:** 40% opacity, pointer-events: none.

### Hover & Interactions

**Spring everywhere:** `cubic-bezier(0.34, 1.56, 0.64, 1)` from DS-2.

- **Cards:** `translateY(-2px)` + shadow grows from `0 2px 8px rgba(0,0,0,0.15)` → `0 8px 24px rgba(0,0,0,0.20)` + border brightens to `rgba(244,185,100, 0.22)`, **300ms spring**. This is DS-2's card hover in a 0px radius container.
- **Links:** Color → gold + underline slides from left, 250ms spring.
- **Table rows:** bg tint `rgba(244,185,100, 0.04)` + left 3px gold bar springs in, 200ms spring. Non-hovered rows subtly dim to 0.85 opacity (nod to DS-4's dimming).
- **Nav:** Gold underline from center + slight translateY(-1px), 250ms spring.
- **Dropdown items:** Left 3px gold bar + bg tint, 200ms spring.
- **Click feel:** `translateY(1px)` on active (from DS-2), 80ms. Spring release back to 0, 250ms.

### Badges

**Square (0px radius) with DS-2's warm color tint system:**

- **Live:** bg `rgba(244,185,100, 0.12)`, text `#f4b964`, 1px border `rgba(244,185,100, 0.20)`. Pulsing 6px square dot. Neue Montreal Medium 11px UPPERCASE tracking 0.08em.
- **Scheduled:** bg `rgba(232,149,106, 0.12)`, text `#e8956a`, border `rgba(232,149,106, 0.20)`.
- **Draft:** bg `rgba(109,141,159, 0.12)`, text `#6d8d9f`, border `rgba(109,141,159, 0.20)`.
- **Failed:** bg `rgba(232,84,84, 0.12)`, text `#e85454`, border `rgba(232,84,84, 0.20)`.
- **New:** bg `rgba(232,149,106, 0.15)`, text `#e8956a` (coral). "NEW" text.
- **Trending:** bg `rgba(244,185,100, 0.15)`, text `#f4b964`.
- **Pro:** bg `rgba(100,220,244, 0.12)`, text `#64dcf4` (cyan accent for premium).
- All: padding 4px 12px, 0px radius.

### Notifications/Toasts

**DS-2's animation in DS-3's container:** Slide up from bottom-center with spring overshoot (300ms `cubic-bezier(0.34, 1.56, 0.64, 1)`). **0px radius, 0px shadow** — just structural border. Left 4px color stripe. Max 3 stacked (DS-2). Font: General Sans (body font). Exit: scale(0.95) + fade, 200ms.

- Info: gold stripe `#f4b964`
- Success: green stripe (use lime `#a4f464` from chart palette)
- Error: red stripe `#e85454`

### Loading States

Cherry-picked from both:
- **Skeleton:** DS-2's warm shimmer (gold-tinted, `#0b2230` → `#163344` → `#0b2230`, 2s ease) but in square blocks (0px radius).
- **Spinner:** DS-2's bouncing dots (3 gold dots, staggered), because it's warmer than the rotating square. But dots are **square** (4px squares, not circles).
- **Progress:** DS-2's gradient bar (`#f4b964` → `#e8956a`) with shimmer overlay, but 0px radius and 4px height (chunkier than DS-3's 2px).

### Depth & Layering

**DS-2's layered shadows in DS-3's square containers.** This is the core visual tension that makes this system unique.

- L1 (cards): `0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)` — resting state
- L2 (cards hover, dropdowns): `0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10)`
- L3 (modals, popovers): `0 12px 40px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.12)`

**Plus noise texture** at 2.5% opacity (from DS-2).

Modal overlay: `rgba(7,26,38, 0.80)` + **backdrop-blur(6px)** — halfway between DS-2's 8px blur and DS-3's no blur.

### Tables

The best of both:
- **Header:** bg `#0b2230`, Neue Montreal Medium 11px UPPERCASE tracking 0.10em, `#6d8d9f`. **2px bottom gold border** (from DS-3). Height 48px.
- **Rows:** 52px (DS-2's generous spacing), General Sans Regular 14px. Hover: bg `rgba(244,185,100, 0.04)` + left 3px gold bar springs in, 200ms spring. Non-hovered rows dim slightly.
- **Row borders:** `rgba(244,185,100, 0.06)` warm tint.
- **Status:** Square badges with warm color tints (described above).
- **Numeric:** JetBrains Mono Bold 14px. Positive `+` gold, negative `-` red. Right-aligned.
- **Pagination:** "1 — 5 of 247" JetBrains Mono 12px, square secondary-style buttons.

### Charts

**DS-2's smooth curves + DS-3's square data points. Mixed palette.**
- **Grid:** Horizontal only (DS-2), `rgba(255,255,255, 0.04)`, no dash.
- **Axis labels:** JetBrains Mono 11px, `#6d8d9f`. Axis lines barely visible.
- **Line chart:** 2.5px stroke, **monotone smooth curves** (DS-2), with **6px square data points** (DS-3). Points appear on hover with spring. Gradient fill 12%→0% (DS-2). Colors: gold, cyan, coral.
- **Bar chart:** 0px radius (square bars), **hover inverts fill↔outline** (DS-3). But bars have layered shadow `0 2px 4px rgba(0,0,0,0.1)`.
- **Tooltip:** 0px radius, bg `#163344`, 1px border, layered shadow. Spring bounce in (250ms). General Sans 13px.
- **Animations:** Lines draw 700ms spring, bars grow 400ms spring with 40ms stagger.

---

## Design System 3: "Soft Edge" (30% Bold Statement / 70% Warm Studio)

**Route:** `/design-system-3`
**Philosophy:** DS-2's warm, approachable personality with DS-3's typographic confidence and bold sizing injected. Notion's friendliness with Bloomberg's headline impact.

### Typography

**Dual font system:** Neue Montreal for headings (DS-3's massive scale), General Sans for everything else (DS-2's warmth).

| Role | Font | Weight | Size | Letter Spacing | Line Height |
|---|---|---|---|---|---|
| Display | Neue Montreal | Bold (700) | 96px / 72px mobile | -0.04em | 0.95 |
| H1 | Neue Montreal | Bold (700) | 48px | -0.03em | 1.05 |
| H2 | Neue Montreal | Medium (500) | 32px | -0.02em | 1.15 |
| H3 | General Sans | Semibold (600) | 20px | -0.005em | 1.3 |
| H4 | General Sans | Medium (500) | 17px | 0em | 1.35 |
| Body | General Sans | Regular (400) | 15px | 0.005em | 1.65 |
| Body Small | General Sans | Regular (400) | 13px | 0.005em | 1.55 |
| Label / Overline | Neue Montreal | Medium (500) | 11px | 0.10em (UPPERCASE) | 1.3 |
| Data / Stat | JetBrains Mono | Medium (500) | 13px | 0.02em | 1.2 |
| Caption | General Sans | Regular (400) | 11px | 0.01em | 1.4 |
| Nav | General Sans | Medium (500) | 14px | 0.04em (UPPERCASE) | 1.0 |
| Code | JetBrains Mono | Regular (400) | 13px | 0em | 1.5 |

**Key difference from System 2:** Display/H1 sizes are MASSIVE (DS-3's full 96px), creating dramatic contrast with the friendly body text. The font switch happens earlier (H2 is Neue Montreal, H3+ is General Sans). Labels use Neue Montreal UPPERCASE (DS-3 authority). Nav uses General Sans (DS-2's friendliness).

### Color Palette

| Token | Value | Notes |
|---|---|---|
| `--background` | `#0a1e2a` | DS-2's warmer background |
| `--card` | `#122838` | DS-2's card |
| `--popover` | `#1a3347` | DS-2's popover |
| `--primary` | `#f4b964` | Brand gold |
| `--primary-foreground` | `#0a1e2a` | |
| `--secondary` | `#1a3347` | |
| `--secondary-foreground` | `#d4dce2` | |
| `--muted` | `#0f2534` | DS-2's muted |
| `--muted-foreground` | `#7d97a8` | DS-2's muted fg |
| `--accent` | `#e8956a` | Coral from DS-2 |
| `--accent-foreground` | `#0a1e2a` | |
| `--foreground` | `#f0f2f4` | DS-2's bright foreground |
| `--border` | `rgba(244,185,100, 0.10)` | DS-2 |
| `--input` | `rgba(244,185,100, 0.12)` | DS-2 |
| `--ring` | `rgba(244,185,100, 0.40)` | DS-2 |
| `--destructive` | `#e85454` | |
| `--chart-1` | `#f4b964` | Gold |
| `--chart-2` | `#e8956a` | Coral |
| `--chart-3` | `#d4784a` | Copper |
| `--chart-4` | `#64dcf4` | Cyan (one DS-3 color for contrast) |
| `--chart-5` | `#f4d494` | Light gold |

**Essentially DS-2's color system** with one cyan chart color borrowed from DS-3 for visual variety.

### Border Radius
`--radius`: `0.125rem` (2px). **Tiny radius** — a compromise. Not DS-3's absolute zero, not DS-2's generous 12px. 2px is barely perceptible but removes the aggressive sharpness. Buttons 2px, cards 4px, inputs 2px, badges 2px, modals 4px, tooltips 2px. This small radius is the key differentiator — things feel sharp but not hostile.

### Buttons

**Primary:** bg `#f4b964`, text `#0a1e2a`, 2px radius. **Hover: HARD INVERT** (from DS-3) — bg transparent, 2px gold border, text gold. **250ms spring**. But also **`box-shadow: 0 4px 12px rgba(244,185,100, 0.25)`** on hover (DS-2's bloom). Active: translateY(1px) + shadow collapse. Font: General Sans Medium 14px (NOT uppercase — this is the DS-2 influence). Padding: 11px 22px, min-height 42px (DS-2's sizing, not DS-3's 48px).

**Secondary (Glass):** bg `rgba(255,255,255, 0.05)` + backdrop-blur(8px), 1px border `rgba(244,185,100, 0.12)`, 2px radius. General Sans Medium 14px. Hover: bg 0.08, border 0.2, translateY(-1px) + shadow bloom. 250ms spring.

**Ghost:** General Sans Medium 14px, text `#7d97a8`. Hover: text `#f0f2f4`, bg `rgba(244,185,100, 0.05)`. 250ms spring.

**Icon Button:** 40px square (not circle — the DS-3 influence), transparent. Hover: bg `rgba(244,185,100, 0.08)`, icon gold, 200ms spring. **No rotate** (DS-2 had rotate 3deg, but that's too playful for this system).

**Destructive:** bg `rgba(232,84,84, 0.10)`, text `#e85454`, 1px border. Hover: hard invert fill + glow.

**Disabled:** 40% opacity.

### Hover & Interactions

Full DS-2 spring system: `cubic-bezier(0.34, 1.56, 0.64, 1)`.

- **Cards:** translateY(-2px) + shadow grows `0 2px 8px → 0 8px 24px` + border brightens, 300ms spring. (Pure DS-2.)
- **Links:** Color → gold + underline, 250ms spring.
- **Table rows:** bg warm tint + left 3px gold bar slides in, 200ms spring. (DS-2.)
- **Nav:** Color → gold + bg tint, 250ms spring. (DS-2 style, not DS-3's underline-from-center.)
- **Click feel:** translateY(1px) active, spring release with overshoot. (DS-2.)
- **Checkboxes/toggles:** Scale pulse 0.9→1.05→1.0, 250ms spring. (DS-2.)

### Badges

**2px radius with DS-2's warm color treatment:**

- **Live:** bg `rgba(244,185,100, 0.12)`, text `#f4b964`, 1px border `rgba(244,185,100, 0.20)`. Pulsing round dot (not square — this system is softer). General Sans Medium 11px UPPERCASE tracking 0.04em.
- **Scheduled:** bg `rgba(232,149,106, 0.12)`, text `#e8956a`, border `rgba(232,149,106, 0.20)`.
- **Draft:** bg `rgba(125,151,168, 0.12)`, text `#7d97a8`, border `rgba(125,151,168, 0.20)`.
- **Failed:** bg `rgba(232,84,84, 0.12)`, text `#e85454`, border `rgba(232,84,84, 0.20)`.
- **New:** Coral tint, text `#e8956a`.
- **Trending:** Gold tint, text `#f4b964`.
- All: padding 4px 12px, 2px radius.

### Notifications/Toasts

**DS-2's toast system** with one DS-3 addition: Slide up from bottom-center, 300ms spring overshoot. **4px radius** (slightly more than the 2px base to feel friendly). Color-coded left stripe 3px. Stacking up to 3. General Sans. Exit: scale down + fade, 200ms.

- Info: gold stripe
- Success: lime stripe
- Error: red stripe

### Loading States

Mostly DS-2:
- **Skeleton:** Warm shimmer (`#0f2534` → `#1a3347` → `#0f2534`), 2s ease, 4px radius.
- **Spinner:** DS-2's bouncing dots (3 gold circles, staggered). Round dots here — soft system.
- **Progress:** DS-2's gradient bar (`#f4b964` → `#e8956a`), 6px height, 2px radius, shimmer overlay.

### Depth & Layering

**DS-2's full shadow system:**
- L1: `0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)`
- L2: `0 4px 16px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.10)`
- L3: `0 12px 40px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.12)`

**Noise texture** at 2.5% opacity.

Modal overlay: `rgba(10,30,42, 0.75)` + backdrop-blur(8px). Full DS-2 glass overlay.

### Tables

DS-2's warm table with DS-3's gold header border:
- **Header:** bg `#0f2534`, General Sans Medium 12px UPPERCASE tracking 0.04em, `#7d97a8`. **2px bottom gold border** (DS-3 injection). Height 44px.
- **Rows:** 52px, General Sans Regular 14px. Hover: bg `rgba(244,185,100, 0.04)` + left 3px gold bar slides in, 200ms spring.
- **Row borders:** `rgba(244,185,100, 0.06)` warm.
- **Status:** 2px-radius badges with warm color tints.
- **Numeric:** JetBrains Mono 13px. Positive gold, negative red.
- **Pagination:** Ghost buttons with General Sans, active gold text.

### Charts

**DS-2's smooth curves with DS-3's angular interpolation on ONE chart for contrast.**

- **Grid:** Horizontal only, `rgba(255,255,255, 0.04)`, no dash.
- **Axis labels:** JetBrains Mono 11px, `#7d97a8`. Clean.
- **Line chart:** 2.5px stroke, **smooth monotone** (DS-2). Round dot data points 5px, appear on hover with spring + shadow. **Gradient fill** 15%→0% (DS-2). Colors: warm palette + one cyan.
- **Bar chart:** **4px radius top only** (DS-2). Hover: translateY(-1px) + shadow grows (DS-2), NOT invert. Warm palette.
- **Pie/Donut:** Segments pull out 4px on hover with spring + shadow (pure DS-2). Center text: Neue Montreal Bold stat (DS-3 typography impact).
- **Tooltip:** 4px radius, bg `#1a3347`, 1px border, layered shadow, spring bounce, General Sans 12px.
- **Animations:** Lines 800ms spring, bars 500ms spring stagger 50ms, pie fans 600ms spring.

---

## Comparison Matrix

| Attribute | System 1 "Warm Brutalist" | System 2 "Studio Brutalist" | System 3 "Soft Edge" |
|---|---|---|---|
| **DNA ratio** | 70% DS-3 / 30% DS-2 | 50/50 | 30% DS-3 / 70% DS-2 |
| **Border radius** | 0px | 0px | 2px |
| **Heading font** | Neue Montreal | Neue Montreal | Neue Montreal |
| **Body font** | Neue Montreal | General Sans | General Sans |
| **Shadows** | None (color stepping) | Layered (DS-2 system) | Layered (DS-2 system) |
| **Button hover** | Hard invert + spring easing | Hard invert + shadow bloom | Hard invert + shadow bloom |
| **Button text** | UPPERCASE | UPPERCASE | Sentence case |
| **Badge shape** | Square | Square | 2px radius |
| **Animations** | Spring easing, no transforms | Spring + translateY | Full DS-2 springs |
| **Noise texture** | Yes (2%) | Yes (2.5%) | Yes (2.5%) |
| **Chart curves** | Angular (linear) | Smooth + square dots | Smooth + round dots |
| **Chart palette** | Warm mono (gold/coral/copper) | Mixed (gold/cyan/coral/lime) | Warm + 1 cyan |
| **Toast position** | Top-center | Bottom-center | Bottom-center |
| **Toast animation** | Spring slide | Spring slide | Spring slide |
| **Table header** | Gold underline | Gold underline | Gold underline |
| **Table row hover** | Gold bar + spring | Gold bar + spring + dimming | Gold bar + spring |
| **Modal overlay** | 90% dark, no blur | 80% dark, blur(6px) | 75% dark, blur(8px) |
| **Overall feel** | Warm editorial | Sharp but alive | Friendly but bold |
