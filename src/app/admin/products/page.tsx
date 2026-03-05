"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, formatDate, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import Link from "next/link";
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
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/admin/products?page=${page}&status=${selectedStatus}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products);
      setTotalCount(data.totalCount);
      setStatusCounts(data.statusCounts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, selectedStatus, searchQuery]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleProductAction(
    productId: string,
    action: "approve" | "reject" | "delete"
  ) {
    if (action === "delete") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      );
      if (!confirmed) return;
    }

    setActionLoading(productId);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }
      await fetchProducts();
    } catch (err) {
      console.error("Product action error:", err);
    } finally {
      setActionLoading(null);
    }
  }

  // Reset to page 1 when status filter changes
  React.useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  // Debounced page reset when search query changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  function handleExport() {
    const headers = ["Title", "Seller", "Category", "Price", "Status", "Views", "Inquiries", "Created"];
    const rows = products.map((p) => [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.seller.replace(/"/g, '""')}"`,
      `"${p.category.replace(/"/g, '""')}"`,
      `AED ${(p.priceFils / 100).toFixed(2)}`,
      p.status,
      String(p.viewCount),
      String(p.inquiryCount),
      p.createdAt,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const statCards = [
    {
      label: "Total Products",
      value: statusCounts.all,
      icon: Package,
      color: "text-blue-500",
    },
    {
      label: "Pending Review",
      value: statusCounts.pending,
      icon: Clock,
      color: "text-amber-500",
    },
    {
      label: "Draft",
      value: statusCounts.draft,
      icon: Package,
      color: "text-muted-foreground",
    },
    {
      label: "Active",
      value: statusCounts.active,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-semibold text-foreground">
            Product Moderation
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review and moderate marketplace products
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 me-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className="px-4 py-3 border-border/60 shadow-sm">
              <div className="flex items-center gap-3">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                <div className="flex items-baseline gap-2 flex-1">
                  <span className="text-lg font-bold tabular-nums">
                    {stat.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {stat.label}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="px-4 py-3 border-border/60 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10 h-9"
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
                  "h-9",
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
      <Card className="border-border/60 shadow-sm">
        <div className="px-5 pt-5 pb-4 border-b border-border/60 flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Package className="w-4 h-4 text-moulna-gold" />
            Products
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {totalCount.toLocaleString()} total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">Product</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">Seller</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">Category</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">Price</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">Rating</th>
                <th className="text-end px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin text-moulna-gold" />
                      <span className="text-sm">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Package className="w-8 h-8 text-muted-foreground/30" />
                      <p className="text-sm font-medium">No products found</p>
                      <p className="text-xs">
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
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-muted flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{product.title}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {formatDate(product.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <DiceBearAvatar
                          seed={product.sellerAvatarSeed}
                          style={product.sellerAvatarStyle}
                          size="sm"
                        />
                        <span className="truncate">{product.seller}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-[11px] font-normal">
                        <Tag className="w-3 h-3 me-1" />
                        {product.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium tabular-nums">
                      {formatAED(product.priceFils)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[11px]",
                          product.status === "active" &&
                            "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
                          product.status === "pending" &&
                            "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
                          product.status === "draft" &&
                            "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"
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
                    <td className="px-4 py-3">
                      {product.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium tabular-nums">{product.rating}</span>
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            ({product.reviewCount})
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No reviews
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/products/${product.slug}`}>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {product.status === "pending" ? (
                          <>
                            <Button
                              size="icon"
                              className="w-8 h-8 bg-green-600 hover:bg-green-700"
                              disabled={actionLoading === product.id}
                              onClick={() => handleProductAction(product.id, "approve")}
                            >
                              {actionLoading === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="w-8 h-8"
                              disabled={actionLoading === product.id}
                              onClick={() => handleProductAction(product.id, "reject")}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-red-600"
                            disabled={actionLoading === product.id}
                            onClick={() => handleProductAction(product.id, "delete")}
                          >
                            {actionLoading === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
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
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/60">
          <p className="text-xs text-muted-foreground tabular-nums">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
