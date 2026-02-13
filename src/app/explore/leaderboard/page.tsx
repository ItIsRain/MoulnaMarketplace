"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Trophy, Medal, Crown, Star, Flame, TrendingUp,
  Calendar, Filter, ChevronRight, Sparkles, Target,
  Award, Users
} from "lucide-react";

const LEADERBOARD_DATA = [
  {
    rank: 1,
    user: { name: "Fatima Al-Hassan", avatar: "fatima-alhassan", level: 10 },
    xp: 45780,
    streak: 45,
    badges: 32,
    change: 0,
  },
  {
    rank: 2,
    user: { name: "Mohammed Ibrahim", avatar: "mohammed-ibrahim", level: 9 },
    xp: 42350,
    streak: 38,
    badges: 28,
    change: 1,
  },
  {
    rank: 3,
    user: { name: "Sarah Ahmed", avatar: "sarah-ahmed", level: 9 },
    xp: 39890,
    streak: 42,
    badges: 26,
    change: -1,
  },
  {
    rank: 4,
    user: { name: "Ahmed Khalid", avatar: "ahmed-khalid", level: 8 },
    xp: 35420,
    streak: 28,
    badges: 24,
    change: 2,
  },
  {
    rank: 5,
    user: { name: "Layla Omar", avatar: "layla-omar", level: 8 },
    xp: 32150,
    streak: 22,
    badges: 21,
    change: 0,
  },
  {
    rank: 6,
    user: { name: "Hassan Ali", avatar: "hassan-ali", level: 7 },
    xp: 28900,
    streak: 15,
    badges: 19,
    change: -2,
  },
  {
    rank: 7,
    user: { name: "Nour Mahmoud", avatar: "nour-mahmoud", level: 7 },
    xp: 26780,
    streak: 18,
    badges: 17,
    change: 1,
  },
  {
    rank: 8,
    user: { name: "Omar Hassan", avatar: "omar-hassan", level: 6 },
    xp: 24500,
    streak: 12,
    badges: 15,
    change: 0,
  },
  {
    rank: 9,
    user: { name: "Aisha Nasser", avatar: "aisha-nasser", level: 6 },
    xp: 22100,
    streak: 10,
    badges: 14,
    change: 3,
  },
  {
    rank: 10,
    user: { name: "Youssef Ahmed", avatar: "youssef-ahmed", level: 5 },
    xp: 19850,
    streak: 8,
    badges: 12,
    change: -1,
  },
];

const TIME_FILTERS = [
  { id: "all-time", label: "All Time" },
  { id: "this-month", label: "This Month" },
  { id: "this-week", label: "This Week" },
  { id: "today", label: "Today" },
];

const CATEGORY_FILTERS = [
  { id: "xp", label: "Total XP", icon: Sparkles },
  { id: "streak", label: "Longest Streak", icon: Flame },
  { id: "badges", label: "Most Badges", icon: Award },
  { id: "reviews", label: "Top Reviewers", icon: Star },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
  return null;
}

function getRankStyle(rank: number) {
  if (rank === 1) return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200";
  if (rank === 2) return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
  if (rank === 3) return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200";
  return "";
}

