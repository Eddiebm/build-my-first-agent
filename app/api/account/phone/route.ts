export const runtime = "edge";

import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { phone } = await req.json() as { phone: string };
  const cleaned = (phone ?? "").replace(/\D/g, "");
  if (cleaned.length < 10) {
    return Response.json({ error: "Enter a valid 10-digit US phone number" }, { status: 400 });
  }
  const formatted = `+1${cleaned.slice(-10)}`;

  const sql = getDb();
  await sql`UPDATE users SET phone = ${formatted} WHERE id = ${session.userId}`;

  return Response.json({ ok: true, phone: formatted });
}
