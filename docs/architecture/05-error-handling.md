# PixelPrism Error Handling & Edge Cases

**Version:** 1.0
**Last Updated:** 2026-02-16

---

## Table of Contents

1. [Error Handling Philosophy](#1-error-handling-philosophy)
2. [AI Generation Errors](#2-ai-generation-errors)
3. [Social Media API Errors](#3-social-media-api-errors)
4. [Payment & Billing Errors](#4-payment--billing-errors)
5. [Webhook Failures](#5-webhook-failures)
6. [Rate Limiting](#6-rate-limiting)
7. [User Feedback](#7-user-feedback)

---

## 1. Error Handling Philosophy

### 1.1 Core Principles

**1. Fail Gracefully**
- Never leave user in unknown state
- Always provide clear error messages
- Offer actionable next steps

**2. Credit Integrity**
- Always refund credits for failures
- Log every credit transaction
- Err on side of user benefit

**3. Transparency**
- Show real error messages (no generic "Something went wrong")
- Log errors for debugging
- Notify team of critical failures

**4. Retry Logic**
- One retry for transient errors
- Exponential backoff
- Don't retry user errors (invalid input)

### 1.2 Error Categories

| Category | User Impact | Refund Credits? | Retry? | Alert Team? |
|----------|-------------|-----------------|--------|-------------|
| **User Error** | High | No | No | No |
| **Transient** | Medium | After retry fails | Yes (once) | No |
| **Service Down** | High | Yes | No | Yes |
| **Data Corruption** | Critical | Yes | No | Yes (urgent) |

---

## 2. AI Generation Errors

### 2.1 Replicate API Errors

**Error Types:**

| Error | Cause | Handling |
|-------|-------|----------|
| **Timeout** | Model takes >5 minutes | Retry once → Refund |
| **NSFW Filter** | Content policy violation | Refund immediately, show warning |
| **Out of Memory** | Resolution too high | Refund, suggest lower resolution |
| **Invalid Input** | Malformed parameters | Don't refund, show validation error |
| **Service Down** | Replicate outage | Refund, retry in 1 hour (background) |

**Implementation:**

```typescript
// convex/actions/generateImage.ts
export const generateImage = action({
  handler: async (ctx, args) => {
    const { imageId } = args

    try {
      // 1. Call Replicate API
      const prediction = await createReplicatePrediction(args)

      // 2. Poll for completion (max 5 minutes)
      const result = await pollPredictionWithTimeout(prediction.id, 300000)

      // 3. Upload to UploadThing
      const cdnUrl = await uploadToUploadThing(result.output[0])

      // 4. Mark as complete
      await ctx.runMutation(internal.images.markComplete, {
        imageId,
        imageUrl: cdnUrl,
        status: "ready"
      })

    } catch (error) {
      // Determine error type
      if (error.message.includes("NSFW")) {
        await handleNSFWError(ctx, imageId)
      } else if (error.message.includes("timeout")) {
        await handleTimeoutError(ctx, imageId)
      } else if (error.message.includes("memory")) {
        await handleMemoryError(ctx, imageId)
      } else {
        await handleGenericError(ctx, imageId, error)
      }
    }
  }
})

async function handleTimeoutError(ctx, imageId) {
  const image = await ctx.runQuery(internal.images.get, { imageId })

  // Check retry count
  if (image.retryCount < 1) {
    // Retry once after 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000))

    await ctx.runMutation(internal.images.incrementRetry, { imageId })

    // Recursive retry
    await generateImage(ctx, { imageId })
  } else {
    // Max retries exceeded → Refund
    await ctx.runMutation(internal.images.markFailed, {
      imageId,
      errorMessage: "Generation timed out after 5 minutes. This can happen with complex prompts or high-resolution images. Please try again with a simpler prompt or lower resolution.",
      refunded: true
    })

    // Refund credits
    await ctx.runMutation(internal.credits.refund, {
      userId: image.userId,
      amount: image.creditsUsed,
      generatedImageId: imageId,
      reason: "timeout"
    })
  }
}

async function handleNSFWError(ctx, imageId) {
  const image = await ctx.runQuery(internal.images.get, { imageId })

  // No retry for NSFW - immediate refund
  await ctx.runMutation(internal.images.markFailed, {
    imageId,
    errorMessage: "Generation blocked by content safety filter. Please ensure your prompt follows community guidelines and doesn't include inappropriate content.",
    refunded: true
  })

  // Refund credits
  await ctx.runMutation(internal.credits.refund, {
    userId: image.userId,
    amount: image.creditsUsed,
    generatedImageId: imageId,
    reason: "nsfw_filter"
  })
}

async function handleMemoryError(ctx, imageId) {
  const image = await ctx.runQuery(internal.images.get, { imageId })

  // No retry - refund and suggest solution
  await ctx.runMutation(internal.images.markFailed, {
    imageId,
    errorMessage: "Image generation failed due to insufficient memory. Try using a lower resolution (2K instead of 4K) or fewer reference images.",
    refunded: true
  })

  // Refund credits
  await ctx.runMutation(internal.credits.refund, {
    userId: image.userId,
    amount: image.creditsUsed,
    generatedImageId: imageId,
    reason: "out_of_memory"
  })
}
```

### 2.2 UploadThing Errors

**Error: Upload Fails**

```typescript
try {
  const cdnUrl = await uploadToUploadThing(imageBlob)
} catch (error) {
  // Retry upload once
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const cdnUrl = await uploadToUploadThing(imageBlob)
  } catch (retryError) {
    // Upload failed twice → Mark as failed, refund
    await ctx.runMutation(internal.images.markFailed, {
      imageId,
      errorMessage: "Failed to save generated image. Please try again.",
      refunded: true
    })

    await ctx.runMutation(internal.credits.refund, {
      userId: image.userId,
      amount: image.creditsUsed,
      generatedImageId: imageId,
      reason: "upload_failed"
    })
  }
}
```

---

## 3. Social Media API Errors

### 3.1 PostForMe Posting Errors

**Error Types:**

| Error | Cause | Handling |
|-------|-------|----------|
| **Invalid Token** | OAuth revoked | Mark account disconnected, notify user |
| **Caption Too Long** | Platform limit exceeded | Validation before submission |
| **Media Invalid** | Unsupported format | Validate before upload |
| **Rate Limited** | Too many posts | Queue and retry later |
| **Platform Down** | Instagram/Twitter outage | Retry in 1 hour, notify user |

**Implementation:**

```typescript
// convex/mutations/posts.ts
export const schedulePost = mutation({
  handler: async (ctx, args) => {
    // Validate caption length BEFORE calling PostForMe
    for (const platform of args.selectedPlatforms) {
      if (platform === "twitter" && args.caption.length > 280) {
        throw new Error(
          `Caption too long for Twitter (${args.caption.length}/280 chars). ` +
          `Please shorten or deselect Twitter.`
        )
      }
    }

    // Create scheduled post record
    const postId = await ctx.db.insert("scheduledPosts", {
      ...args,
      status: "scheduled",
      createdAt: Date.now()
    })

    try {
      // Call PostForMe API
      const response = await fetch("https://api.postforme.dev/social-posts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.POSTFORME_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          caption: args.caption,
          social_accounts: args.postForMeAccountIds,
          media: [{ url: args.imageUrl }],
          schedule_for: new Date(args.scheduledFor).toISOString()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "PostForMe API error")
      }

      const data = await response.json()

      // Update with PostForMe post ID
      await ctx.db.patch(postId, {
        postForMePostId: data.id,
        scheduledAt: Date.now()
      })

      return { success: true, postId }

    } catch (error) {
      // Posting failed → Mark as failed
      await ctx.db.patch(postId, {
        status: "failed",
        platformResults: [{
          platform: "all",
          status: "failed",
          errorMessage: error.message
        }]
      })

      // User-facing error
      throw new Error(
        `Failed to schedule post: ${error.message}. ` +
        `Please try again or contact support if the issue persists.`
      )
    }
  }
})
```

### 3.2 Analytics Sync Errors

**Error: PostForMe Analytics API Down**

```typescript
// convex/actions/syncAnalytics.ts
export const syncBrandAnalytics = action({
  handler: async (ctx, { brandId }) => {
    const accounts = await ctx.runQuery(internal.socialAccounts.getByBrand, {
      brandId
    })

    for (const account of accounts) {
      try {
        // Fetch analytics from PostForMe
        const response = await fetch(
          `https://api.postforme.dev/analytics/accounts/${account.postForMeAccountId}?period=30d`,
          {
            headers: {
              "Authorization": `Bearer ${process.env.POSTFORME_API_KEY}`
            }
          }
        )

        if (!response.ok) {
          throw new Error(`PostForMe API error: ${response.status}`)
        }

        const analytics = await response.json()

        // Update cache
        await ctx.runMutation(internal.analytics.updateCache, {
          brandId,
          socialAccountId: account._id,
          metrics: analytics.metrics,
          lastSyncedAt: Date.now()
        })

      } catch (error) {
        // Log error but don't fail entire sync
        console.error(
          `Failed to sync analytics for account ${account.platformUsername}:`,
          error.message
        )

        // Update social account with error state
        await ctx.runMutation(internal.socialAccounts.markSyncError, {
          accountId: account._id,
          errorMessage: error.message,
          lastAttemptedAt: Date.now()
        })

        // Continue to next account (don't throw)
      }
    }
  }
})
```

**User Experience:**
- Analytics page shows last sync time
- "Last synced 3 hours ago (sync failed, retrying...)"
- Manual refresh button available
- Stale data is still shown (better than nothing)

---

## 4. Payment & Billing Errors

### 4.1 Subscription Payment Failures

**Polar Webhook: `payment.failed`**

```typescript
// convex/polar.ts
export const onPaymentFailed = internalMutation({
  handler: async (ctx, { payment }) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .filter((q) => q.eq(q.field("polarCustomerId"), payment.customer_id))
      .unique()

    if (!subscription) return

    // 1. Update subscription status
    await ctx.db.patch(subscription._id, {
      status: "past_due"
    })

    // 2. Update user status
    const user = await ctx.db.get(subscription.userId)
    await ctx.db.patch(user._id, {
      subscriptionStatus: "past_due"
    })

    // 3. Send notification (email via Convex action)
    await ctx.scheduler.runAfter(0, internal.notifications.sendPaymentFailed, {
      userId: user._id,
      amount: payment.amount,
      reason: payment.failure_reason
    })

    // 4. Grace period: 7 days of continued access
    // After 7 days: Downgrade to "none" tier
    const gracePeriodEnd = Date.now() + (7 * 24 * 60 * 60 * 1000)

    await ctx.scheduler.runAt(gracePeriodEnd, internal.subscriptions.handleGracePeriodExpired, {
      userId: user._id
    })
  }
})

