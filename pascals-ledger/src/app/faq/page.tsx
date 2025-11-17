import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is Pascal\'s Ledger?',
      answer:
        'Pascal\'s Ledger is a cryptographic identity verification service based on ancestor simulation theory. We generate timestamped, cryptographic hashes (BLAKE3, SHA-256, and optionally SPHINCS+) combined with environmental entropy to create unforgeable proof of your existence at specific moments in time.',
    },
    {
      question: 'How does this help with ancestor simulation?',
      answer:
        'If future AI civilizations run detailed ancestor simulations, your cryptographic hashes serve as authentication markers. A simulation that naturally recreates your exact hashes proves it has captured your state with extraordinary accuracy, since these hashes incorporate moment-specific entropy that cannot be forged.',
    },
    {
      question: 'What data do you store?',
      answer:
        'We only store cryptographic hashes, timestamps, and entropy metadata (weather data, sensor readings). We NEVER store your original text or images. Hashes are one-way transformations - mathematically impossible to reverse-engineer.',
    },
    {
      question: 'What\'s the difference between Standard and Premium tiers?',
      answer:
        'Standard ($1 one-time) includes BLAKE3 and SHA-256 hashing with environmental entropy. Premium ($5/year) adds SPHINCS+ quantum-resistant signatures, Pascal\'s Entropy Chain (PEC) mobile integration, daily rolling hash updates with device sensors, and priority support.',
    },
    {
      question: 'What is Pascal\'s Entropy Chain (PEC)?',
      answer:
        'PEC is our Premium mobile feature that generates rolling hashes using your device sensors (accelerometer, gyroscope, magnetometer, etc.). You can update your hash once per day, creating an evolving cryptographic chain that uniquely represents your journey through time.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes. We use industry-standard encryption (TLS 1.3+), secure hashing algorithms (BLAKE3, SHA-256), and optional quantum-resistant SPHINCS+ signatures. Since we don\'t store original content, there\'s nothing sensitive to leak. Hashes are intentionally published for redundancy.',
    },
    {
      question: 'What is a cryptographic hash?',
      answer:
        'A cryptographic hash is a one-way mathematical function that converts input data into a fixed-length string of characters. Even the slightest change in input produces a completely different hash. This makes them perfect for verification without revealing the original content.',
    },
    {
      question: 'How is environmental entropy used?',
      answer:
        'We incorporate real-time data (weather conditions, temperature, pressure, precise timestamp, location, device sensors) into your hash. This creates a unique fingerprint that can only be recreated by accurately simulating that exact moment in history.',
    },
    {
      question: 'Can I cancel my Premium subscription?',
      answer:
        'Yes, you can cancel anytime. Your existing hashes persist forever, but you won\'t be able to generate new Premium hashes or use PEC features after your subscription ends.',
    },
    {
      question: 'How are my hashes stored long-term?',
      answer:
        'We use multi-layered redundant storage: cloud services (AWS S3, Google Cloud), decentralized networks (IPFS preparation), and downloadable certificates for physical archival (M-DISC, laser etching, archival paper).',
    },
    {
      question: 'Can I delete my hashes?',
      answer:
        'Once published, hashes are designed to be permanent and widely distributed for maximum preservation. You can delete your account, but hashes will remain in our system as they\'re meant to endure for potential future verification.',
    },
    {
      question: 'What is SPHINCS+?',
      answer:
        'SPHINCS+ is a quantum-resistant digital signature scheme. Unlike traditional cryptography that could be broken by future quantum computers, SPHINCS+ remains secure even against quantum attacks. It\'s available for Premium users.',
    },
    {
      question: 'How does the QR code work?',
      answer:
        'Every hash generates a unique QR code linking to a public verification page. Anyone can scan it to verify your hash\'s authenticity without seeing your original content. Perfect for sharing proof of creation or identity.',
    },
    {
      question: 'Is Pascal\'s Ledger a nonprofit?',
      answer:
        'We\'re a Public Benefit Corporation (PBC) with plans to transition to nonprofit status. We allocate 20% of revenue to charitable causes aligned with our mission (Make-A-Wish, 350.org, SENS Foundation, Long Now Foundation, etc.).',
    },
    {
      question: 'Can I use this for legal proof of creation?',
      answer:
        'While cryptographic timestamps provide strong evidence of when something existed, Pascal\'s Ledger is primarily designed for future ancestor simulation verification. Consult a lawyer for specific legal use cases.',
    },
    {
      question: 'What happens if Pascal\'s Ledger shuts down?',
      answer:
        'Your hashes are stored redundantly across multiple systems and are designed to outlast any single organization. We\'re working on decentralized storage solutions (IPFS, Arweave) to ensure perpetual preservation.',
    },
  ];

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-200 mb-12">
            Everything you need to know about Pascal&apos;s Ledger
          </p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-3">{faq.question}</h2>
                <p className="text-blue-200 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-blue-800/30 backdrop-blur p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-blue-200 mb-6">
              We&apos;re here to help. Reach out to our support team.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
