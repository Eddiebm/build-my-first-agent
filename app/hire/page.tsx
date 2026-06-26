"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { EMPLOYEE_ROLES, type EmployeeRole } from "@/lib/employee-roles";

type Step = "pick" | "customize" | "hiring" | "done" | "claim";

export default function HirePage() {
  return (
    <Suspense>
      <HireFlow />
    </Suspense>
  );
}

function HireFlow() {
  const [step, setStep] = useState<Step>("pick");
  const [selectedRole, setSelectedRole] = useState<EmployeeRole | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [context, setContext] = useState("");
  const [neverDo, setNeverDo] = useState("");
  const [calendarUrl, setCalendarUrl] = useState("");
  const [result, setResult] = useState<{
    agentId?: string;
    agentName?: string;
    roleTitle?: string;
    roleEmoji?: string;
    chatUrl?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const wantsCalendar =
    selectedRole?.id === "leasing-coordinator" ||
    selectedRole?.id === "appointment-scheduler" ||
    selectedRole?.id === "front-desk-receptionist";

  async function hire() {
    if (!selectedRole) return;
    setStep("hiring");
    setError("");

    const [res] = await Promise.all([
      fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId: selectedRole.id,
          businessName,
          context,
          neverDo: neverDo.trim() || undefined,
          calendarUrl: calendarUrl.trim() || undefined,
        }),
      }),
      new Promise((r) => setTimeout(r, 2200)),
    ]);

    const data = await res.json() as {
      saved?: boolean;
      agentId?: string;
      agentName?: string;
      roleTitle?: string;
      roleEmoji?: string;
      chatUrl?: string;
      error?: string;
      upgradeRequired?: boolean;
    };

    if (!res.ok) {
      if (data.upgradeRequired) { window.location.href = "/pricing"; return; }
      setError(data.error ?? "Something went wrong. Please try again.");
      setStep("customize");
      return;
    }

    setResult(data);
    if (data.saved && data.chatUrl) {
      setStep("done");
    } else {
      localStorage.setItem("bmfa_hire_draft", JSON.stringify({
        roleId: selectedRole.id, businessName, context, neverDo, calendarUrl,
      }));
      setStep("claim");
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-slate-100 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-slate-900 text-base">
          🤖 Build My First Agent
        </Link>
        <Link href="/auth/signin" className="text-sm text-slate-500 hover:text-slate-700">
          Sign in
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center px-4 py-10">

        {/* Role picker */}
        {step === "pick" && (
          <div className="w-full max-w-3xl animate-fade-in">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-brand-500 mb-2 tracking-wide uppercase">Step 1 of 3</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
                Who do you want to hire?
              </h1>
              <p className="text-slate-500 text-base max-w-xl mx-auto">
                Pick the role. We&apos;ll build, train, and deploy them for your business — ready in 60 seconds.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {EMPLOYEE_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => { setSelectedRole(role); setStep("customize"); }}
                  className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-brand-400 hover:bg-brand-50 text-left transition-all"
                >
                  <div className="text-3xl mb-2">{role.emoji}</div>
                  <p className="font-bold text-slate-900 text-sm group-hover:text-brand-700 transition-colors">
                    {role.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{role.tagline}</p>
                  <div className="mt-3 space-y-0.5">
                    {role.handles.slice(0, 2).map((h) => (
                      <p key={h} className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="text-green-400">✓</span> {h}
                      </p>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Customize */}
        {step === "customize" && selectedRole && (
          <div className="w-full max-w-lg animate-fade-in">
            <button
              onClick={() => setStep("pick")}
              className="text-sm text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1"
            >
              ← Change role
            </button>

            <div className="bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4 mb-6 flex items-center gap-4">
              <span className="text-4xl">{selectedRole.emoji}</span>
              <div>
                <p className="font-extrabold text-slate-900">{selectedRole.title}</p>
                <p className="text-sm text-slate-500">{selectedRole.tagline}</p>
              </div>
            </div>

            <p className="text-sm font-semibold text-brand-500 mb-5 tracking-wide uppercase">
              Step 2 of 3 — Tell us about your business
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  Business name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Sunrise Property Management"
                  autoFocus
                  className="w-full border-2 border-slate-200 focus:border-brand-400 focus:outline-none rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-base transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  Describe your business in one sentence
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={`e.g. We manage 12 residential properties in Atlanta and help tenants with leasing and maintenance.`}
                  rows={2}
                  className="w-full border-2 border-slate-200 focus:border-brand-400 focus:outline-none rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm resize-none transition-colors"
                />
              </div>

              {wantsCalendar && (
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Booking link <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={calendarUrl}
                    onChange={(e) => setCalendarUrl(e.target.value)}
                    placeholder="https://calendly.com/yourname"
                    className="w-full border-2 border-slate-200 focus:border-brand-400 focus:outline-none rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm transition-colors"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Your {selectedRole.title} will share this link when someone wants to schedule.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  Anything they should <span className="text-red-500">never</span> say?{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={neverDo}
                  onChange={(e) => setNeverDo(e.target.value)}
                  placeholder="e.g. Never discuss competitor pricing. Never promise refunds."
                  className="w-full border-2 border-slate-200 focus:border-brand-400 focus:outline-none rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm transition-colors"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

            <button
              onClick={hire}
              disabled={!businessName.trim() || !context.trim()}
              className="w-full mt-6 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-lg transition-all"
            >
              Hire my {selectedRole.title} →
            </button>

            <div className="mt-4 bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 mb-2">They will handle:</p>
              <div className="space-y-1">
                {selectedRole.handles.map((h) => (
                  <p key={h} className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="text-green-500">✓</span> {h}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hiring animation */}
        {step === "hiring" && selectedRole && (
          <div className="animate-fade-in text-center py-12 max-w-sm">
            <div className="text-6xl mb-5 animate-bounce">{selectedRole.emoji}</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Hiring your {selectedRole.title}…
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Writing their training, setting up their knowledge, and getting them ready.
            </p>
            <div className="space-y-2 text-sm text-slate-500">
              {[
                "Writing job description and training",
                "Setting communication guidelines",
                "Configuring tools and integrations",
                "Deploying to your business",
              ].map((msg, i) => (
                <p key={i} className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" style={{ animationDelay: `${i * 250}ms` }} />
                  {msg}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Done */}
        {step === "done" && result?.chatUrl && selectedRole && (
          <div className="animate-fade-in text-center max-w-md">
            {/* Employee card */}
            <div className="bg-white border-2 border-green-200 rounded-3xl p-8 mb-6 shadow-lg shadow-green-100">
              <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-4xl mx-auto mb-4">
                {result.roleEmoji ?? selectedRole.emoji}
              </div>
              <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active — Ready to work
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">
                {result.agentName ?? `${businessName} ${selectedRole.title}`}
              </h2>
              <p className="text-sm text-slate-500 mb-6">{selectedRole.tagline}</p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">
                  Share their link
                </p>
                <p className="font-mono text-xs text-slate-600 break-all mb-3">{result.chatUrl}</p>
                <button
                  onClick={() => copy(result.chatUrl!)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                >
                  {copied ? "✓ Copied!" : "Copy link"}
                </button>
              </div>

              <a
                href={result.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Meet your new {selectedRole.title} →
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                href="/dashboard"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setStep("pick");
                  setSelectedRole(null);
                  setBusinessName("");
                  setContext("");
                  setNeverDo("");
                  setCalendarUrl("");
                  setResult(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
              >
                Hire another
              </button>
            </div>
          </div>
        )}

        {/* Claim — not logged in */}
        {step === "claim" && selectedRole && (
          <div className="animate-fade-in text-center max-w-sm">
            <div className="text-5xl mb-4">{selectedRole.emoji}</div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              Your {selectedRole.title} is ready!
            </h2>
            <p className="text-slate-500 mb-8 text-sm max-w-xs mx-auto">
              Create a free account to activate them and get their shareable link. Takes 30 seconds.
            </p>
            <Link
              href={`/auth/signup?next=/hire&claim=1`}
              className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-2xl transition-all text-base mb-3"
            >
              Create free account to activate →
            </Link>
            <Link
              href={`/auth/signin?next=/hire&claim=1`}
              className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Already have an account? Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
