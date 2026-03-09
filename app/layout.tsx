import type { Metadata } from "next"
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#f4b964",
          colorBackground: "#071a26",
          colorInputBackground: "#0a2535",
          colorText: "#eaeef1",
          colorTextSecondary: "#6d8d9f",
          borderRadius: "0px",
          fontFamily: '"General Sans", sans-serif',
        },
      }}
    >
      <html lang="en" className={jetbrainsMono.variable}>
        <body
          className={`sb-root ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
