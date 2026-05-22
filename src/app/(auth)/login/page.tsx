'use client';

import { login } from '../actions';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { colorClass } from '@/lib/color-map';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-2xl mb-4">
            🧠
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted">Sign in to your Academic OS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className={`p-3 text-sm rounded-xl border ${colorClass('bg-soft', 'danger')} ${colorClass('border', 'danger')} ${colorClass('text', 'danger')}`}>
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted ml-1">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="student@university.edu"
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm
                focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted ml-1">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm
                focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-accent text-white rounded-xl font-medium text-sm mt-2
              hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm shadow-accent/20"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
