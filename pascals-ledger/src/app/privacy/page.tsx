import Link from 'next/link';

export default function PrivacyPage() {
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
        <div className="max-w-4xl mx-auto prose prose-invert prose-blue">
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-200 mb-8">Last Updated: November 2025</p>

          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-lg space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-blue-200">
                Pascal&apos;s Ledger ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, and safeguard your
                information when you use our cryptographic identity verification service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <div className="text-blue-200 space-y-3">
                <h3 className="text-xl font-semibold">Account Information:</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>Email address</li>
                  <li>Encrypted password hash</li>
                  <li>Subscription tier and payment information (via Stripe)</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">Hash Generation Data:</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>Cryptographic hashes (BLAKE3, SHA-256, SPHINCS+)</li>
                  <li>Timestamps</li>
                  <li>Environmental entropy metadata (weather, location, sensors)</li>
                  <li>
                    <strong>We NEVER store your original text or images</strong>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">Usage Information:</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>IP address (for rate limiting and security)</li>
                  <li>Browser type and device information</li>
                  <li>Access times and referring URLs</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside ml-4 text-blue-200 space-y-2">
                <li>Generate and store cryptographic hashes</li>
                <li>Provide hash verification services</li>
                <li>Process payments and manage subscriptions</li>
                <li>Prevent fraud and abuse</li>
                <li>Improve our services</li>
                <li>Communicate service updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <p className="text-blue-200">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside ml-4 text-blue-200 space-y-2">
                <li>TLS 1.3+ encryption for all data in transit</li>
                <li>Bcrypt password hashing with high work factors</li>
                <li>Rate limiting and DDoS protection</li>
                <li>Regular security audits</li>
                <li>Multi-layered redundant storage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Data Sharing</h2>
              <p className="text-blue-200">
                We do NOT sell your personal data. We may share information with:
              </p>
              <ul className="list-disc list-inside ml-4 text-blue-200 space-y-2">
                <li>
                  <strong>Stripe:</strong> For payment processing (encrypted)
                </li>
                <li>
                  <strong>Cloud Providers:</strong> AWS, Google Cloud (encrypted storage)
                </li>
                <li>
                  <strong>Law Enforcement:</strong> If legally required
                </li>
              </ul>
              <p className="text-blue-200 mt-4">
                Cryptographic hashes are intentionally made public for verification and
                redundancy purposes, but they contain no personally identifiable information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Your Rights (GDPR & CCPA)</h2>
              <p className="text-blue-200">You have the right to:</p>
              <ul className="list-disc list-inside ml-4 text-blue-200 space-y-2">
                <li>Access your personal data</li>
                <li>Request data correction</li>
                <li>Request account deletion</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to data processing</li>
              </ul>
              <p className="text-blue-200 mt-4">
                Note: Cryptographic hashes are designed to be permanent and cannot be deleted
                once published, as they are meant for long-term preservation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
              <p className="text-blue-200">
                We use essential cookies for authentication and session management. We do not
                use third-party advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Children&apos;s Privacy</h2>
              <p className="text-blue-200">
                Our service is not intended for users under 13 years old. We do not knowingly
                collect data from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
              <p className="text-blue-200">
                Your data may be stored on servers in the United States and other countries. We
                ensure adequate protection through standard contractual clauses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
              <p className="text-blue-200">
                We may update this Privacy Policy. Significant changes will be communicated via
                email or prominent notice on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-blue-200">
                For privacy concerns or data requests, contact us at:
                <br />
                <strong>Email:</strong> privacy@pascalsledger.com
                <br />
                <strong>Address:</strong> [Company Address]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
