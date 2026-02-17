import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// GET /api/products/deals — products with discounts (compare_at_price_fils > price_fils)
export async function GET() {
  const admin = createAdminClient();

  // Fetch active products that have a compare_at_price set
  const { data: products } = await admin
    .from("products")
    .select("id, title, slug, price_fils, compare_at_price_fils, category, images, inquiry_count, view_count, shop_id, created_at")
    .eq("status", "active")
    .not("compare_at_price_fils", "is", null)
    .order("created_at", { ascending: false })
    .limit(20);

  // Filter to only those where compare_at > price (actual discounts)
  const deals = (products || [])
    .filter((p) => p.compare_at_price_fils && p.compare_at_price_fils > p.price_fils)
    .map((p) => {
      const discount = Math.round(
        ((p.compare_at_price_fils - p.price_fils) / p.compare_at_price_fils) * 100
      );
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        priceFils: p.price_fils,
        originalPriceFils: p.compare_at_price_fils,
        discount,
        category: p.category || "Other",
        image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
        inquiryCount: p.inquiry_count || 0,
        viewCount: p.view_count || 0,
        shopId: p.shop_id,
        createdAt: p.created_at,
      };
    });

  // Get shop info for deals
  const shopIds = [...new Set(deals.map((d) => d.shopId).filter(Boolean))];
  let shopMap: Record<string, string> = {};

  if (shopIds.length > 0) {
    const { data: shops } = await admin
      .from("shops")
      .select("id, name")
      .in("id", shopIds);
    shopMap = Object.fromEntries(
      (shops || []).map((s) => [s.id, s.name])
    );
  }

  // Get unique discounted categories
  const categoryCounts: Record<string, { count: number; maxDiscount: number }> = {};
  deals.forEach((d) => {
    if (!categoryCounts[d.category]) {
      categoryCounts[d.category] = { count: 0, maxDiscount: 0 };
    }
    categoryCounts[d.category].count++;
    categoryCounts[d.category].maxDiscount = Math.max(
      categoryCounts[d.category].maxDiscount,
      d.discount
    );
  });

  const categoriesOnSale = Object.entries(categoryCounts)
    .map(([name, info]) => ({
      name,
      dealCount: info.count,
      maxDiscount: info.maxDiscount,
    }))
    .sort((a, b) => b.dealCount - a.dealCount)
    .slice(0, 4);

  return NextResponse.json({
    deals: deals.map((d) => ({
      ...d,
      shopName: shopMap[d.shopId] || "Unknown",
    })),
    categoriesOnSale,
    totalDeals: deals.length,
  });
}
