"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  ShoppingBag, Search, Filter, Eye, Download, Calendar, Truck,
  CheckCircle, Clock, Package, XCircle, AlertCircle, DollarSign,
  MapPin, RefreshCw
} from "lucide-react";

const ORDERS = [
  {
    id: "MN-2024-8923",
    customer: "Sarah Ahmed",
    customerAvatar: "sarah-ahmed",
    seller: "Arabian Scents Boutique",
    sellerAvatar: "arabian-scents",
    items: 3,
    total: 750,
    status: "delivered",
    paymentStatus: "paid",
    date: "Mar 12, 2024",
    location: "Dubai, UAE",
  },
  {
    id: "MN-2024-8924",
    customer: "Mohammed Ali",
    customerAvatar: "mohammed-ali",
    seller: "Dubai Crafts Co.",
    sellerAvatar: "dubai-crafts",
    items: 1,
    total: 450,
    status: "shipped",
    paymentStatus: "paid",
    date: "Mar 13, 2024",
    location: "Abu Dhabi, UAE",
  },
  {
    id: "MN-2024-8925",
    customer: "Fatima Hassan",
    customerAvatar: "fatima-hassan",
    seller: "Emirates Artisan",
    sellerAvatar: "emirates-artisan",
    items: 2,
    total: 320,
    status: "processing",
    paymentStatus: "paid",
    date: "Mar 13, 2024",
    location: "Sharjah, UAE",
  },
  {
    id: "MN-2024-8926",
    customer: "Ahmed Khalid",
    customerAvatar: "ahmed-khalid",
    seller: "Arabian Scents Boutique",
    sellerAvatar: "arabian-scents",
    items: 1,
    total: 180,
    status: "pending",
    paymentStatus: "pending",
    date: "Mar 13, 2024",
    location: "Ajman, UAE",
  },
  {
    id: "MN-2024-8927",
    customer: "Layla Omar",
    customerAvatar: "layla-omar",
    seller: "Pearl Boutique",
    sellerAvatar: "pearl-boutique",
    items: 4,
    total: 1250,
    status: "disputed",
    paymentStatus: "held",
    date: "Mar 10, 2024",
    location: "Dubai, UAE",
  },
];

const STATUS_OPTIONS = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "disputed", label: "Disputed" },
];

const STATUS_STYLES = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
  processing: { bg: "bg-blue-100", text: "text-blue-700", icon: Package },
  shipped: { bg: "bg-purple-100", text: "text-purple-700", icon: Truck },
  delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  cancelled: { bg: "bg-gray-100", text: "text-gray-700", icon: XCircle },
  disputed: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
};

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Order Management</h1>
          </div>
          <p className="text-muted-foreground">
            Monitor and manage all marketplace orders
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 me-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">8,234</p>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">45</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">123</p>
          <p className="text-sm text-muted-foreground">Processing</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">89</p>
          <p className="text-sm text-muted-foreground">Shipped</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">5</p>
          <p className="text-sm text-muted-foreground">Disputed</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer, or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={selectedStatus === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(option.id)}
                className={cn(
                  selectedStatus === option.id &&
                    "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-start p-4 font-medium">Order ID</th>
                <th className="text-start p-4 font-medium">Customer</th>
                <th className="text-start p-4 font-medium">Seller</th>
                <th className="text-start p-4 font-medium">Items</th>
                <th className="text-start p-4 font-medium">Total</th>
                <th className="text-start p-4 font-medium">Status</th>
                <th className="text-start p-4 font-medium">Payment</th>
                <th className="text-end p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((order, index) => {
                const statusStyle = STATUS_STYLES[order.status as keyof typeof STATUS_STYLES];
                const StatusIcon = statusStyle?.icon || Clock;

                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border-b last:border-0 hover:bg-muted/30",
                      order.status === "disputed" && "bg-red-50/50"
                    )}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-mono font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {order.date}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DiceBearAvatar seed={order.customerAvatar} size="sm" />
                        <div>
                          <p className="text-sm font-medium">{order.customer}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {order.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DiceBearAvatar seed={order.sellerAvatar} size="sm" />
                        <span className="text-sm">{order.seller}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{order.items} items</td>
                    <td className="p-4">
                      <span className="font-bold">AED {order.total}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={cn(statusStyle?.bg, statusStyle?.text)}>
                        <StatusIcon className="w-3 h-3 me-1" />
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          order.paymentStatus === "paid" && "border-green-500 text-green-600",
                          order.paymentStatus === "pending" && "border-yellow-500 text-yellow-600",
                          order.paymentStatus === "held" && "border-red-500 text-red-600"
                        )}
                      >
                        <DollarSign className="w-3 h-3 me-1" />
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {order.status === "disputed" && (
                          <Button size="sm" variant="outline" className="text-blue-600">
                            <RefreshCw className="w-4 h-4 me-1" />
                            Resolve
                          </Button>
                        )}
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
            Showing 1-5 of 8,234 orders
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
