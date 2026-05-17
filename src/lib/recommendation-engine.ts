// ============================================
// Academic OS — Recommendation Engine
// "What Should I Do Now?" — Core Feature
// ============================================

import { Task, EnergyLevel, Recommendation } from '@/types';
import { Locale, t, tf } from '@/lib/i18n';
import { getDifficultyLabel } from './priority-engine';

export function recommendNextTask(
  tasks: Task[],
  energyLevel: EnergyLevel,
  availableMinutes: number,
  burnoutScore: number,
  locale: Locale = 'en'
): Recommendation {
  // If burnout is critical, recommend a break
  if (burnoutScore > 70) {
    return {
      type: 'break',
      task: null,
      message: t('recBreakMsg', locale),
      reason: tf<(n: number) => string>('recBreakReason', locale)(Math.round(burnoutScore)),
    };
  }

  // Filter to actionable tasks only
  const pending = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => b.priorityScore - a.priorityScore);

  if (pending.length === 0) {
    return {
      type: 'no_match',
      task: null,
      message: t('recAllClearMsg', locale),
      reason: t('recAllClearReason', locale),
    };
  }

  // Match energy level to max difficulty
  let maxDifficulty: number;
  if (energyLevel <= 2) {
    maxDifficulty = 2;
  } else if (energyLevel === 3) {
    maxDifficulty = 3;
  } else {
    maxDifficulty = 5;
  }

  // Filter by time and energy-appropriate difficulty
  const candidates = pending.filter(
    t => t.estimatedMinutes <= availableMinutes && t.difficulty <= maxDifficulty
  );

  // If no exact match, try without time filter
  if (candidates.length === 0) {
    const energyOnly = pending.filter(t => t.difficulty <= maxDifficulty);
    if (energyOnly.length > 0) {
      const best = energyOnly[0];
      // Find a subtask that fits the time
      const subtask = best.subtasks.find(
        s => s.status !== 'done' && s.estimatedMinutes <= availableMinutes
      );
      if (subtask) {
        return {
          type: 'task',
          task: best,
          message: tf<(t: string, m: number) => string>('recWorkOn', locale)(subtask.title, subtask.estimatedMinutes),
          reason: generateReason(best, energyLevel, burnoutScore, locale),
        };
      }
    }

    return {
      type: 'no_match',
      task: null,
      message: t('recNoMatchMsg', locale),
      reason: energyLevel <= 2
        ? t('recNoMatchLowEnergy', locale)
        : t('recNoMatchDefault', locale),
    };
  }

  const best = candidates[0];

  // Check if task has subtasks → recommend next incomplete subtask
  const nextSubtask = best.subtasks.find(s => s.status !== 'done');
  const actionMessage = nextSubtask
    ? tf<(t: string, m: number) => string>('recStartWith', locale)(nextSubtask.title, nextSubtask.estimatedMinutes)
    : tf<(t: string, m: number) => string>('recWorkOnTask', locale)(best.title, Math.min(best.estimatedMinutes, availableMinutes));

  return {
    type: 'task',
    task: best,
    message: actionMessage,
    reason: generateReason(best, energyLevel, burnoutScore, locale),
  };
}

function generateReason(task: Task, energy: EnergyLevel, burnout: number, locale: Locale): string {
  const parts: string[] = [];

  if (task.deadline) {
    const hoursLeft = (new Date(task.deadline).getTime() - Date.now()) / 3600000;
    if (hoursLeft <= 24) {
      parts.push(t('recReasonDueSoon', locale));
    } else if (hoursLeft <= 48) {
      parts.push(t('recReasonDeadline2d', locale));
    }
  }

  if (energy <= 2 && task.difficulty <= 2) {
    const diffLabel = getDifficultyLabel(task.difficulty, locale).toLowerCase();
    parts.push(tf<(d: string) => string>('recReasonLowEnergyMatch', locale)(diffLabel));
  } else if (energy >= 4 && task.difficulty >= 4) {
    parts.push(t('recReasonHighEnergy', locale));
  }

  if (burnout > 50) {
    parts.push(t('recReasonKeepShort', locale));
  }

  if (task.impact >= 4) {
    parts.push(t('recReasonHighImpact', locale));
  }

  return parts.join(' ') || t('recReasonDefault', locale);
}

export function getGreeting(locale: Locale = 'en'): string {
  const hour = new Date().getHours();
  if (hour < 6) return t('greetingLateNight', locale);
  if (hour < 12) return t('greetingMorning', locale);
  if (hour < 17) return t('greetingAfternoon', locale);
  if (hour < 21) return t('greetingEvening', locale);
  return t('greetingLateNight', locale);
}

export function getTimeContext(locale: Locale = 'en'): string {
  const hour = new Date().getHours();
  if (hour < 6) return t('timeCtxLateNight', locale);
  if (hour < 9) return t('timeCtxEarlyMorning', locale);
  if (hour < 12) return t('timeCtxPeakFocus', locale);
  if (hour < 14) return t('timeCtxPostLunch', locale);
  if (hour < 17) return t('timeCtxAfternoon', locale);
  if (hour < 20) return t('timeCtxEvening', locale);
  return t('timeCtxWindDown', locale);
}
