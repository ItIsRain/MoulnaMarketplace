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
import { useAuthStore } from "@/store/useAuthStore";
import {
  User, Camera, Mail, Phone, MapPin, Calendar,
  Save, ChevronRight, Sparkles, Globe, Instagram,
  Twitter, Link as LinkIcon
} from "lucide-react";

export default function EditProfilePage() {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
  });

  const { user, isLoading: authLoading, fetchProfile } = useAuthStore();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          phone: formData.phone,
          location: formData.location,
        }),
      });
      if (res.ok) {
        setSaveMessage("Profile saved successfully!");
        fetchProfile();
      } else {
        const err = await res.json().catch(() => ({}));
        setSaveMessage(err.error || "Failed to save profile");
      }
    } catch {
      setSaveMessage("Failed to save profile");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Save className="w-8 h-8 animate-pulse text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your personal information
            </p>
            {saveMessage && (
              <p className={cn("text-sm mt-1", saveMessage.includes("success") ? "text-green-600" : "text-red-600")}>
                {saveMessage}
              </p>
            )}
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
              <DiceBearAvatar seed={user?.avatar?.seed || user?.username || "default"} style={user?.avatar?.style} size="xl" className="w-24 h-24" />
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
                  readOnly
                  disabled
                  className="ps-10 opacity-60"
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

        {/* Social Links — managed via Shop settings for sellers */}

        {/* Profile Completion */}
        {(() => {
          const fields = [formData.firstName, formData.lastName, formData.email, formData.phone, formData.location];
          const filled = fields.filter(f => f.trim().length > 0).length;
          const pct = Math.round((filled / fields.length) * 100);
          return (
            <Card className="p-4 bg-gradient-to-r from-moulna-gold/10 to-transparent border-moulna-gold/20">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-moulna-gold" />
                <div>
                  <p className="font-medium">{pct === 100 ? "Profile Complete!" : "Complete Your Profile"}</p>
                  <p className="text-sm text-muted-foreground">
                    {pct === 100 ? "All fields are filled out." : "Fill out all fields to unlock the profile completion badge!"}
                  </p>
                </div>
                <div className="ms-auto">
                  <Badge className={pct === 100 ? "bg-green-600" : "bg-moulna-gold"}>{pct}% Complete</Badge>
                </div>
              </div>
            </Card>
          );
        })()}

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
