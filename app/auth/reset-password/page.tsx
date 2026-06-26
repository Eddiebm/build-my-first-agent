"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json() as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }
    router.push("/auth/signin?reset=1");
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600 text-sm">Invalid reset link. Please request a new one.</p>
        <Link href="/auth/forgot-password" className="text-brand-600 font-semibold hover:underline text-sm mt-4 block">
          Request new link →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">New password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoFocus
          placeholder="Min 8 characters"
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 text-slate-900"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          placeholder="Repeat password"
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 text-slate-900"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm"
      >
        {loading ? "Saving…" : "Set new password →"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-slate-900">🤖 Build My First Agent</Link>
          <p className="text-slate-500 mt-2">Choose a new password</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <Suspense>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
