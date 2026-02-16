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
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { formatAED } from "@/lib/utils";
import type { Product } from "@/lib/types";

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

// Trending products loaded from API - see TrendingSection component below

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

function TrendingSection() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/products?sort=trending&limit=8")
      .then(res => res.json())
      .then(data => {
        if (data.products) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
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
            <Link href="/explore?sort=trending">
              <Button variant="ghost" className="gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No products yet. Be the first to list!</p>
            <Button variant="gold" className="mt-4" asChild>
              <Link href="/seller/products/new">Add Listing</Link>
            </Button>
          </Card>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={scaleIn}>
                <Link href={`/products/${product.slug}`}>
                  <Card hover className="overflow-hidden group">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                          No image
                        </div>
                      )}
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.isTrending && (
                          <Badge variant="trending">Trending</Badge>
                        )}
                        {product.isNew && (
                          <Badge variant="new">New</Badge>
                        )}
                        {product.isHandmade && (
                          <Badge variant="handmade">Handmade</Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 truncate">{product.title}</h3>

                      {/* Seller */}
                      <div className="flex items-center gap-2 mb-2">
                        <DiceBearAvatar
                          seed={product.seller.avatarSeed || product.seller.name}
                          style={product.seller.avatarStyle}
                          size="xs"
                        />
                        <span className="text-xs text-muted-foreground truncate">
                          {product.seller.name}
                        </span>
                        <LevelBadge level={product.seller.level} size="sm" />
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-moulna-gold">
                          {formatAED(product.priceFils)}
                        </span>
                        {product.compareAtPriceFils && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatAED(product.compareAtPriceFils)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

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
                  Browse UAE's finest creators — connect directly with sellers.
                  Level up, collect badges, and unlock exclusive perks!
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link href="/explore">
                    <Button size="xl" className="w-full sm:w-auto gap-2">
                      Browse Listings
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
        <TrendingSection />

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
                <Link href="/explore/shops">
                  <Button variant="ghost" className="gap-1">
                    View All Shops <ArrowRight className="w-4 h-4" />
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
