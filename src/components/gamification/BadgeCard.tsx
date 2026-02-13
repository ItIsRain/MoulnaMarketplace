"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lock, Check } from "lucide-react";
import type { Badge } from "@/lib/types";

interface BadgeCardProps {
  badge: Badge;
  earned?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
}

const sizeStyles = {
  sm: {
    container: "w-16 h-16",
    icon: "text-2xl",
    padding: "p-2",
  },
  md: {
    container: "w-20 h-20",
    icon: "text-3xl",
    padding: "p-3",
  },
  lg: {
    container: "w-24 h-24",
    icon: "text-4xl",
    padding: "p-4",
  },
};

export function BadgeCard({
  badge,
  earned = false,
  size = "md",
  onClick,
  className,
}: BadgeCardProps) {
  const styles = sizeStyles[size];

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-full transition-all border-4",
        styles.container,
        styles.padding,
        earned
          ? "bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-amber-300 shadow-lg shadow-amber-500/30"
          : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 grayscale opacity-60",
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <span className={cn(styles.icon, !earned && "opacity-50")}>
        {earned ? badge.icon : "❓"}
      </span>

      {earned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md border-2 border-white"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}

      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full">
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      )}
    </motion.button>
  );
}

// Badge with name underneath
interface BadgeWithNameProps extends BadgeCardProps {
  showName?: boolean;
}

export function BadgeWithName({
  badge,
  earned = false,
  size = "md",
  showName = true,
  onClick,
  className,
}: BadgeWithNameProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <BadgeCard
        badge={badge}
        earned={earned}
        size={size}
        onClick={onClick}
      />
      {showName && (
        <div className="text-center">
          <p className={cn(
            "text-xs font-medium",
            earned ? "text-foreground" : "text-muted-foreground"
          )}>
            {badge.name}
          </p>
        </div>
      )}
    </div>
  );
}

// Horizontal badge row for showcasing top badges
interface BadgeShowcaseProps {
  badges: Badge[];
  maxVisible?: number;
  size?: "sm" | "md";
  className?: string;
}

export function BadgeShowcase({
  badges,
  maxVisible = 5,
  size = "sm",
  className,
}: BadgeShowcaseProps) {
  const visibleBadges = badges.slice(0, maxVisible);
  const remaining = badges.length - maxVisible;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {visibleBadges.map((badge) => (
        <div
          key={badge.id}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-2 border-amber-300 flex items-center justify-center shadow-md"
          title={badge.name}
        >
          <span className="text-sm">{badge.icon}</span>
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
          +{remaining}
        </div>
      )}
    </div>
  );
}
