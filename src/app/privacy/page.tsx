"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Cookie, Mail } from "lucide-react";

const SECTIONS = [
  {
    id: "information-collection",
    icon: Database,
    title: "Information We Collect",
    content: `
      We collect information you provide directly to us, such as when you create an account, contact a seller,
      or reach out to support. This includes:

      • Personal identification information (name, email address, phone number)
      • Subscription payment information (for seller plans, processed securely through our payment providers)
      • Location preferences and saved meetup spots
      • Account preferences and settings
      • Communications with our support team
      • Product reviews and feedback

      We also automatically collect certain information when you use our platform, including device information,
      IP address, browser type, and usage patterns.
    `,
  },
  {
    id: "information-use",
    icon: Eye,
    title: "How We Use Your Information",
    content: `
      We use the information we collect to:

      • Process transactions and send related information
      • Provide, maintain, and improve our services
      • Send promotional communications (with your consent)
      • Personalize your experience and provide tailored recommendations
      • Monitor and analyze trends, usage, and activities
      • Detect, investigate, and prevent fraudulent transactions
      • Comply with legal obligations

      Your gamification data (XP, badges, achievements) is used to enhance your experience and provide
      personalized rewards.
    `,
  },
  {
    id: "information-sharing",
    icon: Lock,
    title: "Information Sharing",
    content: `
      We do not sell your personal information. We may share your information with:

      • Sellers: When you contact a seller, we share necessary information to facilitate the connection
      • Service Providers: Companies that perform services on our behalf (analytics, communications, hosting)
      • Legal Requirements: When required by law or to protect our rights
      • Business Transfers: In connection with any merger, sale of company assets, or acquisition

      All third parties are required to protect your information in accordance with this policy and applicable laws.
    `,
  },
  {
    id: "data-security",
    icon: Shield,
    title: "Data Security",
    content: `
      We implement appropriate technical and organizational measures to protect your personal information:

      • SSL/TLS encryption for data transmission
      • Secure subscription payment processing through certified providers
      • Regular security assessments and audits
      • Access controls and authentication measures
      • Employee training on data protection

      While we strive to protect your information, no method of transmission over the Internet is 100% secure.
      Please use strong passwords and protect your account credentials.
    `,
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies and Tracking",
    content: `
      We use cookies and similar technologies to:

      • Keep you logged in to your account
      • Remember your preferences and settings
      • Analyze how our platform is used
      • Deliver personalized content and advertisements

      You can control cookies through your browser settings. Note that disabling cookies may affect
      the functionality of our platform.

      We also use analytics services to understand how users interact with our platform.
    `,
  },
  {
    id: "your-rights",
    icon: Mail,
    title: "Your Rights",
    content: `
      Depending on your location, you may have the following rights:

      • Access: Request a copy of your personal information
      • Correction: Request correction of inaccurate information
      • Deletion: Request deletion of your personal information
      • Portability: Request a copy of your data in a portable format
      • Objection: Object to certain processing of your information
      • Withdraw Consent: Withdraw consent where processing is based on consent

      To exercise these rights, please contact us at privacy@moulna.ae. We will respond to your request
      within 30 days.
    `,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-moulna-gold" />
            <h1 className="font-display text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how Moulna collects,
              uses, and protects your personal information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 15, 2024
            </p>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="container mx-auto px-4 py-8">
          <Card className="p-6 mb-8">
            <h2 className="font-semibold mb-4">Contents</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
              {SECTIONS.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <section.icon className="w-4 h-4 text-moulna-gold" />
                  <span className="text-sm">{section.title}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Sections */}
          <div className="max-w-3xl mx-auto space-y-8">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-moulna-gold/10">
                      <section.icon className="w-5 h-5 text-moulna-gold" />
                    </div>
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                  </div>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {section.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="whitespace-pre-line">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </Card>
              </section>
            ))}

            {/* Contact */}
            <Card className="p-6 bg-moulna-gold/5 border-moulna-gold/20">
              <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="space-y-2 text-sm">
                <li>Email: privacy@moulna.ae</li>
                <li>Phone: +971 4 XXX XXXX</li>
                <li>Address: Dubai, United Arab Emirates</li>
              </ul>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
