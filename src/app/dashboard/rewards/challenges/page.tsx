"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target, Flame, Clock,
  Sparkles, Trophy, Zap,
  Calendar, CheckCircle, Timer
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  target: number;
  progress: number;
  completed: boolean;
  completedAt: string | null;
  bonusReward: string | null;
  endsAt: string | null;
}

export default function ChallengesPage() {
  const [loading, setLoading] = React.useState(true);
  const [streakDays, setStreakDays] = React.useState(0);
  const [dailyChallenges, setDailyChallenges] = React.useState<Challenge[]>([]);
  const [weeklyChallenges, setWeeklyChallenges] = React.useState<Challenge[]>([]);
  const [specialChallenges, setSpecialChallenges] = React.useState<Challenge[]>([]);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/gamification").then((r) => r.ok ? r.json() : null),
      fetch("/api/challenges?period=daily&audience=buyer").then((r) => r.ok ? r.json() : null),
      fetch("/api/challenges?period=weekly&audience=buyer").then((r) => r.ok ? r.json() : null),
      fetch("/api/challenges?period=special&audience=buyer").then((r) => r.ok ? r.json() : null),
    ])
      .then(([overview, daily, weekly, special]) => {
        if (overview) {
          setStreakDays(overview.streakDays || 0);
        }
        if (daily?.challenges) {
          setDailyChallenges(daily.challenges);
        }
        if (weekly?.challenges) {
          setWeeklyChallenges(weekly.challenges);
        }
        if (special?.challenges) {
          setSpecialChallenges(special.challenges);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const daysLeft = 7 - new Date().getDay();

  const totalDailyXP = dailyChallenges.reduce((sum, c) => sum + c.xp, 0);
  const earnedDailyXP = dailyChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.xp, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Target className="w-8 h-8 animate-pulse text-muted-foreground" />
      </div>
    );
  }

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
              Complete challenges to earn XP and level up
            </p>
          </div>
          <Card className="px-4 py-2 flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-transparent">
            <Flame className="w-6 h-6 text-orange-500" />
            <div>
              <p className="text-lg font-bold">{streakDays} Day Streak</p>
              <p className="text-xs text-muted-foreground">{streakDays > 0 ? "Keep it going!" : "Start your streak!"}</p>
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
          <Progress value={totalDailyXP > 0 ? (earnedDailyXP / totalDailyXP) * 100 : 0} className="h-3 mb-2" />
          <div className="flex justify-between text-sm">
            <span>{earnedDailyXP} / {totalDailyXP} XP earned today</span>
            <span className="text-moulna-gold font-medium">
              {dailyChallenges.filter(c => c.completed).length}/{dailyChallenges.length} completed
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
            {dailyChallenges.map((challenge, index) => (
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
                        <span className="text-xl">{challenge.icon}</span>
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
                            value={challenge.target > 0 ? (challenge.progress / challenge.target) * 100 : 0}
                            className="h-2 mb-1"
                          />
                          <p className="text-xs text-muted-foreground">
                            {challenge.progress} / {challenge.target}
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
              {daysLeft} days left
            </Badge>
          </h2>
          <div className="space-y-4">
            {weeklyChallenges.map((challenge, index) => (
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
                        <span className="text-xl">{challenge.icon}</span>
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
                          {challenge.progress}/{challenge.target}
                        </span>
                      )}
                    </div>
                  </div>
                  {!challenge.completed && (
                    <Progress
                      value={challenge.target > 0 ? (challenge.progress / challenge.target) * 100 : 0}
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
            {specialChallenges.map((challenge, index) => (
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
                        <span className="text-xl">{challenge.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                    </div>
                    {challenge.endsAt && (
                      <Badge variant="outline" className="bg-white">
                        <Clock className="w-3 h-3 me-1" />
                        {challenge.endsAt}
                      </Badge>
                    )}
                  </div>

                  <Progress
                    value={challenge.target > 0 ? (challenge.progress / challenge.target) * 100 : 0}
                    className="h-2 mb-2"
                  />
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span>
                      {challenge.target > 100
                        ? `AED ${challenge.progress}`
                        : challenge.progress} / {challenge.target > 100
                        ? `AED ${challenge.target}`
                        : challenge.target}
                    </span>
                    <span className="text-purple-600 font-medium">+{challenge.xp} XP</span>
                  </div>

                </Card>
              </motion.div>
            ))}
          </div>
        </section>
    </div>
  );
}
