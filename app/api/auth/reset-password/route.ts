export const runtime = "edge";

import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json() as { token?: string; password?: string };
  if (!token || !password) return Response.json({ error: "Token and password required" }, { status: 400 });
  if (password.length < 8) return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });

  const sql = getDb();
  const rows = await sql`
    SELECT id FROM users
    WHERE reset_token = ${token}
      AND reset_token_expires_at > NOW()
  `;

  if (rows.length === 0) {
    return Response.json({ error: "Invalid or expired reset link. Please request a new one." }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  await sql`
    UPDATE users
    SET password_hash = ${hash}, reset_token = NULL, reset_token_expires_at = NULL
    WHERE id = ${rows[0].id}
  `;

  return Response.json({ ok: true });
}
