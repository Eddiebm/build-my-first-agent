export interface AgentTemplate {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  audience: string;
  answers: Record<string, string>;
  color: string;
}

export const TEMPLATES: AgentTemplate[] = [
  {
    id: "email-assistant",
    name: "Email Assistant",
    emoji: "📧",
    tagline: "Triage, draft, and reply to email automatically",
    description:
      "Reads your inbox, drafts replies in your voice, and flags what needs your attention. You approve before anything sends.",
    audience: "Founders, busy professionals, small business owners",
    color: "bg-blue-50 border-blue-200",
    answers: {
      job: "Read my inbox, draft replies in my voice, and summarize what needs my attention each morning",
      user: "Me — I want to cut inbox time from 2 hours to 20 minutes",
      problem: "I spend too much time reading and replying to emails that follow the same patterns",
      output: "A morning digest of what needs action + draft replies ready for my approval",
      tools: "Yes — read and draft emails, access my calendar to check availability",
      memory: "Yes — remember my writing style and relationships with key contacts",
      trigger: "Both — scheduled digest at 8am, and on-demand when I ask for help with a specific email",
      approval: "Yes — always show me drafts before sending anything",
      never: "Never send an email without my approval. Never share confidential business info.",
      success: "I spend less than 30 minutes on email each day and nothing important falls through the cracks",
    },
  },
  {
    id: "grant-researcher",
    name: "Grant Research Assistant",
    emoji: "🏛️",
    tagline: "Find funding opportunities you'd otherwise miss",
    description:
      "Searches grant databases weekly, matches opportunities to your mission, and delivers a digest with deadlines and application links.",
    audience: "Nonprofits, researchers, universities, community organizations",
    color: "bg-green-50 border-green-200",
    answers: {
      job: "Search for grant opportunities that match our mission and deliver a weekly report with deadlines",
      user: "Our development director who manages fundraising",
      problem: "We miss grant deadlines because nobody has time to search daily across 10 different databases",
      output: "Weekly email: list of 5–10 matching grants with deadline, amount, eligibility, and application link",
      tools: "Yes — search grant databases, government websites, and foundation portals",
      memory: "Yes — track which grants we've applied for, won, or been rejected from",
      trigger: "Scheduled — every Monday at 9am deliver the weekly digest",
      approval: "No — just deliver the digest. We'll decide what to apply for ourselves.",
      never: "Never apply to a grant automatically. Never share our financial data externally.",
      success: "We find at least 3 new grant opportunities per month we didn't know about before",
    },
  },
  {
    id: "leasing-assistant",
    name: "Real Estate Leasing Assistant",
    emoji: "🏢",
    tagline: "Answer tenant questions 24/7 without calls at midnight",
    description:
      "Handles lease questions, maintenance requests, and policy inquiries instantly. Escalates only what needs a human.",
    audience: "Property managers, landlords, real estate operators",
    color: "bg-orange-50 border-orange-200",
    answers: {
      job: "Answer tenant questions about leases, maintenance, policies, and rent payments",
      user: "My tenants — they need answers outside of business hours",
      problem: "Tenants call and text me at all hours with questions I've already answered a hundred times",
      output: "A clear, friendly answer within seconds. Maintenance requests logged automatically.",
      tools: "Yes — access lease database, create maintenance tickets, check payment status",
      memory: "Yes — remember each tenant's unit, lease terms, and open requests",
      trigger: "On demand — tenants message it when they have a question",
      approval: "Only for maintenance requests over $500 or anything involving lease modifications",
      never: "Never give legal advice. Never promise repairs by a specific date. Never share one tenant's info with another.",
      success: "Tenant questions get answered in under 30 seconds without me being involved",
    },
  },
  {
    id: "social-media",
    name: "Social Media Content Assistant",
    emoji: "📱",
    tagline: "Never stare at a blank page again",
    description:
      "Generates on-brand posts, captions, and content ideas for your business. You pick what to publish.",
    audience: "Small business owners, restaurants, retailers, service businesses",
    color: "bg-pink-50 border-pink-200",
    answers: {
      job: "Generate social media posts and content ideas that sound like me and match my brand",
      user: "Me — I run a small business and post on Instagram and Facebook",
      problem: "Creating content takes hours each week and I often skip it because I don't know what to say",
      output: "3–5 ready-to-post captions with hashtags, plus 5 content ideas for next week",
      tools: "Yes — search trending topics in my industry",
      memory: "Yes — remember my brand voice, past posts, and what content performed best",
      trigger: "On demand — I ask when I need content. Plus a weekly Monday inspiration batch.",
      approval: "Yes — I choose what to post. Never auto-publish anything.",
      never: "Never post anything political, controversial, or that I haven't approved. Never copy other brands.",
      success: "I spend under 15 minutes per week on social media and post consistently every week",
    },
  },
  {
    id: "faq-bot",
    name: "Customer FAQ Bot",
    emoji: "💬",
    tagline: "Answer every customer question instantly, 24/7",
    description:
      "Handles your most common customer questions from your website, trained on your own policies and products.",
    audience: "E-commerce shops, service businesses, SaaS companies",
    color: "bg-purple-50 border-purple-200",
    answers: {
      job: "Answer customer questions about our products, shipping, returns, and policies",
      user: "Customers visiting our website who have questions before buying",
      problem: "We get the same 20 questions over and over and support tickets pile up every day",
      output: "A clear, confident answer. If it can't help, collect their email for a human follow-up.",
      tools: "Yes — search our product catalog and order status system",
      memory: "No — each chat is fresh",
      trigger: "On demand — a customer opens the chat widget",
      approval: "No — handle routine questions automatically. Escalate complex complaints.",
      never: "Never make up product specs or pricing. Never promise refunds that haven't been approved.",
      success: "Support ticket volume drops by 40% and customer satisfaction stays above 4 stars",
    },
  },
  {
    id: "youtube-researcher",
    name: "YouTube Research Assistant",
    emoji: "▶️",
    tagline: "Turn hours of video research into 5-minute summaries",
    description:
      "Summarizes YouTube videos, extracts key insights, and builds research reports so you get the knowledge without the watch time.",
    audience: "Content creators, researchers, marketers, students",
    color: "bg-red-50 border-red-200",
    answers: {
      job: "Summarize YouTube videos and extract key insights into a structured report",
      user: "Me — I research topics for content creation and spend too much time watching videos",
      problem: "I need to watch 10+ videos to research a topic but only need 20% of the content in each",
      output: "A one-page summary: main points, key quotes, timestamps, and my own notes section",
      tools: "Yes — fetch YouTube transcripts and search for related videos",
      memory: "Yes — build a research library I can search later",
      trigger: "On demand — I give it a video URL or topic",
      approval: "No — just produce the summary",
      never: "Never make up quotes or timestamps. Never claim opinions as facts.",
      success: "I can research any topic in 20 minutes instead of 3 hours",
    },
  },
  {
    id: "lead-finder",
    name: "Lead Finder",
    emoji: "🎯",
    tagline: "Find your ideal customers automatically",
    description:
      "Searches for businesses or individuals that match your ideal customer profile and delivers a weekly list with contact info.",
    audience: "Sales teams, consultants, recruiters, B2B businesses",
    color: "bg-teal-50 border-teal-200",
    answers: {
      job: "Find companies and contacts that match our ideal customer profile and compile a weekly list",
      user: "Our sales team who needs a steady pipeline of qualified leads",
      problem: "Building a prospect list takes 5 hours per week and the quality is inconsistent",
      output: "A spreadsheet: company name, size, industry, contact name, email, LinkedIn, why they fit",
      tools: "Yes — search LinkedIn, company websites, and industry directories",
      memory: "Yes — never repeat companies already in our CRM",
      trigger: "Scheduled — every Friday deliver next week's prospect list",
      approval: "No — compile the list automatically. Sales team reviews and reaches out.",
      never: "Never contact anyone directly. Never scrape data that violates terms of service.",
      success: "Sales team closes 20% more meetings because leads are pre-qualified",
    },
  },
  {
    id: "personal-admin",
    name: "Personal Admin Assistant",
    emoji: "🗂️",
    tagline: "Your second brain for all the things you keep forgetting",
    description:
      "Manages your tasks, drafts messages, reminds you of deadlines, and answers questions about your own notes and documents.",
    audience: "Busy professionals, entrepreneurs, anyone who juggles too much",
    color: "bg-indigo-50 border-indigo-200",
    answers: {
      job: "Manage my tasks, draft messages, remind me of deadlines, and answer questions about my notes",
      user: "Me — I'm overwhelmed and need a second brain",
      problem: "Things fall through the cracks because I can't track everything in my head",
      output: "Daily briefing, task reminders, drafted responses, and quick answers from my own notes",
      tools: "Yes — access my calendar, notes, and email drafts",
      memory: "Yes — remember everything I tell it: deadlines, people, preferences, decisions",
      trigger: "Both — morning briefing at 7am, and I can ask it questions any time",
      approval: "Yes — always confirm before sending anything on my behalf",
      never: "Never share my personal info. Never make commitments without my explicit approval.",
      success: "I start every day knowing exactly what needs my attention and nothing important gets forgotten",
    },
  },
];
