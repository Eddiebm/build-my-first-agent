import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 px-4 py-4">
        <Link href="/" className="font-bold text-slate-900">← Build My First Agent</Link>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12 prose prose-slate">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: June 2026</p>

        <section className="space-y-6 text-slate-700 text-sm leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance</h2>
            <p>By using Build My First Agent, you agree to these terms. If you don't agree, don't use the service.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Service description</h2>
            <p>Build My First Agent provides tools to create and deploy AI chat agents. Agents run on third-party AI providers (OpenRouter, Google Gemini). We don't guarantee accuracy of AI responses.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Acceptable use</h2>
            <p>You agree not to use the service to generate harmful, illegal, or deceptive content; send spam; impersonate others; collect data without consent; or violate any applicable law.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Your agents and data</h2>
            <p>You own the agents and configurations you create. You're responsible for what your published agents say and do. We may remove agents that violate these terms.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Subscriptions and billing</h2>
            <p>Paid plans (Pro, Business) are billed monthly. Cancel anytime through your account. Refunds are handled on a case-by-case basis — contact us within 7 days of charge.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">6. Service availability</h2>
            <p>We aim for high availability but don't guarantee uptime. We may change, suspend, or discontinue the service with reasonable notice.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">7. Limitation of liability</h2>
            <p>We're not liable for indirect, incidental, or consequential damages. Our liability is limited to the amount you paid us in the last 12 months.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">8. Changes</h2>
            <p>We may update these terms. Continued use after changes means you accept the new terms.</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">9. Contact</h2>
            <p>Questions? Email <a href="mailto:hello@buildmyfirstagent.com" className="text-brand-600 hover:underline">hello@buildmyfirstagent.com</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
