"use client"

import "@/styles/homepage.css"
import { HomepageNav } from "@/components/homepage/homepage-nav"
import { HeroSection } from "@/components/homepage/hero-section"
import { ProblemSection } from "@/components/homepage/problem-section"
import { SolutionShowcase } from "@/components/homepage/solution-showcase"
import { FeatureDeepDives } from "@/components/homepage/feature-deep-dives"
import { SocialProofSection } from "@/components/homepage/social-proof-section"
import { PricingSection } from "@/components/homepage/pricing-section"
import { FinalCTA } from "@/components/homepage/final-cta"
import { MarketingFooter } from "@/components/homepage/marketing-footer"
import { MobileBottomNav } from "@/components/homepage/mobile-bottom-nav"

export default function HomePage() {
  return (
    <div style={{ background: "#071a26", minHeight: "100vh" }}>
      <HomepageNav />
      <HeroSection />
      <ProblemSection />
      <SolutionShowcase />
      <FeatureDeepDives />
      <SocialProofSection />
      <PricingSection />
      <FinalCTA />
      <MarketingFooter />
      <MobileBottomNav />
    </div>
  )
}
