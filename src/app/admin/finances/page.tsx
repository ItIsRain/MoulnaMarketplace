"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, TrendingUp, TrendingDown, Calendar, Download,
  MessageSquare, ArrowUpRight, ArrowDownRight, Users, Store,
  Eye, PieChart
} from "lucide-react";

const PLATFORM_STATS = [
  {
    label: "Total Listings",
    value: "8,450",
    change: "+18.5%",
    trend: "up",
    icon: Store,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    label: "Total Inquiries",
    value: "124,000",
    change: "+15.2%",
    trend: "up",
    icon: MessageSquare,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Active Sellers",
    value: "456",
    change: "+12",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    label: "Avg Response Rate",
    value: "89%",
    change: "+3.2%",
    trend: "up",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

const LISTINGS_BY_CATEGORY = [
  { category: "Fragrances", listings: 2340, percentage: 37 },
  { category: "Handmade Crafts", listings: 1390, percentage: 22 },
  { category: "Jewelry", listings: 1200, percentage: 19 },
  { category: "Traditional Wear", listings: 820, percentage: 13 },
  { category: "Home Decor", listings: 570, percentage: 9 },
];

const RECENT_ACTIVITY = [
  {
    id: "ACT-001",
    type: "listing",
    description: "New listing - Arabian Scents Boutique",
    detail: "Premium Oud Collection",
    date: "Mar 13, 2024",
  },
  {
    id: "ACT-002",
    type: "seller",
    description: "New seller registration - Desert Home",
    detail: "Pending verification",
    date: "Mar 13, 2024",
  },
  {
    id: "ACT-003",
    type: "inquiry",
    description: "Reported inquiry flagged for review",
    detail: "INQ-2024-8927",
    date: "Mar 13, 2024",
  },
  {
    id: "ACT-004",
    type: "listing",
    description: "Listing removed - Policy violation",
    detail: "Counterfeit item reported",
    date: "Mar 12, 2024",
  },
  {
    id: "ACT-005",
    type: "seller",
    description: "Seller verified - Emirates Artisan",
    detail: "ID verification complete",
    date: "Mar 12, 2024",
  },
];

export default function AdminAnalyticsPage() {
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
        {PLATFORM_STATS.map((stat, index) => (
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
                <Badge
                  variant="secondary"
                  className={cn(
                    stat.trend === "up"
                      ? "text-green-600 bg-green-100"
                      : "text-red-600 bg-red-100"
                  )}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 me-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 me-1" />
                  )}
                  {stat.change}
                </Badge>
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
          <div className="space-y-4">
            {LISTINGS_BY_CATEGORY.map((cat, index) => (
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
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-moulna-gold" />
              <h2 className="font-semibold">Recent Activity</h2>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      activity.type === "listing" && "bg-green-100",
                      activity.type === "seller" && "bg-blue-100",
                      activity.type === "inquiry" && "bg-orange-100"
                    )}
                  >
                    {activity.type === "listing" && (
                      <Store className="w-4 h-4 text-green-600" />
                    )}
                    {activity.type === "seller" && (
                      <Users className="w-4 h-4 text-blue-600" />
                    )}
                    {activity.type === "inquiry" && (
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {activity.date}
                </span>
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
            <p className="text-2xl font-bold">2.4M</p>
            <p className="text-sm text-muted-foreground">Page Views (MTD)</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">89%</p>
            <p className="text-sm text-muted-foreground">Avg Response Rate</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">4.7</p>
            <p className="text-sm text-muted-foreground">Avg Seller Rating</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">34 min</p>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
