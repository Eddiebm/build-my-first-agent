"use client";

import Link from "next/link";
import type { AgentBlueprint, WizardAnswers } from "@/lib/blueprint-generator";
import { exportAsMarkdown, exportAsJSON } from "@/lib/blueprint-generator";

interface BlueprintPanelProps {
  blueprint: Partial<AgentBlueprint>;
  answers: WizardAnswers;
  completedSteps: number;
  isPro?: boolean;
}

function download(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

export default function BlueprintPanel({ blueprint, completedSteps, isPro = false }: BlueprintPanelProps) {
  const hasContent = completedSteps > 0;

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
          Agent Blueprint
        </h3>
        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {completedSteps}/10 steps
        </span>
      </div>

      {!hasContent && (
        <div className="text-center py-12 text-slate-400">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm">Your blueprint will appear here as you answer questions.</p>
        </div>
      )}

      {hasContent && (
        <div className="space-y-3 text-sm flex-1">
          {blueprint.name && (
            <BlueprintSection label="Agent Name" icon="🤖">
              <p className="font-bold text-slate-900 text-base">{blueprint.name}</p>
            </BlueprintSection>
          )}

          {blueprint.mission && (
            <BlueprintSection label="Mission" icon="🎯">
              <p className="text-slate-700">{blueprint.mission}</p>
            </BlueprintSection>
          )}

          {blueprint.targetUser && (
            <BlueprintSection label="Serves" icon="👤">
              <p className="text-slate-700">{blueprint.targetUser}</p>
            </BlueprintSection>
          )}

          {blueprint.toolsNeeded && blueprint.toolsNeeded.length > 0 && (
            <BlueprintSection label="Tools" icon="🔧">
              <ul className="space-y-1">
                {blueprint.toolsNeeded.map((t) => (
                  <li key={t} className="text-slate-700 flex gap-2">
                    <span className="text-slate-400">•</span> {t}
                  </li>
                ))}
              </ul>
            </BlueprintSection>
          )}

          {blueprint.memoryNeeded && (
            <BlueprintSection label="Memory" icon="🧠">
              <p className="text-slate-700">{blueprint.memoryNeeded}</p>
            </BlueprintSection>
          )}

          {blueprint.workflowSteps && blueprint.workflowSteps.length > 0 && (
            <BlueprintSection label="Workflow" icon="🔄">
              <ol className="space-y-1">
                {blueprint.workflowSteps.map((s, i) => (
                  <li key={i} className="text-slate-700 flex gap-2">
                    <span className="text-brand-500 font-bold flex-shrink-0">{i + 1}.</span> {s}
                  </li>
                ))}
              </ol>
            </BlueprintSection>
          )}

          {blueprint.safetyRules && blueprint.safetyRules.length > 0 && (
            <BlueprintSection label="Safety Rules" icon="🛡️">
              <ul className="space-y-1">
                {blueprint.safetyRules.slice(0, 4).map((r, i) => (
                  <li key={i} className="text-slate-700 flex gap-2">
                    <span className="text-red-400">✗</span> {r}
                  </li>
                ))}
              </ul>
            </BlueprintSection>
          )}

          {blueprint.successCriteria && (
            <BlueprintSection label="Success" icon="✅">
              <p className="text-slate-700">{blueprint.successCriteria}</p>
            </BlueprintSection>
          )}
        </div>
      )}

      {/* Export buttons */}
      {completedSteps >= 10 && (
        <div className="border-t border-slate-200 pt-4 flex-shrink-0 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Export {!isPro && <span className="text-brand-500 ml-1">· Pro</span>}
          </p>
          {isPro ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  download(exportAsMarkdown(blueprint), `${blueprint.name ?? "agent"}-blueprint.md`)
                }
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
              >
                📄 Markdown
              </button>
              <button
                onClick={() =>
                  download(exportAsJSON(blueprint), `${blueprint.name ?? "agent"}-config.json`)
                }
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
              >
                🗂️ JSON
              </button>
              <button
                onClick={() =>
                  download(blueprint.systemPrompt ?? "", `${blueprint.name ?? "agent"}-prompt.txt`)
                }
                className="text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 px-3 py-2 rounded-lg transition-colors col-span-2"
              >
                🤖 Download System Prompt
              </button>
            </div>
          ) : (
            <div className="bg-brand-50 border border-brand-100 rounded-lg p-3 text-center">
              <p className="text-xs text-brand-700 mb-2 font-medium">
                Export is a Pro feature
              </p>
              <Link
                href="/pricing"
                className="text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 px-3 py-1.5 rounded-lg transition-colors inline-block"
              >
                Upgrade to Pro →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BlueprintSection({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 animate-fade-in">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
        {icon} {label}
      </p>
      {children}
    </div>
  );
}
