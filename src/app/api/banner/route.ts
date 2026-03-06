import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export interface BannerConfig {
  enabled: boolean;
  hidden: boolean;
  title: string;
  badge: string;
  description: string;
  link: string;
  image: string;
  gradient: string;
}

// GET /api/banner — public, returns current hero banner config
export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("platform_settings")
      .select("value")
      .eq("key", "hero_banner")
      .single();

    if (error || !data) {
      return NextResponse.json({ banner: null });
    }

    const banner =
      typeof data.value === "string" ? JSON.parse(data.value) : data.value;

    // If admin explicitly hid the banner, tell the client
    if (banner?.hidden) {
      return NextResponse.json({ banner: null, hidden: true });
    }

    // If override not enabled, let client use fallback campaign
    if (!banner || !banner.enabled) {
      return NextResponse.json({ banner: null, hidden: false });
    }

    return NextResponse.json({ banner, hidden: false });
  } catch {
    return NextResponse.json({ banner: null });
  }
}
