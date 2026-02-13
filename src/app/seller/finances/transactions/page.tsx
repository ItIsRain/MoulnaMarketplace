"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Receipt, Search, Filter, Download, Calendar, ArrowUpRight,
  ArrowDownRight, ShoppingBag, RefreshCw, DollarSign, Package,
  Clock, CheckCircle
} from "lucide-react";

const TRANSACTIONS = [
  {
    id: "TXN-001",
    type: "sale",
    description: "Order #MN-2024-8923",
    product: "Premium Oud Collection Set",
    amount: 450,
    fee: 45,
    net: 405,
    status: "completed",
    date: "Mar 13, 2024",
    time: "2:34 PM",
  },
  {
    id: "TXN-002",
    type: "sale",
    description: "Order #MN-2024-8924",
    product: "Arabian Nights Perfume 100ml",
    amount: 320,
    fee: 32,
    net: 288,
    status: "completed",
    date: "Mar 13, 2024",
    time: "11:20 AM",
  },
  {
    id: "TXN-003",
    type: "refund",
    description: "Refund for Order #MN-2024-8890",
    product: "Traditional Bakhoor Set",
    amount: -150,
    fee: 0,
    net: -150,
    status: "completed",
    date: "Mar 12, 2024",
    time: "4:15 PM",
  },
  {
    id: "TXN-004",
    type: "payout",
    description: "Bi-weekly payout",
    product: null,
    amount: -3200,
    fee: 0,
    net: -3200,
    status: "completed",
    date: "Mar 15, 2024",
    time: "10:00 AM",
  },
  {
    id: "TXN-005",
    type: "sale",
    description: "Order #MN-2024-8925",
    product: "Luxury Oud Chips 50g",
    amount: 280,
    fee: 28,
    net: 252,
    status: "pending",
    date: "Mar 13, 2024",
    time: "9:45 AM",
  },
  {
    id: "TXN-006",
    type: "adjustment",
    description: "Commission adjustment - Artisan discount",
    product: null,
    amount: 15,
    fee: 0,
    net: 15,
    status: "completed",
    date: "Mar 10, 2024",
    time: "12:00 PM",
  },
];

const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "sale", label: "Sales" },
  { id: "refund", label: "Refunds" },
  { id: "payout", label: "Payouts" },
  { id: "adjustment", label: "Adjustments" },
];

const TYPE_STYLES = {
  sale: { icon: ShoppingBag, color: "text-green-600", bg: "bg-green-100" },
  refund: { icon: RefreshCw, color: "text-red-600", bg: "bg-red-100" },
  payout: { icon: DollarSign, color: "text-blue-600", bg: "bg-blue-100" },
  adjustment: { icon: Receipt, color: "text-purple-600", bg: "bg-purple-100" },
};

export default function SellerTransactionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            View all your financial transactions
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 me-2" />
          Export
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ArrowUpRight className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Income (MTD)</p>
              <p className="text-xl font-bold">AED 8,450</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ArrowDownRight className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Refunds (MTD)</p>
              <p className="text-xl font-bold">AED 150</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Receipt className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-muted-foreground">Fees (MTD)</p>
              <p className="text-xl font-bold">AED 845</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-moulna-gold" />
            <div>
              <p className="text-sm text-muted-foreground">Net (MTD)</p>
              <p className="text-xl font-bold">AED 7,455</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTER_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={selectedFilter === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(option.id)}
                className={cn(
                  selectedFilter === option.id &&
                    "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Button variant="outline">
            <Calendar className="w-4 h-4 me-2" />
            Date Range
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-start p-4 font-medium">Transaction</th>
                <th className="text-start p-4 font-medium">Type</th>
                <th className="text-end p-4 font-medium">Amount</th>
                <th className="text-end p-4 font-medium">Fee</th>
                <th className="text-end p-4 font-medium">Net</th>
                <th className="text-start p-4 font-medium">Status</th>
                <th className="text-start p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((txn, index) => {
                const typeStyle = TYPE_STYLES[txn.type as keyof typeof TYPE_STYLES];
                const TypeIcon = typeStyle?.icon || Receipt;

                return (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{txn.description}</p>
                        {txn.product && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {txn.product}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground font-mono">
                          {txn.id}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", typeStyle?.bg)}>
                          <TypeIcon className={cn("w-4 h-4", typeStyle?.color)} />
                        </div>
                        <span className="text-sm capitalize">{txn.type}</span>
                      </div>
                    </td>
                    <td className="p-4 text-end">
                      <span
                        className={cn(
                          "font-bold",
                          txn.amount >= 0 ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {txn.amount >= 0 ? "+" : ""}AED {Math.abs(txn.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-end text-muted-foreground">
                      {txn.fee > 0 ? `-AED ${txn.fee}` : "-"}
                    </td>
                    <td className="p-4 text-end">
                      <span
                        className={cn(
                          "font-bold",
                          txn.net >= 0 ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {txn.net >= 0 ? "+" : ""}AED {Math.abs(txn.net).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={cn(
                          txn.status === "completed" && "bg-green-100 text-green-700",
                          txn.status === "pending" && "bg-yellow-100 text-yellow-700"
                        )}
                      >
                        {txn.status === "completed" ? (
                          <CheckCircle className="w-3 h-3 me-1" />
                        ) : (
                          <Clock className="w-3 h-3 me-1" />
                        )}
                        {txn.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm">{txn.date}</p>
                        <p className="text-xs text-muted-foreground">{txn.time}</p>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing 1-6 of 156 transactions
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
