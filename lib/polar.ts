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

export const PLAN_PRICE_BY_TIER = {
  free: 0,
  starter: 20,
  professional: 30,
  enterprise: 45,
  none: 0,
} as const

export type CreditPack = {
  key: "credits_100" | "credits_300" | "credits_1000"
  credits: number
  price: number
}

export const CREDIT_PACKS: CreditPack[] = [
  { key: "credits_100", credits: 100, price: 35 },
  { key: "credits_300", credits: 300, price: 90 },
  { key: "credits_1000", credits: 1000, price: 250 },
]

export type SubscriptionTier = "free" | "starter" | "professional" | "enterprise" | "none"

export const TIER_DETAILS = {
  free:         { name: "Free",          price: 0,  monthlyCredits: 5,   maxBrands: 1, maxSocialAccounts: 1,  description: "For trying things out" },
  starter:      { name: "Starter",       price: 20, monthlyCredits: 50,  maxBrands: 1, maxSocialAccounts: 2,  description: "Perfect for getting started" },
  professional: { name: "Professional",  price: 30, monthlyCredits: 100, maxBrands: 2, maxSocialAccounts: 5,  description: "For growing businesses" },
  enterprise:   { name: "Enterprise",    price: 45, monthlyCredits: 300, maxBrands: 4, maxSocialAccounts: 10, description: "For large organizations" },
} as const

export const TIER_ORDER: SubscriptionTier[] = ["free", "starter", "professional", "enterprise"]

export type UpgradeContext =
  | { kind: "brands"; currentCount: number; maxCount: number }
  | { kind: "social_accounts"; currentCount: number; maxCount: number }
  | { kind: "credits"; creditsNeeded: number; creditsAvailable: number }

// ── Full pricing page data ──

export type FullTier = {
  key: SubscriptionTier
  name: string
  price: number
  monthlyCredits: number
  maxBrands: number
  maxSocialAccounts: number
  description: string
  popular: boolean
  features: string[]
  notIncluded: string[]
}

export const FULL_TIERS: FullTier[] = [
  {
    key: "free",
    name: "Free",
    price: 0,
    monthlyCredits: 5,
    maxBrands: 1,
    maxSocialAccounts: 1,
    description: "For trying things out",
    popular: false,
    features: [
      "5 AI credits per month",
      "1 brand",
      "1 social account",
      "Basic image generation",
      "Manual posting",
    ],
    notIncluded: [
      "Scheduling",
      "Analytics",
      "Priority support",
    ],
  },
  {
    key: "starter",
    name: "Starter",
    price: 20,
    monthlyCredits: 50,
    maxBrands: 1,
    maxSocialAccounts: 2,
    description: "Perfect for getting started",
    popular: false,
    features: [
      "50 AI credits per month",
      "1 brand",
      "2 social accounts",
      "AI image generation",
      "Post scheduling",
      "Basic analytics",
    ],
    notIncluded: [
      "Priority support",
    ],
  },
  {
    key: "professional",
    name: "Professional",
    price: 30,
    monthlyCredits: 100,
    maxBrands: 2,
    maxSocialAccounts: 5,
    description: "For growing businesses",
    popular: true,
    features: [
      "100 AI credits per month",
      "2 brands",
      "5 social accounts",
      "AI image generation",
      "Unlimited scheduling",
      "Advanced analytics",
    ],
    notIncluded: [
      "Priority support",
    ],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: 45,
    monthlyCredits: 300,
    maxBrands: 4,
    maxSocialAccounts: 10,
    description: "For large organizations",
    popular: false,
    features: [
      "300 AI credits per month",
      "4 brands",
      "10 social accounts",
      "AI image generation",
      "Unlimited scheduling",
      "Custom analytics & reports",
      "Priority support",
    ],
    notIncluded: [],
  },
]

export type ComparisonFeature = {
  name: string
  category?: string
  values: Record<SubscriptionTier, string | boolean>
}

export const TIER_COMPARISON_FEATURES: ComparisonFeature[] = [
  {
    name: "Monthly AI Credits",
    category: "Usage",
    values: { free: "5", starter: "50", professional: "100", enterprise: "300", none: false },
  },
  {
    name: "Brands",
    category: "Usage",
    values: { free: "1", starter: "1", professional: "2", enterprise: "4", none: false },
  },
  {
    name: "Social Accounts",
    category: "Usage",
    values: { free: "1", starter: "2", professional: "5", enterprise: "10", none: false },
  },
  {
    name: "AI Image Generation",
    category: "Features",
    values: { free: true, starter: true, professional: true, enterprise: true, none: false },
  },
  {
    name: "Post Scheduling",
    category: "Features",
    values: { free: false, starter: true, professional: true, enterprise: true, none: false },
  },
  {
    name: "Analytics",
    category: "Features",
    values: { free: false, starter: "Basic", professional: "Advanced", enterprise: "Custom", none: false },
  },
  {
    name: "Priority Support",
    category: "Support",
    values: { free: false, starter: false, professional: false, enterprise: true, none: false },
  },
  {
    name: "Credit Top-ups",
    category: "Support",
    values: { free: false, starter: true, professional: true, enterprise: true, none: false },
  },
]
