import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// GET /api/platform/stats — public marketplace statistics (for homepage)
export async function GET() {
  const admin = createAdminClient();

  const { count: totalProducts } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  const { count: totalSellers } = await admin
    .from("shops")
    .select("id", { count: "exact", head: true });

  const { count: totalUsers } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true });

  return NextResponse.json({
    totalProducts: totalProducts || 0,
    totalSellers: totalSellers || 0,
    totalUsers: totalUsers || 0,
  });
}
