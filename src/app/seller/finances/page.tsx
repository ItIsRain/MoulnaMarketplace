"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, formatAED, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Wallet, DollarSign, TrendingUp, Calendar,
  ArrowUpRight, ChevronRight, BarChart3
} from "lucide-react";

const SALES_SUMMARY = {
  totalRevenue: 1275000,
  thisMonth: 382500,
  salesCount: 14,
  thisMonthCount: 4,
  averageSalePrice: 91071,
};

const RECENT_SALES = [
  {
    id: "sale_1",
    buyer: { name: "Layla H.", avatar: "layla-h" },
    listing: "Premium Oud Gift Set",
    salePrice: 82000,
    date: "2024-02-09",
  },
  {
    id: "sale_2",
    buyer: { name: "Mohammed A.", avatar: "mohammed-a" },
    listing: "Arabian Oud Perfume - 100ml",
    salePrice: 45000,
    date: "2024-02-07",
  },
  {
    id: "sale_3",
    buyer: { name: "Sara A.", avatar: "sara-a" },
    listing: "Amber & Musk Blend",
    salePrice: 35000,
    date: "2024-02-01",
  },
  {
    id: "sale_4",
    buyer: { name: "Ahmed K.", avatar: "ahmed-k" },
    listing: "Royal Oud Collection - 50ml",
    salePrice: 45000,
    date: "2024-01-28",
  },
  {
    id: "sale_5",
    buyer: { name: "Fatima M.", avatar: "fatima-m" },
    listing: "Rose Oud Mist",
    salePrice: 28000,
    date: "2024-01-22",
  },
  {
    id: "sale_6",
    buyer: { name: "Khalid R.", avatar: "khalid-r" },
    listing: "Home Fragrance Diffuser",
    salePrice: 22000,
    date: "2024-01-15",
  },
];

export default function SellerFinancesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <Wallet className="w-6 h-6" />
          Finances
        </h1>
        <p className="text-muted-foreground">
          Track your sales revenue from completed transactions
        </p>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Sales",
            value: formatAED(SALES_SUMMARY.totalRevenue),
            subtext: `${SALES_SUMMARY.salesCount} sales`,
            icon: DollarSign,
            color: "text-emerald-500",
          },
          {
            label: "This Month",
            value: formatAED(SALES_SUMMARY.thisMonth),
            subtext: `${SALES_SUMMARY.thisMonthCount} sales`,
            icon: Calendar,
            color: "text-blue-500",
          },
          {
            label: "Avg. Sale Price",
            value: formatAED(SALES_SUMMARY.averageSalePrice),
            subtext: "Per transaction",
            icon: TrendingUp,
            color: "text-purple-500",
          },
          {
            label: "Growth",
            value: "+18.4%",
            subtext: "vs. last month",
            icon: ArrowUpRight,
            color: "text-moulna-gold",
          },
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
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Sales Table */}
      <Card>
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-semibold">Recent Sales</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/seller/analytics">
              <BarChart3 className="w-4 h-4 me-2" />
              View Analytics
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Buyer</th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Listing</th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Sale Price</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_SALES.map((sale, index) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b last:border-0 hover:bg-muted/50"
                >
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatDate(sale.date)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <DiceBearAvatar seed={sale.buyer.avatar} size="sm" />
                      <span className="text-sm font-medium">{sale.buyer.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{sale.listing}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-moulna-gold">
                      {formatAED(sale.salePrice)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Info note */}
      <Card className="p-4 bg-moulna-gold/5 border-moulna-gold/20">
        <p className="text-sm text-muted-foreground">
          Revenue is based on sales you&apos;ve reported by marking inquiries as sold. To record a new sale,
          go to{" "}
          <Link href="/seller/orders" className="text-moulna-gold hover:underline font-medium">
            Inquiries
          </Link>{" "}
          and use the &ldquo;Mark as Sold&rdquo; action.
        </p>
      </Card>
    </div>
  );
}
