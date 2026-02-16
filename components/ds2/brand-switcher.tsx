"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { UnfoldMoreIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import type { Brand } from "@/types/dashboard"

interface BrandSwitcherProps {
  brands: Brand[]
  currentBrand: Brand | null
  onBrandChange: (brandSlug: string) => void
}

export function BrandSwitcher({ brands, currentBrand, onBrandChange }: BrandSwitcherProps) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`w-full flex items-center p-2 transition-all duration-200 hover:bg-[rgba(244,185,100,0.02)] outline-none cursor-pointer ${collapsed ? "justify-center" : "gap-3"}`}
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback
                style={{
                  background: "#163344",
                  color: "#f4b964",
                  border: "1px solid rgba(244,185,100,0.12)",
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                {currentBrand?.initials ?? "?"}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="right" hidden={!collapsed}>
            {currentBrand?.name ?? "Select Brand"}
          </TooltipContent>
        </Tooltip>

        {!collapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <div className="sb-h4 truncate" style={{ color: "#eaeef1" }}>
                {currentBrand?.name ?? "Select Brand"}
              </div>
              <div className="flex items-center gap-1" style={{ color: "#6d8d9f", fontSize: "11px" }}>
                <span className="sb-data" style={{ fontSize: "11px" }}>
                  {currentBrand?.followers.toLocaleString() ?? "0"}
                </span>
                <span style={{ fontFamily: "'General Sans', sans-serif" }}>
                  followers
                </span>
              </div>
            </div>
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              strokeWidth={2}
              className="size-4 shrink-0"
              style={{ color: "#6d8d9f" }}
            />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side={collapsed ? "right" : "bottom"}
        className="w-[240px]"
      >
        <DropdownMenuLabel
          className="sb-label"
          style={{ color: "#6d8d9f", fontSize: "11px" }}
        >
          Switch Brand
        </DropdownMenuLabel>

        {brands.map((brand) => (
          <DropdownMenuItem
            key={brand.id}
            onClick={() => onBrandChange(brand.slug)}
            className="flex items-center gap-3 py-2.5 cursor-pointer"
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback
                style={{
                  background: "#163344",
                  color: currentBrand?.id === brand.id ? "#f4b964" : "#6d8d9f",
                  border: "1px solid rgba(244,185,100,0.12)",
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 700,
                  fontSize: "11px",
                }}
              >
                {brand.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="sb-h4 truncate" style={{ color: "#eaeef1", fontSize: "14px" }}>
                {brand.name}
              </div>
            </div>
            <span
              className="sb-data shrink-0"
              style={{ color: "#6d8d9f", fontSize: "11px" }}
            >
              {brand.followers.toLocaleString()}
            </span>
          </DropdownMenuItem>
        ))}

        <Separator className="my-1" />

        <DropdownMenuItem className="flex items-center gap-2 py-3 cursor-pointer">
          <HugeiconsIcon
            icon={PlusSignIcon}
            strokeWidth={2}
            className="size-4"
            style={{ color: "#f4b964" }}
          />
          <span style={{ color: "#f4b964", fontFamily: "'General Sans', sans-serif", fontSize: "13px" }}>
            Create New Brand
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
