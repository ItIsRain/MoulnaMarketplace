import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeFilterValue } from "@/lib/utils";

// GET /api/admin/users — list all users with profiles
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
  const filter = searchParams.get("filter");
  const search = searchParams.get("search")?.trim();

  // Build query
  let query = admin
    .from("profiles")
    .select("id, full_name, username, email, avatar_style, avatar_seed, level, role, location, created_at, status", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    const s = sanitizeFilterValue(search);
    query = query.or(`full_name.ilike.%${s}%,email.ilike.%${s}%,username.ilike.%${s}%`);
  }

  if (filter === "active") {
    query = query.or("status.eq.active,status.is.null");
  } else if (filter === "suspended") {
    query = query.eq("status", "suspended");
  } else if (filter === "buyer") {
    query = query.eq("role", "buyer");
  } else if (filter === "seller") {
    query = query.in("role", ["seller", "both"]);
  }

  const { data: profiles, count } = await query;

  // Status counts
  const { count: totalCount } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const { count: activeCount } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .or("status.eq.active,status.is.null");

  const { count: suspendedCount } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("status", "suspended");

  // New this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { count: newThisWeek } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", weekAgo.toISOString());

  const users = (profiles || []).map((p) => ({
    id: p.id,
    name: p.full_name || p.username || "Anonymous",
    email: p.email || "",
    username: p.username || "",
    avatarStyle: p.avatar_style,
    avatarSeed: p.avatar_seed,
    level: p.level || 1,
    role: p.role || "buyer",
    status: p.status || "active",
    location: p.location,
    joinDate: p.created_at,
  }));

  return NextResponse.json({
    users,
    totalCount: count || 0,
    statusCounts: {
      total: totalCount || 0,
      active: activeCount || 0,
      suspended: suspendedCount || 0,
      newThisWeek: newThisWeek || 0,
    },
  });
}

// PATCH /api/admin/users — suspend or reactivate a user
export async function PATCH(req: NextRequest) {
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

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { userId, action } = body as {
    userId: string;
    action: "suspend" | "reactivate";
  };

  if (!userId || !["suspend", "reactivate"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid request. Provide userId and action ('suspend' | 'reactivate')." },
      { status: 400 }
    );
  }

  if (userId === user.id) {
    return NextResponse.json(
      { error: "You cannot suspend your own account" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Prevent modifying other admin accounts
  const { data: targetProfile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (targetProfile?.role === "admin") {
    return NextResponse.json(
      { error: "Cannot modify admin accounts" },
      { status: 403 }
    );
  }
  const newStatus = action === "suspend" ? "suspended" : "active";

  const { error: updateError } = await admin
    .from("profiles")
    .update({ status: newStatus })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
