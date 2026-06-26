"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Step = "q1" | "q2" | "q3" | "building" | "done" | "claim";

const EXAMPLES = [
  "Answering the same customer questions every day",
  "Missing calls when I'm on the job site",
  "Tenants calling at midnight about availability",
  "Chasing unpaid invoices every month",
  "Screening job applicants before interviews",
  "Booking appointments while I'm with other customers",
];

export default function QuickPageWrapper() {
  return (
    <Suspense>
      <QuickPage />
    </Suspense>
  );
}

function QuickPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("q1");
  const [timeEater, setTimeEater] = useState("");
  const [audience, setAudience] = useState("");
  const [neverDo, setNeverDo] = useState("");
  const [result, setResult] = useState<{
    saved: boolean;
    chatUrl?: string;
    agentName?: string;
    blueprint?: { systemPrompt?: string };
  } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // After signup with ?claim=1, auto-submit the blueprint saved in localStorage
  useEffect(() => {
    if (searchParams.get("claim") !== "1") return;
    const raw = typeof window !== "undefined"
      ? localStorage.getItem("bmfa_quick_blueprint")
      : null;
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as {
        timeEater: string;
        audience: string;
        neverDo: string;
      };
      setTimeEater(saved.timeEater ?? "");
      setAudience(saved.audience ?? "");
      setNeverDo(saved.neverDo ?? "");
      localStorage.removeItem("bmfa_quick_blueprint");
      // Trigger build after state settles
      setTimeout(() => buildWith(saved.timeEater, saved.audience, saved.neverDo), 50);
    } catch {
      // corrupted — ignore and let user fill in fresh
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function buildWith(te: string, au: string, nd: string) {
    setStep("building");
    setError("");
    const [res] = await Promise.all([
      fetch("/api/quick/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeEater: te, audience: au, neverDo: nd }),
      }),
      new Promise((r) => setTimeout(r, 1800)),
    ]);
    const data = await res.json() as {
      saved?: boolean;
      chatUrl?: string;
      agentName?: string;
      blueprint?: { systemPrompt?: string };
      error?: string;
      upgradeRequired?: boolean;
    };
    if (!res.ok) {
      if (data.upgradeRequired) { window.location.href = "/pricing"; return; }
      setError(data.error ?? "Something went wrong. Please try again.");
      setStep("q1");
      return;
    }
    setResult({
      saved: data.saved ?? false,
      chatUrl: data.chatUrl,
      agentName: data.agentName,
      blueprint: data.blueprint,
    });
    setStep(data.saved && data.chatUrl ? "done" : "claim");
  }

  async function build() {
    if (typeof window !== "undefined") {
      // Pre-save answers so claim flow can restore them if user isn't logged in
      localStorage.setItem("bmfa_quick_blueprint", JSON.stringify({
        timeEater, audience, neverDo,
      }));
    }
    await buildWith(timeEater, audience, neverDo);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal nav */}
      <nav className="border-b border-slate-100 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-slate-900 text-base">
          🤖 Build My First Agent
        </Link>
        <Link href="/auth/signin" className="text-sm text-slate-500 hover:text-slate-700">
          Sign in
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">

          {/* Q1 — What's eating your time? */}
          {step === "q1" && (
            <div className="animate-fade-in">
              <p className="text-sm font-semibold text-brand-500 mb-3 tracking-wide uppercase">
                Step 1 of 3
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                What&apos;s eating too much of your time?
              </h1>
              <p className="text-slate-500 mb-6 text-base">
                Describe the task you do over and over that you wish you could hand off.
              </p>

              <textarea
                value={timeEater}
                onChange={(e) => setTimeEater(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && timeEater.trim().length > 5) {
                    e.preventDefault();
                    setStep("q2");
                  }
                }}
                placeholder="e.g. Answering the same questions from customers every day"
                rows={3}
                autoFocus
                className="w-full border-2 border-slate-200 focus:border-brand-400 focus:outline-none rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 text-lg resize-none transition-colors mb-4"
              />

              {/* Example chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setTimeEater(ex)}
                    className="text-xs text-slate-500 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 hover:border-brand-200 px-3 py-1.5 rounded-full transition-all"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-600 mb-4">{error}</p>
              )}

              <button
                onClick={() => setStep("q2")}
                disabled={timeEater.trim().length < 5}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-lg transition-all"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Q2 — Who will use it? */}
          {step === "q2" && (
            <div className="animate-fade-in">
              <p className="text-sm font-semibold text-brand-500 mb-3 tracking-wide uppercase">
                Step 2 of 3
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                Who will be talking to your agent?
              </h2>
              <p className="text-slate-500 mb-6 text-base">
                Your customers? Your team? Just you? Anyone with the link?
              </p>

              <textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    setStep("q3");
                  }
                }}
                placeholder="e.g. My customers who have questions after hours"
                rows={2}
                autoFocus
                className="w-full border-2 border-slate-200 focus:border-brand-400 focus:outline-none rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 text-lg resize-none transition-colors mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("q1")}
                  className="px-6 py-4 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:border-slate-300 transition-all text-base"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep("q3")}
                  disabled={audience.trim().length < 2}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-lg transition-all"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Q3 — Anything it should never do? (optional) */}
          {step === "q3" && (
            <div className="animate-fade-in">
              <p className="text-sm font-semibold text-brand-500 mb-3 tracking-wide uppercase">
                Step 3 of 3
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                Anything it should <span className="text-red-500">never</span> say?
              </h2>
              <p className="text-slate-500 mb-6 text-base">
                Optional — but this keeps your agent safe. You can always change it later.
              </p>

              <textarea
                value={neverDo}
                onChange={(e) => setNeverDo(e.target.value)}
                placeholder="e.g. Never promise refunds. Never share our prices. Never discuss competitors."
                rows={3}
                autoFocus
                className="w-full border-2 border-slate-200 focus:border-brand-400 focus:outline-none rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 text-base resize-none transition-colors mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("q2")}
                  className="px-6 py-4 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:border-slate-300 transition-all text-base"
                >
                  ← Back
                </button>
                <button
                  onClick={build}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-2xl text-lg transition-all"
                >
                  Build My Agent →
                </button>
              </div>

              <button
                onClick={build}
                className="w-full mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip this step — build it now
              </button>
            </div>
          )}

          {/* Building animation */}
          {step === "building" && (
            <div className="animate-fade-in text-center py-8">
              <div className="text-6xl mb-6 animate-bounce">🤖</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Building your agent…
              </h2>
              <div className="space-y-2 text-slate-500 text-sm">
                {[
                  "Understanding your task",
                  "Writing your agent's instructions",
                  "Setting safety rules",
                  "Getting your agent ready to go live",
                ].map((msg, i) => (
                  <p key={i} className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" style={{ animationDelay: `${i * 200}ms` }} />
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Done — agent is live */}
          {step === "done" && result?.chatUrl && (
            <div className="animate-fade-in text-center">
              <div className="text-6xl mb-5">🎉</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                Your agent is live!
              </h2>
              <p className="text-slate-500 mb-8 text-base">
                Share this link with anyone. They can start talking to{" "}
                <strong>{result.agentName}</strong> right now — no account needed.
              </p>

              {/* The link — big and obvious */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-3">
                  Your agent&apos;s link
                </p>
                <p className="font-mono text-sm text-slate-700 break-all mb-4">
                  {result.chatUrl}
                </p>
                <button
                  onClick={() => copy(result.chatUrl!)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors text-base"
                >
                  {copied ? "✓ Copied!" : "Copy link"}
                </button>
              </div>

              <a
                href={result.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-2xl transition-all text-lg mb-4"
              >
                Open my agent →
              </a>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Link
                  href="/dashboard"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Go to dashboard
                </Link>
                <Link
                  href="/quick"
                  onClick={() => {
                    setStep("q1");
                    setTimeEater("");
                    setAudience("");
                    setNeverDo("");
                    setResult(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Build another
                </Link>
              </div>
            </div>
          )}

          {/* Claim — not logged in, prompt signup */}
          {step === "claim" && (
            <div className="animate-fade-in text-center">
              <div className="text-6xl mb-5">✅</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                Your agent is ready!
              </h2>
              <p className="text-slate-500 mb-8 text-base max-w-md mx-auto">
                Create a free account to activate it and get your shareable link.
                Takes 30 seconds — no credit card.
              </p>

              <Link
                href="/auth/signup?next=/quick&claim=1"
                className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-2xl transition-all text-lg mb-3"
              >
                Create free account to activate →
              </Link>

              <Link
                href="/auth/signin?next=/quick&claim=1"
                className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Already have an account? Sign in
              </Link>

              <p className="text-xs text-slate-400 mt-4">
                We saved your answers. Your agent will activate as soon as you sign in.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
