"use client";

import * as React from "react";
import { cn, getDiceBearAvatar, getLevelFromXP } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DiceBearAvatarProps {
  seed: string;
  style?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
  showLevelRing?: boolean;
  xp?: number;
  level?: number;
  backgroundColor?: string;
}

const sizeClasses = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-24 w-24",
  "3xl": "h-32 w-32",
  "4xl": "h-40 w-40",
};

const ringWidths = {
  xs: 1,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 3,
  "2xl": 4,
  "3xl": 5,
  "4xl": 6,
};

export function DiceBearAvatar({
  seed,
  style = "adventurer",
  size = "md",
  className,
  showLevelRing = false,
  xp,
  level: providedLevel,
  backgroundColor,
}: DiceBearAvatarProps) {
  const avatarUrl = getDiceBearAvatar(seed, style, backgroundColor, 256);

  const levelInfo = xp !== undefined ? getLevelFromXP(xp) : null;
  const level = providedLevel ?? levelInfo?.level ?? 1;
  const progress = levelInfo?.progress ?? 0;

  const ringWidth = ringWidths[size];
  const progressDegrees = (progress / 100) * 360;

  return (
    <div className={cn("relative inline-flex", className)}>
      {showLevelRing && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            padding: ringWidth,
            background: `conic-gradient(from 0deg, var(--moulna-gold) ${progressDegrees}deg, var(--muted) ${progressDegrees}deg)`,
            WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ringWidth}px), #000 calc(100% - ${ringWidth}px))`,
            mask: `radial-gradient(farthest-side, transparent calc(100% - ${ringWidth}px), #000 calc(100% - ${ringWidth}px))`,
          }}
        />
      )}
      <Avatar className={cn(sizeClasses[size], showLevelRing && `m-[${ringWidth}px]`)}>
        <AvatarImage src={avatarUrl} alt={`Avatar for ${seed}`} />
        <AvatarFallback className="bg-moulna-gold-light text-moulna-charcoal font-semibold">
          {seed.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

// Avatar with level badge underneath
interface AvatarWithLevelProps extends DiceBearAvatarProps {
  showLevel?: boolean;
}

export function AvatarWithLevel({
  showLevel = true,
  xp,
  ...props
}: AvatarWithLevelProps) {
  const levelInfo = xp !== undefined ? getLevelFromXP(xp) : null;

  return (
    <div className="flex flex-col items-center gap-1">
      <DiceBearAvatar {...props} xp={xp} showLevelRing />
      {showLevel && levelInfo && (
        <div
          className="px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: levelInfo.color }}
        >
          Lv.{levelInfo.level}
        </div>
      )}
    </div>
  );
}
