# Product Pages UX Redesign

**Scope:** Products Grid Page + Product Detail Page
**Status:** Audit and fix specification
**Referenced Files:**
- `/mnt/games-and-things/PixelPrismV3/app/dashboard/[brandSlug]/products/page.tsx` (Products Grid)
- `/mnt/games-and-things/PixelPrismV3/app/dashboard/[brandSlug]/products/[id]/page.tsx` (Product Detail)
- `/mnt/games-and-things/PixelPrismV3/app/dashboard/page.tsx` (Gold-standard reference)
- `/mnt/games-and-things/PixelPrismV3/styles/ds2-theme.css` (DS-2 theme)
- `/mnt/games-and-things/PixelPrismV3/docs/vibe-spec.md` (Authoritative design spec)
- `/mnt/games-and-things/PixelPrismV3/docs/dashboard-ux-story.md` (UX story, Section 4.3)
- `/mnt/games-and-things/PixelPrismV3/docs/dashboard-build-tasks.md` (Tasks 7 and 7b)

---

## 1. Diagnosed Problems

### Products Grid Page (`products/page.tsx`)

**P1. Missing section structure pattern.**
The gold-standard dashboard page (`app/dashboard/page.tsx`) uses a consistent section pattern: a coral overline label (`sb-label`, `#e8956a`), a section heading (`sb-h3`), then the section content. Every section on the Overview page follows this: "Portfolio" / "Your Brands", "AI Insights" / "Logos Weekly Digest", "Scheduling" / "Upcoming Posts", "Timeline" / "Recent Activity". The Products page has no such section structure for its grid. The heading goes straight from `sb-h1` to the grid with no intermediate visual rhythm.

**P2. Page header subtitle uses wrong spacing.**
Line 193: `className="sb-body mt-2"` uses `mt-2` (8px) between the page title and its description. The gold-standard page uses `mt-3` (12px) for the same pattern (line 287). This is tight enough to feel cramped on a 44px heading.

**P3. Product count uses wrong typography hierarchy.**
Lines 196-200: The product count is wrapped in `sb-caption` containing `sb-data` with a forced `fontSize: 11` override. This is both semantically confused (nested typography classes fighting each other) and visually timid. The gold-standard page (line 287) and the build tasks spec both call for "count in JetBrains Mono" as a natural `sb-data` element, not a caption wrapping a data span with an override.

**P4. "Add Product" button uses `!important` overrides to shrink the design system.**
Line 104: `className="sb-btn-primary !px-4 !py-2 !min-h-[36px] !text-xs"`. This fights the design system. The `sb-btn-primary` class defines `padding: 12px 28px !important` and `min-height: 48px !important` for a reason -- those are the DS-2 button dimensions. Using `!important` to shrink them to 36px height and 8px/16px padding creates an undersized, off-spec button that looks anemic compared to every other primary button in the dashboard. The build tasks spec says this button belongs "in the header action slot," meaning it should be in the contextual top header bar (the `DashboardHeader` component), not inline in the page content.

**P5. Product card image hover uses broken inline `<style>` tag.**
Lines 51-55: A `<style>` tag is injected inside each card trying to target the gradient div on group hover. This selector (`group:hover div[style*="background: linear-gradient"]`) is fragile and selector-level string matching on inline styles is not reliable across browsers. Furthermore, this puts a `<style>` element inside each rendered card, creating N style blocks for N products. The hover should use a CSS class or Tailwind's `group-hover:` utilities.

**P6. "Open in Studio" button uses `!important` spam.**
Line 84: `className="sb-btn-secondary !px-4 !py-2 !min-h-[36px] !text-xs w-full"`. Same problem as P4 -- fighting the design system to make the button smaller. The secondary button spec (`sb-btn-secondary`) defines `padding: 12px 28px`, `min-height: 48px`. The override creates a visually inconsistent button. Additionally, `!text-xs` overrides the button's `font-size: 13px` with 12px, breaking the typography contract.

