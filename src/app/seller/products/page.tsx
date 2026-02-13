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
import {
  Package, Plus, Search, Filter, MoreVertical,
  Edit2, Trash2, Eye, EyeOff, Star, TrendingUp,
  AlertCircle, Archive, Copy
} from "lucide-react";

const PRODUCTS = [
  {
    id: "prd_1",
    title: "Handcrafted Arabian Oud Perfume",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200",
    priceFils: 45000,
    stock: 15,
    status: "active",
    sales: 124,
    views: 1250,
    rating: 4.8,
    reviewCount: 45,
    isTrending: true,
    isHandmade: true,
    sku: "OUD-001",
    createdAt: "2024-01-15",
  },
  {
    id: "prd_2",
    title: "Rose Oud Mist",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200",
    priceFils: 28000,
    stock: 3,
    status: "active",
    sales: 89,
    views: 890,
    rating: 4.9,
    reviewCount: 32,
    isHandmade: true,
    sku: "OUD-002",
    createdAt: "2024-01-20",
  },
  {
    id: "prd_3",
    title: "Premium Oud Gift Set",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=200",
    priceFils: 85000,
    stock: 1,
    status: "low_stock",
    sales: 45,
    views: 560,
    rating: 5.0,
    reviewCount: 18,
    isHandmade: true,
    sku: "OUD-003",
    createdAt: "2024-02-01",
  },
  {
    id: "prd_4",
    title: "Amber & Musk Blend",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=200",
    priceFils: 35000,
    stock: 22,
    status: "active",
    sales: 67,
    views: 720,
    rating: 4.7,
    reviewCount: 28,
    sku: "OUD-004",
    createdAt: "2024-02-05",
  },
  {
    id: "prd_5",
    title: "Limited Edition Royal Oud",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200",
    priceFils: 150000,
    stock: 0,
    status: "out_of_stock",
    sales: 25,
    views: 1100,
    rating: 4.9,
    reviewCount: 12,
    isHandmade: true,
    sku: "OUD-005",
    createdAt: "2024-02-08",
  },
  {
    id: "prd_6",
    title: "Home Fragrance Diffuser",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=200",
    priceFils: 22000,
    stock: 35,
    status: "draft",
    sales: 0,
    views: 0,
    rating: 0,
    reviewCount: 0,
    sku: "HOM-001",
    createdAt: "2024-02-12",
  },
];

const statusConfig: Record<string, { label: string; variant: "active" | "lowStock" | "outOfStock" | "draft" }> = {
  active: { label: "Active", variant: "active" },
  low_stock: { label: "Low Stock", variant: "lowStock" },
  out_of_stock: { label: "Out of Stock", variant: "outOfStock" },
  draft: { label: "Draft", variant: "draft" },
};

export default function SellerProductsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: PRODUCTS.length,
    active: PRODUCTS.filter(p => p.status === "active").length,
    lowStock: PRODUCTS.filter(p => p.status === "low_stock").length,
    outOfStock: PRODUCTS.filter(p => p.status === "out_of_stock").length,
    draft: PRODUCTS.filter(p => p.status === "draft").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <Package className="w-6 h-6" />
            Products
          </h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button variant="gold" asChild>
          <Link href="/seller/products/new">
            <Plus className="w-4 h-4 me-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Active", value: stats.active, color: "text-emerald-600" },
          { label: "Low Stock", value: stats.lowStock, color: "text-yellow-600" },
          { label: "Out of Stock", value: stats.outOfStock, color: "text-red-600" },
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
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "low_stock", "out_of_stock", "draft"].map((status) => (
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">SKU</th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Stock</th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Sales</th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Rating</th>
                <th className="text-start p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const status = statusConfig[product.status];

                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
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
                      <code className="text-sm text-muted-foreground">{product.sku}</code>
                    </td>
                    <td className="p-4">
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "font-medium",
                        product.stock === 0 && "text-red-600",
                        product.stock > 0 && product.stock <= 5 && "text-yellow-600"
                      )}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      {formatAED(product.priceFils)}
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{product.sales}</span>
                    </td>
                    <td className="p-4">
                      {product.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No reviews</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/seller/products/${product.id}/edit`}>
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/products/${product.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Add your first product to get started"
              }
            </p>
            <Button variant="gold" asChild>
              <Link href="/seller/products/new">
                <Plus className="w-4 h-4 me-2" />
                Add Product
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
