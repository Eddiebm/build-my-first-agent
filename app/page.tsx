"use client";

import Link from "next/link";
import UserNav from "@/app/components/UserNav";
import { EMPLOYEE_ROLES } from "@/lib/employee-roles";

const STEPS = [
  { step: "1", title: "Pick a role", desc: "Choose from 17 AI employees — receptionist, scheduler, invoice chaser, talent screener, and more." },
  { step: "2", title: "Tell us about your business", desc: "Business name, what you do, and your website URL. Takes two minutes. No coding required." },
  { step: "3", title: "Your employee goes live", desc: "Get a shareable chat link and a real phone number. Your AI employee starts handling calls and questions immediately." },
];

const DEMO_MESSAGES = [
  { from: "customer", text: "Hi, are you open on weekends? I need a quote for a bathroom remodel." },
  { from: "employee", name: "Sarah", text: "Hi there! Yes, we're open Saturday 9am–5pm. I'd love to get you connected with the team for a quote. Can I get your name and best number?" },
  { from: "customer", text: "Sure — Mike Johnson, 404-555-0192" },
  { from: "employee", name: "Sarah", text: "Perfect, Mike! I've saved your info. Someone from the team will call you back within the hour. Is it a master bath or a full remodel?" },
  { from: "customer", text: "Master bath, budget is around $15-20k" },
  { from: "employee", name: "Sarah", text: "Got it — master bath, $15–20k budget. I've passed that to the team. You're all set! 🎉" },
];

const SPOTLIGHTED_ROLES = EMPLOYEE_ROLES.slice(0, 8);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <span className="font-bold text-slate-900 text-lg">🤖 Build My First Agent</span>
          <div className="flex items-center gap-4">
            <Link href="/hire" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors hidden sm:block">
              All Employees
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
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
            Live in 60 seconds · No coding · $15/mo
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Hire your first AI employee.{" "}
            <span className="text-brand-500">Live in 60 seconds.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Answer customers, book appointments, capture leads, chase invoices, and screen applicants —
            24/7, without payroll, training, or developers.
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
              <p className="text-brand-100 text-xs leading-relaxed">Tell us your job. We&apos;ll recommend the right employee.</p>
              <p className="mt-3 text-white font-semibold text-sm group-hover:underline">Get recommendation →</p>
            </Link>

            <Link
              href="/hire"
              className="group relative bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-6 text-left transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2">👔</div>
              <p className="font-extrabold text-base leading-snug mb-1">Browse employees</p>
              <p className="text-slate-400 text-xs leading-relaxed">17 ready-to-hire AI employees. Pick one and go live.</p>
              <p className="mt-3 text-white font-semibold text-sm group-hover:underline">See all roles →</p>
            </Link>

            <Link
              href="/quick"
              className="group relative bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-6 text-left transition-all border-2 border-slate-200 hover:border-brand-300 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2">⚡</div>
              <p className="font-extrabold text-base leading-snug mb-1">Custom hire</p>
              <p className="text-slate-500 text-xs leading-relaxed">Describe any task. Custom employee built in 2 minutes.</p>
              <p className="mt-3 text-brand-600 font-semibold text-sm group-hover:underline">Start now →</p>
            </Link>
          </div>
          <p className="text-sm text-slate-400">Free to try · No account required · No credit card</p>
        </div>
      </section>

      {/* Pain */}
      <section className="py-16 px-4 sm:px-6 bg-red-50 border-y border-red-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Every missed call is a job you didn&apos;t get.</h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Small businesses lose thousands every year to voicemail, long hold times, and after-hours silence.
              Your competitors pick up. You don&apos;t.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { stat: "62%", label: "of callers won't leave a voicemail" },
              { stat: "85%", label: "of customers don't call back if they reach voicemail" },
              { stat: "$1,200", label: "average value of a missed contractor lead" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-6 border border-red-100">
                <p className="text-4xl font-extrabold text-red-500 mb-2">{item.stat}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo conversation */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-brand-400 text-sm font-bold uppercase tracking-widest mb-3">See it in action</p>
            <h2 className="text-3xl font-bold text-white mb-3">Sarah handles it while you&apos;re on the job.</h2>
            <p className="text-slate-400 text-base max-w-lg mx-auto">
              A real conversation between a customer and Sarah, the AI Receptionist for a contracting company.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden max-w-lg mx-auto">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700 bg-slate-900">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm">📞</div>
              <div>
                <p className="text-sm font-bold text-white">Sarah</p>
                <p className="text-xs text-green-400">● AI Receptionist · Working now</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {DEMO_MESSAGES.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "customer" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.from === "customer"
                        ? "bg-slate-700 text-slate-200 rounded-br-sm"
                        : "bg-brand-500 text-white rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-slate-700 bg-slate-900/50">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Lead captured · Mike Johnson · 404-555-0192 · Master bath remodel $15–20k
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/hire?role=front-desk-receptionist"
              className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-4 rounded-xl transition-all inline-block hover:-translate-y-0.5"
            >
              Hire Sarah for your business →
            </Link>
          </div>
        </div>
      </section>

      {/* Employee gallery */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">17 AI employees. Ready to hire today.</h2>
            <p className="text-lg text-slate-600">Each one trained for a specific job. Pick the role. Go live in 60 seconds.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {SPOTLIGHTED_ROLES.map((role) => (
              <Link
                key={role.id}
                href={`/hire?role=${role.id}`}
                className="group p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-all text-center"
              >
                <div className="text-3xl mb-2">{role.emoji}</div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">{role.humanName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{role.title}</p>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/hire" className="text-brand-600 font-semibold hover:text-brand-700 text-sm">
              See all 17 employees →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Hired and live in three steps</h2>
            <p className="text-lg text-slate-600">From zero to a working AI employee in under 5 minutes.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-xl p-6 border border-slate-200">
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
              { label: "Part-time receptionist", cost: "$2,000/mo", sub: "Plus taxes, benefits, sick days", highlight: false },
              { label: "Answering service", cost: "$300/mo", sub: "Takes messages. Does nothing else.", highlight: false },
              { label: "Your AI employee", cost: "$15/mo", sub: "Answers, captures, books. 24/7.", highlight: true },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl p-6 border ${item.highlight ? "bg-brand-500 border-brand-500 text-white" : "bg-white border-slate-200"}`}>
                <p className={`text-sm font-medium mb-2 ${item.highlight ? "text-brand-100" : "text-slate-500"}`}>{item.label}</p>
                <p className={`text-3xl font-extrabold mb-1 ${item.highlight ? "text-white" : "text-slate-900"}`}>{item.cost}</p>
                <p className={`text-xs ${item.highlight ? "text-brand-100" : "text-slate-400"}`}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Built for businesses where a missed call means a missed job</h2>
          <p className="text-lg text-slate-600 mb-10">If customers can&apos;t reach you, they call someone else. Your AI employee picks up every time.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { emoji: "🔨", label: "Contractors & Trades" },
              { emoji: "🏠", label: "Landlords & Property Managers" },
              { emoji: "🏥", label: "Medical & Dental Offices" },
              { emoji: "🛡️", label: "Insurance Agents" },
              { emoji: "💈", label: "Salons & Spas" },
              { emoji: "🚗", label: "Auto Repair Shops" },
              { emoji: "🏋️", label: "Gyms & Fitness Studios" },
              { emoji: "🍽️", label: "Restaurants & Catering" },
            ].map((a) => (
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
            Hire your first AI employee in 60 seconds. Free to try.
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
              Browse all 17 employees
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
