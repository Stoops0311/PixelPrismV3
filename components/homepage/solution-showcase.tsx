"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Button } from "@/components/ui/button"
import { MockDashboardShell } from "@/components/homepage/mock-panels/mock-dashboard-shell"
import { MockStudio } from "@/components/homepage/mock-panels/mock-studio"
import { MockCalendar } from "@/components/homepage/mock-panels/mock-calendar"
import { MockAnalytics } from "@/components/homepage/mock-panels/mock-analytics"
import { MockBrandSwitcher } from "@/components/homepage/mock-panels/mock-brand-switcher"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    id: "studio",
    label: "AI STUDIO",
    heading: "Generate. Don't design.",
    body: "Create scroll-stopping product visuals in seconds. No Canva, no photographer, no design degree required.",
    bullets: [
      "AI-powered from your product photos",
      "Multiple styles: Product Shot, Lifestyle, Flat Lay",
      "Every platform size, instantly",
    ],
    activePage: "studio" as const,
  },
  {
    id: "scheduling",
    label: "SCHEDULING",
    heading: "One calendar. Every platform.",
    body: "Plan and schedule a week of content in 15 minutes. Publish to Instagram, Facebook, LinkedIn, and Pinterest simultaneously.",
    bullets: [
      "Drag-and-drop calendar scheduling",
      "Multi-platform publishing in one click",
      "Best-time recommendations",
    ],
    activePage: "scheduling" as const,
  },
  {
    id: "analytics",
    label: "ANALYTICS",
    heading: "Know what works.",
    body: "Stop guessing. See exactly which content drives engagement, growth, and real business results.",
    bullets: [
      "Engagement rate tracking by platform",
      "Top-performing content breakdown",
      "AI-powered performance insights",
    ],
    activePage: "analytics" as const,
  },
  {
    id: "brands",
    label: "MULTI-BRAND",
    heading: "Every brand. One place.",
    body: "Manage multiple brands from a single dashboard. Agency-grade tools without the agency price tag.",
    bullets: [
      "Unlimited brands per workspace",
      "Separate analytics per brand",
      "Seamless brand switching",
    ],
    activePage: "brands" as const,
  },
]

const featureAccents = ["#f4b964", "#64dcf4", "#e8956a", "#a4f464"]

