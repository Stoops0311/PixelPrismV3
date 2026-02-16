# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PixelPrism is a social media marketing tool for SMBs. It uses a custom design system called "Studio Brutalist" (DS-2) — characterized by zero border-radius, layered shadows, gold-tinted borders, spring easing animations, and a dual-font typography system.

## Commands

- **Dev server:** `bun run dev`
- **Build:** `bun run build`
- **Lint:** `bun run lint`
- **Add shadcn component:** `bunx shadcn@latest add <component>`

## Tech Stack

- **Framework:** Next.js 16 with App Router, React 19, TypeScript
- **Styling:** Tailwind CSS v4 (CSS-based config in `app/globals.css`, no `tailwind.config.ts`)
- **Backend:** Convex (database, queries, mutations, real-time subscriptions)
- **Auth:** Clerk (integrated with Convex via `ConvexProviderWithClerk`)
- **Billing:** Polar (via `@convex-dev/polar` component for subscriptions)
- **Components:** shadcn/ui (`radix-lyra` style, Radix primitives)
- **Icons:** Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`)
- **Charts:** Recharts via shadcn's `chart` component
- **Toasts:** Sonner
- **Package manager:** Bun

## Environment Variables

Required environment variables (add to `.env.local`):
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key (server-side only)
- `CLERK_WEBHOOK_SECRET` — Clerk webhook signing secret (for user sync via Convex HTTP endpoints)

## Architecture

### Routing Structure

- **Landing:** `/` — Public marketing page
- **Auth:** `/sign-in`, `/sign-up` — Clerk-powered auth pages
- **Dashboard:** `/dashboard` — Protected routes (requires auth)
  - `/dashboard` — Global overview (multi-brand)
  - `/dashboard/brands` — Brand selection/management
  - `/dashboard/billing` — Subscription and credits
  - `/dashboard/[brandSlug]` — Brand-specific dashboard
  - `/dashboard/[brandSlug]/logos` — Logo gallery for brand
  - `/dashboard/[brandSlug]/products` — Product listing
  - `/dashboard/[brandSlug]/products/[id]` — Product detail
  - `/dashboard/[brandSlug]/studio` — Creative studio
  - `/dashboard/[brandSlug]/scheduling` — Content scheduling
  - `/dashboard/[brandSlug]/analytics` — Brand analytics
- **Design refs:** `/design-ref`, `/design-system-2` — Visual component showcases (not protected)

### Backend Layer (Convex)

- **Database schema:** Defined in `convex/schema.ts` using Convex's `defineSchema`
- **Queries/Mutations:** Organized by feature in `convex/` directory (e.g., `users.ts`, `polar.ts`)
- **Auth integration:** Convex automatically integrates with Clerk via `ConvexProviderWithClerk` in `lib/convex-provider.tsx`
- **Client setup:** Convex client instantiated with `NEXT_PUBLIC_CONVEX_URL` and wrapped around app in layout
- **Current user query:** Use `api.users.current` to get authenticated user
- **Polar integration:** Subscription/billing logic handled via `@convex-dev/polar` component in `convex/polar.ts`
- **HTTP endpoints:** Defined in `convex/http.ts` (webhooks for Clerk and Polar)
- **Current state:** Dashboard currently uses mock data from `lib/mock-data.ts` — Convex integration is in progress

### Authentication Flow

1. `middleware.ts` runs Clerk middleware on all routes (except static files)
2. Clerk provides auth state to both client (via `useAuth`) and server (via `auth()`)
3. Convex receives auth token via `ConvexProviderWithClerk` and populates `ctx.auth` in queries/mutations
4. User sync happens via Clerk webhook → Convex HTTP endpoint (`/clerk-webhook` in `convex/http.ts`) → internal mutations in `convex/users.ts`
5. Webhook is secured via Svix signature verification using `CLERK_WEBHOOK_SECRET`

### Design System Layer

The app has a two-layer component architecture:

1. **shadcn primitives** (`components/ui/`) — Base components from shadcn. These are styled automatically by CSS when rendered inside the `.sb-root` class via `data-slot` selector overrides in `styles/ds2-theme.css`. Use these directly for form elements (Button, Input, Select, Dialog, etc.) — no wrapper components needed.

2. **DS2 components** (`components/ds2/`) — Custom components for patterns shadcn doesn't provide: `DS2PageLayout`, `DS2Navigation`, `DS2Section`, `StatusBadge`, `DS2StatCard`, `DS2DataTable`, `DS2AreaChart`, `DS2BarChart`, `DS2Spinner`, toast helpers.

### Theming

- All DS-2 CSS lives in `styles/ds2-theme.css` (imported via `globals.css`). This file contains font-face declarations, CSS variable overrides, typography utility classes (`.sb-display` through `.sb-caption`), button variant classes (`.sb-btn-primary`, etc.), `data-slot` overrides for all shadcn components, and animation keyframes.
- Theme is applied by wrapping content in `.sb-root` (done by `DS2ThemeProvider` or `DS2PageLayout`).
- shadcn components use `data-slot` attributes — the theme CSS targets these (e.g., `.sb-root [data-slot="card"]`) to apply DS-2 styling.
- Button styling uses CSS classes, not shadcn variants: `<Button className="sb-btn-primary">`.

### Fonts

Three font families loaded via `@font-face` in the theme CSS (not Google Fonts):
- **Neue Montreal** (OTF, `/fonts/NeueMontreal-*.otf`) — Headings H1–H3, labels, nav
- **General Sans** (Variable WOFF2) — H4 and below, body text
- **JetBrains Mono** (Variable WOFF2) — Data/stats, code

### Key Design Tokens

- Spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Border radius: `0rem` everywhere
- Primary: `#f4b964` (gold), Accent: `#e8956a` (coral), Background: `#071a26`
- Borders are gold-tinted at low opacity (6%–45% scale)

