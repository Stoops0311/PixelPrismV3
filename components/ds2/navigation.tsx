"use client"

import * as React from "react"

interface NavItem {
  label: string
  href: string
}

function DS2Navigation({
  logo = "/main-logo.png",
  brandName = "PixelPrism",
  items = [],
  actions,
}: {
  logo?: string
  brandName?: string
  items?: NavItem[]
  actions?: React.ReactNode
}) {
  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(244,185,100,0.08)] bg-[#071a26]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <img src={logo} alt={brandName} className="h-8 w-auto" />
          <span className="sb-h3" style={{ fontSize: 18, color: "#eaeef1" }}>
            {brandName}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="sb-nav sb-nav-link cursor-pointer"
            >
              {item.label}
            </a>
          ))}
          {actions}
        </div>
      </div>
    </nav>
  )
}

export { DS2Navigation }
export type { NavItem }
