# PixelPrism Third-Party Integrations

**Version:** 1.0
**Last Updated:** 2026-02-16

---

## Table of Contents

1. [Integration Overview](#1-integration-overview)
2. [Clerk Authentication](#2-clerk-authentication)
3. [PostForMe Social Media API](#3-postforme-social-media-api)
4. [UploadThing Image Storage](#4-uploadthing-image-storage)
5. [Replicate AI Image Generation](#5-replicate-ai-image-generation)
6. [OpenRouter AI Caption Generation](#6-openrouter-ai-caption-generation)
7. [Polar Billing & Subscriptions](#7-polar-billing--subscriptions)
8. [Webhook Security](#8-webhook-security)

---

## 1. Integration Overview

### 1.1 External Services Summary

| Service | Purpose | Authentication | Webhooks | Cost Model |
|---------|---------|----------------|----------|------------|
| **Clerk** | User auth, session management | API keys | Yes (user sync) | Free tier available |
| **PostForMe** | Social media OAuth, posting, analytics | API key (Bearer) | Yes (post status) | $10/mo + per-post |
| **UploadThing** | Image storage & CDN | API key | No | Usage-based |
| **Replicate** | AI image generation | API token | Optional | Per-generation |
| **OpenRouter** | AI caption generation | API key | No | Per-token |
| **Polar** | Subscriptions, billing | Access token | Yes (subscription events) | Per-transaction |

### 1.2 Environment Variables Required

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud

# PostForMe Social Media
POSTFORME_API_KEY=pfm_...
POSTFORME_WEBHOOK_SECRET=whsec_...

# UploadThing Storage
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# Replicate AI
REPLICATE_API_TOKEN=r8_...

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-...

# Polar Billing
POLAR_ACCESS_TOKEN=polar_at_...
POLAR_WEBHOOK_SECRET=whsec_...
```

---

## 2. Clerk Authentication

### 2.1 Overview

**Purpose:** Handle user authentication, session management, and OAuth.

**Key Features Used:**
- Email/password and Google OAuth
- Public metadata for onboarding state
- Webhook for user sync to Convex
- Middleware for route protection

**Documentation:** https://clerk.com/docs

### 2.2 Setup

**1. Install Package:**
```bash
bun add @clerk/nextjs
```

**2. Root Layout Setup:**
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

**3. Middleware Setup:**
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboarding(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // Redirect unauthenticated users to sign-in
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  // Redirect new users to onboarding
  if (userId && !isPublicRoute(req)) {
    const onboardingComplete = sessionClaims?.metadata?.onboardingComplete
    if (!onboardingComplete) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|xml)).*)',
  ],
}
```

### 2.3 Onboarding Flow

**Check Onboarding Status:**
```typescript
// app/onboarding/layout.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function OnboardingLayout({ children }) {
  const { sessionClaims } = await auth()

  // Redirect already-onboarded users
  if (sessionClaims?.metadata?.onboardingComplete === true) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
```

**Complete Onboarding:**
```typescript
// app/onboarding/actions.ts
'use server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function completeOnboarding(brandData: BrandData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Not authenticated')

  const client = await clerkClient()

  // 1. Create brand in Convex (via mutation)
  const brandId = await createBrandInConvex(userId, brandData)

  // 2. Update Clerk metadata
  await client.users.updateUser(userId, {
    publicMetadata: {
      onboardingComplete: true,
      onboardedAt: new Date().toISOString(),
      firstBrandId: brandId,
    },
  })

  // 3. Redirect to dashboard
  redirect('/dashboard')
}
```

### 2.4 User Sync Webhook

**Webhook Endpoint:** `POST /clerk-webhook` (Convex HTTP endpoint)

**Events Handled:**
- `user.created` - Create user record in Convex
- `user.updated` - Update user record in Convex
- `user.deleted` - Soft delete or remove user

**Implementation:**
```typescript
// convex/http.ts
import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'
import { Webhook } from 'svix'

const http = httpRouter()

const clerkWebhook = httpAction(async (ctx, request) => {
  // 1. Verify webhook signature
  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const payload = await request.text()
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let evt
  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch {
    return new Response('Invalid signature', { status: 401 })
  }

  // 2. Handle events
  switch (evt.type) {
    case 'user.created': {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data
      await ctx.runMutation(internal.users.create, {
        clerkId: id,
        email: email_addresses[0]?.email_address ?? '',
        name: [first_name, last_name].filter(Boolean).join(' ') || undefined,
        imageUrl: image_url || undefined,
      })
      break
    }
    case 'user.updated': {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data
      await ctx.runMutation(internal.users.update, {
        clerkId: id,
        email: email_addresses[0]?.email_address ?? '',
        name: [first_name, last_name].filter(Boolean).join(' ') || undefined,
        imageUrl: image_url || undefined,
      })
      break
    }
    case 'user.deleted': {
      const { id } = evt.data
      if (id) {
        await ctx.runMutation(internal.users.remove, { clerkId: id })
      }
      break
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})

http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: clerkWebhook,
})

export default http
```

**Webhook Configuration in Clerk Dashboard:**
1. Go to Webhooks → Add Endpoint
2. URL: `https://your-convex-url.convex.cloud/clerk-webhook`
3. Events: Select `user.created`, `user.updated`, `user.deleted`
4. Copy webhook secret to `CLERK_WEBHOOK_SECRET` env var

### 2.5 Getting Current User in Convex

```typescript
// convex/users.ts
import { query } from './_generated/server'

export const current = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
  },
})
```

---

## 3. PostForMe Social Media API

### 3.1 Overview

**Purpose:** Handle OAuth, post scheduling, and analytics for Instagram, Twitter/X, and Facebook.

**Base URL:** `https://api.postforme.dev`

**Authentication:** Bearer token (`Authorization: Bearer YOUR_API_KEY`)

**Documentation:** https://api.postforme.dev/docs

**Pricing:** $10/month + per-post delivery fee

### 3.2 OAuth Connection Flow

**Step 1: Initiate OAuth**

User clicks "Connect Instagram" in PixelPrism → redirect to PostForMe:

```
https://app.postforme.dev/oauth/connect?
  platform=instagram&
  project_id=YOUR_PROJECT_ID&
  redirect_uri=https://pixelprism.com/dashboard/brands/connect-callback
```

**Step 2: User Authorizes**

User logs into Instagram and authorizes PostForMe.

**Step 3: Callback with Account ID**

PostForMe redirects back with account data:

```
https://pixelprism.com/dashboard/brands/connect-callback?
  account_id=sa_1234&
  platform=instagram&
  username=sunrisecoffee&
  profile_picture=https://...
```

**Step 4: Store in Convex**

```typescript
// Create socialAccounts record
await ctx.db.insert('socialAccounts', {
  userId: user._id,
  brandId: brand._id,
  postForMeAccountId: 'sa_1234',
  platform: 'instagram',
  platformUsername: 'sunrisecoffee',
  platformProfilePicture: 'https://...',
  isConnected: true,
  connectedAt: Date.now(),
  followerCount: 0, // Will be updated via analytics API
})
```

### 3.3 Posting API

**Create & Schedule Post:**

```typescript
// POST https://api.postforme.dev/social-posts
const response = await fetch('https://api.postforme.dev/social-posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.POSTFORME_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    caption: "New single-origin Ethiopian blend just dropped!",
    social_accounts: ["sa_1234", "sa_5678"], // PostForMe account IDs
    media: [
      { url: "https://cdn.uploadthing.com/..." }
    ],
    schedule_for: "2026-02-17T10:00:00Z" // UTC timestamp, omit for immediate post
  })
})

const data = await response.json()
// Response: { id: "post_abc123", status: "scheduled" }
```

**Response:**
```json
{
  "id": "post_abc123",
  "status": "scheduled",
  "social_accounts": ["sa_1234", "sa_5678"],
  "schedule_for": "2026-02-17T10:00:00Z",
  "created_at": "2026-02-16T14:30:00Z"
}
```

**Store in Convex:**
```typescript
await ctx.db.insert('scheduledPosts', {
  userId: user._id,
  brandId: brand._id,
  imageId: generatedImage._id,
  imageUrl: generatedImage.imageUrl,
  caption: "New single-origin Ethiopian blend just dropped!",
  selectedPlatforms: ["instagram", "twitter"],
  socialAccountIds: [account1._id, account2._id],
  scheduledFor: 1708164000000, // UTC timestamp
  timezone: "America/Los_Angeles",
  status: "scheduled",
  postForMePostId: "post_abc123",
  createdAt: Date.now(),
})
```

### 3.4 Analytics API

**Get Account Analytics:**

```typescript
// GET https://api.postforme.dev/analytics/accounts/sa_1234
const response = await fetch(
  `https://api.postforme.dev/analytics/accounts/sa_1234?period=30d`,
  {
    headers: {
      'Authorization': `Bearer ${process.env.POSTFORME_API_KEY}`,
    }
  }
)

const data = await response.json()
```

**Response:**
```json
{
  "account_id": "sa_1234",
  "platform": "instagram",
  "period": {
    "start": "2026-01-17",
    "end": "2026-02-16"
  },
  "metrics": {
    "follower_count": 5247,
    "follower_change": 127,
    "follower_change_percent": 2.5,
    "engagement_rate": 4.7,
    "engagement_rate_change": 0.8,
    "total_reach": 41310,
    "posts_published": 12
  },
  "top_posts": [
    {
      "post_id": "post_xyz",
      "caption_preview": "Close-up pour-over extraction",
      "engagements": 847,
      "reach": 12438,
      "published_at": "2026-02-14T09:00:00Z"
    }
  ],
  "engagement_breakdown": {
    "likes": 3420,
    "comments": 487,
    "shares": 312,
    "saves": 891
  }
}
```

**Cache in Convex:**
```typescript
await ctx.db.insert('analyticsCache', {
  brandId: brand._id,
  socialAccountId: account._id,
  platform: "instagram",
  followerCount: 5247,
  followerChange: 127,
  followerChangePercent: 2.5,
  engagementRate: 4.7,
  totalReach: 41310,
  postsPublished: 12,
  periodStart: Date.parse("2026-01-17"),
  periodEnd: Date.parse("2026-02-16"),
  lastSyncedAt: Date.now(),
  syncedFrom: "postforme",
})
```

**Sync Strategy:**
- **Automatic:** Convex scheduled function runs every 6 hours
- **Manual:** User clicks "Refresh" button
- **On-Demand:** After posting completes

### 3.5 Webhooks from PostForMe

**Webhook URL:** `https://your-convex-url.convex.cloud/postforme-webhook`

**Events:**
- `post.published` - Post successfully published
- `post.failed` - Post failed to publish
- `account.disconnected` - Account authorization revoked

**Example Payload:**
```json
{
  "event": "post.published",
  "post_id": "post_abc123",
  "results": [
    {
      "platform": "instagram",
      "status": "published",
      "platform_post_id": "ig_xyz789",
      "platform_post_url": "https://instagram.com/p/xyz789",
      "published_at": "2026-02-17T10:00:15Z"
    },
    {
      "platform": "twitter",
      "status": "published",
      "platform_post_id": "tw_123456",
      "platform_post_url": "https://twitter.com/user/status/123456",
      "published_at": "2026-02-17T10:00:18Z"
    }
  ]
}
```

**Handler:**
```typescript
// convex/http.ts
const postForMeWebhook = httpAction(async (ctx, request) => {
  // 1. Verify signature (similar to Clerk)
  const signature = request.headers.get('x-postforme-signature')
  const payload = await request.text()

  // Verify with POSTFORME_WEBHOOK_SECRET
  // ...

  const event = JSON.parse(payload)

  // 2. Find scheduled post
  const post = await ctx.runQuery(internal.posts.findByPostForMeId, {
    postForMeId: event.post_id
  })

  if (!post) {
    return new Response('Post not found', { status: 404 })
  }

  // 3. Update post status
  if (event.event === 'post.published') {
    await ctx.runMutation(internal.posts.markPublished, {
      postId: post._id,
      platformResults: event.results,
      publishedAt: Date.now(),
    })
  } else if (event.event === 'post.failed') {
    await ctx.runMutation(internal.posts.markFailed, {
      postId: post._id,
      errorMessage: event.error_message,
    })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})

http.route({
  path: '/postforme-webhook',
  method: 'POST',
  handler: postForMeWebhook,
})
```

**Webhook Configuration in PostForMe Dashboard:**
1. Go to Settings → Webhooks
2. Add endpoint: `https://your-convex-url.convex.cloud/postforme-webhook`
3. Select events: `post.published`, `post.failed`
4. Copy webhook secret to `POSTFORME_WEBHOOK_SECRET`

---

## 4. UploadThing Image Storage

### 4.1 Overview

**Purpose:** Fast image uploads with built-in CDN delivery.

**Key Features:**
- Direct client-side uploads
- Automatic CDN distribution
- Presigned upload URLs
- Image optimization

**Documentation:** https://docs.uploadthing.com

**Pricing:** Usage-based (storage + bandwidth)

### 4.2 Setup

**1. Install Package:**
```bash
bun add uploadthing @uploadthing/react
```

**2. Create Upload Route:**
```typescript
// app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  // Brand logo uploader
  brandLogo: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Check auth via Clerk
      const { userId } = await auth()
      if (!userId) throw new Error("Unauthorized")
      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Brand logo upload complete:", file.url)
      return { uploadedBy: metadata.userId }
    }),

  // Product reference images
  productImage: f({ image: { maxFileSize: "5MB", maxFileCount: 3 } })
    .middleware(async ({ req }) => {
      const { userId } = await auth()
      if (!userId) throw new Error("Unauthorized")
      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Product image upload complete:", file.url)
      return { uploadedBy: metadata.userId }
    }),

  // AI-generated image storage
  generatedImage: f({ image: { maxFileSize: "10MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Internal uploads from Convex actions don't need auth
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})
```

**3. Client-Side Upload Component:**
```typescript
// components/ui/image-upload.tsx
'use client'

import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/route"

export function BrandLogoUpload({ onUploadComplete }) {
  return (
    <UploadButton<OurFileRouter>
      endpoint="brandLogo"
      onClientUploadComplete={(res) => {
        // res = [{ url, name, size, key }]
        onUploadComplete(res[0].url)
      }}
      onUploadError={(error) => {
        alert(`Upload failed: ${error.message}`)
      }}
    />
  )
}
```

### 4.3 Server-Side Upload (from Convex)

**Use Case:** Upload AI-generated images from Replicate to UploadThing.

```typescript
// convex/actions/uploadImage.ts
import { action } from '../_generated/server'
import { v } from 'convex/values'

export const uploadImageToUploadThing = action({
  args: {
    imageUrl: v.string(), // Replicate output URL
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Download image from Replicate
    const imageResponse = await fetch(args.imageUrl)
    const imageBlob = await imageResponse.blob()

    // 2. Convert to File
    const file = new File([imageBlob], args.fileName, {
      type: imageBlob.type
    })

    // 3. Upload to UploadThing
    const formData = new FormData()
    formData.append('file', file)

    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/uploadthing`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'x-uploadthing-api-key': process.env.UPLOADTHING_SECRET!,
        }
      }
    )

    const uploadData = await uploadResponse.json()

    // Returns CDN URL
    return uploadData.url
  }
})
```

### 4.4 CDN URLs

All uploaded images are automatically served via CDN:

```
https://utfs.io/f/abc123def456.jpg
```

**Benefits:**
- Global edge caching
- Fast delivery (sub-100ms)
- Automatic image optimization
- No bandwidth costs from origin

---

## 5. Replicate AI Image Generation

### 5.1 Overview

**Purpose:** Generate marketing images using AI models.

**Base URL:** `https://api.replicate.com/v1`

**Authentication:** `Authorization: Bearer $REPLICATE_API_TOKEN`

**Documentation:** https://replicate.com/docs

**Pricing:** Per-generation (varies by model)

### 5.2 Models Used

| Model | ID | Credits | Use Case |
|-------|----|---------| ---------|
| Seedream 4.5 | `bytedance/seedream-4.5` | 1.5 | Premium, multi-image input, 2K-4K |
| Seedream 4 | `bytedance/seedream-4` | 1.0 | Mid-tier, up to 2048px |
| Qwen | `qwen/qwen-image-2512` | 0.5 | Budget, basic quality |

### 5.3 Generation Flow

**Step 1: Create Prediction (Async)**

```typescript
// convex/actions/generateImage.ts
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: "bytedance/seedream-4.5:...", // Model version hash
    input: {
      prompt: "coffee mug on wooden table, lifestyle photography, warm lighting",
      image_input: [
        "https://cdn.uploadthing.com/product-image-1.jpg",
        "https://cdn.uploadthing.com/product-image-2.jpg"
      ],
      size: "2K",
      aspect_ratio: "1:1"
    }
  })
})

const prediction = await response.json()
// { id: "abc123", status: "starting" }
```

**Step 2: Poll for Completion**

```typescript
let predictionStatus = prediction
while (predictionStatus.status !== 'succeeded' && predictionStatus.status !== 'failed') {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second

  const statusResponse = await fetch(
    `https://api.replicate.com/v1/predictions/${prediction.id}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      }
    }
  )

  predictionStatus = await statusResponse.json()
}

