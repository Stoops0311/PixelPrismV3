"use client"

/**
 * Mock Clerk components for local testing without Clerk env vars.
 * Replace imports from "@clerk/nextjs" with "@/lib/clerk-mock" to bypass auth.
 */

import { ReactNode } from "react"

export function ClerkProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function SignedIn({ children }: { children: ReactNode }) {
  // Show signed-in content (pretend user is signed in)
  return <>{children}</>
}

export function SignedOut({ children }: { children: ReactNode }) {
  // Hide signed-out content
  return null
}

export function SignIn() {
  return <div style={{ color: "#6d8d9f", padding: 40 }}>Sign-in disabled (Clerk mocked)</div>
}

export function SignUp() {
  return <div style={{ color: "#6d8d9f", padding: 40 }}>Sign-up disabled (Clerk mocked)</div>
}

export function UserButton() {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "rgba(244,185,100,0.12)",
        border: "1px solid rgba(244,185,100,0.2)",
      }}
    />
  )
}

export function useClerk() {
  return {
    openUserProfile: () => {},
    openSignIn: () => {},
    openSignUp: () => {},
    signOut: () => {},
  }
}

export function useAuth() {
  return {
    isLoaded: true,
    isSignedIn: true,
    userId: "mock-user-id",
    sessionId: "mock-session-id",
    getToken: async () => "mock-token",
  }
}

export function useUser() {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: "mock-user-id",
      firstName: "Test",
      lastName: "User",
      fullName: "Test User",
      primaryEmailAddress: { emailAddress: "test@example.com" },
      imageUrl: undefined,
    },
  }
}
