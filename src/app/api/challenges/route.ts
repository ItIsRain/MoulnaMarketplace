import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { awardXP } from "@/lib/gamification";
import { NextRequest, NextResponse } from "next/server";

// Retroactively check real data for one-time/onboarding challenges
// so users who already completed actions before the challenge system see correct progress
async function getRetroactiveProgress(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  eventType: string,
): Promise<number | null> {
  switch (eventType) {
    case "listing_created": {
      const { count } = await admin
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", userId)
        .eq("status", "active");
      return count ?? 0;
    }
    case "product_listed": {
      const { count } = await admin
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", userId)
        .neq("status", "draft");
      return count ?? 0;
    }
    case "review_written": {
      const { count } = await admin
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("reviewer_id", userId);
      return count ?? 0;
    }
    case "seller_contacted": {
      const { count } = await admin
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .or(`participant_1.eq.${userId},participant_2.eq.${userId}`);
      return count ?? 0;
    }
    case "wishlist_added": {
      const { count } = await admin
        .from("wishlists")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      return count ?? 0;
    }
    case "profile_completed": {
      const { data: profile } = await admin
        .from("profiles")
        .select("full_name, avatar_style, avatar_seed")
        .eq("id", userId)
        .maybeSingle();
      if (profile?.full_name && profile?.avatar_style && profile?.avatar_seed) return 1;
      return 0;
    }
    case "shop_created": {
      const { count } = await admin
        .from("shops")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", userId);
      return count ?? 0;
    }
    default:
      return null; // No retroactive check available
  }
}

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
  let userId: string | null = null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      userId = user.id;
      const today = new Date().toISOString().split("T")[0];
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekStartStr = weekStart.toISOString().split("T")[0];
      const monthStart = new Date();
      monthStart.setDate(1);
      const monthStartStr = monthStart.toISOString().split("T")[0];

      // For periodic challenges, filter by period_start
      // For onboarding/special challenges, get all progress (no date filter)
      const { data: periodicProgress } = await admin
        .from("challenge_progress")
        .select("challenge_id, progress, completed, completed_at, period_start")
        .eq("user_id", user.id)
        .or(`period_start.eq.${today},period_start.eq.${weekStartStr},period_start.eq.${monthStartStr}`);

      const { data: permanentProgress } = await admin
        .from("challenge_progress")
        .select("challenge_id, progress, completed, completed_at, period_start")
        .eq("user_id", user.id)
        .in("challenge_id", (challenges || []).filter(c => c.period === "onboarding" || c.period === "special").map(c => c.id));

      const allProgress = [...(periodicProgress || []), ...(permanentProgress || [])];

      allProgress.forEach((p) => {
        // Keep the best progress for each challenge
        const existing = progressMap[p.challenge_id];
        if (!existing || p.progress > existing.progress) {
          progressMap[p.challenge_id] = {
            progress: p.progress || 0,
            completed: p.completed || false,
            completedAt: p.completed_at,
          };
        }
      });
    }
  } catch {
    // Not authenticated — return challenges without progress
  }

  // For onboarding/special challenges, retroactively check real data if no progress tracked yet
  if (userId && challenges) {
    for (const c of challenges) {
      if ((c.period === "onboarding" || c.period === "special") && c.event_type) {
        const tracked = progressMap[c.id];
        if (!tracked || (!tracked.completed && tracked.progress < c.target)) {
          const realProgress = await getRetroactiveProgress(admin, userId, c.event_type);
          if (realProgress !== null) {
            const cappedProgress = Math.min(realProgress, c.target);
            const isCompleted = cappedProgress >= c.target;
            // Use the higher of tracked vs real progress
            if (!tracked || cappedProgress > tracked.progress) {
              progressMap[c.id] = {
                progress: cappedProgress,
                completed: isCompleted,
                completedAt: isCompleted ? new Date().toISOString() : null,
              };

              // Auto-sync progress to the DB so it doesn't need recalculation next time
              if (cappedProgress > 0) {
                const { data: existingRow } = await admin
                  .from("challenge_progress")
                  .select("id, completed")
                  .eq("user_id", userId)
                  .eq("challenge_id", c.id)
                  .maybeSingle();

                const wasAlreadyCompleted = existingRow?.completed === true;

                if (existingRow) {
                  await admin
                    .from("challenge_progress")
                    .update({
                      progress: cappedProgress,
                      completed: isCompleted,
                      completed_at: isCompleted ? new Date().toISOString() : null,
                    })
                    .eq("id", existingRow.id);
                } else {
                  await admin.from("challenge_progress").insert({
                    user_id: userId,
                    challenge_id: c.id,
                    progress: cappedProgress,
                    target: c.target,
                    completed: isCompleted,
                    completed_at: isCompleted ? new Date().toISOString() : null,
                    period_start: "2000-01-01", // permanent challenges use a fixed date
                    tracked_items: [],
                  });
                }

                // Award XP for retroactively completed challenges (only if newly completed)
                if (isCompleted && !wasAlreadyCompleted && c.xp > 0) {
                  // Check xp_events to avoid double-crediting
                  const { count: alreadyAwarded } = await admin
                    .from("xp_events")
                    .select("id", { count: "exact", head: true })
                    .eq("user_id", userId)
                    .eq("action", "challenge_completed")
                    .ilike("description", `%${c.title}%`);

                  if (!alreadyAwarded || alreadyAwarded === 0) {
                    await awardXP({
                      userId,
                      amount: c.xp,
                      action: "challenge_completed",
                      category: "challenge",
                      description: `Completed challenge: ${c.title}`,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
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
