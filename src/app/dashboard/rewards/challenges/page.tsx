"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target, Flame, Clock, Gift, Star, Search,
  MessageSquare, Users, Sparkles, Trophy, Zap,
  Calendar, CheckCircle, ChevronRight, Timer
} from "lucide-react";

const DAILY_CHALLENGES = [
  {
    id: "daily-1",
    title: "Daily Visit",
    description: "Visit Moulna today",
    xp: 10,
    progress: { current: 1, total: 1 },
    completed: true,
    icon: Sparkles,
  },
  {
    id: "daily-2",
    title: "Listing Explorer",
    description: "Browse 5 different listings",
    xp: 15,
    progress: { current: 3, total: 5 },
    completed: false,
    icon: Search,
  },
  {
    id: "daily-3",
    title: "Show Some Love",
    description: "Save 3 listings",
    xp: 20,
    progress: { current: 1, total: 3 },
    completed: false,
    icon: Star,
  },
  {
    id: "daily-4",
    title: "Social Sharer",
    description: "Share a listing with a friend",
    xp: 25,
    progress: { current: 0, total: 1 },
    completed: false,
    icon: Users,
  },
];

const WEEKLY_CHALLENGES = [
  {
    id: "weekly-1",
    title: "Review Master",
    description: "Write 3 seller reviews this week",
    xp: 100,
    progress: { current: 2, total: 3 },
    completed: false,
    icon: MessageSquare,
    daysLeft: 4,
  },
  {
    id: "weekly-2",
    title: "Active Buyer",
    description: "Contact a seller this week",
    xp: 75,
    progress: { current: 1, total: 1 },
    completed: true,
    icon: MessageSquare,
    daysLeft: 4,
  },
  {
    id: "weekly-3",
    title: "Explorer",
    description: "Discover 5 new shops",
    xp: 80,
    progress: { current: 3, total: 5 },
    completed: false,
    icon: Target,
    daysLeft: 4,
  },
];

const SPECIAL_CHALLENGES = [
  {
    id: "special-1",
    title: "New Year Explorer",
    description: "Contact 5 sellers during the New Year event",
    xp: 500,
    progress: { current: 3, total: 5 },
    completed: false,
    icon: Gift,
    endsIn: "3 days",
    bonus: "Featured profile badge",
  },
  {
    id: "special-2",
    title: "Refer & Earn",
    description: "Invite a friend who joins Moulna",
    xp: 300,
    progress: { current: 0, total: 1 },
    completed: false,
    icon: Users,
    endsIn: "7 days",
    bonus: "Exclusive badge",
  },
];

export default function ChallengesPage() {
  const totalDailyXP = DAILY_CHALLENGES.reduce((sum, c) => sum + c.xp, 0);
  const earnedDailyXP = DAILY_CHALLENGES.filter(c => c.completed).reduce((sum, c) => sum + c.xp, 0);

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-7 h-7 text-moulna-gold" />
              Daily Challenges
            </h1>
            <p className="text-muted-foreground">
              Complete challenges to earn XP and rewards
            </p>
          </div>
          <Card className="px-4 py-2 flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-transparent">
            <Flame className="w-6 h-6 text-orange-500" />
            <div>
              <p className="text-lg font-bold">12 Day Streak</p>
              <p className="text-xs text-muted-foreground">Keep it going!</p>
            </div>
          </Card>
        </div>

        {/* Daily Progress */}
        <Card className="p-6 bg-gradient-to-r from-moulna-gold/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Daily Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Resets in 8h 32m</span>
            </div>
          </div>
          <Progress value={(earnedDailyXP / totalDailyXP) * 100} className="h-3 mb-2" />
          <div className="flex justify-between text-sm">
            <span>{earnedDailyXP} / {totalDailyXP} XP earned today</span>
            <span className="text-moulna-gold font-medium">
              {DAILY_CHALLENGES.filter(c => c.completed).length}/{DAILY_CHALLENGES.length} completed
            </span>
          </div>
        </Card>

        {/* Daily Challenges */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-moulna-gold" />
            Today&apos;s Challenges
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {DAILY_CHALLENGES.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "p-4 transition-all",
                  challenge.completed && "bg-green-50/50 border-green-200"
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      challenge.completed
                        ? "bg-green-100 text-green-600"
                        : "bg-moulna-gold/10 text-moulna-gold"
                    )}>
                      {challenge.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <challenge.icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <Badge variant={challenge.completed ? "default" : "secondary"}>
                          <Sparkles className="w-3 h-3 me-1" />
                          +{challenge.xp} XP
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {challenge.description}
                      </p>
                      {!challenge.completed && (
                        <>
                          <Progress
                            value={(challenge.progress.current / challenge.progress.total) * 100}
                            className="h-2 mb-1"
                          />
                          <p className="text-xs text-muted-foreground">
                            {challenge.progress.current} / {challenge.progress.total}
                          </p>
                        </>
                      )}
                      {challenge.completed && (
                        <p className="text-sm text-green-600 font-medium">
                          Completed!
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Weekly Challenges */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Weekly Challenges
            <Badge variant="outline" className="ms-auto">
              {WEEKLY_CHALLENGES[0].daysLeft} days left
            </Badge>
          </h2>
          <div className="space-y-4">
            {WEEKLY_CHALLENGES.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "p-4 transition-all",
                  challenge.completed && "bg-green-50/50 border-green-200"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      challenge.completed
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    )}>
                      {challenge.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <challenge.icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Sparkles className="w-3 h-3 me-1" />
                          +{challenge.xp} XP
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="text-end">
                      {challenge.completed ? (
                        <Badge className="bg-green-500">Done</Badge>
                      ) : (
                        <span className="text-sm font-medium">
                          {challenge.progress.current}/{challenge.progress.total}
                        </span>
                      )}
                    </div>
                  </div>
                  {!challenge.completed && (
                    <Progress
                      value={(challenge.progress.current / challenge.progress.total) * 100}
                      className="h-2 mt-3"
                    />
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Special Challenges */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-500" />
            Special Events
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {SPECIAL_CHALLENGES.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <challenge.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      <Clock className="w-3 h-3 me-1" />
                      {challenge.endsIn}
                    </Badge>
                  </div>

                  <Progress
                    value={(challenge.progress.current / challenge.progress.total) * 100}
                    className="h-2 mb-2"
                  />
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span>
                      {typeof challenge.progress.current === 'number' && challenge.progress.total > 100
                        ? `AED ${challenge.progress.current}`
                        : challenge.progress.current} / {typeof challenge.progress.total === 'number' && challenge.progress.total > 100
                        ? `AED ${challenge.progress.total}`
                        : challenge.progress.total}
                    </span>
                    <span className="text-purple-600 font-medium">+{challenge.xp} XP</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Bonus: {challenge.bonus}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
    </div>
  );
}
