"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageSquare,
  Bell,
  Menu,
  X,
  ChevronDown,
  Heart,
  User,
  Store,
  LogOut,
  Settings,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { useAuthStore } from "@/store/useAuthStore";

const CATEGORIES = [
  { name: "Handmade Jewelry", slug: "jewelry", icon: "💎" },
  { name: "Home Décor", slug: "home-decor", icon: "🏠" },
  { name: "Arabic Calligraphy", slug: "calligraphy", icon: "✒️" },
  { name: "Perfumes & Oud", slug: "perfumes", icon: "🌸" },
  { name: "Fashion & Clothing", slug: "fashion", icon: "👗" },
  { name: "Food & Sweets", slug: "food", icon: "🍯" },
  { name: "Art & Prints", slug: "art", icon: "🎨" },
  { name: "Baby & Kids", slug: "baby-kids", icon: "👶" },
  { name: "Wellness & Beauty", slug: "wellness", icon: "✨" },
  { name: "Gifts & Occasions", slug: "gifts", icon: "🎁" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b"
            : "bg-background"
        )}
      >
        <div className="container-app">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/moulna-logo.svg"
                alt="Moulna"
                width={140}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Input
                  placeholder="Search listings, shops, or categories..."
                  className="pl-10 pr-4 bg-muted/50 border-0 focus-visible:bg-white"
                  icon={<Search className="w-4 h-4" />}
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-1 rounded bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/explore/categories">
                <Button variant="ghost">Categories</Button>
              </Link>

              <Link href="/explore/shops">
                <Button variant="ghost">Meet the Sellers</Button>
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link href="/dashboard/wishlist">
                  <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                    <Heart className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </Link>
              )}

              {/* Messages */}
              {isAuthenticated && (
                <Link href="/dashboard/messages">
                  <Button variant="ghost" size="icon" className="relative">
                    <MessageSquare className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </Link>
              )}

              {/* Notifications */}
              {isAuthenticated && (
                <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                    5
                  </span>
                </Button>
              )}

              {/* User Menu / Auth */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors"
                  >
                    <DiceBearAvatar
                      seed={user.avatar.seed}
                      style={user.avatar.style}
                      size="sm"
                      showLevelRing
                      xp={user.xp}
                    />
                    <div className="hidden md:flex items-center gap-2">
                      <StreakCounter days={user.streakDays} size="sm" />
                    </div>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isUserMenuOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full right-0 mt-2 w-72 bg-card rounded-xl shadow-lg overflow-hidden z-50"
                        >
                          {/* User Info */}
                          <div className="p-4 border-b">
                            <div className="flex items-center gap-3">
                              <DiceBearAvatar
                                seed={user.avatar.seed}
                                style={user.avatar.style}
                                size="lg"
                                showLevelRing
                                xp={user.xp}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user.name}</p>
                                <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <LevelBadge xp={user.xp} size="sm" />
                                  <StreakCounter days={user.streakDays} size="sm" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <User className="w-4 h-4" />
                              <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <Link
                              href="/dashboard/messages"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-sm font-medium">Messages</span>
                            </Link>
                            <Link
                              href="/dashboard/rewards"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Trophy className="w-4 h-4" />
                              <span className="text-sm font-medium">Rewards & Badges</span>
                            </Link>

                            {(user.role === "seller" || user.role === "both") && (
                              <>
                                <div className="h-px bg-border my-2" />
                                <Link
                                  href="/seller"
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  <Store className="w-4 h-4" />
                                  <span className="text-sm font-medium">Seller Dashboard</span>
                                </Link>
                              </>
                            )}

                            <div className="h-px bg-border my-2" />

                            <Link
                              href="/dashboard/settings"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Settings className="w-4 h-4" />
                              <span className="text-sm font-medium">Settings</span>
                            </Link>
                            <button
                              onClick={() => {
                                logout();
                                setIsUserMenuOpen(false);
                                router.push("/");
                              }}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors w-full"
                            >
                              <LogOut className="w-4 h-4" />
                              <span className="text-sm font-medium">Log Out</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background p-4 lg:hidden"
          >
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search listings, shops..."
                autoFocus
                className="flex-1"
                icon={<Search className="w-4 h-4" />}
              />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-background shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <span className="font-display text-lg font-semibold">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Categories
                  </p>
                  <div className="space-y-1">
                    {CATEGORIES.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/explore/categories/${cat.slug}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <span>{cat.icon}</span>
                        <span className="text-sm">{cat.name}</span>
                      </Link>
                    ))}
                    <Link
                      href="/explore/categories"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-primary"
                    >
                      <span className="text-sm font-medium">View All Categories →</span>
                    </Link>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-1">
                  <Link href="/explore/shops" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted">
                    <Store className="w-4 h-4" />
                    <span className="text-sm font-medium">Meet the Sellers</span>
                  </Link>
                </div>

                {!isAuthenticated && (
                  <>
                    <div className="h-px bg-border" />
                    <div className="space-y-2">
                      <Link href="/login" className="block">
                        <Button variant="outline" className="w-full">Log In</Button>
                      </Link>
                      <Link href="/register" className="block">
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <Link href="/sell-with-us">
                    <Button variant="gold" className="w-full">
                      <Store className="w-4 h-4" />
                      Sell on Moulna
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
