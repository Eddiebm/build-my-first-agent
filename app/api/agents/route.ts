export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();
  const agents = await sql`
    SELECT id, name, blueprint, created_at, updated_at
    FROM agents
    WHERE user_id = ${session.userId}
    ORDER BY updated_at DESC
  `;
  return Response.json({ agents });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();

  // Free users can save 1 agent
  if (session.plan === "free") {
    const existing = await sql`SELECT id FROM agents WHERE user_id = ${session.userId}`;
    if (existing.length >= 1) {
      return Response.json(
        { error: "Free plan allows 1 saved agent. Upgrade to Pro for unlimited." },
        { status: 403 }
      );
    }
  }

  const { name, answers, blueprint } = await req.json() as {
    name: string;
    answers: Record<string, string>;
    blueprint: Record<string, unknown>;
  };

  if (!name) return Response.json({ error: "Agent name is required" }, { status: 400 });

  const rows = await sql`
    INSERT INTO agents (user_id, name, answers, blueprint)
    VALUES (${session.userId}, ${name}, ${JSON.stringify(answers)}, ${JSON.stringify(blueprint)})
    RETURNING id, name, created_at
  `;
  return Response.json({ agent: rows[0] }, { status: 201 });
}
