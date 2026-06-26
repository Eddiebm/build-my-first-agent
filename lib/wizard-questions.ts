export interface WizardQuestion {
  id: string;
  step: number;
  question: string;
  hint: string;
  placeholder: string;
  exampleAnswers: string[];
  clarifyingTriggers: string[];
  clarifyingQuestion: string;
}

export const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: "job",
    step: 1,
    question: "What job should your agent do?",
    hint: "Describe the main task your agent will handle — the one thing it should be great at.",
    placeholder: "e.g. Answer customer questions about my products",
    exampleAnswers: [
      "Answer questions from tenants about lease renewals",
      "Research grant opportunities for nonprofits",
      "Write social media posts for my bakery",
    ],
    clarifyingTriggers: ["help", "stuff", "things", "stuff", "assist", "do things"],
    clarifyingQuestion:
      "That's a great start! Can you be more specific? What exact task would you love to hand off to an AI today?",
  },
  {
    id: "user",
    step: 2,
    question: "Who will use this agent?",
    hint: "Think about the person on the other end. Are they a customer, a teammate, you yourself?",
    placeholder: "e.g. My customers who need quick answers after hours",
    exampleAnswers: [
      "My real estate tenants",
      "Me — I want it to handle my email inbox",
      "Teachers at our school who need lesson ideas",
    ],
    clarifyingTriggers: ["people", "anyone", "users", "everyone", "somebody"],
    clarifyingQuestion:
      "Who specifically? For example: a customer calling after hours, a colleague needing a quick report, or just you personally?",
  },
  {
    id: "problem",
    step: 3,
    question: "What problem does it solve?",
    hint: "What is slow, annoying, or repetitive right now that your agent will fix?",
    placeholder: "e.g. I spend 2 hours a day answering the same questions",
    exampleAnswers: [
      "Tenants call me at midnight with lease questions I've answered 100 times",
      "I miss grant deadlines because I don't have time to search for them",
      "I stare at a blank page for an hour before writing any post",
    ],
    clarifyingTriggers: ["problem", "issue", "help"],
    clarifyingQuestion:
      "What specifically takes too long, costs too much, or keeps going wrong right now?",
  },
  {
    id: "output",
    step: 4,
    question: "What should the output look like?",
    hint: "What does a 'done' answer from your agent look like? A short reply? A full report? A list?",
    placeholder: "e.g. A friendly 2–3 sentence reply with the lease policy",
    exampleAnswers: [
      "A bullet-point list of 3 grants with deadlines and links",
      "A 150-word Instagram caption with 5 hashtags",
      "A one-page summary with action items at the top",
    ],
    clarifyingTriggers: ["answer", "response", "something", "output", "result"],
    clarifyingQuestion:
      "How long or detailed should the answer be? Should it be a list, a paragraph, a table, or something else?",
  },
  {
    id: "tools",
    step: 5,
    question: "Should your agent use any tools?",
    hint: "Tools let an agent search the web, read files, send emails, or check a calendar. Or it can work from knowledge alone.",
    placeholder: "e.g. Yes — search the web and send a summary email",
    exampleAnswers: [
      "No tools — just use its built-in knowledge",
      "Yes — search the web for current grant listings",
      "Yes — read a PDF I upload and answer questions about it",
    ],
    clarifyingTriggers: ["maybe", "not sure", "don't know", "unsure"],
    clarifyingQuestion:
      "Does your agent need to look something up, read a document, send a message, or take any action outside of just answering?",
  },
  {
    id: "memory",
    step: 6,
    question: "Should it remember past conversations?",
    hint: "Memory lets the agent remember who it talked to and what was said before, so it feels like a real assistant, not a stranger every time.",
    placeholder: "e.g. Yes — remember each tenant's name and their lease details",
    exampleAnswers: [
      "No memory needed — each session starts fresh",
      "Yes — remember customer preferences",
      "Yes — track which grants I've already applied for",
    ],
    clarifyingTriggers: ["maybe", "not sure", "depends"],
    clarifyingQuestion:
      "Will people use this agent more than once and expect it to remember them, or is each conversation completely fresh?",
  },
  {
    id: "trigger",
    step: 7,
    question: "How should the agent run — on demand or on a schedule?",
    hint: "On demand means someone asks it a question. On a schedule means it wakes up and does something automatically, like sending a weekly report.",
    placeholder: "e.g. On demand — users message it when they have a question",
    exampleAnswers: [
      "On demand — when someone sends it a message",
      "On a schedule — every Monday morning send a digest",
      "Both — automatically scan new emails, but only reply when I approve",
    ],
    clarifyingTriggers: ["both", "not sure", "either"],
    clarifyingQuestion:
      "Should it wait to be asked, or should it wake up and take action on its own at a set time?",
  },
  {
    id: "approval",
    step: 8,
    question: "Should it ask your permission before doing anything?",
    hint: "For tasks that could affect people (sending emails, posting on social media), it's smart to have a human check first.",
    placeholder: "e.g. Yes — show me the draft before it sends anything",
    exampleAnswers: [
      "Yes — always show me before sending",
      "No — trust it to handle routine questions automatically",
      "Only for anything that costs money or sends external messages",
    ],
    clarifyingTriggers: ["depends", "sometimes", "it depends"],
    clarifyingQuestion:
      "What kinds of actions would you want to review before the agent does them?",
  },
  {
    id: "never",
    step: 9,
    question: "What should this agent NEVER do?",
    hint: "Safety rules keep your agent on track. Be specific about off-limits topics, actions, or tones.",
    placeholder: "e.g. Never give legal advice, never share tenant personal data",
    exampleAnswers: [
      "Never promise discounts or make commitments I haven't approved",
      "Never share medical advice — always say 'consult a doctor'",
      "Never post anything political or controversial",
    ],
    clarifyingTriggers: ["nothing", "n/a", "not sure", "no idea"],
    clarifyingQuestion:
      "Think about what could go wrong. What would be embarrassing, harmful, or legally risky if the agent said or did it?",
  },
  {
    id: "success",
    step: 10,
    question: "How will you know it worked?",
    hint: "Define what success looks like so you can test your agent before going live.",
    placeholder: "e.g. A tenant gets the correct lease renewal policy in under 10 seconds",
    exampleAnswers: [
      "A customer gets a helpful answer without needing to call me",
      "I receive a weekly grant list with at least 3 new opportunities",
      "My post gets written in 30 seconds and sounds like me",
    ],
    clarifyingTriggers: ["works", "good", "helpful", "better"],
    clarifyingQuestion:
      "Picture the agent working perfectly. What would you see, hear, or measure that tells you it's doing its job?",
  },
];

export function isVagueAnswer(answer: string, triggers: string[]): boolean {
  const lower = answer.toLowerCase().trim();
  if (lower.length < 10) return true;
  return triggers.some((t) => lower === t || lower.startsWith(t + " ") || lower.endsWith(" " + t));
}
