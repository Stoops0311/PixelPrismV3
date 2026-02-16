# Sidebar Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix three sidebar issues: move subscription from brand-level to account-level, fix collapsed state visual alignment, and standardize badges/notification dots.

**Architecture:** Modify types and mock data to decouple subscriptions from brands. Add collapsed-specific CSS overrides in `ds2-theme.css` to properly center icons/avatars in 64px mode. Restructure the Logos notification dot to live inside the button (not a sibling badge) so it persists when collapsed.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui sidebar, custom DS-2 theme CSS.

**Design Doc:** `docs/plans/2026-02-15-sidebar-fixes-design.md`

**Key Reference Files:**
- `docs/vibe-spec.md` — Authoritative design spec (zero border-radius, spring easing, gold borders, 6x6 square pulse dot)
- `docs/dashboard-ux-story.md` Section 2 — Sidebar layout spec (expanded/collapsed states, animation behavior)
- `styles/ds2-theme.css` lines 980-1150 — All sidebar CSS overrides
- `components/ui/sidebar.tsx` — shadcn sidebar primitives (CVA classes, data-slot attributes, collapse logic)

---

### Task 1: Update Types — Remove tier from Brand, Add AccountSubscription

**Files:**
- Modify: `types/dashboard.ts`

**Step 1: Remove `tier` from `Brand` interface**

In `types/dashboard.ts`, remove the `tier` field from the `Brand` interface:

```typescript
export interface Brand {
  id: string
  slug: string
  name: string
  initials: string
  followers: number
  engagementRate: number
}
```

**Step 2: Add `AccountSubscription` interface**

Add below the existing interfaces in `types/dashboard.ts`:

```typescript
export interface AccountSubscription {
  plan: "Starter" | "Professional" | "Enterprise"
  pricePerMonth: number
  creditsPerMonth: number
  maxBrands: number
  maxSocialAccounts: number
  renewalDate: string
}
```

**Step 3: Verify no TypeScript errors**

Run: `bun run build 2>&1 | head -30`

Expected: Build errors in `brand-switcher.tsx` and `lib/mock-data.ts` referencing `tier`. This is expected — we fix those in the next tasks.

---

### Task 2: Update Mock Data — Remove tier, Add Subscription

**Files:**
- Modify: `lib/mock-data.ts`

**Step 1: Remove `tier` from each brand in `MOCK_BRANDS`**

Remove the `tier` property from all three brand objects. They should look like:

```typescript
export const MOCK_BRANDS: Brand[] = [
  {
    id: "1",
    slug: "sunrise-coffee-co",
    name: "Sunrise Coffee Co",
    initials: "SC",
    followers: 5247,
    engagementRate: 4.7,
  },
  {
    id: "2",
    slug: "coastal-surf-shop",
    name: "Coastal Surf Shop",
    initials: "CS",
    followers: 3821,
    engagementRate: 3.2,
  },
  {
    id: "3",
    slug: "mountain-yoga-studio",
    name: "Mountain Yoga Studio",
    initials: "MY",
    followers: 8456,
    engagementRate: 5.1,
  },
]
```

**Step 2: Add `MOCK_SUBSCRIPTION`**

Add the import for `AccountSubscription` and the mock data:

```typescript
import type { Brand, DashboardUser, BrandNavCounts, AccountSubscription } from "@/types/dashboard"

// ... after MOCK_BRAND_COUNTS ...

export const MOCK_SUBSCRIPTION: AccountSubscription = {
  plan: "Professional",
  pricePerMonth: 29,
  creditsPerMonth: 400,
  maxBrands: 10,
  maxSocialAccounts: 15,
  renewalDate: "2026-03-15",
}
```

---

### Task 3: Update Brand Switcher — Remove Tier, Show Followers

**Files:**
- Modify: `components/ds2/brand-switcher.tsx`

**Step 1: Remove `tierToStatus` function and `StatusBadge` import**

Delete the `tierToStatus` function (lines 24-33) and remove the `StatusBadge` import.

**Step 2: Update trigger subtitle**

Replace the tier display under the brand name with follower count. Change the subtitle div from:

