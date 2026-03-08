import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { sendNotification, sendBulkNotifications } from "@/lib/notifications";

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
  const { weekStart, setupIntentId, paymentMethodId, customerId, headline, description } = body;

  if (!weekStart) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!setupIntentId && !paymentMethodId) {
    return NextResponse.json({ error: "Payment method or setup intent required" }, { status: 400 });
  }

  // Get auction
  const { data: auction } = await admin
    .from("sotw_auctions")
    .select("id, status, closes_at, buy_now_price_fils")
    .eq("week_start", weekStart)
    .single();

  if (!auction || auction.status !== "open") {
    return NextResponse.json({ error: "No open auction for this week" }, { status: 400 });
  }

  if (new Date(auction.closes_at) <= new Date()) {
    return NextResponse.json({ error: "Auction has closed" }, { status: 400 });
  }

  const stripe = getStripe();

  let resolvedPaymentMethodId: string;
  let resolvedCustomerId: string;
  let resolvedSetupIntentId: string;

  if (paymentMethodId && customerId) {
    // Verify the customerId belongs to the authenticated user
    const { data: stripeRecord } = await admin
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    if (!stripeRecord) {
      return NextResponse.json({ error: "Invalid customer" }, { status: 403 });
    }

    // Using a saved card
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

    // Verify the setup intent's customer belongs to the authenticated user
    const { data: stripeRecord } = await admin
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .eq("stripe_customer_id", resolvedCustomerId)
      .maybeSingle();

    if (!stripeRecord) {
      return NextResponse.json({ error: "Invalid payment setup" }, { status: 403 });
    }

    try {
      await stripe.paymentMethods.attach(resolvedPaymentMethodId, { customer: resolvedCustomerId });
    } catch {
      // Already attached
    }
  }

  // Call atomic RPC with buy_now flag
  const { data: rpcResult, error: rpcError } = await admin.rpc("place_sotw_bid", {
    p_auction_id: auction.id,
    p_seller_id: user.id,
    p_shop_id: shop.id,
    p_amount_fils: auction.buy_now_price_fils,
    p_is_buy_now: true,
    p_stripe_customer_id: resolvedCustomerId,
    p_stripe_payment_method_id: resolvedPaymentMethodId,
    p_stripe_setup_intent_id: resolvedSetupIntentId,
    p_headline: headline || null,
    p_description: description || null,
    p_image_url: null,
  });

  if (rpcError) {
    console.error("place_sotw_bid RPC error:", rpcError);
    return NextResponse.json({ error: "Failed to process buy now" }, { status: 500 });
  }

  const result = rpcResult as { success: boolean; error?: string; bid_id?: string };

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Notify all outbid sellers
  const { data: outbidBids } = await admin
    .from("sotw_bids")
    .select("seller_id")
    .eq("auction_id", auction.id)
    .eq("status", "outbid")
    .neq("seller_id", user.id);

  if (outbidBids && outbidBids.length > 0) {
    const notifications = outbidBids.map((b) => ({
      userId: b.seller_id,
      type: "promo" as const,
      title: "Auction ended — Buy Now used",
      message: `The Seller of the Week auction for week of ${weekStart} has been bought out. Your bid has been refunded.`,
      link: "/seller/promotions/seller-of-week",
    }));
    await sendBulkNotifications(notifications);
  }

  // Notify admins
  const { data: admins } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "admin");

  if (admins) {
    const adminNotifs = admins.map((a) => ({
      userId: a.id,
      type: "promo" as const,
      title: "SOTW Buy Now — Pending Approval",
      message: `${shop.name} used Buy Now for Seller of the Week (${weekStart}). Review and approve.`,
      link: "/admin/sotw",
    }));
    await sendBulkNotifications(adminNotifs);
  }

  return NextResponse.json({
    bidId: result.bid_id,
    redirectUrl: `/seller/promotions/success?type=sotw-buynow`,
  });
}
