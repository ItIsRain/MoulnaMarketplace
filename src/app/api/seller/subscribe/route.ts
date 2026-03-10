import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

// Stripe Price IDs — set these in your Stripe Dashboard
const PRICE_IDS: Record<string, { monthly: string; annual: string }> = {
  growth: {
    monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY || "",
    annual: process.env.STRIPE_PRICE_GROWTH_ANNUAL || "",
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL || "",
  },
};

// Promotion codes for launch discounts (Stripe promo code IDs, set in Dashboard)
const PROMO_CODES: Record<string, string | undefined> = {
  launch3: process.env.STRIPE_PROMO_LAUNCH_3MO,
  firstmonth: process.env.STRIPE_PROMO_FIRST_MONTH,
};

// POST /api/seller/subscribe — create a Stripe Checkout session for a plan subscription
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { plan: string; period?: string; promo?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { plan, period = "monthly", promo } = body;

  if (!["growth", "pro"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (!["monthly", "annual"].includes(period)) {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: shop } = await admin
    .from("shops")
    .select("id, plan, stripe_customer_id, stripe_subscription_id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!shop) {
    return NextResponse.json({ error: "You need a shop to subscribe" }, { status: 403 });
  }

  if (shop.plan === plan && shop.stripe_subscription_id) {
    return NextResponse.json({ error: "You are already on this plan" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = process.env.NEXT_PUBLIC_APP_URL || "";

  // Get or create Stripe customer
  let customerId = shop.stripe_customer_id;
  if (!customerId) {
    const { data: profile } = await admin
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    const customer = await stripe.customers.create({
      email: profile?.email || user.email || "",
      name: profile?.full_name || "",
      metadata: { shop_id: shop.id, user_id: user.id },
    });
    customerId = customer.id;

    await admin
      .from("shops")
      .update({ stripe_customer_id: customerId })
      .eq("id", shop.id);
  }

  const priceId = PRICE_IDS[plan]?.[period as "monthly" | "annual"];
  if (!priceId) {
    return NextResponse.json({ error: "Price not configured. Please set STRIPE_PRICE_* env vars." }, { status: 500 });
  }

  // Build checkout session — use raw object to avoid strict type issues with Stripe v20
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      shop_id: shop.id,
      user_id: user.id,
      plan,
      period,
      type: "plan_subscription",
    },
    subscription_data: {
      metadata: {
        shop_id: shop.id,
        user_id: user.id,
        plan,
      },
    },
    success_url: `${origin}/seller/settings?subscribed=${plan}`,
    cancel_url: `${origin}/pricing`,
    allow_promotion_codes: true,
  };

  // If a specific promo was passed AND we have a Stripe promo code ID, apply it
  if (promo && PROMO_CODES[promo]) {
    delete params.allow_promotion_codes;
    params.discounts = [{ promotion_code: PROMO_CODES[promo] }];
  }

  const session = await stripe.checkout.sessions.create(params);

  return NextResponse.json({ url: session.url });
}

// GET /api/seller/subscribe — get current subscription status
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: shop } = await admin
    .from("shops")
    .select("id, plan, stripe_subscription_id, plan_period_end, plan_cancel_at_period_end")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!shop) {
    return NextResponse.json({ plan: "free" });
  }

  return NextResponse.json({
    plan: shop.plan || "free",
    subscriptionId: shop.stripe_subscription_id,
    periodEnd: shop.plan_period_end,
    cancelAtPeriodEnd: shop.plan_cancel_at_period_end || false,
  });
}

// DELETE /api/seller/subscribe — cancel subscription (at period end)
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: shop } = await admin
    .from("shops")
    .select("id, stripe_subscription_id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!shop?.stripe_subscription_id) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  const stripe = getStripe();
  await stripe.subscriptions.update(shop.stripe_subscription_id, {
    cancel_at_period_end: true,
  });

  await admin
    .from("shops")
    .update({ plan_cancel_at_period_end: true })
    .eq("id", shop.id);

  return NextResponse.json({ success: true });
}
