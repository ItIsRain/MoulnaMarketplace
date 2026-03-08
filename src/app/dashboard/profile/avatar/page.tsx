"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Palette, Lock, Check, Sparkles, Crown, Star,
  RefreshCw, Save, ChevronRight, Shuffle, Loader2
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const AVATAR_STYLES = [
  { id: "lorelei", name: "Lorelei", unlockLevel: 1, premium: false },
  { id: "adventurer", name: "Adventurer", unlockLevel: 2, premium: false },
  { id: "avataaars", name: "Avataaars", unlockLevel: 3, premium: false },
  { id: "big-ears", name: "Big Ears", unlockLevel: 4, premium: false },
  { id: "bottts", name: "Bottts", unlockLevel: 5, premium: false },
  { id: "croodles", name: "Croodles", unlockLevel: 6, premium: false },
  { id: "fun-emoji", name: "Fun Emoji", unlockLevel: 7, premium: false },
  { id: "icons", name: "Icons", unlockLevel: 8, premium: false },
  { id: "identicon", name: "Identicon", unlockLevel: 9, premium: false },
  { id: "notionists", name: "Notionists", unlockLevel: 10, premium: true },
];

const BACKGROUNDS = [
  { id: "none", color: "transparent", name: "None", unlockLevel: 1 },
  { id: "gold", color: "#c7a34d", name: "Gold", unlockLevel: 3 },
  { id: "blue", color: "#3b82f6", name: "Ocean", unlockLevel: 4 },
  { id: "purple", color: "#8b5cf6", name: "Royal", unlockLevel: 5 },
  { id: "green", color: "#22c55e", name: "Forest", unlockLevel: 6 },
  { id: "pink", color: "#ec4899", name: "Rose", unlockLevel: 7 },
  { id: "gradient1", color: "linear-gradient(135deg, #c7a34d, #f59e0b)", name: "Sunset", unlockLevel: 8 },
  { id: "gradient2", color: "linear-gradient(135deg, #8b5cf6, #ec4899)", name: "Aurora", unlockLevel: 9 },
  { id: "animated", color: "animated", name: "Animated", unlockLevel: 10, premium: true },
];

const ACCESSORIES = [
  { id: "none", name: "None", icon: "❌", unlockLevel: 1 },
  { id: "crown", name: "Crown", icon: "👑", unlockLevel: 5 },
  { id: "glasses", name: "Glasses", icon: "🕶️", unlockLevel: 3 },
  { id: "hat", name: "Hat", icon: "🎩", unlockLevel: 4 },
  { id: "star", name: "Star", icon: "⭐", unlockLevel: 6 },
  { id: "fire", name: "Fire", icon: "🔥", unlockLevel: 7 },
  { id: "sparkle", name: "Sparkle", icon: "✨", unlockLevel: 8 },
  { id: "diamond", name: "Diamond", icon: "💎", unlockLevel: 10, premium: true },
];

