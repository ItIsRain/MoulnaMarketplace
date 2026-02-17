import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
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

  const statusFilter = request.nextUrl.searchParams.get("status");

  // Get auctions
  let query = admin
    .from("sotw_auctions")
    .select("*")
    .order("week_start", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: auctions } = await query;

  // Get all bids grouped by auction
  const auctionIds = (auctions || []).map((a) => a.id);
  const { data: allBids } = await admin
    .from("sotw_bids")
    .select("*, shops(name, slug)")
    .in("auction_id", auctionIds.length > 0 ? auctionIds : ["00000000-0000-0000-0000-000000000000"])
    .order("amount_fils", { ascending: false });

  // Group bids by auction
  const bidsByAuction: Record<string, typeof allBids> = {};
  for (const bid of allBids || []) {
    if (!bidsByAuction[bid.auction_id]) {
      bidsByAuction[bid.auction_id] = [];
    }
    bidsByAuction[bid.auction_id]!.push(bid);
  }

  // Status counts
  const statusCounts = {
    all: (auctions || []).length,
    open: 0,
    pending_approval: 0,
    completed: 0,
    cancelled: 0,
    bought_out: 0,
  };

  for (const a of auctions || []) {
    const key = a.status as keyof typeof statusCounts;
    if (key in statusCounts) statusCounts[key]++;
  }

  // Stats
  const { data: completedBids } = await admin
    .from("sotw_bids")
    .select("amount_fils")
    .eq("status", "charged");

  const totalRevenue = (completedBids || []).reduce((s, b) => s + b.amount_fils, 0);
  const avgWinningBid =
    completedBids && completedBids.length > 0
      ? Math.round(totalRevenue / completedBids.length)
      : 0;

  const enriched = (auctions || []).map((auction) => {
    const bids = bidsByAuction[auction.id] || [];
    const winnerBid = bids.find((b) => b.id === auction.winner_bid_id);

    return {
      ...auction,
      bids: bids.map((b) => ({
        id: b.id,
        sellerId: b.seller_id,
        shopName: (b.shops as unknown as { name: string; slug: string })?.name || "Unknown",
        shopSlug: (b.shops as unknown as { name: string; slug: string })?.slug || "",
        amountFils: b.amount_fils,
        isBuyNow: b.is_buy_now,
        status: b.status,
        headline: b.headline,
        adminNotes: b.admin_notes,
        createdAt: b.created_at,
      })),
      winnerShopName: winnerBid
        ? (winnerBid.shops as unknown as { name: string })?.name
        : null,
      winnerAmountFils: winnerBid ? winnerBid.amount_fils : null,
    };
  });

  return NextResponse.json({
    auctions: enriched,
    statusCounts,
    stats: {
      activeAuctions: statusCounts.open,
      pendingApprovals: statusCounts.pending_approval,
      totalRevenue,
      avgWinningBid,
    },
  });
}
