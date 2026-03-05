"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy, Star, Package, Users, MessageSquare, TrendingUp,
  Award, Crown, Zap, Target, Gift, CheckCircle,
  Lock, Sparkles
} from "lucide-react";

const ACHIEVEMENT_CATEGORIES = [
  { id: "sales", label: "Inquiries", icon: MessageSquare },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "special", label: "Special", icon: Crown },
];

const ACHIEVEMENTS = [
  {
    id: "1",
    name: "First Inquiry",
    description: "Receive your first inquiry on Moulna",
    icon: MessageSquare,
    category: "sales",
    xpReward: 100,
    unlocked: true,
    unlockedDate: "2024-01-15",
    rarity: "common",
  },
  {
    id: "2",
    name: "Rising Star",
    description: "Receive 10 inquiries",
    icon: Star,
    category: "sales",
    xpReward: 250,
    unlocked: true,
    unlockedDate: "2024-02-20",
    rarity: "common",
  },
  {
    id: "3",
    name: "Top Seller",
    description: "Receive 100 inquiries",
    icon: TrendingUp,
    category: "sales",
    xpReward: 500,
    unlocked: false,
    progress: 67,
    progressText: "67/100 inquiries",
    rarity: "rare",
  },
  {
    id: "4",
    name: "Catalog Builder",
    description: "List 25 items",
    icon: Package,
    category: "products",
    xpReward: 200,
    unlocked: true,
    unlockedDate: "2024-03-01",
    rarity: "common",
  },
  {
    id: "5",
    name: "Product Master",
    description: "List 100 items",
    icon: Package,
    category: "products",
    xpReward: 500,
    unlocked: false,
    progress: 45,
    progressText: "45/100 listings",
    rarity: "rare",
  },
  {
    id: "6",
    name: "Fan Favorite",
    description: "Get 50 followers",
    icon: Users,
    category: "customers",
    xpReward: 300,
    unlocked: true,
    unlockedDate: "2024-02-28",
    rarity: "uncommon",
  },
  {
    id: "7",
    name: "Community Leader",
    description: "Get 500 followers",
    icon: Crown,
    category: "customers",
    xpReward: 1000,
    unlocked: false,
    progress: 47,
    progressText: "234/500 followers",
    rarity: "epic",
  },
  {
    id: "8",
    name: "5-Star Service",
    description: "Maintain 5-star rating for 30 days",
    icon: Star,
    category: "reviews",
    xpReward: 400,
    unlocked: true,
    unlockedDate: "2024-03-10",
    rarity: "uncommon",
  },
  {
    id: "9",
    name: "Review Champion",
    description: "Receive 100 positive reviews",
    icon: MessageSquare,
    category: "reviews",
    xpReward: 750,
    unlocked: false,
    progress: 82,
    progressText: "82/100 reviews",
    rarity: "rare",
  },
  {
    id: "10",
    name: "Quick Responder",
    description: "Reply to all messages within 1 hour for 7 days",
    icon: Zap,
    category: "special",
    xpReward: 300,
    unlocked: true,
    unlockedDate: "2024-03-05",
    rarity: "uncommon",
  },
  {
    id: "11",
    name: "Artisan Elite",
    description: "Join the Artisan Program",
    icon: Award,
    category: "special",
    xpReward: 1000,
    unlocked: false,
    locked: true,
    lockedReason: "Complete Artisan application",
    rarity: "legendary",
  },
  {
    id: "12",
    name: "UAE Champion",
    description: "Receive inquiries from all 7 emirates",
    icon: Target,
    category: "special",
    xpReward: 500,
    unlocked: false,
    progress: 71,
    progressText: "5/7 emirates",
    rarity: "rare",
  },
];

const RARITY_STYLES = {
  common: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-600",
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
  epic: {
    bg: "bg-purple-50",
    border: "border-purple-300",
    text: "text-purple-600",
    glow: "shadow-purple-200",
  },
  legendary: {
    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    border: "border-amber-400",
    text: "text-amber-600",
    glow: "shadow-amber-200",
  },
};

