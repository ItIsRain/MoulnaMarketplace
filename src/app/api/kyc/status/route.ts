import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Map Didit status (case-sensitive with spaces) to our DB status
function mapDiditStatus(status: string): string {
  const statusMap: Record<string, string> = {
    "Approved": "approved",
    "Declined": "declined",
    "In Progress": "in_progress",
    "In Review": "in_review",
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

  // Poll Didit API for current status
  try {
    const diditRes = await fetch(
      `https://verification.didit.me/v2/session/${session.session_id}/decision/`,
      {
        headers: {
          "x-api-key": process.env.DIDIT_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    if (!diditRes.ok) {
      // If v2 fails, try v1 endpoint as fallback
      const v1Res = await fetch(
        `https://verification.didit.me/v1/session/${session.session_id}/decision/`,
        {
          headers: {
            "x-api-key": process.env.DIDIT_API_KEY!,
            "Content-Type": "application/json",
          },
        }
      );

      if (!v1Res.ok) {
        // Return current DB status if API is unreachable
        return NextResponse.json({ kycStatus: session.status });
      }

      const v1Data = await v1Res.json();
      const newStatus = mapDiditStatus(v1Data.status || "");

      if (newStatus !== session.status) {
        await syncStatus(adminClient, user.id, newStatus);
      }

      return NextResponse.json({ kycStatus: newStatus });
    }

    const diditData = await diditRes.json();
    const newStatus = mapDiditStatus(diditData.status || "");

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
}
