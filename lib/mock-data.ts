import type {
  Brand,
  BrandDetail,
  DashboardUser,
  BrandNavCounts,
  AccountSubscription,
  UpcomingPost,
  ActivityEntry,
  LogosDigest,
  BrandSparklinePoint,
  CreditTransaction,
  BillingInvoice,
  DailyCreditUsage,
  Product,
  ChatMessage,
  GeneratedImage,
  MiniCalendarPost,
  RecentStudioImage,
  PlatformPerformance,
  DailyFollowerGrowth,
  EngagementBreakdown,
  TopContent,
  LogosAnalyticsInsight,
  AnalyticsStats,
} from "@/types/dashboard"

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

export const MOCK_USER: DashboardUser = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane@sunrise.coffee",
  initials: "JD",
}

export const MOCK_CREDITS = 247

export const MOCK_BRAND_COUNTS: BrandNavCounts = {
  products: 12,
  studio: 47,
  scheduling: 3,
}

export const MOCK_SUBSCRIPTION: AccountSubscription = {
  plan: "Professional",
  pricePerMonth: 29,
  creditsPerMonth: 400,
  maxBrands: 10,
  maxSocialAccounts: 15,
  renewalDate: "2026-03-15",
}

export const MOCK_UPCOMING_POSTS: UpcomingPost[] = [
  {
    id: "post-1",
    brandId: "1",
    brandInitials: "SC",
    brandName: "Sunrise Coffee Co",
    platform: "instagram",
    preview: "New single-origin Ethiopian blend just dropped. Rich notes of blueberry and dark chocolate...",
    scheduledAt: "2026-02-17T09:00:00Z",
    status: "scheduled",
  },
  {
    id: "post-2",
    brandId: "2",
    brandInitials: "CS",
    brandName: "Coastal Surf Shop",
    platform: "tiktok",
    preview: "POV: You just caught the perfect wave at sunrise. Board wax tutorial coming next...",
    scheduledAt: "2026-02-17T14:30:00Z",
    status: "scheduled",
  },
  {
    id: "post-3",
    brandId: "3",
    brandInitials: "MY",
    brandName: "Mountain Yoga Studio",
    platform: "instagram",
    preview: "5-minute morning flow to start your day right. No mat needed, just good vibes...",
    scheduledAt: "2026-02-18T07:00:00Z",
    status: "draft",
  },
  {
    id: "post-4",
    brandId: "1",
    brandInitials: "SC",
    brandName: "Sunrise Coffee Co",
    platform: "facebook",
    preview: "This week's latte art competition winner is... drumroll please! Congratulations to barista Maya...",
    scheduledAt: "2026-02-18T11:00:00Z",
    status: "scheduled",
  },
  {
    id: "post-5",
    brandId: "2",
    brandInitials: "CS",
    brandName: "Coastal Surf Shop",
    platform: "instagram",
    preview: "Spring wetsuit collection is here. 3/2mm full suits starting at $189. Link in bio...",
    scheduledAt: "2026-02-19T10:00:00Z",
    status: "draft",
  },
]

export const MOCK_ACTIVITY_FEED: ActivityEntry[] = [
  {
    id: "act-1",
    timestamp: "2026-02-16T14:32:00Z",
    icon: "image",
    description: "AI image generated for Sunrise Coffee Co — Ethiopian blend hero shot",
  },
  {
    id: "act-2",
    timestamp: "2026-02-16T12:15:00Z",
    icon: "post",
    description: "Post published on Instagram for Coastal Surf Shop — Board wax tips reel",
  },
  {
    id: "act-3",
    timestamp: "2026-02-16T09:00:00Z",
    icon: "milestone",
    description: "Mountain Yoga Studio hit 8,000 followers on Instagram",
  },
  {
    id: "act-4",
    timestamp: "2026-02-15T18:45:00Z",
    icon: "logos",
    description: "Logos weekly report generated — cross-brand engagement up 12%",
  },
  {
    id: "act-5",
    timestamp: "2026-02-15T10:20:00Z",
    icon: "brand",
    description: "New product added to Coastal Surf Shop — Spring wetsuit collection",
  },
  {
    id: "act-6",
    timestamp: "2026-02-14T16:00:00Z",
    icon: "post",
    description: "3 posts scheduled for Sunrise Coffee Co — next week's content batch",
  },
]

export const MOCK_LOGOS_DIGEST: LogosDigest = {
  insightText:
    "Across your 3 brands, Instagram engagement is up 12% this week. Sunrise Coffee Co's product shots are outperforming lifestyle content 2:1 — consider shifting Coastal Surf Shop's mix. Mountain Yoga Studio's Tuesday morning posts get 3x more saves than other days.",
  timestamp: "2026-02-16T06:00:00Z",
}