export default function SellerAchievementsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [earnedBadgeIds, setEarnedBadgeIds] = React.useState<Map<string, string>>(new Map());

  React.useEffect(() => {
    fetch("/api/gamification?section=badges")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.badges) {
          const map = new Map<string, string>();
          data.badges.forEach((b: { badgeId: string; earnedAt: string }) => {
            map.set(b.badgeId, b.earnedAt);
          });
          setEarnedBadgeIds(map);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Merge earned status from API
  const achievements = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: earnedBadgeIds.has(a.id),
    unlockedDate: earnedBadgeIds.get(a.id) || a.unlockedDate,
  }));

  const filteredAchievements = achievements.filter(
    (a) => selectedCategory === "all" || a.category === selectedCategory
  );

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalXP = achievements.filter((a) => a.unlocked).reduce(
    (sum, a) => sum + a.xpReward,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Trophy className="w-8 h-8 animate-pulse text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          Unlock achievements and showcase your success
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto text-moulna-gold mb-2" />
          <p className="text-2xl font-bold">{unlockedCount}</p>
          <p className="text-sm text-muted-foreground">Unlocked</p>
        </Card>
        <Card className="p-4 text-center">
          <Lock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-2xl font-bold">{achievements.length - unlockedCount}</p>
          <p className="text-sm text-muted-foreground">Locked</p>
        </Card>
        <Card className="p-4 text-center">
          <Sparkles className="w-8 h-8 mx-auto text-purple-500 mb-2" />
          <p className="text-2xl font-bold">{unlockedCount + (achievements.length - unlockedCount)}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </Card>
        <Card className="p-4 text-center">
          <Target className="w-8 h-8 mx-auto text-green-500 mb-2" />
          <p className="text-2xl font-bold">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </p>
          <p className="text-sm text-muted-foreground">Completion</p>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
          className={cn(
            selectedCategory === "all" && "bg-moulna-gold hover:bg-moulna-gold-dark"
          )}
        >
          <Trophy className="w-4 h-4 me-1" />
          All
        </Button>
        {ACHIEVEMENT_CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              selectedCategory === cat.id && "bg-moulna-gold hover:bg-moulna-gold-dark"
            )}
          >
            <cat.icon className="w-4 h-4 me-1" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, index) => {
          const rarityStyle = RARITY_STYLES[achievement.rarity as keyof typeof RARITY_STYLES];

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  "p-6 relative overflow-hidden transition-all",
                  achievement.unlocked
                    ? `${rarityStyle.bg} ${rarityStyle.border} border-2 ${rarityStyle.glow} shadow-lg`
                    : "bg-muted/50 opacity-75"
                )}
              >
                {/* Rarity Badge */}
                <Badge
                  className={cn(
                    "absolute top-3 end-3 text-xs capitalize",
                    rarityStyle.text,
                    achievement.unlocked ? rarityStyle.bg : "bg-gray-100 text-gray-500"
                  )}
                  variant="outline"
                >
                  {achievement.rarity}
                </Badge>

                {/* Icon */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                    achievement.unlocked
                      ? "bg-white/80 shadow-sm"
                      : "bg-gray-200"
                  )}
                >
                  {achievement.unlocked ? (
                    <achievement.icon
                      className={cn("w-7 h-7", rarityStyle.text)}
                    />
                  ) : (
                    <Lock className="w-7 h-7 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <h3 className="font-semibold mb-1">{achievement.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {achievement.description}
                </p>

                {/* Progress or Status */}
                {achievement.unlocked ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Unlocked</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Unlocked</Badge>
                  </div>
                ) : achievement.locked ? (
                  <div className="text-sm text-muted-foreground">
                    {achievement.lockedReason}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {achievement.progressText}
                      </span>
                      <Badge variant="outline">{achievement.progressText}</Badge>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming Achievements */}
      <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-amber-50 border-moulna-gold/20">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-6 h-6 text-moulna-gold" />
          <h2 className="font-semibold text-lg">Coming Soon</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          New achievements are added regularly. Keep listing and engaging to unlock them first!
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-dashed">
            Holiday Special 🎄
          </Badge>
          <Badge variant="outline" className="border-dashed">
            Ramadan Champion 🌙
          </Badge>
          <Badge variant="outline" className="border-dashed">
            Anniversary Badge 🎉
          </Badge>
        </div>
      </Card>
    </div>
  );
}
