"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Tag, Search, Eye, Package, Loader2, Info, ExternalLink
} from "lucide-react";

interface Category {
  name: string;
  slug: string;
  productCount: number;
}

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [totalCategories, setTotalCategories] = React.useState(0);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.categories || []);
        setTotalCategories(data.totalCategories || 0);
        setTotalProducts(data.totalProducts || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-moulna-gold" />
        <p className="mt-3 text-sm text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-500">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-moulna-gold" />
            <h1 className="text-xl font-display font-semibold text-foreground">Category Management</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize and manage product categories
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
          <Info className="w-3.5 h-3.5" />
          <span>Categories are derived from products</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Categories", value: totalCategories },
          { label: "Avg Products / Category", value: totalCategories > 0 ? (totalProducts / totalCategories).toFixed(1) : "0" },
          { label: "Total Products", value: totalProducts.toLocaleString() },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 shadow-sm px-5 py-4">
            <p className="text-lg font-semibold tabular-nums">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="border-border/60 shadow-sm px-5 py-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10"
          />
        </div>
      </Card>

      {/* Categories List */}
      <Card className="border-border/60 shadow-sm">
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <h2 className="text-sm font-semibold text-foreground">Categories</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-start px-5 py-3 font-medium text-muted-foreground">Category</th>
                <th className="text-start px-5 py-3 font-medium text-muted-foreground">Slug</th>
                <th className="text-start px-5 py-3 font-medium text-muted-foreground">Products</th>
                <th className="text-start px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-end px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Package className="w-5 h-5 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">
                      {searchQuery
                        ? "No categories match your search"
                        : "No categories yet"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {searchQuery
                        ? "Try a different search term"
                        : "Categories will appear here once products are added"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <motion.tr
                    key={category.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-moulna-gold/60" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {category.slug}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary" className="text-xs">
                        <Package className="w-3 h-3 me-1" />
                        <span className="tabular-nums">{category.productCount}</span>
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        <Eye className="w-3 h-3 me-1" />
                        active
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                          <Link href={`/explore/categories/${category.slug}`}>
                            <ExternalLink className="w-3.5 h-3.5 me-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
