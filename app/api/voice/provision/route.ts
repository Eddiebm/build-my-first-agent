export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { createVapiAssistant, buyVapiPhoneNumber } from "@/lib/vapi";

export async function POST(req: NextRequest): Promise<Response> {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (session.plan === "free") {
    return Response.json(
      { error: "Voice agents require a Pro or Business plan.", upgradeRequired: true },
      { status: 403 }
    );
  }

  const { agentId } = await req.json() as { agentId: string };
  if (!agentId) return Response.json({ error: "agentId required" }, { status: 400 });

  const sql = getDb();

  // Verify ownership and get system prompt
  const rows = await sql`
    SELECT id, name, blueprint, voice_enabled, vapi_assistant_id
    FROM agents
    WHERE id = ${agentId} AND user_id = ${session.userId}
  `;
  if (rows.length === 0) return Response.json({ error: "Agent not found" }, { status: 404 });

  const agent = rows[0];
  if (agent.voice_enabled) {
    return Response.json({ error: "Voice already enabled on this agent" }, { status: 409 });
  }

  const bp = agent.blueprint as { systemPrompt?: string; mission?: string };
  const systemPrompt =
    bp?.systemPrompt ??
    `You are ${agent.name as string}, a helpful AI assistant. Answer questions clearly and professionally. When someone wants to leave their contact information, use the capture_lead tool to save it.`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://buildmyfirstagent.com";
  const agentName = agent.name as string;

  // Create Vapi assistant
  const assistant = await createVapiAssistant({
    name: `${agentName} — Voice`,
    systemPrompt,
    firstMessage: `Hi, thanks for calling. This is ${agentName}. How can I help you today?`,
    appUrl,
  });

  // Buy phone number linked to this assistant
  const phoneNumber = await buyVapiPhoneNumber(assistant.id);

  // Save to DB
  await sql`
    UPDATE agents
    SET voice_enabled = TRUE,
        vapi_assistant_id = ${assistant.id},
        vapi_phone_number_id = ${phoneNumber.id},
        phone_number = ${phoneNumber.number}
    WHERE id = ${agentId}
  `;

  return Response.json({
    phoneNumber: phoneNumber.number,
    vapiAssistantId: assistant.id,
  });
}
