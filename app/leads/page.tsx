import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/signin?next=/leads");

  const sql = getDb();
  const { agent: agentId } = await searchParams;

  // Load all agents for this user (for the selector)
  const agents = await sql`
    SELECT id, name FROM agents WHERE user_id = ${session.userId} ORDER BY updated_at DESC
  `;

  // Load leads for selected agent (or first agent)
  const selectedId = agentId ?? (agents[0]?.id as string | undefined);
  const leads = selectedId
    ? await sql`
        SELECT id, name, email, phone, notes, created_at
        FROM leads WHERE agent_id = ${selectedId}
        ORDER BY created_at DESC
      `
    : [];

  const selectedAgent = agents.find((a) => a.id === selectedId);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/" className="font-extrabold text-slate-900 text-lg">🤖 Build My First Agent</Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700">Dashboard</Link>
            <Link href="/account" className="text-sm text-slate-500 hover:text-slate-700">{session.email}</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Leads</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Contact info collected by your agents during conversations.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg"
          >
            ← Dashboard
          </Link>
        </div>

        {agents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <p className="text-slate-500">No agents yet. <Link href="/hire" className="text-brand-600 font-semibold">Hire one →</Link></p>
          </div>
        ) : (
          <>
            {/* Agent selector */}
            {agents.length > 1 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {agents.map((a) => (
                  <Link
                    key={a.id as string}
                    href={`/leads?agent=${a.id}`}
                    className={`text-sm font-semibold px-4 py-2 rounded-xl border transition-all ${
                      a.id === selectedId
                        ? "bg-brand-500 text-white border-brand-500"
                        : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                    }`}
                  >
                    {a.name as string}
                  </Link>
                ))}
              </div>
            )}

            {/* Leads table */}
            {leads.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="text-4xl mb-3">📋</div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">No leads yet</h2>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Enable Lead Capture in your agent&apos;s Integrations settings. When visitors share their
                  contact info, it will appear here.
                </p>
                {selectedId && (
                  <Link
                    href={`/builder?agent=${selectedId}`}
                    className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline"
                  >
                    Open {selectedAgent?.name as string} settings →
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">
                    {selectedAgent?.name as string} — {leads.length} lead{leads.length !== 1 ? "s" : ""}
                  </p>
                  <a
                    href={`/api/leads/export?agentId=${selectedId}`}
                    className="text-xs font-semibold text-brand-600 hover:underline"
                  >
                    Export CSV
                  </a>
                </div>
                <div className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <div key={lead.id as string} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{lead.name as string || "—"}</p>
                        <div className="flex flex-wrap gap-3 mt-0.5">
                          {lead.email && (
                            <a href={`mailto:${lead.email as string}`} className="text-xs text-brand-600 hover:underline">
                              {lead.email as string}
                            </a>
                          )}
                          {lead.phone && (
                            <a href={`tel:${lead.phone as string}`} className="text-xs text-slate-500 hover:text-slate-700">
                              {lead.phone as string}
                            </a>
                          )}
                        </div>
                        {lead.notes && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{lead.notes as string}</p>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 flex-shrink-0">
                        {new Date(lead.created_at as string).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
