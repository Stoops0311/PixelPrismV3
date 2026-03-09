# Undo Mock Guide — Restore Real Clerk + Convex

This project has Clerk authentication and Convex backend **mocked out** for local UI testing.
Below are the exact steps to restore full functionality.

---

## Quick Undo (Shell Commands)

```bash
# 1. Restore Convex imports (convex-mock → convex/react)
find . -name "*.tsx" -name "*.ts" -not -path "./node_modules/*" -not -path "./convex/*" \
  -exec grep -l 'from "@/lib/convex-mock"' {} \; | \
  xargs sed -i 's|from "@/lib/convex-mock"|from "convex/react"|g'

# 2. Restore Clerk imports (clerk-mock → @clerk/nextjs)
find . -name "*.tsx" -not -path "./node_modules/*" \
  -exec grep -l 'from "@/lib/clerk-mock"' {} \; | \
  xargs sed -i 's|from "@/lib/clerk-mock"|from "@clerk/nextjs"|g'

# 3. Remove @ts-nocheck lines added for mocking
find . -name "*.tsx" -not -path "./node_modules/*" \
  -exec sed -i '/^\/\/ @ts-nocheck.*Convex mock/d' {} \;

# 4. Delete mock files
rm lib/convex-mock.ts lib/clerk-mock.tsx

# 5. Manually restore these files (see sections below):
#    - app/layout.tsx
#    - lib/convex-provider.tsx
#    - middleware.ts
```

---

## File-by-File Restoration

### `app/layout.tsx`
Restore ClerkProvider wrapper:
```tsx
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
// ... wrap <html> in <ClerkProvider appearance={{...}}>
```

### `lib/convex-provider.tsx`
Restore real Convex + Clerk provider:
```tsx
"use client"
import { ReactNode } from "react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { useAuth } from "@clerk/nextjs"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}
```

### `middleware.ts`
Restore Clerk middleware:
```ts
import { clerkMiddleware } from "@clerk/nextjs/server"
export default clerkMiddleware()
export const config = { matcher: [/* same matcher */] }
```

---

## Files Modified (Convex mock import)

These files had `from "convex/react"` changed to `from "@/lib/convex-mock"`:

- `app/dashboard/layout.tsx`
- `app/dashboard/page.tsx`
- `app/dashboard/billing/page.tsx`
- `app/dashboard/brands/page.tsx`
- `app/dashboard/connect-callback/page.tsx`
- `app/dashboard/[brandSlug]/page.tsx`
- `app/dashboard/[brandSlug]/products/page.tsx`
- `app/dashboard/[brandSlug]/products/[id]/page.tsx`
- `app/dashboard/[brandSlug]/studio/page.tsx`
- `app/dashboard/[brandSlug]/scheduling/page.tsx`
- `app/dashboard/[brandSlug]/analytics/page.tsx`
- `app/dashboard/[brandSlug]/settings/social/page.tsx`
- `components/ds2/notification-bell.tsx`
- `components/ds2/brand-switcher.tsx`
- `components/ds2/add-product-dialog.tsx`
- `components/ds2/create-brand-dialog.tsx`
- `components/ds2/upgrade-dialog.tsx`
- `components/homepage/pricing-section.tsx`
- `components/homepage/pricing-page.tsx`

## Files Modified (Clerk mock import)

These files had `from "@clerk/nextjs"` changed to `from "@/lib/clerk-mock"`:

- `components/homepage/homepage-nav.tsx`
- `components/homepage/pricing-page.tsx`
- `components/homepage/final-cta.tsx`
- `components/homepage/hero-section.tsx`
- `components/homepage/pricing-section.tsx`
- `components/ds2/sidebar.tsx`
- `app/sign-in/[[...sign-in]]/page.tsx`
- `app/sign-up/[[...sign-up]]/page.tsx`

## Files with `@ts-nocheck` added

These files have `// @ts-nocheck — Convex mock: remove when restoring real Convex` on line 1:

- `app/dashboard/layout.tsx`
- `app/dashboard/brands/page.tsx`
- `app/dashboard/[brandSlug]/page.tsx`
- `app/dashboard/[brandSlug]/products/page.tsx`
- `app/dashboard/[brandSlug]/products/[id]/page.tsx`
- `app/dashboard/[brandSlug]/studio/page.tsx`
- `app/dashboard/[brandSlug]/scheduling/page.tsx`
- `app/dashboard/[brandSlug]/analytics/page.tsx`
- `app/dashboard/[brandSlug]/settings/social/page.tsx`
- `components/ds2/notification-bell.tsx`

## Files Created (delete when undoing)

- `lib/convex-mock.ts` — Mock useQuery/useMutation/useAction with demo data
- `lib/clerk-mock.tsx` — Mock Clerk components (SignedIn, SignedOut, UserButton, etc.)
- `components/homepage/mobile-bottom-nav.tsx` — Mobile bottom nav for public pages (safe to keep)
- `MOCK-UNDO-GUIDE.md` — This file

## Environment Variables Needed After Restore

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```
