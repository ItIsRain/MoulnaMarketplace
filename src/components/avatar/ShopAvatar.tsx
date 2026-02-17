"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { DiceBearAvatar } from "./DiceBearAvatar";

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
  "2xl": "w-24 h-24",
  "3xl": "w-32 h-32",
  "4xl": "w-40 h-40",
};

const imageSizes: Record<string, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  "2xl": 96,
  "3xl": 128,
  "4xl": 160,
};

interface ShopAvatarProps {
  logoUrl?: string | null;
  avatarSeed?: string;
  avatarStyle?: string;
  name?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}

export function ShopAvatar({
  logoUrl,
  avatarSeed,
  avatarStyle = "adventurer",
  name = "Shop",
  size = "md",
  className,
}: ShopAvatarProps) {
  if (logoUrl) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          "rounded-full overflow-hidden bg-white flex-shrink-0",
          className
        )}
      >
        <Image
          src={logoUrl}
          alt={name}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <DiceBearAvatar
      seed={avatarSeed || name}
      style={avatarStyle}
      size={size}
      className={className}
    />
  );
}
