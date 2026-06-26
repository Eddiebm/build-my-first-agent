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
