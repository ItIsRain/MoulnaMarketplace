import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// GET /api/profiles/[username] — public profile data (no auth required)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username || username.length < 2) {
    return NextResponse.json(
      { error: "Invalid username" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Fetch profile by username (only non-sensitive fields)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, full_name, username, avatar_style, avatar_seed, level, xp, location, created_at"
    )
    .eq("username", username)
    .eq("status", "active")
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // Fetch user badges
  const { data: badges } = await supabase
    .from("user_badges")
    .select("id, badge_id, earned_at, xp_rewarded")
    .eq("user_id", profile.id)
    .order("earned_at", { ascending: false });

  // Fetch badge count
  const badgeCount = badges?.length ?? 0;

  // Fetch xp_events count as a proxy for activity/review count
  const { count: xpEventCount } = await supabase
    .from("xp_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);

  // Fetch login streak
  const { data: streak } = await supabase
    .from("user_streaks")
    .select("current_streak, longest_streak")
    .eq("user_id", profile.id)
    .eq("streak_type", "login")
    .maybeSingle();

  // Check if user is a seller and get their shop follower count
  let followerCount = 0;
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", profile.id)
    .maybeSingle();

  if (shop) {
    const { count } = await supabase
      .from("shop_followers")
      .select("id", { count: "exact", head: true })
      .eq("shop_id", shop.id);
    followerCount = count ?? 0;
  }

  return NextResponse.json({
    profile: {
      id: profile.id,
      fullName: profile.full_name || "",
      username: profile.username || "",
      avatarStyle: profile.avatar_style || "adventurer",
      avatarSeed: profile.avatar_seed || profile.username || "",
      level: profile.level || 1,
      xp: profile.xp || 0,
      location: profile.location || null,
      createdAt: profile.created_at,
    },
    badges: (badges || []).map((b) => ({
      id: b.id,
      badgeId: b.badge_id,
      earnedAt: b.earned_at,
      xpRewarded: b.xp_rewarded,
    })),
    stats: {
      badgeCount,
      xpEventCount: xpEventCount ?? 0,
      followerCount,
      streakDays: streak?.current_streak ?? 0,
      longestStreak: streak?.longest_streak ?? 0,
    },
  });
}
