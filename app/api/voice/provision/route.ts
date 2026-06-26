export const runtime = "edge";

import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { createAssistant, buyPhoneNumber } from "@/lib/vapi";
import { buildVoiceSystemPrompt } from "@/lib/voice-prompt";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { agentId, areaCode } = await req.json() as { agentId: string; areaCode?: string };
  if (!agentId) return Response.json({ error: "agentId required" }, { status: 400 });

  const sql = getDb();

  const rows = await sql`
    SELECT a.id, a.name, a.blueprint, a.phone_number, a.vapi_assistant_id, u.plan
    FROM agents a
    JOIN users u ON u.id = a.user_id
    WHERE a.id = ${agentId} AND a.user_id = ${session.userId}
  `;

  if (rows.length === 0) return Response.json({ error: "Not found" }, { status: 404 });

  const agent = rows[0];
  if (agent.plan === "free") {
    return Response.json({ error: "Voice requires Growth or Business plan", upgradeRequired: true }, { status: 403 });
  }

  if (agent.phone_number && agent.vapi_assistant_id) {
    return Response.json({ phoneNumber: agent.phone_number });
  }

  const bp = agent.blueprint as { name?: string; roleTitle?: string; businessName?: string; systemPrompt?: string };
  const humanName = bp?.name && (bp.name as string).length < 20 ? bp.name as string : agent.name as string;
  const businessName = bp?.businessName ?? "this business";
  const roleTitle = bp?.roleTitle ?? "AI Assistant";

  const systemPrompt = buildVoiceSystemPrompt({
    agentName: humanName,
    roleTitle,
    businessName,
    systemPrompt: bp?.systemPrompt ?? "",
  });

  const firstMessage = `Hi, thank you for calling ${businessName}. This is ${humanName}. How can I help you today?`;

  const assistantId = await createAssistant({ name: `${humanName} — ${businessName}`, systemPrompt, firstMessage });
  const { id: phoneNumberId, number: phoneNumber } = await buyPhoneNumber(areaCode ?? "415", assistantId);

  await sql`
    UPDATE agents
    SET voice_enabled = TRUE,
        phone_number = ${phoneNumber},
        vapi_phone_number_id = ${phoneNumberId},
        vapi_assistant_id = ${assistantId}
    WHERE id = ${agentId}
  `;

  return Response.json({ phoneNumber });
}
