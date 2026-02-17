"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { useAuthStore } from "@/store/useAuthStore";
import type { Shop } from "@/lib/types";
import {
  Store, Camera, MapPin, Globe, Instagram,
  Phone, Mail, Clock, Star, Package,
  Edit, Eye, Save, Share2, Award, Sparkles, Loader2
} from "lucide-react";

export default function SellerShopPage() {
  const { shop: storeShop, user, fetchProfile } = useAuthStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [uploadingField, setUploadingField] = React.useState<string | null>(null);
  const [shop, setShop] = React.useState<Shop | null>(null);

  // Editable fields
  const [editData, setEditData] = React.useState({
    name: "",
    description: "",
    location: "",
    email: "",
    phone: "",
    website: "",
    instagram: "",
  });

  React.useEffect(() => {
    async function loadShop() {
      try {
        const res = await fetch("/api/seller/shop");
        if (res.ok) {
          const data = await res.json();
          setShop(data.shop);
          setEditData({
            name: data.shop.name || "",
            description: data.shop.description || "",
            location: data.shop.location || "",
            email: data.shop.email || "",
            phone: data.shop.phone || "",
            website: data.shop.website || "",
            instagram: data.shop.instagram || "",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadShop();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/seller/shop", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        const data = await res.json();
        setShop(data.shop);
        setIsEditing(false);
        await fetchProfile();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "bannerUrl" | "logoUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", field === "bannerUrl" ? "banners" : "logos");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        const patchRes = await fetch("/api/seller/shop", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: url }),
        });
        if (patchRes.ok) {
          const data = await patchRes.json();
          setShop(data.shop);
        }
      }
    } finally {
      setUploadingField(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-24">
        <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Shop Found</h2>
        <p className="text-muted-foreground mb-4">Set up your shop to get started.</p>
        <Button variant="gold" asChild>
          <Link href="/seller/onboarding">Set Up Shop</Link>
        </Button>
      </div>
    );
  }

  const operatingHours = shop.operatingHours || {};
  const policies = shop.policies || {};

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Shop Profile</h1>
            <p className="text-muted-foreground">
              Customize how your shop appears to customers
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/shops/${shop.slug}`}>
                <Eye className="w-4 h-4 me-2" />
                Preview
              </Link>
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 me-2" />
              Share
            </Button>
            {isEditing ? (
              <Button
                className="bg-moulna-gold hover:bg-moulna-gold-dark"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 me-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Banner & Avatar */}
        <Card className="overflow-hidden">
          {/* Banner */}
          <div className="relative h-48 md:h-64">
            {shop.bannerUrl ? (
              <Image
                src={shop.bannerUrl}
                alt="Shop banner"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-moulna-gold/30 via-amber-100 to-moulna-gold/10" />
            )}
            {uploadingField === "bannerUrl" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="flex items-center gap-2 bg-white/90 rounded-lg px-4 py-2 shadow">
                  <Loader2 className="w-5 h-5 animate-spin text-moulna-gold" />
                  <span className="text-sm font-medium">Uploading banner...</span>
                </div>
              </div>
            )}
            {isEditing && (
              <label className="absolute top-4 right-4 cursor-pointer">
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleImageUpload(e, "bannerUrl")} />
                <Button variant="secondary" size="sm" asChild>
                  <span>
                    <Camera className="w-4 h-4 me-2" />
                    Change Banner
                  </span>
                </Button>
              </label>
            )}
          </div>

          {/* Shop Info - below banner */}
          <div className="px-6 pb-6">
            {/* Avatar row — overlaps the banner */}
            <div className="flex items-end gap-5 -mt-14">
              <div className="relative flex-shrink-0">
                {uploadingField === "logoUrl" ? (
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-muted flex items-center justify-center">
                    <div className="flex flex-col items-center gap-1">
                      <Loader2 className="w-6 h-6 animate-spin text-moulna-gold" />
                      <span className="text-xs text-muted-foreground">Uploading...</span>
                    </div>
                  </div>
                ) : shop.logoUrl ? (
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                    <Image src={shop.logoUrl} alt={shop.name} width={112} height={112} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <DiceBearAvatar
                    seed={shop.avatarSeed || shop.slug}
                    style={shop.avatarStyle || "adventurer"}
                    size="4xl"
                    className="border-4 border-white shadow-lg rounded-full"
                  />
                )}
                {isEditing && !uploadingField && (
                  <label className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-moulna-gold text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-moulna-gold-dark transition-colors">
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleImageUpload(e, "logoUrl")} />
                    <Camera className="w-4 h-4" />
                  </label>
                )}
                {shop.isVerified && !isEditing && (
                  <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Name, location, badges — clearly below avatar */}
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{shop.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{shop.location || "Not set"}</span>
                </div>
                {(shop.isVerified || shop.isArtisan) && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {shop.isVerified && (
                      <Badge variant="secondary">
                        <Sparkles className="w-3 h-3 me-1" />
                        Verified
                      </Badge>
                    )}
                    {shop.isArtisan && (
                      <Badge variant="secondary">
                        <Sparkles className="w-3 h-3 me-1" />
                        Artisan
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <LevelBadge level={user?.level ?? 1} xp={user?.xp ?? 0} showTitle />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-xl font-bold">{shop.followerCount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{shop.totalListings}</p>
                <p className="text-sm text-muted-foreground">Listings</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-moulna-gold">{(user?.xp ?? 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Shop Info */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Shop Information</h2>
            <div className="space-y-4">
              <div>
                <Label>Shop Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{shop.name}</p>
                )}
              </div>
              <div>
                <Label>Description</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="mt-1"
                    rows={4}
                  />
                ) : (
                  <p className="mt-1 text-muted-foreground">{shop.description || "No description set"}</p>
                )}
              </div>
              <div>
                <Label>Location</Label>
                {isEditing ? (
                  <Input
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{shop.location || "Not set"}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="flex-1"
                  />
                ) : (
                  <span>{shop.email || "Not set"}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="flex-1"
                  />
                ) : (
                  <span>{shop.phone || "Not set"}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editData.website}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    className="flex-1"
                  />
                ) : (
                  <span>{shop.website || "Not set"}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editData.instagram}
                    onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                    className="flex-1"
                  />
                ) : (
                  <span>{shop.instagram || "Not set"}</span>
                )}
              </div>
            </div>
          </Card>

          {/* Business Hours */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Business Hours
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday - Thursday</span>
                <span>{operatingHours.weekdays || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Friday - Saturday</span>
                <span>{operatingHours.weekends || "Not set"}</span>
              </div>
            </div>
          </Card>

          {/* Policies */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Shop Policies</h2>
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Meetup Policy</Label>
                <p>{policies.meetup || "Not set"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Disputes</Label>
                <p>{policies.disputes || "Not set"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Warranty</Label>
                <p>{policies.warranty || "Not set"}</p>
              </div>
            </div>
          </Card>
        </div>
    </div>
  );
}
