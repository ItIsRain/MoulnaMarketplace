import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { sendNotification } from "@/lib/notifications";

async function cascadeToNextBidder(admin: ReturnType<typeof createAdminClient>, auctionId: string, weekStart: string) {
  // Find next highest bid that is outbid (exclude rejected/charge_failed)
  const { data: nextBid } = await admin
    .from("sotw_bids")
    .select("id, seller_id, amount_fils, shops(name)")
    .eq("auction_id", auctionId)
    .eq("status", "outbid")
    .order("amount_fils", { ascending: false })
    .limit(1)
    .single();

  if (!nextBid) {
    // No more bidders — cancel auction
    await admin
      .from("sotw_auctions")
      .update({
        status: "cancelled",
        winner_bid_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", auctionId);
    return null;
  }

  // Promote to pending_approval
  await admin
    .from("sotw_bids")
    .update({ status: "pending_approval", updated_at: new Date().toISOString() })
    .eq("id", nextBid.id);

  await admin
    .from("sotw_auctions")
    .update({
      winner_bid_id: nextBid.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", auctionId);

  const shopName = (nextBid.shops as unknown as { name: string })?.name || "Unknown";

  await sendNotification({
    userId: nextBid.seller_id,
    type: "promo",
    title: "You're the new SOTW winner!",
    message: `The previous winner was removed. Your bid for Seller of the Week (${weekStart}) is now pending admin approval.`,
    link: "/seller/promotions/seller-of-week",
  });

  // Notify admins about cascade
  const { data: admins } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "admin");

  if (admins) {
    for (const a of admins) {
      await sendNotification({
        userId: a.id,
        type: "promo",
        title: "SOTW Cascaded to Next Bidder",
        message: `${shopName} is the new pending winner for ${weekStart}. Review and approve.`,
        link: "/admin/sotw",
      });
    }
  }

  return nextBid;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { bidId } = body;
  if (!bidId) {
    return NextResponse.json({ error: "bidId is required" }, { status: 400 });
  }

  // Get bid with auction
  const { data: bid } = await admin
    .from("sotw_bids")
    .select("*, sotw_auctions(id, week_start, week_end, status)")
    .eq("id", bidId)
    .single();

  if (!bid) {
    return NextResponse.json({ error: "Bid not found" }, { status: 404 });
  }

  if (bid.status !== "pending_approval") {
    return NextResponse.json({ error: "Bid is not pending approval" }, { status: 400 });
  }

  const auction = bid.sotw_auctions as unknown as {
    id: string; week_start: string; week_end: string; status: string;
  };

  // Charge the card
  const stripe = getStripe();
  let paymentIntent;

  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: bid.amount_fils,
      currency: "aed",
      customer: bid.stripe_customer_id,
      payment_method: bid.stripe_payment_method_id,
      off_session: true,
      confirm: true,
      metadata: {
        type: "sotw_auction",
        bid_id: bid.id,
        auction_id: auction.id,
        seller_id: bid.seller_id,
      },
    });
  } catch (stripeError) {
    console.error("Stripe charge failed:", stripeError);

    // Mark bid as charge_failed
    await admin
      .from("sotw_bids")
      .update({
        status: "charge_failed",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", bid.id);

    await sendNotification({
      userId: bid.seller_id,
      type: "promo",
      title: "SOTW Payment Failed",
      message: "Your card could not be charged for the Seller of the Week auction. Your spot will go to the next highest bidder.",
      link: "/seller/promotions/seller-of-week",
    });

    // Cascade to next bidder
    await cascadeToNextBidder(admin, auction.id, auction.week_start);

    return NextResponse.json({ success: true, chargeStatus: "failed", cascaded: true });
  }

  // Charge succeeded — update everything
  const now = new Date().toISOString();

  // Update bid
  await admin
    .from("sotw_bids")
    .update({
      status: "charged",
      stripe_payment_intent_id: paymentIntent.id,
      charged_at: now,
      reviewed_by: user.id,
      reviewed_at: now,
      updated_at: now,
    })
    .eq("id", bid.id);

  // Create ad_payment
  const { data: adPayment } = await admin
    .from("ad_payments")
    .insert({
      seller_id: bid.seller_id,
      ad_type: "seller_of_week",
      amount_fils: bid.amount_fils,
      status: "completed",
      stripe_payment_intent_id: paymentIntent.id,
      metadata: { bid_id: bid.id, auction_id: auction.id },
    })
    .select("id")
    .single();

  // Create seller_of_week entry
  const acquisitionType = bid.is_buy_now ? "auction_buy_now" : "auction_bid";
  await admin.from("seller_of_week").insert({
    seller_id: bid.seller_id,
    shop_id: bid.shop_id,
    payment_id: adPayment?.id,
    week_start: auction.week_start,
    week_end: auction.week_end,
    price_fils: bid.amount_fils,
    status: "pending",
    headline: bid.headline,
    description: bid.description,
    image_url: bid.image_url,
    auction_id: auction.id,
    bid_id: bid.id,
    acquisition_type: acquisitionType,
  });

  // Update auction to completed
  await admin
    .from("sotw_auctions")
    .update({ status: "completed", updated_at: now })
    .eq("id", auction.id);

  // Notify winner
  await sendNotification({
    userId: bid.seller_id,
    type: "promo",
    title: "SOTW Approved! You're featured!",
    message: `Your Seller of the Week spot for ${auction.week_start} has been approved and charged. Your shop will be featured!`,
    link: "/seller/promotions/seller-of-week",
  });

  return NextResponse.json({ success: true, chargeStatus: "succeeded" });
}

// Export cascadeToNextBidder for use in reject route
export { cascadeToNextBidder };
