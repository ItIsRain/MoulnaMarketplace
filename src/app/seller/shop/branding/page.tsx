"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Palette, Save, Image, Upload, RefreshCw, Check,
  Eye, Sparkles, Crown, Lock
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

const COLOR_PRESETS = [
  { id: "gold", name: "Moulna Gold", primary: "#c7a34d", secondary: "#363e42" },
  { id: "ocean", name: "Ocean Blue", primary: "#0ea5e9", secondary: "#0c4a6e" },
  { id: "forest", name: "Forest Green", primary: "#22c55e", secondary: "#14532d" },
  { id: "royal", name: "Royal Purple", primary: "#8b5cf6", secondary: "#4c1d95" },
  { id: "rose", name: "Desert Rose", primary: "#ec4899", secondary: "#831843" },
  { id: "sunset", name: "Arabian Sunset", primary: "#f97316", secondary: "#7c2d12" },
];

const BANNER_STYLES = [
  { id: "gradient", name: "Gradient", premium: false },
  { id: "pattern", name: "Arabic Pattern", premium: false },
  { id: "photo", name: "Custom Photo", premium: false },
  { id: "animated", name: "Animated", premium: true },
  { id: "3d", name: "3D Effect", premium: true },
];

const LOGO_STYLES = [
  { id: "lorelei", name: "Lorelei" },
  { id: "avataaars", name: "Avataaars" },
  { id: "bottts", name: "Bottts" },
  { id: "fun-emoji", name: "Fun Emoji" },
  { id: "icons", name: "Icons" },
];

