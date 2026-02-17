import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { updateLoginStreak } from "@/lib/gamification";

// GET /api/gamification — returns user's gamification data
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  // Get user profile for XP/level
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, level, streak_days")
    .eq("id", user.id)
    .single();

  // XP History
  if (section === "history") {
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const offset = (page - 1) * limit;
    const category = searchParams.get("category");

    let query = supabase
      .from("xp_events")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("category", category);
    }

    const { data: events, count } = await query;

    // Monthly XP
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { data: monthlyEvents } = await supabase
      .from("xp_events")
      .select("amount")
      .eq("user_id", user.id)
      .gte("created_at", monthStart.toISOString());

    const monthlyXP = (monthlyEvents || []).reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({
      events: (events || []).map((e) => ({
        id: e.id,
        amount: e.amount,
        action: e.action,
        category: e.category,
        description: e.description,
        isBonus: e.is_bonus,
        createdAt: e.created_at,
      })),
      totalCount: count || 0,
      stats: {
        totalXP: profile?.xp || 0,
        monthlyXP,
        level: profile?.level || 1,
      },
    });
  }

  // Badges
  if (section === "badges") {
    const { data: badges } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false });

    return NextResponse.json({
      badges: (badges || []).map((b) => ({
        id: b.id,
        badgeId: b.badge_id,
        earnedAt: b.earned_at,
        xpRewarded: b.xp_rewarded,
      })),
    });
  }

  // Streaks
  if (section === "streaks") {
    const { data: streaks } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id);

    return NextResponse.json({
      streaks: (streaks || []).map((s) => ({
        type: s.streak_type,
        currentStreak: s.current_streak,
        longestStreak: s.longest_streak,
        lastActivityDate: s.last_activity_date,
      })),
      currentLoginStreak: profile?.streak_days || 0,
    });
  }

  // Challenges
  if (section === "challenges") {
    const today = new Date().toISOString().split("T")[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const { data: progress } = await supabase
      .from("challenge_progress")
      .select("*")
      .eq("user_id", user.id)
      .or(`period_start.eq.${today},period_start.eq.${weekStartStr}`);

    return NextResponse.json({
      progress: (progress || []).map((p) => ({
        challengeId: p.challenge_id,
        progress: p.progress,
        target: p.target,
        completed: p.completed,
        completedAt: p.completed_at,
        periodStart: p.period_start,
      })),
    });
  }

  // Default: overview (XP, level, streak, badge count)
  const { count: badgeCount } = await supabase
    .from("user_badges")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: streak } = await supabase
    .from("user_streaks")
    .select("current_streak, longest_streak")
    .eq("user_id", user.id)
    .eq("streak_type", "login")
    .maybeSingle();

  return NextResponse.json({
    xp: profile?.xp || 0,
    level: profile?.level || 1,
    streakDays: streak?.current_streak || profile?.streak_days || 0,
    longestStreak: streak?.longest_streak || 0,
    badgeCount: badgeCount || 0,
  });
}

// POST /api/gamification — record login streak
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
  const { action } = body;

  if (action === "login_streak") {
    const result = await updateLoginStreak(user.id);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
