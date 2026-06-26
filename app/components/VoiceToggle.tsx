"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VoiceToggle({
  agentId,
  enabled,
}: {
  agentId: string;
  enabled: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function toggle() {
    if (loading) return;
    if (enabled) {
      if (!confirm("Disable voice? This will release your phone number.")) return;
    }
    setLoading(true);
    setError("");

    const endpoint = enabled ? "/api/voice/deprovision" : "/api/voice/provision";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      const data = await res.json() as { error?: string; upgradeRequired?: boolean; phoneNumber?: string };
      if (!res.ok) {
        if (data.upgradeRequired) {
          window.location.href = "/pricing";
          return;
        }
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — please try again");
      setLoading(false);
    }
  }

  if (enabled) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className="text-xs text-purple-500 hover:text-red-500 font-semibold transition-colors disabled:opacity-50"
      >
        {loading ? "…" : "Disable"}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={toggle}
        disabled={loading}
        className="w-full text-center text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-lg transition-colors border border-purple-200 disabled:opacity-50 flex items-center justify-center gap-1.5"
      >
        {loading ? (
          <>
            <span className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            Provisioning…
          </>
        ) : (
          <>📞 Enable Voice Calls</>
        )}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
