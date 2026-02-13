"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, TrendingUp, TrendingDown, Calendar, Download,
  CreditCard, ArrowUpRight, ArrowDownRight, Wallet, Building,
  Receipt, PieChart
} from "lucide-react";

const FINANCE_STATS = [
  {
    label: "Total Revenue",
    value: "AED 1.24M",
    change: "+18.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    label: "Platform Fees",
    value: "AED 124,000",
    change: "+15.2%",
    trend: "up",
    icon: Receipt,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Pending Payouts",
    value: "AED 45,600",
    change: "-8.3%",
    trend: "down",
    icon: Wallet,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    label: "Active Sellers",
    value: "456",
    change: "+12",
    trend: "up",
    icon: Building,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

const REVENUE_BY_CATEGORY = [
  { category: "Fragrances", revenue: 456000, percentage: 37 },
  { category: "Handmade Crafts", revenue: 278000, percentage: 22 },
  { category: "Jewelry", revenue: 234000, percentage: 19 },
  { category: "Traditional Wear", revenue: 156000, percentage: 13 },
  { category: "Home Decor", revenue: 116000, percentage: 9 },
];

const RECENT_TRANSACTIONS = [
  {
    id: "TXN-001",
    type: "fee",
    description: "Commission - Arabian Scents Boutique",
    amount: 450,
    date: "Mar 13, 2024",
  },
  {
    id: "TXN-002",
    type: "payout",
    description: "Payout - Dubai Crafts Co.",
    amount: -3200,
    date: "Mar 13, 2024",
  },
  {
    id: "TXN-003",
    type: "fee",
    description: "Commission - Emirates Artisan",
    amount: 320,
    date: "Mar 13, 2024",
  },
  {
    id: "TXN-004",
    type: "refund",
    description: "Refund processing - Order #8890",
    amount: -150,
    date: "Mar 12, 2024",
  },
  {
    id: "TXN-005",
    type: "fee",
    description: "Commission - Pearl Boutique",
    amount: 280,
    date: "Mar 12, 2024",
  },
];

export default function AdminFinancesPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Financial Overview</h1>
          </div>
          <p className="text-muted-foreground">
            Platform revenue, fees, and payouts
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
        {FINANCE_STATS.map((stat, index) => (
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
        {/* Revenue by Category */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Revenue by Category</h2>
          </div>
          <div className="space-y-4">
            {REVENUE_BY_CATEGORY.map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-sm text-muted-foreground">
                    AED {cat.revenue.toLocaleString()}
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

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-moulna-gold" />
              <h2 className="font-semibold">Recent Transactions</h2>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {RECENT_TRANSACTIONS.map((txn, index) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      txn.type === "fee" && "bg-green-100",
                      txn.type === "payout" && "bg-blue-100",
                      txn.type === "refund" && "bg-red-100"
                    )}
                  >
                    {txn.type === "fee" && (
                      <DollarSign className="w-4 h-4 text-green-600" />
                    )}
                    {txn.type === "payout" && (
                      <Wallet className="w-4 h-4 text-blue-600" />
                    )}
                    {txn.type === "refund" && (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{txn.description}</p>
                    <p className="text-xs text-muted-foreground">{txn.date}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "font-bold",
                    txn.amount >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {txn.amount >= 0 ? "+" : ""}AED {Math.abs(txn.amount)}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Payout Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Payout Summary</h2>
          </div>
          <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
            Process Payouts
          </Button>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">AED 45,600</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">Sellers Awaiting</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">Mar 15</p>
            <p className="text-sm text-muted-foreground">Next Payout Date</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">AED 890K</p>
            <p className="text-sm text-muted-foreground">Total Paid (YTD)</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
