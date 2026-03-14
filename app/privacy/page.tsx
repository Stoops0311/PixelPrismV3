import type { Metadata } from "next"
import "@/styles/homepage.css"
import { PrivacyPageContent } from "@/components/homepage/privacy-page"

export const metadata: Metadata = {
  title: "Privacy Policy — PixelPrism",
  description: "Learn how PixelPrism collects, uses, and protects your personal information. Read our comprehensive privacy policy.",
}

export default function PrivacyPage() {
  return <PrivacyPageContent />
}
