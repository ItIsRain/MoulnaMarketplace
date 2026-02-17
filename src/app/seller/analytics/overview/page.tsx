"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, TrendingUp, TrendingDown, MessageSquare,
  Users, Eye, ArrowUpRight, ArrowDownRight, Download,
  Target, Loader2, Package, Star, ShoppingCart
} from "lucide-react";

interface AnalyticsStats {
  totalListings: number;
  activeListings: number;
  totalInquiries: number;
  currentInquiries: number;
  inquiryTrend: number;
  totalViews: number;
  totalFollowers: number;
  newFollowers: number;
  followerTrend: number;
  soldCount: number;
  totalRevenue: number;
  conversionRate: number;
  unreadMessages: number;
  rating: number;
  reviewCount: number;
}

interface TopProduct {
  rank: number;
  id: string;
  title: string;
  slug: string;
  inquiries: number;
  views: number;
}

interface AnalyticsData {
  stats: AnalyticsStats;
  topProducts: TopProduct[];
}

export default function AnalyticsOverviewPage() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/seller/analytics?section=overview&period=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // Calculate stats for cards
  const getStatsCards = (stats: AnalyticsStats) => [
    {
      label: "Total Inquiries",
      value: stats.currentInquiries.toLocaleString(),
      change: stats.inquiryTrend,
      trend: stats.inquiryTrend >= 0 ? "up" : "down",
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages.toLocaleString(),
      change: 0,
      trend: "up",
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Views",
      value: stats.totalViews >= 1000
        ? `${(stats.totalViews / 1000).toFixed(1)}K`
        : stats.totalViews.toString(),
      change: 0,
      trend: "up",
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "New Followers",
      value: stats.newFollowers.toLocaleString(),
      change: stats.followerTrend,
      trend: stats.followerTrend >= 0 ? "up" : "down",
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  // Calculate monthly goal (assuming 600 as target)
  const monthlyGoal = 600;
  const goalProgress = data ? Math.min((data.stats.currentInquiries / monthlyGoal) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-moulna-gold" />
            Analytics Overview
          </h1>
          <p className="text-muted-foreground">
            Track your shop's performance and growth
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                disabled={loading}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors",
                  timeRange === range
                    ? "bg-moulna-gold text-white"
                    : "hover:bg-muted",
                  loading && "opacity-50 cursor-not-allowed"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" disabled={loading}>
            <Download className="w-4 h-4 me-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-600">Error loading analytics: {error}</p>
        </Card>
      )}

      {/* Loading State */}
      {loading && !data && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
        </div>
      )}

      {/* Stats Grid */}
      {data && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getStatsCards(data.stats).map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.bg)}>
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                    </div>
                    {stat.change !== 0 && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          stat.trend === "up"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-3 h-3 me-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 me-1" />
                        )}
                        {Math.abs(stat.change).toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Inquiry Overview Chart Placeholder */}
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Inquiry Overview</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-moulna-gold" />
                    <span>This Period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted" />
                    <span>Last Period</span>
                  </div>
                </div>
              </div>
              {/* Chart Placeholder */}
              <div className="h-64 bg-gradient-to-b from-moulna-gold/10 to-transparent rounded-lg flex items-end justify-center p-4">
                <div className="flex items-end gap-2 h-full">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 88].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.05 }}
                      className="w-8 bg-moulna-gold rounded-t"
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-moulna-gold" />
                    <span className="text-sm">Active Listings</span>
                  </div>
                  <span className="font-semibold">{data.stats.activeListings}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Items Sold</span>
                  </div>
                  <span className="font-semibold">{data.stats.soldCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Shop Rating</span>
                  </div>
                  <span className="font-semibold">
                    {data.stats.rating > 0 ? data.stats.rating.toFixed(1) : 'N/A'}
                    {data.stats.reviewCount > 0 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({data.stats.reviewCount})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Conversion Rate</span>
                  </div>
                  <span className="font-semibold">{data.stats.conversionRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Total Followers</span>
                  </div>
                  <span className="font-semibold">{data.stats.totalFollowers}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Top Performing Products</h2>
              <Button variant="outline" size="sm">
                View All Products
              </Button>
            </div>
            {data.topProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-start py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="text-start py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Inquiries</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="font-semibold">
                            #{product.rank}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted" />
                            <span className="font-medium">{product.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-semibold">{product.inquiries}</td>
                        <td className="py-4 px-4 text-center">
                          {product.views.toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No product data available yet</p>
              </div>
            )}
          </Card>

          {/* Goals */}
          <Card className="p-6 bg-gradient-to-r from-moulna-gold/10 to-amber-50 border-moulna-gold/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-moulna-gold/20 flex items-center justify-center">
                <Target className="w-8 h-8 text-moulna-gold" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Monthly Goal Progress</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  You're {goalProgress.toFixed(0)}% towards your {monthlyGoal} monthly inquiry goal
                </p>
                <div className="h-2 bg-moulna-gold/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress}%` }}
                    className="h-full bg-moulna-gold rounded-full"
                  />
                </div>
              </div>
              <div className="text-end">
                <p className="text-2xl font-bold text-moulna-gold">{data.stats.currentInquiries}</p>
                <p className="text-sm text-muted-foreground">of {monthlyGoal} inquiries</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
