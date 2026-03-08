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
import { Progress } from "@/components/ui/progress";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Store, Sparkles, Check, ArrowRight, ArrowLeft,
  Upload, Camera, Package, Palette, FileText,
  PartyPopper, Loader2, CircleCheck, CircleX, CircleAlert
} from "lucide-react";
import { generateSlug } from "@/lib/forbidden-slugs";

const STEPS = [
  { id: 1, title: "Name Your Shop", icon: Store, xp: 100 },
  { id: 2, title: "Tell Your Story", icon: FileText, xp: 100 },
  { id: 3, title: "Set Up Branding", icon: Palette, xp: 100 },
  { id: 4, title: "Add First Product", icon: Package, xp: 100 },
  { id: 5, title: "Listing Preferences", icon: Package, xp: 100 },
];

const CATEGORIES = [
  "Perfumes & Oud",
  "Jewelry",
  "Home Décor",
  "Arabic Art",
  "Fashion",
  "Food & Sweets",
  "Baby & Kids",
  "Wellness & Beauty",
  "Handmade Crafts",
  "Gifts",
];

const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

const AVATAR_STYLES = [
  { id: "adventurer", name: "Adventurer", locked: false },
  { id: "bottts", name: "Bottts", locked: false },
  { id: "lorelei", name: "Lorelei", locked: false },
  { id: "thumbs", name: "Thumbs", locked: true, level: 3 },
  { id: "avataaars", name: "Avataaars", locked: true, level: 5 },
];

