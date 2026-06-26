import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import PublicChat from "./PublicChat";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const sql = getDb();
  const rows = await sql`
    SELECT name, blueprint FROM agents WHERE id = ${id} AND published = TRUE
  `;
  if (rows.length === 0) return { title: "Agent not found" };
  const agent = rows[0];
  const bp = agent.blueprint as { mission?: string };
  return {
    title: `${agent.name} — AI Agent`,
    description: bp?.mission ?? "Chat with this AI agent.",
  };
}

export default async function PublicChatPage({ params }: Props) {
  const { id } = await params;
  const sql = getDb();
  const rows = await sql`
    SELECT id, name, blueprint, message_count,
           (SELECT plan FROM users WHERE id = agents.user_id) AS owner_plan
    FROM agents
    WHERE id = ${id} AND published = TRUE
  `;

  if (rows.length === 0) notFound();

  const agent = rows[0];
  const bp = agent.blueprint as { mission?: string; name?: string };
  const FREE_LIMIT = 500;
  const atLimit = agent.owner_plan === "free" && (agent.message_count as number) >= FREE_LIMIT;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            🤖
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base">{agent.name}</h1>
            {bp?.mission && (
              <p className="text-xs text-slate-500 line-clamp-1">{bp.mission}</p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
      </header>

      {/* Chat */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 flex flex-col" style={{ minHeight: 0 }}>
        {atLimit ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-2xl border border-slate-200">
              <div className="text-4xl mb-3">😴</div>
              <h2 className="font-bold text-slate-900 mb-2">This agent is taking a break</h2>
              <p className="text-sm text-slate-500">
                It has reached its monthly message limit. Check back later.
              </p>
            </div>
          </div>
        ) : (
          <PublicChat agentId={agent.id as string} agentName={agent.name as string} />
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-3 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Built with{" "}
          <a
            href="/"
            className="text-brand-500 hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Build My First Agent
          </a>
        </p>
      </div>
    </div>
  );
}