export default function ShopBrandingPage() {
  const [selectedColor, setSelectedColor] = React.useState("gold");
  const [selectedBanner, setSelectedBanner] = React.useState("gradient");
  const [selectedLogoStyle, setSelectedLogoStyle] = React.useState("lorelei");
  const [customPrimary, setCustomPrimary] = React.useState("#c7a34d");
  const [customSecondary, setCustomSecondary] = React.useState("#363e42");
  const [bannerImageUrl, setBannerImageUrl] = React.useState("");
  const [logoImageUrl, setLogoImageUrl] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const currentPreset = COLOR_PRESETS.find(p => p.id === selectedColor);

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
            <Palette className="w-7 h-7 text-moulna-gold" />
            Shop Branding
          </h1>
          <p className="text-muted-foreground">
            Customize your shop's visual identity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 me-2" />
            Preview
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Branding Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Color Scheme */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-moulna-gold" />
              Color Scheme
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose a color preset or create your own custom palette.
            </p>

            {/* Presets */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              {COLOR_PRESETS.map((preset) => (
                <motion.button
                  key={preset.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedColor(preset.id);
                    setCustomPrimary(preset.primary);
                    setCustomSecondary(preset.secondary);
                  }}
                  className={cn(
                    "relative p-3 rounded-xl border-2 transition-all",
                    selectedColor === preset.id
                      ? "border-moulna-gold ring-2 ring-moulna-gold/50"
                      : "border-muted hover:border-moulna-gold/50"
                  )}
                >
                  <div className="flex gap-1 mb-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <p className="text-xs font-medium truncate">{preset.name}</p>
                  {selectedColor === preset.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-moulna-gold flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Custom Colors */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-3 block">Custom Colors</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary" className="text-xs text-muted-foreground">
                    Primary Color
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                      className="w-12 h-10 rounded-lg border cursor-pointer"
                    />
                    <Input
                      id="primary"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary" className="text-xs text-muted-foreground">
                    Secondary Color
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      value={customSecondary}
                      onChange={(e) => setCustomSecondary(e.target.value)}
                      className="w-12 h-10 rounded-lg border cursor-pointer"
                    />
                    <Input
                      id="secondary"
                      value={customSecondary}
                      onChange={(e) => setCustomSecondary(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Banner Style */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-moulna-gold" />
              Banner Style
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {BANNER_STYLES.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => !style.premium && setSelectedBanner(style.id)}
                  disabled={style.premium}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all text-start",
                    selectedBanner === style.id
                      ? "border-moulna-gold bg-moulna-gold/5"
                      : "border-muted hover:border-moulna-gold/50",
                    style.premium && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "h-20 rounded-lg mb-3",
                    style.id === "gradient" && "bg-gradient-to-r from-moulna-gold to-amber-400",
                    style.id === "pattern" && "bg-moulna-charcoal bg-[url('/patterns/arabic.svg')]",
                    style.id === "photo" && "bg-muted",
                    style.id === "animated" && "bg-gradient-to-r from-purple-500 to-pink-500",
                    style.id === "3d" && "bg-gradient-to-br from-blue-500 to-cyan-500"
                  )} />
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{style.name}</span>
                    {style.premium ? (
                      <Badge variant="secondary" className="text-xs">
                        <Crown className="w-3 h-3 me-1" />
                        Premium
                      </Badge>
                    ) : selectedBanner === style.id ? (
                      <Check className="w-4 h-4 text-moulna-gold" />
                    ) : null}
                  </div>
                </motion.button>
              ))}
            </div>

            {selectedBanner === "photo" && (
              <ImageUpload
                value={bannerImageUrl}
                onChange={setBannerImageUrl}
                folder="banners"
                aspectRatio="banner"
                placeholder="Upload your banner image"
                maxSizeMB={5}
                recommendedSize="1920 × 600px landscape"
              />
            )}
          </Card>

          {/* Logo Style */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-moulna-gold" />
              Logo / Avatar Style
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose an avatar style or upload your own logo.
            </p>

            <div className="grid grid-cols-5 gap-4 mb-4">
              {LOGO_STYLES.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedLogoStyle(style.id)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all",
                    selectedLogoStyle === style.id
                      ? "border-moulna-gold bg-moulna-gold/5"
                      : "border-muted hover:border-moulna-gold/50"
                  )}
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    <DiceBearAvatar seed="shop-preview" size="sm" style={style.id} />
                  </div>
                  <p className="text-xs font-medium truncate">{style.name}</p>
                </motion.button>
              ))}
            </div>

            <div className="pt-4 border-t space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Or upload a custom logo</p>
              <ImageUpload
                value={logoImageUrl}
                onChange={setLogoImageUrl}
                folder="logos"
                aspectRatio="square"
                placeholder="Upload your shop logo"
                maxSizeMB={5}
                recommendedSize="512 × 512px square"
              />
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-6">
            <h2 className="font-semibold mb-4">Live Preview</h2>

            {/* Banner Preview */}
            <div
              className="h-24 rounded-t-lg"
              style={{
                background: selectedBanner === "gradient"
                  ? `linear-gradient(135deg, ${customPrimary}, ${customSecondary})`
                  : customSecondary,
              }}
            />

            {/* Shop Info Preview */}
            <div className="bg-white border border-t-0 rounded-b-lg p-4 -mt-8 relative">
              <div className="flex items-end gap-3 mb-3">
                <div
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden"
                  style={{ backgroundColor: customPrimary }}
                >
                  <DiceBearAvatar seed="shop-preview" size="lg" style={selectedLogoStyle} />
                </div>
                <div className="pb-1">
                  <h3 className="font-bold">Arabian Scents</h3>
                  <p className="text-xs text-muted-foreground">Fragrances & Oud</p>
                </div>
              </div>

              {/* Sample Buttons */}
              <div className="flex gap-2 mb-3">
                <Button
                  size="sm"
                  style={{ backgroundColor: customPrimary }}
                  className="text-white"
                >
                  Follow Shop
                </Button>
                <Button size="sm" variant="outline">
                  Message
                </Button>
              </div>

              {/* Sample Product Cards */}
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg p-2">
                    <div className="aspect-square bg-muted rounded mb-2" />
                    <p className="text-xs font-medium truncate">Product {i}</p>
                    <p className="text-xs" style={{ color: customPrimary }}>AED 99</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              This is how your shop will appear to customers
            </p>
          </Card>

          {/* Premium Features */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Premium Branding</h3>
            </div>
            <p className="text-sm text-purple-700 mb-4">
              Unlock animated banners, 3D effects, and custom fonts with Moulna Premium.
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Upgrade to Premium
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
