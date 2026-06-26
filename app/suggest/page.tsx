"use client";

import { useState } from "react";
import Link from "next/link";
import { EMPLOYEE_ROLES } from "@/lib/employee-roles";

interface Profession {
  id: string;
  emoji: string;
  label: string;
  tagline: string;
}

interface Suggestion {
  roleId: string;
  headline: string;
  why: string[];
}

const PROFESSIONS: Profession[] = [
  { id: "landlord", emoji: "🏠", label: "Landlord / Property Manager", tagline: "Managing residential or commercial rentals" },
  { id: "healthcare", emoji: "🏥", label: "Healthcare Provider", tagline: "Doctor, therapist, dentist, or clinic" },
  { id: "small-biz", emoji: "🏪", label: "Small Business Owner", tagline: "Retail, service, or local business" },
  { id: "nonprofit", emoji: "🌱", label: "Nonprofit / Charity", tagline: "Mission-driven organization" },
  { id: "consultant", emoji: "💼", label: "Consultant / Agency", tagline: "Freelancer or professional services firm" },
  { id: "educator", emoji: "🎓", label: "Educator / Coach", tagline: "Teacher, trainer, or course creator" },
  { id: "sales", emoji: "📊", label: "Sales Professional", tagline: "Account executive, SDR, or sales team" },
  { id: "legal", emoji: "⚖️", label: "Law Firm / Attorney", tagline: "Solo practice or law office" },
  { id: "finance", emoji: "💰", label: "Financial Advisor", tagline: "Wealth manager, accountant, or CPA" },
  { id: "founder", emoji: "🚀", label: "Startup Founder", tagline: "Early-stage company or SaaS" },
  { id: "restaurant", emoji: "🍽️", label: "Restaurant / Hospitality", tagline: "Food, drink, or event business" },
  { id: "trades", emoji: "🔨", label: "Contractor / Trades", tagline: "Plumber, electrician, builder, HVAC" },
];

