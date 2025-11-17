'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'An error occurred');
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur p-8 rounded-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {mode === 'register' && (
              <p className="text-xs text-blue-300 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-blue-200">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                Login
              </Link>
            </p>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-300 hover:text-blue-200 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
