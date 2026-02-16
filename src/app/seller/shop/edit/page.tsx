"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Store, Camera, Save, Globe, MapPin, Phone, Mail,
  Clock, Instagram, Facebook, Twitter, Youtube, ChevronRight,
  Palette, FileText, Image, ExternalLink, Video
} from "lucide-react";

const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

export default function EditShopPage() {
  const [formData, setFormData] = React.useState({
    name: "Arabian Scents Boutique",
    slug: "arabian-scents",
    tagline: "Authentic Arabian Fragrances Since 2010",
    description: "We specialize in premium Arabian oud, bakhoor, and traditional perfumes. Each product is carefully sourced and crafted to bring you the finest scents from the Arabian Peninsula.",
    email: "contact@arabianscents.ae",
    phone: "+971 50 123 4567",
    emirate: "Dubai",
    location: "Al Barsha, Dubai, UAE",
    website: "https://arabianscents.ae",
    instagram: "@arabianscents_uae",
    facebook: "arabianscentsUAE",
    twitter: "@arabian_scents",
    youtube: "",
    videoUrl: "",
    operatingHours: "9:00 AM - 9:00 PM",
    operatingDays: "Sunday - Thursday",
  });

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Store className="w-7 h-7 text-moulna-gold" />
            Edit Shop Profile
          </h1>
          <p className="text-muted-foreground">
            Update your shop information and settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/shops/arabian-scents" target="_blank">
              <ExternalLink className="w-4 h-4 me-2" />
              View Shop
            </Link>
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-moulna-gold hover:bg-moulna-gold-dark"
          >
            <Save className="w-4 h-4 me-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/seller/shop/story">
          <Card className="p-4 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium group-hover:text-moulna-gold transition-colors">
                  Shop Story
                </p>
                <p className="text-sm text-muted-foreground">Tell your brand story</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>
        <Link href="/seller/shop/branding">
          <Card className="p-4 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <Palette className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium group-hover:text-moulna-gold transition-colors">
                  Branding
                </p>
                <p className="text-sm text-muted-foreground">Colors, logo & theme</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>
        <Link href="/seller/shop/gallery">
          <Card className="p-4 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Image className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium group-hover:text-moulna-gold transition-colors">
                  Gallery
                </p>
                <p className="text-sm text-muted-foreground">Shop photos & media</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Shop Logo & Preview */}
        <Card className="p-6 lg:sticky lg:top-6 h-fit">
          <h2 className="font-semibold mb-4">Shop Preview</h2>
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <DiceBearAvatar seed="arabian-scents" size="xl" className="w-32 h-32 mx-auto" />
              <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-moulna-gold text-white flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-bold text-lg">{formData.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{formData.tagline}</p>
            <Badge className="bg-green-100 text-green-700">Verified Seller</Badge>

            <div className="mt-6 pt-6 border-t text-start">
              <p className="text-xs text-muted-foreground mb-1">Shop URL</p>
              <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm flex-1 truncate">
                  moulna.ae/shops/{formData.slug}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Shop Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="slug">Shop URL</Label>
                <div className="flex mt-1">
                  <span className="inline-flex items-center px-3 rounded-s-md border border-e-0 border-input bg-muted text-muted-foreground text-sm">
                    moulna.ae/shops/
                  </span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="rounded-s-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="mt-1"
                  placeholder="A short catchy phrase for your shop"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                  rows={4}
                  placeholder="Tell customers about your shop..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="ps-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="ps-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emirate">Emirate</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    id="emirate"
                    value={formData.emirate}
                    onChange={(e) => setFormData({ ...formData, emirate: e.target.value })}
                    className="w-full rounded-md border border-input bg-background ps-10 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                  >
                    <option value="">Select Emirate</option>
                    {EMIRATES.map((emirate) => (
                      <option key={emirate} value={emirate}>
                        {emirate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="location">Address</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="ps-10"
                    placeholder="e.g., Al Barsha, Dubai"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="ps-10"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hours">Operating Hours</Label>
                <div className="relative mt-1">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="hours"
                    value={formData.operatingHours}
                    onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                    className="ps-10"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Social Links */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Social Media</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative mt-1">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="ps-10"
                    placeholder="@username"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <div className="relative mt-1">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="ps-10"
                    placeholder="Page name or URL"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="twitter">Twitter / X</Label>
                <div className="relative mt-1">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="ps-10"
                    placeholder="@username"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <div className="relative mt-1">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="youtube"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    className="ps-10"
                    placeholder="Channel URL"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Media */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Media</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="videoUrl">Shop Intro Video</Label>
                <div className="relative mt-1">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="ps-10"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  YouTube or Vimeo URL for your shop intro video
                </p>
              </div>
            </div>
          </Card>

          {/* Mobile Save Button */}
          <div className="lg:hidden">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-moulna-gold hover:bg-moulna-gold-dark"
            >
              <Save className="w-4 h-4 me-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
