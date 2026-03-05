import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export interface BannerConfig {
  enabled: boolean;
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

    if (!banner || !banner.enabled) {
      return NextResponse.json({ banner: null });
    }

    return NextResponse.json({ banner });
  } catch {
    return NextResponse.json({ banner: null });
  }
}
