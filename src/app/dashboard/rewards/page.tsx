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
import type { DailyChallenge } from "@/lib/types";
import {
  Sparkles, Trophy, Star, Crown, Flame, Gift, Target,
  ChevronRight, Lock, Check, TrendingUp, Zap, Loader2
} from "lucide-react";

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

// Badge definitions (config — always the same)
const BADGE_DEFS = [
  { id: "first_inquiry", name: "First Inquiry", icon: "💬", description: "Contacted your first seller", category: "engagement" as const, xpReward: 100 },
  { id: "week_warrior", name: "Week Warrior", icon: "🔥", description: "7-day login streak", category: "streak" as const, xpReward: 100 },
  { id: "listing_curator", name: "Listing Curator", icon: "❤️", description: "Saved 20 listings to wishlist", category: "engagement" as const, xpReward: 50 },
  { id: "category_explorer", name: "Category Explorer", icon: "🗺️", description: "Browsed 5 different categories", category: "engagement" as const, xpReward: 150 },
  { id: "monthly_master", name: "Monthly Master", icon: "📅", description: "30-day login streak", category: "streak" as const, xpReward: 500 },
  { id: "super_explorer", name: "Super Explorer", icon: "💎", description: "Contact 50 different sellers", category: "engagement" as const, xpReward: 500 },
  { id: "social_butterfly", name: "Social Butterfly", icon: "🦋", description: "Shared 10 listings", category: "social" as const, xpReward: 150 },
  { id: "influencer", name: "Influencer", icon: "📣", description: "Referred 5 friends", category: "social" as const, xpReward: 500 },
  { id: "trendsetter", name: "Trendsetter", icon: "🌟", description: "Reach Level 6", category: "seasonal" as const, xpReward: 500 },
];

interface XPEvent {
  id: string;
  amount: number;
  action: string;
  description: string | null;
  createdAt: string;
}

export default function RewardsPage() {
  const [activeTab, setActiveTab] = React.useState<"overview" | "badges" | "levels">("overview");
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({ xp: 0, level: 1, streakDays: 0, badgeCount: 0 });
  const [earnedBadgeIds, setEarnedBadgeIds] = React.useState<Set<string>>(new Set());
  const [recentXP, setRecentXP] = React.useState<XPEvent[]>([]);
  const [dailyChallenges, setDailyChallenges] = React.useState<DailyChallenge[]>([]);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/gamification").then((r) => r.ok ? r.json() : null),
      fetch("/api/gamification?section=badges").then((r) => r.ok ? r.json() : null),
      fetch("/api/gamification?section=history").then((r) => r.ok ? r.json() : null),
      fetch("/api/challenges?period=daily&audience=buyer").then((r) => r.ok ? r.json() : null),
    ])
      .then(([overview, badges, history, challengesData]) => {
        if (overview) {
          setStats({
            xp: overview.xp || 0,
            level: overview.level || 1,
            streakDays: overview.streakDays || 0,
            badgeCount: overview.badgeCount || 0,
          });
        }
        if (badges) {
          setEarnedBadgeIds(new Set((badges.badges || []).map((b: { badgeId: string }) => b.badgeId)));
        }
        if (history) {
          setRecentXP((history.events || []).slice(0, 5));
        }
        if (challengesData) {
          const mapped: DailyChallenge[] = (challengesData.challenges || []).map(
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
          setDailyChallenges(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const badges = BADGE_DEFS.map((def) => ({
    ...def,
    earned: earnedBadgeIds.has(def.id),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

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
            <span className="font-bold text-2xl">{stats.xp.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total XP</p>
        </div>
      </div>

      {/* XP Progress Card */}
      <Card className="p-6 bg-gradient-to-r from-moulna-gold/10 via-moulna-gold/5 to-transparent">
        <XPBar xp={stats.xp} showLabels />
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
                { label: "Current Level", value: stats.level, icon: Star, color: "text-moulna-gold" },
                { label: "Badges Earned", value: `${stats.badgeCount}/${BADGE_DEFS.length}`, icon: Trophy, color: "text-yellow-500" },
                { label: "Login Streak", value: `${stats.streakDays} days`, icon: Flame, color: "text-orange-500" },
                { label: "Total XP", value: stats.xp.toLocaleString(), icon: Sparkles, color: "text-moulna-gold" },
              ].map((stat) => (
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
                {recentXP.length > 0 ? (
                  recentXP.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-sm">{item.description || item.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-moulna-gold font-medium">
                        <Sparkles className="w-4 h-4" />
                        +{item.amount}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm py-2">
                    No XP activity yet. Start exploring to earn XP!
                  </p>
                )}
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
                {badges.slice(0, 7).map((badge) => (
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
            <DailyChallengePanel challenges={dailyChallenges} maxItems={3} />

            {/* Next Rewards */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-moulna-gold" />
                Next Rewards
              </h3>
              <div className="space-y-4">
                {LEVELS.slice(stats.level, stats.level + 2).map((level) => (
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
              Earned Badges ({badges.filter(b => b.earned).length})
            </h3>
            {badges.filter(b => b.earned).length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {badges.filter(b => b.earned).map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <BadgeWithName badge={badge} earned size="md" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No badges earned yet. Keep exploring!</p>
              </Card>
            )}
          </div>

          {/* Locked Badges */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              Locked Badges ({badges.filter(b => !b.earned).length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.filter(b => !b.earned).map((badge) => (
                <Card key={badge.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl opacity-50">
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
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
          {LEVELS.map((level) => {
            const isCurrentLevel = level.level === stats.level;
            const isUnlocked = level.level <= stats.level;

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
