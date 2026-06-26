export const runtime = "edge";

import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getToolsByName } from "@/lib/tools";

interface Message {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

const FREE_MESSAGE_LIMIT = 500;
const PRO_DAILY_LIMIT = 200;
const BUSINESS_DAILY_LIMIT = 1000;
const MAX_TOOL_ROUNDS = 5;

const BUSINESS_ONLY_TOOLS = ["web_search", "read_url"];

const DEMO_RESPONSES: Record<string, string> = {
  greeting: "Hello! I'm your AI assistant. I'm here to help — what can I do for you today?",
  thanks: "You're very welcome! Is there anything else I can help you with?",
  default: "I understand your question. Could you give me a bit more detail so I can give you the most useful answer?",
};

function getDemoResponse(msg: string): string {
  const l = msg.toLowerCase();
  if (l.match(/^(hi|hello|hey|good morning|good afternoon)/)) return DEMO_RESPONSES.greeting;
  if (l.match(/(thank|thanks|appreciate)/)) return DEMO_RESPONSES.thanks;
  return DEMO_RESPONSES.default;
}

const enc = new TextEncoder();

// Encode a custom SSE activity event (tool call progress shown in chat)
function activityEvent(text: string): Uint8Array {
  return enc.encode(`data: ${JSON.stringify({ t: "a", v: text })}\n\n`);
}

// Encode a text delta in the existing OpenRouter-compatible format
function deltaEvent(content: string): Uint8Array {
  return enc.encode(
    `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`
  );
}

function doneEvent(): Uint8Array {
  return enc.encode("data: [DONE]\n\n");
}

function streamText(text: string): Response {
  const stream = new ReadableStream({
    async start(controller) {
      for (const word of text.split(" ")) {
        controller.enqueue(deltaEvent(word + " "));
        await new Promise((r) => setTimeout(r, 30));
      }
      controller.enqueue(doneEvent());
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callLLM(
  apiKey: string,
  messages: Message[],
  toolSchemas: object[],
  stream: boolean
): Promise<Response> {
  return fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://buildmyfirstagent.com",
      "X-Title": "Build My First Agent",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      stream,
      max_tokens: 1024,
      ...(toolSchemas.length > 0 && { tools: toolSchemas, tool_choice: "auto" }),
    }),
  });
}

// Run the agentic loop: non-streaming calls until no tool_calls, then stream final text.
function runAgentLoop(
  apiKey: string,
  messages: Message[],
  toolSchemas: object[],
  toolNames: string[],
  resolvedTools?: ReturnType<typeof getToolsByName>
): Response {
  const stream = new ReadableStream({
    async start(controller) {
      const history = [...messages];
      const tools = resolvedTools ?? getToolsByName(toolNames);

      let round = 0;
      while (round < MAX_TOOL_ROUNDS) {
        round++;
        const res = await callLLM(apiKey, history, toolSchemas, false);
        if (!res.ok) {
          controller.enqueue(deltaEvent("Sorry, something went wrong. Please try again."));
          controller.enqueue(doneEvent());
          controller.close();
          return;
        }

        const json = await res.json() as {
          choices: Array<{
            message: {
              role: string;
              content: string | null;
              tool_calls?: ToolCall[];
            };
          }>;
        };

        const msg = json.choices?.[0]?.message;
        if (!msg) break;

        if (!msg.tool_calls || msg.tool_calls.length === 0) {
          // No more tool calls — stream the final text response
          history.push({ role: "assistant", content: msg.content ?? "" });
          const finalRes = await callLLM(apiKey, history, [], true);
          if (!finalRes.ok || !finalRes.body) {
            controller.enqueue(deltaEvent(msg.content ?? ""));
            controller.enqueue(doneEvent());
            controller.close();
            return;
          }
          const reader = finalRes.body.getReader();
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.enqueue(doneEvent());
          controller.close();
          return;
        }

        // Add assistant message with tool_calls to history
        history.push({
          role: "assistant",
          content: msg.content ?? "",
          tool_calls: msg.tool_calls,
        } as Message);

        // Execute each tool call
        for (const tc of msg.tool_calls) {
          const toolDef = tools.find((t) => t.name === tc.function.name);
          let args: Record<string, string> = {};
          try { args = JSON.parse(tc.function.arguments) as Record<string, string>; } catch { /* noop */ }

          if (toolDef) {
            const label = `${toolDef.emoji} ${toolDef.label}${args.query ? `: ${args.query}` : args.url ? `: ${args.url}` : args.expression ? `: ${args.expression}` : ""}`;
            controller.enqueue(activityEvent(label));
            const result = await toolDef.execute(args);
            history.push({
              role: "tool",
              content: result,
              tool_call_id: tc.id,
            } as Message);
          } else {
            history.push({
              role: "tool",
              content: "Tool not available.",
              tool_call_id: tc.id,
            } as Message);
          }
        }
      }

      // Fallback: hit max rounds
      controller.enqueue(deltaEvent("I've gathered the information I need. Let me summarize."));
      controller.enqueue(doneEvent());
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    messages: Message[];
    agentId?: string;
    systemPrompt?: string;
  };

  const { messages, agentId } = body;
  let systemPrompt = body.systemPrompt;
  let agentTools: string[] = [];

  if (agentId) {
    const sql = getDb();
    const rows = await sql`
      SELECT blueprint, published, message_count, tools, integrations,
             daily_message_count, daily_reset_at,
             (SELECT plan FROM users WHERE id = agents.user_id) AS plan
      FROM agents WHERE id = ${agentId}
    `;
    if (rows.length === 0) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }
    const agent = rows[0];
    if (!agent.published) {
      return Response.json({ error: "Agent is not published" }, { status: 403 });
    }

    const plan = agent.plan as "free" | "pro" | "business";
    const today = new Date().toISOString().slice(0, 10);
    const resetAt = (agent.daily_reset_at as Date | string | null);
    const resetDateStr = resetAt ? (typeof resetAt === "string" ? resetAt.slice(0, 10) : resetAt.toISOString().slice(0, 10)) : "1970-01-01";
    const effectiveDaily = resetDateStr < today ? 0 : (agent.daily_message_count as number) ?? 0;

    if (plan === "free" && (agent.message_count as number) >= FREE_MESSAGE_LIMIT) {
      return Response.json(
        { error: "This agent has reached its message limit. The owner needs to upgrade to Pro." },
        { status: 429 }
      );
    }
    if (plan === "pro" && effectiveDaily >= PRO_DAILY_LIMIT) {
      return Response.json(
        { error: "This agent has reached its daily limit (200 messages). Resets at midnight." },
        { status: 429 }
      );
    }
    if (plan === "business" && effectiveDaily >= BUSINESS_DAILY_LIMIT) {
      return Response.json(
        { error: "This agent has reached its daily limit (1,000 messages). Resets at midnight." },
        { status: 429 }
      );
    }

    const bp = agent.blueprint as { systemPrompt?: string };
    systemPrompt = bp?.systemPrompt ?? "You are a helpful AI assistant.";
    agentTools = (agent.tools as string[]) ?? [];

    // Gate web search and read_url to Business plan only
    if (plan !== "business") {
      agentTools = agentTools.filter((t) => !BUSINESS_ONLY_TOOLS.includes(t));
    }

    // Inject integrations into system prompt
    const integrations = (agent.integrations ?? {}) as {
      leadCapture?: boolean;
      calendarUrl?: string;
    };
    if (integrations.leadCapture) {
      systemPrompt += "\n\nWhen a visitor shares their name and at least one contact method (email or phone number), immediately use the capture_lead tool to save their information. Do this naturally — don't ask for all fields at once if it feels forced.";
      if (!agentTools.includes("capture_lead")) agentTools = [...agentTools, "capture_lead"];
    }
    if (integrations.calendarUrl) {
      systemPrompt += `\n\nCalendar/Booking: When the user wants to schedule a meeting, call, or appointment, share this booking link: ${integrations.calendarUrl} — do not try to handle scheduling yourself, just share the link.`;
    }

    // Increment counters atomically — reset daily count if date rolled over
    sql`
      UPDATE agents
      SET message_count = message_count + 1,
          daily_message_count = CASE WHEN daily_reset_at < CURRENT_DATE THEN 1 ELSE daily_message_count + 1 END,
          daily_reset_at = CURRENT_DATE
      WHERE id = ${agentId}
    `.catch(() => {});
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    const last = messages.filter((m) => m.role === "user").pop();
    return streamText(getDemoResponse(last?.content ?? ""));
  }

  const allMessages: Message[] = [];
  if (systemPrompt) allMessages.push({ role: "system", content: systemPrompt });
  allMessages.push(...messages);

  // Advanced agent: run tool loop
  if (agentTools.length > 0) {
    const toolDefs = getToolsByName(agentTools).map((t) => {
      // Override capture_lead to write directly to DB with the current agentId
      if (t.name === "capture_lead" && agentId) {
        const sql = getDb();
        return {
          ...t,
          execute: async (args: Record<string, string>) => {
            await sql`
              INSERT INTO leads (agent_id, name, email, phone, notes)
              VALUES (${agentId}, ${args.name ?? null}, ${args.email ?? null}, ${args.phone ?? null}, ${args.notes ?? null})
            `;
            return `Got it! I've saved ${args.name ?? "your"} contact info for the team. Someone will follow up soon.`;
          },
        };
      }
      return t;
    });
    const schemas = toolDefs.map((t) => t.openaiSchema);
    return runAgentLoop(apiKey, allMessages, schemas, agentTools, toolDefs);
  }

  // Basic agent: direct streaming
  const res = await callLLM(apiKey, allMessages, [], true);
  if (!res.ok) {
    return new Response(JSON.stringify({ error: "AI request failed" }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(res.body, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
