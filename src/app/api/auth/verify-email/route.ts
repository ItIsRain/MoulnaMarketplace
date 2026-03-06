import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { welcomeEmailTemplate } from "@/lib/email/templates";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code || typeof code !== "string" || code.length !== 6) {
    return NextResponse.json(
      { error: "A valid 6-digit code is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const adminClient = createAdminClient();

  // Find a valid, unused code
  const { data: verificationCodes, error: fetchError } = await adminClient
    .from("verification_codes")
    .select("*")
    .eq("user_id", user.id)
    .eq("email", user.email)
    .eq("type", "email")
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(5);

  if (fetchError || !verificationCodes || verificationCodes.length === 0) {
    return NextResponse.json(
      { error: "No valid verification code found. Please request a new one." },
      { status: 400 }
    );
  }

  // Check if any code matches (constant-time-ish: check all recent codes)
  const matchedCode = verificationCodes.find((vc) => vc.code === code);

  if (!matchedCode) {
    return NextResponse.json(
      { error: "Invalid verification code. Please try again." },
      { status: 400 }
    );
  }

  // Mark code as used
  await adminClient
    .from("verification_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("id", matchedCode.id);

  // Get profile name for welcome email
  const { data: profile } = await adminClient
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  // Mark profile as verified and credit 100 XP welcome bonus (atomic increment)
  await adminClient.rpc("increment_xp_and_verify", { user_id: user.id, xp_amount: 100 });

  const name = profile?.full_name || "there";

  // Send welcome email
  await resend.emails.send({
    from: FROM_EMAIL,
    to: user.email!,
    subject: "Welcome to Moulna! 🎉",
    html: welcomeEmailTemplate(name),
  });

  return NextResponse.json({ verified: true });
}
