"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { useAuthStore } from "@/store/useAuthStore";
import { EMIRATES } from "@/lib/types";
import {
  Settings, User, Bell, Shield,
  Mail, Phone, MapPin, Moon, Sun, Monitor,
  Save, Loader2, Eye, EyeOff, AlertTriangle,
  Trash2, Check, RefreshCw, Camera
} from "lucide-react";
import { DeleteAccountDialog } from "@/components/settings/DeleteAccountDialog";

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

export default function SettingsPage() {
  const { user, fetchProfile } = useAuthStore();
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Profile form state
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [avatarStyle, setAvatarStyle] = React.useState("adventurer");
  const [avatarSeed, setAvatarSeed] = React.useState("");
  const [showAvatarEditor, setShowAvatarEditor] = React.useState(false);

  // Appearance
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system");
  const [language, setLanguage] = React.useState("en");

  // Notifications
  const [notifications, setNotifications] = React.useState({
    inquiryUpdates: true,
    xpEarned: true,
    badgeUnlocked: true,
    priceDrops: true,
    newsletter: true,
  });

  // Password
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  // Load real data
  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
      setAvatarStyle(user.avatar?.style || "adventurer");
      setAvatarSeed(user.avatar?.seed || user.username || "");
    }
  }, [user]);

  const showSavedIndicator = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, location, avatarStyle, avatarSeed }),
      });
      if (res.ok) {
        await fetchProfile();
        showSavedIndicator();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.error || "Failed to update password");
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const randomizeSeed = () => {
    setAvatarSeed(Math.random().toString(36).substring(2, 10));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <Settings className="w-6 h-6" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
            <Check className="w-4 h-4" />
            Saved
          </div>
        )}
      </div>

      <div className="grid gap-8">
        {/* Profile */}
        <Card className="p-6">
          <h2 className="font-semibold mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <DiceBearAvatar
                seed={avatarSeed}
                style={avatarStyle}
                size="3xl"
                className="border-4 border-moulna-gold/30"
              />
              <button
                onClick={() => setShowAvatarEditor(!showAvatarEditor)}
                className="absolute -bottom-2 -end-2 w-10 h-10 rounded-full bg-moulna-gold text-white flex items-center justify-center shadow-lg hover:bg-moulna-gold-dark transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div>
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-sm text-muted-foreground">@{user?.username || "user"}</p>
              <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
            </div>
          </div>

          {/* Avatar Editor */}
          {showAvatarEditor && (
            <div className="mb-6 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Choose Avatar Style</h3>
                <Button variant="outline" size="sm" onClick={randomizeSeed}>
                  <RefreshCw className="w-4 h-4 me-2" />
                  Randomize
                </Button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {AVATAR_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setAvatarStyle(style)}
                    className={cn(
                      "p-2 rounded-xl border-2 transition-all",
                      avatarStyle === style
                        ? "border-moulna-gold bg-moulna-gold/10"
                        : "border-muted hover:border-moulna-gold/50"
                    )}
                  >
                    <DiceBearAvatar seed={avatarSeed} style={style} size="lg" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <Input value={user?.email || ""} disabled className="bg-muted" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 000 0000"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
                >
                  <option value="">Select emirate</option>
                  {EMIRATES.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="gold" onClick={handleSaveProfile} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
              Save Profile
            </Button>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <div className="flex gap-3">
                {[
                  { id: "light" as const, icon: Sun, label: "Light" },
                  { id: "dark" as const, icon: Moon, label: "Dark" },
                  { id: "system" as const, icon: Monitor, label: "System" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all",
                      theme === option.id
                        ? "border-moulna-gold bg-moulna-gold/10"
                        : "border-muted hover:border-moulna-gold/50"
                    )}
                  >
                    <option.icon className="w-4 h-4" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full max-w-xs h-10 px-3 rounded-lg border bg-background text-sm"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="space-y-3">
            {[
              { key: "inquiryUpdates" as const, label: "Inquiry Updates", desc: "Get notified about inquiry responses" },
              { key: "xpEarned" as const, label: "XP Earned", desc: "Notifications when you earn XP" },
              { key: "badgeUnlocked" as const, label: "Badge Unlocked", desc: "When you earn a new badge" },
              { key: "priceDrops" as const, label: "Price Drop Alerts", desc: "When wishlist items drop in price" },
              { key: "newsletter" as const, label: "Newsletter", desc: "Weekly digest of new listings" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={() => toggleNotification(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-moulna-gold peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-medium mb-1.5 block">New Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Password updated successfully
              </p>
            )}
            <Button
              variant="gold"
              onClick={handleChangePassword}
              disabled={saving || !newPassword || !confirmPassword}
            >
              {saving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : null}
              Update Password
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200 dark:border-red-900">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-600">Danger Zone</span>
          </h2>
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-950">
            <div>
              <p className="font-medium text-red-700 dark:text-red-200">Delete Account</p>
              <p className="text-sm text-red-600 dark:text-red-300">Permanently delete your account and all data</p>
            </div>
            <Button
              variant="outline"
              className="border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 me-1" />
              Delete
            </Button>
          </div>
        </Card>

      </div>

      <DeleteAccountDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
    </div>
  );
}
