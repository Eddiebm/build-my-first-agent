"use client";

import { useState } from "react";
import Link from "next/link";

interface PublishPanelProps {
  agentId: string | null;
  agentName: string;
  isPublished: boolean;
  isPro: boolean;
  isLoggedIn: boolean;
  onPublishChange: (published: boolean) => void;
}

export default function PublishPanel({
  agentId,
  agentName,
  isPublished,
  isPro,
  isLoggedIn,
  onPublishChange,
}: PublishPanelProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3005";
  const chatUrl = agentId ? `${appUrl}/chat/${agentId}` : null;
  const embedCode = agentId
    ? `<iframe src="${appUrl}/chat/${agentId}/embed" width="100%" height="600" frameborder="0" style="border-radius:12px"></iframe>`
    : null;

  async function togglePublish() {
    if (!agentId) return;
    setLoading(true);
    const method = isPublished ? "DELETE" : "POST";
    const res = await fetch(`/api/agents/${agentId}/publish`, { method });
    if (res.ok) onPublishChange(!isPublished);
    setLoading(false);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Not saved yet
  if (!agentId) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
        <p className="text-sm text-slate-500">Save your agent first to get a shareable link.</p>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
        <p className="text-sm text-slate-500 mb-3">
          <Link href="/auth/signup" className="text-brand-600 font-semibold hover:underline">
            Create a free account
          </Link>{" "}
          to publish your agent.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Publish toggle */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-slate-900 text-sm">{agentName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isPublished ? "bg-green-400" : "bg-slate-300"}`} />
              <span className={`text-xs font-medium ${isPublished ? "text-green-600" : "text-slate-400"}`}>
                {isPublished ? "Live" : "Draft"}
              </span>
            </div>
          </div>
          <button
            onClick={togglePublish}
            disabled={loading}
            className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              isPublished
                ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {loading ? "…" : isPublished ? "Unpublish" : "Publish Agent →"}
          </button>
        </div>

        {!isPublished && (
          <p className="text-xs text-slate-500">
            Publishing makes your agent available to anyone with the link.
          </p>
        )}
      </div>

      {/* Share links — only when published */}
      {isPublished && chatUrl && (
        <>
          {/* Direct link */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wide">
              🔗 Share link
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={chatUrl}
                className="flex-1 text-xs bg-white border border-green-200 rounded-lg px-3 py-2 text-slate-700 font-mono"
              />
              <button
                onClick={() => copy(chatUrl)}
                className="text-xs font-bold bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                {copied ? "✓" : "Copy"}
              </button>
            </div>
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs font-semibold text-green-700 hover:text-green-800 underline"
            >
              Open your agent →
            </a>
          </div>

          {/* Embed code */}
          {isPro && embedCode && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                📌 Embed on your website
              </p>
              <textarea
                readOnly
                value={embedCode}
                rows={3}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-mono resize-none"
              />
              <button
                onClick={() => copy(embedCode)}
                className="w-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg transition-colors"
              >
                {copied ? "✓ Copied" : "Copy embed code"}
              </button>
            </div>
          )}

          {!isPro && (
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-center">
              <p className="text-xs text-brand-700 mb-2 font-medium">
                🔒 Embed code is a Pro feature
              </p>
              <Link
                href="/pricing"
                className="text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 px-3 py-1.5 rounded-lg transition-colors inline-block"
              >
                Upgrade to Pro →
              </Link>
            </div>
          )}

          {/* Usage */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Usage</p>
            {isPro ? (
              <p className="text-xs text-slate-600">Unlimited messages · Pro plan</p>
            ) : (
              <p className="text-xs text-slate-600">
                Free plan · 500 message limit per agent
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
