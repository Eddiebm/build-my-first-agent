interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email to", to);
    return;
  }
  const from = process.env.RESEND_FROM_EMAIL ?? "noreply@buildmyfirstagent.com";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    console.error("Resend error:", await res.text());
  }
}

export function resetPasswordEmail(resetUrl: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="color:#0f172a;margin-bottom:8px">Reset your password</h2>
      <p style="color:#64748b;margin-bottom:24px">Click the link below to set a new password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="display:inline-block;background:#6366f1;color:#fff;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;margin-bottom:24px">
        Reset password →
      </a>
      <p style="color:#94a3b8;font-size:12px">If you didn't request this, ignore this email. Your password won't change.</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
      <p style="color:#94a3b8;font-size:12px">Build My First Agent</p>
    </div>
  `;
}

export function leadNotificationEmail({
  agentName,
  leadName,
  leadEmail,
  leadPhone,
  notes,
}: {
  agentName: string;
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  notes?: string;
}): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="color:#0f172a;margin-bottom:4px">New lead captured</h2>
      <p style="color:#64748b;margin-bottom:24px">Your agent <strong>${agentName}</strong> just captured a new contact.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${leadName ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:80px">Name</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600">${leadName}</td></tr>` : ""}
        ${leadEmail ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px">Email</td><td style="padding:8px 0;color:#0f172a;font-size:14px"><a href="mailto:${leadEmail}" style="color:#6366f1">${leadEmail}</a></td></tr>` : ""}
        ${leadPhone ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px">Phone</td><td style="padding:8px 0;color:#0f172a;font-size:14px">${leadPhone}</td></tr>` : ""}
        ${notes ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px;vertical-align:top">Notes</td><td style="padding:8px 0;color:#0f172a;font-size:14px">${notes}</td></tr>` : ""}
      </table>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
      <p style="color:#94a3b8;font-size:12px">Build My First Agent — <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://buildmyfirstagent.com"}/leads" style="color:#6366f1">View all leads →</a></p>
    </div>
  `;
}

export function dailyBriefingEmail({
  agents,
  appUrl,
}: {
  agents: Array<{
    id: string;
    name: string;
    blueprint: { roleTitle?: string; businessName?: string; roleEmoji?: string };
    messageCount: number;
    dailyMessageCount: number;
    recentLeads: Array<{ name?: string; email?: string; phone?: string; notes?: string; created_at?: string }>;
  }>;
  appUrl: string;
}): string {
  const agentCards = agents
    .map((a) => {
      const roleEmoji = a.blueprint?.roleEmoji ?? "🤖";
      const roleTitle = a.blueprint?.roleTitle ?? "AI Employee";
      const businessName = a.blueprint?.businessName ?? "";
      const leads = a.recentLeads ?? [];

      const leadRows = leads
        .slice(0, 5)
        .map(
          (l) => `
        <div style="padding:10px 0;border-bottom:1px solid #f1f5f9">
          <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a">${l.name ?? "Anonymous"}</p>
          <p style="margin:2px 0 0;font-size:12px;color:#64748b">
            ${l.phone ? `📞 ${l.phone}` : ""}${l.phone && l.email ? " · " : ""}${l.email ? `✉ ${l.email}` : ""}
          </p>
          ${l.notes ? `<p style="margin:2px 0 0;font-size:12px;color:#64748b;font-style:italic">${l.notes}</p>` : ""}
        </div>
      `
        )
        .join("");

      return `
      <div style="background:#fff;border-radius:12px;border:1px solid #e2e8f0;padding:20px;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:44px;height:44px;border-radius:50%;background:#ede9fe;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${roleEmoji}</div>
          <div style="flex:1;min-width:0">
            <p style="margin:0;font-weight:800;color:#0f172a;font-size:16px">${a.name}</p>
            <p style="margin:2px 0 0;color:#6366f1;font-size:13px;font-weight:600">${roleTitle}${businessName ? ` · ${businessName}` : ""}</p>
          </div>
          <div style="background:#dcfce7;color:#15803d;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;flex-shrink:0">● Working</div>
        </div>

        <div style="display:flex;gap:12px;margin-bottom:16px">
          <div style="flex:1;background:#f8fafc;border-radius:8px;padding:12px;text-align:center">
            <p style="margin:0;font-size:22px;font-weight:800;color:#0f172a">${a.messageCount.toLocaleString()}</p>
            <p style="margin:2px 0 0;font-size:11px;color:#64748b">total conversations</p>
          </div>
          <div style="flex:1;background:#ede9fe;border-radius:8px;padding:12px;text-align:center">
            <p style="margin:0;font-size:22px;font-weight:800;color:#6366f1">${leads.length}</p>
            <p style="margin:2px 0 0;font-size:11px;color:#6366f1">new leads (24h)</p>
          </div>
        </div>

        ${
          leads.length > 0
            ? `
          <div style="border-top:1px solid #f1f5f9;padding-top:12px;margin-bottom:12px">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em">New Leads</p>
            ${leadRows}
          </div>
          <a href="${appUrl}/leads?agentId=${a.id}" style="display:block;text-align:center;background:#6366f1;color:#fff;font-weight:700;padding:11px;border-radius:8px;text-decoration:none;font-size:14px">
            View ${a.name}'s leads →
          </a>
        `
            : `<p style="margin:0;color:#94a3b8;font-size:13px;text-align:center">No new leads in the last 24 hours.</p>`
        }
      </div>
    `;
    })
    .join("");

  const totalLeads = agents.reduce((s, a) => s + (a.recentLeads?.length ?? 0), 0);

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px 16px;background:#f8fafc">
      <div style="background:#0f172a;border-radius:16px;padding:28px 24px;margin-bottom:20px">
        <p style="color:#64748b;font-size:13px;margin:0 0 8px">Good morning ☀️</p>
        <h1 style="color:#fff;margin:0 0 6px;font-size:24px;font-weight:800">Your employees worked overnight.</h1>
        <p style="color:#94a3b8;margin:0;font-size:15px">
          ${totalLeads > 0 ? `<strong style="color:#a78bfa">${totalLeads} new lead${totalLeads !== 1 ? "s" : ""}</strong> captured in the last 24 hours.` : "Here's a summary of what they handled."}
        </p>
      </div>

      ${agentCards}

      <a href="${appUrl}/dashboard" style="display:block;text-align:center;background:#fff;border:1px solid #e2e8f0;color:#6366f1;font-weight:700;padding:14px;border-radius:12px;text-decoration:none;font-size:14px;margin-bottom:20px">
        Go to your dashboard →
      </a>

      <p style="text-align:center;color:#94a3b8;font-size:12px;margin:0">
        Build My First Agent — AI employees for small businesses
      </p>
    </div>
  `;
}

export function paymentFailedEmail(dashboardUrl: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="color:#dc2626;margin-bottom:8px">Payment failed</h2>
      <p style="color:#64748b;margin-bottom:24px">We couldn't process your subscription payment. Please update your billing information to keep your plan active.</p>
      <a href="${dashboardUrl}/account" style="display:inline-block;background:#6366f1;color:#fff;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;margin-bottom:24px">
        Update billing →
      </a>
      <p style="color:#94a3b8;font-size:12px">If this is unexpected, please contact us at hello@buildmyfirstagent.com.</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
      <p style="color:#94a3b8;font-size:12px">Build My First Agent</p>
    </div>
  `;
}
