"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  ArrowLeft, User, Mail, Phone, MapPin, Calendar,
  ShoppingBag, DollarSign, Star, MessageSquare, Heart,
  Clock, Package, TrendingUp, Award, Gift
} from "lucide-react";

const CUSTOMER_DATA = {
  id: "cust-123",
  name: "Sarah Ahmed",
  email: "sarah.ahmed@email.com",
  phone: "+971 50 XXX XXXX",
  avatar: "sarah-ahmed",
  level: 6,
  location: "Abu Dhabi, UAE",
  joinedAt: "March 2023",
  lastOrder: "2 days ago",
  totalOrders: 12,
  totalSpent: 4580,
  avgOrderValue: 382,
  isFollower: true,
  isVIP: true,
};

const ORDER_HISTORY = [
  {
    id: "ORD-2024-1234",
    date: "Jan 15, 2024",
    items: ["Premium Oud Collection Set"],
    total: 450,
    status: "delivered",
  },
  {
    id: "ORD-2024-1156",
    date: "Jan 8, 2024",
    items: ["Arabian Bakhoor Set", "Traditional Perfume 50ml"],
    total: 285,
    status: "delivered",
  },
  {
    id: "ORD-2023-0892",
    date: "Dec 20, 2023",
    items: ["Luxury Gift Box"],
    total: 890,
    status: "delivered",
  },
];

const REVIEWS = [
  {
    id: "1",
    product: "Premium Oud Collection",
    rating: 5,
    comment: "Absolutely amazing quality! The scent is authentic and long-lasting.",
    date: "Jan 16, 2024",
  },
  {
    id: "2",
    product: "Arabian Bakhoor Set",
    rating: 5,
    comment: "Perfect for my home. The packaging was beautiful too!",
    date: "Jan 9, 2024",
  },
];

const STATUS_COLORS = {
  delivered: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
};

export default function CustomerDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/seller/customers">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Customer Details</h1>
          <p className="text-muted-foreground">
            View customer information and order history
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Profile */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="text-center mb-6">
              <DiceBearAvatar
                seed={CUSTOMER_DATA.avatar}
                size="xl"
                className="w-24 h-24 mx-auto mb-4"
              />
              <h2 className="text-xl font-bold">{CUSTOMER_DATA.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <LevelBadge level={CUSTOMER_DATA.level} size="sm" />
                {CUSTOMER_DATA.isVIP && (
                  <Badge className="bg-purple-100 text-purple-700">
                    <Award className="w-3 h-3 me-1" />
                    VIP
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{CUSTOMER_DATA.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{CUSTOMER_DATA.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{CUSTOMER_DATA.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Customer since {CUSTOMER_DATA.joinedAt}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button className="flex-1 bg-moulna-gold hover:bg-moulna-gold-dark">
                <MessageSquare className="w-4 h-4 me-2" />
                Message
              </Button>
              <Button variant="outline" className="flex-1">
                <Gift className="w-4 h-4 me-2" />
                Send Offer
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Customer Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <ShoppingBag className="w-5 h-5 mx-auto text-moulna-gold mb-1" />
                <p className="text-xl font-bold">{CUSTOMER_DATA.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <DollarSign className="w-5 h-5 mx-auto text-green-600 mb-1" />
                <p className="text-xl font-bold">AED {CUSTOMER_DATA.totalSpent}</p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <TrendingUp className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <p className="text-xl font-bold">AED {CUSTOMER_DATA.avgOrderValue}</p>
                <p className="text-xs text-muted-foreground">Avg. Order</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Clock className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                <p className="text-xl font-bold">{CUSTOMER_DATA.lastOrder}</p>
                <p className="text-xs text-muted-foreground">Last Order</p>
              </div>
            </div>
          </Card>

          {/* Engagement */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Engagement</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Follows your shop</span>
                {CUSTOMER_DATA.isFollower ? (
                  <Badge className="bg-green-100 text-green-700">
                    <Heart className="w-3 h-3 me-1 fill-current" />
                    Following
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not following</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reviews given</span>
                <Badge variant="secondary">{REVIEWS.length} reviews</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. rating given</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">5.0</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Order History & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order History */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Order History</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {ORDER_HISTORY.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                >
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/seller/orders/${order.id}`}
                        className="font-medium hover:text-moulna-gold"
                      >
                        {order.id}
                      </Link>
                      <Badge className={STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.items.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <p className="font-semibold">AED {order.total}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Reviews */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Reviews from this Customer</h3>
              <Badge variant="secondary">
                <Star className="w-3 h-3 me-1 fill-yellow-400 text-yellow-400" />
                5.0 avg
              </Badge>
            </div>
            <div className="space-y-4">
              {REVIEWS.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{review.product}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4",
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Private Notes</h3>
            <textarea
              className="w-full h-24 p-3 border rounded-lg resize-none"
              placeholder="Add private notes about this customer..."
            />
            <Button className="mt-3 bg-moulna-gold hover:bg-moulna-gold-dark">
              Save Notes
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
