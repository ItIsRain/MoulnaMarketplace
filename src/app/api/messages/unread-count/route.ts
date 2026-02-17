import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/messages/unread-count — returns unread message count for navbar badge
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ count: 0 });
  }

  const { count, error } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("read", false);

  if (error) {
    return NextResponse.json({ count: 0 });
  }

  return NextResponse.json({ count: count || 0 });
}
