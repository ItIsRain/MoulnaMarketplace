"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  User, MapPin, Heart, Sparkles, ChevronRight, ChevronLeft,
  Check, Palette, Search, Crown, Star, Trophy, Flame
} from "lucide-react";

const CATEGORIES = [
  { id: "fragrances", name: "Fragrances & Oud", icon: "🌸" },
  { id: "fashion", name: "Fashion & Modest Wear", icon: "👗" },
  { id: "home", name: "Home Décor", icon: "🏠" },
  { id: "jewelry", name: "Jewelry & Accessories", icon: "💎" },
  { id: "food", name: "Food & Spices", icon: "🍯" },
  { id: "art", name: "Art & Calligraphy", icon: "🎨" },
  { id: "beauty", name: "Beauty & Wellness", icon: "✨" },
  { id: "crafts", name: "Handmade Crafts", icon: "🧵" },
];

const AVATAR_STYLES = [
  { id: "lorelei", name: "Lorelei" },
  { id: "adventurer", name: "Adventurer" },
  { id: "avataaars", name: "Avataaars" },
  { id: "big-ears", name: "Big Ears" },
  { id: "bottts", name: "Bottts" },
  { id: "fun-emoji", name: "Fun Emoji" },
];

const STEPS = [
  { id: 1, title: "Profile", icon: User },
  { id: 2, title: "Avatar", icon: Palette },
  { id: 3, title: "Interests", icon: Heart },
  { id: 4, title: "Complete", icon: Crown },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    location: "",
    avatarStyle: "lorelei",
    avatarSeed: "my-avatar",
    interests: [] as string[],
  });

  const toggleInterest = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id],
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const randomizeAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatarSeed: `avatar-${Math.random().toString(36).substring(7)}`,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-moulna-charcoal to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  currentStep >= step.id
                    ? "bg-moulna-gold text-white"
                    : "bg-white/10 text-white/60"
                )}>
                  {currentStep > step.id ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-2",
                  currentStep >= step.id ? "text-white" : "text-white/50"
                )}>
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  "w-16 h-0.5 mb-6",
                  currentStep > step.id ? "bg-moulna-gold" : "bg-white/20"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card className="p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Profile Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Welcome to Moulna!</h1>
                  <p className="text-muted-foreground">
                    Let's set up your profile. This will only take a minute.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">First Name</label>
                      <Input
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Last Name</label>
                      <Input
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full h-10 ps-10 rounded-md border border-input bg-background"
                      >
                        <option value="">Select your emirate</option>
                        <option value="dubai">Dubai</option>
                        <option value="abu-dhabi">Abu Dhabi</option>
                        <option value="sharjah">Sharjah</option>
                        <option value="ajman">Ajman</option>
                        <option value="rak">Ras Al Khaimah</option>
                        <option value="fujairah">Fujairah</option>
                        <option value="uaq">Umm Al Quwain</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Avatar */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Choose Your Avatar</h1>
                  <p className="text-muted-foreground">
                    Pick a style and customize your unique avatar
                  </p>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <DiceBearAvatar
                    seed={formData.avatarSeed}
                    style={formData.avatarStyle}
                    size="xl"
                    className="w-32 h-32 mb-4"
                  />
                  <Button variant="outline" size="sm" onClick={randomizeAvatar}>
                    <Sparkles className="w-4 h-4 me-2" />
                    Randomize
                  </Button>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {AVATAR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setFormData({ ...formData, avatarStyle: style.id })}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all",
                        formData.avatarStyle === style.id
                          ? "border-moulna-gold bg-moulna-gold/10"
                          : "border-muted hover:border-moulna-gold/50"
                      )}
                    >
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden bg-muted">
                        <DiceBearAvatar seed={style.id} style={style.id} size="sm" />
                      </div>
                      <p className="text-xs truncate">{style.name}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Interests */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">What interests you?</h1>
                  <p className="text-muted-foreground">
                    Select categories to get personalized recommendations
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleInterest(category.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-start",
                        formData.interests.includes(category.id)
                          ? "border-moulna-gold bg-moulna-gold/10"
                          : "border-muted hover:border-moulna-gold/50"
                      )}
                    >
                      <span className="text-2xl mb-2 block">{category.icon}</span>
                      <p className="text-sm font-medium">{category.name}</p>
                      {formData.interests.includes(category.id) && (
                        <Check className="w-4 h-4 text-moulna-gold mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Complete */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 rounded-full bg-moulna-gold/20 flex items-center justify-center mx-auto mb-6"
                >
                  <Crown className="w-12 h-12 text-moulna-gold" />
                </motion.div>

                <h1 className="text-2xl font-bold mb-2">You're All Set!</h1>
                <p className="text-muted-foreground mb-6">
                  Welcome to Moulna, {formData.firstName || "Explorer"}! Your journey begins now.
                </p>

                {/* Level Start */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-muted rounded-lg">
                    <Sparkles className="w-6 h-6 text-moulna-gold mx-auto mb-2" />
                    <p className="font-bold text-lg">Level 1</p>
                    <p className="text-xs text-muted-foreground">Newcomer</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="font-bold text-lg">0 Badges</p>
                    <p className="text-xs text-muted-foreground">Start Earning</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="font-bold text-lg">1 Day</p>
                    <p className="text-xs text-muted-foreground">Streak Started</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
                    <Link href="/dashboard">
                      <Search className="w-4 h-4 me-2" />
                      Start Exploring
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/seller/onboarding">
                      <Star className="w-4 h-4 me-2" />
                      Become a Seller
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 me-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      currentStep === step.id
                        ? "w-6 bg-moulna-gold"
                        : currentStep > step.id
                        ? "bg-moulna-gold"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <Button
                onClick={nextStep}
                className="bg-moulna-gold hover:bg-moulna-gold-dark"
              >
                {currentStep === 3 ? "Complete" : "Next"}
                <ChevronRight className="w-4 h-4 ms-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* XP Progress */}
        <div className="mt-4 text-center">
          <Badge className="bg-white/10 text-white border-white/20">
            <Sparkles className="w-3 h-3 me-1" />
            Complete onboarding for +200 XP
          </Badge>
        </div>
      </motion.div>
    </div>
  );
}
