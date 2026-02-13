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
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Store, Search, MapPin, Star, Heart, Users,
  Package, Award, Filter, ArrowUpDown, ChevronRight
} from "lucide-react";

const SHOPS = [
  {
    slug: "scent-of-arabia",
    name: "Scent of Arabia",
    avatar: "scent-of-arabia",
    banner: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    category: "Perfumes & Oud",
    location: "Dubai",
    level: 8,
    rating: 4.9,
    reviewCount: 245,
    followers: 2450,
    productCount: 28,
    isVerified: true,
    badges: ["Top Seller", "Artisan"],
    description: "Authentic Arabian fragrances crafted with love",
  },
  {
    slug: "heritage-jewels",
    name: "Heritage Jewels",
    avatar: "heritage-jewels",
    banner: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
    category: "Jewelry",
    location: "Abu Dhabi",
    level: 7,
    rating: 4.8,
    reviewCount: 189,
    followers: 1890,
    productCount: 45,
    isVerified: true,
    badges: ["Artisan"],
    description: "Traditional and modern jewelry designs",
  },
  {
    slug: "calligraphy-dreams",
    name: "Calligraphy Dreams",
    avatar: "calligraphy",
    banner: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
    category: "Arabic Art",
    location: "Sharjah",
    level: 6,
    rating: 5.0,
    reviewCount: 98,
    followers: 1540,
    productCount: 32,
    isVerified: true,
    badges: ["Rising Star"],
    description: "Beautiful Arabic calligraphy art pieces",
  },
  {
    slug: "desert-weaves",
    name: "Desert Weaves",
    avatar: "desert-weaves",
    banner: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    category: "Home Décor",
    location: "Dubai",
    level: 5,
    rating: 4.7,
    reviewCount: 76,
    followers: 980,
    productCount: 24,
    isVerified: false,
    badges: [],
    description: "Traditional Sadu weaving and home textiles",
  },
  {
    slug: "pearl-paradise",
    name: "Pearl Paradise",
    avatar: "pearl-paradise",
    banner: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800",
    category: "Jewelry",
    location: "RAK",
    level: 4,
    rating: 4.9,
    reviewCount: 54,
    followers: 720,
    productCount: 18,
    isVerified: true,
    badges: ["Artisan"],
    description: "Exquisite pearl jewelry from the Gulf",
  },
  {
    slug: "oud-masters",
    name: "Oud Masters",
    avatar: "oud-masters",
    banner: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
    category: "Perfumes & Oud",
    location: "Ajman",
    level: 6,
    rating: 4.8,
    reviewCount: 132,
    followers: 1650,
    productCount: 35,
    isVerified: true,
    badges: ["Top Seller"],
    description: "Premium oud and traditional perfumes",
  },
];

const CATEGORIES = [
  "All",
  "Perfumes & Oud",
  "Jewelry",
  "Home Décor",
  "Arabic Art",
  "Fashion",
  "Food & Sweets",
];

const LOCATIONS = [
  "All Emirates",
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "RAK",
  "Fujairah",
  "UAQ",
];

export default function ShopsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedLocation, setSelectedLocation] = React.useState("All Emirates");
  const [sortBy, setSortBy] = React.useState("popular");

  const filteredShops = SHOPS.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || shop.category === selectedCategory;
    const matchesLocation = selectedLocation === "All Emirates" || shop.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <Store className="w-12 h-12 mx-auto mb-4 text-moulna-gold" />
              <h1 className="font-display text-4xl font-bold mb-4">
                Discover Shops
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explore unique shops from talented artisans and creators across the UAE
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shops by name..."
                  className="ps-12 py-6 text-lg rounded-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 py-4 overflow-x-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium whitespace-nowrap">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-1.5 bg-background"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium whitespace-nowrap">Location:</span>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-1.5 bg-background"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-1.5 bg-background"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="products">Most Products</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Shops Grid */}
        <section className="container mx-auto px-4 py-12">
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredShops.length} shops
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop, index) => (
              <motion.div
                key={shop.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/shops/${shop.slug}`}>
                  <Card className="overflow-hidden group cursor-pointer h-full hover:shadow-lg transition-shadow">
                    {/* Banner */}
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={shop.banner}
                        alt={shop.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Follow Button */}
                      <button
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Avatar */}
                    <div className="relative px-4">
                      <div className="absolute -top-8">
                        <DiceBearAvatar
                          seed={shop.avatar}
                          size="xl"
                          className="border-4 border-white shadow-lg"
                        />
                        {shop.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <Award className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-12 px-4 pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-moulna-gold transition-colors">
                            {shop.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {shop.category}
                          </p>
                        </div>
                        <LevelBadge level={shop.level} size="sm" />
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {shop.description}
                      </p>

                      {/* Badges */}
                      {shop.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {shop.badges.map((badge) => (
                            <Badge key={badge} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{shop.rating}</span>
                            <span className="text-muted-foreground">({shop.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Package className="w-4 h-4" />
                            {shop.productCount}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {shop.followers.toLocaleString()}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {shop.location}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredShops.length === 0 && (
            <Card className="p-12 text-center">
              <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No shops found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedLocation("All Emirates");
                }}
              >
                Clear Filters
              </Button>
            </Card>
          )}

          {/* Load More */}
          {filteredShops.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Shops
              </Button>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-moulna-gold to-moulna-gold-dark py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to Start Your Own Shop?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Join thousands of successful sellers on Moulna and turn your passion into profit.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-moulna-gold hover:bg-white/90 border-white" asChild>
              <Link href="/sell-with-us">
                Start Selling
                <ChevronRight className="w-5 h-5 ms-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
