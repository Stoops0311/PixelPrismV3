# UX Story Architect Memory

## Project: PixelPrism
- Social media marketing tool for SMBs
- Design system: Studio Brutalist (DS-2) -- "Sharp but Alive"
- Auth: Clerk | Backend: Convex | Framework: Next.js 16 + React 19

## Key Design Decisions (Dashboard)
- **Sidebar: custom-built, collapsible (260px -> 64px)**, NOT shadcn sidebar
- **Top bar repurposed as contextual header** (breadcrumb + actions + credits)
- **Logos AI presence: sidebar dot + dashboard insight card + contextual suggestions**
- **No pie/donut charts** -- DS-2 uses area and bar charts only
- **Gallery uses CSS column-based masonry**, not JS library
- **Calendar built custom**, no third-party calendar library
- **Chat built custom**, no third-party chat UI library

## DS-2 Rules (Quick Reference)
- Zero border-radius everywhere, no exceptions
- Spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` on all interactive transitions
- Gold borders only: `#f4b964` at opacity scale (6%-45%)
- Dual-layer shadows (except toasts)
- Fonts: Neue Montreal (headings/labels), General Sans (body, H4 down), JetBrains Mono (data)
- translateY: -2px hover, +1px active on all clickable elements
- Hard invert pattern on primary buttons

## Component Architecture
- shadcn primitives in `components/ui/` styled via `data-slot` in `styles/ds2-theme.css`
- DS2 components in `components/ds2/` for patterns shadcn doesn't cover
- Theme applied via `.sb-root` class (on body in layout.tsx)
- See `docs/dashboard-ux-story.md` Section 8 for full component specs

## Dashboard Layout Details
- Layout has TWO page categories, route-detected via `isWorkspacePage` regex in layout.tsx
  - **Content pages** (Overview, Products, Analytics, Billing, Brands): `px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto w-full`
  - **Workspace pages** (Studio, Logos Chat): `w-full h-[calc(100vh-64px)]` -- full-bleed, no padding, fixed viewport height
- Header height: 64px, sticky
- Workspace pages handle their own internal padding (Studio: 32px on gen panel, 24px on gallery; Chat: px-6 lg:px-8 pt-4)
- SidebarProvider + SidebarInset pattern from shadcn sidebar primitives
- Studio gen panel capped at `min(35%, 480px)` width to prevent wasted space on ultrawide
- Gallery masonry: 2 cols default, 3 cols at lg+ (or via @container query at 700px+)

## Logos Chat UX Patterns (from redesign analysis)
- See `docs/logos-chat-ux-redesign.md` for full spec
- Messages need variable spacing (8px same-sender, 20px role-change, 32px before reports)
- Use `ScrollArea` not raw `overflow-y-auto` for scrollable containers
- Use `InputGroup` component for chat input (not raw Card+Textarea)
- Logos geometric mark: two overlapping gold rectangles forming "L" shape
- Four chat animations: msg-send (250ms), msg-receive (300ms), prompt-appear (staggered), typing (1.5s loop)
- Report cards use popover depth (#163344) with coral overline label
- Suggested prompts click-to-send (not click-to-fill)

## Common Pitfalls Found
- `!important` override spam on button classes -- work WITH the design system
- Inline `onMouseEnter`/`onMouseLeave` for hover states -- prefer CSS classes where possible
- Height calcs using `calc(100vh - Xpx)` that guess parent padding are fragile -- use workspace layout category instead
- Negative margin hacks to "break out" of layout padding -- use route-aware layout conditional
- Local `@keyframes` in `<style>` tags -- use theme CSS keyframes instead
- Missing `Tooltip` on icon-only buttons (accessibility)
- Inline `<style>` blocks inside JSX for hover effects -- use Tailwind `group-hover/card:` instead
- Uniform `space-y-8` for entire pages -- use vibe spec vertical rhythm (128/32/24px hierarchy)
- Overriding `sb-data` font-size (14px spec) to 13px -- breaks the type scale contract
- Inline styles duplicating theme CSS shadow/border values -- use `Card` component or `data-slot`
- Gallery image cards missing hover states entirely -- violates Rule 7 of DS-2
- Nested typography classes (`sb-caption` wrapping `sb-data`) -- use one or the other

## Gold-Standard Section Pattern
Dashboard pages follow: coral `sb-label` overline -> `sb-h3` heading -> `mb-6` -> content.
Example from `app/dashboard/page.tsx`: "Portfolio" / "Your Brands", "AI Insights" / etc.

## Product Pages Audit
- See `docs/product-pages-ux-redesign.md` for full audit and fix spec
- 28 diagnosed problems, 16 specific fixes
- Primary complaint: insufficient spacing (uniform space-y-8 on detail page)
- "Open in Studio" button needs icon + contextual sub-text
- Masonry gap should be 24px (was 16px), margins 24px (was 16px)

## Files
- `docs/vibe-spec.md` -- Authoritative design spec (read FIRST before any page design)
- `docs/dashboard-ux-story.md` -- Dashboard UX specification
- `docs/logos-chat-ux-redesign.md` -- Logos Chat redesign spec
- `docs/product-pages-ux-redesign.md` -- Product pages audit and fix spec
- `styles/ds2-theme.css` -- All DS-2 CSS
- `app/design-ref/page.tsx` -- Living component reference
- `app/dashboard/page.tsx` -- Gold-standard reference page (Global Overview)