export const MOCK_BRAND_DETAILS: BrandDetail[] = [
  {
    id: "1",
    slug: "sunrise-coffee-co",
    name: "Sunrise Coffee Co",
    initials: "SC",
    followers: 5247,
    engagementRate: 4.7,
    description: "Artisan coffee roaster and cafe in downtown Portland",
    connectedPlatforms: ["instagram", "facebook"],
    postsThisMonth: 12,
    creditsUsed: 48,
    lastActive: "2026-02-16T12:30:00Z",
  },
  {
    id: "2",
    slug: "coastal-surf-shop",
    name: "Coastal Surf Shop",
    initials: "CS",
    followers: 3821,
    engagementRate: 3.2,
    description: "Premium surf gear and beachwear on the California coast",
    connectedPlatforms: ["instagram", "tiktok", "facebook"],
    postsThisMonth: 8,
    creditsUsed: 62,
    lastActive: "2026-02-16T09:15:00Z",
  },
  {
    id: "3",
    slug: "mountain-yoga-studio",
    name: "Mountain Yoga Studio",
    initials: "MY",
    followers: 8456,
    engagementRate: 5.1,
    description: "Yoga and wellness studio in the Rocky Mountain foothills",
    connectedPlatforms: ["instagram", "tiktok"],
    postsThisMonth: 15,
    creditsUsed: 43,
    lastActive: "2026-02-15T18:45:00Z",
  },
]

export const MOCK_CREDIT_TRANSACTIONS: CreditTransaction[] = [
  {
    id: "tx-1",
    date: "2026-02-16T14:32:00Z",
    description: "4 images generated for Summer Collection (HD, 16:9)",
    creditsUsed: 12,
    productName: "Summer Collection",
  },
  {
    id: "tx-2",
    date: "2026-02-15T11:20:00Z",
    description: "Caption generation for Instagram carousel (5 slides)",
    creditsUsed: 3,
    productName: "Ethiopian Blend",
  },
  {
    id: "tx-3",
    date: "2026-02-14T16:45:00Z",
    description: "2 images generated for Surf Gear Promo (HD, 1:1)",
    creditsUsed: 6,
    productName: "Spring Wetsuit",
  },
  {
    id: "tx-4",
    date: "2026-02-13T09:10:00Z",
    description: "Video thumbnail generated for TikTok post",
    creditsUsed: 4,
  },
  {
    id: "tx-5",
    date: "2026-02-12T14:00:00Z",
    description: "Brand voice analysis and content suggestions",
    creditsUsed: 8,
  },
  {
    id: "tx-6",
    date: "2026-02-11T10:30:00Z",
    description: "6 images generated for Yoga Retreat Campaign (HD, 4:5)",
    creditsUsed: 18,
    productName: "Mountain Retreat",
  },
]

export const MOCK_BILLING_HISTORY: BillingInvoice[] = [
  {
    id: "inv-1",
    date: "2026-02-01",
    amount: 29.0,
    status: "paid",
  },
  {
    id: "inv-2",
    date: "2026-01-01",
    amount: 29.0,
    status: "paid",
  },
  {
    id: "inv-3",
    date: "2025-12-01",
    amount: 29.0,
    status: "paid",
  },
  {
    id: "inv-4",
    date: "2025-11-01",
    amount: 29.0,
    status: "pending",
  },
]

export const MOCK_DAILY_CREDIT_USAGE: DailyCreditUsage[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date("2026-01-18")
    date.setDate(date.getDate() + i)
    // Generate realistic-looking usage data
    const base = 4
    const variance = Math.sin(i * 0.7) * 3 + Math.cos(i * 1.3) * 2
    const spike = i % 7 === 1 || i % 7 === 3 ? 4 : 0 // heavier on Mon/Wed
    const credits = Math.max(0, Math.round(base + variance + spike + Math.random() * 2))
    return {
      date: date.toISOString().split("T")[0],
      credits,
    }
  }
)

