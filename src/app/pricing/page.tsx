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
  Headphones, Zap, Crown, ChevronDown, HelpCircle,
  Rocket, Shield, Gift, Percent, Globe, Tag,
  TrendingUp, Star, MessageCircle, Eye, Loader2
} from "lucide-react";
import { toast } from "sonner";

const SELLER_PLANS = [
  {
    name: "Starter",
    price: "Free",
    description: "Launch your shop with zero risk",
    badge: null,
    icon: Store,
    gradient: "",
    features: [
      { text: "3 active listings", included: true, highlight: false },
      { text: "3 moments (stories)", included: true, highlight: false },
      { text: "Basic shop profile & avatar", included: true, highlight: false },
      { text: "Views & inquiry analytics", included: true, highlight: false },
      { text: "XP leveling & badge system", included: true, highlight: false },
      { text: "Standard search placement", included: true, highlight: false },
      { text: "Email support", included: true, highlight: false },
      { text: "AED 5 per listing after limit", included: true, highlight: false },
      { text: "Promotional tools", included: false, highlight: false },
      { text: "Boost discounts", included: false, highlight: false },
      { text: "Advanced analytics", included: false, highlight: false },
      { text: "Priority support", included: false, highlight: false },
    ],
    cta: "Start Free",
    ctaVariant: "outline" as const,
    popular: false,
    highlighted: false,
  },
  {
    name: "Growth",
    price: "99",
    period: "/month",
    description: "Scale your business with powerful tools",
    badge: "Most Popular",
    icon: Rocket,
    gradient: "",
    features: [
      { text: "30 active listings", included: true, highlight: true },
      { text: "10 moments (stories)", included: true, highlight: true },
      { text: "10 free listings/month (no fee)", included: true, highlight: true },
      { text: "20% off all boosts", included: true, highlight: true },
      { text: "Coupon codes & flash sales", included: true, highlight: true },
      { text: "Advanced analytics & demographics", included: true, highlight: false },
      { text: "Custom shop branding", included: true, highlight: false },
      { text: "Featured in category pages", included: true, highlight: false },
      { text: "Priority customer support", included: true, highlight: false },
      { text: "Social media shop link", included: true, highlight: false },
      { text: "Homepage spotlight", included: false, highlight: false },
      { text: "Free monthly boosts", included: false, highlight: false },
    ],
    cta: "Start Growing",
    ctaVariant: "gold" as const,
    popular: true,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "299",
    period: "/month",
    description: "The ultimate toolkit for top sellers",
    badge: "Best Value",
    icon: Crown,
    gradient: "bg-gradient-to-b from-moulna-charcoal to-moulna-charcoal-dark text-white",
    features: [
      { text: "Unlimited active listings", included: true, highlight: true },
      { text: "Unlimited moments (stories)", included: true, highlight: true },
      { text: "No per-listing fees ever", included: true, highlight: true },
      { text: "50% off all boosts & SOTW", included: true, highlight: true },
      { text: "1 free 7-day boost every month", included: true, highlight: true },
      { text: "Premium homepage placement", included: true, highlight: true },
      { text: "Verified Pro seller badge", included: true, highlight: false },
      { text: "Premium analytics with exports", included: true, highlight: false },
      { text: "All promotional tools included", included: true, highlight: false },
      { text: "Priority search ranking", included: true, highlight: false },
      { text: "24/7 dedicated account manager", included: true, highlight: false },
      { text: "Early access to new features", included: true, highlight: false },
    ],
    cta: "Go Pro",
    ctaVariant: "gold" as const,
    popular: false,
    highlighted: true,
  },
];

