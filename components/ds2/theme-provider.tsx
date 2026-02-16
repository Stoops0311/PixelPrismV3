"use client"

import * as React from "react"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

function DS2ThemeProvider({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("min-h-screen relative", className)}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: 0,
            borderTop: "1px solid rgba(244,185,100, 0.10)",
            borderRight: "1px solid rgba(244,185,100, 0.10)",
            borderBottom: "1px solid rgba(244,185,100, 0.10)",
            backgroundColor: "#0e2838",
            color: "#eaeef1",
            fontFamily: "'General Sans', sans-serif",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          },
        }}
      />
      {children}
    </div>
  )
}

export { DS2ThemeProvider }
