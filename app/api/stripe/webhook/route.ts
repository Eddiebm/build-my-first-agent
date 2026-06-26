export const runtime = "edge";

import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return Response.json({ error: "Webhook secret not configured" }, { status: 500 });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return Response.json({ error: "Missing signature" }, { status: 400 });

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const sql = getDb();

  const businessPriceId = process.env.STRIPE_BUSINESS_PRICE_ID;

  function planFromPriceId(priceId: string): "pro" | "business" {
    return businessPriceId && priceId === businessPriceId ? "business" : "pro";
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const userId = s.metadata?.userId;
    const tier = (s.metadata?.tier === "business" ? "business" : "pro") as "pro" | "business";
    if (userId && s.customer && s.subscription) {
      await sql`
        UPDATE users
        SET plan = ${tier},
            stripe_customer_id = ${s.customer as string},
            stripe_subscription_id = ${s.subscription as string}
        WHERE id = ${userId}
      `;
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await sql`
      UPDATE users SET plan = 'free', stripe_subscription_id = NULL
      WHERE stripe_subscription_id = ${sub.id}
    `;
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const active = sub.status === "active" || sub.status === "trialing";
    const priceId = sub.items.data[0]?.price.id ?? "";
    const plan = active ? planFromPriceId(priceId) : "free";
    await sql`
      UPDATE users SET plan = ${plan}
      WHERE stripe_subscription_id = ${sub.id}
    `;
  }

  return Response.json({ received: true });
}
