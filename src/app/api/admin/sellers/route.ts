import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/sellers — list all sellers (shops) with owner profiles
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
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;
  const status = searchParams.get("status");

  // Build query for shops with owner info
  let query = admin
    .from("shops")
    .select("id, name, slug, owner_id, avatar_style, avatar_seed, logo_url, total_listings, follower_count, rating, review_count, created_at, status", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: shops, count } = await query;

  // Get owner profiles
  const ownerIds = [...new Set((shops || []).map((s) => s.owner_id).filter(Boolean))];
  let ownerMap: Record<string, { email: string; location: string | null; kycStatus: string | null }> = {};

  if (ownerIds.length > 0) {
    const { data: owners } = await admin
      .from("profiles")
      .select("id, email, location, kyc_status")
      .in("id", ownerIds);
    ownerMap = Object.fromEntries(
      (owners || []).map((o) => [o.id, { email: o.email, location: o.location, kycStatus: o.kyc_status }])
    );
  }

  // Status counts
  const { count: totalCount } = await admin
    .from("shops")
    .select("id", { count: "exact", head: true });

  const { count: verifiedCount } = await admin
    .from("shops")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  const { count: pendingCount } = await admin
    .from("shops")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: suspendedCount } = await admin
    .from("shops")
    .select("id", { count: "exact", head: true })
    .eq("status", "suspended");

  const sellers = (shops || []).map((s) => {
    const owner = ownerMap[s.owner_id] || { email: "", location: null, kycStatus: null };
    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      avatarStyle: s.avatar_style,
      avatarSeed: s.avatar_seed,
      logoUrl: s.logo_url,
      email: owner.email,
      location: owner.location,
      kycStatus: owner.kycStatus,
      status: s.status || "active",
      totalListings: s.total_listings || 0,
      followerCount: s.follower_count || 0,
      rating: s.rating || 0,
      reviewCount: s.review_count || 0,
      createdAt: s.created_at,
    };
  });

  return NextResponse.json({
    sellers,
    totalCount: count || 0,
    statusCounts: {
      all: totalCount || 0,
      active: verifiedCount || 0,
      pending: pendingCount || 0,
      suspended: suspendedCount || 0,
    },
  });
}
