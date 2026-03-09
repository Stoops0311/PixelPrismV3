"use client"

import { useState, useCallback } from "react"
import type { UpgradeContext } from "@/lib/polar"

export function useUpgradeDialog() {
  const [open, setOpen] = useState(false)
  const [context, setContext] = useState<UpgradeContext | null>(null)

  const showUpgrade = useCallback((ctx: UpgradeContext) => {
    setContext(ctx)
    setOpen(true)
  }, [])

  return { open, onOpenChange: setOpen, context, showUpgrade }
}
