export const runtime = "edge";

import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { sendEmail, resetPasswordEmail } from "@/lib/email";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email?: string };
  if (!email) return Response.json({ error: "Email required" }, { status: 400 });

  const sql = getDb();
  const rows = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`;

  // Always return ok — don't reveal whether email exists
  if (rows.length === 0) return Response.json({ ok: true });

  const token = generateToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await sql`
    UPDATE users
    SET reset_token = ${token}, reset_token_expires_at = ${expires.toISOString()}
    WHERE id = ${rows[0].id}
  `;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://buildmyfirstagent.com";
  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your Build My First Agent password",
    html: resetPasswordEmail(resetUrl),
  });

  return Response.json({ ok: true });
}
