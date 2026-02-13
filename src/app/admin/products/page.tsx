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
  Package, Search, Filter, CheckCircle, XCircle, Clock, Eye,
  Flag, Trash2, Download, Star, Store, AlertTriangle,
  Calendar, Tag
} from "lucide-react";

const PRODUCTS = [
  {
    id: "1",
    name: "Premium Oud Collection Set",
    seller: "Arabian Scents Boutique",
    sellerAvatar: "arabian-scents",
    price: 450,
    category: "Oud",
    status: "approved",
    rating: 4.9,
    reviews: 156,
    reportCount: 0,
    createdAt: "Mar 10, 2024",
  },
  {
    id: "2",
    name: "Arabian Nights Perfume 100ml",
    seller: "Arabian Scents Boutique",
    sellerAvatar: "arabian-scents",
    price: 320,
    category: "Perfumes",
    status: "pending",
    rating: 0,
    reviews: 0,
    reportCount: 0,
    createdAt: "Mar 12, 2024",
  },
  {
    id: "3",
    name: "Handmade Silver Jewelry Set",
    seller: "Dubai Crafts Co.",
    sellerAvatar: "dubai-crafts",
    price: 890,
    category: "Jewelry",
    status: "pending",
    rating: 0,
    reviews: 0,
    reportCount: 0,
    createdAt: "Mar 13, 2024",
  },
  {
    id: "4",
    name: "Suspicious Product",
    seller: "Unknown Seller",
    sellerAvatar: "unknown-seller",
    price: 50,
    category: "Other",
    status: "flagged",
    rating: 1.2,
    reviews: 8,
    reportCount: 5,
    createdAt: "Mar 8, 2024",
  },
  {
    id: "5",
    name: "Traditional Bakhoor Set",
    seller: "Emirates Artisan",
    sellerAvatar: "emirates-artisan",
    price: 150,
    category: "Bakhoor",
    status: "approved",
    rating: 4.7,
    reviews: 234,
    reportCount: 0,
    createdAt: "Feb 28, 2024",
  },
];

const STATUS_OPTIONS = [
  { id: "all", label: "All Products" },
  { id: "pending", label: "Pending Review" },
  { id: "approved", label: "Approved" },
  { id: "flagged", label: "Flagged" },
  { id: "rejected", label: "Rejected" },
];

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Product Moderation</h1>
          </div>
          <p className="text-muted-foreground">
            Review and moderate marketplace products
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
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">2,456</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">34</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Flag className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Flagged</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">2,389</p>
              <p className="text-sm text-muted-foreground">Approved</p>
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
              placeholder="Search products..."
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

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-start p-4 font-medium">Product</th>
                <th className="text-start p-4 font-medium">Seller</th>
                <th className="text-start p-4 font-medium">Category</th>
                <th className="text-start p-4 font-medium">Price</th>
                <th className="text-start p-4 font-medium">Status</th>
                <th className="text-start p-4 font-medium">Rating</th>
                <th className="text-end p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "border-b last:border-0 hover:bg-muted/30",
                    product.status === "flagged" && "bg-red-50/50"
                  )}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-muted to-muted/50" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {product.createdAt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <DiceBearAvatar seed={product.sellerAvatar} size="sm" />
                      <span className="text-sm">{product.seller}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">
                      <Tag className="w-3 h-3 me-1" />
                      {product.category}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium">AED {product.price}</td>
                  <td className="p-4">
                    <Badge
                      className={cn(
                        product.status === "approved" && "bg-green-100 text-green-700",
                        product.status === "pending" && "bg-yellow-100 text-yellow-700",
                        product.status === "flagged" && "bg-red-100 text-red-700",
                        product.status === "rejected" && "bg-gray-100 text-gray-700"
                      )}
                    >
                      {product.status === "approved" && <CheckCircle className="w-3 h-3 me-1" />}
                      {product.status === "pending" && <Clock className="w-3 h-3 me-1" />}
                      {product.status === "flagged" && <Flag className="w-3 h-3 me-1" />}
                      {product.status === "rejected" && <XCircle className="w-3 h-3 me-1" />}
                      {product.status}
                      {product.reportCount > 0 && ` (${product.reportCount})`}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {product.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No reviews</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {product.status === "pending" ? (
                        <>
                          <Button size="icon" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="icon">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      ) : product.status === "flagged" ? (
                        <>
                          <Button size="icon" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Flag className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing 1-5 of 2,456 products
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
