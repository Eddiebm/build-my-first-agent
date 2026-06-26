const VAPI_URL = "https://api.vapi.ai";

function vapiKey(): string {
  const key = process.env.VAPI_API_KEY;
  if (!key) throw new Error("VAPI_API_KEY is not set");
  return key;
}

async function vapiReq(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${VAPI_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${vapiKey()}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

export interface VapiAssistant {
  id: string;
  name: string;
}

export interface VapiPhoneNumber {
  id: string;
  number: string;
}

export async function createVapiAssistant({
  name,
  systemPrompt,
  firstMessage,
  appUrl,
}: {
  name: string;
  systemPrompt: string;
  firstMessage: string;
  appUrl: string;
}): Promise<VapiAssistant> {
  const webhookUrl = `${appUrl}/api/vapi/webhook`;
  const llmUrl = `${appUrl}/api/vapi/llm`;
  const secret = process.env.VAPI_WEBHOOK_SECRET;

  const body = {
    name,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    model: {
      provider: "custom-llm",
      url: llmUrl,
      model: "google/gemini-2.5-flash",
      systemPrompt,
      temperature: 0.7,
      tools: [
        {
          type: "function",
          messages: [
            { type: "request-start", content: "Let me save your information." },
            { type: "request-complete", content: "Got it, I've saved your details." },
          ],
          function: {
            name: "capture_lead",
            description:
              "Save the caller's contact information when they share their name, email, or phone number.",
            parameters: {
              type: "object",
              properties: {
                name: { type: "string", description: "Caller's full name" },
                email: { type: "string", description: "Caller's email address" },
                phone: { type: "string", description: "Caller's phone number" },
                notes: { type: "string", description: "Brief notes about their inquiry" },
              },
            },
          },
          async: false,
          server: {
            url: webhookUrl,
            ...(secret ? { secret } : {}),
          },
        },
      ],
    },
    voice: {
      provider: "openai",
      voiceId: "alloy",
    },
    firstMessage,
    endCallMessage: "Thanks for calling. Have a great day!",
    endCallFunctionEnabled: true,
    serverUrl: webhookUrl,
    ...(secret ? { serverUrlSecret: secret } : {}),
    serverMessages: ["end-of-call-report", "hang"],
  };

  const res = await vapiReq("/assistant", { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vapi create assistant failed ${res.status}: ${text}`);
  }
  return res.json() as Promise<VapiAssistant>;
}

export async function buyVapiPhoneNumber(assistantId: string): Promise<VapiPhoneNumber> {
  const res = await vapiReq("/phone-number/buy", {
    method: "POST",
    body: JSON.stringify({ assistantId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vapi buy number failed ${res.status}: ${text}`);
  }
  const data = await res.json() as { number: string; id: string };
  return { id: data.id, number: data.number };
}

export async function deleteVapiAssistant(assistantId: string): Promise<void> {
  await vapiReq(`/assistant/${assistantId}`, { method: "DELETE" });
}

export async function releaseVapiPhoneNumber(phoneNumberId: string): Promise<void> {
  await vapiReq(`/phone-number/${phoneNumberId}`, { method: "DELETE" });
}
