export interface Brand {
  id: string
  slug: string
  name: string
  initials: string
  followers: number
  engagementRate: number
}

export interface AccountSubscription {
  plan: "Starter" | "Professional" | "Enterprise"
  pricePerMonth: number
  creditsPerMonth: number
  maxBrands: number
  maxSocialAccounts: number
  renewalDate: string
}

export interface DashboardUser {
  id: string
  name: string
  email: string
  initials: string
  imageUrl?: string
}

export interface BrandNavCounts {
  products?: number
  studio?: number
  scheduling?: number
  social?: number
}

export interface UpcomingPost {
  id: string
  brandId: string
  brandInitials: string
  brandName: string
  platform: "instagram" | "tiktok" | "facebook"
  preview: string
  scheduledAt: string
  status: "scheduled" | "draft"
}

export interface ActivityEntry {
  id: string
  timestamp: string
  icon: "image" | "post" | "milestone" | "logos" | "brand"
  description: string
}

export interface LogosDigest {
  insightText: string
  timestamp: string
}

export interface BrandSparklinePoint {
  day: string
  followers: number
}

export interface BrandDetail extends Brand {
  description: string
  connectedPlatforms: ("instagram" | "tiktok" | "facebook")[]
  postsThisMonth: number
  creditsUsed: number
  lastActive: string
}

export interface CreditTransaction {
  id: string
  date: string
  description: string
  creditsUsed: number
  productName?: string
}

export interface BillingInvoice {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "failed"
}

export interface DailyCreditUsage {
  date: string
  credits: number
}

export interface Product {
  id: string
  name: string
  description: string
  imageCount: number
  creditsSpent: number
  createdAt: string
  colorGrid: string[]
}

export interface ChatMessage {
  id: string
  role: "logos" | "user"
  content: string
  timestamp: string
  /** Optional embedded stat grid for weekly reports */
  report?: {
    title: string
    stats: Array<{ label: string; value: string; trend?: string }>
    summary: string
  }
  /** Marks unread messages for highlight treatment */
  isNew?: boolean
}

export interface GenerationConfig {
  prompt: string
  style: string
  stylePreset: string
  quality: "standard" | "hd" | "ultra"
  aspectRatio: "1:1" | "16:9" | "9:16" | "3:4" | "4:3" | "3:2"
  quantity: number
  productIds?: string[]
  referenceImageId?: string
}

export interface GeneratedImage {
  id: string
  productId?: string
  productName?: string
  imageUrl?: string
  colorGrid: string[]
  aspectRatio: "1:1" | "16:9" | "9:16" | "3:4" | "4:3" | "3:2"
  status: "generating" | "ready" | "failed"
  errorMessage?: string
  createdAt: string
  creditsUsed: number
}

// ── Brand Dashboard Types ─────────────────────────────────────────────────

export interface MiniCalendarPost {
  id: string
  platform: "instagram" | "tiktok" | "facebook"
  preview: string
  scheduledAt: string
  status: "scheduled" | "draft"
}

export interface RecentStudioImage {
  id: string
  colorGrid: string[]
  imageUrl?: string
  productName?: string
  aspectRatio: "1:1" | "16:9" | "9:16" | "3:4" | "4:3" | "3:2"
  createdAt: string
}

export interface PlatformPerformance {
  platform: "instagram" | "tiktok" | "facebook"
  followers: number
  followerChange: number
  engagementRate: number
  sparkline: { day: string; value: number }[]
}

// ── Analytics Types ───────────────────────────────────────────────────────

export interface DailyFollowerGrowth {
  date: string
  instagram?: number
  tiktok?: number
  facebook?: number
}

export interface EngagementBreakdown {
  type: string
  count: number
}

export interface TopContent {
  id: string
  platform: "instagram" | "tiktok" | "facebook" | "linkedin" | "pinterest"
  preview: string
  engagements: number
  reach: number
  publishedAt: string
}

export interface LogosAnalyticsInsight {
  id: string
  text: string
}

export interface AnalyticsStats {
  engagementRate: { value: string; trend: string; direction: "up" | "down" | "neutral" }
  totalReach: { value: string; trend: string; direction: "up" | "down" | "neutral" }
  postsPublished: { value: string; trend: string; direction: "up" | "down" | "neutral" }
  bestPost: { value: string; trend: string; direction: "up" | "down" | "neutral"; preview: string; platform: "instagram" | "tiktok" | "facebook" }
}