if (predictionStatus.status === 'succeeded') {
  const outputUrls = predictionStatus.output // Array of image URLs
  // outputUrls[0] = "https://replicate.delivery/..."
}
```

**Step 3: Upload to UploadThing**

```typescript
// Download from Replicate, upload to UploadThing
const cdnUrl = await ctx.runAction(internal.actions.uploadImageToUploadThing, {
  imageUrl: outputUrls[0],
  fileName: `generated-${Date.now()}.jpg`
})

// Update Convex record
await ctx.db.patch(generatedImageId, {
  status: "ready",
  imageUrl: cdnUrl,
  completedAt: Date.now()
})
```

### 5.4 Model-Specific Parameters

**Seedream 4.5:**
```json
{
  "prompt": "string",
  "image_input": ["url1", "url2"],  // 1-14 images
  "size": "2K" | "4K" | "custom",
  "width": 2048,  // if size=custom
  "height": 2048,
  "aspect_ratio": "1:1" | "16:9" | "match_input_image",
  "sequential_image_generation": "disabled" | "auto",
  "max_images": 1  // if sequential=auto
}
```

**Seedream 4:**
```json
{
  "prompt": "string",
  "aspect_ratio": "1:1" | "16:9" | "9:16" | "custom",
  "size": "small" | "regular" | "big",
  "width": 2048,  // if aspect_ratio=custom
  "height": 2048,
  "guidance_scale": 2.5,  // 1-10, higher = more literal
  "seed": 12345  // for reproducibility
}
```

**Qwen:**
```json
{
  "prompt": "string",
  "image": "url",  // single reference image (optional)
  "aspect_ratio": "1:1" | "16:9" | "9:16" | "custom",
  "width": 1024,
  "height": 1024,
  "strength": 0.8,  // image2image strength (0-1)
  "guidance": 4,  // 0-10
  "num_inference_steps": 40,  // 20-50
  "negative_prompt": "blurry, low quality",
  "output_format": "webp" | "jpg" | "png",
  "output_quality": 95  // 0-100
}
```

### 5.5 Error Handling

**Timeout:**
- Max wait time: 5 minutes
- If timeout, mark as failed, refund credits

**Model Errors:**
- NSFW filter triggered → refund credits
- Out of memory → refund credits, suggest lower resolution
- Invalid input → refund credits, show error to user

**Retry Logic:**
- Retry once after 5-second backoff
- If second attempt fails → refund credits

---

## 6. OpenRouter AI Caption Generation

### 6.1 Overview

**Purpose:** Generate brand-voice-aligned caption suggestions.

**Base URL:** `https://openrouter.ai/api/v1`

