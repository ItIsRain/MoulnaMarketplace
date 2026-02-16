import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { mapDbShop } from "@/lib/mappers";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  // Map DB profile to app User shape
  const appUser = {
    id: profile.id,
    name: profile.full_name || "",
    username: profile.username || "",
    email: profile.email || user.email || "",
    phone: profile.phone || undefined,
    role: profile.role || "buyer",
    level: profile.level || 1,
    xp: profile.xp || 0,
    badges: [],
    streakDays: profile.streak_days || 0,
    avatar: {
      style: profile.avatar_style || "adventurer",
      seed: profile.avatar_seed || profile.username || "",
    },
    location: profile.location || undefined,
    joinDate: profile.created_at,
    isVerified: profile.is_verified || false,
    kycStatus: profile.kyc_status || "none",
    onboardingCompleted: profile.onboarding_completed || false,
  };

  // If seller, include their shop
  let shop = null;
  if (["seller", "both"].includes(profile.role)) {
    const { data: shopRow } = await supabase
      .from("shops")
      .select("*")
      .eq("owner_id", user.id)
      .single();

    if (shopRow) {
      shop = mapDbShop(shopRow);
    }
  }

  return NextResponse.json({ user: appUser, shop });
}
