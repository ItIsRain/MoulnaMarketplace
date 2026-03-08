"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatAED, getDiscountPercentage } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/types";
import {
  Search, Filter, Grid3X3, LayoutGrid,
  ChevronDown, Heart, ArrowUpDown, Loader2, MessageCircle
} from "lucide-react";
import { useTracking } from "@/hooks/useTracking";

// Slug-to-display metadata (descriptions & hero images for known categories)
const CATEGORY_DISPLAY: Record<string, { description: string; image: string }> = {
  "jewelry": {
    description: "Discover unique rings, necklaces, bracelets and earrings crafted by UAE's finest artisans",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200",
  },
  "perfumes-oud": {
    description: "Authentic Arabian fragrances, oud oils and bakhoor from traditional perfumers",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200",
  },
  "home-decor": {
    description: "Beautiful home accessories, vases, candles and decorative items",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200",
  },
  "arabic-calligraphy": {
    description: "Stunning Arabic calligraphy art, personalized pieces and traditional writing",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200",
  },
  "fashion-clothing": {
    description: "Handmade fashion, abayas, and clothing designed by local talent",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200",
  },
  "food-sweets": {
    description: "Artisan chocolates, traditional sweets and gourmet treats",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200",
  },
  "art-prints": {
    description: "Original artwork, prints and creative pieces from local artists",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200",
  },
  "baby-kids": {
    description: "Handmade toys, clothing and accessories for little ones",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200",
  },
};

const SORT_OPTIONS = [
  { value: "trending", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const display = CATEGORY_DISPLAY[slug];
  const { trackEvent } = useTracking();

  const [products, setProducts] = React.useState<Product[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"grid" | "compact">("grid");
  const [sortBy, setSortBy] = React.useState("trending");
  const [showHandmadeOnly, setShowHandmadeOnly] = React.useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = React.useState(false);
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  const [resolvedCategoryName, setResolvedCategoryName] = React.useState<string | null>(null);
  const limit = 20;

  // Resolve slug to real category name from API
  React.useEffect(() => {
    if (!slug) return;
    fetch("/api/categories")
      .then((res) => res.ok ? res.json() : { categories: [] })
      .then((data) => {
        const cats: { name: string; slug: string }[] = data.categories || [];
        const match = cats.find((c) => c.slug === slug);
        setResolvedCategoryName(match ? match.name : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
      })
      .catch(() => {
        setResolvedCategoryName(slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
      });
  }, [slug]);

  const categoryName = resolvedCategoryName || slug;

  const fetchProducts = React.useCallback(async (reset = false) => {
    const currentOffset = reset ? 0 : offset;
    if (reset) setLoading(true);
    else setLoadingMore(true);

    const params = new URLSearchParams();
    params.set("category", categoryName);
    params.set("sort", sortBy);
    params.set("limit", String(limit));
    params.set("offset", String(currentOffset));
    if (showHandmadeOnly) params.set("handmade", "true");
    if (showVerifiedOnly) params.set("verified", "true");
    if (minPrice) params.set("minPrice", String(Number(minPrice) * 100));
    if (maxPrice) params.set("maxPrice", String(Number(maxPrice) * 100));

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (res.ok) {
        if (reset) {
          setProducts(data.products);
          setOffset(data.products.length);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
          setOffset((prev) => prev + data.products.length);
        }
        setTotal(data.total);
        setHasMore((reset ? data.products.length : currentOffset + data.products.length) < data.total);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [categoryName, sortBy, showHandmadeOnly, showVerifiedOnly, minPrice, maxPrice, offset]);

  // Track category view
  React.useEffect(() => {
    if (slug) trackEvent("category_viewed", slug);
  }, [slug, trackEvent]);

  // Load wishlist
  React.useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.ok ? res.json() : { items: [] })
      .then((data) => {
        const ids = (data.items || []).map((i: { productId: string }) => i.productId);
        setWishlist(ids);
      })
      .catch(() => {});
  }, []);

  // Refetch when filters change (only after category name is resolved)
  React.useEffect(() => {
    if (!resolvedCategoryName) return;
    fetchProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedCategoryName, sortBy, showHandmadeOnly, showVerifiedOnly]);

  const toggleWishlist = async (productId: string) => {
    const isInWishlist = wishlist.includes(productId);
    setWishlist((prev) =>
      isInWishlist ? prev.filter((id) => id !== productId) : [...prev, productId]
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
      setWishlist((prev) =>
        isInWishlist ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
    }
  };

  const heroImage = display?.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200";
  const heroName = resolvedCategoryName || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const heroDescription = display?.description || `Browse ${heroName} products from UAE artisans`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-64 md:h-80">
          <Image src={heroImage} alt={heroName} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <nav className="flex items-center gap-2 text-sm text-white/70 mb-3">
                <Link href="/" className="hover:text-white">Home</Link>
                <span>/</span>
                <Link href="/explore/categories" className="hover:text-white">Categories</Link>
                <span>/</span>
                <span className="text-white">{heroName}</span>
              </nav>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                {heroName}
              </h1>
              <p className="text-white/80 max-w-xl">{heroDescription}</p>
            </div>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="w-4 h-4 me-2" />
                {showMobileFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Sidebar Filters */}
            <aside className={cn("lg:w-64 space-y-6", showMobileFilters ? "block" : "hidden lg:block")}>
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>

                {/* Price Range */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Price Range (AED)</p>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      className="text-sm"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      placeholder="Max"
                      type="number"
                      className="text-sm"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  {(minPrice || maxPrice) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => fetchProducts(true)}
                    >
                      Apply Price Filter
                    </Button>
                  )}
                </div>

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
                      <span className="text-sm">Handmade Only</span>
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
                    setMinPrice("");
                    setMaxPrice("");
                    setSortBy("trending");
                  }}
                >
                  Clear All Filters
                </Button>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{total}</span> products
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border-0 bg-transparent focus:ring-0"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
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

              {/* Loading / Empty / Products */}
              {loading ? (
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
                  <div className={cn(
                    "grid gap-6",
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
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
                          <Card className="overflow-hidden group cursor-pointer h-full">
                            <div className={cn(
                              "relative overflow-hidden",
                              viewMode === "grid" ? "aspect-square" : "aspect-[4/5]"
                            )}>
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
                              <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
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
                                  <Badge className="bg-red-500 text-white">
                                    -{discount}%
                                  </Badge>
                                )}
                              </div>

                              {/* Wishlist */}
                              <button
                                onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/50 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                              >
                                <Heart className={cn(
                                  "w-4 h-4",
                                  wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                                )} />
                              </button>

                              {/* Quick View */}
                              <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="gold" size="sm" className="w-full" asChild>
                                  <Link href={`/products/${product.slug}`}>
                                    <MessageCircle className="w-4 h-4 me-2" />
                                    View Listing
                                  </Link>
                                </Button>
                              </div>
                            </div>

                            <Link href={`/products/${product.slug}`}>
                              <div className={cn("p-4", viewMode === "compact" && "p-3")}>
                                <p className="text-xs text-muted-foreground mb-1">
                                  {product.seller.name}
                                </p>
                                <h3 className={cn(
                                  "font-medium mb-2 line-clamp-2",
                                  viewMode === "compact" && "text-sm"
                                )}>
                                  {product.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "font-bold text-moulna-gold",
                                    viewMode === "compact" ? "text-sm" : "text-lg"
                                  )}>
                                    {formatAED(product.priceFils)}
                                  </span>
                                  {product.compareAtPriceFils && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {formatAED(product.compareAtPriceFils)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
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
                        disabled={loadingMore}
                      >
                        {loadingMore ? (
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
