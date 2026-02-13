"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, getLevelFromXP, formatNumber } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface XPBarProps {
  xp: number;
  showLabels?: boolean;
  showXPCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export function XPBar({
  xp,
  showLabels = true,
  showXPCount = true,
  size = "md",
  className,
}: XPBarProps) {
  const levelInfo = getLevelFromXP(xp);

  return (
    <div className={cn("w-full", className)}>
      {showLabels && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: levelInfo.color }}
            >
              Lv.{levelInfo.level}
            </span>
            <span className="text-sm font-medium text-foreground">
              {levelInfo.title}
            </span>
            {levelInfo.special && (
              <Sparkles className="w-4 h-4 text-moulna-gold animate-pulse" />
            )}
          </div>
          {showXPCount && (
            <span className="text-sm text-muted-foreground">
              {formatNumber(xp)} XP
            </span>
          )}
        </div>
      )}

      <div className={cn("xp-bar", sizeStyles[size])}>
        <motion.div
          className="xp-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${levelInfo.progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {showLabels && levelInfo.level < 10 && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {formatNumber(levelInfo.xpForNext)} XP to next level
        </p>
      )}
    </div>
  );
}

// Compact XP indicator for headers/cards
interface XPIndicatorProps {
  xp: number;
  className?: string;
}

export function XPIndicator({ xp, className }: XPIndicatorProps) {
  const levelInfo = getLevelFromXP(xp);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: levelInfo.color }}
      >
        <span>Lv.{levelInfo.level}</span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <Sparkles className="w-3.5 h-3.5 text-moulna-gold" />
        <span className="font-medium text-moulna-gold">{formatNumber(xp)}</span>
      </div>
    </div>
  );
}
