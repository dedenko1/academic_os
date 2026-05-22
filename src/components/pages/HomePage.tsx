'use client';

import { useAppStore } from '@/stores/useAppStore';
import { recommendNextTask, getGreeting, getTimeContext } from '@/lib/recommendation-engine';
import { getBurnoutLevel } from '@/lib/burnout-engine';
import { getCourseCode, getCourseColor } from '@/lib/mock-data';
import { getDifficultyLabel, getUrgencyLabel } from '@/lib/priority-engine';
import { t } from '@/lib/i18n';
import { colorClass } from '@/lib/color-map';
import { EnergyLevel } from '@/types';
import { useState } from 'react';

const TIME_OPTIONS = [15, 25, 45, 60, 90, 120];

export function HomePage() {
  const {
    tasks, currentEnergy, setEnergy, availableMinutes, setAvailableMinutes,
    burnoutScore, updateTaskStatus, locale, skipRecommendation, acceptRecommendation
  } = useAppStore();
  const [isWorking, setIsWorking] = useState(false);

  const recommendation = recommendNextTask(tasks, currentEnergy, availableMinutes, burnoutScore, locale);
  const burnout = getBurnoutLevel(burnoutScore, locale);
  const focusTasks = tasks.filter(t => t.isFocusTask && t.status !== 'done');

  const ENERGY_EMOJIS: { level: EnergyLevel; emoji: string; label: string }[] = [
    { level: 1, emoji: '😫', label: t('energyExhausted', locale) },
    { level: 2, emoji: '😕', label: t('energyLow', locale) },
    { level: 3, emoji: '😐', label: t('energyOkay', locale) },
    { level: 4, emoji: '🙂', label: t('energyGood', locale) },
    { level: 5, emoji: '⚡', label: t('energyEnergized', locale) },
  ];

  const handleStartWorking = () => {
    if (recommendation.task) {
      acceptRecommendation(recommendation.task.id);
      updateTaskStatus(recommendation.task.id, 'in_progress');
      setIsWorking(true);
    }
  };

  const handleSkip = () => {
    if (recommendation.task) {
      skipRecommendation(recommendation.task.id);
    }
  };

  const handleDone = () => {
    if (recommendation.task) {
      updateTaskStatus(recommendation.task.id, 'done');
      setIsWorking(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {getGreeting(locale)}.
        </h2>
        <p className="text-sm text-muted">{getTimeContext(locale)}</p>
      </div>

      {/* === CORE: Recommendation Card === */}
      <div className={`relative overflow-hidden rounded-2xl p-6 animate-slide-up ${
        recommendation.type === 'break'
          ? 'bg-sage-soft border border-sage/20'
          : recommendation.type === 'task'
          ? 'glass border border-accent/20 shadow-lg shadow-accent/5'
          : 'bg-surface border border-border'
      }`}>
        {/* Decorative gradient */}
        {recommendation.type === 'task' && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full" />
        )}

        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {recommendation.type === 'break' ? '🌿' : recommendation.type === 'task' ? '🎯' : '✨'}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {recommendation.type === 'break'
                ? t('takeABreak', locale)
                : recommendation.type === 'task'
                ? t('doThisNow', locale)
                : t('allClear', locale)}
            </span>
          </div>

          <p className="text-lg sm:text-xl font-semibold leading-snug pr-8">
            {recommendation.message}
          </p>
          
          {/* Batched Subtasks UI */}
          {recommendation.suggestedSubtasks && recommendation.suggestedSubtasks.length > 1 && (
            <div className="mt-2 pl-3 border-l-2 border-accent/30 space-y-2">
              {recommendation.suggestedSubtasks.map((st, i) => (
                <div key={st.id} className="flex items-center gap-2 text-sm">
                  <span className="text-accent/70 font-medium">{i + 1}.</span>
                  <span className="font-medium">{st.title}</span>
                  <span className="text-xs text-muted">({st.estimatedMinutes}m)</span>
                </div>
              ))}
            </div>
          )}

          {recommendation.task && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className="px-2 py-1 rounded-md font-medium"
                style={{
                  backgroundColor: getCourseColor(recommendation.task.courseId) + '18',
                  color: getCourseColor(recommendation.task.courseId),
                }}
              >
                {getCourseCode(recommendation.task.courseId)}
              </span>
              <span className="px-2 py-1 rounded-md bg-surface text-muted">
                ~{recommendation.task.estimatedMinutes} min
              </span>
              <span className="px-2 py-1 rounded-md bg-surface text-muted">
                {getDifficultyLabel(recommendation.task.difficulty, locale)}
              </span>
              {(() => {
                const u = getUrgencyLabel(recommendation.task!, locale);
                return (
                  <span className={`px-2 py-1 rounded-md font-medium ${colorClass('bg-soft', u.color)} ${colorClass('text', u.color)}`}>
                    {u.label}
                  </span>
                );
              })()}
            </div>
          )}

          <p className="text-sm text-muted leading-relaxed">
            {recommendation.reason}
          </p>

          {recommendation.type === 'task' && (
            <div className="flex flex-wrap gap-3 pt-1">
              {!isWorking ? (
                <>
                  <button
                    onClick={handleStartWorking}
                    className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium text-sm
                      hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-md shadow-accent/20"
                  >
                    {t('startWorking', locale)}
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-5 py-2.5 bg-surface border border-border rounded-xl font-medium text-sm text-muted
                      hover:bg-surface-hover hover:text-foreground transition-all duration-150"
                  >
                    {locale === 'en' ? 'Skip / Another Option' : 'Lewati / Cari Opsi Lain'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleDone}
                    className="px-5 py-2.5 bg-success text-white rounded-xl font-medium text-sm
                      hover:opacity-90 active:scale-[0.98] transition-all duration-150"
                  >
                    {t('markComplete', locale)}
                  </button>
                  <button
                    onClick={() => setIsWorking(false)}
                    className="px-5 py-2.5 bg-surface border border-border rounded-xl font-medium text-sm
                      hover:bg-surface-hover transition-all duration-150"
                  >
                    {t('pause', locale)}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Energy Picker */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <label className="text-sm font-medium">{t('howsYourEnergy', locale)}</label>
        <div className="flex gap-2">
          {ENERGY_EMOJIS.map(({ level, emoji, label }) => (
            <button
              key={level}
              onClick={() => setEnergy(level)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-200 ${
                currentEnergy === level
                  ? 'bg-accent-soft border-2 border-accent scale-105 shadow-sm'
                  : 'bg-surface border border-border hover:bg-surface-hover hover:scale-[1.02]'
              }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-[10px] font-medium text-muted">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Available Time */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <label className="text-sm font-medium">{t('availableTime', locale)}</label>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((min) => (
            <button
              key={min}
              onClick={() => setAvailableMinutes(min)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                availableMinutes === min
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface border border-border text-muted hover:bg-surface-hover hover:text-foreground'
              }`}
            >
              {min < 60 ? `${min}m` : `${min / 60}h`}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Focus */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{t('todaysFocus', locale)}</h3>
          <span className="text-xs text-muted">{focusTasks.length}/3 {t('slots', locale)}</span>
        </div>
        {focusTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger-children">
            {focusTasks.map((task) => {
              const urgency = getUrgencyLabel(task, locale);
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-surface border border-border hover:border-accent/30 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: getCourseColor(task.courseId) }}
                    />
                    <span className={`text-[10px] font-medium ${colorClass('text', urgency.color)}`}>
                      {urgency.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {getCourseCode(task.courseId)} · {task.estimatedMinutes}m
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted p-4 bg-surface rounded-xl border border-border text-center">
            {t('noFocusTasks', locale)}
          </p>
        )}
      </div>

      {/* Burnout Indicator */}
      <div className={`p-4 rounded-xl border animate-slide-up ${colorClass('bg-soft', burnout.color)} ${colorClass('border', burnout.color)}`} style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{t('burnoutRisk', locale)}</span>
          <span className={`text-sm font-bold ${colorClass('text', burnout.color)}`}>
            {Math.round(burnoutScore)}/100 · {burnout.label}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-border/50 overflow-hidden">
          <div
            className={`h-full rounded-full ${colorClass('bg', burnout.color)} transition-all duration-700`}
            style={{ width: `${burnoutScore}%` }}
          />
        </div>
        <p className="text-xs text-muted mt-2">{burnout.advice}</p>
      </div>
    </div>
  );
}
