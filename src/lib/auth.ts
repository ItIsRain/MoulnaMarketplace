import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Gets the authenticated user and checks they are not suspended.
 * Returns { user, profile, supabase } on success, or a NextResponse error.
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.status === "suspended") {
    return { error: NextResponse.json({ error: "Account suspended" }, { status: 403 }) };
  }

  return { user, profile, supabase };
}
