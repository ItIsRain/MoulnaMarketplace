"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DailyChallenge as DailyChallengeType } from "@/lib/types";

interface DailyChallengeProps {
  challenge: DailyChallengeType;
  onClick?: () => void;
  className?: string;
}

export function DailyChallenge({
  challenge,
  onClick,
  className,
}: DailyChallengeProps) {
  const progress = challenge.target
    ? ((challenge.progress ?? 0) / challenge.target) * 100
    : challenge.completed ? 100 : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        hover={!!onClick}
        onClick={onClick}
        className={cn(
          "p-4 transition-all",
          challenge.completed && "bg-emerald-50 dark:bg-emerald-950/30",
          className
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon/Checkbox */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl",
            challenge.completed
              ? "bg-emerald-500 text-white"
              : "bg-muted"
          )}>
            {challenge.completed ? (
              <Check className="w-5 h-5" />
            ) : (
              challenge.icon
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-medium",
              challenge.completed && "line-through text-muted-foreground"
            )}>
              {challenge.task}
            </p>

            {/* Progress bar if applicable */}
            {challenge.target && !challenge.completed && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{challenge.progress ?? 0}/{challenge.target}</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}
          </div>

          {/* XP Reward */}
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
            challenge.completed
              ? "bg-emerald-600 text-white"
              : "bg-moulna-gold text-white"
          )}>
            <Sparkles className="w-3 h-3" />
            {challenge.completed ? "Earned" : `+${challenge.xp}`}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Panel showing all daily challenges
interface DailyChallengePanelProps {
  challenges: DailyChallengeType[];
  refreshTime?: string;
  className?: string;
}

export function DailyChallengePanel({
  challenges,
  refreshTime = "8h 23m",
  className,
}: DailyChallengePanelProps) {
  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges.reduce((sum, c) => sum + c.xp, 0);

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold">Daily Challenges</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {challenges.length} completed
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Refreshes in {refreshTime}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <Progress
          value={(completedCount / challenges.length) * 100}
          className="h-2"
          indicatorClassName="bg-gradient-to-r from-moulna-gold to-moulna-gold-light"
        />
      </div>

      {/* Challenges */}
      <div className="space-y-3">
        {challenges.map((challenge) => (
          <DailyChallenge
            key={challenge.id}
            challenge={challenge}
          />
        ))}
      </div>

      {/* Total XP */}
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Complete all to earn
        </span>
        <div className="flex items-center gap-1 text-moulna-gold font-bold">
          <Sparkles className="w-4 h-4" />
          <span>{totalXP} XP</span>
        </div>
      </div>
    </Card>
  );
}
