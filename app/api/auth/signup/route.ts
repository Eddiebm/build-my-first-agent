export const runtime = "edge";

import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { getDb } from "@/lib/db";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json() as { email: string; password: string };

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const sql = getDb();
  const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
  if (existing.length > 0) {
    return Response.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const passwordHash = await hash(password, 10);
  const rows = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email.toLowerCase()}, ${passwordHash})
    RETURNING id, email, plan
  `;
  const user = rows[0];

  await setAuthCookie({ userId: user.id, email: user.email, plan: user.plan });
  return Response.json({ ok: true });
}
