import Link from "next/link";
import type { Metadata } from "next";

interface IndustryConfig {
  slug: string;
  industry: string;
  heading: string;
  subheading: string;
  role: { id: string; humanName: string; title: string; emoji: string };
  stat: string;
  statLabel: string;
  painPoints: Array<{ icon: string; title: string; desc: string }>;
  outcomes: string[];
  demoMessages: Array<{ from: "customer" | "employee"; text: string }>;
  demoCaption: string;
  metaTitle: string;
  metaDescription: string;
}

const INDUSTRIES: Record<string, IndustryConfig> = {
  dentists: {
    slug: "dentists",
    industry: "Dental Practices",
    heading: "Hire a Dental Receptionist Who Never Misses a Patient Call",
    subheading:
      "Sarah answers patient calls 24/7, books new patient appointments, handles insurance FAQs, and captures every inquiry — so your front desk can focus on the room.",
    role: { id: "front-desk-receptionist", humanName: "Sarah", title: "AI Receptionist", emoji: "📞" },
    stat: "42",
    statLabel: "calls the average dental practice misses each week",
    painPoints: [
      { icon: "📵", title: "Calls go to voicemail", desc: "68% of patients who reach voicemail don't call back. They call the next dentist in the list." },
      { icon: "💸", title: "$450 per missed new patient", desc: "A new patient relationship is worth hundreds to thousands of dollars over a lifetime. Every missed call costs you." },
      { icon: "😤", title: "Front desk can't do two things at once", desc: "When your team is with a patient, inquiries pile up. There's no good solution — until now." },
    ],
    outcomes: [
      "Books new patient appointments after hours and on weekends",
      "Handles insurance, payment, and procedure FAQs instantly",
      "Captures every new patient inquiry with name and phone number",
      "Routes urgent situations to your on-call staff immediately",
      "Never puts a patient on hold or sends them to voicemail",
    ],
    demoMessages: [
      { from: "customer", text: "Hi, I saw you're accepting new patients. I need a cleaning and it's been a while. Are you open Saturdays?" },
      { from: "employee", text: "Hi there! Yes, we're open Saturdays 8am–2pm and we'd love to see you. It's totally fine if it's been a while — no judgment here! What's your name?" },
      { from: "customer", text: "Lisa Martinez. Do you take Delta Dental?" },
      { from: "employee", text: "We do accept Delta Dental, Lisa! I'll get you scheduled. What's the best number to reach you, and do you prefer mornings or afternoons?" },
      { from: "customer", text: "404-555-0182, mornings are better." },
      { from: "employee", text: "Perfect! I've saved your info. Our scheduling team will call you tomorrow morning to confirm your Saturday appointment. We look forward to meeting you!" },
    ],
    demoCaption: "Lisa's contact info saved. Scheduling team notified. New patient captured at 10:43 PM.",
    metaTitle: "AI Receptionist for Dental Practices | Build My First Agent",
    metaDescription: "Hire Sarah, an AI receptionist for your dental practice. She answers calls 24/7, books new patient appointments, and handles insurance FAQs — starting at $15/mo.",
  },

  contractors: {
    slug: "contractors",
    industry: "Contractors & Trades",
    heading: "Stop Losing Jobs to Missed Calls While You're On the Job Site",
    subheading:
      "Chris qualifies every lead, captures project details, and books estimate calls — so you never lose a job because you were too busy doing the last one.",
    role: { id: "contractor-qualifier", humanName: "Chris", title: "AI Lead Qualifier", emoji: "🔨" },
    stat: "$1,200",
    statLabel: "average value of a missed contractor lead",
    painPoints: [
      { icon: "📵", title: "You can't answer when you're on a job", desc: "When you're working, your phone rings and you miss it. By the time you call back, they've already hired someone else." },
      { icon: "💸", title: "Every missed call is a lost job", desc: "Contractors lose thousands every month in unearned jobs — not because they're bad at what they do, but because they missed the call." },
      { icon: "⏰", title: "Tire-kickers waste your time", desc: "You call back every lead and half of them aren't serious. Your time is better spent on the job." },
    ],
    outcomes: [
      "Answers every inbound call while you're working",
      "Asks qualifying questions: project type, location, budget, timeline",
      "Books estimate visits directly into your calendar",
      "Captures every lead with name, address, and project details",
      "Screens out tire-kickers so you only call back serious prospects",
    ],
    demoMessages: [
      { from: "customer", text: "Hey, I need someone to replace my roof. How soon can you come out?" },
      { from: "employee", text: "Hey! Thanks for calling. We'd love to help. Can I get a few quick details? What's the approximate size of your roof and what's the address?" },
      { from: "customer", text: "It's in Roswell, probably 2,000 square feet. It's a 15-year-old asphalt shingle." },
      { from: "employee", text: "Got it — Roswell, 2,000 sq ft, asphalt shingle. What's your timeline? And are you getting multiple quotes or moving forward with the right company?" },
      { from: "customer", text: "Getting a couple quotes. Hoping to start within the month." },
      { from: "employee", text: "Perfect. Can I get your name and best number? I'll have the owner call you back today to schedule the estimate." },
    ],
    demoCaption: "Lead captured: Roswell roof replacement, 2,000 sq ft, ready to move. Owner notified instantly.",
    metaTitle: "AI Lead Qualifier for Contractors | Build My First Agent",
    metaDescription: "Hire Chris, an AI lead qualifier for contractors. He answers calls, qualifies projects, and books estimate visits — so you never lose a job to a missed call.",
  },

  hvac: {
    slug: "hvac",
    industry: "HVAC Companies",
    heading: "Your HVAC Business Deserves a Dispatcher Who Works Around the Clock",
    subheading:
      "Sarah handles service calls, qualifies emergencies, schedules maintenance visits, and captures every new customer inquiry — 24/7, even at 2am when the AC goes out.",
    role: { id: "front-desk-receptionist", humanName: "Sarah", title: "AI Receptionist", emoji: "📞" },
    stat: "73%",
    statLabel: "of HVAC emergency calls happen outside business hours",
    painPoints: [
      { icon: "🌙", title: "After-hours emergencies go unanswered", desc: "AC breaks down at midnight. Customers in August heat call you. If you don't answer, they call a competitor." },
      { icon: "📅", title: "Scheduling calls pile up during peak season", desc: "Summer and winter bring a flood of service requests. Your dispatcher can't keep up. Jobs fall through the cracks." },
      { icon: "📵", title: "New customer calls hit voicemail", desc: "First impressions matter. A customer searching for HVAC in an emergency won't wait for a callback — they'll find someone else." },
    ],
    outcomes: [
      "Answers emergency calls at any hour, any day",
      "Qualifies urgency and routes true emergencies to your on-call tech",
      "Schedules routine maintenance and service visits",
      "Captures new customer info with address and equipment details",
      "Handles seasonal surge without adding staff",
    ],
    demoMessages: [
      { from: "customer", text: "Our AC stopped working. It's 94 degrees and we have a baby at home. Is anyone available tonight?" },
      { from: "employee", text: "I'm so sorry to hear that — especially with a little one at home. Let me get your info right away. What's your address and what unit do you have?" },
      { from: "customer", text: "4721 Oak Drive, Sandy Springs. It's a Trane, maybe 8 years old." },
      { from: "employee", text: "Got it. And your name and best phone number?" },
      { from: "customer", text: "David Park, 404-555-0193." },
      { from: "employee", text: "David, I've flagged this as urgent. Our on-call technician will call you within 15 minutes. Stay cool as best you can — help is on the way." },
    ],
    demoCaption: "Emergency flagged. On-call tech notified. David's info captured in under 2 minutes.",
    metaTitle: "AI Dispatcher for HVAC Companies | Build My First Agent",
    metaDescription: "Hire an AI dispatcher for your HVAC company. Sarah answers emergency calls 24/7, schedules service visits, and captures every new customer — starting at $15/mo.",
  },

  restaurants: {
    slug: "restaurants",
    industry: "Restaurants & Dining",
    heading: "Your Restaurant Deserves a Host Who Never Leaves the Front of House",
    subheading:
      "Sofia takes reservations, answers menu and hours questions, handles private event inquiries, and manages your waitlist — so your staff can focus on the floor.",
    role: { id: "restaurant-host", humanName: "Sofia", title: "AI Restaurant Host", emoji: "🍽️" },
    stat: "35%",
    statLabel: "of restaurant calls go unanswered during dinner service",
    painPoints: [
      { icon: "📵", title: "Dinner rush means no one answers the phone", desc: "When you're slammed, every ring goes ignored. Customers trying to book a table call somewhere else." },
      { icon: "📋", title: "Private event inquiries need immediate follow-up", desc: "A birthday party or corporate dinner is $500-$5,000 in revenue. If you don't respond quickly, you lose it." },
      { icon: "⏰", title: "After-hours reservations don't get booked", desc: "Customers plan dinners at 10pm. You're closed. They find OpenTable and book somewhere else." },
    ],
    outcomes: [
      "Takes reservations and manages the waitlist 24/7",
      "Answers hours, location, menu, and dietary restriction questions instantly",
      "Captures private dining and event inquiries with full details",
      "Handles large party and catering requests",
      "Routes urgent issues to the manager on duty",
    ],
    demoMessages: [
      { from: "customer", text: "Hi, I want to book a table for my wife's 40th birthday. It's a Saturday, about 10 people." },
      { from: "employee", text: "How wonderful — congratulations to her! We'd love to host the celebration. Which Saturday were you thinking, and do you have a preferred time?" },
      { from: "customer", text: "August 16th, around 7pm." },
      { from: "employee", text: "Perfect. For a party of 10 on a Saturday evening, I'd recommend reserving our private dining area. Can I get your name and phone number to hold the date?" },
      { from: "customer", text: "James Carter, 678-555-0144." },
      { from: "employee", text: "Got it, James! I've saved your reservation request. Our events coordinator will call you tomorrow to confirm the details and discuss the menu. Sofia is looking forward to making it a night to remember!" },
    ],
    demoCaption: "Private dining request captured. Events coordinator notified. James's birthday party: Aug 16, party of 10.",
    metaTitle: "AI Restaurant Host for Restaurants | Build My First Agent",
    metaDescription: "Hire Sofia, an AI host for your restaurant. She takes reservations, answers guest questions, and handles private event inquiries — 24/7, starting at $15/mo.",
  },

  salons: {
    slug: "salons",
    industry: "Salons & Spas",
    heading: "Hire a Salon Receptionist Who Books Appointments While You're With a Client",
    subheading:
      "Bella books haircut, color, and spa appointments, answers service and pricing questions, and handles rescheduling — so you never lose a booking because your hands were full.",
    role: { id: "salon-booker", humanName: "Bella", title: "AI Salon Booker", emoji: "💈" },
    stat: "1 in 3",
    statLabel: "salon appointments are booked outside business hours",
    painPoints: [
      { icon: "📵", title: "Clients call while you're with someone", desc: "You can't answer when you're in the middle of a color or cut. Clients leave a voicemail or just book somewhere else." },
      { icon: "🌙", title: "After-hours bookings go to voicemail", desc: "People plan their appointments at night. If you're not available at 9pm, they book somewhere that is." },
      { icon: "📞", title: "Rescheduling calls are constant", desc: "Your phone rings all day with rescheduling requests. Each one pulls you away from the client in the chair." },
    ],
    outcomes: [
      "Books appointments for haircuts, color, and spa services 24/7",
      "Answers pricing, service duration, and stylist availability questions",
      "Handles rescheduling and cancellation requests gracefully",
      "Captures new client contact info for your records",
      "Shares your booking link when clients are ready to confirm",
    ],
    demoMessages: [
      { from: "customer", text: "Hi, I want to get a balayage. How much does that usually run and how long does it take?" },
      { from: "employee", text: "Hi! Balayage is one of our most requested services. Pricing depends on your hair length and starting color — typically $150–$250, and it takes about 2.5–3 hours. Would you like to book a consultation?" },
      { from: "customer", text: "Yes, I'd like to see someone this week if possible. My hair is just past my shoulders, medium brown." },
      { from: "employee", text: "Perfect, that sounds gorgeous! Can I get your name and phone number? I'll check with the stylists and someone will confirm your appointment within the hour." },
      { from: "customer", text: "Aisha Williams, 404-555-0182." },
      { from: "employee", text: "Wonderful, Aisha! I've saved your info. You'll hear back shortly to confirm. We can't wait to see you!" },
    ],
    demoCaption: "Booking request captured: Balayage, shoulder-length medium brown. Stylist team notified.",
    metaTitle: "AI Booking Assistant for Salons & Spas | Build My First Agent",
    metaDescription: "Hire Bella, an AI booking assistant for your salon or spa. She books appointments, answers service questions, and handles rescheduling — 24/7, starting at $15/mo.",
  },

  "auto-repair": {
    slug: "auto-repair",
    industry: "Auto Repair Shops",
    heading: "Hire a Service Advisor Who Answers While You're Under the Hood",
    subheading:
      "Mike handles service inquiries, books drop-off appointments, answers maintenance questions, and captures every customer's vehicle info — so you never miss a job.",
    role: { id: "auto-shop-advisor", humanName: "Mike", title: "AI Service Advisor", emoji: "🔧" },
    stat: "60%",
    statLabel: "of auto shop calls come in when staff are with other customers",
    painPoints: [
      { icon: "🔩", title: "Technicians can't answer the phone", desc: "Your team is under vehicles. Every missed call is a service job that walks to the shop down the street." },
      { icon: "❓", title: "The same questions every day", desc: "\"How much for an oil change?\" \"Do you do brakes?\" \"Can I drop off tomorrow?\" These calls are manageable — just time-consuming." },
      { icon: "📵", title: "New customers don't leave voicemails", desc: "Someone searches for auto repair, calls you, gets voicemail, and calls the next shop. Simple as that." },
    ],
    outcomes: [
      "Answers service inquiry calls while techs are working",
      "Provides pricing ranges for common services (oil change, brakes, tires)",
      "Books drop-off appointments with vehicle details captured",
      "Handles repair status questions when you've given updates",
      "Never lets a new customer go to voicemail",
    ],
    demoMessages: [
      { from: "customer", text: "Hey, I need front and rear brakes done on my 2019 Honda Accord. Do you do that and how much is it usually?" },
      { from: "employee", text: "Hey! We absolutely do brakes — it's one of our most common jobs. For a 2019 Accord, front and rear pads with rotors typically runs $350–$500 total. When were you looking to bring it in?" },
      { from: "customer", text: "This week if possible. I'm off Wednesday." },
      { from: "employee", text: "Wednesday works great. Can I get your name and phone number to hold that spot? I'll also need the mileage when you drop it off." },
      { from: "customer", text: "Tom Bradley, 770-555-0128. About 52,000 miles." },
      { from: "employee", text: "Perfect. Tom Bradley, 2019 Accord, 52k miles, full brake job Wednesday. We'll confirm your time slot tomorrow morning." },
    ],
    demoCaption: "Service appointment captured: Tom Bradley, 2019 Accord, brake job, Wednesday. Shop notified.",
    metaTitle: "AI Service Advisor for Auto Repair Shops | Build My First Agent",
    metaDescription: "Hire Mike, an AI service advisor for your auto shop. He handles calls, books drop-off appointments, and captures customer details — starting at $15/mo.",
  },

  gyms: {
    slug: "gyms",
    industry: "Gyms & Fitness Studios",
    heading: "Convert Every Membership Inquiry Into a Sign-Up While You're on the Floor",
    subheading:
      "Jake handles membership questions, offers free trial passes, books tours, and captures every lead — so your sales team can close instead of playing phone tag.",
    role: { id: "gym-assistant", humanName: "Jake", title: "AI Membership Assistant", emoji: "🏋️" },
    stat: "74%",
    statLabel: "of gym leads are lost because no one followed up fast enough",
    painPoints: [
      { icon: "⏰", title: "Slow follow-up kills memberships", desc: "Someone inquires about joining. If you don't respond in 5 minutes, your conversion rate drops by 80%. Every minute counts." },
      { icon: "❓", title: "The same membership questions every day", desc: "\"How much is a membership?\" \"Do you have classes?\" \"Can I get a free trial?\" These calls don't need a human to close." },
      { icon: "📵", title: "Leads call after hours and get nothing", desc: "People research gym memberships on Sunday night. If you're not available, they sign up at the gym that answered." },
    ],
    outcomes: [
      "Answers membership pricing and contract questions instantly",
      "Offers free trial and guest pass details, captures lead info",
      "Books tours and orientation sessions",
      "Explains class schedules, amenities, and personal training options",
      "Routes cancellations and freezes to the right staff member",
    ],
    demoMessages: [
      { from: "customer", text: "Hey, how much is a membership? And do you have a free trial?" },
      { from: "employee", text: "Hey! Great timing — we do offer a free 3-day trial, no credit card required. Memberships start at $39/mo. What kind of workouts are you into?" },
      { from: "customer", text: "Mostly weight training and maybe some classes on the weekend." },
      { from: "employee", text: "Perfect fit for us — we have a full free weight section and Saturday/Sunday group fitness. Want me to set up your free trial? I just need your name and email." },
      { from: "customer", text: "Marcus Thompson, marcus@email.com." },
      { from: "employee", text: "You're all set, Marcus! Your 3-day pass starts whenever you're ready. Our membership team will send you the details. Come check us out — I think you'll love it." },
    ],
    demoCaption: "Free trial captured: Marcus Thompson. Membership team notified. Conversion conversation started.",
    metaTitle: "AI Membership Assistant for Gyms | Build My First Agent",
    metaDescription: "Hire Jake, an AI membership assistant for your gym or fitness studio. He answers questions, books tours, and captures leads 24/7 — starting at $15/mo.",
  },

  "property-management": {
    slug: "property-management",
    industry: "Property Management",
    heading: "Hire a Leasing Coordinator Who Handles Inquiries Around the Clock",
    subheading:
      "Lisa answers availability questions, schedules tours, handles tenant FAQs, and captures every prospective tenant inquiry — even at midnight when they're apartment hunting.",
    role: { id: "leasing-coordinator", humanName: "Lisa", title: "AI Leasing Coordinator", emoji: "🏠" },
    stat: "67%",
    statLabel: "of rental inquiries happen outside business hours",
    painPoints: [
      { icon: "🌙", title: "Prospects search for apartments at night", desc: "People browse listings and call about availability at 9pm. Your voicemail is your competition's best friend." },
      { icon: "📋", title: "Tenant questions never stop", desc: "Rent payment, maintenance requests, lease renewal questions — your team spends half their day on calls that don't move the business forward." },
      { icon: "💸", title: "Every missed tour is a vacancy", desc: "An empty unit costs $1,000–$3,000 per month. Every missed inquiry is days or weeks of additional vacancy." },
    ],
    outcomes: [
      "Answers availability, pricing, and lease term questions 24/7",
      "Schedules property tours and viewings instantly",
      "Handles current tenant FAQs about maintenance and policies",
      "Captures every prospect's name, contact, and move-in timeline",
      "Routes urgent maintenance requests to your on-call team",
    ],
    demoMessages: [
      { from: "customer", text: "Hi, I saw the 2-bedroom on Maple Street. Is it still available? I'm looking to move in around September 1st." },
      { from: "employee", text: "Hi! Great news — that unit is still available and September 1st works perfectly with our lease cycle. It's a lovely space. Can I get your name so I can pull up more details?" },
      { from: "customer", text: "Priya Sharma." },
      { from: "employee", text: "Hi Priya! The 2BR on Maple is $1,850/mo, recently updated kitchen and bath, laundry in unit. Are you interested in scheduling a tour? We have slots this week." },
      { from: "customer", text: "Yes, I'd love to see it. What times do you have Thursday?" },
      { from: "employee", text: "Let me get your phone number and I'll have someone confirm a Thursday tour time within the hour. We'd love to show it to you!" },
    ],
    demoCaption: "Tour request captured: Priya Sharma, 2BR Maple Street, September move-in. Leasing team notified.",
    metaTitle: "AI Leasing Coordinator for Property Managers | Build My First Agent",
    metaDescription: "Hire Lisa, an AI leasing coordinator. She answers availability questions, schedules tours, and captures every rental inquiry 24/7 — starting at $15/mo.",
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(INDUSTRIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = INDUSTRIES[slug];
  if (!config) return { title: "AI Employee | Build My First Agent" };
  return {
    title: config.metaTitle,
    description: config.metaDescription,
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const config = INDUSTRIES[slug];

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Page not found</h1>
          <a href="/hire" className="text-brand-600 hover:underline">Browse all AI employees →</a>
        </div>
      </div>
    );
  }

  const { role, painPoints, outcomes, demoMessages, demoCaption } = config;
  const hireUrl = `/hire?role=${role.id}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <a href="/" className="font-bold text-slate-900 hover:text-brand-600 transition-colors text-sm">
            ← Build My First Agent
          </a>
          <a
            href={hireUrl}
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Hire {role.humanName} →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-12 px-4 sm:px-6 text-center bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1 rounded-full mb-6 border border-brand-100">
            <span className="text-xl">{role.emoji}</span>
            {role.title} for {config.industry}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            {config.heading}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {config.subheading}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a
              href={hireUrl}
              className="bg-brand-500 hover:bg-brand-600 text-white text-base font-bold px-8 py-4 rounded-xl transition-all shadow-lg inline-block hover:-translate-y-0.5"
            >
              Hire {role.humanName} for my {config.industry.toLowerCase()} →
            </a>
          </div>

          <div className="inline-block bg-white border border-slate-200 rounded-xl px-6 py-4">
            <p className="text-4xl font-extrabold text-slate-900 mb-1">{config.stat}</p>
            <p className="text-sm text-slate-500">{config.statLabel}</p>
          </div>
        </div>
      </section>

      {/* Pain */}
      <section className="py-14 px-4 sm:px-6 bg-red-50 border-y border-red-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">The problem every {config.industry.toLowerCase()} knows.</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {painPoints.map((p) => (
              <div key={p.title} className="bg-white rounded-xl p-6 border border-red-100">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-brand-400 text-sm font-bold uppercase tracking-widest mb-3">See it in action</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {role.humanName} handles it while you&apos;re working.
            </h2>
          </div>
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden max-w-lg mx-auto">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700 bg-slate-900">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm">{role.emoji}</div>
              <div>
                <p className="text-sm font-bold text-white">{role.humanName}</p>
                <p className="text-xs text-green-400">● {role.title} · Working now</p>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {demoMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "customer" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.from === "customer"
                        ? "bg-slate-700 text-slate-200 rounded-br-sm"
                        : "bg-brand-500 text-white rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-slate-700 bg-slate-900/50">
              <div className="flex items-center gap-2 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {demoCaption}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">What {role.humanName} handles for your {config.industry.toLowerCase()}</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            {outcomes.map((o) => (
              <div key={o} className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-green-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                <span className="text-slate-700 text-sm leading-relaxed">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-brand-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Ready to stop losing customers to missed calls?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            {role.humanName} is trained for {config.industry.toLowerCase()}. Live in 60 seconds. $15/month. Free to try.
          </p>
          <a
            href={hireUrl}
            className="bg-white hover:bg-brand-50 text-brand-600 text-base font-bold px-10 py-4 rounded-xl transition-all inline-block hover:-translate-y-0.5 shadow-lg"
          >
            Hire {role.humanName} →
          </a>
          <p className="text-brand-200 text-sm mt-4">No credit card · No setup fee · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 text-center text-sm text-slate-400">
        <p className="mb-2">Build My First Agent — AI employees for small businesses</p>
        <div className="flex items-center justify-center gap-4">
          <a href="/hire" className="hover:text-slate-600">See all employees</a>
          <a href="/pricing" className="hover:text-slate-600">Pricing</a>
          <a href="/privacy" className="hover:text-slate-600">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
