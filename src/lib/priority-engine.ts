// ============================================
// Academic OS — Priority & Execution Engine
// Behavioral execution probability model
// ============================================

import { Task, EnergyLevel } from '@/types';
import { Locale, t, tf, TranslationKey } from '@/lib/i18n';

// Base theoretical priority (Importance + Urgency)
export function calculateBasePriority(task: Task): number {
  const now = new Date();
  
  // Urgency (0-1)
  let urgency = 0.3;
  if (task.deadline) {
    const hoursLeft = (new Date(task.deadline).getTime() - now.getTime()) / 3600000;
    if (hoursLeft <= 0) urgency = 1.0;
    else urgency = Math.max(0, Math.min(1, 1 - (hoursLeft / 168))); // 1 week
  }

  // Impact (0-1)
  const impact = (task.impact || 3) / 5;

  return (urgency * 0.6) + (impact * 0.4);
}

// Execution Probability (Behavioral adaptation)
export function calculateExecutionProbability(
  task: Task,
  energy: EnergyLevel,
  burnoutScore: number,
  needsMomentum: boolean // e.g., user hasn't completed a task recently
): number {
  let score = calculateBasePriority(task);
  const burnoutNorm = burnoutScore / 100;

  // 1. Burnout Penalty: Heavily penalize long & difficult tasks if burnt out
  if (burnoutNorm > 0.5) {
    const complexityPenalty = (task.difficulty / 5) * (burnoutNorm * 0.5);
    const durationPenalty = Math.min(1, task.estimatedMinutes / 120) * (burnoutNorm * 0.5);
    score -= (complexityPenalty + durationPenalty);
  }

  // 2. Energy Fit Penalty: Penalize tasks that exceed current energy capacity
  if (task.difficulty > energy) {
    const energyDeficit = task.difficulty - energy;
    score -= (energyDeficit * 0.15); // E.g., energy 2, diff 5 -> 3 * 0.15 = 0.45 penalty
  } else if (energy >= 4 && task.difficulty >= 4) {
    score += 0.2; // Boost hard tasks when energy is high
  }

  // 3. Momentum Boost: If procrastinating, boost "quick wins"
  if (needsMomentum) {
    if (task.estimatedMinutes <= 20 && task.difficulty <= 2) {
      score += 0.4; // Massive boost for quick, easy tasks to break paralysis
    }
  }

  // 4. Avoidance Penalty: Diminishing returns for skipped tasks
  // Skip decay logic: If skipped recently, penalize. If skipped a long time ago, decay the penalty.
  let skipPenalty = 0;
  if (task.skipCount > 0) {
    let effectiveSkips = task.skipCount;
    if (task.lastSkippedAt) {
      const hoursSinceSkip = (new Date().getTime() - new Date(task.lastSkippedAt).getTime()) / 3600000;
      if (hoursSinceSkip > 12) {
        effectiveSkips = Math.max(0, task.skipCount - Math.floor(hoursSinceSkip / 12)); // Decay skip count over time
      }
    }
    // Exponential decay multiplier: 0.8^skips (e.g., 1 skip = 0.8x, 2 skips = 0.64x)
    const avoidanceMultiplier = Math.pow(0.8, effectiveSkips);
    score *= avoidanceMultiplier;
  }

  // Floor at 0.01 to prevent negative probabilities
  return Math.max(0.01, Math.round(score * 10000) / 10000);
}

// For standard sorting in lists
export function recalculateAllPriorities(
  tasks: Task[],
  burnoutScore: number
): Task[] {
  return tasks.map(task => ({
    ...task,
    priorityScore: task.status === 'done' ? 0 : calculateBasePriority(task),
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
  return t(key as TranslationKey, locale);
}
