"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { useAuthStore } from "@/store/useAuthStore";
import { EMIRATES } from "@/lib/types";
import {
  Settings, Store, User, Package,
  Shield, MapPin, Mail, Phone, Globe, Instagram,
  Save, Loader2, Eye, EyeOff, AlertTriangle,
  Trash2, Check
} from "lucide-react";
import { DeleteAccountDialog } from "@/components/settings/DeleteAccountDialog";
import { DeactivateShopDialog } from "@/components/settings/DeactivateShopDialog";

const TABS = [
  { id: "shop", label: "Shop Profile", icon: Store },
  { id: "account", label: "Account", icon: User },
  { id: "listings", label: "Listing Defaults", icon: Package },
  { id: "security", label: "Security", icon: Shield },
];

const CATEGORIES = [
  "Perfumes & Oud",
  "Jewelry",
  "Home Decor",
  "Arabic Art",
  "Fashion",
  "Food & Sweets",
  "Baby & Kids",
  "Wellness & Beauty",
  "Handmade Crafts",
  "Gifts",
];

export default function SellerSettingsPage() {
  const { user, shop, fetchProfile } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState("shop");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = React.useState(false);

  // Shop form state
  const [shopName, setShopName] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [shopLocation, setShopLocation] = React.useState("");
  const [shopEmail, setShopEmail] = React.useState("");
  const [shopPhone, setShopPhone] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [instagramHandle, setInstagramHandle] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");

  // Account form state
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [location, setLocation] = React.useState("");

  // Listing defaults state
  const [defaultDuration, setDefaultDuration] = React.useState("30");
  const [autoRenew, setAutoRenew] = React.useState(true);
  const [acceptOffers, setAcceptOffers] = React.useState(true);

  // Password state
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  // Load real data from auth store
  React.useEffect(() => {
    if (shop) {
      setShopName(shop.name || "");
      setTagline(shop.tagline || "");
      setDescription(shop.description || "");
      setCategory(shop.category || "");
      setShopLocation(shop.location || "");
      setShopEmail(shop.email || "");
      setShopPhone(shop.phone || "");
      setWebsite(shop.website || "");
      setInstagramHandle(shop.instagram || "");
      setWhatsapp(shop.whatsapp || "");
      const prefs = shop.listingPreferences || {};
      setDefaultDuration(String(prefs.defaultDuration || "30"));
      setAutoRenew(prefs.autoRenew !== false);
      setAcceptOffers(prefs.acceptOffers !== false);
    }
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
    }
  }, [shop, user]);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveShop = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/shop", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: shopName,
          tagline,
          description,
          category,
          location: shopLocation,
          email: shopEmail,
          phone: shopPhone,
          website,
          instagram: instagramHandle,
          whatsapp,
        }),
      });
      if (res.ok) {
        await fetchProfile();
        showSaved();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAccount = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, location }),
      });
      if (res.ok) {
        await fetchProfile();
        showSaved();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveListingDefaults = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/shop", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingPreferences: {
            defaultDuration: parseInt(defaultDuration),
            autoRenew,
            acceptOffers,
          },
        }),
      });
      if (res.ok) {
        await fetchProfile();
        showSaved();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <Settings className="w-6 h-6" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your shop and account settings
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
            <Check className="w-4 h-4" />
            Saved
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <Card className="lg:w-64 p-2 h-fit">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-moulna-gold text-white"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Shop Profile Tab */}
          {activeTab === "shop" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Shop Branding</h2>
                <div className="flex items-start gap-6">
                  <DiceBearAvatar
                    seed={shop?.avatarSeed || shop?.slug || "shop"}
                    style={shop?.avatarStyle || "adventurer"}
                    size="3xl"
                    className="border-4 border-white shadow-lg"
                  />
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Shop Name</label>
                      <Input
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="max-w-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Shop URL</label>
                      <div className="flex items-center gap-2 max-w-md">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">moulna.ae/shops/</span>
                        <Input
                          value={shop?.slug || ""}
                          disabled
                          className="flex-1 bg-muted"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Shop URL cannot be changed after creation</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-6">Shop Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Tagline</label>
                    <Input
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="A short description of your shop"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">About Your Shop</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell buyers about your shop..."
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                          value={shopLocation}
                          onChange={(e) => setShopLocation(e.target.value)}
                          className="w-full rounded-lg border bg-background ps-9 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                        >
                          <option value="">Select emirate</option>
                          {EMIRATES.map((e) => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-6">Contact & Social</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Business Email
                      </label>
                      <Input
                        type="email"
                        value={shopEmail}
                        onChange={(e) => setShopEmail(e.target.value)}
                        placeholder="shop@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Business Phone
                      </label>
                      <Input
                        type="tel"
                        value={shopPhone}
                        onChange={(e) => setShopPhone(e.target.value)}
                        placeholder="+971 50 000 0000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                      <Instagram className="w-4 h-4" /> Instagram
                    </label>
                    <Input
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Website
                    </label>
                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">WhatsApp</label>
                    <Input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+971 50 000 0000"
                    />
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button variant="gold" onClick={handleSaveShop} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number
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
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                    >
                      <option value="">Select emirate</option>
                      {EMIRATES.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button variant="gold" onClick={handleSaveAccount} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {/* Listing Defaults Tab */}
          {activeTab === "listings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Default Listing Settings</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  These defaults will be applied when creating new listings. You can override them for individual listings.
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Listing Duration</label>
                    <select
                      value={defaultDuration}
                      onChange={(e) => setDefaultDuration(e.target.value)}
                      className="w-full max-w-xs rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                    >
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Auto-renew listings</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically renew listings when they expire
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoRenew}
                        onChange={() => setAutoRenew(!autoRenew)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-moulna-gold peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Accept offers</p>
                      <p className="text-sm text-muted-foreground">
                        Allow buyers to make offers on your listings
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptOffers}
                        onChange={() => setAcceptOffers(!acceptOffers)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-moulna-gold peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button variant="gold" onClick={handleSaveListingDefaults} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Change Password</h2>
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

              <Card className="p-6 border-red-200 dark:border-red-900">
                <h2 className="font-semibold mb-6 text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-950">
                    <div>
                      <p className="font-medium text-orange-700 dark:text-orange-200">Deactivate Shop</p>
                      <p className="text-sm text-orange-600 dark:text-orange-300">
                        Temporarily hide your shop and all listings
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-orange-400 dark:border-orange-600 text-orange-700 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-orange-900"
                      onClick={() => setDeactivateDialogOpen(true)}
                    >
                      Deactivate
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-950">
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-200">Delete Account</p>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Permanently delete your account and all data
                      </p>
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
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Dialogs rendered outside motion.div to avoid transform breaking fixed positioning */}
      <DeactivateShopDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        shopName={shop?.name || "my shop"}
      />
      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        shopName={shop?.name}
      />
    </div>
  );
}
