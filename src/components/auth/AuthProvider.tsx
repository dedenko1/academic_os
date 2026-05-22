'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/useAppStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((state) => state.setUser);
  const fetchTasks = useAppStore((state) => state.fetchTasks);
  const fetchCourses = useAppStore((state) => state.fetchCourses);
  const fetchBurnoutData = useAppStore((state) => state.fetchBurnoutData);
  const supabase = createClient();

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTasks();
        fetchCourses();
        fetchBurnoutData();
      }
    });

    // Listen for auth changes (login, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTasks();
        fetchCourses();
        fetchBurnoutData();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, setUser, fetchTasks, fetchCourses, fetchBurnoutData]);

  return <>{children}</>;
}
