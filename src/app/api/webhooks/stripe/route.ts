import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: check if event was already processed
  const admin = createAdminClient();
  const { data: existing, error: checkError } = await admin
    .from("webhook_events")
    .select("event_id")
    .eq("event_id", event.id)
    .maybeSingle();

  if (checkError) {
    console.error("Idempotency check failed:", checkError);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  if (existing) {
    // Already processed — skip
    return NextResponse.json({ received: true });
  }

  // Handle off-session payment failures for SOTW auction bids
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const bidId = paymentIntent.metadata?.bid_id;
    const auctionId = paymentIntent.metadata?.auction_id;

    if (bidId && auctionId && paymentIntent.metadata?.type === "sotw_auction") {
      // Mark bid as charge_failed
      await admin
        .from("sotw_bids")
        .update({
          status: "charge_failed",
          stripe_payment_intent_id: paymentIntent.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bidId);

      // Cascade to next bidder
      const { data: auction } = await admin
        .from("sotw_auctions")
        .select("week_start")
        .eq("id", auctionId)
        .single();

      if (auction) {
        // Find next highest outbid bid
        const { data: nextBid } = await admin
          .from("sotw_bids")
          .select("id, seller_id")
          .eq("auction_id", auctionId)
          .eq("status", "outbid")
          .order("amount_fils", { ascending: false })
          .limit(1)
          .single();

        if (nextBid) {
          await admin
            .from("sotw_bids")
            .update({ status: "pending_approval", updated_at: new Date().toISOString() })
            .eq("id", nextBid.id);

          await admin
            .from("sotw_auctions")
            .update({ winner_bid_id: nextBid.id, updated_at: new Date().toISOString() })
            .eq("id", auctionId);
        } else {
          await admin
            .from("sotw_auctions")
            .update({ status: "cancelled", winner_bid_id: null, updated_at: new Date().toISOString() })
            .eq("id", auctionId);
        }
      }
    }

    return NextResponse.json({ received: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Skip if payment wasn't actually collected
    if (session.payment_status !== "paid") {
      console.warn("Checkout completed but payment_status is:", session.payment_status);
      return NextResponse.json({ received: true });
    }

    // Subscription checkouts don't have ad metadata — handled by subscription events
    if (session.mode === "subscription") {
      return NextResponse.json({ received: true });
    }

    const adPaymentId = session.metadata?.ad_payment_id;
    const adType = session.metadata?.ad_type;

    if (!adPaymentId || !adType) {
      console.error("Missing metadata in Stripe session:", session.id);
      return NextResponse.json({ received: true });
    }

    // Update ad_payments to completed
    const { error: paymentError } = await admin
      .from("ad_payments")
      .update({
        status: "completed",
        stripe_payment_intent_id: session.payment_intent as string,
        updated_at: new Date().toISOString(),
      })
      .eq("id", adPaymentId)
      .eq("status", "pending");

    if (paymentError) {
      console.error("Failed to update ad_payment:", paymentError);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    if (adType === "product_boost") {
      // Activate the boost: set starts_at to now, ends_at based on duration
      const { data: boost } = await admin
        .from("product_boosts")
        .select("id, duration_days")
        .eq("payment_id", adPaymentId)
        .single();

      if (boost) {
        const startsAt = new Date();
        const endsAt = new Date(startsAt.getTime() + boost.duration_days * 24 * 60 * 60 * 1000);

        await admin
          .from("product_boosts")
          .update({
            status: "active",
            starts_at: startsAt.toISOString(),
            ends_at: endsAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", boost.id);
      }
    } else if (adType === "seller_of_week") {
      // SOTW activation is handled by the cron function based on week_start
      // But if week_start is today or in the past, activate immediately
      const { data: sotw } = await admin
        .from("seller_of_week")
        .select("id, week_start, week_end")
        .eq("payment_id", adPaymentId)
        .single();

      if (sotw) {
        const today = new Date().toISOString().split("T")[0];
        if (sotw.week_start <= today && sotw.week_end > today) {
          await admin
            .from("seller_of_week")
            .update({
              status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("id", sotw.id);
        }
      }
    } else if (adType === "listing_fee") {
      // Paid listing activation with optional boost and SOTW upsells
      const { data: payment } = await admin
        .from("ad_payments")
        .select("metadata")
        .eq("id", adPaymentId)
        .single();

      if (payment?.metadata) {
        const meta = payment.metadata as {
          product_id?: string;
          items?: { listing?: boolean; boost?: { durationDays: number }; sotw?: { weekStart: string } };
        };

        // Activate the product
        if (meta.product_id) {
          await admin
            .from("products")
            .update({
              status: "active",
              listing_payment_id: adPaymentId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", meta.product_id)
            .eq("status", "draft");
        }

        // Activate boost if purchased
        if (meta.items?.boost) {
          const { data: boost } = await admin
            .from("product_boosts")
            .select("id, duration_days")
            .eq("payment_id", adPaymentId)
            .single();

          if (boost) {
            const startsAt = new Date();
            const endsAt = new Date(startsAt.getTime() + boost.duration_days * 24 * 60 * 60 * 1000);

            await admin
              .from("product_boosts")
              .update({
                status: "active",
                starts_at: startsAt.toISOString(),
                ends_at: endsAt.toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("id", boost.id);
          }
        }

        // Activate SOTW if purchased (same logic as standalone SOTW)
        if (meta.items?.sotw) {
          const { data: sotw } = await admin
            .from("seller_of_week")
            .select("id, week_start, week_end")
            .eq("payment_id", adPaymentId)
            .single();

          if (sotw) {
            const today = new Date().toISOString().split("T")[0];
            if (sotw.week_start <= today && sotw.week_end > today) {
              await admin
                .from("seller_of_week")
                .update({
                  status: "active",
                  updated_at: new Date().toISOString(),
                })
                .eq("id", sotw.id);
            }
          }
        }
      }
    }
  }

  // ─── Subscription Events ───
  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = event.data.object as any;
    const shopId = subscription.metadata?.shop_id;
    const plan = subscription.metadata?.plan;

    if (shopId && plan) {
      const isActive = ["active", "trialing"].includes(subscription.status);
      const cancelAtPeriodEnd = subscription.cancel_at_period_end;
      const periodEnd = subscription.current_period_end;

      await admin
        .from("shops")
        .update({
          plan: isActive ? plan : "free",
          stripe_subscription_id: subscription.id,
          plan_period_end: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null,
          plan_cancel_at_period_end: cancelAtPeriodEnd,
          updated_at: new Date().toISOString(),
        })
        .eq("id", shopId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = event.data.object as any;
    const shopId = subscription.metadata?.shop_id;

    if (shopId) {
      await admin
        .from("shops")
        .update({
          plan: "free",
          stripe_subscription_id: null,
          plan_period_end: null,
          plan_cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", shopId);
    }
  }

  // ─── Refund Events ───
  if (event.type === "charge.refunded") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const charge = event.data.object as any;
    const paymentIntentId = charge.payment_intent;

    if (paymentIntentId) {
      // Mark any ad_payments linked to this payment intent as refunded
      const { error: refundError } = await admin
        .from("ad_payments")
        .update({ status: "refunded", updated_at: new Date().toISOString() })
        .eq("stripe_payment_intent_id", paymentIntentId);

      if (refundError) {
        console.error("Failed to mark ad_payment as refunded:", refundError.message);
      }

      // Deactivate any boosts linked to refunded payments
      await admin
        .from("product_boosts")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("stripe_payment_intent_id", paymentIntentId)
        .eq("status", "active");

      // Deactivate any SOTW linked to refunded payments
      await admin
        .from("seller_of_week")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("stripe_payment_intent_id", paymentIntentId)
        .eq("status", "active");
    }
  }

  // ─── Invoice Payment Failed (subscription renewal failure) ───
  if (event.type === "invoice.payment_failed") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoice = event.data.object as any;
    const subscriptionId = invoice.subscription;

    if (subscriptionId && invoice.attempt_count >= 3) {
      // After 3 failed attempts, downgrade to free
      const { data: shop } = await admin
        .from("shops")
        .select("id")
        .eq("stripe_subscription_id", subscriptionId)
        .maybeSingle();

      if (shop) {
        console.error(`Subscription ${subscriptionId} failed ${invoice.attempt_count} times, downgrading shop ${shop.id}`);
      }
    }
  }

  // Record event as processed (idempotency). If insert fails due to race condition, that's fine.
  await admin
    .from("webhook_events")
    .insert({ event_id: event.id, event_type: event.type })
    .then(({ error }) => {
      if (error) console.warn("Idempotency insert failed (likely race condition):", error.message);
    });

  return NextResponse.json({ received: true });
}
