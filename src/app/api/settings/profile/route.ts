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
  const { name, phone, location, avatarStyle, avatarSeed } = body;

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.full_name = name.trim();
  if (phone !== undefined) updates.phone = phone.trim();
  if (location !== undefined) updates.location = location.trim();
  if (avatarStyle !== undefined) updates.avatar_style = avatarStyle;
  if (avatarSeed !== undefined) updates.avatar_seed = avatarSeed;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
