"use client"

import Link from "next/link"
import { SignedIn, SignedOut } from "@/lib/clerk-mock"
import { useQuery } from "@/lib/convex-mock"
import { api } from "@/convex/_generated/api"
import { CheckoutLink } from "@convex-dev/polar/react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PRICING_TIERS } from "@/lib/polar"

function SubscriptionStatus() {
  const user = useQuery(api.polar.currentWithSubscription)

  if (user === undefined || user === null) return null

  if (!user.subscription) {
    return (
      <div
        className="text-center mb-10"
        style={{
          padding: "1rem",
          border: "1px solid rgba(244,185,100,0.12)",
          background: "rgba(244,185,100,0.04)",
        }}
      >
        <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
          You don&apos;t have an active subscription yet.
        </p>
      </div>
    )
  }

  return (
    <div
      className="text-center mb-10"
      style={{
        padding: "1rem",
        border: "1px solid rgba(244,185,100,0.25)",
        background: "rgba(244,185,100,0.06)",
      }}
    >
      <p className="sb-label" style={{ color: "#f4b964", marginBottom: 4 }}>
        Current Plan
      </p>
      <p className="sb-h4" style={{ color: "#eaeef1" }}>
        {user.subscription.productKey
          ? user.subscription.productKey.charAt(0).toUpperCase() +
            user.subscription.productKey.slice(1)
          : "Active"}
      </p>
      <p className="sb-caption" style={{ color: "#6d8d9f", marginTop: 2 }}>
        Status: {user.subscription.status}
      </p>
    </div>
  )
}

function PricingCards() {
  const products = useQuery(api.polar.getConfiguredProducts)

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {PRICING_TIERS.map((tier) => {
        const product = products?.[tier.productKey as keyof typeof products]

        return (
          <Card
            key={tier.name}
            className="relative flex flex-col"
            style={{
              border: tier.popular
                ? "2px solid #f4b964"
                : "1px solid rgba(244,185,100,0.12)",
              overflow: "hidden",
              transition:
                "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)"
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(244,185,100,0.15), 0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = ""
            }}
          >
            {/* Popular badge */}
            {tier.popular && (
              <div
                className="sb-label"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "#f4b964",
                  color: "#071a26",
                  padding: "4px 12px",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  zIndex: 1,
                }}
              >
                Most Popular
              </div>
            )}

            {/* Gold top gradient for popular card */}
            {tier.popular && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 80,
                  background:
                    "linear-gradient(180deg, rgba(244,185,100,0.08) 0%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
            )}

            <CardHeader style={{ position: "relative" }}>
              <p className="sb-label" style={{ color: "#e8956a", marginBottom: 4 }}>
                {tier.name}
              </p>
              <CardTitle>
                <span className="sb-data" style={{ fontSize: 40, color: "#eaeef1" }}>
                  ${tier.price}
                </span>
                <span className="sb-caption" style={{ color: "#6d8d9f", marginLeft: 4 }}>
                  /month
                </span>
              </CardTitle>
              <p className="sb-body-sm" style={{ color: "#6d8d9f", marginTop: 4 }}>
                {tier.description}
              </p>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="sb-body-sm flex items-start gap-2"
                    style={{ color: "#d4dce2" }}
                  >
                    <span
                      style={{
                        color: "#f4b964",
                        flexShrink: 0,
                        marginTop: 2,
                        fontWeight: 700,
                      }}
                    >
                      &#x2713;
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <SignedIn>
                {product ? (
                  <CheckoutLink
                    polarApi={api.polar}
                    productIds={[product.id]}
                    embed={false}
                  >
                    <Button
                      className={
                        tier.popular ? "sb-btn-primary w-full" : "sb-btn-secondary w-full"
                      }
                    >
                      Subscribe
                    </Button>
                  </CheckoutLink>
                ) : (
                  <Button
                    className={
                      tier.popular ? "sb-btn-primary w-full" : "sb-btn-secondary w-full"
                    }
                    disabled
                  >
                    Loading...
                  </Button>
                )}
              </SignedIn>

              <SignedOut>
                <Link href="/sign-up" className="w-full">
                  <Button
                    className={
                      tier.popular ? "sb-btn-primary w-full" : "sb-btn-secondary w-full"
                    }
                  >
                    Get Started
                  </Button>
                </Link>
              </SignedOut>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      style={{ padding: "120px 0", background: "#071a26" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="sb-label" style={{ color: "#e8956a", marginBottom: 8 }}>
            PRICING
          </p>
          <h2 className="sb-h2" style={{ color: "#eaeef1", marginBottom: 12 }}>
            Simple, transparent pricing
          </h2>
          <p className="sb-body" style={{ color: "#6d8d9f" }}>
            No hidden fees. Cancel anytime. Start free.
          </p>
        </div>

        {/* Subscription status (signed-in users only) */}
        <SignedIn>
          <SubscriptionStatus />
        </SignedIn>

        <PricingCards />

        {/* Link to full pricing page */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/pricing">
            <Button className="sb-btn-ghost" style={{ fontSize: 15 }}>
              See full comparison <span className="sb-arrow">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
