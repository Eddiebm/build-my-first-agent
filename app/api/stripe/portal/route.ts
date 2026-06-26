export const runtime = "edge";

import { getSession } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";

export async function POST() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();
  const rows = await sql`SELECT stripe_customer_id FROM users WHERE id = ${session.userId}`;
  const customerId = rows[0]?.stripe_customer_id as string | null;

  if (!customerId) {
    return Response.json({ error: "No billing account found" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3005";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/account`,
  });

  return Response.json({ url: portalSession.url });
}