**P7. Card `CardContent` has minimal padding.**
Line 58: `<CardContent className="pt-4">`. The `CardContent` component provides `px-4` (16px horizontal) by default (from `card.tsx` line 70). Combined with only `pt-4` (16px top), the content feels cramped beneath the image. Compare to the gold-standard's `BrandSummaryCard` which uses the default `CardContent` padding without overrides and has `mb-4` spacers between content groups (lines 86, 105, 119).

**P8. No card hover shadow bloom or border animation.**
The DS-2 card hover spec requires: `translateY(-2px)`, shadow base to elevated, border 12% to 22%, and gold bloom. The theme CSS handles this for `a [data-slot="card"]` (line 321-325 of `ds2-theme.css`), and since the entire card is wrapped in a `<Link>`, the lift and elevated shadow will fire. But the gold bloom (the third layer of the box-shadow: `0 0 20px rgba(244, 185, 100, 0.20)`) is not included in the theme CSS card hover -- it is only on `sb-btn-primary:hover`. The product cards should match the UX story spec which calls for "standard DS-2 card hover + product image scales to 1.02."

**P9. No stagger animation on card load.**
The build tasks spec and UX story call for stat cards (and by extension, content grids) to stagger their load animation. The gold-standard page doesn't implement this either, but it is specified in the micro-interactions catalog (Section 7.2). For product cards, a left-to-right stagger on page load would add the "alive" quality the system demands.

**P10. Card footer border uses wrong opacity.**
Line 82: `border-t border-[rgba(244,185,100,0.06)]`. The gold-tinted border opacity scale from the vibe spec says `0.06` is for "barely visible separators (e.g., between list items)." A card footer divider should use `0.08` (section dividers) or ideally just the default `border-t` which inherits from the theme's `--border: rgba(244,185,100, 0.12)`. The `CardFooter` component already applies `border-t` (line 80 of `card.tsx`), so adding `border-t` again with a lower opacity fights the built-in styling.

**P11. The "Open in Studio" button `onClick={(e) => e.preventDefault()}` creates a dead end.**
Line 86: The button prevents the link from firing but does nothing else. This means clicking the button anywhere on the card navigates to the product detail page (because the whole card is a link), which is correct, but the button text "Open in Studio" implies navigation to Studio. This is a semantically confusing interaction -- the button says one thing and does another. The build tasks spec says this button should navigate to Studio with the product pre-selected. Currently it just acts as dead weight.

**P12. Dialog form lacks the build-tasks-specified two-step animation.**
The build tasks spec says: "Each step animates in from the right with the spring easing." Currently, `step === 1 ? ... : ...` just swaps content with no transition. The form fields simply appear without any spatial story.

---

### Product Detail Page (`products/[id]/page.tsx`)

**P13. The entire page uses `space-y-8` (32px) for ALL vertical gaps.**
Line 99: `<div className="space-y-8">`. This applies a uniform 32px gap between the header, the "Open in Studio" button, and the gallery section. The vibe spec defines a vertical rhythm hierarchy:
- Between page sections: `space-y-32` (128px)
- Within sections: `space-y-8` (32px)
- Card grids: `gap-6` (24px)

Applying only 32px everywhere collapses the visual hierarchy. The "Open in Studio" button sits 32px below the header and 32px above the gallery -- making it look like a random element floating in a uniform stack rather than a deliberate CTA bridging two sections. This is the primary "cramped" feeling.

**P14. Product header grid uses the wrong column split.**
Line 101: `grid grid-cols-1 md:grid-cols-5 gap-8`. The spec says "40% left, 60% right." A 5-column grid with `col-span-2` / `col-span-3` gives 40/60, which is correct mathematically, but `gap-8` (32px) is the right gap for a form grid per the spec. However, the visual result feels too uniform because the left column (product image) has no internal padding while the right column has free-flowing text, creating an asymmetric density problem.

**P15. Product image has no breathing room from the card edges.**
Lines 105-114: The product image placeholder sits in a bare `div` with `aspectRatio: "1"`, `border`, and `boxShadow`. There is no vertical spacing above or below it within its container. On the detail page, this is the hero image -- it should command attention. Instead, it sits flush against the grid edge with no visual framing beyond the border.

