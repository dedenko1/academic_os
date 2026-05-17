'use client';

import { useAppStore } from '@/stores/useAppStore';
import { t } from '@/lib/i18n';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab, isDark, toggleDark, toggleLocale, locale, burnoutScore } = useAppStore();

  const tabs = [
    { key: 'home' as const, label: t('tabFocus', locale), icon: '🎯' },
    { key: 'tasks' as const, label: t('tabTasks', locale), icon: '📋' },
    { key: 'burnout' as const, label: t('tabWellness', locale), icon: '💚' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <h1 className="text-base font-semibold tracking-tight">Academic OS</h1>
          </div>
          <div className="flex items-center gap-2">
            {burnoutScore > 60 && (
              <span className="text-xs px-2 py-1 rounded-full bg-danger-soft text-danger font-medium animate-pulse-gentle">
                🔥 {t('burnoutBadge', locale)} {Math.round(burnoutScore)}
              </span>
            )}
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="h-8 px-2 rounded-lg flex items-center justify-center hover:bg-surface-hover transition-colors text-xs font-semibold border border-border gap-1"
              aria-label="Toggle language"
            >
              🌐 {locale === 'en' ? 'ID' : 'EN'}
            </button>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-hover transition-colors text-sm"
              aria-label="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex justify-around items-center h-16">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'text-accent scale-105'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
                {activeTab === tab.key && (
                  <div className="w-1 h-1 rounded-full bg-accent animate-fade-in-scale" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
