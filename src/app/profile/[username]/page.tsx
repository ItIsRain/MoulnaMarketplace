"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  User, MapPin, Calendar, Star, MessageSquare,
  Award, Heart, Share2, Users,
  Sparkles, Trophy
} from "lucide-react";

// Badge display metadata keyed by badge_id
const BADGE_META: Record<string, { name: string; icon: typeof Trophy; color: string }> = {
  early_adopter: { name: "Early Adopter", icon: Trophy, color: "bg-purple-500" },
  explorer: { name: "Explorer", icon: Star, color: "bg-blue-500" },
  review_master: { name: "Review Master", icon: Star, color: "bg-yellow-500" },
  week_warrior: { name: "Week Warrior", icon: Award, color: "bg-green-500" },
  monthly_master: { name: "Monthly Master", icon: Award, color: "bg-orange-500" },
  first_purchase: { name: "First Purchase", icon: Heart, color: "bg-pink-500" },
  social_butterfly: { name: "Social Butterfly", icon: Users, color: "bg-cyan-500" },
  trendsetter: { name: "Trendsetter", icon: Sparkles, color: "bg-indigo-500" },
};

function getDefaultBadgeMeta(badgeId: string) {
  return BADGE_META[badgeId] || {
    name: badgeId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    icon: Award,
    color: "bg-gray-500",
  };
}

interface ProfileData {
  id: string;
  fullName: string;
  username: string;
  avatarStyle: string;
  avatarSeed: string;
  level: number;
  xp: number;
  location: string | null;
  createdAt: string;
}

interface BadgeData {
  id: string;
  badgeId: string;
  earnedAt: string;
  xpRewarded: number;
}

interface StatsData {
  badgeCount: number;
  xpEventCount: number;
  followerCount: number;
  streakDays: number;
  longestStreak: number;
}

interface ApiResponse {
  profile: ProfileData;
  badges: BadgeData[];
  stats: StatsData;
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-32 h-32 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-3 text-center md:text-start">
                  <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto md:mx-0" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse mx-auto md:mx-0" />
                  <div className="h-4 w-64 bg-muted rounded animate-pulse mx-auto md:mx-0" />
                  <div className="h-16 w-full max-w-lg bg-muted rounded animate-pulse mx-auto md:mx-0" />
                  <div className="flex justify-center md:justify-start gap-2">
                    <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <Card className="p-4 w-full md:w-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <div className="h-8 w-12 bg-muted rounded animate-pulse mx-auto mb-1" />
                        <div className="h-3 w-16 bg-muted rounded animate-pulse mx-auto" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <div className="h-6 w-40 bg-muted rounded animate-pulse mb-4" />
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
                  <div className="h-20 bg-muted/50 rounded animate-pulse" />
                </Card>
                <Card className="p-6">
                  <div className="h-6 w-24 bg-muted rounded animate-pulse mb-4" />
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ProfileNotFound({ username }: { username: string }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">User Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The profile <span className="font-medium">@{username}</span> does not exist or is no longer active.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-2.5 bg-moulna-charcoal text-white rounded-lg hover:bg-moulna-charcoal-light transition-colors text-sm font-medium"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [data, setData] = React.useState<ApiResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    if (!username) return;

    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await fetch(`/api/profiles/${encodeURIComponent(username)}`);
        if (!cancelled) {
          if (res.status === 404) {
            setNotFound(true);
          } else if (res.ok) {
            const json: ApiResponse = await res.json();
            setData(json);
          } else {
            setNotFound(true);
          }
        }
      } catch {
        if (!cancelled) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (notFound || !data) {
    return <ProfileNotFound username={username} />;
  }

  const { profile, badges, stats } = data;

  const badgesWithMeta = badges.map((b) => ({
    ...b,
    meta: getDefaultBadgeMeta(b.badgeId),
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Profile Header */}
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="relative">
                    <DiceBearAvatar
                      seed={profile.avatarSeed}
                      style={profile.avatarStyle}
                      size="xl"
                      className="w-32 h-32 border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2">
                      <LevelBadge level={profile.level} size="md" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-start">
                  <h1 className="text-3xl font-bold mb-1">{profile.fullName}</h1>
                  <p className="text-muted-foreground mb-3">@{profile.username}</p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                    {profile.location && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                  </div>

                  {/* Badges */}
                  {badgesWithMeta.length > 0 && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                      {badgesWithMeta.map((badge) => (
                        <Badge key={badge.id} className={cn("gap-1", badge.meta.color)}>
                          <badge.meta.icon className="w-3 h-3" />
                          {badge.meta.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-center md:justify-start gap-2">
                    <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
                      <Users className="w-4 h-4 me-2" />
                      Follow
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 me-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stats Card */}
                <Card className="p-4 w-full md:w-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-moulna-gold">{profile.xp.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total XP</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.xpEventCount}</p>
                      <p className="text-xs text-muted-foreground">Activities</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.followerCount}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.streakDays}</p>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Activity */}
                <Card className="p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-moulna-gold" />
                    Activity Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span>
                        <strong>{stats.xpEventCount}</strong> XP events earned
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Award className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>
                        <strong>{stats.badgeCount}</strong> badge{stats.badgeCount !== 1 ? "s" : ""} earned
                      </span>
                    </div>
                    {stats.longestStreak > 0 && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-green-600" />
                        </div>
                        <span>
                          Longest login streak: <strong>{stats.longestStreak} days</strong>
                        </span>
                      </div>
                    )}
                    {stats.followerCount > 0 && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Heart className="w-4 h-4 text-blue-600" />
                        </div>
                        <span>
                          <strong>{stats.followerCount}</strong> shop follower{stats.followerCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Level Progress */}
                <Card className="p-6">
                  <h2 className="font-semibold mb-4">Level Progress</h2>
                  <div className="text-center mb-4">
                    <LevelBadge level={profile.level} size="lg" showTitle />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Level {profile.level + 1}</span>
                      <span className="text-moulna-gold">{profile.xp % 1000} / 1000 XP</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-moulna-gold rounded-full"
                        style={{ width: `${(profile.xp % 1000) / 10}%` }}
                      />
                    </div>
                  </div>
                </Card>

                {/* Badges */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Badges</h2>
                    <Badge variant="secondary">{stats.badgeCount}</Badge>
                  </div>
                  {badgesWithMeta.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {badgesWithMeta.map((badge) => (
                        <div
                          key={badge.id}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50"
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white",
                            badge.meta.color
                          )}>
                            <badge.meta.icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs text-center">{badge.meta.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No badges earned yet.
                    </p>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
