"use client";

import * as React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  Rocket,
  Trophy,
  Lock,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Package,
  Crown,
  Users,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ListingStatus {
  activeListingCount: number;
  freeListingLimit: number;
  freeRemaining: number;
  requiresPayment: boolean;
  pricing: {
    listingFeeFils: number;
    boostPricePerDayFils: number;
    sotwPricePerWeekFils: number;
    bundleDiscountPct: number;
    fullBundleDiscountPct: number;
  };
  sotwSlotsAvailable: number;
  recentPaidListings: number;
}

interface DraftProduct {
  id: string;
  title: string;
  priceFils: number;
  images: string[];
  status: string;
  category?: string;
}

interface WeekSlot {
  weekStart: string;
  weekEnd: string;
  available: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BOOST_DURATIONS = [
  { days: 3, label: "3 Days" },
  { days: 7, label: "7 Days", popular: true },
  { days: 14, label: "14 Days" },
  { days: 30, label: "30 Days" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatWeekDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AE", { month: "short", day: "numeric" });
}

function filsToAed(fils: number): string {
  return (fils / 100).toFixed(2);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ActivateListingPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  // ---- Data states ----
  const [listingStatus, setListingStatus] = React.useState<ListingStatus | null>(null);
  const [product, setProduct] = React.useState<DraftProduct | null>(null);
  const [sotwWeeks, setSotwWeeks] = React.useState<WeekSlot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  // ---- Selection states ----
  const [addBoost, setAddBoost] = React.useState(false);
  const [boostDays, setBoostDays] = React.useState(7);
  const [addSotw, setAddSotw] = React.useState(false);
  const [sotwWeekStart, setSotwWeekStart] = React.useState<string>("");
  const [boostExpanded, setBoostExpanded] = React.useState(false);
  const [sotwExpanded, setSotwExpanded] = React.useState(false);

  // ---- Checkout state ----
  const [submitting, setSubmitting] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState("");

  // ---- Fetch all data in parallel ----
  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [statusRes, productsRes, sotwRes] = await Promise.all([
          fetch("/api/seller/listing-status"),
          fetch(`/api/seller/products?status=draft`),
          fetch("/api/ads/seller-of-week/availability"),
        ]);

        if (!statusRes.ok) throw new Error("Failed to load listing status");

        const statusData: ListingStatus = await statusRes.json();
        const productsData = await productsRes.json();
        const sotwData = await sotwRes.json();

        setListingStatus(statusData);

        // Find the specific product
        const found = (productsData.products || []).find(
          (p: DraftProduct) => p.id === productId
        );
        if (!found) {
          setError("Product not found. It may have already been activated.");
          setLoading(false);
          return;
        }
        setProduct(found);

        // SOTW availability
        const availableWeeks = (sotwData.weeks || []).filter(
          (w: WeekSlot) => w.available
        );
        setSotwWeeks(availableWeeks);
        if (availableWeeks.length > 0) {
          setSotwWeekStart(availableWeeks[0].weekStart);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong loading data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [productId]);

  // ---- Pricing calculations ----
  const pricing = listingStatus?.pricing;

  const listingFeeFils = pricing?.listingFeeFils ?? 0;

  const boostOriginalFils = (pricing?.boostPricePerDayFils ?? 0) * boostDays;
  const sotwOriginalFils = pricing?.sotwPricePerWeekFils ?? 0;

  // Discount logic
  const hasBoost = addBoost;
  const hasSotw = addSotw;
  const hasFullBundle = hasBoost && hasSotw;

  const boostDiscountPct = hasFullBundle
    ? (pricing?.fullBundleDiscountPct ?? 0)
    : hasBoost
    ? (pricing?.bundleDiscountPct ?? 0)
    : 0;

  const sotwDiscountPct = hasFullBundle
    ? (pricing?.fullBundleDiscountPct ?? 0)
    : 0;

  const boostFinalFils = Math.round(
    boostOriginalFils * (1 - boostDiscountPct / 100)
  );
  const sotwFinalFils = Math.round(
    sotwOriginalFils * (1 - sotwDiscountPct / 100)
  );

  const subtotalFils =
    listingFeeFils +
    (hasBoost ? boostFinalFils : 0) +
    (hasSotw ? sotwFinalFils : 0);

  const totalSavingsFils =
    (hasBoost ? boostOriginalFils - boostFinalFils : 0) +
    (hasSotw ? sotwOriginalFils - sotwFinalFils : 0);

  const totalOriginalFils =
    listingFeeFils +
    (hasBoost ? boostOriginalFils : 0) +
    (hasSotw ? sotwOriginalFils : 0);

  const savingsPercentage =
    totalSavingsFils > 0 && totalOriginalFils > 0
      ? Math.round((totalSavingsFils / totalOriginalFils) * 100)
      : 0;

  // ---- Checkout handler ----
  const handleCheckout = async () => {
    setSubmitting(true);
    setCheckoutError("");

    try {
      const body: Record<string, unknown> = { productId };
      if (addBoost) {
        body.addBoost = { durationDays: boostDays };
      }
      if (addSotw && sotwWeekStart) {
        body.addSotw = { weekStart: sotwWeekStart };
      }

      const res = await fetch("/api/seller/listing-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setCheckoutError(data.error || "Failed to create checkout session.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setCheckoutError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
          <p className="text-muted-foreground">Preparing your listing...</p>
        </motion.div>
      </div>
    );
  }

  // ---- Error state ----
  if (error || !product || !listingStatus) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">
              Unable to Load
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "Could not load product or listing data."}
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/seller/products")}
            >
              Back to Listings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableSotwCount = sotwWeeks.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold mb-1 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-moulna-gold" />
          Activate Your Listing
        </h1>
        <p className="text-muted-foreground">
          Publish and optionally boost your listing for maximum visibility
        </p>
      </motion.div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============================================================ */}
        {/* LEFT COLUMN - Order Builder */}
        {/* ============================================================ */}
        <div className="lg:col-span-2 space-y-5">
          {/* ---- 1. Free Tier Exhausted Banner ---- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">
                      You&apos;ve used all {listingStatus.freeListingLimit} free
                      listings — great progress!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Publish this listing for just{" "}
                      <span className="font-semibold text-foreground">
                        {formatAED(listingFeeFils)}
                      </span>
                    </p>

                    {/* Progress bar */}
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (listingStatus.activeListingCount /
                              listingStatus.freeListingLimit) *
                              100,
                            100
                          )}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {listingStatus.activeListingCount} /{" "}
                      {listingStatus.freeListingLimit} free listings used
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ---- 2. Product Preview Mini-Card ---- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  {product.images?.[0] ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="draft" className="text-[10px]">
                        Draft
                      </Badge>
                      {product.category && (
                        <span className="text-xs text-muted-foreground">
                          {product.category}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold truncate">{product.title}</h3>
                    <p className="text-sm text-moulna-gold font-medium">
                      {formatAED(product.priceFils)}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-sm text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Ready to activate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ---- 3. Listing Fee (Required) ---- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-emerald-500/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        Listing Activation Fee
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Required to publish your listing
                      </p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-bold">
                    {formatAED(listingFeeFils)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ---- 4. Add-On: Product Boost ---- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className={cn(
                "transition-all duration-300",
                addBoost && "border-moulna-gold/40 shadow-[0_0_15px_rgba(199,163,77,0.08)]"
              )}
            >
              <CardContent className="p-5">
                {/* Header with checkbox */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between"
                  onClick={() => {
                    setAddBoost(!addBoost);
                    if (!addBoost) setBoostExpanded(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        addBoost
                          ? "bg-moulna-gold border-moulna-gold"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {addBoost && (
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-moulna-gold" />
                        <h3 className="font-semibold text-sm">
                          Product Boost
                        </h3>
                        <Badge variant="gold" className="text-[10px]">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Get up to 7x more views with priority placement
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {addBoost && (
                      <span className="font-display text-sm font-bold text-moulna-gold">
                        +{formatAED(boostFinalFils)}
                      </span>
                    )}
                    {addBoost ? (
                      boostExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )
                    ) : null}
                  </div>
                </button>

                {/* Expand toggle when checked */}
                {addBoost && (
                  <button
                    type="button"
                    className="w-full pt-1"
                    onClick={() => setBoostExpanded(!boostExpanded)}
                    aria-label={boostExpanded ? "Collapse boost details" : "Expand boost details"}
                  >
                    <span className="sr-only">
                      {boostExpanded ? "Collapse" : "Expand"}
                    </span>
                  </button>
                )}

                {/* Expanded content */}
                <AnimatePresence>
                  {addBoost && boostExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-5 mt-4 border-t border-border space-y-5">
                        {/* Duration picker */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2.5 uppercase tracking-wide">
                            Select Duration
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {BOOST_DURATIONS.map((d) => (
                              <button
                                key={d.days}
                                type="button"
                                onClick={() => setBoostDays(d.days)}
                                className={cn(
                                  "relative px-3 py-3 rounded-xl border-2 text-center transition-all duration-200",
                                  boostDays === d.days
                                    ? "border-moulna-gold bg-moulna-gold/10"
                                    : "border-border hover:border-moulna-gold/30"
                                )}
                              >
                                {d.popular && (
                                  <Badge
                                    variant="gold"
                                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] px-2"
                                  >
                                    Best Value
                                  </Badge>
                                )}
                                <span
                                  className={cn(
                                    "block text-sm font-bold",
                                    boostDays === d.days
                                      ? "text-moulna-gold"
                                      : ""
                                  )}
                                >
                                  {d.label}
                                </span>
                                <span className="block text-xs text-muted-foreground mt-0.5">
                                  {formatAED(
                                    (pricing?.boostPricePerDayFils ?? 0) *
                                      d.days
                                  )}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* View estimate bars */}
                        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Estimated Weekly Views
                          </p>
                          <div className="space-y-2.5">
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">
                                  Without boost
                                </span>
                                <span className="text-muted-foreground">
                                  ~50 views/week
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-3">
                                <div
                                  className="h-full bg-gray-400 rounded-full"
                                  style={{ width: "10%" }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-semibold text-moulna-gold">
                                  With boost
                                </span>
                                <span className="font-semibold text-moulna-gold">
                                  ~350-500 views/week
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-3">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-moulna-gold-light to-moulna-gold rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: "75%" }}
                                  transition={{
                                    duration: 0.8,
                                    delay: 0.2,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                          <TrendingUp className="w-4 h-4 flex-shrink-0" />
                          <span>
                            87% of boosted listings get inquiries within 7 days
                          </span>
                        </div>

                        {/* Price with anchoring */}
                        {boostDiscountPct > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Sparkles className="w-4 h-4 text-moulna-gold flex-shrink-0" />
                            <span className="line-through text-muted-foreground">
                              {formatAED(boostOriginalFils)}
                            </span>
                            <span className="font-bold text-moulna-gold">
                              {formatAED(boostFinalFils)}
                            </span>
                            <Badge
                              variant="success"
                              className="text-[10px] ml-1"
                            >
                              Save {formatAED(boostOriginalFils - boostFinalFils)} with
                              bundle!
                            </Badge>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* ---- 5. Add-On: Seller of the Week ---- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card
              className={cn(
                "transition-all duration-300",
                addSotw && "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.08)]"
              )}
            >
              <CardContent className="p-5">
                {/* Header with checkbox */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between"
                  onClick={() => {
                    setAddSotw(!addSotw);
                    if (!addSotw) setSotwExpanded(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        addSotw
                          ? "bg-amber-500 border-amber-500"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {addSotw && (
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <h3 className="font-semibold text-sm">
                          Seller of the Week
                        </h3>
                        <Badge variant="sponsored" className="text-[10px]">
                          Premium
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Homepage spotlight with premium seller badge
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {addSotw && (
                      <span className="font-display text-sm font-bold text-amber-600">
                        +{formatAED(sotwFinalFils)}
                      </span>
                    )}
                    {addSotw ? (
                      sotwExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )
                    ) : null}
                  </div>
                </button>

                {/* Expand toggle when checked */}
                {addSotw && (
                  <button
                    type="button"
                    className="w-full pt-1"
                    onClick={() => setSotwExpanded(!sotwExpanded)}
                    aria-label={sotwExpanded ? "Collapse SOTW details" : "Expand SOTW details"}
                  >
                    <span className="sr-only">
                      {sotwExpanded ? "Collapse" : "Expand"}
                    </span>
                  </button>
                )}

                {/* Expanded content */}
                <AnimatePresence>
                  {addSotw && sotwExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-5 mt-4 border-t border-border space-y-5">
                        {/* Week selector */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2.5 uppercase tracking-wide">
                            Select Your Week
                          </p>

                          {sotwWeeks.length === 0 ? (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                              No slots available at this time
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {sotwWeeks.slice(0, 8).map((week) => (
                                <button
                                  key={week.weekStart}
                                  type="button"
                                  onClick={() =>
                                    setSotwWeekStart(week.weekStart)
                                  }
                                  className={cn(
                                    "px-3 py-3 rounded-xl border-2 text-center transition-all duration-200",
                                    sotwWeekStart === week.weekStart
                                      ? "border-amber-500 bg-amber-500/10"
                                      : "border-border hover:border-amber-500/30"
                                  )}
                                >
                                  <span className="block text-xs font-medium">
                                    {formatWeekDate(week.weekStart)}
                                  </span>
                                  <span className="block text-[10px] text-muted-foreground mt-0.5">
                                    to {formatWeekDate(week.weekEnd)}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Scarcity */}
                        {availableSotwCount > 0 && (
                          <div
                            className={cn(
                              "flex items-center gap-2 text-sm",
                              availableSotwCount <= 2
                                ? "text-red-500 font-semibold"
                                : "text-amber-600"
                            )}
                          >
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>
                              {availableSotwCount <= 2
                                ? `Only ${availableSotwCount} slot${availableSotwCount === 1 ? "" : "s"} left in the next 8 weeks!`
                                : `${availableSotwCount} slots available in the next 8 weeks`}
                            </span>
                          </div>
                        )}

                        {/* Social proof */}
                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                          <Crown className="w-4 h-4 flex-shrink-0" />
                          <span>
                            Sellers of the Week see 3x follower growth
                          </span>
                        </div>

                        {/* Price with anchoring when bundled */}
                        {sotwDiscountPct > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <span className="line-through text-muted-foreground">
                              {formatAED(sotwOriginalFils)}
                            </span>
                            <span className="font-bold text-amber-600">
                              {formatAED(sotwFinalFils)}
                            </span>
                            <Badge
                              variant="success"
                              className="text-[10px] ml-1"
                            >
                              Save {formatAED(sotwOriginalFils - sotwFinalFils)} with
                              full bundle!
                            </Badge>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN - Sticky Order Summary */}
        {/* ============================================================ */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-moulna-gold" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Line Items */}
                  <div className="space-y-3">
                    {/* Listing Fee */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Listing Fee</span>
                      </div>
                      <span className="font-medium">
                        {formatAED(listingFeeFils)}
                      </span>
                    </div>

                    {/* Boost */}
                    {hasBoost && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Rocket className="w-3.5 h-3.5 text-moulna-gold" />
                          <span>Boost ({boostDays} days)</span>
                        </div>
                        <div className="text-right">
                          {boostDiscountPct > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <span className="line-through text-muted-foreground text-xs">
                                {formatAED(boostOriginalFils)}
                              </span>
                              <span className="font-medium text-moulna-gold">
                                {formatAED(boostFinalFils)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium">
                              {formatAED(boostOriginalFils)}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* SOTW */}
                    {hasSotw && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          <span>Seller of the Week</span>
                        </div>
                        <div className="text-right">
                          {sotwDiscountPct > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <span className="line-through text-muted-foreground text-xs">
                                {formatAED(sotwOriginalFils)}
                              </span>
                              <span className="font-medium text-amber-600">
                                {formatAED(sotwFinalFils)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium">
                              {formatAED(sotwOriginalFils)}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border" />

                  {/* Savings */}
                  {totalSavingsFils > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between text-sm bg-emerald-500/10 rounded-lg px-3 py-2"
                    >
                      <span className="text-emerald-600 font-medium">
                        You save
                      </span>
                      <span className="text-emerald-600 font-bold">
                        {formatAED(totalSavingsFils)} ({savingsPercentage}%)
                      </span>
                    </motion.div>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-display text-2xl font-bold">
                      AED {filsToAed(subtotalFils)}
                    </span>
                  </div>

                  {/* Checkout error */}
                  {checkoutError && (
                    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{checkoutError}</span>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    variant="gold"
                    size="xl"
                    className="w-full text-base font-bold"
                    disabled={submitting}
                    onClick={handleCheckout}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Publish & Pay — AED {filsToAed(subtotalFils)}
                      </>
                    )}
                  </Button>

                  {/* Trust signals */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Instant activation</span>
                    </div>
                  </div>

                  {/* Support note */}
                  <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                    Not satisfied? Contact support within 30 days.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BOTTOM SOCIAL PROOF BAR */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl py-3 px-4">
          <Users className="w-4 h-4 text-moulna-gold" />
          <span>
            <span className="font-semibold text-foreground">
              {listingStatus.recentPaidListings}
            </span>{" "}
            sellers published paid listings this week
          </span>
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}