**Authentication:** `Authorization: Bearer $OPENROUTER_API_KEY`

**Model Used:** `openai/gpt-3.5-turbo` or `meta-llama/llama-3-8b` (cheap options)

**Documentation:** https://openrouter.ai/docs

**Pricing:** ~$0.0001 per request (extremely cheap)

### 6.2 Caption Rewrite Request

**Input:**
- User's draft caption
- Brand voice (from brand profile)
- Target audience (from brand profile)

**Prompt Template:**
```
You are a social media copywriter. Rewrite the following caption to match the brand voice and appeal to the target audience.

Brand Voice: {brandVoice}
Target Audience: {targetAudience}
Original Caption: {userCaption}

Provide 3 alternative rewrites that:
1. Match the brand voice exactly
2. Appeal to the target audience
3. Are concise and engaging
4. Stay under 2200 characters

Return only the 3 rewrites, numbered 1-3.
```

**API Call:**
```typescript
// convex/actions/generateCaptions.ts
export const suggestCaptions = action({
  args: {
    userCaption: v.string(),
    brandId: v.id("brands"),
  },
  handler: async (ctx, args) => {
    // 1. Get brand profile
    const brand = await ctx.runQuery(internal.brands.get, {
      brandId: args.brandId
    })

    // 2. Call OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `You are a social media copywriter. Rewrite the following caption to match the brand voice and appeal to the target audience.

