"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Store, Sparkles, TrendingUp, Users, Shield, Zap,
  DollarSign, BarChart3, Headphones, Package, ArrowRight,
  Check, Star, Award, Gift
} from "lucide-react";

const FEATURES = [
  {
    icon: Store,
    title: "Your Own Storefront",
    description: "Create a beautiful, customizable shop page that reflects your brand identity.",
  },
  {
    icon: Sparkles,
    title: "Gamified Experience",
    description: "Earn XP, unlock badges, and level up as you grow your business.",
  },
  {
    icon: TrendingUp,
    title: "Marketing Tools",
    description: "Built-in promotions, featured listings, and SEO tools to boost visibility.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track sales, customer behavior, and shop performance in real-time.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe, reliable payments with multiple payout options including bank transfer.",
  },
  {
    icon: Headphones,
    title: "Seller Support",
    description: "Dedicated support team to help you succeed, available 7 days a week.",
  },
];

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    features: [
      "Up to 10 products",
      "Basic analytics",
      "Standard support",
      "7.5% transaction fee",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Growth",
    price: "AED 99",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Up to 100 products",
      "Advanced analytics",
      "Priority support",
      "5% transaction fee",
      "Promotional tools",
      "Featured in collections",
    ],
    cta: "Start Growing",
    popular: true,
  },
  {
    name: "Pro",
    price: "AED 299",
    period: "/month",
    description: "For established sellers",
    features: [
      "Unlimited products",
      "Premium analytics",
      "24/7 priority support",
      "3.5% transaction fee",
      "All promotional tools",
      "Homepage featuring",
      "Custom branding",
      "API access",
    ],
    cta: "Go Pro",
    popular: false,
  },
];

const SUCCESS_STORIES = [
  {
    name: "Scent of Arabia",
    category: "Perfumes & Oud",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    quote: "Moulna helped me reach customers I never could have found on my own. My sales have grown 400% in just 6 months!",
    owner: "Sarah M.",
    stats: { sales: "1,200+", rating: 4.9 },
  },
  {
    name: "Heritage Jewels",
    category: "Handmade Jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    quote: "The gamification features keep me motivated. Earning badges and leveling up makes running my shop fun!",
    owner: "Ahmed K.",
    stats: { sales: "850+", rating: 4.8 },
  },
  {
    name: "Calligraphy Dreams",
    category: "Arabic Art",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
    quote: "From a hobby to a full-time business. Moulna's tools and community support made it possible.",
    owner: "Noura S.",
    stats: { sales: "620+", rating: 5.0 },
  },
];

const STEPS = [
  {
    step: 1,
    title: "Create Your Account",
    description: "Sign up for free and complete your seller profile in minutes.",
  },
  {
    step: 2,
    title: "Set Up Your Shop",
    description: "Customize your storefront, add your products, and set your policies.",
  },
  {
    step: 3,
    title: "Start Selling",
    description: "Go live and start reaching thousands of customers across the UAE.",
  },
  {
    step: 4,
    title: "Grow & Earn",
    description: "Use our tools to promote your products and watch your business grow.",
  },
];

export default function SellWithUsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-moulna-charcoal to-moulna-charcoal/90 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920')] bg-cover bg-center opacity-10" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-moulna-gold/20 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="bg-moulna-gold text-white mb-6">
                <Sparkles className="w-3 h-3 me-1" />
                Join 2,500+ Sellers
              </Badge>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Turn Your Passion Into
                <span className="text-moulna-gold"> Profit</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Join UAE&apos;s fastest-growing marketplace for handmade and artisan products.
                Reach thousands of customers, level up, and grow your business.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" className="bg-moulna-gold hover:bg-moulna-gold-dark text-white" asChild>
                  <Link href="/register?type=seller">
                    Start Selling Today
                    <ArrowRight className="w-5 h-5 ms-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="#pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 bg-moulna-gold">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
              {[
                { value: "AED 0", label: "Listing Fees" },
                { value: "50K+", label: "Active Shoppers" },
                { value: "24h", label: "Avg. First Sale" },
                { value: "95%", label: "Seller Satisfaction" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-white/80 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-muted-foreground">
                Powerful tools and features designed specifically for artisans
                and small business owners.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-moulna-gold/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-moulna-gold" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Start Selling in 4 Simple Steps
              </h2>
              <p className="text-muted-foreground">
                Get your shop up and running in less than an hour.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  {index < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-moulna-gold/30" />
                  )}
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-moulna-gold text-white flex items-center justify-center text-2xl font-bold relative z-10">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground">
                No hidden fees. Start free and upgrade as you grow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {PRICING_TIERS.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={cn(
                    "p-6 relative h-full",
                    tier.popular && "border-2 border-moulna-gold"
                  )}>
                    {tier.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-moulna-gold">
                        Most Popular
                      </Badge>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-lg mb-2">{tier.name}</h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">{tier.price}</span>
                        {tier.period && (
                          <span className="text-muted-foreground">{tier.period}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tier.description}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={tier.popular ? "gold" : "outline"}
                      className="w-full"
                      asChild
                    >
                      <Link href="/register?type=seller">
                        {tier.cta}
                      </Link>
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Seller Success Stories
              </h2>
              <p className="text-muted-foreground">
                Hear from sellers who have grown their businesses on Moulna.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {SUCCESS_STORIES.map((story, index) => (
                <motion.div
                  key={story.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden h-full">
                    <div className="aspect-video relative">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{story.name}</h3>
                          <p className="text-sm text-muted-foreground">{story.category}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {story.stats.rating}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm italic mb-4">
                        &quot;{story.quote}&quot;
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-muted-foreground">
                          — {story.owner}
                        </span>
                        <Badge variant="outline">
                          {story.stats.sales} sales
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-moulna-charcoal text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Gift className="w-16 h-16 mx-auto mb-6 text-moulna-gold" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Join thousands of successful sellers. Sign up today and get
                your first month of Growth plan free!
              </p>
              <Button size="lg" className="bg-moulna-gold hover:bg-moulna-gold-dark text-white" asChild>
                <Link href="/register?type=seller">
                  Create Your Shop Now
                  <ArrowRight className="w-5 h-5 ms-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
