"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Package, Truck, Check, Clock, MapPin, CreditCard,
  MessageCircle, RotateCcw, Star, ChevronLeft, Copy,
  ExternalLink, Sparkles, Phone
} from "lucide-react";

// Mock order data
const ORDER = {
  id: "ord_1",
  orderNumber: "ORD-2024-001234",
  status: "shipped",
  date: "Feb 10, 2024",
  estimatedDelivery: "Feb 13-15, 2024",
  total: 77000,
  subtotal: 77000,
  shipping: 0,
  discount: 0,
  items: [
    {
      id: "item_1",
      title: "Handcrafted Arabian Oud Perfume",
      variant: "100ml",
      quantity: 1,
      price: 45000,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200",
      slug: "handcrafted-arabian-oud-perfume",
    },
    {
      id: "item_2",
      title: "Organic Date Honey Gift Box",
      quantity: 1,
      price: 32000,
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200",
      slug: "organic-date-honey-gift-box",
    },
  ],
  seller: {
    name: "Scent of Arabia",
    slug: "scent-of-arabia",
    avatar: "scent-arabia",
    level: 6,
  },
  xpEarned: 77,
  trackingNumber: "UAE123456789",
  carrier: "Emirates Post",
  trackingUrl: "https://emiratespost.ae/track",
  shippingAddress: {
    name: "Sarah Ahmed",
    phone: "+971 50 123 4567",
    address: "Apartment 1504, Marina Tower",
    area: "Dubai Marina",
    emirate: "Dubai",
    country: "UAE",
  },
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "Visa",
  },
  timeline: [
    { status: "placed", label: "Order Placed", date: "Feb 10, 2024, 2:30 PM", completed: true },
    { status: "confirmed", label: "Confirmed", date: "Feb 10, 2024, 2:45 PM", completed: true },
    { status: "processing", label: "Processing", date: "Feb 10, 2024, 4:00 PM", completed: true },
    { status: "shipped", label: "Shipped", date: "Feb 11, 2024, 10:30 AM", completed: true },
    { status: "delivered", label: "Delivered", date: "Expected Feb 13-15", completed: false },
  ],
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  processing: { label: "Processing", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  shipped: { label: "Shipped", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  delivered: { label: "Delivered", color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
  cancelled: { label: "Cancelled", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const order = ORDER; // In real app, fetch by params.orderId

  const status = statusConfig[order.status] || statusConfig.processing;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard/orders"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="font-display text-2xl font-bold mb-1">
            Order {order.orderNumber}
          </h1>
          <div className="flex items-center gap-3">
            <Badge className={cn(status.bgColor, status.color, "border-0")}>
              {status.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Placed on {order.date}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 me-2" />
            Contact Seller
          </Button>
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 me-2" />
            Request Return
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <Card className="p-6">
            <h2 className="font-semibold mb-6">Order Status</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-5 w-0.5 h-[calc(100%-40px)] bg-muted" />
              <div
                className="absolute top-5 left-5 w-0.5 bg-moulna-gold transition-all duration-500"
                style={{
                  height: `${(order.timeline.filter(t => t.completed).length - 1) / (order.timeline.length - 1) * 100}%`
                }}
              />

              <div className="space-y-6">
                {order.timeline.map((step, index) => (
                  <motion.div
                    key={step.status}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center z-10",
                      step.completed
                        ? "bg-moulna-gold text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {step.completed ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className={cn(
                        "font-medium",
                        !step.completed && "text-muted-foreground"
                      )}>
                        {step.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tracking Info */}
            {order.trackingNumber && order.status === "shipped" && (
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-medium">{order.trackingNumber}</code>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      via {order.carrier}
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                      Track Package
                      <ExternalLink className="w-4 h-4 ms-2" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Order Items</h2>
              <Link
                href={`/shops/${order.seller.slug}`}
                className="flex items-center gap-2 text-sm hover:text-moulna-gold transition-colors"
              >
                <DiceBearAvatar seed={order.seller.avatar} size="sm" />
                <span>{order.seller.name}</span>
                <LevelBadge level={order.seller.level} size="sm" />
              </Link>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <Link href={`/products/${item.slug}`}>
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium hover:text-moulna-gold transition-colors"
                    >
                      {item.title}
                    </Link>
                    {'variant' in item && item.variant && (
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="font-medium">{formatAED(item.price)}</p>
                    {order.status === "delivered" && (
                      <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                        <Star className="w-3.5 h-3.5 me-1" />
                        Write Review
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* XP Earned */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-moulna-gold text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">XP Earned from this order</span>
              </div>
              <span className="font-bold">+{order.xpEarned} XP</span>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatAED(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatAED(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatAED(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatAED(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              Shipping Address
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="text-muted-foreground">{order.shippingAddress.address}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.area}, {order.shippingAddress.emirate}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress.country}</p>
              <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{order.shippingAddress.phone}</span>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              Payment Method
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded bg-muted flex items-center justify-center">
                <span className="text-xs font-bold">{order.paymentMethod.brand}</span>
              </div>
              <div className="text-sm">
                <p className="font-medium">•••• {order.paymentMethod.last4}</p>
                <p className="text-muted-foreground capitalize">{order.paymentMethod.type}</p>
              </div>
            </div>
          </Card>

          {/* Need Help */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Need Help?</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/help/orders">
                  <Package className="w-4 h-4 me-2" />
                  Order Issues
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/help/returns">
                  <RotateCcw className="w-4 h-4 me-2" />
                  Returns & Refunds
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/contact">
                  <MessageCircle className="w-4 h-4 me-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
