"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  TrendingUp, Flame, Star, Heart, Sparkles, Clock,
  ArrowUpRight, ChevronRight, Zap
} from "lucide-react";

const TRENDING_PRODUCTS = [
  {
    id: "prd_1",
    title: "Handcrafted Arabian Oud Perfume - 100ml",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    priceFils: 45000,
    rating: 4.9,
    reviewCount: 124,
    seller: { name: "Scent of Arabia", slug: "scent-of-arabia", avatar: "scent-of-arabia" },
    trendScore: 98,
    salesLast24h: 45,
    xpReward: 5,
  },
  {
    id: "prd_2",
    title: "Premium Gold Ring with Pearl Accent",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    priceFils: 89000,
    rating: 5.0,
    reviewCount: 67,
    seller: { name: "Heritage Jewels", slug: "heritage-jewels", avatar: "heritage-jewels" },
    trendScore: 95,
    salesLast24h: 32,
  },
  {
    id: "prd_3",
    title: "Traditional Arabic Calligraphy Art",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
    priceFils: 35000,
    rating: 4.8,
    reviewCount: 89,
    seller: { name: "Calligraphy Dreams", slug: "calligraphy-dreams", avatar: "calligraphy" },
    trendScore: 92,
    salesLast24h: 28,
    xpReward: 5,
  },
  {
    id: "prd_4",
    title: "Rose Oud Mist - Premium Edition",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",
    priceFils: 28000,
    rating: 4.9,
    reviewCount: 156,
    seller: { name: "Scent of Arabia", slug: "scent-of-arabia", avatar: "scent-of-arabia" },
    trendScore: 90,
    salesLast24h: 52,
  },
  {
    id: "prd_5",
    title: "Handwoven Sadu Cushion Cover",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    priceFils: 18000,
    rating: 4.7,
    reviewCount: 43,
    seller: { name: "Desert Weaves", slug: "desert-weaves", avatar: "desert-weaves" },
    trendScore: 88,
    salesLast24h: 19,
  },
  {
    id: "prd_6",
    title: "Premium Oud Gift Collection",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400",
    priceFils: 85000,
    rating: 4.9,
    reviewCount: 78,
    seller: { name: "Scent of Arabia", slug: "scent-of-arabia", avatar: "scent-of-arabia" },
    trendScore: 86,
    salesLast24h: 15,
    xpReward: 10,
  },
];

const TRENDING_SHOPS = [
  {
    slug: "scent-of-arabia",
    name: "Scent of Arabia",
    avatar: "scent-of-arabia",
    category: "Perfumes & Oud",
    followers: 2450,
    growth: 28,
  },
  {
    slug: "heritage-jewels",
    name: "Heritage Jewels",
    avatar: "heritage-jewels",
    category: "Jewelry",
    followers: 1890,
    growth: 22,
  },
  {
    slug: "calligraphy-dreams",
    name: "Calligraphy Dreams",
    avatar: "calligraphy",
    category: "Art",
    followers: 1540,
    growth: 35,
  },
];

const TRENDING_CATEGORIES = [
  { name: "Perfumes & Oud", growth: 45, color: "from-amber-500 to-orange-500" },
  { name: "Jewelry", growth: 32, color: "from-pink-500 to-rose-500" },
  { name: "Home Décor", growth: 28, color: "from-blue-500 to-cyan-500" },
  { name: "Arabic Art", growth: 25, color: "from-purple-500 to-violet-500" },
];

