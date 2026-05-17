// ============================================
// Academic OS — Burnout Scoring System
// ============================================

import { DayBurnout, Task } from '@/types';
import { Locale, t } from '@/lib/i18n';

export function calculateBurnoutScore(
  overdueCount: number,
  studyHours3d: number,
  avgSleepHours: number,
  tasksDueIn48h: number
): number {
  // Overdue tasks (30%): each overdue = 15pts, max 100
  const overdueScore = Math.min(overdueCount * 15, 100);

  // Study intensity (25%): 24h in 3 days = max burnout
  const studyScore = Math.min((studyHours3d / 24) * 100, 100);

  // Sleep debt (25%): each hour below 7 = 20pts
  const sleepScore = Math.max(0, (7 - avgSleepHours) * 20);

  // Workload density (20%): each task due in 48h = 12pts
  const workloadScore = Math.min(tasksDueIn48h * 12, 100);

  const total =
    (overdueScore * 0.30) +
    (studyScore * 0.25) +
    (sleepScore * 0.25) +
    (workloadScore * 0.20);

  return Math.round(Math.min(total, 100) * 10) / 10;
}

export function getBurnoutLevel(score: number, locale: Locale = 'en'): {
  level: 'low' | 'moderate' | 'high' | 'critical';
  label: string;
  color: string;
  advice: string;
} {
  if (score <= 30) return {
    level: 'low',
    label: t('burnoutHealthy', locale),
    color: 'success',
    advice: t('burnoutAdviceLow', locale),
  };
  if (score <= 55) return {
    level: 'moderate',
    label: t('burnoutModerate', locale),
    color: 'warning',
    advice: t('burnoutAdviceModerate', locale),
  };
  if (score <= 75) return {
    level: 'high',
    label: t('burnoutHigh', locale),
    color: 'danger',
    advice: t('burnoutAdviceHigh', locale),
  };
  return {
    level: 'critical',
    label: t('burnoutCritical', locale),
    color: 'danger',
    advice: t('burnoutAdviceCritical', locale),
  };
}

export function getCurrentBurnoutFromWeekly(weeklyData: DayBurnout[]): number {
  if (weeklyData.length === 0) return 0;
  return weeklyData[weeklyData.length - 1].score;
}

export function getHeatmapColor(score: number, isDark: boolean): string {
  if (score <= 20) return isDark ? '#1a3a1e' : '#dcfce7';
  if (score <= 35) return isDark ? '#1a3a2e' : '#bbf7d0';
  if (score <= 50) return isDark ? '#2e3a1a' : '#fef9c3';
  if (score <= 65) return isDark ? '#3a2e1a' : '#fed7aa';
  if (score <= 80) return isDark ? '#3a1a1a' : '#fecaca';
  return isDark ? '#4a1a1a' : '#fca5a5';
}

export function countOverdueTasks(tasks: Task[]): number {
  const now = new Date();
  return tasks.filter(
    t => t.status !== 'done' && t.deadline && new Date(t.deadline) < now
  ).length;
}

export function countTasksDueIn48h(tasks: Task[]): number {
  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 3600000);
  return tasks.filter(
    t => t.status !== 'done' && t.deadline &&
    new Date(t.deadline) > now && new Date(t.deadline) <= in48h
  ).length;
}
