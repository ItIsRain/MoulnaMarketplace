import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/moments/following — moments from shops the current user follows
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ shops: [] });
  }

  // Get followed shop IDs
  const { data: follows } = await supabase
    .from("shop_followers")
    .select("shop_id")
    .eq("follower_id", user.id);

  if (!follows || follows.length === 0) {
    return NextResponse.json({ shops: [] });
  }

  const followedIds = follows.map((f) => f.shop_id);

  // Fetch active moments from followed shops
  const { data: moments } = await supabase
    .from("moments")
    .select("id, shop_id, media_url, media_type, thumbnail_url, caption, view_count, created_at, expires_at")
    .in("shop_id", followedIds)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (!moments || moments.length === 0) {
    return NextResponse.json({ shops: [] });
  }

  // Get viewed status
  const momentIds = moments.map((m) => m.id);
  const { data: views } = await supabase
    .from("moment_views")
    .select("moment_id")
    .eq("viewer_id", user.id)
    .in("moment_id", momentIds);

  const viewedSet = new Set((views || []).map((v) => v.moment_id));

  // Get shop info
  const shopIds = [...new Set(moments.map((m) => m.shop_id))];
  const { data: shops } = await supabase
    .from("shops")
    .select("id, name, slug, avatar_style, avatar_seed, logo_url, is_verified")
    .in("id", shopIds);

  const shopMap = Object.fromEntries((shops || []).map((s) => [s.id, s]));

  // Group by shop
  const grouped: Record<string, typeof moments> = {};
  for (const m of moments) {
    if (!grouped[m.shop_id]) grouped[m.shop_id] = [];
    grouped[m.shop_id].push(m);
  }

  const result = shopIds
    .map((shopId) => {
      const shop = shopMap[shopId];
      if (!shop) return null;
      const shopMoments = grouped[shopId] || [];
      const hasUnseen = shopMoments.some((m) => !viewedSet.has(m.id));
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
          viewed: viewedSet.has(m.id),
        })),
      };
    })
    .filter(Boolean);

  // Unseen first
  result.sort((a, b) => {
    if (a!.hasUnseen && !b!.hasUnseen) return -1;
    if (!a!.hasUnseen && b!.hasUnseen) return 1;
    return 0;
  });

  return NextResponse.json({ shops: result });
}
