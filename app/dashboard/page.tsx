import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/signin?next=/dashboard");

  const sql = getDb();
  const agents = await sql`
    SELECT id, name, blueprint, published, message_count, created_at, updated_at
    FROM agents WHERE user_id = ${session.userId}
    ORDER BY updated_at DESC
  `;

  const { upgraded } = await searchParams;
  const isPro = session.plan === "pro" || session.plan === "business";

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
              href="/builder"
              className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              + New Agent
            </Link>
            <Link href="/account" className="text-sm text-slate-500 hover:text-slate-700">
              {session.email}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Upgrade banner */}
        {upgraded && session.plan === "business" && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
            <span className="text-green-500 text-xl">🎉</span>
            <p className="text-green-800 font-semibold text-sm">
              You&apos;re now on Business! Web search, AI employees, and 1,000 msgs/day are unlocked.
            </p>
          </div>
        )}
        {upgraded && session.plan === "pro" && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
            <span className="text-green-500 text-xl">🎉</span>
            <p className="text-green-800 font-semibold text-sm">
              You&apos;re now on Pro! Unlimited agents, live AI chat, and lead capture are unlocked.
            </p>
          </div>
        )}

        {/* Free plan upsell */}
        {!isPro && (
          <div className="bg-brand-50 border border-brand-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-brand-900 font-semibold text-sm">
                You&apos;re on the Free plan
              </p>
              <p className="text-brand-700 text-xs mt-0.5">
                Upgrade to Pro to save unlimited agents, export blueprints, and test with live AI.
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex-shrink-0 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Upgrade to Pro →
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Your Agents</h1>
          <span className="text-sm text-slate-400">
            {agents.length} {isPro ? "saved" : `/ 1 on Free`}
          </span>
        </div>

        {agents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No agents yet</h2>
            <p className="text-slate-500 text-sm mb-6">
              Build your first agent in about 20 minutes.
            </p>
            <Link
              href="/builder"
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Build My First Agent →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const bp = agent.blueprint as { mission?: string };
              const live = agent.published as boolean;
              const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
              return (
                <div
                  key={agent.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {agent.name}
                    </h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className={`w-2 h-2 rounded-full ${live ? "bg-green-400" : "bg-slate-300"}`} />
                      <span className={`text-xs font-medium ${live ? "text-green-600" : "text-slate-400"}`}>
                        {live ? "Live" : "Draft"}
                      </span>
                    </div>
                  </div>
                  {live && (
                    <p className="text-xs text-slate-400 mb-1">
                      {agent.message_count as number} message{(agent.message_count as number) !== 1 ? "s" : ""}
                    </p>
                  )}
                  {bp?.mission && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{bp.mission}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href={`/builder?agent=${agent.id}`}
                      className="flex-1 text-center text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 py-2 rounded-lg transition-colors"
                    >
                      Edit
                    </Link>
                    {live && (
                      <a
                        href={`${appUrl}/chat/${agent.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-xs font-semibold bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg transition-colors border border-green-200"
                      >
                        Open ↗
                      </a>
                    )}
                    <DeleteButton agentId={agent.id} />
                  </div>
                </div>
              );
            })}

            {/* New agent card */}
            <Link
              href="/builder"
              className="bg-slate-50 hover:bg-brand-50 border-2 border-dashed border-slate-300 hover:border-brand-300 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all group min-h-[140px]"
            >
              <span className="text-3xl mb-2">+</span>
              <p className="text-sm font-semibold text-slate-500 group-hover:text-brand-600 transition-colors">
                New Agent
              </p>
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
          if (!confirm("Delete this agent?")) e.preventDefault();
        }}
      >
        Delete
      </button>
    </form>
  );
}
