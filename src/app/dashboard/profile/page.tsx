"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { useAuthStore } from "@/store/useAuthStore";
import {
  User, Mail, Phone, MapPin, Calendar, Camera, RefreshCw,
  Edit2, Check, X, Sparkles, Shield, Loader2, AlertCircle
} from "lucide-react";

const AVATAR_STYLES = [
  "adventurer",
  "adventurer-neutral",
  "bottts",
  "thumbs",
  "lorelei",
  "lorelei-neutral",
  "avataaars",
  "avataaars-neutral",
] as const;

// Badge definition map — maps badge IDs from the API to display metadata
const BADGE_DEFINITIONS: Record<string, { name: string; icon: string; description: string }> = {
  "first-inquiry": { name: "First Inquiry", icon: "💬", description: "Contact your first seller" },
  "explorer": { name: "Explorer", icon: "🧭", description: "Contact 10 different sellers" },
  "power-browser": { name: "Power Browser", icon: "👑", description: "Save 50 listings" },
  "collector": { name: "Collector", icon: "⭐", description: "Contact sellers from 10 shops" },
  "first-review": { name: "First Review", icon: "📝", description: "Write your first review" },
  "review-master": { name: "Review Master", icon: "⭐", description: "Write 25 reviews" },
  "social-butterfly": { name: "Social Butterfly", icon: "🦋", description: "Share 10 products" },
  "week-warrior": { name: "Week Warrior", icon: "🔥", description: "7-day login streak" },
  "month-master": { name: "Month Master", icon: "🗓️", description: "30-day login streak" },
  "wishlist-curator": { name: "Wishlist Curator", icon: "❤️", description: "Save 20 items to wishlist" },
  "first-deal": { name: "First Deal", icon: "🛍️", description: "Complete your first purchase" },
  "big-spender": { name: "Big Spender", icon: "💎", description: "Spend over 1000 AED" },
  "early-adopter": { name: "Early Adopter", icon: "🚀", description: "Joined during launch period" },
  "verified-user": { name: "Verified User", icon: "✅", description: "Verify your email address" },
  "profile-complete": { name: "Profile Complete", icon: "🎯", description: "Complete your profile" },
};

interface EarnedBadge {
  id: string;
  badgeId: string;
  earnedAt: string;
  xpRewarded: number;
}

function formatJoinDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function ProfilePage() {
  const { user, fetchProfile, isLoading: authLoading } = useAuthStore();

  const [isEditing, setIsEditing] = React.useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  // Badge state from API
  const [earnedBadges, setEarnedBadges] = React.useState<EarnedBadge[]>([]);
  const [badgesLoading, setBadgesLoading] = React.useState(true);

  // Profile form state — initialized from user
  const [profile, setProfile] = React.useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    emirate: "",
    bio: "",
    joinDate: "",
    avatarStyle: "adventurer" as typeof AVATAR_STYLES[number],
    avatarSeed: "",
  });

  const [editedProfile, setEditedProfile] = React.useState(profile);

  // Sync profile state when user data loads/changes
  React.useEffect(() => {
    if (user) {
      const synced = {
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        emirate: user.location || "",
        bio: "",
        joinDate: user.joinDate ? formatJoinDate(user.joinDate) : "",
        avatarStyle: (user.avatar?.style || "adventurer") as typeof AVATAR_STYLES[number],
        avatarSeed: user.avatar?.seed || "",
      };
      setProfile(synced);
      setEditedProfile(synced);
    }
  }, [user]);

  // Fetch earned badges from API
  React.useEffect(() => {
    async function loadBadges() {
      setBadgesLoading(true);
      try {
        const res = await fetch("/api/gamification?section=badges");
        if (res.ok) {
          const data = await res.json();
          setEarnedBadges(data.badges || []);
        }
      } catch (err) {
        console.error("Failed to fetch badges:", err);
      } finally {
        setBadgesLoading(false);
      }
    }
    loadBadges();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    // Build update payload — only include changed fields
    const updates: Record<string, string> = {};
    if (editedProfile.name !== profile.name) updates.name = editedProfile.name;
    if (editedProfile.phone !== profile.phone) updates.phone = editedProfile.phone;
    if (editedProfile.emirate !== profile.emirate) updates.location = editedProfile.emirate;
    if (editedProfile.avatarStyle !== profile.avatarStyle) updates.avatarStyle = editedProfile.avatarStyle;
    if (editedProfile.avatarSeed !== profile.avatarSeed) updates.avatarSeed = editedProfile.avatarSeed;

    // If nothing changed, just close editing
    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      // Refresh user data from the server
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setSaveError(null);
  };

  const randomizeSeed = () => {
    setEditedProfile(prev => ({
      ...prev,
      avatarSeed: Math.random().toString(36).substring(2, 10),
    }));
  };

  // Profile completion calculation
  const completionItems = React.useMemo(() => {
    if (!user) return { items: [], percentage: 0, remainingXP: 0 };

    const items = [
      { label: "Add profile photo", done: !!(user.avatar?.seed), xp: 10 },
      { label: "Verify email", done: user.isVerified, xp: 15 },
      { label: "Add phone number", done: !!user.phone, xp: 15 },
      { label: "Add location", done: !!user.location, xp: 15 },
      { label: "Set display name", done: !!user.name, xp: 10 },
    ];

    const completed = items.filter(i => i.done).length;
    const percentage = Math.round((completed / items.length) * 100);
    const remainingXP = items.filter(i => !i.done).reduce((sum, i) => sum + i.xp, 0);

    return { items, percentage, remainingXP };
  }, [user]);

  // Loading state while auth initializes
  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 me-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="w-4 h-4 me-2" />
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 me-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 me-2" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {saveError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {saveError}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar Section */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <DiceBearAvatar
                  seed={isEditing ? editedProfile.avatarSeed : profile.avatarSeed}
                  style={isEditing ? editedProfile.avatarStyle : profile.avatarStyle}
                  size="3xl"
                  className="border-4 border-moulna-gold/30"
                />
                {isEditing && (
                  <button
                    onClick={() => setShowAvatarEditor(!showAvatarEditor)}
                    className="absolute -bottom-2 -end-2 w-10 h-10 rounded-full bg-moulna-gold text-white flex items-center justify-center shadow-lg hover:bg-moulna-gold-dark transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div>
                <p className="font-medium">{profile.name || "Unnamed User"}</p>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <LevelBadge level={user.level} xp={user.xp} size="sm" />
                </div>
              </div>
            </div>

            {/* Avatar Editor */}
            {isEditing && showAvatarEditor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 pt-6 border-t"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Choose Avatar Style</h3>
                  <Button variant="outline" size="sm" onClick={randomizeSeed}>
                    <RefreshCw className="w-4 h-4 me-2" />
                    Randomize
                  </Button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {AVATAR_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => setEditedProfile(prev => ({ ...prev, avatarStyle: style }))}
                      className={cn(
                        "p-2 rounded-xl border-2 transition-all",
                        editedProfile.avatarStyle === style
                          ? "border-moulna-gold bg-moulna-gold/10"
                          : "border-muted hover:border-moulna-gold/50"
                      )}
                    >
                      <DiceBearAvatar
                        seed={editedProfile.avatarSeed}
                        style={style}
                        size="lg"
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  More styles unlock as you level up!
                </p>
              </motion.div>
            )}
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm py-2">{profile.name || "Not set"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email
                  </label>
                  <p className="text-sm py-2 text-muted-foreground">{profile.email}</p>
                  {isEditing && (
                    <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+971 50 123 4567"
                    />
                  ) : (
                    <p className="text-sm py-2">{profile.phone || "Not set"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Location
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.emirate}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, emirate: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg border bg-background"
                    >
                      <option value="">Select emirate</option>
                      {["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK", "Fujairah", "UAQ"].map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm py-2">{profile.emirate || "Not set"}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border bg-background resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {profile.bio || "No bio yet"}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Badges */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-moulna-gold" />
              Earned Badges
            </h2>
            {badgesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <span className="ms-2 text-sm text-muted-foreground">Loading badges...</span>
              </div>
            ) : earnedBadges.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No badges earned yet. Keep exploring to unlock your first badge!
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {earnedBadges.map((badge) => {
                  const definition = BADGE_DEFINITIONS[badge.badgeId];
                  const displayName = definition?.name || badge.badgeId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                  const displayIcon = definition?.icon || "🏅";

                  return (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-moulna-gold/10 to-transparent"
                      title={definition?.description || `Earned on ${new Date(badge.earnedAt).toLocaleDateString()}`}
                    >
                      <span className="text-xl">{displayIcon}</span>
                      <div>
                        <span className="text-sm font-medium">{displayName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Account Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">{profile.joinDate || "Unknown"}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Shield className={cn(
                  "w-5 h-5",
                  user.isVerified ? "text-emerald-500" : "text-muted-foreground"
                )} />
                <div>
                  <p className="text-sm font-medium">Email Verified</p>
                  <p className={cn(
                    "text-sm",
                    user.isVerified ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {user.isVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* XP Stats */}
          <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-transparent">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-moulna-gold" />
                <span className="text-3xl font-bold text-moulna-gold">
                  {user.xp.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Total XP Earned</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">{user.level}</p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{earnedBadges.length}</p>
                  <p className="text-xs text-muted-foreground">Badges</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Completion */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Profile Completion</h3>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{completionItems.percentage}% Complete</span>
                {completionItems.remainingXP > 0 && (
                  <span className="text-sm text-muted-foreground">
                    +{completionItems.remainingXP} XP remaining
                  </span>
                )}
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-moulna-gold transition-all duration-500"
                  style={{ width: `${completionItems.percentage}%` }}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {completionItems.items.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  {item.done ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-muted-foreground line-through">{item.label}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-moulna-gold" />
                      <span className="text-moulna-gold">{item.label} (+{item.xp} XP)</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
