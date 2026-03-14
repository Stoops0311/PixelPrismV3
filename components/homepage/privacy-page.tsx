"use client"

import { MarketingLayout } from "@/components/homepage/marketing-layout"

export function PrivacyPageContent() {
  return (
    <MarketingLayout>
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "80px 32px 120px",
        }}
      >
        <h1
          className="sb-headline"
          style={{ color: "#eaeef1", marginBottom: 12 }}
        >
          Privacy Policy
        </h1>
        <p className="sb-caption" style={{ color: "#6d8d9f", marginBottom: 56 }}>
          Last updated: March 14, 2026
        </p>

        {SECTIONS.map((section, i) => (
          <section key={i} style={{ marginBottom: 48 }}>
            <h2
              className="sb-title-sm"
              style={{ color: "#eaeef1", marginBottom: 16 }}
            >
              {section.title}
            </h2>
            {section.content.map((block, j) => {
              if (typeof block === "string") {
                return (
                  <p
                    key={j}
                    className="sb-body"
                    style={{
                      color: "#94b0c0",
                      lineHeight: 1.75,
                      marginBottom: 16,
                    }}
                  >
                    {block}
                  </p>
                )
              }
              return (
                <ul
                  key={j}
                  style={{
                    listStyle: "disc",
                    paddingLeft: 24,
                    marginBottom: 16,
                  }}
                >
                  {block.map((item, k) => (
                    <li
                      key={k}
                      className="sb-body"
                      style={{
                        color: "#94b0c0",
                        lineHeight: 1.75,
                        marginBottom: 6,
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )
            })}
          </section>
        ))}

        <div
          style={{
            borderTop: "1px solid rgba(244,185,100,0.08)",
            paddingTop: 32,
            marginTop: 64,
          }}
        >
          <p className="sb-body" style={{ color: "#6d8d9f", lineHeight: 1.75 }}>
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href="mailto:privacy@pixelprism.app"
              style={{ color: "#f4b964", textDecoration: "underline" }}
            >
              privacy@pixelprism.app
            </a>
            .
          </p>
        </div>
      </div>
    </MarketingLayout>
  )
}

type SectionBlock = string | string[]

const SECTIONS: { title: string; content: SectionBlock[] }[] = [
  {
    title: "1. Introduction",
    content: [
      "Welcome to PixelPrism. This Privacy Policy explains how PixelPrism, Inc. (\"PixelPrism,\" \"we,\" \"us,\" or \"our\") collects, uses, discloses, and protects your personal information when you access or use our website at pixelprism.app, our web-based social media marketing platform, and any related services, features, content, or applications we offer (collectively, the \"Services\").",
      "We are committed to protecting your privacy and handling your data with transparency and care. This Privacy Policy applies to all users of our Services, including visitors to our website, free-tier users, and paid subscribers. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the practices described in this Privacy Policy, please do not use our Services.",
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. We will notify you of any material changes by posting the updated Privacy Policy on our website with a revised \"Last Updated\" date, and where required by law, we will obtain your consent to any material changes. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.",
    ],
  },
  {
    title: "2. Information We Collect",
    content: [
      "We collect information in several ways depending on how you interact with our Services. The types of information we collect include:",
      "Account Information: When you create an account with PixelPrism, we collect personal information that you voluntarily provide to us, including your full name, email address, company or business name, job title or role, profile photograph (if provided), and billing address. If you sign up using a third-party authentication provider such as Google or GitHub, we may receive your name, email address, and profile image from that provider.",
      "Payment and Billing Information: When you subscribe to a paid plan or purchase credits, we collect billing details such as your billing name, billing address, and payment method details. Payment processing is handled by our third-party payment processor, and we do not directly store your full credit card number, bank account number, or other sensitive payment instrument details on our servers.",
      "Brand and Business Data: To provide our social media marketing services, we collect information about the brands you manage through our platform, including brand names, logos, brand descriptions, product information, product images, brand guidelines, color palettes, tone of voice preferences, target audience descriptions, and any other brand-related content you upload or input into the platform.",
      "Social Media Account Data: When you connect your social media accounts (such as Instagram, Facebook, Twitter/X, LinkedIn, TikTok, Pinterest, or other platforms) to PixelPrism, we collect access tokens, profile information, follower and engagement metrics, post performance data, audience demographic data, and other analytics information made available through those platforms' APIs. The specific data collected depends on the permissions you grant and the capabilities of each social media platform's API.",
      "Content and Creative Assets: We collect content that you create, upload, or generate through our platform, including images, videos, graphics, captions, hashtags, post templates, scheduling preferences, campaign strategies, and any other creative materials you produce or store within our Services.",
      "Usage and Analytics Data: We automatically collect information about how you interact with our Services, including:",
      [
        "Device information such as your device type, operating system, browser type and version, screen resolution, and unique device identifiers",
        "Log data including your IP address, access times, pages viewed, features used, clickstream data, and referring URLs",
        "Performance data such as page load times, errors encountered, and feature usage patterns",
        "Session information including session duration, frequency of visits, and navigation paths through our platform",
      ],
      "Cookies and Tracking Technologies: We use cookies, web beacons, pixels, and similar tracking technologies to collect information about your browsing activities, remember your preferences, authenticate your sessions, analyze trends, administer the website, track user movements around the site, and gather demographic information about our user base as a whole. You can control the use of cookies at the individual browser level, but if you choose to disable cookies, it may limit your use of certain features or functions on our website or Services.",
      "Communications Data: When you contact us through our contact form, email, live chat, or other communication channels, we collect the content of your messages, your contact information, and any other information you choose to provide. We may also collect information from your interactions with our customer support team for quality assurance and training purposes.",
      "Third-Party Data: We may receive information about you from third-party sources, including social media platforms, analytics providers, advertising networks, data enrichment services, and publicly available sources. We may combine this information with other information we collect about you to improve our Services, personalize your experience, and for other purposes described in this Privacy Policy.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: [
      "We use the information we collect for the following purposes:",
      [
        "Providing, maintaining, and improving our Services, including processing your transactions, managing your account, and delivering the features and functionality you request",
        "Personalizing your experience by tailoring content, recommendations, and features based on your preferences, usage patterns, and brand requirements",
        "Processing payments, managing subscriptions, tracking credit usage, and administering billing-related communications",
        "Generating social media content, scheduling posts, analyzing performance metrics, and providing insights and recommendations to optimize your social media marketing strategy",
        "Communicating with you about your account, responding to your inquiries and support requests, sending service-related announcements, and providing information about new features, updates, or changes to our Services",
        "Sending you marketing and promotional communications about our products, services, and offers that may be of interest to you, subject to your communication preferences and applicable law",
        "Conducting research and analysis to better understand how users access and use our Services, to improve and optimize our platform, and to develop new products, services, features, and functionality",
        "Detecting, investigating, and preventing fraudulent transactions, unauthorized access, and other illegal activities, and protecting the rights, property, and safety of PixelPrism, our users, and the public",
        "Complying with legal obligations, responding to lawful requests from public authorities, enforcing our terms of service, and exercising or defending legal claims",
        "Training and improving our machine learning models and artificial intelligence systems to enhance the quality and relevance of the content generation, analytics, and other AI-powered features within our Services",
        "Aggregating and anonymizing data for statistical analysis, benchmarking, and reporting purposes",
      ],
    ],
  },
  {
    title: "4. How We Share Your Information",
    content: [
      "We do not sell your personal information to third parties. We may share your information in the following circumstances:",
      "Service Providers: We share information with third-party service providers who perform services on our behalf, such as payment processing (e.g., Stripe, Polar), cloud hosting and infrastructure (e.g., Vercel, Convex), authentication services (e.g., Clerk), email delivery, analytics, customer support tools, and other services necessary to operate and improve our platform. These service providers are contractually obligated to use your information only for the purposes of providing services to us and in accordance with this Privacy Policy.",
      "Social Media Platforms: When you use our Services to publish content to your connected social media accounts, we share the relevant content (posts, images, captions, scheduling information) with those platforms through their APIs. This sharing is initiated by you and is governed by the respective platform's terms of service and privacy policies.",
      "Business Transfers: In the event of a merger, acquisition, reorganization, bankruptcy, or other similar event, your information may be transferred as part of the transaction. We will notify you via email and/or a prominent notice on our website of any change in ownership or uses of your personal information, as well as any choices you may have regarding your personal information.",
      "Legal Requirements: We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend the rights or property of PixelPrism, prevent or investigate possible wrongdoing in connection with our Services, protect the personal safety of users of our Services or the public, or protect against legal liability.",
      "With Your Consent: We may share your information with third parties when you have given us your explicit consent to do so, such as when you opt in to integrations or data sharing with partner services.",
      "Aggregated and De-Identified Data: We may share aggregated or de-identified information that cannot reasonably be used to identify you with third parties for research, marketing, analytics, and other purposes.",
    ],
  },
  {
    title: "5. Data Security",
    content: [
      "We take the security of your personal information seriously and implement appropriate technical, administrative, and physical safeguards designed to protect your information from unauthorized access, use, alteration, disclosure, or destruction. Our security measures include, but are not limited to:",
      [
        "Encryption of data in transit using TLS/SSL protocols and encryption of sensitive data at rest",
        "Regular security assessments, vulnerability scanning, and penetration testing of our systems and infrastructure",
        "Access controls and authentication mechanisms to limit access to personal information to authorized personnel who need it to perform their job duties",
        "Employee security awareness training and confidentiality agreements",
        "Incident response procedures for detecting, responding to, and recovering from security incidents",
        "Regular backups and disaster recovery procedures to ensure the availability and resilience of our systems",
      ],
      "While we strive to protect your personal information, no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee the absolute security of your information. If you have reason to believe that your interaction with us is no longer secure, please immediately notify us by contacting us at the email address provided in the Contact Information section below.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "We retain your personal information for as long as your account is active or as needed to provide you with our Services. We will also retain your information as necessary to comply with our legal obligations, resolve disputes, enforce our agreements, and for other legitimate business purposes.",
      "When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain certain information by law or for legitimate business purposes such as fraud prevention, compliance with financial regulations, or the defense of legal claims. Aggregated or de-identified data that cannot be used to identify you may be retained indefinitely for analytics and research purposes.",
      "Content that you have published to third-party social media platforms through our Services is governed by the data retention policies of those respective platforms and will not be affected by the deletion of your PixelPrism account.",
      "Backup copies of your data may persist in our systems for a limited period after deletion as part of our regular backup and disaster recovery processes, but will be permanently deleted in accordance with our backup retention schedules, which typically do not exceed 90 days.",
    ],
  },
  {
    title: "7. Your Rights and Choices",
    content: [
      "Depending on your jurisdiction, you may have certain rights regarding your personal information. These rights may include:",
      [
        "Access: The right to request access to the personal information we hold about you, including a copy of your data in a portable format",
        "Correction: The right to request that we correct any inaccurate or incomplete personal information we hold about you",
        "Deletion: The right to request that we delete your personal information, subject to certain exceptions provided by law",
        "Restriction: The right to request that we restrict the processing of your personal information in certain circumstances",
        "Objection: The right to object to the processing of your personal information for certain purposes, including direct marketing",
        "Data Portability: The right to receive your personal information in a structured, commonly used, and machine-readable format and to transmit that data to another controller",
        "Withdrawal of Consent: Where we rely on your consent to process your personal information, you have the right to withdraw your consent at any time, without affecting the lawfulness of processing based on consent before its withdrawal",
        "Non-Discrimination: The right not to receive discriminatory treatment for exercising your privacy rights",
      ],
      "To exercise any of these rights, please contact us using the contact information provided at the end of this Privacy Policy. We will respond to your request within the timeframe required by applicable law (typically 30 to 45 days). We may ask you to verify your identity before fulfilling your request to protect your privacy and security.",
      "Marketing Communications: You can opt out of receiving marketing communications from us by clicking the \"unsubscribe\" link in our marketing emails or by contacting us directly. Even if you opt out of marketing communications, we will continue to send you service-related communications that are necessary for the operation of your account.",
      "Cookie Preferences: Most web browsers allow you to control cookies through your browser settings. You can typically set your browser to refuse all cookies or to indicate when a cookie is being set. However, some features of our Services may not function properly if you disable cookies.",
    ],
  },
  {
    title: "8. International Data Transfers",
    content: [
      "PixelPrism is based in the United States, and your information may be collected, used, and stored in the United States or other countries where our service providers operate. These countries may have data protection laws that are different from the laws of your jurisdiction.",
      "If you are located in the European Economic Area (EEA), the United Kingdom, or Switzerland, we will ensure that any transfer of your personal information to countries outside of those regions is subject to appropriate safeguards as required by applicable data protection law. These safeguards may include Standard Contractual Clauses approved by the European Commission, adequacy decisions, binding corporate rules, or other legally recognized mechanisms.",
      "By using our Services, you acknowledge that your information may be transferred to and processed in the United States and other jurisdictions that may not provide the same level of data protection as your home country. We will take all reasonable steps to ensure that your data is treated securely and in accordance with this Privacy Policy.",
    ],
  },
  {
    title: "9. Children's Privacy",
    content: [
      "Our Services are not directed to children under the age of 16, and we do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under the age of 16, we will take steps to delete such information as quickly as possible. If you believe that a child under 16 has provided us with personal information, please contact us immediately at the email address provided in the Contact Information section below.",
      "If you are between the ages of 16 and 18, you may only use our Services with the involvement and consent of a parent or legal guardian. We encourage parents and guardians to monitor their children's online activities and to help enforce this Privacy Policy by instructing their children to never provide personal information on our Services without their permission.",
    ],
  },
  {
    title: "10. California Privacy Rights (CCPA/CPRA)",
    content: [
      "If you are a California resident, you have certain additional rights under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA). These rights include:",
      [
        "The right to know what categories and specific pieces of personal information we have collected about you, the categories of sources from which we collect personal information, the business or commercial purpose for collecting your personal information, and the categories of third parties with whom we share your personal information",
        "The right to delete personal information we have collected from you, subject to certain exceptions",
        "The right to correct inaccurate personal information that we maintain about you",
        "The right to opt out of the sale or sharing of your personal information — however, PixelPrism does not sell or share your personal information as those terms are defined under the CCPA/CPRA",
        "The right to limit the use and disclosure of your sensitive personal information — we only use sensitive personal information for purposes authorized by the CCPA/CPRA",
        "The right not to be discriminated against for exercising your CCPA/CPRA rights",
      ],
      "To exercise your California privacy rights, please contact us at privacy@pixelprism.app. We will verify your identity before fulfilling any request and respond within 45 days as required by law. You may also designate an authorized agent to submit requests on your behalf.",
      "In the preceding twelve months, we have collected the following categories of personal information: identifiers, commercial information, internet and electronic network activity information, geolocation data, professional or employment-related information, and inferences drawn from the above. We collect this information for the business and commercial purposes described in Section 3 of this Privacy Policy.",
    ],
  },
  {
    title: "11. European Privacy Rights (GDPR)",
    content: [
      "If you are located in the European Economic Area (EEA), the United Kingdom, or Switzerland, we process your personal information on the following legal bases under the General Data Protection Regulation (GDPR):",
      [
        "Contract Performance: We process your information as necessary to perform our contract with you (i.e., our Terms of Service) and to provide our Services",
        "Legitimate Interests: We process your information for our legitimate business interests, such as improving our Services, preventing fraud, ensuring security, and marketing our products and services, where these interests are not overridden by your data protection rights",
        "Consent: We process certain information based on your consent, such as for marketing communications and certain cookies. You may withdraw your consent at any time",
        "Legal Obligations: We process your information as necessary to comply with applicable legal obligations",
      ],
      "You have the right to lodge a complaint with a supervisory authority in your country of residence if you believe that our processing of your personal information violates applicable data protection law. However, we encourage you to contact us first so that we can try to resolve your concern directly.",
      "Our Data Protection Officer (or designated privacy contact) can be reached at privacy@pixelprism.app for any questions or concerns about our processing of your personal data under the GDPR.",
    ],
  },
  {
    title: "12. Third-Party Links and Services",
    content: [
      "Our Services may contain links to third-party websites, products, or services that are not owned or controlled by PixelPrism. This Privacy Policy applies only to our Services and does not apply to any third-party websites or services. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.",
      "We encourage you to review the privacy policies of every third-party website or service that you visit or interact with. Your interactions with those third-party websites or services are governed by their own terms of service and privacy policies, and we are not responsible for the privacy practices or content of such third parties.",
      "Our platform integrates with various social media platforms and third-party tools. When you connect these services to your PixelPrism account, the data shared with and received from those services is subject to both this Privacy Policy and the privacy policies of those respective services. We recommend reviewing the privacy settings and policies of each connected service.",
    ],
  },
  {
    title: "13. Do Not Track Signals",
    content: [
      "Some web browsers transmit \"Do Not Track\" (DNT) signals to the websites and online services that a user visits. There is currently no universally accepted standard for how companies should respond to DNT signals. At this time, PixelPrism does not respond to DNT signals. However, you can manage your tracking preferences through your browser settings and our cookie preferences, as described in Section 7 of this Privacy Policy.",
      "We will continue to monitor developments regarding DNT standards and may adjust our practices in the future if a uniform standard is established.",
    ],
  },
  {
    title: "14. Changes to This Privacy Policy",
    content: [
      "We reserve the right to update or modify this Privacy Policy at any time, and any changes will be effective upon posting of the revised Privacy Policy on our website. We will indicate the date of the last revision at the top of this page. If we make material changes to this Privacy Policy, we will notify you by email (sent to the email address associated with your account), by a prominent notice on our website, or through other communication channels as appropriate.",
      "We encourage you to review this Privacy Policy regularly to stay informed about our information practices and the ways you can help protect your privacy. Your continued use of our Services after the effective date of any changes to this Privacy Policy constitutes your acceptance of the revised Privacy Policy.",
    ],
  },
  {
    title: "15. Contact Information",
    content: [
      "If you have any questions, concerns, or complaints about this Privacy Policy, our data practices, or your rights regarding your personal information, please contact us at:",
      [
        "Email: privacy@pixelprism.app",
        "Company: PixelPrism, Inc.",
        "Website: pixelprism.app",
      ],
      "We will endeavor to respond to your inquiry within 30 days or within the timeframe required by applicable law. If you are not satisfied with our response, you may have the right to lodge a complaint with your local data protection authority.",
    ],
  },
]
