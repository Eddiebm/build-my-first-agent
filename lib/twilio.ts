const BASE = "https://api.twilio.com/2010-04-01";

function auth() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Missing Twilio credentials");
  return `Basic ${btoa(`${sid}:${token}`)}`;
}

export async function buyPhoneNumber(areaCode: string, agentId: string): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const sid = process.env.TWILIO_ACCOUNT_SID;
  if (!sid) throw new Error("Missing TWILIO_ACCOUNT_SID");

  const res = await fetch(`${BASE}/Accounts/${sid}/IncomingPhoneNumbers.json`, {
    method: "POST",
    headers: {
      Authorization: auth(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      AreaCode: areaCode || "415",
      VoiceUrl: `${appUrl}/api/voice/inbound?agentId=${agentId}`,
      VoiceMethod: "POST",
      StatusCallback: `${appUrl}/api/voice/status?agentId=${agentId}`,
      StatusCallbackMethod: "POST",
      StatusCallbackEvent: "completed",
    }).toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twilio number purchase failed: ${err}`);
  }

  const data = await res.json() as { phone_number: string };
  return data.phone_number;
}

export async function sendSms(to: string, from: string, body: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  if (!sid) throw new Error("Missing TWILIO_ACCOUNT_SID");

  await fetch(`${BASE}/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: auth(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  });
}

export function twiml(xml: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>${xml}`, {
    headers: { "Content-Type": "text/xml" },
  });
}
