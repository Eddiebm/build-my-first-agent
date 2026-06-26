export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getRoleById } from "@/lib/employee-roles";

async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BuildMyFirstAgent/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return "";
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 3000);
    return text.length > 100 ? text : "";
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const { roleId, businessName, context, neverDo, calendarUrl, websiteUrl } = await req.json() as {
    roleId: string;
    businessName: string;
    context: string;
    neverDo?: string;
    calendarUrl?: string;
    websiteUrl?: string;
  };

  if (!roleId || !businessName?.trim() || !context?.trim()) {
    return Response.json({ error: "roleId, businessName, and context are required" }, { status: 400 });
  }

  const role = getRoleById(roleId);
  if (!role) return Response.json({ error: "Unknown role" }, { status: 400 });

  // Enrich context with website content if provided
  let enrichedContext = context;
  if (websiteUrl?.trim()) {
    const siteContent = await fetchWebsiteContent(websiteUrl.trim());
    if (siteContent) {
      enrichedContext = `${context}\n\nAdditional context from ${businessName}'s website: ${siteContent}`;
    }
  }

  const systemPrompt = role.buildSystemPrompt({ businessName, context: enrichedContext, neverDo });

  const agentName = role.humanName;
  const blueprint = {
    name: agentName,
    roleTitle: role.title,
    roleEmoji: role.emoji,
    businessName,
    mission: role.tagline,
    systemPrompt,
    roleId,
  };

  const integrations = {
    ...role.defaultIntegrations,
    ...(calendarUrl ? { calendarUrl } : {}),
  };

  const session = await getSession();
  if (session) {
    const sql = getDb();

    if (session.plan === "free") {
      const existing = await sql`SELECT id FROM agents WHERE user_id = ${session.userId}`;
      if (existing.length >= 1) {
        return Response.json(
          { error: "Free plan allows 1 AI employee. Upgrade to Growth for unlimited.", upgradeRequired: true },
          { status: 403 }
        );
      }
    }

    const rows = await sql`
      INSERT INTO agents (user_id, name, answers, blueprint, tools, integrations, published)
      VALUES (
        ${session.userId},
        ${agentName},
        ${"{}"},
        ${JSON.stringify(blueprint)},
        ${JSON.stringify(role.defaultTools)},
        ${JSON.stringify(integrations)},
        TRUE
      )
      RETURNING id, name
    `;
    const agent = rows[0];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3005";

    return Response.json({
      saved: true,
      agentId: agent.id,
      agentName: agent.name,
      roleTitle: role.title,
      roleEmoji: role.emoji,
      businessName,
      chatUrl: `${appUrl}/chat/${agent.id}`,
    });
  }

  return Response.json({
    saved: false,
    roleTitle: role.title,
    roleEmoji: role.emoji,
    businessName,
    blueprint,
    tools: role.defaultTools,
    integrations,
  });
}
