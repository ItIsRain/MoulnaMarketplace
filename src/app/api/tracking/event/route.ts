import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { awardXP, awardBadge } from "@/lib/gamification";
import { NextRequest, NextResponse } from "next/server";

function getPeriodStart(period: string): string {
  const now = new Date();
  if (period === "daily") {
    return now.toISOString().split("T")[0];
  }
  if (period === "weekly") {
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    return weekStart.toISOString().split("T")[0];
  }
  if (period === "onboarding" || period === "special") {
    return "2000-01-01"; // permanent challenges use a fixed date
  }
  // monthly
  const monthStart = new Date(now);
  monthStart.setDate(1);
  return monthStart.toISOString().split("T")[0];
}

// POST /api/tracking/event — track user activity and update challenge progress
export async function POST(req: NextRequest) {
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
  const { eventType, itemId } = body as { eventType: string; itemId?: string };

  if (!eventType) {
    return NextResponse.json({ error: "Missing eventType" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Query matching challenges from DB by event_type
  const { data: challenges } = await admin
    .from("challenges")
    .select("*")
    .eq("event_type", eventType)
    .eq("is_active", true);

  if (!challenges || challenges.length === 0) {
    return NextResponse.json({ ok: true, updated: [] });
  }

  const updated: string[] = [];

  for (const challenge of challenges) {
    const periodStart = getPeriodStart(challenge.period);

    // Get or create challenge_progress row
    const { data: existing } = await admin
      .from("challenge_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("challenge_id", challenge.id)
      .eq("period_start", periodStart)
      .maybeSingle();

    if (existing?.completed) {
      continue; // Already completed this period
    }

    let trackedItems: string[] = [];
    let currentProgress = 0;

    if (existing) {
      trackedItems = Array.isArray(existing.tracked_items) ? existing.tracked_items : [];
      currentProgress = existing.progress || 0;
    }

    // For distinct tracking, check if item already counted
    if (challenge.distinct_tracking && itemId) {
      if (trackedItems.includes(itemId)) {
        continue; // Already tracked this item
      }
      trackedItems = [...trackedItems, itemId];
    }

    const newProgress = currentProgress + 1;
    const isCompleted = newProgress >= challenge.target;

    if (existing) {
      await admin
        .from("challenge_progress")
        .update({
          progress: newProgress,
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          tracked_items: trackedItems,
        })
        .eq("id", existing.id);
    } else {
      await admin.from("challenge_progress").insert({
        user_id: user.id,
        challenge_id: challenge.id,
        progress: newProgress,
        target: challenge.target,
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
        period_start: periodStart,
        tracked_items: trackedItems,
      });
    }

    updated.push(challenge.id);

    // Award XP on completion
    if (isCompleted) {
      await awardXP({
        userId: user.id,
        amount: challenge.xp,
        action: "challenge_completed",
        category: "challenge",
        description: `Completed challenge: ${challenge.title}`,
      });

      // Check badge milestones
      await checkBadgeMilestones(admin, user.id, eventType);
    }
  }

  return NextResponse.json({ ok: true, updated });
}

// Check if event triggers any badge awards
async function checkBadgeMilestones(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  eventType: string
) {
  if (eventType === "seller_contacted") {
    // "First Inquiry" badge
    const { count } = await admin
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`);

    if (count === 1) {
      await awardBadge({
        userId,
        badgeId: "first_inquiry",
        xpReward: 50,
        badgeName: "First Inquiry",
      });
    }
    if (count && count >= 10) {
      await awardBadge({
        userId,
        badgeId: "explorer",
        xpReward: 200,
        badgeName: "Explorer",
      });
    }
  }

  if (eventType === "review_written") {
    const { count } = await admin
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("reviewer_id", userId);

    if (count === 1) {
      await awardBadge({
        userId,
        badgeId: "first_review",
        xpReward: 30,
        badgeName: "Reviewer",
      });
    }
  }
}
