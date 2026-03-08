import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotification } from "@/lib/notifications";

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
  const { bidId, reason, notes } = body;
  if (!bidId || !reason) {
    return NextResponse.json({ error: "bidId and reason are required" }, { status: 400 });
  }

  // Get bid with auction
  const { data: bid } = await admin
    .from("sotw_bids")
    .select("*, sotw_auctions(id, week_start, status)")
    .eq("id", bidId)
    .single();

  if (!bid) {
    return NextResponse.json({ error: "Bid not found" }, { status: 404 });
  }

  if (bid.status !== "pending_approval") {
    return NextResponse.json({ error: "Bid is not pending approval" }, { status: 400 });
  }

  const auction = bid.sotw_auctions as unknown as {
    id: string; week_start: string; status: string;
  };

  const now = new Date().toISOString();

  // Reject the bid
  await admin
    .from("sotw_bids")
    .update({
      status: "rejected",
      admin_notes: `${reason}${notes ? `: ${notes}` : ""}`,
      reviewed_by: user.id,
      reviewed_at: now,
      updated_at: now,
    })
    .eq("id", bid.id);

  // Notify rejected seller
  await sendNotification({
    userId: bid.seller_id,
    type: "promo",
    title: "SOTW Bid Rejected",
    message: `Your winning bid for Seller of the Week (${auction.week_start}) was not approved. Reason: ${reason}`,
    link: "/seller/promotions/seller-of-week",
  });

  // Cascade to next bidder
  const { data: nextBid } = await admin
    .from("sotw_bids")
    .select("id, seller_id, amount_fils, shops(name)")
    .eq("auction_id", auction.id)
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
        updated_at: now,
      })
      .eq("id", auction.id);

    return NextResponse.json({ success: true, cascaded: false });
  }

  // Promote next bidder
  await admin
    .from("sotw_bids")
    .update({ status: "pending_approval", updated_at: now })
    .eq("id", nextBid.id);

  await admin
    .from("sotw_auctions")
    .update({ winner_bid_id: nextBid.id, updated_at: now })
    .eq("id", auction.id);

  const shopName = (nextBid.shops as unknown as { name: string })?.name || "Unknown";

  await sendNotification({
    userId: nextBid.seller_id,
    type: "promo",
    title: "You're the new SOTW winner!",
    message: `The previous winner was rejected. Your bid for Seller of the Week (${auction.week_start}) is now pending admin approval.`,
    link: "/seller/promotions/seller-of-week",
  });

  // Notify admins
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
        message: `${shopName} is the new pending winner for ${auction.week_start}. Review and approve.`,
        link: "/admin/sotw",
      });
    }
  }

  return NextResponse.json({ success: true, cascaded: true, nextBidId: nextBid.id });
}
