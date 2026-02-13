"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Trophy, Sparkles, Award, Target, Star, TrendingUp,
  Gift, Crown, Flame, ChevronRight, Lock, CheckCircle
} from "lucide-react";

const SELLER_PERKS = [
  { level: 1, perk: "Basic seller dashboard", unlocked: true },
  { level: 2, perk: "Custom shop banner", unlocked: true },
  { level: 3, perk: "Priority support", unlocked: true },
  { level: 4, perk: "Featured in category pages", unlocked: true },
  { level: 5, perk: "Lower commission rate (9%)", unlocked: true },
  { level: 6, perk: "Early access to new features", unlocked: true },
  { level: 7, perk: "Homepage spotlight eligibility", unlocked: true },
  { level: 8, perk: "Even lower commission (8%)", unlocked: true },
  { level: 9, perk: "Dedicated account manager", unlocked: false },
  { level: 10, perk: "Exclusive partner program", unlocked: false },
];

const SELLER_BADGES = [
  {
    id: "first-sale",
    name: "First Sale",
    description: "Made your first sale",
    icon: Star,
    earned: true,
    xp: 100,
  },
  {
    id: "top-seller",
    name: "Top Seller",
    description: "100+ orders completed",
    icon: Crown,
    earned: true,
    xp: 500,
  },
  {
    id: "fast-shipper",
    name: "Fast Shipper",
    description: "Ship 50 orders within 24 hours",
    icon: TrendingUp,
    earned: true,
    xp: 300,
  },
  {
    id: "5-star",
    name: "5-Star Rated",
    description: "Maintain 5-star average rating",
    icon: Star,
    earned: false,
    xp: 400,
    progress: { current: 4.8, total: 5 },
  },
  {
    id: "veteran",
    name: "Veteran Seller",
    description: "Active seller for 1 year",
    icon: Award,
    earned: false,
    xp: 1000,
    progress: { current: 8, total: 12 },
  },
];

const SELLER_CHALLENGES = [
  {
    id: "weekly-sales",
    title: "Weekly Sales Goal",
    description: "Complete 10 orders this week",
    xp: 200,
    progress: { current: 7, total: 10 },
    endsIn: "3 days",
  },
  {
    id: "review-response",
    title: "Responsive Seller",
    description: "Reply to all reviews within 24 hours",
    xp: 100,
    progress: { current: 5, total: 5 },
    completed: true,
  },
  {
    id: "new-products",
    title: "Fresh Inventory",
    description: "Add 5 new products this month",
    xp: 150,
    progress: { current: 3, total: 5 },
    endsIn: "12 days",
  },
];

const LEADERBOARD = [
  { rank: 1, name: "Heritage Jewels", xp: 15420, change: 0 },
  { rank: 2, name: "Oud Masters", xp: 14890, change: 1 },
  { rank: 3, name: "Scent of Arabia", xp: 14650, change: -1 },
  { rank: 4, name: "Calligraphy Dreams", xp: 12340, change: 2 },
  { rank: 5, name: "Desert Weaves", xp: 11980, change: 0 },
];

export default function SellerRewardsPage() {
  const sellerLevel = 8;
  const sellerXP = 4520;
  const xpToNextLevel = 5000;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-7 h-7 text-moulna-gold" />
              Seller Rewards
            </h1>
            <p className="text-muted-foreground">
              Level up your shop and unlock exclusive perks
            </p>
          </div>
        </div>

        {/* Level Overview */}
        <Card className="p-6 bg-gradient-to-r from-moulna-gold/10 to-purple-500/10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-moulna-gold to-yellow-600 flex items-center justify-center">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <LevelBadge level={sellerLevel} size="lg" showTitle />
                <Badge variant="secondary">
                  <Flame className="w-3 h-3 me-1" />
                  Top 5% Sellers
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {sellerLevel + 1}</span>
                  <span className="text-moulna-gold font-medium">
                    {sellerXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
                  </span>
                </div>
                <Progress value={(sellerXP / xpToNextLevel) * 100} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {(xpToNextLevel - sellerXP).toLocaleString()} XP until next level
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Challenges */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-moulna-gold" />
                  Seller Challenges
                </h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {SELLER_CHALLENGES.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      challenge.completed && "bg-green-50 border-green-200"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      <Badge variant={challenge.completed ? "default" : "secondary"}>
                        <Sparkles className="w-3 h-3 me-1" />
                        +{challenge.xp} XP
                      </Badge>
                    </div>
                    {!challenge.completed && (
                      <>
                        <Progress
                          value={(challenge.progress.current / challenge.progress.total) * 100}
                          className="h-2 mb-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{challenge.progress.current}/{challenge.progress.total}</span>
                          <span>Ends in {challenge.endsIn}</span>
                        </div>
                      </>
                    )}
                    {challenge.completed && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Challenge completed!
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Badges */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-moulna-gold" />
                  Seller Badges
                </h2>
                <Badge variant="secondary">
                  {SELLER_BADGES.filter(b => b.earned).length}/{SELLER_BADGES.length}
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {SELLER_BADGES.map((badge) => (
                  <div
                    key={badge.id}
                    className={cn(
                      "p-4 rounded-lg border flex items-start gap-3",
                      !badge.earned && "opacity-60"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      badge.earned ? "bg-moulna-gold text-white" : "bg-muted"
                    )}>
                      {badge.earned ? (
                        <badge.icon className="w-6 h-6" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      {badge.progress && !badge.earned && (
                        <div className="mt-2">
                          <Progress
                            value={(badge.progress.current / badge.progress.total) * 100}
                            className="h-1.5"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Perks */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-moulna-gold" />
                Level Perks
              </h2>
              <div className="space-y-3">
                {SELLER_PERKS.map((perk) => (
                  <div
                    key={perk.level}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg",
                      perk.unlocked ? "bg-green-50" : "bg-muted/50 opacity-60"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      perk.unlocked
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {perk.level}
                    </div>
                    <span className={cn(
                      "text-sm",
                      perk.unlocked ? "text-green-700" : "text-muted-foreground"
                    )}>
                      {perk.perk}
                    </span>
                    {perk.unlocked ? (
                      <CheckCircle className="w-4 h-4 text-green-500 ms-auto" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground ms-auto" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-moulna-gold" />
                  Top Sellers
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/seller/leaderboard">
                    View All
                    <ChevronRight className="w-4 h-4 ms-1" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-3">
                {LEADERBOARD.map((seller) => (
                  <div
                    key={seller.rank}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg",
                      seller.name === "Scent of Arabia" && "bg-moulna-gold/10 border border-moulna-gold/30"
                    )}
                  >
                    <span className={cn(
                      "w-6 text-center font-bold",
                      seller.rank <= 3 && "text-moulna-gold"
                    )}>
                      #{seller.rank}
                    </span>
                    <span className="flex-1 font-medium truncate">{seller.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {seller.xp.toLocaleString()} XP
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
}