export const MOCK_BRAND_SPARKLINES: Record<string, BrandSparklinePoint[]> = {
  "1": [
    { day: "Mon", followers: 5120 },
    { day: "Tue", followers: 5145 },
    { day: "Wed", followers: 5160 },
    { day: "Thu", followers: 5180 },
    { day: "Fri", followers: 5210 },
    { day: "Sat", followers: 5230 },
    { day: "Sun", followers: 5247 },
  ],
  "2": [
    { day: "Mon", followers: 3750 },
    { day: "Tue", followers: 3770 },
    { day: "Wed", followers: 3785 },
    { day: "Thu", followers: 3790 },
    { day: "Fri", followers: 3800 },
    { day: "Sat", followers: 3812 },
    { day: "Sun", followers: 3821 },
  ],
  "3": [
    { day: "Mon", followers: 8200 },
    { day: "Tue", followers: 8250 },
    { day: "Wed", followers: 8310 },
    { day: "Thu", followers: 8350 },
    { day: "Fri", followers: 8390 },
    { day: "Sat", followers: 8420 },
    { day: "Sun", followers: 8456 },
  ],
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Summer Cold Brew",
    description: "Smooth, refreshing cold brew perfect for hot days. Made from our signature Ethiopian blend with notes of chocolate and citrus.",
    imageCount: 12,
    creditsSpent: 36,
    createdAt: "2026-01-15T10:00:00Z",
    gradient: "linear-gradient(135deg, #1a3a4a 0%, #2a5a3a 50%, #1a4a3a 100%)",
  },
  {
    id: "2",
    name: "Espresso Blend",
    description: "Rich, full-bodied espresso blend with caramel undertones. Our best-selling roast for home baristas.",
    imageCount: 8,
    creditsSpent: 24,
    createdAt: "2026-01-20T14:30:00Z",
    gradient: "linear-gradient(135deg, #3a2a1a 0%, #5a3a2a 50%, #4a2a1a 100%)",
  },
  {
    id: "3",
    name: "Ceramic Pour-Over Set",
    description: "Handcrafted ceramic dripper and carafe set. Clean lines, zero waste, perfect extraction every time.",
    imageCount: 15,
    creditsSpent: 45,
    createdAt: "2026-01-25T09:15:00Z",
    gradient: "linear-gradient(135deg, #2a2a3a 0%, #3a3a5a 50%, #2a2a4a 100%)",
  },
  {
    id: "4",
    name: "Gift Card",
    description: "Give the gift of great coffee. Digital gift cards from $15 to $100, delivered instantly via email.",
    imageCount: 4,
    creditsSpent: 12,
    createdAt: "2026-02-01T11:00:00Z",
    gradient: "linear-gradient(135deg, #4a3a1a 0%, #6a4a2a 50%, #5a3a1a 100%)",
  },
  {
    id: "5",
    name: "Coffee Subscription Box",
    description: "Monthly curated selection of single-origin beans. Three bags, three origins, one delightful surprise.",
    imageCount: 6,
    creditsSpent: 18,
    createdAt: "2026-02-05T16:45:00Z",
    gradient: "linear-gradient(135deg, #1a2a3a 0%, #2a4a5a 50%, #1a3a4a 100%)",
  },
]

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "logos",
    content: "Good morning! I've been analyzing your brand performance this week. Your Instagram engagement is up 34% — that warm-toned product shot from Tuesday really resonated with your audience.",
    timestamp: "2026-02-16T09:00:00Z",
  },
  {
    id: "msg-2",
    role: "user",
    content: "That's great to hear! Which posts performed best?",
    timestamp: "2026-02-16T09:02:00Z",
  },
  {
    id: "msg-3",
    role: "logos",
    content: "Your top performer was the close-up pour-over shot — it hit 847 engagements with a 5.2% rate, well above your 4.7% average. The lifestyle flat-lay came in second at 623 engagements. Both used warm lighting and tight framing, which your audience consistently prefers over wide shots.",
    timestamp: "2026-02-16T09:03:00Z",
  },
  {
    id: "msg-4",
    role: "user",
    content: "Can you show me the weekly report?",
    timestamp: "2026-02-16T09:05:00Z",
  },
  {
    id: "msg-5",
    role: "logos",
    content: "Here's your weekly performance summary for Sunrise Coffee Co:",
    timestamp: "2026-02-16T09:06:00Z",
    isNew: true,
    report: {
      title: "Weekly Report — Feb 10–16",
      stats: [
        { label: "Followers", value: "+127", trend: "up" },
        { label: "Engagement", value: "4.7%", trend: "up" },
        { label: "Reach", value: "12,430", trend: "up" },
        { label: "Posts", value: "5" },
      ],
      summary: "Strong week overall. Your Tuesday and Thursday posts consistently outperform other days — consider doubling down on those time slots. Product shots are generating 2.3x more saves than lifestyle content.",
    },
  },
  {
    id: "msg-6",
    role: "user",
    content: "What should I post next week?",
    timestamp: "2026-02-16T09:08:00Z",
  },
]