function FeatureDot({
  active,
  accent,
  onClick,
  index,
}: {
  active: boolean
  accent: string
  onClick: () => void
  index: number
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Go to feature ${index + 1}`}
      style={{
        width: 10,
        height: 10,
        border: `1.5px solid ${active ? accent : "rgba(244,185,100,0.22)"}`,
        background: active ? accent : "transparent",
        cursor: "pointer",
        padding: 0,
        transition: "background 0.25s ease, border-color 0.25s ease",
        flexShrink: 0,
      }}
    />
  )
}

export function SolutionShowcase() {
  const containerRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      const isMobile = window.innerWidth < 768
      const activeRef = { value: 0 }

      if (!isMobile) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "+=160%",
          pin: ".solution-pin-container",
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const step = Math.min(Math.floor(self.progress * 4), 3)
            if (step !== activeRef.value) {
              activeRef.value = step
              setActiveIndex(step)
            }
          },
        })
      }

      if (!prefersReduced) {
        // Dashboard entrance
        gsap.from(".solution-dashboard-wrapper", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          x: 40,
          duration: 0.9,
          ease: "power2.out",
        })
      }
    },
    { scope: containerRef }
  )

  const activeFeature = features[activeIndex]
  const activeAccent = featureAccents[activeIndex]

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      style={{
        background:
          "linear-gradient(180deg, #071a26 0%, #0b2230 50%, #071a26 100%)",
        position: "relative",
      }}
    >
      {/* Pinned container — full viewport, vertically centered */}
      <div
        className="solution-pin-container"
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 48px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 48,
          }}
        >
          {/* LEFT: Callout text */}
          <div
            style={{
              width: "40%",
              flexShrink: 0,
              position: "relative",
            }}
          >
            {/* Section heading */}
            <p
              className="sb-label"
              style={{
                color: "#e8956a",
                letterSpacing: "0.12em",
                marginBottom: 8,
              }}
            >
              HOW IT WORKS
            </p>
            <h2
              className="sb-h2"
              style={{ color: "#eaeef1", maxWidth: 420, lineHeight: 1.15, marginBottom: 40 }}
            >
              Everything your brand needs, in one dashboard.
            </h2>

            {/* Step dots */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 32,
              }}
            >
              {features.map((_, i) => (
                <FeatureDot
                  key={i}
                  index={i}
                  active={activeIndex === i}
                  accent={featureAccents[i]}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>

            {/* Callout text — transitions driven by activeIndex */}
            <div style={{ position: "relative", minHeight: 280 }}>
              {features.map((feature, i) => (
                <div
                  key={feature.id}
                  aria-hidden={activeIndex !== i}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: activeIndex === i ? 1 : 0,
                    transform:
                      activeIndex === i
                        ? "translateY(0)"
                        : activeIndex > i
                          ? "translateY(-16px)"
                          : "translateY(16px)",
                    transition:
                      "opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    pointerEvents: activeIndex === i ? "auto" : "none",
                  }}
                >
                  <p
                    className="sb-label"
                    style={{
                      color: featureAccents[i],
                      letterSpacing: "0.12em",
                      marginBottom: 12,
                    }}
                  >
                    {feature.label}
                  </p>

                  <h3
                    className="sb-h2"
                    style={{
                      color: "#eaeef1",
                      lineHeight: 1.1,
                      marginBottom: 16,
                    }}
                  >
                    {feature.heading}
                  </h3>

                  <p
                    className="sb-body"
                    style={{
                      color: "#6d8d9f",
                      maxWidth: 360,
                      lineHeight: 1.65,
                      marginBottom: 24,
                    }}
                  >
                    {feature.body}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {feature.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            color: featureAccents[i],
                            flexShrink: 0,
                            marginTop: 3,
                            fontSize: 12,
                          }}
                        >
                          ✦
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

                  <div style={{ marginTop: 32 }}>
                    <Link href="/sign-up">
                      <Button className="sb-btn-primary">
                        Start Free Trial →
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Step counter */}
            <div style={{ marginTop: 32 }}>
              <span
                className="sb-caption"
                style={{ color: "#6d8d9f", fontSize: 10 }}
              >
                {activeIndex + 1} / {features.length} · {activeFeature.label}
              </span>
            </div>
          </div>

          {/* RIGHT: Mock Dashboard — LARGE */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Glow effect */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: -40,
                background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${activeAccent}0a 0%, transparent 70%)`,
                transition: "background 0.6s ease",
                pointerEvents: "none",
              }}
            />

            <div
              className="solution-dashboard-wrapper"
              style={{
                width: "100%",
                maxWidth: 820,
                boxShadow:
                  "0 24px 80px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)",
                border: "1px solid rgba(244,185,100,0.12)",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Accent border top */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: activeAccent,
                  zIndex: 2,
                  transition: "background 0.4s ease",
                }}
              />

              <MockDashboardShell activePage={activeFeature.activePage}>
                <div style={{ position: "relative", width: "100%", minHeight: 380 }}>
                  {/* Studio */}
                  <div
                    style={{
                      position: activeIndex === 0 ? "relative" : "absolute",
                      inset: 0,
                      opacity: activeIndex === 0 ? 1 : 0,
                      transition: "opacity 0.35s ease",
                      pointerEvents: activeIndex === 0 ? "auto" : "none",
                    }}
                  >
                    <MockStudio />
                  </div>

                  {/* Scheduling */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: activeIndex === 1 ? 1 : 0,
                      transition: "opacity 0.35s ease",
                      pointerEvents: activeIndex === 1 ? "auto" : "none",
                    }}
                  >
                    <MockCalendar />
                  </div>

                  {/* Analytics */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: activeIndex === 2 ? 1 : 0,
                      transition: "opacity 0.35s ease",
                      pointerEvents: activeIndex === 2 ? "auto" : "none",
                    }}
                  >
                    <MockAnalytics />
                  </div>

                  {/* Brands */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: activeIndex === 3 ? 1 : 0,
                      transition: "opacity 0.35s ease",
                      pointerEvents: activeIndex === 3 ? "auto" : "none",
                    }}
                  >
                    <MockBrandSwitcher />
                  </div>
                </div>
              </MockDashboardShell>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
