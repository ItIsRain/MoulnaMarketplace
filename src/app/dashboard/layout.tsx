"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn, getLevelFromXP } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { useAuthStore } from "@/store/useAuthStore";
import {
  LayoutDashboard, Package, Heart, Trophy, User,
  Bell, Settings, LogOut, Sparkles
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/messages", label: "My Inquiries", icon: Package },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/rewards", label: "Level Progress", icon: Trophy },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Fallback user for layout rendering before auth loads
  const defaultUser = {
    name: "Guest",
    username: "guest",
    xp: 0,
    level: 1,
    levelTitle: "Newcomer",
    streakDays: 0,
    avatar: {
      style: "adventurer",
      seed: "guest",
    },
  };

  const displayUser = user ?? defaultUser;

  const levelInfo = getLevelFromXP(displayUser.xp);
  const xpProgress = levelInfo.progress;

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
                  {/* User Card */}
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <DiceBearAvatar
                        seed={displayUser.avatar.seed}
                        style={displayUser.avatar.style}
                        size="xl"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{displayUser.name}</p>
                        <div className="flex items-center gap-2">
                          <LevelBadge level={displayUser.level} size="sm" />
                          <StreakCounter days={displayUser.streakDays} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* XP Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">XP Progress</span>
                        <div className="flex items-center gap-1 text-moulna-gold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="font-medium">{displayUser.xp.toLocaleString()}</span>
                        </div>
                      </div>
                      <Progress value={xpProgress} className="h-2" indicatorClassName="bg-moulna-gold" />
                      <p className="text-xs text-muted-foreground text-end">
                        {levelInfo.xpForNext.toLocaleString()} XP to Level {levelInfo.level + 1}
                      </p>
                    </div>
                  </Card>

                  {/* Navigation */}
                  <Card className="p-2">
                    <nav className="space-y-1">
                      {SIDEBAR_LINKS.map((link) => {
                        const isActive = pathname === link.href ||
                          (link.href !== "/dashboard" && pathname.startsWith(link.href));

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
                            <link.icon className="w-4 h-4" />
                            {link.label}
                          </Link>
                        );
                      })}
                    </nav>
                  </Card>

                  {/* Logout */}
                  <button
                    onClick={() => { logout(); router.push("/"); }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-red-500 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                {children}
              </main>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </TooltipProvider>
  );
}
