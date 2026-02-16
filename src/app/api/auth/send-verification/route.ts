import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { verifyEmailTemplate } from "@/lib/email/templates";
import { NextResponse } from "next/server";

function generateOTP(): string {
  const digits = "0123456789";
  let otp = "";
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  for (let i = 0; i < 6; i++) {
    otp += digits[array[i] % 10];
  }
  return otp;
}

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const adminClient = createAdminClient();

  // Check rate limit: max 1 code per 60 seconds
  const { data: recentCodes } = await adminClient
    .from("verification_codes")
    .select("created_at")
    .eq("user_id", user.id)
    .eq("type", "email")
    .is("used_at", null)
    .order("created_at", { ascending: false })
    .limit(1);

  if (recentCodes && recentCodes.length > 0) {
    const lastSent = new Date(recentCodes[0].created_at).getTime();
    const now = Date.now();
    if (now - lastSent < 60_000) {
      const waitSeconds = Math.ceil((60_000 - (now - lastSent)) / 1000);
      return NextResponse.json(
        { error: `Please wait ${waitSeconds}s before requesting another code` },
        { status: 429 }
      );
    }
  }

  // Generate OTP
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

  // Store in DB
  const { error: insertError } = await adminClient
    .from("verification_codes")
    .insert({
      user_id: user.id,
      email: user.email,
      code,
      type: "email",
      expires_at: expiresAt,
    });

  if (insertError) {
    console.error("Failed to store verification code:", insertError);
    return NextResponse.json(
      { error: "Failed to generate verification code" },
      { status: 500 }
    );
  }

  // Get user's name from profile
  const { data: profile } = await adminClient
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const name = profile?.full_name || "there";

  // Send email via Resend
  const { error: emailError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: user.email!,
    subject: `${code} is your Moulna verification code`,
    html: verifyEmailTemplate(code, name),
  });

  if (emailError) {
    console.error("Failed to send verification email:", emailError);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Verification code sent",
    email: user.email,
  });
}
