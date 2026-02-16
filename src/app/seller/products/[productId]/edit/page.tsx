"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/types";
import {
  ArrowLeft, Save, Eye, Trash2, Package, Image as ImageIcon,
  DollarSign, Box, Settings, Upload, X, Loader2
} from "lucide-react";

const CATEGORIES = [
  "Jewelry", "Home Décor", "Arabic Calligraphy", "Perfumes & Oud",
  "Fashion", "Food & Sweets", "Baby & Kids", "Wellness & Beauty",
  "Tech Accessories", "Gifts & Occasions", "Handmade Crafts", "Plants & Flowers"
];

const TABS = [
  { id: "basic", label: "Basic Info", icon: Package },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "availability", label: "Availability", icon: Box },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [activeTab, setActiveTab] = React.useState("basic");
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  // Editable fields (AED for display)
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [status, setStatus] = React.useState("active");
  const [tags, setTags] = React.useState<string[]>([]);
  const [images, setImages] = React.useState<string[]>([]);
  const [priceAED, setPriceAED] = React.useState("");
  const [compareAtPriceAED, setCompareAtPriceAED] = React.useState("");
  const [costAED, setCostAED] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [condition, setCondition] = React.useState("new");
  const [autoRenew, setAutoRenew] = React.useState(true);
  const [allowOffers, setAllowOffers] = React.useState(true);
  const [isHandmade, setIsHandmade] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/seller/products/${productId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const p: Product = data.product;
        setProduct(p);
        setTitle(p.title);
        setDescription(p.description);
        setCategory(p.category || "");
        setStatus(p.status);
        setTags(p.tags);
        setImages(p.images);
        setPriceAED((p.priceFils / 100).toString());
        setCompareAtPriceAED(p.compareAtPriceFils ? (p.compareAtPriceFils / 100).toString() : "");
        setCostAED(p.costFils ? (p.costFils / 100).toString() : "");
        setSku(p.sku || "");
        setCondition(p.condition || "new");
        setAutoRenew(p.autoRenew);
        setAllowOffers(p.allowOffers);
        setIsHandmade(p.isHandmade);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/seller/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category: category || null,
          status,
          tags,
          images,
          priceFils: Math.round(parseFloat(priceAED) * 100),
          compareAtPriceFils: compareAtPriceAED ? Math.round(parseFloat(compareAtPriceAED) * 100) : null,
          costFils: costAED ? Math.round(parseFloat(costAED) * 100) : null,
          sku: sku || null,
          condition,
          autoRenew,
          allowOffers,
          isHandmade,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProduct(data.product);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/seller/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/seller/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setIsDeleting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (images.length >= 8) break;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setImages((prev) => [...prev, data.url]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground">{error || "Product not found"}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/seller/products">Back to Listings</Link>
        </Button>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold">Edit Listing</h1>
            <p className="text-muted-foreground">{product.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/products/${product.slug}`} target="_blank">
              <Eye className="w-4 h-4 me-2" />
              Preview
            </Link>
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-moulna-gold hover:bg-moulna-gold-dark"
          >
            {isSaving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

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
              <Label htmlFor="name">Listing Name</Label>
              <Input
                id="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
                rows={6}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="sold">Sold</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  placeholder="Add tag..."
                  className="w-32 h-6 text-sm"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <input
                type="checkbox"
                id="handmadeEdit"
                checked={isHandmade}
                onChange={(e) => setIsHandmade(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="handmadeEdit" className="flex-1">
                <span className="font-medium">Handmade item</span>
                <p className="text-sm text-muted-foreground">Gets a special badge</p>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Media Tab */}
      {activeTab === "media" && (
        <Card className="p-6">
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <div>
              <Label>Listing Images</Label>
              <p className="text-sm text-muted-foreground mb-4">
                First image is the main image. Max 8 images.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {index === 0 && (
                      <Badge className="absolute top-2 left-2 bg-moulna-gold">Main</Badge>
                    )}
                  </div>
                ))}
                {images.length < 8 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:border-moulna-gold transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {uploading ? "Uploading..." : "Add Image"}
                    </span>
                  </button>
                )}
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
                  value={priceAED}
                  onChange={(e) => setPriceAED(e.target.value)}
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="comparePrice">Compare at Price (AED)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  value={compareAtPriceAED}
                  onChange={(e) => setCompareAtPriceAED(e.target.value)}
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Original price to show discount
                </p>
              </div>
            </div>
            <div className="max-w-xs">
              <Label htmlFor="cost">Cost per Item (AED)</Label>
              <Input
                id="cost"
                type="number"
                value={costAED}
                onChange={(e) => setCostAED(e.target.value)}
                className="mt-1"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground mt-1">Private, not shown to buyers</p>
            </div>
          </div>
        </Card>
      )}

      {/* Availability Tab */}
      {activeTab === "availability" && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">Reference ID</Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3"
                >
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Auto-renew listing</p>
                <p className="text-sm text-muted-foreground">
                  Automatically renew when listing expires
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Accept offers</p>
                <p className="text-sm text-muted-foreground">
                  Allow buyers to send price offers
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowOffers}
                onChange={(e) => setAllowOffers(e.target.checked)}
                className="w-4 h-4"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <Card className="p-6">
          <div className="space-y-4">
            <hr className="my-2" />
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h3 className="font-medium text-red-800 dark:text-red-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                Once you delete a listing, there is no going back.
              </p>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Trash2 className="w-4 h-4 me-2" />}
                Delete Listing
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
