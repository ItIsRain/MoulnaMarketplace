"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tag, Search, Plus, Edit, Trash2, ChevronRight, ChevronDown,
  GripVertical, Image, Package, Eye, EyeOff
} from "lucide-react";

const CATEGORIES = [
  {
    id: "1",
    name: "Fragrances",
    slug: "fragrances",
    productCount: 456,
    icon: "🌸",
    status: "active",
    children: [
      { id: "1-1", name: "Oud", slug: "oud", productCount: 189, status: "active" },
      { id: "1-2", name: "Perfumes", slug: "perfumes", productCount: 167, status: "active" },
      { id: "1-3", name: "Bakhoor", slug: "bakhoor", productCount: 78, status: "active" },
      { id: "1-4", name: "Incense", slug: "incense", productCount: 22, status: "active" },
    ],
  },
  {
    id: "2",
    name: "Handmade Crafts",
    slug: "handmade-crafts",
    productCount: 234,
    icon: "🎨",
    status: "active",
    children: [
      { id: "2-1", name: "Pottery", slug: "pottery", productCount: 67, status: "active" },
      { id: "2-2", name: "Textiles", slug: "textiles", productCount: 89, status: "active" },
      { id: "2-3", name: "Woodwork", slug: "woodwork", productCount: 45, status: "active" },
      { id: "2-4", name: "Calligraphy", slug: "calligraphy", productCount: 33, status: "active" },
    ],
  },
  {
    id: "3",
    name: "Jewelry",
    slug: "jewelry",
    productCount: 178,
    icon: "💎",
    status: "active",
    children: [
      { id: "3-1", name: "Gold", slug: "gold", productCount: 56, status: "active" },
      { id: "3-2", name: "Silver", slug: "silver", productCount: 78, status: "active" },
      { id: "3-3", name: "Pearls", slug: "pearls", productCount: 44, status: "active" },
    ],
  },
  {
    id: "4",
    name: "Traditional Wear",
    slug: "traditional-wear",
    productCount: 156,
    icon: "👘",
    status: "active",
    children: [],
  },
  {
    id: "5",
    name: "Home Decor",
    slug: "home-decor",
    productCount: 123,
    icon: "🏠",
    status: "inactive",
    children: [],
  },
];

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

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
        <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
          <Plus className="w-4 h-4 me-2" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-muted-foreground">Total Categories</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">5</p>
          <p className="text-sm text-muted-foreground">Parent Categories</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">11</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">1,147</p>
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

      {/* Categories Tree */}
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
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Parent Category */}
              <div className="p-4 hover:bg-muted/30">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    {category.children.length > 0 && (
                      <button onClick={() => toggleExpand(category.id)}>
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                    {category.children.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {category.children.length} sub
                      </Badge>
                    )}
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
                    <Badge
                      className={cn(
                        category.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {category.status === "active" ? (
                        <Eye className="w-3 h-3 me-1" />
                      ) : (
                        <EyeOff className="w-3 h-3 me-1" />
                      )}
                      {category.status}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Child Categories */}
              {expandedCategories.includes(category.id) &&
                category.children.map((child) => (
                  <div
                    key={child.id}
                    className="p-4 ps-16 bg-muted/20 hover:bg-muted/40 border-s-4 border-moulna-gold/30"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                        <span className="text-sm">{child.name}</span>
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {child.slug}
                      </div>
                      <div className="col-span-2">
                        <Badge variant="secondary" className="text-xs">
                          <Package className="w-3 h-3 me-1" />
                          {child.productCount}
                        </Badge>
                      </div>
                      <div className="col-span-1">
                        <Badge
                          className={cn(
                            "text-xs",
                            child.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {child.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
