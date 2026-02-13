"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Star,
  Heart,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// Mock data
const CATEGORIES = [
  { name: "Handmade Jewelry", slug: "jewelry", icon: "💎", count: 2847 },
  { name: "Home Décor", slug: "home-decor", icon: "🏠", count: 1923 },
  { name: "Arabic Calligraphy", slug: "calligraphy", icon: "✒️", count: 892 },
  { name: "Perfumes & Oud", slug: "perfumes", icon: "🌸", count: 1456 },
  { name: "Fashion & Clothing", slug: "fashion", icon: "👗", count: 3201 },
  { name: "Food & Sweets", slug: "food", icon: "🍯", count: 987 },
  { name: "Art & Prints", slug: "art", icon: "🎨", count: 1654 },
  { name: "Baby & Kids", slug: "baby-kids", icon: "👶", count: 1122 },
];

const TRENDING_PRODUCTS = [
  {
    id: "1",
    title: "Handcrafted Oud Perfume",
    price: 450,
    originalPrice: 550,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    seller: { name: "Arabian Scents", avatar: "arabian_scents", level: 7 },
    rating: 4.9,
    reviews: 128,
    badge: "trending" as const,
  },
  {
    id: "2",
    title: "Arabic Calligraphy Wall Art",
    price: 280,
    image: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=400",
    seller: { name: "Khatt Studio", avatar: "khatt_studio", level: 6 },
    rating: 4.8,
    reviews: 86,
    badge: "handmade" as const,
  },
  {
    id: "3",
    title: "Gold Plated Pearl Earrings",
    price: 185,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    seller: { name: "Luxe Jewels", avatar: "luxe_jewels", level: 8 },
    rating: 5.0,
    reviews: 203,
    badge: "new" as const,
  },
  {
    id: "4",
    title: "Handwoven Silk Scarf",
    price: 320,
    originalPrice: 380,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400",
    seller: { name: "Silk & Soul", avatar: "silk_soul", level: 5 },
    rating: 4.7,
    reviews: 67,
    badge: "trending" as const,
  },
];

const TOP_SELLERS = [
  { name: "Arabian Scents", avatar: "arabian_scents", level: 7, xp: 25000, rating: 4.9, sales: 1247 },
  { name: "Khatt Studio", avatar: "khatt_studio", level: 6, xp: 15000, rating: 4.8, sales: 892 },
  { name: "Luxe Jewels", avatar: "luxe_jewels", level: 8, xp: 42000, rating: 5.0, sales: 2341 },
  { name: "Heritage Crafts", avatar: "heritage_crafts", level: 5, xp: 8500, rating: 4.7, sales: 567 },
];

