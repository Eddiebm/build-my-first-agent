export const runtime = "edge";

import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { deleteAssistant, releasePhoneNumber } from "@/lib/vapi";

export async function POST(req: Request) {
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

  if (rows.length === 0) return Response.json({ error: "Not found" }, { status: 404 });

  const agent = rows[0];

  if (agent.vapi_assistant_id) {
    await deleteAssistant(agent.vapi_assistant_id as string).catch(() => {});
  }
  if (agent.vapi_phone_number_id) {
    await releasePhoneNumber(agent.vapi_phone_number_id as string).catch(() => {});
  }

  await sql`
    UPDATE agents
    SET voice_enabled = FALSE,
        phone_number = NULL,
        vapi_phone_number_id = NULL,
        vapi_assistant_id = NULL
    WHERE id = ${agentId}
  `;

  return Response.json({ ok: true });
}
