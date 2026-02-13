"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { XPBar } from "@/components/gamification/XPBar";
import { DailyChallengePanel } from "@/components/gamification/DailyChallenge";
import { StreakCard } from "@/components/gamification/StreakCounter";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Package, Heart, Star, Trophy, ArrowRight, Sparkles,
  ChevronRight, Clock, Truck, Check
} from "lucide-react";

// Mock data
const RECENT_ORDERS = [
  {
    id: "ord_1",
    status: "shipped",
    date: "Feb 10, 2024",
    total: 77000,
    items: [
      { title: "Arabian Oud Perfume", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100" },
    ],
    xpEarned: 77,
  },
  {
    id: "ord_2",
    status: "delivered",
    date: "Feb 5, 2024",
    total: 32000,
    items: [
      { title: "Pearl Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100" },
    ],
    xpEarned: 32,
  },
];

const DAILY_CHALLENGES = [
  { id: "ch_1", task: "Browse 3 different categories", xp: 30, icon: "👀", completed: true },
  { id: "ch_2", task: "Add 2 items to your wishlist", xp: 20, icon: "❤️", completed: false, progress: 1, target: 2 },
  { id: "ch_3", task: "Leave a review on a past order", xp: 50, icon: "✍️", completed: false },
];

const RECOMMENDED_PRODUCTS = [
  {
    id: "prd_1",
    title: "Handcrafted Ceramic Vase",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300",
    price: 45000,
    rating: 4.8,
  },
  {
    id: "prd_2",
    title: "Traditional Arabic Coffee Set",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300",
    price: 89000,
    rating: 4.9,
  },
  {
    id: "prd_3",
    title: "Embroidered Cushion Covers",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300",
    price: 35000,
    rating: 4.7,
  },
];

const STATUS_STYLES = {
  pending: { icon: Clock, variant: "pending" as const },
  shipped: { icon: Truck, variant: "shipped" as const },
  delivered: { icon: Check, variant: "delivered" as const },
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Mock user data
  const displayUser = user ?? {
    name: "Sarah",
    xp: 2450,
    level: 4,
    levelTitle: "Enthusiast",
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">
          Welcome back, {displayUser.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your account today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: "12", icon: Package, color: "text-blue-500" },
          { label: "Wishlist Items", value: "8", icon: Heart, color: "text-red-500" },
          { label: "Reviews Given", value: "5", icon: Star, color: "text-yellow-500" },
          { label: "Badges Earned", value: "7", icon: Trophy, color: "text-moulna-gold" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg bg-muted flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* XP Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Your Progress</h2>
              <Link href="/dashboard/rewards" className="text-sm text-moulna-gold hover:underline flex items-center gap-1">
                View Rewards <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <XPBar
              xp={displayUser.xp}
              showLabels
            />
          </Card>

          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Recent Orders</h2>
              <Link href="/dashboard/orders" className="text-sm text-moulna-gold hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {RECENT_ORDERS.map((order) => {
                const status = STATUS_STYLES[order.status as keyof typeof STATUS_STYLES];
                return (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders/${order.id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg border hover:border-moulna-gold/50 transition-colors">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={order.items[0].image}
                          alt={order.items[0].title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{order.items[0].title}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={status.variant} className="gap-1">
                            <status.icon className="w-3 h-3" />
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-moulna-gold font-semibold">
                            <Sparkles className="w-3 h-3" />
                            +{order.xpEarned} XP
                          </div>
                        </div>
                      </div>
                      <p className="font-bold">{formatAED(order.total)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {RECENT_ORDERS.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button variant="gold" asChild>
                  <Link href="/explore">Start Shopping</Link>
                </Button>
              </div>
            )}
          </Card>

          {/* Recommended Products */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Recommended for You</h2>
              <Link href="/explore" className="text-sm text-moulna-gold hover:underline flex items-center gap-1">
                Explore More <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {RECOMMENDED_PRODUCTS.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-sm font-medium line-clamp-1 group-hover:text-moulna-gold transition-colors">
                    {product.title}
                  </p>
                  <p className="text-sm font-bold">{formatAED(product.price)}</p>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Challenges */}
          <DailyChallengePanel challenges={DAILY_CHALLENGES} />

          {/* Streak Card */}
          <StreakCard
            loginStreak={7}
            purchaseStreak={2}
            reviewStreak={1}
          />

          {/* Level Up Tip */}
          <Card className="p-4 bg-gradient-to-br from-moulna-gold/10 to-transparent">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-moulna-gold" />
              Quick XP Tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Leave a photo review for +100 XP</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Share a product on social media for +20 XP</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Complete your profile for +200 XP</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