**P16. Product name uses `sb-h2` (32px, 700) -- correct per spec, but description spacing is tight.**
Line 122: `className="sb-body mt-3"` gives only 12px between the 32px heading and the description text. For a hero-level heading, the breathing room should be at least `mt-4` (16px). The gold-standard page uses `mt-3` for its 44px `sb-h1`, but this is an `sb-h2` at a closer visual weight to the body text, meaning the gap needs to be slightly larger to maintain perceived separation.

**P17. Metadata row has insufficient top spacing.**
Line 128: `className="flex items-center gap-6 mt-6 pt-4"`. The `mt-6` (24px) plus `pt-4` (16px) with a border-top creates a 40px effective gap between description and metadata. This is reasonable, but the metadata items themselves use inline styles for border-left separators (`borderLeft: "1px solid rgba(244,185,100,0.08)", paddingLeft: 24`) which hardcodes spacing values instead of using Tailwind classes. This makes the code harder to maintain and loses responsive behavior.

**P18. Metadata label/value pairs use inconsistent typography.**
Lines 132-148: Labels use `sb-caption` (General Sans, 11px) and values use a mix: the date uses `sb-caption` (line 133-135), the image count uses `sb-data` with `fontSize: 13` (line 139-141), and credits spent also uses `sb-data` with `fontSize: 13` (line 145-147). The vibe spec says JetBrains Mono `sb-data` is 14px at 700 weight. Overriding to 13px breaks the type scale. The date value should use `sb-data` as well if it is data the user is reading as a metric, or stay as `sb-caption` if it is supplementary info -- but mixing the two patterns in adjacent metadata items creates visual noise.

**P19. "Open in Studio" button is a full-width `sb-btn-primary` with no context.**
Lines 153-158: The button is wrapped in a `<Link>` and spans the full page width. This creates a massive horizontal gold bar (min-height 48px, full width of the max-w-7xl container = up to 1280px) that visually dominates the page. The build tasks spec says "Full-width `sb-btn-primary`" which is technically what is built, but the result is a button that screams louder than the product itself. The UX story says this button sits "below the header" -- it needs to be prominent but not overwhelming. A full-width button at this scale creates a visual wall between the header and the gallery, disrupting the page flow.

Additionally, the button has no icon. A navigation CTA to Studio would benefit from an arrow or external-link icon to signal "this takes you somewhere else."

**P20. Gallery section label uses wrong hierarchy pattern.**
Line 162: `sb-label mb-2` for "Gallery" and line 163: `sb-h3 mb-4` for "Generated Images." This matches the gold-standard section pattern (coral overline + heading), which is correct. But `mb-2` (8px) and `mb-4` (16px) is tighter than the gold-standard's pattern. The dashboard page uses `mb-2` (8px) for the label and `mb-4` (16px) for the heading, so this is actually consistent. Good.

**P21. Masonry grid uses `columnGap: 16` (16px) which is tighter than the spec.**
Lines 170-171: `columnCount: 3, columnGap: 16`. The vibe spec defines card grids as `gap-6` (24px). A 16px column gap in a masonry layout makes the image cards feel packed together. This should be 24px to match the product grid on the parent page and the spec.

**P22. Gallery image cards have no hover interaction.**
Lines 23-84 (`GalleryImageCard`): The card is a plain `<div>` with inline styles. There is no hover state -- no `translateY`, no shadow elevation, no border brightening, no overlay with action buttons. The UX story (Section 4.3) specifies that the image gallery reuses the `MasonryGallery` component pattern, which includes hover overlay with action buttons. Even for the "browse only" variant on the product detail page, the cards should at minimum have the DS-2 card hover pattern (lift + shadow + border) and a click handler for a lightbox view.

**P23. Gallery image card margins use `marginBottom: 16` instead of the column-gap handling.**
Line 38: `marginBottom: 16`. In a CSS multi-column layout, `column-gap` handles horizontal spacing, but vertical spacing between items in the same column is handled by `margin-bottom` on each item. This 16px is tight -- it should match the column gap at 24px for visual consistency.

