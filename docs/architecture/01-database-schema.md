# PixelPrism Database Schema (Convex)

**Version:** 1.0
**Last Updated:** 2026-02-16

---

## Table of Contents

1. [Schema Overview](#1-schema-overview)
2. [User & Account Tables](#2-user--account-tables)
3. [Brand & Product Tables](#3-brand--product-tables)
4. [Image Generation Tables](#4-image-generation-tables)
5. [Social Media Tables](#5-social-media-tables)
6. [Analytics Tables](#6-analytics-tables)
7. [Billing & Credits Tables](#7-billing--credits-tables)
8. [Indexes & Performance](#8-indexes--performance)
9. [Data Relationships Diagram](#9-data-relationships-diagram)

---

## 1. Schema Overview

### 1.1 Convex Schema Basics

Convex uses TypeScript for schema definition. All tables are defined in `convex/schema.ts`.

**Key Concepts:**
- **Tables:** Defined with `defineTable()`
- **Fields:** Typed with `v` validator (v.string(), v.number(), etc.)
- **Indexes:** Defined with `.index()` for fast queries
- **Optional Fields:** Use `v.optional()` for nullable fields
- **Timestamps:** Convex automatically adds `_creationTime` to all documents

### 1.2 Table List

| Table Name | Purpose | Relationships |
|------------|---------|---------------|
| `users` | Core user data (synced from Clerk) | → brands, subscriptions, credits |
| `brands` | Business profiles managed by users | → products, socialAccounts, posts |
| `products` | Product catalog for each brand | → productImages, generatedImages |
| `productImages` | Reference images for products | → products |
| `generatedImages` | AI-generated marketing images | → brands, products (optional) |
| `socialAccounts` | Connected platform accounts | → brands, posts |
| `scheduledPosts` | Scheduled/published social posts | → brands, socialAccounts, generatedImages |
| `postPlatformResults` | Per-platform post results | → scheduledPosts |
| `analyticsCache` | Cached analytics from PostForMe | → brands, socialAccounts |
| `followerGrowth` | Daily follower count tracking | → brands, socialAccounts |
| `topContent` | Top performing posts | → brands |
| `subscriptions` | User subscription data (from Polar) | → users |
| `creditTransactions` | Audit log of all credit usage | → users, brands, generatedImages |
| `creditTopUps` | Purchased credit packs | → users |

---

## 2. User & Account Tables

### 2.1 `users` Table

Stores core user information synced from Clerk via webhooks.

```typescript
// convex/schema.ts
users: defineTable({
  // Clerk Integration
  clerkId: v.string(),              // Clerk user ID (e.g., "user_2a1b3c4d")
  email: v.string(),                // Primary email
  name: v.optional(v.string()),     // Full name
  imageUrl: v.optional(v.string()), // Profile picture URL

  // Onboarding Status
  onboardingComplete: v.boolean(),  // Has user completed onboarding?
  onboardedAt: v.optional(v.number()), // Timestamp of onboarding completion

  // Subscription & Credits
  subscriptionTier: v.union(
    v.literal("starter"),
    v.literal("professional"),
    v.literal("enterprise"),
    v.literal("none")               // No active subscription
  ),
  monthlyCreditsAllocation: v.number(), // Credits per month based on tier
  monthlyCreditsRemaining: v.number(),  // Current month's remaining credits
  topUpCreditsRemaining: v.number(),    // Purchased credits (never expire)
  subscriptionRenewalDate: v.optional(v.number()), // Next renewal timestamp

  // Limits (based on tier)
  maxBrands: v.number(),            // Maximum brands allowed
  maxSocialAccounts: v.number(),    // Maximum social accounts allowed

  // Metadata
  timezone: v.optional(v.string()), // User's timezone (e.g., "America/Los_Angeles")
  lastActiveAt: v.optional(v.number()), // Last activity timestamp
}).index("by_clerk_id", ["clerkId"])
  .index("by_email", ["email"])
  .index("by_renewal_date", ["subscriptionRenewalDate"])
```

**Field Details:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `clerkId` | string | Yes | Unique identifier from Clerk (e.g., "user_2a1b3c4d") |
| `email` | string | Yes | User's primary email address |
| `name` | string | No | User's full name (from Clerk) |
| `imageUrl` | string | No | Profile picture URL (from Clerk or uploaded) |
| `onboardingComplete` | boolean | Yes | `false` until first brand created, then `true` |
| `onboardedAt` | timestamp | No | Unix timestamp when onboarding completed |
| `subscriptionTier` | enum | Yes | One of: `"starter"`, `"professional"`, `"enterprise"`, `"none"` |
| `monthlyCreditsAllocation` | number | Yes | Base credits per month: 50 (Starter), 100 (Pro), 300 (Enterprise) |
| `monthlyCreditsRemaining` | number | Yes | Resets to `monthlyCreditsAllocation` on renewal date |
| `topUpCreditsRemaining` | number | Yes | Never resets, decreases when monthly credits exhausted |
| `subscriptionRenewalDate` | timestamp | No | Unix timestamp of next billing cycle |
| `maxBrands` | number | Yes | 1 (Starter), 2 (Pro), 4 (Enterprise) |
| `maxSocialAccounts` | number | Yes | 2 (Starter), 5 (Pro), 10 (Enterprise) |
| `timezone` | string | No | IANA timezone (e.g., "America/New_York") |
| `lastActiveAt` | timestamp | No | Updated on each API call |

**Indexes:**
- `by_clerk_id`: Fast lookup by Clerk ID (used in every authenticated query)
- `by_email`: Email-based queries
- `by_renewal_date`: Scheduled credit reset job uses this

**Creation Flow:**
1. User signs up via Clerk
2. Clerk webhook fires to Convex `/clerk-webhook`
3. Convex creates user record with defaults:
   - `onboardingComplete: false`
   - `subscriptionTier: "none"`
   - `monthlyCreditsAllocation: 0`
   - `monthlyCreditsRemaining: 0`
   - `topUpCreditsRemaining: 0`
   - `maxBrands: 0`
   - `maxSocialAccounts: 0`
4. After onboarding + subscription, these get updated

---

## 3. Brand & Product Tables

### 3.1 `brands` Table

Each user can manage multiple brands (up to tier limit).

```typescript
brands: defineTable({
  // Ownership
  userId: v.id("users"),            // Owner of this brand

  // Basic Info
  name: v.string(),                 // Brand name (e.g., "Sunrise Coffee Co")
  slug: v.string(),                 // URL-safe slug (e.g., "sunrise-coffee-co")
  description: v.string(),          // Short description
  logoUrl: v.optional(v.string()),  // Brand logo (uploaded to UploadThing)

  // Brand Identity (for AI insights & caption generation)
  industry: v.string(),             // Industry/category
  fullDescription: v.optional(v.string()), // Detailed brand story
  targetAudience: v.string(),       // Target audience description
  brandVoice: v.string(),           // Brand voice/tone (e.g., "casual and playful")
  brandMission: v.optional(v.string()), // Mission statement
  brandValues: v.optional(v.string()), // Core values
  keyDifferentiators: v.optional(v.string()), // What makes brand unique
  competitorAwareness: v.optional(v.string()), // Competitor landscape
  contentThemes: v.optional(v.string()), // Main content topics

  // Settings
  timezone: v.string(),             // Brand's timezone (for scheduling)

  // Aggregate Stats (denormalized for performance)
  totalFollowers: v.number(),       // Sum across all connected platforms
  avgEngagementRate: v.optional(v.number()), // Average engagement %
  connectedPlatformCount: v.number(), // Number of connected social accounts

  // Counts
  productsCount: v.number(),        // Total products
  generatedImagesCount: v.number(), // Total generated images
  scheduledPostsCount: v.number(),  // Total scheduled posts

  // Activity
  lastActiveAt: v.optional(v.number()), // Last time brand was accessed
  createdAt: v.number(),            // Brand creation timestamp
}).index("by_user", ["userId"])
  .index("by_slug", ["slug"])
  .index("by_user_and_slug", ["userId", "slug"])
```

**Field Details:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | id(users) | Yes | Foreign key to users table |
| `name` | string | Yes | Display name (e.g., "Sunrise Coffee Co") |
| `slug` | string | Yes | URL-safe identifier (e.g., "sunrise-coffee-co") |
| `description` | string | Yes | 1-2 sentence brand description |
| `logoUrl` | string | No | UploadThing CDN URL for brand logo |
| `industry` | string | Yes | Industry/category (e.g., "Coffee & Beverages") |
| `fullDescription` | string | No | Detailed brand story (multi-paragraph) |
| `targetAudience` | string | Yes | Who the brand serves (e.g., "25-40 coffee enthusiasts") |
| `brandVoice` | string | Yes | Tone of voice (e.g., "warm, approachable, slightly playful") |
| `brandMission` | string | No | Mission statement |
| `brandValues` | string | No | Core values (comma-separated or paragraph) |
| `keyDifferentiators` | string | No | What makes brand unique |
| `competitorAwareness` | string | No | Competitive landscape notes |
| `contentThemes` | string | No | Main topics brand covers |
| `timezone` | string | Yes | IANA timezone (e.g., "America/Los_Angeles") |
| `totalFollowers` | number | Yes | Denormalized sum from all social accounts |
| `avgEngagementRate` | number | No | Average engagement rate across platforms |
| `connectedPlatformCount` | number | Yes | Number of social accounts connected |
| `productsCount` | number | Yes | Total products for this brand |
| `generatedImagesCount` | number | Yes | Total AI images generated |
| `scheduledPostsCount` | number | Yes | Total scheduled posts |
| `lastActiveAt` | timestamp | No | Last activity timestamp |
| `createdAt` | timestamp | Yes | Brand creation time |

**Indexes:**
- `by_user`: Get all brands for a user
- `by_slug`: Unique slug lookup
- `by_user_and_slug`: Route matching `/dashboard/[brandSlug]`

**Slug Generation Rules:**
- Convert name to lowercase
- Replace spaces with hyphens
- Remove special characters
- If duplicate, append `-2`, `-3`, etc.
- Example: "Sunrise Coffee Co" → "sunrise-coffee-co"

**Validation Rules:**
- User cannot create more brands than `maxBrands` limit
- Slug must be unique within user's brands
- All brand identity fields required for AI features to work properly

---

### 3.2 `products` Table

Products are items/services a brand sells. Used for AI image generation with reference images.

```typescript
products: defineTable({
  // Ownership
  brandId: v.id("brands"),          // Which brand owns this product
  userId: v.id("users"),            // Owner (denormalized for fast filtering)

  // Product Info
  name: v.string(),                 // Product name (e.g., "Summer Cold Brew")
  description: v.string(),          // 1-2 sentence description

  // Visual
  gradientPreview: v.optional(v.string()), // CSS gradient for preview card

  // Stats
  referenceImagesCount: v.number(), // Number of reference images (1-3)
  generatedImagesCount: v.number(), // Number of AI images generated for this product
  creditsSpent: v.number(),         // Total credits spent on generations

  // Metadata
  createdAt: v.number(),            // Product creation timestamp
  updatedAt: v.optional(v.number()), // Last update timestamp
}).index("by_brand", ["brandId"])
  .index("by_user", ["userId"])
```

**Field Details:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | id(brands) | Yes | Parent brand |
| `userId` | id(users) | Yes | Denormalized owner ID |
| `name` | string | Yes | Product name |
| `description` | string | Yes | Short description (1-2 sentences) |
| `gradientPreview` | string | No | CSS gradient for visual preview (e.g., "linear-gradient(135deg, #1a3a4a 0%, #2a5a3a 50%)") |
| `referenceImagesCount` | number | Yes | Number of reference images uploaded (1-3) |
| `generatedImagesCount` | number | Yes | Total AI generations for this product |
| `creditsSpent` | number | Yes | Running total of credits used |
| `createdAt` | timestamp | Yes | Creation time |
| `updatedAt` | timestamp | No | Last modification time |

**Validation:**
- `referenceImagesCount` must be 1-3
- Product name required (min 2 chars)
- Description required (min 10 chars)

---

### 3.3 `productImages` Table

Reference images for products (used as input to multimodal AI models).

```typescript
productImages: defineTable({
  // Ownership
  productId: v.id("products"),      // Parent product
  brandId: v.id("brands"),          // Parent brand (denormalized)
  userId: v.id("users"),            // Owner (denormalized)

  // Image Data
  imageUrl: v.string(),             // UploadThing CDN URL
  thumbnailUrl: v.optional(v.string()), // Smaller version for UI
  originalFileName: v.optional(v.string()), // Original upload filename

  // Metadata
  fileSize: v.optional(v.number()), // Size in bytes
  width: v.optional(v.number()),    // Image width in pixels
  height: v.optional(v.number()),   // Image height in pixels
  mimeType: v.optional(v.string()), // e.g., "image/jpeg"

  // Ordering
  order: v.number(),                // Display order (0, 1, 2 for max 3 images)

  // Timestamps
  uploadedAt: v.number(),           // Upload timestamp
}).index("by_product", ["productId"])
  .index("by_product_ordered", ["productId", "order"])
```

**Field Details:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | id(products) | Yes | Parent product |
| `brandId` | id(brands) | Yes | Denormalized brand ID |
| `userId` | id(users) | Yes | Denormalized user ID |
| `imageUrl` | string | Yes | UploadThing CDN URL (main image) |
| `thumbnailUrl` | string | No | Thumbnail version for grid views |
| `originalFileName` | string | No | Original filename from upload |
| `fileSize` | number | No | File size in bytes |
| `width` | number | No | Image width in pixels |
| `height` | number | No | Image height in pixels |
| `mimeType` | string | No | MIME type (e.g., "image/jpeg") |
| `order` | number | Yes | Display order: 0, 1, or 2 (max 3 images) |
| `uploadedAt` | timestamp | Yes | Upload timestamp |

**Upload Flow:**
1. User uploads image file to UploadThing from product page
2. UploadThing returns CDN URL
3. Create `productImages` record with URL + metadata
4. Increment `product.referenceImagesCount`

**Constraints:**
- Maximum 3 images per product
- `order` must be 0, 1, or 2
- If deleting an image, reorder remaining images

---

## 4. Image Generation Tables

### 4.1 `generatedImages` Table

AI-generated marketing images from Studio.

```typescript
generatedImages: defineTable({
  // Ownership
  userId: v.id("users"),            // Owner
  brandId: v.id("brands"),          // Which brand generated this
  productId: v.optional(v.id("products")), // Associated product (if product-based generation)

  // Generation Parameters
  prompt: v.string(),               // User's text prompt
  stylePreset: v.optional(v.string()), // Style applied (e.g., "Lifestyle", "Product Shot")
  fullPrompt: v.string(),           // Final prompt sent to AI (prompt + style modifiers)
  negativePrompt: v.optional(v.string()), // Negative prompt (for Qwen)

  // AI Model Used
  model: v.union(
    v.literal("bytedance/seedream-4.5"),
    v.literal("bytedance/seedream-4"),
    v.literal("qwen/qwen-image-2512")
  ),
  qualityTier: v.union(
    v.literal("standard"),  // 0.5 credits
    v.literal("mid"),       // 1 credit
    v.literal("premium")    // 1.5 credits
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
  resolution: v.optional(v.string()), // e.g., "2048x2048", "4096x4096"
  seed: v.optional(v.number()),       // Seed for reproducibility
  guidance: v.optional(v.number()),   // Guidance scale
  steps: v.optional(v.number()),      // Inference steps

  // Reference Images (for multimodal generation)
  referenceImageUrls: v.optional(v.array(v.string())), // Product images + optional upload
  referenceImageCount: v.number(),    // Number of reference images used (0 for freeform)

  // Generation Status
  status: v.union(
    v.literal("generating"),  // API call in progress
    v.literal("ready"),       // Successfully generated
    v.literal("failed")       // Generation failed
  ),

  // Output
  imageUrl: v.optional(v.string()),   // UploadThing CDN URL (final image)
  replicateOutputUrls: v.optional(v.array(v.string())), // Raw Replicate URLs (before upload to UploadThing)

  // Credits
  creditsUsed: v.number(),            // Credits deducted for this generation
  refunded: v.boolean(),              // Was this refunded due to failure?

  // Error Handling
  errorMessage: v.optional(v.string()), // Error details if failed
  retryCount: v.number(),             // Number of retry attempts

  // Metadata
  width: v.optional(v.number()),      // Final image width
  height: v.optional(v.number()),     // Final image height
  fileSize: v.optional(v.number()),   // File size in bytes

  // Timestamps
  createdAt: v.number(),              // Generation started
  completedAt: v.optional(v.number()), // Generation completed
}).index("by_user", ["userId"])
  .index("by_brand", ["brandId"])
  .index("by_product", ["productId"])
  .index("by_status", ["status"])
  .index("by_brand_and_status", ["brandId", "status"])
```

**Field Details:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | id(users) | Yes | Owner of this image |
| `brandId` | id(brands) | Yes | Brand that generated this image |
| `productId` | id(products) | No | Associated product (if product-based) |
| `prompt` | string | Yes | User's original text prompt |
| `stylePreset` | string | No | Selected style (e.g., "Lifestyle") |
| `fullPrompt` | string | Yes | Final prompt with style modifiers appended |
| `negativePrompt` | string | No | Negative prompt (Qwen only) |
| `model` | enum | Yes | AI model used |
| `qualityTier` | enum | Yes | "standard", "mid", or "premium" |
| `aspectRatio` | enum | Yes | Aspect ratio selection |
| `resolution` | string | No | Actual resolution (e.g., "2048x2048") |
| `seed` | number | No | Random seed for reproducibility |
| `guidance` | number | No | Guidance scale value |
| `steps` | number | No | Number of inference steps |
| `referenceImageUrls` | array<string> | No | URLs of reference images used |
| `referenceImageCount` | number | Yes | Count of reference images (0 for freeform) |
| `status` | enum | Yes | "generating", "ready", or "failed" |
| `imageUrl` | string | No | UploadThing CDN URL (final) |
| `replicateOutputUrls` | array<string> | No | Raw Replicate URLs |
| `creditsUsed` | number | Yes | Credits deducted |
| `refunded` | boolean | Yes | Was this refunded? |
| `errorMessage` | string | No | Error details if failed |
| `retryCount` | number | Yes | Retry attempts (max 1) |
| `width` | number | No | Final image width |
| `height` | number | No | Final image height |
| `fileSize` | number | No | File size in bytes |
| `createdAt` | timestamp | Yes | Generation start time |
| `completedAt` | timestamp | No | Generation completion time |

**Generation Flow:**

1. **Initial Creation** (status: "generating")
   - Deduct credits from user
   - Create record with all parameters
   - Set `status: "generating"`

2. **Call Replicate API**
   - Send request with parameters
   - Poll for completion (async)

3. **On Success:**
   - Download image from Replicate
   - Upload to UploadThing
   - Update record:
     - `status: "ready"`
     - `imageUrl: CDN_URL`
     - `completedAt: timestamp`
   - Increment `brand.generatedImagesCount`
   - If product-based: increment `product.generatedImagesCount`

4. **On Failure (after 1 retry):**
   - Update record:
     - `status: "failed"`
     - `errorMessage: details`
     - `refunded: true`
   - Refund credits to user
   - Create credit transaction (negative amount)

**Quality Tier → Model Mapping:**

| Quality Tier | Model | Credits | Resolution |
|--------------|-------|---------|------------|
| `"standard"` | `qwen/qwen-image-2512` | 0.5 | Up to 2048px |
| `"mid"` | `bytedance/seedream-4` | 1.0 | Up to 2048px (regular/big) |
| `"premium"` | `bytedance/seedream-4.5` | 1.5 | 2K-4K (1024-4096px) |

---

## 5. Social Media Tables

### 5.1 `socialAccounts` Table

Connected social media accounts (via PostForMe OAuth).

```typescript
socialAccounts: defineTable({
  // Ownership
  userId: v.id("users"),            // Owner
  brandId: v.id("brands"),          // Associated brand

  // PostForMe Integration
  postForMeAccountId: v.string(),   // PostForMe's account ID (e.g., "sa_1234")

  // Platform Info
  platform: v.union(
    v.literal("instagram"),
    v.literal("twitter"),   // X/Twitter
    v.literal("facebook")
  ),
  platformAccountId: v.optional(v.string()), // Platform's native ID
  platformUsername: v.string(),     // Username/handle
  platformDisplayName: v.optional(v.string()), // Display name
  platformProfilePicture: v.optional(v.string()), // Profile picture URL

  // Connection Status
  isConnected: v.boolean(),         // Is account still connected?
  connectedAt: v.number(),          // Initial connection timestamp
  lastSyncedAt: v.optional(v.number()), // Last analytics sync

  // Cached Analytics (updated every 6 hours)
  followerCount: v.number(),        // Current follower count
  engagementRate: v.optional(v.number()), // Average engagement %

  // Metadata
  disconnectedAt: v.optional(v.number()), // If disconnected, when?
  disconnectReason: v.optional(v.string()), // Why disconnected (error, user action)
}).index("by_user", ["userId"])
  .index("by_brand", ["brandId"])
  .index("by_postforme_id", ["postForMeAccountId"])
  .index("by_platform", ["platform"])
  .index("by_brand_and_platform", ["brandId", "platform"])
```

**Field Details:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | id(users) | Yes | Owner |
| `brandId` | id(brands) | Yes | Brand this account belongs to |
| `postForMeAccountId` | string | Yes | PostForMe's ID (e.g., "sa_1234") |
| `platform` | enum | Yes | "instagram", "twitter", or "facebook" |
| `platformAccountId` | string | No | Platform's native ID |
| `platformUsername` | string | Yes | Username/handle (e.g., "@sunrisecoffee") |
| `platformDisplayName` | string | No | Display name |
| `platformProfilePicture` | string | No | Profile picture URL |
| `isConnected` | boolean | Yes | `true` if active, `false` if disconnected |
| `connectedAt` | timestamp | Yes | Initial connection time |
| `lastSyncedAt` | timestamp | No | Last analytics sync |
| `followerCount` | number | Yes | Current follower count |
| `engagementRate` | number | No | Average engagement % |
| `disconnectedAt` | timestamp | No | Disconnection time |
| `disconnectReason` | string | No | Reason for disconnection |

**Connection Flow:**

1. User clicks "Connect Instagram" in UI
2. Frontend redirects to PostForMe OAuth URL
3. User authorizes on Instagram
4. PostForMe redirects back with account data
5. Create `socialAccounts` record with:
   - `postForMeAccountId` from PostForMe
   - `platform`, `username`, etc.
   - `isConnected: true`
   - Initial `followerCount`
6. Increment `brand.connectedPlatformCount`

**Validation:**
- User cannot connect more than `maxSocialAccounts` (based on tier)
- Cannot connect same platform account twice to same brand
- Must validate PostForMe account ID is valid

---

### 5.2 `scheduledPosts` Table

Social media posts (drafts, scheduled, published).

```typescript
scheduledPosts: defineTable({
  // Ownership
  userId: v.id("users"),            // Owner
  brandId: v.id("brands"),          // Which brand

  // Content
  imageId: v.id("generatedImages"), // Which AI-generated image to post
  imageUrl: v.string(),             // Denormalized image URL (for performance)
  caption: v.string(),              // Post caption (max 2200 chars)
  originalCaption: v.optional(v.string()), // Original before AI suggestions

  // Platforms
  selectedPlatforms: v.array(v.union(
    v.literal("instagram"),
    v.literal("twitter"),
    v.literal("facebook")
  )),
  socialAccountIds: v.array(v.id("socialAccounts")), // Which accounts to post to

  // Scheduling
  scheduledFor: v.optional(v.number()), // When to publish (UTC timestamp), null for drafts
  timezone: v.string(),             // Timezone for display (e.g., "America/Los_Angeles")

  // Status
  status: v.union(
    v.literal("draft"),       // Not scheduled yet
    v.literal("scheduled"),   // Queued in PostForMe
    v.literal("publishing"),  // PostForMe is publishing now
    v.literal("published"),   // Successfully published
    v.literal("failed")       // Publishing failed
  ),

  // PostForMe Integration
  postForMePostId: v.optional(v.string()), // PostForMe's post ID (once scheduled)

  // Per-Platform Results (array of objects)
  platformResults: v.optional(v.array(v.object({
    platform: v.string(),             // "instagram", "twitter", "facebook"
    status: v.string(),               // "published", "failed"
    platformPostId: v.optional(v.string()), // Native post ID from platform
    platformPostUrl: v.optional(v.string()), // Public URL to post
    publishedAt: v.optional(v.number()),     // Timestamp
    errorMessage: v.optional(v.string()),    // Error if failed
  }))),

  // Timestamps
  createdAt: v.number(),            // Draft created
  scheduledAt: v.optional(v.number()), // When user scheduled it
  publishedAt: v.optional(v.number()), // Actual publish time
  updatedAt: v.optional(v.number()), // Last modification
}).index("by_user", ["userId"])
  .index("by_brand", ["brandId"])
  .index("by_status", ["status"])
  .index("by_scheduled_time", ["scheduledFor"])
  .index("by_brand_and_status", ["brandId", "status"])
```

**Field Details:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | id(users) | Yes | Owner |
| `brandId` | id(brands) | Yes | Brand |
| `imageId` | id(generatedImages) | Yes | Which AI image to post |
| `imageUrl` | string | Yes | Denormalized image URL |
| `caption` | string | Yes | Post text (max 2200 chars) |
| `originalCaption` | string | No | Before AI suggestions |
| `selectedPlatforms` | array<enum> | Yes | Platforms to post to |
| `socialAccountIds` | array<id> | Yes | Social accounts to use |
| `scheduledFor` | timestamp | No | Publish time (null for drafts) |
| `timezone` | string | Yes | User's timezone for display |
| `status` | enum | Yes | Post status |
| `postForMePostId` | string | No | PostForMe's ID (once scheduled) |
| `platformResults` | array<object> | No | Per-platform results |
| `createdAt` | timestamp | Yes | Creation time |
| `scheduledAt` | timestamp | No | When scheduled |
| `publishedAt` | timestamp | No | Actual publish time |
| `updatedAt` | timestamp | No | Last update |

**Post Lifecycle:**

```
draft → scheduled → publishing → published
  ↓         ↓                       ↓
 edit     cancel                 failed
```

**Scheduling Flow:**

1. **Save as Draft** (`status: "draft"`)
   - No `scheduledFor` timestamp
   - No `postForMePostId`
   - Can be edited freely

2. **Schedule Post** (`status: "scheduled"`)
   - User sets date/time
   - Convert to UTC timestamp
   - Call PostForMe API: `POST /social-posts`
     ```json
     {
       "caption": "...",
       "social_accounts": ["sa_1234", "sa_5678"],
       "media": [{ "url": "https://cdn.uploadthing.com/..." }],
       "schedule_for": "2026-02-17T10:00:00Z"
     }
     ```
   - PostForMe returns `post_id`
   - Update record:
     - `postForMePostId: "post_id"`
     - `status: "scheduled"`
     - `scheduledAt: now()`

3. **PostForMe Publishes** (at scheduled time)
   - PostForMe posts to platforms
   - Sends webhook to Convex `/postforme-webhook`
   - Webhook payload:
     ```json
     {
       "event": "post.published",
       "post_id": "post_123",
       "results": [
         {
           "platform": "instagram",
           "status": "published",
           "platform_post_id": "ig_abc123",
           "platform_post_url": "https://instagram.com/p/abc123",
           "published_at": "2026-02-17T10:00:15Z"
         },
         {
           "platform": "twitter",
           "status": "published",
           "platform_post_id": "tw_xyz789",
           "platform_post_url": "https://twitter.com/user/status/xyz789",
           "published_at": "2026-02-17T10:00:18Z"
         }
       ]
     }
     ```
   - Update record:
     - `status: "published"`
     - `publishedAt: timestamp`
     - `platformResults: [...]`

4. **Publishing Failed**
   - If PostForMe fails, webhook includes error
   - Update record:
     - `status: "failed"`
     - `platformResults` with error messages
   - User can retry manually

**Caption Length Validation:**

| Platform | Max Length | Action if Exceeded |
|----------|------------|-------------------|
| Instagram | 2,200 chars | OK |
| Facebook | 63,206 chars | OK |
| Twitter/X | 280 chars | Show warning, allow deselect or shorten |

**Dynamic Limit Logic:**
- If only Instagram selected: 2,200 char limit
- If only Facebook selected: 2,200 char limit (keep consistent)
- If Twitter selected: 280 char limit enforced
- If Twitter + Instagram: 280 char limit (most restrictive)
- UI shows: "⚠️ Caption too long for Twitter (500/280). Please shorten or deselect Twitter."

---

## 6. Analytics Tables

### 6.1 `analyticsCache` Table

Cached analytics data from PostForMe (refreshed every 6 hours).

```typescript
analyticsCache: defineTable({
  // Scope
  brandId: v.id("brands"),          // Which brand
  socialAccountId: v.optional(v.id("socialAccounts")), // Specific account (null for brand-level)
  platform: v.optional(v.string()), // Platform (null for aggregated)

  // Metrics
  followerCount: v.number(),        // Current followers
  followerChange: v.number(),       // Change this period
  followerChangePercent: v.optional(v.number()), // % change

  engagementRate: v.optional(v.number()), // Average engagement %
  engagementRateChange: v.optional(v.number()), // Change

  totalReach: v.optional(v.number()), // Total impressions
  totalReachChange: v.optional(v.number()), // Change

  postsPublished: v.number(),       // Posts in period
  postsPublishedChange: v.number(), // Change

  // Best Post
  bestPostId: v.optional(v.string()), // PostForMe post ID
  bestPostEngagements: v.optional(v.number()), // Engagement count
  bestPostPreview: v.optional(v.string()), // Caption preview
  bestPostPlatform: v.optional(v.string()), // Platform

  // Time Period
  periodStart: v.number(),          // Period start (UTC)
  periodEnd: v.number(),            // Period end (UTC)

  // Cache Metadata
  lastSyncedAt: v.number(),         // When cached
  syncedFrom: v.string(),           // Source: "postforme" or "manual"
}).index("by_brand", ["brandId"])
  .index("by_social_account", ["socialAccountId"])
  .index("by_brand_and_period", ["brandId", "periodEnd"])
```

**Sync Strategy:**
- **Automatic:** Convex scheduled function runs every 6 hours
- **Manual:** User clicks "Refresh" button in Analytics page
- **Webhook:** PostForMe can trigger sync on significant events

**Sync Flow:**
1. Call PostForMe Analytics API for each social account
2. Aggregate data at brand level
3. Update or create `analyticsCache` records
4. Update `brand.totalFollowers`, `brand.avgEngagementRate`
5. Update `socialAccounts` follower counts

---

### 6.2 `followerGrowth` Table

Daily follower count tracking for charts.

```typescript
followerGrowth: defineTable({
  // Scope
  brandId: v.id("brands"),
  socialAccountId: v.optional(v.id("socialAccounts")),
  platform: v.string(),             // "instagram", "twitter", "facebook", "aggregate"

  // Date
  date: v.string(),                 // YYYY-MM-DD format

  // Metrics
  followerCount: v.number(),        // Followers on this date
  changeFromPrevious: v.number(),   // Delta from previous day

  // Timestamps
  recordedAt: v.number(),           // When recorded
}).index("by_brand_and_date", ["brandId", "date"])
  .index("by_account_and_date", ["socialAccountId", "date"])
```

**Purpose:** Powers the follower growth line chart in Analytics page.

**Data Collection:**
- Daily snapshot via scheduled function (runs at midnight UTC)
- Stores one record per brand per platform per day
- Used to generate 30/60/90-day growth charts

---

### 6.3 `topContent` Table

Top performing posts (cached for performance).

```typescript
topContent: defineTable({
  // Ownership
  brandId: v.id("brands"),
  scheduledPostId: v.optional(v.id("scheduledPosts")), // Our post (if exists)

  // PostForMe Data
  postForMePostId: v.string(),      // PostForMe post ID
  platform: v.string(),             // Platform

  // Content
  preview: v.string(),              // Caption preview (first 100 chars)
  imageUrl: v.optional(v.string()), // Post image URL

  // Performance
  engagements: v.number(),          // Total engagements (likes + comments + shares)
  reach: v.number(),                // Total reach/impressions
  engagementRate: v.optional(v.number()), // % engagement

  // Breakdown
  likes: v.optional(v.number()),
  comments: v.optional(v.number()),
  shares: v.optional(v.number()),
  saves: v.optional(v.number()),

  // Metadata
  publishedAt: v.number(),          // When published
  lastUpdatedAt: v.number(),        // Analytics last updated
}).index("by_brand", ["brandId"])
  .index("by_brand_and_engagements", ["brandId", "engagements"])
```

**Purpose:** Powers the "Top Performing Content" table in Analytics.

**Data Source:**
- Pulled from PostForMe during analytics sync
- Cached for performance
- Updated every 6 hours

---

## 7. Billing & Credits Tables

### 7.1 `subscriptions` Table

User subscription data (synced from Polar via webhooks).

```typescript
subscriptions: defineTable({
  // Ownership
  userId: v.id("users"),

  // Polar Integration
  polarSubscriptionId: v.string(),  // Polar's subscription ID
  polarCustomerId: v.string(),      // Polar's customer ID

  // Subscription Details
  tier: v.union(
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

  // Pricing
  pricePerMonth: v.number(),        // $20, $30, or $45
  currency: v.string(),             // "USD"

  // Billing Cycle
  currentPeriodStart: v.number(),   // Current billing period start
  currentPeriodEnd: v.number(),     // Current billing period end
  renewalDate: v.number(),          // Next renewal date

  // Cancellation
  cancelAtPeriodEnd: v.boolean(),   // Will cancel at end of period?
  canceledAt: v.optional(v.number()), // When canceled

  // Timestamps
  createdAt: v.number(),            // Subscription start
  updatedAt: v.optional(v.number()), // Last update
}).index("by_user", ["userId"])
  .index("by_polar_id", ["polarSubscriptionId"])
  .index("by_renewal_date", ["renewalDate"])
```

**Webhook Flow (Polar → Convex):**

1. **Subscription Created:**
   ```json
   {
     "event": "subscription.created",
     "subscription_id": "sub_123",
     "customer_id": "cus_456",
     "tier": "professional",
     "price": 30.00,
     "current_period_end": 1234567890
   }
   ```
   - Create `subscriptions` record
   - Update `users` record:
     - `subscriptionTier: "professional"`
     - `monthlyCreditsAllocation: 100`
     - `monthlyCreditsRemaining: 100`
     - `subscriptionRenewalDate: current_period_end`
     - `maxBrands: 2`
     - `maxSocialAccounts: 5`

2. **Subscription Renewed:**
   - Update `subscriptions.currentPeriodEnd`
   - Reset `users.monthlyCreditsRemaining` to `monthlyCreditsAllocation`
   - Create `creditTransactions` record (type: "renewal")

3. **Subscription Canceled:**
   - Update `subscriptions.cancelAtPeriodEnd: true`
   - User keeps access until `currentPeriodEnd`
   - On period end: set `users.subscriptionTier: "none"`, zero out limits

---

### 7.2 `creditTransactions` Table

Audit log of all credit usage (for billing transparency).

```typescript
creditTransactions: defineTable({
  // Ownership
  userId: v.id("users"),
  brandId: v.optional(v.id("brands")), // Associated brand (if applicable)

  // Transaction Type
  type: v.union(
    v.literal("generation"),    // AI image generation
    v.literal("renewal"),       // Monthly credit renewal
    v.literal("top_up"),        // Purchased credit pack
    v.literal("refund"),        // Refund for failed generation
    v.literal("adjustment")     // Manual adjustment (support)
  ),

  // Credits
  amount: v.number(),           // Credits changed (positive for add, negative for deduct)
  balanceBefore: v.object({
    monthly: v.number(),
    topUp: v.number()
  }),
  balanceAfter: v.object({
    monthly: v.number(),
    topUp: v.number()
  }),

  // Related Records
  generatedImageId: v.optional(v.id("generatedImages")), // If type="generation"
  topUpId: v.optional(v.id("creditTopUps")),             // If type="top_up"

  // Generation Details (if applicable)
  operationDetails: v.optional(v.object({
    model: v.optional(v.string()),           // AI model used
    qualityTier: v.optional(v.string()),     // "standard", "mid", "premium"
    prompt: v.optional(v.string()),          // User's prompt
    aspectRatio: v.optional(v.string()),     // Aspect ratio
    referenceImageCount: v.optional(v.number()), // Number of ref images
    productName: v.optional(v.string()),     // Product name (if product-based)
    status: v.optional(v.string()),          // "success" or "failed"
  })),

  // Metadata
  description: v.string(),      // Human-readable description
  createdAt: v.number(),        // Transaction timestamp
}).index("by_user", ["userId"])
  .index("by_user_and_date", ["userId", "createdAt"])
  .index("by_brand", ["brandId"])
  .index("by_type", ["type"])
```

**Purpose:**
- Full audit trail of credit usage
- Displayed on Billing page
- Used for dispute resolution
- Tracks what credits were used for

**Example Transactions:**

```typescript
// Image Generation (Deduction)
{
  type: "generation",
  amount: -1.5,  // 1.5 credits deducted
  balanceBefore: { monthly: 50, topUp: 10 },
  balanceAfter: { monthly: 48.5, topUp: 10 },  // Monthly credits used first
  generatedImageId: "gen_123",
  operationDetails: {
    model: "bytedance/seedream-4.5",
    qualityTier: "premium",
    prompt: "coffee mug on wooden table",
    aspectRatio: "1:1",
    productName: "Summer Cold Brew",
    status: "success"
  },
  description: "AI image generated for Summer Cold Brew (Premium quality)",
  createdAt: 1234567890
}

// Monthly Renewal (Addition)
{
  type: "renewal",
  amount: +100,  // 100 credits added
  balanceBefore: { monthly: 0, topUp: 5 },
  balanceAfter: { monthly: 100, topUp: 5 },
  description: "Monthly credit renewal (Professional plan)",
  createdAt: 1234567890
}

// Credit Refund (Addition)
{
  type: "refund",
  amount: +1.5,  // Refund failed generation
  balanceBefore: { monthly: 48.5, topUp: 10 },
  balanceAfter: { monthly: 50, topUp: 10 },
  generatedImageId: "gen_124",
  operationDetails: {
    status: "failed"
  },
  description: "Refund for failed image generation",
  createdAt: 1234567891
}
```

**Credit Deduction Order:**
1. Use `monthlyCreditsRemaining` first (until 0)
2. Then use `topUpCreditsRemaining`
3. If both exhausted, block generation

---

### 7.3 `creditTopUps` Table

Purchased credit packs (never expire).

```typescript
creditTopUps: defineTable({
  // Ownership
  userId: v.id("users"),

  // Purchase
  creditsAmount: v.number(),        // Credits purchased (e.g., 50, 100, 200)
  pricePaid: v.number(),            // Amount paid in USD
  currency: v.string(),             // "USD"

  // Status
  status: v.union(
    v.literal("pending"),   // Payment processing
    v.literal("completed"), // Credits added to account
    v.literal("failed"),    // Payment failed
    v.literal("refunded")   // Refunded
  ),

  // Payment Integration (Polar)
  polarPaymentId: v.optional(v.string()), // Polar payment ID

  // Usage
  creditsRemaining: v.number(),     // How many left from this pack
  creditsUsed: v.number(),          // How many used so far

  // Timestamps
  purchasedAt: v.number(),          // Purchase timestamp
  completedAt: v.optional(v.number()), // When credits added
}).index("by_user", ["userId"])
  .index("by_status", ["status"])
```

**Top-Up Flow:**

1. User clicks "Buy Credits" in Billing page
2. Select pack size (e.g., 50 credits for $10)
3. Redirect to Polar checkout
4. Polar webhook → Convex:
   ```json
   {
     "event": "payment.completed",
     "payment_id": "pay_123",
     "amount": 10.00,
     "metadata": {
       "credits": 50,
       "user_id": "user_abc"
     }
   }
   ```
5. Create `creditTopUps` record:
   - `status: "completed"`
   - `creditsAmount: 50`
   - `creditsRemaining: 50`
   - `creditsUsed: 0`
6. Add to `users.topUpCreditsRemaining`
7. Create `creditTransactions` record (type: "top_up")

**Never Expire:**
- Top-up credits persist across billing cycles
- Only decrease when used (never reset)
- If user downgrades or cancels, top-up credits remain

---

## 8. Indexes & Performance

### 8.1 Critical Indexes

All tables with `userId` have `.index("by_user", ["userId"])` for fast user-scoped queries.

**Most Important Indexes:**

| Table | Index | Purpose |
|-------|-------|---------|
| `users` | `by_clerk_id` | Authenticated query lookup |
| `users` | `by_renewal_date` | Credit reset scheduled job |
| `brands` | `by_user_and_slug` | Route matching |
| `generatedImages` | `by_brand_and_status` | Gallery filtering |
| `scheduledPosts` | `by_brand_and_status` | Calendar filtering |
| `scheduledPosts` | `by_scheduled_time` | Find posts to publish |
| `socialAccounts` | `by_brand_and_platform` | Platform connection checks |
| `creditTransactions` | `by_user_and_date` | Billing page pagination |

### 8.2 Query Patterns

**Common Queries:**

```typescript
// Get user by Clerk ID (every authenticated request)
const user = await ctx.db
  .query("users")
  .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
  .unique()

// Get user's brands
const brands = await ctx.db
  .query("brands")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .collect()

// Get brand by slug (for route /dashboard/[brandSlug])
const brand = await ctx.db
  .query("brands")
  .withIndex("by_user_and_slug", (q) =>
    q.eq("userId", userId).eq("slug", slug)
  )
  .unique()

// Get recent generated images for a brand
const images = await ctx.db
  .query("generatedImages")
  .withIndex("by_brand_and_status", (q) =>
    q.eq("brandId", brandId).eq("status", "ready")
  )
  .order("desc")  // Most recent first
  .take(20)

// Get scheduled posts for calendar
const posts = await ctx.db
  .query("scheduledPosts")
  .withIndex("by_brand_and_status", (q) =>
    q.eq("brandId", brandId).eq("status", "scheduled")
  )
  .filter((q) =>
    q.gte(q.field("scheduledFor"), startOfMonth) &&
    q.lt(q.field("scheduledFor"), endOfMonth)
  )
  .collect()
```

### 8.3 Denormalization Strategy

**Why Denormalize:**
- Reduce join-like queries
- Improve read performance
- Simplify real-time subscriptions

**Denormalized Fields:**

| Table | Field | Source | Why |
|-------|-------|--------|-----|
| `brands` | `totalFollowers` | Sum of `socialAccounts.followerCount` | Fast display in brand switcher |
| `brands` | `productsCount` | Count of `products` | Avoid counting query |
| `scheduledPosts` | `imageUrl` | `generatedImages.imageUrl` | Avoid join for display |
| `products` | `userId` | `brands.userId` | Fast user-scoped queries |
| `generatedImages` | `userId` | `brands.userId` | Fast user-scoped queries |

**Update Pattern:**
When a denormalized field changes, update all dependent records. Example:

```typescript
// When social account follower count changes:
async function updateSocialAccountFollowers(
  ctx,
  accountId,
  newFollowerCount
) {
  // 1. Update social account
  await ctx.db.patch(accountId, {
    followerCount: newFollowerCount
  })

  // 2. Recalculate brand total
  const account = await ctx.db.get(accountId)
  const allAccounts = await ctx.db
    .query("socialAccounts")
    .withIndex("by_brand", (q) => q.eq("brandId", account.brandId))
    .collect()

  const totalFollowers = allAccounts.reduce(
    (sum, acc) => sum + acc.followerCount,
    0
  )

  // 3. Update brand
  await ctx.db.patch(account.brandId, {
    totalFollowers
  })
}
```

---

## 9. Data Relationships Diagram

```
┌─────────────┐
│   users     │
└──────┬──────┘
       │ 1:N
       ├──────────────┐
       │              │
┌──────▼──────┐  ┌────▼─────────────┐
│   brands    │  │  subscriptions   │
└──────┬──────┘  └──────────────────┘
       │ 1:N
       ├──────────────┬──────────────┬──────────────┐
       │              │              │              │
┌──────▼──────┐  ┌────▼──────┐  ┌────▼───────────┐  ┌▼──────────────┐
│  products   │  │socialAccts│  │scheduledPosts  │  │generatedImages│
└──────┬──────┘  └───────────┘  └────┬───────────┘  └───────────────┘
       │ 1:N                           │ 1:N
       │                               │
┌──────▼──────────┐            ┌───────▼──────────────┐
│ productImages   │            │platformResults       │
└─────────────────┘            └──────────────────────┘

┌─────────────┐
│   users     │
└──────┬──────┘
       │ 1:N
       ├──────────────┬──────────────┐
       │              │              │
┌──────▼──────────┐  ┌▼──────────┐  ┌▼─────────────┐
│creditTransactions│  │creditTopUps│  │analyticsCache│
└──────────────────┘  └────────────┘  └──────────────┘
```

**Relationship Summary:**

- **1 User** → **N Brands** (up to `maxBrands`)
- **1 Brand** → **N Products**
- **1 Brand** → **N Social Accounts** (up to `maxSocialAccounts`)
- **1 Brand** → **N Scheduled Posts**
- **1 Brand** → **N Generated Images**
- **1 Product** → **1-3 Product Images** (max 3)
- **1 Scheduled Post** → **N Platform Results** (one per platform)
- **1 User** → **1 Subscription**
- **1 User** → **N Credit Transactions** (audit log)
- **1 User** → **N Credit Top-Ups**

---

## Next Steps

This schema provides the foundation for all data operations in PixelPrism. Review the following documents for implementation details:

1. [02-integrations.md](./02-integrations.md) - Third-party API specifications
2. [03-data-flows.md](./03-data-flows.md) - Detailed process flows
3. [04-credit-system.md](./04-credit-system.md) - Credit mechanics
4. [05-error-handling.md](./05-error-handling.md) - Error handling patterns

---

**Document Status:** Complete ✅
**Schema Version:** 1.0
**Tables Defined:** 13
**Total Fields:** ~150+
