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

// Polar webhook routes — handles subscription/product events at /polar/events
import { polar } from "./polar"
polar.registerRoutes(http)

export default http
