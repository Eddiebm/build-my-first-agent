export interface Level {
  number: number;
  title: string;
  tagline: string;
  whatYouAdd: string;
  whyItMatters: string;
  example: string;
  checkpoint: string;
  color: string;
  icon: string;
}

export const LEVELS: Level[] = [
  {
    number: 1,
    title: "Prompt-Only Assistant",
    tagline: "Give your agent its first instructions",
    whatYouAdd: "A system prompt — the set of rules your agent lives by",
    whyItMatters:
      "Every AI agent starts with a system prompt. It tells the AI who it is, what it does, and how it should behave. This is the most important step.",
    example:
      "You are Maya, a friendly leasing assistant for Sunrise Apartments. You answer questions about rent, maintenance requests, and lease renewals. You are warm, clear, and concise. You never discuss legal matters or make financial promises.",
    checkpoint: "Can your agent answer 3 test questions correctly and stay in character?",
    color: "bg-purple-100 border-purple-300 text-purple-800",
    icon: "💬",
  },
  {
    number: 2,
    title: "Structured Workflow",
    tagline: "Give your agent a step-by-step process",
    whatYouAdd:
      "A workflow — a sequence of steps the agent always follows instead of winging it",
    whyItMatters:
      "A workflow makes your agent predictable and professional. Instead of giving random answers, it follows the same reliable process every time.",
    example:
      "Step 1: Greet the tenant by name.\nStep 2: Identify their question or issue.\nStep 3: Check your knowledge base for the answer.\nStep 4: Give a clear, specific answer.\nStep 5: Ask if they need anything else.",
    checkpoint:
      "Does your agent follow the same reliable process for every type of request?",
    color: "bg-blue-100 border-blue-300 text-blue-800",
    icon: "🔄",
  },
  {
    number: 3,
    title: "Memory",
    tagline: "Let your agent remember who it's talking to",
    whatYouAdd:
      "Persistent context — the agent can recall past conversations and user details",
    whyItMatters:
      "Without memory, the agent treats every conversation as if it's meeting the person for the first time. Memory makes interactions feel personal and saves users from repeating themselves.",
    example:
      "Remember: John Smith is in Unit 4B. His lease ends March 31. He has asked about pet policy twice before. He prefers short answers.",
    checkpoint:
      "If a user says 'What did we talk about last time?', can your agent recall it?",
    color: "bg-green-100 border-green-300 text-green-800",
    icon: "🧠",
  },
  {
    number: 4,
    title: "Tools",
    tagline: "Give your agent the ability to look things up",
    whatYouAdd:
      "Tool calls — functions the agent can call to search, read files, or check data",
    whyItMatters:
      "A prompt-only agent is limited to what it knows. Tools let it fetch live information — current weather, today's calendar, a document you uploaded, or a database search.",
    example:
      "Tools available:\n• search_knowledge_base(query) → returns policy documents\n• get_tenant_info(unit) → returns lease details\n• create_maintenance_ticket(issue, unit) → submits request",
    checkpoint:
      "Can your agent use a tool to answer a question it couldn't answer from memory alone?",
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
    icon: "🔧",
  },
  {
    number: 5,
    title: "Database",
    tagline: "Connect your agent to real data",
    whatYouAdd:
      "A structured database — so the agent reads and writes to the same source of truth your business uses",
    whyItMatters:
      "Tools can search. A database connection means your agent is working with live, accurate, personalized data — not generic AI answers.",
    example:
      "SELECT * FROM tenants WHERE unit = '4B';\nINSERT INTO maintenance_requests (unit, issue, submitted_at) VALUES ('4B', 'AC not working', NOW());",
    checkpoint:
      "Can your agent retrieve and display a real record from your data without hallucinating?",
    color: "bg-orange-100 border-orange-300 text-orange-800",
    icon: "🗄️",
  },
  {
    number: 6,
    title: "Scheduler",
    tagline: "Let your agent work while you sleep",
    whatYouAdd: "A cron trigger — a schedule that wakes your agent automatically",
    whyItMatters:
      "Some tasks don't need a human to kick them off. A scheduler lets your agent send weekly digests, check for new opportunities, or follow up with customers automatically.",
    example:
      "Schedule: Every Monday at 8am\nTask: Search for new grant opportunities matching our profile\nOutput: Email digest with top 5 grants + deadlines",
    checkpoint:
      "Does your agent complete its scheduled task successfully and on time without you triggering it?",
    color: "bg-teal-100 border-teal-300 text-teal-800",
    icon: "⏰",
  },
  {
    number: 7,
    title: "Human Approval",
    tagline: "Add a human checkpoint before anything important",
    whatYouAdd:
      "An approval gate — the agent pauses and asks a human to review before taking action",
    whyItMatters:
      "AI agents can be wrong. Before sending an email, making a booking, or posting publicly, a human review step catches mistakes before they reach the outside world.",
    example:
      "The agent drafts: 'Dear John, your maintenance request has been received...'\nThen sends: 'Here's the draft reply for Unit 4B. Should I send it? [Approve] [Edit] [Reject]'",
    checkpoint:
      "Can you see and approve the agent's action before it happens, and does it wait for your response?",
    color: "bg-pink-100 border-pink-300 text-pink-800",
    icon: "✋",
  },
  {
    number: 8,
    title: "Testing & Evaluation",
    tagline: "Prove your agent works before going live",
    whatYouAdd:
      "A test suite — a set of standard questions with expected answers you run before every update",
    whyItMatters:
      "You can't ship what you haven't tested. A test suite gives you confidence and catches regressions when you change the agent later.",
    example:
      "Test 1: 'What is the pet policy?' → Expected: mentions $200 deposit, 2 pets max\nTest 2: 'Can I break my lease?' → Expected: says 60-day notice required, does NOT give legal advice\nTest 3: 'What's my rent?' → Expected: asks for unit number first",
    checkpoint:
      "Do all test cases pass? Did the agent fail any safety rules in your test prompts?",
    color: "bg-red-100 border-red-300 text-red-800",
    icon: "✅",
  },
  {
    number: 9,
    title: "Deployment",
    tagline: "Ship your agent to the real world",
    whatYouAdd: "A live deployment — your agent running on a URL, app, or platform people can use",
    whyItMatters:
      "An agent that only runs on your laptop helps no one. Deployment puts it where your users are: a website, a chatbot widget, a Slack channel, or an email inbox.",
    example:
      "Deploy options:\n• Add to website as a chat widget\n• Connect to WhatsApp Business\n• Embed in a Slack workspace\n• Email integration via webhook\n• Mobile app via API",
    checkpoint:
      "Can a real user interact with your agent from their own device without your help?",
    color: "bg-indigo-100 border-indigo-300 text-indigo-800",
    icon: "🚀",
  },
];
