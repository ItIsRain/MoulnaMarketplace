"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { XPBar } from "@/components/gamification/XPBar";
import {
  LayoutDashboard, Package, Inbox, BarChart3,
  Settings, Tag, Wallet, Star, MessageCircle,
  Users, Megaphone, Loader2
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/useAuthStore";

const SIDEBAR_LINKS = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/seller/products", label: "Listings", icon: Package },
  { href: "/seller/orders", label: "Inquiries", icon: Inbox },
  { href: "/seller/customers", label: "Customers", icon: Users },
  { href: "/seller/reviews", label: "Reviews", icon: Star },
  { href: "/seller/messages", label: "Messages", icon: MessageCircle },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/promotions", label: "Promotions", icon: Megaphone },
  { href: "/seller/listings", label: "Listing Plans", icon: Tag },
  { href: "/seller/finances", label: "Finances", icon: Wallet },
  { href: "/seller/settings", label: "Settings", icon: Settings },
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

  // Redirect to onboarding if authenticated seller has no shop
  React.useEffect(() => {
    if (!isLoading && isAuthenticated && !shop && !isOnboardingPage) {
      router.replace("/seller/onboarding");
    }
  }, [isLoading, isAuthenticated, shop, isOnboardingPage, router]);

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

  // If no shop and not on onboarding, don't render (redirect in progress)
  if (!shop) {
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
                      <DiceBearAvatar
                        seed={user?.avatar?.seed || user?.username || "seller"}
                        style={user?.avatar?.style || "adventurer"}
                        size="xl"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{shop?.name || user?.name || "My Shop"}</p>
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
                    </nav>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Link
                        href="/seller/products/new"
                        className="flex items-center gap-2 text-sm text-moulna-gold hover:underline"
                      >
                        <Package className="w-4 h-4" />
                        Add New Listing
                      </Link>
                      <Link
                        href={`/shops/${shop?.slug || user?.username || "my-shop"}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        View My Shop
                      </Link>
                    </div>
                  </Card>
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
