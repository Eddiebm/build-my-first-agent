const BASE = "https://api.vapi.ai";

function vapiHeaders() {
  const key = process.env.VAPI_API_KEY;
  if (!key) throw new Error("Missing VAPI_API_KEY");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function createAssistant({
  name,
  systemPrompt,
  firstMessage,
}: {
  name: string;
  systemPrompt: string;
  firstMessage: string;
}): Promise<string> {
  const res = await fetch(`${BASE}/assistant`, {
    method: "POST",
    headers: vapiHeaders(),
    body: JSON.stringify({
      name,
      model: {
        provider: "anthropic",
        model: "claude-haiku-4-5-20251001",
        messages: [{ role: "system", content: systemPrompt }],
        maxTokens: 150,
        temperature: 0.7,
      },
      voice: {
        provider: "azure",
        voiceId: "en-US-JennyNeural",
        speed: 1.0,
      },
      firstMessage,
      endCallFunctionEnabled: true,
      endCallMessage: "Thank you for calling. Someone from our team will follow up with you shortly. Have a great day!",
      recordingEnabled: false,
      serverUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/webhook`,
      serverUrlSecret: process.env.VAPI_WEBHOOK_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`Vapi createAssistant failed: ${await res.text()}`);
  const data = await res.json() as { id: string };
  return data.id;
}

export async function buyPhoneNumber(
  areaCode: string,
  assistantId: string
): Promise<{ id: string; number: string }> {
  const res = await fetch(`${BASE}/phone-number`, {
    method: "POST",
    headers: vapiHeaders(),
    body: JSON.stringify({
      provider: "vapi",
      numberDesiredAreaCode: areaCode || "415",
      assistantId,
    }),
  });
  if (!res.ok) throw new Error(`Vapi buyPhoneNumber failed: ${await res.text()}`);
  const data = await res.json() as { id: string; number: string };
  return data;
}

export async function deleteAssistant(assistantId: string): Promise<void> {
  await fetch(`${BASE}/assistant/${assistantId}`, {
    method: "DELETE",
    headers: vapiHeaders(),
  });
}

export async function releasePhoneNumber(phoneNumberId: string): Promise<void> {
  await fetch(`${BASE}/phone-number/${phoneNumberId}`, {
    method: "DELETE",
    headers: vapiHeaders(),
  });
}

export async function extractLeadFromTranscript(transcript: string, callerNumber: string): Promise<{
  name: string;
  phone: string;
  notes: string;
} | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "anthropic/claude-haiku-4-5-20251001",
      messages: [
        {
          role: "system",
          content: "Extract lead info from a call transcript. Return JSON only: {\"name\": string|null, \"phone\": string|null, \"notes\": string}. Use null if not mentioned. notes should be a one-sentence summary of why they called.",
        },
        {
          role: "user",
          content: `Caller number: ${callerNumber}\n\nTranscript:\n${transcript}`,
        },
      ],
      max_tokens: 150,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  try {
    return JSON.parse(data.choices[0].message.content) as { name: string; phone: string; notes: string };
  } catch {
    return null;
  }
}
