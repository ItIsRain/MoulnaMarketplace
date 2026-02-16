"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, TrendingUp, TrendingDown, Users, MessageSquare,
  DollarSign, Store, Calendar, Download, ArrowUpRight,
  ArrowDownRight, Eye, Package
} from "lucide-react";

const OVERVIEW_STATS = [
  {
    label: "Total Revenue",
    value: "AED 1.2M",
    change: "+18.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    label: "Total Inquiries",
    value: "8,234",
    change: "+12.3%",
    trend: "up",
    icon: MessageSquare,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Active Users",
    value: "12,456",
    change: "+8.7%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    label: "Conversion Rate",
    value: "3.8%",
    change: "-0.3%",
    trend: "down",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 85000, inquiries: 520 },
  { month: "Feb", revenue: 92000, inquiries: 580 },
  { month: "Mar", revenue: 105000, inquiries: 650 },
  { month: "Apr", revenue: 98000, inquiries: 610 },
  { month: "May", revenue: 112000, inquiries: 720 },
  { month: "Jun", revenue: 125000, inquiries: 810 },
];

const TOP_CATEGORIES = [
  { name: "Perfumes & Oud", sales: 345000, percentage: 28 },
  { name: "Handmade Crafts", sales: 278000, percentage: 23 },
  { name: "Jewelry", sales: 234000, percentage: 19 },
  { name: "Traditional Wear", sales: 189000, percentage: 15 },
  { name: "Home Decor", sales: 178000, percentage: 15 },
];

const PLATFORM_METRICS = [
  { label: "Page Views", value: "1.2M", change: "+15%" },
  { label: "Avg Session", value: "4m 32s", change: "+8%" },
  { label: "Bounce Rate", value: "42%", change: "-5%" },
  { label: "Inquiry Response Rate", value: "68%", change: "+3%" },
];

export default function AdminAnalyticsPage() {
  const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.revenue));

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
        {OVERVIEW_STATS.map((stat, index) => (
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-moulna-gold" />
              Revenue Overview
            </h2>
            <Badge variant="secondary">Monthly</Badge>
          </div>

          <div className="flex items-end justify-between gap-4 h-64">
            {REVENUE_DATA.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1">
                  <span className="text-xs font-medium">
                    AED {(data.revenue / 1000).toFixed(0)}K
                  </span>
                  <motion.div
                    className="w-full bg-moulna-gold/80 rounded-t hover:bg-moulna-gold transition-colors cursor-pointer"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.revenue / maxRevenue) * 180}px` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  />
                </div>
                <span className="text-sm font-medium">{data.month}</span>
              </div>
            ))}
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
            {TOP_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{category.name}</span>
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
                  AED {category.sales.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Platform Metrics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold flex items-center gap-2">
            <Eye className="w-5 h-5 text-moulna-gold" />
            Platform Metrics
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {PLATFORM_METRICS.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 bg-muted/50 rounded-lg"
            >
              <p className="text-3xl font-bold mb-1">{metric.value}</p>
              <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
              <Badge
                variant="secondary"
                className={cn(
                  metric.change.startsWith("+")
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                )}
              >
                {metric.change}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>

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
                <span>Revenue is up 18.5% compared to last month - best performance this quarter!</span>
              </li>
              <li className="flex items-start gap-2">
                <Store className="w-4 h-4 text-purple-600 mt-0.5" />
                <span>45 new sellers joined this month, expanding product variety.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowDownRight className="w-4 h-4 text-orange-600 mt-0.5" />
                <span>Conversion rate slightly decreased - consider optimizing listing visibility.</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
