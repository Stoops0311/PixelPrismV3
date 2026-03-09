import type { Metadata } from "next"
import "@/styles/homepage.css"
import { PricingPageContent } from "@/components/homepage/pricing-page"

export const metadata: Metadata = {
  title: "Pricing — PixelPrism",
  description: "Simple, transparent pricing. Start free, upgrade when you're ready. AI-powered social media marketing for growing businesses.",
}

export default function PricingPage() {
  return <PricingPageContent />
}
