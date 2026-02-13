"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Package, ArrowLeft, Upload, X, Plus, Sparkles,
  Info, Tag, DollarSign, Boxes, Image as ImageIcon,
  FileText, Settings, Eye, Save, Send
} from "lucide-react";

const CATEGORIES = [
  "Jewelry", "Home Décor", "Arabic Calligraphy", "Perfumes & Oud",
  "Fashion", "Food & Sweets", "Baby & Kids", "Wellness & Beauty",
  "Tech Accessories", "Gifts & Occasions", "Handmade Crafts", "Plants & Flowers"
];

const TAGS = [
  "Handmade", "Eco-friendly", "Limited Edition", "Best Seller",
  "New Arrival", "Gift Ready", "Customizable", "Local UAE"
];

export default function NewProductPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [images, setImages] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [isHandmade, setIsHandmade] = React.useState(true);

  const handleImageUpload = () => {
    // Mock image upload
    const mockImages = [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",
    ];
    setImages([...images, mockImages[images.length % 2]]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
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
            <h1 className="font-display text-2xl font-bold flex items-center gap-3">
              <Package className="w-6 h-6" />
              Add New Product
            </h1>
            <p className="text-muted-foreground">
              List a new product in your shop
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 me-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Save className="w-4 h-4 me-2" />
            Save Draft
          </Button>
          <Button variant="gold">
            <Send className="w-4 h-4 me-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Basic Info", icon: FileText },
            { num: 2, label: "Media", icon: ImageIcon },
            { num: 3, label: "Pricing", icon: DollarSign },
            { num: 4, label: "Inventory", icon: Boxes },
            { num: 5, label: "Settings", icon: Settings },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <button
                onClick={() => setStep(s.num)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  step === s.num
                    ? "bg-moulna-gold text-white"
                    : step > s.num
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <s.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 4 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2",
                  step > s.num ? "bg-emerald-500" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* XP Tip */}
      <Card className="p-4 border-moulna-gold/50 bg-moulna-gold/5">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-moulna-gold" />
          <div>
            <p className="font-medium">Earn +25 XP for listing a new product!</p>
            <p className="text-sm text-muted-foreground">
              Add 5+ photos for an extra +10 XP bonus
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Product Title *
                    </label>
                    <Input
                      placeholder="e.g., Handcrafted Arabian Oud Perfume - 100ml"
                      className="text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Be specific and include key details
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Description *
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Describe your product in detail. Include materials, dimensions, care instructions, and what makes it special..."
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Category *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            "p-2 text-sm rounded-lg border transition-colors text-start",
                            selectedCategory === cat
                              ? "border-moulna-gold bg-moulna-gold/10 text-moulna-gold"
                              : "border-muted hover:border-moulna-gold/50"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Tags (select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "px-3 py-1.5 text-sm rounded-full border transition-colors",
                            selectedTags.includes(tag)
                              ? "border-moulna-gold bg-moulna-gold/10 text-moulna-gold"
                              : "border-muted hover:border-moulna-gold/50"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <input
                      type="checkbox"
                      id="handmade"
                      checked={isHandmade}
                      onChange={(e) => setIsHandmade(e.target.checked)}
                      className="w-5 h-5 rounded border-moulna-gold text-moulna-gold focus:ring-moulna-gold"
                    />
                    <label htmlFor="handmade" className="flex-1">
                      <span className="font-medium">This is a handmade item</span>
                      <p className="text-sm text-muted-foreground">
                        Handmade products get a special badge and are featured in curated collections
                      </p>
                    </label>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button variant="gold" onClick={() => setStep(2)}>
                  Continue to Media
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Media */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Product Media
                </h2>

                <div className="space-y-4">
                  {/* Image Upload Area */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden group"
                      >
                        <Image
                          src={img}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-moulna-gold">
                            Main
                          </Badge>
                        )}
                      </div>
                    ))}
                    {images.length < 8 && (
                      <button
                        onClick={handleImageUpload}
                        className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-moulna-gold hover:bg-moulna-gold/5 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Add Image</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-700 dark:text-blue-400">Photo Tips</p>
                      <ul className="text-blue-600 dark:text-blue-300 mt-1 space-y-1">
                        <li>• Use natural lighting for best results</li>
                        <li>• Show your product from multiple angles</li>
                        <li>• Include a photo showing scale/size</li>
                        <li>• Minimum 800x800 pixels recommended</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Product Video (Optional)
                    </label>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Upload a video (max 30 seconds, 50MB)
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="gold" onClick={() => setStep(3)}>
                  Continue to Pricing
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Price (AED) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          AED
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="ps-14"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Compare at Price (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          AED
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="ps-14"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Show a strikethrough price
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Cost per Item (for your records)
                    </label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        AED
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="ps-14"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This won&apos;t be shown to customers
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-3">Moulna Fees</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform fee</span>
                        <span>5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment processing</span>
                        <span>2.5%</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-medium">
                        <span>Your earnings (est.)</span>
                        <span className="text-emerald-600">AED 0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button variant="gold" onClick={() => setStep(4)}>
                  Continue to Inventory
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Inventory */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Boxes className="w-5 h-5" />
                  Inventory
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        SKU
                      </label>
                      <Input placeholder="e.g., OUD-001" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Barcode (Optional)
                      </label>
                      <Input placeholder="ISBN, UPC, etc." />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Quantity *
                      </label>
                      <Input type="number" placeholder="0" min="0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Low Stock Alert
                      </label>
                      <Input type="number" placeholder="5" min="0" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get notified when stock falls below this
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <input
                      type="checkbox"
                      id="trackInventory"
                      defaultChecked
                      className="w-5 h-5 rounded border-moulna-gold text-moulna-gold focus:ring-moulna-gold"
                    />
                    <label htmlFor="trackInventory" className="flex-1">
                      <span className="font-medium">Track inventory</span>
                      <p className="text-sm text-muted-foreground">
                        Automatically update stock when orders are placed
                      </p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <input
                      type="checkbox"
                      id="allowBackorder"
                      className="w-5 h-5 rounded border-moulna-gold text-moulna-gold focus:ring-moulna-gold"
                    />
                    <label htmlFor="allowBackorder" className="flex-1">
                      <span className="font-medium">Continue selling when out of stock</span>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to order even when stock is 0
                      </p>
                    </label>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button variant="gold" onClick={() => setStep(5)}>
                  Continue to Settings
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Settings */}
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Additional Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Processing Time
                    </label>
                    <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold">
                      <option>1-2 business days</option>
                      <option>3-5 business days</option>
                      <option>1-2 weeks</option>
                      <option>Custom (made to order)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Shipping
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:border-moulna-gold transition-colors">
                        <input type="radio" name="shipping" defaultChecked className="text-moulna-gold focus:ring-moulna-gold" />
                        <div>
                          <span className="font-medium">Use shop shipping profile</span>
                          <p className="text-sm text-muted-foreground">Standard UAE shipping rates</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:border-moulna-gold transition-colors">
                        <input type="radio" name="shipping" className="text-moulna-gold focus:ring-moulna-gold" />
                        <div>
                          <span className="font-medium">Free shipping</span>
                          <p className="text-sm text-muted-foreground">You cover shipping costs</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:border-moulna-gold transition-colors">
                        <input type="radio" name="shipping" className="text-moulna-gold focus:ring-moulna-gold" />
                        <div>
                          <span className="font-medium">Custom shipping</span>
                          <p className="text-sm text-muted-foreground">Set specific rates for this product</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Product Visibility
                    </label>
                    <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold">
                      <option>Published (visible to everyone)</option>
                      <option>Draft (only visible to you)</option>
                      <option>Hidden (unlisted, only accessible via direct link)</option>
                    </select>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(4)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="w-4 h-4 me-2" />
                    Save Draft
                  </Button>
                  <Button variant="gold">
                    <Send className="w-4 h-4 me-2" />
                    Publish Product
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Preview */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-semibold mb-4">Product Preview</h3>
            <div className="rounded-lg overflow-hidden border">
              <div className="aspect-square bg-muted flex items-center justify-center">
                {images.length > 0 ? (
                  <Image
                    src={images[0]}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <div className="p-4">
                <p className="font-medium line-clamp-2 mb-1">
                  Your product title will appear here
                </p>
                <div className="flex items-center gap-2 mb-2">
                  {isHandmade && (
                    <Badge variant="outline" className="text-xs">Handmade</Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="outline" className="text-xs">{selectedCategory}</Badge>
                  )}
                </div>
                <p className="text-lg font-bold text-moulna-gold">AED 0.00</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Listing Checklist</h4>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Title added", done: false },
                  { label: "Description written", done: false },
                  { label: "Category selected", done: !!selectedCategory },
                  { label: "At least 1 photo", done: images.length > 0 },
                  { label: "5+ photos (bonus XP)", done: images.length >= 5 },
                  { label: "Price set", done: false },
                  { label: "Stock quantity", done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center",
                      item.done ? "bg-emerald-500" : "bg-muted"
                    )}>
                      {item.done && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
