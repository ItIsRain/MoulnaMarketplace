"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Star, MapPin, Calendar, Clock, Phone, Mail, Globe,
  Instagram, Facebook, Twitter, Heart, Shield, Award,
  Package, Users, CheckCircle, Quote
} from "lucide-react";

const SHOP_DATA = {
  name: "Arabian Scents Boutique",
  slug: "arabian-scents",
  avatar: "arabian-scents",
  tagline: "Authentic Arabian Fragrances Since 2010",
  description: `We are a family-owned boutique specializing in premium Arabian oud, bakhoor, and traditional perfumes. Our journey began in the historic perfume souqs of Dubai, where our founder learned the ancient art of perfumery from master craftsmen.

Today, we continue this tradition by sourcing the finest ingredients from across the Arabian Peninsula and beyond. Each product is carefully crafted to bring you the most authentic scents that have been cherished for generations.

Our mission is to share the beauty of Arabian fragrance culture with the world while supporting local artisans and sustainable sourcing practices.`,
  founded: "2010",
  location: "Al Barsha, Dubai, UAE",
  openingHours: "Sun-Thu: 9AM-9PM, Fri: 2PM-9PM, Sat: 10AM-8PM",
  rating: 4.9,
  reviewCount: 456,
  productCount: 45,
  followerCount: 2340,
  verified: true,
  badges: ["Top Seller", "Fast Shipper", "Artisan Program"],
  contact: {
    phone: "+971 50 123 4567",
    email: "hello@arabianscents.ae",
    website: "https://arabianscents.ae",
  },
  social: {
    instagram: "@arabianscents_uae",
    facebook: "arabianscentsUAE",
    twitter: "@arabian_scents",
  },
  milestones: [
    { year: "2010", title: "Shop Founded", description: "Started in Dubai Souq" },
    { year: "2015", title: "First Award", description: "Best Artisan Perfumer" },
    { year: "2020", title: "Joined Moulna", description: "Expanded online presence" },
    { year: "2024", title: "10K+ Customers", description: "Growing community" },
  ],
  values: ["Authenticity", "Quality", "Sustainability", "Heritage"],
};

const STATS = [
  { icon: Package, label: "Products", value: SHOP_DATA.productCount },
  { icon: Star, label: "Rating", value: SHOP_DATA.rating },
  { icon: Users, label: "Followers", value: "2.3K" },
  { icon: Calendar, label: "Since", value: SHOP_DATA.founded },
];

export default function ShopAboutPage() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Shop Header */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <DiceBearAvatar seed={SHOP_DATA.avatar} size="lg" className="w-16 h-16" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{SHOP_DATA.name}</h1>
                {SHOP_DATA.verified && (
                  <Badge className="bg-blue-100 text-blue-700">
                    <CheckCircle className="w-3 h-3 me-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{SHOP_DATA.tagline}</p>
            </div>
            <div className="ms-auto flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/shops/${params.shopSlug}`}>View Shop</Link>
              </Button>
              <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
                <Heart className="w-4 h-4 me-2" />
                Follow
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 text-center">
                    <stat.icon className="w-6 h-6 mx-auto text-moulna-gold mb-2" />
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* About */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">About Us</h2>
              <div className="prose prose-gray max-w-none">
                {SHOP_DATA.description.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            {/* Values */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {SHOP_DATA.values.map((value, index) => (
                  <motion.div
                    key={value}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-moulna-gold/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-moulna-gold" />
                    </div>
                    <span className="font-medium">{value}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Milestones */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Our Journey</h2>
              <div className="space-y-6">
                {SHOP_DATA.milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
                        <span className="font-bold text-moulna-gold">{milestone.year}</span>
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-semibold">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-moulna-gold" />
                Achievements
              </h3>
              <div className="space-y-3">
                {SHOP_DATA.badges.map((badge) => (
                  <div key={badge} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Shield className="w-5 h-5 text-moulna-gold" />
                    <span className="font-medium text-sm">{badge}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{SHOP_DATA.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Opening Hours</p>
                    <p className="text-sm text-muted-foreground">{SHOP_DATA.openingHours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a href={`tel:${SHOP_DATA.contact.phone}`} className="text-sm text-moulna-gold hover:underline">
                      {SHOP_DATA.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a href={`mailto:${SHOP_DATA.contact.email}`} className="text-sm text-moulna-gold hover:underline">
                      {SHOP_DATA.contact.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <a href={SHOP_DATA.contact.website} target="_blank" rel="noopener" className="text-sm text-moulna-gold hover:underline">
                      {SHOP_DATA.contact.website.replace("https://", "")}
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href={`https://instagram.com/${SHOP_DATA.social.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={`https://facebook.com/${SHOP_DATA.social.facebook}`}
                  target="_blank"
                  rel="noopener"
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={`https://twitter.com/${SHOP_DATA.social.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener"
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </Card>

            {/* Message Seller */}
            <Card className="p-6 bg-moulna-gold/10 border-moulna-gold/20">
              <h3 className="font-semibold mb-2">Have Questions?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send us a message and we'll get back to you within 24 hours.
              </p>
              <Button className="w-full bg-moulna-gold hover:bg-moulna-gold-dark">
                Message Seller
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
