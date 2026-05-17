// ============================================
// Academic OS — Priority Engine
// Weighted priority scoring algorithm
// ============================================

import { Task } from '@/types';
import { Locale, t, tf } from '@/lib/i18n';

export function calculatePriorityScore(
  task: Task,
  burnoutScore: number // 0-100
): number {
  const now = new Date();
  const burnoutNorm = burnoutScore / 100;

  // --- Urgency (0-1): exponential urgency as deadline approaches ---
  let urgency = 0.3; // default for no-deadline tasks
  if (task.deadline) {
    const hoursLeft = (new Date(task.deadline).getTime() - now.getTime()) / 3600000;
    if (hoursLeft <= 0) {
      urgency = 1.0; // overdue = max urgency
    } else {
      urgency = Math.max(0, Math.min(1, 1 - (hoursLeft / 168))); // 168h = 1 week
    }
  }

  // --- Impact (0-1): direct from user input ---
  const impact = (task.impact || 3) / 5;

  // --- Difficulty (0-1): adaptive based on burnout ---
  const rawDifficulty = (task.difficulty || 3) / 5;
  let difficulty: number;
  if (burnoutNorm > 0.6) {
    difficulty = 1 - rawDifficulty; // prefer easy tasks when burnt out
  } else {
    difficulty = rawDifficulty;
  }

  // --- Burnout Risk (0-1) ---
  const burnoutRisk = burnoutNorm;

  // --- Weighted Score ---
  const score =
    (urgency * 0.35) +
    (impact * 0.30) +
    (difficulty * 0.15) +
    (burnoutRisk * 0.20);

  return Math.round(score * 10000) / 10000;
}

export function recalculateAllPriorities(
  tasks: Task[],
  burnoutScore: number
): Task[] {
  return tasks.map(task => ({
    ...task,
    priorityScore: task.status === 'done' ? 0 : calculatePriorityScore(task, burnoutScore),
  }));
}

export function getUrgencyLabel(task: Task, locale: Locale = 'en'): { label: string; color: string } {
  if (!task.deadline) return { label: t('urgNoDeadline', locale), color: 'muted' };
  
  const hoursLeft = (new Date(task.deadline).getTime() - Date.now()) / 3600000;
  
  if (hoursLeft <= 0) return { label: t('urgOverdue', locale), color: 'danger' };
  if (hoursLeft <= 12) return { label: t('urgDueToday', locale), color: 'danger' };
  if (hoursLeft <= 24) return { label: t('urgDueTomorrow', locale), color: 'warning' };
  if (hoursLeft <= 72) return { label: tf<(d: number) => string>('urgDaysLeft', locale)(Math.ceil(hoursLeft / 24)), color: 'warning' };
  return { label: tf<(d: number) => string>('urgDaysLeft', locale)(Math.ceil(hoursLeft / 24)), color: 'sage' };
}

export function getDifficultyLabel(d: number, locale: Locale = 'en'): string {
  const keys: Record<number, string> = {
    1: 'diffEasy', 2: 'diffModerate', 3: 'diffMedium', 4: 'diffHard', 5: 'diffVeryHard',
  };
  const key = keys[d] || 'diffMedium';
  return t(key as any, locale);
}