```tsx
<div className="sb-caption" style={{ color: "#6d8d9f" }}>
  {currentBrand?.tier ?? ""} Plan
</div>
```

To:

```tsx
<div className="sb-data" style={{ color: "#6d8d9f", fontSize: "11px" }}>
  {currentBrand?.followers.toLocaleString() ?? "0"} followers
</div>
```

**Step 3: Update dropdown items**

In each `DropdownMenuItem`, remove the `StatusBadge` tier badge. Replace the `flex-1 min-w-0` div contents from:

```tsx
<div className="flex-1 min-w-0">
  <div className="sb-h4 truncate" style={{ color: "#eaeef1", fontSize: "14px" }}>
    {brand.name}
  </div>
  <div className="flex items-center gap-2 mt-0.5">
    <StatusBadge status={tierToStatus(brand.tier)}>{brand.tier}</StatusBadge>
  </div>
</div>
```

To:

```tsx
<div className="flex-1 min-w-0">
  <div className="sb-h4 truncate" style={{ color: "#eaeef1", fontSize: "14px" }}>
    {brand.name}
  </div>
</div>
```

The follower count `<span>` to the right of the name is already there — keep it as-is.

**Step 4: Verify build**

Run: `bun run build 2>&1 | head -30`

Expected: Clean build (no TypeScript errors).

**Step 5: Commit**

```bash
git add types/dashboard.ts lib/mock-data.ts components/ds2/brand-switcher.tsx
git commit -m "refactor: move subscription from brand-level to account-level

Remove tier from Brand type and brand switcher. Add AccountSubscription
type and MOCK_SUBSCRIPTION for account-level plan info. Brand switcher
now shows follower count instead of subscription tier."
```

---

### Task 4: Fix Collapsed Sidebar CSS — Header, Buttons, Groups

**Files:**
- Modify: `styles/ds2-theme.css` (append after existing sidebar section, around line 1150)

This is the critical visual fix. All changes are CSS-only, targeting the collapsed state via the `[data-collapsible="icon"]` attribute that shadcn adds to the sidebar's parent `div[data-slot="sidebar"]` when collapsed.

**Step 1: Add collapsed header CSS**

Append after line 1150 in `ds2-theme.css`:

```css
/* ══════════════════════════════════════════════════════════════════════════
   COLLAPSED SIDEBAR OVERRIDES
   Applied when sidebar is in icon-only mode (64px width).
   The parent div[data-slot="sidebar"] gets data-collapsible="icon".
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Collapsed Header — center items vertically ───────────────────────── */

[data-collapsible="icon"] [data-slot="sidebar-header"] {
  padding: 12px 0 !important;
  align-items: center !important;
}
```

**Step 2: Add collapsed group padding CSS**

Center the nav groups within 64px:

```css
/* ── Collapsed Groups — center content in 64px width ──────────────────── */

[data-collapsible="icon"] [data-slot="sidebar-group"] {
  padding: 8px 0 !important;
  align-items: center !important;
}
```

**Step 3: Add collapsed menu button CSS**

Override the nav button sizing so icons center properly:

```css
/* ── Collapsed Nav Buttons — square, centered, icon-only ──────────────── */

[data-collapsible="icon"] [data-slot="sidebar-menu-button"] {
  width: 40px !important;
  height: 40px !important;
  min-height: 40px !important;
  padding: 0 !important;
  justify-content: center !important;
  margin: 0 auto !important;
}
```

**Step 4: Add collapsed active bar fix**

The `::before` gold bar needs to anchor to the left edge of the sidebar, not the button:

```css
/* ── Collapsed Active Bar — anchor to sidebar left edge ───────────────── */

[data-collapsible="icon"] [data-slot="sidebar-menu-button"]::before {
  left: -12px !important;
}
```

Note: With group padding at `0` and button centered via margin auto, we need the bar to reach the sidebar edge. Since the button is `40px` centered in `64px`, there's `12px` on each side. `left: -12px` from the button edge hits the sidebar edge. Verify visually — if the group padding changes, this offset may need adjustment.

**Step 5: Add collapsed footer CSS**

Center the user avatar in collapsed mode:

