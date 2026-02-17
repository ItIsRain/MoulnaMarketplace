"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin, Search, Navigation, Store, Star, Clock,
  Heart, Filter, ChevronRight, Building2
} from "lucide-react";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";

const EMIRATES = [
  { id: "dubai", name: "Dubai", shops: 234, color: "from-blue-500 to-cyan-500" },
  { id: "abu-dhabi", name: "Abu Dhabi", shops: 156, color: "from-emerald-500 to-teal-500" },
  { id: "sharjah", name: "Sharjah", shops: 89, color: "from-purple-500 to-violet-500" },
  { id: "ajman", name: "Ajman", shops: 45, color: "from-orange-500 to-amber-500" },
  { id: "rak", name: "Ras Al Khaimah", shops: 32, color: "from-rose-500 to-pink-500" },
  { id: "fujairah", name: "Fujairah", shops: 28, color: "from-indigo-500 to-blue-500" },
  { id: "uaq", name: "Umm Al Quwain", shops: 18, color: "from-lime-500 to-green-500" },
];

const NEARBY_SHOPS = [
  {
    id: "1",
    name: "Arabian Scents Boutique",
    slug: "arabian-scents",
    category: "Fragrances",
    distance: "0.8 km",
    rating: 4.9,
    reviews: 234,
    location: "Al Barsha, Dubai",
    openNow: true,
    responseTime: "Within 1 hour",
    featured: true,
  },
  {
    id: "2",
    name: "Heritage Crafts",
    slug: "heritage-crafts",
    category: "Home Décor",
    distance: "1.2 km",
    rating: 4.8,
    reviews: 156,
    location: "Jumeirah, Dubai",
    openNow: true,
    responseTime: "Within 4 hours",
  },
  {
    id: "3",
    name: "Modest Elegance",
    slug: "modest-elegance",
    category: "Fashion",
    distance: "2.1 km",
    rating: 4.7,
    reviews: 189,
    location: "Dubai Mall, Dubai",
    openNow: true,
    responseTime: "Within 1 hour",
  },
  {
    id: "4",
    name: "Gulf Jewels",
    slug: "gulf-jewels",
    category: "Jewelry",
    distance: "2.5 km",
    rating: 4.9,
    reviews: 312,
    location: "Gold Souq, Dubai",
    openNow: false,
    responseTime: "Within 24 hours",
  },
  {
    id: "5",
    name: "Spice Souq Treasures",
    slug: "spice-souq",
    category: "Food & Spices",
    distance: "3.2 km",
    rating: 4.8,
    reviews: 445,
    location: "Deira, Dubai",
    openNow: true,
    responseTime: "Within 1 hour",
  },
];

const LOCAL_PRODUCTS = [
  {
    id: "1",
    name: "Dubai Honey Collection",
    price: 95,
    shop: "Local Harvest",
    distance: "1.5 km",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Handmade Camel Leather Bag",
    price: 450,
    shop: "Desert Artisans",
    distance: "2.3 km",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Arabic Coffee Blend",
    price: 65,
    shop: "Coffee Culture",
    distance: "0.9 km",
    rating: 5.0,
  },
  {
    id: "4",
    name: "Traditional Khanjar",
    price: 280,
    shop: "Heritage Crafts",
    distance: "1.2 km",
    rating: 4.7,
  },
];

export default function LocalPage() {
  const [selectedEmirate, setSelectedEmirate] = React.useState("dubai");
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-moulna-charcoal via-slate-800 to-moulna-charcoal text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/patterns/uae-map.svg')] bg-center bg-no-repeat opacity-5" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Badge className="mb-4 bg-moulna-gold/20 text-moulna-gold border-moulna-gold/30">
              <MapPin className="w-3 h-3 me-1" />
              Shop Local
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover
              <span className="text-moulna-gold"> Local </span>
              Treasures
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Support local UAE artisans and businesses.
              Find unique handcrafted products near you.
            </p>

            {/* Location Search */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search local shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Button size="lg" className="bg-moulna-gold hover:bg-moulna-gold-dark text-moulna-charcoal">
                <Navigation className="w-4 h-4 me-2" />
                Use My Location
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Emirates Selection */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Browse by Emirate</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {EMIRATES.map((emirate, index) => (
              <motion.button
                key={emirate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedEmirate(emirate.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  selectedEmirate === emirate.id
                    ? "border-moulna-gold bg-moulna-gold/10"
                    : "border-muted hover:border-moulna-gold/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full mx-auto mb-2 bg-gradient-to-br flex items-center justify-center",
                  emirate.color
                )}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <p className="font-medium text-sm">{emirate.name}</p>
                <p className="text-xs text-muted-foreground">{emirate.shops} shops</p>
              </motion.button>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Nearby Shops */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Shops Near You</h2>
                <p className="text-muted-foreground">
                  Based on your location in Dubai
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 me-2" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {NEARBY_SHOPS.map((shop, index) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "p-4 hover:shadow-lg transition-all",
                    shop.featured && "ring-2 ring-moulna-gold ring-offset-2"
                  )}>
                    <div className="flex gap-4">
                      <div className="relative">
                        <ShopAvatar avatarSeed={shop.slug} name={shop.name} size="lg" className="w-20 h-20" />
                        {shop.featured && (
                          <Badge className="absolute -top-2 -right-2 bg-moulna-gold text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link href={`/shops/${shop.slug}`}>
                              <h3 className="font-semibold hover:text-moulna-gold transition-colors">
                                {shop.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">{shop.category}</p>
                          </div>
                          <Button size="icon" variant="ghost">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-moulna-gold" />
                            {shop.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {shop.rating} ({shop.reviews})
                          </span>
                          <Badge variant={shop.openNow ? "default" : "secondary"} className={cn(
                            shop.openNow && "bg-green-500"
                          )}>
                            {shop.openNow ? "Open Now" : "Closed"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Responds {shop.responseTime}
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/shops/${shop.slug}`}>
                              Visit Shop
                              <ChevronRight className="w-4 h-4 ms-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Shops
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Local Products */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-moulna-gold" />
                Popular Local Products
              </h3>
              <div className="space-y-4">
                {LOCAL_PRODUCTS.map((product) => (
                  <div key={product.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">{product.shop}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-bold text-sm">AED {product.price}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {product.distance}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Products
              </Button>
            </Card>

            {/* Nearby Meetups */}
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Meet Nearby Sellers</h3>
                  <p className="text-sm text-muted-foreground">
                    Safe public meetup spots
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with local sellers near you and arrange safe meetups at public locations.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Browse Nearby Listings
              </Button>
            </Card>

            {/* Support Local */}
            <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-amber-50 border-moulna-gold/20">
              <h3 className="font-semibold mb-2">Support Local Artisans</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Every deal with a local artisan helps support UAE's creative community and preserves traditional craftsmanship.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-moulna-gold">500+</p>
                  <p className="text-xs text-muted-foreground">Local Artisans</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-moulna-gold">50K+</p>
                  <p className="text-xs text-muted-foreground">Listings Made in UAE</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
