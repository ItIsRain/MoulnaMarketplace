import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// GET /api/categories — aggregate distinct categories from products with counts
export async function GET() {
  const admin = createAdminClient();

  // Get all active products with their categories
  const { data: products } = await admin
    .from("products")
    .select("category")
    .eq("status", "active");

  // Aggregate counts per category
  const counts: Record<string, number> = {};
  (products || []).forEach((p) => {
    const cat = p.category || "Other";
    counts[cat] = (counts[cat] || 0) + 1;
  });

  // Sort by count descending
  const categories = Object.entries(counts)
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      productCount: count,
    }))
    .sort((a, b) => b.productCount - a.productCount);

  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  return NextResponse.json({
    categories,
    totalCategories: categories.length,
    totalProducts,
  });
}
