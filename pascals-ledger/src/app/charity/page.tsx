import Link from 'next/link';
import TestingBanner from '@/components/TestingBanner';

export default function CharityPage() {
  const charities = [
    {
      name: 'Make-A-Wish Foundation',
      description: 'Granting wishes for children with critical illnesses',
      allocation: '4%',
      focus: 'Compassion & Hope',
    },
    {
      name: '350.org',
      description: 'Building a global grassroots climate movement',
      allocation: '4%',
      focus: 'Environmental Preservation',
    },
    {
      name: 'SENS Research Foundation',
      description: 'Developing rejuvenation biotechnologies to reverse aging',
      allocation: '4%',
      focus: 'Longevity & Health',
    },
    {
      name: 'The Long Now Foundation',
      description: 'Fostering long-term thinking and responsibility',
      allocation: '4%',
      focus: 'Future Thinking',
    },
    {
      name: "Child's Play",
      description: 'Improving lives of children in hospitals through games and technology',
      allocation: '2%',
      focus: 'Children & Technology',
    },
    {
      name: 'Internet Archive',
      description: 'Building a digital library of Internet sites and cultural artifacts',
      allocation: '2%',
      focus: 'Digital Preservation',
    },
  ];

  // Mock data - in production, this would come from your database
  const financials = {
    totalRevenue: '$12,450',
    charityTotal: '$2,490',
    operatingCosts: '$7,470',
    development: '$2,490',
    lastUpdated: 'November 17, 2025',
  };

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

      <TestingBanner />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Charitable Giving Transparency</h1>
          <p className="text-xl text-blue-200 mb-12">
            20% of all revenue supports organizations aligned with our mission
          </p>

          {/* Our Commitment */}
          <div className="bg-gradient-to-r from-blue-800/50 to-purple-800/50 backdrop-blur p-8 rounded-lg mb-12 border-2 border-blue-500">
            <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
            <p className="text-lg text-blue-100 mb-4">
              As a Public Benefit Corporation, Pascal&apos;s Ledger is legally committed to
              prioritizing social and environmental impact alongside profit. We allocate{' '}
              <strong>20% of all revenue</strong> to charitable causes that align with our
              values:
            </p>
            <ul className="list-disc list-inside ml-4 text-blue-100 space-y-2">
              <li>Long-term thinking and future preservation</li>
              <li>Environmental sustainability</li>
              <li>Longevity and health research</li>
              <li>Compassion and supporting those in need</li>
              <li>Digital preservation and access to knowledge</li>
            </ul>
          </div>

          {/* Financial Summary */}
          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-lg mb-12">
            <h2 className="text-3xl font-bold mb-6">Financial Summary</h2>
            <p className="text-sm text-blue-300 mb-6">
              Last Updated: {financials.lastUpdated}
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-blue-900/50 p-6 rounded-lg">
                <div className="text-sm text-blue-300 mb-2">Total Revenue (YTD)</div>
                <div className="text-3xl font-bold">{financials.totalRevenue}</div>
              </div>

              <div className="bg-green-900/50 p-6 rounded-lg border-2 border-green-500">
                <div className="text-sm text-blue-300 mb-2">Charitable Giving (20%)</div>
                <div className="text-3xl font-bold text-green-400">
                  {financials.charityTotal}
                </div>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-lg">
                <div className="text-sm text-blue-300 mb-2">Operating Costs (60%)</div>
                <div className="text-3xl font-bold">{financials.operatingCosts}</div>
              </div>

              <div className="bg-blue-900/50 p-6 rounded-lg">
                <div className="text-sm text-blue-300 mb-2">Development (20%)</div>
                <div className="text-3xl font-bold">{financials.development}</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-800/30 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>Note:</strong> As a Public Benefit Corporation, we prioritize
                transparency and mission over profit maximization. All financial data is
                updated quarterly and independently audited annually.
              </p>
            </div>
          </div>

          {/* Supported Charities */}
          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-lg mb-12">
            <h2 className="text-3xl font-bold mb-6">Supported Organizations</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {charities.map((charity, index) => (
                <div key={index} className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{charity.name}</h3>
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full font-bold">
                      {charity.allocation}
                    </span>
                  </div>
                  <p className="text-blue-200 mb-3">{charity.description}</p>
                  <div className="text-sm text-blue-400">
                    <strong>Focus Area:</strong> {charity.focus}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donation Timeline */}
          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-lg mb-12">
            <h2 className="text-3xl font-bold mb-6">Donation Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-lg font-bold">Q4 2025 - $2,490 Distributed</div>
                  <p className="text-blue-200">
                    First quarterly distribution across all six partner organizations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-lg font-bold">Q1 2026 - Upcoming</div>
                  <p className="text-blue-200">Next distribution scheduled for March 2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Stories */}
          <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Why These Organizations?</h2>
            <p className="text-lg text-blue-100 mb-6">
              Pascal&apos;s Ledger is built on the philosophy of long-term thinking and
              preserving human identity for the future. Our charitable partners share this
              vision:
            </p>
            <ul className="space-y-3 text-blue-100">
              <li>
                <strong>Future Preservation:</strong> Long Now and Internet Archive ensure
                knowledge and culture endure
              </li>
              <li>
                <strong>Scientific Progress:</strong> SENS Foundation advances longevity
                research so more people can experience the future
              </li>
              <li>
                <strong>Environmental Stewardship:</strong> 350.org fights to preserve Earth
                for future generations
              </li>
              <li>
                <strong>Compassion Today:</strong> Make-A-Wish and Child&apos;s Play bring
                joy and hope to those who need it now
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Your Hash Supports This Mission
            </h3>
            <p className="text-blue-200 mb-6">
              Every dollar you spend on Pascal&apos;s Ledger contributes to a better future
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
