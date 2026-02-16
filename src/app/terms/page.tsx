"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { FileText, Users, MessageSquare, Shield, AlertTriangle, Scale } from "lucide-react";

const SECTIONS = [
  {
    id: "acceptance",
    icon: FileText,
    title: "Acceptance of Terms",
    content: `
      By accessing or using Moulna ("the Platform"), you agree to be bound by these Terms of Service
      and all applicable laws and regulations. If you do not agree with any of these terms, you are
      prohibited from using or accessing this platform.

      These terms apply to all users of the Platform, including browsers, vendors, customers, merchants,
      and contributors of content.

      We reserve the right to update these terms at any time. Continued use of the Platform after changes
      constitutes acceptance of the new terms.
    `,
  },
  {
    id: "accounts",
    icon: Users,
    title: "User Accounts",
    content: `
      When you create an account with us, you must provide accurate, complete, and current information.
      Failure to do so constitutes a breach of the Terms.

      You are responsible for:
      • Maintaining the confidentiality of your account and password
      • Restricting access to your computer and account
      • All activities that occur under your account
      • Notifying us immediately of any unauthorized access

      You must be at least 18 years old to create an account. By creating an account, you represent
      that you are at least 18 years of age.

      We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
    `,
  },
  {
    id: "marketplace",
    icon: MessageSquare,
    title: "Marketplace Rules",
    content: `
      Moulna is a classifieds platform that connects buyers with independent sellers. All transactions
      happen directly between buyers and sellers outside the platform.

      For Buyers:
      • All transactions are arranged directly with sellers
      • Listing descriptions and images are provided by sellers
      • We recommend meeting in public places for exchanges
      • Always inspect items before completing a transaction

      For Sellers:
      • You must accurately describe your listings
      • You are responsible for responding to inquiries promptly
      • You must comply with all applicable laws and regulations
      • Prohibited items may not be listed
      • Listing on Moulna is free

      Moulna is not responsible for the quality, safety, or legality of items listed by sellers.
    `,
  },
  {
    id: "gamification",
    icon: Shield,
    title: "Gamification & Rewards",
    content: `
      Moulna offers a gamification system including XP, levels, badges, and rewards. By participating,
      you agree to the following:

      • XP and rewards have no cash value and cannot be transferred or sold
      • We reserve the right to modify, suspend, or terminate the rewards program
      • Abuse of the system (fake reviews, multiple accounts, etc.) will result in account termination
      • Rewards and discounts are subject to availability and may expire
      • We may adjust XP values and requirements at any time

      All rewards are subject to verification and may be revoked if obtained through fraudulent means.
    `,
  },
  {
    id: "prohibited",
    icon: AlertTriangle,
    title: "Prohibited Conduct",
    content: `
      You may not use the Platform for any illegal or unauthorized purpose. You agree not to:

      • Violate any laws or regulations
      • Infringe on intellectual property rights
      • Transmit harmful code or malware
      • Spam, phish, or engage in deceptive practices
      • Harass, abuse, or threaten other users
      • Create fake reviews or manipulate ratings
      • Use automated tools to scrape or access the Platform
      • Attempt to gain unauthorized access to our systems
      • Circumvent security measures or restrictions

      Violation of these prohibitions may result in immediate termination of your account and legal action.
    `,
  },
  {
    id: "liability",
    icon: Scale,
    title: "Limitation of Liability",
    content: `
      To the fullest extent permitted by law:

      • Moulna provides the Platform "as is" without warranties of any kind
      • We are not liable for any indirect, incidental, or consequential damages
      • Our liability is limited to the amount you paid us in the past 12 months
      • We are not responsible for disputes between buyers and sellers
      • We do not guarantee continuous, uninterrupted access to the Platform

      Some jurisdictions do not allow limitations on implied warranties or liability, so some of
      these limitations may not apply to you.

      These Terms are governed by the laws of the United Arab Emirates. Any disputes shall be
      resolved in the courts of Dubai, UAE.
    `,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-moulna-gold" />
            <h1 className="font-display text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using Moulna. By using our platform,
              you agree to be bound by these terms.
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
              <h2 className="text-xl font-semibold mb-2">Questions?</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="space-y-2 text-sm">
                <li>Email: legal@moulna.ae</li>
                <li>Phone: +971 4 XXX XXXX</li>
                <li>Address: Dubai, United Arab Emirates</li>
              </ul>
            </Card>

            {/* Related Links */}
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="text-moulna-gold hover:underline">
                Privacy Policy
              </Link>
              <Link href="/help" className="text-moulna-gold hover:underline">
                Help Center
              </Link>
              <Link href="/contact" className="text-moulna-gold hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
