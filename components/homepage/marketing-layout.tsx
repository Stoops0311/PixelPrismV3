"use client"

import { HomepageNav } from "@/components/homepage/homepage-nav"
import { MarketingFooter } from "@/components/homepage/marketing-footer"

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#071a26", minHeight: "100vh" }}>
      <HomepageNav />
      <main style={{ paddingTop: "4rem" }}>
        {children}
      </main>
      <MarketingFooter />
    </div>
  )
}
