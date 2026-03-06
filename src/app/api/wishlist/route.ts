import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { mapDbProduct } from "@/lib/mappers";
import { awardXP } from "@/lib/gamification";

// GET /api/wishlist — fetch current user's wishlist with product details
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: wishlistItems, error } = await supabase
    .from("wishlists")
    .select("id, product_id, created_at, products(*, shops(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (wishlistItems || []).map((item) => ({
    id: item.id,
    productId: item.product_id,
    addedAt: item.created_at,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: item.products ? mapDbProduct(item.products as any, (item.products as any).shops) : null,
  }));

  return NextResponse.json({ items });
}

// POST /api/wishlist — add a product to wishlist
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { productId } = body;

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  // Verify product exists
  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("wishlists")
    .upsert(
      { user_id: user.id, product_id: productId },
      { onConflict: "user_id,product_id" }
    )
    .select("id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Award 5 XP for saving a listing (only if newly created, not re-saved)
  if (data.created_at && (Date.now() - new Date(data.created_at).getTime()) < 5000) {
    await awardXP({
      userId: user.id,
      amount: 5,
      action: "save_listing",
      category: "engagement",
      description: "Saved a listing to wishlist",
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, wishlistId: data.id });
}

// DELETE /api/wishlist — remove a product from wishlist
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
