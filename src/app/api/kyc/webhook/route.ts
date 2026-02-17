import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// Map Didit status (case-sensitive) to our DB status
// v3 statuses: Approved, Declined, In Review, Pending, Canceled, Not Finished
function mapDiditStatus(status: string): string {
  const statusMap: Record<string, string> = {
    "Approved": "approved",
    "Declined": "declined",
    "In Progress": "in_progress",
    "In Review": "in_review",
    "Pending": "pending",
    "Canceled": "abandoned",
    "Not Finished": "in_progress",
    "Resubmitted": "in_progress",
    "Not Started": "pending",
    "Expired": "expired",
    "Abandoned": "abandoned",
    "Kyc Expired": "expired",
  };
  return statusMap[status] || "pending";
}

async function verifySignature(
  body: string,
  signature: string,
  timestamp: string
): Promise<boolean> {
  const secret = process.env.DIDIT_WEBHOOK_SECRET!;
  const message = `${timestamp}.${body}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );

  const computedSignature = Buffer.from(signatureBuffer).toString("hex");
  return computedSignature === signature;
}

// GET /api/kyc/webhook — Didit redirects the user's browser here after verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";

  // Quick-sync the status from Didit's redirect params
  if (status) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const dbStatus = mapDiditStatus(status);
        const adminClient = createAdminClient();

        await adminClient
          .from("kyc_sessions")
          .update({ status: dbStatus })
          .eq("user_id", user.id);

        const updateData: Record<string, unknown> = { kyc_status: dbStatus };
        if (dbStatus === "approved") {
          updateData.is_verified = true;
        }

        await adminClient
          .from("profiles")
          .update(updateData)
          .eq("id", user.id);

        // Also mark the seller's shop as verified
        if (dbStatus === "approved") {
          await adminClient
            .from("shops")
            .update({ is_verified: true })
            .eq("owner_id", user.id);
        }
      }
    } catch (err) {
      console.error("Failed to sync KYC status on redirect:", err);
    }
  }

  return NextResponse.redirect(new URL("/seller", request.url));
}

// POST /api/kyc/webhook — Didit server-to-server webhook with HMAC
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature-v2") || "";
  const timestamp = request.headers.get("x-timestamp") || "";

  // Validate timestamp (reject if > 5 min old)
  const timestampNum = parseInt(timestamp, 10);
  if (isNaN(timestampNum) || Date.now() / 1000 - timestampNum > 300) {
    return NextResponse.json(
      { error: "Invalid or expired timestamp" },
      { status: 401 }
    );
  }

  // Verify HMAC signature
  const isValid = await verifySignature(rawBody, signature, timestamp);
  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  const payload = JSON.parse(rawBody);
  const { vendor_data: userId, status } = payload;

  if (!userId || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const dbStatus = mapDiditStatus(status);
  const adminClient = createAdminClient();

  // Update kyc_sessions status
  const { error: sessionError } = await adminClient
    .from("kyc_sessions")
    .update({ status: dbStatus })
    .eq("vendor_data", userId);

  if (sessionError) {
    console.error("Failed to update KYC session:", sessionError);
  }

  // Update profile kyc_status
  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ kyc_status: dbStatus })
    .eq("id", userId);

  if (profileError) {
    console.error("Failed to update profile KYC status:", profileError);
  }

  // If approved, mark user and their shop as verified
  if (dbStatus === "approved") {
    await adminClient
      .from("profiles")
      .update({ is_verified: true })
      .eq("id", userId);

    await adminClient
      .from("shops")
      .update({ is_verified: true })
      .eq("owner_id", userId);
  }

  return NextResponse.json({ received: true });
}
