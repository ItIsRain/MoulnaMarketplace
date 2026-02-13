"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Layers, Plus, Edit, Trash2, GripVertical, ChevronRight,
  ChevronDown, FolderOpen, Package, Search, MoreHorizontal
} from "lucide-react";

const CATEGORIES = [
  {
    id: "1",
    name: "Fragrances",
    slug: "fragrances",
    productCount: 45,
    children: [
      { id: "1-1", name: "Oud", slug: "oud", productCount: 18 },
      { id: "1-2", name: "Perfumes", slug: "perfumes", productCount: 15 },
      { id: "1-3", name: "Bakhoor", slug: "bakhoor", productCount: 12 },
    ],
  },
  {
    id: "2",
    name: "Home Décor",
    slug: "home-decor",
    productCount: 32,
    children: [
      { id: "2-1", name: "Lanterns", slug: "lanterns", productCount: 10 },
      { id: "2-2", name: "Cushions", slug: "cushions", productCount: 8 },
      { id: "2-3", name: "Wall Art", slug: "wall-art", productCount: 14 },
    ],
  },
  {
    id: "3",
    name: "Fashion",
    slug: "fashion",
    productCount: 28,
    children: [
      { id: "3-1", name: "Abayas", slug: "abayas", productCount: 12 },
      { id: "3-2", name: "Accessories", slug: "accessories", productCount: 16 },
    ],
  },
  {
    id: "4",
    name: "Jewelry",
    slug: "jewelry",
    productCount: 23,
    children: [],
  },
  {
    id: "5",
    name: "Food & Spices",
    slug: "food-spices",
    productCount: 18,
    children: [],
  },
];

export default function ProductCategoriesPage() {
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>(["1"]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showAddCategory, setShowAddCategory] = React.useState(false);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const filteredCategories = CATEGORIES.filter(
    cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="w-7 h-7 text-moulna-gold" />
            Product Categories
          </h1>
          <p className="text-muted-foreground">
            Organize your products into categories
          </p>
        </div>
        <Button
          onClick={() => setShowAddCategory(true)}
          className="bg-moulna-gold hover:bg-moulna-gold-dark"
        >
          <Plus className="w-4 h-4 me-2" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-moulna-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold">{CATEGORIES.length}</p>
              <p className="text-xs text-muted-foreground">Main Categories</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {CATEGORIES.reduce((acc, cat) => acc + cat.children.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Sub-categories</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {CATEGORIES.reduce((acc, cat) => acc + cat.productCount, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Products</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Max Depth</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ps-10"
        />
      </div>

      {/* Add Category Form */}
      {showAddCategory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Add New Category</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Category Name</label>
                <Input placeholder="e.g., Handmade Crafts" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Parent Category (Optional)</label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3">
                  <option value="">None (Top Level)</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
                Create Category
              </Button>
              <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Categories List */}
      <Card className="p-6">
        <div className="space-y-2">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Main Category */}
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors",
                expandedCategories.includes(category.id) && "bg-muted/50"
              )}>
                <button className="cursor-grab text-muted-foreground hover:text-foreground">
                  <GripVertical className="w-4 h-4" />
                </button>

                {category.children.length > 0 ? (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <span className="w-4" />
                )}

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
                  {category.productCount} products
                </Badge>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Sub-categories */}
              {expandedCategories.includes(category.id) && category.children.length > 0 && (
                <div className="ms-12 space-y-1 mt-1">
                  {category.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <button className="cursor-grab text-muted-foreground hover:text-foreground">
                        <GripVertical className="w-4 h-4" />
                      </button>

                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                        <FolderOpen className="w-3 h-3 text-muted-foreground" />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-sm">{child.name}</p>
                        <p className="text-xs text-muted-foreground">
                          /{category.slug}/{child.slug}
                        </p>
                      </div>

                      <Badge variant="outline" className="text-xs">
                        {child.productCount} products
                      </Badge>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add Sub-category Button */}
                  <button className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="w-4 h-4" />
                    Add sub-category
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No categories found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Try a different search term"
                : "Start by adding your first category"}
            </p>
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Tips for organizing categories</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep category names clear and descriptive</li>
          <li>• Use sub-categories for more specific product types</li>
          <li>• Drag and drop to reorder categories</li>
          <li>• Products can belong to multiple categories</li>
        </ul>
      </Card>
    </div>
  );
}
