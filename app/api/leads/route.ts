export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

// GET /api/leads?agentId=xxx — owner views their leads
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const agentId = new URL(req.url).searchParams.get("agentId");
  if (!agentId) return Response.json({ error: "agentId required" }, { status: 400 });

  const sql = getDb();
  // Verify ownership
  const agent = await sql`SELECT id FROM agents WHERE id = ${agentId} AND user_id = ${session.userId}`;
  if (agent.length === 0) return Response.json({ error: "Not found" }, { status: 404 });

  const leads = await sql`
    SELECT id, name, email, phone, notes, created_at
    FROM leads WHERE agent_id = ${agentId}
    ORDER BY created_at DESC
  `;
  return Response.json({ leads });
}

// POST /api/leads — called internally by the capture_lead tool executor
export async function POST(req: NextRequest) {
  const { agentId, name, email, phone, notes } = await req.json() as {
    agentId: string;
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  };

  if (!agentId) return Response.json({ error: "agentId required" }, { status: 400 });

  const sql = getDb();
  await sql`
    INSERT INTO leads (agent_id, name, email, phone, notes)
    VALUES (${agentId}, ${name ?? null}, ${email ?? null}, ${phone ?? null}, ${notes ?? null})
  `;
  return Response.json({ ok: true });
}
