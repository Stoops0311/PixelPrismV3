"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

type NavLink = {
  label: string
  /** href when on homepage (anchor scroll) */
  homepageHref?: string
  /** href when on other pages (route) */
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "/#features", homepageHref: "#features" },
  { label: "How It Works", href: "/#how-it-works", homepageHref: "#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
]

export function HomepageNav() {
  const [filled, setFilled] = useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setFilled(window.scrollY > 80)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: filled ? "rgba(7,26,38,0.97)" : "transparent",
        backdropFilter: filled ? "blur(8px)" : "none",
        borderBottom: filled ? "1px solid rgba(244,185,100,0.08)" : "1px solid transparent",
        transition: "background 300ms ease, border-color 300ms ease",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 2rem",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo + Brand */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/main-logo-no-text.png" alt="" style={{ height: "2.5rem", width: "2.5rem", objectFit: "contain" }} />
          <span className="sb-h3" style={{ fontSize: 20, color: "#eaeef1" }}>PixelPrism</span>
        </Link>

        {/* Nav links (hidden on mobile) + Auth */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {/* Nav links — hidden below md */}
          <div className="hidden md:flex items-center" style={{ gap: "2rem" }}>
            {NAV_LINKS.map((link) => {
              const resolvedHref = isHomepage && link.homepageHref ? link.homepageHref : link.href
              const isHashLink = resolvedHref.startsWith("#")
              const isActive = !isHashLink && pathname === link.href

              if (isHashLink) {
                return (
                  <a
                    key={link.label}
                    href={resolvedHref}
                    className="sb-nav sb-nav-link"
                    style={{
                      color: "#6d8d9f",
                      textDecoration: "none",
                      transition: "color 200ms ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#f4b964"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#6d8d9f"
                    }}
                  >
                    {link.label}
                  </a>
                )
              }

              return (
                <Link
                  key={link.label}
                  href={resolvedHref}
                  className="sb-nav sb-nav-link"
                  style={{
                    color: isActive ? "#f4b964" : "#6d8d9f",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f4b964"
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#6d8d9f"
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Auth buttons */}
          <SignedOut>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link href="/sign-in">
                <Button className="sb-btn-ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="sb-btn-primary" style={{ padding: "8px 20px" }}>
                  Get Started
                </Button>
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}
