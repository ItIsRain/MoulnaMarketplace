import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { mapDbProduct } from "@/lib/mappers";

const SHOP_SELECT = "id, owner_id, name, slug, avatar_style, avatar_seed, logo_url, rating, total_listings, location, is_verified, response_time";

// GET /api/products/recommended — personalized product recommendations
// Query params:
//   type: "for_you" | "similar"
//   productId: (required when type=similar) — product to find similar items for
//   category: (optional) — category to filter by
//   limit: number (default 12, max 30)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type") || "for_you";
  const productId = searchParams.get("productId") || "";
  const categoryFilter = searchParams.get("category") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "12") || 12, 30);

  try {
    if (type === "similar" && productId) {
      return await getSimilarProducts(supabase, productId, limit);
    }

    return await getForYouProducts(supabase, admin, categoryFilter, limit);
  } catch (err) {
    console.error("Recommended products error:", err);
    return NextResponse.json({ products: [] });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSimilarProducts(supabase: any, productId: string, limit: number) {
  // Get the source product's category and tags
  const { data: source } = await supabase
    .from("products")
    .select("id, category, tags, price_fils, shop_id")
    .eq("id", productId)
    .single();

  if (!source) {
    return NextResponse.json({ products: [] });
  }

  // Find products in the same category, excluding the source product
  let query = supabase
    .from("products")
    .select(`*, shops!inner(${SHOP_SELECT})`)
    .eq("status", "active")
    .neq("id", productId)
    .or("expires_at.is.null,expires_at.gt.now()");

  if (source.category) {
    query = query.eq("category", source.category);
  }

  // Order by view_count (popularity) with some variety
  query = query.order("view_count", { ascending: false }).limit(limit * 2);

  const { data } = await query;

  if (!data || data.length === 0) {
    // Fallback: get popular products from any category
    const { data: fallback } = await supabase
      .from("products")
      .select(`*, shops!inner(${SHOP_SELECT})`)
      .eq("status", "active")
      .neq("id", productId)
      .or("expires_at.is.null,expires_at.gt.now()")
      .order("view_count", { ascending: false })
      .limit(limit);

    const products = (fallback || []).map((row: Record<string, unknown>) => mapDbProduct(row));
    return NextResponse.json({ products: shuffleWithBias(products, limit) });
  }

  // Score and rank by similarity
  const scored = data.map((row: Record<string, unknown> & { tags?: string[]; price_fils?: number; shop_id?: string }) => {
    let score = 0;

    // Tag overlap bonus
    const sourceTags = source.tags || [];
    const productTags = row.tags || [];
    const overlap = sourceTags.filter((t: string) => productTags.includes(t)).length;
    score += overlap * 10;

    // Price proximity bonus (products in similar price range)
    if (source.price_fils && row.price_fils) {
      const priceDiff = Math.abs((source.price_fils as number) - (row.price_fils as number)) / (source.price_fils as number);
      if (priceDiff < 0.3) score += 15;
      else if (priceDiff < 0.6) score += 8;
    }

    // Different shop bonus (diversity)
    if (row.shop_id !== source.shop_id) score += 5;

    // Popularity bonus
    score += Math.min(((row as Record<string, unknown>).view_count as number || 0) / 10, 20);

    return { row, score };
  });

  scored.sort((a: { score: number }, b: { score: number }) => b.score - a.score);

  const products = scored
    .slice(0, limit)
    .map((s: { row: Record<string, unknown> }) => mapDbProduct(s.row));

  return NextResponse.json({ products: shuffleWithBias(products, limit) });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getForYouProducts(supabase: any, admin: any, categoryFilter: string, limit: number) {
  // Try to get the current user
  const { data: { user } } = await supabase.auth.getUser();

  let preferredCategories: string[] = [];

  if (user) {
    // Get categories from user's wishlist
    const { data: wishlistItems } = await admin
      .from("wishlists")
      .select("product_id")
      .eq("user_id", user.id)
      .limit(50);

    if (wishlistItems && wishlistItems.length > 0) {
      const wishlistProductIds = wishlistItems.map((w: { product_id: string }) => w.product_id);
      const { data: wishlistProducts } = await admin
        .from("products")
        .select("category")
        .in("id", wishlistProductIds);

      if (wishlistProducts) {
        const catCounts: Record<string, number> = {};
        wishlistProducts.forEach((p: { category: string }) => {
          if (p.category) {
            catCounts[p.category] = (catCounts[p.category] || 0) + 1;
          }
        });
        // Sort by frequency
        preferredCategories = Object.entries(catCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([cat]) => cat)
          .slice(0, 3);
      }
    }
  }

  // Fetch products with preference weighting
  const allProducts: ReturnType<typeof mapDbProduct>[] = [];

  // If user has preferred categories, fetch from those first
  if (preferredCategories.length > 0 && !categoryFilter) {
    for (const cat of preferredCategories.slice(0, 2)) {
      const { data } = await supabase
        .from("products")
        .select(`*, shops!inner(${SHOP_SELECT})`)
        .eq("status", "active")
        .eq("category", cat)
        .or("expires_at.is.null,expires_at.gt.now()")
        .order("view_count", { ascending: false })
        .limit(Math.ceil(limit / 2));

      if (data) {
        allProducts.push(...data.map((row: Record<string, unknown>) => mapDbProduct(row)));
      }
    }
  }

  // Fill remaining with popular products (discovery)
  const remaining = limit - allProducts.length;
  if (remaining > 0) {
    const excludeIds = allProducts.map((p) => p.id);
    let query = supabase
      .from("products")
      .select(`*, shops!inner(${SHOP_SELECT})`)
      .eq("status", "active")
      .or("expires_at.is.null,expires_at.gt.now()")
      .order("view_count", { ascending: false })
      .limit(remaining * 2);

    if (categoryFilter) {
      query = query.eq("category", categoryFilter);
    }

    for (const id of excludeIds) {
      query = query.neq("id", id);
    }

    const { data } = await query;
    if (data) {
      allProducts.push(...data.map((row: Record<string, unknown>) => mapDbProduct(row)));
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  const unique = allProducts.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return NextResponse.json({ products: shuffleWithBias(unique, limit) });
}

// Shuffle products while keeping higher-scored items biased toward the top
function shuffleWithBias<T>(items: T[], limit: number): T[] {
  const result = [...items].slice(0, Math.max(limit, items.length));
  // Fisher-Yates with bias: items near the top have less chance of being swapped far
  for (let i = result.length - 1; i > 0; i--) {
    // Bias toward keeping items in place — swap within a window
    const window = Math.min(i, Math.ceil(result.length / 3));
    const j = i - Math.floor(Math.random() * window);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.slice(0, limit);
}
