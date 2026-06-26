import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, clearAuthCookie } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/auth/signin?next=/account");

  const sql = getDb();
  const rows = await sql`SELECT plan, stripe_customer_id, created_at FROM users WHERE id = ${session.userId}`;
  const user = rows[0];

  const isPro = user?.plan === "pro";

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/dashboard" className="font-extrabold text-slate-900">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Account</h1>

        {/* Profile */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
              {session.email[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{session.email}</p>
              <p className="text-sm text-slate-500">
                Member since {new Date(user?.created_at as string).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </section>

        {/* Plan */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 text-lg">
                {isPro ? "Pro" : "Free"} Plan
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                {isPro ? "$15/month · Cancel anytime" : "Free forever"}
              </p>
            </div>
            {isPro ? (
              <BillingPortalButton />
            ) : (
              <Link
                href="/pricing"
                className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                Upgrade to Pro →
              </Link>
            )}
          </div>
          {!isPro && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                Pro unlocks: export blueprints, live AI chat, unlimited saved agents.
              </p>
            </div>
          )}
        </section>

        {/* Sign out */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
            Session
          </h2>
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
        const portal = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: `${origin}/account`,
        });
        rd(portal.url);
      }}
    >
      <button
        type="submit"
        className="text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-lg transition-all"
      >
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
      <button
        type="submit"
        className="text-sm font-semibold text-red-600 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-all"
      >
        Sign out
      </button>
    </form>
  );
}

// suppress unused import warning
void clearAuthCookie;