export default function TrendingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 overflow-hidden bg-gradient-to-br from-orange-500/10 via-transparent to-rose-500/10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-2xl mx-auto">
              <Badge className="bg-gradient-to-r from-orange-500 to-rose-500 text-white mb-4">
                <Flame className="w-3 h-3 me-1" />
                Hot Right Now
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Trending on Moulna
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover what&apos;s popular right now. Updated every hour based on
                sales, views, and customer activity.
              </p>
            </div>
          </div>
        </section>

        {/* Trending Categories */}
        <section className="container mx-auto px-4 py-8 border-b">
          <div className="flex items-center gap-8 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Hot categories:
            </span>
            {TRENDING_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/explore/categories/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="flex items-center gap-2 whitespace-nowrap group"
              >
                <span className={cn(
                  "w-2 h-2 rounded-full bg-gradient-to-r",
                  cat.color
                )} />
                <span className="font-medium group-hover:text-moulna-gold transition-colors">
                  {cat.name}
                </span>
                <span className="text-xs text-emerald-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  {cat.growth}%
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Trending Products */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-xl flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-moulna-gold" />
                  Trending Products
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Updated 15 min ago
                </div>
              </div>

              <div className="space-y-4">
                {TRENDING_PRODUCTS.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/products/${product.id}`}>
                      <Card className="p-4 hover:shadow-lg transition-all hover:border-moulna-gold group">
                        <div className="flex gap-4">
                          {/* Rank */}
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0",
                            index === 0 && "bg-gradient-to-br from-yellow-400 to-orange-500 text-white",
                            index === 1 && "bg-gradient-to-br from-gray-300 to-gray-400 text-white",
                            index === 2 && "bg-gradient-to-br from-amber-600 to-amber-700 text-white",
                            index > 2 && "bg-muted text-muted-foreground"
                          )}>
                            {index + 1}
                          </div>

                          {/* Image */}
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                            {product.xpReward && (
                              <div className="absolute bottom-1 right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-moulna-gold text-white text-xs">
                                <Sparkles className="w-3 h-3" />
                                +{product.xpReward}
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <DiceBearAvatar seed={product.seller.avatar} size="xs" />
                              <span className="text-xs text-muted-foreground">
                                {product.seller.name}
                              </span>
                            </div>
                            <h3 className="font-medium line-clamp-1 group-hover:text-moulna-gold transition-colors">
                              {product.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{product.rating}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({product.reviewCount})
                                </span>
                              </div>
                              <span className="text-lg font-bold text-moulna-gold">
                                {formatAED(product.priceFils)}
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="text-end shrink-0">
                            <div className="flex items-center gap-1 text-orange-500 mb-1">
                              <Flame className="w-4 h-4" />
                              <span className="font-bold">{product.trendScore}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {product.salesLast24h} sold today
                            </p>
                            <Button variant="ghost" size="sm" className="mt-1">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline" size="lg">
                  Load More Trending Products
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* Trending Shops */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-moulna-gold" />
                  Trending Shops
                </h3>
                <div className="space-y-4">
                  {TRENDING_SHOPS.map((shop, index) => (
                    <Link
                      key={shop.slug}
                      href={`/shops/${shop.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <span className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        index === 0 && "bg-yellow-100 text-yellow-700",
                        index === 1 && "bg-gray-100 text-gray-700",
                        index === 2 && "bg-amber-100 text-amber-700"
                      )}>
                        {index + 1}
                      </span>
                      <DiceBearAvatar seed={shop.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate group-hover:text-moulna-gold transition-colors">
                          {shop.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {shop.category}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="text-xs text-emerald-600 flex items-center">
                          <ArrowUpRight className="w-3 h-3" />
                          {shop.growth}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {shop.followers.toLocaleString()} followers
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/explore/shops">
                    View All Shops
                    <ChevronRight className="w-4 h-4 ms-1" />
                  </Link>
                </Button>
              </Card>

              {/* How Trending Works */}
              <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-transparent">
                <h3 className="font-semibold mb-3">How Trending Works</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our algorithm considers multiple factors to determine what&apos;s trending:
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-moulna-gold" />
                    Recent sales velocity
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-moulna-gold" />
                    Product views and wishlist adds
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-moulna-gold" />
                    Customer ratings and reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-moulna-gold" />
                    Social shares and engagement
                  </li>
                </ul>
              </Card>

              {/* XP Bonus */}
              <Card className="p-6 border-moulna-gold bg-moulna-gold/5">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6 text-moulna-gold" />
                  <h3 className="font-semibold">Bonus XP Alert!</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Purchase any trending product today and earn
                  <span className="font-bold text-moulna-gold"> 2x XP bonus</span>!
                </p>
                <Button variant="gold" className="w-full" asChild>
                  <Link href="/explore">
                    Shop Now
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
