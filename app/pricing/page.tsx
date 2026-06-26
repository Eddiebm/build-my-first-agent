"use client";

import Link from "next/link";
import { useState } from "react";

const FREE_FEATURES = [
  "10-question agent wizard",
  "Live blueprint generator",
  "9 learning levels",
  "8 example templates",
  "1 saved agent",
  "Demo chat prototype",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited saved agents",
  "Live AI chat prototype",
  "Export system prompt",
  "Export markdown blueprint",
  "Export JSON config",
  "Deployment checklist download",
  "Priority support",
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    if (res.status === 401) {
      window.location.href = "/auth/signup?next=/pricing";
      return;
    }
    const data = await res.json() as { url?: string };
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/" className="font-extrabold text-slate-900">
            🤖 Build My First Agent
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-slate-600 hover:text-slate-900 font-medium">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Simple pricing</h1>
          <p className="text-lg text-slate-600">
            Start free. Upgrade when you&apos;re ready to ship.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Free</p>
              <p className="text-4xl font-extrabold text-slate-900">$0</p>
              <p className="text-slate-500 text-sm mt-1">Forever free</p>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup"
              className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm"
            >
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-brand-500 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Most popular
            </div>
            <div className="mb-6">
              <p className="text-sm font-bold text-brand-100 uppercase tracking-wide mb-1">Pro</p>
              <p className="text-4xl font-extrabold text-white">$15</p>
              <p className="text-brand-200 text-sm mt-1">per month</p>
            </div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                  <span className="text-green-300 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={upgrade}
              disabled={loading}
              className="block w-full text-center bg-white hover:bg-brand-50 text-brand-600 font-bold py-3 rounded-xl transition-colors text-sm disabled:opacity-60"
            >
              {loading ? "Loading…" : "Upgrade to Pro →"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Cancel anytime. No lock-in. Questions?{" "}
          <a href="mailto:hello@buildmyfirstagent.com" className="text-brand-600 hover:underline">
            Email us
          </a>
        </p>
      </div>
    </div>
  );
}
