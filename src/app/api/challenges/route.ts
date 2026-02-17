import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// GET /api/challenges — list challenge definitions, optionally with user progress
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period"); // daily, weekly, monthly, special, onboarding
  const audience = searchParams.get("audience"); // buyer, seller

  const admin = createAdminClient();

  let query = admin
    .from("challenges")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (period) {
    query = query.eq("period", period);
  }
  if (audience) {
    query = query.or(`audience.eq.${audience},audience.eq.all`);
  }

  const { data: challenges } = await query;

  // Try to get user progress if authenticated
  let progressMap: Record<string, { progress: number; completed: boolean; completedAt: string | null }> = {};

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const today = new Date().toISOString().split("T")[0];
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekStartStr = weekStart.toISOString().split("T")[0];
      const monthStart = new Date();
      monthStart.setDate(1);
      const monthStartStr = monthStart.toISOString().split("T")[0];

      const { data: progress } = await admin
        .from("challenge_progress")
        .select("challenge_id, progress, completed, completed_at, period_start")
        .eq("user_id", user.id)
        .or(`period_start.eq.${today},period_start.eq.${weekStartStr},period_start.eq.${monthStartStr}`);

      (progress || []).forEach((p) => {
        progressMap[p.challenge_id] = {
          progress: p.progress || 0,
          completed: p.completed || false,
          completedAt: p.completed_at,
        };
      });
    }
  } catch {
    // Not authenticated — return challenges without progress
  }

  const items = (challenges || []).map((c) => {
    const prog = progressMap[c.id];
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      icon: c.icon,
      xp: c.xp,
      target: c.target,
      period: c.period,
      audience: c.audience,
      bonusReward: c.bonus_reward,
      endsAt: c.ends_at,
      progress: prog?.progress || 0,
      completed: prog?.completed || false,
      completedAt: prog?.completedAt || null,
    };
  });

  return NextResponse.json({ challenges: items });
}
