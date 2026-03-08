import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: sotw } = await admin
    .from("seller_of_week")
    .select(`
      id, headline, description, image_url, impressions, clicks,
      week_start, week_end,
      shops (id, name, slug, avatar_style, avatar_seed, total_listings, location, is_verified, category)
    `)
    .eq("status", "active")
    .lte("week_start", today)
    .gt("week_end", today)
    .limit(1)
    .single();

  if (!sotw) {
    return NextResponse.json({ seller: null });
  }

  // Increment impressions atomically via RPC
  void admin.rpc("increment_sotw_impressions", { sotw_id: sotw.id }).then();

  return NextResponse.json({
    seller: {
      id: sotw.id,
      headline: sotw.headline,
      description: sotw.description,
      imageUrl: sotw.image_url,
      shop: sotw.shops,
    },
  });
}
