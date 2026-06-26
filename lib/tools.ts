export interface ToolDefinition {
  name: string;
  label: string;
  emoji: string;
  description: string;
  requiresEnv?: string;
  openaiSchema: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: object;
    };
  };
  execute(args: Record<string, string>): Promise<string>;
}

export const TOOL_REGISTRY: ToolDefinition[] = [
  {
    name: "web_search",
    label: "Web Search",
    emoji: "🔍",
    description: "Search the web for current information, news, prices, and facts.",
    requiresEnv: "SERPER_API_KEY",
    openaiSchema: {
      type: "function",
      function: {
        name: "web_search",
        description: "Search the web for current information. Use this when you need up-to-date facts, news, prices, or anything that may have changed recently.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "The search query" },
          },
          required: ["query"],
        },
      },
    },
    async execute({ query }) {
      const key = process.env.SERPER_API_KEY;
      if (!key) return "Web search is not configured.";
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
        body: JSON.stringify({ q: query, num: 5 }),
      });
      if (!res.ok) return `Search failed (${res.status})`;
      const data = await res.json() as {
        organic?: Array<{ title: string; snippet: string; link: string }>;
        answerBox?: { answer?: string; snippet?: string };
      };
      const parts: string[] = [];
      if (data.answerBox?.answer) parts.push(`Answer: ${data.answerBox.answer}`);
      if (data.answerBox?.snippet) parts.push(`Summary: ${data.answerBox.snippet}`);
      (data.organic ?? []).slice(0, 4).forEach((r) => {
        parts.push(`• ${r.title}\n  ${r.snippet}\n  ${r.link}`);
      });
      return parts.join("\n\n") || "No results found.";
    },
  },

  {
    name: "read_url",
    label: "Read a Webpage",
    emoji: "🌐",
    description: "Fetch and read the text content of any public URL.",
    openaiSchema: {
      type: "function",
      function: {
        name: "read_url",
        description: "Fetch and read the text content of a public URL. Use this to read articles, documentation, or any web page.",
        parameters: {
          type: "object",
          properties: {
            url: { type: "string", description: "The full URL to fetch (must start with https://)" },
          },
          required: ["url"],
        },
      },
    },
    async execute({ url }) {
      if (!url.startsWith("https://")) return "Only https:// URLs are supported.";
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; BuildMyFirstAgent/1.0)" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return `Could not fetch page (HTTP ${res.status})`;
        const html = await res.text();
        // Strip tags and collapse whitespace
        const text = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s{2,}/g, " ")
          .trim()
          .slice(0, 3000);
        return text || "Page loaded but no readable text found.";
      } catch {
        return "Could not load the page. It may be unavailable or blocked.";
      }
    },
  },

  {
    name: "get_datetime",
    label: "Date & Time",
    emoji: "📅",
    description: "Get the current date and time. Useful for scheduling, deadlines, and time-aware responses.",
    openaiSchema: {
      type: "function",
      function: {
        name: "get_datetime",
        description: "Get the current date and time in UTC. Use this when the user asks about today's date, the current time, or time-sensitive information.",
        parameters: { type: "object", properties: {}, required: [] },
      },
    },
    async execute(_args) {
      return new Date().toUTCString();
    },
  },

  {
    name: "calculator",
    label: "Calculator",
    emoji: "🧮",
    description: "Perform arithmetic calculations — totals, percentages, unit conversions.",
    openaiSchema: {
      type: "function",
      function: {
        name: "calculator",
        description: "Evaluate a mathematical expression and return the result. Use this for any arithmetic: addition, subtraction, multiplication, division, percentages.",
        parameters: {
          type: "object",
          properties: {
            expression: { type: "string", description: "A mathematical expression, e.g. '(1500 * 0.08) + 1500' or '200 / 12'" },
          },
          required: ["expression"],
        },
      },
    },
    async execute({ expression }) {
      const clean = expression.replace(/\s/g, "");
      if (!/^[\d+\-*/().%]+$/.test(clean)) {
        return "Invalid expression — only numbers and operators (+, -, *, /, %, ()) are allowed.";
      }
      try {
        // eslint-disable-next-line no-new-func
        const result = Function("return " + clean)() as number;
        if (typeof result !== "number" || !isFinite(result)) return "Result is not a valid number.";
        return String(Math.round(result * 1e10) / 1e10);
      } catch {
        return "Could not evaluate that expression.";
      }
    },
  },

  {
    name: "capture_lead",
    label: "Save Contact Info",
    emoji: "📋",
    description: "Capture visitor name, email, and phone number so the owner can follow up.",
    openaiSchema: {
      type: "function",
      function: {
        name: "capture_lead",
        description: "Save the visitor's contact information (name, email, phone) when they express interest or provide their details. Call this as soon as you have at least a name and one contact method.",
        parameters: {
          type: "object",
          properties: {
            name:  { type: "string", description: "Visitor's full name" },
            email: { type: "string", description: "Visitor's email address" },
            phone: { type: "string", description: "Visitor's phone number" },
            notes: { type: "string", description: "Brief note about what they're interested in" },
          },
          required: ["name"],
        },
      },
    },
    async execute({ name, email, phone, notes }) {
      // Default executor — overridden in /api/chat with real DB context
      return `Saved contact info for ${name}.`;
    },
  },
];

export function getToolsByName(names: string[]): ToolDefinition[] {
  return TOOL_REGISTRY.filter((t) => names.includes(t.name));
}

export function availableTools(): ToolDefinition[] {
  return TOOL_REGISTRY.filter(
    (t) => !t.requiresEnv || !!process.env[t.requiresEnv]
  );
}
