"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle, Search, ShoppingBag, Truck, CreditCard,
  User, Store, RefreshCw, MessageCircle, Phone, Mail,
  ChevronRight, ChevronDown, ExternalLink
} from "lucide-react";

const HELP_CATEGORIES = [
  {
    icon: ShoppingBag,
    title: "Orders & Purchases",
    description: "Track orders, manage returns, and view purchase history",
    articles: 12,
    slug: "orders",
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    description: "Shipping options, delivery times, and tracking",
    articles: 8,
    slug: "shipping",
  },
  {
    icon: CreditCard,
    title: "Payments & Refunds",
    description: "Payment methods, refunds, and billing",
    articles: 10,
    slug: "payments",
  },
  {
    icon: User,
    title: "Account & Security",
    description: "Profile settings, password, and privacy",
    articles: 7,
    slug: "account",
  },
  {
    icon: Store,
    title: "Selling on Moulna",
    description: "Start selling, manage shop, and payouts",
    articles: 15,
    slug: "selling",
  },
  {
    icon: RefreshCw,
    title: "Returns & Exchanges",
    description: "Return policy, exchanges, and disputes",
    articles: 6,
    slug: "returns",
  },
];

const POPULAR_ARTICLES = [
  {
    id: "art_1",
    title: "How to track my order",
    category: "Orders",
    views: 15420,
  },
  {
    id: "art_2",
    title: "What payment methods are accepted?",
    category: "Payments",
    views: 12350,
  },
  {
    id: "art_3",
    title: "How to return an item",
    category: "Returns",
    views: 10280,
  },
  {
    id: "art_4",
    title: "Shipping times and costs",
    category: "Shipping",
    views: 9870,
  },
  {
    id: "art_5",
    title: "How does the XP system work?",
    category: "Account",
    views: 8540,
  },
  {
    id: "art_6",
    title: "How to start selling on Moulna",
    category: "Selling",
    views: 7620,
  },
];

const FAQS = [
  {
    question: "How long does shipping take?",
    answer: "Shipping times vary by seller and location. Most orders within the UAE are delivered within 2-5 business days. You can see the estimated delivery time on each product page.",
  },
  {
    question: "What is your return policy?",
    answer: "Most items can be returned within 14 days of delivery for a full refund. Some items like custom-made products may not be eligible for returns. Check the product page for specific return policies.",
  },
  {
    question: "How does the XP and rewards system work?",
    answer: "You earn XP (experience points) for various activities like making purchases, writing reviews, and referring friends. As you accumulate XP, you level up and unlock rewards, badges, and exclusive perks.",
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes! We use industry-standard encryption and never store your full credit card details. We partner with trusted payment providers to ensure all transactions are secure.",
  },
  {
    question: "How do I become a seller?",
    answer: "Getting started is easy! Click 'Sell with Us' and create a seller account. You can list your first products within minutes. There are no upfront costs - we only charge a small commission on sales.",
  },
  {
    question: "Can I contact a seller directly?",
    answer: "Yes! You can message any seller directly through our messaging system. Go to their shop page and click 'Contact Seller'. Most sellers respond within 24 hours.",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-moulna-gold" />
              <h1 className="font-display text-4xl font-bold mb-4">
                How can we help you?
              </h1>
              <p className="text-muted-foreground mb-8">
                Search our knowledge base or browse categories below
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="ps-12 py-6 text-lg rounded-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-semibold text-xl mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HELP_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/help/${category.slug}`}>
                  <Card className="p-6 hover:shadow-lg transition-all hover:border-moulna-gold group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-moulna-gold/10 group-hover:bg-moulna-gold/20 transition-colors">
                        <category.icon className="w-6 h-6 text-moulna-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-moulna-gold transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {category.description}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {category.articles} articles
                        </Badge>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-moulna-gold group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-semibold text-xl mb-6">Popular Articles</h2>
          <Card className="divide-y">
            {POPULAR_ARTICLES.map((article) => (
              <Link
                key={article.id}
                href={`/help/article/${article.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {article.category} · {article.views.toLocaleString()} views
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            ))}
          </Card>
        </section>

        {/* FAQs */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-semibold text-xl mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl">
            {FAQS.map((faq, index) => (
              <Card
                key={index}
                className={cn(
                  "overflow-hidden transition-all",
                  expandedFaq === index && "border-moulna-gold"
                )}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-start"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform",
                      expandedFaq === index && "rotate-180"
                    )}
                  />
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-4 pb-4"
                  >
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="container mx-auto px-4 py-12">
          <Card className="p-8 bg-gradient-to-br from-moulna-gold/10 to-transparent">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-semibold text-2xl mb-2">
                Still need help?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our support team is here for you 7 days a week
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-3 text-moulna-gold" />
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with our team in real-time
                  </p>
                  <Button variant="gold" className="w-full">
                    Start Chat
                  </Button>
                </Card>

                <Card className="p-6 text-center">
                  <Mail className="w-8 h-8 mx-auto mb-3 text-moulna-gold" />
                  <h3 className="font-semibold mb-1">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We&apos;ll respond within 24 hours
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="mailto:support@moulna.ae">
                      support@moulna.ae
                    </Link>
                  </Button>
                </Card>

                <Card className="p-6 text-center">
                  <Phone className="w-8 h-8 mx-auto mb-3 text-moulna-gold" />
                  <h3 className="font-semibold mb-1">Call Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    9am - 9pm, 7 days a week
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="tel:+97145551234">
                      +971 4 555 1234
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
