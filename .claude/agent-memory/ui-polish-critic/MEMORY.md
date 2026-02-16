# UI Polish Critic - Project Memory

## Project: PixelPrism V3

### Design System: Studio Brutalist (DS-2)
- Zero border-radius everywhere, spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)`, gold-tinted borders
- Background: `#071a26`, Card: `#0e2838`, Popover: `#163344`
- Primary gold: `#f4b964`, Accent coral: `#e8956a`, Muted teal: `#6d8d9f`
- Fonts: Neue Montreal (headings/labels), General Sans (body/H4+), JetBrains Mono (data)
- Authoritative spec: `docs/vibe-spec.md`

### Tech Stack
- Next.js 16, React 19, Tailwind v4, shadcn/ui, Hugeicons, Bun
- Theme CSS: `styles/ds2-theme.css` (data-slot overrides for shadcn)

### Architecture Decisions
- Uses shadcn `Sidebar` primitives (despite build task spec saying NOT to) - styled via data-slot CSS overrides
- Sidebar: 260px expanded, 64px collapsed, spring-eased transitions
- Theme applied via `.sb-root` class wrapper

### Known Issues (from first review, 2026-02-15)
- Sidebar nav items use General Sans 14px instead of spec's Neue Montreal Nav token (13px uppercase, 0.06em tracking)
- Footer settings/sign-out buttons lack translateY micro-interactions
- No collapse toggle button inside the sidebar itself (only mobile trigger in header)
- `ease-linear` in shadcn sidebar primitives partially overridden by theme CSS but sidebar-gap still uses linear
- Main content `py-8` (32px) instead of spec's `py-16` (64px)
- Notification bell in header has no translateY hover
- Credits indicator hover uses JS onMouseEnter instead of CSS

### Dashboard Page Review (2026-02-16)
- Layout wrapper: `px-6 lg:px-8 py-12 lg:py-16` (layout.tsx line 136) -- py improved from first review
- Page uses `space-y-8` (32px) between sections; spec requires `space-y-32` (128px)
- Grid gaps use `gap-4` (16px); spec requires `gap-6` (24px) for card grids
- BrandSummaryCard: inline SVG sparklines, hardcoded style colors, no hover card active state
- ActivityFeed: inline border styles, no hover/interactive states on feed items
- DS2StatCard: no hover state differentiation (inherits card hover which is inappropriate for non-clickable stat cards)
- No section overline labels (coral `sb-label`) used per spec pattern
- Sparkline gradient uses 20% opacity top; spec says 12% for area charts

### Brands Page Review (2026-02-16) -- FIXED
- Changed card title from `sb-h3` (with font-size override to 18px) to `sb-h4` -- correct token for card titles
- Changed description from `sb-caption` (11px) to `sb-body-sm` (13px) for readability
- Added tooltips to platform icons for accessibility
- Added gold-tinted separator below platform icons section
- Added `marginTop: 2` to stat values for vertical rhythm
- Kebab button: added cursor-pointer and spring easing transition
- Header subtitle: changed from `sb-data` (wrong token) to `sb-body` for descriptive text
- Added brands remaining indicator (3 of 10) with Progress bar in header area
- Increased card inner margin-bottom from `mb-4` to `mb-5` for breathing room

### Billing Page Review (2026-02-16) -- FIXED
- Usage tab large numbers: replaced inline `fontFamily`/`fontSize`/`fontWeight` with `sb-data-lg` class
- Plan features list: added 4x4 gold-tinted square bullet markers (zero border-radius, on-brand)
- Plan feature numbers now use `sb-data` at 12px for data emphasis within body text
- Section heading spacing: increased from `mb-4` to `mb-6` before tabs and table
- Added `aria-label="Download invoice"` to download buttons for accessibility
- Renewal date: changed `mb-4` to `mb-5` for better spacing before feature list

### Tabs Component -- DS-2 overrides added (2026-02-16)
- Added tab overrides to `styles/ds2-theme.css` targeting data-slot selectors
- Tabs list: gold-tinted bottom border, no background, zero radius
- Tab triggers: Neue Montreal 13px/500, uppercase, 0.06em tracking (Nav token)
- Active state: gold underline expanding from center (signature expand-from-center pattern)
- Hover state: partial underline preview + subtle background tint

### Product Pages Review (2026-02-16) -- Post-Redesign Audit
- Major redesign doc (`docs/product-pages-ux-redesign.md`) addressed 28 original problems
- Grid page: section structure patterns added, buttons use clean DS-2 classes, `group-hover/card:scale-[1.02]` for image zoom
- Detail page: explicit section spacing (`mt-10` CTA, `mt-20` gallery), back nav link with `sb-btn-ghost-inline`
- Gallery cards upgraded to `Card` component with `data-interactive`
- Dialog step animation uses `sb-step-in` keyframe (slide from right)
- Empty state: pulsing placeholder grid with staggered delays
- Remaining: `sb-btn-ghost-inline` missing translateY hover (spec violation), gallery masonry not responsive, "Open in Studio" card button is dead-end, status dots lack accessible labels
- `space-y-10` on grid page is off-grid (should be `space-y-8`)
- Section heading spacing: `mb-6` on product pages vs `mb-4` on dashboard -- needs standardization
