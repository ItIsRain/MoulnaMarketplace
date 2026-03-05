"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History, Sparkles, MessageCircle, Star,
  Users, Flame, Award, Gift, Filter, Calendar,
  TrendingUp, ChevronDown, Loader2
} from "lucide-react";

const CATEGORIES = ["All", "inquiry", "engagement", "streak", "achievement", "challenge", "referral", "system"];
const CATEGORY_LABELS: Record<string, string> = {
  All: "All",
  inquiry: "Inquiries",
  engagement: "Engagement",
  streak: "Streak",
  achievement: "Achievement",
  challenge: "Challenge",
  referral: "Referral",
  system: "System",
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  inquiry: MessageCircle,
  engagement: Star,
  streak: Flame,
  achievement: Award,
  challenge: Gift,
  referral: Users,
  system: Sparkles,
};

interface XPEvent {
  id: string;
  amount: number;
  action: string;
  category: string;
  description: string | null;
  isBonus: boolean;
  createdAt: string;
}

export default function RewardsHistoryPage() {
  const [events, setEvents] = React.useState<XPEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [stats, setStats] = React.useState({ totalXP: 0, monthlyXP: 0, level: 1 });
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [page, setPage] = React.useState(1);

  const fetchHistory = React.useCallback(async (pageNum: number, category: string, append = false) => {
    const params = new URLSearchParams({ section: "history", page: String(pageNum) });
    if (category !== "All") params.set("category", category);

    const res = await fetch(`/api/gamification?${params}`);
    if (!res.ok) return;
    const data = await res.json();

    if (append) {
      setEvents((prev) => [...prev, ...(data.events || [])]);
    } else {
      setEvents(data.events || []);
    }
    setTotalCount(data.totalCount || 0);
    if (data.stats) setStats(data.stats);
  }, []);

  React.useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchHistory(1, selectedCategory).finally(() => setLoading(false));
  }, [selectedCategory, fetchHistory]);

  async function loadMore() {
    const next = page + 1;
    setLoadingMore(true);
    await fetchHistory(next, selectedCategory, true);
    setPage(next);
    setLoadingMore(false);
  }

  const groupedByDate = events.reduce((acc, item) => {
    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, XPEvent[]>);

  const dailyAvg = stats.monthlyXP > 0 ? Math.round(stats.monthlyXP / new Date().getDate()) : 0;

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
            <History className="w-7 h-7 text-moulna-gold" />
            XP History
          </h1>
          <p className="text-muted-foreground">
            Track your XP progression and level-up history
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Total XP Earned", value: stats.totalXP.toLocaleString() },
          { label: "XP This Month", value: stats.monthlyXP.toLocaleString() },
          { label: "Avg. Daily XP", value: dailyAvg.toLocaleString() },
        ].map((stat, index) => (
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
              {CATEGORY_LABELS[cat] || cat}
            </Button>
          ))}
        </div>
      </Card>

      {/* History Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, items], dateIndex) => {
          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dateIndex * 0.1 }}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
              <Card className="divide-y">
                {items.map((item, index) => {
                  const Icon = CATEGORY_ICONS[item.category] || Sparkles;
                  return (
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
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.description || item.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {CATEGORY_LABELS[item.category] || item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleTimeString("en-US", {
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
                          +{item.amount} XP
                        </p>
                        {item.isBonus && (
                          <Badge className="text-[10px] bg-moulna-gold mt-1">
                            BONUS
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {events.length === 0 && (
        <Card className="p-12 text-center">
          <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No XP history found</h3>
          <p className="text-sm text-muted-foreground">
            Start leveling up by contacting sellers, saving listings, and completing challenges!
          </p>
        </Card>
      )}

      {/* Load More */}
      {events.length < totalCount && (
        <div className="text-center">
          <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? (
              <Loader2 className="w-4 h-4 me-2 animate-spin" />
            ) : null}
            Load More History
          </Button>
        </div>
      )}
    </div>
  );
}
