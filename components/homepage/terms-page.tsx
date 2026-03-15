"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { MarketingLayout } from "@/components/homepage/marketing-layout"

gsap.registerPlugin(ScrollTrigger)

const sectionDivider: React.CSSProperties = {
  height: 1,
  background: "rgba(244,185,100,0.08)",
  margin: 0,
}

const sectionStyle: React.CSSProperties = {
  padding: "40px 0",
}

const h2Style: React.CSSProperties = {
  color: "#eaeef1",
  marginBottom: 16,
}

const bodyStyle: React.CSSProperties = {
  color: "#d4dce2",
  lineHeight: 1.8,
  margin: 0,
}

const listStyle: React.CSSProperties = {
  color: "#d4dce2",
  lineHeight: 1.8,
  margin: "12px 0 0 0",
  paddingLeft: 24,
}

const linkStyle: React.CSSProperties = {
  color: "#f4b964",
  textDecoration: "none",
}

export function TermsPageContent() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    gsap.from(".terms-hero", {
      scrollTrigger: {
        trigger: ".terms-hero",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: "power2.out",
    })

    gsap.from(".terms-section", {
      scrollTrigger: {
        trigger: ".terms-content",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out",
    })
  }, { scope: containerRef })

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
            className="terms-hero"
            style={{
              maxWidth: 780,
              margin: "0 auto",
              padding: "0 32px",
              textAlign: "center",
            }}
          >
            <p
              className="sb-label"
              style={{ color: "#e8956a", marginBottom: 16, letterSpacing: "0.15em" }}
            >
              LEGAL
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
              Terms of <span style={{ color: "#f4b964" }}>Service</span>
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
              Please read these terms carefully before using PixelPrism.
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

        {/* ── Content ── */}
        <section style={{ padding: "0 0 140px", background: "#071a26" }}>
          <div
            className="terms-content"
            style={{
              maxWidth: 780,
              margin: "0 auto",
              padding: "0 32px",
            }}
          >
            {/* 1. Acceptance of Terms */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                1. Acceptance of Terms
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                By accessing or using PixelPrism (&quot;the Service&quot;), operated by PixelPrism (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms, and &quot;you&quot; refers to both you individually and that organization.
              </p>
              <p className="sb-body-sm" style={{ ...bodyStyle, marginTop: 16 }}>
                If you do not agree to these Terms, you must not access or use the Service. Your continued use of the Service following any modifications to these Terms constitutes your acceptance of the revised Terms.
              </p>
            </div>

            <div style={sectionDivider} />

            {/* 2. Description of Service */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                2. Description of Service
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                PixelPrism is an AI-powered social media marketing platform designed for small and medium-sized businesses. The Service provides tools for creating, scheduling, and managing social media content across multiple platforms, including AI-assisted content generation, image creation, brand management, analytics, and post scheduling.
              </p>
              <p className="sb-body-sm" style={{ ...bodyStyle, marginTop: 16 }}>
                The Service operates on a credit-based usage model. Certain features, including AI-powered content generation, image creation, and advanced analytics, consume credits from your account balance. Credit consumption rates vary by feature and are detailed in your account dashboard and on our pricing page.
              </p>
              <p className="sb-body-sm" style={{ ...bodyStyle, marginTop: 16 }}>
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We will make commercially reasonable efforts to notify you of material changes that affect your use of the Service.
              </p>
            </div>

            <div style={sectionDivider} />

            {/* 3. Account Registration */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                3. Account Registration
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                To use the Service, you must create an account and provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <ul className="sb-body-sm" style={listStyle}>
                <li style={{ marginBottom: 8 }}>
                  You must provide truthful and accurate registration information and keep it up to date.
                </li>
                <li style={{ marginBottom: 8 }}>
                  You are responsible for safeguarding your password and any other credentials used to access your account.
                </li>
                <li style={{ marginBottom: 8 }}>
                  Each account is intended for use by a single individual. Sharing account credentials with others is prohibited.
                </li>
                <li style={{ marginBottom: 8 }}>
                  You must be at least 18 years of age (or the age of legal majority in your jurisdiction) to create an account.
                </li>
                <li>
                  You must promptly notify us at{" "}
                  <a href="mailto:hello@pixelprism.tech" style={linkStyle}>
                    hello@pixelprism.tech
                  </a>{" "}
                  if you become aware of any unauthorized access to or use of your account.
                </li>
              </ul>
            </div>

            <div style={sectionDivider} />

            {/* 4. Subscription & Billing */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                4. Subscription &amp; Billing
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                PixelPrism offers subscription plans on a recurring billing basis. By subscribing to a paid plan, you authorize us to charge your payment method on a recurring basis (monthly or annually, depending on the plan selected) until you cancel your subscription.
              </p>
              <ul className="sb-body-sm" style={listStyle}>
                <li style={{ marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>Payment processing:</strong>{" "}
                  All payments are processed securely through Polar, our third-party payment processor. By providing payment information, you agree to Polar&apos;s terms of service in addition to these Terms.
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>Plan changes:</strong>{" "}
                  You may upgrade or downgrade your subscription plan at any time. Upgrades take effect immediately, and you will be charged a prorated amount for the remainder of the current billing cycle. Downgrades take effect at the start of the next billing cycle.
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>Credit packs:</strong>{" "}
                  In addition to subscription plans, you may purchase one-time credit packs to supplement your monthly credit allowance. Credit pack purchases are non-refundable.
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>Cancellation:</strong>{" "}
                  You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing cycle, and you will retain access to paid features until that date.
                </li>
                <li>
                  <strong style={{ color: "#eaeef1" }}>Refunds:</strong>{" "}
                  Subscription fees are generally non-refundable, except where required by applicable law. If you believe you are entitled to a refund, please contact us at{" "}
                  <a href="mailto:hello@pixelprism.tech" style={linkStyle}>
                    hello@pixelprism.tech
                  </a>.
                </li>
              </ul>
            </div>

            <div style={sectionDivider} />

            {/* 5. Credits & Usage */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                5. Credits &amp; Usage
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                The Service uses a credit-based system to meter usage of certain features. Your subscription plan includes a monthly credit allowance that renews at the start of each billing cycle.
              </p>
              <ul className="sb-body-sm" style={listStyle}>
                <li style={{ marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>Monthly credits:</strong>{" "}
                  Credits included with your subscription plan reset at the beginning of each billing cycle. Unused monthly credits do not roll over to the next cycle.
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>Purchased credits:</strong>{" "}
                  Credits purchased separately as credit packs do not expire and remain in your account until used, regardless of your subscription status.
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>Credit consumption:</strong>{" "}
                  When performing actions that consume credits, the system will deduct from your purchased credit balance first, then from your monthly allowance. Credit costs for each feature are displayed before you confirm the action.
                </li>
                <li>
                  <strong style={{ color: "#eaeef1" }}>Fair use:</strong>{" "}
                  We reserve the right to impose reasonable usage limits to prevent abuse, ensure platform stability, and maintain service quality for all users. Automated or programmatic consumption of credits outside of the Service&apos;s intended interface is prohibited.
                </li>
              </ul>
            </div>

            <div style={sectionDivider} />

            {/* 6. Acceptable Use */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                6. Acceptable Use
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not:
              </p>
              <ul className="sb-body-sm" style={listStyle}>
                <li style={{ marginBottom: 8 }}>
                  Use the Service to send spam, unsolicited messages, or bulk communications in violation of applicable anti-spam laws (including CAN-SPAM, GDPR, and CASL).
                </li>
                <li style={{ marginBottom: 8 }}>
                  Create, distribute, or publish content that is illegal, defamatory, obscene, harassing, threatening, or that infringes on the intellectual property rights of others.
                </li>
                <li style={{ marginBottom: 8 }}>
                  Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code or underlying algorithms of the Service.
                </li>
                <li style={{ marginBottom: 8 }}>
                  Abuse, manipulate, or exploit AI-powered features, including but not limited to: attempting to extract training data, bypassing content safety filters, or using AI outputs to generate misleading or deceptive content at scale.
                </li>
                <li style={{ marginBottom: 8 }}>
                  Use automated scripts, bots, or other tools to access the Service in a manner that exceeds reasonable usage or circumvents rate limits.
                </li>
                <li style={{ marginBottom: 8 }}>
                  Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity.
                </li>
                <li>
                  Interfere with or disrupt the integrity, security, or performance of the Service or its underlying infrastructure.
                </li>
              </ul>
              <p className="sb-body-sm" style={{ ...bodyStyle, marginTop: 16 }}>
                We reserve the right to investigate and take appropriate action against anyone who violates these provisions, including suspending or terminating access to the Service without notice or refund.
              </p>
            </div>

            <div style={sectionDivider} />

            {/* 7. Intellectual Property */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                7. Intellectual Property
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                <strong style={{ color: "#eaeef1" }}>Your content:</strong>{" "}
                You retain all ownership rights to the content you upload, create, or provide through the Service (including brand assets, text, images, and other materials). By using the Service, you grant us a limited, non-exclusive license to process, store, and display your content solely for the purpose of providing the Service to you.
              </p>
              <p className="sb-body-sm" style={{ ...bodyStyle, marginTop: 16 }}>
                <strong style={{ color: "#eaeef1" }}>Our platform:</strong>{" "}
                The Service, including its software, design, features, documentation, and all associated intellectual property, is and remains the exclusive property of PixelPrism. These Terms do not grant you any right, title, or interest in the Service beyond the limited right to use it in accordance with these Terms.
              </p>
              <p className="sb-body-sm" style={{ ...bodyStyle, marginTop: 16 }}>
                <strong style={{ color: "#eaeef1" }}>AI-generated content:</strong>{" "}
                Content generated by the Service&apos;s AI features (including text suggestions, image generations, and content recommendations) is provided to you for your use. You are granted a perpetual, worldwide, non-exclusive license to use, modify, and distribute AI-generated content created through your account. However, you acknowledge that similar or identical content may be generated for other users, and no exclusivity is guaranteed for AI-generated outputs.
              </p>
            </div>

            <div style={sectionDivider} />

            {/* 8. Content & Social Media */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                8. Content &amp; Social Media
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                PixelPrism enables you to create and schedule content for publication on third-party social media platforms. You acknowledge and agree to the following:
              </p>
              <ul className="sb-body-sm" style={listStyle}>
                <li style={{ marginBottom: 8 }}>
                  You are solely responsible for all content you create, schedule, or publish through the Service, including ensuring that it complies with applicable laws and the terms of service of each social media platform.
                </li>
                <li style={{ marginBottom: 8 }}>
                  PixelPrism is not liable for any actions taken by third-party social media platforms in response to your content, including but not limited to content removal, account suspension, or account termination on those platforms.
                </li>
                <li style={{ marginBottom: 8 }}>
                  We do not guarantee uninterrupted access to third-party social media platforms. Changes to third-party APIs, rate limits, or platform policies may affect the availability or functionality of certain Service features.
                </li>
                <li>
                  You are responsible for maintaining valid connections and authorizations between the Service and your social media accounts. We are not responsible for failed posts or scheduling errors resulting from expired or revoked authorizations.
                </li>
              </ul>
            </div>

            <div style={sectionDivider} />

            {/* 9. Limitation of Liability */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                9. Limitation of Liability
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PIXELPRISM, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA, BUSINESS OPPORTUNITIES, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY.
              </p>
              <p className="sb-body-sm" style={{ ...bodyStyle, marginTop: 16 }}>
                OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU HAVE PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).
              </p>
              <p className="sb-body-sm" style={{ ...bodyStyle, marginTop: 16 }}>
                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT ANY DEFECTS WILL BE CORRECTED.
              </p>
            </div>

            <div style={sectionDivider} />

            {/* 10. Termination */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                10. Termination
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                Either party may terminate these Terms at any time, subject to the following:
              </p>
              <ul className="sb-body-sm" style={listStyle}>
                <li style={{ marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>By you:</strong>{" "}
                  You may terminate your account at any time by canceling your subscription and deleting your account through the Service&apos;s settings, or by contacting us at{" "}
                  <a href="mailto:hello@pixelprism.tech" style={linkStyle}>
                    hello@pixelprism.tech
                  </a>.
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>By us:</strong>{" "}
                  We may suspend or terminate your access to the Service immediately, without prior notice, if you breach these Terms, engage in conduct that we reasonably believe is harmful to other users or to the Service, or if we are required to do so by law.
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>Effect on data:</strong>{" "}
                  Upon termination, your right to access the Service ceases immediately. We will retain your data for a period of thirty (30) days following termination, during which you may request an export of your content. After this period, we may permanently delete all data associated with your account.
                </li>
                <li>
                  <strong style={{ color: "#eaeef1" }}>Survival:</strong>{" "}
                  Sections relating to intellectual property, limitation of liability, governing law, and any other provisions that by their nature should survive termination will remain in effect after these Terms are terminated.
                </li>
              </ul>
            </div>

            <div style={sectionDivider} />

            {/* 11. Changes to Terms */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                11. Changes to Terms
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                We reserve the right to modify these Terms at any time. When we make material changes, we will notify you by updating the &quot;Last updated&quot; date at the top of this page and, where appropriate, providing additional notice through the Service (such as an in-app notification or an email to the address associated with your account).
              </p>
              <p className="sb-body-sm" style={{ ...bodyStyle, marginTop: 16 }}>
                Your continued use of the Service after the effective date of any revised Terms constitutes your acceptance of those changes. If you do not agree to the updated Terms, you must stop using the Service and may terminate your account as described in Section 10.
              </p>
            </div>

            <div style={sectionDivider} />

            {/* 12. Governing Law */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                12. Governing Law
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States of America, without regard to its conflict of law provisions. Any legal action or proceeding arising under or relating to these Terms shall be brought exclusively in the state or federal courts located in the State of Delaware, and you hereby consent to the personal jurisdiction and venue of such courts.
              </p>
              <p className="sb-body-sm" style={{ ...bodyStyle, marginTop: 16 }}>
                Any dispute arising out of or relating to these Terms or the Service that cannot be resolved through good-faith negotiation shall be resolved by binding arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules. The arbitration shall take place in Delaware, and the arbitrator&apos;s decision shall be final and binding.
              </p>
            </div>

            <div style={sectionDivider} />

            {/* 13. Contact */}
            <div className="terms-section" style={sectionStyle}>
              <h2 className="sb-h3" style={h2Style}>
                13. Contact
              </h2>
              <p className="sb-body-sm" style={bodyStyle}>
                If you have any questions, concerns, or requests regarding these Terms of Service, please contact us at:
              </p>
              <div
                style={{
                  marginTop: 24,
                  padding: "24px 28px",
                  background: "#0e2838",
                  border: "1px solid rgba(244,185,100,0.12)",
                  borderRadius: 0,
                }}
              >
                <p className="sb-body-sm" style={{ ...bodyStyle, marginBottom: 8 }}>
                  <strong style={{ color: "#eaeef1" }}>PixelPrism</strong>
                </p>
                <p className="sb-body-sm" style={{ ...bodyStyle, marginBottom: 4 }}>
                  Email:{" "}
                  <a href="mailto:hello@pixelprism.tech" style={linkStyle}>
                    hello@pixelprism.tech
                  </a>
                </p>
                <p className="sb-body-sm" style={{ ...bodyStyle }}>
                  We aim to respond to all inquiries within two (2) business days.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}
