"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { XPBar } from "@/components/gamification/XPBar";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3,
  Settings, Tag, Truck, Wallet, Star, MessageCircle,
  Sparkles, Users, Megaphone
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

const SIDEBAR_LINKS = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/orders", label: "Orders", icon: ShoppingBag },
  { href: "/seller/customers", label: "Customers", icon: Users },
  { href: "/seller/reviews", label: "Reviews", icon: Star },
  { href: "/seller/messages", label: "Messages", icon: MessageCircle },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/promotions", label: "Promotions", icon: Megaphone },
  { href: "/seller/shipping", label: "Shipping", icon: Truck },
  { href: "/seller/finances", label: "Finances", icon: Wallet },
  { href: "/seller/settings", label: "Settings", icon: Settings },
];

const MOCK_SELLER = {
  shopName: "Scent of Arabia",
  avatarSeed: "scent-arabia",
  avatarStyle: "adventurer",
  xp: 15420,
  level: 6,
  streak: 14,
  pendingOrders: 3,
  unreadMessages: 2,
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
                        seed={MOCK_SELLER.avatarSeed}
                        style={MOCK_SELLER.avatarStyle}
                        size="xl"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{MOCK_SELLER.shopName}</p>
                        <div className="flex items-center gap-2">
                          <LevelBadge level={MOCK_SELLER.level} size="sm" />
                          <StreakCounter days={MOCK_SELLER.streak} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* XP Progress */}
                    <XPBar xp={MOCK_SELLER.xp} size="sm" />
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
                            {link.label === "Orders" && MOCK_SELLER.pendingOrders > 0 && (
                              <span className="ms-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                {MOCK_SELLER.pendingOrders}
                              </span>
                            )}
                            {link.label === "Messages" && MOCK_SELLER.unreadMessages > 0 && (
                              <span className="ms-auto bg-moulna-gold text-white text-xs rounded-full px-1.5 py-0.5">
                                {MOCK_SELLER.unreadMessages}
                              </span>
                            )}
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
                        Add New Product
                      </Link>
                      <Link
                        href="/shops/scent-of-arabia"
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
