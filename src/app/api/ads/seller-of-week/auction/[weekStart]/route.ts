import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ weekStart: string }> }
) {
  const { weekStart } = await params;
  const admin = createAdminClient();

  // Get auction
  const { data: auction } = await admin
    .from("sotw_auctions")
    .select("*")
    .eq("week_start", weekStart)
    .single();

  if (!auction) {
    return NextResponse.json({ error: "Auction not found" }, { status: 404 });
  }

  // Get recent bids (anonymized for public, with shop names)
  const { data: bids } = await admin
    .from("sotw_bids")
    .select("amount_fils, is_buy_now, created_at, shops(name)")
    .eq("auction_id", auction.id)
    .in("status", ["active", "outbid", "pending_approval"])
    .order("amount_fils", { ascending: false })
    .limit(20);

  const recentBids = (bids || []).map((b) => ({
    amountFils: b.amount_fils,
    shopName: (b.shops as unknown as { name: string })?.name || "Unknown Shop",
    isBuyNow: b.is_buy_now,
    createdAt: b.created_at,
  }));

  // Calculate next min bid
  const nextMinBidFils =
    auction.current_highest_bid_fils === 0
      ? auction.min_bid_fils
      : auction.current_highest_bid_fils + auction.bid_increment_fils;

  // Check if authenticated user has a bid
  let myBid = null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: userBid } = await admin
      .from("sotw_bids")
      .select("id, amount_fils, status, is_buy_now, headline, description, created_at")
      .eq("auction_id", auction.id)
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (userBid) {
      myBid = {
        id: userBid.id,
        amountFils: userBid.amount_fils,
        status: userBid.status,
        isBuyNow: userBid.is_buy_now,
        headline: userBid.headline,
        description: userBid.description,
        createdAt: userBid.created_at,
      };
    }
  }

  return NextResponse.json({
    auction: {
      id: auction.id,
      weekStart: auction.week_start,
      weekEnd: auction.week_end,
      status: auction.status,
      currentHighestBidFils: auction.current_highest_bid_fils,
      totalBids: auction.total_bids,
      closesAt: auction.closes_at,
      minBidFils: auction.min_bid_fils,
      bidIncrementFils: auction.bid_increment_fils,
      buyNowPriceFils: auction.buy_now_price_fils,
    },
    nextMinBidFils,
    recentBids,
    myBid,
  });
}
