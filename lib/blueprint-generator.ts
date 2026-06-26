export interface AgentBlueprint {
  name: string;
  mission: string;
  targetUser: string;
  inputs: string[];
  outputs: string[];
  toolsNeeded: string[];
  memoryNeeded: string;
  workflowSteps: string[];
  safetyRules: string[];
  approvalPoints: string[];
  successCriteria: string;
  testPrompts: string[];
  deploymentChecklist: string[];
  systemPrompt: string;
}

export interface WizardAnswers {
  job?: string;
  user?: string;
  problem?: string;
  output?: string;
  tools?: string;
  memory?: string;
  trigger?: string;
  approval?: string;
  never?: string;
  success?: string;
  [key: string]: string | undefined;
}

function deriveAgentName(answers: WizardAnswers): string {
  const job = (answers.job || "").toLowerCase();
  if (job.includes("email")) return "Inbox Assistant";
  if (job.includes("grant")) return "Grant Scout";
  if (job.includes("lease") || job.includes("tenant")) return "Leasing Assistant";
  if (job.includes("social") || job.includes("post") || job.includes("content")) return "Content Creator";
  if (job.includes("customer") || job.includes("faq") || job.includes("support")) return "Support Agent";
  if (job.includes("research") || job.includes("youtube") || job.includes("summar")) return "Research Assistant";
  if (job.includes("lead") || job.includes("prospect")) return "Lead Finder";
  if (job.includes("schedul") || job.includes("calendar") || job.includes("task")) return "Admin Assistant";
  return "My AI Agent";
}

function deriveTools(answers: WizardAnswers): string[] {
  const tools: string[] = [];
  const toolsText = (answers.tools || "").toLowerCase();
  if (toolsText.includes("no tool") || toolsText.includes("no — just")) return ["None — uses built-in knowledge only"];
  if (toolsText.includes("web") || toolsText.includes("search")) tools.push("Web search");
  if (toolsText.includes("email")) tools.push("Email read/write");
  if (toolsText.includes("calendar")) tools.push("Calendar access");
  if (toolsText.includes("pdf") || toolsText.includes("file") || toolsText.includes("document")) tools.push("Document reader");
  if (toolsText.includes("database") || toolsText.includes("crm")) tools.push("Database lookup");
  if (toolsText.includes("ticket") || toolsText.includes("mainten")) tools.push("Ticket creator");
  if (toolsText.includes("slack")) tools.push("Slack messaging");
  if (tools.length === 0 && !toolsText.includes("no")) tools.push("Web search (general)");
  return tools;
}

function buildWorkflowSteps(answers: WizardAnswers): string[] {
  const steps = ["Receive input from user"];
  if (answers.memory && !answers.memory.toLowerCase().includes("no")) {
    steps.push("Look up user context from memory");
  }
  const toolsText = (answers.tools || "").toLowerCase();
  if (!toolsText.includes("no tool") && !toolsText.includes("no — just")) {
    steps.push("Use relevant tools to gather information");
  }
  steps.push("Generate response based on inputs and instructions");
  const approvalText = (answers.approval || "").toLowerCase();
  if (!approvalText.includes("no —") && approvalText.length > 5) {
    steps.push("Present draft to human for approval");
    steps.push("Wait for approval before proceeding");
  }
  steps.push("Deliver output to user");
  if (answers.memory && !answers.memory.toLowerCase().includes("no")) {
    steps.push("Save key facts to memory for next session");
  }
  return steps;
}

function buildSafetyRules(answers: WizardAnswers): string[] {
  const rules: string[] = [];
  if (answers.never) {
    const parts = answers.never.split(/[.,;]/);
    parts.forEach((p) => {
      const trimmed = p.trim();
      if (trimmed.length > 5) rules.push(trimmed);
    });
  }
  rules.push("Always be transparent that you are an AI assistant");
  rules.push("When uncertain, say so — never guess and present it as fact");
  rules.push("Escalate to a human when a question falls outside your scope");
  return rules;
}

function buildTestPrompts(answers: WizardAnswers): string[] {
  const job = answers.job || "help with tasks";
  return [
    `Ask a routine question that your agent should handle perfectly.`,
    `Ask a question just outside the agent's scope — it should refuse politely and redirect.`,
    `Ask a question that would require a safety rule — does it hold the line?`,
    `Try a vague or incomplete input — does the agent ask a clarifying question?`,
    `Simulate a satisfied user: does the agent wrap up well and offer next steps?`,
  ].map((p, i) => `Test ${i + 1}: ${p}`);
}

