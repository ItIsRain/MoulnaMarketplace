import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

const VALID_DURATIONS = [3, 7, 14, 30];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Check KYC approval
  const { data: profile } = await admin
    .from("profiles")
    .select("kyc_status, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.kyc_status !== "approved") {
    return NextResponse.json({ error: "KYC verification required" }, { status: 403 });
  }

  const allowedRoles = ["seller", "both", "admin"];
  if (!profile.role || !allowedRoles.includes(profile.role)) {
    return NextResponse.json({ error: "Seller account required" }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { productId, durationDays } = body;

  if (!productId || !VALID_DURATIONS.includes(durationDays)) {
    return NextResponse.json(
      { error: "Invalid productId or durationDays (must be 3, 7, 14, or 30)" },
      { status: 400 }
    );
  }

  // Verify product belongs to seller and is active
  const { data: product, error: productError } = await admin
    .from("products")
    .select("id, title, owner_id, status")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.owner_id !== user.id) {
    return NextResponse.json({ error: "Product does not belong to you" }, { status: 403 });
  }

  if (product.status !== "active") {
    return NextResponse.json({ error: "Product must be active to boost" }, { status: 400 });
  }

  // Check no existing active boost for this product
  const { data: existingBoost } = await admin
    .from("product_boosts")
    .select("id")
    .eq("product_id", productId)
    .in("status", ["active", "pending"])
    .limit(1);

  if (existingBoost && existingBoost.length > 0) {
    return NextResponse.json(
      { error: "This product already has an active or pending boost" },
      { status: 409 }
    );
  }

  // Fetch price from platform_settings
  const { data: priceSetting } = await admin
    .from("platform_settings")
    .select("value")
    .eq("key", "boost_price_per_day_fils")
    .single();

  const pricePerDayFils = priceSetting ? Number(priceSetting.value) : 1500;
  const totalFils = pricePerDayFils * durationDays;

  // Create ad_payments record
  const { data: adPayment, error: paymentError } = await admin
    .from("ad_payments")
    .insert({
      seller_id: user.id,
      ad_type: "product_boost",
      amount_fils: totalFils,
      status: "pending",
      metadata: { product_id: productId, duration_days: durationDays },
    })
    .select("id")
    .single();

  if (paymentError || !adPayment) {
    console.error("Failed to create ad_payment:", paymentError);
    return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 });
  }

  // Create product_boosts record
  const { error: boostError } = await admin
    .from("product_boosts")
    .insert({
      product_id: productId,
      seller_id: user.id,
      payment_id: adPayment.id,
      duration_days: durationDays,
      price_per_day_fils: pricePerDayFils,
      total_fils: totalFils,
      status: "pending",
    });

  if (boostError) {
    console.error("Failed to create product_boost:", boostError);
    return NextResponse.json({ error: "Failed to create boost record" }, { status: 500 });
  }

  // Create Stripe Checkout Session
  const stripe = getStripe();
  const origin = process.env.NEXT_PUBLIC_APP_URL || "";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "aed",
          product_data: {
            name: `Product Boost — ${durationDays} days`,
            description: `Boost "${product.title}" to the top of explore & search`,
          },
          unit_amount: totalFils, // fils is already the smallest AED unit
        },
        quantity: 1,
      },
    ],
    metadata: {
      ad_payment_id: adPayment.id,
      ad_type: "product_boost",
    },
    success_url: `${origin}/seller/promotions/success?session_id={CHECKOUT_SESSION_ID}&type=boost`,
    cancel_url: `${origin}/seller/promotions/new`,
  });

  // Store checkout session ID
  await admin
    .from("ad_payments")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", adPayment.id);

  return NextResponse.json({ url: session.url });
}
