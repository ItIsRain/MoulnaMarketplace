"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UpgradeBanner } from "@/components/subscription/UpgradeBanner";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Wallet, ChevronRight, Tag, Crown, Rocket, Store,
  Check, Loader2, Calendar, AlertCircle,
} from "lucide-react";

export default function SellerFinancesPage() {
  const { shop } = useAuthStore();
  const [subStatus, setSubStatus] = React.useState<{
    plan: string;
    periodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [cancelling, setCancelling] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/seller/subscribe")
      .then((r) => r.json())
      .then((data) => setSubStatus(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const plan = subStatus?.plan || shop?.plan || "free";
  const planLabel = plan === "free" ? "Starter" : plan === "growth" ? "Growth" : "Pro";
  const PlanIcon = plan === "pro" ? Crown : plan === "growth" ? Rocket : Store;
  const planColor = plan === "pro" ? "text-moulna-gold" : plan === "growth" ? "text-blue-500" : "text-muted-foreground";

  const handleCancel = async () => {
    if (!confirm("Cancel your subscription? You'll keep access until the end of your billing period.")) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/seller/subscribe", { method: "DELETE" });
      if (res.ok) {
        setSubStatus((prev) => prev ? { ...prev, cancelAtPeriodEnd: true } : prev);
      }
    } finally {
      setCancelling(false);
    }
  };

  const PLAN_FEATURES: Record<string, string[]> = {
    free: ["3 active listings", "3 moments", "Basic analytics", "Email support"],
    growth: ["30 active listings", "10 moments", "20% off boosts", "Advanced analytics", "Coupon codes", "Priority support"],
    pro: ["Unlimited listings & moments", "50% off boosts", "Free monthly boost", "Homepage spotlight", "Pro badge", "24/7 support"],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <Wallet className="w-6 h-6" />
          Plan & Billing
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing
        </p>
      </div>

      {/* Current Plan */}
      <Card className="p-6 border-moulna-gold/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-muted ${planColor}`}>
              <PlanIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-semibold">{planLabel} Plan</h2>
                {plan !== "free" && (
                  <Badge className="bg-moulna-gold text-white text-[10px]">Active</Badge>
                )}
              </div>
              {subStatus?.periodEnd && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {subStatus.cancelAtPeriodEnd ? "Access until" : "Renews"}{" "}
                  {new Date(subStatus.periodEnd).toLocaleDateString("en-AE", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              )}
            </div>
          </div>
          {plan !== "free" && !subStatus?.cancelAtPeriodEnd && (
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel Plan"}
            </Button>
          )}
        </div>

        {subStatus?.cancelAtPeriodEnd && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Your subscription will end on {new Date(subStatus.periodEnd!).toLocaleDateString("en-AE")}. You&apos;ll be downgraded to the Starter plan after that.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {PLAN_FEATURES[plan]?.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {plan !== "pro" && (
          <Button variant="gold" size="sm" className="w-full mt-4" asChild>
            <Link href="/pricing">
              Upgrade Plan <ChevronRight className="w-4 h-4 ms-1" />
            </Link>
          </Button>
        )}
      </Card>

      {/* Upgrade Banner */}
      {plan !== "pro" && (
        <UpgradeBanner currentPlan={plan as "free" | "growth" | "pro"} />
      )}

      {/* Info */}
      <Card className="p-4 bg-moulna-gold/5 border-moulna-gold/20">
        <p className="text-sm text-muted-foreground">
          Moulna is a listing platform. All transactions happen directly between you and the buyer.
          We don&apos;t process payments or take commissions on your sales.
        </p>
      </Card>
    </div>
  );
}
