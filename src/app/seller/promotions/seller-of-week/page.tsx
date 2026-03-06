"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AuctionCountdown } from "@/components/auction/AuctionCountdown";
import { BidHistory } from "@/components/auction/BidHistory";
import { StripeCardModal, type SavedCard } from "@/components/auction/StripeCardModal";
import {
  ArrowLeft, Trophy, Calendar, CheckCircle, Loader2,
  Sparkles, Eye, Star, Home, Gavel, Zap, Shield, Clock,
  Plus, Minus, AlertCircle
} from "lucide-react";

interface WeekSlot {
  weekStart: string;
  weekEnd: string;
  available: boolean;
  auctionId?: string;
  auctionStatus?: string;
  currentHighestBidFils?: number;
  totalBids?: number;
  closesAt?: string;
  buyNowPriceFils?: number;
}

interface AuctionConfig {
  minBidFils: number;
  bidIncrementFils: number;
  buyNowFils: number;
  closeHoursBefore: number;
  auctionEnabled: boolean;
}

interface AuctionState {
  id: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  currentHighestBidFils: number;
  totalBids: number;
  closesAt: string;
  minBidFils: number;
  bidIncrementFils: number;
  buyNowPriceFils: number;
}

interface RecentBid {
  amountFils: number;
  shopName: string;
  isBuyNow: boolean;
  createdAt: string;
}

interface MyBid {
  id: string;
  amountFils: number;
  status: string;
  isBuyNow: boolean;
  headline?: string;
  description?: string;
  createdAt: string;
}

