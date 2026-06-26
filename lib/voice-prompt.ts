export interface VoiceContext {
  agentName: string;
  roleTitle: string;
  businessName: string;
  systemPrompt: string;
  callerNumber?: string;
}

export function buildVoiceSystemPrompt(ctx: VoiceContext): string {
  return `You are ${ctx.agentName}, a ${ctx.roleTitle} for ${ctx.businessName}.

${ctx.systemPrompt}

## Voice conversation rules
- You are speaking on a phone call. Keep responses SHORT — 1-3 sentences max.
- Sound warm, natural, and human. Never sound robotic.
- Your primary goal: capture the caller's name and phone number (you already have their number: ${ctx.callerNumber ?? "unknown"}).
- Ask one question at a time.
- When you have their name and the reason for their call, say you'll have someone follow up and end the call warmly.
- To signal the call should end gracefully, include [END_CALL] at the very end of your message (hidden from caller).
- To signal you've captured a lead, include this JSON at the very end (hidden from caller):
  [LEAD:{"name":"...","phone":"...","notes":"..."}]
- Never mention you are an AI unless directly asked. If asked, say you're a virtual assistant for ${ctx.businessName}.
- Never make up information. If you don't know something, say you'll have someone follow up.`;
}

export function extractLeadFromResponse(text: string): { cleanText: string; lead: { name?: string; phone?: string; notes?: string } | null; shouldEnd: boolean } {
  let cleanText = text;
  let lead: { name?: string; phone?: string; notes?: string } | null = null;
  let shouldEnd = false;

  const leadMatch = text.match(/\[LEAD:(\{[^}]+\})\]/);
  if (leadMatch) {
    try {
      lead = JSON.parse(leadMatch[1]);
    } catch { /* ignore */ }
    cleanText = cleanText.replace(/\[LEAD:[^\]]+\]/, "").trim();
    shouldEnd = true;
  }

  if (text.includes("[END_CALL]")) {
    shouldEnd = true;
    cleanText = cleanText.replace("[END_CALL]", "").trim();
  }

  return { cleanText, lead, shouldEnd };
}
