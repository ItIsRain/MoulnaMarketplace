"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Users, Gift, Copy, Check, Share2, Sparkles,
  Trophy, Target, Twitter, MessageCircle, Mail,
  ChevronRight
} from "lucide-react";

const REFERRAL_STATS = {
  totalReferrals: 12,
  successfulReferrals: 8,
  pendingReferrals: 4,
  totalXpEarned: 800,
  totalCreditsEarned: 24000, // in fils (AED 240)
};

const REFERRAL_TIERS = [
  { count: 1, reward: 100, label: "First Friend" },
  { count: 5, reward: 150, label: "Connector" },
  { count: 10, reward: 200, label: "Ambassador" },
  { count: 25, reward: 300, label: "Champion" },
  { count: 50, reward: 500, label: "Legend" },
];

const REFERRED_FRIENDS = [
  {
    id: "ref_1",
    name: "Fatima M.",
    avatar: "fatima-m",
    level: 4,
    status: "active",
    joinedAt: "2024-02-01",
    xpEarned: 100,
  },
  {
    id: "ref_2",
    name: "Ahmed K.",
    avatar: "ahmed-k",
    level: 7,
    status: "active",
    joinedAt: "2024-01-25",
    xpEarned: 100,
  },
  {
    id: "ref_3",
    name: "Sara A.",
    avatar: "sara-a",
    level: 5,
    status: "active",
    joinedAt: "2024-01-20",
    xpEarned: 100,
  },
  {
    id: "ref_4",
    name: "Khalid R.",
    avatar: "khalid-r",
    level: 3,
    status: "active",
    joinedAt: "2024-01-15",
    xpEarned: 100,
  },
  {
    id: "ref_5",
    name: "Noura S.",
    avatar: "noura-s",
    level: 2,
    status: "pending",
    joinedAt: "2024-02-10",
    xpEarned: 0,
  },
];

export default function ReferralsPage() {
  const [copied, setCopied] = React.useState(false);
  const referralCode = "SARAH2024";
  const referralLink = `https://moulna.ae/join?ref=${referralCode}`;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTierIndex = REFERRAL_TIERS.findIndex(
    tier => REFERRAL_STATS.successfulReferrals < tier.count
  );
  const currentTier = currentTierIndex > 0
    ? REFERRAL_TIERS[currentTierIndex - 1]
    : null;
  const nextTier = REFERRAL_TIERS[currentTierIndex] || REFERRAL_TIERS[REFERRAL_TIERS.length - 1];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <Users className="w-6 h-6" />
          Refer Friends
        </h1>
        <p className="text-muted-foreground">
          Invite friends and earn rewards together
        </p>
      </div>

      {/* Hero Card */}
      <Card className="p-8 bg-gradient-to-br from-moulna-gold/20 via-transparent to-moulna-charcoal/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-moulna-gold/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                Give AED 30, Get 100 XP!
              </h2>
              <p className="text-muted-foreground mb-4">
                Share your referral link with friends. When they complete their first deal,
                they get AED 30 off and you earn 100 XP!
              </p>

              {/* Referral Link */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={referralLink}
                    readOnly
                    className="pe-12 font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => copyToClipboard(referralLink)}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Share via:</span>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 me-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" size="sm">
                  <Twitter className="w-4 h-4 me-2" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 me-2" />
                  Email
                </Button>
              </div>
            </div>

            {/* Referral Code */}
            <div className="text-center p-6 rounded-xl bg-white dark:bg-moulna-charcoal border-2 border-moulna-gold">
              <p className="text-sm text-muted-foreground mb-1">Your Code</p>
              <p className="text-3xl font-bold font-mono text-moulna-gold">
                {referralCode}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => copyToClipboard(referralCode)}
              >
                <Copy className="w-4 h-4 me-2" />
                Copy Code
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Referrals", value: REFERRAL_STATS.totalReferrals, icon: Users, color: "text-blue-500" },
          { label: "Successful", value: REFERRAL_STATS.successfulReferrals, icon: Check, color: "text-emerald-500" },
          { label: "XP Earned", value: `+${REFERRAL_STATS.totalXpEarned}`, icon: Sparkles, color: "text-moulna-gold" },
          { label: "Credits Earned", value: `AED ${(REFERRAL_STATS.totalCreditsEarned / 100).toFixed(0)}`, icon: Gift, color: "text-purple-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 text-center">
              <div className={cn("p-2 rounded-lg bg-muted inline-block mb-2", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Referral Progress */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="font-semibold mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-moulna-gold" />
            Referral Milestones
          </h2>

          <div className="space-y-4">
            {REFERRAL_TIERS.map((tier, index) => {
              const isCompleted = REFERRAL_STATS.successfulReferrals >= tier.count;
              const isCurrent = index === currentTierIndex;
              const progress = isCurrent
                ? (REFERRAL_STATS.successfulReferrals / tier.count) * 100
                : isCompleted ? 100 : 0;

              return (
                <div key={tier.count} className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold",
                    isCompleted
                      ? "bg-moulna-gold text-white"
                      : isCurrent
                      ? "bg-moulna-gold/20 text-moulna-gold border-2 border-moulna-gold"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {tier.count}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium",
                          isCompleted && "text-moulna-gold"
                        )}>
                          {tier.label}
                        </span>
                        {isCompleted && (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            <Check className="w-3 h-3 me-1" />
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        +{tier.reward} XP
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Next Milestone */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Next Milestone
          </h2>

          <div className="text-center py-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-moulna-gold/20 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-moulna-gold">
                {nextTier.count - REFERRAL_STATS.successfulReferrals}
              </span>
            </div>
            <p className="text-lg font-semibold">{nextTier.label}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Refer {nextTier.count - REFERRAL_STATS.successfulReferrals} more friends
            </p>
            <Badge className="bg-moulna-gold text-white">
              <Sparkles className="w-3 h-3 me-1" />
              +{nextTier.reward} XP Reward
            </Badge>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              Your progress: {REFERRAL_STATS.successfulReferrals}/{nextTier.count}
            </p>
            <Progress
              value={(REFERRAL_STATS.successfulReferrals / nextTier.count) * 100}
              className="h-2 mt-2"
            />
          </div>
        </Card>
      </div>

      {/* Referred Friends */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Referrals
          </h2>
          <Button variant="outline" size="sm">
            View All <ChevronRight className="w-4 h-4 ms-1" />
          </Button>
        </div>

        <div className="space-y-4">
          {REFERRED_FRIENDS.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <DiceBearAvatar seed={friend.avatar} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{friend.name}</span>
                    <LevelBadge level={friend.level} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Joined {new Date(friend.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-end">
                {friend.status === "active" ? (
                  <>
                    <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                    <p className="text-sm text-moulna-gold mt-1">
                      <Sparkles className="w-3 h-3 inline me-1" />
                      +{friend.xpEarned} XP
                    </p>
                  </>
                ) : (
                  <Badge variant="outline" className="text-yellow-600">Pending</Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
