import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    tagline,
    description,
    category,
    location,
    email,
    phone,
    website,
    instagram,
    facebook,
    twitter,
    youtube,
    whatsapp,
    listingPreferences,
  } = body;

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name.trim();
  if (tagline !== undefined) updates.tagline = tagline.trim();
  if (description !== undefined) updates.description = description.trim();
  if (category !== undefined) updates.category = category;
  if (location !== undefined) updates.location = location.trim();
  if (email !== undefined) updates.email = email.trim();
  if (phone !== undefined) updates.phone = phone.trim();
  if (website !== undefined) updates.website = website.trim();
  if (instagram !== undefined) updates.instagram = instagram.trim();
  if (facebook !== undefined) updates.facebook = facebook.trim();
  if (twitter !== undefined) updates.twitter = twitter.trim();
  if (youtube !== undefined) updates.youtube = youtube.trim();
  if (whatsapp !== undefined) updates.whatsapp = whatsapp.trim();
  if (listingPreferences !== undefined)
    updates.listing_preferences = listingPreferences;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  // Verify the user owns this shop
  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (shopError || !shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("shops")
    .update(updates)
    .eq("id", shop.id);

  if (error) {
    console.error("Failed to update shop:", error);
    return NextResponse.json(
      { error: "Failed to update shop" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
