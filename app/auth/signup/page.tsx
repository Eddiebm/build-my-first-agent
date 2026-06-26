"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/quick?welcome=1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json() as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }
    router.push(next);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-slate-900">
            🤖 Build My First Agent
          </Link>
          <p className="text-slate-500 mt-2">Create your free account</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-slate-900"
                placeholder="you@example.com"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password <span className="font-normal text-slate-400">(min 8 characters)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-slate-900"
                placeholder="••••••••"
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
              {loading ? "Creating account…" : "Create Free Account →"}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-brand-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">
          Free forever. No credit card required.{" "}
          By signing up you agree to our{" "}
          <a href="/terms" className="underline hover:text-slate-600">Terms</a>
          {" "}and{" "}
          <a href="/privacy" className="underline hover:text-slate-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
