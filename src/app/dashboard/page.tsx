"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import type { DailyChallenge } from "@/lib/types";
import {
  MessageSquare, Heart, Star, Trophy, Sparkles,
  ChevronRight, Check, Loader2
} from "lucide-react";

interface DashboardOverview {
  stats: {
    conversations: number;
    savedItems: number;
    reviewsGiven: number;
    badgesEarned: number;
  };
  recentConversations: {
    id: string;
    otherUser: {
      name: string;
      avatarSeed: string;
      avatarStyle: string;
      level: number;
    };
    product: string;
    lastMessage: string;
    updatedAt: string;
    unread: boolean;
  }[];
  recommendedProducts: {
    id: string;
    title: string;
    slug: string;
    priceFils: number;
    rating: number;
    image: string | null;
  }[];
  streaks: {
    login: number;
    purchase: number;
    review: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);

  // Fetch dashboard overview data
  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await fetch("/api/dashboard/overview");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard overview:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, []);

  // Fetch daily challenges from API
  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await fetch("/api/challenges?period=daily&audience=buyer");
        if (res.ok) {
          const json = await res.json();
          const mapped: DailyChallenge[] = (json.challenges ?? []).map(
            (c: { id: string; title: string; description: string; xp: number; icon: string; completed: boolean; progress?: number; target?: number }) => ({
              id: c.id,
              task: c.title,
              description: c.description,
              xp: c.xp,
              icon: c.icon,
              completed: c.completed,
              progress: c.progress,
              target: c.target,
            })
          );
          setChallenges(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch challenges:", err);
      }
    }
    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  const stats = data?.stats ?? { conversations: 0, savedItems: 0, reviewsGiven: 0, badgesEarned: 0 };
  const recentConversations = data?.recentConversations ?? [];
  const recommendedProducts = (data?.recommendedProducts ?? []).slice(0, 3);
  const streaks = data?.streaks ?? { login: 0, purchase: 0, review: 0 };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your account today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Conversations", value: String(stats.conversations), icon: MessageSquare, color: "text-blue-500" },
          { label: "Saved Items", value: String(stats.savedItems), icon: Heart, color: "text-red-500" },
          { label: "Reviews Given", value: String(stats.reviewsGiven), icon: Star, color: "text-yellow-500" },
          { label: "Badges Earned", value: String(stats.badgesEarned), icon: Trophy, color: "text-moulna-gold" },
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
              xp={user?.xp ?? 0}
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

            {recentConversations.length > 0 ? (
              <div className="space-y-4">
                {recentConversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/dashboard/messages/${conv.id}`}
                    className="block"
                  >
                    <div className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border hover:border-moulna-gold/50 transition-colors",
                      conv.unread && "border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10"
                    )}>
                      <DiceBearAvatar seed={conv.otherUser.avatarSeed} style={conv.otherUser.avatarStyle} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm">{conv.otherUser.name}</span>
                          <LevelBadge level={conv.otherUser.level} size="sm" />
                          {conv.unread && (
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Re: {conv.product}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {conv.lastMessage}
                        </p>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <p className="text-xs text-muted-foreground">{timeAgo(conv.updatedAt)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
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

            {recommendedProducts.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {recommendedProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group">
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-moulna-gold/20 to-moulna-gold/5 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-moulna-gold/40" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium line-clamp-1 group-hover:text-moulna-gold transition-colors">
                      {product.title}
                    </p>
                    <p className="text-sm font-bold">{formatAED(product.priceFils)}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No recommendations yet</p>
                <Button variant="gold" asChild>
                  <Link href="/explore">Start Exploring</Link>
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Challenges */}
          <DailyChallengePanel challenges={challenges} maxItems={3} />

          {/* Streak Card */}
          <StreakCard
            loginStreak={streaks.login}
            purchaseStreak={streaks.purchase}
            reviewStreak={streaks.review}
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
