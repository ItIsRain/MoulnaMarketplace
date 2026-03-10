"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  Sparkles, ArrowRight, ArrowLeft, Loader2, Check,
  RefreshCw, ShoppingBag, Store, ShieldCheck
} from "lucide-react";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/lib/types";

const AVATAR_STYLES = [
  "adventurer",
  "adventurer-neutral",
  "bottts",
  "thumbs",
] as const;

type Step = 1 | 2 | 3 | 4;

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-moulna-gold" /></div>}>
      <RegisterForm />
    </React.Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuthStore();
  const [step, setStep] = React.useState<Step>(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");

  // Form state
  const [formData, setFormData] = React.useState({
    role: "" as UserRole | "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatarStyle: "adventurer" as typeof AVATAR_STYLES[number],
    avatarSeed: "",
  });

  // Initialize avatar seed + pre-select role from URL param
  React.useEffect(() => {
    const typeParam = searchParams.get("type");
    setFormData(prev => ({
      ...prev,
      avatarSeed: Math.random().toString(36).substring(2, 10),
      ...(typeParam === "seller" || typeParam === "buyer" ? { role: typeParam as UserRole } : {}),
    }));
  }, [searchParams]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const randomizeSeed = () => {
    setFormData(prev => ({
      ...prev,
      avatarSeed: Math.random().toString(36).substring(2, 10),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step < 4) {
      setStep((step + 1) as Step);
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as UserRole,
        phone: formData.phone,
        username: formData.email.split("@")[0],
        avatarStyle: formData.avatarStyle,
        avatarSeed: formData.avatarSeed,
      });
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.role !== "";
      case 2:
        return formData.name && formData.email && formData.phone;
      case 3:
        return formData.password && formData.password === formData.confirmPassword && formData.password.length >= 8;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/moulna-logo.svg"
              alt="Moulna"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Step {step} of 4</span>
              <span className="text-moulna-gold font-medium">+100 XP on signup</span>
            </div>
            <Progress value={progress} className="h-2" indicatorClassName="bg-moulna-gold" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-600 text-white text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Step 1: Role Selection */}
                {step === 1 && (
                  <>
                    <div>
                      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                        Join the Moulna marketplace
                      </h1>
                      <p className="text-muted-foreground">
                        How do you want to use Moulna?
                      </p>
                    </div>

                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => updateField("role", "buyer")}
                        className={cn(
                          "w-full p-6 rounded-xl border-2 text-left transition-all",
                          formData.role === "buyer"
                            ? "border-moulna-gold bg-moulna-gold/5"
                            : "border-muted hover:border-moulna-gold/50"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-lg",
                            formData.role === "buyer" ? "bg-moulna-gold/20 text-moulna-gold" : "bg-muted text-muted-foreground"
                          )}>
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-lg">Buyer</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Browse unique items from UAE artisans and local sellers
                            </p>
                          </div>
                          {formData.role === "buyer" && (
                            <div className="w-6 h-6 rounded-full bg-moulna-gold flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField("role", "seller")}
                        className={cn(
                          "w-full p-6 rounded-xl border-2 text-left transition-all",
                          formData.role === "seller"
                            ? "border-moulna-gold bg-moulna-gold/5"
                            : "border-muted hover:border-moulna-gold/50"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-lg",
                            formData.role === "seller" ? "bg-moulna-gold/20 text-moulna-gold" : "bg-muted text-muted-foreground"
                          )}>
                            <Store className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-lg">Seller</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              List your items and connect with buyers across the UAE
                            </p>
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-moulna-gold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>ID verification required</span>
                            </div>
                          </div>
                          {formData.role === "seller" && (
                            <div className="w-6 h-6 rounded-full bg-moulna-gold flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </>
                )}

                {/* Step 2: Basic Info */}
                {step === 2 && (
                  <>
                    <div>
                      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                        Create your account
                      </h1>
                      <p className="text-muted-foreground">
                        Tell us a bit about yourself
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          icon={<User className="w-4 h-4" />}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          icon={<Mail className="w-4 h-4" />}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+971 XX XXX XXXX"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          icon={<Phone className="w-4 h-4" />}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Password */}
                {step === 3 && (
                  <>
                    <div>
                      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                        Secure your account
                      </h1>
                      <p className="text-muted-foreground">
                        Create a strong password to protect your account
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={(e) => updateField("password", e.target.value)}
                            icon={<Lock className="w-4 h-4" />}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {formData.password && formData.password.length < 8 && (
                          <p className="text-xs text-red-500">Password must be at least 8 characters</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm Password
                        </label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Repeat your password"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField("confirmPassword", e.target.value)}
                          icon={<Lock className="w-4 h-4" />}
                          required
                        />
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <p className="text-xs text-red-500">Passwords do not match</p>
                        )}
                      </div>

                      {/* Password strength indicators */}
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Password requirements:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { check: formData.password.length >= 8, label: "8+ characters" },
                            { check: /[A-Z]/.test(formData.password), label: "Uppercase letter" },
                            { check: /[0-9]/.test(formData.password), label: "Number" },
                            { check: /[^A-Za-z0-9]/.test(formData.password), label: "Special character" },
                          ].map((req, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <div className={cn(
                                "w-4 h-4 rounded-full flex items-center justify-center",
                                req.check ? "bg-emerald-500" : "bg-muted"
                              )}>
                                {req.check && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className={req.check ? "text-emerald-600" : "text-muted-foreground"}>
                                {req.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 4: Avatar */}
                {step === 4 && (
                  <>
                    <div>
                      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                        Choose your avatar
                      </h1>
                      <p className="text-muted-foreground">
                        This is how you&apos;ll appear on Moulna. You can change it anytime.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Avatar Preview */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <DiceBearAvatar
                            seed={formData.avatarSeed || formData.name}
                            style={formData.avatarStyle}
                            size="4xl"
                            className="border-4 border-moulna-gold shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={randomizeSeed}
                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-moulna-gold text-white flex items-center justify-center shadow-lg hover:bg-moulna-gold-dark transition-colors"
                          >
                            <RefreshCw className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Style Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Avatar Style</label>
                        <div className="grid grid-cols-4 gap-3">
                          {AVATAR_STYLES.map((style) => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => updateField("avatarStyle", style)}
                              className={cn(
                                "p-2 rounded-xl border-2 transition-all",
                                formData.avatarStyle === style
                                  ? "border-moulna-gold bg-moulna-gold/10"
                                  : "border-muted hover:border-moulna-gold/50"
                              )}
                            >
                              <DiceBearAvatar
                                seed={formData.avatarSeed || formData.name}
                                style={style}
                                size="xl"
                              />
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          More styles unlock as you level up!
                        </p>
                      </div>

                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setStep((step - 1) as Step)}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 me-2" />
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="flex-1"
                    disabled={!canProceed() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : step === 4 ? (
                      <>
                        Create Account
                        <Sparkles className="w-4 h-4 ms-2" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ms-2" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-moulna-gold font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-moulna-gold/10 via-moulna-gold/5 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 arabic-pattern opacity-30" />

        <div className="relative z-10 flex flex-col justify-center p-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-lg"
          >
            <h2 className="font-display text-4xl font-bold mb-6">
              Join the UAE&apos;s favorite handmade marketplace
            </h2>

            <div className="space-y-4">
              {[
                { icon: "🎮", title: "Gamified Experience", desc: "Earn XP, badges, and level up with every action" },
                { icon: "🎨", title: "Support Local Artisans", desc: "Discover unique handmade products from UAE creators" },
                { icon: "⚡", title: "Level Up", desc: "Unlock exclusive perks and avatar styles as you progress" },
              ].map((item, i) => (
                <Card key={i} className="p-4 flex items-start gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
