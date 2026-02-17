import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// POST /api/seller/listing-checkout — create Stripe session for paid listing with optional upsells
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Check KYC approval
  const { data: profile } = await admin
    .from("profiles")
    .select("kyc_status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.kyc_status !== "approved") {
    return NextResponse.json({ error: "KYC verification required" }, { status: 403 });
  }

  const body = await request.json();
  const { productId, addBoost, addSotw } = body as {
    productId: string;
    addBoost?: { durationDays: number };
    addSotw?: { weekStart: string };
  };

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  // Verify product exists, belongs to seller, is draft
  const { data: product } = await admin
    .from("products")
    .select("id, title, owner_id, status")
    .eq("id", productId)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.owner_id !== user.id) {
    return NextResponse.json({ error: "Product does not belong to you" }, { status: 403 });
  }

  if (product.status !== "draft") {
    return NextResponse.json({ error: "Product must be a draft to activate via checkout" }, { status: 400 });
  }

  // Verify seller has exceeded free limit
  const { count: nonDraftCount } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .neq("status", "draft");

  // Read all pricing from platform_settings
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

  const freeLimit = settings.free_listing_limit ?? 3;
  const count = nonDraftCount ?? 0;

  // Get seller's shop plan
  const { data: shop } = await admin
    .from("shops")
    .select("id, plan")
    .eq("owner_id", user.id)
    .single();

  const shopPlan = (shop?.plan as string) || "free";

  // Plan-aware listing limits
  const planLimits: Record<string, number> = { free: 3, growth: 30, pro: 999999 };
  const planBoostDiscount: Record<string, number> = { free: 0, growth: 20, pro: 50 };
  const effectiveLimit = planLimits[shopPlan] ?? freeLimit;

  if (count < effectiveLimit) {
    return NextResponse.json(
      { error: "You still have free listings available. Publish directly instead." },
      { status: 400 }
    );
  }

  const listingFeeFils = settings.listing_fee_fils ?? 500;
  const boostPricePerDayFils = settings.boost_price_per_day_fils ?? 1500;
  const sotwPricePerWeekFils = settings.sotw_price_per_week_fils ?? 19900;
  const bundleDiscountPct = settings.listing_boost_bundle_discount_pct ?? 20;
  const fullBundleDiscountPct = settings.listing_full_bundle_discount_pct ?? 30;
  const shopPlanBoostDiscountPct = planBoostDiscount[shopPlan] ?? 0;

  // Build line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let totalFils = 0;

  // 1. Listing Fee (always)
  lineItems.push({
    price_data: {
      currency: "aed",
      product_data: {
        name: "Listing Fee",
        description: `Publish "${product.title}" on Moulna Marketplace`,
      },
      unit_amount: listingFeeFils,
    },
    quantity: 1,
  });
  totalFils += listingFeeFils;

  // Determine discount tier (plan discount vs bundle discount — use whichever is higher)
  const hasBoost = addBoost && [3, 7, 14, 30].includes(addBoost.durationDays);
  const hasSotw = !!addSotw?.weekStart;
  const bundleDiscount = hasBoost && hasSotw ? fullBundleDiscountPct : hasBoost ? bundleDiscountPct : 0;
  const discountPct = Math.max(bundleDiscount, shopPlanBoostDiscountPct);

  // Metadata to store what was purchased
  const metadataItems: Record<string, unknown> = { listing: true };

  // 2. Product Boost (if selected)
  if (hasBoost) {
    const boostBaseFils = boostPricePerDayFils * addBoost.durationDays;
    const boostDiscountedFils = Math.round(boostBaseFils * (1 - discountPct / 100));

    lineItems.push({
      price_data: {
        currency: "aed",
        product_data: {
          name: `Product Boost — ${addBoost.durationDays} days`,
          description: discountPct > 0
            ? `Boost "${product.title}" (${discountPct}% bundle discount applied)`
            : `Boost "${product.title}" to the top of explore & search`,
        },
        unit_amount: boostDiscountedFils,
      },
      quantity: 1,
    });
    totalFils += boostDiscountedFils;
    metadataItems.boost = {
      durationDays: addBoost.durationDays,
      originalFils: boostBaseFils,
      discountedFils: boostDiscountedFils,
      discountPct,
    };
  }

  // 3. SOTW (if selected)
  if (hasSotw) {
    const sotwDiscountedFils = hasBoost
      ? Math.round(sotwPricePerWeekFils * (1 - fullBundleDiscountPct / 100))
      : sotwPricePerWeekFils;

    lineItems.push({
      price_data: {
        currency: "aed",
        product_data: {
          name: "Seller of the Week",
          description: `Featured seller starting ${addSotw.weekStart}${
            hasBoost ? ` (${fullBundleDiscountPct}% full bundle discount)` : ""
          }`,
        },
        unit_amount: sotwDiscountedFils,
      },
      quantity: 1,
    });
    totalFils += sotwDiscountedFils;
    metadataItems.sotw = {
      weekStart: addSotw.weekStart,
      originalFils: sotwPricePerWeekFils,
      discountedFils: sotwDiscountedFils,
    };
  }

  // Create ad_payments record
  const { data: adPayment, error: paymentError } = await admin
    .from("ad_payments")
    .insert({
      seller_id: user.id,
      ad_type: "listing_fee",
      amount_fils: totalFils,
      status: "pending",
      metadata: {
        product_id: productId,
        items: metadataItems,
        discounts: { bundleDiscountPct: discountPct, fullBundleDiscountPct },
      },
    })
    .select("id")
    .single();

  if (paymentError || !adPayment) {
    console.error("Failed to create ad_payment:", paymentError);
    return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 });
  }

  // Create product_boosts record if boost selected (pending)
  if (hasBoost) {
    const boostBaseFils = boostPricePerDayFils * addBoost.durationDays;
    const boostDiscountedFils = Math.round(boostBaseFils * (1 - discountPct / 100));

    await admin.from("product_boosts").insert({
      product_id: productId,
      seller_id: user.id,
      payment_id: adPayment.id,
      duration_days: addBoost.durationDays,
      price_per_day_fils: boostPricePerDayFils,
      total_fils: boostDiscountedFils,
      status: "pending",
    });
  }

  // Create seller_of_week record if SOTW selected (pending)
  if (hasSotw) {
    const weekStart = addSotw.weekStart;
    const weekEnd = new Date(new Date(weekStart).getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Get seller's shop
    const { data: shop } = await admin
      .from("shops")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (shop) {
      await admin.from("seller_of_week").insert({
        seller_id: user.id,
        shop_id: shop.id,
        payment_id: adPayment.id,
        week_start: weekStart,
        week_end: weekEnd,
        status: "pending",
      });
    }
  }

  // Create Stripe Checkout Session
  const stripe = getStripe();
  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    metadata: {
      ad_payment_id: adPayment.id,
      ad_type: "listing_fee",
    },
    success_url: `${origin}/seller/promotions/success?session_id={CHECKOUT_SESSION_ID}&type=listing`,
    cancel_url: `${origin}/seller/products/${productId}/activate`,
  });

  // Store checkout session ID
  await admin
    .from("ad_payments")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", adPayment.id);

  return NextResponse.json({ url: session.url });
}
