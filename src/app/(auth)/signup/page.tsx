'use client';

import { signup } from '../actions';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { colorClass } from '@/lib/color-map';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-sage/10 rounded-2xl flex items-center justify-center text-2xl mb-4">
            🎓
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
          <p className="text-sm text-muted">Start executing your academic work</p>
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
                focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted ml-1">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Create a strong password"
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm
                focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-sage text-white rounded-xl font-medium text-sm mt-2
              hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm shadow-sage/20"
          >
            {isPending ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-sage font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
