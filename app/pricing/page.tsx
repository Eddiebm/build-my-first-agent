"use client";

import Link from "next/link";
import { useState } from "react";

const FREE_FEATURES = [
  "Hire 1 AI employee",
  "Chat widget for your website",
  "500 lifetime conversations",
  "All 17 AI employee roles",
  "No credit card required",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Hire unlimited AI employees",
  "200 conversations/day per employee",
  "Real phone number — employees answer actual calls",
  "Lead capture — saves caller info automatically",
  "Calendar booking integration",
  "Date/time & calculator tools",
];

const BUSINESS_FEATURES = [
  "Everything in Pro",
  "1,000 conversations/day per employee",
  "Live web search (employees can look things up)",
  "URL reader (employees can read web pages)",
  "Priority support",
];

export default function PricingPage() {
  const [loading, setLoading] = useState<"pro" | "business" | null>(null);

  async function upgrade(tier: "pro" | "business") {
    setLoading(tier);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    if (res.status === 401) {
      window.location.href = `/auth/signup?next=/pricing`;
      return;
    }
    const data = await res.json() as { url?: string };
    if (data.url) window.location.href = data.url;
    else setLoading(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            Cheaper than a part-time hire. More reliable than an answering service.
          </h1>
          <p className="text-lg text-slate-600">
            Start free. Add voice and lead capture when you&apos;re ready.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Free</p>
              <p className="text-4xl font-extrabold text-slate-900">$0</p>
              <p className="text-slate-500 text-sm mt-1">Forever free</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/hire"
              className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm"
            >
              Hire your first employee →
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-brand-500 rounded-2xl p-8 relative overflow-hidden flex flex-col">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Most popular
            </div>
            <div className="mb-6">
              <p className="text-sm font-bold text-brand-100 uppercase tracking-wide mb-1">Growth</p>
              <p className="text-4xl font-extrabold text-white">$49</p>
              <p className="text-brand-200 text-sm mt-1">per month · voice included</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                  <span className="text-green-300 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => upgrade("pro")}
              disabled={loading !== null}
              className="block w-full text-center bg-white hover:bg-brand-50 text-brand-600 font-bold py-3 rounded-xl transition-colors text-sm disabled:opacity-60"
            >
              {loading === "pro" ? "Loading…" : "Get Growth →"}
            </button>
          </div>

          {/* Business */}
          <div className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">Business</p>
              <p className="text-4xl font-extrabold text-white">$99</p>
              <p className="text-slate-400 text-sm mt-1">per month</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {BUSINESS_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => upgrade("business")}
              disabled={loading !== null}
              className="block w-full text-center bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 rounded-xl transition-colors text-sm disabled:opacity-60"
            >
              {loading === "business" ? "Loading…" : "Get Business →"}
            </button>
          </div>
        </div>

        {/* Comparison */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 text-center">How we compare</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            {[
              { label: "Part-time receptionist", cost: "~$2,000/mo", sub: "Sick days. Turnover. Benefits. Training.", bad: true },
              { label: "Answering service", cost: "~$300/mo", sub: "Takes a message. Never books. No follow-up.", bad: true },
              { label: "Your AI employee (Pro)", cost: "$49/mo", sub: "Answers every call, captures leads, books, works 24/7.", bad: false },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl p-5 border ${item.bad ? "border-slate-200 bg-slate-50" : "border-brand-200 bg-brand-50"}`}>
                <p className={`font-bold mb-1 ${item.bad ? "text-slate-700" : "text-brand-700"}`}>{item.label}</p>
                <p className={`text-2xl font-extrabold mb-2 ${item.bad ? "text-slate-500 line-through" : "text-brand-600"}`}>{item.cost}</p>
                <p className={`text-xs leading-relaxed ${item.bad ? "text-slate-400" : "text-brand-700"}`}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Cancel anytime · No lock-in · Questions?{" "}
          <a href="mailto:hello@buildmyfirstagent.com" className="text-brand-600 hover:underline">
            Email us
          </a>
        </p>
      </div>
    </div>
  );
}