```css
/* ── Collapsed Footer — center avatar ─────────────────────────────────── */

[data-collapsible="icon"] [data-slot="sidebar-footer"] {
  padding: 12px 0 !important;
  align-items: center !important;
  justify-content: center !important;
}
```

**Step 6: Verify visually**

Run: `bun run dev`

Check the sidebar in both states:
1. Expanded (260px): Should look exactly as before — no regressions.
2. Collapsed (64px): Logo mark, brand avatar, nav icons, and user avatar should all be centered in the 64px column. Active item should show gold left bar at sidebar edge.

---

### Task 5: Fix Sidebar Component — Header Centering + Collapsed Layout

**Files:**
- Modify: `components/ds2/sidebar.tsx`

**Step 1: Update logo header for collapse centering**

The current logo area uses a horizontal flex that doesn't adapt to collapse. Replace the logo header div in `SidebarHeader` (lines 77-105) with:

```tsx
<div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-1"}`}>
  {/* Logo mark */}
  <div
    className="w-8 h-8 shrink-0 flex items-center justify-center"
    style={{
      background: "#f4b964",
      boxShadow: "0 0 12px rgba(244, 185, 100, 0.25)",
    }}
  >
    <span
      style={{
        color: "#071a26",
        fontFamily: "'Neue Montreal', sans-serif",
        fontWeight: 700,
        fontSize: "14px",
      }}
    >
      P
    </span>
  </div>
  {!collapsed && (
    <span
      className="sb-h4 truncate"
      style={{ color: "#eaeef1", letterSpacing: "-0.02em" }}
    >
      PixelPrism
    </span>
  )}
</div>
```

**Step 2: Update footer for collapse centering**

Replace the footer div (lines 210-256) to center the avatar when collapsed:

```tsx
<div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
  <Avatar className="h-8 w-8 shrink-0">
    <AvatarFallback
      style={{
        background: "#163344",
        color: "#6d8d9f",
        border: "1px solid rgba(244,185,100,0.12)",
        fontFamily: "'Neue Montreal', sans-serif",
        fontWeight: 500,
        fontSize: "11px",
      }}
    >
      {user.initials}
    </AvatarFallback>
  </Avatar>

  {!collapsed && (
    <div className="flex-1 min-w-0">
      <div
        className="sb-h4 truncate"
        style={{ color: "#eaeef1", fontSize: "13px" }}
      >
        {user.name}
      </div>
      <div className="sb-caption truncate" style={{ color: "#6d8d9f" }}>
        {user.email}
      </div>
    </div>
  )}

  {!collapsed && (
    <div className="flex items-center gap-1">
      <button
        className="p-1.5 transition-colors duration-200 hover:text-[#f4b964]"
        style={{ color: "#6d8d9f" }}
      >
        <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} className="size-4" />
      </button>
      <button
        className="p-1.5 transition-colors duration-200 hover:text-[#e85454]"
        style={{ color: "#6d8d9f" }}
      >
        <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} className="size-4" />
      </button>
    </div>
  )}
</div>
```

**Step 3: Verify build**

Run: `bun run build 2>&1 | head -30`

Expected: Clean build.

**Step 4: Commit**

```bash
git add styles/ds2-theme.css components/ds2/sidebar.tsx
git commit -m "fix: center sidebar elements in collapsed (64px) state

Add collapsed-specific CSS overrides for header, groups, nav buttons,
active bar, and footer. Update sidebar component to use conditional
flex layout for proper centering when collapsed."
```

---

### Task 6: Fix Logos Notification Dot — Persist in Collapsed Mode

**Files:**
- Modify: `components/ds2/sidebar.tsx`

**Step 1: Move notification dot inside the SidebarMenuButton**

Currently the Logos notification dot is a sibling `SidebarMenuBadge` that gets hidden on collapse. Move it inside the button as an absolutely-positioned element.

In the brand nav items `map` (around lines 142-168), restructure the Logos item rendering. Replace the current pattern:

```tsx
<SidebarMenuButton
  asChild
  isActive={isActive}
  tooltip={item.label}
>
  <Link href={href}>
    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
    <span>{item.label}</span>
  </Link>
