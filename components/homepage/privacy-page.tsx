"use client"

import { MarketingLayout } from "@/components/homepage/marketing-layout"

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Account Information",
        text: "When you create a PixelPrism account, we collect your name, email address, and profile information through our authentication provider, Clerk. If you sign up using a third-party service (such as Google or GitHub), we receive the profile information you have made publicly available on that service.",
      },
      {
        subtitle: "Usage Data",
        text: "We automatically collect information about how you interact with PixelPrism, including pages visited, features used, actions taken within the dashboard, timestamps, referring URLs, browser type, operating system, and device identifiers. This data helps us understand usage patterns and improve the product.",
      },
      {
        subtitle: "Content You Create",
        text: "We store the content you create and upload through PixelPrism, including brand profiles, logos, product information, social media posts, creative assets, scheduling data, and any other materials you produce using our creative studio and marketing tools.",
      },
      {
        subtitle: "Payment Information",
        text: "When you subscribe to a paid plan, payment processing is handled by our billing partner, Polar. We do not directly store your full credit card number or banking details. We may receive and store limited billing information such as your billing name, email, subscription plan, and transaction history.",
      },
      {
        subtitle: "Connected Platform Data",
        text: "If you connect social media accounts to PixelPrism for publishing or analytics purposes, we may collect data from those platforms in accordance with their APIs and your authorization, including follower counts, engagement metrics, and post performance data.",
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: "Providing and Maintaining Our Services",
        text: "We use your information to operate PixelPrism, deliver the features you request, process transactions, manage your account, and provide customer support. This includes generating analytics, facilitating content scheduling, and enabling multi-brand management.",
      },
      {
        subtitle: "Improving and Developing Our Product",
        text: "We analyze aggregated usage data to identify trends, diagnose technical issues, improve existing features, and develop new functionality. We may use anonymized and aggregated data for research and product development purposes.",
      },
      {
        subtitle: "Communications",
        text: "We may use your email address to send you essential account notifications, security alerts, billing receipts, and service updates. With your consent, we may also send product announcements, tips, and marketing communications. You can opt out of non-essential communications at any time.",
      },
      {
        subtitle: "Security and Fraud Prevention",
        text: "We use your information to detect, investigate, and prevent fraudulent transactions, unauthorized access, and other illegal or harmful activities. This includes monitoring for suspicious behavior and enforcing our terms of service.",
      },
    ],
  },
  {
    title: "3. Third-Party Services",
    content: [
      {
        subtitle: null,
        text: "PixelPrism integrates with several third-party services to deliver its functionality. Each of these services has its own privacy policy governing their handling of your data:",
      },
      {
        subtitle: "Clerk (Authentication)",
        text: "We use Clerk to manage user authentication, account creation, and session management. Clerk processes your login credentials, email address, and profile information. For more details, visit Clerk's privacy policy at clerk.com/legal/privacy.",
      },
      {
        subtitle: "Convex (Database & Backend)",
        text: "Your account data, content, and application state are stored using Convex, a real-time backend platform. Convex processes and stores your data on secure infrastructure. For more details, visit Convex's privacy policy at convex.dev/legal/privacy.",
      },
      {
        subtitle: "Polar (Payments & Subscriptions)",
        text: "Subscription billing and payment processing are handled by Polar. When you subscribe to a paid plan, Polar processes your payment information and manages your subscription lifecycle. For more details, visit Polar's privacy policy at polar.sh/legal/privacy.",
      },
      {
        subtitle: "Social Media Platforms",
        text: "When you connect social media accounts (such as Instagram, Facebook, X/Twitter, LinkedIn, or TikTok), data is exchanged via those platforms' official APIs. We only access the data you authorize and in accordance with each platform's developer terms and privacy policies.",
      },
    ],
  },
  {
    title: "4. Data Storage & Security",
    content: [
      {
        subtitle: null,
        text: "We take the security of your data seriously and implement industry-standard measures to protect it:",
      },
      {
        subtitle: "Encryption",
        text: "All data transmitted between your browser and our servers is encrypted using TLS (Transport Layer Security). Data at rest is encrypted using AES-256 encryption on our infrastructure providers' systems.",
      },
      {
        subtitle: "Secure Infrastructure",
        text: "Our application and data are hosted on enterprise-grade cloud infrastructure with SOC 2 compliant providers. We employ network-level security controls, regular security audits, and automated vulnerability scanning.",
      },
      {
        subtitle: "Access Controls",
        text: "Access to user data within our organization is restricted to authorized personnel on a need-to-know basis. We use role-based access controls, multi-factor authentication, and audit logging for all administrative access.",
      },
      {
        subtitle: "Incident Response",
        text: "In the event of a data breach that affects your personal information, we will notify you and any applicable regulatory authorities in accordance with applicable law, typically within 72 hours of becoming aware of the breach.",
      },
    ],
  },
  {
    title: "5. Cookies & Tracking",
    content: [
      {
        subtitle: "Essential Cookies",
        text: "We use strictly necessary cookies to maintain your authentication session, remember your preferences, and ensure the application functions correctly. These cookies are required for PixelPrism to operate and cannot be disabled.",
      },
      {
        subtitle: "Analytics",
        text: "We may use analytics tools to collect anonymized usage data, including page views, feature usage, and performance metrics. This data is used exclusively to understand how our product is used and to identify areas for improvement. We do not sell analytics data to third parties.",
      },
      {
        subtitle: "No Third-Party Advertising Trackers",
        text: "PixelPrism does not use third-party advertising cookies or tracking pixels. We do not sell your personal information to advertisers or data brokers.",
      },
    ],
  },
  {
    title: "6. Your Rights",
    content: [
      {
        subtitle: null,
        text: "Depending on your location, you may have the following rights regarding your personal data. To exercise any of these rights, contact us at hello@pixelprism.tech:",
      },
      {
        subtitle: "Access",
        text: "You have the right to request a copy of the personal information we hold about you. We will provide this information in a commonly used, machine-readable format within 30 days of your request.",
      },
      {
        subtitle: "Correction",
        text: "You can update most of your account information directly through your PixelPrism dashboard settings. If you need assistance correcting any information, contact our support team.",
      },
      {
        subtitle: "Deletion",
        text: "You can request the deletion of your account and associated personal data at any time. Upon receiving a verified deletion request, we will remove your data within 30 days, except where we are required by law to retain certain records.",
      },
      {
        subtitle: "Data Portability",
        text: "You have the right to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another service provider without hindrance.",
      },
      {
        subtitle: "Objection & Restriction",
        text: "You may object to the processing of your personal data for certain purposes, including direct marketing. You can also request that we restrict the processing of your data under certain circumstances.",
      },
    ],
  },
  {
    title: "7. Data Retention",
    content: [
      {
        subtitle: "Active Accounts",
        text: "We retain your personal data for as long as your account is active and as needed to provide you with our services. Your content, brand data, and usage history remain accessible to you throughout the life of your account.",
      },
      {
        subtitle: "After Account Deletion",
        text: "When you delete your account, we will remove your personal data from our active systems within 30 days. Some data may persist in encrypted backups for up to 90 days before being permanently deleted. Anonymized, aggregated data that cannot be used to identify you may be retained indefinitely for analytics purposes.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may retain certain information for longer periods when required by law, such as tax records, transaction history, or data relevant to ongoing legal proceedings. We will inform you if such retention applies to your data.",
      },
    ],
  },
  {
    title: "8. Children's Privacy",
    content: [
      {
        subtitle: null,
        text: "PixelPrism is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected personal data from a child under 13, we will take steps to delete that information as promptly as possible. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at hello@pixelprism.tech so we can take appropriate action.",
      },
    ],
  },
  {
    title: "9. Changes to This Policy",
    content: [
      {
        subtitle: null,
        text: 'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will notify you by posting the updated policy on this page with a revised "Last updated" date. For significant changes that affect how we process your personal data, we will also notify you via email or through an in-app notification at least 30 days before the changes take effect. We encourage you to review this policy periodically to stay informed about how we protect your information.',
      },
    ],
  },
  {
    title: "10. Contact Us",
    content: [
      {
        subtitle: null,
        text: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
      },
    ],
  },
]

