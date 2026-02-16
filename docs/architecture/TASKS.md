# PixelPrism Implementation Task List

**Version:** 1.0
**Last Updated:** 2026-02-16
**Purpose:** Bite-sized, phase-wise implementation tasks with clear test cases

---

## 📋 How to Use This Document

- ✅ Check off tasks as you complete them
- 🔴 Current focus - work on these next
- Each task has a **Test Case** to verify completion
- Tasks are ordered by dependency - do them in sequence within each phase
- Estimated time per task: 30-90 minutes

---

## PHASE 1: Foundation & Environment Setup 🏗️

**Goal:** Get the development environment running with all required services

### Task 1.1: Set Up Environment Variables
- [ ] Create `.env.local` file in project root
- [ ] Add placeholder values for all required keys:
  - Clerk (3 keys)
  - Convex (1 key)
  - PostForMe (2 keys)
  - UploadThing (2 keys)
  - Replicate (1 key)
  - OpenRouter (1 key)
  - Polar (2 keys)

**Test Case:**
```bash
# Verify all required env vars are present
grep -E "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY|CLERK_SECRET_KEY|CLERK_WEBHOOK_SECRET|NEXT_PUBLIC_CONVEX_URL|POSTFORME_API_KEY|POSTFORME_WEBHOOK_SECRET|UPLOADTHING_SECRET|UPLOADTHING_APP_ID|REPLICATE_API_TOKEN|OPENROUTER_API_KEY|POLAR_ACCESS_TOKEN|POLAR_WEBHOOK_SECRET" .env.local
```
✅ **Done When:** All 12 environment variables are in `.env.local` (even if placeholder values)

---

### Task 1.2: Install Dependencies
- [ ] Run `bun install` to install all packages
- [ ] Verify no peer dependency warnings

**Test Case:**
```bash
bun install
# Should complete without errors
# Verify key packages:
bun pm ls | grep -E "convex|@clerk/nextjs|uploadthing|recharts"
```
✅ **Done When:** All packages install successfully, dev server can start with `bun run dev`

---

### Task 1.3: Initialize Convex Project
- [ ] Run `bunx convex dev` to initialize Convex
- [ ] Copy the generated `NEXT_PUBLIC_CONVEX_URL` to `.env.local`
- [ ] Verify Convex dashboard is accessible

**Test Case:**
```bash
bunx convex dev
# Open https://dashboard.convex.dev
# Verify project appears in dashboard
```
✅ **Done When:** Convex dev server runs, dashboard shows project, URL in `.env.local`

---

### Task 1.4: Set Up Clerk Account
- [ ] Sign up for Clerk account at https://clerk.com
- [ ] Create new application "PixelPrism"
- [ ] Enable email/password + Google OAuth
- [ ] Copy API keys to `.env.local`

**Test Case:**
1. Visit `http://localhost:3000/sign-in`
2. Verify Clerk sign-in page loads (no errors)
3. Create test account with email
4. Verify redirect to dashboard (even if empty)

✅ **Done When:** Can sign up/sign in via Clerk, redirects work

---

## PHASE 2: Database Schema (Convex) 📊

**Goal:** Define all 13 tables in Convex schema

### Task 2.1: Create Base Schema File
- [ ] Create/update `convex/schema.ts`
- [ ] Import Convex schema utilities (`defineSchema`, `defineTable`, `v`)
- [ ] Set up empty schema structure

**Test Case:**
```typescript
// convex/schema.ts should compile without errors
bunx convex dev
# Check Convex dashboard → Schema tab
```
✅ **Done When:** Empty schema deploys successfully to Convex

---

### Task 2.2: Define Users Table
- [ ] Add `users` table with all fields from `01-database-schema.md` section 2.1
- [ ] Add indexes: `by_clerk_id`, `by_email`, `by_renewal_date`
- [ ] Deploy schema

**Test Case:**
```typescript
// In Convex dashboard → Data tab:
// 1. Manually insert a test user
// 2. Verify all fields are present
// 3. Query by index: by_clerk_id
```
✅ **Done When:** Users table exists with correct fields, indexes work

---

### Task 2.3: Define Brands Table
- [ ] Add `brands` table with all fields (section 3.1)
- [ ] Add indexes: `by_user`, `by_slug`, `by_user_and_slug`

**Test Case:**
```typescript
// Convex dashboard → Data:
// 1. Insert test brand
// 2. Query by user index
// 3. Verify slug index works
```
✅ **Done When:** Brands table complete, all indexes functional

---

### Task 2.4: Define Products & Product Images Tables
- [ ] Add `products` table (section 3.2)
- [ ] Add `productImages` table (section 3.3)
- [ ] Add indexes for both tables

**Test Case:**
```typescript
// Insert test product
// Insert 3 product images (order: 0, 1, 2)
// Query productImages by_product_ordered index
// Verify ordering works
```
✅ **Done When:** Both tables exist, can link product to images

---

### Task 2.5: Define Generated Images Table
- [ ] Add `generatedImages` table (section 4.1)
- [ ] Include all generation parameters, status, credits fields
- [ ] Add indexes: `by_user`, `by_brand`, `by_product`, `by_status`, `by_brand_and_status`

