"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  LayoutDashboard, Users, Store, Package, Flag,
  Settings, BarChart3, Shield, Bell, LogOut, ChevronUp,
  Menu, X, Tag, MessageSquare, Trophy, ExternalLink, Loader2,
  User, ChevronDown
} from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/sellers", label: "Sellers", icon: Store },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/sotw", label: "SOTW Auctions", icon: Trophy },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const notifRef = React.useRef<HTMLDivElement>(null);
  const [authState, setAuthState] = React.useState<"loading" | "authorized" | "denied">("loading");
  const authCheckRef = React.useRef(false);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  React.useEffect(() => {
    // Only run the admin check once
    if (authCheckRef.current) return;
    authCheckRef.current = true;

    async function checkAdmin() {
      try {
        // Directly call the API instead of relying on store state
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          setAuthState("denied");
          return;
        }
        const data = await res.json();
        if (data.user && data.user.role === "admin") {
          setAuthState("authorized");
        } else {
          setAuthState("denied");
        }
      } catch {
        setAuthState("denied");
      }
    }

    checkAdmin();
  }, []);

  React.useEffect(() => {
    if (authState === "denied") {
      router.replace("/");
    }
  }, [authState, router]);

  if (authState === "denied") {
    return null;
  }

  if (authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 w-[260px] bg-moulna-charcoal-dark transform transition-transform lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-[72px] flex items-center gap-3 px-5 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-moulna-gold to-moulna-gold-dark flex items-center justify-center shadow-[0_0_16px_rgba(199,163,77,0.25)]">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display text-[15px] font-semibold text-white tracking-tight">Moulna</span>
            <span className="text-[10px] text-moulna-gold font-medium uppercase tracking-[0.15em] block -mt-0.5">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ms-auto p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {ADMIN_NAV.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[13px] font-medium",
                  isActive
                    ? "bg-moulna-gold/15 text-moulna-gold shadow-[inset_0_0_0_1px_rgba(199,163,77,0.2)]"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-moulna-gold" : "text-white/40")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile */}
        <div className="p-3 border-t border-white/[0.06] relative">
          <button
            onClick={() => setProfileMenuOpen((v) => !v)}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-colors"
          >
            <DiceBearAvatar
              seed={user?.avatar?.seed || "admin"}
              style={user?.avatar?.style || "adventurer"}
              size="sm"
            />
            <div className="flex-1 min-w-0 text-start">
              <p className="font-medium text-[13px] text-white/90 truncate">{user?.name || "Admin"}</p>
              <p className="text-[11px] text-white/40 truncate">{user?.email || ""}</p>
            </div>
            {profileMenuOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-white/30" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-white/30" />
            )}
          </button>

          {profileMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-moulna-charcoal rounded-lg border border-white/10 shadow-xl overflow-hidden">
              <Link
                href="/dashboard/profile"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
              <Link
                href="/admin/settings"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <div className="border-t border-white/[0.06]" />
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-red-400 hover:text-red-300 hover:bg-white/[0.06] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ps-[260px]">
        {/* Top Bar */}
        <header className="h-[72px] bg-card/80 backdrop-blur-md border-b border-border/60 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-moulna-charcoal" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative p-2.5 hover:bg-muted rounded-lg transition-colors"
              >
                <Bell className="w-[18px] h-[18px] text-moulna-charcoal-light" />
              </button>

              {notifOpen && (
                <div className="absolute end-0 top-full mt-1 w-80 bg-card rounded-xl border border-border/60 shadow-xl z-50">
                  <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <Link
                      href="/admin/reports"
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/40"
                    >
                      <Flag className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium">Reports</p>
                        <p className="text-[11px] text-muted-foreground">Check pending reports</p>
                      </div>
                    </Link>
                    <Link
                      href="/admin/products?status=pending"
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/40"
                    >
                      <Package className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium">Pending Products</p>
                        <p className="text-[11px] text-muted-foreground">Review product submissions</p>
                      </div>
                    </Link>
                    <Link
                      href="/admin/sotw"
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-moulna-gold flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium">SOTW Auctions</p>
                        <p className="text-[11px] text-muted-foreground">Review pending approvals</p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground px-3 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Site
            </Link>
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="p-2.5 hover:bg-red-50 rounded-lg transition-colors group"
            >
              <LogOut className="w-[18px] h-[18px] text-moulna-charcoal-light group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-72px)]">{children}</main>
      </div>
    </div>
  );
}
