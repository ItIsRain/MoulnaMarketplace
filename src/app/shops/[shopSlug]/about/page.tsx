"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import type { Shop } from "@/lib/types";
import {
  Star, MapPin, Calendar, Clock, Phone, Mail, Globe,
  Instagram, Facebook, Twitter, Heart, Shield, Award,
  Package, Users, CheckCircle, Quote, Loader2
} from "lucide-react";

export default function ShopAboutPage() {
  const params = useParams();
  const shopSlug = params.shopSlug as string;

  const [shop, setShop] = React.useState<Shop | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    async function fetchShop() {
      try {
        const res = await fetch(`/api/shops/${shopSlug}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setShop(data.shop);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchShop();
  }, [shopSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  if (notFound || !shop) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Shop Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The shop you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/shops">Browse Shops</Link>
          </Button>
        </div>
      </div>
    );
  }

  const foundedYear = shop.createdAt
    ? new Date(shop.createdAt).getFullYear().toString()
    : undefined;

  const stats = [
    { icon: Package, label: "Products", value: shop.totalListings },
    { icon: Users, label: "Followers", value: shop.followerCount >= 1000 ? `${(shop.followerCount / 1000).toFixed(1)}K` : shop.followerCount },
    ...(foundedYear ? [{ icon: Calendar, label: "Since", value: foundedYear }] : []),
  ];

  const hasSocial = shop.instagram || shop.facebook || shop.twitter;
  const hasContact = shop.location || shop.phone || shop.email || shop.website || Object.keys(shop.operatingHours || {}).length > 0;
  const hasDescription = shop.description || shop.story;

  // Format operating hours into a readable string
  const operatingHoursText = Object.entries(shop.operatingHours || {})
    .map(([day, hours]) => `${day}: ${hours}`)
    .join(", ");

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Shop Header */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <DiceBearAvatar
              seed={shop.avatarSeed || shop.slug}
              style={shop.avatarStyle}
              size="lg"
              className="w-16 h-16"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{shop.name}</h1>
                {shop.isVerified && (
                  <Badge className="bg-blue-100 text-blue-700">
                    <CheckCircle className="w-3 h-3 me-1" />
                    Verified
                  </Badge>
                )}
              </div>
              {shop.tagline && (
                <p className="text-muted-foreground">{shop.tagline}</p>
              )}
            </div>
            <div className="ms-auto flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/shops/${shopSlug}`}>View Shop</Link>
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
            {stats.length > 0 && (
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
                {stats.map((stat, index) => (
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
            )}

            {/* About */}
            {hasDescription && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">About Us</h2>
                <div className="prose prose-gray max-w-none">
                  {(shop.description || shop.story || "").split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>
            )}

            {/* Values */}
            {shop.coreValues && shop.coreValues.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Our Values</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {shop.coreValues.map((value, index) => (
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
            )}

            {/* Milestones */}
            {shop.milestones && shop.milestones.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Our Journey</h2>
                <div className="space-y-6">
                  {shop.milestones.map((milestone, index) => (
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
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            {hasContact && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {shop.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{shop.location}</p>
                      </div>
                    </div>
                  )}
                  {operatingHoursText && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Opening Hours</p>
                        <p className="text-sm text-muted-foreground">{operatingHoursText}</p>
                      </div>
                    </div>
                  )}
                  {shop.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <a href={`tel:${shop.phone}`} className="text-sm text-moulna-gold hover:underline">
                          {shop.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {shop.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a href={`mailto:${shop.email}`} className="text-sm text-moulna-gold hover:underline">
                          {shop.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {shop.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a href={shop.website} target="_blank" rel="noopener" className="text-sm text-moulna-gold hover:underline">
                          {shop.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Social Media */}
            {hasSocial && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {shop.instagram && (
                    <a
                      href={`https://instagram.com/${shop.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener"
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {shop.facebook && (
                    <a
                      href={`https://facebook.com/${shop.facebook}`}
                      target="_blank"
                      rel="noopener"
                      className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {shop.twitter && (
                    <a
                      href={`https://twitter.com/${shop.twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener"
                      className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </Card>
            )}

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
