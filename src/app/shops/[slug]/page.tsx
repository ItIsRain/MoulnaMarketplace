"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { cn, formatAED } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { BadgeShowcase } from "@/components/gamification/BadgeCard";
import {
  Star, Heart, ShoppingCart, Share2, MapPin, Calendar,
  MessageCircle, UserPlus, ChevronRight, Grid3X3, List,
  Sparkles, Award, Package, Shield, Clock, Instagram
} from "lucide-react";

// Mock shop data
const SHOP = {
  id: "shp_1",
  name: "Scent of Arabia",
  slug: "scent-of-arabia",
  tagline: "Authentic Arabian fragrances crafted with passion",
  description: `
    Welcome to Scent of Arabia, where we bring you the finest traditional Arabian fragrances.

    Our journey began in 2018 when we started crafting perfumes using authentic oud and premium ingredients sourced from across the Middle East. Each fragrance tells a story of Arabian heritage and luxury.

    We believe in quality over quantity, which is why each bottle is carefully blended and aged to perfection. Our perfumers have decades of experience in traditional fragrance making, passed down through generations.
  `,
  avatar: "scent-arabia",
  banner: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200",
  level: 6,
  xp: 15420,
  rating: 4.9,
  totalReviews: 342,
  totalSales: 1250,
  totalProducts: 28,
  followers: 1847,
  location: "Dubai, UAE",
  joinDate: "March 2022",
  responseTime: "Within 2 hours",
  shippingTime: "1-3 days",
  isVerified: true,
  badges: [
    { id: "bdg_1", name: "Top Seller", icon: "🏆", description: "Top selling shop in category", category: "seller" as const, xpReward: 500 },
    { id: "bdg_2", name: "Fast Shipper", icon: "⚡", description: "Ships within 24 hours", category: "seller" as const, xpReward: 200 },
    { id: "bdg_3", name: "Customer Favorite", icon: "❤️", description: "Loved by customers", category: "social" as const, xpReward: 300 },
    { id: "bdg_4", name: "100+ Sales", icon: "💯", description: "Made 100+ sales", category: "seller" as const, xpReward: 250 },
    { id: "bdg_5", name: "5-Star Service", icon: "⭐", description: "Maintains 5-star rating", category: "seller" as const, xpReward: 400 },
  ],
  categories: ["Perfumes & Oud", "Gift Sets", "Home Fragrances"],
  socialLinks: {
    instagram: "@scentofarabia",
    whatsapp: "+971501234567",
  },
};

const PRODUCTS = [
  {
    id: "prd_1",
    title: "Handcrafted Arabian Oud Perfume",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    priceFils: 45000,
    compareAtPriceFils: 55000,
    rating: 4.8,
    reviewCount: 124,
    isHandmade: true,
    isTrending: true,
  },
  {
    id: "prd_2",
    title: "Rose Oud Mist",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",
    priceFils: 22000,
    rating: 4.7,
    reviewCount: 56,
    isHandmade: true,
  },
  {
    id: "prd_3",
    title: "Amber Bakhoor Set",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=400",
    priceFils: 35000,
    rating: 4.9,
    reviewCount: 89,
    isHandmade: true,
    isNew: true,
  },
  {
    id: "prd_4",
    title: "Premium Oud Chips",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400",
    priceFils: 89000,
    rating: 5.0,
    reviewCount: 23,
    isHandmade: true,
  },
  {
    id: "prd_5",
    title: "Traditional Oud Burner",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    priceFils: 18500,
    rating: 4.6,
    reviewCount: 45,
    isHandmade: true,
  },
  {
    id: "prd_6",
    title: "Organic Date Honey Gift Box",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    priceFils: 28000,
    rating: 4.8,
    reviewCount: 67,
  },
];

const REVIEWS = [
  {
    id: "rvw_1",
    user: { name: "Fatima A.", avatar: "fatima-a", level: 4 },
    rating: 5,
    text: "Amazing fragrances! The oud is authentic and lasts all day. Highly recommend this shop.",
    date: "1 week ago",
    product: "Handcrafted Arabian Oud Perfume",
  },
  {
    id: "rvw_2",
    user: { name: "Khalid M.", avatar: "khalid-m", level: 6 },
    rating: 5,
    text: "Best oud in Dubai! Fast shipping and beautiful packaging. Will definitely order again.",
    date: "2 weeks ago",
    product: "Premium Oud Chips",
  },
  {
    id: "rvw_3",
    user: { name: "Noura H.", avatar: "noura-h", level: 3 },
    rating: 5,
    text: "Perfect gift for my husband. The seller was very helpful and responsive.",
    date: "3 weeks ago",
    product: "Amber Bakhoor Set",
  },
];

