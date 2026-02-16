"use client"

import * as React from "react"
import { DS2ThemeProvider } from "./theme-provider"
import { DS2Navigation, type NavItem } from "./navigation"

function DS2PageLayout({
  children,
  showNav = true,
  navItems = [],
  logo,
  brandName,
  navActions,
}: {
  children: React.ReactNode
  showNav?: boolean
  navItems?: NavItem[]
  logo?: string
  brandName?: string
  navActions?: React.ReactNode
}) {
  return (
    <DS2ThemeProvider>
      {showNav && (
        <DS2Navigation
          items={navItems}
          logo={logo}
          brandName={brandName}
          actions={navActions}
        />
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 space-y-32">
        {children}
      </div>
    </DS2ThemeProvider>
  )
}

export { DS2PageLayout }
