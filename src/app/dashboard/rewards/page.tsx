"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { XPBar } from "@/components/gamification/XPBar";
import { BadgeWithName } from "@/components/gamification/BadgeCard";
import { DailyChallengePanel } from "@/components/gamification/DailyChallenge";
import {
  Sparkles, Trophy, Star, Crown, Flame, Gift, Target,
  ChevronRight, Lock, Check, TrendingUp, Zap
} from "lucide-react";

// Mock data
const USER_STATS = {
  xp: 2450,
  level: 4,
  levelTitle: "Enthusiast",
  totalXPEarned: 3200,
  badgesEarned: 7,
  badgesTotal: 25,
  rank: 156,
  totalUsers: 5420,
};

const LEVELS = [
  { level: 1, title: "Newcomer", xpRequired: 0, color: "#94a3b8", unlocks: ["Basic avatar styles"] },
  { level: 2, title: "Explorer", xpRequired: 500, color: "#60a5fa", unlocks: ["Profile badge", "Exclusive coupons"] },
  { level: 3, title: "Regular", xpRequired: 1500, color: "#34d399", unlocks: ["Priority support", "New avatar styles"] },
  { level: 4, title: "Enthusiast", xpRequired: 3500, color: "#a78bfa", unlocks: ["Featured profile", "Early access"] },
  { level: 5, title: "Connoisseur", xpRequired: 7000, color: "#d4b86a", unlocks: ["Verified badge", "Premium avatars"] },
  { level: 6, title: "Trendsetter", xpRequired: 12000, color: "#c7a34d", unlocks: ["Priority visibility", "VIP support"] },
  { level: 7, title: "Tastemaker", xpRequired: 20000, color: "#a8863d", unlocks: ["Exclusive listings", "All avatars"] },
  { level: 8, title: "Elite", xpRequired: 35000, color: "#363e42", unlocks: ["Trusted member badge", "Personal curator"] },
  { level: 9, title: "Legend", xpRequired: 60000, color: "#e11d48", unlocks: ["Top of search results", "Invite-only events"] },
  { level: 10, title: "Patron", xpRequired: 100000, color: "#fbbf24", unlocks: ["Lifetime perks", "All rewards"] },
];

// Local badge type for rewards page (extends Badge with progress tracking)
interface RewardsBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "engagement" | "social" | "seller" | "streak" | "seasonal";
  xpReward: number;
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  target?: number;
}

const BADGES: RewardsBadge[] = [
  { id: "bdg_1", name: "First Inquiry", icon: "💬", description: "Contacted your first seller", category: "engagement", xpReward: 100, earned: true, earnedAt: "2024-01-15" },
  { id: "bdg_2", name: "Review Master", icon: "⭐", description: "Left 5 reviews", category: "social", xpReward: 200, earned: true, earnedAt: "2024-01-20" },
  { id: "bdg_3", name: "Social Butterfly", icon: "🦋", description: "Shared 10 listings", category: "social", xpReward: 150, earned: true, earnedAt: "2024-02-01" },
  { id: "bdg_4", name: "Week Warrior", icon: "🔥", description: "7-day login streak", category: "streak", xpReward: 100, earned: true, earnedAt: "2024-02-05" },
  { id: "bdg_5", name: "Listing Curator", icon: "❤️", description: "Saved 20 listings", category: "engagement", xpReward: 50, earned: true, earnedAt: "2024-02-08" },
  { id: "bdg_6", name: "Category Explorer", icon: "🗺️", description: "Browsed 5 different categories", category: "engagement", xpReward: 150, earned: true, earnedAt: "2024-02-10" },
  { id: "bdg_7", name: "Photo Reviewer", icon: "📸", description: "Added photos to 3 reviews", category: "social", xpReward: 150, earned: true, earnedAt: "2024-02-12" },
  { id: "bdg_8", name: "Monthly Master", icon: "📅", description: "30-day login streak", category: "streak", xpReward: 500, earned: false, progress: 7, target: 30 },
  { id: "bdg_9", name: "Super Explorer", icon: "💎", description: "Contact 50 different sellers", category: "engagement", xpReward: 500, earned: false, progress: 23, target: 50 },
  { id: "bdg_10", name: "Influencer", icon: "📣", description: "Referred 5 friends", category: "social", xpReward: 500, earned: false, progress: 1, target: 5 },
  { id: "bdg_11", name: "Top Reviewer", icon: "✍️", description: "Left 20 reviews", category: "social", xpReward: 300, earned: false, progress: 5, target: 20 },
  { id: "bdg_12", name: "Trendsetter", icon: "🌟", description: "Reach Level 6", category: "seasonal", xpReward: 500, earned: false },
];

const DAILY_CHALLENGES = [
  { id: "ch_1", task: "Browse 3 different categories", xp: 30, icon: "👀", completed: true },
  { id: "ch_2", task: "Save 2 listings", xp: 20, icon: "❤️", completed: false, progress: 1, target: 2 },
  { id: "ch_3", task: "Contact a seller about a listing", xp: 50, icon: "✍️", completed: false },
];

