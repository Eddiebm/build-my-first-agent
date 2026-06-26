export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { deleteVapiAssistant, releaseVapiPhoneNumber } from "@/lib/vapi";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { agentId } = await req.json() as { agentId: string };
  if (!agentId) return Response.json({ error: "agentId required" }, { status: 400 });

  const sql = getDb();

  const rows = await sql`
    SELECT id, vapi_assistant_id, vapi_phone_number_id
    FROM agents
    WHERE id = ${agentId} AND user_id = ${session.userId}
  `;
  if (rows.length === 0) return Response.json({ error: "Agent not found" }, { status: 404 });

  const agent = rows[0];
  const assistantId = agent.vapi_assistant_id as string | null;
  const phoneNumberId = agent.vapi_phone_number_id as string | null;

  // Clean up Vapi resources — best effort
  if (phoneNumberId) {
    await releaseVapiPhoneNumber(phoneNumberId).catch(() => {});
  }
  if (assistantId) {
    await deleteVapiAssistant(assistantId).catch(() => {});
  }

  await sql`
    UPDATE agents
    SET voice_enabled = FALSE,
        vapi_assistant_id = NULL,
        vapi_phone_number_id = NULL,
        phone_number = NULL
    WHERE id = ${agentId}
  `;

  return Response.json({ ok: true });
}
