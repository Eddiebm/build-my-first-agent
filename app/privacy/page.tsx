import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 px-4 py-4">
        <Link href="/" className="font-bold text-slate-900">← Build My First Agent</Link>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">What we collect</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Account info</strong> — email and password hash when you sign up</li>
              <li><strong>Agent data</strong> — agent configurations, blueprints, and messages you create</li>
              <li><strong>Lead data</strong> — contact info captured by your agents (name, email, phone)</li>
              <li><strong>Usage data</strong> — message counts, publish status</li>
              <li><strong>Billing info</strong> — handled by Stripe; we only store your Stripe customer ID</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">How we use it</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Run your agents and deliver AI responses</li>
              <li>Send lead notifications to you when your agent captures a contact</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send transactional emails (password reset, billing alerts)</li>
              <li>Improve the service</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">Who we share data with</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>OpenRouter / Google Gemini</strong> — chat messages are sent to AI providers to generate responses</li>
              <li><strong>Stripe</strong> — billing and subscription management</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Neon</strong> — database hosting (US region)</li>
            </ul>
            <p className="mt-2">We don't sell your data. We don't share it with advertisers.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">Data retention</h2>
            <p>We keep your data as long as your account is active. You can request deletion by emailing us. We'll delete your account and all associated data within 30 days.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">Cookies</h2>
            <p>We use a single httpOnly cookie for authentication. No tracking cookies. No third-party ad cookies.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">Your rights</h2>
            <p>You can access, correct, or delete your data at any time. Email <a href="mailto:hello@buildmyfirstagent.com" className="text-brand-600 hover:underline">hello@buildmyfirstagent.com</a> to make a request.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">Contact</h2>
            <p><a href="mailto:hello@buildmyfirstagent.com" className="text-brand-600 hover:underline">hello@buildmyfirstagent.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
