"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Users, MessageSquare, Store, DollarSign, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, Clock, Package, Flag, ArrowUpRight,
  Activity, Eye, Shield
} from "lucide-react";

const STATS = [
  {
    label: "Total Users",
    value: "12,456",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Active Sellers",
    value: "456",
    change: "+12.5%",
    trend: "up",
    icon: Store,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    label: "Total Inquiries",
    value: "8,234",
    change: "+15.3%",
    trend: "up",
    icon: MessageSquare,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    label: "Revenue (MTD)",
    value: "AED 234,500",
    change: "+22.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-moulna-gold",
    bg: "bg-moulna-gold/10",
  },
];

const PENDING_ACTIONS = [
  {
    type: "seller",
    title: "New Seller Applications",
    count: 12,
    icon: Store,
    color: "text-blue-600",
    link: "/admin/sellers?status=pending",
  },
  {
    type: "product",
    title: "Products Pending Review",
    count: 34,
    icon: Package,
    color: "text-orange-600",
    link: "/admin/products?status=pending",
  },
  {
    type: "report",
    title: "Reported Items",
    count: 8,
    icon: Flag,
    color: "text-red-600",
    link: "/admin/reports",
  },
  {
    type: "dispute",
    title: "Open Disputes",
    count: 5,
    icon: AlertCircle,
    color: "text-yellow-600",
    link: "/admin/disputes",
  },
];

const RECENT_ACTIVITY = [
  {
    action: "New seller approved",
    subject: "Arabian Scents Boutique",
    time: "5 minutes ago",
    type: "success",
  },
  {
    action: "Product flagged for review",
    subject: "Premium Oud Set",
    time: "15 minutes ago",
    type: "warning",
  },
  {
    action: "User account suspended",
    subject: "john.doe@email.com",
    time: "1 hour ago",
    type: "error",
  },
  {
    action: "Dispute resolved",
    subject: "Inquiry #MN-2024-8923",
    time: "2 hours ago",
    type: "success",
  },
  {
    action: "New category created",
    subject: "Traditional Crafts",
    time: "3 hours ago",
    type: "info",
  },
];

const TOP_SELLERS = [
  { name: "Arabian Scents", avatar: "arabian-scents", revenue: 45230, inquiries: 156 },
  { name: "Dubai Crafts", avatar: "dubai-crafts", revenue: 38900, inquiries: 134 },
  { name: "Emirates Artisan", avatar: "emirates-artisan", revenue: 32100, inquiries: 98 },
  { name: "Pearl Boutique", avatar: "pearl-boutique", revenue: 28500, inquiries: 87 },
];

export default function AdminDashboardPage() {
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
        {STATS.map((stat, index) => (
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
                    <TrendingUp className="w-3 h-3 me-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 me-1" />
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
            {PENDING_ACTIONS.map((action, index) => (
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
            {RECENT_ACTIVITY.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    activity.type === "success" && "bg-green-500",
                    activity.type === "warning" && "bg-yellow-500",
                    activity.type === "error" && "bg-red-500",
                    activity.type === "info" && "bg-blue-500"
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.action}</span>
                    {" - "}
                    <span className="text-muted-foreground">{activity.subject}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
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
            {TOP_SELLERS.map((seller, index) => (
              <motion.div
                key={seller.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <DiceBearAvatar seed={seller.avatar} size="sm" />
                  <span className="font-medium">{seller.name}</span>
                </div>
                <div className="text-end">
                  <p className="font-bold">AED {seller.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{seller.inquiries} inquiries</p>
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
