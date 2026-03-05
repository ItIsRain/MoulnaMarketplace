import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/stats — platform-wide admin statistics
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  // ==================== DASHBOARD OVERVIEW ====================
  if (!section || section === "overview") {
    // Total users
    const { count: totalUsers } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true });

    // Sellers (role = seller or both)
    const { count: totalSellers } = await admin
      .from("shops")
      .select("id", { count: "exact", head: true });

    // Total products
    const { count: totalProducts } = await admin
      .from("products")
      .select("id", { count: "exact", head: true });

    const { count: activeProducts } = await admin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "active");

    const { count: pendingProducts } = await admin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    // Total conversations (inquiries)
    const { count: totalConversations } = await admin
      .from("conversations")
      .select("id", { count: "exact", head: true });

    // Conversations this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { count: monthlyConversations } = await admin
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart.toISOString());

    // Sold conversations (revenue)
    const { data: soldConvs } = await admin
      .from("conversations")
      .select("sale_price_fils")
      .eq("status", "sold");

    const totalRevenue = (soldConvs || []).reduce((sum, c) => sum + (c.sale_price_fils || 0), 0);

    // Monthly revenue
    const { data: monthlySoldConvs } = await admin
      .from("conversations")
      .select("sale_price_fils")
      .eq("status", "sold")
      .gte("created_at", monthStart.toISOString());

    const monthlyRevenue = (monthlySoldConvs || []).reduce((sum, c) => sum + (c.sale_price_fils || 0), 0);

    // Pending KYC
    const { count: pendingKyc } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .in("kyc_status", ["pending", "in_progress", "in_review"]);

    // Top sellers by inquiry count
    const { data: shops } = await admin
      .from("shops")
      .select("id, name, slug, owner_id, avatar_style, avatar_seed, total_listings, follower_count, rating")
      .order("total_listings", { ascending: false })
      .limit(5);

    // Recent conversations as activity
    const { data: recentConvos } = await admin
      .from("conversations")
      .select("id, product_id, status, created_at, participant_1, participant_2")
      .order("created_at", { ascending: false })
      .limit(10);

    // Get participant profiles for recent activity
    const participantIds = new Set<string>();
    (recentConvos || []).forEach((c) => {
      participantIds.add(c.participant_1);
      participantIds.add(c.participant_2);
    });

    let profileMap: Record<string, string> = {};
    if (participantIds.size > 0) {
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, full_name, username")
        .in("id", [...participantIds]);
      profileMap = Object.fromEntries(
        (profiles || []).map((p) => [p.id, p.full_name || p.username || "User"])
      );
    }

    // Get product titles for recent activity
    const productIds = [...new Set((recentConvos || []).map((c) => c.product_id).filter(Boolean))];
    let productMap: Record<string, string> = {};
    if (productIds.length > 0) {
      const { data: products } = await admin
        .from("products")
        .select("id, title")
        .in("id", productIds as string[]);
      productMap = Object.fromEntries(
        (products || []).map((p) => [p.id, p.title])
      );
    }

    const recentActivity = (recentConvos || []).map((c) => ({
      id: c.id,
      buyer: profileMap[c.participant_1] || "Unknown",
      seller: profileMap[c.participant_2] || "Unknown",
      product: c.product_id ? (productMap[c.product_id] || "Unknown") : "General",
      status: c.status,
      createdAt: c.created_at,
    }));

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalSellers: totalSellers || 0,
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        pendingProducts: pendingProducts || 0,
        totalConversations: totalConversations || 0,
        monthlyConversations: monthlyConversations || 0,
        totalRevenue,
        monthlyRevenue,
        pendingKyc: pendingKyc || 0,
      },
      topSellers: (shops || []).map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        avatarStyle: s.avatar_style,
        avatarSeed: s.avatar_seed,
        totalListings: s.total_listings || 0,
        followerCount: s.follower_count || 0,
        rating: s.rating || 0,
      })),
      recentActivity,
    });
  }

  // ==================== INQUIRIES (ORDERS) ====================
  if (section === "inquiries") {
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const offset = (page - 1) * limit;
    const status = searchParams.get("status");

    let query = admin
      .from("conversations")
      .select("id, participant_1, participant_2, product_id, status, created_at, sale_price_fils, last_message_text", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Note: search filtering is done client-side for inquiries since it involves joined data

    const { data: convos, count } = await query;

    // Batch fetch participants and products
    const allUserIds = new Set<string>();
    const allProductIds = new Set<string>();
    (convos || []).forEach((c) => {
      allUserIds.add(c.participant_1);
      allUserIds.add(c.participant_2);
      if (c.product_id) allProductIds.add(c.product_id);
    });

    let profileMap: Record<string, { name: string; avatarSeed: string | null; avatarStyle: string | null }> = {};
    if (allUserIds.size > 0) {
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, full_name, username, avatar_seed, avatar_style")
        .in("id", [...allUserIds]);
      profileMap = Object.fromEntries(
        (profiles || []).map((p) => [p.id, {
          name: p.full_name || p.username || "User",
          avatarSeed: p.avatar_seed,
          avatarStyle: p.avatar_style,
        }])
      );
    }

    let productMap: Record<string, string> = {};
    if (allProductIds.size > 0) {
      const { data: products } = await admin
        .from("products")
        .select("id, title")
        .in("id", [...allProductIds]);
      productMap = Object.fromEntries(
        (products || []).map((p) => [p.id, p.title])
      );
    }

    const inquiries = (convos || []).map((c) => {
      const buyer = profileMap[c.participant_1] || { name: "Unknown", avatarSeed: null, avatarStyle: null };
      const seller = profileMap[c.participant_2] || { name: "Unknown", avatarSeed: null, avatarStyle: null };

      return {
        id: c.id,
        buyer: { name: buyer.name, avatarSeed: buyer.avatarSeed, avatarStyle: buyer.avatarStyle },
        seller: { name: seller.name, avatarSeed: seller.avatarSeed, avatarStyle: seller.avatarStyle },
        product: c.product_id ? (productMap[c.product_id] || "Unknown") : "General",
        status: c.status,
        lastMessage: c.last_message_text,
        salePriceFils: c.sale_price_fils,
        createdAt: c.created_at,
      };
    });

    // Status counts
    const { count: newCount } = await admin
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    const { count: repliedCount } = await admin
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("status", "replied");
    const { count: soldCount } = await admin
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("status", "sold");
    const { count: archivedCount } = await admin
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("status", "archived");

    return NextResponse.json({
      inquiries,
      totalCount: count || 0,
      statusCounts: {
        all: (newCount || 0) + (repliedCount || 0) + (soldCount || 0) + (archivedCount || 0),
        new: newCount || 0,
        replied: repliedCount || 0,
        sold: soldCount || 0,
        archived: archivedCount || 0,
      },
    });
  }

  // ==================== ANALYTICS ====================
  if (section === "analytics") {
    // Total counts
    const { count: totalUsers } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true });
    const { count: totalShops } = await admin
      .from("shops")
      .select("id", { count: "exact", head: true });
    const { count: totalProducts } = await admin
      .from("products")
      .select("id", { count: "exact", head: true });
    const { count: totalConversations } = await admin
      .from("conversations")
      .select("id", { count: "exact", head: true });

    // Products by category
    const { data: products } = await admin
      .from("products")
      .select("category");

    const categoryMap: Record<string, number> = {};
    (products || []).forEach((p) => {
      const cat = p.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const totalProductCount = products?.length || 1;
    const byCategory = Object.entries(categoryMap)
      .map(([category, count]) => ({
        category,
        listings: count,
        percentage: Math.round((count / totalProductCount) * 100),
      }))
      .sort((a, b) => b.listings - a.listings);

    // Sold revenue
    const { data: soldConvs } = await admin
      .from("conversations")
      .select("sale_price_fils")
      .eq("status", "sold");
    const totalRevenue = (soldConvs || []).reduce((sum, c) => sum + (c.sale_price_fils || 0), 0);

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalShops: totalShops || 0,
      totalProducts: totalProducts || 0,
      totalConversations: totalConversations || 0,
      totalRevenue,
      byCategory,
    });
  }

  return NextResponse.json({ error: "Unknown section" }, { status: 400 });
}
