"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3, TrendingUp, Users, MessageSquare,
  DollarSign, Store, Calendar, Download,
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
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
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
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Total Inquiries",
      value: data.totalConversations.toLocaleString(),
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Users",
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Total Products",
      value: data.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Platform Analytics</h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive overview of marketplace performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 me-2" />
            Last 30 Days
          </Button>
          <Button variant="outline">
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
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue & Shops Summary */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-moulna-gold" />
              Revenue &amp; Shops Summary
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-center p-8 bg-muted/50 rounded-lg"
            >
              <DollarSign className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold mb-1">{formatAED(data.totalRevenue)}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center p-8 bg-muted/50 rounded-lg"
            >
              <Store className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <p className="text-3xl font-bold mb-1">{data.totalShops.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Shops</p>
            </motion.div>
          </div>
        </Card>

        {/* Top Categories */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-moulna-gold" />
              Top Categories
            </h2>
          </div>
          <div className="space-y-4">
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
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">
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
      <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-amber-50 border-moulna-gold/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-moulna-gold/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-moulna-gold" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Key Insights</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowUpRight className="w-4 h-4 text-green-600 mt-0.5" />
                <span>
                  The marketplace currently has {data.totalUsers.toLocaleString()} registered user{data.totalUsers !== 1 ? "s" : ""} across {data.totalShops.toLocaleString()} shop{data.totalShops !== 1 ? "s" : ""}.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Store className="w-4 h-4 text-purple-600 mt-0.5" />
                <span>
                  {data.totalProducts.toLocaleString()} product{data.totalProducts !== 1 ? "s" : ""} are listed on the platform with {data.totalConversations.toLocaleString()} inquiry conversation{data.totalConversations !== 1 ? "s" : ""}.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Package className="w-4 h-4 text-orange-600 mt-0.5" />
                <span>
                  {data.byCategory.length > 0
                    ? `Top category is ${data.byCategory[0].category} with ${data.byCategory[0].listings} listing${data.byCategory[0].listings !== 1 ? "s" : ""} (${data.byCategory[0].percentage}% of all products).`
                    : "No category breakdown available yet. Listings will appear here as products are added."}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