export const handleGracePeriodExpired = internalMutation({
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId)

    // Check if still past_due (maybe they fixed payment)
    if (user.subscriptionStatus === "past_due") {
      // Downgrade to free tier
      await ctx.db.patch(userId, {
        subscriptionTier: "none",
        subscriptionStatus: "canceled",
        monthlyCreditsAllocation: 0,
        monthlyCreditsRemaining: 0,
        maxBrands: 0,
        maxSocialAccounts: 0
      })

      // Notify user
      await ctx.scheduler.runAfter(0, internal.notifications.sendSubscriptionCanceled, {
        userId,
        reason: "payment_failed"
      })
    }
  }
})
```

### 4.2 Credit Top-Up Failures

**User's Payment Fails:**

```typescript
// Polar webhook: payment.failed for one-time payment
export const onTopUpPaymentFailed = internalMutation({
  handler: async (ctx, { payment }) => {
    const userId = payment.metadata.user_id
    const credits = parseInt(payment.metadata.credits)

    // Create failed top-up record
    await ctx.db.insert("creditTopUps", {
      userId,
      creditsAmount: credits,
      pricePaid: payment.amount / 100,
      currency: "USD",
      status: "failed",
      polarPaymentId: payment.id,
      creditsRemaining: 0,
      creditsUsed: 0,
      purchasedAt: Date.now()
    })

    // Notify user
    await ctx.scheduler.runAfter(0, internal.notifications.sendTopUpFailed, {
      userId,
      amount: payment.amount / 100,
      reason: payment.failure_reason
    })
  }
})
```

**User Experience:**
- Toast: "Payment failed: [reason]. Please try again or use a different payment method."
- Email: "We couldn't process your credit purchase. Update payment method here: [link]"

---

## 5. Webhook Failures

### 5.1 Webhook Retry Logic

**Webhook Services Retry Automatically:**

| Service | Retry Schedule | Max Attempts |
|---------|----------------|--------------|
| Clerk (Svix) | Exponential backoff | ~5 over 3 days |
| PostForMe | Exponential backoff | ~3 over 1 day |
| Polar | Exponential backoff | ~5 over 2 days |

**Our Responsibility:**
- Return 200 quickly (even if processing async)
- Log all webhook attempts
- Handle idempotency (same webhook may arrive twice)

**Implementation:**

```typescript
// convex/http.ts
const postForMeWebhook = httpAction(async (ctx, request) => {
  const signature = request.headers.get("x-postforme-signature")
  const payload = await request.text()

  // 1. Verify signature
  if (!verifySignature(payload, signature)) {
    return new Response("Invalid signature", { status: 401 })
  }

  const event = JSON.parse(payload)

  // 2. Check idempotency
  const existingWebhook = await ctx.runQuery(internal.webhooks.checkProcessed, {
    eventId: event.id
  })

  if (existingWebhook) {
    // Already processed → Return 200 (idempotent)
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }

  try {
    // 3. Process webhook (run mutation)
    await ctx.runMutation(internal.posts.handlePostPublished, {
      event
    })

    // 4. Log webhook
    await ctx.runMutation(internal.webhooks.logProcessed, {
      eventId: event.id,
      eventType: event.event,
      processedAt: Date.now()
    })

    // 5. Return 200 immediately
    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (error) {
    // Log error
    console.error("Webhook processing error:", error)

    // Still return 200 to prevent retry for non-transient errors
    // (if it failed once, it'll fail again - don't spam retries)

    if (isTransientError(error)) {
      return new Response("Temporary error, please retry", { status: 500 })
    } else {
      return new Response(JSON.stringify({ success: false }), { status: 200 })
    }
  }
})

function isTransientError(error: Error): boolean {
  const transientMessages = [
    "ETIMEDOUT",
    "ECONNRESET",
    "ENOTFOUND",
    "database unavailable"
  ]

  return transientMessages.some(msg =>
    error.message.toLowerCase().includes(msg.toLowerCase())
  )
}
```

### 5.2 Webhook Monitoring

**Alerts:**
- Webhook fails >3 times → Alert team
- Webhook endpoint returns 500 → Alert team
- No webhooks received in 24 hours → Health check alert

**Implementation:**
```typescript
// convex/webhooks.ts
export const checkWebhookHealth = internalQuery({
  handler: async (ctx) => {
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000)

    const recentWebhooks = await ctx.db
      .query("webhookLogs")
      .filter((q) => q.gte(q.field("processedAt"), last24Hours))
      .collect()

    if (recentWebhooks.length === 0) {
      // No webhooks in 24 hours → Alert
      await ctx.scheduler.runAfter(0, internal.alerts.sendWebhookHealthAlert, {
        message: "No webhooks received in 24 hours"
      })
    }
  }
})
```

---

## 6. Rate Limiting

### 6.1 AI Generation Rate Limits

**Prevent Abuse:**

```typescript
// convex/mutations/images.ts
export const createGenerationBatch = mutation({
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    // Check: Max 10 images per request
    if (args.quantity > 10) {
      throw new Error("Maximum 10 images per generation. Please reduce quantity.")
    }

    // Check: Max 50 images per hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    const recentGenerations = await ctx.db
      .query("generatedImages")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.gte(q.field("createdAt"), oneHourAgo))
      .collect()

    if (recentGenerations.length >= 50) {
      throw new Error(
        "You've reached the hourly generation limit (50 images/hour). " +
        "Please wait before generating more images."
      )
    }

    // Proceed...
  }
})
```

### 6.2 External API Rate Limits

**Replicate:** ~100 concurrent predictions per account

```typescript
// convex/actions/generateImage.ts
let activePredictions = 0
const MAX_CONCURRENT = 95 // Leave buffer

