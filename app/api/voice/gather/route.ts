export const runtime = "edge";

import { getDb } from "@/lib/db";
import { twiml } from "@/lib/twilio";
import { buildVoiceSystemPrompt, extractLeadFromResponse } from "@/lib/voice-prompt";

const MAX_TURNS = 12;

export async function POST(req: Request) {
  const url = new URL(req.url);
  const agentId = url.searchParams.get("agentId");
  if (!agentId) return twiml("<Response><Hangup/></Response>");

  const body = await req.formData();
  const speechResult = (body.get("SpeechResult") as string) ?? "";
  const callSid = (body.get("CallSid") as string) ?? "";
  const callerNumber = (body.get("From") as string) ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  if (!speechResult.trim()) {
    return twiml(`
      <Response>
        <Gather input="speech" action="${appUrl}/api/voice/gather?agentId=${agentId}" method="POST" timeout="8" speechTimeout="auto" language="en-US">
          <Say voice="Polly.Joanna-Neural">I'm sorry, I didn't catch that. Could you say that again?</Say>
        </Gather>
        <Hangup/>
      </Response>
    `);
  }

  const sql = getDb();

  // Load agent
  const agentRows = await sql`
    SELECT id, name, blueprint, (SELECT phone FROM users WHERE id = agents.user_id) AS owner_phone
    FROM agents WHERE id = ${agentId} AND published = TRUE
  `;
  if (agentRows.length === 0) return twiml("<Response><Hangup/></Response>");

  const agent = agentRows[0];
  const bp = agent.blueprint as { name?: string; roleTitle?: string; businessName?: string; systemPrompt?: string };
  const agentName = bp?.name && bp.name.length < 20 ? bp.name : (agent.name as string);

  // Load or create call record and conversation history
  const callRows = await sql`
    SELECT id, transcript FROM voice_calls WHERE call_sid = ${callSid}
  `;

  let transcript: Array<{ role: "user" | "assistant"; content: string }> = [];
  let callDbId: string | null = null;

  if (callRows.length > 0) {
    transcript = (callRows[0].transcript as typeof transcript) ?? [];
    callDbId = callRows[0].id as string;
  } else {
    const inserted = await sql`
      INSERT INTO voice_calls (agent_id, call_sid, caller_number, transcript, status)
      VALUES (${agentId}, ${callSid}, ${callerNumber}, ${"[]"}, ${"in_progress"})
      RETURNING id
    `;
    callDbId = inserted[0].id as string;
  }

  if (transcript.length >= MAX_TURNS * 2) {
    await sql`UPDATE voice_calls SET status = ${"completed"} WHERE id = ${callDbId}`;
    return twiml(`<Response><Say voice="Polly.Joanna-Neural">I've got your information and someone will follow up with you shortly. Thanks for calling and have a great day!</Say><Hangup/></Response>`);
  }

  // Add user message
  transcript.push({ role: "user", content: speechResult });

  // Build system prompt
  const systemPrompt = buildVoiceSystemPrompt({
    agentName,
    roleTitle: bp?.roleTitle ?? "Assistant",
    businessName: bp?.businessName ?? "this business",
    systemPrompt: bp?.systemPrompt ?? "",
    callerNumber,
  });

  // Call Claude via OpenRouter
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return twiml("<Response><Say>I'm having technical difficulties. Please call back later.</Say><Hangup/></Response>");

  const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-haiku-4-5-20251001",
      messages: [
        { role: "system", content: systemPrompt },
        ...transcript,
      ],
      max_tokens: 150,
      temperature: 0.7,
    }),
  });

  if (!aiRes.ok) {
    return twiml(`<Response><Say voice="Polly.Joanna-Neural">I'm having a moment of difficulty. Let me transfer you — please hold.</Say><Hangup/></Response>`);
  }

  const aiData = await aiRes.json() as { choices: Array<{ message: { content: string } }> };
  const rawResponse = aiData.choices[0]?.message?.content ?? "I'm sorry, could you repeat that?";

  const { cleanText, lead, shouldEnd } = extractLeadFromResponse(rawResponse);

  // Add assistant message
  transcript.push({ role: "assistant", content: cleanText });

  // Save transcript + lead if captured
  if (lead) {
    await sql`
      UPDATE voice_calls
      SET transcript = ${JSON.stringify(transcript)}, lead_captured = ${JSON.stringify(lead)}
      WHERE id = ${callDbId}
    `;
    await sql`
      INSERT INTO leads (agent_id, name, phone, notes)
      VALUES (${agentId}, ${lead.name ?? ""}, ${lead.phone ?? callerNumber}, ${lead.notes ?? `Called in. Transcript saved.`})
    `;
  } else {
    await sql`
      UPDATE voice_calls SET transcript = ${JSON.stringify(transcript)} WHERE id = ${callDbId}
    `;
  }

  if (shouldEnd) {
    await sql`UPDATE voice_calls SET status = ${"completed"}, completed_at = NOW() WHERE id = ${callDbId}`;
    return twiml(`
      <Response>
        <Say voice="Polly.Joanna-Neural">${escapeXml(cleanText)}</Say>
        <Hangup/>
      </Response>
    `);
  }

  return twiml(`
    <Response>
      <Gather input="speech" action="${appUrl}/api/voice/gather?agentId=${agentId}" method="POST" timeout="8" speechTimeout="auto" language="en-US">
        <Say voice="Polly.Joanna-Neural">${escapeXml(cleanText)}</Say>
      </Gather>
      <Say voice="Polly.Joanna-Neural">I didn't catch that. Someone from our team will follow up with you. Thank you for calling!</Say>
      <Hangup/>
    </Response>
  `);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
