"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  {
    selector: "stat-images",
    end: 10000,
    suffix: "+",
    label: "Images generated",
  },
  {
    selector: "stat-platforms",
    end: 4,
    suffix: "",
    label: "Platforms supported",
  },
  {
    selector: "stat-time",
    end: 50,
    suffix: "%",
    label: "Time saved per week",
  },
  {
    selector: "stat-businesses",
    end: 2000,
    suffix: "+",
    label: "Businesses using PixelPrism",
  },
]

const PLATFORMS = ["Instagram", "Facebook", "LinkedIn", "Pinterest"]

export function SocialProofSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    STATS.forEach(({ selector, end }) => {
      const el = containerRef.current?.querySelector(`.${selector}`)
      if (!el) return

      const obj = { value: 0 }
      gsap.to(obj, {
        scrollTrigger: {
          trigger: `.${selector}`,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        value: end,
        duration: prefersReduced ? 0 : 2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.value).toLocaleString()
        },
      })
    })

    if (!prefersReduced) {
      gsap.from(".proof-heading", {
        scrollTrigger: {
          trigger: ".proof-heading",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power2.out",
      })

      gsap.from(".proof-stat-cell", {
        scrollTrigger: {
          trigger: ".proof-stat-grid",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
      })

      gsap.from(".proof-platform-pill", {
        scrollTrigger: {
          trigger: ".proof-platforms",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 16,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      style={{
        padding: "120px 0",
        background: "#071a26",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* ── Heading ── */}
        <div
          className="proof-heading"
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <p
            className="sb-label"
            style={{ color: "#e8956a", marginBottom: 8 }}
          >
            By the Numbers
          </p>
          <h2 className="sb-h2" style={{ color: "#eaeef1" }}>
            Results that speak for themselves
          </h2>
        </div>

        {/* ── Stat grid ── */}
        <div
          className="proof-stat-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          {STATS.map((stat, index) => (
            <div
              key={stat.selector}
              className="proof-stat-cell"
              style={{
                textAlign: "center",
                padding: "40px 24px",
                borderRight:
                  index < STATS.length - 1
                    ? "1px solid rgba(244,185,100,0.12)"
                    : "none",
              }}
            >
              {/* Counter + suffix */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "center",
                  gap: 2,
                  marginBottom: 12,
                }}
              >
                <span
                  className={`sb-data ${stat.selector}`}
                  style={{
                    color: "#f4b964",
                    fontSize: 64,
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  0
                </span>
                {stat.suffix && (
                  <span
                    className="sb-data"
                    style={{
                      color: "#f4b964",
                      fontSize: 48,
                      lineHeight: 1,
                      fontWeight: 700,
                    }}
                  >
                    {stat.suffix}
                  </span>
                )}
              </div>

              {/* Label */}
              <p
                className="sb-label"
                style={{ color: "#6d8d9f", marginTop: 8 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Platform badges ── */}
        <div
          className="proof-platforms"
          style={{
            marginTop: 80,
            textAlign: "center",
          }}
        >
          <p
            className="sb-label"
            style={{ color: "#e8956a", marginBottom: 20 }}
          >
            Connects With
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {PLATFORMS.map((platform) => (
              <span
                key={platform}
                className="sb-caption proof-platform-pill"
                style={{
                  border: "1px solid rgba(244,185,100,0.12)",
                  padding: "6px 14px",
                  color: "#6d8d9f",
                  display: "inline-block",
                }}
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
