"use client"

import React from "react"

/**
 * Mobile section wrapper that adjusts spacing and padding for narrow viewports.
 * On desktop (lg+), renders children with normal spacing.
 * On mobile, uses tighter vertical rhythm and reduced horizontal padding.
 */
export function MobileSection({
  children,
  label,
  title,
  className = "",
}: {
  children: React.ReactNode
  label?: string
  title?: string
  className?: string
}) {
  return (
    <section className={className}>
      {(label || title) && (
        <div style={{ marginBottom: 16 }}>
          {label && (
            <p
              className="sb-label"
              style={{ color: "#e8956a", marginBottom: 4 }}
            >
              {label}
            </p>
          )}
          {title && (
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#eaeef1",
                fontFamily: "'Neue Montreal', sans-serif",
                lineHeight: 1.2,
              }}
              className="lg:sb-h3"
            >
              {title}
            </h3>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/**
 * Mobile page container with responsive spacing.
 * space-y-32 (128px) on desktop → space-y-10 (40px) on mobile.
 * px-8 (32px) on desktop → px-4 (16px) on mobile.
 */
export function MobilePageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 lg:px-8 space-y-10 lg:space-y-32 py-6 lg:py-16">
      {children}
    </div>
  )
}