export const generateImage = action({
  handler: async (ctx, args) => {
    // Wait if at limit
    while (activePredictions >= MAX_CONCURRENT) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    activePredictions++

    try {
      // Generate image...
    } finally {
      activePredictions--
    }
  }
})
```

---

## 7. User Feedback

### 7.1 Error Message Guidelines

**Good Error Messages:**
✅ "Image generation timed out (>5 min). Try a simpler prompt or lower resolution."
✅ "Your monthly credits are exhausted. Buy more credits or wait until Feb 16 for renewal."
✅ "Caption too long for Twitter (350/280 chars). Please shorten or deselect Twitter."

**Bad Error Messages:**
❌ "Something went wrong"
❌ "Error 500"
❌ "undefined is not a function"

**Template:**
```
[What happened] + [Why it happened] + [What to do next]
```

### 7.2 Toast Notifications

```typescript
// Use Sonner for toast notifications

// Success
toast.success("Post scheduled for Feb 17 at 10:00 AM", {
  description: "We'll publish to Instagram and Facebook"
})

// Error (with action)
toast.error("Image generation failed", {
  description: "Your credits have been refunded. Please try again.",
  action: {
    label: "Retry",
    onClick: () => handleRetry()
  }
})

// Warning
toast.warning("Caption too long for Twitter", {
  description: "Please shorten to 280 characters or deselect Twitter"
})

