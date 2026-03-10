"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { XPBar } from "@/components/gamification/XPBar";
import {
  LayoutDashboard, Package, Inbox, BarChart3,
  Settings, MessageCircle, Camera,
  Users, Megaphone, Loader2, Store, BookOpen, Hammer, Pencil, ExternalLink, Plus
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/useAuthStore";
import { UpgradeBanner } from "@/components/subscription/UpgradeBanner";

const SIDEBAR_LINKS = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/seller/products", label: "Listings", icon: Package },
  { href: "/seller/orders", label: "Inquiries", icon: Inbox },
  { href: "/seller/customers", label: "Customers", icon: Users },
  { href: "/seller/messages", label: "Messages", icon: MessageCircle },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/moments", label: "Moments", icon: Camera },
  { href: "/seller/promotions", label: "Promotions", icon: Megaphone },
  { href: "/seller/settings", label: "Settings", icon: Settings },
];

const SHOP_LINKS = [
  { href: "/seller/shop", label: "Shop Profile", icon: Pencil, exact: true },
  { href: "/seller/shop/story", label: "Story", icon: BookOpen },
  { href: "/seller/shop/gallery", label: "Workshop", icon: Hammer },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, shop, isAuthenticated, isLoading } = useAuthStore();

  const isOnboardingPage = pathname === "/seller/onboarding";
  const isAdmin = user?.role === "admin";

  // Redirect to onboarding if authenticated seller has no shop (admins bypass this)
  React.useEffect(() => {
    if (!isLoading && isAuthenticated && !shop && !isOnboardingPage && !isAdmin) {
      router.replace("/seller/onboarding");
    }
  }, [isLoading, isAuthenticated, shop, isOnboardingPage, isAdmin, router]);

  // Show loading while auth initializes
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
        </div>
      </div>
    );
  }

  // Let onboarding page render without the sidebar
  if (isOnboardingPage) {
    return (
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 bg-muted/30">
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // If no shop and not on onboarding, don't render (redirect in progress) — admins can view without a shop
  if (!shop && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
              {/* Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                  {/* Seller Card */}
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      {shop?.logoUrl ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-moulna-gold/30 flex-shrink-0">
                          <Image src={shop.logoUrl} alt={shop.name} width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <DiceBearAvatar
                          seed={shop?.avatarSeed || shop?.slug || user?.username || "seller"}
                          style={shop?.avatarStyle || "adventurer"}
                          size="xl"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">{shop?.name || user?.name || "My Shop"}</p>
                          {shop?.plan && shop.plan !== "free" && (
                            <Badge className={cn(
                              "text-[10px] px-1.5 py-0",
                              shop.plan === "pro" ? "bg-moulna-gold text-white" : "bg-blue-500 text-white"
                            )}>
                              {shop.plan === "pro" ? "Pro" : "Growth"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <LevelBadge level={user?.level ?? 1} size="sm" />
                          <StreakCounter days={user?.streakDays ?? 0} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* XP Progress */}
                    <XPBar xp={user?.xp ?? 0} size="sm" />
                  </Card>

                  {/* Navigation */}
                  <Card className="p-2">
                    <nav className="space-y-1">
                      {SIDEBAR_LINKS.map((link) => {
                        const isActive = link.exact
                          ? pathname === link.href
                          : pathname.startsWith(link.href);
                        const Icon = link.icon;

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                              isActive
                                ? "bg-moulna-gold/10 text-moulna-gold font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}

                      {/* Divider + My Shop section */}
                      <div className="pt-2 mt-2 border-t">
                        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          My Shop
                        </p>
                      </div>

                      {SHOP_LINKS.map((link) => {
                        const isActive = link.exact
                          ? pathname === link.href
                          : pathname.startsWith(link.href);
                        const Icon = link.icon;

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                              isActive
                                ? "bg-moulna-gold/10 text-moulna-gold font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}

                      <Link
                        href={`/shops/${shop?.slug || user?.username || "my-shop"}`}
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Public Page</span>
                      </Link>
                    </nav>
                  </Card>

                  {/* Plan Upgrade */}
                  {shop && shop.plan !== "pro" && (
                    <UpgradeBanner currentPlan={shop.plan} context="sidebar" />
                  )}

                  {/* Quick Action */}
                  <Link
                    href="/seller/products/new"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-moulna-gold text-white hover:bg-moulna-gold-dark transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Listing
                  </Link>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
