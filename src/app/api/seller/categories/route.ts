import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/seller/categories — seller's product categories with counts
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get seller's shop
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    return NextResponse.json({ error: "No shop found" }, { status: 404 });
  }

  // Get all products for this shop
  const { data: products } = await supabase
    .from("products")
    .select("category, status")
    .eq("shop_id", shop.id);

  // Aggregate counts per category
  const counts: Record<string, number> = {};
  (products || []).forEach((p) => {
    const cat = p.category || "Other";
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const categories = Object.entries(counts)
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      productCount: count,
    }))
    .sort((a, b) => b.productCount - a.productCount);

  const totalProducts = (products || []).length;

  return NextResponse.json({
    categories,
    totalCategories: categories.length,
    totalProducts,
  });
}
