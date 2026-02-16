import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { mapDbProduct } from "@/lib/mappers";

const SHOP_JOIN = "shops!inner(id, owner_id, name, slug, avatar_style, avatar_seed, rating, total_listings, location, is_verified, response_time)";

const ALLOWED_FIELDS = [
  "title", "description", "short_description", "category", "tags",
  "images", "video_url",
  "price_fils", "compare_at_price_fils", "cost_fils",
  "sku", "condition", "variants",
  "status", "listing_duration", "auto_renew", "allow_offers",
  "processing_time", "meetup_preference", "is_handmade",
];

const FIELD_MAP: Record<string, string> = {
  shortDescription: "short_description",
  videoUrl: "video_url",
  priceFils: "price_fils",
  compareAtPriceFils: "compare_at_price_fils",
  costFils: "cost_fils",
  listingDuration: "listing_duration",
  autoRenew: "auto_renew",
  allowOffers: "allow_offers",
  processingTime: "processing_time",
  meetupPreference: "meetup_preference",
  isHandmade: "is_handmade",
};

// GET /api/seller/products/[productId] — get a single product
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: row, error } = await supabase
    .from("products")
    .select(`*, ${SHOP_JOIN}`)
    .eq("id", productId)
    .eq("owner_id", user.id)
    .single();

  if (error || !row) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: mapDbProduct(row) });
}

// PATCH /api/seller/products/[productId] — update a product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("owner_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const body = await request.json();

  // Build update object
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    const dbKey = FIELD_MAP[key] || key;
    if (ALLOWED_FIELDS.includes(dbKey)) {
      updates[dbKey] = value;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const { data: product, error: updateError } = await supabase
    .from("products")
    .update(updates)
    .eq("id", productId)
    .select(`*, ${SHOP_JOIN}`)
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ product: mapDbProduct(product) });
}

// DELETE /api/seller/products/[productId] — delete a product
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("owner_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
