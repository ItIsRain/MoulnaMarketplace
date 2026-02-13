"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  Sparkles, ArrowRight, ArrowLeft, Loader2, Check,
  RefreshCw
} from "lucide-react";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";

const AVATAR_STYLES = [
  "adventurer",
  "adventurer-neutral",
  "bottts",
  "thumbs",
] as const;

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatarStyle: "adventurer" as typeof AVATAR_STYLES[number],
    avatarSeed: "",
  });

  // Initialize avatar seed with random value
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      avatarSeed: Math.random().toString(36).substring(2, 10),
    }));
  }, []);

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

    if (step < 3) {
      setStep((step + 1) as Step);
      return;
    }

    setIsLoading(true);
    // Simulate registration
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/dashboard?welcome=true");
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return formData.password && formData.password === formData.confirmPassword && formData.password.length >= 8;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const progress = (step / 3) * 100;

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
              <span className="text-muted-foreground">Step {step} of 3</span>
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
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <>
                    <div>
                      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                        Create your account
                      </h1>
                      <p className="text-muted-foreground">
                        Join thousands of shoppers and sellers on Moulna
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

                {/* Step 2: Password */}
                {step === 2 && (
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

                {/* Step 3: Avatar */}
                {step === 3 && (
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

                      {/* XP Rewards Preview */}
                      <Card className="p-4 bg-gradient-to-r from-moulna-gold/10 to-transparent">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-moulna-gold/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-moulna-gold" />
                          </div>
                          <div>
                            <p className="font-medium">Welcome Bonus</p>
                            <p className="text-sm text-muted-foreground">
                              You&apos;ll earn <span className="text-moulna-gold font-bold">100 XP</span> just for signing up!
                            </p>
                          </div>
                        </div>
                      </Card>
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
                    ) : step === 3 ? (
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

                {step === 1 && (
                  <>
                    <div className="relative">
                      <Separator />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
                        or continue with
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" size="lg" type="button" className="w-full">
                        <svg className="w-5 h-5 me-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" size="lg" type="button" className="w-full">
                        <svg className="w-5 h-5 me-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </>
                )}

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
                { icon: "🎮", title: "Gamified Shopping", desc: "Earn XP, badges, and rewards for every action" },
                { icon: "🎨", title: "Support Local Artisans", desc: "Discover unique handmade products from UAE creators" },
                { icon: "⚡", title: "Level Up", desc: "Unlock exclusive perks, discounts, and avatar styles" },
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
