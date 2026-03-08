import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const admin = createAdminClient();

  // Ensure auction rows exist for upcoming weeks (only if authenticated)
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await admin.rpc("ensure_sotw_auctions");
  }

  // Get next 8 Mondays starting from next week
  const today = new Date();
  const dayOfWeek = today.getUTCDay();
  const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;

  const weeks: {
    weekStart: string;
    weekEnd: string;
    available: boolean;
    auctionId?: string;
    auctionStatus?: string;
    currentHighestBidFils?: number;
    totalBids?: number;
    closesAt?: string;
    buyNowPriceFils?: number;
  }[] = [];
  const weekStarts: string[] = [];

  for (let i = 0; i < 8; i++) {
    const monday = new Date(today);
    monday.setUTCDate(today.getUTCDate() + daysUntilNextMonday + i * 7);
    const weekStart = monday.toISOString().split("T")[0];

    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 7);
    const weekEnd = sunday.toISOString().split("T")[0];

    weekStarts.push(weekStart);
    weeks.push({ weekStart, weekEnd, available: true });
  }

  // Check which weeks are already booked (non-cancelled direct purchases)
  const { data: booked } = await supabase
    .from("seller_of_week")
    .select("week_start")
    .in("week_start", weekStarts)
    .in("status", ["pending", "active"]);

  const bookedSet = new Set((booked || []).map((b) => b.week_start));

  // Fetch auction data for these weeks
  const { data: auctions } = await admin
    .from("sotw_auctions")
    .select("id, week_start, status, current_highest_bid_fils, total_bids, closes_at, buy_now_price_fils")
    .in("week_start", weekStarts);

  const auctionMap = new Map(
    (auctions || []).map((a) => [a.week_start, a])
  );

  for (const week of weeks) {
    if (bookedSet.has(week.weekStart)) {
      week.available = false;
    }

    const auction = auctionMap.get(week.weekStart);
    if (auction) {
      week.auctionId = auction.id;
      week.auctionStatus = auction.status;
      week.currentHighestBidFils = auction.current_highest_bid_fils;
      week.totalBids = auction.total_bids;
      week.closesAt = auction.closes_at;
      week.buyNowPriceFils = auction.buy_now_price_fils;

      // If auction is completed/bought_out, week is not available for bidding
      if (["completed", "bought_out", "pending_approval"].includes(auction.status)) {
        week.available = false;
      }
    }
  }

  // Fetch auction config
  const configKeys = [
    "sotw_auction_min_bid_fils",
    "sotw_auction_bid_increment_fils",
    "sotw_auction_buy_now_fils",
    "sotw_auction_close_hours_before",
  ];

  const { data: settings } = await admin
    .from("platform_settings")
    .select("key, value")
    .in("key", configKeys);

  const config: Record<string, number> = {};
  for (const s of settings || []) {
    const val = typeof s.value === "string" ? s.value : JSON.stringify(s.value);
    config[s.key] = Number(val.replace(/"/g, ""));
  }

  // Also fetch legacy price
  const { data: priceSetting } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "sotw_price_per_week_fils")
    .single();

  const priceFils = priceSetting ? Number(String(priceSetting.value).replace(/"/g, "")) : 19900;

  return NextResponse.json({
    weeks,
    priceFils,
    auctionConfig: {
      minBidFils: config.sotw_auction_min_bid_fils || 9900,
      bidIncrementFils: config.sotw_auction_bid_increment_fils || 2500,
      buyNowFils: config.sotw_auction_buy_now_fils || 79900,
      closeHoursBefore: config.sotw_auction_close_hours_before || 48,
      auctionEnabled: true,
    },
  });
}
