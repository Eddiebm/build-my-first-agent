import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { EMPLOYEE_ROLES } from "@/lib/employee-roles";
import VoiceToggle from "@/app/components/VoiceToggle";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/signin?next=/dashboard");

  const sql = getDb();
  const agents = await sql`
    SELECT
      a.id, a.name, a.blueprint, a.published, a.message_count,
      a.voice_enabled, a.phone_number, a.daily_message_count, a.daily_reset_at,
      a.created_at, a.updated_at,
      (SELECT COUNT(*) FROM leads WHERE agent_id = a.id) AS lead_count
    FROM agents a
    WHERE a.user_id = ${session.userId}
    ORDER BY a.updated_at DESC
  `;

  const { upgraded } = await searchParams;
  const isPro = session.plan === "pro" || session.plan === "business";

  // Aggregate stats
  const totalConversations = agents.reduce((sum, a) => sum + (a.message_count as number), 0);
  const totalLeads = agents.reduce((sum, a) => sum + Number(a.lead_count ?? 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const activeToday = agents.filter((a) => {
    const resetAt = a.daily_reset_at as string | null;
    return resetAt && resetAt.slice(0, 10) === today && (a.daily_message_count as number) > 0;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/" className="font-extrabold text-slate-900 text-lg">
            🤖 Build My First Agent
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/leads"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-2 rounded-lg transition-colors"
            >
              📋 Leads
            </Link>
            <Link
              href="/hire"
              className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              + Hire Employee
            </Link>
            <Link href="/account" className="text-sm text-slate-500 hover:text-slate-700">
              {session.email}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Upgrade banners */}
        {upgraded && session.plan === "business" && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
            <span className="text-green-500 text-xl">🎉</span>
            <p className="text-green-800 font-semibold text-sm">
              You&apos;re on Business — web search, unlimited employees, and 1,000 conversations/day are unlocked.
            </p>
          </div>
        )}
        {upgraded && session.plan === "pro" && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
            <span className="text-green-500 text-xl">🎉</span>
            <p className="text-green-800 font-semibold text-sm">
              You&apos;re on Growth — unlimited employees, voice phone numbers, and lead capture are unlocked.
            </p>
          </div>
        )}

        {/* Free plan upsell */}
        {!isPro && (
          <div className="bg-brand-50 border border-brand-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-brand-900 font-semibold text-sm">You&apos;re on the Free plan</p>
              <p className="text-brand-700 text-xs mt-0.5">
                Upgrade to Growth to hire unlimited AI employees and add a real phone number.
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex-shrink-0 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Upgrade →
            </Link>
          </div>
        )}

        {/* Stats bar */}
        {agents.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "AI Employees", value: agents.length, emoji: "👔" },
              { label: "Active today", value: activeToday, emoji: "⚡" },
              { label: "Total conversations", value: totalConversations.toLocaleString(), emoji: "💬" },
              { label: "Leads captured", value: totalLeads.toLocaleString(), emoji: "📋" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-4">
                <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">My AI Employees</h1>
          {agents.length > 0 && (
            <span className="text-sm text-slate-400">
              {agents.length} {isPro ? "hired" : "/ 1 on Free"}
            </span>
          )}
        </div>

        {agents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <div className="text-5xl mb-4">👔</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No employees hired yet</h2>
            <p className="text-slate-500 text-sm mb-6">
              Hire your first AI employee in 60 seconds — no coding, no training required.
            </p>
            <Link
              href="/hire"
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Hire your first employee →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const bp = agent.blueprint as {
                name?: string;
                roleTitle?: string;
                roleEmoji?: string;
                businessName?: string;
                roleId?: string;
                mission?: string;
              };
              const live = agent.published as boolean;
              const voiceEnabled = agent.voice_enabled as boolean;
              const phoneNumber = agent.phone_number as string | null;
              const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
              const leadCount = Number(agent.lead_count ?? 0);
              const msgCount = agent.message_count as number;

              // Human name: use blueprint.name if it's short (new format), else agent.name
              const humanName = (bp?.name && bp.name.length < 20) ? bp.name : (agent.name as string).split(" — ")[0];

              // Role display
              const roleTitle = bp?.roleTitle ?? (agent.name as string).split(" — ")[1] ?? "AI Employee";

              // Business name
              const businessName = bp?.businessName ?? (agent.name as string).split(" — ")[0];

              // Emoji: from blueprint or from role lookup
              const roleEmoji = bp?.roleEmoji ?? EMPLOYEE_ROLES.find((r) => r.id === bp?.roleId)?.emoji ?? "🤖";

              return (
                <div
                  key={agent.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all group flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center text-xl flex-shrink-0">
                      {roleEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <Link href={`/employee/${agent.id as string}`} className="font-bold text-slate-900 text-base leading-tight hover:text-brand-600 transition-colors">
                          {humanName}
                        </Link>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`w-2 h-2 rounded-full ${live ? "bg-green-400" : "bg-slate-300"}`} />
                          <span className={`text-xs font-medium ${live ? "text-green-600" : "text-slate-400"}`}>
                            {live ? "Working" : "Off duty"}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-brand-600 font-semibold">{roleTitle}</p>
                      <p className="text-xs text-slate-400 truncate">{businessName}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2">
                      <p className="text-lg font-extrabold text-slate-900">{msgCount.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">conversations</p>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2">
                      <p className="text-lg font-extrabold text-slate-900">{leadCount}</p>
                      <p className="text-xs text-slate-400">leads captured</p>
                    </div>
                  </div>

                  {/* Voice status */}
                  {voiceEnabled && phoneNumber ? (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 mb-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-purple-700">📞 Phone active</p>
                        <p className="text-xs font-mono text-purple-600 mt-0.5">{phoneNumber}</p>
                      </div>
                      <VoiceToggle agentId={agent.id as string} enabled={true} />
                    </div>
                  ) : isPro && live ? (
                    <div className="mb-3">
                      <VoiceToggle agentId={agent.id as string} enabled={false} />
                    </div>
                  ) : null}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-2">
                    <Link
                      href={`/builder?agent=${agent.id}`}
                      className="flex-1 text-center text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg transition-colors"
                    >
                      Edit
                    </Link>
                    {live && (
                      <a
                        href={`${appUrl}/chat/${agent.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 py-2 rounded-lg transition-colors border border-brand-200"
                      >
                        Chat ↗
                      </a>
                    )}
                    <DeleteButton agentId={agent.id} />
                  </div>
                </div>
              );
            })}

            {/* Hire another card */}
            <Link
              href="/hire"
              className="bg-slate-50 hover:bg-brand-50 border-2 border-dashed border-slate-300 hover:border-brand-300 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all group min-h-[200px]"
            >
              <span className="text-3xl mb-2">+</span>
              <p className="text-sm font-bold text-slate-600 group-hover:text-brand-600 transition-colors">
                Hire another employee
              </p>
              <p className="text-xs text-slate-400 mt-1">60 seconds to go live</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteButton({ agentId }: { agentId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const { getSession: gs } = await import("@/lib/auth");
        const { getDb: gd } = await import("@/lib/db");
        const s = await gs();
        if (!s) return;
        const sq = gd();
        await sq`DELETE FROM agents WHERE id = ${agentId} AND user_id = ${s.userId}`;
        const { revalidatePath } = await import("next/cache");
        revalidatePath("/dashboard");
      }}
    >
      <button
        type="submit"
        className="text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg transition-colors"
        onClick={(e) => {
          if (!confirm("Let this employee go?")) e.preventDefault();
        }}
      >
        Let go
      </button>
    </form>
  );
}
