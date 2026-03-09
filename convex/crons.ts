import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

// Run daily at midnight UTC to reset credits for users whose renewal date has passed
crons.daily(
  "reset-monthly-credits",
  { hourUTC: 0, minuteUTC: 0 },
  internal.credits.processRenewals
)

// Run analytics sync every 6 hours.
crons.interval(
  "sync-social-analytics",
  { hours: 6 },
  internal.analytics.enqueueBrandSyncs
)

export default crons
