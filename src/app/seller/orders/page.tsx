"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, formatAED, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  ShoppingBag, Search, Filter, Clock, Package,
  Truck, Check, X, ChevronRight, Eye, Printer,
  Sparkles
} from "lucide-react";

const ORDERS = [
  {
    id: "ord_1",
    orderNumber: "ORD-2024-001567",
    customer: {
      name: "Fatima M.",
      avatar: "fatima-m",
      level: 4,
      ordersCount: 12,
    },
    items: [
      { id: "item_1", title: "Arabian Oud Perfume - 100ml", quantity: 1, price: 45000, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100" },
      { id: "item_2", title: "Rose Oud Mist", quantity: 2, price: 28000, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=100" },
    ],
    total: 101000,
    status: "pending",
    date: "2024-02-13T10:30:00Z",
    shippingAddress: "Dubai Marina, Building 45, Apt 1204",
    xpReward: 50,
  },
  {
    id: "ord_2",
    orderNumber: "ORD-2024-001566",
    customer: {
      name: "Ahmed K.",
      avatar: "ahmed-k",
      level: 7,
      ordersCount: 35,
    },
    items: [
      { id: "item_3", title: "Premium Oud Gift Set", quantity: 1, price: 85000, image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=100" },
    ],
    total: 85000,
    status: "processing",
    date: "2024-02-13T08:15:00Z",
    shippingAddress: "Abu Dhabi, Khalidiya, Villa 23",
    xpReward: 50,
  },
  {
    id: "ord_3",
    orderNumber: "ORD-2024-001565",
    customer: {
      name: "Sara A.",
      avatar: "sara-a",
      level: 5,
      ordersCount: 8,
    },
    items: [
      { id: "item_4", title: "Amber & Musk Blend", quantity: 1, price: 35000, image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=100" },
    ],
    total: 35000,
    status: "shipped",
    trackingNumber: "UAE987654321",
    date: "2024-02-12T16:45:00Z",
    shippingAddress: "Sharjah, Al Nahda, Tower 8, Floor 5",
    xpReward: 50,
  },
  {
    id: "ord_4",
    orderNumber: "ORD-2024-001564",
    customer: {
      name: "Khalid R.",
      avatar: "khalid-r",
      level: 3,
      ordersCount: 5,
    },
    items: [
      { id: "item_5", title: "Home Fragrance Diffuser", quantity: 2, price: 22000, image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=100" },
    ],
    total: 44000,
    status: "delivered",
    date: "2024-02-11T14:20:00Z",
    deliveredAt: "2024-02-12T11:00:00Z",
    shippingAddress: "Dubai, JLT, Cluster D, Tower 3",
    xpEarned: 50,
  },
  {
    id: "ord_5",
    orderNumber: "ORD-2024-001560",
    customer: {
      name: "Noura S.",
      avatar: "noura-s",
      level: 2,
      ordersCount: 2,
    },
    items: [
      { id: "item_6", title: "Arabian Oud Perfume - 50ml", quantity: 1, price: 28000, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100" },
    ],
    total: 28000,
    status: "cancelled",
    cancelReason: "Customer requested cancellation",
    date: "2024-02-10T09:00:00Z",
    shippingAddress: "Ajman, Al Rashidiya",
  },
];

const statusConfig: Record<string, { label: string; variant: "pending" | "processing" | "shipped" | "delivered" | "cancelled"; icon: React.ElementType }> = {
  pending: { label: "Pending", variant: "pending", icon: Clock },
  processing: { label: "Processing", variant: "processing", icon: Package },
  shipped: { label: "Shipped", variant: "shipped", icon: Truck },
  delivered: { label: "Delivered", variant: "delivered", icon: Check },
  cancelled: { label: "Cancelled", variant: "cancelled", icon: X },
};

export default function SellerOrdersPage() {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOrders = ORDERS.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: ORDERS.length,
    pending: ORDERS.filter(o => o.status === "pending").length,
    processing: ORDERS.filter(o => o.status === "processing").length,
    shipped: ORDERS.filter(o => o.status === "shipped").length,
    delivered: ORDERS.filter(o => o.status === "delivered").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <ShoppingBag className="w-6 h-6" />
          Orders
        </h1>
        <p className="text-muted-foreground">
          Manage and fulfill customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, filter: "all" },
          { label: "Pending", value: stats.pending, filter: "pending", urgent: stats.pending > 0 },
          { label: "Processing", value: stats.processing, filter: "processing" },
          { label: "Shipped", value: stats.shipped, filter: "shipped" },
          { label: "Delivered", value: stats.delivered, filter: "delivered" },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => setStatusFilter(stat.filter)}
            className={cn(
              "text-center p-4 rounded-xl border-2 transition-all",
              statusFilter === stat.filter
                ? "border-moulna-gold bg-moulna-gold/5"
                : "border-transparent bg-card hover:border-muted"
            )}
          >
            <p className={cn(
              "text-2xl font-bold",
              stat.urgent && "text-yellow-600"
            )}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 me-2" />
            More Filters
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 me-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <DiceBearAvatar
                      seed={order.customer.avatar}
                      size="lg"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{order.customer.name}</span>
                        <LevelBadge level={order.customer.level} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customer.ordersCount} orders · {order.orderNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <Badge variant={status.variant}>
                      <StatusIcon className="w-3.5 h-3.5 me-1" />
                      {status.label}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {timeAgo(order.date)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <div className="relative w-10 h-10 rounded overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1 max-w-[150px]">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          x{item.quantity} · {formatAED(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Ship to: <span className="text-foreground">{order.shippingAddress}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-end">
                      <p className="font-bold text-lg">{formatAED(order.total)}</p>
                      {order.status === "pending" && order.xpReward && (
                        <p className="text-xs text-moulna-gold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Ship fast for +{order.xpReward} XP
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {order.status === "pending" && (
                        <Button variant="gold" size="sm">
                          Confirm Order
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button variant="gold" size="sm">
                          Mark Shipped
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/seller/orders/${order.id}`}>
                          <Eye className="w-4 h-4 me-2" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tracking Number */}
                {'trackingNumber' in order && order.trackingNumber && (
                  <div className="mt-3 p-3 rounded-lg bg-blue-600 text-sm text-white">
                    <span className="font-medium">Tracking: </span>
                    <code className="font-mono bg-blue-700 px-1.5 py-0.5 rounded">{order.trackingNumber}</code>
                  </div>
                )}

                {/* XP Earned */}
                {'xpEarned' in order && order.xpEarned && (
                  <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-moulna-gold">
                    <Sparkles className="w-4 h-4" />
                    <span>+{order.xpEarned} XP earned for on-time delivery!</span>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}

        {filteredOrders.length === 0 && (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No orders found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "New orders will appear here"
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
