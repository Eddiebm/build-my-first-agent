"use client";

import Link from "next/link";
import UserNav from "@/app/components/UserNav";

const AUDIENCES = [
  { emoji: "👩‍💼", label: "Small business owners" },
  { emoji: "🏠", label: "Real estate operators" },
  { emoji: "🏥", label: "Healthcare teams" },
  { emoji: "🎓", label: "Teachers & educators" },
  { emoji: "🌱", label: "Nonprofit leaders" },
  { emoji: "👤", label: "People over 50" },
  { emoji: "💡", label: "Founders & makers" },
  { emoji: "📊", label: "Sales professionals" },
];

const AGENT_EXAMPLES = [
  {
    emoji: "📧",
    title: "Email Assistant",
    desc: "Reads your inbox, drafts replies in your voice, sends you a morning summary.",
  },
  {
    emoji: "🏛️",
    title: "Grant Researcher",
    desc: "Finds funding opportunities matching your mission and alerts you before deadlines.",
  },
  {
    emoji: "🏢",
    title: "Leasing Assistant",
    desc: "Answers tenant questions 24/7 so you stop getting midnight calls.",
  },
  {
    emoji: "📱",
    title: "Content Creator",
    desc: "Writes social posts in your brand voice so you never stare at a blank page.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Answer 10 questions",
    desc: "We ask one question at a time about what your agent should do, who it serves, and what it must never do.",
  },
  {
    step: "2",
    title: "Get a blueprint",
    desc: "We generate a complete Agent Blueprint — mission, workflow, tools, safety rules, and test cases — all from your answers.",
  },
  {
    step: "3",
    title: "Test it live",
    desc: "Chat with a working prototype of your agent right inside the app. See it answer your test questions in real time.",
  },
  {
    step: "4",
    title: "Export and deploy",
    desc: "Download your system prompt, JSON config, and deployment checklist. Ship your agent to the world.",
  },
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
            <Link
              href="/gallery"
              className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors hidden sm:block"
            >
              Examples
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors hidden sm:block"
            >
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
            Free • No coding required • Start in 2 minutes
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Stop doing it yourself.{" "}
            <span className="text-brand-500">Hand it to an AI agent.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            No coding. No complicated setup. Answer a few plain-English questions
            and your agent is live — ready to share with anyone.
          </p>

          {/* Three-path choice */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
            {/* Path 1 — Hire an employee */}
            <Link
              href="/hire"
              className="group relative bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-6 text-left transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-3">👔</div>
              <p className="font-extrabold text-lg leading-snug mb-1">
                Hire an employee
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pick a role. We train and deploy them. Done in 60 seconds.
              </p>
              <p className="mt-4 text-white font-semibold text-sm group-hover:underline">
                See roles →
              </p>
            </Link>

            {/* Path 2 — Quick fix */}
            <Link
              href="/quick"
              className="group relative bg-brand-500 hover:bg-brand-600 text-white rounded-2xl p-6 text-left transition-all shadow-lg shadow-brand-500/25 hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-3">⚡</div>
              <p className="font-extrabold text-lg leading-snug mb-1">
                Fix one problem
              </p>
              <p className="text-brand-100 text-sm leading-relaxed">
                Answer 3 questions. Agent goes live. Done in 2 minutes.
              </p>
              <p className="mt-4 text-white font-semibold text-sm group-hover:underline">
                Start now →
              </p>
            </Link>

            {/* Path 3 — Learn mode */}
            <Link
              href="/builder"
              className="group relative bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-6 text-left transition-all border-2 border-slate-200 hover:border-brand-300 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-3">🎓</div>
              <p className="font-extrabold text-lg leading-snug mb-1">
                I want to learn
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                10 questions, full blueprint, 9 levels. Takes ~20 min.
              </p>
              <p className="mt-4 text-brand-600 font-semibold text-sm group-hover:underline">
                Open the builder →
              </p>
            </Link>
          </div>

          <p className="text-sm text-slate-400">
            Free · No account required · No credit card
          </p>
        </div>
      </section>

      {/* What is an AI agent */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              What exactly is an AI agent?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Forget the hype. Here&apos;s the plain-English version.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🤖",
                title: "It thinks",
                desc: "An AI agent reads your instructions, understands the situation, and decides what to do — like a very well-trained assistant who never needs a break.",
              },
              {
                emoji: "🔧",
                title: "It acts",
                desc: "Unlike a basic chatbot, an agent can take actions: search the web, read documents, send emails, create tickets, look up your database.",
              },
              {
                emoji: "🔁",
                title: "It loops",
                desc: "Agents can run on a schedule, retry when something fails, ask you for approval before doing anything risky, and learn from feedback.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-brand-50 rounded-xl p-6 border border-brand-100 text-center">
            <p className="text-brand-800 text-base font-medium">
              💡 Think of it this way: An AI chatbot answers questions. An AI agent gets things done.
            </p>
          </div>
        </div>
      </section>

      {/* Example agents */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Real agents people build with this tool
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {AGENT_EXAMPLES.map((ex) => (
              <div
                key={ex.title}
                className="flex gap-4 p-5 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all group"
              >
                <span className="text-3xl flex-shrink-0">{ex.emoji}</span>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {ex.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{ex.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/gallery"
              className="text-brand-600 font-semibold hover:text-brand-700 text-sm"
            >
              See all 8 example templates →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              How it works
            </h2>
            <p className="text-lg text-slate-600">
              Four steps. One afternoon. One working agent.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-bold text-lg flex items-center justify-center mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Made for people who aren&apos;t programmers
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            If you can describe a job to a new employee, you can build an agent.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {AUDIENCES.map((a) => (
              <span
                key={a.label}
                className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                {a.emoji} {a.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-brand-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Which path is right for you?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Both are free. Both get you a live agent. Pick your speed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/hire"
              className="bg-white hover:bg-slate-50 text-slate-900 text-sm font-bold px-6 py-4 rounded-xl transition-all shadow-lg inline-block hover:-translate-y-0.5"
            >
              👔 Hire an employee — 60 sec
            </Link>
            <Link
              href="/quick"
              className="bg-brand-400 hover:bg-brand-300 text-white text-sm font-bold px-6 py-4 rounded-xl transition-all inline-block hover:-translate-y-0.5"
            >
              ⚡ Fix one problem — 2 min
            </Link>
            <Link
              href="/builder"
              className="bg-brand-400 hover:bg-brand-300 text-white text-sm font-bold px-6 py-4 rounded-xl transition-all inline-block hover:-translate-y-0.5 border border-brand-300"
            >
              🎓 Learn as I go — 20 min
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 sm:px-6 text-center text-sm text-slate-400">
        <p>
          Build My First Agent — Teaching anyone to build AI, one question at a time.
        </p>
      </footer>
    </div>
  );
}
