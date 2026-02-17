"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, formatDate, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Package, Search, Filter, CheckCircle, XCircle, Clock, Eye,
  Trash2, Download, Star, Store, AlertTriangle,
  Calendar, Tag, Loader2
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  seller: string;
  sellerAvatarSeed: string;
  sellerAvatarStyle: string;
  category: string;
  priceFils: number;
  status: string;
  rating: number;
  reviewCount: number;
  inquiryCount: number;
  viewCount: number;
  createdAt: string;
}

interface StatusCounts {
  all: number;
  active: number;
  pending: number;
  draft: number;
}

const STATUS_OPTIONS = [
  { id: "all", label: "All Products" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending Review" },
  { id: "draft", label: "Draft" },
];

const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [statusCounts, setStatusCounts] = React.useState<StatusCounts>({
    all: 0,
    active: 0,
    pending: 0,
    draft: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/products?page=${page}&status=${selectedStatus}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (cancelled) return;
        setProducts(data.products);
        setTotalCount(data.totalCount);
        setStatusCounts(data.statusCounts);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [page, selectedStatus]);

  // Reset to page 1 when status filter changes
  React.useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

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
              <p className="text-2xl font-bold">
                {statusCounts.all.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">
                {statusCounts.pending.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-gray-500" />
            <div>
              <p className="text-2xl font-bold">
                {statusCounts.draft.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Draft</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">
                {statusCounts.active.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Active</p>
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Package className="w-10 h-10" />
                      <p className="font-medium">No products found</p>
                      <p className="text-sm">
                        Try adjusting your filters or search query.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-muted to-muted/50" />
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(product.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DiceBearAvatar
                          seed={product.sellerAvatarSeed}
                          style={product.sellerAvatarStyle}
                          size="sm"
                        />
                        <span className="text-sm">{product.seller}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">
                        <Tag className="w-3 h-3 me-1" />
                        {product.category}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium">
                      {formatAED(product.priceFils)}
                    </td>
                    <td className="p-4">
                      <Badge
                        className={cn(
                          product.status === "active" &&
                            "bg-green-100 text-green-700",
                          product.status === "pending" &&
                            "bg-yellow-100 text-yellow-700",
                          product.status === "draft" &&
                            "bg-gray-100 text-gray-700"
                        )}
                      >
                        {product.status === "active" && (
                          <CheckCircle className="w-3 h-3 me-1" />
                        )}
                        {product.status === "pending" && (
                          <Clock className="w-3 h-3 me-1" />
                        )}
                        {product.status === "draft" && (
                          <Package className="w-3 h-3 me-1" />
                        )}
                        {product.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {product.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No reviews
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {product.status === "pending" ? (
                          <>
                            <Button
                              size="icon"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="icon">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
