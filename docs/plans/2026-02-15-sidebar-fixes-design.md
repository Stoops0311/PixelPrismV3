# Sidebar Fixes: Subscription Model + Collapsed State + Badge Standardization

**Date:** 2026-02-15
**Status:** Approved

---

## Problem Statement

Three issues with the current sidebar implementation:

1. **Subscription model is per-brand, should be per-account.** The `Brand` type has a `tier` field and the brand switcher shows "Professional Plan" under each brand. Subscriptions should be account-level — one plan governs all brands.

2. **Collapsed sidebar (64px) looks broken.** The logo, brand avatar, and nav icons are not properly centered. The header area uses horizontal flex that doesn't reflow on collapse. Nav button sizing is overridden by competing CSS (`!important` in ds2-theme.css vs shadcn's collapsed classes). The gold active bar position doesn't adapt.

3. **Badges are inconsistent.** The Logos notification dot is inside a `SidebarMenuBadge` which gets hidden on collapse via `group-data-[collapsible=icon]:hidden`. Count badges need consistent right-edge alignment. Tooltips don't include counts when collapsed.

---

## Fix 1: Subscription Model — Account-Level

### Type Changes

**Remove `tier` from `Brand`:**
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

**Add `AccountSubscription`:**
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

### Mock Data Changes

- Remove `tier` from each brand in `MOCK_BRANDS`
- Add `MOCK_SUBSCRIPTION` to `lib/mock-data.ts`

### Brand Switcher Changes

- Remove tier badge display
- Subtitle under brand name becomes follower count in JetBrains Mono muted text (e.g., "5,247 followers")
- Dropdown items: avatar + name + follower count (no tier badge)
- "Create New Brand" action stays the same

---

## Fix 2: Collapsed Sidebar Visual Alignment

### Root Causes

1. **SidebarHeader** has `padding: 16px` from CSS override. Logo mark and brand avatar are in a horizontal flex with `gap-3` and `px-1`. On collapse, the flex doesn't reflow to center items.

2. **SidebarMenuButton** in collapsed mode: shadcn CVA sets `size-8! p-2!` (32x32, 8px padding). DS2 CSS overrides set `padding: 10px 8px !important` and `min-height: 40px !important`. Both use `!important` but the CSS file wins for padding/min-height, creating asymmetric buttons that don't center icons.

3. **Gold active bar** `::before` is at `left: -12px` relative to the button. In collapsed mode with different padding/group structure, it misaligns.

### Fixes

**Sidebar header (collapsed):**
- Add CSS targeting collapsed state: reduce header padding, center items
- Logo mark and brand avatar should stack vertically when collapsed, each centered in the 64px width
- Brand switcher trigger: when collapsed, show only the avatar centered with no text

**Nav buttons (collapsed):**
- Add collapsed-specific CSS in `ds2-theme.css`:
  - Override button sizing when inside `[data-collapsible="icon"]`
  - Set `width: 40px`, `height: 40px`, `padding: 10px`, centered via `margin: 0 auto` or flexbox
  - Icon stays 20x20, perfectly centered in the 40x40 button

**Active bar (collapsed):**
- Keep the gold left bar. It sits at `left: -12px` which aligns to the sidebar group's left edge (group has `padding: 12px`). Once the button is properly centered and sized, the bar at the sidebar edge will look intentional and correct.
- Verify the bar is visible and properly positioned after button centering fixes.

**SidebarGroup padding (collapsed):**
- May need to adjust group padding in collapsed mode so content centers properly in 64px width.

---

## Fix 3: Badge & Notification Dot Standardization

### Logos Notification Dot

**Current:** Inside a `SidebarMenuBadge` sibling to the button. Gets hidden on collapse.

**Fix:** Move the notification dot **inside** the `SidebarMenuButton`, absolutely positioned relative to the icon wrapper. This way:
- Expanded: dot appears to the right of the "Logos" text label
- Collapsed: dot overlaps the top-right corner of the icon (always visible)
- Use a 6x6 gold pulsing square per vibe-spec (not a circle)
- Apply `sb-pulse-dot` animation class

### Count Badges

**Current behavior is mostly correct** — they hide on collapse (counts go in tooltips), use JetBrains Mono 11px, gold-tinted container.

**Fix:** Ensure right-edge alignment is consistent across all nav items by verifying the CSS override positions them properly relative to the menu item padding.

### Tooltip Enhancement

When collapsed, tooltips should include counts:
- "Products (12)"
- "Gallery (47)"
- "Scheduling (3)"
- "Logos" (notification state communicated by the visible dot, no text change needed)

---

## Files to Modify

| File | Changes |
|------|---------|
| `types/dashboard.ts` | Remove `tier` from `Brand`, add `AccountSubscription` |
| `lib/mock-data.ts` | Remove tier from brands, add `MOCK_SUBSCRIPTION` |
| `components/ds2/brand-switcher.tsx` | Remove tier display, show followers as subtitle |
| `components/ds2/sidebar.tsx` | Restructure header for collapse centering, move Logos dot inside button, add counts to tooltips |
| `styles/ds2-theme.css` | Add collapsed-state CSS overrides for header, buttons, groups |

---

## Anti-Patterns to Avoid

- Don't use `display: none` for collapsing text — use `opacity: 0` with transition per the UX story spec
- Don't add border-radius to anything
- Don't use gray/white borders — gold-tinted only
- Don't break the spring easing on collapse/expand transitions
