import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { sendNotification } from "@/lib/notifications";
import { awardXP } from "@/lib/gamification";
import { isValidUUID } from "@/lib/utils";

// GET /api/messages — list user's conversations
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
  const conversationId = searchParams.get("conversationId");

  // If conversationId is provided, return messages for that conversation
  if (conversationId) {
    // Verify user is in this conversation
    const { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (!conv || (conv.participant_1 !== user.id && conv.participant_2 !== user.id)) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Fetch messages
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    // Mark unread messages as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .eq("recipient_id", user.id)
      .eq("read", false);

    // Get other participant's profile
    const otherId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
    const { data: otherProfile } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_style, avatar_seed, level")
      .eq("id", otherId)
      .single();

    // Check if other participant has a shop
    const { data: otherShop } = await supabase
      .from("shops")
      .select("id, name, slug, logo_url, avatar_style, avatar_seed")
      .eq("owner_id", otherId)
      .maybeSingle();

    // Get related product if any
    let relatedProduct = null;
    if (conv.product_id) {
      const { data: product } = await supabase
        .from("products")
        .select("id, title, slug, price_fils, images")
        .eq("id", conv.product_id)
        .single();
      if (product) {
        relatedProduct = {
          id: product.id,
          title: product.title,
          slug: product.slug,
          priceFils: product.price_fils,
          image: product.images?.[0] || null,
        };
      }
    }

    return NextResponse.json({
      conversation: {
        id: conv.id,
        productId: conv.product_id,
        createdAt: conv.created_at,
      },
      participant: otherProfile
        ? {
            id: otherProfile.id,
            name: otherProfile.full_name || otherProfile.username || "User",
            username: otherProfile.username,
            avatarStyle: otherProfile.avatar_style,
            avatarSeed: otherProfile.avatar_seed,
            level: otherProfile.level,
            isShop: !!otherShop,
            shopName: otherShop?.name,
            shopSlug: otherShop?.slug,
            logoUrl: otherShop?.logo_url,
          }
        : null,
      relatedProduct,
      messages: (messages || []).map((m) => ({
        id: m.id,
        senderId: m.sender_id,
        content: m.content,
        attachments: m.attachments || [],
        read: m.read,
        isFromMe: m.sender_id === user.id,
        createdAt: m.created_at,
      })),
    });
  }

  // List all conversations
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  if (!conversations || conversations.length === 0) {
    return NextResponse.json({ conversations: [] });
  }

  // Get other participant IDs
  const otherIds = conversations.map((c) =>
    c.participant_1 === user.id ? c.participant_2 : c.participant_1
  );
  const uniqueIds = [...new Set(otherIds)];

  // Fetch profiles + shops in bulk
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_style, avatar_seed, level")
    .in("id", uniqueIds);

  const { data: shops } = await supabase
    .from("shops")
    .select("id, owner_id, name, slug, logo_url, avatar_style, avatar_seed")
    .in("owner_id", uniqueIds);

  // Get unread counts per conversation
  const { data: unreadCounts } = await supabase
    .from("messages")
    .select("conversation_id")
    .eq("recipient_id", user.id)
    .eq("read", false);

  const unreadMap: Record<string, number> = {};
  (unreadCounts || []).forEach((m) => {
    unreadMap[m.conversation_id] = (unreadMap[m.conversation_id] || 0) + 1;
  });

  const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
  const shopMap = Object.fromEntries((shops || []).map((s) => [s.owner_id, s]));

  const items = conversations.map((conv) => {
    const otherId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
    const profile = profileMap[otherId];
    const shop = shopMap[otherId];

    return {
      id: conv.id,
      participant: profile
        ? {
            id: profile.id,
            name: profile.full_name || profile.username || "User",
            username: profile.username,
            avatarStyle: profile.avatar_style,
            avatarSeed: profile.avatar_seed,
            level: profile.level,
            isShop: !!shop,
            shopName: shop?.name,
            shopSlug: shop?.slug,
            logoUrl: shop?.logo_url,
          }
        : null,
      lastMessage: conv.last_message_text,
      lastMessageAt: conv.last_message_at,
      unreadCount: unreadMap[conv.id] || 0,
      productId: conv.product_id,
    };
  });

  return NextResponse.json({ conversations: items });
}

// POST /api/messages — send a message (creates conversation if needed)
export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedUser();
  if ("error" in auth) return auth.error;
  const { user, supabase } = auth;

  let body: { recipientId?: string; content?: string; conversationId?: string; productId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { recipientId, content, conversationId, productId } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  let convId = conversationId;

  // Create or find conversation
  if (!convId) {
    if (!recipientId) {
      return NextResponse.json({ error: "recipientId or conversationId required" }, { status: 400 });
    }

    if (!isValidUUID(recipientId)) {
      return NextResponse.json({ error: "Invalid recipientId" }, { status: 400 });
    }

    if (recipientId === user.id) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }

    // Check for existing conversation between these two users for this product
    let existingQuery = supabase
      .from("conversations")
      .select("id")
      .or(
        `and(participant_1.eq.${user.id},participant_2.eq.${recipientId}),and(participant_1.eq.${recipientId},participant_2.eq.${user.id})`
      );

    if (productId) {
      existingQuery = existingQuery.eq("product_id", productId);
    } else {
      existingQuery = existingQuery.is("product_id", null);
    }

    const { data: existing } = await existingQuery.maybeSingle();

    if (existing) {
      convId = existing.id;
    } else {
      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({
          participant_1: user.id,
          participant_2: recipientId,
          product_id: productId || null,
          last_message_text: content.trim(),
          last_message_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (convError) {
        return NextResponse.json({ error: convError.message }, { status: 500 });
      }
      convId = newConv.id;
    }
  }

  // Get the other participant
  const { data: conv } = await supabase
    .from("conversations")
    .select("participant_1, participant_2")
    .eq("id", convId)
    .single();

  if (!conv || (conv.participant_1 !== user.id && conv.participant_2 !== user.id)) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const recipId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;

  // Insert message
  const { data: msg, error: msgError } = await supabase
    .from("messages")
    .insert({
      conversation_id: convId,
      sender_id: user.id,
      recipient_id: recipId,
      content: content.trim(),
    })
    .select("id, created_at")
    .single();

  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 500 });
  }

  // Update conversation's last message
  await supabase
    .from("conversations")
    .update({
      last_message_text: content.trim(),
      last_message_at: new Date().toISOString(),
    })
    .eq("id", convId);

  // Notify recipient
  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  await sendNotification({
    userId: recipId,
    type: "message",
    title: "New Message",
    message: `${senderProfile?.full_name || "Someone"}: ${content.trim().substring(0, 100)}`,
    link: `/dashboard/messages/${convId}`,
  });

  // Award XP for first message in a new conversation (inquiry) — deduplicated per recipient+product
  if (!conversationId) {
    const dedupKey = `inquiry_${user.id}_${recipientId}_${productId || "general"}`;
    await awardXP({
      userId: user.id,
      amount: 50,
      action: "send_inquiry",
      category: "inquiry",
      description: "Contacted a seller about a listing",
      metadata: { recipientId, productId, dedup: dedupKey },
    }).catch((err) => {
      console.error("XP award error (inquiry):", err);
    });
  }

  return NextResponse.json({
    success: true,
    messageId: msg.id,
    conversationId: convId,
  });
}
