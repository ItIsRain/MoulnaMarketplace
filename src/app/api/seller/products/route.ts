import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { mapDbProduct } from "@/lib/mappers";

// GET /api/seller/products — list seller's own products
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50") || 50, 50);
  const offset = parseInt(searchParams.get("offset") || "0") || 0;

  let query = supabase
    .from("products")
    .select("*, shops!inner(id, owner_id, name, slug, avatar_style, avatar_seed, rating, total_listings, location, is_verified, response_time)", { count: "exact" })
    .eq("owner_id", user.id);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,sku.ilike.%${search}%`);
  }

  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = (data || []).map((row) => mapDbProduct(row));

  return NextResponse.json({ products, total: count || 0 });
}

// Generate a unique slug from title
async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  title: string
): Promise<string> {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);

  let slug = base;
  let attempt = 0;

  while (true) {
    const { data } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;

    attempt++;
    slug = `${base}-${attempt}`;
  }
}

// POST /api/seller/products — create a new product
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get seller's shop
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    return NextResponse.json(
      { error: "You need a shop to create listings" },
      { status: 403 }
    );
  }

  const body = await request.json();

  // Listing limit enforcement: if publishing (not draft), check plan limit
  if (body.status === "active") {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();

    const { count: nonDraftCount } = await admin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", user.id)
      .neq("status", "draft");

    // Get seller's plan from their shop
    const { data: sellerShop } = await admin
      .from("shops")
      .select("plan")
      .eq("owner_id", user.id)
      .single();

    const shopPlan = (sellerShop?.plan as string) || "free";
    const planLimits: Record<string, number> = { free: 3, growth: 30, pro: 999999 };
    const limit = planLimits[shopPlan] ?? 3;

    if ((nonDraftCount ?? 0) >= limit) {
      return NextResponse.json(
        { error: "FREE_LIMIT_REACHED", requiresPayment: true },
        { status: 402 }
      );
    }
  }

  // Validate required fields
  if (!body.title || body.title.length < 3) {
    return NextResponse.json(
      { error: "Title must be at least 3 characters" },
      { status: 400 }
    );
  }

  if (!body.priceFils || body.priceFils <= 0) {
    return NextResponse.json(
      { error: "Price must be greater than 0" },
      { status: 400 }
    );
  }

  const slug = await generateUniqueSlug(supabase, body.title);

  const insertData: Record<string, unknown> = {
    slug,
    owner_id: user.id,
    shop_id: shop.id,
    title: body.title,
    description: body.description || null,
    short_description: body.shortDescription || null,
    category: body.category || null,
    tags: body.tags || [],
    images: body.images || [],
    video_url: body.videoUrl || null,
    price_fils: body.priceFils,
    compare_at_price_fils: body.compareAtPriceFils || null,
    cost_fils: body.costFils || null,
    sku: body.sku || null,
    condition: body.condition || "new",
    variants: body.variants || [],
    status: body.status || "draft",
    listing_duration: body.listingDuration || null,
    auto_renew: body.autoRenew ?? true,
    allow_offers: body.allowOffers ?? true,
    processing_time: body.processingTime || null,
    meetup_preference: body.meetupPreference || null,
    is_handmade: body.isHandmade || false,
    custom_fields: body.customFields || [],
  };

  const { data: product, error: insertError } = await supabase
    .from("products")
    .insert(insertData)
    .select("*, shops!inner(id, owner_id, name, slug, avatar_style, avatar_seed, rating, total_listings, location, is_verified, response_time)")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ product: mapDbProduct(product) }, { status: 201 });
}
