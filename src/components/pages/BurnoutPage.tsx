'use client';

import { useAppStore } from '@/stores/useAppStore';
import { getBurnoutLevel, getHeatmapColor, countOverdueTasks, countTasksDueIn48h } from '@/lib/burnout-engine';
import { t, tf, translateDay } from '@/lib/i18n';
import { colorClass } from '@/lib/color-map';

export function BurnoutPage() {
  const { weeklyBurnout, burnoutScore, tasks, isDark, locale } = useAppStore();
  const burnout = getBurnoutLevel(burnoutScore, locale);
  const overdueCount = countOverdueTasks(tasks);
  const dueIn48h = countTasksDueIn48h(tasks);

  const maxStudyHours = Math.max(...weeklyBurnout.map(d => d.studyHours), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('wellnessCheck', locale)}</h2>
        <p className="text-sm text-muted mt-0.5">{t('wellnessSubtitle', locale)}</p>
      </div>

      {/* Current Burnout Score */}
      <div className={`p-6 rounded-2xl border ${colorClass('bg-soft', burnout.color)} ${colorClass('border', burnout.color)} animate-slide-up`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider">{t('currentBurnoutRisk', locale)}</p>
            <p className={`text-4xl font-bold ${colorClass('text', burnout.color)} mt-1`}>
              {Math.round(burnoutScore)}
              <span className="text-lg font-normal text-muted">/100</span>
            </p>
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl
            ${colorClass('bg/10', burnout.color)} border-2 ${colorClass('border/30', burnout.color)}`}>
            {burnout.level === 'low' ? '😊' : burnout.level === 'moderate' ? '😐' : burnout.level === 'high' ? '😰' : '🆘'}
          </div>
        </div>
        <div className="w-full h-3 rounded-full bg-background/50 overflow-hidden">
          <div
            className={`h-full rounded-full ${colorClass('bg', burnout.color)} transition-all duration-1000`}
            style={{ width: `${burnoutScore}%` }}
          />
        </div>
        <p className="text-sm mt-3">{burnout.advice}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
        <StatCard
          icon="⚠️"
          label={t('statOverdue', locale)}
          value={String(overdueCount)}
          sub={t('statTasks', locale)}
          variant={overdueCount > 0 ? 'danger' : 'success'}
        />
        <StatCard
          icon="⏰"
          label={t('statDueIn48h', locale)}
          value={String(dueIn48h)}
          sub={t('statTasks', locale)}
          variant={dueIn48h > 3 ? 'warning' : 'success'}
        />
        <StatCard
          icon="📚"
          label={t('statAvgStudy', locale)}
          value={(weeklyBurnout.reduce((a, d) => a + d.studyHours, 0) / Math.max(weeklyBurnout.length, 1)).toFixed(1)}
          sub={t('statHrsDay', locale)}
          variant="default"
        />
        <StatCard
          icon="😴"
          label={t('statAvgSleep', locale)}
          value={(weeklyBurnout.reduce((a, d) => a + d.sleepHours, 0) / Math.max(weeklyBurnout.length, 1)).toFixed(1)}
          sub={t('statHrsNight', locale)}
          variant={
            weeklyBurnout.reduce((a, d) => a + d.sleepHours, 0) / Math.max(weeklyBurnout.length, 1) < 7
              ? 'warning'
              : 'success'
          }
        />
      </div>

      {/* Weekly Heatmap */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <h3 className="text-sm font-medium">{t('weeklyHeatmap', locale)}</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklyBurnout.map((day) => (
            <div
              key={day.day}
              className="rounded-xl p-3 text-center transition-all duration-300 hover:scale-105 cursor-default group relative"
              style={{ backgroundColor: getHeatmapColor(day.score, isDark) }}
            >
              <p className="text-xs font-semibold mb-1">{translateDay(day.day, locale)}</p>
              <p className="text-lg font-bold">{Math.round(day.score)}</p>
              <p className="text-[10px] text-muted">{day.studyHours}h {t('study', locale)}</p>
              <div className="hidden group-hover:block absolute z-10 mt-1 -ml-6 p-2 rounded-lg bg-surface border border-border shadow-lg text-left whitespace-nowrap">
                <p className="text-[10px]">{t('sleep', locale)}: {day.sleepHours}h</p>
                <p className="text-[10px]">{t('overdue', locale)}: {day.overdueCount}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 justify-center">
          <span className="text-[10px] text-muted">{t('heatmapLow', locale)}</span>
          {[10, 30, 50, 65, 80, 95].map((score) => (
            <div
              key={score}
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getHeatmapColor(score, isDark) }}
            />
          ))}
          <span className="text-[10px] text-muted">{t('heatmapCritical', locale)}</span>
        </div>
      </div>

      {/* Study Hours Bar Chart */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-sm font-medium">{t('dailyStudyHours', locale)}</h3>
        <div className="flex items-end gap-2 h-32">
          {weeklyBurnout.map((day) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1 h-full">
              <span className="text-[10px] font-medium text-muted">{day.studyHours}h</span>
              <div className="w-full flex-1 flex flex-col justify-end">
                <div
                  className="w-full rounded-t-lg bg-accent/20 transition-all duration-500 hover:bg-accent/40"
                  style={{ height: `${(day.studyHours / maxStudyHours) * 100}%`, minHeight: '4px' }}
                >
                  <div
                    className="w-full rounded-t-lg bg-accent transition-all duration-700"
                    style={{ height: `${Math.min(100, (day.studyHours / 8) * 100)}%`, minHeight: '2px' }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-medium">{translateDay(day.day, locale)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted text-center">{t('studyRecommendation', locale)}</p>
      </div>

      {/* Sleep Trend */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <h3 className="text-sm font-medium">{t('sleepPattern', locale)}</h3>
        <div className="flex items-end gap-2 h-24">
          {weeklyBurnout.map((day) => {
            const pct = (day.sleepHours / 9) * 100;
            const isLow = day.sleepHours < 7;
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1 h-full">
                <span className={`text-[10px] font-medium ${isLow ? 'text-danger' : 'text-muted'}`}>
                  {day.sleepHours}h
                </span>
                <div className="w-full flex-1 flex flex-col justify-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isLow ? 'bg-danger/30' : 'bg-sage/30'
                    }`}
                    style={{ height: `${pct}%`, minHeight: '4px' }}
                  />
                </div>
                <span className="text-[10px] font-medium">{translateDay(day.day, locale)}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted text-center">
          {weeklyBurnout.filter(d => d.sleepHours < 7).length > 3
            ? t('sleepDebtWarning', locale)
            : t('sleepOk', locale)}
        </p>
      </div>

      {/* Recommendations */}
      <div className="p-4 rounded-xl bg-surface border border-border animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-sm font-medium mb-3">{t('suggestions', locale)}</h3>
        <ul className="space-y-2 text-xs text-muted">
          {overdueCount > 0 && (
            <li className="flex items-start gap-2">
              <span className="text-danger">•</span>
              {tf<(n: number) => string>('sugOverdue', locale)(overdueCount)}
            </li>
          )}
          {weeklyBurnout[weeklyBurnout.length - 1]?.sleepHours < 7 && (
            <li className="flex items-start gap-2">
              <span className="text-warning">•</span>
              {t('sugSleepShort', locale)}
            </li>
          )}
          {burnoutScore > 50 && (
            <li className="flex items-start gap-2">
              <span className="text-sage">•</span>
              {t('sugNoStudy', locale)}
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            {t('sugFocusTasks', locale)}
          </li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, variant }: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  variant: 'default' | 'danger' | 'warning' | 'success';
}) {
  const colors = {
    default: 'bg-surface border-border',
    danger: 'bg-danger-soft border-danger/20',
    warning: 'bg-warning-soft border-warning/20',
    success: 'bg-success-soft border-success/20',
  };

  return (
    <div className={`p-3 rounded-xl border ${colors[variant]} text-center`}>
      <span className="text-lg">{icon}</span>
      <p className="text-lg font-bold mt-1">{value}</p>
      <p className="text-[10px] text-muted">{sub}</p>
      <p className="text-[10px] font-medium mt-0.5">{label}</p>
    </div>
  );
}
