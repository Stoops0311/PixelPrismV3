"use client"

import Link from "next/link"

const FOOTER_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

export function MarketingFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(244,185,100,0.08)",
        padding: "40px 0",
        background: "#071a26",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/main-logo-no-text.png" alt="" style={{ height: 28, width: 28, objectFit: "contain" }} />
          <span className="sb-h4" style={{ color: "#eaeef1", fontSize: 16 }}>PixelPrism</span>
        </div>
        <p className="sb-caption" style={{ color: "#6d8d9f" }}>
          &copy; {new Date().getFullYear()} PixelPrism. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="sb-caption"
              style={{
                color: "#6d8d9f",
                textDecoration: "none",
                transition: "color 200ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f4b964")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6d8d9f")}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
