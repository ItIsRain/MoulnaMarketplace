"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";
import {
  Search, Filter, Grid, List, Star, Heart, MessageCircle,
  SlidersHorizontal, X, MapPin, Store
} from "lucide-react";

const PRODUCTS = [
  {
    id: "1",
    name: "Premium Oud Collection Set",
    seller: "Arabian Scents Boutique",
    sellerAvatar: "arabian-scents",
    price: 450,
    originalPrice: 550,
    rating: 4.9,
    reviews: 156,
    category: "Oud",
    location: "Dubai",
  },
  {
    id: "2",
    name: "Arabian Nights Perfume 100ml",
    seller: "Emirates Artisan",
    sellerAvatar: "emirates-artisan",
    price: 320,
    rating: 4.8,
    reviews: 89,
    category: "Perfumes",
    location: "Abu Dhabi",
  },
  {
    id: "3",
    name: "Traditional Bakhoor Set",
    seller: "Dubai Crafts Co.",
    sellerAvatar: "dubai-crafts",
    price: 150,
    rating: 4.7,
    reviews: 234,
    category: "Bakhoor",
    location: "Dubai",
  },
  {
    id: "4",
    name: "Luxury Oud Chips 50g",
    seller: "Arabian Scents Boutique",
    sellerAvatar: "arabian-scents",
    price: 280,
    rating: 5.0,
    reviews: 67,
    category: "Oud",
    location: "Dubai",
  },
  {
    id: "5",
    name: "Gift Sampler Collection",
    seller: "Pearl Boutique",
    sellerAvatar: "pearl-boutique",
    price: 180,
    rating: 4.6,
    reviews: 112,
    category: "Gift Sets",
    location: "Sharjah",
  },
  {
    id: "6",
    name: "Rose Musk Perfume 50ml",
    seller: "Emirates Artisan",
    sellerAvatar: "emirates-artisan",
    price: 220,
    rating: 4.8,
    reviews: 78,
    category: "Perfumes",
    location: "Abu Dhabi",
  },
];

const FILTERS = {
  categories: ["All", "Oud", "Perfumes", "Bakhoor", "Gift Sets", "Handmade"],
  priceRanges: ["Any", "Under AED 100", "AED 100-300", "AED 300-500", "Over AED 500"],
  locations: ["All UAE", "Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
  sortOptions: [
    { value: "relevance", label: "Most Relevant" },
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ],
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = React.useState(query);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState("relevance");
  const [showFilters, setShowFilters] = React.useState(true);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Search Header */}
      <section className="py-6 bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products, sellers, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-12 h-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setShowMobileFilters(!showMobileFilters);
                } else {
                  setShowFilters(!showFilters);
                }
              }}
            >
              <SlidersHorizontal className="w-4 h-4 me-2" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">
              {query ? `Results for "${query}"` : "All Products"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {PRODUCTS.length} products found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              {FILTERS.sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="hidden md:flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-none",
                  viewMode === "grid" && "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
              >
                <Grid className="w-4 h-4" />
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

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="md:hidden mb-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.priceRanges.map((range) => (
                    <label key={range} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                      <input type="radio" name="price-mobile" className="rounded-full" />
                      <span>{range}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Location</h4>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.locations.map((location) => (
                    <label key={location} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{location}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setShowMobileFilters(false)}>
                Apply Filters
              </Button>
            </Card>
          </div>
        )}

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:block w-64 flex-shrink-0"
            >
              <Card className="p-4 sticky top-24">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Category</h4>
                  <div className="space-y-2">
                    {FILTERS.categories.map((category) => (
                      <label key={category} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Price Range</h4>
                  <div className="space-y-2">
                    {FILTERS.priceRanges.map((range) => (
                      <label key={range} className="flex items-center gap-2">
                        <input type="radio" name="price" className="rounded-full" />
                        <span className="text-sm">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Location</h4>
                  <div className="space-y-2">
                    {FILTERS.locations.map((location) => (
                      <label key={location} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Clear All
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              )}
            >
              {PRODUCTS.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {viewMode === "grid" ? (
                    <Card className="group overflow-hidden hover:shadow-lg transition-all">
                      <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50">
                        {product.originalPrice && (
                          <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <Link href={`/shops/${product.sellerAvatar}`} className="flex items-center gap-2 mb-2">
                          <ShopAvatar avatarSeed={product.sellerAvatar} name={product.seller} size="xs" />
                          <span className="text-xs text-muted-foreground hover:text-moulna-gold">
                            {product.seller}
                          </span>
                        </Link>
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-moulna-gold transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviews})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-lg">AED {product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through ms-2">
                                AED {product.originalPrice}
                              </span>
                            )}
                          </div>
                          <Button size="icon" variant="outline" className="rounded-full" asChild>
                            <Link href={`/products/${product.id}`}>
                              <MessageCircle className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="group p-4 hover:shadow-lg transition-all">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex-shrink-0">
                          {product.originalPrice && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                              Sale
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/shops/${product.sellerAvatar}`} className="flex items-center gap-2 mb-1">
                            <ShopAvatar avatarSeed={product.sellerAvatar} name={product.seller} size="xs" />
                            <span className="text-xs text-muted-foreground hover:text-moulna-gold">
                              {product.seller}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {product.location}
                            </span>
                          </Link>
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-medium group-hover:text-moulna-gold transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{product.category}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating}</span>
                              <span className="text-xs text-muted-foreground">
                                ({product.reviews})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <span className="font-bold text-lg">AED {product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through ms-2">
                                  AED {product.originalPrice}
                                </span>
                              )}
                            </div>
                            <Button size="sm" className="bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
                              <Link href={`/products/${product.id}`}>
                                <MessageCircle className="w-4 h-4 me-1" />
                                Contact Seller
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