const TESTIMONIALS = [
  {
    name: "Fatima Al-Rashid",
    avatar: "fatima_r",
    level: 5,
    text: "Moulna has transformed how I shop for unique gifts. The XP system makes it so fun!",
    role: "Buyer",
  },
  {
    name: "Ahmed Hassan",
    avatar: "ahmed_h",
    level: 7,
    text: "As a seller, the gamification features have doubled my engagement. Love the badges!",
    role: "Seller",
  },
  {
    name: "Sarah Al-Mansoori",
    avatar: "sarah_m",
    level: 6,
    text: "Found the most beautiful handmade jewelry for my wedding. Amazing artisans!",
    role: "Buyer",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-mesh-gold pattern-arabic">
          <div className="container-app py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="text-center lg:text-left"
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Badge variant="gold" className="text-sm px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    UAE's #1 Artisan Marketplace
                  </Badge>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6"
                >
                  Discover{" "}
                  <span className="text-gold-gradient">Unique,</span>
                  <br />
                  Handmade & Local
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
                >
                  Shop from UAE's finest creators — earn rewards with every purchase.
                  Level up, collect badges, and unlock exclusive perks!
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link href="/explore">
                    <Button size="xl" className="w-full sm:w-auto gap-2">
                      Start Shopping
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/sell-with-us">
                    <Button variant="outline" size="xl" className="w-full sm:w-auto">
                      Open Your Shop
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="mt-8 flex items-center gap-2 justify-center lg:justify-start text-sm"
                >
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-moulna-gold-50 dark:bg-moulna-gold/10">
                    <Sparkles className="w-4 h-4 text-moulna-gold" />
                    <span className="font-semibold text-moulna-gold-dark dark:text-moulna-gold">
                      Earn 100 XP
                    </span>
                    <span className="text-muted-foreground">just for signing up!</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right - Product Showcase */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  {/* Floating Product Cards */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-48 bg-card rounded-2xl shadow-xl p-3"
                  >
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-rose-100 to-pink-50 mb-2 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200"
                        alt="Jewelry"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-semibold text-sm truncate">Pearl Earrings</p>
                    <p className="text-moulna-gold font-bold">AED 185</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-20 right-0 w-52 bg-card rounded-2xl shadow-xl p-3"
                  >
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 mb-2 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=200"
                        alt="Perfume"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-semibold text-sm truncate">Oud Perfume</p>
                    <div className="flex items-center justify-between">
                      <p className="text-moulna-gold font-bold">AED 450</p>
                      <Badge variant="trending" className="text-[10px]">Trending</Badge>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-10 left-10 w-44 bg-card rounded-2xl shadow-xl p-3"
                  >
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 mb-2 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=200"
                        alt="Art"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-semibold text-sm truncate">Calligraphy Art</p>
                    <p className="text-moulna-gold font-bold">AED 280</p>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-moulna-gold/20 to-transparent blur-3xl" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Wave Decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Social Proof Bar */}
        <section className="bg-card shadow-sm">
          <div className="container-app py-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-8 text-center"
            >
              <div>
                <p className="text-2xl font-bold text-moulna-gold">12,000+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div>
                <p className="text-2xl font-bold text-moulna-gold">3,000+</p>
                <p className="text-sm text-muted-foreground">Sellers</p>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div>
                <p className="text-2xl font-bold text-moulna-gold">50,000+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div>
                <p className="text-2xl font-bold text-moulna-gold">4.9</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container-app">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex items-end justify-between mb-8"
            >
              <div>
                <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-display font-bold mb-2">
                  Shop by Category
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-muted-foreground">
                  Discover handcrafted treasures across all categories
                </motion.p>
              </div>
              <motion.div variants={fadeInUp}>
                <Link href="/explore/categories">
                  <Button variant="ghost" className="gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {CATEGORIES.map((category) => (
                <motion.div key={category.slug} variants={scaleIn}>
                  <Link href={`/explore/categories/${category.slug}`}>
                    <Card
                      hover
                      className="p-5 text-center group"
                    >
                      <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">
                        {category.icon}
                      </span>
                      <h3 className="font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count.toLocaleString()} items
                      </p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trending Products */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container-app">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex items-end justify-between mb-8"
            >
              <div>
                <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-orange-500">Hot Right Now</span>
                </motion.div>
                <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-display font-bold">
                  Trending Products
                </motion.h2>
              </div>
              <motion.div variants={fadeInUp}>
                <Link href="/explore/trending">
                  <Button variant="ghost" className="gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {TRENDING_PRODUCTS.map((product) => (
                <motion.div key={product.id} variants={scaleIn}>
                  <Link href={`/products/${product.id}`}>
                    <Card hover className="overflow-hidden group">
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                        <Badge
                          variant={product.badge}
                          className="absolute top-3 left-3"
                        >
                          {product.badge === "trending" && "🔥 Trending"}
                          {product.badge === "new" && "🆕 New"}
                          {product.badge === "handmade" && "✋ Handmade"}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold mb-1 truncate">{product.title}</h3>

                        {/* Seller */}
                        <div className="flex items-center gap-2 mb-2">
                          <DiceBearAvatar
                            seed={product.seller.avatar}
                            size="xs"
                          />
                          <span className="text-xs text-muted-foreground truncate">
                            {product.seller.name}
                          </span>
                          <LevelBadge level={product.seller.level} size="sm" />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3.5 h-3.5 fill-moulna-gold text-moulna-gold" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviews})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-moulna-gold">
                            AED {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              AED {product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Top Sellers */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container-app">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex items-end justify-between mb-8"
            >
              <div>
                <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-display font-bold mb-2">
                  Top Sellers This Month
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-muted-foreground">
                  Shop from our highest-rated creators
                </motion.p>
              </div>
              <motion.div variants={fadeInUp}>
                <Link href="/explore/leaderboard">
                  <Button variant="ghost" className="gap-1">
                    View Leaderboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {TOP_SELLERS.map((seller, index) => (
                <motion.div key={seller.name} variants={scaleIn}>
                  <Card hover className="p-5 text-center">
                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? "bg-yellow-400 text-yellow-900" :
                        index === 1 ? "bg-gray-300 text-gray-700" :
                        index === 2 ? "bg-amber-600 text-white" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        #{index + 1}
                      </div>
                    </div>

                    <DiceBearAvatar
                      seed={seller.avatar}
                      size="xl"
                      showLevelRing
                      xp={seller.xp}
                      className="mx-auto mb-3"
                    />

                    <h3 className="font-semibold mb-1">{seller.name}</h3>
                    <LevelBadge xp={seller.xp} size="sm" showTitle />

                    <div className="flex items-center justify-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-moulna-gold text-moulna-gold" />
                        <span className="font-medium">{seller.rating}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {seller.sales.toLocaleString()} sales
                      </div>
                    </div>

                    <Link href={`/shops/${seller.avatar}`} className="block mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        Visit Shop
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container-app">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-display font-bold mb-4">
                Loved by Our Community
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
                See what our buyers and sellers have to say about Moulna
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {TESTIMONIALS.map((testimonial) => (
                <motion.div key={testimonial.name} variants={scaleIn}>
                  <Card className="p-6 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <DiceBearAvatar
                        seed={testimonial.avatar}
                        size="lg"
                        showLevelRing
                        level={testimonial.level}
                      />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <div className="flex items-center gap-2">
                          <LevelBadge level={testimonial.level} size="sm" />
                          <span className="text-xs text-muted-foreground">
                            {testimonial.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">&ldquo;{testimonial.text}&rdquo;</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-moulna-gold-dark via-moulna-gold to-moulna-gold-light text-white">
          <div className="container-app">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4 text-white">
                Ready to Start Selling?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Join thousands of artisans and creators. Set up your shop in minutes and reach customers across the UAE.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sell-with-us">
                  <Button size="xl" className="bg-white text-moulna-charcoal hover:bg-white/90 w-full sm:w-auto">
                    Open Your Shop
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
