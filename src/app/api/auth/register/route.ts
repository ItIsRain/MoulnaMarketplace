import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { verifyEmailTemplate } from "@/lib/email/templates";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, fullName, phone, role, username, avatarStyle, avatarSeed } = body;

  // Validate
  if (!email || !password || !fullName) {
    return NextResponse.json(
      { error: "Email, password, and full name are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  if (role && !["buyer", "seller"].includes(role)) {
    return NextResponse.json(
      { error: "Role must be buyer or seller" },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();

  // Create user via admin API — skips Supabase's built-in confirmation email
  const { data: authData, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Mark as confirmed in Supabase (we handle verification ourselves)
    user_metadata: {
      full_name: fullName,
      username: username || email.split("@")[0],
      phone: phone || "",
      role: role || "buyer",
      avatar_style: avatarStyle || "adventurer",
      avatar_seed: avatarSeed || email.split("@")[0],
    },
  });

  if (createError) {
    // Map common errors to user-friendly messages
    if (createError.message.includes("already been registered")) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // Sign the user in (admin.createUser doesn't create a session)
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error("Auto sign-in after register failed:", signInError);
    return NextResponse.json({ error: "Account created but sign-in failed. Please log in manually." }, { status: 500 });
  }

  // Generate OTP and store it
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await adminClient.from("verification_codes").insert({
    user_id: authData.user.id,
    email,
    code,
    type: "email",
    expires_at: expiresAt,
  });

  // Send verification email via Resend
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `${code} is your Moulna verification code`,
    html: verifyEmailTemplate(code, fullName),
  });

  return NextResponse.json({
    user: authData.user,
    requiresKYC: role === "seller",
  });
}
