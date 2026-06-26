"use client";

import { useState } from "react";

export default function ForwardingInstructions({ phoneNumber }: { phoneNumber: string }) {
  const [open, setOpen] = useState(false);

  const carriers = [
    { name: "AT&T", code: `*61*${phoneNumber}*11*20#`, note: "Forwards when unanswered" },
    { name: "Verizon", code: `*71${phoneNumber}`, note: "Conditional forward" },
    { name: "T-Mobile", code: `**61*${phoneNumber}**20#`, note: "Forwards when unanswered" },
  ];

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-purple-600 hover:text-purple-800 font-semibold underline underline-offset-2"
      >
        {open ? "Hide setup instructions" : "How to forward calls →"}
      </button>

      {open && (
        <div className="mt-3 bg-white border border-purple-200 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-700 mb-1">Set up call forwarding on your business phone</p>
          <p className="text-xs text-slate-500 mb-4">
            When you don't answer, calls automatically go to your AI employee. Takes 30 seconds to set up.
          </p>

          <div className="space-y-3">
            {carriers.map((c) => (
              <div key={c.name} className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs font-bold text-slate-700 mb-1">{c.name} — {c.note}</p>
                <p className="text-xs text-slate-500 mb-2">Open your phone dialer and tap:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-sm font-mono text-slate-900 tracking-wide">
                    {c.code}
                  </code>
                  <button
                    onClick={() => navigator.clipboard?.writeText(c.code)}
                    className="text-xs text-brand-600 hover:text-brand-800 font-semibold px-2 py-1.5 border border-brand-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Your current business number stays the same — this just adds a backup when you don't pick up.
          </p>
        </div>
      )}
    </div>
  );
}
