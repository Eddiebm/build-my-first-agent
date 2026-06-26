export const runtime = "edge";

import { getDb } from "@/lib/db";
import { twiml } from "@/lib/twilio";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const agentId = url.searchParams.get("agentId");
  if (!agentId) return twiml("<Response><Say>Sorry, this number is not configured.</Say></Response>");

  const sql = getDb();
  const rows = await sql`
    SELECT id, name, blueprint FROM agents WHERE id = ${agentId} AND published = TRUE
  `;

  if (rows.length === 0) {
    return twiml("<Response><Say>Sorry, this line is not available. Please try again later.</Say><Hangup/></Response>");
  }

  const agent = rows[0];
  const bp = agent.blueprint as { name?: string; roleTitle?: string; businessName?: string };
  const agentName = bp?.name && bp.name.length < 20 ? bp.name : (agent.name as string);
  const businessName = bp?.businessName ?? "this business";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const gatherUrl = `${appUrl}/api/voice/gather?agentId=${agentId}`;

  const greeting = `Hi, thank you for calling ${businessName}. This is ${agentName}. How can I help you today?`;

  return twiml(`
    <Response>
      <Gather input="speech" action="${gatherUrl}" method="POST" timeout="8" speechTimeout="auto" language="en-US">
        <Say voice="Polly.Joanna-Neural">${escapeXml(greeting)}</Say>
      </Gather>
      <Say voice="Polly.Joanna-Neural">I didn't catch that. Please call back and we'll be happy to help. Goodbye.</Say>
      <Hangup/>
    </Response>
  `);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
