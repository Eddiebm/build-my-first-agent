export const runtime = "edge";

import { NextRequest } from "next/server";
import { compare } from "bcryptjs";
import { getDb } from "@/lib/db";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json() as { email: string; password: string };

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT id, email, password_hash, plan FROM users WHERE email = ${email.toLowerCase()}
  `;

  if (rows.length === 0) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const user = rows[0];
  const valid = await compare(password, user.password_hash);
  if (!valid) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await setAuthCookie({ userId: user.id, email: user.email, plan: user.plan });
  return Response.json({ ok: true });
}
