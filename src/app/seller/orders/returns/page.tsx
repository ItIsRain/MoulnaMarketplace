"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  RotateCcw, Search, Filter, Package, Clock, CheckCircle,
  XCircle, AlertTriangle, Eye, MessageSquare, RefreshCw,
  Truck, DollarSign
} from "lucide-react";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";

const RETURN_REQUESTS = [
  {
    id: "RET001",
    orderId: "ORD-2024-1234",
    customer: { name: "Sarah Ahmed", avatar: "sarah-ahmed" },
    product: "Premium Oud Collection Set",
    reason: "Item damaged during shipping",
    status: "pending",
    requestDate: "2024-01-15",
    amount: 450,
  },
  {
    id: "RET002",
    orderId: "ORD-2024-1198",
    customer: { name: "Mohammed Ali", avatar: "mohammed-ali" },
    product: "Handwoven Silk Abaya",
    reason: "Wrong size received",
    status: "approved",
    requestDate: "2024-01-14",
    amount: 890,
  },
  {
    id: "RET003",
    orderId: "ORD-2024-1156",
    customer: { name: "Fatima Hassan", avatar: "fatima-hassan" },
    product: "Arabic Calligraphy Set",
    reason: "Not as described",
    status: "in_transit",
    requestDate: "2024-01-12",
    amount: 280,
  },
  {
    id: "RET004",
    orderId: "ORD-2024-1089",
    customer: { name: "Ahmed Khalid", avatar: "ahmed-khalid" },
    product: "Traditional Dallah",
    reason: "Changed mind",
    status: "completed",
    requestDate: "2024-01-10",
    amount: 175,
  },
  {
    id: "RET005",
    orderId: "ORD-2024-1045",
    customer: { name: "Layla Omar", avatar: "layla-omar" },
    product: "Pearl Earrings Set",
    reason: "Defective product",
    status: "rejected",
    requestDate: "2024-01-08",
    amount: 320,
  },
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  in_transit: {
    label: "Return In Transit",
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
  },
  completed: {
    label: "Refunded",
    color: "bg-green-100 text-green-700",
    icon: DollarSign,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const TABS = [
  { id: "all", label: "All Returns", count: 5 },
  { id: "pending", label: "Pending", count: 1 },
  { id: "approved", label: "Approved", count: 1 },
  { id: "in_transit", label: "In Transit", count: 1 },
  { id: "completed", label: "Completed", count: 1 },
  { id: "rejected", label: "Rejected", count: 1 },
];

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredReturns = RETURN_REQUESTS.filter(ret => {
    const matchesTab = activeTab === "all" || ret.status === activeTab;
    const matchesSearch =
      ret.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.product.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <RotateCcw className="w-7 h-7 text-moulna-gold" />
            Returns & Refunds
          </h1>
          <p className="text-muted-foreground">
            Manage return requests from customers
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 me-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-muted-foreground">In Transit</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">AED 175</p>
              <p className="text-xs text-muted-foreground">Refunded This Month</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-moulna-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold">2.3%</p>
              <p className="text-xs text-muted-foreground">Return Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                activeTab === tab.id && "bg-moulna-gold hover:bg-moulna-gold-dark"
              )}
            >
              {tab.label}
              <Badge
                variant="secondary"
                className={cn(
                  "ms-2",
                  activeTab === tab.id && "bg-white/20 text-white"
                )}
              >
                {tab.count}
              </Badge>
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search returns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Returns List */}
      <div className="space-y-4">
        {filteredReturns.map((returnRequest, index) => {
          const statusConfig = STATUS_CONFIG[returnRequest.status as keyof typeof STATUS_CONFIG];
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={returnRequest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Image Placeholder */}
                  <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0" />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-muted-foreground">
                            {returnRequest.id}
                          </span>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="w-3 h-3 me-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold">{returnRequest.product}</h3>
                      </div>
                      <p className="font-bold text-lg">AED {returnRequest.amount}</p>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <Link
                        href={`/seller/orders/${returnRequest.orderId}`}
                        className="text-moulna-gold hover:underline"
                      >
                        Order: {returnRequest.orderId}
                      </Link>
                      <span className="text-muted-foreground">
                        Requested: {returnRequest.requestDate}
                      </span>
                    </div>

                    {/* Customer & Reason */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <DiceBearAvatar seed={returnRequest.customer.avatar} size="xs" />
                        <span className="text-sm">{returnRequest.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <AlertTriangle className="w-4 h-4" />
                        {returnRequest.reason}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 me-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 me-1" />
                      Message
                    </Button>
                    {returnRequest.status === "pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 me-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500 border-red-200">
                          <XCircle className="w-4 h-4 me-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {filteredReturns.length === 0 && (
          <Card className="p-12 text-center">
            <RotateCcw className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No return requests found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search"
                : "You don't have any return requests yet"}
            </p>
          </Card>
        )}
      </div>

      {/* Return Policy Info */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Your Return Policy</h3>
        <p className="text-sm text-blue-700 mb-4">
          You accept returns within 14 days of delivery. Customers must provide photos
          for damaged items. Refunds are processed within 3-5 business days.
        </p>
        <Button variant="outline" size="sm">
          Edit Return Policy
        </Button>
      </Card>
    </div>
  );
}
