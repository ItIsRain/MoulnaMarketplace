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
  Users, MessageSquare, Store, DollarSign, TrendingUp,
  CheckCircle, Clock, Package, Flag, ArrowUpRight,
  Activity, Eye, Shield, Loader2
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  activeProducts: number;
  pendingProducts: number;
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
  new: "bg-blue-400",
  replied: "bg-emerald-400",
  sold: "bg-purple-400",
  archived: "bg-gray-300",
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-moulna-gold" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const stats = data?.stats;

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers?.toLocaleString() ?? "0",
      icon: Users,
      gradient: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Active Sellers",
      value: stats?.totalSellers?.toLocaleString() ?? "0",
      icon: Store,
      gradient: "from-emerald-500/10 to-emerald-600/5",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Total Inquiries",
      value: stats?.totalConversations?.toLocaleString() ?? "0",
      icon: MessageSquare,
      gradient: "from-violet-500/10 to-violet-600/5",
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
    },
    {
      label: "Revenue (MTD)",
      value: stats ? formatAED(stats.monthlyRevenue) : "AED 0.00",
      icon: DollarSign,
      gradient: "from-moulna-gold/10 to-amber-500/5",
      iconColor: "text-moulna-gold",
      iconBg: "bg-moulna-gold/10",
    },
  ];

  const secondaryStats = [
    { label: "Total Products", value: stats?.totalProducts?.toLocaleString() ?? "0", icon: Package, color: "text-orange-500" },
    { label: "Active Products", value: stats?.activeProducts?.toLocaleString() ?? "0", icon: CheckCircle, color: "text-emerald-500" },
    { label: "Monthly Inquiries", value: stats?.monthlyConversations?.toLocaleString() ?? "0", icon: TrendingUp, color: "text-indigo-500" },
    { label: "Pending KYC", value: stats?.pendingKyc?.toLocaleString() ?? "0", icon: Shield, color: "text-amber-500" },
  ];

  const pendingActions = [
    {
      type: "seller",
      title: "KYC Applications Pending",
      count: stats?.pendingKyc ?? 0,
      icon: Store,
      color: "text-blue-500",
      link: "/admin/sellers?status=pending",
    },
    {
      type: "product",
      title: "Products Pending Review",
      count: stats?.pendingProducts ?? 0,
      icon: Package,
      color: "text-orange-500",
      link: "/admin/products?status=pending",
    },
  ];

  const topSellers = data?.topSellers ?? [];
  const recentActivity = data?.recentActivity ?? [];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back! Here&apos;s what&apos;s happening on Moulna today.
        </p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className={cn("relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow")}>
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", stat.gradient)} />
              <div className="relative p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", stat.iconBg)}>
                    <stat.icon className={cn("w-[18px] h-[18px]", stat.iconColor)} />
                  </div>
                </div>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {secondaryStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <Card className="px-4 py-3 border-border/60 shadow-sm">
              <div className="flex items-center gap-3">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                <div className="flex items-baseline gap-2 flex-1">
                  <span className="text-lg font-bold">{stat.value}</span>
                  <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Pending Actions */}
        <Card className="border-border/60 shadow-sm">
          <div className="px-5 pt-5 pb-4 border-b border-border/60">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-moulna-gold" />
              Pending Actions
            </h2>
          </div>
          <div className="p-3">
            {pendingActions.map((action, index) => (
              <motion.div
                key={action.type}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
              >
                <Link
                  href={action.link}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <action.icon className={cn("w-4 h-4", action.color)} />
                    <span className="text-[13px]">{action.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-bold text-xs tabular-nums">
                      {action.count}
                    </Badge>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <div className="px-5 pt-5 pb-4 border-b border-border/60 flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-moulna-gold" />
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7" asChild>
              <Link href="/admin/orders">
                View All
                <ArrowUpRight className="w-3 h-3 ms-1" />
              </Link>
            </Button>
          </div>
          <div className="p-3">
            {recentActivity.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Activity className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No recent activity yet.</p>
              </div>
            )}
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.04 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/40 transition-colors"
              >
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    STATUS_COLOR_MAP[activity.status] ?? "bg-gray-300"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] truncate">
                    <span className="font-medium">{activity.product}</span>
                    <span className="text-muted-foreground">
                      {" "}&mdash; {activity.buyer} &rarr; {activity.seller}
                    </span>
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground flex-shrink-0">
                  {formatDate(activity.createdAt)}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top Sellers */}
        <Card className="border-border/60 shadow-sm">
          <div className="px-5 pt-5 pb-4 border-b border-border/60 flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Store className="w-4 h-4 text-moulna-gold" />
              Top Sellers
            </h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7" asChild>
              <Link href="/admin/sellers">
                View All
                <ArrowUpRight className="w-3 h-3 ms-1" />
              </Link>
            </Button>
          </div>
          <div className="p-3">
            {topSellers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Store className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No sellers yet.</p>
              </div>
            )}
            {topSellers.map((seller, index) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-muted-foreground tabular-nums">
                    {index + 1}
                  </span>
                  <DiceBearAvatar
                    seed={seller.avatarSeed}
                    style={seller.avatarStyle}
                    size="sm"
                  />
                  <span className="text-[13px] font-medium">{seller.name}</span>
                </div>
                <div className="text-end">
                  <p className="text-[13px] font-bold tabular-nums">{seller.totalListings}</p>
                  <p className="text-[11px] text-muted-foreground">{seller.followerCount} followers</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/60 shadow-sm">
          <div className="px-5 pt-5 pb-4 border-b border-border/60">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4 text-moulna-gold" />
              Quick Actions
            </h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { href: "/admin/users", icon: Users, label: "Manage Users", color: "text-blue-500" },
              { href: "/admin/sellers", icon: Store, label: "Manage Sellers", color: "text-emerald-500" },
              { href: "/admin/products", icon: Package, label: "Review Products", color: "text-orange-500" },
              { href: "/admin/reports", icon: Flag, label: "View Reports", color: "text-red-500" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2.5 p-5 rounded-xl border border-border/60 hover:border-moulna-gold/30 hover:bg-moulna-gold/[0.03] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-muted/80 group-hover:bg-moulna-gold/10 flex items-center justify-center transition-colors">
                  <action.icon className={cn("w-5 h-5", action.color, "group-hover:text-moulna-gold transition-colors")} />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
