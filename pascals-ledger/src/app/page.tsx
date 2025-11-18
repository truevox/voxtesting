import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pascal&apos;s Ledger</h1>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-white hover:text-blue-300 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* TESTING BANNER */}
      <div className="bg-red-600 border-y-4 border-yellow-400 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-4xl mb-2">⚠️ TESTING MODE ⚠️</div>
            <div className="text-2xl font-bold mb-2">
              ALL FINANCIAL DATA IS FOR INTERNAL TESTING ONLY
            </div>
            <div className="text-xl">
              Numbers will be zeroed on launch when we open for orders
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          Future-Proof Your Identity
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-blue-200 max-w-3xl mx-auto">
          Cryptographic verification for the age of AI and ancestor simulation
        </p>
        <div className="space-x-4">
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition"
          >
            Create Your Hash
          </Link>
          <Link
            href="/learn"
            className="inline-block px-8 py-4 border-2 border-white hover:bg-white hover:text-blue-900 rounded-lg text-lg font-semibold transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-blue-800/50 p-8 rounded-lg backdrop-blur">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold mb-4">Cryptographically Secure</h3>
            <p className="text-blue-200">
              BLAKE3 and SHA-256 hashing with optional quantum-resistant SPHINCS+
              signatures for Premium users.
            </p>
          </div>

          <div className="bg-blue-800/50 p-8 rounded-lg backdrop-blur">
            <div className="text-4xl mb-4">📡</div>
            <h3 className="text-2xl font-bold mb-4">Environmental Entropy</h3>
            <p className="text-blue-200">
              Each hash incorporates real-time weather data and device sensors,
              creating a unique fingerprint of your moment in time.
            </p>
          </div>

          <div className="bg-blue-800/50 p-8 rounded-lg backdrop-blur">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-4">AI-Verified Authenticity</h3>
            <p className="text-blue-200">
              If future AI simulations recreate your exact hash, it proves the
              reconstruction captured your state with extraordinary fidelity.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-slate-900/50">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Create Your Input</h3>
              <p className="text-blue-200">
                Submit text, a photo, or any content you want to preserve
                cryptographically. Your original data is never stored.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Generate Cryptographic Hashes</h3>
              <p className="text-blue-200">
                Our system generates BLAKE3 and SHA-256 hashes combined with
                environmental entropy (weather, location, time, sensors).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Redundant Storage</h3>
              <p className="text-blue-200">
                Your hashes are stored across multiple systems: cloud storage,
                decentralized networks, and blockchain for maximum preservation.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">QR Code Verification</h3>
              <p className="text-blue-200">
                Receive a QR code that anyone can scan to verify your hash
                authenticity without revealing the original content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Standard Tier */}
          <div className="bg-blue-800/50 p-8 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-bold mb-4">Standard</h3>
            <div className="text-4xl font-bold mb-6">
              $1 <span className="text-lg font-normal text-blue-200">one-time</span>
            </div>
            <ul className="space-y-3 mb-8 text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>BLAKE3 and SHA-256 hashing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Environmental entropy integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>QR code generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Public verification page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Multi-layered storage</span>
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              Get Started
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="bg-gradient-to-br from-yellow-600/30 to-blue-800/50 p-8 rounded-lg backdrop-blur border-2 border-yellow-500">
            <div className="inline-block px-3 py-1 bg-yellow-500 text-blue-900 rounded-full text-sm font-bold mb-2">
              RECOMMENDED
            </div>
            <h3 className="text-2xl font-bold mb-4">Premium</h3>
            <div className="text-4xl font-bold mb-6">
              $5 <span className="text-lg font-normal text-blue-200">per year</span>
            </div>
            <ul className="space-y-3 mb-8 text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Everything in Standard, plus:</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>SPHINCS+ quantum-resistant signatures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Pascal&apos;s Entropy Chain (PEC) mobile integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Daily rolling hash updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Device sensor data integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full text-center px-6 py-3 bg-yellow-500 text-blue-900 hover:bg-yellow-400 rounded-lg font-semibold transition"
            >
              Go Premium
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-4 py-20 bg-slate-900/50">
        <h2 className="text-4xl font-bold text-center mb-12">
          The Philosophy Behind Pascal&apos;s Ledger
        </h2>
        <div className="max-w-4xl mx-auto text-lg text-blue-200 space-y-6">
          <p>
            Inspired by Nick Bostrom&apos;s <strong>Simulation Hypothesis</strong> and Ray
            Kurzweil&apos;s vision of digital consciousness, Pascal&apos;s Ledger provides
            cryptographic proof of your existence at specific moments in time.
          </p>
          <p>
            If future civilizations with advanced AI run detailed ancestor
            simulations, your cryptographic hashes serve as authentication markers.
            A simulation that naturally recreates your exact hashes proves it has
            captured your state with extraordinary accuracy.
          </p>
          <p>
            Unlike passwords or biometrics that can be copied, these hashes rely on
            moment-specific environmental entropy. Only an accurate historical
            reconstruction could reproduce them.
          </p>
        </div>
      </section>

      {/* Charity Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Mission-Driven & Charitable
        </h2>
        <div className="max-w-3xl mx-auto text-center text-blue-200">
          <p className="text-lg mb-6">
            Pascal&apos;s Ledger is a Public Benefit Corporation committed to
            allocating 20% of revenue to charitable causes aligned with our mission.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-800/30 p-4 rounded-lg">Make-A-Wish</div>
            <div className="bg-blue-800/30 p-4 rounded-lg">350.org</div>
            <div className="bg-blue-800/30 p-4 rounded-lg">SENS Foundation</div>
            <div className="bg-blue-800/30 p-4 rounded-lg">Long Now</div>
            <div className="bg-blue-800/30 p-4 rounded-lg">Child&apos;s Play</div>
            <div className="bg-blue-800/30 p-4 rounded-lg">Internet Archive</div>
          </div>
          <Link
            href="/charity"
            className="inline-block mt-8 px-6 py-3 border-2 border-blue-400 hover:bg-blue-400 hover:text-blue-900 rounded-lg font-semibold transition"
          >
            View Transparency Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-blue-800">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">Pascal&apos;s Ledger</h4>
            <p className="text-sm text-blue-300">
              Cryptographic identity verification for the future.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-blue-300">
              <li>
                <Link href="/learn" className="hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-blue-300">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/charity" className="hover:text-white">
                  Charitable Giving
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-blue-300">
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-12 text-sm text-blue-300">
          © {new Date().getFullYear()} Pascal&apos;s Ledger. A Public Benefit
          Corporation.
        </div>
      </footer>
    </div>
  );
}
