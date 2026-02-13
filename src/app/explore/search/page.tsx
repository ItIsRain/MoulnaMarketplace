"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Search, Filter, X, Star, Heart, Sparkles,
  ArrowUpDown, Store, TrendingUp, Loader2
} from "lucide-react";

const SEARCH_RESULTS = [
  {
    id: "prd_1",
    title: "Handcrafted Arabian Oud Perfume - 100ml",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    priceFils: 45000,
    rating: 4.9,
    reviewCount: 124,
    seller: { name: "Scent of Arabia", slug: "scent-of-arabia", avatar: "scent-of-arabia" },
    isHandmade: true,
    isTrending: true,
    xpReward: 5,
  },
  {
    id: "prd_2",
    title: "Rose Oud Mist - Premium Edition",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",
    priceFils: 28000,
    rating: 4.8,
    reviewCount: 89,
    seller: { name: "Scent of Arabia", slug: "scent-of-arabia", avatar: "scent-of-arabia" },
    isHandmade: true,
  },
  {
    id: "prd_3",
    title: "Traditional Arabic Calligraphy - Oud Theme",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
    priceFils: 35000,
    rating: 5.0,
    reviewCount: 32,
    seller: { name: "Calligraphy Dreams", slug: "calligraphy-dreams", avatar: "calligraphy" },
    isHandmade: true,
  },
  {
    id: "prd_4",
    title: "Oud Wood Home Diffuser Set",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400",
    priceFils: 22000,
    rating: 4.7,
    reviewCount: 56,
    seller: { name: "Home Essence", slug: "home-essence", avatar: "home-essence" },
  },
  {
    id: "prd_5",
    title: "Premium Oud Gift Collection",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400",
    priceFils: 85000,
    rating: 4.9,
    reviewCount: 45,
    seller: { name: "Scent of Arabia", slug: "scent-of-arabia", avatar: "scent-of-arabia" },
    isHandmade: true,
    xpReward: 10,
  },
  {
    id: "prd_6",
    title: "Amber & Musk Blend Perfume",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400",
    priceFils: 35000,
    rating: 4.6,
    reviewCount: 28,
    seller: { name: "Scent of Arabia", slug: "scent-of-arabia", avatar: "scent-of-arabia" },
  },
];

const RELATED_SHOPS = [
  { name: "Scent of Arabia", slug: "scent-of-arabia", avatar: "scent-of-arabia", productCount: 28, rating: 4.9 },
  { name: "Oud Masters", slug: "oud-masters", avatar: "oud-masters", productCount: 45, rating: 4.8 },
  { name: "Arabian Fragrances", slug: "arabian-fragrances", avatar: "arabian-fragrances", productCount: 32, rating: 4.7 },
];

const RELATED_SEARCHES = [
  "oud perfume",
  "arabian oud",
  "oud oil",
  "bakhoor",
  "oud gift set",
  "rose oud",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = React.useState(query);
  const [sortBy, setSortBy] = React.useState("relevance");
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(
      activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters, filter]
    );
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  return (
    <>
      {/* Search Header */}
      <section className="bg-gradient-to-b from-muted/50 to-transparent py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, shops, and more..."
                className="ps-12 pe-12 py-6 text-lg rounded-full border-2 focus:border-moulna-gold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-6">
            {/* Filters */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Categories</p>
                <div className="space-y-2">
                  {["Perfumes & Oud", "Home Décor", "Art", "Gifts"].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeFilters.includes(cat)}
                        onChange={() => toggleFilter(cat)}
                        className="rounded text-moulna-gold focus:ring-moulna-gold"
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Price Range</p>
                <div className="space-y-2">
                  {["Under AED 50", "AED 50 - 100", "AED 100 - 200", "Over AED 200"].map((range) => (
                    <label key={range} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeFilters.includes(range)}
                        onChange={() => toggleFilter(range)}
                        className="rounded text-moulna-gold focus:ring-moulna-gold"
                      />
                      <span className="text-sm">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Features</p>
                <div className="space-y-2">
                  {["Handmade", "Free Shipping", "On Sale", "XP Bonus"].map((feature) => (
                    <label key={feature} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeFilters.includes(feature)}
                        onChange={() => toggleFilter(feature)}
                        className="rounded text-moulna-gold focus:ring-moulna-gold"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setActiveFilters([])}>
                Clear All
              </Button>
            </Card>

            {/* Related Shops */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Store className="w-4 h-4" />
                Related Shops
              </h3>
              <div className="space-y-3">
                {RELATED_SHOPS.map((shop) => (
                  <Link
                    key={shop.slug}
                    href={`/shops/${shop.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <DiceBearAvatar seed={shop.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{shop.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{shop.productCount} products</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {shop.rating}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Related Searches */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Related Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {RELATED_SEARCHES.map((search) => (
                  <Link
                    key={search}
                    href={`/explore/search?q=${encodeURIComponent(search)}`}
                    className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {search}
                  </Link>
                ))}
              </div>
            </Card>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Results for &quot;{query || "oud"}&quot;
                </h1>
                <p className="text-sm text-muted-foreground">
                  {SEARCH_RESULTS.length} products found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter}
                    variant="outline"
                    className="flex items-center gap-1 pe-1"
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="p-0.5 rounded-full hover:bg-muted"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SEARCH_RESULTS.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/products/${product.id}`}>
                    <Card className="overflow-hidden group cursor-pointer h-full">
                      <div className="relative aspect-square overflow-hidden">
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
                            <Badge variant="outline" className="bg-white/90">Handmade</Badge>
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

                      <div className="p-4">
                        <Link
                          href={`/shops/${product.seller.slug}`}
                          className="flex items-center gap-2 mb-2 hover:text-moulna-gold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DiceBearAvatar seed={product.seller.avatar} size="xs" />
                          <span className="text-xs text-muted-foreground">
                            {product.seller.name}
                          </span>
                        </Link>
                        <h3 className="font-medium mb-2 line-clamp-2">
                          {product.title}
                        </h3>

                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>

                        <p className="text-lg font-bold text-moulna-gold">
                          {formatAED(product.priceFils)}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Results
              </Button>
            </div>

            {/* No Results State */}
            {SEARCH_RESULTS.length === 0 && (
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn&apos;t find any products matching &quot;{query}&quot;
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Try:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Checking your spelling</li>
                    <li>• Using more general terms</li>
                    <li>• Browsing our categories</li>
                  </ul>
                </div>
                <Button variant="gold" className="mt-6" asChild>
                  <Link href="/explore/categories">Browse Categories</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function SearchFallback() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <Loader2 className="w-8 h-8 mx-auto animate-spin text-moulna-gold" />
      <p className="text-muted-foreground mt-4">Loading search results...</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <React.Suspense fallback={<SearchFallback />}>
          <SearchContent />
        </React.Suspense>
      </main>

      <Footer />
    </div>
  );
}
