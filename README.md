# Build My First Agent

**Go from idea to your first working AI agent in one afternoon.**

A beginner-friendly web app that guides anyone — founders, teachers, real estate operators, people over 50 — through designing, building, and testing a real AI agent.

## What it does

1. **10-question wizard** — one question at a time, with clarifying follow-ups if your answer is vague
2. **Live Agent Blueprint** — updates in real time as you answer, with mission, workflow, tools, safety rules, and test cases
3. **9 learning levels** — from basic prompt to scheduler, memory, tools, approval gates, and deployment
4. **Live chat prototype** — test your agent in a chat window inside the app
5. **Export** — download your system prompt, markdown blueprint, or JSON config

## Setup

```bash
git clone <repo>
cd build-my-first-agent
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | Optional | Powers the live chat prototype. Get a free key at [openrouter.ai](https://openrouter.ai). Without it, the app runs in demo mode with pre-written responses. |

## Demo mode

The app runs fully without an API key. The wizard, blueprint generator, levels, export, and gallery all work. The chat prototype uses scripted demo responses instead of live AI.

To enable live AI in the chat: add `OPENROUTER_API_KEY=sk-...` to `.env.local`. The app uses `google/gemini-2.5-flash` via OpenRouter.

## Scripts

```bash
npm run dev       # local dev server
npm run build     # production build
npm run lint      # ESLint
```

## Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add `OPENROUTER_API_KEY` in Project Settings → Environment Variables
4. Deploy

No database required. State is stored in `localStorage`.

## Tech stack

- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Local state via `localStorage`
- AI: OpenRouter → Gemini 2.5 Flash (optional)
- Deploy: Vercel

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/builder` | Main wizard + level content + chat prototype |
| `/gallery` | 8 example agent templates |
| `/api/chat` | Edge API route — SSE streaming chat |
