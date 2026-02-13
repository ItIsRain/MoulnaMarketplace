"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, formatAED, getDiscountPercentage } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search, SlidersHorizontal, Grid3X3, List, ChevronDown,
  Star, Heart, ShoppingCart, Sparkles, MapPin, Filter, X
} from "lucide-react";

// Mock products data
const PRODUCTS = [
  {
    id: "prd_1",
    title: "Handcrafted Arabian Oud Perfume",
    slug: "handcrafted-arabian-oud-perfume",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    priceFils: 45000,
    compareAtPriceFils: 55000,
    rating: 4.8,
    reviewCount: 124,
    seller: { name: "Scent of Arabia", level: 6 },
    category: "Perfumes & Oud",
    isHandmade: true,
    isTrending: true,
    isNew: false,
    xpReward: 45,
  },
  {
    id: "prd_2",
    title: "Traditional Arabic Calligraphy Art",
    slug: "traditional-arabic-calligraphy-art",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
    priceFils: 89000,
    rating: 5.0,
    reviewCount: 56,
    seller: { name: "Khalid Arts", level: 8 },
    category: "Arabic Calligraphy",
    isHandmade: true,
    isTrending: false,
    isNew: true,
    xpReward: 89,
  },
  {
    id: "prd_3",
    title: "Gold-Plated Pearl Earrings",
    slug: "gold-plated-pearl-earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    priceFils: 32000,
    rating: 4.9,
    reviewCount: 89,
    seller: { name: "Gulf Gems", level: 5 },
    category: "Handmade Jewelry",
    isHandmade: true,
    isTrending: true,
    isNew: false,
    xpReward: 32,
  },
  {
    id: "prd_4",
    title: "Moroccan Ceramic Vase Set",
    slug: "moroccan-ceramic-vase-set",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400",
    priceFils: 67500,
    compareAtPriceFils: 85000,
    rating: 4.7,
    reviewCount: 42,
    seller: { name: "Desert Home", level: 4 },
    category: "Home Décor",
    isHandmade: true,
    isTrending: false,
    isNew: false,
    xpReward: 67,
  },
  {
    id: "prd_5",
    title: "Embroidered Abaya with Gold Thread",
    slug: "embroidered-abaya-gold-thread",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400",
    priceFils: 125000,
    rating: 4.9,
    reviewCount: 78,
    seller: { name: "Elegance UAE", level: 7 },
    category: "Fashion & Clothing",
    isHandmade: true,
    isTrending: true,
    isNew: true,
    xpReward: 125,
  },
  {
    id: "prd_6",
    title: "Organic Date Honey Gift Box",
    slug: "organic-date-honey-gift-box",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    priceFils: 28000,
    rating: 4.8,
    reviewCount: 156,
    seller: { name: "Al Ain Farms", level: 6 },
    category: "Food & Sweets",
    isHandmade: false,
    isTrending: true,
    isNew: false,
    xpReward: 28,
  },
  {
    id: "prd_7",
    title: "Handpainted Desert Landscape",
    slug: "handpainted-desert-landscape",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400",
    priceFils: 175000,
    rating: 5.0,
    reviewCount: 23,
    seller: { name: "Emirates Art Studio", level: 8 },
    category: "Art & Prints",
    isHandmade: true,
    isTrending: false,
    isNew: true,
    xpReward: 175,
  },
  {
    id: "prd_8",
    title: "Wooden Baby Toys Set",
    slug: "wooden-baby-toys-set",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400",
    priceFils: 18500,
    rating: 4.6,
    reviewCount: 67,
    seller: { name: "Little Emirates", level: 3 },
    category: "Baby & Kids",
    isHandmade: true,
    isTrending: false,
    isNew: false,
    xpReward: 18,
  },
];

const CATEGORIES = [
  { id: "all", name: "All Products", icon: "🛍️" },
  { id: "jewelry", name: "Handmade Jewelry", icon: "💍" },
  { id: "home", name: "Home Décor", icon: "🏠" },
  { id: "calligraphy", name: "Arabic Calligraphy", icon: "🖋️" },
  { id: "perfume", name: "Perfumes & Oud", icon: "🌸" },
  { id: "fashion", name: "Fashion & Clothing", icon: "👗" },
  { id: "food", name: "Food & Sweets", icon: "🍯" },
  { id: "art", name: "Art & Prints", icon: "🎨" },
  { id: "baby", name: "Baby & Kids", icon: "🧸" },
];

const EMIRATES = ["All Emirates", "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "top_rated", label: "Top Rated" },
  { value: "most_sold", label: "Best Sellers" },
];

