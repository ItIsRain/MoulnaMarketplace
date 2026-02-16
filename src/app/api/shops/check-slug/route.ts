import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateSlug, isSlugForbidden } from "@/lib/forbidden-slugs";

// GET /api/shops/check-slug?name=My+Shop
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";

  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { available: false, reason: "too_short", slug: "" },
      { status: 200 }
    );
  }

  const slug = generateSlug(name);

  if (!slug) {
    return NextResponse.json(
      { available: false, reason: "invalid", slug: "" },
      { status: 200 }
    );
  }

  if (isSlugForbidden(slug)) {
    return NextResponse.json(
      { available: false, reason: "forbidden", slug },
      { status: 200 }
    );
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("shops")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { available: false, reason: "taken", slug },
      { status: 200 }
    );
  }

  return NextResponse.json({ available: true, reason: null, slug });
}
