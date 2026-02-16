"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatAED, getDiscountPercentage } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/types";
import {
  Search, Filter, Grid3X3, List, Heart, MessageCircle,
  ChevronDown, Loader2
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function ShopProductsPage() {
  const params = useParams();
  const shopSlug = params.shopSlug as string;
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState("newest");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const limit = 20;

  const fetchProducts = React.useCallback(async (reset = false) => {
    setLoading(true);
    const p = new URLSearchParams();
    p.set("limit", String(limit));
    p.set("offset", String(reset ? 0 : offset));

    try {
      const res = await fetch(`/api/shops/${shopSlug}/products?${p}`);
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
  }, [shopSlug, offset]);

  React.useEffect(() => {
    setOffset(0);
    fetchProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  // Client-side search + sort filtering
  const filteredProducts = React.useMemo(() => {
    let result = products;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.priceFils - b.priceFils);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.priceFils - a.priceFils);
    }
    return result;
  }, [products, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Shop Header */}
      <section className="py-6 bg-white dark:bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold">Shop Products</h1>
              <p className="text-sm text-muted-foreground">{total} listings</p>
            </div>
            <div className="ms-auto">
              <Button variant="outline" asChild>
                <Link href={`/shops/${shopSlug}`}>View Shop</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-none",
                  viewMode === "grid" && "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-none",
                  viewMode === "list" && "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredProducts.length} products
        </p>

        {/* Loading */}
        {loading && products.length === 0 ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "This shop has no active listings"}
            </p>
          </div>
        ) : (
          <>
            {/* Products Grid/List */}
            <div className={cn(
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}>
              {filteredProducts.map((product, index) => {
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
                    {viewMode === "grid" ? (
                      <Card className="group overflow-hidden hover:shadow-lg transition-all">
                        <div className="relative aspect-square bg-muted">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                              No image
                            </div>
                          )}
                          {discount > 0 && (
                            <Badge className="absolute top-3 start-3 bg-red-500 text-white">
                              {discount}% OFF
                            </Badge>
                          )}
                          <button className="absolute top-3 end-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-4">
                          {product.category && (
                            <Badge variant="secondary" className="mb-2 text-xs">
                              {product.category}
                            </Badge>
                          )}
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-moulna-gold transition-colors">
                              {product.title}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-lg">{formatAED(product.priceFils)}</span>
                              {product.compareAtPriceFils && (
                                <span className="text-sm text-muted-foreground line-through ms-2">
                                  {formatAED(product.compareAtPriceFils)}
                                </span>
                              )}
                            </div>
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-full"
                              asChild
                            >
                              <Link href={`/products/${product.slug}`}>
                                <MessageCircle className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card className="group p-4 hover:shadow-lg transition-all">
                        <div className="flex gap-4">
                          <div className="relative w-32 h-32 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                No image
                              </div>
                            )}
                            {discount > 0 && (
                              <Badge className="absolute top-2 start-2 bg-red-500 text-white text-xs">
                                Sale
                              </Badge>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            {product.category && (
                              <Badge variant="secondary" className="mb-1 text-xs">
                                {product.category}
                              </Badge>
                            )}
                            <Link href={`/products/${product.slug}`}>
                              <h3 className="font-medium group-hover:text-moulna-gold transition-colors">
                                {product.title}
                              </h3>
                            </Link>
                            <div className="flex items-center justify-between mt-3">
                              <div>
                                <span className="font-bold text-lg">{formatAED(product.priceFils)}</span>
                                {product.compareAtPriceFils && (
                                  <span className="text-sm text-muted-foreground line-through ms-2">
                                    {formatAED(product.compareAtPriceFils)}
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                className="bg-moulna-gold hover:bg-moulna-gold-dark"
                                asChild
                              >
                                <Link href={`/products/${product.slug}`}>
                                  <MessageCircle className="w-4 h-4 me-1" />
                                  View Listing
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
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
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
