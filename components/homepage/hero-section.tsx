"use client"

import { useRef } from "react"
import Link from "next/link"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!prefersReduced) {
      const textTl = gsap.timeline({ delay: 0.2 })
      textTl
        .from(".hero-overline", {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power2.out",
        })
        .from(
          ".hero-h1",
          { opacity: 0, y: 30, duration: 0.7, ease: "power2.out" },
          "-=0.2"
        )
        .from(
          ".hero-subhead",
          { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        )
        .from(
          ".hero-ctas",
          { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        )
        .from(
          ".hero-social-proof",
          { opacity: 0, duration: 0.4, ease: "power2.out" },
          "-=0.1"
        )
    }
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "#071a26",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        textAlign: "center",
      }}
    >
      {/* Radial background glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 50% 60% at 50% 45%, rgba(244,185,100,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "0 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Overline */}
        <p
          className="sb-label hero-overline"
          style={{ color: "#e8956a", marginBottom: 28 }}
        >
          Social Media Marketing
        </p>

        {/* H1 */}
        <h1
          className="sb-display hero-h1"
          style={{ color: "#eaeef1", marginBottom: 28, lineHeight: 0.95 }}
        >
          Your brand,{" "}
          <br />
          <span style={{ color: "#f4b964" }}>amplified.</span>
        </h1>

        {/* Subhead */}
        <p
          className="sb-body hero-subhead"
          style={{
            color: "#6d8d9f",
            maxWidth: 520,
            margin: "0 auto",
            fontSize: 19,
            lineHeight: 1.6,
            marginBottom: 48,
          }}
        >
          AI-powered visuals. Smart scheduling. One dashboard.
          <br />
          Everything your brand needs to grow on social media.
        </p>

        {/* CTA row */}
        <div
          className="hero-ctas"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          <SignedOut>
            <Link href="/sign-up">
              <Button
                className="sb-btn-primary"
                style={{ padding: "18px 48px", fontSize: 16 }}
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button className="sb-btn-ghost" style={{ fontSize: 15 }}>
                View Pricing{" "}
                <span className="sb-arrow" style={{ marginLeft: 4 }}>
                  →
                </span>
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button
                className="sb-btn-primary"
                style={{ padding: "18px 48px", fontSize: 16 }}
              >
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>

        {/* Social proof */}
        <p
          className="sb-caption hero-social-proof"
          style={{ color: "#6d8d9f", opacity: 0.7 }}
        >
          No credit card required · Used by 2,000+ businesses
        </p>
      </div>

      {/* Bouncy scroll indicator */}
      <div
        aria-hidden
        className="hero-scroll-hint"
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          animation: "hero-bounce 2s ease-in-out infinite",
          cursor: "pointer",
        }}
        onClick={() => {
          document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
        }}
      >
        <span className="sb-caption" style={{ color: "#6d8d9f", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Scroll
        </span>
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none" style={{ opacity: 0.6 }}>
          <path d="M10 4 L10 20" stroke="#f4b964" strokeWidth="1.5" />
          <path d="M4 15 L10 22 L16 15" stroke="#f4b964" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </div>

      {/* Bottom divider */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "rgba(244,185,100,0.08)",
        }}
      />
    </section>
  )
}
