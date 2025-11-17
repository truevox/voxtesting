'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Hash {
  id: string;
  blake3Hash: string;
  sha256Hash: string;
  sphincsSignature: string | null;
  timestamp: string;
  entropyMetadata: any;
  qrCodeUrl: string;
  publicVerificationUrl: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  tier: 'standard' | 'premium';
  createdAt: string;
  subscriptionEndDate: string | null;
  pecEnabled: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [hashes, setHashes] = useState<Hash[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'image'>('text');
  const [textContent, setTextContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchHashes();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchHashes = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/hash/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setHashes(data.hashes);
      }
    } catch (err) {
      console.error('Error fetching hashes:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be less than 5MB');
        return;
      }
      setImageFile(file);
    }
  };

  const generateHash = async () => {
    setError('');
    setSuccess('');
    setGenerating(true);

    try {
      const token = localStorage.getItem('token');
      let imageData: string | undefined;

      if (inputType === 'image' && imageFile) {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const body: any = {
        inputType,
        content: inputType === 'text' ? textContent : undefined,
        imageData: inputType === 'image' ? imageData : undefined,
      };

      // Try to get location (with permission)
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          body.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (err) {
          console.log('Location access denied or unavailable');
        }
      }

      const response = await fetch('/api/hash/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Hash generated successfully!');
        setTextContent('');
        setImageFile(null);
        await fetchHashes();
      } else {
        setError(data.error || 'Failed to generate hash');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const upgradeToP premium = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier: 'premium' }),
      });

      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Error creating checkout:', err);
      setError('Failed to start checkout process');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
            <span className="text-blue-200">
              {user?.email} ({user?.tier})
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Tier Upgrade Banner */}
        {user?.tier === 'standard' && (
          <div className="bg-gradient-to-r from-yellow-600/30 to-blue-800/30 border-2 border-yellow-500 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                <p className="text-blue-200">
                  Get quantum-resistant signatures, PEC mobile features, and more for just $5/year
                </p>
              </div>
              <button
                onClick={upgradeToPremium}
                className="px-6 py-3 bg-yellow-500 text-blue-900 hover:bg-yellow-400 rounded-lg font-semibold transition"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Hash Generator */}
          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Generate New Hash</h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <div className="space-y-4">
              {/* Input Type Selection */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Input Type
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setInputType('text')}
                    className={`px-4 py-2 rounded-lg transition ${
                      inputType === 'text'
                        ? 'bg-blue-600'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => setInputType('image')}
                    className={`px-4 py-2 rounded-lg transition ${
                      inputType === 'image'
                        ? 'bg-blue-600'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    Image
                  </button>
                </div>
              </div>

              {/* Text Input */}
              {inputType === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Your Text
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    placeholder="Enter any text, thought, or message..."
                  />
                </div>
              )}

              {/* Image Input */}
              {inputType === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                  {imageFile && (
                    <p className="text-sm text-blue-300 mt-2">Selected: {imageFile.name}</p>
                  )}
                </div>
              )}

              <button
                onClick={generateHash}
                disabled={
                  generating ||
                  (inputType === 'text' && !textContent) ||
                  (inputType === 'image' && !imageFile)
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
              >
                {generating ? 'Generating...' : 'Generate Hash'}
              </button>

              <p className="text-xs text-blue-300">
                Your original content is never stored. Only cryptographic hashes are preserved.
              </p>
            </div>
          </div>

          {/* Hash History */}
          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Your Hashes ({hashes.length})</h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {hashes.length === 0 ? (
                <p className="text-blue-300 text-center py-8">
                  No hashes yet. Generate your first hash above!
                </p>
              ) : (
                hashes.map((hash) => (
                  <div
                    key={hash.id}
                    className="bg-slate-700/50 p-4 rounded-lg border border-slate-600"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-blue-300">
                        {new Date(hash.timestamp).toLocaleString()}
                      </span>
                      {hash.sphincsSignature && (
                        <span className="px-2 py-1 bg-yellow-500 text-blue-900 text-xs rounded-full font-bold">
                          PREMIUM
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-blue-400">BLAKE3:</span>
                        <p className="font-mono text-white break-all">
                          {hash.blake3Hash}
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-400">SHA-256:</span>
                        <p className="font-mono text-white break-all">
                          {hash.sha256Hash}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={hash.publicVerificationUrl}
                        target="_blank"
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                      >
                        View QR Code
                      </Link>
                      <a
                        href={hash.qrCodeUrl}
                        download={`pascals-ledger-${hash.id}.png`}
                        className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm transition"
                      >
                        Download QR
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
