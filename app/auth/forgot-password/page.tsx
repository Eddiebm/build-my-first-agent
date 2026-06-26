"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }
    setDone(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-slate-900">
            🤖 Build My First Agent
          </Link>
          <p className="text-slate-500 mt-2">Reset your password</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {done ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-sm text-slate-500 mb-6">
                If an account exists for <strong>{email}</strong>, you&apos;ll receive a reset link shortly. Check your spam folder if it doesn&apos;t arrive.
              </p>
              <Link href="/auth/signin" className="text-brand-600 font-semibold hover:underline text-sm">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-sm text-slate-500 mb-4">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-slate-900"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? "Sending…" : "Send reset link →"}
              </button>
              <p className="text-center text-sm text-slate-500">
                <Link href="/auth/signin" className="text-brand-600 font-semibold hover:underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