const SUGGESTIONS: Record<string, Suggestion[]> = {
  landlord: [
    {
      roleId: "leasing-coordinator",
      headline: "Stop answering midnight texts from tenants and prospects",
      why: [
        "Handles availability questions, pricing, and lease terms 24/7",
        "Books property tours so you don't play phone tag",
        "Captures every interested lead so none slip through",
      ],
    },
    {
      roleId: "appointment-scheduler",
      headline: "Fill maintenance visits and showings without the back-and-forth",
      why: [
        "Books site visits automatically via your calendar link",
        "Sends appointment confirmations to keep tenants informed",
        "Captures client contact info for every booking",
      ],
    },
    {
      roleId: "customer-service-rep",
      headline: "Handle complaints without ruining your evenings",
      why: [
        "Responds to maintenance requests and policy questions professionally",
        "Escalates serious issues to you with full context",
        "Keeps tenants calm and informed while you handle the real work",
      ],
    },
  ],
  healthcare: [
    {
      roleId: "front-desk-receptionist",
      headline: "Never miss a patient call or leave one on hold again",
      why: [
        "Answers FAQs about hours, location, services, and insurance instantly",
        "Routes urgent questions to the right staff member",
        "Takes messages and captures contact info for callbacks",
      ],
    },
    {
      roleId: "appointment-scheduler",
      headline: "Fill your calendar without your front desk drowning in calls",
      why: [
        "Books and reschedules appointments automatically, even after hours",
        "Sends clients to your booking link when they're ready",
        "Captures patient name and reason for visit upfront",
      ],
    },
    {
      roleId: "hr-assistant",
      headline: "Stop fielding staff questions about PTO and policies all day",
      why: [
        "Handles employee questions about benefits, schedules, and procedures",
        "Routes sensitive HR issues to the right person with context",
        "Guides new hires through onboarding without your time",
      ],
    },
  ],
  "small-biz": [
    {
      roleId: "customer-service-rep",
      headline: "Answer customer questions 24/7 without hiring overnight staff",
      why: [
        "Handles orders, returns, policies, and complaints professionally",
        "Captures contact info when a customer needs follow-up",
        "Keeps your brand voice consistent across every interaction",
      ],
    },
    {
      roleId: "sales-development-rep",
      headline: "Follow up on every lead while you focus on the actual work",
      why: [
        "Qualifies inbound inquiries and books discovery calls",
        "Handles objections and keeps warm leads engaged",
        "Captures every prospect's contact info and what they want",
      ],
    },
    {
      roleId: "appointment-scheduler",
      headline: "Fill your calendar without the back-and-forth email chains",
      why: [
        "Books consultations, installs, or service visits automatically",
        "Sends your booking link when someone is ready to commit",
        "Confirms appointments so you stop getting no-shows",
      ],
    },
  ],
  nonprofit: [
    {
      roleId: "grant-researcher",
      headline: "Find the funding opportunities you're currently missing",
      why: [
        "Searches for grants matching your mission and geographic area",
        "Flags eligibility and summarizes application requirements",
        "Tracks deadlines so you never miss a window",
      ],
    },
    {
      roleId: "social-media-assistant",
      headline: "Keep your mission visible without it consuming your Sundays",
      why: [
        "Drafts posts, captions, and content ideas in your voice",
        "Researches trending topics relevant to your cause",
        "Suggests a content calendar so you always have something ready",
      ],
    },
    {
      roleId: "hr-assistant",
      headline: "Onboard volunteers and staff without the admin chaos",
      why: [
        "Answers questions about policies, roles, and procedures",
        "Guides new volunteers through their first steps",
        "Routes HR requests to the right team member automatically",
      ],
    },
  ],
  consultant: [
    {
      roleId: "sales-development-rep",
      headline: "Qualify leads and book discovery calls while you're in client work",
      why: [
        "Responds to inbound inquiries and asks qualifying questions",
        "Handles objections and warms up cold leads",
        "Books first calls on your calendar automatically",
      ],
    },
    {
      roleId: "social-media-assistant",
      headline: "Stay visible without it eating your billable hours",
      why: [
        "Drafts LinkedIn posts and thought leadership content in your voice",
        "Suggests ideas based on what's trending in your industry",
        "Creates a content calendar so you always know what to post",
      ],
    },
    {
      roleId: "appointment-scheduler",
      headline: "Eliminate the scheduling friction that loses you clients",
      why: [
        "Handles booking requests and sends your calendar link at the right moment",
        "Captures prospect details before the call so you're prepared",
        "Reschedules without you lifting a finger",
      ],
    },
  ],
  educator: [
    {
      roleId: "appointment-scheduler",
      headline: "Book coaching sessions and consultations without the email ping-pong",
      why: [
        "Handles all scheduling requests and sends your booking link",
        "Captures what the client wants to work on before the session",
        "Sends confirmation so clients show up prepared",
      ],
    },
    {
      roleId: "customer-service-rep",
      headline: "Answer student and client questions about your programs 24/7",
      why: [
        "Explains your curriculum, pricing, and enrollment process",
        "Captures interested students so you can follow up personally",
        "Handles FAQs so you stop answering the same DMs over and over",
      ],
    },
    {
      roleId: "sales-development-rep",
      headline: "Convert leads into enrolled clients while you're busy teaching",
      why: [
        "Qualifies prospects and explains what they'd get from your program",
        "Handles objections about price and time commitment",
        "Books enrollment calls so you talk to serious students only",
      ],
    },
  ],
  sales: [
    {
      roleId: "sales-development-rep",
      headline: "Qualify cold leads and book demos automatically",
      why: [
        "Handles inbound inquiries and asks the right qualifying questions",
        "Warms up cold contacts and books first meetings on your calendar",
        "Captures detailed prospect info so you walk in prepared",
      ],
    },
    {
      roleId: "social-media-assistant",
      headline: "Build your personal pipeline through consistent social content",
      why: [
        "Drafts LinkedIn posts to keep you visible to prospects",
        "Researches what your buyers care about and writes to that",
        "Creates a posting calendar so you stay top-of-mind",
      ],
    },
    {
      roleId: "customer-service-rep",
      headline: "Keep existing accounts happy without it pulling you from new deals",
      why: [
        "Handles renewal questions, support requests, and check-ins",
        "Escalates at-risk accounts to you before they churn",
        "Captures feedback from clients that you can use to upsell",
      ],
    },
  ],
  legal: [
    {
      roleId: "front-desk-receptionist",
      headline: "Handle intake calls professionally without pulling attorneys from work",
      why: [
        "Answers practice area questions and explains your intake process",
        "Routes urgent calls to the right attorney with context",
        "Takes detailed messages so nothing falls through the cracks",
      ],
    },
    {
      roleId: "appointment-scheduler",
      headline: "Book consultations without the phone tag",
      why: [
        "Handles scheduling requests and sends your booking link at the right moment",
        "Captures case type, urgency, and contact info upfront",
        "Confirms appointments so you get fewer no-shows",
      ],
    },
    {
      roleId: "customer-service-rep",
      headline: "Answer FAQ calls about your practice without billing for them",
      why: [
        "Explains what types of cases you handle and your general process",
        "Manages client questions about timelines and next steps",
        "Keeps clients calm and informed during the waiting periods",
      ],
    },
  ],
  finance: [
    {
      roleId: "appointment-scheduler",
      headline: "Book reviews and discovery calls without the scheduling friction",
      why: [
        "Handles all scheduling requests from existing and new clients",
        "Captures what the client wants to discuss before the meeting",
        "Sends your calendar link and confirms automatically",
      ],
    },
    {
      roleId: "customer-service-rep",
      headline: "Handle client questions between meetings without it consuming your day",
      why: [
        "Answers questions about paperwork, process, and timelines",
        "Captures urgent requests and routes them to you immediately",
        "Keeps clients informed and reduces anxiety during the waiting periods",
      ],
    },
    {
      roleId: "sales-development-rep",
      headline: "Convert referrals into meetings while you're with existing clients",
      why: [
        "Qualifies referrals and explains your services and process",
        "Books first meetings with serious prospects automatically",
        "Captures financial situation details so you can prepare",
      ],
    },
  ],
  founder: [
    {
      roleId: "sales-development-rep",
      headline: "Qualify inbound leads and book demos while you're building",
      why: [
        "Responds to demo requests and asks the right qualifying questions",
        "Handles common objections and keeps leads warm",
        "Books calls on your calendar so you talk to the right people",
      ],
    },
    {
      roleId: "customer-service-rep",
      headline: "Handle support tickets without hiring a CS team on day one",
      why: [
        "Answers product questions and troubleshoots common issues",
        "Captures feedback from users that you can build on",
        "Escalates bugs and serious problems with full context",
      ],
    },
    {
      roleId: "social-media-assistant",
      headline: "Keep your brand growing without it taking founder time",
      why: [
        "Drafts product updates, thought leadership, and launch content",
        "Researches what your target users are talking about",
        "Keeps your channels active so you look alive to investors and users",
      ],
    },
  ],
  restaurant: [
    {
      roleId: "front-desk-receptionist",
      headline: "Handle reservation calls without pulling staff mid-service",
      why: [
        "Answers questions about hours, location, menu, and dietary options",
        "Takes reservations and routes booking requests to your system",
        "Handles event inquiries and captures contact info for follow-up",
      ],
    },
    {
      roleId: "customer-service-rep",
      headline: "Respond to complaints and feedback before they become reviews",
      why: [
        "Handles order issues, complaints, and catering questions professionally",
        "Captures customer contact info for recovery and loyalty outreach",
        "Keeps your brand voice warm and professional in every interaction",
      ],
    },
    {
      roleId: "appointment-scheduler",
      headline: "Book private events and large parties without the back-and-forth",
      why: [
        "Handles group reservation and event booking requests",
        "Sends your booking link and captures event details upfront",
        "Confirms reservations so you reduce no-shows",
      ],
    },
  ],
  trades: [
    {
      roleId: "appointment-scheduler",
      headline: "Book jobs and site visits without playing phone tag",
      why: [
        "Handles incoming job requests and sends your booking link",
        "Captures job type, address, and urgency before you call back",
        "Confirms appointments so you stop getting surprise no-shows",
      ],
    },
    {
      roleId: "customer-service-rep",
      headline: "Respond to quote requests and questions 24/7",
      why: [
        "Answers questions about your services, availability, and pricing ranges",
        "Captures lead details so you can call back qualified jobs only",
        "Handles follow-ups on open quotes so work doesn't go to a competitor",
      ],
    },
    {
      roleId: "sales-development-rep",
      headline: "Follow up on leads who requested quotes but went quiet",
      why: [
        "Re-engages contacts who asked for a quote but didn't respond",
        "Handles price objections and explains your value",
        "Books second-chance calls so you convert more of your pipeline",
      ],
    },
  ],
};

