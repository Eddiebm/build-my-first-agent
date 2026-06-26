import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EmployeeProfilePage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/auth/signin?next=/dashboard");

  const { id } = await params;
  const sql = getDb();

  const rows = await sql`
    SELECT id, name, blueprint, published, message_count, daily_message_count,
           voice_enabled, phone_number, created_at, updated_at
    FROM agents
    WHERE id = ${id} AND user_id = ${session.userId}
  `;

  if (rows.length === 0) notFound();

  const agent = rows[0];
  const bp = agent.blueprint as {
    name?: string;
    roleTitle?: string;
    roleEmoji?: string;
    businessName?: string;
    mission?: string;
    systemPrompt?: string;
    roleId?: string;
  };

  const leads = await sql`
    SELECT id, name, email, phone, notes, created_at
    FROM leads
    WHERE agent_id = ${id}
    ORDER BY created_at DESC
    LIMIT 20
  `;

  const humanName = bp?.name && bp.name.length < 20 ? bp.name : (agent.name as string);
  const roleTitle = bp?.roleTitle ?? "AI Employee";
  const roleEmoji = bp?.roleEmoji ?? "🤖";
  const businessName = bp?.businessName ?? "";
  const live = agent.published as boolean;
  const voiceEnabled = agent.voice_enabled as boolean;
  const phoneNumber = agent.phone_number as string | null;
  const msgCount = agent.message_count as number;
  const createdAt = new Date(agent.created_at as string);
  const daysWorking = Math.max(1, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const formatRelative = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const chatUrl = `${appUrl}/chat/${agent.id as string}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            ← My Employees
          </Link>
          <div className="flex items-center gap-3">
            {live && (
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Chat ↗
              </a>
            )}
            <Link
              href={`/builder?agent=${agent.id as string}`}
              className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Edit training
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center text-4xl flex-shrink-0">
              {roleEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">{humanName}</h1>
                  <p className="text-brand-600 font-semibold text-sm mt-0.5">{roleTitle}</p>
                  {businessName && <p className="text-slate-400 text-sm">{businessName}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${live ? "bg-green-400" : "bg-slate-300"}`} />
                  <span className={`text-sm font-bold ${live ? "text-green-600" : "text-slate-400"}`}>
                    {live ? "Working" : "Off duty"}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>📅 Working since {formatDate(createdAt)}</span>
                {voiceEnabled && phoneNumber && (
                  <span className="text-purple-600 font-semibold">📞 {phoneNumber}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
            {[
              { label: "Days working", value: daysWorking.toLocaleString(), sub: `since ${formatDate(createdAt)}` },
              { label: "Total conversations", value: msgCount.toLocaleString(), sub: "all time" },
              { label: "Leads captured", value: leads.length.toLocaleString(), sub: "all time" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
                <p className="text-xs font-semibold text-slate-600 mt-1">{s.label}</p>
                <p className="text-xs text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-5 gap-6">
          {/* Leads */}
          <div className="sm:col-span-3 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-extrabold text-slate-900">
                Leads captured ({leads.length})
              </h2>
              {leads.length > 0 && (
                <a
                  href={`/api/leads/export?agentId=${agent.id as string}`}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Export CSV
                </a>
              )}
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-sm font-semibold text-slate-500">No leads yet</p>
                <p className="text-xs mt-1 max-w-xs mx-auto">
                  {humanName} will save contact info here automatically when customers share their details.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <div key={lead.id as string} className="py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">
                          {(lead.name as string) || "Anonymous"}
                        </p>
                        <div className="flex gap-3 mt-0.5 flex-wrap">
                          {lead.phone && (
                            <span className="text-xs text-slate-500">📞 {lead.phone as string}</span>
                          )}
                          {lead.email && (
                            <span className="text-xs text-slate-500">✉ {lead.email as string}</span>
                          )}
                        </div>
                        {lead.notes && (
                          <p className="text-xs text-slate-400 mt-1 italic line-clamp-1">
                            {lead.notes as string}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">
                        {formatRelative(lead.created_at as string)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="sm:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-base font-extrabold text-slate-900 mb-1">Employee Handbook</h2>
              <p className="text-xs text-slate-400 mb-3">What {humanName} knows about your business</p>
              <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 leading-relaxed max-h-52 overflow-y-auto font-mono whitespace-pre-wrap">
                {bp?.systemPrompt
                  ? bp.systemPrompt.slice(0, 800) + (bp.systemPrompt.length > 800 ? "\n…" : "")
                  : "No handbook configured yet."}
              </div>
              <Link
                href={`/builder?agent=${agent.id as string}`}
                className="mt-3 block text-center text-xs font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 bg-brand-50 px-3 py-2 rounded-lg transition-colors"
              >
                Edit training →
              </Link>
            </div>

            {live && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="text-base font-extrabold text-slate-900 mb-2">Share {humanName}</h2>
                <p className="text-xs text-slate-500 mb-3">
                  Anyone with this link can talk to {humanName} right now.
                </p>
                <div className="bg-slate-50 rounded-lg px-3 py-2 font-mono text-xs text-slate-600 break-all mb-3">
                  {chatUrl}
                </div>
                <a
                  href={chatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white py-2 rounded-lg transition-colors"
                >
                  Open chat ↗
                </a>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-base font-extrabold text-slate-900 mb-3">Quick actions</h2>
              <div className="space-y-2">
                <Link
                  href={`/builder?agent=${agent.id as string}`}
                  className="block w-full text-center text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition-colors"
                >
                  Edit job description
                </Link>
                <a
                  href={`/api/leads/export?agentId=${agent.id as string}`}
                  className="block w-full text-center text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition-colors"
                >
                  Export leads CSV
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
