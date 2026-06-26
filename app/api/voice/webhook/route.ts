export const runtime = "edge";

import { getDb } from "@/lib/db";
import { sendEmail, leadNotificationEmail } from "@/lib/email";
import { extractLeadFromTranscript } from "@/lib/vapi";

interface VapiEndOfCallMessage {
  type: string;
  endedReason?: string;
  transcript?: string;
  summary?: string;
  call?: {
    id?: string;
    assistantId?: string;
    customer?: { number?: string };
  };
  customer?: { number?: string };
}

interface VapiWebhookPayload {
  message?: VapiEndOfCallMessage;
}

export async function POST(req: Request) {
  const body = await req.json() as VapiWebhookPayload;
  const msg = body?.message;

  if (!msg || msg.type !== "end-of-call-report") {
    return Response.json({ ok: true });
  }

  const assistantId = msg.call?.assistantId;
  const callerNumber = msg.call?.customer?.number ?? msg.customer?.number ?? "Unknown";
  const transcript = msg.transcript ?? "";

  if (!assistantId || !transcript) return Response.json({ ok: true });

  const sql = getDb();

  const rows = await sql`
    SELECT a.id, a.name, a.blueprint, a.phone_number,
           u.email as owner_email
    FROM agents a
    JOIN users u ON u.id = a.user_id
    WHERE a.vapi_assistant_id = ${assistantId}
  `;

  if (rows.length === 0) return Response.json({ ok: true });

  const agent = rows[0];
  const bp = agent.blueprint as { name?: string; businessName?: string };
  const humanName = bp?.name && (bp.name as string).length < 20 ? bp.name as string : agent.name as string;

  const lead = await extractLeadFromTranscript(transcript, callerNumber);

  if (lead?.name || lead?.phone) {
    await sql`
      INSERT INTO leads (agent_id, name, phone, notes)
      VALUES (${agent.id}, ${lead.name ?? ""}, ${lead.phone ?? callerNumber}, ${lead.notes ?? "Called in via voice"})
    `;

    await sendEmail({
      to: agent.owner_email as string,
      subject: `📞 ${humanName} captured a new lead — ${lead.name ?? callerNumber}`,
      html: leadNotificationEmail({
        agentName: humanName,
        leadName: lead.name ?? "Unknown",
        leadPhone: lead.phone ?? callerNumber,
        notes: lead.notes ?? "",
      }),
    }).catch(() => {});
  }

  await sql`
    INSERT INTO voice_calls (agent_id, call_sid, caller_number, transcript, lead_captured, status, completed_at)
    VALUES (
      ${agent.id as string}::uuid,
      ${msg.call?.id ?? ""},
      ${callerNumber},
      ${JSON.stringify([{ role: "transcript", content: transcript }])},
      ${lead ? JSON.stringify(lead) : null},
      ${"completed"},
      NOW()
    )
    ON CONFLICT (call_sid) DO UPDATE
    SET transcript = EXCLUDED.transcript,
        lead_captured = EXCLUDED.lead_captured,
        status = EXCLUDED.status,
        completed_at = EXCLUDED.completed_at
  `;

  return Response.json({ ok: true });
}
