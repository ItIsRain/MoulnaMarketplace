"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award, Star, MessageCircle, MessageSquare, Users,
  Flame, Gift, Crown, Heart, Sparkles, Target,
  Zap, Trophy, Medal, Lock, LucideIcon
} from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  xp: number;
  earned: boolean;
  earnedDate?: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  progress?: { current: number; total: number };
}

interface BadgeCategory {
  name: string;
  icon: LucideIcon;
  badges: Badge[];
}

const BADGE_CATEGORIES: BadgeCategory[] = [
  {
    name: "Browsing",
    icon: MessageCircle,
    badges: [
      {
        id: "first-inquiry",
        name: "First Inquiry",
        description: "Contact your first seller on Moulna",
        icon: MessageCircle,
        xp: 50,
        earned: true,
        earnedDate: "2024-01-01",
        rarity: "common",
      },
      {
        id: "explorer",
        name: "Explorer",
        description: "Contact 10 different sellers",
        icon: MessageCircle,
        xp: 200,
        earned: true,
        earnedDate: "2024-01-10",
        rarity: "uncommon",
        progress: { current: 10, total: 10 },
      },
      {
        id: "power-browser",
        name: "Power Browser",
        description: "Save 50 listings",
        icon: Crown,
        xp: 500,
        earned: false,
        rarity: "rare",
        progress: { current: 32, total: 50 },
      },
      {
        id: "collector",
        name: "Collector",
        description: "Contact sellers from 10 different shops",
        icon: Star,
        xp: 300,
        earned: false,
        rarity: "uncommon",
        progress: { current: 6, total: 10 },
      },
    ],
  },
  {
    name: "Engagement",
    icon: MessageSquare,
    badges: [
      {
        id: "first-review",
        name: "Reviewer",
        description: "Write your first seller review",
        icon: MessageSquare,
        xp: 30,
        earned: true,
        earnedDate: "2024-01-05",
        rarity: "common",
      },
      {
        id: "critic",
        name: "Trusted Critic",
        description: "Write 20 helpful reviews",
        icon: Star,
        xp: 250,
        earned: false,
        rarity: "uncommon",
        progress: { current: 8, total: 20 },
      },
      {
        id: "social-butterfly",
        name: "Social Butterfly",
        description: "Follow 25 shops",
        icon: Heart,
        xp: 150,
        earned: true,
        earnedDate: "2024-01-12",
        rarity: "common",
      },
      {
        id: "influencer",
        name: "Influencer",
        description: "Get 100 likes on your reviews",
        icon: Sparkles,
        xp: 400,
        earned: false,
        rarity: "rare",
        progress: { current: 45, total: 100 },
      },
    ],
  },
  {
    name: "Loyalty",
    icon: Flame,
    badges: [
      {
        id: "week-streak",
        name: "Week Warrior",
        description: "7-day login streak",
        icon: Flame,
        xp: 100,
        earned: true,
        earnedDate: "2024-01-08",
        rarity: "common",
      },
      {
        id: "month-streak",
        name: "Dedicated",
        description: "30-day login streak",
        icon: Zap,
        xp: 500,
        earned: false,
        rarity: "rare",
        progress: { current: 18, total: 30 },
      },
      {
        id: "year-member",
        name: "Founding Member",
        description: "Be a member for 1 year",
        icon: Trophy,
        xp: 1000,
        earned: false,
        rarity: "legendary",
        progress: { current: 45, total: 365 },
      },
      {
        id: "referrer",
        name: "Ambassador",
        description: "Refer 5 friends who join Moulna",
        icon: Users,
        xp: 350,
        earned: false,
        rarity: "uncommon",
        progress: { current: 2, total: 5 },
      },
    ],
  },
  {
    name: "Special",
    icon: Gift,
    badges: [
      {
        id: "beta-tester",
        name: "Early Adopter",
        description: "Joined during beta period",
        icon: Medal,
        xp: 200,
        earned: true,
        earnedDate: "2023-12-01",
        rarity: "legendary",
      },
      {
        id: "event-participant",
        name: "Festival Explorer",
        description: "Participate in a seasonal event",
        icon: Gift,
        xp: 150,
        earned: false,
        rarity: "rare",
      },
      {
        id: "perfect-rating",
        name: "Five Stars",
        description: "Receive 5 star rating as a seller",
        icon: Star,
        xp: 200,
        earned: false,
        rarity: "uncommon",
      },
      {
        id: "completionist",
        name: "Completionist",
        description: "Earn all other badges",
        icon: Crown,
        xp: 2000,
        earned: false,
        rarity: "legendary",
        progress: { current: 5, total: 15 },
      },
    ],
  },
];

const RARITY_STYLES = {
  common: {
    bg: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-600",
    glow: "",
  },
  uncommon: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-600",
    glow: "",
  },
  rare: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-600",
    glow: "shadow-blue-200",
  },
  legendary: {
    bg: "bg-gradient-to-br from-amber-50 to-yellow-100",
    border: "border-yellow-400",
    text: "text-yellow-700",
    glow: "shadow-yellow-200 shadow-lg",
  },
};

export default function BadgesPage() {
  const totalBadges = BADGE_CATEGORIES.flatMap(c => c.badges).length;
  const earnedBadges = BADGE_CATEGORIES.flatMap(c => c.badges).filter(b => b.earned).length;

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-7 h-7 text-moulna-gold" />
              Badge Collection
            </h1>
            <p className="text-muted-foreground">
              Unlock badges by completing achievements
            </p>
          </div>
          <Card className="px-6 py-3 bg-gradient-to-r from-moulna-gold/10 to-transparent">
            <div className="text-center">
              <p className="text-3xl font-bold text-moulna-gold">{earnedBadges}/{totalBadges}</p>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </div>
          </Card>
        </div>

        {/* Badge Categories */}
        {BADGE_CATEGORIES.map((category, categoryIndex) => (
          <motion.section
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <category.icon className="w-5 h-5 text-moulna-gold" />
              <h2 className="text-lg font-semibold">{category.name}</h2>
              <BadgeUI variant="secondary">
                {category.badges.filter(b => b.earned).length}/{category.badges.length}
              </BadgeUI>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.badges.map((badge, index) => {
                const style = RARITY_STYLES[badge.rarity as keyof typeof RARITY_STYLES];
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                  >
                    <Card
                      className={cn(
                        "p-4 relative overflow-hidden transition-all hover:scale-105",
                        badge.earned ? style.glow : "opacity-75",
                        !badge.earned && "grayscale-[30%]"
                      )}
                    >
                      {/* Rarity indicator */}
                      <div className={cn(
                        "absolute top-0 right-0 px-2 py-0.5 text-xs font-medium rounded-bl-lg capitalize",
                        style.bg, style.text
                      )}>
                        {badge.rarity}
                      </div>

                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center border-2",
                          style.bg, style.border
                        )}>
                          {badge.earned ? (
                            <badge.icon className={cn("w-6 h-6", style.text)} />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{badge.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {badge.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-moulna-gold" />
                            <span className="text-xs font-medium text-moulna-gold">
                              +{badge.xp} XP
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      {!badge.earned && badge.progress && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              {badge.progress.current}/{badge.progress.total}
                            </span>
                          </div>
                          <Progress
                            value={(badge.progress.current / badge.progress.total) * 100}
                            className="h-1.5"
                          />
                        </div>
                      )}

                      {/* Earned date */}
                      {badge.earned && badge.earnedDate && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground">
                            Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}
    </div>
  );
}
