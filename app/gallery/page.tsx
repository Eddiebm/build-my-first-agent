"use client";

import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export default function GalleryPage() {
  function startWithTemplate(templateId: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("bmfa_template", templateId);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">
            ← Build My First Agent
          </Link>
          <Link
            href="/builder"
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Start from Scratch →
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Example Agent Templates
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Pick a template to pre-fill your builder, or start from scratch with your own idea.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {TEMPLATES.map((t) => (
            <div
              key={t.id}
              className={`rounded-xl border-2 p-6 bg-white hover:shadow-md transition-all group ${t.color}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl flex-shrink-0">{t.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {t.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{t.audience}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">{t.description}</p>
              <Link
                href="/builder"
                onClick={() => startWithTemplate(t.id)}
                className="w-full block text-center bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
              >
                Use this template →
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 p-8 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-600 text-lg mb-4">
            Don&apos;t see your use case? Build from scratch.
          </p>
          <Link
            href="/builder"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Start With My Own Idea →
          </Link>
        </div>
      </div>
    </div>
  );
}
