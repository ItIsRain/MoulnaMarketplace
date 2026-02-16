"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check, X, Sparkles, Store, Users, BarChart3,
  Headphones, Zap, Crown, ChevronDown, HelpCircle
} from "lucide-react";

const SELLER_PLANS = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for testing the waters",
    features: [
      { text: "Up to 5 products", included: true },
      { text: "Basic analytics", included: true },
      { text: "Standard support", included: true },
      { text: "7.5% transaction fee", included: true },
      { text: "Moulna branding on shop", included: true },
      { text: "Coupon codes", included: false },
      { text: "Flash sales", included: false },
      { text: "Priority support", included: false },
      { text: "Featured placement", included: false },
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Growth",
    price: "99",
    period: "/month",
    description: "For growing businesses",
    features: [
      { text: "Up to 100 products", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority support", included: true },
      { text: "5% transaction fee", included: true },
      { text: "Remove Moulna branding", included: true },
      { text: "Coupon codes", included: true },
      { text: "Flash sales", included: true },
      { text: "Featured in collections", included: true },
      { text: "Homepage featuring", included: false },
    ],
    cta: "Start Growing",
    popular: true,
  },
  {
    name: "Pro",
    price: "299",
    period: "/month",
    description: "For established sellers",
    features: [
      { text: "Unlimited products", included: true },
      { text: "Premium analytics + exports", included: true },
      { text: "24/7 priority support", included: true },
      { text: "3.5% transaction fee", included: true },
      { text: "Custom shop domain", included: true },
      { text: "All promotional tools", included: true },
      { text: "Homepage featuring", included: true },
      { text: "API access", included: true },
      { text: "Dedicated account manager", included: true },
    ],
    cta: "Go Pro",
    popular: false,
    highlighted: true,
  },
];

const BUYER_PERKS = [
  {
    level: 1,
    title: "Newcomer",
    perks: ["Join the community", "Start earning XP", "Basic avatar customization"],
  },
  {
    level: 3,
    title: "Regular",
    perks: ["5% XP bonus on deals", "Unlock new avatar styles", "Access to flash sales"],
  },
  {
    level: 5,
    title: "Connoisseur",
    perks: ["10% XP bonus", "Early access to new products", "Exclusive badge collection"],
  },
  {
    level: 7,
    title: "Tastemaker",
    perks: ["15% XP bonus", "VIP customer support", "Invite to exclusive events"],
  },
  {
    level: 10,
    title: "Legend",
    perks: ["20% XP bonus", "Unlimited free listings", "Golden crown avatar accessory"],
  },
];

const FAQS = [
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer: "Yes! You can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate applies at your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and bank transfers for annual plans.",
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No contracts! All plans are month-to-month and can be cancelled anytime. Annual plans offer a 2-month discount.",
  },
  {
    question: "What's included in the transaction fee?",
    answer: "The transaction fee covers platform maintenance, listing infrastructure, and seller support. There are no hidden fees.",
  },
  {
    question: "Do buyers need to pay for anything?",
    answer: "Never! Browsing and contacting sellers on Moulna is completely free. Buyers earn XP and unlock perks just by exploring and engaging with the platform.",
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = React.useState<"monthly" | "annual">("monthly");
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-moulna-gold text-white mb-4">
                Simple, Transparent Pricing
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Choose Your Path to Success
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Start free and scale as you grow. No hidden fees, no surprises.
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center gap-4 p-1 rounded-full bg-muted">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                    billingPeriod === "monthly"
                      ? "bg-white shadow text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("annual")}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                    billingPeriod === "annual"
                      ? "bg-white shadow text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Annual
                  <Badge className="ms-2 bg-emerald-500 text-white">Save 17%</Badge>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Seller Plans */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Store className="w-6 h-6 text-moulna-gold" />
              <h2 className="font-display text-2xl font-bold">Seller Plans</h2>
            </div>
            <p className="text-muted-foreground">
              Everything you need to build and grow your shop
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {SELLER_PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "p-6 relative h-full flex flex-col",
                  plan.popular && "border-2 border-moulna-gold",
                  plan.highlighted && "bg-gradient-to-b from-moulna-charcoal to-moulna-charcoal-dark text-white"
                )}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-moulna-gold">
                      Most Popular
                    </Badge>
                  )}

                  <div className="text-center mb-6">
                    {plan.highlighted && <Crown className="w-8 h-8 mx-auto mb-2 text-moulna-gold" />}
                    <h3 className="font-semibold text-xl mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      {plan.price === "Free" ? (
                        <span className="text-4xl font-bold">Free</span>
                      ) : (
                        <>
                          <span className="text-lg">AED</span>
                          <span className="text-4xl font-bold">
                            {billingPeriod === "annual"
                              ? Math.round(parseInt(plan.price) * 10)
                              : plan.price}
                          </span>
                          <span className={plan.highlighted ? "text-white/60" : "text-muted-foreground"}>
                            /{billingPeriod === "annual" ? "year" : "month"}
                          </span>
                        </>
                      )}
                    </div>
                    <p className={cn(
                      "text-sm mt-1",
                      plan.highlighted ? "text-white/60" : "text-muted-foreground"
                    )}>
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <X className={cn(
                            "w-4 h-4 shrink-0",
                            plan.highlighted ? "text-white/30" : "text-muted-foreground/50"
                          )} />
                        )}
                        <span className={!feature.included ? (plan.highlighted ? "text-white/40" : "text-muted-foreground/60") : ""}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.highlighted ? "gold" : plan.popular ? "gold" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link href="/register?type=seller">
                      {plan.cta}
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Need more? <Link href="/contact" className="text-moulna-gold hover:underline">Contact us</Link> for enterprise pricing.
          </p>
        </section>

        {/* Buyer Perks */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-moulna-gold" />
                <h2 className="font-display text-2xl font-bold">Buyer Rewards</h2>
              </div>
              <p className="text-muted-foreground">
                Browsing on Moulna is always free — plus you earn rewards just for being active!
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {BUYER_PERKS.map((tier, index) => (
                <motion.div
                  key={tier.level}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={cn(
                    "p-4 h-full text-center",
                    tier.level === 10 && "border-moulna-gold bg-gradient-to-b from-moulna-gold/10 to-transparent"
                  )}>
                    <div className={cn(
                      "w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold mb-3",
                      tier.level === 1 && "bg-gray-400",
                      tier.level === 3 && "bg-emerald-500",
                      tier.level === 5 && "bg-moulna-gold",
                      tier.level === 7 && "bg-purple-500",
                      tier.level === 10 && "bg-gradient-to-br from-moulna-gold to-amber-600"
                    )}>
                      {tier.level === 10 ? <Crown className="w-6 h-6" /> : `Lv.${tier.level}`}
                    </div>
                    <h3 className="font-semibold mb-3">{tier.title}</h3>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold mb-4">Why Moulna?</h2>
            <p className="text-muted-foreground">
              See how we compare to other platforms
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Zap, title: "Lower Fees", description: "Starting at just 3.5% — keep more of what you earn" },
              { icon: Sparkles, title: "Gamification", description: "Earn XP, badges, and rewards while you sell" },
              { icon: BarChart3, title: "Deep Analytics", description: "Understand your customers with detailed insights" },
              { icon: Headphones, title: "Local Support", description: "UAE-based team available 7 days a week" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-moulna-gold/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-moulna-gold" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
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

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  <HelpCircle className="w-4 h-4 me-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of sellers already growing their business on Moulna.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" variant="gold" asChild>
                <Link href="/register?type=seller">
                  Start Selling Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/explore">
                  Browse as Buyer
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
