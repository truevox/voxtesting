/**
 * Testing Mode Banner Component
 *
 * Displays a prominent warning banner indicating the site is in testing mode.
 * Can be controlled via NEXT_PUBLIC_TESTING_MODE environment variable.
 *
 * Default: ON (shows banner)
 * Set NEXT_PUBLIC_TESTING_MODE=false to hide
 */

'use client';

export default function TestingBanner() {
  // Default to true (show banner) unless explicitly set to 'false'
  const isTestingMode = process.env.NEXT_PUBLIC_TESTING_MODE !== 'false';

  if (!isTestingMode) {
    return null;
  }

  return (
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
  );
}
