"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { XPBar } from "@/components/gamification/XPBar";
import { getLevelFromXP } from "@/lib/utils";
import {
  Trophy, Sparkles, Award, Target, Star, TrendingUp,
  Gift, Crown, Flame, ChevronRight, Lock, CheckCircle, Loader2
} from "lucide-react";

const SELLER_PERKS = [
  { level: 1, perk: "Basic seller dashboard" },
  { level: 2, perk: "Custom shop banner" },
  { level: 3, perk: "Priority support" },
  { level: 4, perk: "Featured in category pages" },
  { level: 5, perk: "5 free listing boosts per month" },
  { level: 6, perk: "Early access to new features" },
  { level: 7, perk: "Homepage spotlight eligibility" },
  { level: 8, perk: "10 free listing boosts per month" },
  { level: 9, perk: "Dedicated account manager" },
  { level: 10, perk: "Exclusive partner program" },
];

const SELLER_BADGE_DEFS = [
  { id: "first_listing", name: "First Listing", description: "Published your first product", icon: Star, xp: 50 },
  { id: "first_sale", name: "First Sale", description: "Made your first sale", icon: Star, xp: 100 },
  { id: "top_seller", name: "Top Seller", description: "100+ deals completed", icon: Crown, xp: 500 },
  { id: "fast_responder", name: "Fast Responder", description: "Reply to 50 inquiries within 1 hour", icon: TrendingUp, xp: 300 },
  { id: "veteran_seller", name: "Veteran Seller", description: "Active seller for 1 year", icon: Award, xp: 1000 },
];

interface SellerChallenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  target: number;
  progress: number;
  period: string;
  completed: boolean;
}

function getChallengeEndsIn(period: string): string {
  const now = new Date();
  if (period === "weekly") {
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
    return `${daysUntilSunday} day${daysUntilSunday !== 1 ? "s" : ""}`;
  }
  if (period === "monthly") {
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeft = lastDay - now.getDate();
    return `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
  }
  if (period === "onboarding" || period === "special") {
    return "No expiry";
  }
  return period;
}

export default function SellerRewardsPage() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({ xp: 0, level: 1, streakDays: 0, badgeCount: 0 });
  const [earnedBadgeIds, setEarnedBadgeIds] = React.useState<Set<string>>(new Set());
  const [sellerChallenges, setSellerChallenges] = React.useState<SellerChallenge[]>([]);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/gamification").then((r) => r.ok ? r.json() : null),
      fetch("/api/gamification?section=badges").then((r) => r.ok ? r.json() : null),
      fetch("/api/challenges?audience=seller").then((r) => r.ok ? r.json() : null),
    ])
      .then(([overview, badges, challengesData]) => {
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
        if (challengesData?.challenges) {
          const mapped: SellerChallenge[] = challengesData.challenges.map(
            (c: { id: string; title: string; description: string; xp: number; target: number; progress: number; period: string; completed: boolean }) => ({
              id: c.id,
              title: c.title,
              description: c.description,
              xp: c.xp,
              target: c.target,
              progress: c.progress,
              period: c.period,
              completed: c.completed,
            })
          );
          setSellerChallenges(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const levelInfo = getLevelFromXP(stats.xp);
  const sellerBadges = SELLER_BADGE_DEFS.map((def) => ({
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-7 h-7 text-moulna-gold" />
            Seller Progress
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
              <LevelBadge level={stats.level} size="lg" showTitle />
              {stats.streakDays >= 7 && (
                <Badge variant="secondary">
                  <Flame className="w-3 h-3 me-1" />
                  {stats.streakDays}-day streak
                </Badge>
              )}
            </div>
            <XPBar xp={stats.xp} showLabels />
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
            </div>
            <div className="space-y-4">
              {sellerChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    challenge.completed && "bg-green-50/50 border-green-200"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      {challenge.completed && (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <h3 className="font-medium">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                    </div>
                    <Badge variant={challenge.completed ? "default" : "secondary"} className={cn(challenge.completed && "bg-green-600")}>
                      <Sparkles className="w-3 h-3 me-1" />
                      +{challenge.xp} XP
                    </Badge>
                  </div>
                  {challenge.completed ? (
                    <p className="text-sm text-green-600 font-medium">
                      Earned
                    </p>
                  ) : (
                    <>
                      <Progress
                        value={challenge.target > 0 ? (challenge.progress / challenge.target) * 100 : 0}
                        className="h-2 mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{challenge.progress}/{challenge.target}</span>
                        <span>{getChallengeEndsIn(challenge.period)}</span>
                      </div>
                    </>
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
                {sellerBadges.filter(b => b.earned).length}/{sellerBadges.length}
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {sellerBadges.map((badge) => (
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
              {SELLER_PERKS.map((perk) => {
                const unlocked = perk.level <= stats.level;
                return (
                  <div
                    key={perk.level}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg",
                      unlocked ? "bg-green-50 dark:bg-green-950/20" : "bg-muted/50 opacity-60"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      unlocked
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {perk.level}
                    </div>
                    <span className={cn(
                      "text-sm flex-1",
                      unlocked ? "text-green-700 dark:text-green-400" : "text-muted-foreground"
                    )}>
                      {perk.perk}
                    </span>
                    {unlocked ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-moulna-gold" />
              Quick Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total XP</span>
                <span className="font-semibold">{stats.xp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Level</span>
                <span className="font-semibold">{stats.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Login Streak</span>
                <span className="font-semibold">{stats.streakDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Badges Earned</span>
                <span className="font-semibold">{stats.badgeCount}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
