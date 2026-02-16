"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "./Navbar";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { XPBar } from "@/components/gamification/XPBar";
import {
  LayoutDashboard, Package, MessageSquare, Users,
  Star, Tag, Settings, Store, BarChart3,
  LogOut, Bell, ChevronRight, Inbox
} from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    href: "/seller",
    icon: LayoutDashboard,
  },
  {
    label: "Listings",
    href: "/seller/products",
    icon: Package,
    badge: "28",
  },
  {
    label: "Inquiries",
    href: "/seller/orders",
    icon: Inbox,
    badge: "5",
  },
  {
    label: "Messages",
    href: "/seller/messages",
    icon: MessageSquare,
    badge: "3",
  },
  {
    label: "Customers",
    href: "/seller/customers",
    icon: Users,
  },
  {
    label: "Reviews",
    href: "/seller/reviews",
    icon: Star,
  },
  {
    label: "Promotions",
    href: "/seller/promotions",
    icon: Tag,
  },
  {
    label: "Analytics",
    href: "/seller/analytics",
    icon: BarChart3,
  },
  {
    label: "Shop Profile",
    href: "/seller/shop",
    icon: Store,
  },
  {
    label: "Settings",
    href: "/seller/settings",
    icon: Settings,
  },
];

interface SellerLayoutProps {
  children: React.ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  const pathname = usePathname();

  // Mock seller data
  const seller = {
    shopName: "Scent of Arabia",
    name: "Ahmed Al Rashid",
    avatar: "seller-ahmed",
    level: 8,
    xp: 4520,
    rating: 4.9,
    pendingInquiries: 5,
    unreadMessages: 3,
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top Bar */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/seller" className="flex items-center gap-2">
            <Store className="w-6 h-6 text-moulna-gold" />
            <span className="font-display font-bold text-lg">Seller Hub</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-muted rounded-lg">
            <Bell className="w-5 h-5" />
            {seller.unreadMessages > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <div className="flex items-center gap-3">
            <DiceBearAvatar seed={seller.avatar} size="sm" />
            <div className="hidden md:block">
              <p className="text-sm font-medium">{seller.shopName}</p>
              <p className="text-xs text-muted-foreground">{seller.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 border-e bg-card hidden lg:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Seller Stats */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <LevelBadge level={seller.level} size="sm" />
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{seller.rating}</span>
                </div>
              </div>
              <XPBar xp={seller.xp} showLabels size="sm" />
            </div>

            {/* Navigation */}
            <nav className="p-2">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/seller" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-moulna-gold/10 text-moulna-gold font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full",
                        isActive
                          ? "bg-moulna-gold text-white"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <hr className="my-2" />

              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                Back to Marketplace
              </Link>

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
