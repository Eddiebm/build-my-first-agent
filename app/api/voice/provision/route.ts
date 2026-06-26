export const runtime = "edge";

import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { buyPhoneNumber } from "@/lib/twilio";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { agentId, areaCode } = await req.json() as { agentId: string; areaCode?: string };
  if (!agentId) return Response.json({ error: "agentId required" }, { status: 400 });

  const sql = getDb();

  // Verify ownership and plan
  const rows = await sql`
    SELECT a.id, a.phone_number, u.plan
    FROM agents a
    JOIN users u ON u.id = a.user_id
    WHERE a.id = ${agentId} AND a.user_id = ${session.userId}
  `;

  if (rows.length === 0) return Response.json({ error: "Not found" }, { status: 404 });

  const agent = rows[0];
  if (agent.plan === "free") {
    return Response.json({ error: "Voice requires Growth or Business plan" }, { status: 403 });
  }

  if (agent.phone_number) {
    return Response.json({ phoneNumber: agent.phone_number });
  }

  const phoneNumber = await buyPhoneNumber(areaCode ?? "415", agentId);

  await sql`
    UPDATE agents SET phone_number = ${phoneNumber}, voice_enabled = TRUE WHERE id = ${agentId}
  `;

  return Response.json({ phoneNumber });
}
