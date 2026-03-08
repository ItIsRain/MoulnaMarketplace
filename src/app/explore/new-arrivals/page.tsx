"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Clock, Filter, Grid, List, Heart, MessageCircle,
  Star, ChevronDown, ArrowUpDown, Loader2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";
import type { Product } from "@/lib/types";

export default function NewArrivalsPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("newest");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products?sort=newest&limit=20");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Extract unique categories from fetched products
  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats).sort()];
  }, [products]);

  const filteredProducts = products.filter(
    (p) => selectedCategory === "All" || p.category === selectedCategory
  );

  // Helper: format time since creation
  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  // Helper: format price from fils to AED
  function formatPrice(fils: number) {
    return (fils / 100).toFixed(fils % 100 === 0 ? 0 : 2);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-moulna-charcoal via-moulna-charcoal/90 to-moulna-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 border-2 border-moulna-gold rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-10 -left-10 w-48 h-48 border border-moulna-gold rounded-full"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Badge className="mb-4 bg-moulna-gold/20 text-moulna-gold border-moulna-gold/30">
              <Sparkles className="w-3 h-3 me-1" />
              Fresh Additions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              New Listings
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Discover the latest additions to our marketplace.
              Fresh products from talented artisans, updated daily.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-moulna-gold/10 border border-moulna-gold/20 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-moulna-gold" />
                Updated every hour
              </div>
              <div className="flex items-center gap-2 bg-moulna-gold/10 border border-moulna-gold/20 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-moulna-gold" />
                {products.length}+ new items this week
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Categories */}
          <div className="flex-1 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  selectedCategory === category && "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* View & Sort Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort
              <ChevronDown className="w-3 h-3" />
            </Button>
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "rounded-none",
                  viewMode === "grid" && "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "rounded-none",
                  viewMode === "list" && "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className={cn(
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted" />
                    <div className="h-3 w-20 bg-muted rounded" />
                  </div>
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                  <div className="h-5 w-1/3 bg-muted rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {selectedCategory !== "All"
                ? `No new arrivals in "${selectedCategory}" yet. Try another category.`
                : "No new arrivals yet. Check back soon!"}
            </p>
          </div>
        ) : (
          /* Products Grid/List */
          <div className={cn(
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {viewMode === "grid" ? (
                  <Card className="group overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50">
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {product.isNew && (
                        <Badge className="absolute top-3 left-3 bg-moulna-gold text-white">
                          <Sparkles className="w-3 h-3 me-1" />
                          New
                        </Badge>
                      )}
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4" />
                      </button>
                      {product.compareAtPriceFils && product.compareAtPriceFils > product.priceFils && (
                        <Badge className="absolute bottom-3 left-3 bg-red-500 text-white">
                          {Math.round((1 - product.priceFils / product.compareAtPriceFils) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <Link href={`/shops/${product.seller.slug}`} className="flex items-center gap-2 mb-2 group/shop">
                        <ShopAvatar avatarSeed={product.seller.avatarSeed || product.seller.slug} name={product.seller.name} size="xs" />
                        <span className="text-xs text-muted-foreground group-hover/shop:text-moulna-gold transition-colors">
                          {product.seller.name}
                        </span>
                      </Link>
                      <Link href={`/products/${product.slug || product.id}`}>
                        <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-moulna-gold transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.viewCount > 0 ? "Popular" : "New"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-lg">AED {formatPrice(product.priceFils)}</span>
                          {product.compareAtPriceFils && product.compareAtPriceFils > product.priceFils && (
                            <span className="text-sm text-muted-foreground line-through ms-2">
                              AED {formatPrice(product.compareAtPriceFils)}
                            </span>
                          )}
                        </div>
                        <Button size="icon" variant="outline" className="rounded-full" asChild>
                          <Link href={`/products/${product.slug || product.id}`}>
                            <MessageCircle className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Added {timeAgo(product.createdAt)}
                      </p>
                    </div>
                  </Card>
                ) : (
                  <Card className="group p-4 hover:shadow-lg transition-all">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-32 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 overflow-hidden">
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {product.isNew && (
                          <Badge className="absolute top-2 left-2 bg-moulna-gold text-white text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link href={`/shops/${product.seller.slug}`} className="flex items-center gap-2 mb-1">
                              <ShopAvatar avatarSeed={product.seller.avatarSeed || product.seller.slug} name={product.seller.name} size="xs" />
                              <span className="text-xs text-muted-foreground hover:text-moulna-gold">
                                {product.seller.name}
                              </span>
                            </Link>
                            <Link href={`/products/${product.slug || product.id}`}>
                              <h3 className="font-medium group-hover:text-moulna-gold transition-colors">
                                {product.title}
                              </h3>
                            </Link>
                          </div>
                          <Button size="icon" variant="ghost">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{product.viewCount > 0 ? "Popular" : "New"}</span>
                          </div>
                          {product.category && (
                            <Badge variant="secondary">{product.category}</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <span className="font-bold text-lg">AED {formatPrice(product.priceFils)}</span>
                            {product.compareAtPriceFils && product.compareAtPriceFils > product.priceFils && (
                              <span className="text-sm text-muted-foreground line-through ms-2">
                                AED {formatPrice(product.compareAtPriceFils)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeAgo(product.createdAt)}
                            </span>
                            <Button size="sm" className="bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
                              <Link href={`/products/${product.slug || product.id}`}>
                                <MessageCircle className="w-4 h-4 me-1" />
                                Contact Seller
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More New Listings
            </Button>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}
