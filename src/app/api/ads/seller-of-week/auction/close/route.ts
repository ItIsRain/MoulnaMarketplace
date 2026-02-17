import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotification, sendBulkNotifications } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Find auctions that should close
  const { data: auctions } = await admin
    .from("sotw_auctions")
    .select("id, week_start")
    .eq("status", "open")
    .lte("closes_at", new Date().toISOString());

  if (!auctions || auctions.length === 0) {
    return NextResponse.json({ closed: 0 });
  }

  let closedCount = 0;

  for (const auction of auctions) {
    // Get highest active bid
    const { data: highestBid } = await admin
      .from("sotw_bids")
      .select("id, seller_id, amount_fils, shops(name)")
      .eq("auction_id", auction.id)
      .eq("status", "active")
      .order("amount_fils", { ascending: false })
      .limit(1)
      .single();

    if (!highestBid) {
      // No bids — cancel auction
      await admin
        .from("sotw_auctions")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", auction.id);
      closedCount++;
      continue;
    }

    // Mark winner as pending_approval
    await admin
      .from("sotw_bids")
      .update({ status: "pending_approval", updated_at: new Date().toISOString() })
      .eq("id", highestBid.id);

    // Mark all other active bids as outbid
    await admin
      .from("sotw_bids")
      .update({ status: "outbid", updated_at: new Date().toISOString() })
      .eq("auction_id", auction.id)
      .eq("status", "active")
      .neq("id", highestBid.id);

    // Update auction
    await admin
      .from("sotw_auctions")
      .update({
        status: "pending_approval",
        winner_bid_id: highestBid.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", auction.id);

    // Notify winner
    await sendNotification({
      userId: highestBid.seller_id,
      type: "promo",
      title: "You won the SOTW auction!",
      message: `Congratulations! Your bid won the Seller of the Week auction for week of ${auction.week_start}. Pending admin approval.`,
      link: "/seller/promotions/seller-of-week",
    });

    // Notify admins
    const { data: admins } = await admin
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    if (admins) {
      const shopName = (highestBid.shops as unknown as { name: string })?.name || "Unknown";
      const adminNotifs = admins.map((a) => ({
        userId: a.id,
        type: "promo" as const,
        title: "SOTW Auction — Pending Approval",
        message: `${shopName} won the SOTW auction for ${auction.week_start}. Review and approve.`,
        link: "/admin/sotw",
      }));
      await sendBulkNotifications(adminNotifs);
    }

    closedCount++;
  }

  return NextResponse.json({ closed: closedCount });
}
