"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw, ChevronRight, Download, Mail, Calendar,
  CheckCircle, XCircle, Clock, HelpCircle
} from "lucide-react";

const REPORTABLE_ISSUES = [
  { reportable: true, text: "Listing description does not match the actual item" },
  { reportable: true, text: "Seller is unresponsive after agreeing to a transaction" },
  { reportable: true, text: "Suspected scam or fraudulent listing" },
  { reportable: true, text: "Counterfeit or stolen goods" },
  { reportable: false, text: "Price disagreements after a deal is finalized off-platform" },
  { reportable: false, text: "Buyer's remorse after completing a transaction" },
  { reportable: false, text: "Disputes over items inspected and accepted at meetup" },
  { reportable: false, text: "Issues with transactions conducted outside Moulna" },
];

const DISPUTE_PROCESS = [
  {
    step: 1,
    title: "Report the Issue",
    description: "Go to the listing or seller profile and click 'Report'. Provide details about the issue including screenshots or evidence.",
    duration: "5 minutes",
  },
  {
    step: 2,
    title: "Moulna Review",
    description: "Our Trust & Safety team will review your report and may reach out to both parties for more information.",
    duration: "24-48 hours",
  },
  {
    step: 3,
    title: "Mediation",
    description: "If applicable, Moulna will facilitate communication between buyer and seller to reach a fair resolution.",
    duration: "2-5 days",
  },
  {
    step: 4,
    title: "Resolution & Action",
    description: "Moulna will take appropriate action which may include removing listings, issuing warnings, or suspending accounts.",
    duration: "1-3 business days",
  },
];

export default function RefundPolicyPage() {
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
            <span className="text-white">Dispute Resolution</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-moulna-gold/20 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-moulna-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dispute Resolution Policy</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last updated: January 1, 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              Moulna is a classifieds platform that connects buyers and sellers.
              All transactions happen directly between users and are conducted off-platform.
              While Moulna does not process payments or handle goods, we are committed to
              maintaining a trustworthy marketplace and will assist in mediating disputes
              related to listings and seller conduct.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-muted rounded-lg text-center">
                <Clock className="w-8 h-8 text-moulna-gold mx-auto mb-2" />
                <p className="font-bold">24-48 Hours</p>
                <p className="text-sm text-muted-foreground">Report Review Time</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-bold">Fair Mediation</p>
                <p className="text-sm text-muted-foreground">Between Buyer & Seller</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-bold">Trust & Safety</p>
                <p className="text-sm text-muted-foreground">Dedicated Team</p>
              </div>
            </div>
          </Card>

          {/* Reporting Issues */}
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Reporting Issues</h2>
            <p className="text-muted-foreground mb-6">
              You can report issues related to listings, sellers, or suspicious activity.
              Below is a guide on what we can and cannot assist with:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {REPORTABLE_ISSUES.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  {item.reportable ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Dispute Resolution Process */}
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Dispute Resolution Process</h2>
            <p className="text-muted-foreground mb-6">
              If you encounter an issue with a listing or seller, follow these steps:
            </p>
            <div className="space-y-6">
              {DISPUTE_PROCESS.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-moulna-gold text-white flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    {index < DISPUTE_PROCESS.length - 1 && (
                      <div className="w-0.5 h-12 bg-moulna-gold/30 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {step.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Additional Sections */}
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Seller Accountability</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Accurate Listings</h3>
                <p className="text-sm text-muted-foreground">
                  Sellers are required to accurately describe their items, including condition,
                  defects, specifications, and pricing. Listings must include genuine photos of
                  the actual item being sold, not stock images or photos from other sources.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Consequences for Misleading Listings</h3>
                <p className="text-sm text-muted-foreground">
                  Sellers who post misleading or fraudulent listings may face warnings, listing
                  removal, temporary suspension, or permanent account termination depending on
                  the severity and frequency of violations. Repeated offenses will result in
                  escalated enforcement actions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Seller Responsiveness</h3>
                <p className="text-sm text-muted-foreground">
                  Sellers are expected to respond to buyer inquiries in a timely manner and
                  communicate honestly about item availability. Listings for items that are
                  no longer available should be promptly removed or marked as sold.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Safety Guidelines</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Safe Meetups</h3>
                <p className="text-sm text-muted-foreground">
                  Always meet in well-lit, public places such as shopping malls, coffee shops,
                  or designated safe trade zones. Avoid meeting at private residences or
                  secluded areas. Bring a friend or let someone know where you are going.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Inspect Before You Buy</h3>
                <p className="text-sm text-muted-foreground">
                  Always inspect items thoroughly before completing any transaction. Test
                  electronics, check for defects, and verify that the item matches the listing
                  description. Once you have accepted and paid for an item in person, the
                  transaction is between you and the seller.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Payment Safety</h3>
                <p className="text-sm text-muted-foreground">
                  Be cautious with payment methods. Cash is the safest option for in-person
                  transactions. Avoid sending money via wire transfer or prepaying before
                  inspecting the item. Never share your financial information with other users.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Trust Your Instincts</h3>
                <p className="text-sm text-muted-foreground">
                  If a deal seems too good to be true, it probably is. Be wary of sellers who
                  pressure you to act quickly, refuse to meet in person, or ask for unusual
                  payment methods. Report suspicious activity to Moulna immediately.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Platform Limitations</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Off-Platform Transactions</h3>
                <p className="text-sm text-muted-foreground">
                  Moulna is a classifieds platform that facilitates connections between buyers
                  and sellers. All transactions, including payment and item exchange, occur
                  off-platform and directly between users. Moulna is not a party to any
                  transaction and is not responsible for the quality, safety, legality, or
                  any other aspect of items listed or transactions conducted.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">No Guarantees</h3>
                <p className="text-sm text-muted-foreground">
                  Moulna does not guarantee the accuracy of listings, the identity of users,
                  or the outcome of any transaction. While we take steps to maintain a safe
                  marketplace, users transact at their own risk and should exercise due
                  diligence before completing any deal.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">No Refunds or Returns Through Moulna</h3>
                <p className="text-sm text-muted-foreground">
                  Since Moulna does not process payments or handle goods, we cannot issue
                  refunds or facilitate returns. Any refund or return arrangements must be
                  made directly between the buyer and seller. We encourage users to agree
                  on terms before completing transactions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                <p className="text-sm text-muted-foreground">
                  Moulna's role is limited to providing the platform for listing and
                  discovering items. We are not liable for any losses, damages, or disputes
                  arising from off-platform transactions. Our dispute resolution process is
                  a courtesy service aimed at maintaining platform trust and does not
                  constitute legal mediation or arbitration.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-8 bg-moulna-gold/10 border-moulna-gold/20">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-8 h-8 text-moulna-gold flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you need to report a listing, flag a suspicious user, or have questions
                  about our dispute resolution process, our Trust & Safety team is here to help.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/help">
                      Visit Help Center
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="mailto:support@moulna.ae">
                      <Mail className="w-4 h-4 me-2" />
                      Email Support
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
