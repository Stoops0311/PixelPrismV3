"use client"

import { ReactNode } from "react"

// ── CONVEX + CLERK MOCKED OUT FOR LOCAL UI TESTING ──────────────────────────
// Original code:
//   import { ConvexReactClient } from "convex/react"
//   import { ConvexProviderWithClerk } from "convex/react-clerk"
//   import { useAuth } from "@clerk/nextjs"
//   const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
//   export function ConvexClientProvider({ children }: { children: ReactNode }) {
//     return (
//       <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
//         {children}
//       </ConvexProviderWithClerk>
//     )
//   }
// To restore: uncomment above, delete passthrough below.
// See lib/convex-mock.ts for full undo instructions.
// ─────────────────────────────────────────────────────────────────────────────

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
