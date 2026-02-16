# PixelPrism System Architecture Overview

**Version:** 1.0
**Last Updated:** 2026-02-16
**Status:** Design Phase

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Key Architectural Decisions](#4-key-architectural-decisions)
5. [User Flow Overview](#5-user-flow-overview)
6. [Development Environment](#6-development-environment)

---

## 1. System Overview

### 1.1 What is PixelPrism?

**PixelPrism** is a social media marketing platform designed specifically for small and medium-sized businesses (SMBs). It combines AI-powered content generation with multi-platform social media management to help SMBs create professional marketing content and manage their social presence efficiently.

### 1.2 Core Features (v1)

1. **Multi-Brand Management** - Users can manage multiple brands under one account (tier-dependent)
2. **AI Image Generation** - Generate marketing images using AI models with product references
3. **Social Media Scheduling** - Schedule posts across Instagram, Twitter/X, and Facebook
4. **Performance Analytics** - Track follower growth, engagement, and content performance
5. **Credit-Based System** - Pay-per-generation model with monthly credit allocations
6. **AI Caption Assistance** - Get brand-voice-aligned caption suggestions

### 1.3 Target Users

- **Primary:** Small business owners (1-10 employees)
- **Secondary:** Solo entrepreneurs, freelancers, small agencies
- **Use Cases:** Product marketing, brand awareness, social media content creation

### 1.4 Deferred Features (Post-v1)

- **Logos Full AI Assistant** - Advanced AI report generation and insights (v1 only includes analytics insights)
- **Team Collaboration** - Multi-user access per account (v1 is single-owner only)
- **Additional Platforms** - TikTok, LinkedIn, YouTube, Threads, Pinterest, Bluesky (PostForMe supports them, we'll add later)
- **Advanced Scheduling** - Recurring posts, content calendars with templates
- **Custom AI Models** - User-uploaded fine-tuned models

---

## 2. Tech Stack

### 2.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.x | React framework with App Router |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling (CSS-based config, no JS config) |
| **shadcn/ui** | Latest | Base UI components (radix-lyra style) |
| **Radix UI** | Latest | Headless UI primitives |
| **Hugeicons** | Latest | Icon library |
| **Recharts** | 2.15.4 | Data visualization |
| **Sonner** | Latest | Toast notifications |
| **Bun** | Latest | Package manager & runtime |

**Key Frontend Patterns:**
- Server Components by default
- Client Components only when needed (interactivity, hooks)
- Server Actions for mutations
- Parallel routes for modals
- Loading and error boundaries

### 2.2 Backend & Infrastructure

| Service | Purpose | Why This Choice |
|---------|---------|-----------------|
| **Convex** | Database, backend, real-time sync | TypeScript-native, real-time, serverless, Clerk integration |
| **Clerk** | Authentication, user management | Enterprise auth, metadata support, Next.js integration |
| **Polar** | Billing, subscriptions, invoices | Simpler than Stripe, SaaS-focused |
| **PostForMe.dev** | Social media OAuth, posting, analytics | Handles all platform integrations, saves months of dev work |
| **UploadThing** | Image storage | Faster than Convex files, built-in CDN |
| **Replicate** | AI image generation | Seedream and Qwen models, reliable API |
| **OpenRouter** | AI caption generation | Cheap access to GPT OSS 20B |
| **Vercel** | Hosting | Next.js platform, edge functions |

### 2.3 AI Models

| Tier | Model | Cost | Resolution | Use Case |
|------|-------|------|------------|----------|
| **Premium** | `bytedance/seedream-4.5` | 1.5 credits | 2K-4K (1024-4096px) | Multi-image input, highest quality, sequential generation |
| **Mid** | `bytedance/seedream-4` | 1 credit | Regular-Big (512-2048px) | Standard quality, single output |
| **Standard** | `qwen/qwen-image-2512` | 0.5 credits | 256-2048px | Budget option, image2image support |

**Caption Generation:**
- **Model:** GPT OSS 20B via OpenRouter
- **Cost:** Free to users (platform absorbs cost)
- **Input:** User's draft caption + brand voice + target audience
- **Output:** 2-3 rewrite suggestions

---

## 3. System Architecture

### 3.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                       CLIENT (Browser)                               │
│                                                                       │
│  Next.js 16 App Router + React 19 + Tailwind CSS v4 + shadcn/ui    │
│  - Server Components (default)                                       │
│  - Client Components (when needed)                                   │
│  - Server Actions (mutations)                                        │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 │ HTTPS
                 │
    ┌────────────▼──────────────┐
    │   Clerk Authentication    │
    │                           │
    │  - OAuth (Google, Email)  │
    │  - User Management        │
    │  - Public Metadata        │
    │  - Session Tokens         │
    └────────────┬──────────────┘
                 │
                 │ Auth Token
                 │
    ┌────────────▼──────────────────────────────────────────────────┐
    │                    Convex Backend                              │
    │                                                                │
    │  - TypeScript Database (queries, mutations, actions)          │
    │  - Real-time Subscriptions                                    │
    │  - HTTP Endpoints (webhooks from Polar, PostForMe)            │
    │  - File Storage (metadata only, images on UploadThing)        │
    │  - Scheduled Functions (analytics sync, credit resets)        │
    └────────────┬─────────────────────────────────────────────────┘
                 │
                 │
    ┌────────────┴─────────────┬─────────────┬──────────────┬─────────────┐
    │                          │             │              │             │
    │                          │             │              │             │
┌───▼────────┐    ┌───────────▼──────┐  ┌──▼──────────┐  ┌▼──────────┐  ┌▼────────────┐
│ PostForMe  │    │  UploadThing     │  │  Replicate  │  │OpenRouter │  │   Polar     │
│            │    │  + CDN           │  │  API        │  │           │  │   Billing   │
│ - OAuth    │    │                  │  │             │  │ GPT OSS   │  │             │
│ - Posting  │    │ - Image Upload   │  │ - Seedream  │  │ 20B       │  │ - Subs      │
│ - Analytics│    │ - CDN Delivery   │  │ - Qwen      │  │           │  │ - Invoices  │
│ - Webhooks │    │ - Fast Access    │  │             │  │ (Captions)│  │ - Webhooks  │
└────────────┘    └──────────────────┘  └─────────────┘  └───────────┘  └─────────────┘
     │
     │ Platforms
     │
┌────▼──────────────────────────────┐
│  Instagram │ Twitter/X │ Facebook │
└───────────────────────────────────┘
```

### 3.2 Data Flow Layers

**Layer 1: Presentation (Next.js)**
- UI rendering (Server + Client Components)
- Form handling
- Route management
- Real-time UI updates via Convex subscriptions

**Layer 2: Application Logic (Convex)**
- Business rules
- Data validation
- Query optimization
- Real-time sync
- Scheduled jobs

**Layer 3: External Services**
- Authentication (Clerk)
- Social media (PostForMe)
- AI generation (Replicate, OpenRouter)
- Storage (UploadThing)
- Billing (Polar)

**Layer 4: Platforms**
- Instagram, Twitter/X, Facebook (via PostForMe)

### 3.3 Request Flow Example: Generate Image

```
1. User clicks "Generate" in Studio
   ↓
2. Next.js Client Component → Server Action (Convex mutation)
   ↓
3. Convex Mutation:
   - Validate user has enough credits
   - Deduct credits (monthly first, then top-up)
   - Create GeneratedImage record (status: "generating")
   - Call Convex Action (async)
   ↓
4. Convex Action:
   - Fetch product reference images (if product-based)
   - Build prompt with style preset
   - Call Replicate API (seedream-4.5/4 or qwen)
   - Poll for completion
   ↓
5. Replicate returns image URL(s)
   ↓
6. Convex Action:
   - Download image from Replicate
   - Upload to UploadThing → get CDN URL
   - Update GeneratedImage record (status: "ready", url: CDN_URL)
   ↓
7. Convex real-time subscription updates UI
   ↓
8. User sees generated image instantly
```

### 3.4 Webhook Flow Example: Post Published

```
1. PostForMe publishes scheduled post to Instagram
   ↓
2. PostForMe sends webhook to Convex HTTP endpoint
   POST /postforme-webhook
   {
     "event": "post.published",
     "post_id": "pfm_123",
     "platform": "instagram",
     "platform_post_url": "https://instagram.com/p/abc123",
     "published_at": "2026-02-16T10:00:00Z"
   }
   ↓
3. Convex HTTP handler:
   - Verify webhook signature
   - Find ScheduledPost by postForMePostId
   - Update status to "published"
   - Add platform result (URL, timestamp)
   ↓
4. Real-time subscription updates UI
   ↓
5. User sees post marked as "Published" with link
```

---

## 4. Key Architectural Decisions

### 4.1 Database: Convex vs Alternatives

**Decision:** Use Convex for all backend logic and data storage.

**Why Not Alternatives:**

| Alternative | Why Not |
|-------------|---------|
| **PostgreSQL (Supabase/Neon)** | Requires separate real-time layer, no built-in TypeScript, manual auth integration |
| **Firebase** | Vendor lock-in, less TypeScript support, pricing unpredictable at scale |
| **MongoDB** | No real-time, need separate backend for logic, less type-safe |
| **Prisma + tRPC** | More boilerplate, need to manage server separately, no built-in real-time |

**Convex Advantages:**
- TypeScript-native (queries/mutations are fully typed)
- Built-in real-time subscriptions (no WebSocket management)
- Serverless (no server management)
- Clerk integration out-of-the-box
- HTTP endpoints for webhooks
- Scheduled functions for cron jobs

### 4.2 Social Media: PostForMe vs Building In-House

**Decision:** Use PostForMe.dev for all social media integrations.

**Why Not Build In-House:**

Building OAuth and posting for Instagram, Twitter, Facebook would require:
- Individual app registration on each platform (3+ months per platform)
- OAuth flow implementation and token management
- Platform-specific API compliance (rate limits, content policies)
- Webhook management for each platform
- Analytics data normalization
- Ongoing maintenance as APIs change

**PostForMe saves:**
- ~6-12 months of development time
- $50k-$150k in engineering costs
- Ongoing platform API maintenance
- OAuth certification hassle

**PostForMe provides:**
- Managed OAuth (they handle tokens)
- Unified API for all platforms
- Analytics aggregation
- Webhooks for post status
- $10/month base + per-post pricing (predictable)

### 4.3 Image Storage: UploadThing + CDN vs Convex Files

**Decision:** Use UploadThing for image storage with built-in CDN.

**Why Not Convex Files:**
- Convex file storage is slower (no edge caching)
- No built-in CDN
- Need to manage file lifecycle manually
- Bandwidth costs higher for frequent access

**UploadThing Advantages:**
- Built-in CDN (fast delivery globally)
- Optimized for Next.js (easy integration)
- Automatic image optimization
- Presigned upload URLs (client-side upload)
- Better performance for generated images

**Usage Pattern:**
- Generated images: UploadThing → CDN URL → store in Convex
- Product reference images: UploadThing → CDN URL → store in Convex
- Brand logos: UploadThing → CDN URL → store in Convex

### 4.4 AI Models: Replicate vs OpenAI DALL-E

**Decision:** Use Replicate with Seedream and Qwen models.

**Why Not OpenAI DALL-E:**
- No multimodal support (can't use product images as references)
- More expensive per generation
- Less control over output quality tiers
- No image-to-image editing

**Replicate Advantages:**
- Multimodal models (Seedream supports 1-14 reference images)
- Tiered pricing (Qwen cheap, Seedream premium)
- Image-to-image editing
- Sequential generation (multiple related images)
- Reliable infrastructure

### 4.5 Single Owner vs Team Collaboration (v1)

**Decision:** Single owner per account for v1.

**Why Not Team Features:**
- Adds complexity: roles, permissions, invites, seat management
- Increases billing complexity (per-seat pricing)
- SMB solo operators don't need it initially
- Can add in v2 once core features proven

**v1 Simplification:**
- One user owns the account
- One subscription per user
- All brands belong to that user
- Simpler onboarding
- Faster development

**v2 Plan:**
- Add workspace concept
- Multiple users per workspace
- Role-based access (Owner, Admin, Editor, Viewer)
- Seat-based pricing

---

## 5. User Flow Overview

### 5.1 First-Time User Journey

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Sign Up (Clerk)                                          │
│    - Email/password or Google OAuth                         │
│    - Clerk creates user account                             │
│    - publicMetadata.onboardingComplete = false              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Middleware Redirect → /onboarding                        │
│    - Checks sessionClaims.metadata.onboardingComplete       │
│    - Redirects new users to onboarding flow                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Onboarding: Create First Brand                          │
│    - Brand name                                             │
│    - Brand description                                      │
│    - Industry/category                                      │
│    - Target audience                                        │
│    - Brand voice/tone                                       │
│    - Brand mission/values                                   │
│    - Upload brand logo                                      │
│    - Select timezone                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Create Brand in Convex + Update Clerk Metadata          │
│    - Convex: Insert into brands table                       │
│    - Clerk: Update publicMetadata.onboardingComplete = true │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Select Subscription Tier (Polar)                        │
│    - Starter ($20/month, 50 credits, 1 brand, 2 accounts)  │
│    - Professional ($30/month, 100 credits, 2 brands, 5)    │
│    - Enterprise ($45/month, 300 credits, 4 brands, 10)     │
│    - Redirect to Polar checkout                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Polar Webhook → Convex                                  │
│    - Create subscription record                             │
│    - Allocate monthly credits                               │
│    - Set renewal date                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Redirect to Dashboard                                   │
│    - User sees brand dashboard                              │
│    - Prompt to connect social accounts or create products   │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Core User Workflows

**A. Generate Marketing Image**

```
Dashboard → Studio → [Select Product or Freeform]
  ↓
Enter prompt + Select style preset
  ↓
Choose quality tier (Std/Mid/Premium)
  ↓
Select aspect ratio + quantity
  ↓
Click "GENERATE" → Deduct credits
  ↓
API call to Replicate → Poll for completion
  ↓
Upload to UploadThing → Get CDN URL
  ↓
Save to Convex → Status: "ready"
  ↓
User sees images in gallery
```

**B. Schedule Social Media Post**

```
Studio → Click generated image → "Schedule Post"
  OR
Scheduling → "+ NEW POST" → Choose from Studio
  ↓
Upload/select image
  ↓
Write caption (get AI suggestions from OpenRouter)
  ↓
Select platforms (Instagram, Twitter/X, Facebook)
  ↓
Choose date/time (timezone-aware)
  ↓
Click "SCHEDULE" or "SAVE DRAFT"
  ↓
If SCHEDULE: Call PostForMe API
  ↓
PostForMe returns post ID
  ↓
Save to Convex with postForMePostId
  ↓
PostForMe publishes at scheduled time → Webhook to Convex
  ↓
Status updated to "published"
```

**C. View Analytics**

```
Dashboard → Analytics
  ↓
Check cache (last sync timestamp)
  ↓
If cache stale (>6 hours) OR manual refresh:
  ↓
Call PostForMe Analytics API
  ↓
Fetch follower counts, engagement, top posts
  ↓
Cache in Convex (aggregated data)
  ↓
Display charts + stats
  ↓
Generate AI insights (OpenRouter + brand context)
  ↓
Show Logos Analysis section
```

---

## 6. Development Environment

### 6.1 Required Environment Variables

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/onboarding

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
CONVEX_DEPLOY_KEY=... (for CI/CD)

# PostForMe Social Media API
POSTFORME_API_KEY=pfm_...
POSTFORME_WEBHOOK_SECRET=whsec_...

# UploadThing Image Storage
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# Replicate AI Image Generation
REPLICATE_API_TOKEN=r8_...

# OpenRouter AI Caption Generation
OPENROUTER_API_KEY=sk-or-...

# Polar Billing
POLAR_ACCESS_TOKEN=polar_at_...
POLAR_WEBHOOK_SECRET=whsec_...
```

### 6.2 Local Development Setup

```bash
# 1. Install dependencies
bun install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in all API keys

# 3. Start Convex development server
bunx convex dev

# 4. Start Next.js development server
bun run dev

# 5. Open browser
open http://localhost:3000
```

### 6.3 Project Structure

```
PixelPrismV3/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth routes (sign-in, sign-up)
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── [brandSlug]/        # Brand-specific routes
│   │   │   ├── analytics/
│   │   │   ├── logos/
│   │   │   ├── products/
│   │   │   ├── scheduling/
│   │   │   └── studio/
│   │   ├── billing/
│   │   └── brands/
│   ├── design-ref/              # Design system reference (dev only)
│   ├── design-system-2/         # DS2 showcase (dev only)
│   ├── onboarding/              # New user onboarding flow
│   ├── globals.css              # Global styles + Tailwind imports
│   ├── layout.tsx               # Root layout (ClerkProvider, ConvexProvider)
│   └── page.tsx                 # Landing page
├── components/
│   ├── ds2/                     # Custom DS2 components
│   └── ui/                      # shadcn/ui base components
├── convex/                      # Convex backend
│   ├── _generated/              # Auto-generated types
│   ├── http.ts                  # HTTP endpoints (webhooks)
│   ├── schema.ts                # Database schema
│   ├── users.ts                 # User queries/mutations
│   ├── brands.ts                # Brand logic
│   ├── products.ts              # Product management
│   ├── images.ts                # Image generation
│   ├── posts.ts                 # Post scheduling
│   ├── analytics.ts             # Analytics sync
│   ├── credits.ts               # Credit system
│   └── polar.ts                 # Polar billing integration
├── docs/
│   ├── architecture/            # This documentation
│   ├── vibe-spec.md            # Design system spec
│   └── plans/                   # Implementation plans
├── lib/
│   ├── convex-provider.tsx      # Convex client setup
│   ├── utils.ts                 # Utility functions
│   └── mock-data.ts             # Mock data (remove in production)
├── public/
│   └── fonts/                   # Custom fonts (Neue Montreal, General Sans, JetBrains Mono)
├── styles/
│   └── ds2-theme.css            # DS2 design system CSS
├── types/
│   └── dashboard.ts             # TypeScript type definitions
├── middleware.ts                # Next.js middleware (auth + onboarding redirect)
├── components.json              # shadcn/ui config
├── package.json
├── tsconfig.json
└── .env.local                   # Environment variables (not committed)
```

---

## 7. Performance Considerations

### 7.1 Image Optimization

- **UploadThing CDN** handles automatic optimization
- Images served from edge locations (low latency)
- Lazy loading for image galleries
- Thumbnail generation for preview grids

### 7.2 Analytics Caching

- Cache PostForMe analytics data in Convex for 6 hours
- Reduce API calls to PostForMe (cost savings)
- Manual refresh button for real-time data
- Background sync every 6 hours via Convex scheduled function

### 7.3 Real-time Updates

- Convex subscriptions for instant UI updates
- No polling required
- Efficient: only changed data sent over WebSocket
- Automatic reconnection on network issues

### 7.4 Server Components

- Most components are Server Components (no JS sent to client)
- Client Components only for interactivity
- Reduces bundle size
- Faster initial page load

---

## 8. Security Considerations

### 8.1 Authentication

- Clerk handles all auth (OAuth, session management)
- JWT tokens for API authentication
- HTTPS only (enforced by Vercel)
- Middleware protects all dashboard routes

### 8.2 API Keys

- All API keys stored in environment variables (never in code)
- Convex backend makes external API calls (keys never exposed to client)
- Webhook signatures verified for PostForMe and Polar

### 8.3 Data Access

- Convex queries automatically filter by userId (via Clerk auth context)
- Users can only access their own brands/data
- No direct database access from client

### 8.4 Image Uploads

- UploadThing handles file validation
- Max file size enforced
- Content-type verification
- Malware scanning (UploadThing feature)

---

## Next Steps

1. Review this overview document
2. Proceed to [01-database-schema.md](./01-database-schema.md) for complete Convex schema
3. Review [02-integrations.md](./02-integrations.md) for third-party API specifications
4. See [03-data-flows.md](./03-data-flows.md) for detailed process flows
5. Check [04-credit-system.md](./04-credit-system.md) for credit mechanics
6. Review [05-error-handling.md](./05-error-handling.md) for edge cases

---

**Document Status:** Complete ✅
**Ready for Developer Handoff:** Yes
**Estimated Reading Time:** 20 minutes
