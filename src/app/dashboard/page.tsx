"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, timeAgo, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { XPBar } from "@/components/gamification/XPBar";
import { DailyChallengePanel } from "@/components/gamification/DailyChallenge";
import { StreakCard } from "@/components/gamification/StreakCounter";
import { useAuthStore } from "@/store/useAuthStore";
import {
  MessageSquare, Heart, Star, Trophy, Sparkles,
  ChevronRight, Check
} from "lucide-react";

// Mock data
const RECENT_CONVERSATIONS = [
  {
    id: "conv_1",
    seller: { name: "Scent of Arabia", avatar: "scent-arabia", level: 6 },
    listing: {
      title: "Arabian Oud Perfume - 100ml",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100",
    },
    lastMessage: "Yes, it's still available! I can meet in Dubai Marina tomorrow.",
    date: "2024-02-13T10:30:00Z",
    unread: true,
  },
  {
    id: "conv_2",
    seller: { name: "Gulf Gems", avatar: "gulf-gems", level: 5 },
    listing: {
      title: "Gold-Plated Pearl Earrings",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100",
    },
    lastMessage: "Thank you for your interest! The price for 2 sets would be AED 550.",
    date: "2024-02-12T15:20:00Z",
    unread: false,
  },
  {
    id: "conv_3",
    seller: { name: "Elegance UAE", avatar: "elegance-uae", level: 8 },
    listing: {
      title: "Embroidered Abaya with Gold Thread",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=100",
    },
    lastMessage: "I have size M and L available. Would you like to see it in person?",
    date: "2024-02-11T09:45:00Z",
    unread: false,
  },
];

const DAILY_CHALLENGES = [
  { id: "ch_1", task: "Browse 3 different categories", xp: 30, icon: "👀", completed: true },
  { id: "ch_2", task: "Save 2 items to your wishlist", xp: 20, icon: "❤️", completed: false, progress: 1, target: 2 },
  { id: "ch_3", task: "Contact a seller about a listing", xp: 50, icon: "💬", completed: false },
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
          { label: "Conversations", value: "12", icon: MessageSquare, color: "text-blue-500" },
          { label: "Saved Items", value: "8", icon: Heart, color: "text-red-500" },
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

          {/* Recent Conversations */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Recent Conversations</h2>
              <Link href="/dashboard/messages" className="text-sm text-moulna-gold hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {RECENT_CONVERSATIONS.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/dashboard/messages/${conv.id}`}
                  className="block"
                >
                  <div className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border hover:border-moulna-gold/50 transition-colors",
                    conv.unread && "border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10"
                  )}>
                    <DiceBearAvatar seed={conv.seller.avatar} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm">{conv.seller.name}</span>
                        <LevelBadge level={conv.seller.level} size="sm" />
                        {conv.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Re: {conv.listing.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                    <div className="text-end flex-shrink-0">
                      <p className="text-xs text-muted-foreground">{timeAgo(conv.date)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {RECENT_CONVERSATIONS.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No conversations yet</p>
                <Button variant="gold" asChild>
                  <Link href="/explore">Browse Listings</Link>
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
                <span>Contact a seller about a listing for +30 XP</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Leave a review for a seller for +100 XP</span>
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
