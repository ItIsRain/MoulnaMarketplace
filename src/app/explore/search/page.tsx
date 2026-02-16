"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/types";
import {
  Search, Filter, X, Heart, Sparkles,
  ArrowUpDown, TrendingUp, Loader2
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "trending", label: "Most Popular" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = React.useState(query);
  const [sortBy, setSortBy] = React.useState("newest");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [showHandmadeOnly, setShowHandmadeOnly] = React.useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = React.useState(false);

  const fetchResults = React.useCallback(async (q: string) => {
    if (!q.trim()) {
      setProducts([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams();
    params.set("search", q);
    params.set("sort", sortBy);
    params.set("limit", "30");
    if (showHandmadeOnly) params.set("handmade", "true");
    if (showVerifiedOnly) params.set("verified", "true");

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [sortBy, showHandmadeOnly, showVerifiedOnly]);

  // Fetch on mount with initial query
  React.useEffect(() => {
    if (query) fetchResults(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sortBy, showHandmadeOnly, showVerifiedOnly]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const activeFilters: string[] = [];
  if (showHandmadeOnly) activeFilters.push("Handmade");
  if (showVerifiedOnly) activeFilters.push("Verified Sellers");

  const removeFilter = (filter: string) => {
    if (filter === "Handmade") setShowHandmadeOnly(false);
    if (filter === "Verified Sellers") setShowVerifiedOnly(false);
  };

  return (
    <>
      {/* Search Header */}
      <section className="bg-gradient-to-b from-muted/50 to-transparent py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, shops, and more..."
                className="ps-12 pe-12 py-6 text-lg rounded-full border-2 focus:border-moulna-gold"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </form>
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

              {/* Features */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Features</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showHandmadeOnly}
                      onChange={(e) => setShowHandmadeOnly(e.target.checked)}
                      className="rounded text-moulna-gold focus:ring-moulna-gold"
                    />
                    <span className="text-sm">Handmade</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showVerifiedOnly}
                      onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                      className="rounded text-moulna-gold focus:ring-moulna-gold"
                    />
                    <span className="text-sm">Verified Sellers</span>
                  </label>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowHandmadeOnly(false);
                  setShowVerifiedOnly(false);
                }}
              >
                Clear All
              </Button>
            </Card>

            {/* Suggested Searches */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {["oud perfume", "calligraphy art", "handmade jewelry", "abaya", "bakhoor", "home decor"].map((search) => (
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
                  {query ? (
                    <>Results for &quot;{query}&quot;</>
                  ) : (
                    "Search Products"
                  )}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {total} products found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
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

            {/* Loading */}
            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-moulna-gold" />
                <p className="text-muted-foreground mt-4">Searching...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index, 8) * 0.05 }}
                    >
                      <Link href={`/products/${product.slug}`}>
                        <Card className="overflow-hidden group cursor-pointer h-full">
                          <div className="relative aspect-square overflow-hidden">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                                No image
                              </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-3 start-3 flex flex-col gap-1">
                              {product.isTrending && (
                                <Badge variant="trending">Trending</Badge>
                              )}
                              {product.isHandmade && (
                                <Badge variant="handmade">Handmade</Badge>
                              )}
                            </div>

                            {/* Wishlist */}
                            <button className="absolute top-3 end-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors">
                              <Heart className="w-4 h-4" />
                            </button>

                            {/* XP Reward */}
                            {product.xpReward > 0 && (
                              <div className="absolute bottom-3 end-3 flex items-center gap-1 px-2 py-1 rounded-full bg-moulna-gold text-white text-xs font-medium">
                                <Sparkles className="w-3 h-3" />
                                +{product.xpReward} XP
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">
                              {product.seller.name}
                            </p>
                            <h3 className="font-medium mb-2 line-clamp-2">
                              {product.title}
                            </h3>

                            <p className="text-lg font-bold text-moulna-gold">
                              {formatAED(product.priceFils)}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : query ? (
              /* No Results State */
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn&apos;t find any products matching &quot;{query}&quot;
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Try:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Checking your spelling</li>
                    <li>Using more general terms</li>
                    <li>Browsing our categories</li>
                  </ul>
                </div>
                <Button variant="gold" className="mt-6" asChild>
                  <Link href="/explore">Browse All Listings</Link>
                </Button>
              </Card>
            ) : (
              /* Empty initial state */
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">Search for products</h3>
                <p className="text-muted-foreground">
                  Enter a search term to find products across the marketplace
                </p>
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
