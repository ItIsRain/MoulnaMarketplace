import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { mapDbProduct } from "@/lib/mappers";

const SHOP_SELECT = "id, owner_id, name, slug, avatar_style, avatar_seed, logo_url, rating, total_listings, location, is_verified, response_time";

// GET /api/products/[slug] — public product detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("products")
    .select(`*, shops!inner(${SHOP_SELECT})`)
    .eq("slug", slug)
    .eq("status", "active")
    .or("expires_at.is.null,expires_at.gt.now()")
    .single();

  if (error || !row) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = mapDbProduct(row);

  // Increment view count atomically (fire-and-forget with admin client to bypass RLS)
  const admin = createAdminClient();
  void admin.rpc("increment_view_count", { product_id: row.id });

  return NextResponse.json({ product });
}