**Test Case:**
```typescript
// Insert test generated image with status: "generating"
// Query by_brand_and_status index
// Update status to "ready"
// Verify query results change
```
✅ **Done When:** GeneratedImages table complete, status filtering works

---

### Task 2.6: Define Social Media Tables
- [ ] Add `socialAccounts` table (section 5.1)
- [ ] Add `scheduledPosts` table (section 5.2)
- [ ] Add indexes for both

**Test Case:**
```typescript
// Insert social account (Instagram)
// Insert scheduled post with status: "draft"
// Query by_brand_and_status
// Verify platform filter works
```
✅ **Done When:** Social tables complete, can link posts to accounts

---

### Task 2.7: Define Analytics Tables
- [ ] Add `analyticsCache` table (section 6.1)
- [ ] Add `followerGrowth` table (section 6.2)
- [ ] Add `topContent` table (section 6.3)
- [ ] Add all required indexes

**Test Case:**
```typescript
// Insert 30 days of followerGrowth data
// Query by_brand_and_date index
// Insert analyticsCache record
// Verify lastSyncedAt field
```
✅ **Done When:** All analytics tables defined, date queries work

---

### Task 2.8: Define Billing Tables
- [ ] Add `subscriptions` table (section 7.1)
- [ ] Add `creditTransactions` table (section 7.2)
- [ ] Add `creditTopUps` table (section 7.3)
- [ ] Add indexes

**Test Case:**
```typescript
// Insert subscription with tier: "professional"
// Insert credit transaction (type: "generation", amount: -1.5)
// Insert credit transaction (type: "refund", amount: +1.5)
// Query by_user_and_date for transaction history
```
✅ **Done When:** Billing tables complete, transaction log queryable

---

### Task 2.9: Add Webhook Logging Table
- [ ] Create `webhookLogs` table for idempotency tracking
- [ ] Fields: `eventId` (string), `eventType` (string), `source` (enum: clerk/postforme/polar), `processedAt` (number)
- [ ] Add index: `by_event_id`

**Test Case:**
```typescript
// Insert webhook log with eventId: "evt_123"
// Try to insert same eventId again
// Query by_event_id to check duplicate
```
✅ **Done When:** Webhook log table exists, can track processed events

---

## PHASE 3: Authentication & User Management 🔐

**Goal:** Implement Clerk auth, user sync, and onboarding

### Task 3.1: Implement Clerk Webhook Handler
- [ ] Create `convex/http.ts` with HTTP router
- [ ] Add `/clerk-webhook` endpoint
- [ ] Implement Svix signature verification
- [ ] Handle `user.created`, `user.updated`, `user.deleted` events

**Test Case:**
1. Trigger webhook from Clerk dashboard (or create user in Clerk)
2. Check Convex logs for webhook receipt
3. Verify user created in `users` table
4. Check `webhookLogs` for idempotency record

✅ **Done When:** Clerk webhooks create/update/delete users in Convex

---

### Task 3.2: Create User Mutations
- [ ] Create `convex/users.ts`
- [ ] Add `create` internal mutation (called by webhook)
- [ ] Add `update` internal mutation
- [ ] Add `current` query (gets user by Clerk ID from auth context)

**Test Case:**
```typescript
// In frontend component:
const user = useQuery(api.users.current)
console.log(user) // Should show current user or null
```
✅ **Done When:** `api.users.current` returns authenticated user

---

### Task 3.3: Set Up Middleware for Auth Redirects
- [ ] Create/update `middleware.ts`
- [ ] Use `clerkMiddleware`
- [ ] Redirect unauthenticated users to `/sign-in`
- [ ] Redirect un-onboarded users to `/onboarding`

**Test Case:**
1. Sign out
2. Try to visit `/dashboard`
3. Should redirect to `/sign-in`
4. Sign in with new account (no brand yet)
5. Should redirect to `/onboarding`

✅ **Done When:** Auth redirects work correctly

---

### Task 3.4: Build Onboarding Flow - Brand Basics
- [ ] Create `app/onboarding/page.tsx`
- [ ] Multi-step form with state management
- [ ] Step 1: Brand name, description, logo upload
- [ ] UploadThing integration for logo

**Test Case:**
1. Go to `/onboarding`
2. Fill in brand name: "Test Coffee Co"
3. Upload logo image (any PNG/JPG)
4. Click "Next"
5. Verify form state persists

✅ **Done When:** Can input brand basics, logo uploads to UploadThing

---

### Task 3.5: Build Onboarding Flow - Brand Identity
- [ ] Step 2 of onboarding form
- [ ] Fields: industry, target audience, brand voice, mission, values
- [ ] Add validation (required fields)

**Test Case:**
1. Fill in all brand identity fields
2. Try submitting with empty required field
3. Should show validation error
4. Fill all required fields
5. Click "Next"

✅ **Done When:** Brand identity step validates and saves state

---

