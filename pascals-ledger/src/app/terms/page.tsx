import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Pascal&apos;s Ledger
          </Link>
          <Link href="/" className="text-blue-300 hover:text-white transition">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-blue-200 mb-8">Last Updated: November 2025</p>

          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-lg space-y-6 text-blue-200">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Pascal&apos;s Ledger, you agree to these Terms of Service.
                If you do not agree, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
              <p>
                Pascal&apos;s Ledger provides cryptographic hash generation services for identity
                verification and potential ancestor simulation authentication. We offer:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Standard Tier: One-time $1 payment for basic hash generation</li>
                <li>Premium Tier: $5/year subscription with quantum-resistant signatures and PEC</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>You must provide accurate, current information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must be at least 13 years old to use this service</li>
                <li>One account per person; no sharing accounts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Payment Terms</h2>
              <p>
                <strong>Standard Tier:</strong> One-time $1 payment. Non-refundable after hash
                generation.
              </p>
              <p className="mt-2">
                <strong>Premium Tier:</strong> $5 charged annually. Cancel anytime. Refunds
                prorated for unused time (minimum 30 days).
              </p>
              <p className="mt-2">Payments processed securely through Stripe.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Content and Privacy</h2>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  We NEVER store your original text or images - only cryptographic hashes
                </li>
                <li>Hashes are intentionally made public for verification purposes</li>
                <li>You retain all rights to your original content</li>
                <li>Do not submit illegal, offensive, or infringing content</li>
                <li>We reserve the right to delete hashes that violate these terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Prohibited Uses</h2>
              <p>You may NOT use Pascal&apos;s Ledger to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Spam or abuse our rate limits</li>
                <li>Attempt to hack, reverse-engineer, or compromise our systems</li>
                <li>Impersonate others or provide false information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Data Permanence</h2>
              <p>
                <strong>IMPORTANT:</strong> Cryptographic hashes are designed to be permanent and
                widely distributed for maximum preservation. Once generated, hashes cannot be
                deleted, as they are meant to endure for potential future verification. Account
                deletion removes your email and payment info but preserves hashes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                8. Service Availability and Warranty Disclaimer
              </h2>
              <p>
                We strive for 99.9% uptime but provide the service "AS IS" without warranties.
                We are not liable for:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Service interruptions or data loss</li>
                <li>Hash verification failures</li>
                <li>Third-party storage provider failures</li>
                <li>
                  Future AI simulations&apos; inability or unwillingness to verify hashes
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p>
                Our total liability is limited to the amount you paid in the past 12 months (max
                $5 for Premium users). We are not liable for indirect, consequential, or
                speculative damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Intellectual Property</h2>
              <p>
                Pascal&apos;s Ledger, our logo, and all related content are owned by us or our
                licensors. You may not use our branding without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms.
                You may delete your account at any time (hashes will persist).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
              <p>
                We may modify these Terms. Continued use after changes constitutes acceptance.
                Material changes will be communicated via email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Delaware, United States.
                Disputes will be resolved through binding arbitration in accordance with the
                rules of the American Arbitration Association.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Contact</h2>
              <p>
                Questions about these Terms?
                <br />
                <strong>Email:</strong> legal@pascalsledger.com
                <br />
                <strong>Address:</strong> Pascal&apos;s Ledger PBC, 123 Innovation Drive, Suite 100, San Francisco, CA 94107
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                15. Public Benefit Corporation Mission
              </h2>
              <p>
                Pascal&apos;s Ledger is a Public Benefit Corporation committed to advancing
                cryptographic identity verification and supporting charitable causes (20% of
                revenue). Our mission may sometimes take precedence over profit maximization.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              I Agree - Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