export default function PublicLeaderboardPage() {
  const [timeFilter, setTimeFilter] = React.useState("all-time");
  const [categoryFilter, setCategoryFilter] = React.useState("xp");

  // Mock current user rank
  const currentUserRank = 156;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-moulna-charcoal via-slate-800 to-moulna-charcoal text-white overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-moulna-gold/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-moulna-gold/20 rounded-full"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-moulna-gold/20 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-moulna-gold" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community Leaderboard
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              See how you rank among the Moulna community.
              Earn XP, complete challenges, and climb to the top!
            </p>

            {/* Current User Rank */}
            <Card className="inline-flex items-center gap-4 p-4 bg-white/10 border-white/20 text-white">
              <DiceBearAvatar seed="my-avatar" size="md" />
              <div className="text-start">
                <p className="text-sm text-white/70">Your Current Rank</p>
                <p className="text-2xl font-bold">#{currentUserRank}</p>
              </div>
              <div className="border-s border-white/20 ps-4">
                <p className="text-sm text-white/70">XP to next rank</p>
                <p className="font-semibold">+250 XP</p>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/dashboard/rewards">
                  View My Stats
                </Link>
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Time Filter */}
          <div className="flex flex-wrap gap-2">
            {TIME_FILTERS.map((filter) => (
              <Button
                key={filter.id}
                variant={timeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter(filter.id)}
                className={cn(
                  timeFilter === filter.id && "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 md:ms-auto">
            {CATEGORY_FILTERS.map((filter) => (
              <Button
                key={filter.id}
                variant={categoryFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(filter.id)}
                className={cn(
                  categoryFilter === filter.id && "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
              >
                <filter.icon className="w-4 h-4 me-1" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Second Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="pt-8"
              >
                <Card className="p-4 text-center bg-gradient-to-b from-gray-100 to-white border-gray-300">
                  <div className="w-16 h-16 mx-auto mb-2 relative">
                    <DiceBearAvatar seed={LEADERBOARD_DATA[1].user.avatar} size="lg" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <p className="font-semibold text-sm truncate">{LEADERBOARD_DATA[1].user.name}</p>
                  <p className="text-moulna-gold font-bold">{LEADERBOARD_DATA[1].xp.toLocaleString()} XP</p>
                </Card>
              </motion.div>

              {/* First Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 text-center bg-gradient-to-b from-yellow-100 to-amber-50 border-yellow-300 ring-2 ring-yellow-400 ring-offset-2">
                  <Crown className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                  <div className="w-20 h-20 mx-auto mb-2 relative">
                    <DiceBearAvatar seed={LEADERBOARD_DATA[0].user.avatar} size="xl" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <p className="font-semibold truncate">{LEADERBOARD_DATA[0].user.name}</p>
                  <p className="text-moulna-gold font-bold text-lg">{LEADERBOARD_DATA[0].xp.toLocaleString()} XP</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">{LEADERBOARD_DATA[0].streak} day streak</span>
                  </div>
                </Card>
              </motion.div>

              {/* Third Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pt-12"
              >
                <Card className="p-4 text-center bg-gradient-to-b from-amber-100 to-orange-50 border-amber-300">
                  <div className="w-14 h-14 mx-auto mb-2 relative">
                    <DiceBearAvatar seed={LEADERBOARD_DATA[2].user.avatar} size="md" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                  </div>
                  <p className="font-semibold text-sm truncate">{LEADERBOARD_DATA[2].user.name}</p>
                  <p className="text-moulna-gold font-bold">{LEADERBOARD_DATA[2].xp.toLocaleString()} XP</p>
                </Card>
              </motion.div>
            </div>

            {/* Rest of Leaderboard */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b bg-muted/50">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-5">User</div>
                  <div className="col-span-2 text-center">XP</div>
                  <div className="col-span-2 text-center">Streak</div>
                  <div className="col-span-2 text-center">Badges</div>
                </div>
              </div>
              <div className="divide-y">
                {LEADERBOARD_DATA.slice(3).map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <span className="font-bold text-lg">#{entry.rank}</span>
                        {entry.change !== 0 && (
                          <span className={cn(
                            "text-xs ms-1",
                            entry.change > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {entry.change > 0 ? `↑${entry.change}` : `↓${Math.abs(entry.change)}`}
                          </span>
                        )}
                      </div>
                      <div className="col-span-5 flex items-center gap-3">
                        <DiceBearAvatar seed={entry.user.avatar} size="sm" />
                        <div>
                          <p className="font-medium">{entry.user.name}</p>
                          <LevelBadge level={entry.user.level} size="sm" />
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-semibold text-moulna-gold">
                        {entry.xp.toLocaleString()}
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="inline-flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          {entry.streak}
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="inline-flex items-center gap-1">
                          <Award className="w-4 h-4 text-purple-500" />
                          {entry.badges}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            <div className="text-center mt-6">
              <Button variant="outline" size="lg">
                Load More Rankings
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Challenge */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Weekly Challenge</h3>
              </div>
              <p className="text-sm text-purple-700 mb-4">
                Complete 5 purchases this week to earn bonus XP and climb the leaderboard!
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Progress</span>
                <span className="font-medium">2/5</span>
              </div>
              <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                <div className="h-full w-2/5 bg-purple-600 rounded-full" />
              </div>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                View All Challenges
              </Button>
            </Card>

            {/* How to Rank Up */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-moulna-gold" />
                How to Rank Up
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Write Reviews</p>
                    <p className="text-xs text-muted-foreground">+50 XP per review</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Keep Your Streak</p>
                    <p className="text-xs text-muted-foreground">+10 XP daily bonus</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Earn Badges</p>
                    <p className="text-xs text-muted-foreground">+100-500 XP per badge</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Community Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-moulna-gold" />
                Community Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-moulna-gold">12.5K</p>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-moulna-gold">2.8M</p>
                  <p className="text-xs text-muted-foreground">Total XP Earned</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-moulna-gold">45K</p>
                  <p className="text-xs text-muted-foreground">Badges Unlocked</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-moulna-gold">89</p>
                  <p className="text-xs text-muted-foreground">Max Streak Days</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
