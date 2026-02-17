import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

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

// GET /api/kyc/status — Check KYC status from Didit and sync to DB
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get the latest KYC session for this user
  const adminClient = createAdminClient();
  const { data: session } = await adminClient
    .from("kyc_sessions")
    .select("session_id, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ kycStatus: "none" });
  }

  // If already terminal (approved/declined), return immediately
  if (session.status === "approved" || session.status === "declined") {
    return NextResponse.json({ kycStatus: session.status });
  }

  // Poll Didit v3 API for current status
  try {
    const diditRes = await fetch(
      `https://verification.didit.me/v3/session/${session.session_id}/decision/`,
      {
        headers: {
          "x-api-key": process.env.DIDIT_API_KEY!,
        },
      }
    );

    if (!diditRes.ok) {
      console.error(
        "Didit v3 session fetch failed:",
        diditRes.status,
        await diditRes.text().catch(() => "")
      );
      // Return current DB status if API is unreachable
      return NextResponse.json({ kycStatus: session.status });
    }

    const diditData = await diditRes.json();
    const rawStatus = diditData.status || "";
    const newStatus = mapDiditStatus(rawStatus);

    // Log unmapped statuses for debugging
    if (rawStatus && !["Approved", "Declined", "In Review", "Pending", "Canceled", "Not Finished"].includes(rawStatus)) {
      console.warn("Unknown Didit status received:", rawStatus, "→ mapped to:", newStatus);
    }

    // Sync to DB if status changed
    if (newStatus !== session.status) {
      await syncStatus(adminClient, user.id, newStatus);
    }

    return NextResponse.json({ kycStatus: newStatus });
  } catch (error) {
    console.error("Failed to fetch KYC status from Didit:", error);
    return NextResponse.json({ kycStatus: session.status });
  }
}

async function syncStatus(
  adminClient: ReturnType<typeof createAdminClient>,
  userId: string,
  status: string
) {
  // Update kyc_sessions
  await adminClient
    .from("kyc_sessions")
    .update({ status })
    .eq("user_id", userId);

  // Update profile
  const updateData: Record<string, unknown> = { kyc_status: status };
  if (status === "approved") {
    updateData.is_verified = true;
  }

  await adminClient
    .from("profiles")
    .update(updateData)
    .eq("id", userId);

  // Also mark the seller's shop as verified
  if (status === "approved") {
    await adminClient
      .from("shops")
      .update({ is_verified: true })
      .eq("owner_id", userId);
  }
}
