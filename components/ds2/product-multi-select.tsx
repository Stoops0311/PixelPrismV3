"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, ArrowDown01Icon, Add01Icon } from "@hugeicons/core-free-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ColorGrid } from "@/components/ds2/color-grid"
import type { Product } from "@/types/dashboard"

// ── Types ────────────────────────────────────────────────────────────────

interface ProductMultiSelectProps {
  products: Product[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  /** "form" = full-width with chips, "filter" = 180px with text summary */
  variant: "form" | "filter"
  onAddProduct?: () => void
  disabled?: boolean
  className?: string
}

// ── Chip ─────────────────────────────────────────────────────────────────

function Chip({
  product,
  onRemove,
  isFilter,
}: {
  product: Product
  onRemove: () => void
  isFilter?: boolean
}) {
  return (
    <span
      className="sb-product-chip"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 4px 2px 3px",
        background: "rgba(244,185,100,0.08)",
        border: "1px solid rgba(244,185,100,0.14)",
        fontSize: 11,
        color: "#d4dce2",
        fontFamily: "'General Sans', sans-serif",
        fontWeight: 500,
        maxWidth: 120,
        animation: "sb-chip-in 250ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        flexShrink: 0,
      }}
    >
      <ColorGrid colors={product.colorGrid} size={12} />
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: isFilter ? 60 : 80,
        }}
      >
        {product.name}
      </span>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        style={{
          display: "flex",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          color: "rgba(244,185,100,0.5)",
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        <HugeiconsIcon icon={Cancel01Icon} size={9} />
      </button>
    </span>
  )
}

