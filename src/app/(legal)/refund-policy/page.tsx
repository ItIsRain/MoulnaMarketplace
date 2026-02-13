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

const REFUND_ELIGIBILITY = [
  { eligible: true, text: "Item not as described in the listing" },
  { eligible: true, text: "Item arrived damaged or defective" },
  { eligible: true, text: "Wrong item received" },
  { eligible: true, text: "Item not received within delivery window" },
  { eligible: false, text: "Change of mind after 14 days" },
  { eligible: false, text: "Used or altered items (unless defective)" },
  { eligible: false, text: "Custom or personalized items" },
  { eligible: false, text: "Perishable goods" },
];

const REFUND_PROCESS = [
  {
    step: 1,
    title: "Submit Request",
    description: "Go to your orders and click 'Request Refund' on the relevant order.",
    duration: "5 minutes",
  },
  {
    step: 2,
    title: "Seller Review",
    description: "The seller will review your request and respond within 48 hours.",
    duration: "24-48 hours",
  },
  {
    step: 3,
    title: "Return Item",
    description: "If approved, ship the item back using the provided return label.",
    duration: "3-5 days",
  },
  {
    step: 4,
    title: "Refund Processed",
    description: "Once received, your refund will be processed to your original payment method.",
    duration: "3-5 business days",
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
            <span className="text-white">Refund Policy</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-moulna-gold/20 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-moulna-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Refund & Returns Policy</h1>
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
              At Moulna, we want you to be completely satisfied with your purchase.
              If you're not happy with your order, we're here to help. This policy
              outlines how returns and refunds work on our platform.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-muted rounded-lg text-center">
                <Clock className="w-8 h-8 text-moulna-gold mx-auto mb-2" />
                <p className="font-bold">14 Days</p>
                <p className="text-sm text-muted-foreground">Return Window</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-bold">Free Returns</p>
                <p className="text-sm text-muted-foreground">For Defective Items</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-bold">3-5 Days</p>
                <p className="text-sm text-muted-foreground">Refund Processing</p>
              </div>
            </div>
          </Card>

          {/* Eligibility */}
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Refund Eligibility</h2>
            <p className="text-muted-foreground mb-6">
              Whether you're eligible for a refund depends on the reason for your return:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {REFUND_ELIGIBILITY.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  {item.eligible ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Process */}
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Refund Process</h2>
            <p className="text-muted-foreground mb-6">
              Follow these steps to request a refund:
            </p>
            <div className="space-y-6">
              {REFUND_PROCESS.map((step, index) => (
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
                    {index < REFUND_PROCESS.length - 1 && (
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

          {/* Additional Info */}
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Additional Information</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Refund Methods</h3>
                <p className="text-sm text-muted-foreground">
                  Refunds are processed to your original payment method. For credit/debit cards,
                  it may take 5-10 business days for the refund to appear on your statement.
                  Cash on delivery orders will be refunded via bank transfer.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Partial Refunds</h3>
                <p className="text-sm text-muted-foreground">
                  In some cases, partial refunds may be offered for items with minor issues
                  or when the item has been used. The refund amount will be determined based
                  on the item's condition.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Seller-Specific Policies</h3>
                <p className="text-sm text-muted-foreground">
                  Some sellers may have additional return policies. These will be clearly
                  displayed on the product page and must comply with our minimum standards.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Dispute Resolution</h3>
                <p className="text-sm text-muted-foreground">
                  If you and the seller cannot agree on a resolution, you can escalate the
                  dispute to Moulna Support. We will review the case and make a final decision
                  within 5 business days.
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
                  If you have questions about our refund policy or need assistance with
                  a return, our support team is here to help.
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
