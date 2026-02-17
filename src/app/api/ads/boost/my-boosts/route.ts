import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("product_boosts")
    .select(`
      *,
      products (id, title, slug, images, price_fils, status),
      ad_payments (amount_fils, status, stripe_checkout_session_id)
    `)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (status && ["active", "expired", "pending", "cancelled"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ boosts: data || [] });
}
