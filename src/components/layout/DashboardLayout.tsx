"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { XPBar } from "@/components/gamification/XPBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, User, Heart, MapPin,
  MessageSquare, Gift, Award, Settings, LogOut,
  Flame, Target, Star, Users, Bell
} from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Saved Items",
    href: "/dashboard/wishlist",
    icon: Heart,
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    badge: 3,
  },
  {
    label: "Addresses",
    href: "/dashboard/addresses",
    icon: MapPin,
  },
  {
    label: "Rewards",
    href: "/dashboard/rewards",
    icon: Gift,
    children: [
      { label: "Badges", href: "/dashboard/rewards/badges", icon: Award },
      { label: "Challenges", href: "/dashboard/rewards/challenges", icon: Target },
    ],
  },
  {
    label: "Referrals",
    href: "/dashboard/referrals",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = React.useState<string | null>("Rewards");

  // Mock user data
  const user = {
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    avatar: "ahmed-user",
    level: 5,
    xp: 2340,
    streak: 12,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 border-e bg-card hidden lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            {/* User Card */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3 mb-3">
                <DiceBearAvatar seed={user.avatar} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <LevelBadge level={user.level} size="sm" />
                <div className="flex items-center gap-1 text-sm">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{user.streak} day streak</span>
                </div>
              </div>
              <XPBar xp={user.xp} showLabels size="sm" />
            </div>

            {/* Navigation */}
            <nav className="p-2">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname === item.href ||
                  (item.children && item.children.some(c => pathname === c.href));
                const isExpanded = expandedItem === item.label;

                return (
                  <div key={item.href}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setExpandedItem(isExpanded ? null : item.label)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                            isActive
                              ? "bg-moulna-gold/10 text-moulna-gold font-medium"
                              : "hover:bg-muted"
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="flex-1 text-start">{item.label}</span>
                          <svg
                            className={cn(
                              "w-4 h-4 transition-transform",
                              isExpanded && "rotate-180"
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="ms-4 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                  pathname === child.href
                                    ? "bg-moulna-gold/10 text-moulna-gold font-medium"
                                    : "hover:bg-muted text-muted-foreground"
                                )}
                              >
                                <child.icon className="w-4 h-4" />
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
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
                          <span className="px-2 py-0.5 text-xs rounded-full bg-moulna-gold text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}

              <hr className="my-2" />

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