Brand Voice: ${brand.brandVoice}
Target Audience: ${brand.targetAudience}
Original Caption: ${args.userCaption}

Provide 3 alternative rewrites that:
1. Match the brand voice exactly
2. Appeal to the target audience
3. Are concise and engaging
4. Stay under 2200 characters

Return only the 3 rewrites, numbered 1-3.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })
    })

    const data = await response.json()
    const suggestions = data.choices[0].message.content

    // 3. Parse suggestions (split by line breaks)
    const lines = suggestions.split('\n').filter(line => line.trim())

    return lines.slice(0, 3) // Return first 3 suggestions
  }
})
```

**Response Example:**
```
1. Just dropped our new Ethiopian single-origin blend! Rich notes of blueberry and dark chocolate — perfect for your morning ritual. ☕✨

2. New arrival alert! Our Ethiopian blend brings smooth, fruity vibes with hints of dark chocolate. Elevate your morning routine. Link in bio.

3. Meet our latest single-origin: Ethiopian blend with blueberry + dark chocolate notes. Your mornings just got an upgrade. Shop now!
```

**Display to User:**
- Show 3 suggestions below caption textarea
- User clicks one to replace their caption
- Or they ignore and keep typing

**Cost:** ~$0.0001 per request = effectively free

---

## 7. Polar Billing & Subscriptions

### 7.1 Overview

**Purpose:** Handle subscriptions, invoices, and credit top-ups.

**Base URL:** `https://api.polar.sh/v1`

