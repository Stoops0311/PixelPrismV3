"use client"

import { useState } from "react"
import Link from "next/link"
import { Show } from "@clerk/nextjs";
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { CheckoutLink } from "@convex-dev/polar/react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  FULL_TIERS,
  TIER_COMPARISON_FEATURES,
  CREDIT_PACKS,
  ORGANIZATION_TIER,
} from "@/lib/polar"
import { MarketingLayout } from "@/components/homepage/marketing-layout"

// ─── FAQ Data ───────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: "What happens when I run out of credits?",
    answer:
      "When your monthly credits are used up, you can purchase additional credit packs at any time. Your monthly allocation resets at the start of each billing cycle.",
  },
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes — upgrade or downgrade whenever you want. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period.",
  },
  {
    question: "How do brands and social accounts work?",
    answer:
      "Your plan determines how many brands you can manage. Each brand is a separate workspace with its own products and connected social accounts. Credits are shared across all your brands.",
  },
  {
    question: "Do unused credits roll over?",
    answer:
      "Monthly credits reset each billing cycle and don't roll over. Credits purchased through top-up packs never expire — they remain in your account until used.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. No contracts, no cancellation fees. Cancel anytime from your dashboard. You'll keep access to paid features until the end of your current billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express) through our payment partner Polar. All transactions are secure and encrypted.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "We don't offer time-limited trials because we offer something better — a Free plan with no expiration. Use it as long as you like, and upgrade only when you're ready to scale.",
  },
]

// ─── Subscription Status ────────────────────────────────────────────────────

