"use client";

import { TOOL_REGISTRY } from "@/lib/tools";

const BUSINESS_TOOLS = ["web_search", "read_url"];

interface ToolPickerProps {
  selected: string[];
  onChange: (tools: string[]) => void;
  plan: "free" | "pro" | "business";
}

export default function ToolPicker({ selected, onChange, plan }: ToolPickerProps) {
  function toggle(name: string) {
    const needsBusiness = BUSINESS_TOOLS.includes(name);
    if (needsBusiness && plan !== "business") return;
    if (!needsBusiness && plan === "free") return;
    onChange(
      selected.includes(name)
        ? selected.filter((t) => t !== name)
        : [...selected, name]
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-bold text-slate-900 mb-1">Give your agent superpowers</p>
        <p className="text-xs text-slate-500">
          Tools let your agent take action — not just reply.
          {plan === "free" && (
            <span className="text-brand-600 font-semibold"> Pro feature — <a href="/pricing" className="underline">upgrade to unlock</a>.</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TOOL_REGISTRY.map((tool) => {
          const needsBusiness = BUSINESS_TOOLS.includes(tool.name);
          const locked = needsBusiness ? plan !== "business" : plan === "free";
          const active = selected.includes(tool.name);
          const badge = needsBusiness ? "Business" : "Pro";

          return (
            <button
              key={tool.name}
              onClick={() => toggle(tool.name)}
              disabled={locked}
              className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                active
                  ? "border-brand-400 bg-brand-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {locked && (
                <span className={`absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded font-medium ${
                  needsBusiness
                    ? "bg-slate-800 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}>
                  {badge}
                </span>
              )}
              <div className="text-xl mb-1">{tool.emoji}</div>
              <p className={`text-xs font-bold ${active ? "text-brand-700" : "text-slate-900"}`}>
                {tool.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{tool.description}</p>
              {active && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-xs text-green-600 font-medium">Enabled</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-brand-600 bg-brand-50 rounded-lg px-3 py-2">
          ✓ {selected.length} tool{selected.length > 1 ? "s" : ""} active — your agent can now{" "}
          {selected.includes("web_search") && "search the web, "}
          {selected.includes("read_url") && "read web pages, "}
          {selected.includes("get_datetime") && "check the date, "}
          {selected.includes("calculator") && "do math, "}
          and more.
        </p>
      )}
    </div>
  );
}
