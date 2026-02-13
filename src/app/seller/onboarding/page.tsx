"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Store, Sparkles, Check, ArrowRight, ArrowLeft,
  Upload, Camera, Package, Truck, Palette, FileText,
  PartyPopper
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Name Your Shop", icon: Store, xp: 100 },
  { id: 2, title: "Tell Your Story", icon: FileText, xp: 100 },
  { id: 3, title: "Set Up Branding", icon: Palette, xp: 100 },
  { id: 4, title: "Add First Product", icon: Package, xp: 100 },
  { id: 5, title: "Configure Shipping", icon: Truck, xp: 100 },
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

const AVATAR_STYLES = [
  { id: "adventurer", name: "Adventurer", locked: false },
  { id: "bottts", name: "Bottts", locked: false },
  { id: "lorelei", name: "Lorelei", locked: false },
  { id: "thumbs", name: "Thumbs", locked: true, level: 3 },
  { id: "avataaars", name: "Avataaars", locked: true, level: 5 },
];

export default function SellerOnboardingPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [shopName, setShopName] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [avatarStyle, setAvatarStyle] = React.useState("adventurer");
  const [avatarSeed, setAvatarSeed] = React.useState("my-shop");

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/Moulna.svg" alt="Moulna" width={32} height={32} />
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Your shop URL will be: moulna.ae/shop/{shopName.toLowerCase().replace(/\s+/g, '-') || 'your-shop-name'}
                  </p>
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
                  <Input placeholder="A short description of what you do (max 100 chars)" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">About Your Shop</label>
                  <textarea
                    rows={4}
                    placeholder="Share your story... What inspires you? How did you start? What makes your products special?"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Artisan Story (Optional)</label>
                  <textarea
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
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Upload your logo (PNG, JPG, max 2MB)
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Shop Banner</label>
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                        <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Upload a banner image (1200x400 recommended)
                        </p>
                      </div>
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
                    List your first product to complete your shop setup
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Product Name</label>
                      <Input placeholder="e.g., Handcrafted Arabian Oud Perfume" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Description</label>
                      <textarea
                        rows={3}
                        placeholder="Describe your product..."
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Price (AED)</label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Stock</label>
                        <Input type="number" placeholder="0" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Product Images</label>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center h-full flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop images or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add at least 1 image (max 8)
                      </p>
                    </div>
                  </div>
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
                  <h2 className="text-xl font-semibold mb-2">Configure Shipping</h2>
                  <p className="text-muted-foreground">
                    Set up how you&apos;ll deliver products to customers
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Processing Time</label>
                    <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold">
                      <option>1-2 business days</option>
                      <option>3-5 business days</option>
                      <option>1-2 weeks</option>
                      <option>Made to order (2-4 weeks)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Shipping Zones & Rates</label>
                    <div className="space-y-3">
                      {[
                        { zone: "Dubai", rate: "Free" },
                        { zone: "Abu Dhabi", rate: "AED 15" },
                        { zone: "Other Emirates", rate: "AED 20" },
                      ].map((zone) => (
                        <div key={zone.zone} className="flex items-center justify-between p-3 rounded-lg border">
                          <span>{zone.zone}</span>
                          <Input
                            defaultValue={zone.rate}
                            className="w-32 text-right"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <input
                      type="checkbox"
                      id="freeShippingThreshold"
                      className="w-5 h-5 rounded border-moulna-gold text-moulna-gold focus:ring-moulna-gold"
                    />
                    <label htmlFor="freeShippingThreshold" className="flex-1">
                      <span className="font-medium">Offer free shipping on orders over</span>
                      <Input
                        type="number"
                        placeholder="300"
                        className="w-24 inline-block mx-2"
                      />
                      <span className="text-muted-foreground">AED</span>
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
                <Button variant="gold" onClick={completeStep} asChild>
                  <Link href="/seller">
                    <PartyPopper className="w-4 h-4 me-2" />
                    Complete Setup (+500 XP)
                  </Link>
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
