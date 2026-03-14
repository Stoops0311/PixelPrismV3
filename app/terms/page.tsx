import type { Metadata } from "next"
import "@/styles/homepage.css"
import { TermsPageContent } from "@/components/homepage/terms-page"

export const metadata: Metadata = {
  title: "Terms & Conditions — PixelPrism",
  description: "Read the terms and conditions governing the use of PixelPrism's social media marketing platform and services.",
}

export default function TermsPage() {
  return <TermsPageContent />
}
