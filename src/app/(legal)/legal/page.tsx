"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scale, FileText, Shield, Cookie, RefreshCw, Users,
  ChevronRight, Calendar
} from "lucide-react";

const LEGAL_PAGES = [
  {
    href: "/terms",
    title: "Terms of Service",
    description: "Our terms and conditions for using the Moulna marketplace",
    icon: FileText,
    lastUpdated: "January 1, 2024",
  },
  {
    href: "/privacy",
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information",
    icon: Shield,
    lastUpdated: "January 1, 2024",
  },
  {
    href: "/cookies",
    title: "Cookie Policy",
    description: "Our use of cookies and similar tracking technologies",
    icon: Cookie,
    lastUpdated: "January 1, 2024",
  },
  {
    href: "/refund-policy",
    title: "Dispute Resolution Policy",
    description: "How we handle disputes, reporting issues, and safety guidelines",
    icon: RefreshCw,
    lastUpdated: "January 1, 2024",
  },
  {
    href: "/seller-agreement",
    title: "Seller Agreement",
    description: "Terms for selling on the Moulna marketplace",
    icon: Users,
    lastUpdated: "January 1, 2024",
  },
];

export default function LegalIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <section className="py-12 bg-moulna-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <Scale className="w-16 h-16 mx-auto text-moulna-gold mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Legal Center</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            All the legal documents and policies that govern your use of Moulna
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Legal Pages Grid */}
          <div className="space-y-4">
            {LEGAL_PAGES.map((page, index) => (
              <motion.div
                key={page.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={page.href}>
                  <Card className="p-6 hover:shadow-lg transition-all hover:border-moulna-gold/50 group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-moulna-gold/10 flex items-center justify-center flex-shrink-0">
                        <page.icon className="w-6 h-6 text-moulna-gold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="font-semibold text-lg group-hover:text-moulna-gold transition-colors">
                            {page.title}
                          </h2>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-moulna-gold transition-colors" />
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {page.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          <Calendar className="w-3 h-3 me-1" />
                          Last updated: {page.lastUpdated}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <Card className="p-6 mt-8 bg-moulna-gold/10 border-moulna-gold/20">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Have Questions?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about our legal policies, please contact our legal team.
              </p>
              <a
                href="mailto:legal@moulna.ae"
                className="text-moulna-gold hover:underline font-medium"
              >
                legal@moulna.ae
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