**Authentication:** `Authorization: Bearer $POLAR_ACCESS_TOKEN`

**Documentation:** https://docs.polar.sh

**Pricing:** Per-transaction fee

### 7.2 Setup with Convex

PixelPrism uses the `@convex-dev/polar` component for seamless integration.

**Installation:**
```bash
bunx convex@latest deploy polar
```

**Configuration:**
```typescript
// convex/polar.ts
import { Polar } from "@convex-dev/polar/convex.config"

const polar = new Polar(components.polar, {
  polarAccessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "production", // or "sandbox" for testing
})

export { polar }
```

### 7.3 Subscription Tiers (Polar Products)

**Create Products in Polar Dashboard:**

| Product Name | Price | Credits/Month | Max Brands | Max Accounts |
|--------------|-------|---------------|------------|--------------|
| Starter | $20/month | 50 | 1 | 2 |
| Professional | $30/month | 100 | 2 | 5 |
| Enterprise | $45/month | 300 | 4 | 10 |

**Metadata for Each Product:**
```json
{
  "tier": "professional",
  "credits_per_month": 100,
  "max_brands": 2,
  "max_social_accounts": 5
}
```

### 7.4 Subscription Flow

**1. User Selects Plan:**
```typescript
// Frontend: Redirect to Polar checkout
const checkoutUrl = `https://polar.sh/checkout/${productId}?customer_email=${user.email}`
window.location.href = checkoutUrl
```

**2. Polar Webhook → Convex:**

**Event: `subscription.created`**
```json
{
  "event": "subscription.created",
  "subscription": {
    "id": "sub_123",
    "customer_id": "cus_456",
    "product_id": "prod_789",
    "metadata": {
      "tier": "professional",
      "credits_per_month": 100,
      "max_brands": 2,
      "max_social_accounts": 5
    },
    "status": "active",
    "current_period_start": "2026-02-16T00:00:00Z",
    "current_period_end": "2026-03-16T00:00:00Z"
  }
}
```

**Handler:**
```typescript
// convex/polar.ts
polar.registerRoutes(http) // Automatically handles webhooks

