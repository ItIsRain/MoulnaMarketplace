"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Users, UserPlus, UserCheck, Heart, TrendingUp, TrendingDown,
  MapPin, Calendar, ArrowUpRight, ArrowDownRight, Star,
  ShoppingBag, Repeat, Eye, Download
} from "lucide-react";

const CUSTOMER_METRICS = [
  {
    label: "Total Customers",
    value: "1,234",
    change: "+156",
    trend: "up",
    icon: Users,
    period: "this month",
  },
  {
    label: "New Customers",
    value: "89",
    change: "+12%",
    trend: "up",
    icon: UserPlus,
    period: "vs last month",
  },
  {
    label: "Returning Customers",
    value: "67%",
    change: "+5%",
    trend: "up",
    icon: Repeat,
    period: "retention rate",
  },
  {
    label: "Followers",
    value: "2,340",
    change: "+234",
    trend: "up",
    icon: Heart,
    period: "this month",
  },
];

const TOP_CUSTOMERS = [
  {
    name: "Sarah Ahmed",
    avatar: "sarah-ahmed",
    orders: 12,
    totalSpent: 4500,
    lastOrder: "2 days ago",
    isVIP: true,
  },
  {
    name: "Mohammed Ali",
    avatar: "mohammed-ali",
    orders: 8,
    totalSpent: 3200,
    lastOrder: "1 week ago",
    isVIP: true,
  },
  {
    name: "Fatima Hassan",
    avatar: "fatima-hassan",
    orders: 6,
    totalSpent: 2800,
    lastOrder: "3 days ago",
    isVIP: false,
  },
  {
    name: "Ahmed Khalid",
    avatar: "ahmed-khalid",
    orders: 5,
    totalSpent: 1900,
    lastOrder: "5 days ago",
    isVIP: false,
  },
  {
    name: "Layla Omar",
    avatar: "layla-omar",
    orders: 4,
    totalSpent: 1650,
    lastOrder: "1 week ago",
    isVIP: false,
  },
];

const CUSTOMER_BY_LOCATION = [
  { emirate: "Dubai", customers: 456, percentage: 37 },
  { emirate: "Abu Dhabi", customers: 312, percentage: 25 },
  { emirate: "Sharjah", customers: 187, percentage: 15 },
  { emirate: "Ajman", customers: 124, percentage: 10 },
  { emirate: "Other UAE", customers: 155, percentage: 13 },
];

const CUSTOMER_SEGMENTS = [
  { segment: "New", count: 234, color: "bg-blue-500" },
  { segment: "Returning", count: 567, color: "bg-green-500" },
  { segment: "VIP", count: 89, color: "bg-purple-500" },
  { segment: "At Risk", count: 156, color: "bg-orange-500" },
  { segment: "Churned", count: 188, color: "bg-red-500" },
];

export default function CustomerAnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Analytics</h1>
          <p className="text-muted-foreground">
            Understand your customer base and engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 me-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 me-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CUSTOMER_METRICS.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-moulna-gold/10">
                  <metric.icon className="w-5 h-5 text-moulna-gold" />
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    metric.trend === "up"
                      ? "text-green-600 bg-green-100"
                      : "text-red-600 bg-red-100"
                  )}
                >
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 me-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 me-1" />
                  )}
                  {metric.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{metric.period}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-moulna-gold" />
              <h2 className="font-semibold">Top Customers</h2>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {TOP_CUSTOMERS.map((customer, index) => (
              <motion.div
                key={customer.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <DiceBearAvatar seed={customer.avatar} size="md" />
                    {customer.isVIP && (
                      <div className="absolute -top-1 -end-1 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{customer.name}</span>
                      {customer.isVIP && (
                        <Badge className="bg-purple-100 text-purple-700 text-xs">VIP</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.orders} orders · Last: {customer.lastOrder}
                    </p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="font-bold">AED {customer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total spent</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Customer Segments */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Customer Segments</h2>
          </div>

          {/* Segment Bar */}
          <div className="h-8 flex rounded-lg overflow-hidden mb-6">
            {CUSTOMER_SEGMENTS.map((segment) => (
              <motion.div
                key={segment.segment}
                className={cn("h-full", segment.color)}
                initial={{ width: 0 }}
                animate={{
                  width: `${(segment.count / CUSTOMER_SEGMENTS.reduce((a, b) => a + b.count, 0)) * 100}%`,
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                title={`${segment.segment}: ${segment.count}`}
              />
            ))}
          </div>

          {/* Segment Legend */}
          <div className="space-y-3">
            {CUSTOMER_SEGMENTS.map((segment, index) => (
              <motion.div
                key={segment.segment}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", segment.color)} />
                  <span className="text-sm">{segment.segment}</span>
                </div>
                <span className="font-medium">{segment.count}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Location Map */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Customers by Location</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CUSTOMER_BY_LOCATION.map((location, index) => (
            <motion.div
              key={location.emirate}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-muted/50 text-center"
            >
              <p className="text-2xl font-bold mb-1">{location.customers}</p>
              <p className="font-medium text-sm">{location.emirate}</p>
              <p className="text-xs text-muted-foreground">{location.percentage}% of total</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Customer Journey */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-5 h-5 text-moulna-gold" />
          <h2 className="font-semibold">Customer Journey</h2>
        </div>

        <div className="flex items-center justify-between">
          {[
            { stage: "Visitors", count: 5420, icon: Eye },
            { stage: "Add to Cart", count: 890, icon: ShoppingBag },
            { stage: "Checkout", count: 456, icon: UserCheck },
            { stage: "Purchase", count: 312, icon: ShoppingBag },
            { stage: "Repeat", count: 89, icon: Repeat },
          ].map((stage, index) => (
            <React.Fragment key={stage.stage}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-moulna-gold/10 flex items-center justify-center mx-auto mb-2">
                  <stage.icon className="w-8 h-8 text-moulna-gold" />
                </div>
                <p className="font-bold text-lg">{stage.count.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{stage.stage}</p>
              </motion.div>
              {index < 4 && (
                <div className="flex-1 h-0.5 bg-muted mx-2 relative">
                  <motion.div
                    className="absolute inset-y-0 start-0 bg-moulna-gold"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Customer Insights</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <UserPlus className="w-4 h-4 text-green-600 mt-0.5" />
                <span>New customer acquisition is up 12% this month!</span>
              </li>
              <li className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-red-500 mt-0.5" />
                <span>67% of your customers are returning buyers - excellent loyalty!</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                <span>Dubai remains your strongest market with 37% of customers.</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
