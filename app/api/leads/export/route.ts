export const runtime = "edge";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const agentId = new URL(req.url).searchParams.get("agentId");
  if (!agentId) return Response.json({ error: "agentId required" }, { status: 400 });

  const sql = getDb();
  const agent = await sql`SELECT id, name FROM agents WHERE id = ${agentId} AND user_id = ${session.userId}`;
  if (agent.length === 0) return Response.json({ error: "Not found" }, { status: 404 });

  const leads = await sql`
    SELECT name, email, phone, notes, created_at
    FROM leads WHERE agent_id = ${agentId}
    ORDER BY created_at DESC
  `;

  const rows = [
    ["Name", "Email", "Phone", "Notes", "Date"],
    ...leads.map((l) => [
      l.name ?? "",
      l.email ?? "",
      l.phone ?? "",
      l.notes ?? "",
      new Date(l.created_at as string).toISOString(),
    ]),
  ];

  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\r\n");

  const agentName = (agent[0].name as string).replace(/[^a-z0-9]/gi, "-").toLowerCase();

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-${agentName}.csv"`,
    },
  });
}
