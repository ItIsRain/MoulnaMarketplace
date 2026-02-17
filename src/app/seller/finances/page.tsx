"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronRight, Tag } from "lucide-react";

export default function SellerFinancesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <Wallet className="w-6 h-6" />
          Finances
        </h1>
        <p className="text-muted-foreground">
          Manage your listing plans and subscriptions
        </p>
      </div>

      {/* Current Plan */}
      <Card className="p-6 border-moulna-gold/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-moulna-gold/10 text-moulna-gold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Current Plan</h2>
            <p className="text-xs text-muted-foreground">Free tier</p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-muted/50 text-center">
          <p className="text-2xl font-bold text-moulna-gold">Free</p>
          <p className="text-sm text-muted-foreground mt-1">
            List up to 10 items for free
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
          <Link href="/seller/listings">
            View Listing Plans <ChevronRight className="w-4 h-4 ms-1" />
          </Link>
        </Button>
      </Card>

      {/* Info */}
      <Card className="p-4 bg-moulna-gold/5 border-moulna-gold/20">
        <p className="text-sm text-muted-foreground">
          Moulna is a listing platform. All transactions happen directly between you and the buyer.
          We don&apos;t process payments or take commissions.
        </p>
      </Card>
    </div>
  );
}
