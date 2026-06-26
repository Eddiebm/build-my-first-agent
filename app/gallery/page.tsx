"use client";

import Link from "next/link";
import { EMPLOYEE_ROLES } from "@/lib/employee-roles";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">
            ← Build My First Agent
          </Link>
          <Link
            href="/suggest"
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Not sure? Get a recommendation →
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            12 AI Employees. Ready to hire.
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Pick one, tell us about your business, and they&apos;re live in 60 seconds.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EMPLOYEE_ROLES.map((role) => (
            <Link
              key={role.id}
              href={`/hire?role=${role.id}`}
              className="bg-white rounded-xl border-2 border-slate-200 hover:border-brand-400 hover:shadow-md p-6 transition-all group block"
            >
              <div className="text-4xl mb-3">{role.emoji}</div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-1">
                {role.title}
              </h2>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{role.tagline}</p>
              <ul className="space-y-1.5">
                {role.handles.slice(0, 2).map((h) => (
                  <li key={h} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-bold text-brand-600 group-hover:underline">
                Hire this employee →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Don&apos;t see your role?</h2>
          <p className="text-slate-600 mb-4 text-sm">
            Describe what you need in plain English and we&apos;ll build a custom AI employee for you in 2 minutes.
          </p>
          <Link
            href="/quick"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            ⚡ Build a custom employee →
          </Link>
        </div>
      </div>
    </div>
  );
}
