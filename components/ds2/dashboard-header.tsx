"use client"

import React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ZapIcon } from "@hugeicons/core-free-icons"
import { NotificationBell } from "@/components/ds2/notification-bell"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface BreadcrumbEntry {
  label: string
  href?: string
}

interface DashboardHeaderProps {
  breadcrumbs: BreadcrumbEntry[]
  credits: number
  plan?: "Free" | "Starter" | "Professional" | "Enterprise"
  actionButtons?: React.ReactNode
}

export function DashboardHeader({
  breadcrumbs,
  credits,
  plan,
  actionButtons,
}: DashboardHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between h-12 lg:h-16 px-3 lg:px-8 border-b"
      style={{
        background: "rgba(7, 26, 38, 0.95)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        borderColor: "rgba(244, 185, 100, 0.08)",
      }}
    >
      {/* Left side: mobile trigger + breadcrumbs */}
      <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
        <SidebarTrigger className="lg:hidden flex-shrink-0" />

        <Breadcrumb className="min-w-0">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1
              // On mobile, only show the last breadcrumb to save space
              const mobileHidden = !isLast && breadcrumbs.length > 1

              return (
                <React.Fragment key={i}>
                  <BreadcrumbItem className={mobileHidden ? "hidden lg:inline-flex" : "min-w-0"}>
                    {isLast ? (
                      <BreadcrumbPage className="truncate max-w-[180px] lg:max-w-none">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href ?? "/dashboard"} className="truncate">
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className={mobileHidden ? "hidden lg:inline-flex" : ""} />
                  )}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side: plan, credits, actions, notifications */}
      <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
        {/* Plan badge — hidden on mobile, icon-only would be too ambiguous */}
        {plan && (
          <div
            className="hidden sm:block px-3 py-1.5 sb-label"
            style={{
              background: "rgba(244, 185, 100, 0.08)",
              border: "1px solid rgba(244, 185, 100, 0.12)",
              color: "#f4b964",
              letterSpacing: "0.08em",
            }}
          >
            {plan}
          </div>
        )}

        {/* Credits indicator — compact on mobile */}
        <Link
          href="/dashboard/billing"
          className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 border border-[rgba(244,185,100,0.12)] transition-all duration-200 hover:border-[rgba(244,185,100,0.22)] hover:-translate-y-px active:translate-y-px"
          style={{
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <HugeiconsIcon
            icon={ZapIcon}
            strokeWidth={2}
            className="size-3.5 lg:size-4"
            style={{ color: "#f4b964" }}
          />
          <span className="sb-data text-xs lg:text-sm" style={{ color: "#f4b964" }}>
            {credits}
          </span>
        </Link>

        {/* Page-specific action buttons */}
        {actionButtons}

        {/* Notification bell */}
        <NotificationBell />
      </div>
    </header>
  )
}
