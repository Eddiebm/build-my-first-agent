import Stripe from "stripe";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

export function getPriceId(tier: "pro" | "business" = "pro"): string {
  const envKey = tier === "business" ? "STRIPE_BUSINESS_PRICE_ID" : "STRIPE_PRICE_ID";
  const id = process.env[envKey];
  if (!id) throw new Error(`${envKey} is not set`);
  return id;
}
