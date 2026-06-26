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

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const userId = s.metadata?.userId;
    if (userId && s.customer && s.subscription) {
      await sql`
        UPDATE users
        SET plan = 'pro',
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
    await sql`
      UPDATE users SET plan = ${active ? "pro" : "free"}
      WHERE stripe_subscription_id = ${sub.id}
    `;
  }

  return Response.json({ received: true });
}
