"use client"

import { useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Button } from "@/components/ui/button"
import { MockStudio } from "@/components/homepage/mock-panels/mock-studio"
import { MockCalendar } from "@/components/homepage/mock-panels/mock-calendar"
import { MockAnalytics } from "@/components/homepage/mock-panels/mock-analytics"
import { MockBrandSwitcher } from "@/components/homepage/mock-panels/mock-brand-switcher"

gsap.registerPlugin(ScrollTrigger)

interface FeatureEntry {
  id: string
  layout: "text-left" | "text-right"
  label: string
  heading: string
  body: string
  bullets: string[]
  mock: React.ReactNode
  accent: string
}

const features: FeatureEntry[] = [
  {
    id: "ai-studio",
    layout: "text-left",
    label: "AI STUDIO",
    heading: "Professional product shots without a photographer",
    body: "Describe your shot, pick a style, generate. PixelPrism's AI creates studio-quality product images from your product photos — no lighting rigs, no retouchers, no waiting.",
    bullets: [
      "Generates in seconds, not days",
      "Product Shot, Lifestyle, Flat Lay, Abstract styles",
      "Every aspect ratio: Instagram, TikTok, LinkedIn, Pinterest",
      "Batch generate 10 images at once",
    ],
    mock: <MockStudio />,
    accent: "#f4b964",
  },
  {
    id: "scheduling",
    layout: "text-right",
    label: "SCHEDULING",
    heading: "Plan, schedule, and publish across every platform",
    body: "One calendar. Four platforms. Zero extra tabs. See your entire content pipeline at a glance and schedule posts to Instagram, Facebook, LinkedIn, and Pinterest in one click.",
    bullets: [
      "Drag-to-schedule on visual calendar",
      "Multi-platform publishing simultaneously",
      "Best-time recommendations per platform",
      "Draft, schedule, or post immediately",
    ],
    mock: <MockCalendar />,
    accent: "#64dcf4",
  },
  {
    id: "analytics",
    layout: "text-left",
    label: "ANALYTICS",
    heading: "Data-driven decisions, not guesswork",
    body: "Know exactly which content drives real engagement. Track follower growth, engagement rates, and top-performing posts across all platforms — with AI insights that tell you what to do next.",
    bullets: [
      "Follower growth tracking across platforms",
      "Engagement breakdown: likes, comments, shares, saves",
      "Top-performing content identification",
      "AI-powered recommendations",
    ],
    mock: <MockAnalytics />,
    accent: "#e8956a",
  },
  {
    id: "multi-brand",
    layout: "text-right",
    label: "MULTI-BRAND",
    heading: "One dashboard for all your brands",
    body: "Whether you're running one brand or five, PixelPrism keeps everything separate but accessible. Switch brands in one click, manage different social accounts, and track performance across all of them.",
    bullets: [
      "Separate analytics and calendars per brand",
      "Independent social account connections",
      "One-click brand switching",
      "Agency-ready brand organization",
    ],
    mock: <MockBrandSwitcher />,
    accent: "#a4f464",
  },
]

