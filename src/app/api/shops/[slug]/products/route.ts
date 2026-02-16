import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { mapDbProduct } from "@/lib/mappers";

// GET /api/shops/[slug]/products — public shop products listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const limit = Math.min(parseInt(searchParams.get("limit") || "20") || 20, 50);
  const offset = parseInt(searchParams.get("offset") || "0") || 0;

  // Get shop by slug
  const { data: shop } = await supabase
    .from("shops")
    .select("id, owner_id, name, slug, avatar_style, avatar_seed, rating, total_listings, location, is_verified, response_time")
    .eq("slug", slug)
    .single();

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const { data, error, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("shop_id", shop.id)
    .eq("status", "active")
    .or("expires_at.is.null,expires_at.gt.now()")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = (data || []).map((row) => mapDbProduct(row, shop));

  return NextResponse.json({ products, total: count || 0 });
}
