import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { internal } from "./_generated/api"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { Webhook } from "svix"

const http = httpRouter()

const clerkWebhook = httpAction(async (ctx, request) => {
  const svixId = request.headers.get("svix-id")
  const svixTimestamp = request.headers.get("svix-timestamp")
  const svixSignature = request.headers.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await request.text()
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let evt: WebhookEvent
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent
  } catch {
    console.error("Invalid webhook signature")
    return new Response("Invalid signature", { status: 401 })
  }

  // Idempotency check — skip if this event was already processed
  const alreadyProcessed = await ctx.runQuery(
    internal.webhookLogs.checkProcessed,
    { eventId: svixId }
  )
  if (alreadyProcessed) {
    return new Response(JSON.stringify({ success: true, deduplicated: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }

  switch (evt.type) {
    case "user.created": {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data
      await ctx.runMutation(internal.users.create, {
        clerkId: id,
        email: email_addresses[0]?.email_address ?? "",
        name: [first_name, last_name].filter(Boolean).join(" ") || undefined,
        imageUrl: image_url || undefined,
      })
      break
    }
    case "user.updated": {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data
      await ctx.runMutation(internal.users.update, {
        clerkId: id,
        email: email_addresses[0]?.email_address ?? "",
        name: [first_name, last_name].filter(Boolean).join(" ") || undefined,
        imageUrl: image_url || undefined,
      })
      break
    }
    case "user.deleted": {
      const { id } = evt.data
      if (id) {
        await ctx.runMutation(internal.users.remove, { clerkId: id })
      }
      break
    }
  }

  // Log the processed event for idempotency
  await ctx.runMutation(internal.webhookLogs.logProcessed, {
    eventId: svixId,
    eventType: evt.type,
    source: "clerk",
  })

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
})

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkWebhook,
})

const postForMeWebhook = httpAction(async (ctx, request) => {
  const configuredSecret = process.env.POSTFORME_WEBHOOK_SECRET
  const sentSecret = request.headers.get("Post-For-Me-Webhook-Secret")

  if (!configuredSecret) {
    return new Response("POSTFORME_WEBHOOK_SECRET not configured", { status: 500 })
  }

  if (!sentSecret || sentSecret !== configuredSecret) {
    return new Response("Invalid webhook secret", { status: 401 })
  }

  const payloadText = await request.text()
  let payload: any
  try {
    payload = JSON.parse(payloadText)
  } catch {
    return new Response("Invalid JSON payload", { status: 400 })
  }

  const eventType = String(payload.event_type || payload.event || "unknown")
  const data = payload.data || {}

  const eventId =
    request.headers.get("x-postforme-event-id") ||
    String(payload.id || data.id || data.result_id || data.social_post_id || `${eventType}:${Date.now()}`)

  const alreadyProcessed = await ctx.runQuery(internal.webhookLogs.checkProcessed, {
    eventId,
  })
  if (alreadyProcessed) {
    return new Response(JSON.stringify({ success: true, deduplicated: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }

  await ctx.scheduler.runAfter(0, internal.postformeWebhookEvents.processEvent, {
    eventId,
    eventType,
    data,
  })

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
})

http.route({
  path: "/postforme-webhook",
  method: "POST",
  handler: postForMeWebhook,
})

// Polar webhook routes — handles subscription/product events at /polar/events
import { polar } from "./polar"
polar.registerRoutes(http, {
  events: {
    "order.paid": async (ctx, event) => {
      const metadata = event.data.metadata || {}
      const eventId = `${event.type}:${event.data.id}`

      await ctx.runMutation(internal.polar.processPaidOrderInternal, {
        eventId,
        orderId: event.data.id,
        productId: event.data.productId || undefined,
        customerId: event.data.customerId,
        userId:
          (typeof metadata.userId === "string" ? metadata.userId : undefined) ||
          undefined,
        totalAmountCents: event.data.totalAmount,
        currency: event.data.currency,
      })
    },
    "subscription.created": async (ctx, event) => {
      const metadata = event.data.metadata || {}
      const eventId = `${event.type}:${event.data.id}`

      await ctx.runMutation(internal.polar.syncSubscriptionFromWebhookInternal, {
        eventId,
        subscriptionId: event.data.id,
        customerId: event.data.customerId,
        productId: event.data.productId,
        status: event.data.status,
        cancelAtPeriodEnd: event.data.cancelAtPeriodEnd,
        currentPeriodEnd: event.data.currentPeriodEnd
          ? event.data.currentPeriodEnd.getTime()
          : undefined,
        userId:
          (typeof metadata.userId === "string" ? metadata.userId : undefined) ||
          undefined,
      })
    },
    "subscription.updated": async (ctx, event) => {
      const metadata = event.data.metadata || {}
      const eventId = `${event.type}:${event.data.id}`

      await ctx.runMutation(internal.polar.syncSubscriptionFromWebhookInternal, {
        eventId,
        subscriptionId: event.data.id,
        customerId: event.data.customerId,
        productId: event.data.productId,
        status: event.data.status,
        cancelAtPeriodEnd: event.data.cancelAtPeriodEnd,
        currentPeriodEnd: event.data.currentPeriodEnd
          ? event.data.currentPeriodEnd.getTime()
          : undefined,
        userId:
          (typeof metadata.userId === "string" ? metadata.userId : undefined) ||
          undefined,
      })
    },
  },
})

export default http
