export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { generateBlueprint } from "@/lib/blueprint-generator";

export async function POST(req: NextRequest) {
  const { timeEater, audience, neverDo } = await req.json() as {
    timeEater: string;
    audience?: string;
    neverDo?: string;
  };

  if (!timeEater?.trim()) {
    return Response.json({ error: "Please describe what's eating your time" }, { status: 400 });
  }

  // Map plain answers to full WizardAnswers with sensible defaults
  const answers = {
    job: timeEater,
    user: audience ?? "Anyone who interacts with this assistant",
    problem: `Too much time spent on: ${timeEater}`,
    output: "A clear, helpful, friendly answer in plain English. Short and to the point.",
    tools: "No tools needed — answer from built-in knowledge",
    memory: "No memory needed — each conversation starts fresh",
    trigger: "On demand — when someone sends a message",
    approval: "No — handle all routine messages automatically",
    never: neverDo ?? "Never make up facts. Never be rude. Always admit when you don't know something.",
    success: `Users get a fast, accurate answer without needing to involve a human`,
  };

  const blueprint = generateBlueprint(answers);

  // If logged in, save and publish immediately
  const session = await getSession();
  if (session) {
    const sql = getDb();

    // Free plan: enforce 1-agent limit
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
      INSERT INTO agents (user_id, name, answers, blueprint, published)
      VALUES (
        ${session.userId},
        ${blueprint.name ?? "My Agent"},
        ${JSON.stringify(answers)},
        ${JSON.stringify(blueprint)},
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
      chatUrl: `${appUrl}/chat/${agent.id}`,
      blueprint,
    });
  }

  // Not logged in — return blueprint only, user can claim after signup
  return Response.json({
    saved: false,
    blueprint,
    agentName: blueprint.name,
  });
}
