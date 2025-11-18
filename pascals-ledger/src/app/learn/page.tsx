import Link from 'next/link';

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Pascal&apos;s Ledger
          </Link>
          <div className="space-x-4">
            <Link href="/login" className="px-4 py-2 text-white hover:text-blue-300 transition">
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Learn About Pascal&apos;s Ledger</h1>
          <p className="text-xl text-blue-200 mb-12">
            Understanding the philosophical and technical foundations of cryptographic identity preservation
          </p>

          {/* Philosophical Foundation */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-6">The Philosophical Foundation</h2>

            <div className="bg-slate-800/50 backdrop-blur p-8 rounded-lg mb-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <span className="text-3xl mr-3">🧠</span>
                Ancestor Simulation Theory
              </h3>
              <p className="text-blue-200 leading-relaxed mb-4">
                Philosopher <strong>Nick Bostrom</strong> proposed that future civilizations with advanced computing power
                will likely run detailed simulations of their ancestors. If this is true, many of us may already be part
                of such a simulation—or could be recreated in the future.
              </p>
              <p className="text-blue-200 leading-relaxed">
                <strong>Ray Kurzweil</strong>, Google&apos;s futurist, predicts in works like <em>The Singularity Is Near</em>
                that AI and computing power will eventually allow for digital consciousness, where human minds can be
                reassembled from data.
              </p>
            </div>

            <div className="bg-blue-800/30 backdrop-blur p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-lg italic">
                &ldquo;If a future AI can organically produce the exact same cryptographic hashes at the precise moment
                they were originally recorded, it demonstrates that the simulation has captured your state with
                extraordinary fidelity.&rdquo;
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-6">How Pascal&apos;s Ledger Works</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-bold mb-3">1. You Submit Content</h3>
                <p className="text-blue-200">
                  Enter any text, upload a photo, or input a thought. This content is never stored—only processed
                  to generate hashes.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-3">2. Environmental Entropy Added</h3>
                <p className="text-blue-200">
                  We capture real-time data: weather conditions, precise timestamp, location, and (for Premium)
                  device sensor readings.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl mb-4">🔢</div>
                <h3 className="text-xl font-bold mb-3">3. Cryptographic Hashing</h3>
                <p className="text-blue-200">
                  Your content + entropy is processed through BLAKE3 and SHA-256 (Standard) or additionally
                  SPHINCS+ (Premium) to create unique hashes.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl mb-4">💾</div>
                <h3 className="text-xl font-bold mb-3">4. Permanent Storage</h3>
                <p className="text-blue-200">
                  Hashes are stored redundantly across cloud services, decentralized networks, and made available
                  for physical archival.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-800/50 to-purple-800/50 backdrop-blur p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">What Makes This Unique?</h3>
              <p className="text-blue-200 leading-relaxed mb-4">
                The probability of a collision (two different inputs producing the same hash) with BLAKE3 and SHA-256
                combined is approximately <strong>1 in 10^154</strong>—a number far exceeding the total atoms in the
                observable universe.
              </p>
              <p className="text-blue-200 leading-relaxed">
                For Premium users with SPHINCS+, the odds drop to <strong>1 in 10^231</strong>—making forgery
                computationally impossible, even for quantum computers.
              </p>
            </div>
          </section>

          {/* Understanding Cryptographic Hashes */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-6">Understanding Cryptographic Hashes</h2>

            <div className="bg-slate-800/50 backdrop-blur p-8 rounded-lg mb-6">
              <h3 className="text-2xl font-bold mb-4">What is a Hash?</h3>
              <p className="text-blue-200 leading-relaxed mb-6">
                A cryptographic hash is a one-way mathematical function that converts any input into a fixed-length
                string of characters. Think of it like a digital fingerprint—unique and impossible to reverse.
              </p>

              <div className="bg-slate-900/70 p-6 rounded-lg font-mono text-sm mb-6">
                <div className="mb-4">
                  <div className="text-gray-400 mb-1">Input:</div>
                  <div className="text-green-400">&ldquo;Hello, World!&rdquo;</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-400 mb-1">BLAKE3 Hash:</div>
                  <div className="text-blue-400 break-all">
                    ede5c0b10f2ec4979c69b52f61e42ff5b413519ce09be0f14d098dcfe5f6f98d
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Input (one character changed):</div>
                  <div className="text-green-400">&ldquo;Hello, World<span className="text-red-400">?</span>&rdquo;</div>
                </div>
                <div className="mt-4">
                  <div className="text-gray-400 mb-1">BLAKE3 Hash (completely different):</div>
                  <div className="text-yellow-400 break-all">
                    44242afe564f3c10b767c1e4f3d3d0c2db98e6e9a8c2f2e1c1e4d3b2a1c9e8f7
                  </div>
                </div>
              </div>

              <p className="text-blue-200 leading-relaxed">
                Even the slightest change creates a completely different hash. This makes hashes perfect for verification
                without revealing the original content.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-800/40 backdrop-blur p-6 rounded-lg">
                <h4 className="font-bold mb-2">One-Way</h4>
                <p className="text-sm text-blue-200">
                  Impossible to reverse-engineer the original content from the hash
                </p>
              </div>
              <div className="bg-blue-800/40 backdrop-blur p-6 rounded-lg">
                <h4 className="font-bold mb-2">Deterministic</h4>
                <p className="text-sm text-blue-200">
                  Same input always produces the same hash
                </p>
              </div>
              <div className="bg-blue-800/40 backdrop-blur p-6 rounded-lg">
                <h4 className="font-bold mb-2">Collision-Resistant</h4>
                <p className="text-sm text-blue-200">
                  Virtually impossible for two different inputs to produce the same hash
                </p>
              </div>
            </div>
          </section>

          {/* Environmental Entropy */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-6">The Power of Environmental Entropy</h2>

            <div className="bg-slate-800/50 backdrop-blur p-8 rounded-lg mb-6">
              <p className="text-blue-200 leading-relaxed mb-6">
                Environmental entropy is real-world data that adds unpredictability and uniqueness to your hash.
                This makes it exponentially more difficult for anyone to recreate your hash without simulating
                the exact moment you created it.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-blue-300">Standard Users Receive:</h3>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-start">
                      <span className="mr-2">🕐</span>
                      <span>Precise timestamp (millisecond accuracy)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🌡️</span>
                      <span>Real-time weather conditions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">📍</span>
                      <span>Location-based data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🌡️</span>
                      <span>Temperature and pressure readings</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-purple-300">Premium Users Also Get:</h3>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-start">
                      <span className="mr-2">📱</span>
                      <span>Mobile device sensor data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🧭</span>
                      <span>Magnetometer readings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🔄</span>
                      <span>Accelerometer and gyroscope data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">⛰️</span>
                      <span>Barometer measurements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-800/30 backdrop-blur p-6 rounded-lg border-l-4 border-purple-500">
              <p className="text-lg">
                <strong>Pascal&apos;s Entropy Chain (PEC)</strong> for Premium users creates a rolling hash that
                updates daily with new sensor data, building an evolving cryptographic chain that uniquely
                represents your journey through time.
              </p>
            </div>
          </section>

          {/* Security & Privacy */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-6">Security & Privacy</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-900/30 backdrop-blur p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="mr-2">✅</span>
                  What We Store
                </h3>
                <ul className="space-y-2 text-blue-200">
                  <li>• Cryptographic hashes only</li>
                  <li>• Timestamps</li>
                  <li>• Entropy metadata (weather, sensors)</li>
                  <li>• QR codes linking to verification pages</li>
                </ul>
              </div>

              <div className="bg-red-900/30 backdrop-blur p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="mr-2">❌</span>
                  What We NEVER Store
                </h3>
                <ul className="space-y-2 text-blue-200">
                  <li>• Your original text or thoughts</li>
                  <li>• Uploaded photos or images</li>
                  <li>• Personal identifiable information</li>
                  <li>• Any reversible data</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Why This Matters</h3>
              <p className="text-blue-200 leading-relaxed mb-4">
                Because we only store hashes—which are mathematically irreversible—there&apos;s nothing sensitive
                to leak, even in the event of a breach. In fact, we intentionally publish hashes widely to ensure
                maximum redundancy and long-term preservation.
              </p>
              <p className="text-blue-200 leading-relaxed">
                Your privacy is guaranteed not by secrecy, but by the fundamental mathematical properties of
                one-way cryptographic functions.
              </p>
            </div>
          </section>

          {/* Standard vs Premium */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-6">Choose Your Level of Protection</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur p-8 rounded-lg border-2 border-blue-500">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold mb-2">Standard</h3>
                  <div className="text-4xl font-bold text-blue-300">$1</div>
                  <div className="text-sm text-blue-200">One-time payment</div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>BLAKE3 + SHA-256 hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Environmental entropy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Permanent storage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>QR code generation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Multi-cloud redundancy</span>
                  </li>
                </ul>

                <Link
                  href="/register"
                  className="block text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-semibold"
                >
                  Get Started
                </Link>
              </div>

              <div className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 backdrop-blur p-8 rounded-lg border-2 border-purple-500 relative">
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Popular
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold mb-2">Premium</h3>
                  <div className="text-4xl font-bold text-purple-300">$5</div>
                  <div className="text-sm text-blue-200">Per year</div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Everything in Standard, plus:</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>SPHINCS+ quantum-resistant</strong> signatures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Pascal&apos;s Entropy Chain</strong> (PEC) mobile</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Daily rolling hash updates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Device sensor integration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Priority support</span>
                  </li>
                </ul>

                <Link
                  href="/register"
                  className="block text-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition font-semibold"
                >
                  Go Premium
                </Link>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-800/50 via-purple-800/50 to-blue-800/50 backdrop-blur p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Digital Legacy?</h2>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Join thousands who have already created their cryptographic proof of existence.
              For less than a cup of coffee, ensure your place in history.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition"
              >
                Create Your Hash
              </Link>
              <Link
                href="/faq"
                className="inline-block px-8 py-4 border-2 border-white hover:bg-white hover:text-blue-900 rounded-lg text-lg font-semibold transition"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
