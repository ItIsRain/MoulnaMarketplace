"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/types";
import {
  Package, Plus, Search, MoreVertical,
  Edit2, Trash2, Eye, Star, TrendingUp,
  Copy, Loader2
} from "lucide-react";

const statusConfig: Record<string, { label: string; variant: "active" | "lowStock" | "outOfStock" | "draft" }> = {
  active: { label: "Active", variant: "active" },
  expired: { label: "Expired", variant: "lowStock" },
  sold: { label: "Sold", variant: "outOfStock" },
  draft: { label: "Draft", variant: "draft" },
  hidden: { label: "Hidden", variant: "draft" },
};

function getDaysLeft(expiresAt?: string): number | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function SellerProductsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (searchQuery) params.set("search", searchQuery);

    try {
      const res = await fetch(`/api/seller/products?${params}`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  React.useEffect(() => {
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  const stats = {
    total,
    active: products.filter(p => p.status === "active").length,
    expired: products.filter(p => p.status === "expired").length,
    sold: products.filter(p => p.status === "sold").length,
    draft: products.filter(p => p.status === "draft").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <Package className="w-6 h-6" />
            Listings
          </h1>
          <p className="text-muted-foreground">
            Manage your listings
          </p>
        </div>
        <Button variant="gold" asChild>
          <Link href="/seller/products/new">
            <Plus className="w-4 h-4 me-2" />
            Add Listing
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Active", value: stats.active, color: "text-emerald-600" },
          { label: "Expired", value: stats.expired, color: "text-yellow-600" },
          { label: "Sold", value: stats.sold, color: "text-red-600" },
          { label: "Draft", value: stats.draft, color: "text-muted-foreground" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 text-center">
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search listings by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "expired", "sold", "draft"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? "bg-moulna-gold hover:bg-moulna-gold-dark" : ""}
              >
                {status === "all" ? "All" : statusConfig[status]?.label || status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Products List */}
      <Card>
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-start p-4 text-sm font-medium text-muted-foreground">Product</th>
                    <th className="text-start p-4 text-sm font-medium text-muted-foreground">SKU</th>
                    <th className="text-start p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-start p-4 text-sm font-medium text-muted-foreground">Expires</th>
                    <th className="text-start p-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-start p-4 text-sm font-medium text-muted-foreground">Inquiries</th>
                    <th className="text-start p-4 text-sm font-medium text-muted-foreground">Views</th>
                    <th className="text-start p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    const status = statusConfig[product.status] || { label: product.status, variant: "draft" as const };
                    const daysLeft = getDaysLeft(product.expiresAt);

                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">{product.title}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {product.isTrending && (
                                  <Badge variant="outline" className="text-xs py-0">
                                    <TrendingUp className="w-3 h-3 me-1" />
                                    Trending
                                  </Badge>
                                )}
                                {product.isHandmade && (
                                  <Badge variant="outline" className="text-xs py-0">
                                    Handmade
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <code className="text-sm text-muted-foreground">{product.sku || "—"}</code>
                        </td>
                        <td className="p-4">
                          <Badge variant={status.variant}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {daysLeft !== null ? (
                            <span className={cn(
                              "font-medium",
                              daysLeft === 0 && "text-red-600",
                              daysLeft > 0 && daysLeft <= 5 && "text-yellow-600"
                            )}>
                              {daysLeft > 0 ? `${daysLeft}d` : "Ended"}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-4 font-medium">
                          {formatAED(product.priceFils)}
                        </td>
                        <td className="p-4">
                          <span className="font-medium">{product.inquiryCount}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">{product.viewCount}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/seller/products/${product.id}/edit`}>
                                <Edit2 className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/products/${product.slug}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No listings found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Add your first listing to get started"
                  }
                </p>
                <Button variant="gold" asChild>
                  <Link href="/seller/products/new">
                    <Plus className="w-4 h-4 me-2" />
                    Add Listing
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
