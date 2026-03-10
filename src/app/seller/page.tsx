"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DailyChallengePanel } from "@/components/gamification/DailyChallenge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { timeAgo } from "@/lib/utils";
import {
  Package, Inbox, TrendingUp, MessageSquare,
  Eye, Users, ChevronRight,
  Sparkles, Clock, Plus,
  ShieldAlert, ShieldCheck, Loader2
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { UpgradeBanner } from "@/components/subscription/UpgradeBanner";
import { FollowedMomentsStrip } from "@/components/moments/FollowedMomentsStrip";
import type { DailyChallenge } from "@/lib/types";

interface Inquiry {
  id: string;
  participant: {
    id: string;
    name: string;
    username: string;
    avatarStyle: string;
    avatarSeed: string;
    level: number;
  } | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

interface DashStats {
  totalListings: number;
  unreadMessages: number;
  totalViews: number;
  totalFollowers: number;
}

export default function SellerDashboard() {
  const { user, shop, fetchProfile } = useAuthStore();
  const [kycLoading, setKycLoading] = React.useState(false);
  const [dashStats, setDashStats] = React.useState<DashStats>({ totalListings: 0, unreadMessages: 0, totalViews: 0, totalFollowers: 0 });
  const [challenges, setChallenges] = React.useState<DailyChallenge[]>([]);
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);

  const kycStatus = user?.kycStatus || "none";

  // Fetch seller challenges
  React.useEffect(() => {
    fetch("/api/challenges?audience=seller")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.challenges) {
          setChallenges(
            data.challenges.map((c: { id: string; title: string; description: string; xp: number; icon: string; completed: boolean; progress?: number; target?: number }) => ({
              id: c.id,
              task: c.title,
              description: c.description,
              xp: c.xp,
              icon: c.icon,
              completed: c.completed,
              progress: c.progress,
              target: c.target,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  // Fetch recent inquiries (conversations)
  React.useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.conversations) {
          setInquiries(data.conversations.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch real dashboard stats
  React.useEffect(() => {
    fetch("/api/seller/analytics")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.stats) {
          setDashStats({
            totalListings: data.stats.totalListings || 0,
            unreadMessages: data.stats.unreadMessages || 0,
            totalViews: data.stats.totalViews || 0,
            totalFollowers: data.stats.totalFollowers || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Auto-check KYC status from Didit when not yet approved
  React.useEffect(() => {
    if (!user || kycStatus === "none" || kycStatus === "approved") return;

    let cancelled = false;

    const checkStatus = async () => {
      try {
        const res = await fetch("/api/kyc/status");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.kycStatus && data.kycStatus !== kycStatus) {
          // Refresh full profile to sync all fields
          await fetchProfile();
        }
      } catch {
        // Silently fail — will retry on next interval
      }
    };

    // Check immediately on mount
    checkStatus();

    // Poll every 10 seconds while status is non-terminal
    const interval = setInterval(checkStatus, 10_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user, kycStatus, fetchProfile]);

  const handleStartKYC = async () => {
    setKycLoading(true);
    try {
      const res = await fetch("/api/kyc/create-session", { method: "POST" });
      const data = await res.json();
      if (data.verificationUrl) {
        window.location.href = data.verificationUrl;
      }
    } catch (error) {
      console.error("Failed to start KYC:", error);
    } finally {
      setKycLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* KYC Banner */}
      {kycStatus !== "approved" && (
        <Card className={cn(
          "p-6 border-2",
          kycStatus === "declined" ? "border-red-500/50 bg-red-50 dark:bg-red-950/10" :
          kycStatus === "in_review" ? "border-purple-500/50 bg-purple-50 dark:bg-purple-950/10" :
          kycStatus === "pending" || kycStatus === "in_progress" ? "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/10" :
          "border-blue-500/50 bg-blue-50 dark:bg-blue-950/10"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {kycStatus === "declined" ? (
                <ShieldAlert className="w-5 h-5 text-red-600" />
              ) : kycStatus === "in_review" ? (
                <Clock className="w-5 h-5 text-purple-600" />
              ) : kycStatus === "pending" || kycStatus === "in_progress" ? (
                <Clock className="w-5 h-5 text-yellow-600" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              )}
              <div>
                <p className="font-medium">
                  {kycStatus === "none" && "Complete ID verification to start listing"}
                  {(kycStatus === "pending" || kycStatus === "in_progress") && "ID verification in progress..."}
                  {kycStatus === "in_review" && "ID verification under review"}
                  {kycStatus === "declined" && "ID verification declined. Please try again."}
                  {kycStatus === "expired" && "ID verification expired. Please start again."}
                  {kycStatus === "abandoned" && "ID verification was not completed. Please try again."}
                </p>
                <p className="text-sm text-muted-foreground">
                  {kycStatus === "none" && "Verify your identity to unlock seller features"}
                  {(kycStatus === "pending" || kycStatus === "in_progress") && "We'll notify you once verification is complete"}
                  {kycStatus === "in_review" && "Your documents are being reviewed. This usually takes a few minutes."}
                  {kycStatus === "declined" && "Your previous verification was unsuccessful"}
                  {kycStatus === "expired" && "Your verification session has expired"}
                  {kycStatus === "abandoned" && "Your previous session was incomplete"}
                </p>
              </div>
            </div>
            {kycStatus === "in_review" ? (
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </div>
            ) : (
            <Button
              variant="gold"
              size="sm"
              onClick={handleStartKYC}
              disabled={kycLoading}
            >
              {kycLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                kycStatus === "none" ? "Verify Identity" :
                (kycStatus === "pending" || kycStatus === "in_progress") ? "Continue Verification" :
                "Try Again"
              )}
            </Button>
            )}
          </div>
        </Card>
      )}

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your shop today
        </p>
      </div>

      {/* Followed Sellers' Moments */}
      <FollowedMomentsStrip />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Listings", value: dashStats.totalListings, icon: Package, color: "text-blue-500" },
          { label: "Messages", value: dashStats.unreadMessages, icon: MessageSquare, color: "text-emerald-500" },
          { label: "Shop Views", value: dashStats.totalViews, icon: Eye, color: "text-purple-500" },
          { label: "Followers", value: dashStats.totalFollowers, icon: Users, color: "text-moulna-gold" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Inquiries */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Recent Inquiries</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/seller/messages">
                  View All <ChevronRight className="w-4 h-4 ms-1" />
                </Link>
              </Button>
            </div>
            {inquiries.length > 0 ? (
              <div className="divide-y">
                {inquiries.map((inq) => (
                  <Link
                    key={inq.id}
                    href={`/seller/messages/${inq.id}`}
                    className={cn(
                      "flex items-center gap-3 py-3 hover:bg-muted/50 transition-colors rounded-lg px-2 -mx-2",
                      inq.unreadCount > 0 && "bg-moulna-gold/5"
                    )}
                  >
                    <DiceBearAvatar
                      seed={inq.participant?.avatarSeed || "user"}
                      style={inq.participant?.avatarStyle || "adventurer"}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm font-medium truncate", inq.unreadCount > 0 && "font-semibold")}>
                          {inq.participant?.name || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {timeAgo(inq.lastMessageAt)}
                        </span>
                      </div>
                      <p className={cn(
                        "text-xs truncate",
                        inq.unreadCount > 0 ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {inq.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    {inq.unreadCount > 0 && (
                      <span className="bg-moulna-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {inq.unreadCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Inbox className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No inquiries yet</p>
                <p className="text-xs text-muted-foreground mt-1">Create your first listing to start receiving messages from buyers</p>
                {kycStatus === "approved" ? (
                  <Button variant="gold" size="sm" className="mt-4" asChild>
                    <Link href="/seller/products/new">
                      <Plus className="w-4 h-4 me-1" /> Create Listing
                    </Link>
                  </Button>
                ) : (
                  <Button variant="gold" size="sm" className="mt-4" disabled title="Complete ID verification first">
                    <Plus className="w-4 h-4 me-1" /> Create Listing
                  </Button>
                )}
              </div>
            )}
          </Card>

          {/* Performance Overview */}
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Performance Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Eye className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{dashStats.totalViews}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Package className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{dashStats.totalListings}</p>
                <p className="text-sm text-muted-foreground">Listings</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Users className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                <p className="text-2xl font-bold">{dashStats.totalFollowers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Challenges */}
          <DailyChallengePanel challenges={challenges} maxItems={3} />

          {/* Quick Stats */}
          <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-transparent">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-moulna-gold" />
                <span className="text-3xl font-bold text-moulna-gold">{(user?.xp ?? 0).toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Total XP Earned</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">{user?.level ?? 1}</p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{user?.badgeCount ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Badges</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Upgrade Banner */}
          {shop && shop.plan !== "pro" && (
            <UpgradeBanner currentPlan={shop.plan} context="sidebar" />
          )}

          {/* Tips */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Tips to Get More Inquiries</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-moulna-gold">💡</span>
                <p className="text-muted-foreground">
                  Listings with 5+ photos get 3x more inquiries
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-moulna-gold">🚀</span>
                <p className="text-muted-foreground">
                  Respond to messages within 2 hours for better visibility
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-moulna-gold">⭐</span>
                <p className="text-muted-foreground">
                  Keep your response rate above 90% for Top Seller badge
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
