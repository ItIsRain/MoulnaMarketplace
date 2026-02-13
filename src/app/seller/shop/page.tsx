"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Store, Camera, MapPin, Globe, Instagram, Twitter,
  Phone, Mail, Clock, Star, Users, Package,
  Edit, Eye, Save, Share2, Award, Sparkles
} from "lucide-react";

const SHOP_DATA = {
  name: "Scent of Arabia",
  description: "Authentic Arabian fragrances crafted with love. We specialize in premium oud, bakhoor, and traditional perfumes passed down through generations.",
  avatar: "scent-of-arabia",
  banner: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
  location: "Dubai, UAE",
  email: "hello@scentofarabia.ae",
  phone: "+971 50 XXX XXXX",
  website: "www.scentofarabia.ae",
  instagram: "@scentofarabia",
  twitter: "@scentofarabia",
  level: 8,
  xp: 4520,
  rating: 4.9,
  reviewCount: 245,
  followers: 2450,
  productCount: 28,
  isVerified: true,
  badges: ["Top Seller", "Artisan", "Fast Shipper"],
  businessHours: {
    weekdays: "9:00 AM - 9:00 PM",
    weekends: "10:00 AM - 10:00 PM",
  },
  policies: {
    shipping: "Free shipping on orders over AED 100",
    returns: "14-day return policy",
    warranty: "1-year authenticity guarantee",
  },
};

export default function SellerShopPage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [shopData, setShopData] = React.useState(SHOP_DATA);

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
              <Link href={`/shops/${shopData.name.toLowerCase().replace(/\s+/g, '-')}`}>
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
                onClick={() => setIsEditing(false)}
              >
                <Save className="w-4 h-4 me-2" />
                Save Changes
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
            <Image
              src={shopData.banner}
              alt="Shop banner"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {isEditing && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
              >
                <Camera className="w-4 h-4 me-2" />
                Change Banner
              </Button>
            )}
          </div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative -mt-16">
                <DiceBearAvatar
                  seed={shopData.avatar}
                  size="xl"
                  className="w-32 h-32 border-4 border-white shadow-lg"
                />
                {shopData.isVerified && (
                  <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                )}
                {isEditing && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 w-8 h-8"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1 pt-4 md:pt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{shopData.name}</h2>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{shopData.location}</span>
                    </div>
                  </div>
                  <LevelBadge level={shopData.level} xp={shopData.xp} showTitle />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xl font-bold">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  {shopData.rating}
                </div>
                <p className="text-sm text-muted-foreground">{shopData.reviewCount} reviews</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{shopData.followers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{shopData.productCount}</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-moulna-gold">{shopData.xp.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {shopData.badges.map((badge) => (
                <Badge key={badge} variant="secondary">
                  <Sparkles className="w-3 h-3 me-1" />
                  {badge}
                </Badge>
              ))}
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
                    value={shopData.name}
                    onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{shopData.name}</p>
                )}
              </div>
              <div>
                <Label>Description</Label>
                {isEditing ? (
                  <Textarea
                    value={shopData.description}
                    onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                    className="mt-1"
                    rows={4}
                  />
                ) : (
                  <p className="mt-1 text-muted-foreground">{shopData.description}</p>
                )}
              </div>
              <div>
                <Label>Location</Label>
                {isEditing ? (
                  <Input
                    value={shopData.location}
                    onChange={(e) => setShopData({ ...shopData, location: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{shopData.location}</p>
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
                    value={shopData.email}
                    onChange={(e) => setShopData({ ...shopData, email: e.target.value })}
                    className="flex-1"
                  />
                ) : (
                  <span>{shopData.email}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={shopData.phone}
                    onChange={(e) => setShopData({ ...shopData, phone: e.target.value })}
                    className="flex-1"
                  />
                ) : (
                  <span>{shopData.phone}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={shopData.website}
                    onChange={(e) => setShopData({ ...shopData, website: e.target.value })}
                    className="flex-1"
                  />
                ) : (
                  <span>{shopData.website}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={shopData.instagram}
                    onChange={(e) => setShopData({ ...shopData, instagram: e.target.value })}
                    className="flex-1"
                  />
                ) : (
                  <span>{shopData.instagram}</span>
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
                <span>{shopData.businessHours.weekdays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Friday - Saturday</span>
                <span>{shopData.businessHours.weekends}</span>
              </div>
            </div>
          </Card>

          {/* Policies */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Shop Policies</h2>
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Shipping</Label>
                <p>{shopData.policies.shipping}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Returns</Label>
                <p>{shopData.policies.returns}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Warranty</Label>
                <p>{shopData.policies.warranty}</p>
              </div>
            </div>
          </Card>
        </div>
    </div>
  );
}