function SubscriptionStatus() {
  const user = useQuery(api.polar.currentWithSubscription)
  if (!user) return null

  if (!user.subscription) {
    return (
      <div
        style={{
          padding: "1rem 1.5rem",
          border: "1px solid rgba(244,185,100,0.12)",
          background: "rgba(244,185,100,0.04)",
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        <p className="sb-body-sm" style={{ color: "#6d8d9f", margin: 0 }}>
          You don&apos;t have an active subscription yet. Choose a plan below to get started.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "1rem 1.5rem",
        border: "1px solid rgba(244,185,100,0.25)",
        background: "rgba(244,185,100,0.06)",
        textAlign: "center",
        marginBottom: 48,
      }}
    >
      <p className="sb-label" style={{ color: "#f4b964", marginBottom: 4 }}>
        Current Plan
      </p>
      <p className="sb-h4" style={{ color: "#eaeef1", margin: 0 }}>
        {user.subscription.productKey
          ? user.subscription.productKey.charAt(0).toUpperCase() +
            user.subscription.productKey.slice(1)
          : "Active"}
      </p>
      <p className="sb-caption" style={{ color: "#6d8d9f", marginTop: 4 }}>
        Status: {user.subscription.status}
      </p>
    </div>
  )
}

// ─── Plan CTA ───────────────────────────────────────────────────────────────

function PlanCTA({ tierKey, popular }: { tierKey: string; popular: boolean }) {
  const products = useQuery(api.polar.getConfiguredProducts)
  const btnClass = popular ? "sb-btn-primary w-full" : "sb-btn-secondary w-full"

  if (tierKey === "free") {
    return (
      <Show when="signed-out">
        <Link href="/sign-up" className="w-full">
          <Button className={btnClass}>Get Started Free</Button>
        </Link>
      </Show>
    );
  }

  const product = products?.[tierKey as keyof typeof products]

  return (
    <>
      <Show when="signed-in">
        {product ? (
          <CheckoutLink polarApi={api.polar} productIds={[product.id]} embed={false}>
            <Button className={btnClass}>Subscribe</Button>
          </CheckoutLink>
        ) : (
          <Button className={btnClass} disabled>Loading...</Button>
        )}
      </Show>
      <Show when="signed-out">
        <Link href="/sign-up" className="w-full">
          <Button className={btnClass}>Get Started</Button>
        </Link>
      </Show>
    </>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function PricingPageContent() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <MarketingLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "100px 0 80px",
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(244,185,100,0.06) 0%, transparent 70%), #071a26",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center" }}>
            <p className="sb-label" style={{ color: "#e8956a", marginBottom: 16, letterSpacing: "0.15em" }}>
              PRICING
            </p>
            <h1
              className="sb-h1"
              style={{ color: "#eaeef1", fontSize: 48, marginBottom: 16, lineHeight: 1.1 }}
            >
              Plans that grow with{" "}
              <span style={{ color: "#f4b964" }}>your brand.</span>
            </h1>
            <p
              className="sb-body"
              style={{ color: "#6d8d9f", maxWidth: 520, margin: "0 auto", fontSize: 17, lineHeight: 1.6 }}
            >
              Start free. Upgrade when you&apos;re ready. No hidden fees, no surprises.
            </p>
          </div>

          <Show when="signed-in">
            <div style={{ marginTop: 40 }}>
              <SubscriptionStatus />
            </div>
          </Show>
        </div>
      </section>
      {/* ── Plan Cards ───────────────────────────────────────────────────── */}
      <section style={{ padding: "0 0 120px", background: "#071a26" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div
            className="pricing-cards-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              alignItems: "start",
            }}
          >
            {FULL_TIERS.map((tier, index) => (
              <div
                key={tier.key}
                style={{
                  background: "#0e2838",
                  border: tier.popular ? "2px solid #f4b964" : "1px solid rgba(244,185,100,0.12)",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  transform: tier.popular ? "translateY(-8px)" : "translateY(0)",
                  opacity: hoveredCard !== null && hoveredCard !== index ? 0.85 : 1,
                  transition: "transform 300ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 300ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
                }}
                onMouseEnter={(e) => {
                  setHoveredCard(index)
                  e.currentTarget.style.transform = "translateY(-12px)"
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(244,185,100,0.15), 0 8px 24px rgba(0,0,0,0.20)"
                }}
                onMouseLeave={(e) => {
                  setHoveredCard(null)
                  e.currentTarget.style.transform = tier.popular ? "translateY(-8px)" : "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)"
                }}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div
                    className="sb-label"
                    style={{
                      position: "absolute", top: 0, right: 0,
                      background: "#f4b964", color: "#071a26",
                      padding: "4px 14px", fontSize: 10, letterSpacing: "0.08em",
                    }}
                  >
                    Most Popular
                  </div>
                )}
                {/* Gold top gradient for popular */}
                {tier.popular && (
                  <div
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 100,
                      background: "linear-gradient(180deg, rgba(244,185,100,0.08) 0%, transparent 100%)",
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* Header */}
                <div style={{ padding: "28px 24px 16px", position: "relative" }}>
                  <p className="sb-label" style={{ color: "#e8956a", marginBottom: 6 }}>
                    {tier.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                    {tier.price === 0 ? (
                      <span className="sb-data" style={{ fontSize: 40, color: "#eaeef1" }}>Free</span>
                    ) : (
                      <>
                        <span className="sb-data" style={{ fontSize: 16, color: "#6d8d9f" }}>$</span>
                        <span className="sb-data" style={{ fontSize: 40, color: "#eaeef1" }}>{tier.price}</span>
                        <span className="sb-caption" style={{ color: "#6d8d9f", marginLeft: 2 }}>/month</span>
                      </>
                    )}
                  </div>
                  <p className="sb-body-sm" style={{ color: "#6d8d9f", margin: 0 }}>{tier.description}</p>
                </div>

                {/* Credits highlight */}
                <div
                  style={{
                    margin: "0 24px",
                    background: "rgba(244,185,100,0.04)",
                    border: "1px solid rgba(244,185,100,0.08)",
                    padding: "10px 16px",
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  <span className="sb-data" style={{ color: "#f4b964", fontSize: 28 }}>
                    {tier.monthlyCredits}
                  </span>
                  <span className="sb-caption" style={{ color: "#6d8d9f", marginLeft: 6 }}>
                    credits/month
                  </span>
                </div>

                {/* Features */}
                <div style={{ padding: "0 24px", flex: 1 }}>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {tier.features.map((f) => (
                      <li key={f} className="sb-body-sm" style={{ color: "#d4dce2", display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ color: "#f4b964", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                        {f}
                      </li>
                    ))}
                    {tier.notIncluded.map((f) => (
                      <li key={f} className="sb-body-sm" style={{ color: "#6d8d9f", opacity: 0.5, display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ flexShrink: 0, marginTop: 1 }}>✕</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div style={{ padding: "0 24px 24px" }}>
                  <PlanCTA tierKey={tier.key} popular={tier.popular} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Organization Banner ──────────────────────────────────────────── */}
      <section style={{ padding: "0 0 80px", background: "#071a26" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div
            style={{
              border: "1px solid rgba(244,185,100,0.22)",
              background: "linear-gradient(135deg, rgba(244,185,100,0.04) 0%, rgba(14,40,56,1) 100%)",
              padding: "40px 48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 48,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative gold line at top */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, transparent, #f4b964, transparent)",
              }}
            />

            <div style={{ flex: 1 }}>
              <p className="sb-label" style={{ color: "#e8956a", marginBottom: 8, letterSpacing: "0.12em" }}>
                {ORGANIZATION_TIER.name.toUpperCase()}
              </p>
              <h3 className="sb-h3" style={{ color: "#eaeef1", marginBottom: 8 }}>
                Need more than a plan?
              </h3>
              <p className="sb-body-sm" style={{ color: "#6d8d9f", marginBottom: 20, maxWidth: 480 }}>
                For teams and organizations that need custom limits, dedicated support, and tailored integrations.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 24px",
                }}
              >
                {ORGANIZATION_TIER.features.map((f) => (
                  <span
                    key={f}
                    className="sb-body-sm"
                    style={{ color: "#d4dce2", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span style={{ color: "#f4b964", fontWeight: 700 }}>✓</span>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <p className="sb-data" style={{ color: "#f4b964", fontSize: 32, marginBottom: 4 }}>Custom</p>
              <p className="sb-caption" style={{ color: "#6d8d9f", marginBottom: 20 }}>pricing</p>
              <Link href="/contact">
                <Button className="sb-btn-primary" style={{ padding: "14px 40px", fontSize: 15 }}>
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hire a Professional Marketer ──────────────────────────────────── */}
      <section
        style={{
          padding: "80px 0",
          background: "linear-gradient(180deg, #071a26 0%, #0a2030 50%, #071a26 100%)",
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <div
            style={{
              width: 60,
              height: 2,
              background: "linear-gradient(90deg, transparent, #e8956a, transparent)",
              margin: "0 auto 32px",
            }}
          />
          <p className="sb-label" style={{ color: "#e8956a", marginBottom: 12, letterSpacing: "0.15em" }}>
            MANAGED SERVICE
          </p>
          <h2 className="sb-h2" style={{ color: "#eaeef1", marginBottom: 16, lineHeight: 1.15 }}>
            Want a real human behind{" "}
            <span style={{ color: "#f4b964" }}>your brand?</span>
          </h2>
          <p
            className="sb-body"
            style={{ color: "#6d8d9f", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7 }}
          >
            Hire a professional human marketer through PixelPrism. We&apos;ll pair you with a dedicated
            marketing expert who knows your brand, creates your content, and manages your social presence
            — so you can focus on running your business.
          </p>
          <Link href="/contact">
            <Button className="sb-btn-primary" style={{ padding: "16px 48px", fontSize: 16 }}>
              Contact Us
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Comparison Table ─────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 0",
          background: "linear-gradient(180deg, #071a26 0%, #0a2030 50%, #071a26 100%)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className="sb-label" style={{ color: "#e8956a", marginBottom: 8 }}>COMPARE PLANS</p>
            <h2 className="sb-h2" style={{ color: "#eaeef1" }}>Everything at a glance</h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid rgba(244,185,100,0.12)",
              }}
            >
              <thead>
                <tr style={{ background: "#0b2230" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px 20px",
                      color: "#6d8d9f",
                      fontFamily: "'Neue Montreal', sans-serif",
                      fontWeight: 500,
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid rgba(244,185,100,0.12)",
                      width: "30%",
                    }}
                  >
                    Feature
                  </th>
                  {FULL_TIERS.map((tier) => (
                    <th
                      key={tier.key}
                      style={{
                        textAlign: "center",
                        padding: "16px 20px",
                        fontFamily: "'Neue Montreal', sans-serif",
                        fontWeight: 500,
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: tier.popular ? "#f4b964" : "#6d8d9f",
                        borderBottom: tier.popular ? "2px solid #f4b964" : "1px solid rgba(244,185,100,0.12)",
                        background: tier.popular ? "rgba(244,185,100,0.04)" : "transparent",
                      }}
                    >
                      {tier.name}
                      {tier.price > 0 && (
                        <span
                          style={{
                            display: "block",
                            color: "#6d8d9f",
                            fontWeight: 400,
                            marginTop: 2,
                            fontSize: 10,
                          }}
                        >
                          ${tier.price}/mo
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIER_COMPARISON_FEATURES.map((feature, i) => (
                  <tr
                    key={feature.name}
                    style={{
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    }}
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        color: "#d4dce2",
                        fontFamily: "'General Sans', sans-serif",
                        fontSize: 13,
                        borderBottom: "1px solid rgba(244,185,100,0.06)",
                      }}
                    >
                      {feature.name}
                    </td>
                    {FULL_TIERS.map((tier) => {
                      const val = feature.values[tier.key]
                      return (
                        <td
                          key={tier.key}
                          style={{
                            textAlign: "center",
                            padding: "14px 20px",
                            borderBottom: "1px solid rgba(244,185,100,0.06)",
                            background: tier.popular ? "rgba(244,185,100,0.04)" : "transparent",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {val === true ? (
                            <span style={{ color: "#f4b964", fontSize: 16 }}>✓</span>
                          ) : val === false ? (
                            <span style={{ color: "#6d8d9f", opacity: 0.35, fontWeight: 400 }}>—</span>
                          ) : (
                            <span style={{ color: "#eaeef1" }}>{val}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* ── Credit Packs ─────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 0", background: "#071a26" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className="sb-label" style={{ color: "#e8956a", marginBottom: 8 }}>CREDIT TOP-UPS</p>
            <h2 className="sb-h2" style={{ color: "#eaeef1", marginBottom: 12 }}>Need more credits?</h2>
            <p className="sb-body" style={{ color: "#6d8d9f", maxWidth: 520, margin: "0 auto" }}>
              Credits power AI image generation. Monthly allocation resets each billing cycle. Top-up credits never expire.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {CREDIT_PACKS.map((pack) => {
              const perCredit = (pack.price / pack.credits).toFixed(2)
              const isBestValue = pack.key === "credits_1000"

              return (
                <div
                  key={pack.key}
                  style={{
                    background: "#0e2838",
                    border: isBestValue ? "2px solid #f4b964" : "1px solid rgba(244,185,100,0.12)",
                    padding: "28px 24px",
                    textAlign: "center",
                    position: "relative",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
                    transition: "transform 300ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 300ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(244,185,100,0.12), 0 8px 24px rgba(0,0,0,0.20)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)"
                  }}
                >
                  {isBestValue && (
                    <div
                      className="sb-label"
                      style={{
                        position: "absolute", top: 0, right: 0,
                        background: "#f4b964", color: "#071a26",
                        padding: "3px 10px", fontSize: 9, letterSpacing: "0.08em",
                      }}
                    >
                      Best Value
                    </div>
                  )}
                  <p className="sb-data" style={{ color: "#f4b964", fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
                    {pack.credits.toLocaleString()}
                  </p>
                  <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>Credits</p>
                  <p className="sb-data" style={{ color: "#eaeef1", fontSize: 28, marginBottom: 4 }}>
                    ${pack.price}
                  </p>
                  <p className="sb-caption" style={{ color: "#6d8d9f", marginBottom: 24 }}>
                    ${perCredit} per credit
                  </p>
                  <Show when="signed-in">
                    <Button className={isBestValue ? "sb-btn-primary w-full" : "sb-btn-secondary w-full"}>
                      Buy Credits
                    </Button>
                  </Show>
                  <Show when="signed-out">
                    <Link href="/sign-up" className="w-full">
                      <Button className={isBestValue ? "sb-btn-primary w-full" : "sb-btn-secondary w-full"}>
                        Get Started
                      </Button>
                    </Link>
                  </Show>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 0",
          background: "linear-gradient(180deg, #071a26 0%, #0a2030 50%, #071a26 100%)",
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="sb-label" style={{ color: "#e8956a", marginBottom: 8 }}>FAQ</p>
            <h2 className="sb-h2" style={{ color: "#eaeef1" }}>Common questions</h2>
          </div>

          <Accordion type="single" collapsible>
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                style={{ borderBottom: "1px solid rgba(244,185,100,0.08)" }}
              >
                <AccordionTrigger
                  style={{ color: "#eaeef1", fontSize: 15, textAlign: "left", padding: "20px 0" }}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="sb-body-sm" style={{ color: "#6d8d9f", lineHeight: 1.7, paddingBottom: 16, margin: 0 }}>
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "140px 0",
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(244,185,100,0.06) 0%, transparent 70%), #071a26",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <div
            style={{
              width: 80, height: 2,
              background: "linear-gradient(90deg, transparent, #f4b964, transparent)",
              margin: "0 auto 48px",
            }}
          />
          <p className="sb-label" style={{ color: "#e8956a", marginBottom: 20, letterSpacing: "0.15em" }}>
            GET STARTED
          </p>
          <h2 className="sb-h2" style={{ color: "#eaeef1", fontSize: 40, marginBottom: 16, lineHeight: 1.15 }}>
            Start creating for <span style={{ color: "#f4b964" }}>free.</span>
          </h2>
          <p className="sb-body" style={{ color: "#6d8d9f", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6 }}>
            No credit card required. Upgrade whenever you&apos;re ready.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Show when="signed-out">
              <Link href="/sign-up">
                <Button className="sb-btn-primary" style={{ padding: "16px 48px", fontSize: 16 }}>
                  Get Started Free
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button className="sb-btn-primary" style={{ padding: "16px 48px", fontSize: 16 }}>
                  Go to Dashboard
                </Button>
              </Link>
            </Show>
          </div>
          <p className="sb-caption" style={{ color: "#6d8d9f", marginTop: 24, opacity: 0.7 }}>
            No credit card required · Free plan available · Cancel anytime
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
