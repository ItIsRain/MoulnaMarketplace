import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { sendNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Check KYC + seller role
  const { data: profile } = await admin
    .from("profiles")
    .select("kyc_status, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.kyc_status !== "approved") {
    return NextResponse.json({ error: "KYC verification required" }, { status: 403 });
  }

  if (!["seller", "both", "admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Seller account required" }, { status: 403 });
  }

  // Get shop
  const { data: shop } = await admin
    .from("shops")
    .select("id, name")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 400 });
  }

  const body = await request.json();
  const { weekStart, amountFils, setupIntentId, paymentMethodId, customerId, headline, description } = body;

  if (!weekStart || !amountFils) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!setupIntentId && !paymentMethodId) {
    return NextResponse.json({ error: "Payment method or setup intent required" }, { status: 400 });
  }

  // Get auction
  const { data: auction } = await admin
    .from("sotw_auctions")
    .select("id, status, closes_at")
    .eq("week_start", weekStart)
    .single();

  if (!auction || auction.status !== "open") {
    return NextResponse.json({ error: "No open auction for this week" }, { status: 400 });
  }

  if (new Date(auction.closes_at) <= new Date()) {
    return NextResponse.json({ error: "Auction has closed" }, { status: 400 });
  }

  // Rate limit: 5 min between bids for same seller+auction
  const { data: recentBid } = await admin
    .from("sotw_bids")
    .select("created_at")
    .eq("auction_id", auction.id)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (recentBid) {
    const elapsed = Date.now() - new Date(recentBid.created_at).getTime();
    const limitMs = 5 * 60 * 1000;
    if (elapsed < limitMs) {
      const waitSec = Math.ceil((limitMs - elapsed) / 1000);
      return NextResponse.json(
        { error: `Please wait ${waitSec} seconds before bidding again` },
        { status: 429 }
      );
    }
  }

  const stripe = getStripe();

  let resolvedPaymentMethodId: string;
  let resolvedCustomerId: string;
  let resolvedSetupIntentId: string;

  if (paymentMethodId && customerId) {
    // Using a saved card — verify it belongs to this customer
    const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (pm.customer !== customerId) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }
    resolvedPaymentMethodId = paymentMethodId;
    resolvedCustomerId = customerId;
    resolvedSetupIntentId = `saved_card_${paymentMethodId}`;
  } else {
    // New card via Setup Intent
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
    if (setupIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Card verification incomplete" }, { status: 400 });
    }
    resolvedPaymentMethodId = setupIntent.payment_method as string;
    resolvedCustomerId = setupIntent.customer as string;
    resolvedSetupIntentId = setupIntentId;

    // Attach PM to customer if needed
    try {
      await stripe.paymentMethods.attach(resolvedPaymentMethodId, { customer: resolvedCustomerId });
    } catch {
      // Already attached
    }
  }

  // Call atomic RPC
  const { data: rpcResult, error: rpcError } = await admin.rpc("place_sotw_bid", {
    p_auction_id: auction.id,
    p_seller_id: user.id,
    p_shop_id: shop.id,
    p_amount_fils: amountFils,
    p_is_buy_now: false,
    p_stripe_customer_id: resolvedCustomerId,
    p_stripe_payment_method_id: resolvedPaymentMethodId,
    p_stripe_setup_intent_id: resolvedSetupIntentId,
    p_headline: headline || null,
    p_description: description || null,
    p_image_url: null,
  });

  if (rpcError) {
    console.error("place_sotw_bid RPC error:", rpcError);
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }

  const result = rpcResult as { success: boolean; error?: string; bid_id?: string; previous_highest_bidder_id?: string };

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Notify previous highest bidder if different
  if (result.previous_highest_bidder_id && result.previous_highest_bidder_id !== user.id) {
    await sendNotification({
      userId: result.previous_highest_bidder_id,
      type: "promo",
      title: "You've been outbid!",
      message: `Someone placed a higher bid for the Seller of the Week slot (week of ${weekStart}). Place a higher bid to reclaim your spot.`,
      link: "/seller/promotions/seller-of-week",
    });
  }

  // Fetch updated auction
  const { data: updatedAuction } = await admin
    .from("sotw_auctions")
    .select("current_highest_bid_fils, total_bids, closes_at")
    .eq("id", auction.id)
    .single();

  return NextResponse.json({
    bidId: result.bid_id,
    auction: updatedAuction,
  });
}
