import type { Metadata } from "next"
import "@/styles/homepage.css"
import { ContactPageContent } from "@/components/homepage/contact-page"

export const metadata: Metadata = {
  title: "Contact — PixelPrism",
  description: "Get in touch with the PixelPrism team. We'd love to hear from you — questions, feedback, or partnership inquiries.",
}

export default function ContactPage() {
  return <ContactPageContent />
}
