import type { Metadata } from "next"
import "@/styles/homepage.css"
import { TermsPageContent } from "@/components/homepage/terms-page"

export const metadata: Metadata = {
  title: "Terms of Service — PixelPrism",
  description: "Read the PixelPrism Terms of Service. Understand your rights and responsibilities when using our social media marketing platform.",
}

export default function TermsPage() {
  return <TermsPageContent />
}
