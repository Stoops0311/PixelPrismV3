import { Polar } from "@convex-dev/polar"
import { action, query } from "./_generated/server"
import { api, components } from "./_generated/api"

export const polar = new Polar(components.polar, {
  getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
    const user = await (ctx as any).runQuery(api.users.current)
    if (!user) throw new Error("Not authenticated")
    return { userId: user._id as string, email: user.email as string }
  },
  // Product IDs will be updated after sandbox setup
  products: {
    starter: "672efa21-55b2-4300-aa9b-c1cee55b89bd",
    professional: "9a52da8d-879c-4810-a867-ff3c405dfc51",
    enterprise: "d0669c49-bf83-485d-bfff-b265ca85895c",
  },
  server: "sandbox",
})

export const {
  getConfiguredProducts,
  listAllProducts,
  generateCheckoutLink,
  generateCustomerPortalUrl,
  changeCurrentSubscription,
  cancelCurrentSubscription,
} = polar.api()

export const syncProducts = action({
  args: {},
  handler: async (ctx) => {
    await polar.syncProducts(ctx)
  },
})

export const currentWithSubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()
    if (!user) return null

    const subscription = await polar.getCurrentSubscription(ctx, {
      userId: user._id,
    })

    return {
      ...user,
      subscription,
      isPremium: !!subscription && subscription.status === "active",
    }
  },
})
