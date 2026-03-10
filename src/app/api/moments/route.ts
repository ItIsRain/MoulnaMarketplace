import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// GET /api/moments — public: list active moments grouped by shop + viewer's seen status
export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: moments } = await supabase
    .from("moments")
    .select("id, shop_id, media_url, media_type, thumbnail_url, caption, view_count, created_at, expires_at")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (!moments || moments.length === 0) {
    return NextResponse.json({ shops: [] });
  }

  // Get which moments this user has already viewed
  let viewedMomentIds: Set<string> = new Set();
  if (user) {
    const momentIds = moments.map((m) => m.id);
    const { data: views } = await supabase
      .from("moment_views")
      .select("moment_id")
      .eq("viewer_id", user.id)
      .in("moment_id", momentIds);
    if (views) {
      viewedMomentIds = new Set(views.map((v) => v.moment_id));
    }
  }

  // Get unique shop IDs
  const shopIds = [...new Set(moments.map((m) => m.shop_id))];

  const { data: shops } = await supabase
    .from("shops")
    .select("id, name, slug, avatar_style, avatar_seed, logo_url, is_verified")
    .in("id", shopIds);

  const shopMap = Object.fromEntries((shops || []).map((s) => [s.id, s]));

  // Group moments by shop
  const grouped: Record<string, typeof moments> = {};
  for (const m of moments) {
    if (!grouped[m.shop_id]) grouped[m.shop_id] = [];
    grouped[m.shop_id].push(m);
  }

  // Build response — unseen shops first, then seen shops
  const allShops = shopIds
    .map((shopId) => {
      const shop = shopMap[shopId];
      if (!shop) return null;
      const shopMoments = grouped[shopId] || [];
      const hasUnseen = shopMoments.some((m) => !viewedMomentIds.has(m.id));
      return {
        shop: {
          id: shop.id,
          name: shop.name,
          slug: shop.slug,
          avatarStyle: shop.avatar_style,
          avatarSeed: shop.avatar_seed,
          logoUrl: shop.logo_url,
          isVerified: shop.is_verified,
        },
        hasUnseen,
        moments: shopMoments.map((m) => ({
          id: m.id,
          mediaUrl: m.media_url,
          mediaType: m.media_type,
          thumbnailUrl: m.thumbnail_url,
          caption: m.caption,
          viewCount: m.view_count,
          createdAt: m.created_at,
          expiresAt: m.expires_at,
          viewed: viewedMomentIds.has(m.id),
        })),
      };
    })
    .filter(Boolean);

  // Sort: unseen shops first
  allShops.sort((a, b) => {
    if (a!.hasUnseen && !b!.hasUnseen) return -1;
    if (!a!.hasUnseen && b!.hasUnseen) return 1;
    return 0;
  });

  return NextResponse.json({ shops: allShops });
}

// POST /api/moments — record a view with engagement tracking
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { momentId, action, watchDurationMs, completed } = body;
  if (!momentId) {
    return NextResponse.json({ error: "momentId required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Track engagement actions (tap_forward, tap_back, link_click, reply)
  if (action && ["tap_forward", "tap_back", "link_click", "reply"].includes(action)) {
    const { error } = await admin.rpc("increment_moment_engagement", { p_moment_id: momentId, p_action: action });
    if (error) console.error("increment_moment_engagement error:", error.message);
    return NextResponse.json({ success: true });
  }

  // Completion update — only update watch duration / completed flag, don't re-count as new view
  if (action === "complete" && user) {
    const { error } = await admin
      .from("moment_views")
      .update({
        watch_duration_ms: watchDurationMs || 0,
        completed: true,
        viewed_at: new Date().toISOString(),
      })
      .eq("moment_id", momentId)
      .eq("viewer_id", user.id);
    if (error) console.error("moment_views completion update error:", error.message);
    return NextResponse.json({ success: true });
  }

  // Record view (first open)
  if (user) {
    const { error } = await admin.rpc("record_moment_view", {
      p_moment_id: momentId,
      p_viewer_id: user.id,
      p_watch_duration_ms: watchDurationMs || 0,
      p_completed: completed || false,
    });
    if (error) console.error("record_moment_view error:", error.message);
  } else {
    // Anonymous: just increment view_count
    const { error } = await admin.rpc("increment_moment_views", { moment_id: momentId });
    if (error) console.error("increment_moment_views error:", error.message);
  }

  return NextResponse.json({ success: true });
}
