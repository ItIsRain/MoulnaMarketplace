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
import {
  Heart, Users, MessageSquare, Star, Award, Globe,
  Sparkles, Target, Lightbulb, Handshake, ArrowRight
} from "lucide-react";

const STATS = [
  { value: "50K+", label: "Active Users", icon: Users },
  { value: "2,500+", label: "Local Artisans", icon: Heart },
  { value: "100K+", label: "Listings Posted", icon: MessageSquare },
  { value: "4.9", label: "Average Rating", icon: Star },
];

const VALUES = [
  {
    icon: Heart,
    title: "Support Local",
    description: "Every connection directly supports UAE artisans and small businesses, helping them grow and thrive.",
  },
  {
    icon: Award,
    title: "Quality First",
    description: "We carefully curate our marketplace to ensure only the highest quality handmade products.",
  },
  {
    icon: Sparkles,
    title: "Unique Finds",
    description: "Discover one-of-a-kind items you won't find anywhere else, crafted with love and passion.",
  },
  {
    icon: Handshake,
    title: "Community",
    description: "We're building a community where buyers and sellers connect, share, and grow together.",
  },
];

const TEAM = [
  {
    name: "Fatima Al-Rashid",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    bio: "Former fashion designer with a passion for supporting local artisans.",
  },
  {
    name: "Omar Hassan",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    bio: "Tech entrepreneur focused on building seamless marketplace experiences.",
  },
  {
    name: "Sara Al-Maktoum",
    role: "Head of Community",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    bio: "Community builder dedicated to connecting sellers with their customers.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-moulna-gold/10 via-transparent to-moulna-charcoal/5" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-moulna-gold/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-moulna-gold/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Empowering UAE&apos;s
                <span className="text-moulna-gold"> Creative Economy</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Moulna is more than a marketplace. We&apos;re a movement to celebrate,
                support, and showcase the incredible talent of UAE&apos;s artisans,
                crafters, and small businesses.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="gold" size="lg" asChild>
                  <Link href="/explore">
                    Start Exploring
                    <ArrowRight className="w-5 h-5 ms-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/sell-with-us">
                    Become a Seller
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-moulna-gold/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-moulna-gold" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-moulna-gold mb-1">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Moulna was born from a simple observation: the UAE is home to
                    thousands of incredibly talented artisans and creators, but many
                    struggle to reach their audience.
                  </p>
                  <p>
                    Founded in 2023 in Dubai, we set out to build a platform that
                    not only connects buyers with unique, handmade products but also
                    makes the experience rewarding and fun through gamification.
                  </p>
                  <p>
                    Today, Moulna hosts over 2,500 sellers across the UAE and GCC,
                    offering everything from traditional perfumes and jewelry to
                    modern home décor and fashion.
                  </p>
                  <p className="font-medium text-foreground">
                    Our mission is simple: to make every connection meaningful, every
                    seller successful, and every customer delighted.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
                    alt="Artisan at work"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-moulna-charcoal p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-moulna-gold/20 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-moulna-gold" />
                    </div>
                    <div>
                      <p className="font-bold">Made in UAE</p>
                      <p className="text-sm text-muted-foreground">By local artisans</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                What We Stand For
              </h2>
              <p className="text-muted-foreground">
                Our values guide everything we do, from the sellers we partner with
                to the features we build.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full text-center hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-moulna-gold/10 flex items-center justify-center">
                      <value.icon className="w-7 h-7 text-moulna-gold" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground">
                The passionate people behind Moulna, working every day to support
                UAE&apos;s creative community.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {TEAM.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden">
                    <div className="aspect-[3/4] relative">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-moulna-gold mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-moulna-gold to-moulna-gold-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Join the Movement?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Whether you&apos;re looking to discover unique items or share your
              creations with the world, Moulna is here for you.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" variant="outline" className="bg-white text-moulna-gold hover:bg-white/90 border-white" asChild>
                <Link href="/explore">
                  Browse Listings
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/sell-with-us">
                  Start Selling
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