export default function AvatarCustomizerPage() {
  const { user, updateProfile } = useAuthStore();
  const userLevel = user?.level || 1;
  const [selectedStyle, setSelectedStyle] = React.useState(user?.avatar?.style || "lorelei");
  const [selectedBg, setSelectedBg] = React.useState("gold");
  const [selectedAccessory, setSelectedAccessory] = React.useState("none");
  const [seed, setSeed] = React.useState(user?.avatar?.seed || "my-avatar");
  const [isSaving, setIsSaving] = React.useState(false);

  const randomizeSeed = () => {
    setSeed(`avatar-${Math.random().toString(36).substring(7)}`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarStyle: selectedStyle, avatarSeed: seed }),
      });
      if (res.ok) {
        updateProfile({ avatar: { style: selectedStyle, seed } });
        toast.success("Avatar saved!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save avatar");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Palette className="w-7 h-7 text-moulna-gold" />
              Avatar Customizer
            </h1>
            <p className="text-muted-foreground">
              Personalize your profile avatar with unique styles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LevelBadge level={userLevel} showTitle />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Preview */}
          <Card className="p-6 lg:sticky lg:top-6 h-fit">
            <h2 className="font-semibold mb-4 text-center">Preview</h2>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "relative w-40 h-40 rounded-full flex items-center justify-center mb-4",
                  selectedBg !== "none" && "p-1"
                )}
                style={{
                  background: selectedBg === "none"
                    ? "transparent"
                    : BACKGROUNDS.find(b => b.id === selectedBg)?.color,
                }}
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <DiceBearAvatar
                    seed={seed}
                    size="xl"
                    style={selectedStyle}
                    className="w-32 h-32"
                  />
                </div>
                {selectedAccessory !== "none" && (
                  <span className="absolute -top-2 -right-2 text-3xl">
                    {ACCESSORIES.find(a => a.id === selectedAccessory)?.icon}
                  </span>
                )}
              </div>

              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={randomizeSeed}>
                  <Shuffle className="w-4 h-4 me-1" />
                  Randomize
                </Button>
                <Button size="sm" className="bg-moulna-gold hover:bg-moulna-gold-dark" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 me-1 animate-spin" /> : <Save className="w-4 h-4 me-1" />}
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Style: {AVATAR_STYLES.find(s => s.id === selectedStyle)?.name}</p>
                <p>Background: {BACKGROUNDS.find(b => b.id === selectedBg)?.name}</p>
                {selectedAccessory !== "none" && (
                  <p>Accessory: {ACCESSORIES.find(a => a.id === selectedAccessory)?.name}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Customization Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar Styles */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-moulna-gold" />
                Avatar Style
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {AVATAR_STYLES.map((style) => {
                  const isUnlocked = userLevel >= style.unlockLevel;
                  const isSelected = selectedStyle === style.id;
                  return (
                    <motion.button
                      key={style.id}
                      whileHover={isUnlocked ? { scale: 1.05 } : {}}
                      whileTap={isUnlocked ? { scale: 0.95 } : {}}
                      onClick={() => isUnlocked && setSelectedStyle(style.id)}
                      disabled={!isUnlocked}
                      className={cn(
                        "relative p-3 rounded-xl border-2 transition-all",
                        isSelected && isUnlocked && "border-moulna-gold bg-moulna-gold/10",
                        !isSelected && isUnlocked && "border-transparent hover:border-moulna-gold/50",
                        !isUnlocked && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {isUnlocked ? (
                          <DiceBearAvatar seed={style.id} size="sm" style={style.id} />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs font-medium truncate">{style.name}</p>
                      {!isUnlocked && (
                        <Badge variant="secondary" className="absolute -top-1 -right-1 text-[10px] px-1">
                          Lv.{style.unlockLevel}
                        </Badge>
                      )}
                      {style.premium && (
                        <Crown className="absolute top-1 right-1 w-4 h-4 text-yellow-500" />
                      )}
                      {isSelected && isUnlocked && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-moulna-gold flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Card>

            {/* Backgrounds */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-moulna-gold" />
                Background
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
                {BACKGROUNDS.map((bg) => {
                  const isUnlocked = userLevel >= bg.unlockLevel;
                  const isSelected = selectedBg === bg.id;
                  return (
                    <motion.button
                      key={bg.id}
                      whileHover={isUnlocked ? { scale: 1.1 } : {}}
                      whileTap={isUnlocked ? { scale: 0.9 } : {}}
                      onClick={() => isUnlocked && setSelectedBg(bg.id)}
                      disabled={!isUnlocked}
                      className={cn(
                        "relative aspect-square rounded-xl border-2 transition-all",
                        isSelected && isUnlocked && "border-moulna-gold ring-2 ring-moulna-gold/50",
                        !isSelected && isUnlocked && "border-transparent",
                        !isUnlocked && "opacity-50 cursor-not-allowed"
                      )}
                      style={{
                        background: bg.id === "none"
                          ? "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 10px 10px"
                          : bg.color,
                      }}
                    >
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {isSelected && isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      )}
                      {bg.premium && (
                        <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Unlock more backgrounds by leveling up
              </p>
            </Card>

            {/* Accessories */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-moulna-gold" />
                Accessories
              </h2>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {ACCESSORIES.map((acc) => {
                  const isUnlocked = userLevel >= acc.unlockLevel;
                  const isSelected = selectedAccessory === acc.id;
                  return (
                    <motion.button
                      key={acc.id}
                      whileHover={isUnlocked ? { scale: 1.1 } : {}}
                      whileTap={isUnlocked ? { scale: 0.9 } : {}}
                      onClick={() => isUnlocked && setSelectedAccessory(acc.id)}
                      disabled={!isUnlocked}
                      className={cn(
                        "relative p-3 rounded-xl border-2 transition-all",
                        isSelected && isUnlocked && "border-moulna-gold bg-moulna-gold/10",
                        !isSelected && isUnlocked && "border-muted hover:border-moulna-gold/50",
                        !isUnlocked && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span className="text-2xl block text-center">
                        {isUnlocked ? acc.icon : "🔒"}
                      </span>
                      <p className="text-xs mt-1 truncate">{acc.name}</p>
                      {!isUnlocked && (
                        <Badge variant="secondary" className="absolute -top-1 -right-1 text-[10px] px-1">
                          Lv.{acc.unlockLevel}
                        </Badge>
                      )}
                      {acc.premium && (
                        <Crown className="absolute top-0 right-0 w-3 h-3 text-yellow-500" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Card>

            {/* Level Up Prompt */}
            <Card className="p-6 bg-gradient-to-r from-moulna-gold/10 to-purple-500/10 border-moulna-gold/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-moulna-gold/20 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-moulna-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Unlock More Styles</h3>
                  <p className="text-sm text-muted-foreground">
                    Level up to unlock exclusive avatar styles, backgrounds, and accessories.
                    You&apos;re Level {userLevel} - keep earning XP!
                  </p>
                </div>
                <Button variant="outline">
                  View Challenges
                  <ChevronRight className="w-4 h-4 ms-1" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
}
