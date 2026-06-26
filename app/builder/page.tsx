"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { WIZARD_QUESTIONS, isVagueAnswer } from "@/lib/wizard-questions";
import { LEVELS } from "@/lib/levels";
import { generateBlueprint, type WizardAnswers, type AgentBlueprint } from "@/lib/blueprint-generator";
import { TEMPLATES } from "@/lib/templates";
import BlueprintPanel from "@/app/components/BlueprintPanel";
import LevelsSidebar from "@/app/components/LevelsSidebar";
import ChatWindow from "@/app/components/ChatWindow";
import PublishPanel from "@/app/components/PublishPanel";
import ToolPicker from "@/app/components/ToolPicker";
import IntegrationPanel, { type Integrations } from "@/app/components/IntegrationPanel";

const STORAGE_KEY = "bmfa_session";

type Phase = "wizard" | "levels" | "test";
type TestTab = "chat" | "tools" | "integrate" | "publish";

interface UserInfo {
  email: string;
  plan: "free" | "pro" | "business";
}

function BuilderContent() {
  const searchParams = useSearchParams();
  const agentParam = searchParams.get("agent");

  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [needsClarification, setNeedsClarification] = useState(false);
  const [blueprint, setBlueprint] = useState<Partial<AgentBlueprint>>({});
  const [phase, setPhase] = useState<Phase>("wizard");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [showExampleFor, setShowExampleFor] = useState<number | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [savedAgentId, setSavedAgentId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isPublished, setIsPublished] = useState(false);
  const [testTab, setTestTab] = useState<TestTab>("chat");
  const [agentTools, setAgentTools] = useState<string[]>([]);
  const [integrations, setIntegrations] = useState<Integrations>({});

  // Fetch session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d: { user: UserInfo | null }) => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  // Hydrate: load from saved agent URL param or localStorage
  useEffect(() => {
    if (agentParam) {
      fetch(`/api/agents/${agentParam}`)
        .then((r) => r.json())
        .then((d: { agent?: { id: string; name: string; answers: WizardAnswers; blueprint: Partial<AgentBlueprint> } }) => {
          if (d.agent) {
            setSavedAgentId(d.agent.id);
            setAnswers(d.agent.answers);
            setBlueprint(d.agent.blueprint);
            setCompletedSteps(Object.keys(d.agent.answers).length);
            setIsPublished((d.agent as unknown as { published?: boolean }).published ?? false);
            setPhase("levels");
          }
        })
        .catch(() => {});
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          answers: WizardAnswers;
          currentStep: number;
          blueprint: Partial<AgentBlueprint>;
          phase: Phase;
          currentLevel: number;
          completedSteps: number;
        };
        setAnswers(parsed.answers ?? {});
        setCurrentStep(parsed.currentStep ?? 0);
        setBlueprint(parsed.blueprint ?? {});
        setPhase(parsed.phase ?? "wizard");
        setCurrentLevel(parsed.currentLevel ?? 1);
        setCompletedSteps(parsed.completedSteps ?? 0);
      } catch {}
    }

    const templateId = localStorage.getItem("bmfa_template");
    if (templateId) {
      const tpl = TEMPLATES.find((t) => t.id === templateId);
      if (tpl) {
        localStorage.removeItem("bmfa_template");
        setAnswers(tpl.answers as WizardAnswers);
        const done = Object.keys(tpl.answers).length;
        setCompletedSteps(done);
        setCurrentStep(Math.min(done, WIZARD_QUESTIONS.length - 1));
        const bp = generateBlueprint(tpl.answers as WizardAnswers);
        setBlueprint(bp);
        if (done >= WIZARD_QUESTIONS.length) setPhase("levels");
      }
    }
  }, [agentParam]);

  // Persist to localStorage
  useEffect(() => {
    if (agentParam) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, currentStep, blueprint, phase, currentLevel, completedSteps })
    );
  }, [answers, currentStep, blueprint, phase, currentLevel, completedSteps, agentParam]);

  async function saveAgent() {
    if (!user) {
      window.location.href = "/auth/signup?next=/builder";
      return;
    }
    setSaveStatus("saving");
    const method = savedAgentId ? "PUT" : "POST";
    const url = savedAgentId ? `/api/agents/${savedAgentId}` : "/api/agents";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: blueprint.name ?? "My Agent", answers, blueprint, tools: agentTools, integrations }),
    });
    if (res.status === 403) {
      // Free plan limit
      setSaveStatus("error");
      window.location.href = "/pricing";
      return;
    }
    if (res.ok) {
      const data = await res.json() as { agent?: { id: string } };
      if (data.agent?.id) setSavedAgentId(data.agent.id);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
    }
  }

  const question = WIZARD_QUESTIONS[currentStep];
  const isLastStep = currentStep >= WIZARD_QUESTIONS.length - 1;
  const isPro = user?.plan === "pro" || user?.plan === "business";

  function submitAnswer() {
    const val = inputValue.trim();
    if (!val) return;

    if (isVagueAnswer(val, question.clarifyingTriggers) && !needsClarification) {
      setNeedsClarification(true);
      return;
    }

    const newAnswers = { ...answers, [question.id]: val };
    setAnswers(newAnswers);
    const newCompleted = Math.max(completedSteps, currentStep + 1);
    setCompletedSteps(newCompleted);
    const newBlueprint = generateBlueprint(newAnswers);
    setBlueprint(newBlueprint);
    setInputValue("");
    setNeedsClarification(false);

    if (isLastStep) {
      setPhase("levels");
      setCurrentLevel(1);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setInputValue(answers[WIZARD_QUESTIONS[currentStep - 1].id] ?? "");
      setNeedsClarification(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  }

  function resetSession() {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setCurrentStep(0);
    setInputValue("");
    setNeedsClarification(false);
    setBlueprint({});
    setPhase("wizard");
    setCurrentLevel(1);
    setCompletedSteps(0);
    setSavedAgentId(null);
    setSaveStatus("idle");
  }

  const level = LEVELS[currentLevel - 1];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-slate-900 hover:text-brand-600 text-sm transition-colors">
            ← Build My First Agent
          </Link>
          <div className="flex items-center gap-3">
            {phase !== "wizard" && (
              <button
                onClick={() => setPhase("wizard")}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Edit Answers
              </button>
            )}
            {phase === "levels" && (
              <button
                onClick={() => setPhase("test")}
                className="text-xs font-semibold bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Test My Agent →
              </button>
            )}
            {completedSteps > 0 && (
              <button
                onClick={saveAgent}
                disabled={saveStatus === "saving"}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  saveStatus === "saved"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200"
                }`}
              >
                {saveStatus === "saving"
                  ? "Saving…"
                  : saveStatus === "saved"
                  ? "✓ Saved"
                  : user
                  ? savedAgentId
                    ? "Update"
                    : "Save Employee"
                  : "Sign in to Save"}
              </button>
            )}
            <button
              onClick={resetSession}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      </header>

      {/* 3-column layout */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[200px_1fr_280px] gap-6">
        {/* Left: Levels sidebar */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-xl border border-slate-200 p-4 h-full">
            <LevelsSidebar currentLevel={currentLevel} completedSteps={completedSteps} />
          </div>
        </aside>

        {/* Center: main content */}
        <main>
          {/* === WIZARD PHASE === */}
          {phase === "wizard" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 animate-fade-in">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Question {currentStep + 1} of {WIZARD_QUESTIONS.length}</span>
                  <span>{Math.round(((currentStep) / WIZARD_QUESTIONS.length) * 100)}% complete</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep) / WIZARD_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                  {needsClarification ? question.clarifyingQuestion : question.question}
                </h2>
                <p className="text-slate-500 text-base leading-relaxed">{question.hint}</p>
              </div>

              {/* Input */}
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKey}
                placeholder={question.placeholder}
                rows={3}
                className="w-full border-2 border-slate-200 focus:border-brand-400 focus:outline-none rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-base resize-none transition-colors mb-4"
                autoFocus
              />

              {/* Examples */}
              <div className="mb-6">
                <button
                  onClick={() => setShowExampleFor(showExampleFor === currentStep ? null : currentStep)}
                  className="text-sm text-slate-400 hover:text-brand-600 font-medium transition-colors"
                >
                  {showExampleFor === currentStep ? "▲ Hide examples" : "▼ Show example answers"}
                </button>
                {showExampleFor === currentStep && (
                  <div className="mt-3 space-y-2 animate-fade-in">
                    {question.exampleAnswers.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => setInputValue(ex)}
                        className="block w-full text-left text-sm text-slate-600 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 hover:border-brand-200 rounded-lg px-4 py-2.5 transition-all"
                      >
                        &ldquo;{ex}&rdquo;
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={submitAnswer}
                  disabled={!inputValue.trim()}
                  className="flex-1 sm:flex-none bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-2.5 rounded-xl transition-all text-sm"
                >
                  {isLastStep ? "Generate My Blueprint →" : "Continue →"}
                </button>
              </div>

              {/* Previous answers summary */}
              {completedSteps > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                    Your answers so far
                  </p>
                  <div className="space-y-2">
                    {WIZARD_QUESTIONS.slice(0, completedSteps).map((q) => {
                      const ans = answers[q.id];
                      if (!ans) return null;
                      return (
                        <div key={q.id} className="flex gap-3 text-sm">
                          <span className="text-slate-400 flex-shrink-0 font-medium">Q{q.step}:</span>
                          <span className="text-slate-600 line-clamp-1">{ans}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === LEVELS PHASE === */}
          {phase === "levels" && (
            <div className="space-y-6 animate-fade-in">
              {/* Level nav */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 overflow-x-auto">
                {LEVELS.map((l) => (
                  <button
                    key={l.number}
                    onClick={() => setCurrentLevel(l.number)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      l.number === currentLevel
                        ? "bg-brand-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {l.icon} L{l.number}
                  </button>
                ))}
              </div>

              {/* Level content */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-4 border ${level.color}`}>
                  {level.icon} Level {level.number}: {level.title}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{level.tagline}</h2>
                <p className="text-slate-500 mb-6 text-base leading-relaxed">
                  <strong className="text-slate-700">What you&apos;re adding:</strong> {level.whatYouAdd}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Why it matters</p>
                    <p className="text-sm text-blue-900 leading-relaxed">{level.whyItMatters}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Example</p>
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">{level.example}</pre>
                  </div>
                </div>

                {/* Checkpoint */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">✅ Checkpoint</p>
                  <p className="text-sm text-green-800 font-medium">{level.checkpoint}</p>
                </div>

                {/* For your agent */}
                {blueprint.name && level.number === 1 && blueprint.systemPrompt && (
                  <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-brand-600 uppercase tracking-wide mb-2">
                      🤖 Your {blueprint.name}&apos;s System Prompt (Level 1)
                    </p>
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-mono bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto">
                      {blueprint.systemPrompt}
                    </pre>
                  </div>
                )}

                {/* Level nav buttons */}
                <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentLevel((l) => Math.max(1, l - 1))}
                    disabled={currentLevel === 1}
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ← Previous Level
                  </button>
                  {currentLevel < LEVELS.length ? (
                    <button
                      onClick={() => setCurrentLevel((l) => Math.min(9, l + 1))}
                      className="text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-lg transition-all"
                    >
                      Next Level →
                    </button>
                  ) : (
                    <button
                      onClick={() => setPhase("test")}
                      className="text-sm font-bold bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all"
                    >
                      Test My Agent 🚀
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === TEST PHASE === */}
          {phase === "test" && (
            <div className="space-y-4 animate-fade-in">
              {/* Tab bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-1 flex gap-1">
                {(["chat", "tools", "integrate", "publish"] as TestTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTestTab(tab)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      testTab === tab
                        ? "bg-brand-500 text-white"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab === "chat" ? "💬 Test" : tab === "tools" ? "🔧 Tools" : tab === "integrate" ? "🔗 Connect" : "🚀 Publish"}
                  </button>
                ))}
              </div>

              {/* Chat tab */}
              {testTab === "chat" && (
                <>
                  {isPro ? (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col" style={{ height: "480px" }}>
                      <ChatWindow
                        systemPrompt={blueprint.systemPrompt ?? "You are a helpful AI assistant."}
                        agentName={blueprint.name ?? "My Agent"}
                      />
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                      <div className="text-4xl mb-3">🔒</div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Live AI chat is a Pro feature</h3>
                      <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                        Upgrade to Pro to test your employee with live AI responses.
                      </p>
                      <Link
                        href="/pricing"
                        className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                      >
                        Upgrade to Pro — $15/mo →
                      </Link>
                    </div>
                  )}

                  {blueprint.testPrompts && blueprint.testPrompts.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <p className="text-sm font-bold text-slate-700 mb-3">📋 Suggested test prompts</p>
                      <div className="space-y-2">
                        {blueprint.testPrompts.map((tp, i) => (
                          <div key={i} className="flex gap-3 text-sm">
                            <span className="text-brand-400 font-bold flex-shrink-0">{i + 1}.</span>
                            <span className="text-slate-600">{tp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Tools tab */}
              {testTab === "tools" && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <ToolPicker
                    selected={agentTools}
                    onChange={(tools) => {
                      setAgentTools(tools);
                      // Auto-save if already saved
                      if (savedAgentId) {
                        fetch(`/api/agents/${savedAgentId}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ tools }),
                        }).catch(() => {});
                      }
                    }}
                    plan={user?.plan ?? "free"}
                  />
                </div>
              )}

              {/* Integrations tab */}
              {testTab === "integrate" && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <IntegrationPanel
                    agentId={savedAgentId}
                    integrations={integrations}
                    onChange={setIntegrations}
                    isPro={isPro}
                  />
                </div>
              )}

              {/* Publish tab */}
              {testTab === "publish" && (
                <div className="space-y-4">
                  <PublishPanel
                    agentId={savedAgentId}
                    agentName={blueprint.name ?? "My Agent"}
                    isPublished={isPublished}
                    isPro={isPro}
                    isLoggedIn={!!user}
                    onPublishChange={setIsPublished}
                  />

                  {blueprint.deploymentChecklist && (
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <p className="text-sm font-bold text-slate-700 mb-3">✅ Pre-launch checklist</p>
                      <div className="space-y-2">
                        {blueprint.deploymentChecklist.map((item, i) => (
                          <label key={i} className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-brand-500 focus:ring-brand-400 flex-shrink-0" />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right: Blueprint panel */}
        <aside>
          <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
            <BlueprintPanel
              blueprint={blueprint}
              answers={answers}
              completedSteps={completedSteps}
              isPro={isPro}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense>
      <BuilderContent />
    </Suspense>
  );
}
