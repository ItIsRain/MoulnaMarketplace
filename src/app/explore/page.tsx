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
import type { Product } from "@/lib/types";
import {
  Search, Grid3X3, List, ChevronDown,
  Heart, MessageCircle, Sparkles, MapPin, Filter, Loader2
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
}

const ALL_CATEGORY: CategoryItem = { id: "all", name: "All Products" };

const EMIRATES = ["All Emirates", "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

export default function ExplorePage() {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("trending");
  const [showHandmadeOnly, setShowHandmadeOnly] = React.useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 0]);
  const [selectedEmirate, setSelectedEmirate] = React.useState("All Emirates");
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const limit = 20;

  // Fetch categories from API
  React.useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.ok ? res.json() : { categories: [] })
      .then((data) => {
        const cats: CategoryItem[] = (data.categories || []).map((c: { name: string }) => ({
          id: c.name,
          name: c.name,
        }));
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  const fetchProducts = React.useCallback(async (reset = false) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("sort", sortBy);
    params.set("limit", String(limit));
    params.set("offset", String(reset ? 0 : offset));

    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (showHandmadeOnly) params.set("handmade", "true");
    if (showVerifiedOnly) params.set("verified", "true");
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] > 0) params.set("maxPrice", String(priceRange[1]));

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (res.ok) {
        if (reset) {
          setProducts(data.products);
          setOffset(data.products.length);
        } else {
          setProducts(prev => [...prev, ...data.products]);
          setOffset(prev => prev + data.products.length);
        }
        setTotal(data.total);
        setHasMore((reset ? data.products.length : offset + data.products.length) < data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [sortBy, selectedCategory, showHandmadeOnly, showVerifiedOnly, priceRange, offset]);

  // Reset and refetch when filters change
  React.useEffect(() => {
    setOffset(0);
    fetchProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, selectedCategory, showHandmadeOnly, showVerifiedOnly, priceRange]);

  // Load user's wishlist on mount
  React.useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.ok ? res.json() : { items: [] })
      .then((data) => {
        const ids = (data.items || []).map((i: { productId: string }) => i.productId);
        setWishlist(ids);
      })
      .catch(() => {});
  }, []);

  const toggleWishlist = async (productId: string) => {
    const isInWishlist = wishlist.includes(productId);
    // Optimistic update
    setWishlist(prev =>
      isInWishlist ? prev.filter(id => id !== productId) : [...prev, productId]
    );
    try {
      if (isInWishlist) {
        await fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      }
    } catch {
      // Revert on error
      setWishlist(prev =>
        isInWishlist ? [...prev, productId] : prev.filter(id => id !== productId)
      );
    }
  };

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
                <Link href="/explore/search" className="block">
                  <Input
                    placeholder="Search for products, shops, or categories..."
                    className="h-12 ps-12 bg-white/10 border-white/20 text-white placeholder:text-white/70 cursor-pointer"
                    readOnly
                  />
                  <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                </Link>
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
                    {[ALL_CATEGORY, ...categories].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          selectedCategory === cat.id
                            ? "bg-moulna-gold/10 text-moulna-gold font-semibold"
                            : "text-moulna-gold/80 hover:bg-moulna-gold/5 hover:text-moulna-gold"
                        )}
                      >
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
                        value={priceRange[0] > 0 ? priceRange[0] / 100 : ""}
                        onChange={(e) => setPriceRange([Number(e.target.value) * 100, priceRange[1]])}
                        className="h-9"
                      />
                      <span className="text-muted-foreground">&mdash;</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1] > 0 ? priceRange[1] / 100 : ""}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) * 100])}
                        className="h-9"
                      />
                    </div>
                    {(priceRange[0] > 0 || priceRange[1] > 0) && (
                      <p className="text-xs text-muted-foreground">
                        {priceRange[0] > 0 ? formatAED(priceRange[0]) : "Any"} - {priceRange[1] > 0 ? formatAED(priceRange[1]) : "Any"}
                      </p>
                    )}
                  </div>
                </Card>

                {/* Location */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Location</h3>
                  <div className="space-y-1">
                    {EMIRATES.slice(0, 5).map((emirate) => (
                      <button
                        key={emirate}
                        onClick={() => setSelectedEmirate(emirate)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors",
                          selectedEmirate === emirate && "bg-moulna-gold/10 text-moulna-gold font-medium"
                        )}
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
                      <input
                        type="checkbox"
                        checked={showVerifiedOnly}
                        onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-muted-foreground"
                      />
                      <span className="text-sm">Verified Sellers</span>
                    </label>
                  </div>
                </Card>

              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{total}</span> products found
                  </p>

                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
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

              {/* Mobile Filters */}
              {showMobileFilters && (
                <div className="lg:hidden mb-6 space-y-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-4">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {[ALL_CATEGORY, ...categories].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                            selectedCategory === cat.id
                              ? "bg-moulna-gold/10 text-moulna-gold font-semibold"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Filters</h3>
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
                        <input
                          type="checkbox"
                          checked={showVerifiedOnly}
                          onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                          className="w-4 h-4 rounded border-muted-foreground"
                        />
                        <span className="text-sm">Verified Sellers</span>
                      </label>
                    </div>
                  </Card>
                </div>
              )}

              {/* Loading State */}
              {loading && products.length === 0 ? (
                <div className="py-20 text-center">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
                </div>
              ) : products.length === 0 ? (
                <Card className="p-12 text-center">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No products found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or check back later
                  </p>
                </Card>
              ) : (
                <>
                  {/* Product Grid */}
                  <div className={cn(
                    "grid gap-6",
                    view === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  )}>
                    {products.map((product, index) => {
                      const discount = product.compareAtPriceFils
                        ? getDiscountPercentage(product.priceFils, product.compareAtPriceFils)
                        : 0;

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(index, 8) * 0.05 }}
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
                              view === "grid" ? "aspect-square" : "w-24 sm:w-32 lg:w-48 flex-shrink-0"
                            )}>
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

                              {/* Badges */}
                              <div className="absolute top-3 start-3 flex flex-col items-start gap-2">
                                {product.isSponsored && (
                                  <Badge variant="sponsored">Sponsored</Badge>
                                )}
                                {product.isTrending && (
                                  <Badge variant="trending">Trending</Badge>
                                )}
                                {product.isNew && (
                                  <Badge variant="new">New</Badge>
                                )}
                                {product.isHandmade && (
                                  <Badge variant="handmade">Handmade</Badge>
                                )}
                                {discount > 0 && (
                                  <Badge variant="default" className="bg-red-500">
                                    -{discount}%
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

                              {/* Quick Contact */}
                              <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="gold" size="sm" className="w-full" asChild>
                                  <Link href={`/products/${product.slug}`}>
                                    <MessageCircle className="w-4 h-4 me-2" />
                                    View Listing
                                  </Link>
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

                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="mt-12 text-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => fetchProducts(false)}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 me-2 animate-spin" />
                        ) : (
                          <ChevronDown className="w-4 h-4 me-2" />
                        )}
                        Load More Products
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {/* Recommended For You */}
        <RecommendedSection />
      </main>

      <Footer />
    </div>
  );
}

function RecommendedSection() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products/recommended?type=for_you&limit=8");
        const data = await res.json();
        if (res.ok && data.products) {
          setProducts(data.products);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-12 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-moulna-gold" />
          Recommended For You
        </h2>
        <Link href="/explore?sort=trending" className="text-sm text-moulna-gold hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card className="overflow-hidden group cursor-pointer h-full hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
                {product.isSponsored && (
                  <Badge variant="sponsored" className="absolute top-2 left-2 text-[10px]">Sponsored</Badge>
                )}
                {product.isTrending && (
                  <Badge variant="trending" className="absolute top-2 left-2 text-[10px]">Trending</Badge>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground truncate">{product.seller.name}</p>
                <h3 className="text-sm font-medium line-clamp-2 mt-0.5 group-hover:text-moulna-gold transition-colors">
                  {product.title}
                </h3>
                <p className="font-bold text-moulna-gold mt-1">{formatAED(product.priceFils)}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
