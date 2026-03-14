"use client"

import { MarketingLayout } from "@/components/homepage/marketing-layout"

export function TermsPageContent() {
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
          Terms &amp; Conditions
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
            If you have any questions about these Terms &amp; Conditions, please
            contact us at{" "}
            <a
              href="mailto:legal@pixelprism.app"
              style={{ color: "#f4b964", textDecoration: "underline" }}
            >
              legal@pixelprism.app
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
    title: "1. Acceptance of Terms",
    content: [
      "These Terms and Conditions (\"Terms,\" \"Terms and Conditions,\" or \"Agreement\") constitute a legally binding agreement between you (\"User,\" \"you,\" or \"your\") and PixelPrism, Inc. (\"PixelPrism,\" \"Company,\" \"we,\" \"us,\" or \"our\") governing your access to and use of the PixelPrism website located at pixelprism.app, our social media marketing platform, and all related services, features, content, applications, and tools (collectively, the \"Services\").",
      "By creating an account, accessing, or using our Services in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms in their entirety. If you are using our Services on behalf of an organization, business, or other entity, you represent and warrant that you have the authority to bind that entity to these Terms, and \"you\" and \"your\" will refer to that entity. If you do not agree to these Terms, you must not access or use our Services.",
      "We reserve the right to modify, update, or revise these Terms at any time in our sole discretion. We will notify you of material changes by posting the updated Terms on our website, updating the \"Last Updated\" date, and where required by law, by sending you an email notification. Your continued use of the Services after any modifications to these Terms constitutes your acceptance of the revised Terms. If you do not agree to the modified Terms, you must stop using the Services and may terminate your account as described in Section 12.",
    ],
  },
  {
    title: "2. Eligibility",
    content: [
      "To access and use our Services, you must meet the following eligibility requirements:",
      [
        "You must be at least 16 years of age. If you are between 16 and 18 years of age (or the age of majority in your jurisdiction), you may only use our Services with the consent and supervision of a parent or legal guardian who agrees to be bound by these Terms",
        "You must have the legal capacity to enter into a binding contract in your jurisdiction of residence",
        "You must not be a person barred from receiving or using the Services under the laws of the United States or any other applicable jurisdiction",
        "You must not have been previously suspended or removed from our Services for violations of these Terms or any applicable law",
        "If you are using the Services on behalf of a business or organization, you must have the authority to bind that entity to these Terms",
      ],
      "By using our Services, you represent and warrant that you meet all of the foregoing eligibility requirements. If we discover or have reason to believe that you do not meet these requirements, we reserve the right to suspend or terminate your account and access to the Services without notice and without liability.",
    ],
  },
  {
    title: "3. Account Registration and Security",
    content: [
      "To access certain features of our Services, you must create an account by providing accurate, current, and complete information as prompted by our registration process. You agree to maintain and promptly update your account information to keep it accurate, current, and complete at all times.",
      "You are responsible for maintaining the confidentiality of your account credentials, including your password and any authentication tokens. You are fully responsible for all activities that occur under your account, whether or not authorized by you. You agree to immediately notify us of any unauthorized use of your account or any other breach of security.",
      "You may not share your account credentials with any other person, use another person's account without permission, create multiple accounts for the same individual, create accounts using automated means or false or misleading information, or transfer or assign your account to any other person or entity without our prior written consent.",
      "We reserve the right to disable, suspend, or terminate any user account at any time in our sole discretion if we believe that you have violated any provision of these Terms, that your account has been compromised, or for any other reason we deem appropriate to protect the integrity and security of our Services.",
      "If you choose to authenticate using a third-party provider (such as Google, GitHub, or other supported providers through Clerk), you authorize us to access and use certain information from that provider as described in our Privacy Policy. You are responsible for maintaining the security of your third-party accounts and for any activity that occurs through those authentication methods.",
    ],
  },
  {
    title: "4. Services Description",
    content: [
      "PixelPrism is a social media marketing platform designed for small and medium-sized businesses (SMBs). Our Services include, but are not limited to, the following features and functionality:",
      [
        "Brand Management: Create and manage multiple brand profiles, including brand identities, logos, color palettes, typography, tone of voice, target audiences, and brand guidelines",
        "Content Creation Studio: Design and create social media content using our creative tools, templates, AI-powered content generation, and asset management capabilities",
        "Social Media Scheduling: Schedule, publish, and manage posts across multiple social media platforms from a single unified dashboard",
        "Analytics and Insights: Track and analyze the performance of your social media content, campaigns, and overall social media presence with detailed metrics, reporting, and actionable recommendations",
        "Product Catalog: Manage your product inventory and seamlessly incorporate product information into your social media content and campaigns",
        "AI-Powered Features: Leverage artificial intelligence for content suggestions, caption generation, hashtag recommendations, optimal posting time analysis, audience insights, and performance predictions",
      ],
      "We are continuously developing and improving our Services. We reserve the right to modify, suspend, or discontinue any part of our Services at any time, with or without notice, at our sole discretion. We will make commercially reasonable efforts to provide advance notice of any material changes to or discontinuation of features that are part of a paid subscription plan.",
      "Our Services may integrate with third-party social media platforms, analytics tools, and other services. We do not control these third-party services and are not responsible for their availability, accuracy, content, security practices, or privacy policies. Your use of third-party services is subject to the terms and conditions and privacy policies of those respective services.",
    ],
  },
  {
    title: "5. Subscription Plans, Pricing, and Payments",
    content: [
      "PixelPrism offers various subscription plans, including a free tier with limited features and paid plans with additional capabilities and higher usage limits. The specific features, usage limits, and pricing for each plan are described on our pricing page and may be updated from time to time.",
      "Paid Subscriptions: By subscribing to a paid plan, you agree to pay the applicable fees as described at the time of your subscription. All fees are quoted in United States dollars unless otherwise specified. Subscription fees are billed in advance on a recurring basis (monthly or annually, depending on your selected billing cycle) and are non-refundable except as expressly set forth in these Terms or as required by applicable law.",
      "Credits System: Certain features of our Services, including AI-powered content generation, may consume credits from your account balance. Credits are allocated based on your subscription plan and may be purchased separately. Unused credits may expire at the end of each billing cycle depending on your plan terms. Credit expiration policies are detailed on your subscription plan page.",
      "Automatic Renewal: Your subscription will automatically renew at the end of each billing period unless you cancel your subscription before the renewal date. You may cancel your subscription at any time through your account settings or by contacting our support team. Cancellation will take effect at the end of the current billing period, and you will continue to have access to paid features until that date.",
      "Price Changes: We reserve the right to change our prices at any time. If we change the pricing for your subscription plan, we will provide you with at least 30 days' advance notice before the new pricing takes effect. If you do not agree with the new pricing, you may cancel your subscription before the price change takes effect. Your continued use of the paid Services after the price change constitutes your acceptance of the new pricing.",
      "Taxes: All fees are exclusive of applicable taxes, levies, or duties imposed by taxing authorities. You are responsible for paying any applicable taxes associated with your subscription, except for taxes based on our net income. If we are required to collect or remit taxes on your behalf, those taxes will be added to your invoice.",
      "Payment Processing: Payments are processed by our third-party payment processor. By providing your payment information, you authorize us and our payment processor to charge the applicable fees to your designated payment method. You represent and warrant that you are authorized to use the payment method you provide and that the payment information you provide is accurate and complete.",
      "Failed Payments: If a payment fails, we will notify you and may attempt to process the charge again. If payment cannot be successfully processed after reasonable attempts, we may suspend or downgrade your account to a free tier until the payment issue is resolved. We are not liable for any losses or damages resulting from a suspension of your account due to failed payments.",
    ],
  },
  {
    title: "6. Intellectual Property Rights",
    content: [
      "PixelPrism Platform: The Services, including all software, code, design, text, graphics, logos, icons, images, audio, video, data compilations, page layout, underlying source code, and the \"look and feel\" of the platform, are owned by or licensed to PixelPrism and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property and proprietary rights laws. PixelPrism, the PixelPrism logo, and all related names, logos, product and service names, designs, and slogans are trademarks of PixelPrism, Inc. or its affiliates. You may not use such marks without our prior written permission.",
      "User Content Ownership: You retain all ownership rights in and to the content you create, upload, or submit through our Services (\"User Content\"), including brand assets, images, text, designs, and other creative materials. By submitting User Content to our platform, you grant PixelPrism a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, distribute, display, and perform your User Content solely for the purpose of providing, maintaining, and improving our Services, and for no other purpose.",
      "AI-Generated Content: Content generated by our AI-powered tools using your brand information, prompts, and inputs (\"AI-Generated Content\") is owned by you upon generation, subject to any limitations imposed by applicable law. You acknowledge that similar or identical AI-Generated Content may be produced for other users based on similar inputs, and that PixelPrism does not guarantee the uniqueness or originality of AI-Generated Content.",
      "Feedback: If you provide us with any suggestions, ideas, improvements, feedback, or other input regarding our Services (\"Feedback\"), you hereby assign to us all right, title, and interest in and to such Feedback, and we may use, reproduce, and commercialize Feedback without restriction, obligation, or compensation to you.",
      "DMCA and Copyright Infringement: We respect the intellectual property rights of others and expect our users to do the same. If you believe that any content on our platform infringes your copyright, please contact us at legal@pixelprism.app with a detailed notice that complies with the Digital Millennium Copyright Act (DMCA). We will investigate all legitimate claims and take appropriate action, including removing infringing content.",
    ],
  },
  {
    title: "7. Acceptable Use Policy",
    content: [
      "You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to use our Services in any way that:",
      [
        "Violates any applicable federal, state, local, or international law, regulation, or ordinance",
        "Infringes upon the intellectual property rights, privacy rights, publicity rights, or other proprietary rights of any third party",
        "Is fraudulent, deceptive, misleading, or constitutes a \"bait and switch\" or pyramid scheme",
        "Involves the creation, distribution, or promotion of content that is defamatory, obscene, pornographic, abusive, threatening, harassing, hateful, discriminatory, or otherwise objectionable",
        "Promotes violence, terrorism, hate speech, or discrimination based on race, ethnicity, national origin, religion, gender, gender identity, sexual orientation, disability, or age",
        "Involves the distribution of unsolicited commercial messages (spam), phishing attempts, or malware",
        "Attempts to gain unauthorized access to other users' accounts, our systems, or any connected networks or servers",
        "Interferes with, disrupts, or places an undue burden on our Services, servers, networks, or infrastructure",
        "Uses automated means (bots, scrapers, crawlers) to access, collect data from, or interact with our Services without our prior written consent",
        "Circumvents, disables, or otherwise interferes with any security, access control, or usage limitation features of our Services",
        "Reverse engineers, decompiles, disassembles, or otherwise attempts to discover the source code or underlying algorithms of our Services",
        "Creates accounts for the purpose of abusing free-tier benefits, promotional offers, or referral programs",
        "Impersonates any person or entity, or falsely states or misrepresents your affiliation with any person or entity",
        "Uses our Services to build a competitive product or service, or for benchmarking purposes without our prior written consent",
      ],
      "We reserve the right to investigate and take appropriate action against anyone who, in our sole discretion, violates this Acceptable Use Policy, including removing offending content, suspending or terminating accounts, reporting violations to law enforcement, and pursuing legal remedies.",
    ],
  },
  {
    title: "8. Content Standards and Moderation",
    content: [
      "You are solely responsible for all User Content that you create, upload, publish, distribute, or otherwise make available through our Services. You represent and warrant that your User Content does not and will not violate these Terms, any applicable law, or the rights of any third party.",
      "We do not pre-screen all User Content, but we reserve the right (though not the obligation) to review, monitor, and remove or disable access to any User Content that we determine, in our sole discretion, violates these Terms, our Acceptable Use Policy, or any applicable law. We may also remove or disable access to User Content in response to valid legal requests, court orders, or DMCA takedown notices.",
      "Social media content created and published through our platform must comply with the terms of service, community guidelines, and content policies of the respective social media platforms. You are responsible for ensuring that all content published through our Services to third-party platforms complies with those platforms' requirements. We are not responsible for any actions taken by third-party platforms against your accounts as a result of content published through our Services.",
      "You acknowledge that by using our Services to publish content on social media platforms, you are directing us to transmit that content on your behalf. You are solely responsible for the content you choose to publish, including its accuracy, legality, and compliance with applicable advertising disclosure and transparency requirements (such as FTC endorsement guidelines).",
    ],
  },
  {
    title: "9. Social Media Platform Integration",
    content: [
      "Our Services allow you to connect and integrate with various third-party social media platforms. By connecting your social media accounts to PixelPrism, you acknowledge and agree to the following:",
      [
        "You authorize PixelPrism to access your social media accounts using the credentials and permissions you provide, to retrieve data, publish content, and perform other actions on your behalf in accordance with the permissions you grant",
        "You are responsible for maintaining the validity and security of your social media account connections and for updating your credentials if they change",
        "We access social media platform data through their official APIs and are subject to the terms, conditions, rate limits, and restrictions imposed by those platforms",
        "Social media platforms may change their APIs, terms of service, or functionality at any time, which may affect the availability, functionality, or performance of our Services. We will make commercially reasonable efforts to adapt to such changes, but we cannot guarantee uninterrupted access to all platform features",
        "You are responsible for complying with each social media platform's terms of service, community guidelines, and content policies when using our Services to create and publish content on those platforms",
        "We are not liable for any actions taken by social media platforms against your accounts, including suspension, restrictions, or termination, regardless of whether the actions were related to content published through our Services",
      ],
      "You may disconnect your social media accounts from PixelPrism at any time through your account settings. Disconnecting an account will revoke our access to that platform, but it will not delete content that has already been published to that platform or data that has already been collected and stored within our Services.",
    ],
  },
  {
    title: "10. Data Use and Artificial Intelligence",
    content: [
      "Our Services incorporate artificial intelligence and machine learning technologies to provide features such as content generation, performance analysis, scheduling optimization, and audience insights. By using these features, you acknowledge and agree to the following:",
      [
        "AI-generated content is provided as suggestions and starting points for your social media marketing efforts. You are responsible for reviewing, editing, and approving all AI-generated content before publishing it",
        "We do not guarantee the accuracy, completeness, originality, appropriateness, or effectiveness of any AI-generated content. AI-generated content may contain errors, inaccuracies, biased language, or other issues that require human review and correction",
        "Your brand information, content, and usage data may be used to personalize and improve the AI features for your account. We do not use your proprietary brand data to train general AI models that would benefit other users or third parties without your explicit consent",
        "AI-generated content may be similar to content generated for other users. We make no representations or warranties regarding the uniqueness of AI-generated content",
        "You are solely responsible for ensuring that AI-generated content complies with applicable laws, regulations, advertising standards, platform policies, and intellectual property rights before publishing",
      ],
      "We are continuously working to improve the quality, accuracy, and capabilities of our AI features. We may update, modify, or replace our AI models and algorithms at any time to enhance performance, accuracy, safety, or to comply with legal requirements.",
    ],
  },
  {
    title: "11. Confidentiality",
    content: [
      "During your use of our Services, you may provide us with, or we may have access to, confidential information about your business, including brand strategies, marketing plans, customer data, product information, financial information, and other proprietary data (\"Confidential Information\").",
      "We will maintain the confidentiality of your Confidential Information and will not disclose it to any third party except as necessary to provide our Services, as permitted under our Privacy Policy, as required by law, or with your prior written consent. We will use your Confidential Information only for the purpose of providing and improving our Services to you.",
      "These confidentiality obligations do not apply to information that is publicly available through no fault of ours, was already known to us before you provided it, is independently developed by us without use of your Confidential Information, or is rightfully received by us from a third party without restriction on disclosure.",
      "Upon termination of your account, we will delete your Confidential Information in accordance with our data retention policies as described in our Privacy Policy, except where retention is required by law or for legitimate business purposes such as fraud prevention or legal compliance.",
    ],
  },
  {
    title: "12. Term, Termination, and Suspension",
    content: [
      "These Terms will remain in full force and effect while you use our Services. You may terminate your account at any time by contacting our support team or through your account settings. Upon termination by you, your right to use the Services will immediately cease.",
      "We may suspend or terminate your access to the Services, in whole or in part, at any time and for any reason, including but not limited to:",
      [
        "Violation of these Terms, our Acceptable Use Policy, or any applicable law or regulation",
        "Conduct that we determine to be harmful to other users, third parties, or our business interests",
        "Nonpayment of fees owed for paid subscriptions",
        "Extended periods of inactivity (accounts inactive for more than 12 consecutive months may be terminated after notice)",
        "At the request of law enforcement or government agencies",
        "Unexpected technical or security issues",
        "Discontinuation of the Services or any part thereof",
      ],
      "If we terminate or suspend your account for cause (i.e., a violation of these Terms), you will not be entitled to any refund of prepaid fees. If we terminate your account without cause or due to a discontinuation of the Services, we will provide a prorated refund of any prepaid fees for the unused portion of your subscription period.",
      "Upon termination of your account, we will retain your data in accordance with our Privacy Policy. You may request a copy of your data before termination by contacting our support team. After termination, you will have 30 days to request an export of your data, after which we may permanently delete your data from our systems.",
      "The following provisions will survive termination of these Terms: Sections 6 (Intellectual Property), 11 (Confidentiality), 13 (Disclaimers), 14 (Limitation of Liability), 15 (Indemnification), 16 (Dispute Resolution), and 17 (General Provisions).",
    ],
  },
  {
    title: "13. Disclaimers",
    content: [
      "THE SERVICES ARE PROVIDED ON AN \"AS IS\" AND \"AS AVAILABLE\" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, PIXELPRISM DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.",
      "WITHOUT LIMITING THE FOREGOING, PIXELPRISM DOES NOT WARRANT OR GUARANTEE THAT:",
      [
        "The Services will be uninterrupted, timely, secure, error-free, or free from viruses or other harmful components",
        "The results obtained from the use of the Services will be accurate, reliable, complete, or meet your expectations or requirements",
        "Any content, including AI-generated content, will be free from errors, accurate, appropriate, or suitable for any particular purpose",
        "Any defects or errors in the Services will be corrected",
        "The Services will be compatible with any other software, systems, or services",
        "The Services will achieve any specific results, outcomes, or return on investment for your business",
        "Social media platform integrations will function continuously or without interruption",
      ],
      "You acknowledge that you use the Services at your own risk. Any content downloaded, uploaded, or otherwise obtained through the use of the Services is accessed at your own discretion and risk, and you will be solely responsible for any damage to your computer systems or mobile devices or loss of data that results from such activities.",
      "No advice or information, whether oral or written, obtained by you from PixelPrism or through our Services shall create any warranty not expressly stated in these Terms.",
    ],
  },
  {
    title: "14. Limitation of Liability",
    content: [
      "TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PIXELPRISM, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES, SUCCESSORS, ASSIGNS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, REVENUE, GOODWILL, DATA, BUSINESS OPPORTUNITIES, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, EVEN IF PIXELPRISM HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
      "TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE TOTAL AGGREGATE LIABILITY OF PIXELPRISM AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES, SUCCESSORS, ASSIGNS, LICENSORS, AND SERVICE PROVIDERS, FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF THE SERVICES, SHALL NOT EXCEED THE GREATER OF: (A) THE TOTAL AMOUNT YOU HAVE PAID TO PIXELPRISM IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED UNITED STATES DOLLARS ($100.00).",
      "THE LIMITATIONS IN THIS SECTION APPLY REGARDLESS OF THE THEORY OF LIABILITY, WHETHER BASED ON WARRANTY, CONTRACT, STATUTE, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, AND EVEN IF PIXELPRISM HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CERTAIN DAMAGES. IN SUCH JURISDICTIONS, OUR LIABILITY SHALL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY LAW.",
    ],
  },
  {
    title: "15. Indemnification",
    content: [
      "You agree to indemnify, defend, and hold harmless PixelPrism, its officers, directors, employees, agents, affiliates, successors, assigns, licensors, and service providers from and against any and all claims, liabilities, damages, losses, costs, expenses, and fees (including reasonable attorneys' fees and court costs) arising out of or relating to:",
      [
        "Your use or misuse of the Services",
        "Your User Content, including any content published through our Services to third-party platforms",
        "Your violation of these Terms, our Acceptable Use Policy, or any applicable law, regulation, or third-party rights",
        "Your violation of the terms of service or policies of any third-party social media platform in connection with your use of our Services",
        "Any dispute or issue between you and any third party arising out of your use of the Services",
        "Your negligence or willful misconduct",
      ],
      "We reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate with our defense of such claims. You agree not to settle any such claim without our prior written consent. We will make reasonable efforts to notify you of any such claim, action, or proceeding upon becoming aware of it.",
    ],
  },
  {
    title: "16. Dispute Resolution",
    content: [
      "Informal Resolution: Before filing any formal legal proceedings, you agree to first attempt to resolve any dispute, claim, or controversy arising out of or relating to these Terms or the Services (\"Dispute\") by contacting us at legal@pixelprism.app. We will attempt to resolve the Dispute informally within 30 days of receiving your notice. If the Dispute cannot be resolved informally within 30 days, either party may proceed with the formal dispute resolution process described below.",
      "Binding Arbitration: If we are unable to resolve a Dispute informally, you and PixelPrism agree that any Dispute shall be resolved exclusively through final and binding individual arbitration, rather than in court, except that either party may bring an individual action in small claims court if the claim qualifies. The arbitration shall be administered by the American Arbitration Association (\"AAA\") under its Commercial Arbitration Rules, or such other mutually agreed-upon arbitration provider.",
      "Class Action Waiver: YOU AND PIXELPRISM AGREE THAT EACH PARTY MAY BRING DISPUTES AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION, COLLECTIVE ACTION, OR REPRESENTATIVE PROCEEDING. Unless both you and PixelPrism agree otherwise in writing, the arbitrator may not consolidate or join more than one person's or party's claims and may not otherwise preside over any form of a consolidated, representative, or class proceeding.",
      "Exceptions: Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights, confidentiality obligations, or other proprietary rights.",
      "Governing Law: These Terms and any Dispute shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles. For any Dispute not subject to arbitration, you agree to submit to the exclusive jurisdiction of the federal and state courts located in Wilmington, Delaware.",
      "Time Limitation: You agree that any claim or cause of action arising out of or related to your use of the Services or these Terms must be filed within one (1) year after such claim or cause of action arose, or it shall be forever barred.",
    ],
  },
  {
    title: "17. General Provisions",
    content: [
      "Entire Agreement: These Terms, together with our Privacy Policy and any other agreements or policies referenced herein, constitute the entire agreement between you and PixelPrism with respect to the Services and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, with respect to the Services.",
      "Severability: If any provision of these Terms is held to be invalid, illegal, or unenforceable for any reason by a court of competent jurisdiction, that provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if it cannot be modified, it shall be severed from these Terms, and the remaining provisions shall continue in full force and effect.",
      "Waiver: The failure of PixelPrism to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. No waiver of any provision of these Terms shall be effective unless made in writing and signed by an authorized representative of PixelPrism.",
      "Assignment: You may not assign, transfer, or delegate your rights or obligations under these Terms without our prior written consent. We may assign, transfer, or delegate our rights and obligations under these Terms without restriction and without notice to you. Any attempted assignment, transfer, or delegation in violation of this provision shall be null and void.",
      "Force Majeure: PixelPrism shall not be liable for any delay or failure to perform its obligations under these Terms if such delay or failure results from circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, pandemics, epidemics, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, strikes, labor disputes, utility failures, internet or telecommunications outages, cyberattacks, or any other event beyond our reasonable control.",
      "Notices: All notices and other communications to PixelPrism under these Terms must be in writing and shall be deemed to have been duly given when sent to legal@pixelprism.app. We may provide notices to you by posting them on our website, sending them to the email address associated with your account, or through other communication channels we deem appropriate.",
      "Third-Party Beneficiaries: These Terms do not create any third-party beneficiary rights in any individual or entity that is not a party to these Terms, except for the indemnified parties specified in Section 15.",
      "Headings: The section headings in these Terms are for convenience only and have no legal or contractual effect and shall not affect the interpretation of these Terms.",
      "Relationship of the Parties: Nothing in these Terms shall be construed to create a partnership, joint venture, employment, agency, or franchise relationship between you and PixelPrism. You and PixelPrism are independent parties, and neither party has the authority to bind the other or to incur any obligation on the other's behalf.",
    ],
  },
  {
    title: "18. Contact Information",
    content: [
      "If you have any questions, concerns, or feedback about these Terms and Conditions, please contact us at:",
      [
        "Email: legal@pixelprism.app",
        "Company: PixelPrism, Inc.",
        "Website: pixelprism.app",
      ],
      "For copyright infringement claims, please direct your notice to legal@pixelprism.app with the subject line \"DMCA Notice\" and include all information required under the DMCA.",
      "For privacy-related inquiries, please refer to our Privacy Policy or contact us at privacy@pixelprism.app.",
    ],
  },
]