export const MOCK_GENERATED_IMAGES: GeneratedImage[] = [
  {
    id: "img-1",
    productId: "1",
    productName: "Summer Cold Brew",
    gradient: "linear-gradient(135deg, #1a3a4a 0%, #2a5a3a 50%, #1a4a3a 100%)",
    aspectRatio: "1:1",
    status: "ready",
    createdAt: "2026-02-15T14:00:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-2",
    productId: "1",
    productName: "Summer Cold Brew",
    gradient: "linear-gradient(135deg, #2a4a3a 0%, #1a5a4a 50%, #2a3a4a 100%)",
    aspectRatio: "4:5",
    status: "scheduled",
    createdAt: "2026-02-15T14:01:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-3",
    productId: "1",
    productName: "Summer Cold Brew",
    gradient: "linear-gradient(135deg, #1a4a3a 0%, #3a5a2a 50%, #2a4a3a 100%)",
    aspectRatio: "16:9",
    status: "posted",
    createdAt: "2026-02-14T10:30:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-4",
    productId: "2",
    productName: "Espresso Blend",
    gradient: "linear-gradient(135deg, #3a2a1a 0%, #5a3a2a 50%, #4a2a1a 100%)",
    aspectRatio: "1:1",
    status: "ready",
    createdAt: "2026-02-13T16:00:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-5",
    productId: "3",
    productName: "Ceramic Pour-Over Set",
    gradient: "linear-gradient(135deg, #2a2a3a 0%, #3a3a5a 50%, #2a2a4a 100%)",
    aspectRatio: "9:16",
    status: "ready",
    createdAt: "2026-02-12T11:00:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-6",
    productId: "1",
    productName: "Summer Cold Brew",
    gradient: "linear-gradient(135deg, #1a3a3a 0%, #2a4a4a 50%, #1a3a4a 100%)",
    aspectRatio: "4:5",
    status: "posted",
    createdAt: "2026-02-11T09:00:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-7",
    productId: "2",
    productName: "Espresso Blend",
    gradient: "linear-gradient(135deg, #4a2a1a 0%, #6a3a2a 50%, #5a2a1a 100%)",
    aspectRatio: "16:9",
    status: "scheduled",
    createdAt: "2026-02-10T15:30:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-8",
    productId: "3",
    productName: "Ceramic Pour-Over Set",
    gradient: "linear-gradient(135deg, #3a2a3a 0%, #4a3a5a 50%, #3a2a4a 100%)",
    aspectRatio: "1:1",
    status: "ready",
    createdAt: "2026-02-09T12:00:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-9",
    gradient: "linear-gradient(135deg, #2a3a2a 0%, #3a5a3a 50%, #2a4a2a 100%)",
    aspectRatio: "9:16",
    status: "ready",
    createdAt: "2026-02-08T10:30:00Z",
    creditsUsed: 5,
  },
  {
    id: "img-10",
    productId: "4",
    productName: "Gift Card",
    gradient: "linear-gradient(135deg, #4a3a1a 0%, #6a4a2a 50%, #5a3a1a 100%)",
    aspectRatio: "16:9",
    status: "scheduled",
    createdAt: "2026-02-07T14:15:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-11",
    productId: "5",
    productName: "Coffee Subscription Box",
    gradient: "linear-gradient(135deg, #1a2a3a 0%, #2a4a5a 50%, #1a3a4a 100%)",
    aspectRatio: "4:5",
    status: "ready",
    createdAt: "2026-02-06T16:00:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-12",
    gradient: "linear-gradient(135deg, #3a2a2a 0%, #5a3a3a 50%, #4a2a2a 100%)",
    aspectRatio: "1:1",
    status: "posted",
    createdAt: "2026-02-05T11:45:00Z",
    creditsUsed: 1,
  },
  {
    id: "img-13",
    productId: "2",
    productName: "Espresso Blend",
    gradient: "linear-gradient(135deg, #4a2a2a 0%, #5a3a1a 50%, #3a2a1a 100%)",
    aspectRatio: "9:16",
    status: "ready",
    createdAt: "2026-02-04T09:20:00Z",
    creditsUsed: 5,
  },
  {
    id: "img-14",
    productId: "1",
    productName: "Summer Cold Brew",
    gradient: "linear-gradient(135deg, #1a4a4a 0%, #2a5a5a 50%, #1a3a3a 100%)",
    aspectRatio: "16:9",
    status: "scheduled",
    createdAt: "2026-02-03T13:00:00Z",
    creditsUsed: 3,
  },
  {
    id: "img-15",
    gradient: "linear-gradient(135deg, #2a2a4a 0%, #3a3a6a 50%, #2a2a5a 100%)",
    aspectRatio: "4:5",
    status: "posted",
    createdAt: "2026-02-02T15:30:00Z",
    creditsUsed: 1,
  },
]

export const MOCK_BRAND_VOICE = {
  tone: "Warm, approachable, slightly playful",
  audience: "25-40, coffee enthusiasts who value quality and sustainability",
  values: "Quality craftsmanship, sustainability, community connection",
  avoid: "Corporate jargon, aggressive sales language, talking down to customers",
}

