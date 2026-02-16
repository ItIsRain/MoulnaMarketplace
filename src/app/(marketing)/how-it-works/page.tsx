"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, MessageCircle, Handshake, Star, Sparkles, Shield,
  Heart, Users, Award, Gift, ArrowRight, CheckCircle,
  MessageSquare, Package
} from "lucide-react";

const BUYER_STEPS = [
  {
    step: 1,
    title: "Browse",
    description: "Explore thousands of authentic Arabian products from verified local artisans and sellers.",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: 2,
    title: "Contact Seller",
    description: "Found something you like? Message the seller directly to ask questions and negotiate.",
    icon: MessageCircle,
    color: "from-green-500 to-emerald-500",
  },
  {
    step: 3,
    title: "Meet & Trade",
    description: "Arrange a meetup or delivery with the seller and complete the deal on your own terms.",
    icon: Handshake,
    color: "from-purple-500 to-violet-500",
  },
  {
    step: 4,
    title: "Review",
    description: "Leave a review, earn XP points, unlock badges, and level up your Moulna profile.",
    icon: Star,
    color: "from-moulna-gold to-amber-500",
  },
];

const SELLER_STEPS = [
  {
    step: 1,
    title: "Register",
    description: "Create your seller account and set up your shop profile with branding and story.",
    icon: Users,
  },
  {
    step: 2,
    title: "List Products",
    description: "Add your products with photos, descriptions, and pricing. It's quick and easy.",
    icon: Package,
  },
  {
    step: 3,
    title: "Receive Inquiries",
    description: "Get notified when buyers are interested and manage conversations through your seller dashboard.",
    icon: MessageCircle,
  },
  {
    step: 4,
    title: "Grow",
    description: "Build your reputation, earn seller badges, and grow your business on Moulna.",
    icon: Award,
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Verified Sellers",
    description: "All sellers are verified to ensure a safe and trustworthy marketplace.",
  },
  {
    icon: Sparkles,
    title: "Gamified Experience",
    description: "Earn XP, badges, and rewards as you shop and engage.",
  },
  {
    icon: Heart,
    title: "Support Local",
    description: "Connect with UAE artisans and small businesses in your community.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Chat directly with sellers for custom requests and questions.",
  },
  {
    icon: Handshake,
    title: "Local Meetups",
    description: "Arrange safe, convenient meetups with sellers in your area.",
  },
  {
    icon: Gift,
    title: "Exclusive Deals",
    description: "Access member-only discounts and flash sales.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-moulna-charcoal to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-moulna-gold rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 border border-moulna-gold/50 rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-6 bg-moulna-gold/20 text-moulna-gold border-moulna-gold/30">
              Getting Started
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How Moulna Works
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Browse listings, contact sellers, and trade locally while supporting UAE artisans.
              Here's everything you need to know to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-moulna-gold hover:bg-moulna-gold-dark text-moulna-charcoal">
                Start Browsing
                <ArrowRight className="w-4 h-4 ms-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Become a Seller
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* For Buyers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700">For Buyers</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Finding What You Need Made Easy
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From browsing to meeting the seller, here's how your Moulna journey unfolds.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {BUYER_STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < BUYER_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-muted to-muted-foreground/20" />
                )}
                <Card className="p-6 text-center relative z-10">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br text-white",
                    step.color
                  )}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-moulna-gold text-white flex items-center justify-center mx-auto -mt-6 mb-4 text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Sellers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700">For Sellers</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Selling in Minutes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our community of UAE artisans and reach thousands of customers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {SELLER_STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6 mb-8 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-moulna-gold text-white flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  {index < SELLER_STEPS.length - 1 && (
                    <div className="w-0.5 h-16 bg-moulna-gold/30 mx-auto mt-2" />
                  )}
                </div>
                <Card className="flex-1 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-moulna-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
              <Link href="/become-seller">
                Start Selling Today
                <ArrowRight className="w-4 h-4 ms-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-moulna-gold/10 text-moulna-gold">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Moulna
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've built Moulna with features that make buying and selling a joy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-moulna-gold/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-moulna-gold" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-moulna-gold to-amber-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of buyers and sellers on Moulna today.
              Create your free account and start your journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-moulna-gold hover:bg-white/90" asChild>
                <Link href="/register">
                  Create Free Account
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/explore">
                  Browse Listings
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
