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
  ArrowDownRight, Loader2
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

export default function SellerAnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<AnalyticsStats | null>(null);
  const [topProducts, setTopProducts] = React.useState<TopProduct[]>([]);

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/seller/analytics?period=${timeRange}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setStats(data.stats);
          setTopProducts(data.topProducts || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  const s = stats || {
    totalListings: 0, activeListings: 0, totalInquiries: 0, currentInquiries: 0,
    inquiryTrend: 0, totalViews: 0, totalFollowers: 0, newFollowers: 0,
    followerTrend: 0, soldCount: 0, totalRevenue: 0, conversionRate: 0,
    unreadMessages: 0, rating: 0, reviewCount: 0,
  };

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
          { label: "Sales Revenue", value: formatAED(s.totalRevenue), icon: DollarSign, trend: 0, color: "text-emerald-500" },
          { label: "Inquiries", value: s.totalInquiries, icon: MessageSquare, trend: s.inquiryTrend, color: "text-blue-500" },
          { label: "Shop Views", value: s.totalViews.toLocaleString(), icon: Eye, trend: 0, color: "text-purple-500" },
          { label: "Sold Rate", value: `${s.conversionRate}%`, icon: TrendingUp, trend: 0, color: "text-moulna-gold" },
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
                {stat.trend !== 0 && (
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
                )}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Key Stats */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="font-semibold mb-6">Performance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Package className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{s.activeListings}</p>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{s.currentInquiries}</p>
              <p className="text-sm text-muted-foreground">New Inquiries ({timeRange})</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
              <p className="text-2xl font-bold">{s.soldCount}</p>
              <p className="text-sm text-muted-foreground">Items Sold</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Users className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{s.totalFollowers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Eye className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <p className="text-2xl font-bold">{s.totalViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-moulna-gold" />
              <p className="text-2xl font-bold">{s.rating > 0 ? s.rating.toFixed(1) : "-"}</p>
              <p className="text-sm text-muted-foreground">Shop Rating ({s.reviewCount} reviews)</p>
            </div>
          </div>
        </Card>

        {/* Follower Growth */}
        <Card className="p-6">
          <h2 className="font-semibold mb-6">Growth</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">New Followers</span>
                <span className="text-sm text-muted-foreground">
                  +{s.newFollowers} this period
                </span>
              </div>
              {s.followerTrend !== 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    s.followerTrend >= 0
                      ? "text-green-600 bg-green-100"
                      : "text-red-600 bg-red-100"
                  )}
                >
                  {s.followerTrend >= 0 ? (
                    <ArrowUpRight className="w-3 h-3 me-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 me-1" />
                  )}
                  {Math.abs(s.followerTrend)}% vs previous
                </Badge>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Inquiry Trend</span>
              </div>
              {s.inquiryTrend !== 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    s.inquiryTrend >= 0
                      ? "text-green-600 bg-green-100"
                      : "text-red-600 bg-red-100"
                  )}
                >
                  {s.inquiryTrend >= 0 ? (
                    <ArrowUpRight className="w-3 h-3 me-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 me-1" />
                  )}
                  {Math.abs(s.inquiryTrend)}% vs previous
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Top Performing Listings</h2>
        </div>
        {topProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No listings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-start pb-3 text-sm font-medium text-muted-foreground">Rank</th>
                  <th className="text-start pb-3 text-sm font-medium text-muted-foreground">Listing</th>
                  <th className="text-start pb-3 text-sm font-medium text-muted-foreground">Inquiries</th>
                  <th className="text-start pb-3 text-sm font-medium text-muted-foreground">Views</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
