"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const PAIN_POINTS = [
  {
    icon: "✦",
    iconColor: "#f4b964",
    heading: "Designing from scratch",
    body: "Every post is a from-scratch design job. Different sizes, different platforms, no system.",
    className: "problem-card",
  },
  {
    icon: "◈",
    iconColor: "#64dcf4",
    heading: "4 tools, zero sync",
    body: "Your scheduler doesn't know your designer. Your analytics don't talk to your calendar. Nothing connects.",
    className: "problem-card",
  },
  {
    icon: "◎",
    iconColor: "#e8956a",
    heading: "No idea what works",
    body: "You're posting into the void. Likes are vanity. You don't know what content actually drives growth.",
    className: "problem-card",
  },
]

export function ProblemSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    // Headline
    gsap.from(".problem-heading", {
      scrollTrigger: {
        trigger: ".problem-heading",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
    })

    // Cards stagger
    gsap.from(".problem-card", {
      scrollTrigger: {
        trigger: ".problem-cards",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 0.7,
      ease: "power2.out",
    })

    // Stat callout
    gsap.from(".problem-stat", {
      scrollTrigger: {
        trigger: ".problem-stat",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      style={{
        padding: "140px 0",
        background:
          "linear-gradient(180deg, #071a26 0%, #0a2030 50%, #071a26 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* ── Centered intro ── */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            className="sb-label"
            style={{ color: "#e8956a", marginBottom: 20 }}
          >
            The Problem
          </p>

          <h2
            className="sb-h2 problem-heading"
            style={{
              color: "#eaeef1",
              fontSize: 40,
              lineHeight: 1.2,
              marginBottom: 0,
            }}
          >
            12 hours a week on content.
            <br />
            Zero hours growing your brand.
          </h2>

          <p
            className="sb-body"
            style={{
              color: "#6d8d9f",
              maxWidth: 520,
              margin: "20px auto 0",
            }}
          >
            SMBs spend more time making content than running their business.
            Meanwhile, growth stalls, platforms multiply, and nothing feels
            cohesive.
          </p>
        </div>

        {/* ── Pain point cards ── */}
        <div
          className="problem-cards"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginTop: 64,
          }}
        >
          {PAIN_POINTS.map((point) => (
            <div
              key={point.heading}
              className={point.className}
              style={{
                background: "#0e2838",
                border: "1px solid rgba(244,185,100,0.12)",
                padding: 28,
                textAlign: "left",
              }}
            >
              {/* Icon area */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: "1px solid rgba(244,185,100,0.12)",
                  background: "rgba(244,185,100,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  fontSize: 18,
                  color: point.iconColor,
                }}
                aria-hidden
              >
                {point.icon}
              </div>

              {/* Heading */}
              <h3
                className="sb-h4"
                style={{ color: "#eaeef1", marginBottom: 10 }}
              >
                {point.heading}
              </h3>

              {/* Body */}
              <p className="sb-body-sm" style={{ color: "#6d8d9f", margin: 0 }}>
                {point.body}
              </p>
            </div>
          ))}
        </div>

        {/* ── Stat callout ── */}
        <div
          className="problem-stat"
          style={{ marginTop: 80 }}
        >
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(244,185,100,0.08)",
              marginBottom: 40,
            }}
          />
          <p
            className="sb-body-sm"
            style={{
              color: "#6d8d9f",
              textAlign: "center",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            "The average SMB spends $2,400/year on marketing tools that don't
            talk to each other."
          </p>
        </div>
      </div>
    </section>
  )
}
