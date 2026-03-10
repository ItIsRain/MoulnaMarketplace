import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// GET /api/seller/moments — list seller's moments + analytics
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

  // Analytics section
  if (section === "analytics") {
    const days = parseInt(searchParams.get("days") || "30");
    const admin = createAdminClient();
    const { data: analytics, error } = await admin.rpc("get_moment_analytics", {
      p_owner_id: user.id,
      p_days: Math.min(days, 90),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ analytics: analytics || {} });
  }

  // Viewers for a specific moment
  if (section === "viewers") {
    const momentId = searchParams.get("momentId");
    if (!momentId) {
      return NextResponse.json({ error: "momentId required" }, { status: 400 });
    }

    // Verify ownership
    const admin = createAdminClient();
    const { data: moment } = await admin
      .from("moments")
      .select("id")
      .eq("id", momentId)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!moment) {
      return NextResponse.json({ error: "Moment not found" }, { status: 404 });
    }

    const { data: views } = await admin
      .from("moment_views")
      .select("viewer_id, viewed_at, watch_duration_ms, completed")
      .eq("moment_id", momentId)
      .order("viewed_at", { ascending: false })
      .limit(50);

    if (!views || views.length === 0) {
      return NextResponse.json({ viewers: [] });
    }

    const viewerIds = views.map((v) => v.viewer_id);
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, full_name, username, avatar_style, avatar_seed, level")
      .in("id", viewerIds);

    const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));

    const viewers = views.map((v) => {
      const p = profileMap[v.viewer_id];
      return {
        id: v.viewer_id,
        name: p?.full_name || p?.username || "User",
        username: p?.username,
        avatarStyle: p?.avatar_style || "adventurer",
        avatarSeed: p?.avatar_seed || "",
        level: p?.level || 1,
        viewedAt: v.viewed_at,
        watchDurationMs: v.watch_duration_ms,
        completed: v.completed,
      };
    });

    return NextResponse.json({ viewers });
  }

  // Default: list all moments with per-moment stats
  const admin = createAdminClient();
  const { data: moments } = await admin
    .from("moments")
    .select("id, shop_id, media_url, media_type, thumbnail_url, caption, view_count, unique_viewers, taps_forward, taps_back, link_clicks, replies, created_at, expires_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    moments: (moments || []).map((m) => {
      const isExpired = new Date(m.expires_at) <= new Date();
      const totalEngagement = m.view_count + m.taps_forward + m.taps_back + m.link_clicks + m.replies;
      const retentionRate = m.view_count > 0
        ? Math.round(((m.view_count - m.taps_forward) / m.view_count) * 100)
        : 0;

      return {
        id: m.id,
        mediaUrl: m.media_url,
        mediaType: m.media_type,
        thumbnailUrl: m.thumbnail_url,
        caption: m.caption,
        viewCount: m.view_count,
        uniqueViewers: m.unique_viewers,
        tapsForward: m.taps_forward,
        tapsBack: m.taps_back,
        linkClicks: m.link_clicks,
        replies: m.replies,
        engagement: totalEngagement,
        retentionRate,
        createdAt: m.created_at,
        expiresAt: m.expires_at,
        isExpired,
      };
    }),
  });
}

// POST /api/seller/moments — create a new moment
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!shop) {
    return NextResponse.json({ error: "You need a shop to post moments" }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { mediaUrl, mediaType, thumbnailUrl, caption } = body;

  if (!mediaUrl || !mediaType) {
    return NextResponse.json({ error: "mediaUrl and mediaType are required" }, { status: 400 });
  }

  if (!["image", "video"].includes(mediaType)) {
    return NextResponse.json({ error: "mediaType must be image or video" }, { status: 400 });
  }

  // Plan-based moment limits
  const { data: shopData } = await supabase
    .from("shops")
    .select("plan")
    .eq("id", shop.id)
    .single();

  const shopPlan = (shopData?.plan as string) || "free";
  const momentLimits: Record<string, number> = { free: 3, growth: 10, pro: 999999 };
  const maxMoments = momentLimits[shopPlan] ?? 3;

  const { count } = await supabase
    .from("moments")
    .select("id", { count: "exact", head: true })
    .eq("shop_id", shop.id)
    .gt("expires_at", new Date().toISOString());

  if (count && count >= maxMoments) {
    const planName = shopPlan === "free" ? "Starter" : shopPlan.charAt(0).toUpperCase() + shopPlan.slice(1);
    return NextResponse.json(
      { error: `${planName} plan allows up to ${maxMoments} active moments. Upgrade your plan for more.`, limit: maxMoments, plan: shopPlan },
      { status: 400 }
    );
  }

  const { data: moment, error } = await supabase
    .from("moments")
    .insert({
      shop_id: shop.id,
      owner_id: user.id,
      media_url: mediaUrl,
      media_type: mediaType,
      thumbnail_url: thumbnailUrl || null,
      caption: caption?.slice(0, 200) || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    moment: {
      id: moment.id,
      mediaUrl: moment.media_url,
      mediaType: moment.media_type,
      thumbnailUrl: moment.thumbnail_url,
      caption: moment.caption,
      createdAt: moment.created_at,
      expiresAt: moment.expires_at,
    },
  });
}

// DELETE /api/seller/moments?id=<momentId>
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const momentId = searchParams.get("id");

  if (!momentId) {
    return NextResponse.json({ error: "Moment ID required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("moments")
    .delete()
    .eq("id", momentId)
    .eq("owner_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
