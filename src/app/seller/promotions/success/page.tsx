"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, Trophy, ArrowRight, BarChart3, Package, Plus } from "lucide-react";
import confetti from "canvas-confetti";

export default function PromotionSuccessPage() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-[40vh]"><CheckCircle className="w-8 h-8 animate-pulse text-moulna-gold" /></div>}>
      <PromotionSuccessContent />
    </React.Suspense>
  );
}

function PromotionSuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isBoost = type === "boost";
  const isSotw = type === "sotw";
  const isListing = type === "listing";
  const isSotwBid = type === "sotw-bid";
  const isSotwBuyNow = type === "sotw-buynow";

  React.useEffect(() => {
    // Fire confetti on mount
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#D4A853", "#F59E0B", "#FBBF24"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#D4A853", "#F59E0B", "#FBBF24"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-lg w-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>

        {isBoost && (
          <>
            <p className="text-muted-foreground mb-6">
              Your product boost is now active! It will appear at the top of explore
              and search results with a &quot;Sponsored&quot; badge.
            </p>

            <div className="bg-moulna-gold/5 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-moulna-gold mb-2">
                <Rocket className="w-5 h-5" />
                <span className="font-semibold">Boost Activated</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Track your boost&apos;s performance on the promotions dashboard
              </p>
            </div>
          </>
        )}

        {isSotw && (
          <>
            <p className="text-muted-foreground mb-6">
              You&apos;ve secured your Seller of the Week spot! Your shop will be
              featured prominently on the Moulna homepage during your selected week.
            </p>

            <div className="bg-amber-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Seller of the Week Reserved</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your feature will automatically go live at the start of your week
              </p>
            </div>
          </>
        )}

        {isListing && (
          <>
            <p className="text-muted-foreground mb-6">
              Your listing is now live on Moulna Marketplace! Buyers can find it in explore and search.
            </p>

            <div className="bg-emerald-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                <Package className="w-5 h-5" />
                <span className="font-semibold">Listing Published</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your listing is active and visible to buyers
              </p>
            </div>
          </>
        )}

        {isSotwBid && (
          <>
            <p className="text-muted-foreground mb-6">
              Your bid has been placed successfully! You&apos;ll be notified if
              you win when the auction closes.
            </p>

            <div className="bg-amber-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Bid Placed</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your card will only be charged if you win and are approved
              </p>
            </div>
          </>
        )}

        {isSotwBuyNow && (
          <>
            <p className="text-muted-foreground mb-6">
              Your Buy Now has been confirmed! Your Seller of the Week spot is
              pending admin approval.
            </p>

            <div className="bg-amber-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Buy Now — Pending Approval</span>
              </div>
              <p className="text-sm text-muted-foreground">
                An admin will review and approve your purchase shortly
              </p>
            </div>
          </>
        )}

        {!isBoost && !isSotw && !isListing && !isSotwBid && !isSotwBuyNow && (
          <p className="text-muted-foreground mb-6">
            Your payment has been processed successfully.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isListing ? (
            <>
              <Button className="bg-moulna-gold hover:bg-moulna-gold-dark gap-2" asChild>
                <Link href="/seller/products">
                  <Package className="w-4 h-4" />
                  View Your Listings
                </Link>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/seller/products/new">
                  <Plus className="w-4 h-4" />
                  Add Another Listing
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button className="bg-moulna-gold hover:bg-moulna-gold-dark gap-2" asChild>
                <Link href="/seller/promotions">
                  <BarChart3 className="w-4 h-4" />
                  View Promotions Dashboard
                </Link>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/seller">
                  Back to Seller Hub <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