// Custom subscription created handler
export const onSubscriptionCreated = internalMutation({
  args: { subscription: v.any() },
  handler: async (ctx, { subscription }) => {
    // 1. Find user by customer_id (stored in user.polarCustomerId)
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("polarCustomerId"), subscription.customer_id))
      .unique()

    if (!user) throw new Error("User not found")

    // 2. Create subscription record
    await ctx.db.insert("subscriptions", {
      userId: user._id,
      polarSubscriptionId: subscription.id,
      polarCustomerId: subscription.customer_id,
      tier: subscription.metadata.tier,
      status: "active",
      pricePerMonth: subscription.price / 100, // cents to dollars
      currency: "USD",
      currentPeriodStart: Date.parse(subscription.current_period_start),
      currentPeriodEnd: Date.parse(subscription.current_period_end),
      renewalDate: Date.parse(subscription.current_period_end),
      cancelAtPeriodEnd: false,
      createdAt: Date.now(),
    })

    // 3. Update user record
    await ctx.db.patch(user._id, {
      subscriptionTier: subscription.metadata.tier,
      monthlyCreditsAllocation: subscription.metadata.credits_per_month,
      monthlyCreditsRemaining: subscription.metadata.credits_per_month,
      subscriptionRenewalDate: Date.parse(subscription.current_period_end),
      maxBrands: subscription.metadata.max_brands,
      maxSocialAccounts: subscription.metadata.max_social_accounts,
    })

    // 4. Create credit transaction
    await ctx.db.insert("creditTransactions", {
      userId: user._id,
      type: "renewal",
      amount: subscription.metadata.credits_per_month,
      balanceBefore: { monthly: 0, topUp: user.topUpCreditsRemaining },
      balanceAfter: {
        monthly: subscription.metadata.credits_per_month,
        topUp: user.topUpCreditsRemaining
      },
      description: `Monthly credit allocation (${subscription.metadata.tier} plan)`,
      createdAt: Date.now(),
    })
  }
})
```

**3. Monthly Renewal:**

**Event: `subscription.renewed`**
- Reset `users.monthlyCreditsRemaining` to `monthlyCreditsAllocation`
- Create credit transaction (type: "renewal")
- Update `subscriptionRenewalDate` to next period end

**4. Cancellation:**

**Event: `subscription.canceled`**
- Set `subscriptions.cancelAtPeriodEnd: true`
- User keeps access until `currentPeriodEnd`
- On period end: Set tier to "none", zero out limits

### 7.5 Credit Top-Ups

**Create One-Time Payment Product:**

In Polar Dashboard, create "Credit Pack" products:
- 50 Credits - $10
- 100 Credits - $18 (10% discount)
- 200 Credits - $32 (20% discount)

**Flow:**
1. User clicks "Buy Credits" → Select pack size
2. Redirect to Polar checkout with metadata:
   ```json
   {
     "type": "credit_top_up",
     "credits": 50,
     "user_id": "user_abc"
   }
   ```
3. Polar webhook `payment.completed` → Convex
4. Create `creditTopUps` record
5. Add to `users.topUpCreditsRemaining`

---

## 8. Webhook Security

### 8.1 Signature Verification

All webhook handlers MUST verify signatures to prevent spoofing.

**Clerk (uses Svix):**
```typescript
import { Webhook } from 'svix'

