import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { mapDbProduct } from "@/lib/mappers";

const SHOP_SELECT = "id, owner_id, name, slug, avatar_style, avatar_seed, rating, total_listings, location, is_verified, response_time";

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

  let query = supabase
    .from("products")
    .select(`*, shops!inner(${SHOP_SELECT})`, { count: "exact" })
    .eq("status", "active")
    .or("expires_at.is.null,expires_at.gt.now()");

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

  const products = (data || []).map((row) => mapDbProduct(row));

  return NextResponse.json({ products, total: count || 0 });
}
