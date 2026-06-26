export const runtime = "edge";

import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ user: null });
  return Response.json({ user: { email: session.email, plan: session.plan } });
}
