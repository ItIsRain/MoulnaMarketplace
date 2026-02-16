import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/shops/[slug]/follow — follow a shop
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get shop by slug
  const { data: shop } = await supabase
    .from("shops")
    .select("id, owner_id")
    .eq("slug", slug)
    .single();

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  if (shop.owner_id === user.id) {
    return NextResponse.json(
      { error: "Cannot follow your own shop" },
      { status: 400 }
    );
  }

  const { error: insertError } = await supabase
    .from("shop_followers")
    .insert({ shop_id: shop.id, follower_id: user.id });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Already following" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/shops/[slug]/follow — unfollow a shop
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from("shop_followers")
    .delete()
    .eq("shop_id", shop.id)
    .eq("follower_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