function MoreChip({ count }: { count: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 6px",
        background: "rgba(244,185,100,0.04)",
        border: "1px solid rgba(244,185,100,0.08)",
        fontSize: 11,
        color: "#6d8d9f",
        fontFamily: "'JetBrains Mono', monospace",
        flexShrink: 0,
      }}
    >
      +{count}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export function ProductMultiSelect({
  products,
  selectedIds,
  onSelectionChange,
  variant,
  onAddProduct,
  disabled = false,
  className,
}: ProductMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  // Snapshot of selected IDs at open time — selected items are sorted to top once on open
  const [openSnapshot, setOpenSnapshot] = useState<string[]>([])

  // Auto-focus search when popover opens
  useEffect(() => {
    if (open) {
      setOpenSnapshot(selectedIds)
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearch("")
    }
  }, [open]) // intentionally only on open change

  const selectedProducts = useMemo(
    () => products.filter((p) => selectedIds.includes(p.id)),
    [products, selectedIds]
  )

  // Stable sorted list: selected first (by order at open time), then unselected
  const sortedProducts = useMemo(() => {
    const selectedSet = new Set(openSnapshot)
    const sel = products.filter((p) => selectedSet.has(p.id))
    const unsel = products.filter((p) => !selectedSet.has(p.id))
    return [...sel, ...unsel]
  }, [products, openSnapshot])

  const filtered = useMemo(() => {
    if (!search.trim()) return sortedProducts
    const q = search.toLowerCase()
    return sortedProducts.filter((p) => p.name.toLowerCase().includes(q))
  }, [sortedProducts, search])

  const toggle = useCallback(
    (id: string) => {
      if (selectedIds.includes(id)) {
        onSelectionChange(selectedIds.filter((x) => x !== id))
      } else {
        onSelectionChange([...selectedIds, id])
      }
    },
    [selectedIds, onSelectionChange]
  )

  // Keyboard: Backspace in empty search removes last chip
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && search === "" && selectedIds.length > 0) {
        onSelectionChange(selectedIds.slice(0, -1))
      }
      if (e.key === "Escape") setOpen(false)
    },
    [search, selectedIds, onSelectionChange]
  )

  // ── Trigger content ──────────────────────────────────────────────────

  function renderTrigger() {
    if (variant === "filter") {
      // Filter variant: fixed width, text-only summary
      return (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          style={{
            width: 180,
            minHeight: 40,
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(244,185,100,0.12)",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: 13,
            color: selectedIds.length > 0 ? "#d4dce2" : "#6d8d9f",
            fontFamily: "'General Sans', sans-serif",
            transition: "border-color 200ms ease",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selectedIds.length === 0
              ? "All Products"
              : selectedIds.length === 1
                ? selectedProducts[0]?.name ?? "1 product"
                : `${selectedIds.length} products`}
          </span>
          <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="#6d8d9f" />
        </button>
      )
    }

    // Form variant: full width with chips
    return (
      <div
        role="combobox"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={() => { if (!disabled) setOpen((v) => !v) }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!disabled) setOpen((v) => !v) } }}
        style={{
          width: "100%",
          minHeight: 40,
          padding: "6px 8px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${open ? "rgba(244,185,100,0.22)" : "rgba(244,185,100,0.12)"}`,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "border-color 200ms ease",
          textAlign: "left",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {selectedProducts.length === 0 ? (
          <span style={{ fontSize: 13, color: "#6d8d9f", fontFamily: "'General Sans', sans-serif" }}>
            Select products...
          </span>
        ) : selectedProducts.length <= 2 ? (
          selectedProducts.map((p) => (
            <Chip key={p.id} product={p} onRemove={() => toggle(p.id)} />
          ))
        ) : (
          <>
            <Chip product={selectedProducts[0]} onRemove={() => toggle(selectedProducts[0].id)} />
            <MoreChip count={selectedProducts.length - 1} />
          </>
        )}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          color="#6d8d9f"
          style={{ marginLeft: "auto", flexShrink: 0 }}
        />
      </div>
    )
  }

  // ── Empty state ──────────────────────────────────────────────────────

  if (products.length === 0) {
    return (
      <div
        aria-disabled="true"
        className={className}
        style={{
          width: variant === "filter" ? 180 : "100%",
          minHeight: 40,
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(244,185,100,0.08)",
          cursor: "default",
          fontSize: 13,
          color: "#6d8d9f",
          fontFamily: "'General Sans', sans-serif",
          opacity: 0.6,
        }}
      >
        {onAddProduct ? (
          <button
            type="button"
            onClick={onAddProduct}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "rgba(244,185,100,0.7)",
              fontSize: 13,
              fontFamily: "'General Sans', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <HugeiconsIcon icon={Add01Icon} size={13} />
            Add your first product
          </button>
        ) : (
          "No products yet"
        )}
      </div>
    )
  }

  // ── Full render ──────────────────────────────────────────────────────

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <span style={{ display: "block" }}>{renderTrigger()}</span>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        style={{
          width: variant === "filter" ? 220 : 280,
          padding: 0,
          background: "#0e2838",
          border: "1px solid rgba(244,185,100,0.14)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
          animation: "sb-popover-in 100ms ease both",
          overflow: "hidden",
        }}
      >
        {/* Search input */}
        <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(244,185,100,0.08)" }}>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search products..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(244,185,100,0.10)",
              padding: "5px 8px",
              fontSize: 12,
              color: "#d4dce2",
              fontFamily: "'General Sans', sans-serif",
              outline: "none",
            }}
          />
        </div>

        {/* Product list */}
        <div style={{ maxHeight: 260, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "12px 12px", fontSize: 12, color: "#6d8d9f", fontFamily: "'General Sans', sans-serif" }}>
              No products match &ldquo;{search}&rdquo;
              {onAddProduct && (
                <button
                  type="button"
                  onClick={() => { setOpen(false); onAddProduct() }}
                  style={{
                    display: "block",
                    marginTop: 6,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: "rgba(244,185,100,0.7)",
                    fontSize: 12,
                    fontFamily: "'General Sans', sans-serif",
                  }}
                >
                  + Add as product
                </button>
              )}
            </div>
          ) : (
            filtered.map((product) => {
              const isSelected = selectedIds.includes(product.id)
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggle(product.id)}
                  className="sb-multi-select-item"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    background: isSelected ? "rgba(244,185,100,0.05)" : "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(244,185,100,0.04)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 150ms ease",
                  }}
                >
                  {/* Checkbox */}
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      border: `1px solid ${isSelected ? "#f4b964" : "rgba(244,185,100,0.25)"}`,
                      background: isSelected ? "#f4b964" : "transparent",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 150ms ease",
                    }}
                  >
                    {isSelected && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="#071a26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  {/* Color grid swatch */}
                  <ColorGrid colors={product.colorGrid} size={20} />
                  {/* Name */}
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: isSelected ? "#eaeef1" : "#d4dce2",
                      fontFamily: "'General Sans', sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      transition: "color 150ms ease",
                    }}
                  >
                    {product.name}
                  </span>
                  {/* Image count badge */}
                  <span
                    style={{
                      fontSize: 10,
                      color: "#6d8d9f",
                      fontFamily: "'JetBrains Mono', monospace",
                      flexShrink: 0,
                    }}
                  >
                    {product.imageCount}
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* Footer — form variant only */}
        {variant === "form" && onAddProduct && (
          <div style={{ borderTop: "1px solid rgba(244,185,100,0.08)" }}>
            <button
              type="button"
              onClick={() => { setOpen(false); onAddProduct() }}
              style={{
                width: "100%",
                padding: "9px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                color: "rgba(244,185,100,0.7)",
                fontFamily: "'General Sans', sans-serif",
                textAlign: "left",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#f4b964" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(244,185,100,0.7)" }}
            >
              <HugeiconsIcon icon={Add01Icon} size={12} />
              New Product
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
