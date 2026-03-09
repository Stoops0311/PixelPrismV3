"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, UserButton } from "@/lib/clerk-mock"
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setFilled(window.scrollY > 80)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [mobileOpen])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

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

          {/* Auth buttons — hidden on mobile */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.75rem" }}>
            <SignedOut>
              <Link href="/sign-in">
                <Button className="sb-btn-ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="sb-btn-primary" style={{ padding: "8px 20px" }}>
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Hamburger — visible on mobile only */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 22,
                height: 2,
                background: "#eaeef1",
                borderRadius: 1,
                transition: "transform 200ms ease, opacity 200ms ease",
                transform: mobileOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
              }}
            />
            <span
              style={{
                width: 22,
                height: 2,
                background: "#eaeef1",
                borderRadius: 1,
                transition: "opacity 200ms ease",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: 22,
                height: 2,
                background: "#eaeef1",
                borderRadius: 1,
                transition: "transform 200ms ease, opacity 200ms ease",
                transform: mobileOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile slide-down menu */}
        {mobileOpen && (
          <div
            className="md:hidden"
            style={{
              position: "absolute",
              top: "4rem",
              left: 0,
              right: 0,
              background: "rgba(7, 26, 38, 0.98)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(244, 185, 100, 0.08)",
              padding: "1rem 1.5rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            {NAV_LINKS.map((link) => {
              const resolvedHref = isHomepage && link.homepageHref ? link.homepageHref : link.href
              const isHashLink = resolvedHref.startsWith("#")
              const isActive = !isHashLink && pathname === link.href

              if (isHashLink) {
                return (
                  <a
                    key={link.label}
                    href={resolvedHref}
                    onClick={closeMobile}
                    style={{
                      display: "block",
                      padding: "12px 0",
                      color: "#6d8d9f",
                      textDecoration: "none",
                      fontSize: 16,
                      fontWeight: 500,
                      borderBottom: "1px solid rgba(244, 185, 100, 0.06)",
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
                  onClick={closeMobile}
                  style={{
                    display: "block",
                    padding: "12px 0",
                    color: isActive ? "#f4b964" : "#6d8d9f",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: 500,
                    borderBottom: "1px solid rgba(244, 185, 100, 0.06)",
                  }}
                >
                  {link.label}
                </Link>
              )
            })}

            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem" }}>
              <Link href="/sign-in" onClick={closeMobile} style={{ flex: 1 }}>
                <Button className="sb-btn-ghost" style={{ width: "100%" }}>Sign In</Button>
              </Link>
              <Link href="/sign-up" onClick={closeMobile} style={{ flex: 1 }}>
                <Button className="sb-btn-primary" style={{ width: "100%", padding: "8px 20px" }}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
