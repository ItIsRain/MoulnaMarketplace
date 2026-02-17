import { createAdminClient } from "@/lib/supabase/admin";

interface SendNotificationParams {
  userId: string;
  type: "listing" | "xp" | "badge" | "review" | "price_drop" | "message" | "streak" | "system" | "inquiry" | "level_up" | "promo";
  title: string;
  message: string;
  link?: string;
  xpAmount?: number;
  badgeName?: string;
  productImage?: string;
  metadata?: Record<string, unknown>;
}

export async function sendNotification(params: SendNotificationParams) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("notifications").insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    link: params.link,
    xp_amount: params.xpAmount,
    badge_name: params.badgeName,
    product_image: params.productImage,
    metadata: params.metadata || {},
  });

  if (error) {
    console.error("Failed to send notification:", error.message);
  }

  return !error;
}

export async function sendBulkNotifications(notifications: SendNotificationParams[]) {
  const supabase = createAdminClient();

  const rows = notifications.map((n) => ({
    user_id: n.userId,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    xp_amount: n.xpAmount,
    badge_name: n.badgeName,
    product_image: n.productImage,
    metadata: n.metadata || {},
  }));

  const { error } = await supabase.from("notifications").insert(rows);

  if (error) {
    console.error("Failed to send bulk notifications:", error.message);
  }

  return !error;
}