const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
const evt = wh.verify(payload, headers) // Throws if invalid
```

**PostForMe (custom signature):**
```typescript
import crypto from 'crypto'

function verifyPostForMeSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.POSTFORME_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

**Polar (uses Polar SDK):**
```typescript
// @convex-dev/polar handles signature verification automatically
polar.registerRoutes(http)
```

### 8.2 Idempotency

Webhooks may be delivered multiple times. Use idempotency keys to prevent duplicate processing.

**Pattern:**
```typescript
// Check if webhook already processed
const existingWebhook = await ctx.db
  .query("webhookLogs")
  .withIndex("by_event_id", (q) => q.eq("eventId", event.id))
  .unique()

if (existingWebhook) {
  // Already processed, return success
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}

// Process webhook
// ...

// Log webhook
await ctx.db.insert("webhookLogs", {
  eventId: event.id,
  eventType: event.type,
  processedAt: Date.now(),
})
```

### 8.3 Webhook Retry Logic

If webhook handler fails (returns non-2xx), services will retry:

| Service | Retry Schedule | Max Attempts |
|---------|----------------|--------------|
| Clerk (Svix) | Exponential backoff | ~5 attempts over 3 days |
| PostForMe | Exponential backoff | ~3 attempts over 1 day |
| Polar | Exponential backoff | ~5 attempts over 2 days |

**Best Practices:**
- Return 200 as soon as possible (even if async processing)
- Use Convex mutations for data updates (atomic)
- Log all webhook attempts for debugging
- Alert on repeated failures

---

## Next Steps

Review the following documents for implementation details:

1. [03-data-flows.md](./03-data-flows.md) - Detailed process flows
2. [04-credit-system.md](./04-credit-system.md) - Credit mechanics
3. [05-error-handling.md](./05-error-handling.md) - Error handling patterns

---

**Document Status:** Complete ✅
**Integrations Covered:** 6
**API Endpoints Documented:** 20+