export default function SellerOfWeekPage() {
  const router = useRouter();
  const [weeks, setWeeks] = React.useState<WeekSlot[]>([]);
  const [config, setConfig] = React.useState<AuctionConfig | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedWeek, setSelectedWeek] = React.useState<string | null>(null);

  // Auction detail state
  const [auctionState, setAuctionState] = React.useState<AuctionState | null>(null);
  const [recentBids, setRecentBids] = React.useState<RecentBid[]>([]);
  const [myBid, setMyBid] = React.useState<MyBid | null>(null);
  const [loadingAuction, setLoadingAuction] = React.useState(false);

  // Bid form
  const [bidAmount, setBidAmount] = React.useState(0);
  const [headline, setHeadline] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Stripe modal
  const [cardModalOpen, setCardModalOpen] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [cardModalLoading, setCardModalLoading] = React.useState(false);
  const [bidMode, setBidMode] = React.useState<"bid" | "buynow">("bid");
  const [savedCard, setSavedCard] = React.useState<SavedCard | null>(null);
  const [stripeCustomerId, setStripeCustomerId] = React.useState<string | null>(null);

  // Submission
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  // Fetch available weeks
  React.useEffect(() => {
    fetch("/api/ads/seller-of-week/availability")
      .then((res) => res.json())
      .then((data) => {
        setWeeks(data.weeks || []);
        if (data.auctionConfig) setConfig(data.auctionConfig);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch auction detail when week selected
  React.useEffect(() => {
    if (!selectedWeek) {
      setAuctionState(null);
      setRecentBids([]);
      setMyBid(null);
      return;
    }

    setLoadingAuction(true);
    fetch(`/api/ads/seller-of-week/auction/${selectedWeek}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.auction) {
          setAuctionState(data.auction);
          setRecentBids(data.recentBids || []);
          const bid = data.myBid || null;
          setMyBid(bid);

          // Pre-fill headline/description from previous bid
          if (bid?.headline) setHeadline(bid.headline);
          if (bid?.description) setDescription(bid.description);

          // Set default bid amount to next min
          setBidAmount(data.nextMinBidFils || config?.minBidFils || 9900);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAuction(false));
  }, [selectedWeek, config?.minBidFils]);

  const formatWeek = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AE", { month: "short", day: "numeric" });
  };

  const getAuctionBadge = (week: WeekSlot) => {
    if (!week.auctionStatus) return null;
    switch (week.auctionStatus) {
      case "open":
        return (
          <Badge variant="active" className="text-xs">
            Open {week.totalBids ? `· ${week.totalBids} bid${week.totalBids > 1 ? "s" : ""}` : ""}
          </Badge>
        );
      case "bought_out":
        return <Badge variant="gold" className="text-xs">Bought Out</Badge>;
      case "pending_approval":
        return <Badge variant="pending" className="text-xs">Pending</Badge>;
      case "completed":
        return <Badge variant="secondary" className="text-xs">Completed</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="text-xs">No Bids</Badge>;
      default:
        return null;
    }
  };

  const openCardModal = async (mode: "bid" | "buynow") => {
    if (!selectedWeek) return;
    setBidMode(mode);
    setCardModalLoading(true);
    setCardModalOpen(true);
    setError("");

    try {
      const res = await fetch("/api/ads/seller-of-week/bid/setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekStart: selectedWeek }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to prepare card form");
        setCardModalOpen(false);
        return;
      }

      setClientSecret(data.clientSecret);
      setStripeCustomerId(data.customerId || null);
      setSavedCard(data.savedCard || null);
    } catch {
      setError("Something went wrong. Please try again.");
      setCardModalOpen(false);
    } finally {
      setCardModalLoading(false);
    }
  };

  const submitBidOrBuyNow = async (paymentInfo: { setupIntentId?: string; paymentMethodId?: string; customerId?: string }) => {
    setCardModalOpen(false);
    setSubmitting(true);
    setError("");

    try {
      const endpoint =
        bidMode === "buynow"
          ? "/api/ads/seller-of-week/buy-now"
          : "/api/ads/seller-of-week/bid";

      const body =
        bidMode === "buynow"
          ? { weekStart: selectedWeek, ...paymentInfo, headline, description }
          : { weekStart: selectedWeek, amountFils: bidAmount, ...paymentInfo, headline, description };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit");
        return;
      }

      if (bidMode === "buynow" && data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        router.push("/seller/promotions/success?type=sotw-bid");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setClientSecret(null);
    }
  };

  const handleCardConfirmed = async (setupIntentId: string) => {
    await submitBidOrBuyNow({ setupIntentId });
  };

  const handleUseSavedCard = async (paymentMethodId: string, customerId: string) => {
    await submitBidOrBuyNow({ paymentMethodId, customerId });
  };

  const incrementBid = (amount: number) => {
    setBidAmount((prev) => prev + amount);
  };

  const nextMinBid = auctionState
    ? auctionState.currentHighestBidFils === 0
      ? auctionState.minBidFils
      : auctionState.currentHighestBidFils + auctionState.bidIncrementFils
    : config?.minBidFils || 9900;

  const canBid =
    auctionState?.status === "open" &&
    bidAmount >= nextMinBid &&
    headline.trim().length > 0 &&
    description.trim().length > 0 &&
    !submitting;

  const canBuyNow =
    auctionState?.status === "open" &&
    headline.trim().length > 0 &&
    description.trim().length > 0 &&
    (auctionState?.currentHighestBidFils ?? 0) < (auctionState?.buyNowPriceFils ?? 0) &&
    !submitting;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/seller/promotions">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Seller of the Week</h1>
          <p className="text-muted-foreground">
            Bid for your shop to be featured on the Moulna homepage
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* What's Included */}
          <Card className="p-6 bg-gradient-to-br from-moulna-gold/5 to-amber-50/50 border-moulna-gold/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-moulna-gold/10">
                <Trophy className="w-8 h-8 text-moulna-gold" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Homepage Feature for 1 Week</h2>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-moulna-gold" />
                    <span>Featured on homepage banner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>Impression &amp; click tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>Custom headline &amp; description</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple-500" />
                    <span>&quot;Seller of the Week&quot; badge</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <p className="text-sm">
                    <span className="font-medium">Starting from</span>{" "}
                    <span className="text-lg font-bold text-moulna-gold">
                      {formatAED(config?.minBidFils || 9900)}
                    </span>
                  </p>
                  <span className="text-muted-foreground">|</span>
                  <p className="text-sm">
                    <span className="font-medium">Buy Now</span>{" "}
                    <span className="text-lg font-bold text-amber-600">
                      {formatAED(config?.buyNowFils || 79900)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Week Selection */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Choose Your Week
            </h2>
            {loading ? (
              <div className="py-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {weeks.map((week) => {
                  const isOpen = week.auctionStatus === "open" && week.available;
                  const isClosed = !week.available;

                  return (
                    <div
                      key={week.weekStart}
                      onClick={() => isOpen && setSelectedWeek(week.weekStart)}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all",
                        isClosed && "opacity-50 cursor-not-allowed bg-muted/50",
                        isOpen && "cursor-pointer hover:border-moulna-gold/50",
                        selectedWeek === week.weekStart
                          ? "border-moulna-gold bg-moulna-gold/5"
                          : "border-muted"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {formatWeek(week.weekStart)} — {formatWeek(week.weekEnd)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {week.currentHighestBidFils && week.currentHighestBidFils > 0 ? (
                              <span className="text-xs text-moulna-gold font-medium">
                                Highest: {formatAED(week.currentHighestBidFils)}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                No bids yet
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {selectedWeek === week.weekStart ? (
                            <CheckCircle className="w-5 h-5 text-moulna-gold" />
                          ) : (
                            getAuctionBadge(week)
                          )}
                          {week.closesAt && isOpen && (
                            <AuctionCountdown closesAt={week.closesAt} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Auction Panel */}
          {selectedWeek && (
            <>
              {loadingAuction ? (
                <Card className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                </Card>
              ) : auctionState ? (
                <>
                  {/* Current Highest Bid + Countdown */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Highest Bid</p>
                        <p className="text-3xl font-bold text-moulna-gold">
                          {auctionState.currentHighestBidFils > 0
                            ? formatAED(auctionState.currentHighestBidFils)
                            : "No bids yet"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {auctionState.totalBids} total bid{auctionState.totalBids !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="text-sm text-muted-foreground mb-1">Auction closes in</p>
                        <AuctionCountdown closesAt={auctionState.closesAt} />
                      </div>
                    </div>

                    {/* My bid status */}
                    {myBid && (
                      <div className={cn(
                        "p-3 rounded-lg text-sm",
                        myBid.status === "active" && "bg-green-50 text-green-800 border border-green-200",
                        myBid.status === "pending_approval" && "bg-amber-50 text-amber-800 border border-amber-200",
                        myBid.status === "outbid" && "bg-red-50 text-red-800 border border-red-200",
                      )}>
                        {myBid.status === "active" && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>You&apos;re the highest bidder at {formatAED(myBid.amountFils)}</span>
                          </div>
                        )}
                        {myBid.status === "pending_approval" && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Your winning bid ({formatAED(myBid.amountFils)}) is pending admin approval</span>
                          </div>
                        )}
                        {myBid.status === "outbid" && (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>You&apos;ve been outbid! Place a higher bid to reclaim your spot.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>

                  {/* Customize Your Feature */}
                  <Card className="p-6">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Customize Your Feature
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Fill in your headline and description before placing a bid.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Headline <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="e.g., Award-winning Arabic Calligraphy"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          maxLength={60}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {60 - headline.length} characters left.
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Tell visitors what makes your shop special..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          maxLength={200}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {200 - description.length} characters left.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Bid History */}
                  <Card className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Gavel className="w-5 h-5" />
                      Bid History
                    </h3>
                    <BidHistory bids={recentBids} />
                  </Card>

                  {/* Bid Form */}
                  {auctionState.status === "open" && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Gavel className="w-5 h-5" />
                        Place Your Bid
                      </h3>

                      <div className="space-y-4">
                        {/* Amount input with increment buttons */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Bid Amount (min {formatAED(nextMinBid)})
                          </label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setBidAmount(Math.max(nextMinBid, bidAmount - 2500))}
                              disabled={bidAmount <= nextMinBid}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={(bidAmount / 100).toFixed(2)}
                              onChange={(e) => {
                                const fils = Math.round(Number(e.target.value) * 100);
                                setBidAmount(Math.max(nextMinBid, fils));
                              }}
                              className="text-center text-lg font-bold flex-1"
                              min={(nextMinBid / 100).toFixed(2)}
                              step="0.01"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => incrementBid(2500)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {[2500, 5000, 10000].map((inc) => (
                              <Button
                                key={inc}
                                variant="outline"
                                size="sm"
                                onClick={() => incrementBid(inc)}
                                className="text-xs"
                              >
                                +{formatAED(inc)}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {error && (
                          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            className="flex-1 bg-moulna-gold hover:bg-moulna-gold-dark"
                            onClick={() => openCardModal("bid")}
                            disabled={!canBid}
                          >
                            {submitting && bidMode === "bid" ? (
                              <>
                                <Loader2 className="w-4 h-4 me-2 animate-spin" />
                                Placing Bid...
                              </>
                            ) : (
                              <>
                                <Gavel className="w-4 h-4 me-2" />
                                Place Bid — {formatAED(bidAmount)}
                              </>
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            className="flex-1 border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-200 hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-amber-900 dark:hover:text-amber-100"
                            onClick={() => openCardModal("buynow")}
                            disabled={!canBuyNow}
                          >
                            {submitting && bidMode === "buynow" ? (
                              <>
                                <Loader2 className="w-4 h-4 me-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 me-2" />
                                Buy Now — {formatAED(auctionState.buyNowPriceFils)}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </>
              ) : null}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">How it works</h3>
            <div className="space-y-4">
              {[
                { step: 1, text: "Choose an available week" },
                { step: 2, text: "Place a bid or use Buy Now" },
                { step: 3, text: "Save your card securely (not charged yet)" },
                { step: 4, text: "Auction closes 48h before the week starts" },
                { step: 5, text: "Winner is approved by admin, then charged" },
                { step: 6, text: "Your shop appears on the homepage!" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-moulna-gold/10 flex items-center justify-center text-xs font-bold text-moulna-gold flex-shrink-0">
                    {item.step}
                  </div>
                  <p className="text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-700" />
              <h3 className="font-semibold text-green-900">Safe Bidding</h3>
            </div>
            <ul className="text-sm text-green-800 space-y-2">
              <li>Your card is NOT charged when bidding</li>
              <li>Only the winner is charged after admin approval</li>
              <li>Card details secured by Stripe</li>
              <li>Minimum bid increment: {formatAED(config?.bidIncrementFils || 2500)}</li>
            </ul>
          </Card>

          <Card className="p-6 bg-moulna-charcoal dark:bg-moulna-charcoal-dark border-moulna-charcoal-light/30">
            <h3 className="font-semibold text-white mb-2">Why become Seller of the Week?</h3>
            <ul className="text-sm text-white/70 space-y-2">
              <li>Thousands of homepage views per week</li>
              <li>Build brand awareness and trust</li>
              <li>Drive traffic directly to your shop</li>
              <li>Stand out from the competition</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Stripe Card Modal */}
      <StripeCardModal
        open={cardModalOpen}
        onClose={() => {
          setCardModalOpen(false);
          setClientSecret(null);
        }}
        clientSecret={clientSecret}
        onConfirmed={handleCardConfirmed}
        onUseSavedCard={handleUseSavedCard}
        savedCard={savedCard}
        customerId={stripeCustomerId}
        loading={cardModalLoading}
      />
    </div>
  );
}
