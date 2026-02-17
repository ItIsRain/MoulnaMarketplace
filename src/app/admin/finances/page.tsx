"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3, TrendingUp, Calendar, Download,
  MessageSquare, Users, Store,
  PieChart, Loader2, Package, DollarSign, Globe
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

  const stats = [
    {
      label: "Total Listings",
      value: (data?.totalProducts ?? 0).toLocaleString(),
      icon: Store,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Total Inquiries",
      value: (data?.totalConversations ?? 0).toLocaleString(),
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Active Sellers",
      value: (data?.totalShops ?? 0).toLocaleString(),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Total Revenue",
      value: formatAED(data?.totalRevenue ?? 0),
      icon: DollarSign,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  const categories = data?.byCategory ?? [];

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
            Marketplace engagement and activity overview
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 me-2" />
            Last 30 Days
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 me-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Listings by Category */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Listings by Category</h2>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No category data available yet.
            </p>
          ) : (
            <div className="space-y-4">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{cat.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {cat.listings.toLocaleString()} listings
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-moulna-gold rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cat.percentage}% of total
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Platform Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Platform Summary</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Total Users",
                value: (data?.totalUsers ?? 0).toLocaleString(),
                icon: Users,
                iconColor: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                label: "Active Shops",
                value: (data?.totalShops ?? 0).toLocaleString(),
                icon: Store,
                iconColor: "text-green-600",
                bg: "bg-green-100",
              },
              {
                label: "Total Products",
                value: (data?.totalProducts ?? 0).toLocaleString(),
                icon: Package,
                iconColor: "text-purple-600",
                bg: "bg-purple-100",
              },
              {
                label: "Total Conversations",
                value: (data?.totalConversations ?? 0).toLocaleString(),
                icon: MessageSquare,
                iconColor: "text-orange-600",
                bg: "bg-orange-100",
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      item.bg
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", item.iconColor)} />
                  </div>
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
                <span className="text-sm font-semibold">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Engagement Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Engagement Summary</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">&mdash;</p>
            <p className="text-sm text-muted-foreground">Page Views (MTD)</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">
              {(data?.totalConversations ?? 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Inquiries</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">
              {(data?.totalShops ?? 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Active Sellers</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">&mdash;</p>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