### Task 3.6: Build Onboarding Flow - Settings & Completion
- [ ] Step 3: Timezone selection
- [ ] Server action: `completeOnboarding()`
- [ ] Create brand in Convex
- [ ] Generate slug from brand name
- [ ] Update Clerk `publicMetadata.onboardingComplete = true`
- [ ] Redirect to subscription selection

**Test Case:**
1. Complete all onboarding steps
2. Submit final form
3. Should redirect to subscription page
4. Check Convex `brands` table - brand should exist
5. Try to visit `/onboarding` - should redirect to `/dashboard`
6. Verify `users.onboardingComplete = true`

✅ **Done When:** Onboarding creates brand, updates Clerk, redirects properly

---

## PHASE 4: UploadThing & Product Management 📸

**Goal:** Implement image uploads and product catalog

### Task 4.1: Set Up UploadThing Route
- [ ] Create `app/api/uploadthing/route.ts`
- [ ] Define file router with 3 endpoints:
  - `brandLogo` (max 2MB, 1 file)
  - `productImage` (max 5MB, 3 files)
  - `generatedImage` (max 10MB, 1 file)
- [ ] Add auth middleware to check Clerk user

**Test Case:**
```typescript
// Use UploadThing dashboard to test upload
// Or use UploadButton component in a test page
// Verify files upload and return CDN URLs
```
✅ **Done When:** UploadThing endpoint works, returns CDN URLs

---

### Task 4.2: Create Product Management Mutations
- [ ] Create `convex/products.ts`
- [ ] Add `create` mutation (creates product + first image)
- [ ] Add `update` mutation (updates product details)
- [ ] Add `delete` mutation (soft delete or hard delete)
- [ ] Add `list` query (get all products for brand)

**Test Case:**
```typescript
// Create product: "Summer Cold Brew"
const productId = await createProduct({
  brandId,
  name: "Summer Cold Brew",
  description: "Smooth, refreshing cold brew",
})
// Query list - should include new product
const products = await api.products.list({ brandId })
```
✅ **Done When:** Can CRUD products via Convex mutations

---

### Task 4.3: Create Product Images Management
- [ ] Create `convex/productImages.ts`
- [ ] Add `upload` mutation (creates productImage record)
- [ ] Add `delete` mutation (removes image, reorders remaining)
- [ ] Add `reorder` mutation (changes order field)
- [ ] Add `getByProduct` query (fetches images for product, ordered)

**Test Case:**
```typescript
// Upload 3 images for product (order: 0, 1, 2)
// Query images - should be in order
// Delete image 1
// Query again - should have 2 images (order: 0, 1)
```
✅ **Done When:** Can upload/delete/reorder product images

---

### Task 4.4: Build Product Gallery UI
- [ ] Create `app/dashboard/[brandSlug]/products/page.tsx`
- [ ] Display grid of products
- [ ] "Add Product" button → modal
- [ ] Product card shows name, description, gradient, image count

**Test Case:**
1. Navigate to `/dashboard/test-brand/products`
2. See empty state if no products
3. Click "Add Product"
4. Fill form, upload 2 reference images
5. Submit
6. Product appears in grid

✅ **Done When:** Product gallery displays, can add products via UI

---

### Task 4.5: Build Product Detail/Edit Page
- [ ] Create `app/dashboard/[brandSlug]/products/[id]/page.tsx`
- [ ] Show product details
- [ ] Edit name/description
- [ ] Upload additional images (max 3 total)
- [ ] Delete product

**Test Case:**
1. Click on product card
2. View product detail page
3. Edit name, save
4. Upload 3rd image (if only 2 exist)
5. Try uploading 4th image - should block
6. Delete one image
7. Verify remaining images reorder correctly

✅ **Done When:** Product detail page allows full CRUD

---

## PHASE 5: AI Image Generation (Replicate) 🎨

**Goal:** Implement AI-powered image generation with Replicate

### Task 5.1: Create Replicate Integration Module
- [ ] Create `convex/actions/replicate.ts`
- [ ] Helper function: `createPrediction(model, input)` - calls Replicate API
- [ ] Helper function: `pollPrediction(id, maxWait)` - polls until complete
- [ ] Handle timeout (5 min max)
- [ ] Return output URLs or error

**Test Case:**
```typescript
// Create test action:
const prediction = await createPrediction("qwen/qwen-image-2512", {
  prompt: "coffee mug on table",
  aspect_ratio: "1:1"
})
const result = await pollPrediction(prediction.id, 300000)
console.log(result.output) // Should be array of image URLs
```
✅ **Done When:** Can create prediction and poll for completion

---

### Task 5.2: Create Image Generation Mutations
- [ ] Create `convex/images.ts`
- [ ] Add `create` mutation:
  - Check credits (deduct upfront for all images in batch)
  - Create GeneratedImage records (status: "generating")
  - Create credit transactions
  - Schedule async action for each image
- [ ] Add `markComplete` mutation (update status to "ready", add URL)
- [ ] Add `markFailed` mutation (update status to "failed", set error)

