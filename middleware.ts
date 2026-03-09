// Clerk middleware disabled for local testing
// Original: import { clerkMiddleware } from "@clerk/nextjs/server"
// Original: export default clerkMiddleware()
// See lib/convex-mock.ts for full undo instructions.

import { NextResponse } from "next/server"

export default function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|otf|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
