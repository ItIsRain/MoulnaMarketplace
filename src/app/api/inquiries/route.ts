import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendNotification } from "@/lib/notifications";

// GET /api/inquiries — list inquiries for the seller (conversations with a product_id)
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const inquiryId = searchParams.get("id");

  // Single inquiry detail
  if (inquiryId) {
    const { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", inquiryId)
      .not("product_id", "is", null)
      .maybeSingle();

    if (!conv || (conv.participant_1 !== user.id && conv.participant_2 !== user.id)) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Get the buyer (the other participant who is NOT the product owner)
    const buyerId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;

    const [profileRes, productRes, messagesRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, username, avatar_style, avatar_seed, level, phone, created_at")
        .eq("id", buyerId)
        .single(),
      supabase
        .from("products")
        .select("id, title, slug, price_fils, images")
        .eq("id", conv.product_id)
        .single(),
      supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", inquiryId)
        .order("created_at", { ascending: true }),
    ]);

    // Mark unread messages as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", inquiryId)
      .eq("recipient_id", user.id)
      .eq("read", false);

    const profile = profileRes.data;
    const product = productRes.data;

    return NextResponse.json({
      inquiry: {
        id: conv.id,
        status: conv.status,
        salePriceFils: conv.sale_price_fils,
        createdAt: conv.created_at,
      },
      customer: profile
        ? {
            id: profile.id,
            name: profile.full_name || profile.username || "User",
            username: profile.username,
            avatarStyle: profile.avatar_style,
            avatarSeed: profile.avatar_seed,
            level: profile.level,
            phone: profile.phone,
            joinDate: new Date(profile.created_at).getFullYear().toString(),
          }
        : null,
      listing: product
        ? {
            id: product.id,
            title: product.title,
            slug: product.slug,
            priceFils: product.price_fils,
            image: product.images?.[0] || null,
          }
        : null,
      messages: (messagesRes.data || []).map((m) => ({
        id: m.id,
        senderId: m.sender_id,
        content: m.content,
        isFromMe: m.sender_id === user.id,
        read: m.read,
        createdAt: m.created_at,
      })),
    });
  }

  // List all inquiries for this seller's products
  // Find conversations where user is a participant AND product_id is not null
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .not("product_id", "is", null)
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  if (!conversations || conversations.length === 0) {
    return NextResponse.json({ inquiries: [], stats: { total: 0, new: 0, replied: 0, archived: 0, sold: 0 } });
  }

  // Only include conversations where the user owns the product (is the seller)
  const productIds = [...new Set(conversations.map((c) => c.product_id).filter(Boolean))];
  const { data: products } = await supabase
    .from("products")
    .select("id, title, slug, price_fils, images, owner_id")
    .in("id", productIds);

  const productMap = Object.fromEntries((products || []).map((p) => [p.id, p]));

  // Filter to only conversations where user is the product owner
  const sellerConversations = conversations.filter((c) => {
    const product = productMap[c.product_id];
    return product && product.owner_id === user.id;
  });

  if (sellerConversations.length === 0) {
    return NextResponse.json({ inquiries: [], stats: { total: 0, new: 0, replied: 0, archived: 0, sold: 0 } });
  }

  // Get buyer profiles
  const buyerIds = sellerConversations.map((c) =>
    c.participant_1 === user.id ? c.participant_2 : c.participant_1
  );
  const uniqueBuyerIds = [...new Set(buyerIds)];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_style, avatar_seed, level, created_at")
    .in("id", uniqueBuyerIds);

  const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));

  // Get unread counts
  const { data: unreadCounts } = await supabase
    .from("messages")
    .select("conversation_id")
    .eq("recipient_id", user.id)
    .eq("read", false);

  const unreadMap: Record<string, number> = {};
  (unreadCounts || []).forEach((m) => {
    unreadMap[m.conversation_id] = (unreadMap[m.conversation_id] || 0) + 1;
  });

  const inquiries = sellerConversations.map((conv) => {
    const buyerId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
    const profile = profileMap[buyerId];
    const product = productMap[conv.product_id];

    return {
      id: conv.id,
      status: conv.status,
      salePriceFils: conv.sale_price_fils,
      customer: profile
        ? {
            id: profile.id,
            name: profile.full_name || profile.username || "User",
            username: profile.username,
            avatarStyle: profile.avatar_style,
            avatarSeed: profile.avatar_seed,
            level: profile.level,
            joinDate: new Date(profile.created_at).getFullYear().toString(),
          }
        : null,
      listing: product
        ? {
            title: product.title,
            slug: product.slug,
            priceFils: product.price_fils,
            image: product.images?.[0] || null,
          }
        : null,
      lastMessage: conv.last_message_text,
      lastMessageAt: conv.last_message_at,
      unreadCount: unreadMap[conv.id] || 0,
      createdAt: conv.created_at,
    };
  });

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    replied: inquiries.filter((i) => i.status === "replied").length,
    archived: inquiries.filter((i) => i.status === "archived").length,
    sold: inquiries.filter((i) => i.status === "sold").length,
  };

  return NextResponse.json({ inquiries, stats });
}

// PATCH /api/inquiries — update inquiry status
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { inquiryId, status, salePriceFils } = body;

  if (!inquiryId || !status) {
    return NextResponse.json({ error: "inquiryId and status required" }, { status: 400 });
  }

  if (!["new", "replied", "archived", "sold"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Verify conversation exists and user is a participant
  const { data: conv } = await supabase
    .from("conversations")
    .select("id, participant_1, participant_2, product_id")
    .eq("id", inquiryId)
    .not("product_id", "is", null)
    .single();

  if (!conv || (conv.participant_1 !== user.id && conv.participant_2 !== user.id)) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }

  // Verify the user owns the product (is the seller)
  const { data: product } = await supabase
    .from("products")
    .select("owner_id")
    .eq("id", conv.product_id)
    .single();

  if (!product || product.owner_id !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const updateData: Record<string, unknown> = { status };
  if (status === "sold" && salePriceFils !== undefined) {
    if (typeof salePriceFils !== "number" || salePriceFils <= 0 || !Number.isInteger(salePriceFils)) {
      return NextResponse.json({ error: "salePriceFils must be a positive integer" }, { status: 400 });
    }
    updateData.sale_price_fils = salePriceFils;
  }

  const { error } = await supabase
    .from("conversations")
    .update(updateData)
    .eq("id", inquiryId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Notify buyer if sold
  if (status === "sold") {
    const buyerId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
    const { data: productInfo } = await supabase
      .from("products")
      .select("title")
      .eq("id", conv.product_id)
      .single();

    await sendNotification({
      userId: buyerId,
      type: "inquiry",
      title: "Sale Confirmed!",
      message: `Your inquiry about "${productInfo?.title || "a listing"}" has been marked as sold.`,
      link: `/dashboard/messages/${inquiryId}`,
    });
  }

  return NextResponse.json({ success: true });
}