**Test Case:**
```typescript
// Generate 4 premium images (4 × 1.5 = 6 credits)
const imageIds = await api.images.create({
  brandId,
  prompt: "coffee mug",
  qualityTier: "premium",
  quantity: 4
})
// Check user credits deducted
// Check 4 GeneratedImage records with status: "generating"
// Check 4 credit transactions
```
✅ **Done When:** Can create generation batch, credits deducted

---

### Task 5.3: Implement Generation Action
- [ ] Create `convex/actions/generateImage.ts`
- [ ] Fetch product reference images (if product-based)
- [ ] Build full prompt with style modifiers
- [ ] Call Replicate via helper
- [ ] Download image from Replicate URL
- [ ] Upload to UploadThing
- [ ] Call `markComplete` mutation with CDN URL

**Test Case:**
```typescript
// Trigger generation for 1 image
// Wait 1-2 minutes
// Check Convex data - status should change to "ready"
// Verify imageUrl field has UploadThing CDN URL
// Image should be viewable at that URL
```
✅ **Done When:** Generation flow works end-to-end, image stored on CDN

---

### Task 5.4: Implement Error Handling & Refunds
- [ ] Add retry logic (1 retry with 5-second backoff)
- [ ] Handle timeout error (refund credits)
- [ ] Handle NSFW error (refund credits, clear message)
- [ ] Handle OOM error (refund credits, suggest lower resolution)
- [ ] Create `convex/credits.ts` with `refund` mutation

**Test Case:**
1. Manually fail a prediction (edit code to throw error)
2. Verify status becomes "failed"
3. Check credits refunded (user balance increases)
4. Check creditTransactions for refund record (type: "refund")

✅ **Done When:** Errors refund credits automatically, log transactions

---

### Task 5.5: Build Studio UI - Generation Form
- [ ] Create `app/dashboard/[brandSlug]/studio/page.tsx`
- [ ] Form fields:
  - Product selector (optional)
  - Prompt textarea
  - Style preset dropdown
  - Quality tier selector (Standard/Mid/Premium)
  - Aspect ratio selector
  - Quantity input (1-10)
- [ ] Show credit cost calculation: `quantity × tier cost`
- [ ] Disable "Generate" if insufficient credits

**Test Case:**
1. Go to `/dashboard/test-brand/studio`
2. Select product with 2 reference images
3. Enter prompt: "coffee on wooden table"
4. Select Premium quality (1.5 credits)
5. Set quantity: 4
6. See credit cost: "6 credits"
7. If user has <6 credits, button should be disabled
8. Generate images
9. See loading state

✅ **Done When:** Studio form is functional, submits generation request

---

### Task 5.6: Build Studio UI - Image Gallery
- [ ] Display generated images in grid
- [ ] Real-time updates (Convex subscription)
- [ ] Show status badges: Generating / Ready / Failed
- [ ] Click image to expand/preview
- [ ] "Schedule Post" button on each image
- [ ] Filter by status

**Test Case:**
1. Generate 4 images
2. Gallery shows 4 cards with "Generating" status
3. Wait for completion
4. Cards update to "Ready" with images visible (no refresh needed)
5. Click image - modal opens with full-size preview
6. Click "Schedule Post" - opens post modal

✅ **Done When:** Gallery displays images, real-time updates work

---

## PHASE 6: Credit System 💳

**Goal:** Implement credit deduction, renewal, and top-ups

### Task 6.1: Implement Credit Deduction Logic
- [ ] Create `convex/credits.ts`
- [ ] Add `deduct` mutation:
  - Check total available (monthly + topUp)
  - Deduct from monthly first, then topUp
  - Update user balances
  - Create transaction record
  - Return balanceBefore/After

**Test Case:**
```typescript
// User has: monthly=50, topUp=10
// Deduct 5 credits
const result = await api.credits.deduct({ userId, amount: 5 })
// result.balanceAfter should be: { monthly: 45, topUp: 10 }

// Deduct 48 credits
const result2 = await api.credits.deduct({ userId, amount: 48 })
// result2.balanceAfter should be: { monthly: 0, topUp: 8 }
```
✅ **Done When:** Credit deduction follows correct consumption order

---

### Task 6.2: Implement Credit Refund Logic
- [ ] Add `refund` mutation to `credits.ts`
- [ ] Add back to monthly credits first (up to allocation limit)
- [ ] Overflow goes to topUp
- [ ] Create refund transaction record

**Test Case:**
```typescript
// User has: monthly=48, topUp=10 (allocation=100)
// Refund 5 credits
const result = await api.credits.refund({ userId, amount: 5 })
// result.balanceAfter should be: { monthly: 53, topUp: 10 }

// Refund 60 credits
const result2 = await api.credits.refund({ userId, amount: 60 })
// Should cap monthly at 100, rest to topUp
// result2.balanceAfter should be: { monthly: 100, topUp: 23 }
```
✅ **Done When:** Refunds restore credits correctly

---

### Task 6.3: Implement Monthly Credit Reset
- [ ] Create `convex/crons.ts`
- [ ] Add daily cron job (midnight UTC)
- [ ] Add `resetMonthlyCredits` internal mutation
- [ ] Query users where `renewalDate <= now`
- [ ] Reset `monthlyCreditsRemaining` to `allocation`
- [ ] Update `renewalDate` (+30 days)
- [ ] Create renewal transaction

