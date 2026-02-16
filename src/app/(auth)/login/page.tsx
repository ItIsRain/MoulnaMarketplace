"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.push(redirectTo);
      } else {
        setError("Unable to sign in. Please check your credentials.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      if (message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (message.includes("Email not confirmed")) {
        setError("Please verify your email address before signing in.");
      } else {
        setError(message);
      }
    }
  };

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground mb-8">
              Sign in to continue earning XP and exploring handmade treasures
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-600 text-white text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-moulna-gold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ms-2" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-moulna-gold font-medium hover:underline">
                Create one free
              </Link>
            </p>

          </motion.div>
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
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-moulna-gold/20 text-moulna-gold text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>+10 XP Daily Login</span>
              </div>
            </div>

            <h2 className="font-display text-4xl font-bold mb-4">
              Every login brings you closer to rewards
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Earn XP, unlock badges, and climb the leaderboard while discovering unique handmade treasures from UAE artisans.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: "🛍️", label: "Browse & Earn", value: "50 XP/deal" },
                { icon: "⭐", label: "Leave Reviews", value: "100 XP" },
                { icon: "🔥", label: "Keep Streaks", value: "Bonus XP" },
              ].map((item, i) => (
                <Card key={i} className="p-4 text-center">
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
