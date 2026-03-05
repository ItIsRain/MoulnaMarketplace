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
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  User, Camera, Mail, Phone, MapPin, Calendar,
  Save, ChevronRight, Sparkles, Globe, Instagram,
  Twitter, Link as LinkIcon
} from "lucide-react";

export default function EditProfilePage() {
  const [formData, setFormData] = React.useState({
    firstName: "Ahmed",
    lastName: "Hassan",
    email: "ahmed@example.com",
    phone: "+971 50 123 4567",
    bio: "Passionate collector of Arabian fragrances and handmade crafts. Level 5 Moulna enthusiast!",
    location: "Dubai",
    website: "",
    instagram: "@ahmed_uae",
    twitter: "",
  });

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your personal information
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-moulna-gold hover:bg-moulna-gold-dark"
          >
            <Save className="w-4 h-4 me-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Avatar Section */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <DiceBearAvatar seed="ahmed-user" size="xl" className="w-24 h-24" />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-moulna-gold text-white flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-3">
                Your avatar is generated using DiceBear. Customize it or upload your own photo.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/profile/avatar">
                    <Sparkles className="w-4 h-4 me-1" />
                    Customize Avatar
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 me-1" />
                  Upload Photo
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Basic Info */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1"
                rows={3}
                placeholder="Tell others about yourself..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.bio.length}/200 characters
              </p>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
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
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">Verified</Badge>
                Your email is verified
              </p>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="ps-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full ps-10 h-10 rounded-md border border-input bg-background"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="RAK">Ras Al Khaimah</option>
                  <option value="Fujairah">Fujairah</option>
                  <option value="UAQ">Umm Al Quwain</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Social Links</h2>
          <div className="space-y-4">
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
          </div>
        </Card>

        {/* Profile Completion */}
        <Card className="p-4 bg-gradient-to-r from-moulna-gold/10 to-transparent border-moulna-gold/20">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-moulna-gold" />
            <div>
              <p className="font-medium">Complete Your Profile</p>
              <p className="text-sm text-muted-foreground">
                Fill out all fields to unlock the profile completion badge!
              </p>
            </div>
            <div className="ms-auto">
              <Badge className="bg-moulna-gold">80% Complete</Badge>
            </div>
          </div>
        </Card>

        {/* Save Button (Mobile) */}
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
  );
}
