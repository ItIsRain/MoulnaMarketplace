import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Call Didit v3 to create verification session
  const diditResponse = await fetch(
    "https://verification.didit.me/v3/session/",
    {
      method: "POST",
      headers: {
        "x-api-key": process.env.DIDIT_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow_id: process.env.DIDIT_WORKFLOW_ID,
        vendor_data: user.id,
        callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/kyc/webhook`,
      }),
    }
  );

  if (!diditResponse.ok) {
    const errorText = await diditResponse.text();
    console.error("Didit session creation failed:", diditResponse.status, errorText);
    return NextResponse.json(
      { error: "Failed to create verification session" },
      { status: 500 }
    );
  }

  const diditData = await diditResponse.json();

  // v3 returns verification_url (v2 used url)
  const verificationUrl = diditData.verification_url || diditData.url;

  // Store session in DB using admin client (bypasses RLS)
  const adminClient = createAdminClient();

  const { error: insertError } = await adminClient
    .from("kyc_sessions")
    .insert({
      user_id: user.id,
      session_id: diditData.session_id,
      status: "pending",
      verification_url: verificationUrl,
      vendor_data: user.id,
    });

  if (insertError) {
    console.error("Failed to store KYC session:", insertError);
    return NextResponse.json(
      { error: "Failed to store session" },
      { status: 500 }
    );
  }

  // Update profile kyc_status to pending
  const { error: updateError } = await adminClient
    .from("profiles")
    .update({ kyc_status: "pending", kyc_session_id: diditData.session_id })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to update profile KYC status:", updateError);
  }

  return NextResponse.json({ verificationUrl });
}
