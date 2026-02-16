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
  Package, ArrowLeft, Upload, X, Sparkles,
  Info, DollarSign, Boxes, Image as ImageIcon,
  FileText, Settings, Eye, Save, Send, Loader2,
  ShieldCheck
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const CATEGORIES = [
  "Jewelry", "Home Décor", "Arabic Calligraphy", "Perfumes & Oud",
  "Fashion", "Food & Sweets", "Baby & Kids", "Wellness & Beauty",
  "Tech Accessories", "Gifts & Occasions", "Handmade Crafts", "Plants & Flowers"
];

const TAGS = [
  "Handmade", "Eco-friendly", "Limited Edition", "Best Seller",
  "New Arrival", "Gift Ready", "Customizable", "Local UAE"
];

const LISTING_DURATIONS = [
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 },
  { label: "90 days", value: 90 },
  { label: "Until manually removed", value: 0 },
];

const CONDITIONS = [
  { label: "New", value: "new" },
  { label: "Like New", value: "like_new" },
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
];

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [kycLoading, setKycLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const kycStatus = user?.kycStatus || "none";

  // Block listing creation if KYC not approved
  if (kycStatus !== "approved") {
    const handleStartKYC = async () => {
      setKycLoading(true);
      try {
        const res = await fetch("/api/kyc/create-session", { method: "POST" });
        const data = await res.json();
        if (data.verificationUrl) {
          window.location.href = data.verificationUrl;
        }
      } catch (err) {
        console.error("Failed to start KYC:", err);
      } finally {
        setKycLoading(false);
      }
    };

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-moulna-gold/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-moulna-gold" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">
            Complete ID Verification
          </h1>
          <p className="text-muted-foreground mb-6">
            You need to verify your identity before you can create listings. This helps keep our marketplace safe and trusted.
          </p>
          <div className="space-y-3">
            <Button
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handleStartKYC}
              disabled={kycLoading}
            >
              {kycLoading ? (
                <Loader2 className="w-4 h-4 animate-spin me-2" />
              ) : (
                <ShieldCheck className="w-4 h-4 me-2" />
              )}
              {kycStatus === "none" ? "Verify Identity" :
               (kycStatus === "pending" || kycStatus === "in_progress") ? "Continue Verification" :
               "Try Again"}
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/seller">
                <ArrowLeft className="w-4 h-4 me-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Form state
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [isHandmade, setIsHandmade] = React.useState(true);

  // Media
  const [images, setImages] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);

  // Pricing (AED inputs, converted to fils on submit)
  const [priceAED, setPriceAED] = React.useState("");
  const [compareAtPriceAED, setCompareAtPriceAED] = React.useState("");
  const [costAED, setCostAED] = React.useState("");

  // Details
  const [sku, setSku] = React.useState("");
  const [condition, setCondition] = React.useState("new");
  const [listingDuration, setListingDuration] = React.useState(30);
  const [autoRenew, setAutoRenew] = React.useState(true);
  const [allowOffers, setAllowOffers] = React.useState(true);

  // Settings
  const [processingTime, setProcessingTime] = React.useState("1-2 business days");
  const [meetupPreference, setMeetupPreference] = React.useState("flexible");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

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

  const buildPayload = (status: "active" | "draft") => {
    const priceFils = Math.round(parseFloat(priceAED) * 100);
    const compareAtPriceFils = compareAtPriceAED
      ? Math.round(parseFloat(compareAtPriceAED) * 100)
      : undefined;
    const costFils = costAED
      ? Math.round(parseFloat(costAED) * 100)
      : undefined;

    return {
      title,
      description,
      category: selectedCategory || undefined,
      tags: selectedTags,
      isHandmade,
      images,
      priceFils,
      compareAtPriceFils,
      costFils,
      sku: sku || undefined,
      condition,
      status,
      listingDuration: listingDuration || undefined,
      autoRenew,
      allowOffers,
      processingTime,
      meetupPreference,
    };
  };

  const handleSubmit = async (status: "active" | "draft") => {
    setError("");

    if (!title || title.length < 3) {
      setError("Title must be at least 3 characters");
      setStep(1);
      return;
    }

    const price = parseFloat(priceAED);
    if (!price || price <= 0) {
      setError("Price must be greater than 0");
      setStep(3);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(status)),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/seller/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checklist = [
    { label: "Title added", done: title.length >= 3 },
    { label: "Description written", done: description.length > 0 },
    { label: "Category selected", done: !!selectedCategory },
    { label: "At least 1 photo", done: images.length > 0 },
    { label: "5+ photos (bonus XP)", done: images.length >= 5 },
    { label: "Price set", done: parseFloat(priceAED) > 0 },
  ];

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
              Add New Listing
            </h1>
            <p className="text-muted-foreground">
              List a new item in your shop
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={isSubmitting} onClick={() => handleSubmit("draft")}>
            <Save className="w-4 h-4 me-2" />
            Save Draft
          </Button>
          <Button variant="gold" disabled={isSubmitting} onClick={() => handleSubmit("active")}>
            {isSubmitting ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Send className="w-4 h-4 me-2" />}
            Publish
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Progress Steps */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Basic Info", icon: FileText },
            { num: 2, label: "Media", icon: ImageIcon },
            { num: 3, label: "Pricing", icon: DollarSign },
            { num: 4, label: "Details", icon: Boxes },
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
            <p className="font-medium">Earn +25 XP for creating a new listing!</p>
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
                      Listing Title *
                    </label>
                    <Input
                      placeholder="e.g., Handcrafted Arabian Oud Perfume - 100ml"
                      className="text-lg"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                      placeholder="Describe your item in detail. Include materials, dimensions, care instructions, and what makes it special..."
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                  Listing Media
                </h2>

                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />

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
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-moulna-gold hover:bg-moulna-gold/5 transition-colors"
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

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-700 dark:text-blue-400">Photo Tips</p>
                      <ul className="text-blue-600 dark:text-blue-300 mt-1 space-y-1">
                        <li>Use natural lighting for best results</li>
                        <li>Show your product from multiple angles</li>
                        <li>Include a photo showing scale/size</li>
                        <li>Minimum 800x800 pixels recommended</li>
                      </ul>
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
                          value={priceAED}
                          onChange={(e) => setPriceAED(e.target.value)}
                          min="0"
                          step="0.01"
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
                          value={compareAtPriceAED}
                          onChange={(e) => setCompareAtPriceAED(e.target.value)}
                          min="0"
                          step="0.01"
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
                        value={costAED}
                        onChange={(e) => setCostAED(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This won&apos;t be shown to customers
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Pricing is shown to buyers as your asking price. All transactions happen directly between you and the buyer.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button variant="gold" onClick={() => setStep(4)}>
                  Continue to Details
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Listing Details */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Boxes className="w-5 h-5" />
                  Listing Details
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Reference ID (Optional)
                      </label>
                      <Input
                        placeholder="e.g., OUD-001"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Condition
                      </label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                      >
                        {CONDITIONS.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Listing Duration
                    </label>
                    <select
                      value={listingDuration}
                      onChange={(e) => setListingDuration(parseInt(e.target.value))}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                    >
                      {LISTING_DURATIONS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <input
                      type="checkbox"
                      id="autoRenew"
                      checked={autoRenew}
                      onChange={(e) => setAutoRenew(e.target.checked)}
                      className="w-5 h-5 rounded border-moulna-gold text-moulna-gold focus:ring-moulna-gold"
                    />
                    <label htmlFor="autoRenew" className="flex-1">
                      <span className="font-medium">Auto-renew listing</span>
                      <p className="text-sm text-muted-foreground">
                        Automatically renew when the listing expires
                      </p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <input
                      type="checkbox"
                      id="allowOffers"
                      checked={allowOffers}
                      onChange={(e) => setAllowOffers(e.target.checked)}
                      className="w-5 h-5 rounded border-moulna-gold text-moulna-gold focus:ring-moulna-gold"
                    />
                    <label htmlFor="allowOffers" className="flex-1">
                      <span className="font-medium">Accept offers</span>
                      <p className="text-sm text-muted-foreground">
                        Allow buyers to send price offers on this listing
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
                    <select
                      value={processingTime}
                      onChange={(e) => setProcessingTime(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                    >
                      <option>1-2 business days</option>
                      <option>3-5 business days</option>
                      <option>1-2 weeks</option>
                      <option>Custom (made to order)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Meetup Preference
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "saved_locations", label: "Use saved locations", desc: "Default meetup spots from your profile" },
                        { value: "buyer_comes", label: "Buyer comes to me", desc: "Buyer visits your shop or location" },
                        { value: "flexible", label: "Flexible", desc: "Arrange meetup location with each buyer" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:border-moulna-gold transition-colors">
                          <input
                            type="radio"
                            name="meetup"
                            checked={meetupPreference === option.value}
                            onChange={() => setMeetupPreference(option.value)}
                            className="text-moulna-gold focus:ring-moulna-gold"
                          />
                          <div>
                            <span className="font-medium">{option.label}</span>
                            <p className="text-sm text-muted-foreground">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(4)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" disabled={isSubmitting} onClick={() => handleSubmit("draft")}>
                    <Save className="w-4 h-4 me-2" />
                    Save Draft
                  </Button>
                  <Button variant="gold" disabled={isSubmitting} onClick={() => handleSubmit("active")}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Send className="w-4 h-4 me-2" />}
                    Publish Listing
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Preview */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-semibold mb-4">Listing Preview</h3>
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
                  {title || "Your listing title will appear here"}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  {isHandmade && (
                    <Badge variant="outline" className="text-xs">Handmade</Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="outline" className="text-xs">{selectedCategory}</Badge>
                  )}
                </div>
                <p className="text-lg font-bold text-moulna-gold">
                  AED {priceAED ? parseFloat(priceAED).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Listing Checklist</h4>
              <div className="space-y-2 text-sm">
                {checklist.map((item) => (
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
