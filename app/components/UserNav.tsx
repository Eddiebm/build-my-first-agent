"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  plan: "free" | "pro";
}

export default function UserNav() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d: { user: User | null }) => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (user === undefined) return <div className="w-32 h-8 bg-slate-100 rounded-lg animate-pulse" />;

  if (!user) {
    return (
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
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user.plan === "free" && (
        <Link
          href="/pricing"
          className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors"
        >
          Upgrade to Pro
        </Link>
      )}
      {user.plan === "pro" && (
        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
          Pro
        </span>
      )}
      <Link href="/dashboard" className="text-sm text-slate-600 hover:text-brand-600 font-medium transition-colors">
        Dashboard
      </Link>
      <button
        onClick={signOut}
        className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
