"use client"

import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { CheckoutLink } from "@convex-dev/polar/react"
import { DS2PageLayout } from "@/components/ds2/page-layout"
import { DS2Section } from "@/components/ds2/section"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PRICING_TIERS } from "@/lib/polar"

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
]

function AuthButtons() {
  return (
    <>
      <SignedOut>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button className="sb-btn-secondary">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="sb-btn-primary">Sign Up</Button>
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}

function SubscriptionStatus() {
  const user = useQuery(api.polar.currentWithSubscription)

  if (user === undefined) return null // loading
  if (user === null) return null // not signed in

  if (!user.subscription) {
    return (
      <div
        className="text-center mb-8 p-4"
        style={{ border: "1px solid rgba(244,185,100,0.12)", background: "rgba(244,185,100,0.04)" }}
      >
        <p className="sb-body-sm" style={{ color: "#6d8d9f" }}>
          You don&apos;t have an active subscription yet.
        </p>
      </div>
    )
  }

  return (
    <div
      className="text-center mb-8 p-4"
      style={{ border: "1px solid rgba(244,185,100,0.25)", background: "rgba(244,185,100,0.06)" }}
    >
      <p className="sb-label" style={{ color: "#f4b964", marginBottom: 4 }}>
        Current Plan
      </p>
      <p className="sb-h4" style={{ color: "#eaeef1" }}>
        {user.subscription.productKey
          ? user.subscription.productKey.charAt(0).toUpperCase() + user.subscription.productKey.slice(1)
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
              transition: "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = ""
            }}
          >
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
                }}
              >
                Most Popular
              </div>
            )}
            <CardHeader>
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
                    <span style={{ color: "#f4b964", flexShrink: 0, marginTop: 2 }}>&#x2713;</span>
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
                    <Button className={tier.popular ? "sb-btn-primary w-full" : "sb-btn-secondary w-full"}>
                      Subscribe
                    </Button>
                  </CheckoutLink>
                ) : (
                  <Button className={tier.popular ? "sb-btn-primary w-full" : "sb-btn-secondary w-full"} disabled>
                    Loading...
                  </Button>
                )}
              </SignedIn>
              <SignedOut>
                <Link href="/sign-up">
                  <Button className={tier.popular ? "sb-btn-primary w-full" : "sb-btn-secondary w-full"}>
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

export default function HomePage() {
  return (
    <DS2PageLayout
      navItems={navItems}
      logo="/main-logo.png"
      brandName="PixelPrism"
      navActions={<AuthButtons />}
    >
      {/* Hero */}
      <section className="pt-8 pb-16 text-center">
        <p
          className="sb-label tracking-widest mb-6"
          style={{ color: "#e8956a" }}
        >
          Social Media Marketing
        </p>
        <h1 className="sb-display mb-6" style={{ color: "#eaeef1" }}>
          Your brand,<br />
          <span style={{ color: "#f4b964" }}>amplified.</span>
        </h1>
        <p
          className="sb-body max-w-xl mx-auto mb-10"
          style={{ color: "#6d8d9f", fontSize: 17 }}
        >
          Schedule posts, track analytics, and grow your audience across every
          platform — all from one brutally simple dashboard.
        </p>
        <div className="flex items-center justify-center gap-4">
          <SignedOut>
            <Link href="/sign-up">
              <Button className="sb-btn-primary" style={{ padding: "12px 32px", fontSize: 15 }}>
                Get Started
              </Button>
            </Link>
            <Link href="#pricing">
              <Button className="sb-btn-ghost">
                View Pricing <span className="sb-arrow">→</span>
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button className="sb-btn-primary" style={{ padding: "12px 32px", fontSize: 15 }}>
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Pricing */}
      <DS2Section
        id="pricing"
        label="Pricing"
        title="Simple, transparent pricing"
        subtitle="No hidden fees. Cancel anytime."
      >
        <SignedIn>
          <SubscriptionStatus />
        </SignedIn>
        <PricingCards />
      </DS2Section>
    </DS2PageLayout>
  )
}
