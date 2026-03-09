import type { Metadata } from "next"
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
// Clerk mocked out for local testing — see lib/clerk-mock.tsx
// Original: import { ClerkProvider } from "@clerk/nextjs"
// Original: import { dark } from "@clerk/themes"
import { ConvexClientProvider } from "@/lib/convex-provider"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "PixelPrism",
  description: "Social media marketing for SMBs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`sb-root ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  )
}
