export const runtime = "edge";

import { getDb } from "@/lib/db";
import { sendSms } from "@/lib/twilio";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const agentId = url.searchParams.get("agentId");
  if (!agentId) return Response.json({ ok: true });

  const body = await req.formData();
  const callSid = body.get("CallSid") as string;
  const callDuration = parseInt((body.get("CallDuration") as string) ?? "0", 10);

  const sql = getDb();

  // Mark call completed
  await sql`
    UPDATE voice_calls
    SET status = ${"completed"}, completed_at = NOW(), duration = ${callDuration}
    WHERE call_sid = ${callSid}
  `;

  // Get call + agent + owner info
  const rows = await sql`
    SELECT
      vc.transcript, vc.lead_captured, vc.caller_number,
      a.name as agent_name, a.blueprint, a.phone_number as agent_phone,
      u.phone as owner_phone, u.email as owner_email
    FROM voice_calls vc
    JOIN agents a ON a.id = vc.agent_id
    JOIN users u ON u.id = a.user_id
    WHERE vc.call_sid = ${callSid}
  `;

  if (rows.length === 0) return Response.json({ ok: true });

  const row = rows[0];
  const bp = row.blueprint as { name?: string; businessName?: string };
  const agentName = bp?.name && (bp.name as string).length < 20 ? bp.name as string : row.agent_name as string;
  const lead = row.lead_captured as { name?: string; phone?: string; notes?: string } | null;
  const callerNumber = row.caller_number as string;
  const ownerPhone = row.owner_phone as string | null;
  const agentPhone = row.agent_phone as string | null;

  // Send SMS summary to owner if they have a phone number
  if (ownerPhone && agentPhone) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://buildmyfirstagent.com";
    const callerDisplay = callerNumber ? callerNumber : "Unknown";

    let smsBody: string;
    if (lead?.name) {
      smsBody = `📞 ${agentName} just took a call from ${callerDisplay}.\n\nLead: ${lead.name}${lead.phone ? ` · ${lead.phone}` : ""}\n${lead.notes ? `Notes: ${lead.notes}\n` : ""}\nView: ${appUrl}/dashboard`;
    } else {
      smsBody = `📞 ${agentName} answered a call from ${callerDisplay} (${callDuration}s). No lead captured.\n\nView: ${appUrl}/dashboard`;
    }

    await sendSms(ownerPhone, agentPhone, smsBody).catch(() => {});
  }

  return Response.json({ ok: true });
}
