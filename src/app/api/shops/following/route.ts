import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { mapDbShop } from "@/lib/mappers";

// GET /api/shops/following — get shops the current user follows
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ shops: [] });
  }

  // Get shop IDs the user follows
  const { data: follows } = await supabase
    .from("shop_followers")
    .select("shop_id")
    .eq("follower_id", user.id)
    .order("created_at", { ascending: false })
    .limit(8);

  if (!follows || follows.length === 0) {
    return NextResponse.json({ shops: [] });
  }

  const shopIds = follows.map((f) => f.shop_id);

  const { data: shops } = await supabase
    .from("shops")
    .select("*")
    .in("id", shopIds);

  if (!shops) {
    return NextResponse.json({ shops: [] });
  }

  return NextResponse.json({
    shops: shops.map(mapDbShop),
  });
}
