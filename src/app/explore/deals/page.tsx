"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap, Clock, Flame, Percent, Heart, MessageCircle,
  TrendingUp, Bell, Gift, ArrowRight, Loader2,
} from "lucide-react";

interface Deal {
  id: string;
  title: string;
  slug: string;
  priceFils: number;
  originalPriceFils: number;
  discount: number;
  category: string;
  image: string | null;
  inquiryCount: number;
  viewCount: number;
  shopId: string;
  shopName: string;
  createdAt: string;
}

interface CategoryOnSale {
  name: string;
  dealCount: number;
  maxDiscount: number;
}

const CATEGORY_GRADIENTS = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-red-500",
  "from-yellow-500 to-amber-500",
  "from-green-500 to-emerald-500",
  "from-indigo-500 to-violet-500",
  "from-rose-500 to-fuchsia-500",
  "from-teal-500 to-sky-500",
];

export default function DealsPage() {
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [categoriesOnSale, setCategoriesOnSale] = React.useState<CategoryOnSale[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch("/api/products/deals");
        if (!res.ok) throw new Error("Failed to fetch deals");
        const data = await res.json();
        setDeals(data.deals ?? []);
        setCategoriesOnSale(data.categoriesOnSale ?? []);
      } catch (err) {
        console.error("Error fetching deals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  // Flash sales: top 3 deals sorted by highest discount
  const flashDeals = [...deals]
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 3);

  // Daily deals: remaining deals after the top 3
  const flashDealIds = new Set(flashDeals.map((d) => d.id));
  const dailyDeals = deals.filter((d) => !flashDealIds.has(d.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-10 right-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-10 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl"
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-yellow-400 text-yellow-900 border-0">
              <Zap className="w-3 h-3 me-1" />
              Limited Time Offers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="flex items-center justify-center gap-3">
                <Flame className="w-12 h-12" />
                Hot Deals
                <Flame className="w-12 h-12" />
              </span>
            </h1>
            <p className="text-lg text-white/80 mb-6 max-w-xl mx-auto">
              Incredible discounts on authentic Arabian products.
              Don&apos;t miss out on these exclusive offers!
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-red-600 hover:bg-white/90">
                <Bell className="w-4 h-4 me-2" />
                Get Deal Alerts
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Gift className="w-4 h-4 me-2" />
                View All Deals
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-moulna-gold" />
            <p className="text-muted-foreground">Loading deals...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && deals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Gift className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No deals available right now</h2>
            <p className="text-muted-foreground">Check back soon!</p>
          </div>
        )}

        {/* Flash Sales */}
        {!loading && flashDeals.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Flash Sales
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Flame className="w-5 h-5 text-red-500" />
                    </motion.span>
                  </h2>
                  <p className="text-muted-foreground">Hurry! Limited quantities available</p>
                </div>
              </div>
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4 ms-2" />
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {flashDeals.map((deal, index) => {
                const popularity = Math.min((deal.inquiryCount / 100) * 100, 100);
                return (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-red-200 bg-gradient-to-b from-red-50 to-white">
                      <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50">
                        {deal.image ? (
                          <Image
                            src={deal.image}
                            alt={deal.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : null}
                        <Badge className="absolute top-3 left-3 bg-red-600 text-white z-10">
                          <Zap className="w-3 h-3 me-1" />
                          {deal.discount}% OFF
                        </Badge>
                        <Badge className="absolute top-3 right-12 bg-yellow-500 text-yellow-900 border-0 z-10">
                          Limited Time
                        </Badge>
                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center z-10">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">{deal.shopName}</span>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 me-1" />
                            Limited Time
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2">{deal.title}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl font-bold text-red-600">
                            {formatAED(deal.priceFils)}
                          </span>
                          <span className="text-muted-foreground line-through">
                            {formatAED(deal.originalPriceFils)}
                          </span>
                        </div>
                        {/* Popularity */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">
                              {deal.inquiryCount} inquiries
                            </span>
                            {popularity >= 50 && (
                              <span className="font-medium text-red-600">
                                High demand!
                              </span>
                            )}
                          </div>
                          <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${popularity}%` }}
                              className="h-full bg-red-600 rounded-full"
                            />
                          </div>
                        </div>
                        <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                          <Link href={`/products/${deal.slug}`}>
                            <MessageCircle className="w-4 h-4 me-2" />
                            Contact Seller
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Categories on Sale */}
        {!loading && categoriesOnSale.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Categories on Sale</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {categoriesOnSale.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/explore/categories/${category.name.toLowerCase()}`}>
                    <Card className={cn(
                      "p-6 cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br text-white",
                      CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length]
                    )}>
                      <Percent className="w-8 h-8 mb-3" />
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      <p className="text-white/80">Up to {category.maxDiscount}%</p>
                      <p className="text-white/80 text-sm mt-1">
                        {category.dealCount} {category.dealCount === 1 ? "deal" : "deals"}
                      </p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Daily Deals */}
        {!loading && dailyDeals.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Today&apos;s Best Deals</h2>
                  <p className="text-muted-foreground">Refreshed daily at midnight</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Updated daily
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50">
                      {deal.image ? (
                        <Image
                          src={deal.image}
                          alt={deal.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : null}
                      <Badge className="absolute top-3 left-3 bg-orange-500 text-white z-10">
                        -{deal.discount}%
                      </Badge>
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{deal.shopName}</span>
                        <span className="text-xs text-muted-foreground">{deal.category}</span>
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-moulna-gold transition-colors">
                        {deal.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-muted-foreground">
                          {deal.viewCount} views
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {deal.inquiryCount} inquiries
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold">
                            {formatAED(deal.priceFils)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through ms-2">
                            {formatAED(deal.originalPriceFils)}
                          </span>
                        </div>
                        <Button size="sm" className="bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
                          <Link href={`/products/${deal.slug}`}>
                            <MessageCircle className="w-4 h-4 me-1" />
                            Contact Seller
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Deal Alert CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-r from-moulna-charcoal to-slate-800 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-moulna-gold/20 flex items-center justify-center">
                <Bell className="w-10 h-10 text-moulna-gold" />
              </div>
              <div className="flex-1 text-center md:text-start">
                <h3 className="text-xl font-bold mb-2">Never Miss a Deal</h3>
                <p className="text-gray-300">
                  Get notified when your wishlist items go on sale or when we have exclusive flash sales.
                </p>
              </div>
              <Button size="lg" className="bg-moulna-gold hover:bg-moulna-gold-dark text-moulna-charcoal">
                Enable Deal Alerts
              </Button>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