export function FeatureDeepDives() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      if (prefersReduced) return

      // Section header entrance
      gsap.from(".fdd-header", {
        scrollTrigger: {
          trigger: ".fdd-header",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power2.out",
      })

      // Per-feature reveal animations
      features.forEach((feature) => {
        const rowSelector = `.feature-row-${feature.id}`
        const isTextLeft = feature.layout === "text-left"

        // Text side slides in from its direction
        gsap.from(`${rowSelector} .feature-text`, {
          scrollTrigger: {
            trigger: rowSelector,
            start: "top 70%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          x: isTextLeft ? -50 : 50,
          duration: 0.8,
          ease: "power2.out",
        })

        // Mock side slides in from the opposite direction
        gsap.from(`${rowSelector} .feature-mock`, {
          scrollTrigger: {
            trigger: rowSelector,
            start: "top 70%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          x: isTextLeft ? 60 : -60,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.1,
        })

        // Subtle bullet stagger (only if text is in DOM and accessible)
        gsap.from(`${rowSelector} .feature-bullet`, {
          scrollTrigger: {
            trigger: rowSelector,
            start: "top 60%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          x: isTextLeft ? -20 : 20,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          delay: 0.3,
        })
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="features"
      style={{
        padding: "40px 0 120px",
        background: "#071a26",
        position: "relative",
      }}
    >
      {/* Subtle top edge */}
      <div
        aria-hidden
        style={{
          height: 1,
          background: "rgba(244,185,100,0.06)",
          marginBottom: 0,
        }}
      />

      {/* Inner max-width wrapper */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 48px",
        }}
      >
        {/* Section header */}
        <div
          className="fdd-header"
          style={{
            padding: "80px 0 72px",
          }}
        >
          <p
            className="sb-label"
            style={{
              color: "#e8956a",
              letterSpacing: "0.12em",
              marginBottom: 12,
            }}
          >
            FEATURES
          </p>
          <h2
            className="sb-h2"
            style={{
              color: "#eaeef1",
              maxWidth: 560,
              lineHeight: 1.1,
            }}
          >
            Built for businesses that mean business.
          </h2>
        </div>

        {/* Feature rows */}
        {features.map((feature, featureIndex) => (
          <div key={feature.id}>
            {/* Divider between features (not before the first) */}
            {featureIndex > 0 && (
              <div
                aria-hidden
                style={{
                  height: 1,
                  background: "rgba(244,185,100,0.06)",
                  margin: "0 auto",
                  maxWidth: 1280,
                }}
              />
            )}

            {/* Feature row */}
            <div
              className={`feature-row-${feature.id}`}
              style={{
                display: "flex",
                flexDirection:
                  feature.layout === "text-left" ? "row" : "row-reverse",
                alignItems: "center",
                gap: 80,
                padding: "100px 0",
              }}
            >
              {/* Text side */}
              <div
                className="feature-text"
                style={{
                  flex: "0 0 420px",
                  maxWidth: 420,
                }}
              >
                {/* Label */}
                <p
                  className="sb-label"
                  style={{
                    color: feature.accent,
                    letterSpacing: "0.12em",
                    marginBottom: 12,
                  }}
                >
                  {feature.label}
                </p>

                {/* Heading */}
                <h3
                  className="sb-h2"
                  style={{
                    color: "#eaeef1",
                    marginTop: 8,
                    lineHeight: 1.1,
                    marginBottom: 16,
                  }}
                >
                  {feature.heading}
                </h3>

                {/* Body */}
                <p
                  className="sb-body"
                  style={{
                    color: "#6d8d9f",
                    marginTop: 16,
                    lineHeight: 1.65,
                  }}
                >
                  {feature.body}
                </p>

                {/* Bullet list */}
                <div
                  style={{
                    marginTop: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {feature.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="feature-bullet"
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          color: feature.accent,
                          flexShrink: 0,
                          marginTop: 2,
                          fontWeight: 700,
                          lineHeight: 1.55,
                          fontSize: 14,
                        }}
                      >
                        —
                      </span>
                      <p
                        className="sb-body-sm"
                        style={{ color: "#d4dce2", lineHeight: 1.55 }}
                      >
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div style={{ marginTop: 36 }}>
                  <Link href="/sign-up">
                    <Button className="sb-btn-primary">
                      Get Started →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mock side */}
              <div
                className="feature-mock"
                style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: 600,
                }}
              >
                <div
                  style={{
                    border: "1px solid rgba(244,185,100,0.12)",
                    boxShadow:
                      "0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Accent top bar */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: feature.accent,
                      zIndex: 1,
                      opacity: 0.7,
                    }}
                  />
                  {feature.mock}
                </div>

                {/* Mock caption */}
                <p
                  className="sb-caption"
                  style={{
                    color: "#6d8d9f",
                    marginTop: 12,
                    textAlign:
                      feature.layout === "text-left" ? "right" : "left",
                    opacity: 0.6,
                  }}
                >
                  {feature.label} — Live preview
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Bottom CTA row */}
        <div
          style={{
            borderTop: "1px solid rgba(244,185,100,0.06)",
            paddingTop: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            textAlign: "center",
          }}
        >
          <p
            className="sb-h3"
            style={{ color: "#eaeef1", maxWidth: 480 }}
          >
            Ready to see it in action?
          </p>
          <p
            className="sb-body"
            style={{ color: "#6d8d9f", maxWidth: 380 }}
          >
            Start your free trial — no credit card required.
          </p>
          <Link href="/sign-up">
            <Button className="sb-btn-primary" style={{ padding: "14px 40px" }}>
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
