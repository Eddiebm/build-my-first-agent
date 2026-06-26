export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const sql = getDb();

  const rows = await sql`
    UPDATE agents SET published = TRUE
    WHERE id = ${id} AND user_id = ${session.userId}
    RETURNING id, name, published
  `;
  if (rows.length === 0) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ agent: rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const sql = getDb();

  const rows = await sql`
    UPDATE agents SET published = FALSE
    WHERE id = ${id} AND user_id = ${session.userId}
    RETURNING id, name, published
  `;
  if (rows.length === 0) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ agent: rows[0] });
}
