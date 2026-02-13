"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Trophy, Medal, Crown, Sparkles, TrendingUp,
  Star, Users, Flame, ChevronUp, ChevronDown, Minus
} from "lucide-react";

const LEADERBOARD = [
  {
    rank: 1,
    previousRank: 1,
    name: "Mariam Al Qassimi",
    avatar: "mariam-leader",
    level: 10,
    xp: 15420,
    badges: 24,
    streak: 45,
    change: "same",
  },
  {
    rank: 2,
    previousRank: 3,
    name: "Ahmed Hassan",
    avatar: "ahmed-leader",
    level: 9,
    xp: 14890,
    badges: 22,
    streak: 38,
    change: "up",
  },
  {
    rank: 3,
    previousRank: 2,
    name: "Fatima Al Zahra",
    avatar: "fatima-leader",
    level: 9,
    xp: 14650,
    badges: 21,
    streak: 52,
    change: "down",
  },
  {
    rank: 4,
    previousRank: 4,
    name: "Omar Nasser",
    avatar: "omar-leader",
    level: 8,
    xp: 12340,
    badges: 19,
    streak: 28,
    change: "same",
  },
  {
    rank: 5,
    previousRank: 6,
    name: "Sara Abdullah",
    avatar: "sara-leader",
    level: 8,
    xp: 11980,
    badges: 18,
    streak: 33,
    change: "up",
  },
  {
    rank: 6,
    previousRank: 5,
    name: "Khalid Ibrahim",
    avatar: "khalid-leader",
    level: 7,
    xp: 10890,
    badges: 16,
    streak: 21,
    change: "down",
  },
  {
    rank: 7,
    previousRank: 8,
    name: "Noura Rashid",
    avatar: "noura-leader",
    level: 7,
    xp: 10450,
    badges: 15,
    streak: 19,
    change: "up",
  },
  {
    rank: 8,
    previousRank: 7,
    name: "Yusuf Al Mansoori",
    avatar: "yusuf-leader",
    level: 7,
    xp: 9870,
    badges: 14,
    streak: 25,
    change: "down",
  },
  {
    rank: 9,
    previousRank: 10,
    name: "Layla Mahmoud",
    avatar: "layla-leader",
    level: 6,
    xp: 8920,
    badges: 13,
    streak: 17,
    change: "up",
  },
  {
    rank: 10,
    previousRank: 9,
    name: "Hassan Ali",
    avatar: "hassan-leader",
    level: 6,
    xp: 8450,
    badges: 12,
    streak: 14,
    change: "down",
  },
];

const YOUR_STATS = {
  rank: 156,
  previousRank: 162,
  name: "You",
  avatar: "current-user",
  level: 4,
  xp: 2340,
  badges: 5,
  streak: 12,
  change: "up",
};

const FILTERS = ["All Time", "This Month", "This Week"];

export default function LeaderboardPage() {
  const [selectedFilter, setSelectedFilter] = React.useState("All Time");

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getChangeIcon = (change: string) => {
    if (change === "up") return <ChevronUp className="w-4 h-4 text-green-500" />;
    if (change === "down") return <ChevronDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-7 h-7 text-moulna-gold" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              See how you rank against other Moulna members
            </p>
          </div>
          <div className="flex gap-2">
            {FILTERS.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="pt-8"
          >
            <Card className="p-6 text-center bg-gradient-to-b from-gray-100 to-white">
              <div className="relative inline-block mb-3">
                <DiceBearAvatar seed={LEADERBOARD[1].avatar} size="xl" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Medal className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              <h3 className="font-semibold truncate">{LEADERBOARD[1].name}</h3>
              <LevelBadge level={LEADERBOARD[1].level} size="sm" className="my-2" />
              <p className="text-lg font-bold text-moulna-gold">
                {LEADERBOARD[1].xp.toLocaleString()} XP
              </p>
            </Card>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 text-center bg-gradient-to-b from-yellow-100 to-white border-yellow-300 shadow-lg">
              <div className="relative inline-block mb-3">
                <DiceBearAvatar seed={LEADERBOARD[0].avatar} size="xl" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-semibold truncate">{LEADERBOARD[0].name}</h3>
              <LevelBadge level={LEADERBOARD[0].level} size="sm" className="my-2" />
              <p className="text-xl font-bold text-moulna-gold">
                {LEADERBOARD[0].xp.toLocaleString()} XP
              </p>
              <Badge className="mt-2 bg-yellow-500">Champion</Badge>
            </Card>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-8"
          >
            <Card className="p-6 text-center bg-gradient-to-b from-amber-100 to-white">
              <div className="relative inline-block mb-3">
                <DiceBearAvatar seed={LEADERBOARD[2].avatar} size="xl" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                  <Medal className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-semibold truncate">{LEADERBOARD[2].name}</h3>
              <LevelBadge level={LEADERBOARD[2].level} size="sm" className="my-2" />
              <p className="text-lg font-bold text-moulna-gold">
                {LEADERBOARD[2].xp.toLocaleString()} XP
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Your Position */}
        <Card className="p-4 bg-gradient-to-r from-moulna-gold/10 to-transparent border-moulna-gold/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-moulna-gold/20 flex items-center justify-center font-bold text-moulna-gold">
              #{YOUR_STATS.rank}
            </div>
            <DiceBearAvatar seed={YOUR_STATS.avatar} size="md" />
            <div className="flex-1">
              <h3 className="font-semibold">Your Position</h3>
              <p className="text-sm text-muted-foreground">
                Top {Math.round((YOUR_STATS.rank / 2000) * 100)}% of all members
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getChangeIcon(YOUR_STATS.change)}
              <span className="text-sm text-green-500">
                +{YOUR_STATS.previousRank - YOUR_STATS.rank} positions
              </span>
            </div>
            <LevelBadge level={YOUR_STATS.level} size="md" />
            <div className="text-end">
              <p className="font-bold text-moulna-gold">{YOUR_STATS.xp.toLocaleString()} XP</p>
              <p className="text-sm text-muted-foreground">
                {(LEADERBOARD[9].xp - YOUR_STATS.xp).toLocaleString()} XP to Top 10
              </p>
            </div>
          </div>
        </Card>

        {/* Full Leaderboard */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-start p-4 font-medium">Rank</th>
                  <th className="text-start p-4 font-medium">Member</th>
                  <th className="text-start p-4 font-medium">Level</th>
                  <th className="text-start p-4 font-medium">XP</th>
                  <th className="text-start p-4 font-medium">Badges</th>
                  <th className="text-start p-4 font-medium">Streak</th>
                  <th className="text-start p-4 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.map((user, index) => (
                  <motion.tr
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border-b last:border-0 hover:bg-muted/50 transition-colors",
                      user.rank <= 3 && "bg-moulna-gold/5"
                    )}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(user.rank) || (
                          <span className="w-6 text-center font-bold text-muted-foreground">
                            {user.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <DiceBearAvatar seed={user.avatar} size="sm" />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <LevelBadge level={user.level} size="sm" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-moulna-gold" />
                        <span className="font-medium">{user.xp.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-purple-500" />
                        <span>{user.badges}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>{user.streak} days</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getChangeIcon(user.change)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto text-moulna-gold mb-2" />
            <p className="text-2xl font-bold">2,345</p>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">+156</p>
            <p className="text-sm text-muted-foreground">New This Week</p>
          </Card>
          <Card className="p-4 text-center">
            <Sparkles className="w-8 h-8 mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold">1.2M</p>
            <p className="text-sm text-muted-foreground">Total XP Earned</p>
          </Card>
        </div>
    </div>
  );
}
