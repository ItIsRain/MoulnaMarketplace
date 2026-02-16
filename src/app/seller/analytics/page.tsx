"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign,
  MessageSquare, Eye, Users, Package, ArrowUpRight,
  ArrowDownRight, Calendar
} from "lucide-react";

const STATS = {
  revenue: {
    current: 1275000,
    previous: 1180000,
    trend: 8.1,
  },
  inquiries: {
    current: 156,
    previous: 142,
    trend: 9.9,
  },
  views: {
    current: 4250,
    previous: 4580,
    trend: -7.2,
  },
  conversionRate: {
    current: 3.67,
    previous: 3.1,
    trend: 18.4,
  },
};

const TOP_PRODUCTS = [
  { rank: 1, title: "Arabian Oud Perfume - 100ml", inquiries: 124, views: 558000, trend: 15 },
  { rank: 2, title: "Rose Oud Mist", inquiries: 89, views: 249200, trend: 8 },
  { rank: 3, title: "Premium Oud Gift Set", inquiries: 45, views: 382500, trend: -3 },
  { rank: 4, title: "Amber & Musk Blend", inquiries: 67, views: 234500, trend: 12 },
  { rank: 5, title: "Home Fragrance Diffuser", inquiries: 42, views: 92400, trend: 25 },
];

const REVENUE_DATA = [
  { day: "Mon", revenue: 180000 },
  { day: "Tue", revenue: 210000 },
  { day: "Wed", revenue: 195000 },
  { day: "Thu", revenue: 240000 },
  { day: "Fri", revenue: 280000 },
  { day: "Sat", revenue: 320000 },
  { day: "Sun", revenue: 250000 },
];

const TRAFFIC_SOURCES = [
  { source: "Direct", visits: 1850, percentage: 43.5 },
  { source: "Search", visits: 1275, percentage: 30.0 },
  { source: "Social Media", visits: 680, percentage: 16.0 },
  { source: "Referrals", visits: 445, percentage: 10.5 },
];

export default function SellerAnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState("7d");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-6 h-6" />
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your shop performance and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d", "1y"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-moulna-gold hover:bg-moulna-gold-dark" : ""}
            >
              {range === "7d" && "7 Days"}
              {range === "30d" && "30 Days"}
              {range === "90d" && "90 Days"}
              {range === "1y" && "1 Year"}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Sales Revenue", value: formatAED(STATS.revenue.current), icon: DollarSign, ...STATS.revenue, color: "text-emerald-500" },
          { label: "Inquiries", value: STATS.inquiries.current, icon: MessageSquare, ...STATS.inquiries, color: "text-blue-500" },
          { label: "Shop Views", value: STATS.views.current.toLocaleString(), icon: Eye, ...STATS.views, color: "text-purple-500" },
          { label: "Sold Rate", value: `${STATS.conversionRate.current}%`, icon: TrendingUp, ...STATS.conversionRate, color: "text-moulna-gold" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={cn(
                  "flex items-center text-sm font-medium",
                  stat.trend >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {stat.trend >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(stat.trend)}%
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="font-semibold mb-6">Sales Revenue Overview</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {REVENUE_DATA.map((day, index) => {
              const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.revenue));
              const height = (day.revenue / maxRevenue) * 100;

              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-moulna-gold/20 hover:bg-moulna-gold/30 transition-colors rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-moulna-charcoal text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatAED(day.revenue)}
                    </div>
                  </motion.div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">Based on your marked-as-sold listings</p>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h2 className="font-semibold mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {TRAFFIC_SOURCES.map((source, index) => (
              <motion.div
                key={source.source}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{source.source}</span>
                  <span className="text-sm text-muted-foreground">
                    {source.visits.toLocaleString()} ({source.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${source.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="h-full bg-moulna-gold"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Top Performing Listings</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-start pb-3 text-sm font-medium text-muted-foreground">Rank</th>
                <th className="text-start pb-3 text-sm font-medium text-muted-foreground">Listing</th>
                <th className="text-start pb-3 text-sm font-medium text-muted-foreground">Inquiries</th>
                <th className="text-start pb-3 text-sm font-medium text-muted-foreground">Views</th>
                <th className="text-start pb-3 text-sm font-medium text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((product, index) => (
                <motion.tr
                  key={product.rank}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b last:border-0"
                >
                  <td className="py-4">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      product.rank === 1 && "bg-yellow-100 text-yellow-700",
                      product.rank === 2 && "bg-gray-100 text-gray-700",
                      product.rank === 3 && "bg-amber-100 text-amber-700",
                      product.rank > 3 && "bg-muted text-muted-foreground"
                    )}>
                      {product.rank}
                    </span>
                  </td>
                  <td className="py-4 font-medium">{product.title}</td>
                  <td className="py-4">{product.inquiries}</td>
                  <td className="py-4">{product.views.toLocaleString()}</td>
                  <td className="py-4">
                    <div className={cn(
                      "flex items-center text-sm font-medium",
                      product.trend >= 0 ? "text-emerald-600" : "text-red-600"
                    )}>
                      {product.trend >= 0 ? (
                        <TrendingUp className="w-4 h-4 me-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 me-1" />
                      )}
                      {Math.abs(product.trend)}%
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Insights */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="font-semibold mb-6">Customer Demographics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">By Location</p>
              <div className="space-y-2">
                {[
                  { location: "Dubai", percentage: 45 },
                  { location: "Abu Dhabi", percentage: 25 },
                  { location: "Sharjah", percentage: 15 },
                  { location: "Other Emirates", percentage: 15 },
                ].map((item) => (
                  <div key={item.location}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.location}</span>
                      <span className="text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-moulna-gold"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-6">Customer Types</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <p className="text-3xl font-bold text-emerald-600">68%</p>
              <p className="text-sm text-muted-foreground">New Customers</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-3xl font-bold text-blue-600">32%</p>
              <p className="text-sm text-muted-foreground">Returning</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Inquiries per Listing</span>
              <span className="font-bold">18</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Repeat Rate</span>
              <span className="font-bold">24%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