export default function ExplorePage() {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("trending");
  const [showFilters, setShowFilters] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 200000]);
  const [showHandmadeOnly, setShowHandmadeOnly] = React.useState(false);
  const [wishlist, setWishlist] = React.useState<string[]>([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = PRODUCTS.filter(p => {
    if (showHandmadeOnly && !p.isHandmade) return false;
    if (p.priceFils < priceRange[0] || p.priceFils > priceRange[1]) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-moulna-charcoal to-moulna-charcoal-light text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl font-bold mb-4">
                Explore Handmade Treasures
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Discover unique products crafted by talented artisans across the UAE
              </p>
              <div className="relative max-w-xl">
                <Input
                  placeholder="Search for products, shops, or categories..."
                  className="h-12 ps-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          selectedCategory === cat.id
                            ? "bg-moulna-gold/10 text-moulna-gold font-medium"
                            : "hover:bg-muted"
                        )}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Price Range */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0] / 100}
                        onChange={(e) => setPriceRange([Number(e.target.value) * 100, priceRange[1]])}
                        className="h-9"
                      />
                      <span className="text-muted-foreground">—</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1] / 100}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) * 100])}
                        className="h-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatAED(priceRange[0])} - {formatAED(priceRange[1])}
                    </p>
                  </div>
                </Card>

                {/* Location */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Location</h3>
                  <div className="space-y-1">
                    {EMIRATES.slice(0, 5).map((emirate) => (
                      <button
                        key={emirate}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{emirate}</span>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Filters */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Filters</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showHandmadeOnly}
                        onChange={(e) => setShowHandmadeOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-muted-foreground"
                      />
                      <span className="text-sm">Handmade Only</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-muted-foreground" />
                      <span className="text-sm">On Sale</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-muted-foreground" />
                      <span className="text-sm">Free Shipping</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-muted-foreground" />
                      <span className="text-sm">Verified Sellers</span>
                    </label>
                  </div>
                </Card>

                {/* XP Rewards Info */}
                <Card className="p-4 bg-gradient-to-br from-moulna-gold/10 to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-moulna-gold" />
                    <h3 className="font-semibold">Earn XP</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Earn 1 XP for every AED spent. Look for bonus XP products!
                  </p>
                </Card>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{filteredProducts.length}</span> products found
                  </p>

                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden"
                  >
                    <Filter className="w-4 h-4 me-2" />
                    Filters
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-9 px-3 rounded-lg border bg-background text-sm"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* View Toggle */}
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
              </div>

              {/* Product Grid */}
              <div className={cn(
                "grid gap-6",
                view === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              )}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      hover
                      className={cn(
                        "overflow-hidden group",
                        view === "list" && "flex"
                      )}
                    >
                      {/* Image */}
                      <div className={cn(
                        "relative overflow-hidden",
                        view === "grid" ? "aspect-square" : "w-48 flex-shrink-0"
                      )}>
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 start-3 flex flex-col gap-2">
                          {product.isTrending && (
                            <Badge variant="trending">Trending</Badge>
                          )}
                          {product.isNew && (
                            <Badge variant="new">New</Badge>
                          )}
                          {product.isHandmade && (
                            <Badge variant="handmade">Handmade</Badge>
                          )}
                          {product.compareAtPriceFils && (
                            <Badge variant="default" className="bg-red-500">
                              -{getDiscountPercentage(product.priceFils, product.compareAtPriceFils)}%
                            </Badge>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-3 end-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/50 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                        >
                          <Heart
                            className={cn(
                              "w-4 h-4",
                              wishlist.includes(product.id)
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground"
                            )}
                          />
                        </button>

                        {/* Quick Add */}
                        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="gold" size="sm" className="w-full">
                            <ShoppingCart className="w-4 h-4 me-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className={cn("p-4", view === "list" && "flex-1")}>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-medium hover:text-moulna-gold transition-colors line-clamp-2 mb-1">
                            {product.title}
                          </h3>
                        </Link>

                        <p className="text-sm text-muted-foreground mb-2">
                          by {product.seller.name}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-moulna-gold text-moulna-gold" />
                            <span className="text-sm font-medium">{product.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviewCount} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">
                              {formatAED(product.priceFils)}
                            </span>
                            {product.compareAtPriceFils && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatAED(product.compareAtPriceFils)}
                              </span>
                            )}
                          </div>

                          {/* XP Preview */}
                          <div className="flex items-center gap-1 text-sm text-moulna-gold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>+{product.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg">
                  Load More Products
                  <ChevronDown className="w-4 h-4 ms-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