// ═══════════════════════════════════════════════════════════════════════════
// Brand Dashboard Mock Data
// ═══════════════════════════════════════════════════════════════════════════

export const MOCK_BRAND_LOGOS_INSIGHTS: Record<string, LogosDigest> = {
  "1": {
    insightText:
      "Your warm-toned product shots are outperforming lifestyle content 2:1 this week. Tuesday and Thursday mornings are your engagement sweet spots — your audience is browsing while sipping their first cup. Consider a 'Behind the Roast' series to capitalize on the authenticity trend.",
    timestamp: "2026-02-16T06:00:00Z",
  },
  "2": {
    insightText:
      "TikTok is driving 68% of your new followers this month — your surf tutorial reels are getting shared heavily. Instagram engagement dips on weekends when your audience is at the beach, not scrolling. Shift weekend posts to early morning or late evening for better reach.",
    timestamp: "2026-02-16T06:00:00Z",
  },
  "3": {
    insightText:
      "Your 5-minute morning flow videos consistently get 3x more saves than any other content type. Tuesday posts outperform all other days by 40%. Your audience skews toward wellness beginners — keep the approachable tone and avoid advanced jargon.",
    timestamp: "2026-02-16T06:00:00Z",
  },
}

export const MOCK_MINI_CALENDAR_POSTS: Record<string, MiniCalendarPost[]> = {
  "1": [
    { id: "mc-1", platform: "instagram", preview: "New Ethiopian single-origin hero shot", scheduledAt: "2026-02-17T09:00:00Z", status: "scheduled" },
    { id: "mc-2", platform: "facebook", preview: "Latte art competition winner announcement", scheduledAt: "2026-02-18T11:00:00Z", status: "scheduled" },
    { id: "mc-3", platform: "instagram", preview: "Behind the roast: cold brew process", scheduledAt: "2026-02-19T09:00:00Z", status: "draft" },
    { id: "mc-4", platform: "instagram", preview: "Weekend special: pour-over tasting", scheduledAt: "2026-02-20T08:00:00Z", status: "scheduled" },
    { id: "mc-5", platform: "facebook", preview: "Customer spotlight: Maya's latte art", scheduledAt: "2026-02-22T10:00:00Z", status: "draft" },
  ],
  "2": [
    { id: "mc-6", platform: "tiktok", preview: "Board wax tutorial — 60s version", scheduledAt: "2026-02-17T14:30:00Z", status: "scheduled" },
    { id: "mc-7", platform: "instagram", preview: "Spring wetsuit collection drop", scheduledAt: "2026-02-18T10:00:00Z", status: "scheduled" },
    { id: "mc-8", platform: "tiktok", preview: "Sunrise surf session POV", scheduledAt: "2026-02-19T07:00:00Z", status: "draft" },
    { id: "mc-9", platform: "facebook", preview: "Weekend sale: 20% off boards", scheduledAt: "2026-02-21T09:00:00Z", status: "scheduled" },
    { id: "mc-10", platform: "instagram", preview: "Pro surfer Q&A announcement", scheduledAt: "2026-02-22T12:00:00Z", status: "scheduled" },
    { id: "mc-11", platform: "tiktok", preview: "Wetsuit sizing guide", scheduledAt: "2026-02-22T15:00:00Z", status: "draft" },
  ],
  "3": [
    { id: "mc-12", platform: "instagram", preview: "5-min morning flow video", scheduledAt: "2026-02-17T07:00:00Z", status: "scheduled" },
    { id: "mc-13", platform: "tiktok", preview: "Desk stretch routine — no mat needed", scheduledAt: "2026-02-18T12:00:00Z", status: "scheduled" },
    { id: "mc-14", platform: "instagram", preview: "New instructor spotlight: Sarah", scheduledAt: "2026-02-19T08:00:00Z", status: "draft" },
    { id: "mc-15", platform: "tiktok", preview: "Breathing exercise for focus", scheduledAt: "2026-02-20T07:00:00Z", status: "scheduled" },
    { id: "mc-16", platform: "instagram", preview: "Mountain retreat early bird pricing", scheduledAt: "2026-02-21T09:00:00Z", status: "scheduled" },
  ],
}

