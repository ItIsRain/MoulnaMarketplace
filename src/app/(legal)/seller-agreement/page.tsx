"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText, ChevronRight, Download, Mail, Calendar
} from "lucide-react";

const SECTIONS = [
  {
    id: "eligibility",
    title: "1. Seller Eligibility",
    content: `To become a seller on Moulna, you must:

    • Be at least 18 years of age or the age of legal majority in your jurisdiction
    • Provide accurate and complete registration information
    • Have a valid UAE business license (for commercial sellers) or Emirates ID (for individual sellers)
    • Agree to our Community Guidelines and Seller Standards
    • Maintain accurate listing information at all times

    Moulna reserves the right to refuse, suspend, or terminate seller accounts at our discretion.`,
  },
  {
    id: "fees",
    title: "2. Fees and Pricing",
    content: `Free Tier:

    • All sellers can post up to 10 active listings at no cost
    • Free listings include standard visibility in search results

    Listing Fees:
    • AED 5 per listing for each active listing beyond the free 10
    • Listing fees are charged at the time of posting

    Subscription Plans:
    • Monthly subscription plans are available for power sellers
    • Subscriptions include unlimited active listings and additional perks
    • Plan details and pricing are available on the Subscription page
    • Subscriptions auto-renew unless cancelled before the billing date

    Boost & Promotion Fees:
    • Optional paid boosts to increase listing visibility in search results
    • Featured placement options for premium positioning on category and homepage
    • Boost and promotion pricing varies by duration and placement

    Moulna does not charge any commission on transactions, as all transactions occur directly between buyers and sellers off-platform.

    All fees are subject to 5% VAT as per UAE regulations.`,
  },
  {
    id: "listings",
    title: "3. Listings",
    content: `Sellers agree to:

    • List only items they have the legal right to sell
    • Provide accurate descriptions, genuine photos, and fair pricing
    • Update or remove listings promptly when items are no longer available
    • Mark items as sold once a transaction is completed
    • Not list prohibited items (see Prohibited Items Policy)

    Listing Content:
    • All photos must be of the actual item being sold (no stock images)
    • Descriptions must be accurate, honest, and not misleading
    • Pricing must reflect the actual asking price
    • Sellers must disclose the item's condition, defects, and relevant details`,
  },
  {
    id: "inquiries",
    title: "4. Inquiry Response",
    content: `Sellers are responsible for:

    • Responding to buyer inquiries promptly, ideally within 24 hours
    • Providing honest and accurate answers about listed items
    • Communicating availability and arranging meetups in a timely manner
    • Marking listings as sold when items are no longer available
    • Not misleading buyers about item condition, features, or pricing

    Communication Standards:
    • All communication should remain professional and respectful
    • Sellers should use Moulna's messaging system for initial contact
    • Sellers must not send spam or unsolicited promotional messages
    • Unresponsive sellers may have their listings deprioritized in search results`,
  },
  {
    id: "disputes",
    title: "5. Dispute Resolution",
    content: `Seller Obligations:

    • Sellers must accurately describe all items listed on the platform
    • Sellers should make every effort to resolve issues directly with buyers
    • If a buyer reports a listing as misleading, the seller must cooperate with Moulna's review

    Dispute Process:
    • Buyers may report misleading listings or seller conduct to Moulna
    • Moulna's Trust & Safety team will review reports and may contact both parties
    • Moulna may mediate between buyers and sellers to facilitate a fair resolution
    • Repeated valid complaints may result in listing removal, account suspension, or termination

    Since all transactions occur off-platform between buyers and sellers directly, Moulna does not process refunds or returns. Dispute resolution is limited to enforcement of platform listing standards and seller conduct policies.`,
  },
  {
    id: "conduct",
    title: "6. Seller Conduct",
    content: `Sellers must:

    • Communicate professionally with buyers
    • Respond to messages within 24 hours
    • Not engage in harassment or discrimination
    • Not manipulate reviews or ratings
    • Not post misleading, fraudulent, or duplicate listings
    • Comply with all applicable UAE laws and regulations

    Prohibited Activities:
    • Posting fake or bait-and-switch listings
    • Misrepresenting item condition, authenticity, or specifications
    • Creating multiple accounts to circumvent listing limits or suspensions
    • Spamming or sending unsolicited messages to other users
    • Using the platform to facilitate illegal transactions

    Violations may result in:
    • Warning notices
    • Listing removal
    • Temporary suspension
    • Permanent account termination`,
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    content: `Sellers represent that:

    • They own or have rights to sell all listed items
    • Listings don't infringe on third-party intellectual property
    • All images and content are original or properly licensed
    • They will not copy or reproduce other sellers' listings

    Moulna will:
    • Remove listings that violate IP rights upon valid notice
    • Cooperate with IP holders on infringement claims
    • Suspend repeat infringers`,
  },
  {
    id: "termination",
    title: "8. Termination",
    content: `Account Termination:

    • Sellers may close their account at any time
    • Any outstanding listing fees or subscription charges must be settled
    • Moulna may terminate accounts for policy violations

    Upon termination:
    • All active listings will be removed
    • Seller data will be retained per our Privacy Policy
    • Any amounts owed to Moulna must be settled
    • Sellers may not create new accounts without permission`,
  },
];

export default function SellerAgreementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <section className="py-12 bg-moulna-charcoal text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/legal" className="hover:text-white">Legal</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Seller Agreement</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-moulna-gold/20 flex items-center justify-center">
              <FileText className="w-8 h-8 text-moulna-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Seller Agreement</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last updated: January 1, 2024
                </span>
                <Badge variant="secondary">Version 2.0</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-6">
              <h3 className="font-semibold mb-4">Contents</h3>
              <nav className="space-y-2">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-muted-foreground hover:text-moulna-gold transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 me-2" />
                  Download PDF
                </Button>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-muted-foreground mb-8">
                  This Seller Agreement ("Agreement") is a legal contract between you ("Seller")
                  and Moulna FZ-LLC ("Moulna", "we", "us"). By registering as a seller on the
                  Moulna platform, you agree to be bound by the terms of this Agreement.
                </p>

                {SECTIONS.map((section, index) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                  >
                    <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                    <div className="text-muted-foreground whitespace-pre-line">
                      {section.content}
                    </div>
                  </motion.section>
                ))}

                <section className="mt-12 pt-8 border-t">
                  <h2 className="text-xl font-bold mb-4">Contact</h2>
                  <p className="text-muted-foreground">
                    If you have questions about this Seller Agreement, please contact us:
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <Mail className="w-5 h-5 text-moulna-gold" />
                    <a href="mailto:sellers@moulna.ae" className="text-moulna-gold hover:underline">
                      sellers@moulna.ae
                    </a>
                  </div>
                </section>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
