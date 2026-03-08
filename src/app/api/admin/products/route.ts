import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeFilterValue } from "@/lib/utils";

// GET /api/admin/products — list all products for moderation
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim();

  // Build query
  let query = admin
    .from("products")
    .select("id, title, slug, shop_id, category, price_fils, status, inquiry_count, view_count, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    const s = sanitizeFilterValue(search);
    query = query.or(`title.ilike.%${s}%,slug.ilike.%${s}%,category.ilike.%${s}%`);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: products, count } = await query;

  // Get shop info for each product
  const shopIds = [...new Set((products || []).map((p) => p.shop_id).filter(Boolean))];
  let shopMap: Record<string, { name: string; avatarSeed: string | null; avatarStyle: string | null }> = {};

  if (shopIds.length > 0) {
    const { data: shops } = await admin
      .from("shops")
      .select("id, name, avatar_seed, avatar_style")
      .in("id", shopIds);
    shopMap = Object.fromEntries(
      (shops || []).map((s) => [s.id, { name: s.name, avatarSeed: s.avatar_seed, avatarStyle: s.avatar_style }])
    );
  }

  // Status counts
  const { count: totalCount } = await admin
    .from("products")
    .select("id", { count: "exact", head: true });

  const { count: activeCount } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  const { count: pendingCount } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: draftCount } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("status", "draft");

  const items = (products || []).map((p) => {
    const shop = shopMap[p.shop_id] || { name: "Unknown", avatarSeed: null, avatarStyle: null };
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      seller: shop.name,
      sellerAvatarSeed: shop.avatarSeed,
      sellerAvatarStyle: shop.avatarStyle,
      category: p.category || "Other",
      priceFils: p.price_fils || 0,
      status: p.status || "draft",
      rating: 0,
      reviewCount: 0,
      inquiryCount: p.inquiry_count || 0,
      viewCount: p.view_count || 0,
      createdAt: p.created_at,
    };
  });

  return NextResponse.json({
    products: items,
    totalCount: count || 0,
    statusCounts: {
      all: totalCount || 0,
      active: activeCount || 0,
      pending: pendingCount || 0,
      draft: draftCount || 0,
    },
  });
}

// PATCH /api/admin/products — approve, reject, or delete a product
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { productId, action } = body as {
    productId: string;
    action: "approve" | "reject" | "delete";
  };

  if (!productId || !action) {
    return NextResponse.json(
      { error: "productId and action are required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  if (action === "approve") {
    const { error } = await admin
      .from("products")
      .update({ status: "active" })
      .eq("id", productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (action === "reject") {
    const { error } = await admin
      .from("products")
      .update({ status: "hidden" })
      .eq("id", productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (action === "delete") {
    const { error } = await admin
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { error: "Invalid action. Must be approve, reject, or delete." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
