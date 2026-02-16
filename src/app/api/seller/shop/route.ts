import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { mapDbShop } from "@/lib/mappers";

// GET /api/seller/shop — get the seller's own shop
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: shop, error } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (error || !shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  return NextResponse.json({ shop: mapDbShop(shop) });
}

// Allowed fields for PATCH updates
const ALLOWED_FIELDS = [
  "name", "tagline", "description", "category",
  "avatar_style", "avatar_seed", "logo_url", "banner_url",
  "email", "phone", "website", "location",
  "instagram", "facebook", "twitter", "youtube", "whatsapp",
  "story", "story_sections", "milestones", "core_values",
  "operating_hours", "policies", "branding", "listing_preferences",
  "response_time",
];

// camelCase to snake_case map
const FIELD_MAP: Record<string, string> = {
  avatarStyle: "avatar_style",
  avatarSeed: "avatar_seed",
  logoUrl: "logo_url",
  bannerUrl: "banner_url",
  storySections: "story_sections",
  coreValues: "core_values",
  operatingHours: "operating_hours",
  listingPreferences: "listing_preferences",
  responseTime: "response_time",
};

// PATCH /api/seller/shop — update the seller's shop
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Verify they own a shop
  const { data: existingShop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!existingShop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const body = await request.json();

  // Build update object, converting camelCase to snake_case
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

  const { data: shop, error: updateError } = await supabase
    .from("shops")
    .update(updates)
    .eq("id", existingShop.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ shop: mapDbShop(shop) });
}