function buildSystemPrompt(answers: WizardAnswers, name: string): string {
  const lines: string[] = [];
  lines.push(`You are ${name}, an AI assistant.`);
  if (answers.job) lines.push(`\nYour job: ${answers.job}.`);
  if (answers.user) lines.push(`\nYou are speaking with: ${answers.user}.`);
  if (answers.problem) lines.push(`\nThe problem you solve: ${answers.problem}.`);
  if (answers.output)
    lines.push(
      `\nOutput format: Always respond with ${answers.output}. Be concise and specific.`
    );

  lines.push(`\n## How you work`);
  buildWorkflowSteps(answers).forEach((s, i) => lines.push(`${i + 1}. ${s}`));

  lines.push(`\n## Safety rules — you must always follow these:`);
  buildSafetyRules(answers).forEach((r) => lines.push(`- ${r}`));

  if (answers.approval && !answers.approval.toLowerCase().startsWith("no —")) {
    lines.push(
      `\n## Approval: Before taking any significant action, describe what you plan to do and ask for confirmation.`
    );
  }

  lines.push(
    `\n## Tone: Be helpful, clear, and patient. Avoid jargon. If the user seems confused, slow down and offer simpler options.`
  );

  return lines.join("\n");
}

export function generateBlueprint(answers: WizardAnswers): Partial<AgentBlueprint> {
  const name = deriveAgentName(answers);
  const tools = deriveTools(answers);

  return {
    name,
    mission: answers.job || "",
    targetUser: answers.user || "",
    inputs: ["User message / question", answers.trigger?.includes("schedule") ? "Scheduled trigger" : "On-demand message"].filter(Boolean) as string[],
    outputs: [answers.output || "A helpful, accurate response"],
    toolsNeeded: tools,
    memoryNeeded:
      answers.memory && !answers.memory.toLowerCase().includes("no")
        ? answers.memory
        : "None — each session is independent",
    workflowSteps: buildWorkflowSteps(answers),
    safetyRules: buildSafetyRules(answers),
    approvalPoints:
      answers.approval && !answers.approval.toLowerCase().startsWith("no —")
        ? [answers.approval]
        : ["None — agent acts autonomously within safety rules"],
    successCriteria: answers.success || "",
    testPrompts: buildTestPrompts(answers),
    deploymentChecklist: [
      "System prompt reviewed and tested",
      "All safety rules verified with test prompts",
      "Edge cases handled (vague input, off-topic questions)",
      "Approval workflow confirmed (if applicable)",
      "API key secured in environment variables",
      "Rate limiting configured",
      "Error messages are friendly (no raw error dumps to users)",
      "Monitored for first 48 hours after launch",
    ],
    systemPrompt: buildSystemPrompt(answers, name),
  };
}

export function exportAsMarkdown(blueprint: Partial<AgentBlueprint>): string {
  return `# ${blueprint.name || "My Agent"} — Agent Blueprint

## Mission
${blueprint.mission}

## Target User
${blueprint.targetUser}

## Inputs
${(blueprint.inputs || []).map((i) => `- ${i}`).join("\n")}

## Outputs
${(blueprint.outputs || []).map((o) => `- ${o}`).join("\n")}

## Tools Needed
${(blueprint.toolsNeeded || []).map((t) => `- ${t}`).join("\n")}

## Memory
${blueprint.memoryNeeded}

## Workflow Steps
${(blueprint.workflowSteps || []).map((s, i) => `${i + 1}. ${s}`).join("\n")}

## Safety Rules
${(blueprint.safetyRules || []).map((r) => `- ${r}`).join("\n")}

## Human Approval Points
${(blueprint.approvalPoints || []).map((a) => `- ${a}`).join("\n")}

## Success Criteria
${blueprint.successCriteria}

## Test Prompts
${(blueprint.testPrompts || []).map((t) => `- ${t}`).join("\n")}

## Deployment Checklist
${(blueprint.deploymentChecklist || []).map((d) => `- [ ] ${d}`).join("\n")}

## System Prompt
\`\`\`
${blueprint.systemPrompt}
\`\`\`
`;
}

export function exportAsJSON(blueprint: Partial<AgentBlueprint>): string {
  return JSON.stringify(blueprint, null, 2);
}
