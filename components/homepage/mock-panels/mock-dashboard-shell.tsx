"use client"

import type { ReactNode } from "react"

interface MockDashboardShellProps {
  children?: ReactNode
  activePage?: "studio" | "scheduling" | "analytics" | "brands"
}

const navItems = [
  { id: "studio",     icon: "✦", label: "Studio" },
  { id: "scheduling", icon: "◈", label: "Schedule" },
  { id: "analytics",  icon: "◎", label: "Analytics" },
  { id: "brands",     icon: "▣", label: "Products" },
  { id: "settings",   icon: "⊙", label: "Settings" },
] as const

export function MockDashboardShell({ children, activePage }: MockDashboardShellProps) {
  const pageLabel = activePage
    ? activePage.charAt(0).toUpperCase() + activePage.slice(1)
    : "Dashboard"

  return (
    <div
      aria-hidden="true"
      className="mock-panel-shell"
      style={{ fontFamily: "'General Sans', sans-serif" }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="mock-sidebar">
        {/* Brand identity block */}
        <div
          style={{
            padding: "12px 16px 16px",
            borderBottom: "1px solid rgba(244,185,100,0.08)",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Initials square */}
            <div
              style={{
                width: 28,
                height: 28,
                background: "#f4b964",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 9,
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 700,
                color: "#071a26",
                letterSpacing: "0.04em",
              }}
            >
              SC
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 500,
                  color: "#eaeef1",
                  lineHeight: 1.2,
                  letterSpacing: "0.02em",
                }}
              >
                Sunrise Coffee Co
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#6d8d9f",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 500,
                  marginTop: 1,
                }}
              >
                Pro Plan
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`mock-nav-item${activePage === item.id ? " active" : ""}`}
            >
              <span style={{ fontSize: 11, lineHeight: 1, opacity: activePage === item.id ? 1 : 0.7 }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid rgba(244,185,100,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 22,
              height: 22,
              background: "#163344",
              border: "1px solid rgba(244,185,100,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              fontFamily: "'Neue Montreal', sans-serif",
              fontWeight: 700,
              color: "#6d8d9f",
              flexShrink: 0,
            }}
          >
            SM
          </div>
          <span
            style={{
              fontSize: 10,
              color: "#6d8d9f",
              fontFamily: "'General Sans', sans-serif",
            }}
          >
            Sarah M.
          </span>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Header */}
        <header className="mock-header">
          {/* Breadcrumb */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              color: "#6d8d9f",
              fontFamily: "'General Sans', sans-serif",
            }}
          >
            <span style={{ color: "#6d8d9f" }}>Sunrise Coffee Co</span>
            <span style={{ color: "rgba(244,185,100,0.22)" }}>/</span>
            <span style={{ color: "#eaeef1" }}>{pageLabel}</span>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* PRO badge */}
            <div
              style={{
                background: "#f4b964",
                color: "#071a26",
                fontSize: 8,
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                padding: "2px 6px",
                lineHeight: 1.4,
              }}
            >
              PRO
            </div>
            {/* Credits */}
            <span
              style={{
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: "#6d8d9f",
                letterSpacing: "0.02em",
              }}
            >
              84 credits
            </span>
          </div>
        </header>

        {/* Content area */}
        <main className="mock-content" style={{ overflow: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
