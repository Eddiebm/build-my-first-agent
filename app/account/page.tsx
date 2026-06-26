import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import PhoneField from "@/app/components/PhoneField";

const PLAN_LABELS: Record<string, string> = { free: "Free", pro: "Pro", business: "Business" };
const PLAN_PRICES: Record<string, string> = { free: "Free forever", pro: "$49/month", business: "$99/month" };
const PLAN_COLORS: Record<string, string> = {
  free: "bg-slate-100 text-slate-600",
  pro: "bg-brand-100 text-brand-700",
  business: "bg-slate-900 text-white",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/auth/signin?next=/account");

  const sql = getDb();
  const [userRows, statsRows] = await Promise.all([
    sql`SELECT plan, stripe_customer_id, created_at, phone FROM users WHERE id = ${session.userId}`,
    sql`
      SELECT COUNT(*) AS agent_count, COALESCE(SUM(message_count), 0) AS total_messages
      FROM agents WHERE user_id = ${session.userId}
    `,
  ]);
  const user = userRows[0];
  const stats = statsRows[0];
  const plan = (user?.plan as string) ?? "free";
  const isPaid = plan === "pro" || plan === "business";
  const agentCount = Number(stats?.agent_count ?? 0);
  const totalMessages = Number(stats?.total_messages ?? 0);

  const dailyLimit = plan === "business" ? "1,000" : plan === "pro" ? "200" : "—";
  const agentLimit = plan === "free" ? "1" : "Unlimited";

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/dashboard" className="font-extrabold text-slate-900">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-5">
        <h1 className="text-2xl font-extrabold text-slate-900">Account</h1>

        {/* Profile */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
              {session.email[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{session.email}</p>
              <p className="text-sm text-slate-500">
                Member since{" "}
                {new Date(user?.created_at as string).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-5">
            <PhoneField currentPhone={user?.phone as string | null} />
          </div>
        </section>

        {/* Plan */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Plan</h2>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-slate-900 text-lg">{PLAN_LABELS[plan] ?? "Free"} Plan</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PLAN_COLORS[plan] ?? PLAN_COLORS.free}`}>
                  {PLAN_LABELS[plan] ?? "Free"}
                </span>
              </div>
              <p className="text-sm text-slate-500">{PLAN_PRICES[plan] ?? "Free"} · Cancel anytime</p>
            </div>
            {isPaid ? (
              <BillingPortalButton />
            ) : (
              <Link
                href="/pricing"
                className="flex-shrink-0 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
              >
                Upgrade →
              </Link>
            )}
          </div>

          {!isPaid && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid sm:grid-cols-2 gap-3">
              <div className="bg-brand-50 rounded-lg p-3">
                <p className="text-xs font-bold text-brand-700 mb-0.5">Growth — $49/mo</p>
                <p className="text-xs text-brand-600">Unlimited agents, 200 msgs/day, lead capture, calendar booking</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-xs font-bold text-white mb-0.5">Business — $99/mo</p>
                <p className="text-xs text-slate-400">Hire AI employees, web search, 1,000 msgs/day</p>
              </div>
            </div>
          )}

          {plan === "pro" && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-1">Want web search and AI employees?</p>
              <Link href="/pricing" className="text-xs text-brand-600 font-semibold hover:underline">
                Upgrade to Business — $99/mo →
              </Link>
            </div>
          )}
        </section>

        {/* Usage */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Usage</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-slate-900">{agentCount}</p>
              <p className="text-xs text-slate-500 mt-0.5">Agents<br/><span className="text-slate-400">/ {agentLimit}</span></p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-slate-900">{totalMessages.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total messages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-slate-900">{dailyLimit}</p>
              <p className="text-xs text-slate-500 mt-0.5">Daily limit<br/><span className="text-slate-400">per agent</span></p>
            </div>
          </div>
        </section>

        {/* Quick links */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick links</h2>
          <div className="space-y-2">
            <Link href="/leads" className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-brand-600 transition-colors">
              <span>📋 View all leads</span>
              <span className="text-slate-400">→</span>
            </Link>
            <Link href="/dashboard" className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-brand-600 transition-colors">
              <span>🤖 Your employees</span>
              <span className="text-slate-400">→</span>
            </Link>
            <a href="/terms" className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-brand-600 transition-colors">
              <span>📄 Terms of Service</span>
              <span className="text-slate-400">→</span>
            </a>
            <a href="/privacy" className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-brand-600 transition-colors">
              <span>🔒 Privacy Policy</span>
              <span className="text-slate-400">→</span>
            </a>
          </div>
        </section>

        {/* Sign out */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Session</h2>
          <SignOutButton />
        </section>
      </div>
    </div>
  );
}

function BillingPortalButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { getStripe } = await import("@/lib/stripe");
        const { getSession: gs } = await import("@/lib/auth");
        const { getDb: gd } = await import("@/lib/db");
        const { redirect: rd } = await import("next/navigation");
        const s = await gs();
        if (!s) return;
        const sql = gd();
        const rows = await sql`SELECT stripe_customer_id FROM users WHERE id = ${s.userId}`;
        const customerId = rows[0]?.stripe_customer_id as string;
        if (!customerId) return;
        const stripe = getStripe();
        const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3005";
        const portal = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${origin}/account` });
        rd(portal.url);
      }}
    >
      <button type="submit" className="flex-shrink-0 text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-xl transition-all">
        Manage billing →
      </button>
    </form>
  );
}

function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { clearAuthCookie: cc } = await import("@/lib/auth");
        const { redirect: rd } = await import("next/navigation");
        await cc();
        rd("/");
      }}
    >
      <button type="submit" className="text-sm font-semibold text-red-600 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-all">
        Sign out
      </button>
    </form>
  );
}
