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
  MessageSquare, Search, Filter, Eye, Download, Calendar,
  CheckCircle, Clock, Flag, AlertCircle, MapPin, RefreshCw
} from "lucide-react";

const INQUIRIES = [
  {
    id: "INQ-2024-8923",
    buyer: "Sarah Ahmed",
    buyerAvatar: "sarah-ahmed",
    seller: "Arabian Scents Boutique",
    sellerAvatar: "arabian-scents",
    listing: "Premium Oud Collection",
    status: "active",
    date: "Mar 12, 2024",
    location: "Dubai, UAE",
  },
  {
    id: "INQ-2024-8924",
    buyer: "Mohammed Ali",
    buyerAvatar: "mohammed-ali",
    seller: "Dubai Crafts Co.",
    sellerAvatar: "dubai-crafts",
    listing: "Handwoven Silk Scarf",
    status: "resolved",
    date: "Mar 13, 2024",
    location: "Abu Dhabi, UAE",
  },
  {
    id: "INQ-2024-8925",
    buyer: "Fatima Hassan",
    buyerAvatar: "fatima-hassan",
    seller: "Emirates Artisan",
    sellerAvatar: "emirates-artisan",
    listing: "Arabic Calligraphy Set",
    status: "active",
    date: "Mar 13, 2024",
    location: "Sharjah, UAE",
  },
  {
    id: "INQ-2024-8926",
    buyer: "Ahmed Khalid",
    buyerAvatar: "ahmed-khalid",
    seller: "Arabian Scents Boutique",
    sellerAvatar: "arabian-scents",
    listing: "Rose Oud Mist",
    status: "pending",
    date: "Mar 13, 2024",
    location: "Ajman, UAE",
  },
  {
    id: "INQ-2024-8927",
    buyer: "Layla Omar",
    buyerAvatar: "layla-omar",
    seller: "Pearl Boutique",
    sellerAvatar: "pearl-boutique",
    listing: "Gold Pearl Earrings Set",
    status: "reported",
    date: "Mar 10, 2024",
    location: "Dubai, UAE",
  },
];

const STATUS_OPTIONS = [
  { id: "all", label: "All Inquiries" },
  { id: "pending", label: "Pending" },
  { id: "active", label: "Active" },
  { id: "resolved", label: "Resolved" },
  { id: "reported", label: "Reported" },
];

const STATUS_STYLES = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
  active: { bg: "bg-blue-100", text: "text-blue-700", icon: MessageSquare },
  resolved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  reported: { bg: "bg-red-100", text: "text-red-700", icon: Flag },
};

export default function AdminInquiriesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Inquiry Management</h1>
          </div>
          <p className="text-muted-foreground">
            Monitor and moderate marketplace inquiries
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
          <p className="text-2xl font-bold">12,450</p>
          <p className="text-sm text-muted-foreground">Total Inquiries</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">45</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">890</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">11,510</p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">5</p>
          <p className="text-sm text-muted-foreground">Reported</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by inquiry ID, buyer, or seller..."
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

      {/* Inquiries Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-start p-4 font-medium">Inquiry ID</th>
                <th className="text-start p-4 font-medium">Buyer</th>
                <th className="text-start p-4 font-medium">Seller</th>
                <th className="text-start p-4 font-medium">Listing</th>
                <th className="text-start p-4 font-medium">Status</th>
                <th className="text-end p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {INQUIRIES.map((inquiry, index) => {
                const statusStyle = STATUS_STYLES[inquiry.status as keyof typeof STATUS_STYLES];
                const StatusIcon = statusStyle?.icon || Clock;

                return (
                  <motion.tr
                    key={inquiry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border-b last:border-0 hover:bg-muted/30",
                      inquiry.status === "reported" && "bg-red-50/50"
                    )}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-mono font-medium">{inquiry.id}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {inquiry.date}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DiceBearAvatar seed={inquiry.buyerAvatar} size="sm" />
                        <div>
                          <p className="text-sm font-medium">{inquiry.buyer}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {inquiry.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DiceBearAvatar seed={inquiry.sellerAvatar} size="sm" />
                        <span className="text-sm">{inquiry.seller}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{inquiry.listing}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={cn(statusStyle?.bg, statusStyle?.text)}>
                        <StatusIcon className="w-3 h-3 me-1" />
                        {inquiry.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {inquiry.status === "reported" && (
                          <Button size="sm" variant="outline" className="text-blue-600">
                            <RefreshCw className="w-4 h-4 me-1" />
                            Review
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
            Showing 1-5 of 12,450 inquiries
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
