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
import { BadgeShowcase } from "@/components/gamification/BadgeCard";
import {
  User, Mail, Phone, MapPin, Calendar, Camera, RefreshCw,
  Edit2, Check, X, Sparkles, Shield
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

const USER_BADGES = [
  { id: "bdg_1", name: "First Purchase", icon: "🛍️" },
  { id: "bdg_2", name: "Review Master", icon: "⭐" },
  { id: "bdg_3", name: "Social Butterfly", icon: "🦋" },
  { id: "bdg_4", name: "Week Warrior", icon: "🔥" },
  { id: "bdg_5", name: "Wishlist Curator", icon: "❤️" },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = React.useState(false);

  const [profile, setProfile] = React.useState({
    name: "Sarah Ahmed",
    username: "sarah_ahmed",
    email: "sarah@example.com",
    phone: "+971 50 123 4567",
    emirate: "Dubai",
    bio: "Lover of handmade crafts and local artisan products. Always on the lookout for unique finds!",
    joinDate: "March 2023",
    avatarStyle: "adventurer" as typeof AVATAR_STYLES[number],
    avatarSeed: "sarah-ahmed",
  });

  const [editedProfile, setEditedProfile] = React.useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const randomizeSeed = () => {
    setEditedProfile(prev => ({
      ...prev,
      avatarSeed: Math.random().toString(36).substring(2, 10),
    }));
  };

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
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 me-2" />
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSave}>
              <Check className="w-4 h-4 me-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

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
                <p className="font-medium">{profile.name}</p>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <LevelBadge level={4} xp={2450} size="sm" />
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
                    <p className="text-sm py-2">{profile.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm py-2">{profile.email}</p>
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
                    />
                  ) : (
                    <p className="text-sm py-2">{profile.phone}</p>
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
                      {["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK", "Fujairah", "UAQ"].map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm py-2">{profile.emirate}</p>
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
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
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
            <div className="flex flex-wrap gap-4">
              {USER_BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-moulna-gold/10 to-transparent"
                >
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
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
                  <p className="text-sm text-muted-foreground">{profile.joinDate}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium">Email Verified</p>
                  <p className="text-sm text-emerald-600">Verified</p>
                </div>
              </div>
            </div>
          </Card>

          {/* XP Stats */}
          <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-transparent">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-moulna-gold" />
                <span className="text-3xl font-bold text-moulna-gold">2,450</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Total XP Earned</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">4</p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </div>
                <div>
                  <p className="text-xl font-bold">7</p>
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
                <span className="text-sm font-medium">85% Complete</span>
                <span className="text-sm text-muted-foreground">+30 XP remaining</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-moulna-gold" style={{ width: "85%" }} />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-muted-foreground line-through">Add profile photo</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-muted-foreground line-through">Verify email</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-moulna-gold">
                <Sparkles className="w-4 h-4" />
                <span>Add phone number (+15 XP)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-moulna-gold">
                <Sparkles className="w-4 h-4" />
                <span>Add shipping address (+15 XP)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