export default function SuggestPage() {
  const [selected, setSelected] = useState<Profession | null>(null);

  const suggestions = selected ? (SUGGESTIONS[selected.id] ?? []) : [];

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-slate-900 text-base">🤖 Build My First Agent</Link>
        <Link href="/hire" className="text-sm text-slate-500 hover:text-slate-700">Browse all roles →</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-bold text-brand-500 uppercase tracking-widest mb-2">Step 1 of 2</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            What kind of work do you do?
          </h1>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            Pick your profession and we&apos;ll tell you exactly which AI employees would help you most — and why.
          </p>
        </div>

        {/* Profession grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {PROFESSIONS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`group p-4 rounded-2xl border-2 text-left transition-all ${
                selected?.id === p.id
                  ? "border-brand-400 bg-brand-50"
                  : "border-slate-200 hover:border-brand-300 hover:bg-slate-50"
              }`}
            >
              <div className="text-3xl mb-2">{p.emoji}</div>
              <p className={`text-sm font-bold leading-snug ${selected?.id === p.id ? "text-brand-700" : "text-slate-900"}`}>
                {p.label}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed hidden sm:block">{p.tagline}</p>
            </button>
          ))}
        </div>

        {/* Suggestions */}
        {selected && suggestions.length > 0 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <p className="text-sm font-bold text-brand-500 uppercase tracking-widest mb-2">Step 2 of 2</p>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                {selected.emoji} Here are your recommended employees
              </h2>
              <p className="text-slate-500 text-sm">
                Based on what {selected.label.toLowerCase()}s actually need. Hire any of them in 60 seconds.
              </p>
            </div>

            <div className="space-y-4">
              {suggestions.map((s, i) => {
                const role = EMPLOYEE_ROLES.find((r) => r.id === s.roleId);
                if (!role) return null;
                return (
                  <div
                    key={s.roleId}
                    className={`bg-white border-2 rounded-2xl p-6 transition-all hover:shadow-md ${
                      i === 0 ? "border-brand-300 shadow-sm shadow-brand-100" : "border-slate-200"
                    }`}
                  >
                    {i === 0 && (
                      <div className="inline-flex items-center gap-1 bg-brand-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full mb-3">
                        ★ Best match
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{role.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <p className="font-extrabold text-slate-900 text-lg leading-tight">{role.title}</p>
                            <p className="text-brand-600 font-semibold text-sm mt-0.5">{s.headline}</p>
                          </div>
                          <Link
                            href={`/hire?role=${role.id}`}
                            className="flex-shrink-0 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                          >
                            Hire them →
                          </Link>
                        </div>
                        <ul className="space-y-1.5 mt-3">
                          {s.why.map((w) => (
                            <li key={w} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <Link href="/hire" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                See all 8 available roles →
              </Link>
            </div>
          </div>
        )}

        {!selected && (
          <div className="text-center text-slate-400 text-sm">
            Select your profession above to see your recommendations.
          </div>
        )}
      </div>
    </div>
  );
}
