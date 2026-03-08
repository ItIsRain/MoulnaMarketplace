import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { isValidUUID } from "@/lib/utils";

// GET /api/seller/analytics — seller analytics data
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get seller's shop
  const { data: shop } = await supabase
    .from("shops")
    .select("id, owner_id, total_listings, follower_count, rating, review_count, created_at")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!shop) {
    return NextResponse.json({ error: "No shop found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const period = searchParams.get("period") || "30d";

  // Calculate date ranges
  const now = new Date();
  const periodDays = period === "7d" ? 7 : period === "90d" ? 90 : period === "1y" ? 365 : 30;
  const periodStart = new Date(now);
  periodStart.setDate(periodStart.getDate() - periodDays);
  const prevPeriodStart = new Date(periodStart);
  prevPeriodStart.setDate(prevPeriodStart.getDate() - periodDays);

  const periodStartStr = periodStart.toISOString();
  const prevPeriodStartStr = prevPeriodStart.toISOString();

  // ==================== OVERVIEW ====================
  if (!section || section === "overview") {
    // Get all products for this shop
    const { data: products } = await supabase
      .from("products")
      .select("id, title, slug, inquiry_count, view_count, status, price_fils, created_at")
      .eq("shop_id", shop.id)
      .order("inquiry_count", { ascending: false });

    const allProducts = products || [];
    const activeProducts = allProducts.filter((p) => p.status === "active");

    // Total views & inquiries from products
    const totalViews = allProducts.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const totalInquiries = allProducts.reduce((sum, p) => sum + (p.inquiry_count || 0), 0);

    // Inquiries in current period (conversations with product_id where product belongs to seller)
    const productIds = allProducts.map((p) => p.id);

    let currentInquiries = 0;
    let prevInquiries = 0;
    let soldCount = 0;
    let totalRevenue = 0;

    if (productIds.length > 0) {
      const { count: currentCount } = await supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .in("product_id", productIds)
        .gte("created_at", periodStartStr);
      currentInquiries = currentCount || 0;

      const { count: prevCount } = await supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .in("product_id", productIds)
        .gte("created_at", prevPeriodStartStr)
        .lt("created_at", periodStartStr);
      prevInquiries = prevCount || 0;

      // Sales (conversations marked as sold)
      const { data: soldConvs } = await supabase
        .from("conversations")
        .select("id, sale_price_fils")
        .in("product_id", productIds)
        .eq("status", "sold");
      soldCount = soldConvs?.length || 0;
      totalRevenue = (soldConvs || []).reduce((sum, c) => sum + (c.sale_price_fils || 0), 0);
    }

    // Followers in current period
    const { count: currentFollowers } = await supabase
      .from("shop_followers")
      .select("id", { count: "exact", head: true })
      .eq("shop_id", shop.id)
      .gte("created_at", periodStartStr);

    const { count: prevFollowers } = await supabase
      .from("shop_followers")
      .select("id", { count: "exact", head: true })
      .eq("shop_id", shop.id)
      .gte("created_at", prevPeriodStartStr)
      .lt("created_at", periodStartStr);

    // Compute trends
    const inquiryTrend = prevInquiries > 0 ? ((currentInquiries - prevInquiries) / prevInquiries) * 100 : 0;
    const followerTrend = (prevFollowers || 0) > 0 ? (((currentFollowers || 0) - (prevFollowers || 0)) / (prevFollowers || 1)) * 100 : 0;

    // Conversion rate (sold / total inquiries)
    const conversionRate = totalInquiries > 0 ? (soldCount / totalInquiries) * 100 : 0;

    // Top products
    const topProducts = allProducts.slice(0, 5).map((p, i) => ({
      rank: i + 1,
      id: p.id,
      title: p.title,
      slug: p.slug,
      inquiries: p.inquiry_count || 0,
      views: p.view_count || 0,
    }));

    // Unread messages count
    const { count: unreadMessages } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", user.id)
      .eq("read", false);

    return NextResponse.json({
      stats: {
        totalListings: shop.total_listings || allProducts.length,
        activeListings: activeProducts.length,
        totalInquiries,
        currentInquiries,
        inquiryTrend: Math.round(inquiryTrend * 10) / 10,
        totalViews,
        totalFollowers: shop.follower_count || 0,
        newFollowers: currentFollowers || 0,
        followerTrend: Math.round(followerTrend * 10) / 10,
        soldCount,
        totalRevenue,
        conversionRate: Math.round(conversionRate * 10) / 10,
        unreadMessages: unreadMessages || 0,
        rating: shop.rating || 0,
        reviewCount: shop.review_count || 0,
      },
      topProducts,
      period,
    });
  }

  // ==================== SALES / INQUIRY ANALYTICS ====================
  if (section === "sales") {
    const { data: products } = await supabase
      .from("products")
      .select("id, title, category, inquiry_count, view_count")
      .eq("shop_id", shop.id);

    const allProducts = products || [];
    const productIds = allProducts.map((p) => p.id);

    // Inquiries over time (grouped by day)
    let inquiryTimeline: { date: string; count: number }[] = [];
    let totalConversations = 0;

    if (productIds.length > 0) {
      const { data: convos } = await supabase
        .from("conversations")
        .select("id, created_at, status")
        .in("product_id", productIds)
        .gte("created_at", periodStartStr)
        .order("created_at", { ascending: true });

      totalConversations = convos?.length || 0;

      // Group by day
      const dayMap: Record<string, number> = {};
      (convos || []).forEach((c) => {
        const day = new Date(c.created_at).toISOString().split("T")[0];
        dayMap[day] = (dayMap[day] || 0) + 1;
      });
      inquiryTimeline = Object.entries(dayMap).map(([date, count]) => ({ date, count }));
    }

    // By category
    const categoryMap: Record<string, { inquiries: number; views: number }> = {};
    allProducts.forEach((p) => {
      const cat = p.category || "Other";
      if (!categoryMap[cat]) categoryMap[cat] = { inquiries: 0, views: 0 };
      categoryMap[cat].inquiries += p.inquiry_count || 0;
      categoryMap[cat].views += p.view_count || 0;
    });
    const totalInquiries = allProducts.reduce((sum, p) => sum + (p.inquiry_count || 0), 0);
    const byCategory = Object.entries(categoryMap)
      .map(([category, data]) => ({
        category,
        inquiries: data.inquiries,
        views: data.views,
        percentage: totalInquiries > 0 ? Math.round((data.inquiries / totalInquiries) * 100) : 0,
      }))
      .sort((a, b) => b.inquiries - a.inquiries);

    // Top products
    const topProducts = [...allProducts]
      .sort((a, b) => (b.inquiry_count || 0) - (a.inquiry_count || 0))
      .slice(0, 5)
      .map((p) => ({
        name: p.title,
        inquiries: p.inquiry_count || 0,
        views: p.view_count || 0,
      }));

    // Avg response time (seller's first reply in conversations)
    let avgResponseMinutes = 0;
    if (productIds.length > 0) {
      const { data: recentConvos } = await supabase
        .from("conversations")
        .select("id, created_at")
        .in("product_id", productIds)
        .order("created_at", { ascending: false })
        .limit(20);

      if (recentConvos && recentConvos.length > 0) {
        const responseTimes: number[] = [];
        for (const conv of recentConvos.slice(0, 10)) {
          const { data: firstReply } = await supabase
            .from("messages")
            .select("created_at")
            .eq("conversation_id", conv.id)
            .eq("sender_id", user.id)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle();
          if (firstReply) {
            const diff = new Date(firstReply.created_at).getTime() - new Date(conv.created_at).getTime();
            responseTimes.push(diff / 60000); // minutes
          }
        }
        if (responseTimes.length > 0) {
          avgResponseMinutes = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        }
      }
    }

    return NextResponse.json({
      totalInquiries,
      totalConversations,
      avgResponseMinutes: Math.round(avgResponseMinutes),
      inquiryTimeline,
      byCategory,
      topProducts,
      period,
    });
  }

  // ==================== CUSTOMERS ====================
  if (section === "customers") {
    const { data: products } = await supabase
      .from("products")
      .select("id")
      .eq("shop_id", shop.id);

    const productIds = (products || []).map((p) => p.id);

    if (productIds.length === 0) {
      return NextResponse.json({
        totalCustomers: 0,
        newCustomers: 0,
        returningRate: 0,
        totalFollowers: shop.follower_count || 0,
        customers: [],
        byLocation: [],
      });
    }

    // Get all conversations for seller's products
    const { data: convos } = await supabase
      .from("conversations")
      .select("id, participant_1, participant_2, product_id, created_at, status")
      .in("product_id", productIds);

    // Identify unique customers (the participant who is NOT the seller)
    const customerConvMap: Record<string, { count: number; lastAt: string; convIds: string[] }> = {};
    (convos || []).forEach((c) => {
      const customerId = c.participant_1 === user.id ? c.participant_2 : c.participant_1;
      if (!customerConvMap[customerId]) {
        customerConvMap[customerId] = { count: 0, lastAt: c.created_at, convIds: [] };
      }
      customerConvMap[customerId].count++;
      customerConvMap[customerId].convIds.push(c.id);
      if (c.created_at > customerConvMap[customerId].lastAt) {
        customerConvMap[customerId].lastAt = c.created_at;
      }
    });

    const customerIds = Object.keys(customerConvMap);
    const totalCustomers = customerIds.length;

    // Returning = more than 1 conversation
    const returningCustomers = Object.values(customerConvMap).filter((c) => c.count > 1).length;
    const returningRate = totalCustomers > 0 ? Math.round((returningCustomers / totalCustomers) * 100) : 0;

    // New customers this period
    const newCustomerIds = customerIds.filter(
      (id) => new Date(customerConvMap[id].lastAt) >= periodStart
    );

    // Fetch customer profiles
    let customers: {
      id: string;
      name: string;
      username: string;
      avatarStyle: string | null;
      avatarSeed: string | null;
      location: string | null;
      inquiries: number;
      lastContact: string;
      isRepeat: boolean;
    }[] = [];

    if (customerIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_style, avatar_seed, location")
        .in("id", customerIds.slice(0, 50));

      customers = (profiles || [])
        .map((p) => ({
          id: p.id,
          name: p.full_name || p.username || "Anonymous",
          username: p.username || "",
          avatarStyle: p.avatar_style,
          avatarSeed: p.avatar_seed,
          location: p.location,
          inquiries: customerConvMap[p.id]?.count || 0,
          lastContact: customerConvMap[p.id]?.lastAt || "",
          isRepeat: (customerConvMap[p.id]?.count || 0) > 1,
        }))
        .sort((a, b) => b.inquiries - a.inquiries);
    }

    // By location
    const locationMap: Record<string, number> = {};
    customers.forEach((c) => {
      const loc = c.location || "Unknown";
      locationMap[loc] = (locationMap[loc] || 0) + 1;
    });
    const byLocation = Object.entries(locationMap)
      .map(([location, count]) => ({
        location,
        customers: count,
        percentage: totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0,
      }))
      .sort((a, b) => b.customers - a.customers);

    return NextResponse.json({
      totalCustomers,
      newCustomers: newCustomerIds.length,
      returningRate,
      totalFollowers: shop.follower_count || 0,
      customers,
      byLocation,
      period,
    });
  }

  // ==================== SINGLE CUSTOMER DETAIL ====================
  if (section === "customer") {
    const customerId = searchParams.get("customerId");
    if (!customerId || !isValidUUID(customerId)) {
      return NextResponse.json({ error: "Valid customerId required" }, { status: 400 });
    }

    // Get customer profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_style, avatar_seed, location, level, created_at")
      .eq("id", customerId)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Get seller's products
    const { data: products } = await supabase
      .from("products")
      .select("id, title, slug")
      .eq("shop_id", shop.id);
    const productIds = (products || []).map((p) => p.id);

    // Get conversations between seller and this customer about seller's products
    let conversations: {
      id: string;
      productId: string | null;
      productTitle: string;
      status: string;
      createdAt: string;
    }[] = [];

    if (productIds.length > 0) {
      const { data: convos } = await supabase
        .from("conversations")
        .select("id, product_id, status, created_at")
        .in("product_id", productIds)
        .or(`participant_1.eq.${customerId},participant_2.eq.${customerId}`)
        .order("created_at", { ascending: false });

      const productMap = Object.fromEntries((products || []).map((p) => [p.id, p.title]));

      conversations = (convos || []).map((c) => ({
        id: c.id,
        productId: c.product_id,
        productTitle: c.product_id ? (productMap[c.product_id] || "Unknown") : "General",
        status: c.status,
        createdAt: c.created_at,
      }));
    }

    // Check if customer follows the shop
    const { count: followCount } = await supabase
      .from("shop_followers")
      .select("id", { count: "exact", head: true })
      .eq("shop_id", shop.id)
      .eq("follower_id", customerId);

    return NextResponse.json({
      customer: {
        id: profile.id,
        name: profile.full_name || profile.username || "Anonymous",
        username: profile.username || "",
        avatarStyle: profile.avatar_style,
        avatarSeed: profile.avatar_seed,
        location: profile.location,
        level: profile.level || 1,
        joinedAt: profile.created_at,
        totalInquiries: conversations.length,
        isFollower: (followCount || 0) > 0,
        isRepeat: conversations.length > 1,
      },
      conversations,
    });
  }

  return NextResponse.json({ error: "Unknown section" }, { status: 400 });
}
