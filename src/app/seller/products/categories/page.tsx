"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Layers, Package, Search, Loader2, Info,
} from "lucide-react";

interface Category {
  name: string;
  slug: string;
  productCount: number;
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [totalCategories, setTotalCategories] = React.useState(0);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/seller/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.categories ?? []);
        setTotalCategories(data.totalCategories ?? 0);
        setTotalProducts(data.totalProducts ?? 0);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="w-7 h-7 text-moulna-gold" />
          Listing Categories
        </h1>
        <p className="text-muted-foreground">
          Categories are assigned when you create or edit a listing
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-moulna-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCategories}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalProducts}</p>
              <p className="text-xs text-muted-foreground">Total Listings</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      {categories.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10"
          />
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-12">
            <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No listings yet</h3>
            <p className="text-sm text-muted-foreground">
              Create your first listing to see categories here
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-2">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-moulna-gold" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      /{category.slug}
                    </p>
                  </div>

                  <Badge variant="secondary">
                    {category.productCount} {category.productCount === 1 ? "listing" : "listings"}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCategories.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No categories found</h3>
              <p className="text-sm text-muted-foreground">
                Try a different search term
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Info note */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            Categories are automatically derived from your product listings.
            To add or change categories, edit the category field on your individual listings.
          </p>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-moulna-charcoal dark:bg-moulna-charcoal-dark border-moulna-charcoal-light/30">
        <h3 className="font-medium text-white mb-2">Tips for organizing categories</h3>
        <ul className="text-sm text-white/70 space-y-1">
          <li>• Keep category names clear and descriptive</li>
          <li>• Use consistent naming across your listings</li>
          <li>• Well-chosen categories help buyers find your products faster</li>
          <li>• You can update a listing&apos;s category at any time from the product edit page</li>
        </ul>
      </Card>
    </div>
  );
}
