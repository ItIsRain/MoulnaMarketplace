"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, CreditCard, Building, Calendar, Clock,
  CheckCircle, XCircle, Download, ArrowUpRight, Info,
  Wallet, TrendingUp
} from "lucide-react";

const PAYOUT_STATS = {
  available: 4520,
  pending: 1250,
  nextPayout: "Mar 20, 2024",
  totalPaid: 45230,
};

const PAYOUTS = [
  {
    id: "PO-001",
    amount: 3200,
    status: "completed",
    method: "Bank Transfer",
    account: "***4567",
    date: "Mar 15, 2024",
    reference: "MN-PAY-2024-0315",
  },
  {
    id: "PO-002",
    amount: 2800,
    status: "completed",
    method: "Bank Transfer",
    account: "***4567",
    date: "Mar 1, 2024",
    reference: "MN-PAY-2024-0301",
  },
  {
    id: "PO-003",
    amount: 4100,
    status: "completed",
    method: "Bank Transfer",
    account: "***4567",
    date: "Feb 15, 2024",
    reference: "MN-PAY-2024-0215",
  },
  {
    id: "PO-004",
    amount: 1900,
    status: "failed",
    method: "Bank Transfer",
    account: "***1234",
    date: "Feb 1, 2024",
    reference: "MN-PAY-2024-0201",
    failReason: "Invalid account details",
  },
  {
    id: "PO-005",
    amount: 3500,
    status: "completed",
    method: "Bank Transfer",
    account: "***4567",
    date: "Jan 15, 2024",
    reference: "MN-PAY-2024-0115",
  },
];

export default function SellerPayoutsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payouts</h1>
          <p className="text-muted-foreground">
            Track your earnings and payout history
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 me-2" />
            Export
          </Button>
          <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
            <Wallet className="w-4 h-4 me-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold">AED {PAYOUT_STATS.available.toLocaleString()}</p>
            </div>
          </div>
          <Button size="sm" className="w-full mt-2 bg-green-600 hover:bg-green-700">
            Withdraw
          </Button>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">AED {PAYOUT_STATS.pending.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Payout</p>
              <p className="text-2xl font-bold">{PAYOUT_STATS.nextPayout}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold">AED {PAYOUT_STATS.totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payout Method */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Payout Method</h2>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Emirates NBD</p>
            <p className="text-sm text-muted-foreground">Account ending in ***4567</p>
          </div>
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 me-1" />
            Verified
          </Badge>
        </div>
      </Card>

      {/* Payout Schedule */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Payout Schedule</h3>
            <p className="text-sm text-blue-800">
              Payouts are processed automatically every 15th and last day of the month.
              Funds from orders are available for payout after the 7-day holding period.
            </p>
          </div>
        </div>
      </Card>

      {/* Payout History */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="font-semibold">Payout History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-start p-4 font-medium">Payout ID</th>
                <th className="text-start p-4 font-medium">Amount</th>
                <th className="text-start p-4 font-medium">Method</th>
                <th className="text-start p-4 font-medium">Date</th>
                <th className="text-start p-4 font-medium">Status</th>
                <th className="text-end p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map((payout, index) => (
                <motion.tr
                  key={payout.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "border-b last:border-0 hover:bg-muted/30",
                    payout.status === "failed" && "bg-red-50/50"
                  )}
                >
                  <td className="p-4">
                    <div>
                      <p className="font-mono font-medium">{payout.id}</p>
                      <p className="text-xs text-muted-foreground">{payout.reference}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold">AED {payout.amount.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{payout.method}</p>
                        <p className="text-xs text-muted-foreground">{payout.account}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {payout.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      className={cn(
                        payout.status === "completed" && "bg-green-100 text-green-700",
                        payout.status === "pending" && "bg-yellow-100 text-yellow-700",
                        payout.status === "failed" && "bg-red-100 text-red-700"
                      )}
                    >
                      {payout.status === "completed" && <CheckCircle className="w-3 h-3 me-1" />}
                      {payout.status === "pending" && <Clock className="w-3 h-3 me-1" />}
                      {payout.status === "failed" && <XCircle className="w-3 h-3 me-1" />}
                      {payout.status}
                    </Badge>
                    {payout.failReason && (
                      <p className="text-xs text-red-600 mt-1">{payout.failReason}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      {payout.status === "failed" && (
                        <Button size="sm" variant="outline">
                          Retry
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
