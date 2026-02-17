import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/dashboard/overview — buyer dashboard overview data
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Stats: conversation count
  const { count: conversationCount } = await supabase
    .from("conversations")
    .select("id", { count: "exact", head: true })
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`);

  // Stats: saved items (wishlists)
  const { count: savedItems } = await supabase
    .from("wishlists")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Stats: reviews given
  const { count: reviewsGiven } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("reviewer_id", user.id);

  // Stats: badges earned
  const { count: badgesEarned } = await supabase
    .from("user_badges")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Recent conversations (last 5)
  const { data: convos } = await supabase
    .from("conversations")
    .select("id, participant_1, participant_2, product_id, status, last_message_text, updated_at, created_at")
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order("updated_at", { ascending: false })
    .limit(5);

  // Batch fetch other participants and products
  const otherUserIds = new Set<string>();
  const productIds = new Set<string>();
  (convos || []).forEach((c) => {
    const otherId = c.participant_1 === user.id ? c.participant_2 : c.participant_1;
    otherUserIds.add(otherId);
    if (c.product_id) productIds.add(c.product_id);
  });

  let profileMap: Record<string, { name: string; avatarSeed: string | null; avatarStyle: string | null; level: number }> = {};
  if (otherUserIds.size > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_seed, avatar_style, level")
      .in("id", [...otherUserIds]);
    profileMap = Object.fromEntries(
      (profiles || []).map((p) => [p.id, {
        name: p.full_name || p.username || "User",
        avatarSeed: p.avatar_seed,
        avatarStyle: p.avatar_style,
        level: p.level || 1,
      }])
    );
  }

  let productMap: Record<string, string> = {};
  if (productIds.size > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, title")
      .in("id", [...productIds]);
    productMap = Object.fromEntries(
      (products || []).map((p) => [p.id, p.title])
    );
  }

  // Check unread messages per conversation
  const convoIds = (convos || []).map((c) => c.id);
  let unreadMap: Record<string, boolean> = {};
  if (convoIds.length > 0) {
    const { data: unreadMsgs } = await supabase
      .from("messages")
      .select("conversation_id")
      .in("conversation_id", convoIds)
      .eq("recipient_id", user.id)
      .eq("read", false);
    (unreadMsgs || []).forEach((m) => {
      unreadMap[m.conversation_id] = true;
    });
  }

  const recentConversations = (convos || []).map((c) => {
    const otherId = c.participant_1 === user.id ? c.participant_2 : c.participant_1;
    const other = profileMap[otherId] || { name: "Unknown", avatarSeed: null, avatarStyle: null, level: 1 };
    return {
      id: c.id,
      otherUser: {
        name: other.name,
        avatarSeed: other.avatarSeed,
        avatarStyle: other.avatarStyle,
        level: other.level,
      },
      product: c.product_id ? (productMap[c.product_id] || "Unknown") : "General",
      lastMessage: c.last_message_text || "",
      updatedAt: c.updated_at || c.created_at,
      unread: !!unreadMap[c.id],
    };
  });

  // Recommended products (latest active products, excluding user's own)
  const { data: recommended } = await supabase
    .from("products")
    .select("id, title, slug, price_fils, rating, images")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6);

  const recommendedProducts = (recommended || []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    priceFils: p.price_fils || 0,
    rating: p.rating || 0,
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
  }));

  // Streak data
  const { data: streak } = await supabase
    .from("user_streaks")
    .select("streak_type, current_streak")
    .eq("user_id", user.id);

  const streaks: Record<string, number> = {};
  (streak || []).forEach((s) => {
    streaks[s.streak_type] = s.current_streak || 0;
  });

  return NextResponse.json({
    stats: {
      conversations: conversationCount || 0,
      savedItems: savedItems || 0,
      reviewsGiven: reviewsGiven || 0,
      badgesEarned: badgesEarned || 0,
    },
    recentConversations,
    recommendedProducts,
    streaks: {
      login: streaks["login"] || 0,
      purchase: streaks["purchase"] || 0,
      review: streaks["review"] || 0,
    },
  });
}
