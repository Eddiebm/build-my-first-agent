"use client";

import Link from "next/link";
import UserNav from "@/app/components/UserNav";

const ROLES = [
  { emoji: "📞", title: "Phone Receptionist", desc: "Answers calls when you're on the job. Books appointments. Captures every lead." },
  { emoji: "🏠", title: "Leasing Coordinator", desc: "Handles tenant and prospect questions 24/7 so you stop missing rentals." },
  { emoji: "🔧", title: "After-Hours Hotline", desc: "Takes service calls at midnight when no one else picks up." },
  { emoji: "🧾", title: "Invoice Chaser", desc: "Follows up on unpaid invoices so you get paid without the awkward calls." },
];

const STEPS = [
  { step: "1", title: "Pick a role", desc: "Choose from 12 pre-built AI employees — receptionist, leasing agent, sales rep, invoice chaser, and more." },
  { step: "2", title: "Tell us about your business", desc: "Two minutes of plain-English questions. No coding. No forms. Just talk about what you do." },
  { step: "3", title: "Go live", desc: "Get a chat widget for your website and a real phone number. Your AI employee starts working immediately." },
];

const AUDIENCES = [
  { emoji: "🔨", label: "Contractors & Trades" },
  { emoji: "🏠", label: "Landlords & Property Managers" },
  { emoji: "🏥", label: "Medical & Dental Offices" },
  { emoji: "🛡️", label: "Insurance Agents" },
  { emoji: "💈", label: "Salons & Spas" },
  { emoji: "🚗", label: "Auto Repair Shops" },
  { emoji: "🏋️", label: "Gyms & Fitness Studios" },
  { emoji: "🍽️", label: "Restaurants & Catering" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <span className="font-bold text-slate-900 text-lg">
            🤖 Build My First Agent
          </span>
          <div className="flex items-center gap-4">
            <Link href="/hire" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors hidden sm:block">
              All Roles
            </Link>
            <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors hidden sm:block">
              Pricing
            </Link>
            <UserNav />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 sm:px-6 text-center bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1 rounded-full mb-6 border border-brand-100">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft"></span>
            Live in 60 seconds · No coding · $15/mo
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Your first AI employee.{" "}
            <span className="text-brand-500">Answering calls in 60 seconds.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Pick a role, tell us about your business, and your AI employee goes live —
            handling calls, answering questions, and capturing leads while you work.
          </p>

          {/* Three paths */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-4">
            <Link
              href="/suggest"
              className="group relative bg-brand-500 hover:bg-brand-600 text-white rounded-2xl p-6 text-left transition-all shadow-lg shadow-brand-500/25 hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                ✦ Start here
              </div>
              <div className="text-3xl mb-2">🤔</div>
              <p className="font-extrabold text-base leading-snug mb-1">Not sure?</p>
              <p className="text-brand-100 text-xs leading-relaxed">Tell us your job. We'll pick the right AI employee for you.</p>
              <p className="mt-3 text-white font-semibold text-sm group-hover:underline">Get recommendation →</p>
            </Link>

            <Link
              href="/hire"
              className="group relative bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-6 text-left transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2">👔</div>
              <p className="font-extrabold text-base leading-snug mb-1">Browse roles</p>
              <p className="text-slate-400 text-xs leading-relaxed">12 pre-built AI employees. Pick one and deploy in 60 seconds.</p>
              <p className="mt-3 text-white font-semibold text-sm group-hover:underline">See all roles →</p>
            </Link>

            <Link
              href="/quick"
              className="group relative bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-6 text-left transition-all border-2 border-slate-200 hover:border-brand-300 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2">⚡</div>
              <p className="font-extrabold text-base leading-snug mb-1">Fix one thing</p>
              <p className="text-slate-500 text-xs leading-relaxed">Describe the task killing your time. Custom agent in 2 minutes.</p>
              <p className="mt-3 text-brand-600 font-semibold text-sm group-hover:underline">Start now →</p>
            </Link>
          </div>

          <p className="text-sm text-slate-400">Free to try · No account required · No credit card</p>
        </div>
      </section>

      {/* What they actually get */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">What your AI employee actually does</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Not a chatbot that says "I don&apos;t understand." A trained employee who knows your business.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {ROLES.map((r) => (
              <div key={r.title} className="flex gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all group">
                <span className="text-3xl flex-shrink-0">{r.emoji}</span>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{r.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/hire" className="text-brand-600 font-semibold hover:text-brand-700 text-sm">
              See all 12 roles →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Live in three steps</h2>
            <p className="text-lg text-slate-600">From zero to a working AI employee in under 5 minutes.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-bold text-lg flex items-center justify-center mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The math */}
      <section className="py-16 px-4 sm:px-6 bg-brand-50 border-y border-brand-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">The math is simple</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { label: "Part-time receptionist", cost: "$2,000/mo", sub: "Plus taxes, benefits, sick days" },
              { label: "Answering service", cost: "$300/mo", sub: "Takes messages. Does nothing else." },
              { label: "Your AI employee", cost: "$15/mo", sub: "Answers, captures, books. 24/7." },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl p-6 border ${item.label === "Your AI employee" ? "bg-brand-500 border-brand-500 text-white" : "bg-white border-slate-200"}`}>
                <p className={`text-sm font-medium mb-2 ${item.label === "Your AI employee" ? "text-brand-100" : "text-slate-500"}`}>{item.label}</p>
                <p className={`text-3xl font-extrabold mb-1 ${item.label === "Your AI employee" ? "text-white" : "text-slate-900"}`}>{item.cost}</p>
                <p className={`text-xs ${item.label === "Your AI employee" ? "text-brand-100" : "text-slate-400"}`}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Built for small businesses that can&apos;t afford to miss a call</h2>
          <p className="text-lg text-slate-600 mb-10">If a missed call means a lost job, this is for you.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {AUDIENCES.map((a) => (
              <span key={a.label} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
                {a.emoji} {a.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Stop losing jobs to missed calls.
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Your AI employee is live in 60 seconds. Free to try.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/suggest"
              className="bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold px-8 py-4 rounded-xl transition-all shadow-lg inline-block hover:-translate-y-0.5"
            >
              Get my recommendation — 30 sec →
            </Link>
            <Link
              href="/hire"
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-6 py-4 rounded-xl transition-all inline-block hover:-translate-y-0.5 border border-white/20"
            >
              Browse all 12 roles
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 sm:px-6 text-center text-sm text-slate-400">
        <p className="mb-2">Build My First Agent — AI employees for small businesses. No coding required.</p>
        <div className="flex items-center justify-center gap-4">
          <a href="/terms" className="hover:text-slate-600 transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</a>
          <a href="mailto:hello@buildmyfirstagent.com" className="hover:text-slate-600 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
