'use client';

import { useAppStore } from '@/stores/useAppStore';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/components/pages/HomePage';
import { TasksPage } from '@/components/pages/TasksPage';
import { BurnoutPage } from '@/components/pages/BurnoutPage';

export default function Home() {
  const activeTab = useAppStore((s) => s.activeTab);

  return (
    <AppShell>
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'tasks' && <TasksPage />}
      {activeTab === 'burnout' && <BurnoutPage />}
    </AppShell>
  );
}
