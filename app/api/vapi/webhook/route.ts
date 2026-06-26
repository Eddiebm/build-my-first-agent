export const runtime = "edge";

import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { sendEmail, leadNotificationEmail } from "@/lib/email";

interface VapiCall {
  id: string;
  assistantId: string;
  customer?: { number?: string };
}

interface VapiMessage {
  type: string;
  call: VapiCall;
  functionCall?: {
    name: string;
    parameters: string;
  };
  // end-of-call-report fields
  endedReason?: string;
  transcript?: string;
  summary?: string;
  durationSeconds?: number;
}

interface VapiEvent {
  message: VapiMessage;
}

export async function POST(req: NextRequest) {
  // Verify webhook secret if set
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (secret) {
    const incoming = req.headers.get("x-vapi-secret");
    if (incoming !== secret) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const event = await req.json() as VapiEvent;
  const { message } = event;
  const assistantId = message?.call?.assistantId;

  if (!assistantId) {
    return Response.json({ result: "ok" });
  }

  const sql = getDb();

  // Look up the agent by vapi_assistant_id
  const rows = await sql`
    SELECT a.id, a.name,
           (SELECT email FROM users WHERE id = a.user_id) AS owner_email
    FROM agents a
    WHERE a.vapi_assistant_id = ${assistantId}
    LIMIT 1
  `;
  const agent = rows[0];
  if (!agent) {
    return Response.json({ result: "unknown assistant" });
  }

  const agentId = agent.id as string;
  const agentName = agent.name as string;
  const ownerEmail = agent.owner_email as string | null;

  // Handle function calls
  if (message.type === "function-call" && message.functionCall) {
    const { name, parameters } = message.functionCall;
    let args: Record<string, string> = {};
    try { args = JSON.parse(parameters) as Record<string, string>; } catch { /* noop */ }

    if (name === "capture_lead") {
      await sql`
        INSERT INTO leads (agent_id, name, email, phone, notes)
        VALUES (${agentId}, ${args.name ?? null}, ${args.email ?? null}, ${args.phone ?? null}, ${args.notes ?? null})
      `;

      // Increment call lead count — best effort
      sql`
        UPDATE calls SET leads_captured = leads_captured + 1
        WHERE agent_id = ${agentId} AND vapi_call_id = ${message.call.id}
      `.catch(() => {});

      if (ownerEmail) {
        sendEmail({
          to: ownerEmail,
          subject: `📞 New call lead: ${args.name ?? args.phone ?? "caller"} via ${agentName}`,
          html: leadNotificationEmail({
            agentName,
            leadName: args.name,
            leadEmail: args.email,
            leadPhone: args.phone ?? message.call.customer?.number,
            notes: args.notes,
          }),
        }).catch(() => {});
      }

      return Response.json({ result: `Saved ${args.name ?? "caller"}'s information. I'll make sure the team follows up with you.` });
    }

    return Response.json({ result: "Tool not available." });
  }

  // Handle end of call — save transcript
  if (message.type === "end-of-call-report") {
    await sql`
      INSERT INTO calls (agent_id, vapi_call_id, caller_number, duration_seconds, transcript, summary, ended_reason)
      VALUES (
        ${agentId},
        ${message.call.id},
        ${message.call.customer?.number ?? null},
        ${message.durationSeconds ?? null},
        ${message.transcript ?? null},
        ${message.summary ?? null},
        ${message.endedReason ?? null}
      )
      ON CONFLICT DO NOTHING
    `;
    return Response.json({ result: "ok" });
  }

  return Response.json({ result: "ok" });
}
