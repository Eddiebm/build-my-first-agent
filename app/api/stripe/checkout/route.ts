export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getStripe, getPriceId } from "@/lib/stripe";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { tier?: "pro" | "business" };
  const tier = body.tier === "business" ? "business" : "pro";

  const stripe = getStripe();
  const sql = getDb();

  const rows = await sql`SELECT stripe_customer_id FROM users WHERE id = ${session.userId}`;
  const customerId = rows[0]?.stripe_customer_id as string | null;

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3005";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId ?? undefined,
    customer_email: customerId ? undefined : session.email,
    line_items: [{ price: getPriceId(tier), quantity: 1 }],
    success_url: `${origin}/dashboard?upgraded=1`,
    cancel_url: `${origin}/pricing`,
    metadata: { userId: session.userId, tier },
    subscription_data: { metadata: { userId: session.userId, tier } },
  });

  return Response.json({ url: checkoutSession.url });
}
