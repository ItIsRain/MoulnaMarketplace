import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Require password re-authentication before account deletion
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Password is required to delete account" }, { status: 400 });
  }

  const { password } = body;
  if (!password) {
    return NextResponse.json({ error: "Password is required to delete account" }, { status: 400 });
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password,
  });

  if (verifyError) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
  }

  const admin = createAdminClient();

  // Delete profile (cascades from auth.users via FK, but explicit for clarity)
  await admin.from("profiles").delete().eq("id", user.id);

  // Delete shop if exists
  await admin.from("shops").delete().eq("owner_id", user.id);

  // Delete the auth user (this also signs them out)
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
