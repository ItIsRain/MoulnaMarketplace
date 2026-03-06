"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";
import type { Product } from "@/lib/types";
import {
  TrendingUp, Flame, Heart, Sparkles, Clock,
  ArrowUpRight, ChevronRight, ChevronDown, Zap, Loader2
} from "lucide-react";

interface TrendingShop {
  slug: string;
  name: string;
  avatar_seed?: string;
  avatar_style?: string;
  logo_url?: string;
  category?: string;
  total_listings: number;
}

export default function TrendingPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [shops, setShops] = React.useState<TrendingShop[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const limit = 10;

  const fetchProducts = React.useCallback(async (reset = false) => {
    const currentOffset = reset ? 0 : offset;
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(`/api/products?sort=trending&limit=${limit}&offset=${currentOffset}`);
      const data = await res.json();
      if (res.ok) {
        if (reset) {
          setProducts(data.products);
          setOffset(data.products.length);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
          setOffset((prev) => prev + data.products.length);
        }
        setHasMore((reset ? data.products.length : offset + data.products.length) < data.total);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [offset]);

  // Fetch trending shops
  const fetchShops = React.useCallback(async () => {
    try {
      const res = await fetch("/api/shops?sort=popular&limit=5");
      const data = await res.json();
      if (res.ok && data.shops) {
        setShops(data.shops);
      }
    } catch { /* ignore */ }
  }, []);

  React.useEffect(() => {
    fetchProducts(true);
    fetchShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 overflow-hidden bg-gradient-to-br from-orange-500/10 via-transparent to-rose-500/10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-2xl mx-auto">
              <Badge className="bg-gradient-to-r from-orange-500 to-rose-500 text-white mb-4">
                <Flame className="w-3 h-3 me-1" />
                Hot Right Now
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Trending on Moulna
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover what&apos;s popular right now. Products ranked by views,
                inquiries, and customer activity.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Trending Products */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-xl flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-moulna-gold" />
                  Trending Products
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Live
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
                </div>
              ) : products.length === 0 ? (
                <Card className="p-12 text-center">
                  <Flame className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No trending products yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Check back later as products gain more views and inquiries
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index, 8) * 0.05 }}
                    >
                      <Link href={`/products/${product.slug}`}>
                        <Card className="p-4 hover:shadow-lg transition-all hover:border-moulna-gold group">
                          <div className="flex gap-4">
                            {/* Rank */}
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0",
                              index === 0 && "bg-gradient-to-br from-yellow-400 to-orange-500 text-white",
                              index === 1 && "bg-gradient-to-br from-gray-300 to-gray-400 text-white",
                              index === 2 && "bg-gradient-to-br from-amber-600 to-amber-700 text-white",
                              index > 2 && "bg-muted text-muted-foreground"
                            )}>
                              {index + 1}
                            </div>

                            {/* Image */}
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                  No image
                                </div>
                              )}
                              {product.isSponsored && (
                                <Badge variant="sponsored" className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5">
                                  Ad
                                </Badge>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <ShopAvatar
                                  avatarSeed={product.seller.avatarSeed}
                                  avatarStyle={product.seller.avatarStyle}
                                  logoUrl={product.seller.logoUrl}
                                  name={product.seller.name}
                                  size="xs"
                                />
                                <span className="text-xs text-muted-foreground truncate">
                                  {product.seller.name}
                                </span>
                                {product.seller.isVerified && (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0">Verified</Badge>
                                )}
                              </div>
                              <h3 className="font-medium line-clamp-1 group-hover:text-moulna-gold transition-colors">
                                {product.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-lg font-bold text-moulna-gold">
                                  {formatAED(product.priceFils)}
                                </span>
                                {product.isHandmade && (
                                  <Badge variant="handmade" className="text-[10px]">Handmade</Badge>
                                )}
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="text-end shrink-0 hidden sm:block">
                              <div className="flex items-center gap-1 text-orange-500 mb-1">
                                <Flame className="w-4 h-4" />
                                <span className="font-bold text-sm">{product.viewCount}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {product.viewCount} views
                              </p>
                              {product.inquiryCount > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  {product.inquiryCount} inquiries
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="mt-8 text-center">
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
                    Load More Trending Products
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* Trending Shops */}
              {shops.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-moulna-gold" />
                    Popular Shops
                  </h3>
                  <div className="space-y-4">
                    {shops.map((shop, index) => (
                      <Link
                        key={shop.slug}
                        href={`/shops/${shop.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        <span className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          index === 0 && "bg-yellow-100 text-yellow-700",
                          index === 1 && "bg-gray-100 text-gray-700",
                          index === 2 && "bg-amber-100 text-amber-700",
                          index > 2 && "bg-muted text-muted-foreground"
                        )}>
                          {index + 1}
                        </span>
                        <ShopAvatar
                          avatarSeed={shop.avatar_seed}
                          avatarStyle={shop.avatar_style}
                          logoUrl={shop.logo_url}
                          name={shop.name}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate group-hover:text-moulna-gold transition-colors text-sm">
                            {shop.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {shop.total_listings} listings
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-moulna-gold transition-colors" />
                      </Link>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/explore">
                      Browse All
                      <ChevronRight className="w-4 h-4 ms-1" />
                    </Link>
                  </Button>
                </Card>
              )}

              {/* How Trending Works */}
              <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-transparent">
                <h3 className="font-semibold mb-3">How Trending Works</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our algorithm considers multiple factors to determine what&apos;s trending:
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-moulna-gold" />
                    Product views and engagement
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-moulna-gold" />
                    Customer inquiries
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-moulna-gold" />
                    Wishlist additions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-moulna-gold" />
                    Listing recency
                  </li>
                </ul>
              </Card>

              {/* XP Bonus */}
              <Card className="p-6 border-moulna-gold bg-moulna-gold/5">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6 text-moulna-gold" />
                  <h3 className="font-semibold">Bonus XP Alert!</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Inquire about any trending listing today and earn
                  <span className="font-bold text-moulna-gold"> 2x XP bonus</span>!
                </p>
                <Button variant="gold" className="w-full" asChild>
                  <Link href="/explore">
                    Browse Now
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
