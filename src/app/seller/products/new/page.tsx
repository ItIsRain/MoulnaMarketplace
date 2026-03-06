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
  ShieldCheck, Plus, Trash2, Check, X as XIcon
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { MultiImageUpload } from "@/components/ui/image-upload";
import type { CustomField } from "@/lib/types";

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

  // Listing limit state
  const [listingStatus, setListingStatus] = React.useState<{
    activeListingCount: number;
    freeListingLimit: number;
    freeRemaining: number;
    requiresPayment: boolean;
  } | null>(null);

  React.useEffect(() => {
    fetch("/api/seller/listing-status")
      .then((r) => r.json())
      .then((data) => {
        if (data.activeListingCount !== undefined) setListingStatus(data);
      })
      .catch(() => {});
  }, []);

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

  // Custom Fields
  const [customFields, setCustomFields] = React.useState<CustomField[]>([]);

  const addCustomField = () => {
    if (customFields.length >= 10) return;
    setCustomFields([...customFields, {
      id: crypto.randomUUID().slice(0, 8),
      label: "",
      type: "text",
      value: "",
    }]);
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map(f =>
      f.id === id ? { ...f, ...updates } : f
    ));
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const addSelectOption = (fieldId: string) => {
    setCustomFields(customFields.map(f =>
      f.id === fieldId
        ? { ...f, options: [...(f.options || []), ""] }
        : f
    ));
  };

  const updateSelectOption = (fieldId: string, index: number, value: string) => {
    setCustomFields(customFields.map(f =>
      f.id === fieldId
        ? { ...f, options: (f.options || []).map((o, i) => i === index ? value : o) }
        : f
    ));
  };

  const removeSelectOption = (fieldId: string, index: number) => {
    setCustomFields(customFields.map(f =>
      f.id === fieldId
        ? { ...f, options: (f.options || []).filter((_, i) => i !== index) }
        : f
    ));
  };

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
      customFields: customFields.filter(f => f.label.trim()),
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
      // If trying to publish and payment required, save as draft first then redirect to upsell
      if (status === "active" && listingStatus?.requiresPayment) {
        const res = await fetch("/api/seller/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload("draft")),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        router.push(`/seller/products/${data.product.id}/activate`);
        return;
      }

      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(status)),
      });

      const data = await res.json();

      // Handle 402 — free limit reached, save as draft and redirect
      if (res.status === 402 && data.requiresPayment) {
        const draftRes = await fetch("/api/seller/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload("draft")),
        });
        const draftData = await draftRes.json();
        if (!draftRes.ok) throw new Error(draftData.error);

        router.push(`/seller/products/${draftData.product.id}/activate`);
        return;
      }

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
              Add 5+ photos for an extra +15 XP bonus
            </p>
          </div>
        </div>
      </Card>

      {/* Listing Limit Banner */}
      {listingStatus && (
        <Card className={cn(
          "p-4",
          listingStatus.requiresPayment
            ? "border-amber-300 bg-amber-50/50 dark:bg-amber-900/10"
            : "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-900/10"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className={cn(
                "w-5 h-5",
                listingStatus.requiresPayment ? "text-amber-600" : "text-emerald-600"
              )} />
              <div>
                <p className="font-medium">
                  {listingStatus.requiresPayment
                    ? "Free listings used — this listing requires a small fee to publish"
                    : `${listingStatus.freeRemaining} of ${listingStatus.freeListingLimit} free listings remaining`
                  }
                </p>
                {!listingStatus.requiresPayment && (
                  <p className="text-sm text-muted-foreground">
                    Publish up to {listingStatus.freeListingLimit} listings for free
                  </p>
                )}
              </div>
            </div>
            <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  listingStatus.requiresPayment ? "bg-amber-500" : "bg-emerald-500"
                )}
                style={{
                  width: `${Math.min(100, (listingStatus.activeListingCount / listingStatus.freeListingLimit) * 100)}%`,
                }}
              />
            </div>
          </div>
        </Card>
      )}

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
                  <MultiImageUpload
                    value={images}
                    onChange={setImages}
                    folder="products"
                    maxImages={8}
                    maxSizeMB={10}
                    recommendedSize="1200 × 1200px square"
                  />

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-moulna-charcoal dark:bg-moulna-charcoal-dark border border-moulna-charcoal-light/30">
                    <Info className="w-5 h-5 text-moulna-gold mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-white">Photo Tips</p>
                      <ul className="text-white/70 mt-1 space-y-1">
                        <li>Use natural lighting for best results</li>
                        <li>Show your product from multiple angles</li>
                        <li>Include a photo showing scale/size</li>
                        <li>Recommended: <span className="text-moulna-gold font-medium">1200 × 1200px</span>, max <span className="text-moulna-gold font-medium">10MB</span> per image</li>
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

                  <div className="p-4 rounded-lg bg-moulna-charcoal dark:bg-moulna-charcoal-dark border border-moulna-charcoal-light/30">
                    <p className="text-sm text-white/80">
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

              {/* Custom Specification Fields */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-semibold flex items-center gap-2">
                      <Boxes className="w-5 h-5" />
                      Custom Specifications
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add custom fields buyers can see — e.g. Material, Size, Color
                    </p>
                  </div>
                  {customFields.length < 10 && (
                    <Button variant="outline" size="sm" onClick={addCustomField}>
                      <Plus className="w-4 h-4 me-1" />
                      Add Field
                    </Button>
                  )}
                </div>

                {customFields.length === 0 ? (
                  <button
                    onClick={addCustomField}
                    className="w-full p-6 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-moulna-gold hover:text-moulna-gold hover:bg-moulna-gold/5 transition-colors text-sm"
                  >
                    <Plus className="w-5 h-5 mx-auto mb-2" />
                    Add a custom specification field
                  </button>
                ) : (
                  <div className="space-y-4">
                    {customFields.map((field) => (
                      <div key={field.id} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium mb-1 block text-muted-foreground">
                                Field Type
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) => {
                                  const type = e.target.value as CustomField["type"];
                                  const updates: Partial<CustomField> = { type, value: "" };
                                  if (type === "boolean") updates.value = "false";
                                  if (type === "select") updates.options = [""];
                                  if (type !== "select") updates.options = undefined;
                                  updateCustomField(field.id, updates);
                                }}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                              >
                                <option value="text">Text</option>
                                <option value="boolean">Yes / No</option>
                                <option value="select">Multiple Choice</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium mb-1 block text-muted-foreground">
                                Label
                              </label>
                              <Input
                                placeholder="e.g. Material, Size"
                                value={field.label}
                                onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeCustomField(field.id)}
                            className="mt-5 p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Value input depends on type */}
                        {field.type === "text" && (
                          <div>
                            <label className="text-xs font-medium mb-1 block text-muted-foreground">
                              Value
                            </label>
                            <Input
                              placeholder="e.g. 18k Gold, Cotton"
                              value={field.value}
                              onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                            />
                          </div>
                        )}

                        {field.type === "boolean" && (
                          <div>
                            <label className="text-xs font-medium mb-1 block text-muted-foreground">
                              Value
                            </label>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateCustomField(field.id, { value: "true" })}
                                className={cn(
                                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                                  field.value === "true"
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                    : "border-muted hover:border-emerald-300"
                                )}
                              >
                                <Check className="w-4 h-4" />
                                Yes
                              </button>
                              <button
                                onClick={() => updateCustomField(field.id, { value: "false" })}
                                className={cn(
                                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                                  field.value === "false"
                                    ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                    : "border-muted hover:border-red-300"
                                )}
                              >
                                <XIcon className="w-4 h-4" />
                                No
                              </button>
                            </div>
                          </div>
                        )}

                        {field.type === "select" && (
                          <div>
                            <label className="text-xs font-medium mb-1 block text-muted-foreground">
                              Options
                            </label>
                            <div className="space-y-2">
                              {(field.options || []).map((option, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <Input
                                    placeholder={`Option ${idx + 1}`}
                                    value={option}
                                    onChange={(e) => updateSelectOption(field.id, idx, e.target.value)}
                                  />
                                  {(field.options || []).length > 1 && (
                                    <button
                                      onClick={() => removeSelectOption(field.id, idx)}
                                      className="p-1.5 rounded text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addSelectOption(field.id)}
                                className="text-moulna-gold"
                              >
                                <Plus className="w-3 h-3 me-1" />
                                Add Option
                              </Button>
                            </div>

                            {(field.options || []).filter(o => o.trim()).length > 0 && (
                              <div className="mt-2">
                                <label className="text-xs font-medium mb-1 block text-muted-foreground">
                                  Selected Value
                                </label>
                                <select
                                  value={field.value}
                                  onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                                >
                                  <option value="">Select an option</option>
                                  {(field.options || []).filter(o => o.trim()).map((option, idx) => (
                                    <option key={idx} value={option}>{option}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground">
                      {customFields.length}/10 fields used
                    </p>
                  </div>
                )}
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
