"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Crown, Star, Award, Heart, Users, TrendingUp, Shield,
  Sparkles, CheckCircle, ArrowRight, Gift, Target, Zap
} from "lucide-react";

const BENEFITS = [
  {
    icon: Crown,
    title: "Verified Badge",
    description: "Stand out with a special 'Moulna Artisan' badge on your profile and products.",
  },
  {
    icon: TrendingUp,
    title: "Featured Placement",
    description: "Get priority placement in search results and featured collections.",
  },
  {
    icon: Shield,
    title: "Lower Fees",
    description: "Enjoy reduced commission rates exclusive to program members.",
  },
  {
    icon: Gift,
    title: "Marketing Support",
    description: "Get included in our marketing campaigns and social media features.",
  },
  {
    icon: Star,
    title: "Analytics Dashboard",
    description: "Access advanced analytics to understand your customers better.",
  },
  {
    icon: Users,
    title: "Community Access",
    description: "Join our exclusive artisan community for networking and support.",
  },
];

const REQUIREMENTS = [
  "UAE-based artisan or small business",
  "Handmade or locally-produced products",
  "Commitment to quality and authenticity",
  "Minimum 10 unique products to list",
  "Valid trade license (if applicable)",
];

const FEATURED_ARTISANS = [
  {
    name: "Fatima Al-Rashid",
    shop: "Heritage Weaves",
    specialty: "Traditional Weaving",
    avatar: "fatima-rashid",
    quote: "Moulna helped me reach customers across the UAE and share my craft with the world.",
  },
  {
    name: "Ahmed Al-Mansoori",
    shop: "Desert Scents",
    specialty: "Oud & Perfumes",
    avatar: "ahmed-mansoori",
    quote: "The artisan program gave my business the exposure it needed to grow.",
  },
  {
    name: "Mariam Hassan",
    shop: "Gulf Ceramics",
    specialty: "Hand-painted Pottery",
    avatar: "mariam-hassan",
    quote: "Being part of this community has been incredibly rewarding.",
  },
];

const TIERS = [
  {
    name: "Bronze Artisan",
    requirements: "0-50 sales",
    benefits: ["Verified badge", "Standard placement", "10% commission"],
    color: "from-amber-600 to-amber-700",
  },
  {
    name: "Silver Artisan",
    requirements: "51-200 sales",
    benefits: ["All Bronze benefits", "Priority support", "8% commission", "Monthly features"],
    color: "from-gray-400 to-gray-500",
  },
  {
    name: "Gold Artisan",
    requirements: "201+ sales",
    benefits: ["All Silver benefits", "Homepage features", "6% commission", "Marketing campaigns"],
    color: "from-moulna-gold to-amber-500",
  },
];

export default function ArtisanProgramPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-moulna-charcoal via-slate-800 to-moulna-charcoal text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/patterns/arabic.svg')] bg-repeat opacity-5" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-moulna-gold/20 flex items-center justify-center">
                <Crown className="w-10 h-10 text-moulna-gold" />
              </div>
            </div>
            <Badge className="mb-6 bg-moulna-gold/20 text-moulna-gold border-moulna-gold/30">
              Exclusive Program
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Moulna Artisan Program
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join our exclusive community of UAE artisans and craftspeople.
              Get verified, featured, and grow your handmade business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-moulna-gold hover:bg-moulna-gold-dark text-moulna-charcoal">
                Apply Now
                <ArrowRight className="w-4 h-4 ms-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700">Benefits</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Join the Program
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              As a verified Moulna Artisan, you'll get exclusive perks to help your business thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow border-moulna-gold/20 hover:border-moulna-gold/50">
                  <div className="w-12 h-12 rounded-lg bg-moulna-gold/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-moulna-gold" />
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700">Tiers</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Grow Your Status
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start as a Bronze Artisan and unlock more benefits as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "p-6 h-full",
                  index === 2 && "ring-2 ring-moulna-gold"
                )}>
                  <div className={cn(
                    "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br",
                    tier.color
                  )}>
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    {tier.requirements}
                  </p>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artisans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-moulna-gold/10 text-moulna-gold">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Artisans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from artisans who have grown their businesses with Moulna.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURED_ARTISANS.map((artisan, index) => (
              <motion.div
                key={artisan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center">
                  <DiceBearAvatar
                    seed={artisan.avatar}
                    size="xl"
                    className="w-24 h-24 mx-auto mb-4"
                  />
                  <Badge className="mb-3 bg-moulna-gold/10 text-moulna-gold">
                    <Crown className="w-3 h-3 me-1" />
                    Verified Artisan
                  </Badge>
                  <h3 className="font-bold text-lg">{artisan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{artisan.shop}</p>
                  <p className="text-xs text-moulna-gold mb-4">{artisan.specialty}</p>
                  <p className="text-sm italic text-muted-foreground">
                    "{artisan.quote}"
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-700">Requirements</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Who Can Apply
              </h2>
            </div>

            <Card className="p-8">
              <ul className="space-y-4">
                {REQUIREMENTS.map((req, index) => (
                  <motion.li
                    key={req}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-moulna-charcoal to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Crown className="w-16 h-16 text-moulna-gold mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Apply for the Moulna Artisan Program today and take your craft to the next level.
              Applications are reviewed within 48 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-moulna-gold hover:bg-moulna-gold-dark text-moulna-charcoal">
                Apply Now
                <ArrowRight className="w-4 h-4 ms-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
