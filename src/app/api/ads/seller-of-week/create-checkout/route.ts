import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Check KYC
  const { data: profile } = await admin
    .from("profiles")
    .select("kyc_status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.kyc_status !== "approved") {
    return NextResponse.json({ error: "KYC verification required" }, { status: 403 });
  }

  const body = await request.json();
  const { weekStart, headline, description, imageUrl } = body;

  if (!weekStart) {
    return NextResponse.json({ error: "weekStart is required" }, { status: 400 });
  }

  // Validate weekStart is a future Monday
  const weekStartDate = new Date(weekStart + "T00:00:00Z");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (weekStartDate.getUTCDay() !== 1) {
    return NextResponse.json({ error: "weekStart must be a Monday" }, { status: 400 });
  }

  if (weekStartDate <= today) {
    return NextResponse.json({ error: "weekStart must be in the future" }, { status: 400 });
  }

  // Get seller's shop
  const { data: shop } = await admin
    .from("shops")
    .select("id, name")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    return NextResponse.json({ error: "You must have a shop to purchase Seller of the Week" }, { status: 400 });
  }

  // Calculate week_end (Sunday)
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 7);
  const weekEnd = weekEndDate.toISOString().split("T")[0];

  // Fetch price
  const { data: priceSetting } = await admin
    .from("platform_settings")
    .select("value")
    .eq("key", "sotw_price_per_week_fils")
    .single();

  const priceFils = priceSetting ? Number(priceSetting.value) : 19900;
  const priceAed = priceFils / 100;

  // Create ad_payments record
  const { data: adPayment, error: paymentError } = await admin
    .from("ad_payments")
    .insert({
      seller_id: user.id,
      ad_type: "seller_of_week",
      amount_fils: priceFils,
      status: "pending",
      metadata: { shop_id: shop.id, week_start: weekStart, headline, description },
    })
    .select("id")
    .single();

  if (paymentError || !adPayment) {
    console.error("Failed to create ad_payment:", paymentError);
    return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 });
  }

  // Create seller_of_week record (UNIQUE constraint on week_start protects against double-booking)
  const { error: sotwError } = await admin
    .from("seller_of_week")
    .insert({
      seller_id: user.id,
      shop_id: shop.id,
      payment_id: adPayment.id,
      week_start: weekStart,
      week_end: weekEnd,
      price_fils: priceFils,
      status: "pending",
      headline: headline || null,
      description: description || null,
      image_url: imageUrl || null,
    });

  if (sotwError) {
    // If unique constraint violation, the week is already booked
    if (sotwError.code === "23505") {
      // Clean up the ad_payment
      await admin.from("ad_payments").delete().eq("id", adPayment.id);
      return NextResponse.json({ error: "This week is already booked" }, { status: 409 });
    }
    console.error("Failed to create SOTW:", sotwError);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
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
            name: "Seller of the Week",
            description: `Featured homepage placement for the week of ${weekStart}`,
          },
          unit_amount: Math.round(priceAed * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      ad_payment_id: adPayment.id,
      ad_type: "seller_of_week",
    },
    success_url: `${origin}/seller/promotions/success?session_id={CHECKOUT_SESSION_ID}&type=sotw`,
    cancel_url: `${origin}/seller/promotions/seller-of-week`,
  });

  await admin
    .from("ad_payments")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", adPayment.id);

  return NextResponse.json({ url: session.url });
}
