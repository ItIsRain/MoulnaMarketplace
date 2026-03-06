import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { mapDbShop } from "@/lib/mappers";
import { generateSlug, isSlugForbidden } from "@/lib/forbidden-slugs";

// GET /api/shops — list shops (public)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const sort = searchParams.get("sort") || "popular";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabase.from("shops").select("*", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (category && category !== "All") {
    query = query.eq("category", category);
  }
  if (location && location !== "All Emirates") {
    query = query.ilike("location", `%${location}%`);
  }

  switch (sort) {
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "products":
      query = query.order("total_listings", { ascending: false });
      break;
    case "popular":
    default:
      query = query.order("follower_count", { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data: shops, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    shops: (shops || []).map(mapDbShop),
    total: count || 0,
  });
}

// POST /api/shops — create shop (seller only)
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check profile role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["seller", "both"].includes(profile.role)) {
    return NextResponse.json(
      { error: "Only sellers can create shops" },
      { status: 403 }
    );
  }

  // Check if already has a shop
  const { data: existingShop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existingShop) {
    return NextResponse.json(
      { error: "You already have a shop" },
      { status: 409 }
    );
  }

  const body = await request.json();
  const { name, tagline, description, category, location, avatarStyle, avatarSeed, logoUrl, bannerUrl, email, phone } = body;

  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Shop name is required (min 2 characters)" },
      { status: 400 }
    );
  }

  // Generate unique slug
  let slug = generateSlug(name);

  if (!slug) {
    return NextResponse.json(
      { error: "Shop name produces an invalid URL. Try a different name." },
      { status: 400 }
    );
  }

  // Block forbidden/reserved slugs
  if (isSlugForbidden(slug)) {
    return NextResponse.json(
      { error: "This shop name is reserved. Please choose a different name." },
      { status: 400 }
    );
  }

  // Check slug uniqueness, append random suffix if taken
  const { data: slugCheck } = await supabase
    .from("shops")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (slugCheck) {
    slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
  }

  const { data: shop, error: insertError } = await supabase
    .from("shops")
    .insert({
      owner_id: user.id,
      name: name.trim(),
      slug,
      tagline: tagline || null,
      description: description || null,
      category: category || null,
      location: location || null,
      avatar_style: avatarStyle || "adventurer",
      avatar_seed: avatarSeed || slug,
      logo_url: logoUrl || null,
      banner_url: bannerUrl || null,
      email: email || null,
      phone: phone || null,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  // Mark onboarding as completed
  await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  return NextResponse.json({ shop: mapDbShop(shop) }, { status: 201 });
}
