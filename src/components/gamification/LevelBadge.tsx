"use client";

import * as React from "react";
import { cn, getLevelFromXP } from "@/lib/utils";
import { Sparkles, Crown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LevelBadgeProps {
  level?: number;
  xp?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showTitle?: boolean;
  className?: string;
}

const sizeStyles = {
  xs: "text-[10px] px-1 py-0.5",
  sm: "text-xs px-1.5 py-0.5",
  md: "text-sm px-2 py-1",
  lg: "text-base px-3 py-1.5",
};

const iconSizes = {
  xs: "w-2.5 h-2.5",
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function LevelBadge({
  level: providedLevel,
  xp,
  size = "md",
  showTitle = false,
  className,
}: LevelBadgeProps) {
  const levelInfo = xp !== undefined
    ? getLevelFromXP(xp)
    : { level: providedLevel ?? 1, title: "Newcomer", color: "#94a3b8", special: false, xpForNext: 0, progress: 0 };

  const isMaxLevel = levelInfo.level === 10;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full font-bold text-white transition-all",
            levelInfo.special && "badge-glow",
            sizeStyles[size],
            className
          )}
          style={{ backgroundColor: levelInfo.color }}
        >
          {isMaxLevel ? (
            <Crown className={iconSizes[size]} />
          ) : levelInfo.special ? (
            <Sparkles className={iconSizes[size]} />
          ) : null}
          <span>Lv.{levelInfo.level}</span>
          {showTitle && (
            <>
              <span className="opacity-70">·</span>
              <span className="font-medium">{levelInfo.title}</span>
            </>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-semibold">{levelInfo.title}</p>
        {xp !== undefined && (
          <p className="text-muted-foreground">
            {levelInfo.level < 10
              ? `${levelInfo.xpForNext} XP to next level`
              : "Maximum level reached!"}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
