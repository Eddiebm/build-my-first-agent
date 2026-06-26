export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM agents WHERE id = ${id} AND user_id = ${session.userId}
  `;
  if (rows.length === 0) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ agent: rows[0] });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, answers, blueprint, tools, integrations } = await req.json() as {
    name?: string;
    answers?: Record<string, string>;
    blueprint?: Record<string, unknown>;
    tools?: string[];
    integrations?: Record<string, unknown>;
  };

  const sql = getDb();
  const rows = await sql`
    UPDATE agents
    SET
      name         = COALESCE(${name ?? null}, name),
      answers      = COALESCE(${answers ? JSON.stringify(answers) : null}::jsonb, answers),
      blueprint    = COALESCE(${blueprint ? JSON.stringify(blueprint) : null}::jsonb, blueprint),
      tools        = COALESCE(${tools ? JSON.stringify(tools) : null}::jsonb, tools),
      integrations = COALESCE(${integrations ? JSON.stringify(integrations) : null}::jsonb, integrations),
      updated_at   = NOW()
    WHERE id = ${id} AND user_id = ${session.userId}
    RETURNING id, name, updated_at
  `;
  if (rows.length === 0) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ agent: rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const sql = getDb();
  await sql`DELETE FROM agents WHERE id = ${id} AND user_id = ${session.userId}`;
  return Response.json({ ok: true });
}
