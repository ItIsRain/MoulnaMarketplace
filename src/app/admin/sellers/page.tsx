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
  Store, Search, Filter, Star, CheckCircle, XCircle, Clock,
  Eye, Edit, Ban, Download, Package, DollarSign, Users,
  Calendar, MapPin, TrendingUp, Award
} from "lucide-react";

const SELLERS = [
  {
    id: "1",
    name: "Arabian Scents Boutique",
    avatar: "arabian-scents",
    email: "hello@arabianscents.ae",
    status: "verified",
    rating: 4.9,
    reviews: 456,
    products: 45,
    revenue: 45230,
    followers: 2340,
    joinDate: "Jan 2024",
    location: "Dubai, UAE",
    badges: ["Top Seller", "Artisan"],
  },
  {
    id: "2",
    name: "Dubai Crafts Co.",
    avatar: "dubai-crafts",
    email: "info@dubaicrafts.ae",
    status: "verified",
    rating: 4.7,
    reviews: 234,
    products: 78,
    revenue: 38900,
    followers: 1890,
    joinDate: "Dec 2023",
    location: "Dubai, UAE",
    badges: ["Fast Shipper"],
  },
  {
    id: "3",
    name: "Emirates Artisan",
    avatar: "emirates-artisan",
    email: "contact@emiratesartisan.ae",
    status: "pending",
    rating: 0,
    reviews: 0,
    products: 12,
    revenue: 0,
    followers: 0,
    joinDate: "Mar 2024",
    location: "Abu Dhabi, UAE",
    badges: [],
  },
  {
    id: "4",
    name: "Sharjah Handmade",
    avatar: "sharjah-handmade",
    email: "hello@sharjahhandmade.ae",
    status: "suspended",
    rating: 3.2,
    reviews: 45,
    products: 23,
    revenue: 12500,
    followers: 456,
    joinDate: "Feb 2024",
    location: "Sharjah, UAE",
    badges: [],
  },
  {
    id: "5",
    name: "Pearl Boutique",
    avatar: "pearl-boutique",
    email: "support@pearlboutique.ae",
    status: "verified",
    rating: 4.8,
    reviews: 189,
    products: 56,
    revenue: 28500,
    followers: 1234,
    joinDate: "Jan 2024",
    location: "Dubai, UAE",
    badges: ["Top Seller"],
  },
];

const STATUS_OPTIONS = [
  { id: "all", label: "All Sellers" },
  { id: "verified", label: "Verified" },
  { id: "pending", label: "Pending" },
  { id: "suspended", label: "Suspended" },
];

export default function AdminSellersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Seller Management</h1>
          </div>
          <p className="text-muted-foreground">
            Review and manage marketplace sellers
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 me-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">456</p>
              <p className="text-sm text-muted-foreground">Total Sellers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">389</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-muted-foreground">Artisan Program</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          <div className="flex gap-2">
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

      {/* Sellers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SELLERS.map((seller, index) => (
          <motion.div
            key={seller.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <DiceBearAvatar seed={seller.avatar} size="lg" />
                  <div>
                    <h3 className="font-semibold">{seller.name}</h3>
                    <p className="text-sm text-muted-foreground">{seller.email}</p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    seller.status === "verified" && "bg-green-100 text-green-700",
                    seller.status === "pending" && "bg-yellow-100 text-yellow-700",
                    seller.status === "suspended" && "bg-red-100 text-red-700"
                  )}
                >
                  {seller.status === "verified" && <CheckCircle className="w-3 h-3 me-1" />}
                  {seller.status === "pending" && <Clock className="w-3 h-3 me-1" />}
                  {seller.status === "suspended" && <XCircle className="w-3 h-3 me-1" />}
                  {seller.status}
                </Badge>
              </div>

              {/* Badges */}
              {seller.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {seller.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{seller.rating || "-"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{seller.reviews} reviews</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="font-bold">{seller.products}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="font-bold">{seller.followers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>

              {/* Revenue */}
              <div className="flex items-center justify-between p-3 bg-moulna-gold/10 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-moulna-gold" />
                  <span className="text-sm">Total Revenue</span>
                </div>
                <span className="font-bold">AED {seller.revenue.toLocaleString()}</span>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {seller.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {seller.joinDate}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 me-1" />
                  View
                </Button>
                {seller.status === "pending" ? (
                  <>
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 me-1" />
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      <XCircle className="w-4 h-4 me-1" />
                      Reject
                    </Button>
                  </>
                ) : seller.status === "suspended" ? (
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 me-1" />
                    Reactivate
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1 text-red-600">
                    <Ban className="w-4 h-4 me-1" />
                    Suspend
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
