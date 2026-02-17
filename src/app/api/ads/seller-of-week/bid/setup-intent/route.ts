import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check KYC
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("kyc_status, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.kyc_status !== "approved") {
    return NextResponse.json({ error: "KYC verification required" }, { status: 403 });
  }

  if (!["seller", "both", "admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Seller account required" }, { status: 403 });
  }

  const { weekStart } = await request.json();
  if (!weekStart) {
    return NextResponse.json({ error: "weekStart is required" }, { status: 400 });
  }

  // Verify auction exists and is open
  const { data: auction } = await admin
    .from("sotw_auctions")
    .select("id, status, closes_at")
    .eq("week_start", weekStart)
    .single();

  if (!auction || auction.status !== "open") {
    return NextResponse.json({ error: "No open auction for this week" }, { status: 400 });
  }

  if (new Date(auction.closes_at) <= new Date()) {
    return NextResponse.json({ error: "Auction has closed" }, { status: 400 });
  }

  // Get or create Stripe Customer
  const stripe = getStripe();

  let stripeCustomerId: string;
  const { data: existingCustomer } = await admin
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (existingCustomer) {
    stripeCustomerId = existingCustomer.stripe_customer_id;
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    });
    stripeCustomerId = customer.id;

    await admin.from("stripe_customers").insert({
      user_id: user.id,
      stripe_customer_id: customer.id,
    });
  }

  // Check for existing saved payment methods
  const paymentMethods = await stripe.paymentMethods.list({
    customer: stripeCustomerId,
    type: "card",
    limit: 1,
  });

  const savedCard = paymentMethods.data[0];

  // Create Setup Intent (needed for new cards)
  const setupIntent = await stripe.setupIntents.create({
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    metadata: {
      user_id: user.id,
      auction_week_start: weekStart,
      purpose: "sotw_bid",
    },
  });

  return NextResponse.json({
    clientSecret: setupIntent.client_secret,
    setupIntentId: setupIntent.id,
    customerId: stripeCustomerId,
    // Saved card info so frontend can skip the form
    savedCard: savedCard
      ? {
          paymentMethodId: savedCard.id,
          brand: savedCard.card?.brand || "card",
          last4: savedCard.card?.last4 || "****",
          expMonth: savedCard.card?.exp_month,
          expYear: savedCard.card?.exp_year,
        }
      : null,
  });
}
