import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import PublicChat from "../PublicChat";

export default async function EmbedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getDb();
  const rows = await sql`
    SELECT id, name FROM agents WHERE id = ${id} AND published = TRUE
  `;
  if (rows.length === 0) notFound();
  const agent = rows[0];

  return (
    <div className="h-screen flex flex-col bg-white">
      <PublicChat agentId={agent.id as string} agentName={agent.name as string} />
      <div className="text-center py-2 border-t border-slate-100 flex-shrink-0">
        <p className="text-xs text-slate-400">
          Powered by{" "}
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">
            Build My First Agent
          </a>
        </p>
      </div>
    </div>
  );
}
