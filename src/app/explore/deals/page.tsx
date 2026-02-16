"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap, Clock, Flame, Percent, Timer, Heart, MessageCircle,
  Star, TrendingUp, Bell, Gift, ArrowRight
} from "lucide-react";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";

const FLASH_DEALS = [
  {
    id: "1",
    name: "Royal Oud Perfume 100ml",
    price: 199,
    originalPrice: 399,
    image: "/products/oud.jpg",
    shop: "Arabian Scents",
    inquiries: 45,
    viewCount: 230,
    endsIn: 3600 * 2, // 2 hours
  },
  {
    id: "2",
    name: "Handwoven Prayer Mat",
    price: 89,
    originalPrice: 149,
    image: "/products/prayer-mat.jpg",
    shop: "Heritage Weaves",
    inquiries: 78,
    viewCount: 450,
    endsIn: 3600 * 4, // 4 hours
  },
  {
    id: "3",
    name: "Arabic Coffee Set",
    price: 120,
    originalPrice: 220,
    image: "/products/coffee-set.jpg",
    shop: "Desert Crafts",
    inquiries: 32,
    viewCount: 180,
    endsIn: 3600 * 6, // 6 hours
  },
];

const DAILY_DEALS = [
  {
    id: "4",
    name: "Bakhoor Incense Collection",
    price: 75,
    originalPrice: 120,
    discount: 38,
    rating: 4.8,
    reviews: 156,
  },
  {
    id: "5",
    name: "Embroidered Kaftan",
    price: 350,
    originalPrice: 500,
    discount: 30,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "6",
    name: "Saffron Gift Box",
    price: 65,
    originalPrice: 95,
    discount: 32,
    rating: 5.0,
    reviews: 234,
  },
  {
    id: "7",
    name: "Pearl Necklace Set",
    price: 280,
    originalPrice: 400,
    discount: 30,
    rating: 4.7,
    reviews: 67,
  },
  {
    id: "8",
    name: "Traditional Lantern",
    price: 95,
    originalPrice: 140,
    discount: 32,
    rating: 4.6,
    reviews: 112,
  },
  {
    id: "9",
    name: "Arabic Calligraphy Set",
    price: 55,
    originalPrice: 85,
    discount: 35,
    rating: 4.8,
    reviews: 78,
  },
];

const CATEGORIES_ON_SALE = [
  { name: "Fragrances", discount: "Up to 50%", color: "from-purple-500 to-pink-500" },
  { name: "Fashion", discount: "Up to 40%", color: "from-blue-500 to-cyan-500" },
  { name: "Home Décor", discount: "Up to 35%", color: "from-orange-500 to-red-500" },
  { name: "Jewelry", discount: "Up to 30%", color: "from-yellow-500 to-amber-500" },
];

function CountdownTimer({ seconds }: { seconds: number }) {
  const [timeLeft, setTimeLeft] = React.useState(seconds);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex items-center gap-1 text-sm font-mono">
      <span className="bg-red-600 text-white px-2 py-1 rounded">
        {hours.toString().padStart(2, "0")}
      </span>
      <span className="text-red-600">:</span>
      <span className="bg-red-600 text-white px-2 py-1 rounded">
        {minutes.toString().padStart(2, "0")}
      </span>
      <span className="text-red-600">:</span>
      <span className="bg-red-600 text-white px-2 py-1 rounded">
        {secs.toString().padStart(2, "0")}
      </span>
    </div>
  );
}

export default function DealsPage() {
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
              Don't miss out on these exclusive offers!
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
        {/* Flash Sales */}
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
                    🔥
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
            {FLASH_DEALS.map((deal, index) => {
              const popularity = Math.min((deal.inquiries / 100) * 100, 100);
              return (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-red-200 bg-gradient-to-b from-red-50 to-white">
                    <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50">
                      <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                        <Zap className="w-3 h-3 me-1" />
                        {Math.round((1 - deal.price / deal.originalPrice) * 100)}% OFF
                      </Badge>
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">{deal.shop}</span>
                        <CountdownTimer seconds={deal.endsIn} />
                      </div>
                      <h3 className="font-semibold mb-2">{deal.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-red-600">AED {deal.price}</span>
                        <span className="text-muted-foreground line-through">AED {deal.originalPrice}</span>
                      </div>
                      {/* Popularity */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            {deal.inquiries} inquiries
                          </span>
                          <span className="font-medium text-red-600">
                            High demand!
                          </span>
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
                        <Link href={`/products/${deal.id}`}>
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

        {/* Categories on Sale */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Categories on Sale</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {CATEGORIES_ON_SALE.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/categories/${category.name.toLowerCase()}`}>
                  <Card className={cn(
                    "p-6 cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br text-white",
                    category.color
                  )}>
                    <Percent className="w-8 h-8 mb-3" />
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <p className="text-white/80">{category.discount}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Deals */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Today's Best Deals</h2>
                <p className="text-muted-foreground">Refreshed daily at midnight</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Ends in 14:32:45
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAILY_DEALS.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50">
                    <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                      -{deal.discount}%
                    </Badge>
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-moulna-gold transition-colors">
                      {deal.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{deal.rating}</span>
                      <span className="text-xs text-muted-foreground">({deal.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold">AED {deal.price}</span>
                        <span className="text-sm text-muted-foreground line-through ms-2">
                          AED {deal.originalPrice}
                        </span>
                      </div>
                      <Button size="sm" className="bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
                        <Link href={`/products/${deal.id}`}>
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