export const MOCK_RECENT_STUDIO_IMAGES: Record<string, RecentStudioImage[]> = {
  "1": [
    { id: "rs-1", gradient: "linear-gradient(135deg, #1a3a4a 0%, #2a5a3a 50%, #1a4a3a 100%)", productName: "Summer Cold Brew", aspectRatio: "1:1", createdAt: "2026-02-16T14:00:00Z" },
    { id: "rs-2", gradient: "linear-gradient(135deg, #3a2a1a 0%, #5a3a2a 50%, #4a2a1a 100%)", productName: "Espresso Blend", aspectRatio: "4:5", createdAt: "2026-02-15T11:00:00Z" },
    { id: "rs-3", gradient: "linear-gradient(135deg, #2a2a3a 0%, #3a3a5a 50%, #2a2a4a 100%)", productName: "Pour-Over Set", aspectRatio: "16:9", createdAt: "2026-02-14T09:00:00Z" },
    { id: "rs-4", gradient: "linear-gradient(135deg, #4a3a1a 0%, #6a4a2a 50%, #5a3a1a 100%)", productName: "Gift Card", aspectRatio: "1:1", createdAt: "2026-02-13T16:00:00Z" },
  ],
  "2": [
    { id: "rs-5", gradient: "linear-gradient(135deg, #1a3a3a 0%, #2a5a5a 50%, #1a4a4a 100%)", productName: "Spring Wetsuit", aspectRatio: "4:5", createdAt: "2026-02-16T10:00:00Z" },
    { id: "rs-6", gradient: "linear-gradient(135deg, #2a3a2a 0%, #3a5a3a 50%, #2a4a2a 100%)", productName: "Surfboard Wax", aspectRatio: "1:1", createdAt: "2026-02-15T14:00:00Z" },
    { id: "rs-7", gradient: "linear-gradient(135deg, #1a2a4a 0%, #2a3a6a 50%, #1a2a5a 100%)", productName: "Beach Towel", aspectRatio: "16:9", createdAt: "2026-02-14T11:00:00Z" },
    { id: "rs-8", gradient: "linear-gradient(135deg, #3a3a2a 0%, #5a5a3a 50%, #4a4a2a 100%)", productName: "Rashguard", aspectRatio: "9:16", createdAt: "2026-02-13T09:00:00Z" },
  ],
  "3": [
    { id: "rs-9", gradient: "linear-gradient(135deg, #2a1a3a 0%, #3a2a5a 50%, #2a1a4a 100%)", productName: "Yoga Mat", aspectRatio: "1:1", createdAt: "2026-02-16T08:00:00Z" },
    { id: "rs-10", gradient: "linear-gradient(135deg, #1a3a2a 0%, #2a5a3a 50%, #1a4a2a 100%)", productName: "Retreat Pass", aspectRatio: "4:5", createdAt: "2026-02-15T15:00:00Z" },
    { id: "rs-11", gradient: "linear-gradient(135deg, #3a2a2a 0%, #5a3a3a 50%, #4a2a2a 100%)", productName: "Block Set", aspectRatio: "16:9", createdAt: "2026-02-14T10:00:00Z" },
    { id: "rs-12", gradient: "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 50%, #2a2a2a 100%)", productName: "Meditation Cushion", aspectRatio: "1:1", createdAt: "2026-02-13T12:00:00Z" },
  ],
}

