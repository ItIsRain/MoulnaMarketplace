"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Rocket, Sparkles, ArrowRight, X } from "lucide-react";
import type { ShopPlan } from "@/lib/types";

interface UpgradeBannerProps {
  currentPlan: ShopPlan;
  feature?: string;
  context?: "inline" | "modal" | "sidebar";
  dismissible?: boolean;
  className?: string;
}

const PLAN_BENEFITS: Record<string, { icon: React.ElementType; highlights: string[] }> = {
  growth: {
    icon: Rocket,
    highlights: [
      "30 active listings (vs 3)",
      "10 moments (vs 3)",
      "20% off all boosts",
      "Advanced analytics",
      "Coupon codes & flash sales",
    ],
  },
  pro: {
    icon: Crown,
    highlights: [
      "Unlimited listings & moments",
      "50% off all boosts",
      "Free monthly 7-day boost",
      "Homepage spotlight",
      "Verified Pro badge",
      "Priority search ranking",
    ],
  },
};

export function UpgradeBanner({ currentPlan, feature, context = "inline", dismissible = true, className }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  if (dismissed || currentPlan === "pro") return null;

  const targetPlan = currentPlan === "free" ? "growth" : "pro";
  const benefits = PLAN_BENEFITS[targetPlan];
  const PlanIcon = benefits.icon;
  const planLabel = targetPlan === "growth" ? "Growth" : "Pro";
  const price = targetPlan === "growth" ? "99" : "299";

  const handleUpgrade = async (promo?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/seller/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan, period: "monthly", promo }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  };

  if (context === "sidebar") {
    return (
      <Card className={cn("p-4 bg-gradient-to-br from-moulna-gold/10 to-amber-500/5 border-moulna-gold/20", className)}>
        <div className="flex items-center gap-2 mb-2">
          <PlanIcon className="w-4 h-4 text-moulna-gold" />
          <span className="text-sm font-semibold">Upgrade to {planLabel}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {feature ? `Unlock more ${feature} and` : "Get"} powerful tools to grow your shop.
        </p>
        <Badge className="bg-emerald-500 text-white text-[10px] mb-3">
          50% off first 3 months
        </Badge>
        <Button
          variant="gold"
          size="sm"
          className="w-full"
          onClick={() => handleUpgrade("launch3")}
          disabled={loading}
        >
          {loading ? "Loading..." : `AED ${price}/mo`}
          <ArrowRight className="w-3 h-3 ms-1" />
        </Button>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "relative overflow-hidden",
      context === "inline"
        ? "p-6 bg-gradient-to-r from-moulna-gold/10 via-amber-500/5 to-transparent border-moulna-gold/20"
        : "p-8",
      className
    )}>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-moulna-gold/20 flex items-center justify-center flex-shrink-0">
          <PlanIcon className="w-6 h-6 text-moulna-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">
              {feature
                ? `Want more ${feature}?`
                : `Upgrade to ${planLabel}`}
            </h3>
            <Badge className="bg-emerald-500 text-white text-[10px]">
              <Sparkles className="w-3 h-3 me-1" />
              50% off for 3 months
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {benefits.highlights.slice(0, 3).map((h) => (
              <span key={h} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-moulna-gold" />
                {h}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="gold"
            onClick={() => handleUpgrade("launch3")}
            disabled={loading}
          >
            {loading ? "Loading..." : (
              <>
                <span className="line-through text-white/60 me-1">AED {price}</span>
                AED {Math.round(parseInt(price) / 2)}/mo
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/pricing">Compare</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
