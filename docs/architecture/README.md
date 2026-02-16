# PixelPrism Architecture Documentation

**Version:** 1.0
**Last Updated:** 2026-02-16
**Status:** Complete - Ready for Developer Handoff

---

## 📚 Documentation Overview

This directory contains the complete technical architecture specification for PixelPrism v1. These documents are designed to be read by developers implementing the system.

**Estimated Reading Time:** 2-3 hours for complete understanding

---

## 📖 Document Navigation

Read the documents in this order for best comprehension:

### 1. **[System Overview](./00-overview.md)** ⭐ START HERE
**What it covers:**
- System architecture and tech stack
- High-level component diagram
- Key architectural decisions
- Development environment setup
- User flow overview

**Read this first** to understand the big picture before diving into specifics.

**Time:** ~20 minutes

---

### 2. **[Database Schema](./01-database-schema.md)** 📊 CRITICAL
**What it covers:**
- Complete Convex schema (13 tables)
- Every field, data type, and relationship
- Indexes and query patterns
- Denormalization strategy
- Data relationship diagrams

**This is the most important document.** All data flows through this schema.

**Time:** ~45 minutes

---

### 3. **[Third-Party Integrations](./02-integrations.md)** 🔌
**What it covers:**
- Clerk authentication (setup, webhooks, onboarding)
- PostForMe social media API (OAuth, posting, analytics)
- UploadThing image storage (client + server uploads)
- Replicate AI image generation (models, parameters, polling)
- OpenRouter AI caption generation
- Polar billing & subscriptions
- Webhook security and verification

**Read this** to understand how external services integrate with the system.

**Time:** ~40 minutes

---

### 4. **[Data Flows & Processes](./03-data-flows.md)** 🔄
**What it covers:**
- User onboarding flow (step-by-step)
- AI image generation flow (product-based + freeform)
- Post scheduling & publishing flow
- Analytics sync flow (automatic + manual)
- Credit system flow (deduction, refund, reset)
- Social account connection flow (OAuth)
- Caption suggestion flow (real-time AI)

**Read this** to understand how data moves through the system end-to-end.

**Time:** ~30 minutes

---

### 5. **[Credit System](./04-credit-system.md)** 💳
**What it covers:**
- Monthly vs top-up credits
- Credit deduction logic (consumption order)
- Credit reset & renewal (monthly cycle)
- Top-up purchase flow
- Transaction logging (audit trail)
- Insufficient credits handling

**Read this** to understand the billing/usage mechanics in detail.

**Time:** ~20 minutes

---

### 6. **[Error Handling & Edge Cases](./05-error-handling.md)** ⚠️
**What it covers:**
- AI generation errors (timeout, NSFW, OOM)
- Social media API errors (rate limits, invalid tokens)
- Payment & billing errors (failed payments, grace periods)
- Webhook failures (retry logic, idempotency)
- Rate limiting (prevent abuse)
- User feedback (error messages, toasts, UI states)

**Read this** to understand how to handle failures gracefully.

**Time:** ~25 minutes

---

## 🎯 Quick Reference

### Common Tasks

**"How do I create a new user?"**
→ See [01-database-schema.md](./01-database-schema.md#21-users-table)
→ See [02-integrations.md](./02-integrations.md#24-user-sync-webhook) (Clerk webhook)

**"How does image generation work?"**
→ See [03-data-flows.md](./03-data-flows.md#2-ai-image-generation-flow)
→ See [02-integrations.md](./02-integrations.md#5-replicate-ai-image-generation)

**"How do credits work?"**
→ See [04-credit-system.md](./04-credit-system.md) (entire document)

**"How do I post to social media?"**
→ See [03-data-flows.md](./03-data-flows.md#3-post-scheduling--publishing-flow)
→ See [02-integrations.md](./02-integrations.md#33-posting-api)

**"What happens when X fails?"**
→ See [05-error-handling.md](./05-error-handling.md)

---

## 🚀 Implementation Checklist

Before starting implementation, ensure you have:

- [ ] Read all 6 architecture documents
- [ ] Set up all required environment variables (see [00-overview.md](./00-overview.md#12-environment-variables-required))
- [ ] Created accounts with all third-party services:
  - [ ] Clerk (authentication)
  - [ ] Convex (backend)
  - [ ] PostForMe (social media)
  - [ ] UploadThing (storage)
  - [ ] Replicate (AI generation)
  - [ ] OpenRouter (AI captions)
  - [ ] Polar (billing)
- [ ] Configured webhooks for:
  - [ ] Clerk → Convex
  - [ ] PostForMe → Convex
  - [ ] Polar → Convex
- [ ] Reviewed the database schema (most important!)
- [ ] Understood credit system mechanics
- [ ] Reviewed error handling patterns

---

## ⚡ Key Architectural Decisions

### Why These Technologies?

| Technology | Decision | Rationale |
|------------|----------|-----------|
| **Convex** | Database + Backend | TypeScript-native, real-time, serverless, Clerk integration |
| **PostForMe** | Social Media | Handles OAuth + APIs for all platforms, saves 6-12 months dev time |
| **UploadThing** | Image Storage | Faster than Convex files, built-in CDN |
| **Replicate** | AI Generation | Multimodal models (image-to-image), tiered pricing |
| **Clerk** | Authentication | Enterprise auth, metadata support, Next.js integration |
| **Polar** | Billing | Simpler than Stripe, SaaS-focused |

### Critical Design Patterns

**1. Credit Deduction Order**
- Always use monthly credits first
- Fall back to top-up credits
- Ensures users get full value from subscription

**2. Denormalization**
- `brands.totalFollowers` = sum of all social accounts
- Improves read performance, simplifies queries
- Update when source data changes

**3. Webhook Idempotency**
- Log every webhook event ID
- Check if already processed before handling
- Prevents duplicate operations

**4. Error Refunds**
- Always refund credits for system failures
- Log refunds in credit transactions
- User trust is paramount

---

## 📞 Support & Questions

**For Clarification:**
- Re-read the relevant architecture document
- Check the "Quick Reference" section above
- Review the data flow diagrams in [03-data-flows.md](./03-data-flows.md)

**For Issues:**
- Check [05-error-handling.md](./05-error-handling.md) for error patterns
- Review the schema in [01-database-schema.md](./01-database-schema.md)
- Consult third-party API docs in [02-integrations.md](./02-integrations.md)

---

## 📝 Document Status

| Document | Status | Completeness |
|----------|--------|--------------|
| 00-overview.md | ✅ Complete | 100% |
| 01-database-schema.md | ✅ Complete | 100% (13 tables, 150+ fields) |
| 02-integrations.md | ✅ Complete | 100% (6 services, 20+ endpoints) |
| 03-data-flows.md | ✅ Complete | 100% (7 major flows) |
| 04-credit-system.md | ✅ Complete | 100% |
| 05-error-handling.md | ✅ Complete | 100% |

**Total Pages:** ~120 pages equivalent
**Total Words:** ~30,000 words
**Code Examples:** 50+
**Diagrams:** 15+

---

## 🎓 Learning Path

**Day 1:** Read overview + schema
**Day 2:** Read integrations + data flows
**Day 3:** Read credit system + error handling
**Day 4:** Start implementation with schema setup

---

**Ready to build? Start with [00-overview.md](./00-overview.md)!** 🚀
