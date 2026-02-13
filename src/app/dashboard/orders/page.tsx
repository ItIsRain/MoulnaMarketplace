"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package, Search, Filter, ChevronRight, Clock,
  Truck, Check, X, RotateCcw, Sparkles
} from "lucide-react";

const ORDERS = [
  {
    id: "ord_1",
    orderNumber: "ORD-2024-001234",
    status: "shipped",
    date: "Feb 10, 2024",
    estimatedDelivery: "Feb 13-15, 2024",
    total: 77000,
    items: [
      {
        id: "item_1",
        title: "Handcrafted Arabian Oud Perfume",
        variant: "100ml",
        quantity: 1,
        price: 45000,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200",
      },
      {
        id: "item_2",
        title: "Organic Date Honey Gift Box",
        quantity: 1,
        price: 32000,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200",
      },
    ],
    seller: { name: "Scent of Arabia" },
    xpEarned: 77,
    trackingNumber: "UAE123456789",
  },
  {
    id: "ord_2",
    orderNumber: "ORD-2024-001189",
    status: "delivered",
    date: "Feb 5, 2024",
    deliveredDate: "Feb 8, 2024",
    total: 32000,
    items: [
      {
        id: "item_3",
        title: "Gold-Plated Pearl Earrings",
        quantity: 1,
        price: 32000,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200",
      },
    ],
    seller: { name: "Gulf Gems" },
    xpEarned: 32,
    canReview: true,
  },
  {
    id: "ord_3",
    orderNumber: "ORD-2024-001045",
    status: "processing",
    date: "Feb 12, 2024",
    total: 125000,
    items: [
      {
        id: "item_4",
        title: "Embroidered Abaya with Gold Thread",
        variant: "Size M",
        quantity: 1,
        price: 125000,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200",
      },
    ],
    seller: { name: "Elegance UAE" },
    xpEarned: 125,
  },
  {
    id: "ord_4",
    orderNumber: "ORD-2024-000892",
    status: "cancelled",
    date: "Jan 28, 2024",
    total: 89000,
    items: [
      {
        id: "item_5",
        title: "Handpainted Desert Landscape",
        quantity: 1,
        price: 89000,
        image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200",
      },
    ],
    seller: { name: "Emirates Art Studio" },
    refunded: true,
  },
];

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    variant: "pending" as const,
    label: "Pending",
  },
  processing: {
    icon: Package,
    variant: "processing" as const,
    label: "Processing",
  },
  shipped: {
    icon: Truck,
    variant: "shipped" as const,
    label: "Shipped",
  },
  delivered: {
    icon: Check,
    variant: "delivered" as const,
    label: "Delivered",
  },
  cancelled: {
    icon: X,
    variant: "cancelled" as const,
    label: "Cancelled",
  },
  returned: {
    icon: RotateCcw,
    variant: "warning" as const,
    label: "Returned",
  },
};

type OrderStatus = keyof typeof STATUS_CONFIG;

export default function OrdersPage() {
  const [filter, setFilter] = React.useState<"all" | OrderStatus>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOrders = ORDERS.filter(order => {
    if (filter !== "all" && order.status !== filter) return false;
    if (searchQuery && !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {["all", ...Object.keys(STATUS_CONFIG)].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status as typeof filter)}
              className={cn(
                "capitalize whitespace-nowrap",
                filter === status && "bg-moulna-gold hover:bg-moulna-gold-dark"
              )}
            >
              {status === "all" ? "All Orders" : STATUS_CONFIG[status as OrderStatus].label}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const status = STATUS_CONFIG[order.status as OrderStatus];
          return (
            <Card key={order.id} className="overflow-hidden">
              {/* Order Header */}
              <div className="px-6 py-4 bg-muted/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order</p>
                    <p className="font-mono font-medium">{order.orderNumber}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm text-muted-foreground">Placed on</p>
                    <p className="font-medium">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={status.variant} className="gap-1 px-3 py-1.5 text-sm">
                    <status.icon className="w-4 h-4" />
                    {status.label}
                  </Badge>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                      <ChevronRight className="w-4 h-4 ms-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.title}</p>
                        {'variant' in item && item.variant && (
                          <p className="text-sm text-muted-foreground">{item.variant}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} · {formatAED(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Sold by <span className="font-medium text-foreground">{order.seller.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    {order.xpEarned && (
                      <div className="flex items-center gap-1 text-sm text-moulna-gold">
                        <Sparkles className="w-4 h-4" />
                        <span>+{order.xpEarned} XP earned</span>
                      </div>
                    )}
                    <div className="text-end">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-bold text-lg">{formatAED(order.total)}</p>
                    </div>
                  </div>
                </div>

                {/* Status-specific actions */}
                {order.status === "shipped" && order.trackingNumber && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-600 text-sm text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Estimated delivery: {order.estimatedDelivery}
                        </p>
                        <p className="text-blue-100">
                          Tracking: <code className="font-mono bg-blue-700 px-1 rounded">{order.trackingNumber}</code>
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/20">
                        Track Order
                      </Button>
                    </div>
                  </div>
                )}

                {order.status === "delivered" && order.canReview && (
                  <div className="mt-4 p-3 rounded-lg bg-moulna-gold text-sm text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">Leave a review and earn <strong>+50 XP</strong></span>
                      </div>
                      <Button size="sm" className="bg-white text-moulna-gold-dark hover:bg-white/90">
                        Write Review
                      </Button>
                    </div>
                  </div>
                )}

                {order.status === "cancelled" && order.refunded && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-600 text-sm text-white font-medium">
                    <Check className="w-4 h-4 inline-block me-2" />
                    Refund processed successfully
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {filteredOrders.length === 0 && (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">
              {filter !== "all"
                ? `You don't have any ${STATUS_CONFIG[filter as OrderStatus].label.toLowerCase()} orders`
                : "Start shopping to see your orders here"}
            </p>
            <Button variant="gold" asChild>
              <Link href="/explore">Explore Products</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
