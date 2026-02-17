"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";
import type { Shop } from "@/lib/types";
import {
  Store, Search, MapPin, Star, Heart, Users,
  Package, Shield, Filter, ArrowUpDown, ChevronRight, Loader2
} from "lucide-react";

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
  const [shops, setShops] = React.useState<Shop[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [offset, setOffset] = React.useState(0);
  const limit = 20;

  const fetchShops = React.useCallback(async (resetOffset = false) => {
    setIsLoading(true);
    const currentOffset = resetOffset ? 0 : offset;
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedLocation !== "All Emirates") params.set("location", selectedLocation);
    params.set("sort", sortBy);
    params.set("limit", String(limit));
    params.set("offset", String(currentOffset));

    try {
      const res = await fetch(`/api/shops?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (resetOffset) {
          setShops(data.shops);
          setOffset(0);
        } else {
          setShops(prev => currentOffset === 0 ? data.shops : [...prev, ...data.shops]);
        }
        setTotal(data.total);
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedLocation, sortBy, offset]);

  // Fetch on filter change
  React.useEffect(() => {
    setOffset(0);
    fetchShops(true);
  }, [selectedCategory, selectedLocation, sortBy]);

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
      fetchShops(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
  };

  // Fetch more when offset changes (but not on initial)
  React.useEffect(() => {
    if (offset > 0) fetchShops(false);
  }, [offset]);

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
            {isLoading && shops.length === 0 ? "Loading..." : `Showing ${shops.length} of ${total} shops`}
          </p>

          {isLoading && shops.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop, index) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/shops/${shop.slug}`}>
                    <Card className="overflow-hidden group cursor-pointer h-full hover:shadow-lg transition-shadow">
                      {/* Banner */}
                      <div className="relative h-32 overflow-hidden">
                        {shop.bannerUrl ? (
                          <Image
                            src={shop.bannerUrl}
                            alt={shop.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-moulna-gold/20 to-amber-100 group-hover:scale-105 transition-transform duration-500" />
                        )}
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
                          <ShopAvatar
                            logoUrl={shop.logoUrl}
                            avatarSeed={shop.avatarSeed || shop.slug}
                            avatarStyle={shop.avatarStyle}
                            name={shop.name}
                            size="xl"
                            className="border-4 border-white shadow-lg"
                          />
                          {shop.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center" title="ID Verified">
                              <Shield className="w-3.5 h-3.5 text-white" />
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
                              {shop.category || "Shop"}
                            </p>
                          </div>
                        </div>

                        {shop.tagline && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {shop.tagline}
                          </p>
                        )}

                        {/* Badges */}
                        {(shop.isVerified || shop.isArtisan) && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {shop.isVerified && (
                              <Badge variant="verified" className="text-xs">
                                <Shield className="w-3 h-3 me-1" />
                                ID Verified
                              </Badge>
                            )}
                            {shop.isArtisan && (
                              <Badge variant="outline" className="text-xs">Artisan</Badge>
                            )}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Package className="w-4 h-4" />
                              {shop.totalListings} listings
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            {shop.followerCount.toLocaleString()}
                          </div>
                        </div>

                        {/* Location */}
                        {shop.location && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {shop.location}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && shops.length === 0 && (
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
          {shops.length > 0 && shops.length < total && (
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" onClick={loadMore} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : null}
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
