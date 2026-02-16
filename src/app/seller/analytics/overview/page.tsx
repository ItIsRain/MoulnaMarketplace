"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, TrendingUp, TrendingDown, MessageSquare,
  Users, Eye, ArrowUpRight, ArrowDownRight, Calendar, Download,
  Target, Sparkles
} from "lucide-react";

const STATS = [
  {
    label: "Total Inquiries",
    value: "458",
    change: 12.5,
    trend: "up",
    icon: MessageSquare,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    label: "Conversations",
    value: "234",
    change: 8.2,
    trend: "up",
    icon: MessageSquare,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Shop Views",
    value: "12.4K",
    change: -3.1,
    trend: "down",
    icon: Eye,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    label: "New Customers",
    value: "156",
    change: 15.8,
    trend: "up",
    icon: Users,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

const TOP_PRODUCTS = [
  { name: "Premium Oud Collection", inquiries: 45, views: 20250, growth: 18 },
  { name: "Arabian Bakhoor Set", inquiries: 38, views: 5700, growth: 12 },
  { name: "Traditional Perfume 100ml", inquiries: 32, views: 9600, growth: -5 },
  { name: "Gift Sampler Pack", inquiries: 28, views: 4200, growth: 25 },
  { name: "Luxury Oud Chips", inquiries: 24, views: 7200, growth: 8 },
];

const RECENT_ACTIVITY = [
  { type: "inquiry", message: "New inquiry about Premium Oud Collection", time: "2 min ago" },
  { type: "review", message: "5-star review received", time: "15 min ago" },
  { type: "follower", message: "New follower: Sarah A.", time: "1 hour ago" },
  { type: "milestone", message: "100th inquiry this month!", time: "3 hours ago" },
  { type: "inquiry", message: "New inquiry about Arabian Bakhoor Set", time: "5 hours ago" },
];

export default function AnalyticsOverviewPage() {
  const [timeRange, setTimeRange] = React.useState("30d");

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
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors",
                  timeRange === range
                    ? "bg-moulna-gold text-white"
                    : "hover:bg-muted"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 me-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, index) => (
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
                  {Math.abs(stat.change)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
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

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  activity.type === "inquiry" && "bg-green-500",
                  activity.type === "review" && "bg-yellow-500",
                  activity.type === "follower" && "bg-blue-500",
                  activity.type === "milestone" && "bg-purple-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            View All Activity
          </Button>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-start py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Inquiries</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Growth</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((product, index) => (
                <motion.tr
                  key={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b last:border-0 hover:bg-muted/50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">{product.inquiries}</td>
                  <td className="py-4 px-4 text-center font-semibold">
                    {product.views.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge
                      variant="secondary"
                      className={cn(
                        product.growth >= 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {product.growth >= 0 ? "+" : ""}{product.growth}%
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
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
              You're 78% towards your 600 monthly inquiry goal
            </p>
            <div className="h-2 bg-moulna-gold/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                className="h-full bg-moulna-gold rounded-full"
              />
            </div>
          </div>
          <div className="text-end">
            <p className="text-2xl font-bold text-moulna-gold">468</p>
            <p className="text-sm text-muted-foreground">of 600 inquiries</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
