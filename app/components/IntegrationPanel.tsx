"use client";

import { useState } from "react";

export interface Integrations {
  leadCapture?: boolean;
  calendarUrl?: string;
}

interface IntegrationPanelProps {
  agentId: string | null;
  integrations: Integrations;
  onChange: (integrations: Integrations) => void;
  isPro: boolean;
}

export default function IntegrationPanel({
  agentId,
  integrations,
  onChange,
  isPro,
}: IntegrationPanelProps) {
  const [calInput, setCalInput] = useState(integrations.calendarUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(next: Integrations) {
    onChange(next);
    if (!agentId) return;
    setSaving(true);
    await fetch(`/api/agents/${agentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ integrations: next }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleLeadCapture() {
    if (!isPro) return;
    save({ ...integrations, leadCapture: !integrations.leadCapture });
  }

  function saveCalendar() {
    if (!isPro) return;
    save({ ...integrations, calendarUrl: calInput.trim() || undefined });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-bold text-slate-900 mb-1">Connect your agent to the real world</p>
        <p className="text-xs text-slate-500">
          Integrations let your agent collect leads and book meetings automatically.
          {!isPro && (
            <span className="text-brand-600 font-semibold"> Pro feature — <a href="/pricing" className="underline">upgrade to unlock</a>.</span>
          )}
        </p>
      </div>

      {/* Lead capture */}
      <div className={`rounded-xl border-2 p-4 transition-all ${
        integrations.leadCapture ? "border-brand-400 bg-brand-50" : "border-slate-200 bg-white"
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="text-sm font-bold text-slate-900">Lead Capture</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                When a visitor shares their name, email, or phone, your agent saves it automatically.
                You see all leads in your dashboard.
              </p>
            </div>
          </div>
          <button
            onClick={toggleLeadCapture}
            disabled={!isPro}
            className={`flex-shrink-0 w-11 h-6 rounded-full transition-all relative ${
              integrations.leadCapture ? "bg-brand-500" : "bg-slate-300"
            } ${!isPro ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
              integrations.leadCapture ? "left-5" : "left-0.5"
            }`} />
          </button>
        </div>
        {integrations.leadCapture && (
          <p className="text-xs text-brand-600 mt-3 font-medium">
            ✓ Active — your agent will ask for contact info when appropriate and save it to your leads list.
          </p>
        )}
        {!isPro && (
          <p className="text-xs text-slate-400 mt-2">Upgrade to Pro to enable</p>
        )}
      </div>

      {/* Calendar booking */}
      <div className={`rounded-xl border-2 p-4 transition-all ${
        integrations.calendarUrl ? "border-brand-400 bg-brand-50" : "border-slate-200 bg-white"
      }`}>
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-sm font-bold text-slate-900">Calendar Booking</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Paste your Calendly, Cal.com, or any booking link. Your agent will share it
              when someone wants to schedule a call or meeting.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="url"
            value={calInput}
            onChange={(e) => setCalInput(e.target.value)}
            placeholder="https://calendly.com/yourname"
            disabled={!isPro}
            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 placeholder-slate-400"
          />
          <button
            onClick={saveCalendar}
            disabled={!isPro || saving || calInput === (integrations.calendarUrl ?? "")}
            className="text-sm font-semibold bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            {saving ? "…" : saved ? "✓" : "Save"}
          </button>
        </div>
        {integrations.calendarUrl && (
          <p className="text-xs text-brand-600 mt-2 font-medium">
            ✓ Active — your agent will share your booking link when someone wants to schedule.
          </p>
        )}
        {calInput && integrations.calendarUrl && calInput !== integrations.calendarUrl && (
          <p className="text-xs text-amber-600 mt-1">Unsaved changes</p>
        )}
        {!isPro && (
          <p className="text-xs text-slate-400 mt-2">Upgrade to Pro to enable</p>
        )}
      </div>

      {(integrations.leadCapture || integrations.calendarUrl) && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700">
          <strong>What your agent will do:</strong>
          <ul className="mt-1 space-y-0.5 list-disc list-inside">
            {integrations.leadCapture && <li>Ask for contact info naturally and save it for you</li>}
            {integrations.calendarUrl && <li>Share your booking link when someone wants to meet</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