const XP_HISTORY = [
  { action: "Daily login", xp: 10, date: "Today" },
  { action: "Left a review", xp: 50, date: "Yesterday" },
  { action: "Contacted a seller", xp: 77, date: "Feb 10" },
  { action: "7-day streak bonus", xp: 100, date: "Feb 9" },
  { action: "Added to wishlist", xp: 5, date: "Feb 8" },
];

export default function RewardsPage() {
  const [activeTab, setActiveTab] = React.useState<"overview" | "badges" | "levels">("overview");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-moulna-gold" />
            Rewards Hub
          </h1>
          <p className="text-muted-foreground">
            Track your progress, earn badges, and unlock exclusive rewards
          </p>
        </div>
        <div className="text-end">
          <div className="flex items-center gap-2 text-moulna-gold">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-2xl">{USER_STATS.xp.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total XP</p>
        </div>
      </div>

      {/* XP Progress Card */}
      <Card className="p-6 bg-gradient-to-r from-moulna-gold/10 via-moulna-gold/5 to-transparent">
        <XPBar xp={USER_STATS.xp} showLabels />
      </Card>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-8">
          {[
            { id: "overview", label: "Overview", icon: Sparkles },
            { id: "badges", label: "Badges", icon: Trophy },
            { id: "levels", label: "Levels", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "pb-4 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                activeTab === tab.id
                  ? "border-moulna-gold text-moulna-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Current Level", value: USER_STATS.level, icon: Star, color: "text-moulna-gold" },
                { label: "Badges Earned", value: `${USER_STATS.badgesEarned}/${USER_STATS.badgesTotal}`, icon: Trophy, color: "text-yellow-500" },
                { label: "Global Rank", value: `#${USER_STATS.rank}`, icon: Crown, color: "text-purple-500" },
                { label: "Total XP", value: USER_STATS.totalXPEarned.toLocaleString(), icon: Sparkles, color: "text-moulna-gold" },
              ].map((stat, i) => (
                <Card key={stat.label} className="p-4">
                  <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>

            {/* Recent XP History */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-moulna-gold" />
                Recent XP Activity
              </h3>
              <div className="space-y-3">
                {XP_HISTORY.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-moulna-gold font-medium">
                      <Sparkles className="w-4 h-4" />
                      +{item.xp}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4" asChild>
                <Link href="/dashboard/rewards/history">
                  View Full History <ChevronRight className="w-4 h-4 ms-1" />
                </Link>
              </Button>
            </Card>

            {/* Featured Badges */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Your Badges
                </h3>
                <Button variant="link" onClick={() => setActiveTab("badges")}>
                  View All <ChevronRight className="w-4 h-4 ms-1" />
                </Button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                {BADGES.slice(0, 7).map((badge) => (
                  <BadgeWithName
                    key={badge.id}
                    badge={badge}
                    earned={badge.earned}
                    size="sm"
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <DailyChallengePanel challenges={DAILY_CHALLENGES} />

            {/* Next Rewards */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-moulna-gold" />
                Next Rewards
              </h3>
              <div className="space-y-4">
                {LEVELS.slice(USER_STATS.level, USER_STATS.level + 2).map((level) => (
                  <div key={level.level} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: level.color }}
                      >
                        {level.level}
                      </div>
                      <span className="font-medium">{level.title}</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {level.unlocks.map((unlock, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Lock className="w-3 h-3" />
                          {unlock}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "badges" && (
        <div className="space-y-8">
          {/* Earned Badges */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-500" />
              Earned Badges ({BADGES.filter(b => b.earned).length})
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
              {BADGES.filter(b => b.earned).map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <BadgeWithName badge={badge} earned size="md" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Locked Badges */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              Locked Badges ({BADGES.filter(b => !b.earned).length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BADGES.filter(b => !b.earned).map((badge) => (
                <Card key={badge.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl opacity-50">
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                      {badge.progress !== undefined && badge.target && (
                        <div className="space-y-1">
                          <Progress value={(badge.progress / badge.target) * 100} className="h-1.5" />
                          <p className="text-xs text-muted-foreground">
                            {badge.progress} / {badge.target}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-moulna-gold mt-2">
                        <Sparkles className="w-3 h-3" />
                        +{badge.xpReward} XP reward
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "levels" && (
        <div className="space-y-6">
          {LEVELS.map((level, i) => {
            const isCurrentLevel = level.level === USER_STATS.level;
            const isUnlocked = level.level <= USER_STATS.level;

            return (
              <Card
                key={level.level}
                className={cn(
                  "p-6 transition-all",
                  isCurrentLevel && "ring-2 ring-moulna-gold",
                  !isUnlocked && "opacity-60"
                )}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold",
                      !isUnlocked && "grayscale"
                    )}
                    style={{ backgroundColor: level.color }}
                  >
                    {isUnlocked ? level.level : <Lock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-xl font-semibold">{level.title}</h3>
                      {isCurrentLevel && (
                        <Badge variant="gold">Current Level</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {level.xpRequired.toLocaleString()} XP required
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {level.unlocks.map((unlock, j) => (
                        <div
                          key={j}
                          className={cn(
                            "flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium",
                            isUnlocked
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-500 text-white"
                          )}
                        >
                          {isUnlocked ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          {unlock}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
