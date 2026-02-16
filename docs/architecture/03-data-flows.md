# PixelPrism Data Flows & Processes

**Version:** 1.0
**Last Updated:** 2026-02-16

---

## Table of Contents

1. [User Onboarding Flow](#1-user-onboarding-flow)
2. [AI Image Generation Flow](#2-ai-image-generation-flow)
3. [Post Scheduling & Publishing Flow](#3-post-scheduling--publishing-flow)
4. [Analytics Sync Flow](#4-analytics-sync-flow)
5. [Credit System Flow](#5-credit-system-flow)
6. [Social Account Connection Flow](#6-social-account-connection-flow)
7. [Caption Suggestion Flow](#7-caption-suggestion-flow)

---

## 1. User Onboarding Flow

### 1.1 Complete Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│ STEP 1: User Signs Up                                            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ↓
                    ┌────────────────────┐
                    │  Clerk Sign-Up     │
                    │  - Email/Password  │
                    │  - Google OAuth    │
                    └────────┬───────────┘
                             │
                             ↓
                  ┌──────────────────────┐
                  │ Clerk Webhook Fires  │
                  │ POST /clerk-webhook  │
                  └────────┬─────────────┘
                           │
                           ↓
        ┌──────────────────────────────────────────┐
        │ Convex Creates User Record               │
        │ - clerkId: "user_abc"                    │
        │ - email: "user@example.com"              │
        │ - onboardingComplete: false              │
        │ - subscriptionTier: "none"               │
        │ - monthlyCreditsRemaining: 0             │
        │ - topUpCreditsRemaining: 0               │
        └────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────────────────────┐
│ STEP 2: Middleware Redirect                                      │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ↓
              ┌──────────────────────────────┐
              │ Check sessionClaims          │
              │ .metadata.onboardingComplete │
              └────────┬─────────────────────┘
                       │
                       │ = false
                       ↓
              ┌──────────────────────┐
              │ Redirect to          │
              │ /onboarding          │
              └────────┬─────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────────────┐
│ STEP 3: Onboarding Form (Multi-Step)                            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ↓
                  ┌──────────────────────┐
                  │ Step 1: Brand Basics │
                  │ - Brand name         │
                  │ - Description        │
                  │ - Upload logo        │
                  └────────┬─────────────┘
                           │
                           ↓
                  ┌──────────────────────┐
                  │ Step 2: Brand Identity│
                  │ - Industry           │
                  │ - Target audience    │
                  │ - Brand voice        │
                  │ - Mission/values     │
                  └────────┬─────────────┘
                           │
                           ↓
                  ┌──────────────────────┐
                  │ Step 3: Settings     │
                  │ - Timezone           │
                  │ - (Optional) Connect │
                  │   social account     │
                  └────────┬─────────────┘
                           │
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│ STEP 4: Create Brand + Update Clerk                             │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ↓
                  ┌──────────────────────┐
                  │ Server Action:       │
                  │ completeOnboarding() │
                  └────────┬─────────────┘
                           │
                           ├─────────────┐
                           │             │
                           ↓             ↓
            ┌──────────────────┐  ┌─────────────────┐
            │ Upload logo to   │  │ Convex Mutation:│
            │ UploadThing      │  │ Create brand    │
            └────────┬─────────┘  └────────┬────────┘
                     │                     │
                     │ Returns CDN URL     │
                     ↓                     ↓
                    ┌───────────────────────────┐
                    │ brands.insert({           │
                    │   userId,                 │
                    │   name,                   │
                    │   slug,                   │
                    │   logoUrl: CDN_URL,       │
                    │   industry,               │
                    │   targetAudience,         │
                    │   brandVoice,             │
                    │   timezone,               │
                    │   ...                     │
                    │ })                        │
                    └────────┬──────────────────┘
                             │
                             ↓
                    ┌───────────────────────┐
                    │ Update Clerk Metadata │
                    │ publicMetadata: {     │
                    │   onboardingComplete: │
                    │     true              │
                    │ }                     │
                    └────────┬──────────────┘
                             │
                             ↓
┌──────────────────────────────────────────────────────────────────┐
│ STEP 5: Select Subscription                                     │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ↓
                ┌────────────────────────────┐
                │ Show subscription options  │
                │ - Starter ($20)            │
                │ - Professional ($30)       │
                │ - Enterprise ($45)         │
                └────────┬───────────────────┘
                         │
                         ↓
                ┌────────────────────────┐
                │ User selects plan      │
                │ Redirect to Polar      │
                │ checkout               │
                └────────┬───────────────┘
                         │
                         ↓
                ┌────────────────────────┐
                │ User completes payment │
                │ on Polar               │
                └────────┬───────────────┘
                         │
                         ↓
              ┌──────────────────────────┐
              │ Polar Webhook → Convex   │
              │ subscription.created     │
              └────────┬─────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────┐
        │ Create subscription record       │
        │ Update user:                     │
        │ - subscriptionTier: "professional"│
        │ - monthlyCreditsAllocation: 100  │
        │ - monthlyCreditsRemaining: 100   │
        │ - maxBrands: 2                   │
        │ - maxSocialAccounts: 5           │
        └────────┬─────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────────────────────┐
│ STEP 6: Redirect to Dashboard                                   │
│ - User sees brand dashboard                                      │
│ - Prompt to create product or connect social account            │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 Key Points

**Onboarding Complete Flag:**
- Stored in Clerk `publicMetadata.onboardingComplete`
- Checked by middleware on every request
- Prevents access to dashboard until complete

**Brand Slug Generation:**
```typescript
function generateSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')     // Spaces to hyphens
    .replace(/-+/g, '-')      // Multiple hyphens to single
}

// Handle duplicates:
// "Sunrise Coffee Co" → "sunrise-coffee-co"
// If exists: "sunrise-coffee-co-2"
```

**Subscription Default State:**
- Users can skip subscription during onboarding
- `subscriptionTier: "none"` until they subscribe
- Limited features (can view only, cannot generate or post)

---

## 2. AI Image Generation Flow

### 2.1 Product-Based Generation

```
┌────────────────────────────────────────────────────────┐
│ User in Studio → Selects Product                       │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ Product has 1-3      │
            │ reference images     │
            │ (stored on           │
            │ UploadThing CDN)     │
            └──────────┬───────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│ User Configures Generation                              │
│ - Prompt: "coffee mug on table"                         │
│ - Style: "Lifestyle"                                    │
│ - Quality: Premium (1.5 credits)                        │
│ - Aspect Ratio: 1:1                                     │
│ - Quantity: 4                                           │
│ - Optional: Upload additional reference image           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ Click "GENERATE"     │
            └──────────┬───────────┘
                       │
                       ↓
         ┌─────────────────────────────┐
         │ Frontend → Server Action    │
         │ generateImages()            │
         └──────────┬──────────────────┘
                    │
                    ↓
       ┌────────────────────────────────────┐
       │ Server Action → Convex Mutation    │
       │ images.create()                    │
       └──────────┬─────────────────────────┘
                  │
                  ↓
    ┌─────────────────────────────────────────┐
    │ MUTATION: Check Credits                 │
    │ - Total needed: 4 × 1.5 = 6 credits     │
    │ - Available: monthly=50, topUp=10       │
    │ - Sufficient? YES                       │
    └──────────┬──────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ MUTATION: Deduct Credits                │
    │ Before: monthly=50, topUp=10            │
    │ Deduct 6 from monthly first             │
    │ After: monthly=44, topUp=10             │
    └──────────┬──────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ MUTATION: Create GeneratedImage Records │
    │ (4 separate records, status="generating")│
    │ - generatedImage_1                      │
    │ - generatedImage_2                      │
    │ - generatedImage_3                      │
    │ - generatedImage_4                      │
    └──────────┬──────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ MUTATION: Create Credit Transactions    │
    │ (4 separate transactions, type="generation")│
    └──────────┬──────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ MUTATION: Call Convex Action (async)    │
    │ ctx.scheduler.runAfter(0, "generateImage", {│
    │   imageId: generatedImage_1._id         │
    │ })                                      │
    │ × 4 times (one per image)               │
    └──────────┬──────────────────────────────┘
               │
               ↓ (Mutation returns, UI shows "Generating...")
               │
┌──────────────┴──────────────────────────────────────────┐
│ ASYNC ACTION: Generate Image                            │
│ (Runs 4 times in parallel for 4 images)                 │
└──────────────┬──────────────────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ ACTION: Fetch Product Reference Images  │
    │ - product.referenceImages (1-3 URLs)    │
    │ - Plus optional user upload (1 URL)     │
    │ - Total: 2-4 reference images           │
    └──────────┬──────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ ACTION: Build Full Prompt               │
    │ User prompt: "coffee mug on table"      │
    │ Style: "Lifestyle"                      │
    │ Final: "coffee mug on table, lifestyle  │
    │ photography, natural lighting, soft     │
    │ focus, warm tones, cozy atmosphere"     │
    └──────────┬──────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ ACTION: Call Replicate API              │
    │ POST /v1/predictions                    │
    │ Model: bytedance/seedream-4.5           │
    │ Input: {                                │
    │   prompt: full_prompt,                  │
    │   image_input: [url1, url2, url3],      │
    │   size: "2K",                           │
    │   aspect_ratio: "1:1"                   │
    │ }                                       │
    └──────────┬──────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ ACTION: Poll Replicate Status           │
    │ GET /v1/predictions/{id}                │
    │ Every 1 second, max 5 minutes           │
    │ Status: "starting" → "processing"       │
    │         → "succeeded"                   │
    └──────────┬──────────────────────────────┘
               │
               │ ✓ Success
               ↓
    ┌─────────────────────────────────────────┐
    │ ACTION: Download Image from Replicate   │
    │ URL: "https://replicate.delivery/..."  │
    │ Fetch → Blob                            │
    └──────────┬──────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ ACTION: Upload to UploadThing           │
    │ - Convert Blob to File                  │
    │ - POST /api/uploadthing                 │
    │ - Returns CDN URL                       │
    └──────────┬──────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ ACTION: Update GeneratedImage Record    │
    │ Mutation: images.markComplete({         │
    │   imageId,                              │
    │   imageUrl: CDN_URL,                    │
    │   status: "ready"                       │
    │ })                                      │
    └──────────┬──────────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────────┐
    │ REAL-TIME UPDATE → UI                   │
    │ User sees image appear in gallery       │
    │ (Convex subscription auto-updates)      │
    └─────────────────────────────────────────┘


┌────────────────────────────────────────────────────────┐
│ ERROR HANDLING                                          │
└──────────────────────┬─────────────────────────────────┘
                       │
                       │ If Replicate fails:
                       ↓
            ┌──────────────────────┐
            │ Retry once after     │
            │ 5-second backoff     │
            └──────────┬───────────┘
                       │
                       │ Still fails:
                       ↓
            ┌──────────────────────┐
            │ Mutation:            │
            │ - status: "failed"   │
            │ - refunded: true     │
            │ - errorMessage: ...  │
            └──────────┬───────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ Refund credits       │
            │ monthly += 1.5       │
            │ Create transaction   │
            │ (type="refund")      │
            └──────────┬───────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ UI shows error       │
            │ "Generation failed,  │
            │ credits refunded"    │
            └──────────────────────┘
```

### 2.2 Freeform Generation

Same flow as product-based, but:
- No `productId`
- No reference images (or just user upload)
- `referenceImageCount: 0` or `1`

---

## 3. Post Scheduling & Publishing Flow

### 3.1 Complete Flow

```
┌────────────────────────────────────────────────────────┐
│ User Creates Post                                       │
│ - From Studio: Click "Schedule Post" on image          │
│ - Or Scheduling page: "+ NEW POST"                     │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ New Post Modal Opens │
            └──────────┬───────────┘
                       │
                       ↓
    ┌──────────────────────────────────────┐
    │ Step 1: Select Image                 │
    │ - If from Studio: Pre-selected       │
    │ - If from Scheduling: Choose from    │
    │   gallery or upload                  │
    └──────────┬───────────────────────────┘
               │
               ↓
    ┌──────────────────────────────────────┐
    │ Step 2: Write Caption                │
    │ - User types: "Check out our new..." │
    │ - After 10+ chars, pause 2 seconds   │
    └──────────┬───────────────────────────┘
               │
               ↓
    ┌──────────────────────────────────────┐
    │ AUTO: AI Caption Suggestions         │
    │ Mutation → Action → OpenRouter API   │
    │ Returns 3 suggestions                │
    │ Display below textarea               │
    └──────────┬───────────────────────────┘
               │
               ↓ (Optional: User clicks suggestion to replace)
               │
    ┌──────────────────────────────────────┐
    │ Step 3: Select Platforms             │
    │ ☑ Instagram                          │
    │ ☑ Twitter/X                          │
    │ ☐ Facebook                           │
    └──────────┬───────────────────────────┘
               │
               ↓
    ┌──────────────────────────────────────┐
    │ VALIDATION: Check Caption Length     │
    │ - Instagram: 2200 max ✓              │
    │ - Twitter: 280 max                   │
    │ - Current: 350 chars                 │
    │ → Show warning: "Too long for Twitter"│
    └──────────┬───────────────────────────┘
               │
               │ User shortens or deselects Twitter
               ↓
    ┌──────────────────────────────────────┐
    │ Step 4: Set Date & Time              │
    │ - Date: Feb 17, 2026                 │
    │ - Time: 10:00 AM                     │
    │ - Timezone: America/Los_Angeles      │
    │ → Converted to UTC: 2026-02-17T18:00 │
    └──────────┬───────────────────────────┘
               │
               ↓
    ┌──────────────────────────────────────┐
    │ User Clicks "SCHEDULE"               │
    └──────────┬───────────────────────────┘
               │
               ↓
         ┌─────────────────┐
         │ Server Action:  │
         │ schedulePost()  │
         └────────┬────────┘
                  │
                  ↓
       ┌──────────────────────────┐
       │ Convex Mutation:         │
       │ posts.schedule()         │
       └──────────┬───────────────┘
                  │
                  ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Create ScheduledPost      │
    │ {                                   │
    │   userId,                           │
    │   brandId,                          │
    │   imageId,                          │
    │   imageUrl: CDN_URL,                │
    │   caption: "...",                   │
    │   selectedPlatforms: ["instagram"], │
    │   socialAccountIds: [account1],     │
    │   scheduledFor: UTC_TIMESTAMP,      │
    │   timezone: "America/Los_Angeles",  │
    │   status: "scheduled"               │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Call PostForMe API        │
    │ POST https://api.postforme.dev/     │
    │      social-posts                   │
    │ {                                   │
    │   caption: "...",                   │
    │   social_accounts: ["sa_1234"],     │
    │   media: [{                         │
    │     url: "https://cdn.uploadthing..." │
    │   }],                               │
    │   schedule_for: "2026-02-17T18:00Z" │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ PostForMe Response:                 │
    │ {                                   │
    │   id: "post_abc123",                │
    │   status: "scheduled"               │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Update ScheduledPost      │
    │ {                                   │
    │   postForMePostId: "post_abc123",   │
    │   status: "scheduled",              │
    │   scheduledAt: Date.now()           │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ UI: Show "Post scheduled!" toast    │
    │ Calendar updates with new post      │
    └─────────────────────────────────────┘


┌────────────────────────────────────────────────────────┐
│ PUBLISHING (At Scheduled Time)                          │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ PostForMe publishes  │
            │ at scheduled time    │
            │ to Instagram         │
            └──────────┬───────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ PostForMe Webhook    │
            │ → Convex             │
            │ POST /postforme-     │
            │      webhook         │
            └──────────┬───────────┘
                       │
                       ↓
    ┌─────────────────────────────────────┐
    │ Webhook Payload:                    │
    │ {                                   │
    │   event: "post.published",          │
    │   post_id: "post_abc123",           │
    │   results: [{                       │
    │     platform: "instagram",          │
    │     status: "published",            │
    │     platform_post_id: "ig_xyz",     │
    │     platform_post_url: "https://...",│
    │     published_at: "2026-02-17T18:00"│
    │   }]                                │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ HTTP Handler: Verify Signature      │
    │ Find post by postForMePostId        │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Update Post Status        │
    │ {                                   │
    │   status: "published",              │
    │   publishedAt: Date.now(),          │
    │   platformResults: [{               │
    │     platform: "instagram",          │
    │     status: "published",            │
    │     platformPostUrl: "https://...", │
    │     publishedAt: UTC_TIMESTAMP      │
    │   }]                                │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ REAL-TIME UPDATE → UI               │
    │ Post shows as "Published"           │
    │ Link to Instagram post visible      │
    └─────────────────────────────────────┘
```

### 3.2 Draft Flow

**Saving as Draft:**
- User clicks "SAVE DRAFT" instead of "SCHEDULE"
- `scheduledFor: null`
- `status: "draft"`
- No PostForMe API call
- Can edit freely later

**Publishing Draft:**
- User edits draft, sets date/time
- Clicks "SCHEDULE"
- Same flow as above (call PostForMe, update status)

---

## 4. Analytics Sync Flow

### 4.1 Automatic Sync (Every 6 Hours)

```
┌────────────────────────────────────────────────────────┐
│ Convex Scheduled Function (Cron Job)                   │
│ Runs every 6 hours: 0, 6, 12, 18 UTC                  │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ Query all active     │
            │ social accounts      │
            │ (isConnected=true)   │
            └──────────┬───────────┘
                       │
                       ↓
    ┌──────────────────────────────────────┐
    │ For each account:                    │
    │ Call syncAnalytics action            │
    │ (runs in parallel for all accounts)  │
    └──────────┬───────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ ACTION: Fetch from PostForMe        │
    │ GET /analytics/accounts/{accountId} │
    │ ?period=7d                          │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ PostForMe Response:                 │
    │ {                                   │
    │   follower_count: 5247,             │
    │   follower_change: 127,             │
    │   engagement_rate: 4.7,             │
    │   total_reach: 41310,               │
    │   posts_published: 12,              │
    │   top_posts: [...],                 │
    │   engagement_breakdown: {...}       │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Update AnalyticsCache     │
    │ Upsert record with new metrics      │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Update SocialAccount      │
    │ {                                   │
    │   followerCount: 5247,              │
    │   engagementRate: 4.7,              │
    │   lastSyncedAt: Date.now()          │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Recalculate Brand Totals  │
    │ Sum followerCount from all accounts │
    │ Update brand.totalFollowers         │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Store Follower Growth     │
    │ Daily snapshot for charts           │
    │ followerGrowth.insert({             │
    │   date: "2026-02-16",               │
    │   followerCount: 5247               │
    │ })                                  │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ REAL-TIME UPDATE → Analytics Page   │
    │ Charts and stats auto-refresh       │
    └─────────────────────────────────────┘
```

### 4.2 Manual Refresh

**User clicks "Refresh" button:**
- Same flow as automatic sync
- Immediately calls `syncAnalytics` action
- Updates cache timestamp
- UI shows loading spinner during fetch

---

## 5. Credit System Flow

### 5.1 Monthly Credit Reset

```
┌────────────────────────────────────────────────────────┐
│ Convex Scheduled Function (Daily at Midnight UTC)      │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ Query users where    │
            │ renewalDate <= now() │
            └──────────┬───────────┘
                       │
                       ↓
    ┌──────────────────────────────────────┐
    │ For each user due for renewal:       │
    └──────────┬───────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Reset Monthly Credits     │
    │ Before: monthly=5, topUp=10         │
    │ Reset: monthly=100 (allocation)     │
    │ After: monthly=100, topUp=10        │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Update Renewal Date       │
    │ Add 1 month to renewalDate          │
    │ (or use Polar subscription data)    │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Create Transaction        │
    │ {                                   │
    │   type: "renewal",                  │
    │   amount: +100,                     │
    │   balanceBefore: {monthly:5, topUp:10}│
    │   balanceAfter: {monthly:100, topUp:10}│
    │   description: "Monthly credit      │
    │                 renewal (Pro plan)" │
    │ }                                   │
    └─────────────────────────────────────┘
```

### 5.2 Credit Deduction (Generation)

```
┌────────────────────────────────────────────────────────┐
│ User Generates Image (Premium, 1.5 credits)            │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Check Balance             │
    │ monthly=50, topUp=10                │
    │ Total available: 60 credits         │
    │ Needed: 1.5 credits                 │
    │ → Sufficient ✓                      │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Deduct Credits            │
    │ Use monthly credits first           │
    │ Before: monthly=50, topUp=10        │
    │ Deduct 1.5 from monthly             │
    │ After: monthly=48.5, topUp=10       │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Create Transaction        │
    │ {                                   │
    │   type: "generation",               │
    │   amount: -1.5,                     │
    │   balanceBefore: {monthly:50, topUp:10}│
    │   balanceAfter: {monthly:48.5, topUp:10}│
    │   generatedImageId: img_123,        │
    │   operationDetails: {               │
    │     model: "seedream-4.5",          │
    │     qualityTier: "premium",         │
    │     prompt: "...",                  │
    │     status: "success"               │
    │   },                                │
    │   description: "AI image generated..."│
    │ }                                   │
    └─────────────────────────────────────┘
```

**Edge Case: Monthly Credits Exhausted**

```
Before: monthly=0.5, topUp=10
Generate Premium (1.5 credits needed)

Step 1: Deduct 0.5 from monthly (now 0)
Step 2: Deduct 1.0 from topUp (now 9)
After: monthly=0, topUp=9
```

### 5.3 Credit Refund (Failed Generation)

```
┌────────────────────────────────────────────────────────┐
│ Generation Fails After Retry                            │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Mark Image Failed         │
    │ {                                   │
    │   status: "failed",                 │
    │   refunded: true,                   │
    │   errorMessage: "Replicate timeout" │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Refund Credits            │
    │ Add back to monthly credits first   │
    │ Before: monthly=48.5, topUp=10      │
    │ Refund 1.5 to monthly               │
    │ After: monthly=50, topUp=10         │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Create Transaction        │
    │ {                                   │
    │   type: "refund",                   │
    │   amount: +1.5,                     │
    │   balanceBefore: {monthly:48.5, ...}│
    │   balanceAfter: {monthly:50, ...},  │
    │   generatedImageId: img_123,        │
    │   description: "Refund for failed..." │
    │ }                                   │
    └─────────────────────────────────────┘
```

### 5.4 Credit Top-Up Purchase

```
┌────────────────────────────────────────────────────────┐
│ User Buys 50 Credit Pack ($10)                         │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ Redirect to Polar    │
            │ checkout (one-time   │
            │ payment)             │
            └──────────┬───────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ User completes       │
            │ payment on Polar     │
            └──────────┬───────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ Polar Webhook        │
            │ payment.completed    │
            └──────────┬───────────┘
                       │
                       ↓
    ┌─────────────────────────────────────┐
    │ HTTP Handler: Verify Signature      │
    │ Extract metadata: {credits: 50}     │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Create CreditTopUp        │
    │ {                                   │
    │   userId,                           │
    │   creditsAmount: 50,                │
    │   pricePaid: 10.00,                 │
    │   status: "completed",              │
    │   creditsRemaining: 50,             │
    │   creditsUsed: 0                    │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Add to User Balance       │
    │ Before: monthly=50, topUp=10        │
    │ Add 50 to topUp                     │
    │ After: monthly=50, topUp=60         │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Create Transaction        │
    │ {                                   │
    │   type: "top_up",                   │
    │   amount: +50,                      │
    │   balanceBefore: {monthly:50, topUp:10}│
    │   balanceAfter: {monthly:50, topUp:60}│
    │   topUpId: topup_123,               │
    │   description: "50 credit pack purchased"│
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ UI: Show "Credits added!" toast     │
    │ Balance updates in header           │
    └─────────────────────────────────────┘
```

---

## 6. Social Account Connection Flow

### 6.1 OAuth Flow (Instagram Example)

```
┌────────────────────────────────────────────────────────┐
│ User Clicks "Connect Instagram"                         │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ Frontend redirects   │
            │ to PostForMe OAuth   │
            └──────────┬───────────┘
                       │
                       ↓
    URL: https://app.postforme.dev/oauth/connect?
         platform=instagram&
         project_id=YOUR_PROJECT_ID&
         redirect_uri=https://pixelprism.com/connect-callback
                       │
                       ↓
            ┌──────────────────────┐
            │ User logs into       │
            │ Instagram and        │
            │ authorizes PostForMe │
            └──────────┬───────────┘
                       │
                       ↓
    ┌─────────────────────────────────────┐
    │ PostForMe Redirects Back:           │
    │ https://pixelprism.com/             │
    │   connect-callback?                 │
    │   account_id=sa_1234&               │
    │   platform=instagram&               │
    │   username=sunrisecoffee&           │
    │   profile_picture=https://...       │
    └──────────┬──────────────────────────┘
               │
               ↓
         ┌─────────────────┐
         │ Callback Page   │
         │ → Server Action │
         └────────┬────────┘
                  │
                  ↓
       ┌──────────────────────────┐
       │ Convex Mutation:         │
       │ socialAccounts.connect() │
       └──────────┬───────────────┘
                  │
                  ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Validate Limits           │
    │ Check: user.connectedAccountsCount  │
    │        < user.maxSocialAccounts      │
    │ (5 for Professional plan)           │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Create SocialAccount      │
    │ {                                   │
    │   userId,                           │
    │   brandId,                          │
    │   postForMeAccountId: "sa_1234",    │
    │   platform: "instagram",            │
    │   platformUsername: "sunrisecoffee",│
    │   isConnected: true,                │
    │   connectedAt: Date.now(),          │
    │   followerCount: 0 // Updated via sync│
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ MUTATION: Increment Brand Count     │
    │ brand.connectedPlatformCount += 1   │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ ACTION: Fetch Initial Analytics     │
    │ Call PostForMe analytics API        │
    │ Get follower count, etc.            │
    │ Update socialAccount record         │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ UI: Redirect to Dashboard           │
    │ Show "Instagram connected!" toast   │
    │ Account visible in brand settings   │
    └─────────────────────────────────────┘
```

---

## 7. Caption Suggestion Flow

### 7.1 Real-Time Suggestions

```
┌────────────────────────────────────────────────────────┐
│ User Types Caption (New Post Modal)                    │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │ User types: "Check   │
            │ out our new..."      │
            │ (14 characters)      │
            └──────────┬───────────┘
                       │
                       │ (10+ chars typed)
                       ↓
            ┌──────────────────────┐
            │ Debounce 2 seconds   │
            │ (wait for user to    │
            │ stop typing)         │
            └──────────┬───────────┘
                       │
                       ↓
         ┌─────────────────────┐
         │ Call Convex Action  │
         │ generateSuggestions()│
         └────────┬────────────┘
                  │
                  ↓
       ┌──────────────────────────┐
       │ ACTION: Get Brand Data   │
       │ - brandVoice             │
       │ - targetAudience         │
       └──────────┬───────────────┘
                  │
                  ↓
    ┌─────────────────────────────────────┐
    │ ACTION: Call OpenRouter API         │
    │ Model: gpt-3.5-turbo (cheap)        │
    │ Prompt:                             │
    │ "Rewrite caption to match brand     │
    │  voice: [warm, approachable]        │
    │  Target: [25-40 coffee enthusiasts] │
    │  Original: [Check out our new...]"  │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ OpenRouter Response:                │
    │ 1. "Exciting news! Our new single-  │
    │     origin blend just arrived..."   │
    │ 2. "New arrival alert! Fresh        │
    │     Ethiopian beans with notes..."  │
    │ 3. "Meet our latest roast: smooth   │
    │     Ethiopian blend perfect for..." │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ ACTION: Return Suggestions          │
    │ (Array of 3 strings)                │
    └──────────┬──────────────────────────┘
               │
               ↓
    ┌─────────────────────────────────────┐
    │ UI: Display Suggestions             │
    │ [1] Exciting news! Our new...       │
    │     [Use this]                      │
    │ [2] New arrival alert! Fresh...     │
    │     [Use this]                      │
    │ [3] Meet our latest roast...        │
    │     [Use this]                      │
    └──────────┬──────────────────────────┘
               │
               │ (User clicks "Use this")
               ↓
    ┌─────────────────────────────────────┐
    │ Replace Caption Textarea            │
    │ New value: "Exciting news! Our..."  │
    └─────────────────────────────────────┘
```

**Key Points:**
- Debounce prevents API call on every keystroke
- Free for users (platform absorbs cost)
- Fast response (~1-2 seconds)
- User can ignore suggestions and keep typing

---

## Next Steps

Review the following documents:

1. [04-credit-system.md](./04-credit-system.md) - Credit mechanics details
2. [05-error-handling.md](./05-error-handling.md) - Error handling patterns

---

**Document Status:** Complete ✅
**Flows Documented:** 7 major flows
**Diagrams:** ASCII flow diagrams for all processes
