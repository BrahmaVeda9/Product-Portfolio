'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    toast.success('Welcome back!');
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ background: '#590907' }}>
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: 'rgba(122,12,10,0.4)' }} />
        <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full blur-3xl" style={{ background: 'rgba(165,167,155,0.08)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black shadow-[0_8px_32px_rgba(89,9,7,0.5)]" style={{ background: '#E8D2B5', color: '#590907' }}>
              A
            </div>
          </div>
          <h1 className="text-2xl font-black" style={{ color: '#E8D2B5' }}>Admin Login</h1>
          <p className="mt-2 text-sm" style={{ color: 'rgba(232,210,181,0.5)' }}>
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Form */}
        <form
          id="admin-login-form"
          onSubmit={handleLogin}
          className="glass-card space-y-5 p-8"
        >
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-medium" style={{ color: 'rgba(232,210,181,0.65)' }}>
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium" style={{ color: 'rgba(232,210,181,0.65)' }}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E8D2B5]/20 border-t-[#E8D2B5]" />
                Signing in…
              </>
            ) : (
              'Sign In →'
            )}
          </button>

          <p className="text-center text-xs" style={{ color: 'rgba(232,210,181,0.3)' }}>
            Access is restricted to authorized administrators only.
          </p>
        </form>

        <p className="mt-6 text-center">
          <a href="/" className="text-sm transition-colors" style={{ color: 'rgba(232,210,181,0.4)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(232,210,181,0.75)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232,210,181,0.4)')}
          >
            ← Back to Portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
