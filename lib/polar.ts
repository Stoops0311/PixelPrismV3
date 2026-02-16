export type PricingTier = {
  name: string
  price: number
  interval: "month"
  productKey: string
  description: string
  popular?: boolean
  features: string[]
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: 20,
    interval: "month",
    productKey: "starter",
    description: "Perfect for getting started",
    features: [
      "5 social accounts",
      "50 scheduled posts",
      "Basic analytics",
    ],
  },
  {
    name: "Professional",
    price: 30,
    interval: "month",
    productKey: "professional",
    description: "For growing businesses",
    popular: true,
    features: [
      "15 social accounts",
      "Unlimited scheduled posts",
      "Advanced analytics",
      "Team collaboration",
    ],
  },
  {
    name: "Enterprise",
    price: 45,
    interval: "month",
    productKey: "enterprise",
    description: "For large organizations",
    features: [
      "Unlimited social accounts",
      "Unlimited scheduled posts",
      "Custom analytics & reports",
      "Priority support",
      "API access",
    ],
  },
]
