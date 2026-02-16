"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Percent, Tag, Gift, Clock, Calendar, Plus,
  TrendingUp, Eye, Users, Sparkles, Trash2,
  Copy, Edit, MoreHorizontal
} from "lucide-react";

const PROMOTIONS = [
  {
    id: "1",
    name: "New Year Sale",
    type: "percentage",
    value: 20,
    code: "NEWYEAR24",
    usageCount: 45,
    usageLimit: 100,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    status: "active",
    products: "All Products",
    inquiries: 145,
  },
  {
    id: "2",
    name: "Welcome Discount",
    type: "percentage",
    value: 15,
    code: "WELCOME15",
    usageCount: 128,
    usageLimit: null,
    startDate: "2023-12-01",
    endDate: null,
    status: "active",
    products: "All Products",
    inquiries: 328,
  },
  {
    id: "3",
    name: "Featured Boost",
    type: "boost",
    value: 0,
    code: "BOOST10",
    usageCount: 67,
    usageLimit: 200,
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    status: "active",
    products: "All Listings",
    inquiries: 167,
  },
  {
    id: "4",
    name: "Oud Collection",
    type: "fixed",
    value: 50,
    code: "OUD50",
    usageCount: 89,
    usageLimit: 100,
    startDate: "2023-11-01",
    endDate: "2023-12-31",
    status: "expired",
    products: "Oud Collection",
    inquiries: 289,
  },
];

const STATS = [
  { label: "Active Promotions", value: "3", icon: Tag, color: "text-green-500" },
  { label: "Total Uses", value: "329", icon: Users, color: "text-blue-500" },
  { label: "Inquiries Generated", value: "1,245", icon: TrendingUp, color: "text-moulna-gold" },
  { label: "Avg. Views Boost", value: "+45%", icon: Sparkles, color: "text-purple-500" },
];

export default function SellerPromotionsPage() {
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Promotions</h1>
            <p className="text-muted-foreground">
              Create and manage discount codes and special offers
            </p>
          </div>
          <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
            <Plus className="w-4 h-4 me-2" />
            Create Promotion
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Create */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Quick Create</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed rounded-lg hover:border-moulna-gold hover:bg-moulna-gold/5 transition-all text-start">
              <Percent className="w-8 h-8 text-moulna-gold mb-2" />
              <h3 className="font-medium">Percentage Off</h3>
              <p className="text-sm text-muted-foreground">Discount by percentage</p>
            </button>
            <button className="p-4 border-2 border-dashed rounded-lg hover:border-moulna-gold hover:bg-moulna-gold/5 transition-all text-start">
              <Tag className="w-8 h-8 text-blue-500 mb-2" />
              <h3 className="font-medium">Fixed Amount</h3>
              <p className="text-sm text-muted-foreground">Fixed AED discount</p>
            </button>
            <button className="p-4 border-2 border-dashed rounded-lg hover:border-moulna-gold hover:bg-moulna-gold/5 transition-all text-start">
              <Gift className="w-8 h-8 text-purple-500 mb-2" />
              <h3 className="font-medium">Featured Boost</h3>
              <p className="text-sm text-muted-foreground">Boost listing visibility</p>
            </button>
          </div>
        </Card>

        {/* Promotions List */}
        <Card>
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">All Promotions</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Active</Button>
              <Button variant="ghost" size="sm">Expired</Button>
              <Button variant="ghost" size="sm">Scheduled</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-start p-4 font-medium">Promotion</th>
                  <th className="text-start p-4 font-medium">Code</th>
                  <th className="text-start p-4 font-medium">Usage</th>
                  <th className="text-start p-4 font-medium">Duration</th>
                  <th className="text-start p-4 font-medium">Inquiries</th>
                  <th className="text-start p-4 font-medium">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {PROMOTIONS.map((promo, index) => (
                  <motion.tr
                    key={promo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          promo.type === "percentage" && "bg-green-100 text-green-600",
                          promo.type === "fixed" && "bg-blue-100 text-blue-600",
                          promo.type === "boost" && "bg-purple-100 text-purple-600"
                        )}>
                          {promo.type === "percentage" && <Percent className="w-5 h-5" />}
                          {promo.type === "fixed" && <Tag className="w-5 h-5" />}
                          {promo.type === "boost" && <Gift className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{promo.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {promo.type === "percentage" && `${promo.value}% off`}
                            {promo.type === "fixed" && `AED ${promo.value} off`}
                            {promo.type === "boost" && "Featured boost"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                          {promo.code}
                        </code>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">
                        {promo.usageCount}
                        {promo.usageLimit && <span className="text-muted-foreground"> / {promo.usageLimit}</span>}
                      </p>
                      {promo.usageLimit && (
                        <div className="w-24 h-1.5 bg-muted rounded-full mt-1">
                          <div
                            className="h-full bg-moulna-gold rounded-full"
                            style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(promo.startDate)}
                      </div>
                      {promo.endDate && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {formatDate(promo.endDate)}
                        </div>
                      )}
                      {!promo.endDate && (
                        <span className="text-xs text-green-600">No expiry</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{promo.inquiries} inquiries</span>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={promo.status === "active" ? "default" : "secondary"}
                        className={promo.status === "active" ? "bg-green-500" : ""}
                      >
                        {promo.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
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
