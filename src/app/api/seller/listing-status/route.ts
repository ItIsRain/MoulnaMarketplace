import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Plan-specific limits and perks
const PLAN_CONFIG = {
  free: {
    listingLimit: 3,
    boostDiscountPct: 0,
    freeBoostDaysPerMonth: 0,
    freeListingsPerMonth: 0,
  },
  growth: {
    listingLimit: 30,
    boostDiscountPct: 20,
    freeBoostDaysPerMonth: 0,
    freeListingsPerMonth: 10,
  },
  pro: {
    listingLimit: -1, // unlimited
    boostDiscountPct: 50,
    freeBoostDaysPerMonth: 7,
    freeListingsPerMonth: -1, // unlimited
  },
} as const;

type PlanName = keyof typeof PLAN_CONFIG;

// GET /api/seller/listing-status — returns seller's listing count, plan-aware limits, pricing
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Get seller's shop (includes plan)
  const { data: shop } = await admin
    .from("shops")
    .select("id, plan")
    .eq("owner_id", user.id)
    .single();

  const plan: PlanName = (shop?.plan as PlanName) || "free";
  const planConfig = PLAN_CONFIG[plan];

  // Count seller's non-draft products (all non-draft count permanently)
  const { count: activeListingCount } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .neq("status", "draft");

  // Fetch all needed platform settings in one query
  const { data: settingsRows } = await admin
    .from("platform_settings")
    .select("key, value")
    .in("key", [
      "free_listing_limit",
      "listing_fee_fils",
      "boost_price_per_day_fils",
      "sotw_price_per_week_fils",
      "listing_boost_bundle_discount_pct",
      "listing_full_bundle_discount_pct",
    ]);

  const settings: Record<string, number> = {};
  for (const row of settingsRows || []) {
    settings[row.key] = Number(row.value);
  }

  // Plan-aware listing limit (override the global setting with plan-specific limit)
  const listingLimit = planConfig.listingLimit === -1
    ? 999999
    : planConfig.listingLimit;
  const count = activeListingCount ?? 0;
  const freeRemaining = Math.max(0, listingLimit - count);

  // Plan-aware boost discount (stacks with bundle discount)
  const planBoostDiscountPct = planConfig.boostDiscountPct;

  // SOTW slot availability (next 8 weeks)
  const today = new Date();
  const dayOfWeek = today.getUTCDay();
  const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const weekStarts: string[] = [];

  for (let i = 0; i < 8; i++) {
    const monday = new Date(today);
    monday.setUTCDate(today.getUTCDate() + daysUntilNextMonday + i * 7);
    weekStarts.push(monday.toISOString().split("T")[0]);
  }

  const { data: booked } = await admin
    .from("seller_of_week")
    .select("week_start")
    .in("week_start", weekStarts)
    .in("status", ["pending", "active"]);

  const bookedCount = booked?.length ?? 0;
  const sotwSlotsAvailable = 8 - bookedCount;

  // Social proof: count paid listings in last 7 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: recentPaidListings } = await admin
    .from("ad_payments")
    .select("id", { count: "exact", head: true })
    .eq("ad_type", "listing_fee")
    .eq("status", "completed")
    .gte("created_at", weekAgo);

  return NextResponse.json({
    activeListingCount: count,
    freeListingLimit: listingLimit,
    freeRemaining,
    requiresPayment: plan === "free" && count >= listingLimit,
    plan,
    planConfig: {
      listingLimit: planConfig.listingLimit,
      boostDiscountPct: planConfig.boostDiscountPct,
      freeBoostDaysPerMonth: planConfig.freeBoostDaysPerMonth,
      freeListingsPerMonth: planConfig.freeListingsPerMonth,
    },
    pricing: {
      listingFeeFils: settings.listing_fee_fils ?? 500,
      boostPricePerDayFils: settings.boost_price_per_day_fils ?? 1500,
      sotwPricePerWeekFils: settings.sotw_price_per_week_fils ?? 19900,
      bundleDiscountPct: settings.listing_boost_bundle_discount_pct ?? 20,
      fullBundleDiscountPct: settings.listing_full_bundle_discount_pct ?? 30,
      planBoostDiscountPct,
    },
    sotwSlotsAvailable,
    recentPaidListings: recentPaidListings ?? 0,
  });
}
