"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Search, Filter, Grid, List, Star, Heart, ShoppingCart,
  SlidersHorizontal, ChevronDown, ArrowUpDown
} from "lucide-react";

const SHOP_DATA = {
  name: "Arabian Scents Boutique",
  slug: "arabian-scents",
  avatar: "arabian-scents",
  productCount: 45,
  rating: 4.9,
  verified: true,
};

const PRODUCTS = [
  {
    id: "1",
    name: "Premium Oud Collection Set",
    price: 450,
    originalPrice: 550,
    image: "/products/oud-set.jpg",
    rating: 4.9,
    reviews: 156,
    category: "Oud",
    inStock: true,
  },
  {
    id: "2",
    name: "Arabian Nights Perfume 100ml",
    price: 320,
    image: "/products/perfume.jpg",
    rating: 4.8,
    reviews: 89,
    category: "Perfumes",
    inStock: true,
  },
  {
    id: "3",
    name: "Traditional Bakhoor Set",
    price: 150,
    image: "/products/bakhoor.jpg",
    rating: 4.7,
    reviews: 234,
    category: "Bakhoor",
    inStock: true,
  },
  {
    id: "4",
    name: "Luxury Oud Chips 50g",
    price: 280,
    image: "/products/oud-chips.jpg",
    rating: 5.0,
    reviews: 67,
    category: "Oud",
    inStock: true,
  },
  {
    id: "5",
    name: "Gift Sampler Collection",
    price: 180,
    image: "/products/sampler.jpg",
    rating: 4.6,
    reviews: 112,
    category: "Gift Sets",
    inStock: true,
  },
  {
    id: "6",
    name: "Rose Musk Perfume 50ml",
    price: 220,
    image: "/products/rose-musk.jpg",
    rating: 4.8,
    reviews: 78,
    category: "Perfumes",
    inStock: false,
  },
];

const CATEGORIES = ["All", "Oud", "Perfumes", "Bakhoor", "Gift Sets"];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function ShopProductsPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState("popular");

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Shop Header */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <DiceBearAvatar seed={SHOP_DATA.avatar} size="lg" className="w-16 h-16" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{SHOP_DATA.name}</h1>
                {SHOP_DATA.verified && (
                  <Badge className="bg-blue-100 text-blue-700">Verified</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {SHOP_DATA.rating}
                </span>
                <span>{SHOP_DATA.productCount} Products</span>
              </div>
            </div>
            <div className="ms-auto flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/shops/${params.shopSlug}`}>View Shop</Link>
              </Button>
              <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
                <Heart className="w-4 h-4 me-2" />
                Follow
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="p-4 sticky top-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "block w-full text-start px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedCategory === category
                          ? "bg-moulna-gold/10 text-moulna-gold font-medium"
                          : "hover:bg-muted"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="flex items-center gap-2">
                  <Input placeholder="Min" type="number" className="w-full" />
                  <span>-</span>
                  <Input placeholder="Max" type="number" className="w-full" />
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Availability</h4>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">In Stock Only</span>
                </label>
              </div>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
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

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredProducts.length} products
            </p>

            {/* Products Grid/List */}
            <div className={cn(
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                        {product.originalPrice && (
                          <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                        {!product.inStock && (
                          <Badge className="absolute top-3 left-3 bg-gray-500 text-white">
                            Out of Stock
                          </Badge>
                        )}
                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {product.category}
                        </Badge>
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
                          <Button
                            size="icon"
                            variant="outline"
                            disabled={!product.inStock}
                            className="rounded-full"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="group p-4 hover:shadow-lg transition-all">
                      <div className="flex gap-4">
                        <div className="relative w-32 h-32 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex-shrink-0">
                          {product.originalPrice && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                              Sale
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="secondary" className="mb-1 text-xs">
                            {product.category}
                          </Badge>
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-medium group-hover:text-moulna-gold transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-2">
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
                            <Button
                              size="sm"
                              disabled={!product.inStock}
                              className="bg-moulna-gold hover:bg-moulna-gold-dark"
                            >
                              <ShoppingCart className="w-4 h-4 me-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No products found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
