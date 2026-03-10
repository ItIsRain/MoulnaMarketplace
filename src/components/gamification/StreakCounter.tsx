"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StreakCounterProps {
  days: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: {
    container: "gap-0.5",
    icon: "w-4 h-4",
    text: "text-sm",
  },
  md: {
    container: "gap-1",
    icon: "w-5 h-5",
    text: "text-base",
  },
  lg: {
    container: "gap-1.5",
    icon: "w-6 h-6",
    text: "text-lg",
  },
};

export function StreakCounter({
  days,
  size = "md",
  showLabel = false,
  className,
}: StreakCounterProps) {
  const styles = sizeStyles[size];
  const isHot = days >= 7;
  const isOnFire = days >= 30;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className={cn(
            "inline-flex items-center font-bold text-orange-500",
            styles.container,
            className
          )}
          animate={isHot ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <motion.div
            className={cn("streak-fire", styles.icon)}
            animate={isOnFire ? {
              rotate: [-5, 5, -5],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            <Flame className={cn(styles.icon, "fill-current")} />
          </motion.div>
          <span className={styles.text}>{days}</span>
          {showLabel && (
            <span className="font-medium opacity-80">
              {days === 1 ? "day" : "days"}
            </span>
          )}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center">
          <p className="font-semibold">
            {days} Day Streak! {isOnFire ? "🔥" : isHot ? "⚡" : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            Keep logging in to maintain your streak
          </p>
          {days >= 7 && days < 30 && (
            <p className="text-xs text-moulna-gold mt-1">
              {30 - days} days until Monthly Master badge!
            </p>
          )}
          {days >= 30 && days < 100 && (
            <p className="text-xs text-moulna-gold mt-1">
              {100 - days} days until Centurion badge!
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Streak card for dashboard
interface StreakCardProps {
  loginStreak: number;
  purchaseStreak?: number;
  reviewStreak?: number;
  className?: string;
}

export function StreakCard({
  loginStreak,
  purchaseStreak = 0,
  reviewStreak = 0,
  className,
}: StreakCardProps) {
  return (
    <div className={cn("p-4 rounded-xl bg-orange-500 text-white shadow-sm", className)}>
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Flame className="w-4 h-4" />
        Your Streaks
      </h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/90">Login Streak</span>
          <StreakCounter days={loginStreak} size="sm" className="text-white" />
        </div>
        {purchaseStreak > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/90">Deal Streak</span>
            <span className="text-sm font-semibold">{purchaseStreak} weeks</span>
          </div>
        )}
        {reviewStreak > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/90">Review Streak</span>
            <span className="text-sm font-semibold">{reviewStreak} weeks</span>
          </div>
        )}
      </div>
    </div>
  );
}
