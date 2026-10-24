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
    <div className="flex min-h-screen items-center justify-center bg-surface-950 p-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-accent-500/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-2xl font-black text-white shadow-glow-brand">
              A
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-zinc-500">
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
            <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-zinc-400">
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
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-zinc-400">
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
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Signing in…
              </>
            ) : (
              'Sign In →'
            )}
          </button>

          <p className="text-center text-xs text-zinc-600">
            Access is restricted to authorized administrators only.
          </p>
        </form>

        <p className="mt-6 text-center">
          <a href="/" className="text-sm text-zinc-500 hover:text-brand-400 transition-colors">
            ← Back to Portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
