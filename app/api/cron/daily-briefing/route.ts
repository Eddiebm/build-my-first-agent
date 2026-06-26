export const runtime = "edge";

import { getDb } from "@/lib/db";
import { sendEmail, dailyBriefingEmail } from "@/lib/email";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://buildmyfirstagent.com";

  const users = await sql`
    SELECT DISTINCT u.id, u.email
    FROM users u
    JOIN agents a ON a.user_id = u.id
    WHERE a.published = TRUE
  `;

  let sent = 0;

  for (const user of users) {
    const agentData = await sql`
      SELECT
        a.id, a.name, a.blueprint, a.message_count, a.daily_message_count,
        COALESCE(
          json_agg(
            json_build_object(
              'name', l.name,
              'email', l.email,
              'phone', l.phone,
              'notes', l.notes,
              'created_at', l.created_at
            ) ORDER BY l.created_at DESC
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'::json
        ) AS recent_leads
      FROM agents a
      LEFT JOIN leads l ON l.agent_id = a.id
        AND l.created_at > NOW() - INTERVAL '24 hours'
      WHERE a.user_id = ${user.id} AND a.published = TRUE
      GROUP BY a.id, a.name, a.blueprint, a.message_count, a.daily_message_count
      ORDER BY a.updated_at DESC
    `;

    if (agentData.length === 0) continue;

    const totalLeads = agentData.reduce(
      (sum, a) => sum + ((a.recent_leads as unknown[]) ?? []).length,
      0
    );
    const totalConversations = agentData.reduce(
      (sum, a) => sum + (a.daily_message_count as number || 0),
      0
    );

    if (totalLeads === 0 && totalConversations === 0) continue;

    const html = dailyBriefingEmail({
      agents: agentData.map((a) => ({
        id: a.id as string,
        name: a.name as string,
        blueprint: a.blueprint as { roleTitle?: string; businessName?: string; roleEmoji?: string },
        messageCount: a.message_count as number,
        dailyMessageCount: a.daily_message_count as number,
        recentLeads: (a.recent_leads as Array<{ name?: string; email?: string; phone?: string; notes?: string; created_at?: string }>) ?? [],
      })),
      appUrl,
    });

    await sendEmail({
      to: user.email as string,
      subject: totalLeads > 0
        ? `☀️ ${totalLeads} new lead${totalLeads !== 1 ? "s" : ""} overnight — your team's morning report`
        : `☀️ Your team's morning report`,
      html,
    });

    sent++;
  }

  return Response.json({ ok: true, sent, total: users.length });
}
