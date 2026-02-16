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

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "banners");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      const patchRes = await fetch("/api/seller/shop", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerUrl: url }),
      });
      if (patchRes.ok) {
        const data = await patchRes.json();
        setShop(data.shop);
      }
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
          <div className="relative h-48 md:h-64">
            {shop.bannerUrl ? (
              <Image
                src={shop.bannerUrl}
                alt="Shop banner"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-moulna-gold/20 to-amber-100" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {isEditing && (
              <label className="absolute top-4 right-4 cursor-pointer">
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleBannerUpload} />
                <Button variant="secondary" size="sm" asChild>
                  <span>
                    <Camera className="w-4 h-4 me-2" />
                    Change Banner
                  </span>
                </Button>
              </label>
            )}
          </div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative -mt-16">
                <DiceBearAvatar
                  seed={shop.avatarSeed || shop.slug}
                  style={shop.avatarStyle || "adventurer"}
                  size="xl"
                  className="w-32 h-32 border-4 border-white shadow-lg"
                />
                {shop.isVerified && (
                  <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 pt-4 md:pt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{shop.name}</h2>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{shop.location || "Not set"}</span>
                    </div>
                  </div>
                  <LevelBadge level={user?.level ?? 1} xp={user?.xp ?? 0} showTitle />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xl font-bold">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  {shop.rating}
                </div>
                <p className="text-sm text-muted-foreground">{shop.reviewCount} reviews</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{shop.followerCount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{shop.totalListings}</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-moulna-gold">{(user?.xp ?? 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
            </div>

            {/* Badges */}
            {(shop.isVerified || shop.isArtisan) && (
              <div className="flex flex-wrap gap-2 mt-4">
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
