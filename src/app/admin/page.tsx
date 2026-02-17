"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, formatAED, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Users, MessageSquare, Store, DollarSign, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, Clock, Package, Flag, ArrowUpRight,
  Activity, Eye, Shield, Loader2
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  activeProducts: number;
  totalConversations: number;
  monthlyConversations: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingKyc: number;
}

interface TopSeller {
  id: string;
  name: string;
  slug: string;
  avatarStyle: string;
  avatarSeed: string;
  totalListings: number;
  followerCount: number;
  rating: number;
}

interface RecentActivityItem {
  id: string;
  buyer: string;
  seller: string;
  product: string;
  status: "new" | "replied" | "sold" | "archived";
  createdAt: string;
}

interface AdminData {
  stats: AdminStats;
  topSellers: TopSeller[];
  recentActivity: RecentActivityItem[];
}

const STATUS_COLOR_MAP: Record<string, string> = {
  new: "bg-blue-500",
  replied: "bg-green-500",
  sold: "bg-purple-500",
  archived: "bg-gray-400",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch admin stats");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  const stats = data?.stats;

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers?.toLocaleString() ?? "0",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Active Sellers",
      value: stats?.totalSellers?.toLocaleString() ?? "0",
      icon: Store,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Total Inquiries",
      value: stats?.totalConversations?.toLocaleString() ?? "0",
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Revenue (MTD)",
      value: stats ? formatAED(stats.monthlyRevenue) : "AED 0.00",
      icon: DollarSign,
      color: "text-moulna-gold",
      bg: "bg-moulna-gold/10",
    },
  ];

  const pendingActions = [
    {
      type: "seller",
      title: "KYC Applications Pending",
      count: stats?.pendingKyc ?? 0,
      icon: Store,
      color: "text-blue-600",
      link: "/admin/sellers?status=pending",
    },
    {
      type: "product",
      title: "Products Pending Review",
      count: 0,
      icon: Package,
      color: "text-orange-600",
      link: "/admin/products?status=pending",
    },
    {
      type: "report",
      title: "Reported Items",
      count: 0,
      icon: Flag,
      color: "text-red-600",
      link: "/admin/reports",
    },
    {
      type: "dispute",
      title: "Open Disputes",
      count: 0,
      icon: AlertCircle,
      color: "text-yellow-600",
      link: "/admin/disputes",
    },
  ];

  const topSellers = data?.topSellers ?? [];
  const recentActivity = data?.recentActivity ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-moulna-gold" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening on Moulna today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
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

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Pending Actions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-moulna-gold" />
              Pending Actions
            </h2>
          </div>
          <div className="space-y-4">
            {pendingActions.map((action, index) => (
              <motion.div
                key={action.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={action.link}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <action.icon className={cn("w-5 h-5", action.color)} />
                    <span className="text-sm">{action.title}</span>
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {action.count}
                  </Badge>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-moulna-gold" />
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity yet.
              </p>
            )}
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    STATUS_COLOR_MAP[activity.status] ?? "bg-gray-400"
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Inquiry about {activity.product}</span>
                    {" - "}
                    <span className="text-muted-foreground">
                      {activity.buyer} &rarr; {activity.seller}
                    </span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(activity.createdAt)}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Sellers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold flex items-center gap-2">
              <Store className="w-5 h-5 text-moulna-gold" />
              Top Sellers (This Month)
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/sellers">
                View All
                <ArrowUpRight className="w-4 h-4 ms-1" />
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {topSellers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No sellers yet.
              </p>
            )}
            {topSellers.map((seller, index) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <DiceBearAvatar
                    seed={seller.avatarSeed}
                    style={seller.avatarStyle}
                    size="sm"
                  />
                  <span className="font-medium">{seller.name}</span>
                </div>
                <div className="text-end">
                  <p className="font-bold">{seller.totalListings} listings</p>
                  <p className="text-xs text-muted-foreground">
                    {seller.followerCount} followers
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="font-semibold flex items-center gap-2 mb-6">
            <Eye className="w-5 h-5 text-moulna-gold" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link href="/admin/users">
                <Users className="w-6 h-6 mb-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link href="/admin/sellers">
                <Store className="w-6 h-6 mb-2" />
                Manage Sellers
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link href="/admin/products">
                <Package className="w-6 h-6 mb-2" />
                Review Products
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link href="/admin/reports">
                <Flag className="w-6 h-6 mb-2" />
                View Reports
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