const COMPARISON_ROWS = [
  { feature: "Active Listings", free: "3", growth: "30", pro: "Unlimited" },
  { feature: "Moments (Stories)", free: "3", growth: "10", pro: "Unlimited" },
  { feature: "Per-Listing Fee", free: "AED 5 after limit", growth: "10 free/mo, then AED 5", pro: "None" },
  { feature: "Boost Discount", free: "—", growth: "20% off", pro: "50% off" },
  { feature: "Free Monthly Boost", free: "—", growth: "—", pro: "7-day boost" },
  { feature: "Coupon Codes", free: false, growth: true, pro: true },
  { feature: "Flash Sales", free: false, growth: true, pro: true },
  { feature: "Advanced Analytics", free: false, growth: true, pro: true },
  { feature: "Analytics Exports", free: false, growth: false, pro: true },
  { feature: "Custom Shop Branding", free: false, growth: true, pro: true },
  { feature: "Homepage Placement", free: false, growth: false, pro: true },
  { feature: "Verified Pro Badge", free: false, growth: false, pro: true },
  { feature: "Priority Search Ranking", free: false, growth: false, pro: true },
  { feature: "Support", free: "Email", growth: "Priority", pro: "24/7 Dedicated" },
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
    question: "What happens when I hit my listing limit?",
    answer: "On the Starter plan, additional listings cost AED 5 each. On Growth, you get 10 free listings per month and then AED 5 each after that. Pro sellers never pay per-listing fees.",
  },
  {
    question: "What's included in a Product Boost?",
    answer: "Boosted listings get priority placement in search results, explore pages, and category feeds. Pro sellers get 50% off all boosts plus one free 7-day boost every month.",
  },
  {
    question: "Do buyers need to pay for anything?",
    answer: "Never! Browsing and contacting sellers on Moulna is completely free. Buyers earn XP and unlock perks just by exploring and engaging with the platform.",
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = React.useState<"monthly" | "annual">("monthly");
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);
  const [showComparison, setShowComparison] = React.useState(false);
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (plan === "free") {
      window.location.href = "/register?type=seller";
      return;
    }
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/seller/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, period: billingPeriod, promo: "launch3" }),
      });

      if (res.status === 401) {
        window.location.href = "/register?type=seller";
        return;
      }

      const text = await res.text();
      if (!text) {
        toast.error("Something went wrong. Please try again later.");
        return;
      }

      const data = JSON.parse(text);

      if (res.status === 403) {
        toast.error("Seller plans are for sellers only. Apply to become a seller first at Sell With Us.");
        window.location.href = "/sell-with-us";
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-emerald-500 text-white mb-4 text-sm px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 me-1" />
                Launch Offer: 50% off for 3 months!
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
                      ? "bg-moulna-gold text-white shadow"
                      : "text-moulna-charcoal dark:text-moulna-charcoal"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("annual")}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                    billingPeriod === "annual"
                      ? "bg-moulna-gold text-white shadow"
                      : "text-moulna-charcoal dark:text-moulna-charcoal"
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
                className="h-full"
              >
                <Card className={cn(
                  "p-6 relative h-full flex flex-col",
                  plan.popular && "border-2 border-moulna-gold shadow-lg shadow-moulna-gold/10",
                  plan.highlighted && "bg-gradient-to-b from-moulna-charcoal to-moulna-charcoal-dark text-white border-moulna-gold/30"
                )}>
                  {plan.badge && (
                    <Badge className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2",
                      plan.highlighted ? "bg-gradient-to-r from-moulna-gold to-amber-500 text-white" : "bg-moulna-gold text-white"
                    )}>
                      {plan.badge}
                    </Badge>
                  )}

                  <div className="text-center mb-6">
                    <div className={cn(
                      "w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3",
                      plan.highlighted ? "bg-moulna-gold/20" : "bg-moulna-gold/10"
                    )}>
                      <plan.icon className="w-6 h-6 text-moulna-gold" />
                    </div>
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
                    {billingPeriod === "annual" && plan.price !== "Free" && (
                      <p className="text-xs text-emerald-500 font-medium mt-1">
                        Save AED {Math.round(parseInt(plan.price) * 12 - parseInt(plan.price) * 10)}/year
                      </p>
                    )}
                    <p className={cn(
                      "text-sm mt-1",
                      plan.highlighted ? "text-white/60" : "text-muted-foreground"
                    )}>
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-2.5 text-sm">
                        {feature.included ? (
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                            feature.highlight
                              ? "bg-moulna-gold text-white"
                              : "bg-emerald-500/15 text-emerald-500"
                          )}>
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-muted">
                            <X className={cn(
                              "w-3 h-3",
                              plan.highlighted ? "text-white/50" : "text-muted-foreground/50"
                            )} />
                          </div>
                        )}
                        <span className={cn(
                          !feature.included
                            ? (plan.highlighted ? "text-white/50" : "text-muted-foreground/60")
                            : feature.highlight ? "font-medium" : ""
                        )}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Promo pricing */}
                  {plan.price !== "Free" && (
                    <div className="pt-2 mb-2">
                      <div className="flex items-center justify-center gap-2">
                        <Badge className="bg-emerald-500 text-white text-[10px]">
                          50% off x 3 months
                        </Badge>
                      </div>
                      <p className="text-center text-sm mt-1">
                        <span className={cn(
                          "line-through",
                          plan.highlighted ? "text-white/60" : "text-muted-foreground"
                        )}>
                          AED {billingPeriod === "annual" ? Math.round(parseInt(plan.price) * 10) : plan.price}
                        </span>
                        {" "}
                        <span className="font-bold text-emerald-500">
                          AED {billingPeriod === "annual" ? Math.round(parseInt(plan.price) * 10 / 2) : Math.round(parseInt(plan.price) / 2)}
                        </span>
                        <span className={plan.highlighted ? "text-white/70" : "text-muted-foreground"}>
                          /{billingPeriod === "annual" ? "year" : "month"} for 3 months
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="pt-4 mt-auto">
                    <Button
                      variant={plan.ctaVariant}
                      className={cn(
                        "w-full",
                        plan.highlighted && plan.ctaVariant === "gold" && "shadow-lg shadow-moulna-gold/25"
                      )}
                      size="lg"
                      disabled={loadingPlan === plan.name.toLowerCase()}
                      onClick={() => handleSubscribe(plan.name.toLowerCase() === "starter" ? "free" : plan.name.toLowerCase())}
                    >
                      {loadingPlan === plan.name.toLowerCase() ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        plan.cta
                      )}
                    </Button>
                    {plan.price === "Free" && (
                      <p className={cn(
                        "text-xs text-center mt-2",
                        plan.highlighted ? "text-white/70" : "text-muted-foreground"
                      )}>
                        No credit card required
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Compare Plans Toggle */}
          <div className="text-center mt-10">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 text-sm font-medium text-moulna-gold hover:underline"
            >
              {showComparison ? "Hide" : "Compare all features"}
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                showComparison && "rotate-180"
              )} />
            </button>
          </div>

          {/* Full Feature Comparison Table */}
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="max-w-5xl mx-auto mt-8 overflow-hidden"
            >
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-semibold">Feature</th>
                        <th className="text-center p-4 font-semibold">Starter</th>
                        <th className="text-center p-4 font-semibold text-moulna-gold">Growth</th>
                        <th className="text-center p-4 font-semibold">Pro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_ROWS.map((row, i) => (
                        <tr key={row.feature} className={cn("border-b last:border-0", i % 2 === 0 && "bg-muted/20")}>
                          <td className="p-4 font-medium">{row.feature}</td>
                          {(["free", "growth", "pro"] as const).map((plan) => {
                            const val = row[plan];
                            return (
                              <td key={plan} className="p-4 text-center">
                                {typeof val === "boolean" ? (
                                  val ? (
                                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                  ) : (
                                    <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                                  )
                                ) : (
                                  <span className={cn(
                                    val === "—" ? "text-muted-foreground/40" : "",
                                    plan === "pro" && val !== "—" ? "font-medium text-moulna-gold" : ""
                                  )}>
                                    {val}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            Need more? <Link href="/contact" className="text-moulna-gold hover:underline">Contact us</Link> for enterprise pricing.
          </p>
        </section>

        {/* Why Upgrade — Value Props */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold mb-4">Why Sellers Upgrade</h2>
            <p className="text-muted-foreground">Real results from real Moulna sellers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Eye, stat: "7x", label: "more views", desc: "Boosted listings get up to 7x more visibility in search and explore" },
              { icon: MessageCircle, stat: "3x", label: "more inquiries", desc: "Growth and Pro sellers receive significantly more buyer messages" },
              { icon: TrendingUp, stat: "89%", label: "renewal rate", desc: "Almost 9 in 10 Growth & Pro sellers renew their plan each month" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-moulna-gold/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-moulna-gold" />
                  </div>
                  <div className="text-3xl font-bold text-moulna-gold mb-1">{item.stat}</div>
                  <p className="font-medium mb-2">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Buyer Perks */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-moulna-gold" />
                <h2 className="font-display text-2xl font-bold">Buyer Perks</h2>
              </div>
              <p className="text-muted-foreground">
                Browsing on Moulna is always free — plus you level up just for being active!
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
              { icon: Zap, title: "Lower Fees", description: "Pay-per-listing from AED 5 — no recurring costs until you're ready to scale" },
              { icon: Sparkles, title: "Gamification", description: "Earn XP, badges, and level up while you sell — keep buyers coming back" },
              { icon: BarChart3, title: "Deep Analytics", description: "Understand your customers with traffic sources, demographics, and trends" },
              { icon: Headphones, title: "Local Support", description: "UAE-based team available 7 days a week with dedicated Pro support" },
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
                        "w-5 h-5 text-muted-foreground transition-transform shrink-0 ms-4",
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
