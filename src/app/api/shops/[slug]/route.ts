import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { mapDbShop } from "@/lib/mappers";

// GET /api/shops/[slug] — public shop by slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop, error } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  // Check if authenticated user follows this shop
  let isFollowing = false;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: follow } = await supabase
      .from("shop_followers")
      .select("id")
      .eq("shop_id", shop.id)
      .eq("follower_id", user.id)
      .single();

    isFollowing = !!follow;
  }

  const isOwner = !!user && user.id === shop.owner_id;

  return NextResponse.json({
    shop: mapDbShop(shop),
    isFollowing,
    isOwner,
  });
}