**P24. Gallery image card uses inline styles for everything.**
Lines 41-47: Border, background, box-shadow, and transition are all inline styles. This makes the card impossible to target with hover states via CSS (you cannot write `:hover` in an inline style). It also duplicates values that are already defined in the theme CSS (`ds2-theme.css` card overrides on `[data-slot="card"]`). The image cards should either use the `Card` component or apply the same classes that enable theme-level hover behavior.

**P25. Image card footer has minimal padding.**
Line 62: `className="flex items-center justify-between px-3 py-2"`. The `px-3` (12px) and `py-2` (8px) create a cramped footer. The `CardFooter` component uses `p-4` (16px). Even for a compact card, `px-4 py-3` (16px / 12px) would feel more comfortable.

**P26. Empty state for the gallery is good but could use the pulsing placeholder pattern.**
Lines 178-193: The empty state shows a dashed border box with an icon and text. The UX story (Section 5, Tier 3) specifies that empty gallery areas should show "a grid of placeholder rectangles (6, in a 3x2 grid) with muted dashed borders that pulse subtly, hinting at where images will appear." The current implementation is a single box, not a grid of placeholder shapes.

**P27. No back navigation or breadcrumb context within the page.**
The product detail page relies entirely on the `DashboardHeader` breadcrumb for context ("Sunrise Coffee Co / Products / Summer Cold Brew"). There is no in-page back link or visual tie to the parent products list. A back arrow or link near the page title would provide a secondary navigation path and reduce cognitive load.

**P28. The page has no loading or skeleton state.**
There are no skeleton placeholders for the product header, the gallery images, or any other element. When mock data is replaced with real Convex queries, the page will flash from empty to populated with no intermediate state.

---

## 2. Products Grid Page Fixes

### Fix F1: Move "Add Product" button to the DashboardHeader action slot

The button does not belong inline in the page content. It belongs in the contextual header's right-side action slot, matching the pattern described in the UX story (Section 2: "On the Products page, this is 'New Product'").

This requires the `DashboardHeader` component to accept a page-specific action slot (likely via a prop or React context pattern). For now, if the header doesn't support this, the button can remain in-page but must use the standard `sb-btn-primary` class without any `!important` overrides:

```tsx
// REMOVE all !important overrides
<Button className="sb-btn-primary">
  <HugeiconsIcon icon={Add01Icon} size={16} className="mr-2" />
  Add Product
</Button>
```

### Fix F2: Add section structure pattern to the product grid

Follow the gold-standard pattern: coral overline label + section heading.

```tsx
{/* Header */}
<div>
  <h1 className="sb-h1" style={{ color: "#eaeef1" }}>Products</h1>
  <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
    Manage your brand&apos;s products and generate marketing images.
  </p>
  <p className="mt-2">
    <span className="sb-data" style={{ color: "#6d8d9f" }}>
      {MOCK_PRODUCTS.length}
    </span>
    <span className="sb-caption ml-1.5" style={{ color: "#6d8d9f" }}>
      products
    </span>
  </p>
</div>

{/* Product Grid Section */}
<div>
  <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Catalog</p>
  <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Your Products</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {MOCK_PRODUCTS.map((product) => (
      <ProductCard key={product.id} product={product} brandSlug={brandSlug} />
    ))}
  </div>
</div>
```

Note the `mb-6` (24px) on the heading above the grid, giving it more breathing room than `mb-4`.

### Fix F3: Fix product count typography

Remove the nested `sb-caption` > `sb-data` confusion. Use `sb-data` for the number and `sb-caption` for the label text beside it.

### Fix F4: Fix product card image hover

Replace the inline `<style>` tag with Tailwind's `group-hover` utility:

```tsx
<div className="w-full overflow-hidden" style={{ height: 180 }}>
  <div
    className="w-full h-full flex items-center justify-center transition-transform duration-300"
    style={{
      background: product.gradient,
      transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}
  >
    <span className="sb-label" style={{ color: "rgba(255,255,255,0.3)" }}>
      Product Image
    </span>
  </div>
</div>
```

Then add the CSS class for the group hover scale. Since Tailwind v4 supports arbitrary values, use:

```tsx
// On the inner div that has the gradient background:
className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover/card:scale-[1.02]"
```

This uses the Card component's built-in `group/card` class (from `card.tsx` line 14: `group/card`).

### Fix F5: Fix "Open in Studio" button

Remove all `!important` overrides. Use standard `sb-btn-secondary` with no size fighting:

```tsx
<CardFooter>
  <Button
    className="sb-btn-secondary w-full"
    onClick={(e) => {
      e.preventDefault()
      // Navigate to studio with product pre-selected
      window.location.href = `/dashboard/${brandSlug}/studio?product=${product.id}`
    }}
  >
    Open in Studio
  </Button>
</CardFooter>
```

Remove the redundant `border-t border-[rgba(244,185,100,0.06)]` from `CardFooter` -- the component already applies `border-t` which inherits the theme's `--border` value (`rgba(244,185,100,0.12)`).

### Fix F6: Fix "Add Product" dialog button overrides

All buttons inside the dialog should use standard DS-2 classes without `!important` overrides:

```tsx
// Instead of: className="sb-btn-primary !px-4 !py-2 !min-h-[36px] !text-xs"
// Use:
className="sb-btn-primary"

// For "Back" button:
className="sb-btn-secondary"
```

### Fix F7: Add dialog step transition animation

Add a CSS transition when switching between steps:

```tsx
<div
  className="transition-all duration-300"
  style={{
    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  }}
>
  {step === 1 ? (
    <div className="space-y-4 py-4" key="step-1">
      {/* Step 1 content */}
    </div>
  ) : (
    <div className="py-4" key="step-2">
      {/* Step 2 content -- animates in from right */}
    </div>
  )}
</div>
```

For the animation, use a CSS animation on mount. When `step` changes, the new content should slide in from the right:

```css
@keyframes sb-step-in {
  from {
    opacity: 0;
    transform: translateX(16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

Apply via an inline style or a class on the new step's container:

```tsx
style={{ animation: "sb-step-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
```

Add this keyframe to `styles/ds2-theme.css` alongside the other keyframes.

---

## 3. Product Detail Page Fixes

### Fix F8: Replace `space-y-8` with explicit section spacing

This is the highest-impact fix. The page should use the vibe spec's vertical rhythm hierarchy:

```tsx
<div className="space-y-16">
  {/* Product Header Section */}
  <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
    {/* ... header content ... */}
  </div>

  {/* Open in Studio CTA */}
  <div>
    <Link href={`/dashboard/${brandSlug}/studio?product=${product.id}`}>
      <Button className="sb-btn-primary w-full">
        <HugeiconsIcon icon={ArrowRight02Icon} size={18} className="mr-2" />
        Open in Studio
      </Button>
    </Link>
  </div>

  {/* Gallery Section */}
  <div>
    <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Gallery</p>
    <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Generated Images</h3>
    {/* ... gallery content ... */}
  </div>
</div>
```

Use `space-y-16` (64px) between the major page sections (header, CTA, gallery). This is halfway between "within sections" (32px) and "between page sections" (128px) -- appropriate for a detail page that has fewer, larger sections than the overview.

Alternatively, for more control:

```tsx
<div>
  {/* Product Header */}
  <div className="grid ...">...</div>

  {/* CTA -- closer to the header, since it is the header's action */}
  <div className="mt-10">
    <Link ...>
      <Button className="sb-btn-primary w-full">...</Button>
    </Link>
  </div>

  {/* Gallery -- major section break */}
  <div className="mt-20">
    <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Gallery</p>
    <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Generated Images</h3>
    {/* ... */}
  </div>
</div>
```

This gives 40px between header and CTA (the button is part of the header's action, so it stays close), and 80px before the gallery (a full section break).

### Fix F9: Improve "Open in Studio" button presence

The full-width primary button is correct per spec, but it needs an icon and slightly better contextual framing:

```tsx
<div className="mt-10">
  <Link href={`/dashboard/${brandSlug}/studio?product=${product.id}`}>
    <Button className="sb-btn-primary w-full">
      <span className="flex items-center justify-center gap-2">
        Open in Studio
        <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
      </span>
    </Button>
  </Link>
  <p className="sb-caption mt-2 text-center" style={{ color: "#6d8d9f" }}>
    Generate new images for this product in the Studio workspace
  </p>
</div>
```

The caption below the button provides context for what happens when you click. The right arrow icon signals navigation.

### Fix F10: Increase description spacing from heading

```tsx
<h2 className="sb-h2" style={{ color: "#eaeef1" }}>
  {product.name}
</h2>
<p className="sb-body mt-4" style={{ color: "#d4dce2" }}>
  {product.description}
</p>
```

Change `mt-3` to `mt-4` (16px) for better breathing room below the 32px heading.

### Fix F11: Fix metadata row implementation

Replace inline styles with Tailwind classes and fix typography:

```tsx
<div
  className="flex items-center gap-8 mt-8 pt-5"
  style={{ borderTop: "1px solid rgba(244,185,100,0.08)" }}
>
  <div>
    <p className="sb-caption" style={{ color: "#6d8d9f" }}>Created</p>
    <p className="sb-data mt-1" style={{ color: "#d4dce2" }}>
      {format(new Date(product.createdAt), "MMM d, yyyy")}
    </p>
  </div>
  <div className="pl-8" style={{ borderLeft: "1px solid rgba(244,185,100,0.08)" }}>
    <p className="sb-caption" style={{ color: "#6d8d9f" }}>Images</p>
    <p className="sb-data mt-1" style={{ color: "#eaeef1" }}>
      {product.imageCount}
    </p>
  </div>
  <div className="pl-8" style={{ borderLeft: "1px solid rgba(244,185,100,0.08)" }}>
    <p className="sb-caption" style={{ color: "#6d8d9f" }}>Credits Spent</p>
    <p className="sb-data mt-1" style={{ color: "#eaeef1" }}>
      {product.creditsSpent}
    </p>
  </div>
</div>
```

Key changes:
- `gap-8` (32px) instead of `gap-6` (24px) for more generous spacing between metadata items
- `mt-8 pt-5` (32px + 20px) for more separation from the description above
- Removed the `fontSize: 13` override on `sb-data` -- use the spec's native 14px
- Added `mt-1` between label and value for consistent vertical rhythm within each metadata item
- Use Tailwind `pl-8` for padding-left instead of inline `paddingLeft: 24`

### Fix F12: Increase masonry grid gap

```tsx
<div
  style={{
    columnCount: 3,
    columnGap: 24,  // Was 16, now matches gap-6 (24px) per spec
  }}
>
```

### Fix F13: Fix `GalleryImageCard` margin-bottom

```tsx
style={{
  breakInside: "avoid",
  marginBottom: 24,  // Was 16, now matches columnGap
}}
```

### Fix F14: Convert gallery image cards to use the `Card` component

Replace the inline-styled `<div>` with the proper `Card` component to inherit theme hover behavior:

```tsx
function GalleryImageCard({ image }: { image: GeneratedImage }) {
  const height = ASPECT_HEIGHTS[image.aspectRatio] ?? 220

  const statusColor =
    image.status === "ready"
      ? "#f4b964"
      : image.status === "scheduled"
        ? "#e8956a"
        : "#6d8d9f"

  return (
    <div style={{ breakInside: "avoid", marginBottom: 24 }}>
      <Card className="overflow-hidden cursor-pointer" data-interactive>
        {/* Image placeholder */}
        <div
          className="w-full flex items-center justify-center"
          style={{
            height,
            background: image.gradient,
          }}
        >
          <HugeiconsIcon icon={Image02Icon} size={24} color="rgba(255,255,255,0.2)" />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: "1px solid rgba(244,185,100,0.06)" }}
        >
          <span className="sb-caption" style={{ color: "#6d8d9f" }}>
            {format(new Date(image.createdAt), "MMM d, yyyy")}
          </span>
          <div className="flex items-center gap-2">
            <span className="sb-caption" style={{ color: "#6d8d9f" }}>
              {image.aspectRatio}
            </span>
            <div
              style={{
                width: 6,
                height: 6,
                background: statusColor,
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
```

Key changes:
- Uses `Card` component with `data-interactive` attribute to get the theme's hover behavior (`translateY(-2px)`, elevated shadow, border brightening)
- Footer padding increased to `px-4 py-3` (16px horizontal, 12px vertical)
- `marginBottom: 24` matching the column gap

### Fix F15: Implement the pulsing placeholder empty state

Replace the single empty box with a grid of 6 placeholder rectangles:

```tsx
{productImages.length === 0 && (
  <div className="grid grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-center"
        style={{
          height: i % 2 === 0 ? 180 : 220,
          border: "2px dashed rgba(244,185,100,0.12)",
          background: "rgba(244,185,100,0.02)",
          animation: "sb-empty-pulse 2s ease-in-out infinite",
          animationDelay: `${i * 150}ms`,
        }}
      >
        {i === 2 && (
          <div className="text-center px-4">
            <HugeiconsIcon icon={Image02Icon} size={32} color="#6d8d9f" />
            <p className="sb-body-sm mt-2" style={{ color: "#6d8d9f" }}>
              No images yet. Open in Studio to start creating.
            </p>
          </div>
        )}
      </div>
    ))}
  </div>
)}
```

Add the keyframe to `styles/ds2-theme.css`:

```css
@keyframes sb-empty-pulse {
  0%, 100% { border-color: rgba(244,185,100,0.08); }
  50%      { border-color: rgba(244,185,100,0.14); }
}
```

### Fix F16: Add a back navigation link

Add a back link at the top of the page, before the product header:

```tsx
<Link
  href={`/dashboard/${brandSlug}/products`}
  className="sb-btn-ghost-inline inline-flex items-center gap-1.5 mb-6"
>
  <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
  <span>Back to Products</span>
</Link>
```

This uses `sb-btn-ghost-inline` for a compact, unobtrusive back link that brightens to gold on hover.

---

## 4. Component Map

### Products Grid Page

| Region | Component | Notes |
|--------|-----------|-------|
| Page header | Inline `sb-h1` + `sb-body` + `sb-data` count | Standard page header pattern |
| Header action | `Button` with `sb-btn-primary` class | Should be in `DashboardHeader` action slot; if not possible, keep inline |
| Section label | Coral `sb-label` + `sb-h3` | "Catalog" / "Your Products" |
| Product grid | 3-column grid of `ProductCard` | `gap-6` |
| Product card | `Card` + `CardContent` + `CardFooter` | Use `group/card` for hover, `data-interactive` not needed since wrapped in `Link` |
| Card image | `div` with gradient, Tailwind `group-hover/card:scale-[1.02]` | CSS-only hover, no `<style>` injection |
| Card footer button | `Button` with `sb-btn-secondary` class, full width | No `!important` overrides |
| Add Product dialog | `Dialog` with two-step form | Add `sb-step-in` animation on step change |

### Product Detail Page

| Region | Component | Notes |
|--------|-----------|-------|
| Back link | `Link` with `sb-btn-ghost-inline` | "Back to Products" with arrow icon |
| Product image (left, 40%) | Styled `div` with gradient, border, dual-layer shadow | `aspect-ratio: 1` |
| Product info (right, 60%) | `sb-h2` + `sb-body` + metadata row | Metadata uses `sb-caption` labels + `sb-data` values (no font-size overrides) |
| CTA section | Full-width `Button` with `sb-btn-primary` + caption | Right arrow icon, descriptive sub-text |
| Gallery section label | Coral `sb-label` + `sb-h3` | "Gallery" / "Generated Images" |
| Gallery masonry | CSS `column-count: 3`, `column-gap: 24px` | Each item uses `Card` with `data-interactive` |
| Gallery image card | `Card` with image placeholder + footer | Footer has date, aspect ratio, status dot |
| Empty state | Grid of 6 pulsing placeholder rectangles | Staggered animation delay, center item has message |

---

## 5. Anti-Patterns to Avoid

**AP1. Never use `!important` to override DS-2 button dimensions.**
The `sb-btn-primary` and `sb-btn-secondary` classes define their own padding, min-height, and font-size with `!important`. Adding more `!important` overrides to shrink them (`!px-4 !py-2 !min-h-[36px] !text-xs`) creates a specificity war and produces buttons that look wrong compared to every other button in the dashboard. If a smaller button is genuinely needed, create a new class variant (e.g., `sb-btn-primary-compact`) in `ds2-theme.css`.

**AP2. Never inject `<style>` tags inside component render.**
Inline `<style>` blocks inside JSX (lines 51-55 of `products/page.tsx`) create performance issues, specificity confusion, and are not SSR-friendly. Use Tailwind utilities (`group-hover/card:scale-[1.02]`) or CSS classes defined in the theme file.

**AP3. Never use uniform `space-y-*` for an entire page.**
A page is not a vertical list of equally-spaced items. Different sections have different relationships. Use the vibe spec's vertical rhythm hierarchy: 128px between major sections, 32px within sections, 24px for card grids. When `space-y-8` is applied to a whole page, everything looks equidistant and flat.

**AP4. Never hardcode shadow and border values inline when the theme provides them.**
Gallery image cards (lines 41-47 of `products/[id]/page.tsx`) duplicate the exact shadow and border values from `ds2-theme.css`. Use the `Card` component, which applies these values via `[data-slot="card"]` CSS selectors. Inline styles prevent hover states, focus states, and future theme changes from applying.

**AP5. Never skip hover states on interactive elements.**
The vibe spec (Rule 7) states: "Every hover must do something meaningful." Gallery image cards are clickable visual elements with zero hover feedback. This violates a fundamental DS-2 rule.

**AP6. Never use `font-size` overrides on typography utility classes.**
When `sb-data` says 14px, do not override it to 13px (lines 139-147 of the detail page). If 14px does not work in context, the problem is likely spacing or container size, not the font size. The type scale is deliberately designed; breaking individual instances creates visual inconsistency across the app.

**AP7. Never place page-level actions inside page content when a header action slot exists.**
The "Add Product" button belongs in the `DashboardHeader` right-side action area, not inline in the page body. This is the established pattern in the UX story for all brand-level pages.

**AP8. Do not put image generation controls on the product detail page.**
This is stated explicitly in the UX story Section 4.3 and the build tasks spec. The product detail page links to Studio. It does not generate images itself.

---

## 6. Summary of Changes by Priority

### Critical (Fixes the "cramped" feeling)
1. **F8** -- Replace `space-y-8` with explicit section spacing (40px CTA gap, 80px gallery gap)
2. **F12/F13** -- Increase masonry grid gap from 16px to 24px
3. **F14** -- Convert gallery cards to `Card` component for proper hover behavior
4. **F4** -- Fix product card image hover (remove `<style>` injection)

### High (DS-2 compliance)
5. **F1** -- Remove all `!important` button overrides (grid page and dialog)
6. **F5** -- Fix "Open in Studio" button on product cards
7. **F11** -- Fix metadata typography (remove `fontSize: 13` overrides)
8. **F9** -- Add icon and sub-text to "Open in Studio" CTA on detail page

### Medium (Visual polish)
9. **F2** -- Add section structure pattern to product grid
10. **F3** -- Fix product count typography
11. **F10** -- Increase heading-to-description spacing
12. **F15** -- Implement pulsing placeholder empty state
13. **F16** -- Add back navigation link on detail page

### Low (Enhancement)
14. **F7** -- Add dialog step transition animation
15. **P9** -- Add stagger animation on card load
16. **P28** -- Add skeleton/loading states

---

## 7. New CSS to Add to `styles/ds2-theme.css`

```css
/* ── Dialog Step Transition ──────────────────────────────────────────────── */

@keyframes sb-step-in {
  from {
    opacity: 0;
    transform: translateX(16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ── Empty State Placeholder Pulse ───────────────────────────────────────── */

@keyframes sb-empty-pulse {
  0%, 100% { border-color: rgba(244,185,100,0.08); }
  50%      { border-color: rgba(244,185,100,0.14); }
}
```
