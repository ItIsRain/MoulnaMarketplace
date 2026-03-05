"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gem, Home, Palette, Sparkles, Shirt, Cookie,
  Baby, Heart, Laptop, Gift, Scissors, Flower2
} from "lucide-react";

const CATEGORIES = [
  {
    slug: "jewelry",
    name: "Handmade Jewelry",
    description: "Unique rings, necklaces, bracelets and earrings crafted by local artisans",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    icon: Gem,
    productCount: 0,
    trending: true,
    subcategories: ["Rings", "Necklaces", "Bracelets", "Earrings", "Sets"],
  },
  {
    slug: "home-decor",
    name: "Home Décor",
    description: "Beautiful home accessories, vases, candles and decorative items",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600",
    icon: Home,
    productCount: 0,
    subcategories: ["Vases", "Candles", "Wall Art", "Cushions", "Rugs"],
  },
  {
    slug: "art-calligraphy",
    name: "Arabic Calligraphy",
    description: "Traditional and modern Arabic calligraphy art pieces and prints",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600",
    icon: Palette,
    productCount: 0,
    subcategories: ["Wall Art", "Prints", "Custom Names", "Quran Art"],
  },
  {
    slug: "perfumes-oud",
    name: "Perfumes & Oud",
    description: "Authentic Arabian fragrances, oud oils and bakhoor",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
    icon: Sparkles,
    productCount: 0,
    trending: true,
    subcategories: ["Oud Oil", "Perfumes", "Bakhoor", "Diffusers", "Gift Sets"],
  },
  {
    slug: "fashion",
    name: "Fashion & Clothing",
    description: "Abayas, kaftans, modest fashion and traditional wear",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600",
    icon: Shirt,
    productCount: 0,
    subcategories: ["Abayas", "Kaftans", "Hijabs", "Accessories"],
  },
  {
    slug: "food-sweets",
    name: "Food & Sweets",
    description: "Artisanal chocolates, dates, honey and homemade treats",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600",
    icon: Cookie,
    productCount: 0,
    subcategories: ["Dates", "Chocolate", "Honey", "Baked Goods", "Gift Boxes"],
  },
  {
    slug: "baby-kids",
    name: "Baby & Kids",
    description: "Handmade toys, clothing and accessories for children",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600",
    icon: Baby,
    productCount: 0,
    subcategories: ["Toys", "Clothing", "Nursery", "Party Supplies"],
  },
  {
    slug: "wellness-beauty",
    name: "Wellness & Beauty",
    description: "Natural skincare, soaps and beauty products",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
    icon: Heart,
    productCount: 0,
    subcategories: ["Skincare", "Soaps", "Hair Care", "Bath & Body"],
  },
  {
    slug: "tech-accessories",
    name: "Tech Accessories",
    description: "Phone cases, laptop sleeves and tech gadgets",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600",
    icon: Laptop,
    productCount: 0,
    subcategories: ["Phone Cases", "Laptop Sleeves", "Cables", "Stands"],
  },
  {
    slug: "gifts-occasions",
    name: "Gifts & Occasions",
    description: "Perfect gifts for Eid, weddings, birthdays and special moments",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600",
    icon: Gift,
    productCount: 0,
    trending: true,
    subcategories: ["Eid Gifts", "Wedding", "Birthday", "Corporate"],
  },
  {
    slug: "handmade-crafts",
    name: "Handmade Crafts",
    description: "Unique handcrafted items from local artisans",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600",
    icon: Scissors,
    productCount: 0,
    subcategories: ["Pottery", "Woodwork", "Textiles", "Paper Crafts"],
  },
  {
    slug: "plants-flowers",
    name: "Plants & Flowers",
    description: "Indoor plants, succulents and dried flower arrangements",
    image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600",
    icon: Flower2,
    productCount: 0,
    subcategories: ["Indoor Plants", "Succulents", "Dried Flowers", "Planters"],
  },
];

function normalizeSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) return;
        const data = await res.json();
        const apiCategories: { slug: string; productCount: number }[] = data.categories || [];

        const countMap = new Map<string, number>();
        apiCategories.forEach((c) => countMap.set(normalizeSlug(c.slug), c.productCount));

        setCategories(
          CATEGORIES.map((cat) => ({
            ...cat,
            productCount: countMap.get(normalizeSlug(cat.slug)) ?? 0,
          }))
        );
      } catch {
        // Keep defaults (0) on error
      }
    }
    fetchCounts();
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="font-display text-4xl font-bold mb-4" style={{ color: 'var(--moulna-gold)' }}>
                Explore Categories
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover unique handmade products from UAE&apos;s finest artisans and creators
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/explore/categories/${category.slug}`}>
                    <Card className="overflow-hidden group cursor-pointer h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Icon Badge */}
                        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-moulna-gold" />
                        </div>

                        {/* Trending Badge */}
                        {category.trending && (
                          <Badge className="absolute top-4 right-4 bg-moulna-gold">
                            Trending
                          </Badge>
                        )}

                        {/* Category Name */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--moulna-gold)' }}>
                            {category.name}
                          </h2>
                          <p className="text-sm text-white/80">
                            {category.productCount.toLocaleString()} products
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          {category.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.slice(0, 4).map((sub) => (
                            <Badge key={sub} variant="outline" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                          {category.subcategories.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.subcategories.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
