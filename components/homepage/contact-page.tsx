"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MarketingLayout } from "@/components/homepage/marketing-layout"

gsap.registerPlugin(ScrollTrigger)

const SUBJECTS = [
  "General Inquiry",
  "Bug Report",
  "Feature Request",
  "Partnership",
  "Enterprise Pricing",
]

export function ContactPageContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    // Hero
    gsap.from(".contact-hero", {
      scrollTrigger: {
        trigger: ".contact-hero",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: "power2.out",
    })

    // Form fields stagger from left
    gsap.from(".contact-field", {
      scrollTrigger: {
        trigger: ".contact-form",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      x: -30,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
    })

    // Info panel from right
    gsap.from(".contact-info-panel", {
      scrollTrigger: {
        trigger: ".contact-info-panel",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      x: 30,
      duration: 0.7,
      ease: "power2.out",
    })
  }, { scope: containerRef })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !subject || !message.trim()) {
      toast.error("Please fill in all fields.")
      return
    }
    setSubmitted(true)
    toast.success("Message sent! We'll get back to you within 24 hours.")
  }

  return (
    <MarketingLayout>
      <div ref={containerRef}>
        {/* ── Hero ── */}
        <section
          style={{
            padding: "100px 0 80px",
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(244,185,100,0.06) 0%, transparent 70%), #071a26",
          }}
        >
          <div
            className="contact-hero"
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 32px",
              textAlign: "center",
            }}
          >
            <p
              className="sb-label"
              style={{ color: "#e8956a", marginBottom: 16, letterSpacing: "0.15em" }}
            >
              CONTACT US
            </p>
            <h1
              className="sb-h1"
              style={{
                color: "#eaeef1",
                fontSize: 48,
                marginBottom: 16,
                lineHeight: 1.1,
              }}
            >
              Let&apos;s <span style={{ color: "#f4b964" }}>talk.</span>
            </h1>
            <p
              className="sb-body"
              style={{
                color: "#6d8d9f",
                maxWidth: 480,
                margin: "0 auto",
                fontSize: 17,
                lineHeight: 1.6,
              }}
            >
              Have a question, feedback, or just want to say hi? We&apos;d love
              to hear from you.
            </p>
          </div>
        </section>

        {/* ── Form + Info ── */}
        <section style={{ padding: "0 0 140px", background: "#071a26" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 32px",
              display: "flex",
              gap: 48,
              alignItems: "flex-start",
            }}
            className="contact-layout"
          >
            {/* Left: Form */}
            <div className="contact-form" style={{ flex: "1 1 60%" }}>
              {submitted ? (
                <div
                  style={{
                    background: "#0e2838",
                    border: "1px solid rgba(244,185,100,0.22)",
                    padding: "48px 40px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: "rgba(164,244,100,0.12)",
                      border: "1px solid rgba(164,244,100,0.22)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      fontSize: 22,
                      color: "#a4f464",
                    }}
                  >
                    &#x2713;
                  </div>
                  <h3 className="sb-h3" style={{ color: "#eaeef1", marginBottom: 8 }}>
                    Message sent!
                  </h3>
                  <p className="sb-body-sm" style={{ color: "#6d8d9f", margin: 0 }}>
                    Thanks for reaching out. We&apos;ll get back to you within 24
                    hours.
                  </p>
                  <Button
                    className="sb-btn-ghost"
                    style={{ marginTop: 24 }}
                    onClick={() => {
                      setSubmitted(false)
                      setName("")
                      setEmail("")
                      setSubject("")
                      setMessage("")
                    }}
                  >
                    Send another message <span className="sb-arrow">→</span>
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    background: "#0e2838",
                    border: "1px solid rgba(244,185,100,0.12)",
                    padding: "40px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Name + Email row */}
                    <div
                      style={{ display: "flex", gap: 20 }}
                      className="contact-fields-row"
                    >
                      <div className="contact-field" style={{ flex: 1 }}>
                        <Label
                          className="sb-label"
                          style={{ color: "#6d8d9f", marginBottom: 8, display: "block" }}
                        >
                          Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="contact-field" style={{ flex: 1 }}>
                        <Label
                          className="sb-label"
                          style={{ color: "#6d8d9f", marginBottom: 8, display: "block" }}
                        >
                          Email
                        </Label>
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="contact-field">
                      <Label
                        className="sb-label"
                        style={{ color: "#6d8d9f", marginBottom: 8, display: "block" }}
                      >
                        Subject
                      </Label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="What's this about?" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div className="contact-field">
                      <Label
                        className="sb-label"
                        style={{ color: "#6d8d9f", marginBottom: 8, display: "block" }}
                      >
                        Message
                      </Label>
                      <Textarea
                        placeholder="Tell us what's on your mind..."
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ resize: "vertical" }}
                      />
                    </div>

                    {/* Submit */}
                    <div className="contact-field">
                      <Button
                        type="submit"
                        className="sb-btn-primary"
                        style={{ padding: "14px 40px", fontSize: 15 }}
                      >
                        Send Message
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Right: Contact info panel */}
            <div
              className="contact-info-panel"
              style={{ flex: "1 1 35%", minWidth: 260 }}
            >
              <div
                className="showcase-callout"
                style={{
                  maxWidth: "none",
                  padding: "32px 28px",
                }}
              >
                <h3
                  className="sb-h4"
                  style={{ color: "#eaeef1", marginBottom: 24 }}
                >
                  Get in touch
                </h3>

                {/* Email */}
                <div style={{ marginBottom: 24 }}>
                  <p
                    className="sb-label"
                    style={{ color: "#6d8d9f", marginBottom: 6 }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:hello@pixelprism.tech"
                    className="sb-body"
                    style={{
                      color: "#f4b964",
                      textDecoration: "none",
                      transition: "opacity 200ms",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    hello@pixelprism.tech
                  </a>
                </div>

                {/* Response time */}
                <div style={{ marginBottom: 24 }}>
                  <p
                    className="sb-label"
                    style={{ color: "#6d8d9f", marginBottom: 6 }}
                  >
                    Response Time
                  </p>
                  <p className="sb-body-sm" style={{ color: "#d4dce2", margin: 0 }}>
                    We typically respond within 24 hours.
                  </p>
                </div>

                {/* Office hours */}
                <div style={{ marginBottom: 24 }}>
                  <p
                    className="sb-label"
                    style={{ color: "#6d8d9f", marginBottom: 6 }}
                  >
                    Office Hours
                  </p>
                  <p className="sb-body-sm" style={{ color: "#d4dce2", margin: 0 }}>
                    Mon – Fri, 9am – 6pm EST
                  </p>
                </div>

                {/* Separator */}
                <div
                  style={{
                    height: 1,
                    background: "rgba(244,185,100,0.12)",
                    margin: "24px 0",
                  }}
                />

                {/* Social links */}
                <div>
                  <p
                    className="sb-label"
                    style={{ color: "#6d8d9f", marginBottom: 12 }}
                  >
                    Follow Us
                  </p>
                  <div style={{ display: "flex", gap: 16 }}>
                    {[
                      { label: "Twitter / X", href: "#" },
                      { label: "LinkedIn", href: "#" },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className="sb-caption"
                        style={{
                          color: "#6d8d9f",
                          textDecoration: "none",
                          padding: "6px 14px",
                          border: "1px solid rgba(244,185,100,0.12)",
                          transition:
                            "color 200ms, border-color 200ms, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#f4b964"
                          e.currentTarget.style.borderColor = "rgba(244,185,100,0.22)"
                          e.currentTarget.style.transform = "translateY(-2px)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#6d8d9f"
                          e.currentTarget.style.borderColor = "rgba(244,185,100,0.12)"
                          e.currentTarget.style.transform = "translateY(0)"
                        }}
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}
