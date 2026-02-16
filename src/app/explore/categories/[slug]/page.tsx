"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search, Filter, SlidersHorizontal, Grid3X3, LayoutGrid,
  ChevronDown, Star, Heart, Sparkles, ArrowUpDown
} from "lucide-react";

const CATEGORY_DATA: Record<string, {
  name: string;
  description: string;
  image: string;
  subcategories: string[];
}> = {
  "jewelry": {
    name: "Handmade Jewelry",
    description: "Discover unique rings, necklaces, bracelets and earrings crafted by UAE's finest artisans",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200",
    subcategories: ["All", "Rings", "Necklaces", "Bracelets", "Earrings", "Sets"],
  },
  "perfumes-oud": {
    name: "Perfumes & Oud",
    description: "Authentic Arabian fragrances, oud oils and bakhoor from traditional perfumers",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200",
    subcategories: ["All", "Oud Oil", "Perfumes", "Bakhoor", "Diffusers", "Gift Sets"],
  },
  "home-decor": {
    name: "Home Décor",
    description: "Beautiful home accessories, vases, candles and decorative items",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200",
    subcategories: ["All", "Vases", "Candles", "Wall Art", "Cushions", "Rugs"],
  },
};

const PRODUCTS = [
  {
    id: "prd_1",
    title: "Handcrafted Gold Ring with Pearl",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    priceFils: 89000,
    originalPriceFils: 120000,
    rating: 4.9,
    reviewCount: 45,
    seller: "Dubai Gold House",
    isHandmade: true,
    isTrending: true,
    xpReward: 5,
  },
  {
    id: "prd_2",
    title: "Silver Arabic Calligraphy Necklace",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    priceFils: 45000,
    rating: 4.8,
    reviewCount: 32,
    seller: "Calligraphy Dreams",
    isHandmade: true,
  },
  {
    id: "prd_3",
    title: "Traditional Emirati Bracelet Set",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
    priceFils: 67000,
    rating: 5.0,
    reviewCount: 18,
    seller: "Heritage Jewels",
    isHandmade: true,
    isTrending: true,
  },
  {
    id: "prd_4",
    title: "Turquoise Stone Earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    priceFils: 35000,
    rating: 4.7,
    reviewCount: 28,
    seller: "Stone & Silver",
    isHandmade: true,
  },
  {
    id: "prd_5",
    title: "Rose Gold Minimalist Ring",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400",
    priceFils: 55000,
    rating: 4.9,
    reviewCount: 52,
    seller: "Modern Luxe",
  },
  {
    id: "prd_6",
    title: "Pearl Drop Earrings - Handmade",
    image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400",
    priceFils: 78000,
    rating: 4.8,
    reviewCount: 15,
    seller: "Pearl Paradise",
    isHandmade: true,
    xpReward: 5,
  },
  {
    id: "prd_7",
    title: "Diamond Accent Tennis Bracelet",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    priceFils: 250000,
    rating: 5.0,
    reviewCount: 8,
    seller: "Luxury Gems",
  },
  {
    id: "prd_8",
    title: "Customizable Name Necklace - Arabic",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    priceFils: 42000,
    rating: 4.6,
    reviewCount: 67,
    seller: "Custom Creations",
    isHandmade: true,
  },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = CATEGORY_DATA[slug] || CATEGORY_DATA["jewelry"];

  const [selectedSubcategory, setSelectedSubcategory] = React.useState("All");
  const [viewMode, setViewMode] = React.useState<"grid" | "compact">("grid");
  const [sortBy, setSortBy] = React.useState("popular");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-64 md:h-80">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <nav className="flex items-center gap-2 text-sm text-white/70 mb-3">
                <Link href="/" className="hover:text-white">Home</Link>
                <span>/</span>
                <Link href="/explore/categories" className="hover:text-white">Categories</Link>
                <span>/</span>
                <span className="text-white">{category.name}</span>
              </nav>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                {category.name}
              </h1>
              <p className="text-white/80 max-w-xl">
                {category.description}
              </p>
            </div>
          </div>
        </section>

        {/* Subcategories */}
        <section className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-4 overflow-x-auto">
              {category.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedSubcategory === sub
                      ? "bg-moulna-gold text-white"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 space-y-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>

                {/* Price Range */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Price Range</p>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Min" type="number" className="text-sm" />
                    <span className="text-muted-foreground">-</span>
                    <Input placeholder="Max" type="number" className="text-sm" />
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Rating</p>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-moulna-gold focus:ring-moulna-gold" />
                        <div className="flex items-center gap-1">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-muted-foreground">& up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Features</p>
                  <div className="space-y-2">
                    {["Handmade", "Verified Sellers", "On Sale", "New Arrivals"].map((feature) => (
                      <label key={feature} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-moulna-gold focus:ring-moulna-gold" />
                        <span className="text-sm">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Clear All Filters
                </Button>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{PRODUCTS.length}</span> products
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border-0 bg-transparent focus:ring-0"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1 border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-1.5 rounded",
                        viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("compact")}
                      className={cn(
                        "p-1.5 rounded",
                        viewMode === "compact" ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              )}>
                {PRODUCTS.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/products/${product.id}`}>
                      <Card className="overflow-hidden group cursor-pointer h-full">
                        <div className={cn(
                          "relative overflow-hidden",
                          viewMode === "grid" ? "aspect-square" : "aspect-[4/5]"
                        )}>
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            {product.isTrending && (
                              <Badge className="bg-moulna-gold text-white">Trending</Badge>
                            )}
                            {product.isHandmade && (
                              <Badge variant="handmade">Handmade</Badge>
                            )}
                            {product.originalPriceFils && (
                              <Badge className="bg-red-500 text-white">
                                {Math.round((1 - product.priceFils / product.originalPriceFils) * 100)}% Off
                              </Badge>
                            )}
                          </div>

                          {/* Wishlist */}
                          <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>

                          {/* XP Reward */}
                          {product.xpReward && (
                            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-moulna-gold text-white text-xs font-medium">
                              <Sparkles className="w-3 h-3" />
                              +{product.xpReward} XP
                            </div>
                          )}
                        </div>

                        <div className={cn("p-4", viewMode === "compact" && "p-3")}>
                          <p className="text-xs text-muted-foreground mb-1">
                            {product.seller}
                          </p>
                          <h3 className={cn(
                            "font-medium mb-2 line-clamp-2",
                            viewMode === "compact" && "text-sm"
                          )}>
                            {product.title}
                          </h3>

                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({product.reviewCount})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-bold text-moulna-gold",
                              viewMode === "compact" ? "text-sm" : "text-lg"
                            )}>
                              {formatAED(product.priceFils)}
                            </span>
                            {product.originalPriceFils && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatAED(product.originalPriceFils)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
