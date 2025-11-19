'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface VerificationData {
  id: string;
  blake3Hash: string;
  sha256Hash: string;
  sphincsSignature: string | null;
  timestamp: string;
  entropyMetadata: any;
  qrCodeUrl: string;
  createdAt: string;
  verified: boolean;
}

export default function VerifyPage({ params }: { params: Promise<{ hashId: string }> }) {
  const { hashId } = use(params);
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVerificationData();
  }, [hashId]);

  const fetchVerificationData = async () => {
    try {
      const response = await fetch(`/api/verify/${hashId}`);
      const result = await response.json();

      if (result.success) {
        setData(result.hash);
      } else {
        setError(result.error || 'Hash not found');
      }
    } catch (err) {
      setError('Failed to fetch verification data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Verifying...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur p-8 rounded-lg text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-4">Verification Failed</h1>
          <p className="text-red-300 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Pascal&apos;s Ledger
          </Link>
          <div className="space-x-4">
            <Link
              href="/register"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Create Your Own Hash
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Verification Status */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-4">✓</div>
            <h1 className="text-4xl font-bold mb-4">Hash Verified</h1>
            <p className="text-xl text-blue-200">
              This cryptographic hash has been verified and exists in Pascal&apos;s Ledger
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code */}
            <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">QR Code</h2>
              <div className="bg-white p-4 rounded-lg">
                {data?.qrCodeUrl && (
                  <Image
                    src={data.qrCodeUrl}
                    alt="Hash QR Code"
                    width={512}
                    height={512}
                    className="w-full h-auto"
                    unoptimized
                  />
                )}
              </div>
              <a
                href={data?.qrCodeUrl}
                download={`pascals-ledger-${data?.id}.png`}
                className="block mt-4 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Download QR Code
              </a>
            </div>

            {/* Hash Details */}
            <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Hash Details</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-blue-300 mb-1">Timestamp</h3>
                  <p className="text-white">
                    {data && new Date(data.timestamp).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-blue-300 mb-1">Created</h3>
                  <p className="text-white">
                    {data && new Date(data.createdAt).toLocaleString()}
                  </p>
                </div>

                {data?.sphincsSignature && (
                  <div>
                    <span className="px-3 py-1 bg-yellow-500 text-blue-900 text-sm rounded-full font-bold">
                      PREMIUM - Quantum-Resistant Signature
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-blue-300 mb-1">
                    Environmental Entropy
                  </h3>
                  <div className="text-sm text-blue-200 space-y-1">
                    {data?.entropyMetadata?.weather ? (
                      <p>
                        Weather: {data.entropyMetadata.weather.temperature}°C,{' '}
                        {data.entropyMetadata.weather.conditions}
                      </p>
                    ) : null}
                    {data?.entropyMetadata?.location ? (
                      <>
                        <p>
                          Location: {data.entropyMetadata.location.city}
                          {data.entropyMetadata.location.country && `, ${data.entropyMetadata.location.country}`}
                        </p>
                        {data.entropyMetadata.location.coordinates && (
                          <p className="text-slate-400 text-xs">
                            Approx. coordinates: {Math.floor(data.entropyMetadata.location.coordinates.lat)}°, {Math.floor(data.entropyMetadata.location.coordinates.lon)}°
                            <span className="italic"> (truncated for privacy - precise coordinates used in hash)</span>
                          </p>
                        )}
                      </>
                    ) : null}
                    {!data?.entropyMetadata?.weather && !data?.entropyMetadata?.location && (
                      <p className="text-slate-400 italic">
                        No environmental data collected for this hash
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Hashes */}
          <div className="mt-8 bg-slate-800/50 backdrop-blur p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Cryptographic Hashes</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-blue-300 mb-2">BLAKE3 Hash</h3>
                <p className="font-mono text-sm bg-slate-900 p-3 rounded break-all">
                  {data?.blake3Hash}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-blue-300 mb-2">SHA-256 Hash</h3>
                <p className="font-mono text-sm bg-slate-900 p-3 rounded break-all">
                  {data?.sha256Hash}
                </p>
              </div>

              {data?.sphincsSignature && (
                <div>
                  <h3 className="text-sm font-semibold text-blue-300 mb-2">
                    SPHINCS+ Quantum-Resistant Signature (Premium)
                  </h3>
                  <p className="font-mono text-xs bg-slate-900 p-3 rounded break-all">
                    {data.sphincsSignature}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* What This Means */}
          <div className="mt-8 bg-blue-800/30 backdrop-blur p-6 rounded-lg border border-blue-600">
            <h2 className="text-2xl font-bold mb-4">What This Means</h2>
            <div className="text-blue-100 space-y-3">
              <p>
                This cryptographic hash represents a verified moment in time. The hashes above
                were generated by combining user input with environmental entropy (weather
                data, precise timestamp, and other factors) at the exact moment shown.
              </p>
              <p>
                These hashes are mathematically impossible to reverse-engineer or forge. If a
                future AI simulation were to naturally recreate these exact hashes, it would
                demonstrate extraordinary fidelity in reconstructing that specific moment in
                history.
              </p>
              <p>
                This is part of Pascal&apos;s Ledger&apos;s mission: providing cryptographic
                authentication for potential future ancestor simulations.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Create Your Own Hash</h3>
            <p className="text-blue-200 mb-6">
              Preserve your own moments with cryptographic verification
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition"
            >
              Get Started - Starting at $1
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