export default function SellerOnboardingPage() {
  const router = useRouter();
  const { user, fetchProfile, addXP } = useAuthStore();

  const [currentStep, setCurrentStep] = React.useState(1);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  // Shop form state
  const [shopName, setShopName] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedEmirate, setSelectedEmirate] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [story, setStory] = React.useState("");
  const [avatarStyle, setAvatarStyle] = React.useState("adventurer");
  const [avatarSeed, setAvatarSeed] = React.useState("my-shop");
  const [logoUrl, setLogoUrl] = React.useState("");
  const [bannerUrl, setBannerUrl] = React.useState("");
  const [uploadingField, setUploadingField] = React.useState<string | null>(null);
  const [listingDuration, setListingDuration] = React.useState("30 days");
  const [autoRenew, setAutoRenew] = React.useState(true);
  const [meetupLocations, setMeetupLocations] = React.useState<Record<string, string>>({
    "My Shop/Office": "",
    "Public Meeting Point": "",
    "Mall or Café": "",
  });

  // Slug availability check
  const [slugStatus, setSlugStatus] = React.useState<{
    checking: boolean;
    available: boolean | null;
    reason: string | null;
    slug: string;
  }>({ checking: false, available: null, reason: null, slug: "" });

  React.useEffect(() => {
    const slug = generateSlug(shopName);
    if (!shopName.trim() || slug.length < 2) {
      setSlugStatus({ checking: false, available: null, reason: null, slug });
      return;
    }

    setSlugStatus((prev) => ({ ...prev, checking: true, slug }));

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/shops/check-slug?name=${encodeURIComponent(shopName.trim())}`
        );
        const data = await res.json();
        setSlugStatus({
          checking: false,
          available: data.available,
          reason: data.reason,
          slug: data.slug || slug,
        });
      } catch {
        setSlugStatus((prev) => ({ ...prev, checking: false }));
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [shopName]);

  const progress = (completedSteps.length / STEPS.length) * 100;
  const totalXP = completedSteps.length * 100;

  const completeStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isStepComplete = (step: number) => completedSteps.includes(step);

  const handleImageUpload = async (file: File, folder: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField("logo");
    try {
      const url = await handleImageUpload(file, "logos");
      if (url) setLogoUrl(url);
    } finally {
      setUploadingField(null);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField("banner");
    try {
      const url = await handleImageUpload(file, "banners");
      if (url) setBannerUrl(url);
    } finally {
      setUploadingField(null);
    }
  };

  const handleCompleteSetup = async () => {
    if (!shopName.trim()) {
      setError("Please enter a shop name");
      setCurrentStep(1);
      return;
    }

    if (slugStatus.available === false) {
      setError(
        slugStatus.reason === "forbidden"
          ? "This shop name is reserved. Please choose a different name."
          : "This shop URL is already taken. Please choose a different name."
      );
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: shopName.trim(),
          tagline: tagline || undefined,
          description: description || undefined,
          category: selectedCategory || undefined,
          location: selectedEmirate || user?.location || undefined,
          avatarStyle,
          avatarSeed,
          logoUrl: logoUrl || undefined,
          bannerUrl: bannerUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create shop");
        return;
      }

      // Update listing preferences if set
      if (data.shop?.slug) {
        await fetch("/api/seller/shop", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            story: story || undefined,
            listingPreferences: {
              duration: listingDuration,
              autoRenew,
              meetupLocations: Object.fromEntries(
                Object.entries(meetupLocations).filter(([, v]) => v.trim())
              ),
            },
          }),
        });
      }

      // Refresh profile to get shop data
      await fetchProfile();

      // Award 500 XP for completing shop setup
      addXP(500, "completing shop setup");

      router.push("/seller");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/moulna-logo.svg" alt="Moulna" width={32} height={32} />
                <span className="font-display font-bold text-xl">Moulna</span>
              </Link>
              <Badge variant="outline">Seller Onboarding</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-moulna-gold" />
                <span className="font-medium text-moulna-gold">{totalXP} XP earned</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/seller">Skip to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-display text-2xl font-bold">Set Up Your Shop</h1>
              <span className="text-sm text-muted-foreground">
                {completedSteps.length} of {STEPS.length} steps complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Steps Navigation */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 min-w-[80px]",
                    currentStep === step.id && "text-moulna-gold"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isStepComplete(step.id)
                      ? "bg-emerald-500 text-white"
                      : currentStep === step.id
                      ? "bg-moulna-gold text-white"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {isStepComplete(step.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-center">{step.title}</span>
                  <Badge variant="outline" className="text-xs">
                    +{step.xp} XP
                  </Badge>
                </button>
                {index < STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-2",
                    isStepComplete(step.id) ? "bg-emerald-500" : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Content */}
          <Card className="p-8">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">Name Your Shop</h2>
                  <p className="text-muted-foreground">
                    Choose a unique name that represents your brand
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Shop Name</label>
                  <Input
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g., Scent of Arabia"
                    className="text-lg"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      moulna.ae/shops/<span className="font-medium text-foreground">{slugStatus.slug || "your-shop-name"}</span>
                    </p>
                    {shopName.trim().length >= 2 && (
                      <>
                        {slugStatus.checking ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                        ) : slugStatus.available === true ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600">
                            <CircleCheck className="w-3.5 h-3.5" />
                            Available
                          </span>
                        ) : slugStatus.available === false ? (
                          <span className="flex items-center gap-1 text-xs text-red-600">
                            {slugStatus.reason === "forbidden" ? (
                              <>
                                <CircleAlert className="w-3.5 h-3.5" />
                                Reserved name
                              </>
                            ) : (
                              <>
                                <CircleX className="w-3.5 h-3.5" />
                                Already taken
                              </>
                            )}
                          </span>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Main Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "p-3 text-sm rounded-lg border transition-colors text-center",
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
                  <label className="text-sm font-medium mb-3 block">Emirate</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {EMIRATES.map((emirate) => (
                      <button
                        key={emirate}
                        onClick={() => setSelectedEmirate(emirate)}
                        className={cn(
                          "p-3 text-sm rounded-lg border transition-colors text-center",
                          selectedEmirate === emirate
                            ? "border-moulna-gold bg-moulna-gold/10 text-moulna-gold"
                            : "border-muted hover:border-moulna-gold/50"
                        )}
                      >
                        {emirate}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">Tell Your Story</h2>
                  <p className="text-muted-foreground">
                    Help customers connect with your brand
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Shop Tagline</label>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="A short description of what you do (max 100 chars)"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">About Your Shop</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Share your story... What inspires you? How did you start? What makes your products special?"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Artisan Story (Optional)</label>
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    rows={3}
                    placeholder="If you're a craftsperson, share your journey and techniques..."
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Artisan stories help you earn the Artisan badge!
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">Set Up Branding</h2>
                  <p className="text-muted-foreground">
                    Customize how your shop looks to customers
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Shop Avatar</label>
                    <div className="flex flex-col items-center gap-4">
                      <DiceBearAvatar
                        seed={avatarSeed}
                        style={avatarStyle as "adventurer" | "bottts" | "lorelei" | "thumbs" | "avataaars"}
                        size="3xl"
                        className="border-4 border-moulna-gold"
                      />
                      <Input
                        value={avatarSeed}
                        onChange={(e) => setAvatarSeed(e.target.value)}
                        placeholder="Enter a seed for your avatar"
                        className="max-w-xs text-center"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Avatar Style</p>
                      <div className="flex flex-wrap gap-2">
                        {AVATAR_STYLES.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => !style.locked && setAvatarStyle(style.id)}
                            disabled={style.locked}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                              avatarStyle === style.id
                                ? "border-moulna-gold bg-moulna-gold/10 text-moulna-gold"
                                : style.locked
                                ? "border-muted text-muted-foreground/50 cursor-not-allowed"
                                : "border-muted hover:border-moulna-gold/50"
                            )}
                          >
                            {style.name}
                            {style.locked && ` (Lv.${style.level})`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Shop Logo (Optional)</label>
                      <label className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer block hover:border-moulna-gold/50 transition-colors">
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleLogoUpload} disabled={!!uploadingField} />
                        {uploadingField === "logo" ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
                            <p className="text-sm text-muted-foreground">Uploading logo...</p>
                          </div>
                        ) : logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="w-20 h-20 mx-auto rounded-lg object-cover" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Upload your logo (PNG, JPG, max 5MB)
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Shop Banner</label>
                      <label className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer block hover:border-moulna-gold/50 transition-colors">
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleBannerUpload} disabled={!!uploadingField} />
                        {uploadingField === "banner" ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
                            <p className="text-sm text-muted-foreground">Uploading banner...</p>
                          </div>
                        ) : bannerUrl ? (
                          <img src={bannerUrl} alt="Banner" className="w-full h-24 mx-auto rounded-lg object-cover" />
                        ) : (
                          <>
                            <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Upload a banner image (1200x400 recommended)
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">Add Your First Product</h2>
                  <p className="text-muted-foreground">
                    You can skip this step and add products later from your dashboard.
                  </p>
                </div>

                <div className="p-8 text-center border-2 border-dashed rounded-lg">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Products coming soon</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Product listing will be available once your shop is set up.
                    You can always add products from your seller dashboard.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/seller/products/new">Skip for now</Link>
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-moulna-gold/10 border border-moulna-gold/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-moulna-gold" />
                    <span className="font-medium">Pro tip!</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Products with 5+ photos get 3x more views. Add multiple angles!
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">Listing Preferences</h2>
                  <p className="text-muted-foreground">
                    Set up your listing defaults and meetup preferences
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Default Listing Duration</label>
                    <select
                      value={listingDuration}
                      onChange={(e) => setListingDuration(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                    >
                      <option>30 days</option>
                      <option>60 days</option>
                      <option>90 days</option>
                      <option>Until manually removed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Preferred Meetup Locations</label>
                    <div className="space-y-3">
                      {[
                        { location: "My Shop/Office", note: "Primary" },
                        { location: "Public Meeting Point", note: "Optional" },
                        { location: "Mall or Café", note: "Optional" },
                      ].map((spot) => (
                        <div key={spot.location} className="flex items-center justify-between p-3 rounded-lg border">
                          <span>{spot.location}</span>
                          <Input
                            placeholder={spot.note}
                            className="w-40 text-right"
                            value={meetupLocations[spot.location] || ""}
                            onChange={(e) =>
                              setMeetupLocations((prev) => ({
                                ...prev,
                                [spot.location]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
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
                      <span className="font-medium">Auto-renew listings when they expire</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 me-2" />
                Back
              </Button>

              {currentStep < STEPS.length ? (
                <Button variant="gold" onClick={completeStep}>
                  Continue
                  <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
              ) : (
                <Button
                  variant="gold"
                  onClick={handleCompleteSetup}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 me-2 animate-spin" />
                  ) : (
                    <PartyPopper className="w-4 h-4 me-2" />
                  )}
                  {isSubmitting ? "Creating Shop..." : "Complete Setup (+500 XP)"}
                </Button>
              )}
            </div>
          </Card>

          {/* Completion Bonus */}
          <Card className="mt-6 p-4 border-moulna-gold bg-moulna-gold/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-moulna-gold/20">
                <Sparkles className="w-6 h-6 text-moulna-gold" />
              </div>
              <div>
                <p className="font-medium">Complete all steps to earn:</p>
                <p className="text-sm text-muted-foreground">
                  +500 XP bonus + &quot;Shop Owner&quot; badge + Featured in New Sellers
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
