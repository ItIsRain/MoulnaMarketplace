"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Save, Eye, Trash2, Package, Image as ImageIcon,
  DollarSign, Box, Settings, Upload, X, GripVertical
} from "lucide-react";

// Mock product data
const PRODUCT = {
  id: "prod_001",
  name: "Royal Oud Collection",
  description: "Experience the essence of Arabian luxury with our Royal Oud Collection. This premium fragrance is crafted from the finest oud wood, aged to perfection over decades. The rich, woody notes are complemented by subtle hints of rose and amber, creating a sophisticated scent that lingers throughout the day.",
  category: "Perfumes & Oud",
  price: 450,
  comparePrice: 520,
  stock: 25,
  sku: "ROU-50ML-001",
  status: "active",
  images: [
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400",
  ],
  variants: [
    { name: "50ml", price: 450, stock: 15 },
    { name: "100ml", price: 750, stock: 10 },
  ],
  tags: ["oud", "perfume", "luxury", "arabian"],
};

const TABS = [
  { id: "basic", label: "Basic Info", icon: Package },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "inventory", label: "Inventory", icon: Box },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function EditProductPage() {
  const params = useParams();
  const productId = params.productId as string;

  const [activeTab, setActiveTab] = React.useState("basic");
  const [product, setProduct] = React.useState(PRODUCT);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/seller/products">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Product</h1>
              <p className="text-muted-foreground">ID: {productId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/products/${productId}`} target="_blank">
                <Eye className="w-4 h-4 me-2" />
                Preview
              </Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-moulna-gold hover:bg-moulna-gold-dark"
            >
              <Save className="w-4 h-4 me-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0"
            >
              <tab.icon className="w-4 h-4 me-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  className="mt-1"
                  rows={6}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3"
                  >
                    <option>Perfumes & Oud</option>
                    <option>Jewelry</option>
                    <option>Home Décor</option>
                    <option>Arabic Art</option>
                    <option>Fashion</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={product.status}
                    onChange={(e) => setProduct({ ...product, status: e.target.value })}
                    className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <Input placeholder="Add tag..." className="w-32 h-6 text-sm" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label>Product Images</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag to reorder. First image is the main image.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <GripVertical className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="icon" className="h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {index === 0 && (
                        <Badge className="absolute top-2 left-2 bg-moulna-gold">Main</Badge>
                      )}
                    </div>
                  ))}
                  <button className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:border-moulna-gold transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Add Image</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (AED)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="comparePrice">Compare at Price (AED)</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    value={product.comparePrice}
                    onChange={(e) => setProduct({ ...product, comparePrice: Number(e.target.value) })}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Original price to show discount
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Variants</h3>
                <div className="space-y-3">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <Input
                        value={variant.name}
                        className="w-32"
                        placeholder="Variant name"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">AED</span>
                        <Input
                          type="number"
                          value={variant.price}
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Stock:</span>
                        <Input
                          type="number"
                          value={variant.stock}
                          className="w-20"
                        />
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline">
                    Add Variant
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={product.sku}
                    onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Track inventory</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically decrease stock when orders are placed
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Low stock alert</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when stock falls below threshold
                  </p>
                </div>
                <Input type="number" defaultValue={5} className="w-20" />
              </div>
            </div>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Product visibility</p>
                  <p className="text-sm text-muted-foreground">
                    Show this product on your shop page
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Featured product</p>
                  <p className="text-sm text-muted-foreground">
                    Display this product in featured sections
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Allow reviews</p>
                  <p className="text-sm text-muted-foreground">
                    Let customers leave reviews on this product
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>

              <hr className="my-6" />

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete a product, there is no going back.
                </p>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 me-2" />
                  Delete Product
                </Button>
              </div>
            </div>
          </Card>
        )}
    </div>
  );
}
