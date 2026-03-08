import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/profile/update — update current user's profile
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Whitelist allowed fields
  const allowedFields: Record<string, string> = {
    name: "full_name",
    username: "username",
    phone: "phone",
    location: "location",
    avatarStyle: "avatar_style",
    avatarSeed: "avatar_seed",
  };

  const updates: Record<string, unknown> = {};
  for (const [key, dbField] of Object.entries(allowedFields)) {
    if (body[key] !== undefined) {
      updates[dbField] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
