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
  Heart, Filter, ChevronRight, Building2, Loader2
} from "lucide-react";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";
import type { Shop, Product } from "@/lib/types";

const EMIRATES = [
  { id: "dubai", name: "Dubai", color: "from-blue-500 to-cyan-500" },
  { id: "abu-dhabi", name: "Abu Dhabi", color: "from-emerald-500 to-teal-500" },
  { id: "sharjah", name: "Sharjah", color: "from-purple-500 to-violet-500" },
  { id: "ajman", name: "Ajman", color: "from-orange-500 to-amber-500" },
  { id: "rak", name: "Ras Al Khaimah", color: "from-rose-500 to-pink-500" },
  { id: "fujairah", name: "Fujairah", color: "from-indigo-500 to-blue-500" },
  { id: "uaq", name: "Umm Al Quwain", color: "from-lime-500 to-green-500" },
];

// Helper: format price from fils to AED
function formatPrice(fils: number) {
  return (fils / 100).toFixed(fils % 100 === 0 ? 0 : 2);
}

export default function LocalPage() {
  const [selectedEmirate, setSelectedEmirate] = React.useState("dubai");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [shops, setShops] = React.useState<Shop[]>([]);
  const [shopCounts, setShopCounts] = React.useState<Record<string, number>>({});
  const [shopsTotal, setShopsTotal] = React.useState(0);
  const [isLoadingShops, setIsLoadingShops] = React.useState(true);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(true);

  // Fetch shops whenever selected emirate changes
  React.useEffect(() => {
    async function fetchShops() {
      setIsLoadingShops(true);
      try {
        const emirateData = EMIRATES.find((e) => e.id === selectedEmirate);
        const locationParam = emirateData ? emirateData.name : "Dubai";
        const params = new URLSearchParams({
          location: locationParam,
          limit: "10",
          sort: "popular",
        });
        if (searchQuery) {
          params.set("search", searchQuery);
        }
        const res = await fetch(`/api/shops?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setShops(data.shops || []);
          setShopsTotal(data.total || 0);
        }
      } catch (err) {
        console.error("Failed to fetch shops:", err);
      } finally {
        setIsLoadingShops(false);
      }
    }
    fetchShops();
  }, [selectedEmirate, searchQuery]);

  // Fetch shop counts per emirate on mount
  React.useEffect(() => {
    async function fetchEmirateShopCounts() {
      const counts: Record<string, number> = {};
      await Promise.all(
        EMIRATES.map(async (emirate) => {
          try {
            const res = await fetch(`/api/shops?location=${encodeURIComponent(emirate.name)}&limit=1`);
            if (res.ok) {
              const data = await res.json();
              counts[emirate.id] = data.total || 0;
            }
          } catch {
            counts[emirate.id] = 0;
          }
        })
      );
      setShopCounts(counts);
    }
    fetchEmirateShopCounts();
  }, []);

  // Fetch popular products for sidebar
  React.useEffect(() => {
    async function fetchProducts() {
      setIsLoadingProducts(true);
      try {
        const res = await fetch("/api/products?limit=4&sort=trending");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

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
                <p className="text-xs text-muted-foreground">
                  {shopCounts[emirate.id] !== undefined ? shopCounts[emirate.id] : "--"} shops
                </p>
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
                  Based on your selection: {EMIRATES.find((e) => e.id === selectedEmirate)?.name || "Dubai"}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 me-2" />
                Filter
              </Button>
            </div>

            {isLoadingShops ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-full bg-muted flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-1/3 bg-muted rounded" />
                        <div className="h-3 w-1/4 bg-muted rounded" />
                        <div className="h-3 w-2/3 bg-muted rounded" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : shops.length === 0 ? (
              <div className="text-center py-12">
                <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No shops found</h3>
                <p className="text-muted-foreground">
                  No shops found in {EMIRATES.find((e) => e.id === selectedEmirate)?.name || "this area"}.
                  Try another emirate or adjust your search.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {shops.map((shop, index) => (
                  <motion.div
                    key={shop.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "p-4 hover:shadow-lg transition-all",
                      index === 0 && "ring-2 ring-moulna-gold ring-offset-2"
                    )}>
                      <div className="flex gap-4">
                        <div className="relative">
                          <ShopAvatar avatarSeed={shop.avatarSeed || shop.slug} name={shop.name} size="lg" className="w-20 h-20" />
                          {index === 0 && (
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
                              <p className="text-sm text-muted-foreground">{shop.category || "General"}</p>
                            </div>
                            <Button size="icon" variant="ghost">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                            {shop.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-moulna-gold" />
                                {shop.location}
                              </span>
                            )}
                            {shop.isVerified && (
                              <Badge variant="default" className="bg-green-500">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {shop.responseTime && (
                                <>
                                  <Clock className="w-4 h-4" />
                                  Responds {shop.responseTime}
                                </>
                              )}
                              {shop.totalListings > 0 && (
                                <span className="ms-2">{shop.totalListings} listings</span>
                              )}
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
            )}

            {!isLoadingShops && shops.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Shops
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Local Products */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-moulna-gold" />
                Popular Local Products
              </h3>
              {isLoadingProducts ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 bg-muted rounded" />
                        <div className="h-3 w-1/2 bg-muted rounded" />
                        <div className="h-3 w-1/3 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products available yet.</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug || product.id}`} className="flex gap-3 group">
                      <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate group-hover:text-moulna-gold transition-colors">
                          {product.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{product.seller.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-sm">AED {formatPrice(product.priceFils)}</span>
                          {product.seller.location && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {product.seller.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/explore">View All Products</Link>
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
                Every deal with a local artisan helps support UAE&apos;s creative community and preserves traditional craftsmanship.
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