export function PrivacyPageContent() {
  return (
    <MarketingLayout>
      <div>
        {/* Hero */}
        <section
          style={{
            padding: "100px 0 80px",
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(244,185,100,0.06) 0%, transparent 70%), #071a26",
          }}
        >
          <div
            style={{
              maxWidth: 780,
              margin: "0 auto",
              padding: "0 32px",
              textAlign: "center",
            }}
          >
            <p
              className="sb-label"
              style={{
                color: "#e8956a",
                marginBottom: 16,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              PRIVACY POLICY
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
              Your <span style={{ color: "#f4b964" }}>privacy</span> matters.
            </h1>
            <p
              className="sb-body"
              style={{
                color: "#6d8d9f",
                maxWidth: 540,
                margin: "0 auto",
                fontSize: 17,
                lineHeight: 1.6,
              }}
            >
              We believe in transparency. This policy explains what data we
              collect, how we use it, and the choices you have.
            </p>
            <p
              className="sb-caption"
              style={{
                color: "#6d8d9f",
                marginTop: 24,
                opacity: 0.7,
              }}
            >
              Last updated: March 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: "0 0 140px", background: "#071a26" }}>
          <div
            style={{
              maxWidth: 780,
              margin: "0 auto",
              padding: "0 32px",
            }}
          >
            {SECTIONS.map((section, i) => (
              <div
                key={section.title}
                style={{
                  paddingTop: 40,
                  paddingBottom: 40,
                  borderBottom:
                    i < SECTIONS.length - 1
                      ? "1px solid rgba(244,185,100,0.08)"
                      : "none",
                }}
              >
                <h2
                  className="sb-h3"
                  style={{
                    color: "#eaeef1",
                    marginBottom: 24,
                  }}
                >
                  {section.title}
                </h2>

                {section.content.map((block, j) => (
                  <div key={j} style={{ marginBottom: j < section.content.length - 1 ? 20 : 0 }}>
                    {block.subtitle && (
                      <h3
                        className="sb-label"
                        style={{
                          color: "#f4b964",
                          marginBottom: 8,
                          fontSize: 13,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {block.subtitle}
                      </h3>
                    )}
                    <p
                      className="sb-body-sm"
                      style={{
                        color: "#d4dce2",
                        lineHeight: 1.8,
                        margin: 0,
                      }}
                    >
                      {block.text}
                    </p>
                  </div>
                ))}

                {/* Contact details for the final section */}
                {section.title === "10. Contact Us" && (
                  <div
                    style={{
                      marginTop: 20,
                      padding: "24px 28px",
                      background: "#0e2838",
                      border: "1px solid rgba(244,185,100,0.12)",
                      borderRadius: 0,
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <p
                        className="sb-label"
                        style={{ color: "#6d8d9f", marginBottom: 4 }}
                      >
                        Email
                      </p>
                      <a
                        href="mailto:hello@pixelprism.tech"
                        className="sb-body"
                        style={{
                          color: "#f4b964",
                          textDecoration: "none",
                        }}
                      >
                        hello@pixelprism.tech
                      </a>
                    </div>
                    <div>
                      <p
                        className="sb-label"
                        style={{ color: "#6d8d9f", marginBottom: 4 }}
                      >
                        Company
                      </p>
                      <p
                        className="sb-body-sm"
                        style={{ color: "#d4dce2", margin: 0 }}
                      >
                        PixelPrism
                      </p>
                    </div>
                    <p
                      className="sb-body-sm"
                      style={{
                        color: "#6d8d9f",
                        marginTop: 20,
                        marginBottom: 0,
                        lineHeight: 1.8,
                      }}
                    >
                      We aim to respond to all privacy-related inquiries within
                      5 business days.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}