</SidebarMenuButton>

{/* Count badge or Logos notification dot */}
{isLogos && logosHasNotification && (
  <SidebarMenuBadge>
    <div
      className="w-1.5 h-1.5 sb-pulse-dot"
      style={{ background: "#f4b964" }}
    />
  </SidebarMenuBadge>
)}
```

With:

```tsx
<SidebarMenuButton
  asChild
  isActive={isActive}
  tooltip={item.label}
>
  <Link href={href}>
    <span className="relative">
      <HugeiconsIcon icon={item.icon} strokeWidth={2} />
      {isLogos && logosHasNotification && (
        <span
          className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sb-pulse-dot"
          style={{ background: "#f4b964" }}
        />
      )}
    </span>
    <span>{item.label}</span>
  </Link>
</SidebarMenuButton>
```

This places the 6x6 gold pulsing square on the icon itself — visible in both expanded and collapsed states.

**Step 2: Remove the old SidebarMenuBadge for Logos**

Delete the `{isLogos && logosHasNotification && (...)}` block that used `SidebarMenuBadge`. It's been replaced by the inline dot above.

**Step 3: Add CSS for notification dot icon wrapper**

In `styles/ds2-theme.css`, add after the collapsed overrides:

```css
/* ── Notification Dot on Sidebar Icons ────────────────────────────────── */

.sb-root [data-slot="sidebar-menu-button"] .relative {
  display: inline-flex;
}
```

This ensures the icon wrapper with `relative` positioning displays correctly within the flex button layout.

**Step 4: Verify visually**

Run: `bun run dev`

Check:
1. Expanded: Gold pulsing dot appears near the Logos icon (top-right of icon area)
2. Collapsed: Same dot visible overlapping the icon's top-right corner
3. Count badges (Products 12, Gallery 47, Scheduling 3) still hidden when collapsed

---

### Task 7: Add Counts to Collapsed Tooltips

**Files:**
- Modify: `components/ds2/sidebar.tsx`

**Step 1: Update tooltip text to include counts**

In the brand nav items `map`, change the `tooltip` prop on `SidebarMenuButton` to include the count when available:

Replace:

```tsx
tooltip={item.label}
```

With:

```tsx
tooltip={count !== undefined ? `${item.label} (${count})` : item.label}
```

This gives tooltips like "Products (12)", "Gallery (47)", "Scheduling (3)" when hovering collapsed items.

**Step 2: Verify build**

Run: `bun run build 2>&1 | head -30`

Expected: Clean build.

**Step 3: Commit**

```bash
git add components/ds2/sidebar.tsx styles/ds2-theme.css
git commit -m "fix: standardize sidebar badges and notification dot

Move Logos notification dot inside the button so it persists in collapsed
mode. Add counts to collapsed tooltip text. Notification dot is now a 6x6
gold pulsing square positioned on the icon itself."
```

---

### Task 8: Final Verification

**Step 1: Full build check**

Run: `bun run build`

Expected: Clean build, zero errors.

**Step 2: Visual verification checklist**

Run: `bun run dev` and verify each item:

- [ ] Brand switcher shows name + followers (no tier/plan text)
- [ ] Brand switcher dropdown shows name + follower count (no tier badge)
- [ ] Expanded sidebar: all nav items aligned, active bar visible, badges positioned
- [ ] Collapsed sidebar: logo mark centered in 64px
- [ ] Collapsed sidebar: brand avatar centered in 64px
- [ ] Collapsed sidebar: all nav icons centered in 64px
- [ ] Collapsed sidebar: active item has gold left bar at sidebar edge
- [ ] Collapsed sidebar: Logos notification dot visible on icon
- [ ] Collapsed sidebar: count badges hidden (not visible)
- [ ] Collapsed sidebar: tooltips show counts ("Products (12)")
- [ ] Collapsed sidebar: user avatar centered at bottom
- [ ] Expand/collapse transition smooth (300ms spring easing)
- [ ] No border-radius anywhere

**Step 3: Final commit if any adjustments were needed**

If visual verification reveals any positioning tweaks (e.g., active bar offset needs fine-tuning), fix and commit.