**Test Case:**
```typescript
// Manually set renewalDate to past date
// Run cron manually or wait for midnight
// Check user record:
// - monthlyCreditsRemaining should equal allocation
// - renewalDate should be +30 days
// - creditTransactions should have renewal record
```
✅ **Done When:** Credits reset automatically on renewal date

---

### Task 6.4: Build Billing Page UI
- [ ] Create `app/dashboard/billing/page.tsx`
- [ ] Display credit balance: Monthly + Top-Up
- [ ] Show renewal date
- [ ] "Buy Credits" button (links to Polar checkout - placeholder for now)
- [ ] Transaction history table (paginated)
- [ ] Filter by transaction type

**Test Case:**
1. Go to `/dashboard/billing`
2. See credit balance (e.g., "50 monthly, 10 top-up")
3. See renewal date (e.g., "Renews Feb 16, 2026")
4. Generate image to create transaction
5. Transaction appears in history table
6. Filter by "generation" type

✅ **Done When:** Billing page displays credits and transactions

---

## PHASE 7: Social Media (PostForMe) 📱

**Goal:** Implement social account connection and analytics

### Task 7.1: Create PostForMe OAuth Connection Flow
- [ ] Create `app/dashboard/[brandSlug]/settings/social/page.tsx`
- [ ] "Connect Instagram" button → redirects to PostForMe OAuth URL
- [ ] Create callback route: `app/dashboard/connect-callback/page.tsx`
- [ ] Extract account data from URL params
- [ ] Call mutation to create `socialAccounts` record

**Test Case:**
1. Go to brand settings → Social Accounts
2. Click "Connect Instagram"
3. Redirects to PostForMe (or mock URL if no API key)
4. Simulates callback with URL params:
   `?account_id=sa_test&platform=instagram&username=testuser`
5. Creates social account record
6. Redirects back to settings
7. Account appears in list

✅ **Done When:** OAuth flow creates social account in Convex

---

### Task 7.2: Implement Analytics Sync Action
- [ ] Create `convex/actions/syncAnalytics.ts`
- [ ] Fetch analytics from PostForMe API for each account
- [ ] Update `analyticsCache` table
- [ ] Update `socialAccount.followerCount`
- [ ] Recalculate `brand.totalFollowers`
- [ ] Store daily snapshot in `followerGrowth`

**Test Case:**
```typescript
// Mock PostForMe API response with test data
// Run sync action
// Check analyticsCache - should have new record
// Check socialAccount - followerCount updated
// Check followerGrowth - daily record exists
// Check brand - totalFollowers = sum of all accounts
```
✅ **Done When:** Analytics sync updates all relevant tables

---

### Task 7.3: Build Analytics Page UI
- [ ] Create `app/dashboard/[brandSlug]/analytics/page.tsx`
- [ ] Display total followers (all platforms)
- [ ] Show follower change (+/- and %)
- [ ] Follower growth chart (30 days) using Recharts
- [ ] Engagement rate metric
- [ ] "Refresh" button to manually trigger sync

**Test Case:**
1. Insert 30 days of mock follower data
2. Visit `/dashboard/test-brand/analytics`
3. Chart should display 30-day growth line
4. Stats show current totals
5. Click "Refresh"
6. See loading state
7. Stats update with new data

✅ **Done When:** Analytics page displays metrics and chart

---

### Task 7.4: Create Scheduled Analytics Sync
- [ ] Add cron job to `convex/crons.ts`
- [ ] Runs every 6 hours: `0, 6, 12, 18 UTC`
- [ ] Calls `syncAnalytics` action for all active brands
- [ ] Logs sync attempts

**Test Case:**
```typescript
// Manually trigger cron or wait 6 hours
// Check Convex logs for sync execution
// Check analyticsCache - lastSyncedAt should be recent
// Verify multiple accounts synced in parallel
```
✅ **Done When:** Analytics auto-sync every 6 hours

---

## PHASE 8: Post Scheduling & Publishing 📅

**Goal:** Implement post creation, scheduling, and publishing via PostForMe

### Task 8.1: Create Post Scheduling Mutations
- [ ] Create `convex/posts.ts`
- [ ] Add `createDraft` mutation (creates with status: "draft")
- [ ] Add `schedule` mutation:
  - Validate caption length per platform
  - Call PostForMe API to schedule
  - Store `postForMePostId`
  - Set status: "scheduled"
- [ ] Add `publish` mutation (update status from webhook)

**Test Case:**
```typescript
// Create draft post
const postId = await api.posts.createDraft({
  brandId,
  imageId,
  caption: "Test post",
  selectedPlatforms: ["instagram"]
})
// Draft exists with status: "draft"

// Schedule draft (mocked PostForMe response)
await api.posts.schedule({
  postId,
  scheduledFor: futureTimestamp
})
// Status changes to "scheduled"
// postForMePostId is set
```
✅ **Done When:** Can create and schedule posts via Convex

---

