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
  Star, ChevronDown, ArrowUpDown
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";

const NEW_PRODUCTS = [
  {
    id: "1",
    name: "Premium Oud Collection Set",
    price: 450,
    originalPrice: 550,
    image: "/products/oud-set.jpg",
    shop: { name: "Arabian Scents", slug: "arabian-scents", avatar: "arabian-scents" },
    rating: 4.9,
    reviews: 12,
    addedAt: "2 hours ago",
    category: "Fragrances",
  },
  {
    id: "2",
    name: "Handwoven Silk Abaya",
    price: 890,
    image: "/products/silk-abaya.jpg",
    shop: { name: "Modest Elegance", slug: "modest-elegance", avatar: "modest-elegance" },
    rating: 5.0,
    reviews: 3,
    addedAt: "5 hours ago",
    category: "Fashion",
  },
  {
    id: "3",
    name: "Arabic Calligraphy Wall Art",
    price: 280,
    image: "/products/calligraphy.jpg",
    shop: { name: "Art of Arabia", slug: "art-of-arabia", avatar: "art-of-arabia" },
    rating: 4.8,
    reviews: 8,
    addedAt: "8 hours ago",
    category: "Home Décor",
  },
  {
    id: "4",
    name: "Traditional Dallah Coffee Pot",
    price: 175,
    image: "/products/dallah.jpg",
    shop: { name: "Heritage Crafts", slug: "heritage-crafts", avatar: "heritage-crafts" },
    rating: 4.7,
    reviews: 15,
    addedAt: "12 hours ago",
    category: "Home",
  },
  {
    id: "5",
    name: "Pearl & Gold Earrings",
    price: 320,
    image: "/products/earrings.jpg",
    shop: { name: "Gulf Jewels", slug: "gulf-jewels", avatar: "gulf-jewels" },
    rating: 4.9,
    reviews: 6,
    addedAt: "1 day ago",
    category: "Jewelry",
  },
  {
    id: "6",
    name: "Organic Saffron 10g",
    price: 85,
    image: "/products/saffron.jpg",
    shop: { name: "Spice Souq", slug: "spice-souq", avatar: "spice-souq" },
    rating: 5.0,
    reviews: 22,
    addedAt: "1 day ago",
    category: "Food",
  },
  {
    id: "7",
    name: "Hand-painted Ceramic Vase",
    price: 195,
    image: "/products/vase.jpg",
    shop: { name: "Pottery Palace", slug: "pottery-palace", avatar: "pottery-palace" },
    rating: 4.6,
    reviews: 9,
    addedAt: "2 days ago",
    category: "Home Décor",
  },
  {
    id: "8",
    name: "Embroidered Cushion Set",
    price: 240,
    image: "/products/cushions.jpg",
    shop: { name: "Desert Threads", slug: "desert-threads", avatar: "desert-threads" },
    rating: 4.8,
    reviews: 14,
    addedAt: "2 days ago",
    category: "Home",
  },
];

const CATEGORIES = [
  "All", "Fragrances", "Fashion", "Home Décor", "Jewelry", "Food", "Art", "Beauty"
];

export default function NewArrivalsPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("newest");

  const filteredProducts = NEW_PRODUCTS.filter(
    p => selectedCategory === "All" || p.category === selectedCategory
  );

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
                {NEW_PRODUCTS.length}+ new items this week
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
            {CATEGORIES.map((category) => (
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

        {/* Products Grid/List */}
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
                    <Badge className="absolute top-3 left-3 bg-moulna-gold text-white">
                      <Sparkles className="w-3 h-3 me-1" />
                      New
                    </Badge>
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4" />
                    </button>
                    {product.originalPrice && (
                      <Badge className="absolute bottom-3 left-3 bg-red-500 text-white">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <Link href={`/shops/${product.shop.slug}`} className="flex items-center gap-2 mb-2 group/shop">
                      <ShopAvatar avatarSeed={product.shop.avatar} name={product.shop.name} size="xs" />
                      <span className="text-xs text-muted-foreground group-hover/shop:text-moulna-gold transition-colors">
                        {product.shop.name}
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
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
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
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Added {product.addedAt}
                    </p>
                  </div>
                </Card>
              ) : (
                <Card className="group p-4 hover:shadow-lg transition-all">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex-shrink-0">
                      <Badge className="absolute top-2 left-2 bg-moulna-gold text-white text-xs">
                        New
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/shops/${product.shop.slug}`} className="flex items-center gap-2 mb-1">
                            <ShopAvatar avatarSeed={product.shop.avatar} name={product.shop.name} size="xs" />
                            <span className="text-xs text-muted-foreground hover:text-moulna-gold">
                              {product.shop.name}
                            </span>
                          </Link>
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-medium group-hover:text-moulna-gold transition-colors">
                              {product.name}
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
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                        <Badge variant="secondary">{product.category}</Badge>
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {product.addedAt}
                          </span>
                          <Button size="sm" className="bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
                            <Link href={`/products/${product.id}`}>
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More New Listings
          </Button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
