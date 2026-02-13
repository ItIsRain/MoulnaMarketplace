"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight,
  ArrowDownRight, CreditCard, Building, Calendar,
  Download, Filter, ChevronRight, DollarSign,
  Clock, CheckCircle, AlertCircle
} from "lucide-react";

const STATS = [
  {
    label: "Available Balance",
    value: "AED 12,450",
    change: "+12%",
    trend: "up",
    icon: Wallet,
    color: "text-green-500",
  },
  {
    label: "Pending Balance",
    value: "AED 3,280",
    change: "3 orders",
    trend: "neutral",
    icon: Clock,
    color: "text-orange-500",
  },
  {
    label: "This Month",
    value: "AED 8,920",
    change: "+18%",
    trend: "up",
    icon: TrendingUp,
    color: "text-blue-500",
  },
  {
    label: "Total Earnings",
    value: "AED 145,680",
    change: "All time",
    trend: "neutral",
    icon: DollarSign,
    color: "text-moulna-gold",
  },
];

const TRANSACTIONS = [
  {
    id: "1",
    type: "sale",
    description: "Order #MOU-2401-1234",
    amount: 450,
    fee: 45,
    net: 405,
    status: "completed",
    date: "2024-01-15",
    customer: "Fatima Al Zahra",
  },
  {
    id: "2",
    type: "withdrawal",
    description: "Bank Transfer - Emirates NBD",
    amount: -5000,
    fee: 0,
    net: -5000,
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "3",
    type: "sale",
    description: "Order #MOU-2401-1198",
    amount: 890,
    fee: 89,
    net: 801,
    status: "pending",
    date: "2024-01-14",
    customer: "Ahmed Hassan",
  },
  {
    id: "4",
    type: "refund",
    description: "Order #MOU-2401-1156 Refund",
    amount: -120,
    fee: 12,
    net: -108,
    status: "completed",
    date: "2024-01-13",
  },
  {
    id: "5",
    type: "sale",
    description: "Order #MOU-2401-1145",
    amount: 320,
    fee: 32,
    net: 288,
    status: "completed",
    date: "2024-01-12",
    customer: "Sara Abdullah",
  },
];

const PAYOUT_METHODS = [
  {
    id: "1",
    type: "bank",
    name: "Emirates NBD",
    details: "****4521",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    name: "Visa Debit",
    details: "****8834",
    isDefault: false,
  },
];

export default function SellerFinancesPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("month");

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Finances</h1>
            <p className="text-muted-foreground">
              Track your earnings, payouts, and transactions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 me-2" />
              Export
            </Button>
            <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
              <ArrowUpRight className="w-4 h-4 me-2" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  {stat.trend === "up" && (
                    <Badge variant="outline" className="text-green-600 bg-green-50">
                      <TrendingUp className="w-3 h-3 me-1" />
                      {stat.change}
                    </Badge>
                  )}
                  {stat.trend === "neutral" && (
                    <Badge variant="secondary">{stat.change}</Badge>
                  )}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Transactions */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold">Recent Transactions</h2>
                <div className="flex gap-2">
                  {["week", "month", "year"].map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                      className="capitalize"
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="divide-y">
                {TRANSACTIONS.map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        tx.type === "sale" && "bg-green-100 text-green-600",
                        tx.type === "withdrawal" && "bg-blue-100 text-blue-600",
                        tx.type === "refund" && "bg-red-100 text-red-600"
                      )}>
                        {tx.type === "sale" && <ArrowDownRight className="w-5 h-5" />}
                        {tx.type === "withdrawal" && <ArrowUpRight className="w-5 h-5" />}
                        {tx.type === "refund" && <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.customer && `${tx.customer} • `}
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className={cn(
                          "font-semibold",
                          tx.net > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {tx.net > 0 ? "+" : ""}AED {Math.abs(tx.net).toLocaleString()}
                        </p>
                        {tx.fee > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Fee: AED {tx.fee}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={tx.status === "completed" ? "default" : "secondary"}
                        className={tx.status === "completed" ? "bg-green-500" : ""}
                      >
                        {tx.status === "completed" && <CheckCircle className="w-3 h-3 me-1" />}
                        {tx.status === "pending" && <Clock className="w-3 h-3 me-1" />}
                        {tx.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t">
                <Button variant="ghost" className="w-full">
                  View All Transactions
                  <ChevronRight className="w-4 h-4 ms-1" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payout Methods */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Payout Methods</h2>
                <Button variant="ghost" size="sm">Add</Button>
              </div>
              <div className="space-y-3">
                {PAYOUT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {method.type === "bank" ? (
                        <Building className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.details}</p>
                    </div>
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Fee Breakdown */}
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Fee Breakdown</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Processing</span>
                  <span className="font-medium">2.9% + AED 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Withdrawal Fee</span>
                  <span className="font-medium">Free</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Level Discount</span>
                  <span className="font-medium text-green-600">-2%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Level up to unlock lower fees!
              </p>
            </Card>

            {/* Upcoming Payout */}
            <Card className="p-4 bg-gradient-to-br from-moulna-gold/10 to-transparent border-moulna-gold/20">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-moulna-gold" />
                <h2 className="font-semibold">Next Payout</h2>
              </div>
              <p className="text-2xl font-bold mb-1">AED 3,280</p>
              <p className="text-sm text-muted-foreground">
                Scheduled for January 20, 2024
              </p>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Request Early Payout
              </Button>
            </Card>
          </div>
        </div>
    </div>
  );
}
