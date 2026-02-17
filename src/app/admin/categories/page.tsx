"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tag, Search, Edit, Eye, Package, Loader2, Info
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
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
        <p className="mt-4 text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Category Management</h1>
          </div>
          <p className="text-muted-foreground">
            Organize and manage product categories
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
          <Info className="w-4 h-4" />
          <span>Categories are derived from products</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{totalCategories}</p>
          <p className="text-sm text-muted-foreground">Total Categories</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{totalCategories}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{totalProducts.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Products</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
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
      <Card>
        <div className="p-4 border-b bg-muted/50">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Category</div>
            <div className="col-span-2">Slug</div>
            <div className="col-span-2">Products</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-end">Actions</div>
          </div>
        </div>
        <div className="divide-y">
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground font-medium">
                {searchQuery
                  ? "No categories match your search"
                  : "No categories yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "Categories will appear here once products are added"}
              </p>
            </div>
          ) : (
            filteredCategories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="p-4 hover:bg-muted/30">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 flex items-center gap-3">
                      <Tag className="w-4 h-4 text-moulna-gold/60" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {category.slug}
                    </div>
                    <div className="col-span-2">
                      <Badge variant="secondary">
                        <Package className="w-3 h-3 me-1" />
                        {category.productCount}
                      </Badge>
                    </div>
                    <div className="col-span-1">
                      <Badge className="bg-green-100 text-green-700">
                        <Eye className="w-3 h-3 me-1" />
                        active
                      </Badge>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