export default function ShopPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = React.useState<"products" | "reviews" | "about">("products");
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const shop = SHOP; // In real app, fetch by slug

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Shop Banner */}
        <div className="relative h-64 md:h-80">
          <Image
            src={shop.banner}
            alt={shop.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Shop Header */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 mb-8">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0 -mt-20 md:-mt-24">
                  <div className="relative">
                    <DiceBearAvatar
                      seed={shop.avatar}
                      size="3xl"
                      className="border-4 border-background shadow-lg"
                    />
                    <div className="absolute -bottom-2 -end-2">
                      <LevelBadge level={shop.level} size="md" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="font-display text-2xl md:text-3xl font-bold">
                          {shop.name}
                        </h1>
                        {shop.isVerified && (
                          <Badge variant="gold">
                            <Shield className="w-3 h-3 me-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{shop.tagline}</p>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-moulna-gold text-moulna-gold" />
                          <span className="font-medium">{shop.rating}</span>
                          <span className="text-muted-foreground">({shop.totalReviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Package className="w-4 h-4" />
                          <span>{shop.totalSales.toLocaleString()} sales</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{shop.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {shop.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                      <Button
                        variant={isFollowing ? "outline" : "gold"}
                        onClick={() => setIsFollowing(!isFollowing)}
                      >
                        {isFollowing ? (
                          <>Following</>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 me-2" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 me-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-4 mt-4">
                    <BadgeShowcase
                      badges={shop.badges}
                      maxVisible={5}
                    />
                    <span className="text-sm text-muted-foreground">
                      {shop.badges.length} badges earned
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex md:hidden items-center gap-3 mt-6">
                <Button
                  variant={isFollowing ? "outline" : "gold"}
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="flex-1"
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 me-2" />
                  Contact
                </Button>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="border-b mb-8">
            <div className="flex gap-8">
              {[
                { id: "products", label: "Products", count: shop.totalProducts },
                { id: "reviews", label: "Reviews", count: shop.totalReviews },
                { id: "about", label: "About" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "pb-4 px-1 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-moulna-gold text-moulna-gold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ms-2 text-muted-foreground">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="pb-12">
            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    {shop.categories.map((cat) => (
                      <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-muted">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center border rounded-lg p-1">
                    <button
                      onClick={() => setView("grid")}
                      className={cn(
                        "p-1.5 rounded",
                        view === "grid" ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={cn(
                        "p-1.5 rounded",
                        view === "list" ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {PRODUCTS.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card hover className="overflow-hidden group">
                        <div className="relative aspect-square">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.isTrending && (
                            <Badge variant="trending" className="absolute top-3 start-3">
                              Trending
                            </Badge>
                          )}
                          {product.isNew && (
                            <Badge variant="new" className="absolute top-3 start-3">
                              New
                            </Badge>
                          )}
                          <button className="absolute top-3 end-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/50 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-moulna-gold transition-colors">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 fill-moulna-gold text-moulna-gold" />
                            <span className="text-sm">{product.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({product.reviewCount})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{formatAED(product.priceFils)}</span>
                            {product.compareAtPriceFils && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatAED(product.compareAtPriceFils)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <Card className="p-6">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">{shop.rating}</div>
                      <div className="flex justify-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-5 h-5 fill-moulna-gold text-moulna-gold"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{shop.totalReviews} reviews</p>
                    </div>
                    <Separator orientation="vertical" className="h-24" />
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const percentage = stars === 5 ? 85 : stars === 4 ? 10 : 3;
                        return (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="text-sm w-8">{stars} ★</span>
                            <Progress value={percentage} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground w-12">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                {/* Review List */}
                {REVIEWS.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <DiceBearAvatar seed={review.user.avatar} size="lg" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.user.name}</span>
                          <LevelBadge level={review.user.level} size="sm" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-4 h-4",
                                  star <= review.rating
                                    ? "fill-moulna-gold text-moulna-gold"
                                    : "text-muted"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Purchased: {review.product}
                        </p>
                        <p className="text-muted-foreground">{review.text}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-4">About Us</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line">{shop.description}</p>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Quick Info */}
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Quick Info</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Response Time</p>
                          <p className="text-sm text-muted-foreground">{shop.responseTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Shipping Time</p>
                          <p className="text-sm text-muted-foreground">{shop.shippingTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{shop.location}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Social Links */}
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Connect</h3>
                    <div className="space-y-3">
                      {shop.socialLinks.instagram && (
                        <a
                          href={`https://instagram.com/${shop.socialLinks.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm hover:text-moulna-gold transition-colors"
                        >
                          <Instagram className="w-5 h-5" />
                          <span>{shop.socialLinks.instagram}</span>
                        </a>
                      )}
                    </div>
                  </Card>

                  {/* Achievements */}
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Achievements</h3>
                    <div className="space-y-3">
                      {shop.badges.map((badge) => (
                        <div key={badge.id} className="flex items-center gap-3">
                          <span className="text-2xl">{badge.icon}</span>
                          <span className="text-sm">{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
