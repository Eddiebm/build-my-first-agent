export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getRoleById } from "@/lib/employee-roles";

export async function POST(req: NextRequest) {
  const { roleId, businessName, context, neverDo, calendarUrl } = await req.json() as {
    roleId: string;
    businessName: string;
    context: string;
    neverDo?: string;
    calendarUrl?: string;
  };

  if (!roleId || !businessName?.trim() || !context?.trim()) {
    return Response.json({ error: "roleId, businessName, and context are required" }, { status: 400 });
  }

  const role = getRoleById(roleId);
  if (!role) return Response.json({ error: "Unknown role" }, { status: 400 });

  const systemPrompt = role.buildSystemPrompt({ businessName, context, neverDo });

  const agentName = `${businessName} — ${role.title}`;
  const blueprint = {
    name: agentName,
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
          { error: "Free plan allows 1 agent. Upgrade to Pro for unlimited.", upgradeRequired: true },
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
      chatUrl: `${appUrl}/chat/${agent.id}`,
    });
  }

  // Not logged in — return blueprint for claim after signup
  if (typeof global !== "undefined") {
    // Store in a way the client can pick up
  }
  return Response.json({
    saved: false,
    roleTitle: role.title,
    roleEmoji: role.emoji,
    blueprint,
    tools: role.defaultTools,
    integrations,
  });
}