## Important Files

- `docs/vibe-spec.md` — **The authoritative design spec.** Read this before building any new page. Contains exact color values, typography rules, shadow tiers, animation specs, interaction patterns, and inviolable design rules.
- `styles/ds2-theme.css` — All DS-2 CSS (variables, fonts, component overrides, keyframes)
- `app/design-system-2/page.tsx` — Living showcase/reference implementation of all components
- `components.json` — shadcn configuration (radix-lyra style, hugeicons)
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `lib/mock-data.ts` — Mock data used throughout dashboard (will be replaced with Convex queries)

## Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`). Example: `@/components/ui/button`, `@/components/ds2/status-badge`, `@/lib/utils`.

## Component Usage Patterns

### Using Buttons

Buttons use CSS classes, not shadcn's variant prop:
```tsx
<Button className="sb-btn-primary">Primary Action</Button>
<Button className="sb-btn-secondary">Secondary</Button>
<Button className="sb-btn-ghost">Ghost</Button>
```

### Theme Provider

Pages that need DS-2 styling must be wrapped with `DS2ThemeProvider` (adds `.sb-root` class):
```tsx
export default function MyPage() {
  return (
    <DS2ThemeProvider>
      {/* Your content */}
    </DS2ThemeProvider>
  )
}
```

The root layout already has `.sb-root` in the body class, so only use `DS2ThemeProvider` if you need isolated theming (like in `/dashboard` layout).

### Typography

Use utility classes for consistent typography:
- `.sb-display` — Hero text (64px, Neue Montreal)
- `.sb-headline` — H1 (48px, Neue Montreal)
- `.sb-title-lg` through `.sb-title-sm` — H2-H4 (32-20px)
- `.sb-body` — Default body (16px, General Sans)
- `.sb-label`, `.sb-caption` — Small text (14-12px)
- `.sb-data` — Numeric data (JetBrains Mono)

### Icons

Use Hugeicons components:
```tsx
import { Add01Icon, Settings01Icon } from "@hugeicons/react"

<Add01Icon className="w-5 h-5" />
```
