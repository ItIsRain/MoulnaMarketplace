import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { mapDbProduct } from "@/lib/mappers";
import type { Product } from "@/lib/types";

const SHOP_SELECT = "id, owner_id, name, slug, avatar_style, avatar_seed, logo_url, rating, total_listings, location, is_verified, response_time";

// GET /api/products — public product listing with filters
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = parseInt(searchParams.get("minPrice") || "0") || 0;
  const maxPrice = parseInt(searchParams.get("maxPrice") || "0") || 0;
  const handmade = searchParams.get("handmade") === "true";
  const verified = searchParams.get("verified") === "true";
  const shop = searchParams.get("shop") || "";
  const sort = searchParams.get("sort") || "newest";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20") || 20, 50);
  const offset = parseInt(searchParams.get("offset") || "0") || 0;

  // On first page, fetch active boosted products to show at top
  let sponsoredProducts: ReturnType<typeof mapDbProduct>[] = [];
  const boostedProductIds: string[] = [];

  if (offset === 0) {
    const admin = createAdminClient();
    const now = new Date().toISOString();

    const { data: activeBoosts } = await admin
      .from("product_boosts")
      .select("product_id")
      .eq("status", "active")
      .lte("starts_at", now)
      .gte("ends_at", now);

    if (activeBoosts && activeBoosts.length > 0) {
      const boostIds = activeBoosts.map((b) => b.product_id);

      const { data: boostedRows } = await supabase
        .from("products")
        .select(`*, shops!inner(${SHOP_SELECT})`)
        .in("id", boostIds)
        .eq("status", "active");

      if (boostedRows) {
        sponsoredProducts = boostedRows.map((row) => mapDbProduct(row, undefined, true));
        boostedProductIds.push(...boostedRows.map((r) => r.id));

        // Increment impressions via RPC (fire-and-forget)
        void admin.rpc("increment_boost_impressions", { boost_product_ids: boostIds });
      }
    }
  }

  let query = supabase
    .from("products")
    .select(`*, shops!inner(${SHOP_SELECT})`, { count: "exact" })
    .eq("status", "active")
    .or("expires_at.is.null,expires_at.gt.now()");

  // Exclude boosted products from regular results to avoid duplicates
  if (boostedProductIds.length > 0) {
    for (const id of boostedProductIds) {
      query = query.neq("id", id);
    }
  }

  if (shop) {
    query = query.eq("shops.slug", shop);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (minPrice > 0) {
    query = query.gte("price_fils", minPrice);
  }

  if (maxPrice > 0) {
    query = query.lte("price_fils", maxPrice);
  }

  if (handmade) {
    query = query.eq("is_handmade", true);
  }

  if (verified) {
    query = query.eq("shops.is_verified", true);
  }

  // Sort
  switch (sort) {
    case "trending":
      query = query.order("view_count", { ascending: false });
      break;
    case "price_low":
      query = query.order("price_fils", { ascending: true });
      break;
    case "price_high":
      query = query.order("price_fils", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let regularProducts = (data || []).map((row) => mapDbProduct(row));

  // Add light randomization for trending sort to keep feed fresh
  // Products are grouped into tiers and shuffled within each tier
  if (sort === "trending" && regularProducts.length > 3) {
    regularProducts = shuffleTiers(regularProducts);
  }

  const products = offset === 0 ? [...sponsoredProducts, ...regularProducts] : regularProducts;

  return NextResponse.json({ products, total: count || 0 });
}

// Shuffle products within tiers to add variety while keeping popular items near the top
// Tier 1 (top 30%): shuffled lightly among themselves
// Tier 2 (middle 40%): shuffled among themselves
// Tier 3 (bottom 30%): shuffled among themselves
function shuffleTiers(products: Product[]): Product[] {
  const t1End = Math.ceil(products.length * 0.3);
  const t2End = Math.ceil(products.length * 0.7);

  const tier1 = products.slice(0, t1End);
  const tier2 = products.slice(t1End, t2End);
  const tier3 = products.slice(t2End);

  return [...fisherYates(tier1), ...fisherYates(tier2), ...fisherYates(tier3)];
}

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
