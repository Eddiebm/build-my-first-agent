"use client";

import { useState } from "react";

export default function PhoneField({ currentPhone }: { currentPhone?: string | null }) {
  const [phone, setPhone] = useState(currentPhone ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function save() {
    setStatus("saving");
    setError("");
    const res = await fetch("/api/account/phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json() as { ok?: boolean; error?: string; phone?: string };
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setStatus("error");
    } else {
      setPhone(data.phone ?? phone);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
        Your mobile number
      </label>
      <p className="text-xs text-slate-400 mb-3">
        We'll text you here when an employee captures a new lead from a call.
      </p>
      <div className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setStatus("idle"); }}
          placeholder="404-555-0100"
          className="flex-1 border border-slate-200 focus:border-brand-400 focus:outline-none rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors"
        />
        <button
          onClick={save}
          disabled={status === "saving" || !phone.trim()}
          className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {status === "saving" ? "Saving…" : status === "saved" ? "✓ Saved" : "Save"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
