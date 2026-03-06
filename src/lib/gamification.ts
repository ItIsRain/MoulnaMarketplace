import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotification } from "@/lib/notifications";

// Award XP to a user via the database function
export async function awardXP(params: {
  userId: string;
  amount: number;
  action: string;
  category?: string;
  description?: string;
  isBonus?: boolean;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("award_xp", {
    p_user_id: params.userId,
    p_amount: params.amount,
    p_action: params.action,
    p_category: params.category || "system",
    p_description: params.description || null,
    p_is_bonus: params.isBonus || false,
    p_metadata: params.metadata || {},
  });

  if (error) {
    console.error("Failed to award XP:", error.message);
    return null;
  }

  const result = data as { xp: number; level: number; leveledUp: boolean; oldLevel: number };

  // Send level-up notification
  if (result.leveledUp) {
    const levelTitles: Record<number, string> = {
      2: "Explorer", 3: "Regular", 4: "Enthusiast", 5: "Connoisseur",
      6: "Trendsetter", 7: "Tastemaker", 8: "Elite", 9: "Legend", 10: "Moulna Patron",
    };
    await sendNotification({
      userId: params.userId,
      type: "level_up",
      title: `Level Up! You're now Level ${result.level}`,
      message: `Congratulations! You've reached ${levelTitles[result.level] || `Level ${result.level}`}. Keep going!`,
      link: "/dashboard/rewards",
      xpAmount: params.amount,
    });
  }

  return result;
}

// Award a badge to a user
export async function awardBadge(params: {
  userId: string;
  badgeId: string;
  xpReward: number;
  badgeName: string;
}) {
  const supabase = createAdminClient();

  // Check if already earned
  const { data: existing } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", params.userId)
    .eq("badge_id", params.badgeId)
    .maybeSingle();

  if (existing) return null; // Already earned

  const { error } = await supabase.from("user_badges").insert({
    user_id: params.userId,
    badge_id: params.badgeId,
    xp_rewarded: params.xpReward,
  });

  if (error) {
    console.error("Failed to award badge:", error.message);
    return null;
  }

  // Award XP for earning badge
  const result = await awardXP({
    userId: params.userId,
    amount: params.xpReward,
    action: "badge_earned",
    category: "achievement",
    description: `Earned "${params.badgeName}" badge`,
    isBonus: true,
  });

  // Notify user
  await sendNotification({
    userId: params.userId,
    type: "badge",
    title: `Badge Earned: ${params.badgeName}!`,
    message: `You've earned the "${params.badgeName}" badge! +${params.xpReward} XP`,
    link: "/dashboard/rewards/badges",
    xpAmount: params.xpReward,
    badgeName: params.badgeName,
  });

  return result;
}

// Update login streak for a user
export async function updateLoginStreak(userId: string) {
  const supabase = createAdminClient();
  // Use UAE timezone (UTC+4) for consistent date comparison
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" });

  // Get or create streak
  const { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .eq("streak_type", "login")
    .maybeSingle();

  if (!streak) {
    // First login ever
    await supabase.from("user_streaks").insert({
      user_id: userId,
      streak_type: "login",
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today,
    });

    await supabase
      .from("profiles")
      .update({ streak_days: 1 })
      .eq("id", userId);

    await awardXP({
      userId,
      amount: 10,
      action: "daily_login",
      category: "streak",
      description: "Daily login bonus",
    });

    return { streak: 1, isNew: true };
  }

  // Already logged in today
  if (streak.last_activity_date === today) {
    return { streak: streak.current_streak, isNew: false };
  }

  // Calculate yesterday in UAE timezone
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" });

  let newStreak: number;
  if (streak.last_activity_date === yesterdayStr) {
    // Consecutive day
    newStreak = streak.current_streak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  const longestStreak = Math.max(newStreak, streak.longest_streak);

  await supabase
    .from("user_streaks")
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today,
    })
    .eq("id", streak.id);

  await supabase
    .from("profiles")
    .update({ streak_days: newStreak })
    .eq("id", userId);

  // Daily login XP
  await awardXP({
    userId,
    amount: 10,
    action: "daily_login",
    category: "streak",
    description: "Daily login bonus",
  });

  // Streak milestone bonuses (badge award includes XP)
  if (newStreak === 7) {
    await awardBadge({
      userId,
      badgeId: "week_warrior",
      xpReward: 100,
      badgeName: "Week Warrior",
    });
  } else if (newStreak === 30) {
    await awardBadge({
      userId,
      badgeId: "monthly_master",
      xpReward: 300,
      badgeName: "Monthly Master",
    });
  }

  return { streak: newStreak, isNew: true };
}