### Task 8.2: Implement PostForMe Webhook Handler
- [ ] Add `/postforme-webhook` endpoint to `convex/http.ts`
- [ ] Verify webhook signature
- [ ] Handle `post.published` event:
  - Find post by `postForMePostId`
  - Update status to "published"
  - Store `platformResults` array
  - Set `publishedAt` timestamp
- [ ] Handle `post.failed` event

**Test Case:**
1. Mock PostForMe webhook payload (post.published)
2. Send to `/postforme-webhook` endpoint
3. Verify signature check works
4. Check post status updated to "published"
5. Check platformResults contains URL and timestamp
6. Check webhookLogs for idempotency

✅ **Done When:** Webhook updates post status on publish

---

### Task 8.3: Implement AI Caption Suggestions (OpenRouter)
- [ ] Create `convex/actions/generateCaptions.ts`
- [ ] Build prompt template with brand voice + target audience
- [ ] Call OpenRouter API (GPT-3.5-turbo)
- [ ] Parse response into 3 suggestions
- [ ] Return array of strings

**Test Case:**
```typescript
// Create brand with:
// - brandVoice: "warm and friendly"
// - targetAudience: "coffee enthusiasts 25-40"

const suggestions = await generateCaptions({
  brandId,
  userCaption: "Check out our new blend"
})

// Should return 3 alternative captions
// Each should be different from original
// Each should reflect brand voice
console.log(suggestions) // Array of 3 strings
```
✅ **Done When:** Returns 3 brand-aligned caption suggestions

---

### Task 8.4: Build Post Creation UI
- [ ] Create modal component: `PostEditorModal`
- [ ] Used in two places:
  - Studio (click "Schedule Post" on image)
  - Scheduling page (click "New Post")
- [ ] Form fields:
  - Image selector (pre-selected or choose from gallery)
  - Caption textarea (with char counter)
  - Platform checkboxes (Instagram, Twitter, Facebook)
  - Date picker
  - Time picker
  - Timezone display
- [ ] Real-time caption suggestions (debounced)
- [ ] Platform-specific validation (Twitter 280 chars)
- [ ] "Save Draft" and "Schedule" buttons

**Test Case:**
1. Open post modal from Studio
2. Image is pre-selected
3. Type caption (15+ chars)
4. Wait 2 seconds - AI suggestions appear
5. Click suggestion to replace caption
6. Select Instagram + Twitter
7. Type 300-char caption - warning shows for Twitter
8. Deselect Twitter - warning disappears
9. Click "Save Draft" - post created with status: "draft"
10. Edit draft, set future date/time, click "Schedule"
11. Status changes to "scheduled"

✅ **Done When:** Post modal creates and schedules posts

---

### Task 8.5: Build Scheduling Calendar UI
- [ ] Create `app/dashboard/[brandSlug]/scheduling/page.tsx`
- [ ] Calendar view (month/week/day)
- [ ] Display scheduled posts on calendar dates
- [ ] Status badges: Draft / Scheduled / Published / Failed
- [ ] Click date to create post for that day
- [ ] Click post to view/edit

**Test Case:**
1. Go to `/dashboard/test-brand/scheduling`
2. See calendar with current month
3. Create 3 posts for different dates
4. Posts appear on calendar
5. Click on a date - modal opens with that date pre-filled
6. Click on a post - modal opens in edit mode
7. Update post, save
8. Calendar updates immediately (real-time)

✅ **Done When:** Scheduling calendar displays and manages posts

---

## PHASE 9: Billing & Subscriptions (Polar) 💰

**Goal:** Implement Polar integration for subscriptions and credit top-ups

### Task 9.1: Install Polar Convex Component
- [ ] Run `bunx convex@latest deploy polar`
- [ ] Create `convex/polar.ts`
- [ ] Initialize Polar component with config
- [ ] Register HTTP routes with `polar.registerRoutes(http)`

**Test Case:**
```typescript
// Check Convex dashboard → HTTP endpoints
// Should see Polar webhook endpoints registered
// Verify polar.ts compiles without errors
```
✅ **Done When:** Polar component installed and configured

---

### Task 9.2: Set Up Subscription Products in Polar
- [ ] Sign up for Polar account
- [ ] Create 3 subscription products:
  - Starter: $20/month (metadata: credits=50, maxBrands=1, maxAccounts=2)
  - Professional: $30/month (metadata: credits=100, maxBrands=2, maxAccounts=5)
  - Enterprise: $45/month (metadata: credits=300, maxBrands=4, maxAccounts=10)
- [ ] Copy product IDs to environment config

**Test Case:**
1. Visit Polar dashboard
2. Verify all 3 products exist
3. Check metadata is correct
4. Test checkout link for one product

✅ **Done When:** Subscription products configured in Polar

---

### Task 9.3: Implement Subscription Webhook Handlers
- [ ] Add `onSubscriptionCreated` handler in `polar.ts`
- [ ] Create `subscriptions` record
- [ ] Update `users` record with tier, credits, limits
- [ ] Create credit transaction (type: "renewal")
- [ ] Add `onSubscriptionRenewed` handler (reset monthly credits)
- [ ] Add `onSubscriptionCanceled` handler (grace period logic)

