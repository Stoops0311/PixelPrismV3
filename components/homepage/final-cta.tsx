"use client"

import Link from "next/link"
import { SignedIn, SignedOut } from "@/lib/clerk-mock"
import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section
      style={{
        padding: "200px 0",
        background:
          "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(244,185,100,0.06) 0%, transparent 70%), #071a26",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Decorative rule */}
        <div
          style={{
            width: 80,
            height: 2,
            background: "linear-gradient(90deg, transparent, #f4b964, transparent)",
            margin: "0 auto 56px",
          }}
        />

        {/* Label */}
        <p className="sb-label" style={{ color: "#e8956a", marginBottom: 28, letterSpacing: "0.15em" }}>
          GET STARTED
        </p>

        {/* Heading — BIG */}
        <h2
          className="cta-heading"
          style={{
            color: "#eaeef1",
            fontSize: 56,
            fontFamily: "'Neue Montreal', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            maxWidth: 700,
            margin: 0,
            lineHeight: 1.08,
          }}
        >
          Stop juggling tools.<br />
          <span style={{ color: "#f4b964" }}>Start creating.</span>
        </h2>

        {/* Subtext */}
        <p
          className="sb-body cta-subtext"
          style={{
            color: "#6d8d9f",
            maxWidth: 520,
            marginTop: 24,
            marginBottom: 48,
            fontSize: 17,
            lineHeight: 1.6,
          }}
        >
          Join thousands of businesses using PixelPrism to create, schedule, and
          grow their social presence — all in one place.
        </p>

        {/* CTA buttons — LARGE */}
        <div
          className="cta-buttons"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <SignedOut>
            <Link href="/sign-up">
              <Button
                className="sb-btn-primary"
                style={{ padding: "20px 56px", fontSize: 17 }}
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button className="sb-btn-ghost" style={{ fontSize: 16, padding: "16px 24px" }}>
                View Pricing <span className="sb-arrow">→</span>
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button
                className="sb-btn-primary"
                style={{ padding: "20px 56px", fontSize: 17 }}
              >
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/pricing">
              <Button className="sb-btn-ghost" style={{ fontSize: 16, padding: "16px 24px" }}>
                View Pricing <span className="sb-arrow">→</span>
              </Button>
            </Link>
          </SignedIn>
        </div>

        {/* Footnote */}
        <p
          className="sb-caption cta-footnote"
          style={{ color: "#6d8d9f", marginTop: 28, opacity: 0.7 }}
        >
          No credit card required · Free plan available · Cancel anytime
        </p>
      </div>
    </section>
  )
}
