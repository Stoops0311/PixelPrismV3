# PixelPrism Credit System

**Version:** 1.0
**Last Updated:** 2026-02-16

---

## Table of Contents

1. [Credit System Overview](#1-credit-system-overview)
2. [Credit Types](#2-credit-types)
3. [Credit Consumption](#3-credit-consumption)
4. [Credit Reset & Renewal](#4-credit-reset--renewal)
5. [Top-Up System](#5-top-up-system)
6. [Transaction Logging](#6-transaction-logging)
7. [Insufficient Credits Handling](#7-insufficient-credits-handling)

---

## 1. Credit System Overview

### 1.1 Purpose

PixelPrism uses a **credit-based system** to:
- Limit AI generation usage fairly across subscription tiers
- Provide predictable monthly costs for users
- Allow flexibility with top-up purchases
- Track exact usage for billing transparency

### 1.2 Core Principles

**Two Credit Balances:**
1. **Monthly Credits** - Reset every billing cycle (use it or lose it)
2. **Top-Up Credits** - Never expire, persist across months

**Consumption Order:**
- Always use **monthly credits first**
- Fall back to **top-up credits** when monthly exhausted
- This ensures users get full value from their subscription

---

## 2. Credit Types

### 2.1 Monthly Credits

**Source:** Subscription tier allocation

**Allocation by Tier:**
| Tier | Monthly Credits |
|------|----------------|
| **Starter** ($20/month) | 50 credits |
| **Professional** ($30/month) | 100 credits |
| **Enterprise** ($45/month) | 300 credits |

**Behavior:**
- Reset to `monthlyCreditsAllocation` on renewal date
- Any unused credits are **lost** at renewal
- Stored in `users.monthlyCreditsRemaining`

**Example:**
```
User has Professional plan (100 credits/month)
Renewal date: February 16, 2026

January 16 → February 16:
- Starts with: 100 credits
- Uses: 82 credits
- Remaining on Feb 15: 18 credits

February 16 (Renewal):
- Old balance lost: 18 credits → 0
- New allocation: 100 credits
- New balance: 100 credits
```

### 2.2 Top-Up Credits

**Source:** One-time purchases

**Available Packs:**
| Pack Size | Price | Per-Credit Cost |
|-----------|-------|-----------------|
| 50 credits | $10 | $0.20/credit |
| 100 credits | $18 | $0.18/credit (10% discount) |
| 200 credits | $32 | $0.16/credit (20% discount) |

**Behavior:**
- **Never expire** - persist indefinitely
- Survive subscription cancellations
- Survive subscription downgrades
- Only decrease when consumed
- Stored in `users.topUpCreditsRemaining`

**Example:**
```
User buys 100-credit pack on Jan 1
Uses 30 credits in January
Remaining: 70 credits

Feb 16 (Renewal):
- Monthly credits reset to 100
- Top-up credits unchanged: 70

Uses 120 credits in February:
- 100 from monthly (exhausted)
- 20 from top-up (now 50 remaining)

March 16 (Renewal):
- Monthly credits reset to 100
- Top-up credits: 50 (unchanged)
```

---

## 3. Credit Consumption

### 3.1 Credit Costs

**AI Image Generation:**

| Quality Tier | Model | Credits |
|--------------|-------|---------|
| **Standard** | `qwen/qwen-image-2512` | 0.5 |
| **Mid** | `bytedance/seedream-4` | 1.0 |
| **Premium** | `bytedance/seedream-4.5` | 1.5 |

**Other Operations:**
- AI Caption Suggestions: **Free** (platform absorbs cost)
- Post Scheduling: **Free**
- Analytics Sync: **Free**

### 3.2 Deduction Logic

**Convex Mutation:**
```typescript
async function deductCredits(
  ctx,
  userId: Id<"users">,
  amount: number
): Promise<{
  success: boolean,
  balanceBefore: { monthly: number, topUp: number },
  balanceAfter: { monthly: number, topUp: number }
}> {
  const user = await ctx.db.get(userId)

  // 1. Calculate balances
  const monthlyAvailable = user.monthlyCreditsRemaining
  const topUpAvailable = user.topUpCreditsRemaining
  const totalAvailable = monthlyAvailable + topUpAvailable

  // 2. Check if sufficient
  if (totalAvailable < amount) {
    return {
      success: false,
      balanceBefore: { monthly: monthlyAvailable, topUp: topUpAvailable },
      balanceAfter: { monthly: monthlyAvailable, topUp: topUpAvailable }
    }
  }

  // 3. Deduct from monthly first
  let remainingToDeduct = amount
  let newMonthly = monthlyAvailable
  let newTopUp = topUpAvailable

  if (monthlyAvailable >= remainingToDeduct) {
    // Deduct entirely from monthly
    newMonthly = monthlyAvailable - remainingToDeduct
  } else {
    // Exhaust monthly, then deduct from top-up
    remainingToDeduct -= monthlyAvailable
    newMonthly = 0
    newTopUp = topUpAvailable - remainingToDeduct
  }

  // 4. Update user record
  await ctx.db.patch(userId, {
    monthlyCreditsRemaining: newMonthly,
    topUpCreditsRemaining: newTopUp
  })

  return {
    success: true,
    balanceBefore: { monthly: monthlyAvailable, topUp: topUpAvailable },
    balanceAfter: { monthly: newMonthly, topUp: newTopUp }
  }
}
```

**Example Scenarios:**

**Scenario A: Deduct from monthly only**
```
Before: monthly=50, topUp=10
Deduct: 5 credits
After: monthly=45, topUp=10
```

**Scenario B: Deduct from both**
```
Before: monthly=2, topUp=10
Deduct: 5 credits
After: monthly=0, topUp=7
```

**Scenario C: Insufficient credits**
```
Before: monthly=0, topUp=3
Deduct: 5 credits
Result: ERROR - insufficient credits
```

### 3.3 Batch Deduction (Multiple Images)

When user generates 4 images at 1.5 credits each:

```typescript
// Generate 4 images = 6 credits total
const totalCredits = 4 * 1.5 // = 6

// Deduct all credits upfront
const deduction = await deductCredits(ctx, userId, totalCredits)

if (!deduction.success) {
  throw new Error("Insufficient credits")
}

// Create 4 separate GeneratedImage records
for (let i = 0; i < 4; i++) {
  await ctx.db.insert("generatedImages", {
    userId,
    brandId,
    status: "generating",
    creditsUsed: 1.5,
    // ...
  })

  // Create 4 separate transactions
  await ctx.db.insert("creditTransactions", {
    userId,
    type: "generation",
    amount: -1.5,
    balanceBefore: deduction.balanceBefore,
    balanceAfter: deduction.balanceAfter,
    // ...
  })
}
```

**Why Deduct Upfront:**
- Prevents race conditions (user clicking "Generate" multiple times)
- Ensures atomic credit reservation
- Allows refunds if generation fails

---

## 4. Credit Reset & Renewal

### 4.1 Monthly Reset Trigger

**Method 1: Polar Webhook (Preferred)**

When Polar sends `subscription.renewed` event:

```typescript
// convex/polar.ts
export const onSubscriptionRenewed = internalMutation({
  handler: async (ctx, { subscription }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("polarCustomerId"), subscription.customer_id))
      .unique()

    if (!user) return

    // 1. Reset monthly credits
    const allocation = subscription.metadata.credits_per_month

    await ctx.db.patch(user._id, {
      monthlyCreditsRemaining: allocation,
      subscriptionRenewalDate: Date.parse(subscription.next_period_end)
    })

    // 2. Create renewal transaction
    await ctx.db.insert("creditTransactions", {
      userId: user._id,
      type: "renewal",
      amount: allocation,
      balanceBefore: {
        monthly: user.monthlyCreditsRemaining, // Old balance
        topUp: user.topUpCreditsRemaining
      },
      balanceAfter: {
        monthly: allocation, // New allocation
        topUp: user.topUpCreditsRemaining
      },
      description: `Monthly credit renewal (${user.subscriptionTier} plan)`,
      createdAt: Date.now()
    })
  }
})
```

**Method 2: Scheduled Function (Backup)**

Convex cron job runs daily at midnight UTC:

```typescript
// convex/crons.ts
export default cronJobs.monthly(
  "midnight",
  { hourUTC: 0, day: "daily" },
  internal.credits.resetMonthlyCredits
)

// convex/credits.ts
export const resetMonthlyCredits = internalMutation({
  handler: async (ctx) => {
    const now = Date.now()

    // Find all users due for renewal
    const usersToReset = await ctx.db
      .query("users")
      .withIndex("by_renewal_date")
      .filter((q) => q.lte(q.field("subscriptionRenewalDate"), now))
      .collect()

    for (const user of usersToReset) {
      // Reset monthly credits
      await ctx.db.patch(user._id, {
        monthlyCreditsRemaining: user.monthlyCreditsAllocation,
        subscriptionRenewalDate: now + 30 * 24 * 60 * 60 * 1000 // +30 days
      })

      // Log transaction
      await ctx.db.insert("creditTransactions", {
        userId: user._id,
        type: "renewal",
        amount: user.monthlyCreditsAllocation,
        balanceBefore: {
          monthly: user.monthlyCreditsRemaining,
          topUp: user.topUpCreditsRemaining
        },
        balanceAfter: {
          monthly: user.monthlyCreditsAllocation,
          topUp: user.topUpCreditsRemaining
        },
        description: "Monthly credit renewal",
        createdAt: now
      })
    }
  }
})
```

### 4.2 Renewal Edge Cases

**User Cancels Subscription:**
- On cancellation: `subscriptions.cancelAtPeriodEnd = true`
- User keeps access until `currentPeriodEnd`
- Final renewal happens at period end
- After period end:
  - `monthlyCreditsAllocation = 0`
  - `monthlyCreditsRemaining = 0`
  - `topUpCreditsRemaining` unchanged (never expire)
  - `subscriptionTier = "none"`

**User Downgrades:**
- Professional (100) → Starter (50)
- Next renewal: `monthlyCreditsRemaining` resets to 50 (not 100)
- Top-up credits unaffected

**User Upgrades:**
- Starter (50) → Professional (100)
- Immediate effect (via Polar webhook):
  - `monthlyCreditsAllocation = 100`
  - Add difference to current balance: `monthlyCreditsRemaining += 50`
- Or: Reset to full 100 (business decision)

---

## 5. Top-Up System

### 5.1 Purchase Flow

**1. User Selects Pack:**
```typescript
// Frontend
<Button onClick={() => {
  window.location.href = `https://polar.sh/checkout/${CREDIT_PACK_50_PRODUCT_ID}?
    customer_email=${user.email}&
    metadata[credits]=50&
    metadata[user_id]=${userId}`
}}>
  Buy 50 Credits - $10
</Button>
```

**2. Polar Payment Webhook:**
```typescript
// convex/polar.ts
export const onPaymentCompleted = internalMutation({
  handler: async (ctx, { payment }) => {
    const userId = payment.metadata.user_id
    const credits = parseInt(payment.metadata.credits)

    // 1. Create top-up record
    const topUpId = await ctx.db.insert("creditTopUps", {
      userId,
      creditsAmount: credits,
      pricePaid: payment.amount / 100, // cents to dollars
      currency: "USD",
      status: "completed",
      polarPaymentId: payment.id,
      creditsRemaining: credits,
      creditsUsed: 0,
      purchasedAt: Date.now(),
      completedAt: Date.now()
    })

    // 2. Add to user balance
    const user = await ctx.db.get(userId)
    await ctx.db.patch(userId, {
      topUpCreditsRemaining: user.topUpCreditsRemaining + credits
    })

    // 3. Log transaction
    await ctx.db.insert("creditTransactions", {
      userId,
      type: "top_up",
      amount: credits,
      balanceBefore: {
        monthly: user.monthlyCreditsRemaining,
        topUp: user.topUpCreditsRemaining
      },
      balanceAfter: {
        monthly: user.monthlyCreditsRemaining,
        topUp: user.topUpCreditsRemaining + credits
      },
      topUpId,
      description: `${credits} credit pack purchased ($${payment.amount / 100})`,
      createdAt: Date.now()
    })
  }
})
```

### 5.2 Top-Up Usage Tracking

When credits are deducted from a top-up pack:

```typescript
// After deducting credits, update top-up records
async function trackTopUpUsage(ctx, userId, amountUsed) {
  const topUps = await ctx.db
    .query("creditTopUps")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => q.gt(q.field("creditsRemaining"), 0))
    .order("asc") // Oldest first (FIFO)
    .collect()

  let remainingToDeduct = amountUsed

  for (const topUp of topUps) {
    if (remainingToDeduct <= 0) break

    const deductFromThis = Math.min(topUp.creditsRemaining, remainingToDeduct)

    await ctx.db.patch(topUp._id, {
      creditsRemaining: topUp.creditsRemaining - deductFromThis,
      creditsUsed: topUp.creditsUsed + deductFromThis
    })

    remainingToDeduct -= deductFromThis
  }
}
```

**Example:**
```
User has two top-up packs:
- Pack A (Jan 1): 50 credits remaining
- Pack B (Feb 1): 100 credits remaining

Deduct 70 credits from top-up:
- Pack A: 50 credits used (now 0 remaining)
- Pack B: 20 credits used (now 80 remaining)
```

---

## 6. Transaction Logging

### 6.1 Purpose

Every credit change creates a `creditTransactions` record for:
- Audit trail
- Billing transparency
- Dispute resolution
- User trust

### 6.2 Transaction Types

| Type | Amount | Description |
|------|--------|-------------|
| `"generation"` | Negative | AI image generated |
| `"renewal"` | Positive | Monthly credits renewed |
| `"top_up"` | Positive | Credit pack purchased |
| `"refund"` | Positive | Failed generation refunded |
| `"adjustment"` | +/- | Manual correction by support |

### 6.3 Transaction Details

**Generation Transaction:**
```typescript
{
  type: "generation",
  amount: -1.5,
  balanceBefore: { monthly: 50, topUp: 10 },
  balanceAfter: { monthly: 48.5, topUp: 10 },
  generatedImageId: "img_123",
  brandId: "brand_456",
  operationDetails: {
    model: "bytedance/seedream-4.5",
    qualityTier: "premium",
    prompt: "coffee mug on wooden table",
    aspectRatio: "1:1",
    referenceImageCount: 2,
    productName: "Summer Cold Brew",
    status: "success"
  },
  description: "AI image generated for Summer Cold Brew (Premium quality, 1:1)",
  createdAt: 1708098765432
}
```

**Display on Billing Page:**
```
Feb 16, 2026 2:32 PM
AI image generated for Summer Cold Brew
Premium quality, 1:1 aspect ratio
-1.5 credits
```

---

## 7. Insufficient Credits Handling

### 7.1 Pre-Generation Check

Before starting generation:

```typescript
export const generateImages = mutation({
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)

    const creditsNeeded = args.quantity * getCreditCost(args.qualityTier)
    const creditsAvailable = user.monthlyCreditsRemaining + user.topUpCreditsRemaining

    if (creditsAvailable < creditsNeeded) {
      throw new Error(
        `Insufficient credits. Need ${creditsNeeded}, have ${creditsAvailable}. ` +
        `Purchase more credits or wait for monthly renewal on ${formatDate(user.subscriptionRenewalDate)}.`
      )
    }

    // Proceed with generation...
  }
})
```

### 7.2 UI Handling

**Before Generation:**
```typescript
// Frontend component
const creditsNeeded = quantity * getCreditCost(qualityTier)
const creditsAvailable = user.monthlyCreditsRemaining + user.topUpCreditsRemaining
const insufficient = creditsAvailable < creditsNeeded

return (
  <Button
    disabled={insufficient}
    onClick={handleGenerate}
  >
    {insufficient
      ? `Insufficient credits (need ${creditsNeeded}, have ${creditsAvailable})`
      : `Generate (${creditsNeeded} credits)`
    }
  </Button>
)
```

**After Depletion:**
- Show banner: "You're running low on credits"
- Suggest: "Buy more credits" or "Upgrade plan"
- Display renewal date: "Renews Feb 16 with 100 new credits"

---

**Document Status:** Complete ✅
**Credit System:** Fully specified
**Edge Cases:** Handled