**Test Case:**
1. Mock Polar webhook: subscription.created
2. Send to Convex webhook endpoint
3. Check `subscriptions` table - record exists
4. Check `users` - tier, credits, limits updated
5. Check `creditTransactions` - renewal record
6. Mock subscription.renewed after 30 days
7. Check monthly credits reset

✅ **Done When:** Subscription webhooks update Convex correctly

---

### Task 9.4: Build Subscription Selection Page
- [ ] Create `app/subscription/page.tsx`
- [ ] Display 3 tier cards side-by-side
- [ ] Show features for each tier
- [ ] "Select Plan" button → redirects to Polar checkout
- [ ] Pass user email + metadata in checkout URL

**Test Case:**
1. Complete onboarding (redirects to subscription page)
2. See 3 tier options
3. Click "Select Professional Plan"
4. Redirects to Polar checkout
5. (In real scenario) Complete payment
6. Polar webhook fires
7. User redirected to dashboard
8. Check user tier = "professional"

✅ **Done When:** Subscription flow works end-to-end

---

### Task 9.5: Implement Credit Top-Up Flow
- [ ] Create one-time payment products in Polar:
  - 50 credits - $10
  - 100 credits - $18
  - 200 credits - $32
- [ ] Add `onPaymentCompleted` handler in `polar.ts`
- [ ] Create `creditTopUps` record
- [ ] Add to `users.topUpCreditsRemaining`
- [ ] Create transaction (type: "top_up")

**Test Case:**
1. From billing page, click "Buy 50 Credits"
2. Redirects to Polar checkout
3. Complete payment (mock webhook)
4. Webhook fires
5. Check `creditTopUps` - record exists with 50 credits
6. Check `users.topUpCreditsRemaining` - increased by 50
7. Check transaction log

✅ **Done When:** Top-up flow adds credits to user balance

---

## PHASE 10: Polish & Production Readiness 🚀

**Goal:** Error handling, rate limiting, testing, deployment

### Task 10.1: Implement Rate Limiting
- [ ] Add generation rate limit: max 50 images/hour per user
- [ ] Add generation rate limit: max 10 images per request
- [ ] Add validation in `images.create` mutation

**Test Case:**
```typescript
// Generate 11 images in one request
// Should error: "Maximum 10 images per generation"

// Generate 10 images, wait 1 second, generate 45 more
// Should succeed (total 55 in hour)

// Try to generate 1 more
// Should error: "Hourly limit (50 images/hour)"
```
✅ **Done When:** Rate limits prevent abuse

---

### Task 10.2: Add Error Boundaries
- [ ] Create `app/error.tsx` (global error boundary)
- [ ] Create `app/dashboard/error.tsx` (dashboard error boundary)
- [ ] Create `app/dashboard/[brandSlug]/studio/error.tsx` (studio error boundary)
- [ ] Display user-friendly error messages
- [ ] Include "Report Issue" button

**Test Case:**
1. Trigger error in Studio (throw new Error in component)
2. Error boundary catches it
3. Shows friendly message, not stack trace
4. "Try Again" button reloads page

✅ **Done When:** Errors don't crash app, show fallback UI

---

### Task 10.3: Add Loading States
- [ ] Create loading skeletons for:
  - Studio image gallery
  - Product grid
  - Analytics charts
  - Scheduling calendar
- [ ] Use `app/dashboard/loading.tsx` and nested loading files
- [ ] Suspense boundaries for async components

**Test Case:**
1. Navigate to Studio with slow network throttling
2. See skeleton loaders while data fetches
3. Content smoothly transitions in
4. No layout shift (CLS = 0)

✅ **Done When:** All major pages have loading states

---

### Task 10.4: Implement Toast Notifications
- [ ] Install Sonner (already in package.json)
- [ ] Add `Toaster` to root layout
- [ ] Add toast for key actions:
  - Image generation started
  - Image generation complete
  - Image generation failed
  - Post scheduled
  - Post published (via webhook)
  - Credits low warning (< 10 remaining)
  - Credits exhausted
  - Payment successful
  - Payment failed

**Test Case:**
1. Generate image - see "Generation started" toast
2. Wait for completion - see "Image ready!" toast
3. Schedule post - see "Post scheduled for [date]" toast
4. Reduce credits to 8 - see "Running low on credits" warning

✅ **Done When:** All major actions show toast feedback

---

### Task 10.5: Write Test Suite for Credit System
- [ ] Create test file: `convex/credits.test.ts`
- [ ] Test deduction: monthly first, then topUp
- [ ] Test deduction: insufficient credits
- [ ] Test refund: add to monthly (capped), overflow to topUp
- [ ] Test renewal: reset monthly, preserve topUp
- [ ] Test transaction logging for all operations

**Test Case:**
```bash
# Run Convex test suite
bunx convex test
# All credit tests should pass
```
✅ **Done When:** Credit system has >90% test coverage

---

### Task 10.6: Write Test Suite for Image Generation
- [ ] Test generation flow (mocked Replicate)
- [ ] Test timeout handling
- [ ] Test NSFW filter
- [ ] Test refund on failure
- [ ] Test batch generation (4 images)
- [ ] Test credit deduction for batch

