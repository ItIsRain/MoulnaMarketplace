import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/reports — list all reports with reporter info
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  let query = admin
    .from("reports")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: reports, count } = await query;

  // Get reporter profiles
  const reporterIds = [...new Set((reports || []).map((r) => r.reporter_id).filter(Boolean))];
  let reporterMap: Record<string, { name: string; avatarSeed: string | null; avatarStyle: string | null }> = {};

  if (reporterIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, full_name, username, avatar_seed, avatar_style")
      .in("id", reporterIds);
    reporterMap = Object.fromEntries(
      (profiles || []).map((p) => [p.id, {
        name: p.full_name || p.username || "User",
        avatarSeed: p.avatar_seed,
        avatarStyle: p.avatar_style,
      }])
    );
  }

  // Get target names (products/shops)
  const productTargets = (reports || []).filter((r) => r.target_type === "product").map((r) => r.target_id);
  const shopTargets = (reports || []).filter((r) => r.target_type === "shop").map((r) => r.target_id);
  const userTargets = (reports || []).filter((r) => r.target_type === "user").map((r) => r.target_id);

  let targetNameMap: Record<string, string> = {};

  if (productTargets.length > 0) {
    const { data: products } = await admin
      .from("products")
      .select("id, title")
      .in("id", productTargets);
    for (const p of products || []) {
      targetNameMap[p.id] = p.title;
    }
  }

  if (shopTargets.length > 0) {
    const { data: shops } = await admin
      .from("shops")
      .select("id, name")
      .in("id", shopTargets);
    for (const s of shops || []) {
      targetNameMap[s.id] = s.name;
    }
  }

  if (userTargets.length > 0) {
    const { data: users } = await admin
      .from("profiles")
      .select("id, full_name, username")
      .in("id", userTargets);
    for (const u of users || []) {
      targetNameMap[u.id] = u.full_name || u.username || "User";
    }
  }

  const items = (reports || []).map((r) => {
    const reporter = reporterMap[r.reporter_id] || { name: "Unknown", avatarSeed: null, avatarStyle: null };
    return {
      id: r.id,
      reporter: { name: reporter.name, avatarSeed: reporter.avatarSeed, avatarStyle: reporter.avatarStyle },
      targetType: r.target_type,
      targetId: r.target_id,
      targetName: targetNameMap[r.target_id] || "Unknown",
      reason: r.reason,
      description: r.description,
      status: r.status,
      priority: r.priority,
      adminNotes: r.admin_notes,
      createdAt: r.created_at,
    };
  });

  // Status counts
  const { count: pendingCount } = await admin
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  const { count: investigatingCount } = await admin
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "investigating");
  const { count: resolvedCount } = await admin
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "resolved");
  const { count: dismissedCount } = await admin
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "dismissed");

  // High priority count (pending or investigating with high/urgent priority)
  const { count: highPriorityCount } = await admin
    .from("reports")
    .select("id", { count: "exact", head: true })
    .in("status", ["pending", "investigating"])
    .in("priority", ["high", "urgent"]);

  // Resolved this month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const { count: resolvedThisMonth } = await admin
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "resolved")
    .gte("resolved_at", monthStart.toISOString());

  return NextResponse.json({
    reports: items,
    totalCount: count || 0,
    statusCounts: {
      pending: pendingCount || 0,
      investigating: investigatingCount || 0,
      resolved: resolvedCount || 0,
      dismissed: dismissedCount || 0,
      highPriority: highPriorityCount || 0,
      resolvedThisMonth: resolvedThisMonth || 0,
    },
  });
}

// PATCH /api/admin/reports — update report status
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { reportId, status, adminNotes } = body as {
    reportId: string;
    status: string;
    adminNotes?: string;
  };

  if (!reportId || !status) {
    return NextResponse.json({ error: "reportId and status are required" }, { status: 400 });
  }

  const validStatuses = ["pending", "investigating", "resolved", "dismissed"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const admin = createAdminClient();

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes;
  }

  if (status === "resolved" || status === "dismissed") {
    updateData.resolved_by = user.id;
    updateData.resolved_at = new Date().toISOString();
  }

  const { error } = await admin
    .from("reports")
    .update(updateData)
    .eq("id", reportId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
