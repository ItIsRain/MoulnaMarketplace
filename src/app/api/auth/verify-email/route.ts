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

  // Find the most recent valid, unused code
  const { data: verificationCodes, error: fetchError } = await adminClient
    .from("verification_codes")
    .select("*")
    .eq("user_id", user.id)
    .eq("email", user.email)
    .eq("type", "email")
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1);

  if (fetchError || !verificationCodes || verificationCodes.length === 0) {
    return NextResponse.json(
      { error: "No valid verification code found. Please request a new one." },
      { status: 400 }
    );
  }

  const latestCode = verificationCodes[0];

  // Brute-force protection: check if code is locked
  if (latestCode.locked_until && new Date(latestCode.locked_until) > new Date()) {
    const waitSec = Math.ceil((new Date(latestCode.locked_until).getTime() - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Too many attempts. Please wait ${waitSec}s before trying again.` },
      { status: 429 }
    );
  }

  // Check if the code matches
  if (latestCode.code !== code) {
    // Increment attempt counter
    const newAttempts = (latestCode.attempts || 0) + 1;
    const MAX_ATTEMPTS = 5;

    const updateData: Record<string, unknown> = { attempts: newAttempts };

    // Lock after MAX_ATTEMPTS failed tries (5-minute lockout)
    if (newAttempts >= MAX_ATTEMPTS) {
      updateData.locked_until = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    }

    await adminClient
      .from("verification_codes")
      .update(updateData)
      .eq("id", latestCode.id);

    const remaining = MAX_ATTEMPTS - newAttempts;
    if (remaining <= 0) {
      return NextResponse.json(
        { error: "Too many failed attempts. Code locked for 5 minutes." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Invalid code. ${remaining} attempt(s) remaining.` },
      { status: 400 }
    );
  }

  // Mark code as used
  await adminClient
    .from("verification_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("id", latestCode.id);

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
