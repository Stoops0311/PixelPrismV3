import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // ============================================================
  // USER & ACCOUNT
  // ============================================================
  users: defineTable({
    // Clerk Integration
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),

    // Onboarding
    onboardingComplete: v.boolean(),
    onboardedAt: v.optional(v.number()),

    // Subscription & Credits
    subscriptionTier: v.union(
      v.literal("free"),
      v.literal("starter"),
      v.literal("professional"),
      v.literal("enterprise"),
      v.literal("none")
    ),
    monthlyCreditsAllocation: v.number(),
    monthlyCreditsRemaining: v.number(),
    topUpCreditsRemaining: v.number(),
    subscriptionRenewalDate: v.optional(v.number()),

    // Limits (based on tier)
    maxBrands: v.number(),
    maxSocialAccounts: v.number(),

    // Metadata
    timezone: v.optional(v.string()),
    lastActiveAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_renewal_date", ["subscriptionRenewalDate"]),

  // ============================================================
  // BRANDS & PRODUCTS
  // ============================================================
  brands: defineTable({
    userId: v.id("users"),

    // Basic Info
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    logoUrl: v.optional(v.string()),

    // Brand Identity
    industry: v.string(),
    fullDescription: v.optional(v.string()),
    targetAudience: v.string(),
    brandVoice: v.string(),
    brandMission: v.optional(v.string()),
    brandValues: v.optional(v.string()),
    keyDifferentiators: v.optional(v.string()),
    competitorAwareness: v.optional(v.string()),
    contentThemes: v.optional(v.string()),

    // Settings
    timezone: v.string(),

    // Aggregate Stats (denormalized)
    totalFollowers: v.number(),
    avgEngagementRate: v.optional(v.number()),
    connectedPlatformCount: v.number(),

    // Counts
    productsCount: v.number(),
    generatedImagesCount: v.number(),
    scheduledPostsCount: v.number(),

    // Activity
    lastActiveAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"])
    .index("by_user_and_slug", ["userId", "slug"]),

  products: defineTable({
    brandId: v.id("brands"),
    userId: v.id("users"),

    name: v.string(),
    description: v.string(),
    gradientPreview: v.optional(v.string()),
    colorGrid: v.optional(v.array(v.string())),

    // Stats
    referenceImagesCount: v.number(),
    generatedImagesCount: v.number(),
    creditsSpent: v.number(),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_brand", ["brandId"])
    .index("by_user", ["userId"]),

  productImages: defineTable({
    productId: v.id("products"),
    brandId: v.id("brands"),
    userId: v.id("users"),

    imageUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    originalFileName: v.optional(v.string()),

    fileSize: v.optional(v.number()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    mimeType: v.optional(v.string()),

    order: v.number(),
    uploadedAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_product_ordered", ["productId", "order"]),

  // ============================================================
  // IMAGE GENERATION
  // ============================================================
  generatedImages: defineTable({
    userId: v.id("users"),
    brandId: v.id("brands"),
    productId: v.optional(v.id("products")),

    // Generation Parameters
    prompt: v.string(),
    stylePreset: v.optional(v.string()),
    fullPrompt: v.string(),
    negativePrompt: v.optional(v.string()),

    // AI Model
    model: v.union(
      v.literal("bytedance/seedream-4.5"),
      v.literal("bytedance/seedream-4"),
      v.literal("qwen/qwen-image-2512")
    ),
    qualityTier: v.union(
      v.literal("standard"),
      v.literal("mid"),
      v.literal("premium")
    ),

    // Model Parameters
    aspectRatio: v.union(
      v.literal("1:1"),
      v.literal("4:5"),
      v.literal("16:9"),
      v.literal("9:16"),
      v.literal("3:4"),
      v.literal("4:3"),
      v.literal("3:2"),
      v.literal("2:3"),
      v.literal("21:9")
    ),
    resolution: v.optional(v.string()),
    seed: v.optional(v.number()),
    guidance: v.optional(v.number()),
    steps: v.optional(v.number()),

    // Reference Images
    referenceImageUrls: v.optional(v.array(v.string())),
    referenceImageCount: v.number(),

    // Status
    status: v.union(
      v.literal("generating"),
      v.literal("ready"),
      v.literal("failed")
    ),

    // Output
    imageUrl: v.optional(v.string()),
    replicateOutputUrls: v.optional(v.array(v.string())),
    replicatePredictionId: v.optional(v.string()),

    // Credits
    creditsUsed: v.number(),
    refunded: v.boolean(),

    // Error Handling
    errorMessage: v.optional(v.string()),
    retryCount: v.number(),

    // Image Metadata
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    fileSize: v.optional(v.number()),

    // Timestamps
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_brand", ["brandId"])
    .index("by_product", ["productId"])
    .index("by_status", ["status"])
    .index("by_brand_and_status", ["brandId", "status"]),

  // ============================================================
  // SOCIAL ACCOUNTS, POSTS, ANALYTICS
  // ============================================================
  socialAccounts: defineTable({
    userId: v.id("users"),
    brandId: v.id("brands"),

    postForMeAccountId: v.string(),

    platform: v.union(
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("linkedin"),
      v.literal("pinterest")
    ),
    connectionType: v.optional(
      v.union(
        v.literal("instagram_direct"),
        v.literal("instagram_facebook"),
        v.literal("linkedin_personal"),
        v.literal("linkedin_organization")
      )
    ),

    username: v.optional(v.string()),
    displayName: v.optional(v.string()),
    profilePhotoUrl: v.optional(v.string()),

    externalId: v.optional(v.string()),
    metadata: v.optional(v.any()),

    status: v.union(v.literal("connected"), v.literal("disconnected")),
    connectedAt: v.number(),
    disconnectedAt: v.optional(v.number()),
    disconnectReason: v.optional(v.string()),

    followerCount: v.optional(v.number()),
    engagementRate: v.optional(v.number()),
    lastSyncedAt: v.optional(v.number()),
    lastSyncStatus: v.optional(v.union(v.literal("ok"), v.literal("error"))),
    lastSyncError: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_brand", ["brandId"])
    .index("by_postforme_id", ["postForMeAccountId"])
    .index("by_brand_and_platform", ["brandId", "platform"])
    .index("by_brand_and_status", ["brandId", "status"]),

  scheduledPosts: defineTable({
    userId: v.id("users"),
    brandId: v.id("brands"),

    imageId: v.optional(v.id("generatedImages")),
    imageUrl: v.optional(v.string()),
    postForMeMediaUrl: v.optional(v.string()),
    caption: v.string(),
    originalCaption: v.optional(v.string()),
    hashtags: v.optional(v.array(v.string())),

    selectedPlatforms: v.array(
      v.union(
        v.literal("instagram"),
        v.literal("facebook"),
        v.literal("linkedin"),
        v.literal("pinterest")
      )
    ),
    socialAccountIds: v.array(v.id("socialAccounts")),

    scheduledFor: v.optional(v.number()),
    timezone: v.string(),

    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("publishing"),
      v.literal("published"),
      v.literal("failed")
    ),

    postForMePostId: v.optional(v.string()),
    syncError: v.optional(v.string()),

    platformResults: v.optional(
      v.array(
        v.object({
          platform: v.union(
            v.literal("instagram"),
            v.literal("facebook"),
            v.literal("linkedin"),
            v.literal("pinterest")
          ),
          socialAccountId: v.optional(v.id("socialAccounts")),
          status: v.union(
            v.literal("pending"),
            v.literal("success"),
            v.literal("failed")
          ),
          platformPostId: v.optional(v.string()),
          platformPostUrl: v.optional(v.string()),
          publishedAt: v.optional(v.number()),
          errorMessage: v.optional(v.string()),
        })
      )
    ),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_brand", ["brandId"])
    .index("by_status", ["status"])
    .index("by_scheduled_for", ["scheduledFor"])
    .index("by_brand_and_status", ["brandId", "status"])
    .index("by_postforme_post_id", ["postForMePostId"]),

  analyticsCache: defineTable({
    brandId: v.id("brands"),
    period: v.union(
      v.literal("7d"),
      v.literal("30d"),
      v.literal("90d"),
      v.literal("all")
    ),

    followerCount: v.number(),
    followerChange: v.number(),
    followerChangePercent: v.optional(v.number()),

    engagementRate: v.optional(v.number()),
    totalReach: v.optional(v.number()),
    postsPublished: v.number(),

    bestPostId: v.optional(v.id("topContent")),
    bestPostPreview: v.optional(v.string()),
    bestPostPlatform: v.optional(
      v.union(
        v.literal("instagram"),
        v.literal("facebook"),
        v.literal("linkedin"),
        v.literal("pinterest")
      )
    ),
    bestPostEngagements: v.optional(v.number()),

    lastSyncedAt: v.number(),
    syncStatus: v.union(v.literal("ok"), v.literal("error")),
    syncError: v.optional(v.string()),
  })
    .index("by_brand", ["brandId"])
    .index("by_brand_and_period", ["brandId", "period"]),

  followerGrowth: defineTable({
    brandId: v.id("brands"),
    socialAccountId: v.optional(v.id("socialAccounts")),
    platform: v.union(
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("linkedin"),
      v.literal("pinterest"),
      v.literal("aggregate")
    ),
    date: v.string(),
    followerCount: v.number(),
    changeFromPrevious: v.number(),
    recordedAt: v.number(),
  })
    .index("by_brand_and_date", ["brandId", "date"])
    .index("by_brand_platform_and_date", ["brandId", "platform", "date"])
    .index("by_account_and_date", ["socialAccountId", "date"]),

  topContent: defineTable({
    brandId: v.id("brands"),
    scheduledPostId: v.optional(v.id("scheduledPosts")),
    postForMePostId: v.string(),
    platform: v.union(
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("linkedin"),
      v.literal("pinterest")
    ),

    preview: v.string(),
    imageUrl: v.optional(v.string()),

    engagements: v.number(),
    reach: v.number(),
    engagementRate: v.optional(v.number()),

    likes: v.optional(v.number()),
    comments: v.optional(v.number()),
    shares: v.optional(v.number()),
    saves: v.optional(v.number()),

    publishedAt: v.number(),
    lastUpdatedAt: v.number(),
  })
    .index("by_brand", ["brandId"])
    .index("by_brand_and_engagements", ["brandId", "engagements"]),

  // ============================================================
  // BILLING & CREDITS
  // ============================================================
  subscriptions: defineTable({
    userId: v.id("users"),

    polarSubscriptionId: v.string(),
    polarCustomerId: v.string(),

    tier: v.union(
      v.literal("free"),
      v.literal("starter"),
      v.literal("professional"),
      v.literal("enterprise")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("paused")
    ),

    pricePerMonth: v.number(),
    currency: v.string(),

    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    renewalDate: v.number(),

    cancelAtPeriodEnd: v.boolean(),
    canceledAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_polar_id", ["polarSubscriptionId"])
    .index("by_renewal_date", ["renewalDate"]),

  creditTransactions: defineTable({
    userId: v.id("users"),
    brandId: v.optional(v.id("brands")),

    type: v.union(
      v.literal("generation"),
      v.literal("renewal"),
      v.literal("top_up"),
      v.literal("refund"),
      v.literal("adjustment")
    ),

    amount: v.number(),
    balanceBefore: v.object({
      monthly: v.number(),
      topUp: v.number(),
    }),
    balanceAfter: v.object({
      monthly: v.number(),
      topUp: v.number(),
    }),

    generatedImageId: v.optional(v.id("generatedImages")),
    topUpId: v.optional(v.id("creditTopUps")),

    operationDetails: v.optional(
      v.object({
        model: v.optional(v.string()),
        qualityTier: v.optional(v.string()),
        prompt: v.optional(v.string()),
        aspectRatio: v.optional(v.string()),
        referenceImageCount: v.optional(v.number()),
        productName: v.optional(v.string()),
        status: v.optional(v.string()),
      })
    ),

    description: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "createdAt"])
    .index("by_brand", ["brandId"])
    .index("by_type", ["type"]),

  creditTopUps: defineTable({
    userId: v.id("users"),

    creditsAmount: v.number(),
    pricePaid: v.number(),
    currency: v.string(),

    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),

    polarPaymentId: v.optional(v.string()),

    creditsRemaining: v.number(),
    creditsUsed: v.number(),

    purchasedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_polar_payment_id", ["polarPaymentId"]),

  // ============================================================
  // WEBHOOK LOGGING (Idempotency)
  // ============================================================
  webhookLogs: defineTable({
    eventId: v.string(),
    eventType: v.string(),
    source: v.union(
      v.literal("clerk"),
      v.literal("polar"),
      v.literal("postforme")
    ),
    processedAt: v.number(),
  }).index("by_event_id", ["eventId"]),

  // ============================================================
  // NOTIFICATIONS
  // ============================================================
  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("post_published"),
      v.literal("post_engagement"),
      v.literal("credits_received"),
      v.literal("credits_low")
    ),
    title: v.string(),
    body: v.string(),
    icon: v.optional(v.string()),
    href: v.optional(v.string()),
    read: v.boolean(),
    readAt: v.optional(v.number()),
    brandId: v.optional(v.id("brands")),
    relatedId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user_and_read", ["userId", "read"])
    .index("by_user_and_created", ["userId", "createdAt"]),
})
