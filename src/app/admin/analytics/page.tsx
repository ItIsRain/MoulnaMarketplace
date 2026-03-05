"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3, TrendingUp, Users, MessageSquare,
  DollarSign, Store, Download,
  ArrowUpRight, Package, Loader2
} from "lucide-react";

interface CategoryData {
  category: string;
  listings: number;
  percentage: number;
}

interface AnalyticsData {
  totalUsers: number;
  totalShops: number;
  totalProducts: number;
  totalConversations: number;
  totalRevenue: number;
  byCategory: CategoryData[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/stats?section=analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const json: AnalyticsData = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-moulna-gold" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load analytics data.</p>
      </div>
    );
  }

  const overviewStats = [
    {
      label: "Total Revenue",
      value: formatAED(data.totalRevenue),
      icon: DollarSign,
      gradient: "from-green-500/10 to-green-600/5",
      color: "text-green-600",
    },
    {
      label: "Total Inquiries",
      value: data.totalConversations.toLocaleString(),
      icon: MessageSquare,
      gradient: "from-blue-500/10 to-blue-600/5",
      color: "text-blue-600",
    },
    {
      label: "Total Users",
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      gradient: "from-purple-500/10 to-purple-600/5",
      color: "text-purple-600",
    },
    {
      label: "Total Products",
      value: data.totalProducts.toLocaleString(),
      icon: Package,
      gradient: "from-orange-500/10 to-orange-600/5",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-moulna-gold" />
            Platform Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Comprehensive overview of marketplace performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!data) return;
              const rows = [
                ["Metric", "Value"],
                ["Total Revenue", `AED ${(data.totalRevenue / 100).toFixed(2)}`],
                ["Total Users", String(data.totalUsers)],
                ["Total Shops", String(data.totalShops)],
                ["Total Products", String(data.totalProducts)],
                ["Total Inquiries", String(data.totalConversations)],
                ...data.byCategory.map((c) => [`Category: ${c.category}`, `${c.listings} listings (${c.percentage}%)`]),
              ];
              const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "analytics-export.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-4 h-4 me-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn("border-border/60 shadow-sm p-5 bg-gradient-to-br", stat.gradient)}>
              <div className="flex items-center gap-3 mb-3">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue & Shops Summary */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <div className="px-5 pt-5 pb-4 border-b border-border/60">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-moulna-gold" />
              Revenue &amp; Shops Summary
            </h2>
          </div>

          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg"
            >
              <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-semibold tabular-nums mb-0.5">{formatAED(data.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg"
            >
              <Store className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-semibold tabular-nums mb-0.5">{data.totalShops.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Shops</p>
            </motion.div>
          </div>
        </Card>

        {/* Top Categories */}
        <Card className="border-border/60 shadow-sm">
          <div className="px-5 pt-5 pb-4 border-b border-border/60">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-moulna-gold" />
              Top Categories
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {data.byCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No category data available yet.
              </p>
            ) : (
              data.byCategory.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-medium">{category.category}</span>
                    <span className="text-[13px] text-muted-foreground tabular-nums">
                      {category.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-moulna-gold rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.listings} listing{category.listings !== 1 ? "s" : ""}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card className="border-border/60 shadow-sm bg-gradient-to-br from-moulna-gold/10 to-amber-50 border-moulna-gold/20">
        <div className="px-5 pt-5 pb-4 border-b border-moulna-gold/15">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-moulna-gold" />
            Key Insights
          </h3>
        </div>
        <div className="p-5">
          <ul className="space-y-2.5 text-[13px] text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowUpRight className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <span>
                The marketplace currently has {data.totalUsers.toLocaleString()} registered user{data.totalUsers !== 1 ? "s" : ""} across {data.totalShops.toLocaleString()} shop{data.totalShops !== 1 ? "s" : ""}.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Store className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <span>
                {data.totalProducts.toLocaleString()} product{data.totalProducts !== 1 ? "s" : ""} are listed on the platform with {data.totalConversations.toLocaleString()} inquiry conversation{data.totalConversations !== 1 ? "s" : ""}.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Package className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
              <span>
                {data.byCategory.length > 0
                  ? `Top category is ${data.byCategory[0].category} with ${data.byCategory[0].listings} listing${data.byCategory[0].listings !== 1 ? "s" : ""} (${data.byCategory[0].percentage}% of all products).`
                  : "No category breakdown available yet. Listings will appear here as products are added."}
              </span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
