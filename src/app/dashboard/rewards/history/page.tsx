"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History, Sparkles, ShoppingBag, Star, MessageSquare,
  Users, Flame, Award, Gift, Filter, Calendar,
  TrendingUp, ChevronDown
} from "lucide-react";

const XP_HISTORY = [
  {
    id: "1",
    type: "purchase",
    description: "Completed order #MOU-2401-1234",
    xp: 50,
    date: "2024-01-15T10:30:00",
    icon: ShoppingBag,
    category: "Shopping",
  },
  {
    id: "2",
    type: "review",
    description: "Wrote a product review",
    xp: 30,
    date: "2024-01-15T09:15:00",
    icon: Star,
    category: "Engagement",
  },
  {
    id: "3",
    type: "streak",
    description: "12-day login streak bonus",
    xp: 100,
    date: "2024-01-15T00:01:00",
    icon: Flame,
    category: "Streak",
    isBonus: true,
  },
  {
    id: "4",
    type: "badge",
    description: "Earned 'Shopaholic' badge",
    xp: 200,
    date: "2024-01-14T15:45:00",
    icon: Award,
    category: "Achievement",
    isBonus: true,
  },
  {
    id: "5",
    type: "challenge",
    description: "Completed daily challenge: Window Shopping",
    xp: 15,
    date: "2024-01-14T12:00:00",
    icon: Gift,
    category: "Challenge",
  },
  {
    id: "6",
    type: "referral",
    description: "Friend completed first purchase",
    xp: 150,
    date: "2024-01-13T18:20:00",
    icon: Users,
    category: "Referral",
    isBonus: true,
  },
  {
    id: "7",
    type: "review",
    description: "Review marked as helpful (5 likes)",
    xp: 25,
    date: "2024-01-13T14:30:00",
    icon: MessageSquare,
    category: "Engagement",
  },
  {
    id: "8",
    type: "purchase",
    description: "Completed order #MOU-2401-1198",
    xp: 75,
    date: "2024-01-12T16:00:00",
    icon: ShoppingBag,
    category: "Shopping",
  },
];

const STATS = [
  { label: "Total XP Earned", value: "2,340", change: "+245 this week" },
  { label: "XP This Month", value: "645", change: "+32% vs last month" },
  { label: "Avg. Daily XP", value: "43", change: "Keep it up!" },
];

const CATEGORIES = ["All", "Shopping", "Engagement", "Streak", "Achievement", "Challenge", "Referral"];

export default function RewardsHistoryPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedPeriod, setSelectedPeriod] = React.useState("all");

  const filteredHistory = XP_HISTORY.filter(item => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const groupedByDate = filteredHistory.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, typeof XP_HISTORY>);

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <History className="w-7 h-7 text-moulna-gold" />
              XP History
            </h1>
            <p className="text-muted-foreground">
              Track your experience points and achievements
            </p>
          </div>
          <Button variant="outline">
            <Calendar className="w-4 h-4 me-2" />
            Date Range
            <ChevronDown className="w-4 h-4 ms-2" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="w-5 h-5 text-moulna-gold" />
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-moulna-gold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="shrink-0"
              >
                {cat}
              </Button>
            ))}
          </div>
        </Card>

        {/* History Timeline */}
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, items], dateIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dateIndex * 0.1 }}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
              <Card className="divide-y">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: dateIndex * 0.1 + index * 0.05 }}
                    className="p-4 flex items-center gap-4"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      item.isBonus
                        ? "bg-moulna-gold/20 text-moulna-gold"
                        : "bg-muted text-muted-foreground"
                    )}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      "text-end",
                      item.isBonus && "text-moulna-gold"
                    )}>
                      <p className="font-bold flex items-center gap-1 justify-end">
                        <Sparkles className="w-4 h-4" />
                        +{item.xp} XP
                      </p>
                      {item.isBonus && (
                        <Badge className="text-[10px] bg-moulna-gold mt-1">
                          BONUS
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <Card className="p-12 text-center">
            <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No XP history found</h3>
            <p className="text-sm text-muted-foreground">
              Start earning XP by shopping, writing reviews, and completing challenges!
            </p>
          </Card>
        )}

        {/* Load More */}
        {filteredHistory.length > 0 && (
          <div className="text-center">
            <Button variant="outline">
              Load More History
            </Button>
          </div>
        )}
    </div>
  );
}
