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

  // Atomic idempotency: insert event, skip if already exists (ON CONFLICT DO NOTHING)
  const admin = createAdminClient();
  const { data: inserted, error: idempotencyError } = await admin
    .from("webhook_events")
    .upsert(
      { event_id: event.id, event_type: event.type },
      { onConflict: "event_id", ignoreDuplicates: true }
    )
    .select("event_id");

  // If the row already existed, upsert with ignoreDuplicates returns empty array
  if (idempotencyError) {
    console.error("Idempotency check failed:", idempotencyError);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  if (!inserted || inserted.length === 0) {
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

  return NextResponse.json({ received: true });
}
