/**
 * CONVEX MOCK — Local UI testing without a Convex backend
 *
 * This module provides mock implementations of useQuery, useMutation, and useAction
 * from "convex/react". All dashboard files import from here instead of "convex/react"
 * so the app can run without NEXT_PUBLIC_CONVEX_URL.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * TO UNDO THIS MOCK (restore real Convex):
 *
 * 1. In every file that imports from "@/lib/convex-mock", change the import to:
 *      import { useQuery, useMutation, useAction } from "convex/react"
 *
 *    Files that were changed (search for `from "@/lib/convex-mock"`):
 *      - app/dashboard/layout.tsx
 *      - app/dashboard/page.tsx
 *      - app/dashboard/billing/page.tsx
 *      - app/dashboard/brands/page.tsx
 *      - app/dashboard/connect-callback/page.tsx
 *      - app/dashboard/[brandSlug]/page.tsx
 *      - app/dashboard/[brandSlug]/products/page.tsx
 *      - app/dashboard/[brandSlug]/products/[id]/page.tsx
 *      - app/dashboard/[brandSlug]/studio/page.tsx
 *      - app/dashboard/[brandSlug]/scheduling/page.tsx
 *      - app/dashboard/[brandSlug]/analytics/page.tsx
 *      - app/dashboard/[brandSlug]/settings/social/page.tsx
 *      - components/ds2/notification-bell.tsx
 *      - components/ds2/brand-switcher.tsx
 *      - components/ds2/add-product-dialog.tsx
 *      - components/ds2/create-brand-dialog.tsx
 *      - components/ds2/upgrade-dialog.tsx
 *      - components/homepage/pricing-section.tsx
 *      - components/homepage/pricing-page.tsx
 *
 * 2. Restore lib/convex-provider.tsx to use real ConvexProvider:
 *      import { ConvexReactClient, ConvexProvider } from "convex/react"
 *      const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
 *      export function ConvexClientProvider({ children }) {
 *        return <ConvexProvider client={convex}>{children}</ConvexProvider>
 *      }
 *
 * 3. Remove `// @ts-nocheck` from the top of these files:
 *      - app/dashboard/layout.tsx
 *      - app/dashboard/brands/page.tsx
 *      - app/dashboard/[brandSlug]/page.tsx
 *      - app/dashboard/[brandSlug]/products/page.tsx
 *      - app/dashboard/[brandSlug]/products/[id]/page.tsx
 *      - app/dashboard/[brandSlug]/studio/page.tsx
 *      - app/dashboard/[brandSlug]/scheduling/page.tsx
 *      - app/dashboard/[brandSlug]/analytics/page.tsx
 *      - app/dashboard/[brandSlug]/settings/social/page.tsx
 *      - components/ds2/notification-bell.tsx
 *
 * 4. Delete this file (lib/convex-mock.ts)
 *
 * QUICK UNDO (shell commands):
 *   find . -name "*.tsx" -not -path "./node_modules/*" -not -path "./convex/*" \
 *     -exec grep -l 'from "@/lib/convex-mock"' {} \; | \
 *     xargs sed -i 's|from "@/lib/convex-mock"|from "convex/react"|g'
 *   find . -name "*.tsx" -not -path "./node_modules/*" \
 *     -exec sed -i '/^\/\/ @ts-nocheck.*Convex mock/d' {} \;
 *   Then restore lib/convex-provider.tsx and delete lib/convex-mock.ts.
 * ──────────────────────────────────────────────────────────────────────────────
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Mock IDs ────────────────────────────────────────────────────────────────
const MOCK_USER_ID = "mock_user_001" as any
const MOCK_BRAND_1_ID = "mock_brand_001" as any
const MOCK_BRAND_2_ID = "mock_brand_002" as any
const MOCK_PRODUCT_1_ID = "mock_product_001" as any
const MOCK_PRODUCT_2_ID = "mock_product_002" as any
const MOCK_IMAGE_1_ID = "mock_image_001" as any
const MOCK_IMAGE_2_ID = "mock_image_002" as any
const MOCK_IMAGE_3_ID = "mock_image_003" as any
const MOCK_SOCIAL_1_ID = "mock_social_001" as any
const MOCK_SOCIAL_2_ID = "mock_social_002" as any
const MOCK_SOCIAL_3_ID = "mock_social_003" as any
const MOCK_POST_1_ID = "mock_post_001" as any
const MOCK_POST_2_ID = "mock_post_002" as any
const MOCK_NOTIF_1_ID = "mock_notif_001" as any
const MOCK_NOTIF_2_ID = "mock_notif_002" as any

// Use a fixed timestamp to avoid SSR/client hydration mismatch from Date.now()
const now = 1741478400000 // 2026-03-09T00:00:00.000Z
const day = 86400000

// ── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_USER = {
  _id: MOCK_USER_ID,
  _creationTime: now - 30 * day,
  clerkId: "mock_clerk_001",
  email: "sarah@sunrisecoffee.com",
  name: "Sarah Mitchell",
  imageUrl: undefined,
  onboardingComplete: true,
  onboardedAt: now - 29 * day,
  subscriptionTier: "professional" as const,
  monthlyCreditsAllocation: 500,
  monthlyCreditsRemaining: 416,
  topUpCreditsRemaining: 50,
  maxBrands: 5,
  maxSocialAccounts: 20,
  lastActiveAt: now,
  timezone: "America/New_York",
  subscriptionRenewalDate: now + 22 * day,
  // Polar enrichment fields (for pricing pages)
  polarCustomerId: "mock_polar_customer",
  subscription: {
    tier: "professional",
    status: "active",
    pricePerMonth: 2900,
    currentPeriodEnd: now + 22 * day,
  },
}

const MOCK_BRANDS = [
  {
    _id: MOCK_BRAND_1_ID,
    _creationTime: now - 28 * day,
    userId: MOCK_USER_ID,
    name: "Sunrise Coffee Co",
    slug: "sunrise-coffee",
    description: "Artisan coffee roasters and café",
    industry: "Food & Beverage",
    targetAudience: "Coffee enthusiasts, remote workers, millennials",
    brandVoice: "Warm, inviting, knowledgeable",
    timezone: "America/New_York",
    totalFollowers: 5247,
    avgEngagementRate: 4.7,
    connectedPlatformCount: 3,
    productsCount: 8,
    generatedImagesCount: 47,
    scheduledPostsCount: 12,
    lastActiveAt: now,
    createdAt: now - 28 * day,
  },
  {
    _id: MOCK_BRAND_2_ID,
    _creationTime: now - 14 * day,
    userId: MOCK_USER_ID,
    name: "Coastal Surf Shop",
    slug: "coastal-surf",
    description: "Premium surf gear and lifestyle brand",
    industry: "Retail & Sports",
    targetAudience: "Surfers, beach lovers, outdoor enthusiasts",
    brandVoice: "Laid-back, adventurous, authentic",
    timezone: "America/Los_Angeles",
    totalFollowers: 3821,
    avgEngagementRate: 3.2,
    connectedPlatformCount: 2,
    productsCount: 5,
    generatedImagesCount: 23,
    scheduledPostsCount: 6,
    lastActiveAt: now - 2 * day,
    createdAt: now - 14 * day,
  },
]

const MOCK_PRODUCTS = [
  {
    _id: MOCK_PRODUCT_1_ID,
    _creationTime: now - 20 * day,
    brandId: MOCK_BRAND_1_ID,
    userId: MOCK_USER_ID,
    name: "Ethiopian Cold Brew",
    description: "Single-origin cold brew from Yirgacheffe region",
    gradientPreview: "linear-gradient(135deg, #2a4a3a 0%, #3a6a2a 100%)",
    referenceImagesCount: 3,
    generatedImagesCount: 12,
    creditsSpent: 12,
    createdAt: now - 20 * day,
  },
  {
    _id: MOCK_PRODUCT_2_ID,
    _creationTime: now - 15 * day,
    brandId: MOCK_BRAND_1_ID,
    userId: MOCK_USER_ID,
    name: "Sunrise Blend Beans",
    description: "Our signature medium roast blend",
    gradientPreview: "linear-gradient(135deg, #3a2a1a 0%, #5a3a1a 100%)",
    referenceImagesCount: 2,
    generatedImagesCount: 8,
    creditsSpent: 8,
    createdAt: now - 15 * day,
  },
]

const MOCK_IMAGES = [
  {
    _id: MOCK_IMAGE_1_ID,
    _creationTime: now - 5 * day,
    userId: MOCK_USER_ID,
    brandId: MOCK_BRAND_1_ID,
    productId: MOCK_PRODUCT_1_ID,
    prompt: "Warm flat-lay of Ethiopian cold brew on rustic wood",
    stylePreset: "product_shot",
    fullPrompt: "A warm flat-lay of Ethiopian cold brew on rustic wood with morning light",
    model: "bytedance/seedream-4.5" as const,
    qualityTier: "standard" as const,
    aspectRatio: "1:1" as const,
    referenceImageCount: 2,
    status: "ready" as const,
    imageUrl: "/placeholder-image-1.jpg",
    creditsUsed: 1,
    refunded: false,
    retryCount: 0,
    createdAt: now - 5 * day,
    completedAt: now - 5 * day + 15000,
  },
  {
    _id: MOCK_IMAGE_2_ID,
    _creationTime: now - 3 * day,
    userId: MOCK_USER_ID,
    brandId: MOCK_BRAND_1_ID,
    productId: MOCK_PRODUCT_1_ID,
    prompt: "Lifestyle shot of cold brew in a sunny café",
    stylePreset: "lifestyle",
    fullPrompt: "Lifestyle shot of cold brew in a sunny café with bokeh background",
    model: "bytedance/seedream-4.5" as const,
    qualityTier: "standard" as const,
    aspectRatio: "4:5" as const,
    referenceImageCount: 1,
    status: "ready" as const,
    imageUrl: "/placeholder-image-2.jpg",
    creditsUsed: 1,
    refunded: false,
    retryCount: 0,
    createdAt: now - 3 * day,
    completedAt: now - 3 * day + 12000,
  },
  {
    _id: MOCK_IMAGE_3_ID,
    _creationTime: now - 1 * day,
    userId: MOCK_USER_ID,
    brandId: MOCK_BRAND_1_ID,
    productId: MOCK_PRODUCT_2_ID,
    prompt: "Sunrise Blend beans scattered on marble",
    stylePreset: "flat_lay",
    fullPrompt: "Flat lay of Sunrise Blend coffee beans on white marble surface",
    model: "bytedance/seedream-4.5" as const,
    qualityTier: "standard" as const,
    aspectRatio: "1:1" as const,
    referenceImageCount: 1,
    status: "ready" as const,
    imageUrl: "/placeholder-image-3.jpg",
    creditsUsed: 1,
    refunded: false,
    retryCount: 0,
    createdAt: now - 1 * day,
    completedAt: now - 1 * day + 10000,
  },
]

const MOCK_SOCIAL_ACCOUNTS = [
  {
    _id: MOCK_SOCIAL_1_ID,
    _creationTime: now - 25 * day,
    userId: MOCK_USER_ID,
    brandId: MOCK_BRAND_1_ID,
    postForMeAccountId: "pfm_ig_001",
    platform: "instagram" as const,
    username: "sunrisecoffeeco",
    displayName: "Sunrise Coffee Co",
    status: "connected" as const,
    connectedAt: now - 25 * day,
    followerCount: 3200,
    engagementRate: 5.1,
    lastSyncedAt: now - 3600000,
    lastSyncStatus: "ok" as const,
  },
  {
    _id: MOCK_SOCIAL_2_ID,
    _creationTime: now - 24 * day,
    userId: MOCK_USER_ID,
    brandId: MOCK_BRAND_1_ID,
    postForMeAccountId: "pfm_fb_001",
    platform: "facebook" as const,
    username: "SunriseCoffeeCo",
    displayName: "Sunrise Coffee Co",
    status: "connected" as const,
    connectedAt: now - 24 * day,
    followerCount: 1200,
    engagementRate: 3.8,
    lastSyncedAt: now - 3600000,
    lastSyncStatus: "ok" as const,
  },
  {
    _id: MOCK_SOCIAL_3_ID,
    _creationTime: now - 20 * day,
    userId: MOCK_USER_ID,
    brandId: MOCK_BRAND_1_ID,
    postForMeAccountId: "pfm_li_001",
    platform: "linkedin" as const,
    username: "sunrise-coffee-co",
    displayName: "Sunrise Coffee Co",
    status: "connected" as const,
    connectedAt: now - 20 * day,
    followerCount: 847,
    engagementRate: 6.2,
    lastSyncedAt: now - 7200000,
    lastSyncStatus: "ok" as const,
  },
]

const MOCK_SCHEDULED_POSTS = [
  {
    _id: MOCK_POST_1_ID,
    _creationTime: now - 2 * day,
    userId: MOCK_USER_ID,
    brandId: MOCK_BRAND_1_ID,
    imageUrl: "/placeholder-image-1.jpg",
    caption: "Start your morning the right way ☀️ Our Ethiopian Cold Brew is now available for order!",
    selectedPlatforms: ["instagram", "facebook"] as any,
    socialAccountIds: [MOCK_SOCIAL_1_ID, MOCK_SOCIAL_2_ID],
    scheduledFor: now + 2 * day,
    timezone: "America/New_York",
    status: "scheduled" as const,
    createdAt: now - 2 * day,
  },
  {
    _id: MOCK_POST_2_ID,
    _creationTime: now - 1 * day,
    userId: MOCK_USER_ID,
    brandId: MOCK_BRAND_1_ID,
    imageUrl: "/placeholder-image-2.jpg",
    caption: "Behind every great cup is a great bean. Meet our Sunrise Blend.",
    selectedPlatforms: ["instagram", "linkedin"] as any,
    socialAccountIds: [MOCK_SOCIAL_1_ID, MOCK_SOCIAL_3_ID],
    scheduledFor: now + 4 * day,
    timezone: "America/New_York",
    status: "draft" as const,
    createdAt: now - 1 * day,
  },
]

const MOCK_NOTIFICATIONS = [
  {
    _id: MOCK_NOTIF_1_ID,
    _creationTime: now - 3600000,
    userId: MOCK_USER_ID,
    type: "post_published" as const,
    title: "Post Published",
    body: "Your Instagram post for Sunrise Coffee Co was published successfully.",
    read: false,
    createdAt: now - 3600000,
    brandId: MOCK_BRAND_1_ID,
  },
  {
    _id: MOCK_NOTIF_2_ID,
    _creationTime: now - 2 * day,
    userId: MOCK_USER_ID,
    type: "credits_received" as const,
    title: "Credits Renewed",
    body: "Your monthly allocation of 500 credits has been renewed.",
    read: true,
    readAt: now - day,
    createdAt: now - 2 * day,
  },
]

const MOCK_ANALYTICS_OVERVIEW = {
  followerCount: 5247,
  followerChange: 312,
  followerChangePercent: 6.3,
  engagementRate: 4.7,
  totalReach: 12300,
  postsPublished: 24,
}

const MOCK_FOLLOWER_GROWTH = [
  { date: "2026-03-03", followerCount: 4935, changeFromPrevious: 45 },
  { date: "2026-03-04", followerCount: 4980, changeFromPrevious: 45 },
  { date: "2026-03-05", followerCount: 5020, changeFromPrevious: 40 },
  { date: "2026-03-06", followerCount: 5075, changeFromPrevious: 55 },
  { date: "2026-03-07", followerCount: 5130, changeFromPrevious: 55 },
  { date: "2026-03-08", followerCount: 5190, changeFromPrevious: 60 },
  { date: "2026-03-09", followerCount: 5247, changeFromPrevious: 57 },
]

const MOCK_TOP_CONTENT = [
  {
    _id: "mock_tc_001" as any,
    brandId: MOCK_BRAND_1_ID,
    platform: "instagram" as const,
    preview: "Start your morning the right way ☀️",
    engagements: 847,
    reach: 3200,
    engagementRate: 26.5,
    likes: 623,
    comments: 89,
    shares: 45,
    saves: 90,
    publishedAt: now - 5 * day,
    lastUpdatedAt: now - day,
  },
  {
    _id: "mock_tc_002" as any,
    brandId: MOCK_BRAND_1_ID,
    platform: "facebook" as const,
    preview: "Behind every great cup is a great bean.",
    engagements: 412,
    reach: 1800,
    engagementRate: 22.9,
    likes: 310,
    comments: 42,
    shares: 60,
    publishedAt: now - 8 * day,
    lastUpdatedAt: now - 2 * day,
  },
]

const MOCK_CREDIT_BALANCE = {
  monthly: 416,
  topUp: 50,
  total: 466,
}

const MOCK_CREDIT_TRANSACTIONS = {
  page: [
    {
      _id: "mock_tx_001" as any,
      _creationTime: now - day,
      userId: MOCK_USER_ID,
      type: "generation" as const,
      amount: -1,
      balanceBefore: { monthly: 417, topUp: 50 },
      balanceAfter: { monthly: 416, topUp: 50 },
      description: "Image generation — Ethiopian Cold Brew",
      createdAt: now - day,
    },
    {
      _id: "mock_tx_002" as any,
      _creationTime: now - 3 * day,
      userId: MOCK_USER_ID,
      type: "generation" as const,
      amount: -1,
      balanceBefore: { monthly: 418, topUp: 50 },
      balanceAfter: { monthly: 417, topUp: 50 },
      description: "Image generation — Lifestyle shot",
      createdAt: now - 3 * day,
    },
  ],
  isDone: true,
  continueCursor: null,
}

const MOCK_DAILY_USAGE = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(now - (29 - i) * day).toISOString().split("T")[0],
  credits: Math.floor(Math.random() * 5),
}))

const MOCK_PRODUCT_IMAGES = [
  {
    _id: "mock_pi_001" as any,
    _creationTime: now - 20 * day,
    productId: MOCK_PRODUCT_1_ID,
    brandId: MOCK_BRAND_1_ID,
    userId: MOCK_USER_ID,
    imageUrl: "/placeholder-image-1.jpg",
    order: 0,
    uploadedAt: now - 20 * day,
  },
]

const MOCK_POLAR_PRODUCTS = {
  plans: [
    { id: "plan_free", name: "Free", priceMonthly: 0, credits: 50, brands: 1, socialAccounts: 2 },
    { id: "plan_starter", name: "Starter", priceMonthly: 1900, credits: 200, brands: 2, socialAccounts: 5 },
    { id: "plan_pro", name: "Professional", priceMonthly: 2900, credits: 500, brands: 5, socialAccounts: 20 },
    { id: "plan_enterprise", name: "Enterprise", priceMonthly: 7900, credits: 2000, brands: -1, socialAccounts: -1 },
  ],
  topUps: [
    { id: "topup_50", credits: 50, price: 499 },
    { id: "topup_200", credits: 200, price: 1499 },
    { id: "topup_500", credits: 500, price: 2999 },
  ],
}

// ── Query Router ────────────────────────────────────────────────────────────
// The `api` object from convex/_generated/api is a Proxy (anyApi) that creates
// new object references on every property access — Map identity comparison fails.
// Instead, we use `getFunctionName` from convex/server which extracts a stable
// string key (e.g. "brands:list") from any FunctionReference, including proxied ones.

import { getFunctionName } from "convex/server"
import { api } from "@/convex/_generated/api"

function refKey(ref: any): string {
  try {
    return getFunctionName(ref)
  } catch {
    return ""
  }
}

// Build a Record of string key → mock data for lookups
const queryTable: Record<string, any | ((args: any) => any)> = {}

function register(ref: any, data: any) {
  const key = refKey(ref)
  if (key) queryTable[key] = data
}

// Users
register(api.users.current, MOCK_USER)

// Brands
register(api.brands.list, MOCK_BRANDS)
register(api.brands.getBySlug, (args: any) => {
  const slug = args?.slug
  return MOCK_BRANDS.find((b) => b.slug === slug) ?? MOCK_BRANDS[0]
})

// Credits
register(api.credits.getBalance, MOCK_CREDIT_BALANCE)
register(api.credits.getTransactions, MOCK_CREDIT_TRANSACTIONS)
register(api.credits.getDailyUsage, MOCK_DAILY_USAGE)

// Products
register(api.products.listByBrand, MOCK_PRODUCTS)
register(api.products.getById, (args: any) => {
  return MOCK_PRODUCTS.find((p) => p._id === args?.productId) ?? MOCK_PRODUCTS[0]
})

// Product Images
register(api.productImages.getByProduct, MOCK_PRODUCT_IMAGES)

// Images
register(api.images.listByBrand, MOCK_IMAGES)
register(api.images.listByProduct, MOCK_IMAGES)

// Social Accounts
register(api.socialAccounts.listByBrand, MOCK_SOCIAL_ACCOUNTS)
register(api.socialAccounts.listConnectedForCurrentUser, MOCK_SOCIAL_ACCOUNTS)

// Scheduled Posts
register(api.scheduledPosts.listByBrand, MOCK_SCHEDULED_POSTS)
register(api.scheduledPosts.listUpcoming, MOCK_SCHEDULED_POSTS)

// Analytics
register(api.analytics.getOverview, MOCK_ANALYTICS_OVERVIEW)
register(api.analytics.getFollowerGrowth, MOCK_FOLLOWER_GROWTH)
register(api.analytics.getTopContent, MOCK_TOP_CONTENT)
register(api.analytics.refreshForBrand, null)

// Notifications
register(api.notifications.listRecent, MOCK_NOTIFICATIONS)
register(api.notifications.unreadCount, 1)

// Polar (pricing)
register(api.polar.currentWithSubscription, MOCK_USER)
register(api.polar.getConfiguredProducts, MOCK_POLAR_PRODUCTS)

function resolveQuery(ref: any, args: any): any {
  const key = refKey(ref)
  if (key && key in queryTable) {
    const entry = queryTable[key]
    if (typeof entry === "function") return entry(args)
    return entry
  }

  // During SSR/prerender, return undefined (triggers loading/spinner state).
  if (typeof window === "undefined") return undefined

  console.warn(`[convex-mock] No mock data for query ref:`, key || ref)
  return null
}

// ── Exported Hooks ──────────────────────────────────────────────────────────

/**
 * Mock useQuery — returns static demo data based on the function reference.
 * Supports the "skip" sentinel (returns undefined).
 */
export function useQuery(ref: any, args?: any): any {
  if (args === "skip") return undefined
  return resolveQuery(ref, args)
}

/**
 * Mock useMutation — returns a no-op async function.
 */
export function useMutation(_ref: any): (...args: any[]) => Promise<any> {
  return async (...callArgs: any[]) => {
    console.log(`[convex-mock] mutation called`, callArgs)
    return null
  }
}

/**
 * Mock useAction — returns a no-op async function.
 */
export function useAction(_ref: any): (...args: any[]) => Promise<any> {
  return async (...callArgs: any[]) => {
    console.log(`[convex-mock] action called`, callArgs)
    return null
  }
}
