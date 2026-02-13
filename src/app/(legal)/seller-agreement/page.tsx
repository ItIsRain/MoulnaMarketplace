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
    • Have a valid UAE business license (for commercial sellers) or Emirates ID (for individual artisans)
    • Agree to our Community Guidelines and Seller Standards
    • Maintain accurate inventory and pricing information

    Moulna reserves the right to refuse, suspend, or terminate seller accounts at our discretion.`,
  },
  {
    id: "fees",
    title: "2. Fees and Payments",
    content: `Commission Structure:

    • Standard sellers: 12% commission per sale
    • Artisan Program members: 6-10% commission based on tier
    • Payment processing fee: 2.5% + AED 1 per transaction

    Payouts:
    • Seller earnings are paid out weekly on Thursdays
    • Minimum payout threshold: AED 100
    • Payment methods: Bank transfer, PayPal
    • Pending balance holds may apply for new sellers (14-day hold period)

    All fees are subject to 5% VAT as per UAE regulations.`,
  },
  {
    id: "products",
    title: "3. Product Listings",
    content: `Sellers agree to:

    • List only products they have the legal right to sell
    • Provide accurate descriptions, images, and pricing
    • Maintain sufficient inventory to fulfill orders
    • Ship products within the stated handling time
    • Not list prohibited items (see Prohibited Items Policy)

    Product Content:
    • All product images must be original or properly licensed
    • Descriptions must be accurate and not misleading
    • Pricing must include all applicable fees
    • Sellers must disclose materials, dimensions, and relevant product details`,
  },
  {
    id: "orders",
    title: "4. Order Fulfillment",
    content: `Sellers are responsible for:

    • Processing orders within 2 business days
    • Shipping products within the stated handling time
    • Providing valid tracking information
    • Packaging items securely to prevent damage
    • Responding to buyer inquiries within 24 hours

    Shipping Requirements:
    • Use trackable shipping methods for orders over AED 200
    • Provide estimated delivery dates
    • Notify buyers of any delays
    • Handle shipping costs as specified in listings`,
  },
  {
    id: "returns",
    title: "5. Returns and Refunds",
    content: `Return Policy:

    • Sellers must accept returns for defective or misrepresented items
    • Standard return window: 14 days from delivery
    • Custom/personalized items may be exempt from returns (must be disclosed)
    • Sellers are responsible for return shipping costs when items are defective

    Refund Processing:
    • Refunds must be processed within 5 business days of return receipt
    • Full refunds required for items not as described
    • Partial refunds may be negotiated for minor issues
    • Moulna may intervene in disputes and issue refunds at our discretion`,
  },
  {
    id: "conduct",
    title: "6. Seller Conduct",
    content: `Sellers must:

    • Communicate professionally with buyers
    • Respond to messages within 24 hours
    • Not engage in harassment or discrimination
    • Not manipulate reviews or ratings
    • Not circumvent Moulna's payment system
    • Comply with all applicable UAE laws and regulations

    Violations may result in:
    • Warning notices
    • Temporary suspension
    • Permanent account termination
    • Withholding of pending payments`,
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    content: `Sellers represent that:

    • They own or have rights to sell all listed products
    • Product listings don't infringe on third-party intellectual property
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
    • Outstanding orders must be fulfilled before closure
    • Pending payments will be released after the hold period
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