// Info
toast.info("Running low on credits", {
  description: "You have 5 credits remaining. Buy more or wait for renewal on Feb 16.",
  action: {
    label: "Buy Credits",
    onClick: () => router.push("/dashboard/billing")
  }
})
```

### 7.3 Error States in UI

**Loading States:**
```tsx
{status === "generating" && (
  <div className="spinner">
    <Loader2Icon className="animate-spin" />
    <p>Generating image (this may take 1-2 minutes)...</p>
  </div>
)}
```

**Error States:**
```tsx
{status === "failed" && (
  <div className="error-state">
    <AlertCircleIcon className="text-red-500" />
    <h3>Generation Failed</h3>
    <p>{errorMessage}</p>
    <Button onClick={handleRetry}>
      Try Again
    </Button>
  </div>
)}
```

**Empty States:**
```tsx
{images.length === 0 && (
  <div className="empty-state">
    <ImageIcon className="text-muted" />
    <h3>No images yet</h3>
    <p>Generate your first marketing image in Studio</p>
    <Button onClick={() => router.push("/dashboard/studio")}>
      Go to Studio
    </Button>
  </div>
)}
```

---

**Document Status:** Complete ✅
**Error Scenarios Covered:** 20+
**Retry Logic:** Specified
**User Feedback:** Detailed