**Test Case:**
```bash
bunx convex test
# All generation tests pass
```
✅ **Done When:** Generation flow has >80% test coverage

---

### Task 10.7: Set Up Monitoring & Alerts
- [ ] Add Convex scheduled function: `healthCheck`
- [ ] Check no webhooks in 24 hours → alert
- [ ] Check failed generations >10% → alert
- [ ] Check analytics sync failures → alert
- [ ] Set up email notifications for alerts

**Test Case:**
1. Disable PostForMe webhooks
2. Wait 24 hours (or manually trigger health check)
3. Alert email sent to team

✅ **Done When:** Critical failures trigger alerts

---

### Task 10.8: Optimize Image Generation Performance
- [ ] Implement concurrent prediction limit (max 95 at once)
- [ ] Add queue system if limit exceeded
- [ ] Batch UploadThing uploads (parallel upload)
- [ ] Cache Replicate model version hashes

**Test Case:**
1. Generate 100 images across 10 users simultaneously
2. No more than 95 predictions run concurrently
3. Remaining queued and processed in order
4. All 100 complete successfully

✅ **Done When:** Can handle 100+ concurrent generations

---

### Task 10.9: Add User Profile & Settings
- [ ] Create `app/dashboard/settings/page.tsx`
- [ ] Display/edit user name, email (from Clerk)
- [ ] Update timezone preference
- [ ] View subscription details
- [ ] Cancel subscription (via Polar)
- [ ] Delete account (soft delete, requires confirmation)

**Test Case:**
1. Go to `/dashboard/settings`
2. Change timezone from "America/Los_Angeles" to "America/New_York"
3. Save - updates user record
4. Schedule post - uses new timezone
5. View subscription details
6. Click "Cancel Subscription"
7. Confirm cancellation
8. Subscription marked `cancelAtPeriodEnd: true`

✅ **Done When:** User can manage account settings

---

### Task 10.10: Production Deployment Checklist
- [ ] Set all production environment variables in Vercel
- [ ] Configure Clerk production instance
- [ ] Set up Convex production deployment
- [ ] Configure all webhook URLs to production domain
- [ ] Set up custom domain
- [ ] Enable Vercel Analytics
- [ ] Enable error tracking (Sentry or similar)
- [ ] Create production Polar products
- [ ] Test full user journey in production

**Test Case:**
1. Sign up on production site
2. Complete onboarding
3. Subscribe to plan
4. Connect social account
5. Create product
6. Generate images
7. Schedule post
8. Verify post publishes
9. Check analytics
10. Buy credit top-up
11. Verify all webhooks work

✅ **Done When:** Production environment fully functional

---

## 🎯 Quick Start Checklist

If you're just getting started, do these tasks first (in order):

- [ ] Task 1.1 - Set up environment variables
- [ ] Task 1.2 - Install dependencies
- [ ] Task 1.3 - Initialize Convex
- [ ] Task 1.4 - Set up Clerk account
- [ ] Task 2.1 - Create base schema file
- [ ] Task 2.2 - Define users table
- [ ] Task 2.3 - Define brands table
- [ ] Task 3.1 - Implement Clerk webhook handler
- [ ] Task 3.2 - Create user mutations
- [ ] Task 4.1 - Set up UploadThing route
- [ ] Task 5.1 - Create Replicate integration

After these 11 tasks, you'll have:
- ✅ Development environment running
- ✅ Database schema foundation
- ✅ User authentication working
- ✅ File uploads working
- ✅ AI generation infrastructure ready

Then proceed through the remaining phases in order.

---

## 📊 Progress Tracking

**Overall Progress:** 0 / 70 tasks complete (0%)

**Phase Completion:**
- Phase 1 (Foundation): 0/4 ☐☐☐☐
- Phase 2 (Database): 0/9 ☐☐☐☐☐☐☐☐☐
- Phase 3 (Auth): 0/6 ☐☐☐☐☐☐
- Phase 4 (Products): 0/5 ☐☐☐☐☐
- Phase 5 (AI Generation): 0/6 ☐☐☐☐☐☐
- Phase 6 (Credits): 0/4 ☐☐☐☐
- Phase 7 (Social): 0/4 ☐☐☐☐
- Phase 8 (Posts): 0/5 ☐☐☐☐☐
- Phase 9 (Billing): 0/5 ☐☐☐☐☐
- Phase 10 (Polish): 0/10 ☐☐☐☐☐☐☐☐☐☐

---

## 💡 Tips for Success

1. **Work in sequence** - Tasks within each phase build on each other
2. **Verify test cases** - Don't skip to the next task until current one passes
3. **Commit frequently** - Commit after each completed task
4. **Take breaks** - Each phase is a natural break point
5. **Ask for help** - If stuck on a task for >2 hours, seek assistance
6. **Celebrate wins** - Check off each task and track your progress!

---

**Document Status:** Complete ✅
**Total Tasks:** 70
**Estimated Time:** 60-100 hours (based on 30-90 min per task)
**Good luck! 🚀**