export const MOCK_PLATFORM_PERFORMANCE: Record<string, PlatformPerformance[]> = {
  "1": [
    {
      platform: "instagram", followers: 4120, followerChange: 98, engagementRate: 4.7,
      sparkline: Array.from({ length: 14 }, (_, i) => ({ day: `D${i + 1}`, value: 3900 + Math.round(i * 16 + Math.sin(i * 0.8) * 30) })),
    },
    {
      platform: "facebook", followers: 1127, followerChange: 29, engagementRate: 2.1,
      sparkline: Array.from({ length: 14 }, (_, i) => ({ day: `D${i + 1}`, value: 1060 + Math.round(i * 5 + Math.sin(i * 0.6) * 12) })),
    },
  ],
  "2": [
    {
      platform: "instagram", followers: 1845, followerChange: 42, engagementRate: 3.5,
      sparkline: Array.from({ length: 14 }, (_, i) => ({ day: `D${i + 1}`, value: 1750 + Math.round(i * 7 + Math.sin(i * 0.9) * 20) })),
    },
    {
      platform: "tiktok", followers: 1290, followerChange: 87, engagementRate: 6.2,
      sparkline: Array.from({ length: 14 }, (_, i) => ({ day: `D${i + 1}`, value: 1100 + Math.round(i * 14 + Math.sin(i * 1.1) * 25) })),
    },
    {
      platform: "facebook", followers: 686, followerChange: 11, engagementRate: 1.8,
      sparkline: Array.from({ length: 14 }, (_, i) => ({ day: `D${i + 1}`, value: 660 + Math.round(i * 2 + Math.sin(i * 0.5) * 8) })),
    },
  ],
  "3": [
    {
      platform: "instagram", followers: 5830, followerChange: 156, engagementRate: 5.1,
      sparkline: Array.from({ length: 14 }, (_, i) => ({ day: `D${i + 1}`, value: 5500 + Math.round(i * 24 + Math.sin(i * 0.7) * 40) })),
    },
    {
      platform: "tiktok", followers: 2626, followerChange: 210, engagementRate: 7.3,
      sparkline: Array.from({ length: 14 }, (_, i) => ({ day: `D${i + 1}`, value: 2200 + Math.round(i * 30 + Math.sin(i * 1.2) * 35) })),
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// Analytics Mock Data
// ═══════════════════════════════════════════════════════════════════════════

function generateFollowerGrowth(
  platforms: ("instagram" | "tiktok" | "facebook")[],
  baseCounts: Record<string, number>,
): DailyFollowerGrowth[] {
  return Array.from({ length: 90 }, (_, i) => {
    const date = new Date("2025-11-18")
    date.setDate(date.getDate() + i)
    const entry: DailyFollowerGrowth = { date: date.toISOString().split("T")[0] }
    for (const p of platforms) {
      const base = baseCounts[p]
      const trend = (i / 90) * base * 0.12
      const wave = Math.sin(i * 0.15) * base * 0.01 + Math.cos(i * 0.08) * base * 0.005
      entry[p] = Math.round(base + trend + wave)
    }
    return entry
  })
}

export const MOCK_FOLLOWER_GROWTH: Record<string, DailyFollowerGrowth[]> = {
  "1": generateFollowerGrowth(["instagram", "facebook"], { instagram: 3700, facebook: 1020 }),
  "2": generateFollowerGrowth(["instagram", "tiktok", "facebook"], { instagram: 1650, tiktok: 950, facebook: 620 }),
  "3": generateFollowerGrowth(["instagram", "tiktok"], { instagram: 5100, tiktok: 1900 }),
}

export const MOCK_ENGAGEMENT_BREAKDOWN: Record<string, EngagementBreakdown[]> = {
  "1": [
    { type: "Likes", count: 3420 },
    { type: "Comments", count: 487 },
    { type: "Shares", count: 312 },
    { type: "Saves", count: 891 },
  ],
  "2": [
    { type: "Likes", count: 2180 },
    { type: "Comments", count: 356 },
    { type: "Shares", count: 824 },
    { type: "Saves", count: 445 },
  ],
  "3": [
    { type: "Likes", count: 5640 },
    { type: "Comments", count: 912 },
    { type: "Shares", count: 1340 },
    { type: "Saves", count: 2870 },
  ],
}

export const MOCK_TOP_CONTENT: Record<string, TopContent[]> = {
  "1": [
    { id: "tc-1", platform: "instagram", preview: "Close-up pour-over extraction", engagements: 847, reach: 12430, publishedAt: "2026-02-14T09:00:00Z" },
    { id: "tc-2", platform: "instagram", preview: "Ethiopian blend flat-lay", engagements: 623, reach: 9870, publishedAt: "2026-02-12T10:00:00Z" },
    { id: "tc-3", platform: "facebook", preview: "Barista Maya's latte art", engagements: 412, reach: 7650, publishedAt: "2026-02-10T11:00:00Z" },
    { id: "tc-4", platform: "instagram", preview: "Cold brew process BTS reel", engagements: 389, reach: 6240, publishedAt: "2026-02-08T09:00:00Z" },
    { id: "tc-5", platform: "facebook", preview: "Weekend tasting event recap", engagements: 267, reach: 5120, publishedAt: "2026-02-06T15:00:00Z" },
  ],
  "2": [
    { id: "tc-6", platform: "tiktok", preview: "Board wax tutorial — viral cut", engagements: 2340, reach: 45600, publishedAt: "2026-02-13T14:00:00Z" },
    { id: "tc-7", platform: "instagram", preview: "Sunrise session golden hour", engagements: 1120, reach: 18900, publishedAt: "2026-02-11T07:00:00Z" },
    { id: "tc-8", platform: "tiktok", preview: "Wetsuit sizing hack", engagements: 980, reach: 22300, publishedAt: "2026-02-09T12:00:00Z" },
    { id: "tc-9", platform: "facebook", preview: "Spring collection announcement", engagements: 456, reach: 8700, publishedAt: "2026-02-07T10:00:00Z" },
    { id: "tc-10", platform: "instagram", preview: "Customer board transformation", engagements: 378, reach: 6200, publishedAt: "2026-02-05T16:00:00Z" },
  ],
  "3": [
    { id: "tc-11", platform: "instagram", preview: "5-min morning flow (saves record)", engagements: 3120, reach: 34500, publishedAt: "2026-02-14T07:00:00Z" },
    { id: "tc-12", platform: "tiktok", preview: "Desk stretch — no mat needed", engagements: 2840, reach: 52100, publishedAt: "2026-02-12T12:00:00Z" },
    { id: "tc-13", platform: "instagram", preview: "Mountain sunrise meditation", engagements: 1890, reach: 24600, publishedAt: "2026-02-10T06:00:00Z" },
    { id: "tc-14", platform: "tiktok", preview: "Breathing for focus — 60s", engagements: 1540, reach: 31200, publishedAt: "2026-02-08T07:00:00Z" },
    { id: "tc-15", platform: "instagram", preview: "Retreat early bird announcement", engagements: 920, reach: 15800, publishedAt: "2026-02-06T09:00:00Z" },
  ],
}

export const MOCK_LOGOS_ANALYTICS_INSIGHTS: Record<string, LogosAnalyticsInsight[]> = {
  "1": [
    { id: "lai-1", text: "Product close-ups with warm lighting consistently outperform wide-angle lifestyle shots by 2.3x in engagement." },
    { id: "lai-2", text: "Your Tuesday and Thursday 9 AM posts get 40% more reach than other time slots — your audience browses while sipping their first cup." },
    { id: "lai-3", text: "Saves are your fastest-growing metric (+28% this month), suggesting your audience is bookmarking content for later purchase decisions." },
    { id: "lai-4", text: "Facebook engagement is declining 3% week-over-week — consider cross-posting your top Instagram content with platform-native captions." },
    { id: "lai-5", text: "Your audience responds most to authenticity: behind-the-scenes content gets 1.8x more comments than polished product shots." },
  ],
  "2": [
    { id: "lai-6", text: "TikTok is your growth engine: 68% of new followers in the last 30 days came from short-form tutorials under 60 seconds." },
    { id: "lai-7", text: "Your share rate on TikTok (4.1%) is 3x the platform average — your tutorials have strong virality potential." },
    { id: "lai-8", text: "Instagram engagement drops 35% on weekends when your audience is surfing, not scrolling. Shift to early AM or late PM posting." },
    { id: "lai-9", text: "Facebook is your weakest platform with declining reach. Consider reallocating that content effort to TikTok where your ROI is highest." },
    { id: "lai-10", text: "User-generated content reposts drive 2.5x more engagement than brand-produced content — start a customer feature series." },
  ],
  "3": [
    { id: "lai-11", text: "Your saves-to-likes ratio (0.51) is exceptional — your audience treats your content as a personal wellness library." },
    { id: "lai-12", text: "Tuesday posts outperform all other days by 40%, likely due to the 'fresh start' motivation cycle your audience follows." },
    { id: "lai-13", text: "Short-form flows (under 5 minutes) get 3x more saves than longer content — your audience wants quick, actionable routines." },
    { id: "lai-14", text: "TikTok is driving rapid follower growth (+210 this week) but Instagram has higher engagement quality with more saves and comments." },
    { id: "lai-15", text: "Your beginner-friendly content performs best: avoid advanced yoga terminology to maintain your accessible brand voice." },
  ],
}

export const MOCK_AUDIENCE_GROWTH: Record<string, { total: number; change: number; changePercent: number }> = {
  "1": { total: 5247, change: 127, changePercent: 2.5 },
  "2": { total: 3821, change: 140, changePercent: 3.8 },
  "3": { total: 8456, change: 366, changePercent: 4.5 },
}

export const MOCK_ANALYTICS_STATS: Record<string, AnalyticsStats> = {
  "1": {
    engagementRate: { value: "4.7%", trend: "+0.8%", direction: "up" },
    totalReach: { value: "41,310", trend: "+12%", direction: "up" },
    postsPublished: { value: "12", trend: "+3", direction: "up" },
    bestPost: { value: "847", trend: "5.2% rate", direction: "up", preview: "Close-up pour-over extraction", platform: "instagram" },
  },
  "2": {
    engagementRate: { value: "3.2%", trend: "+0.4%", direction: "up" },
    totalReach: { value: "101,700", trend: "+34%", direction: "up" },
    postsPublished: { value: "8", trend: "-2", direction: "down" },
    bestPost: { value: "2,340", trend: "8.1% rate", direction: "up", preview: "Board wax tutorial — viral cut", platform: "tiktok" },
  },
  "3": {
    engagementRate: { value: "5.1%", trend: "+0.6%", direction: "up" },
    totalReach: { value: "158,200", trend: "+22%", direction: "up" },
    postsPublished: { value: "15", trend: "+4", direction: "up" },
    bestPost: { value: "3,120", trend: "9.0% rate", direction: "up", preview: "5-min morning flow (saves record)", platform: "instagram" },
  },
}
