"use client";

import { LEVELS } from "@/lib/levels";

interface LevelsSidebarProps {
  currentLevel: number;
  completedSteps: number;
}

export default function LevelsSidebar({ currentLevel, completedSteps }: LevelsSidebarProps) {
  const unlockedLevel = Math.min(Math.ceil(completedSteps / 1.1) + 1, 9);

  return (
    <div className="h-full overflow-y-auto space-y-1">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 px-1">
        Learning Levels
      </p>
      {LEVELS.map((level) => {
        const unlocked = level.number <= unlockedLevel;
        const active = level.number === currentLevel;
        const done = level.number < currentLevel;

        return (
          <div
            key={level.number}
            className={`rounded-lg px-3 py-2.5 transition-all ${
              active
                ? "bg-brand-50 border border-brand-200"
                : done
                ? "bg-green-50 border border-green-200"
                : unlocked
                ? "bg-white border border-slate-200 hover:border-slate-300 cursor-pointer"
                : "bg-slate-50 border border-slate-100 opacity-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base flex-shrink-0">
                {done ? "✅" : active ? level.icon : unlocked ? level.icon : "🔒"}
              </span>
              <div className="min-w-0">
                <p
                  className={`text-xs font-bold truncate ${
                    active ? "text-brand-700" : done ? "text-green-700" : "text-slate-600"
                  }`}
                >
                  Level {level.number}: {level.title}
                </p>
                {active && (
                  <p className="text-xs text-slate-500 truncate mt-0.5">{level.tagline}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
