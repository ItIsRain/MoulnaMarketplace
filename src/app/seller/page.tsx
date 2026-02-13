"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DailyChallengePanel } from "@/components/gamification/DailyChallenge";
import {
  Package, ShoppingBag, TrendingUp, Star, DollarSign,
  Eye, Users, Clock, ChevronRight, ArrowUpRight, ArrowDownRight,
  Sparkles, AlertCircle, CheckCircle
} from "lucide-react";

const STATS = {
  todayOrders: 5,
  todayRevenue: 127500,
  pendingShipments: 3,
  rating: 4.9,
  totalSales: 1250,
  totalProducts: 28,
  shopViews: 342,
  followers: 1847,
};

const TRENDS = {
  orders: 12.5,
  revenue: 8.3,
  views: -2.1,
  followers: 5.7,
};

const RECENT_ORDERS = [
  {
    id: "ord_1",
    customer: "Fatima M.",
    items: 2,
    total: 77000,
    status: "pending",
    date: "2 min ago",
  },
  {
    id: "ord_2",
    customer: "Ahmed K.",
    items: 1,
    total: 45000,
    status: "processing",
    date: "15 min ago",
  },
  {
    id: "ord_3",
    customer: "Sara A.",
    items: 3,
    total: 125000,
    status: "shipped",
    date: "1 hour ago",
  },
  {
    id: "ord_4",
    customer: "Khalid R.",
    items: 1,
    total: 32000,
    status: "delivered",
    date: "3 hours ago",
  },
];

const LOW_STOCK_PRODUCTS = [
  { id: "prd_1", title: "Arabian Oud Perfume - 50ml", stock: 2 },
  { id: "prd_2", title: "Rose Oud Mist", stock: 3 },
  { id: "prd_3", title: "Gift Set - Premium Collection", stock: 1 },
];

const SELLER_CHALLENGES = [
  { id: "ch_1", task: "Ship an order within 24 hours", xp: 50, icon: "📦", completed: true },
  { id: "ch_2", task: "List a new product", xp: 40, icon: "✨", completed: false },
  { id: "ch_3", task: "Respond to a customer message", xp: 20, icon: "💬", completed: false },
];

const statusConfig: Record<string, { label: string; variant: "pending" | "processing" | "shipped" | "delivered"; icon: React.ElementType }> = {
  pending: { label: "Pending", variant: "pending", icon: Clock },
  processing: { label: "Processing", variant: "processing", icon: Package },
  shipped: { label: "Shipped", variant: "shipped", icon: ShoppingBag },
  delivered: { label: "Delivered", variant: "delivered", icon: CheckCircle },
};

export default function SellerDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">
          Welcome back, Scent of Arabia!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your shop today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", value: STATS.todayOrders, icon: ShoppingBag, trend: TRENDS.orders, color: "text-blue-500" },
          { label: "Today's Revenue", value: formatAED(STATS.todayRevenue), icon: DollarSign, trend: TRENDS.revenue, color: "text-emerald-500" },
          { label: "Shop Views", value: STATS.shopViews, icon: Eye, trend: TRENDS.views, color: "text-purple-500" },
          { label: "Followers", value: STATS.followers.toLocaleString(), icon: Users, trend: TRENDS.followers, color: "text-moulna-gold" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                  <stat.icon className="w-4 h-4" />
                </div>
                {stat.trend !== undefined && (
                  <div className={cn(
                    "flex items-center text-xs font-medium",
                    stat.trend >= 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    {stat.trend >= 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Shipments Alert */}
          {STATS.pendingShipments > 0 && (
            <Card className="p-4 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">
                      {STATS.pendingShipments} order{STATS.pendingShipments > 1 ? 's' : ''} need shipping
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ship within 24h to earn bonus XP!
                    </p>
                  </div>
                </div>
                <Button variant="gold" size="sm" asChild>
                  <Link href="/seller/orders?status=pending">
                    Process Orders
                  </Link>
                </Button>
              </div>
            </Card>
          )}

          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Recent Orders</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/seller/orders">
                  View All <ChevronRight className="w-4 h-4 ms-1" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {RECENT_ORDERS.map((order, index) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={status.variant} className="p-2 rounded-lg">
                        <StatusIcon className="w-4 h-4" />
                      </Badge>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items} item{order.items > 1 ? 's' : ''} · {order.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="font-medium">{formatAED(order.total)}</p>
                      <Badge variant={status.variant} className="text-xs">
                        {status.label}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Performance Overview */}
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Performance Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{STATS.rating}</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{STATS.totalSales}</p>
                <p className="text-sm text-muted-foreground">Total Sales</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Package className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{STATS.totalProducts}</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-muted-foreground">On-time Ship</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Challenges */}
          <DailyChallengePanel challenges={SELLER_CHALLENGES} />

          {/* Low Stock Alert */}
          {LOW_STOCK_PRODUCTS.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Low Stock Alert
              </h3>
              <div className="space-y-3">
                {LOW_STOCK_PRODUCTS.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <p className="text-sm truncate flex-1 pe-2">{product.title}</p>
                    <Badge variant="warning">
                      {product.stock} left
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link href="/seller/products">
                  Manage Inventory
                </Link>
              </Button>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-transparent">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-moulna-gold" />
                <span className="text-3xl font-bold text-moulna-gold">15,420</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Total XP Earned</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">6</p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </div>
                <div>
                  <p className="text-xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Badges</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Tips to Boost Sales</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-moulna-gold">💡</span>
                <p className="text-muted-foreground">
                  Products with 5+ photos sell 3x more
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-moulna-gold">🚀</span>
                <p className="text-muted-foreground">
                  Respond to messages within 2 hours for better ratings
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-moulna-gold">⭐</span>
                <p className="text-muted-foreground">
                  Ship within 24h to earn Speed Demon badge
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
