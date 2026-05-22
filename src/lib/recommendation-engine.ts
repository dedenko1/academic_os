// ============================================
// Academic OS — Behavioral Execution Engine
// Optimizes for initiation & momentum, not just priority
// ============================================

import { Task, EnergyLevel, Recommendation, Subtask } from '@/types';
import { Locale, t, tf } from '@/lib/i18n';
import { getDifficultyLabel, calculateExecutionProbability } from './priority-engine';

export function recommendNextTask(
  tasks: Task[],
  energyLevel: EnergyLevel,
  availableMinutes: number,
  burnoutScore: number,
  locale: Locale = 'en'
): Recommendation {
  // 1. Critical Burnout Check
  if (burnoutScore > 75) {
    return {
      type: 'break',
      task: null,
      message: t('recBreakMsg', locale),
      reason: t('recReasonKeepShort', locale), // e.g. "Your burnout risk is critical."
    };
  }

  const pending = tasks.filter(t => t.status !== 'done');
  if (pending.length === 0) {
    return {
      type: 'no_match',
      task: null,
      message: t('recAllClearMsg', locale),
      reason: t('recAllClearReason', locale),
    };
  }

  // 2. Calculate Execution Probability & Rank
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const tasksCompletedToday = tasks.filter(t => t.status === 'done' && t.completedAt && new Date(t.completedAt) > todayStart).length;
  const needsMomentum = tasksCompletedToday === 0;

  const rankedTasks = pending.map(task => ({
    task,
    probability: calculateExecutionProbability(task, energyLevel, burnoutScore, needsMomentum)
  })).sort((a, b) => b.probability - a.probability);

  // 3. Find the best match that fits time constraints
  let bestMatch = null;
  for (const { task } of rankedTasks) {
    if (task.estimatedMinutes <= availableMinutes) {
      bestMatch = task;
      break;
    }
  }

  // 4. Low Energy Fallback (Micro-Action)
  if (!bestMatch) {
    // If we have very low energy and time, or tasks are just too big
    const easiestTask = rankedTasks[0].task; // highest probability task despite constraints

    return {
      type: 'task',
      task: easiestTask,
      message: tf<(t: string, m: number) => string>('recStartWith', locale)(easiestTask.title, 10), // "Just spend 10m on X"
      reason: energyLevel <= 2 
        ? (locale === 'id' ? "Anda sedang kelelahan. Jangan paksakan selesai, cukup luangkan 10 menit untuk persiapan awal demi menjaga momentum." : "You're exhausted. Don't try to finish this. Just spend 10 minutes setting it up to maintain momentum.")
        : (locale === 'id' ? "Tugas ini terlalu besar untuk waktu yang ada. Cicil 10 menit pertama saja." : "This task is too big for your available time. Just knock out the first 10 minutes."),
    };
  }

  // 5. Knapsack Subtask Grouping
  const incompleteSubtasks = bestMatch.subtasks.filter(s => s.status !== 'done');
  let suggestedSubtasks: Subtask[] = [];
  let timeUsed = 0;
  
  if (incompleteSubtasks.length > 0) {
    for (const st of incompleteSubtasks) {
      if (timeUsed + st.estimatedMinutes <= availableMinutes) {
        suggestedSubtasks.push(st);
        timeUsed += st.estimatedMinutes;
      } else {
        break;
      }
    }
    // Fallback if even the first subtask is too big, just suggest the first one
    if (suggestedSubtasks.length === 0) {
      suggestedSubtasks = [incompleteSubtasks[0]];
    }
  }

  // 6. Format Final Recommendation
  let actionMessage = bestMatch.title;
  if (suggestedSubtasks.length > 0) {
    if (suggestedSubtasks.length === 1) {
      actionMessage = tf<(t: string, m: number) => string>('recStartWith', locale)(suggestedSubtasks[0].title, suggestedSubtasks[0].estimatedMinutes);
    } else {
      actionMessage = locale === 'id' 
        ? `Selesaikan ${suggestedSubtasks.length} langkah berurutan ini`
        : `Complete these ${suggestedSubtasks.length} sequential steps`;
    }
  } else {
    actionMessage = tf<(t: string, m: number) => string>('recWorkOnTask', locale)(bestMatch.title, bestMatch.estimatedMinutes);
  }

  return {
    type: 'task',
    task: bestMatch,
    suggestedSubtasks: suggestedSubtasks.length > 0 ? suggestedSubtasks : undefined,
    message: actionMessage,
    reason: generatePsychologicalReason(bestMatch, energyLevel, needsMomentum, locale),
  };
}

function generatePsychologicalReason(task: Task, energy: EnergyLevel, needsMomentum: boolean, locale: Locale): string {
  const isId = locale === 'id';
  if (needsMomentum && task.estimatedMinutes <= 20) {
    return isId 
      ? "Anda belum menyelesaikan tugas apa pun hari ini. Tugas ini ringan dan cepat; menyelesaikannya akan memecah kebuntuan dan memberi Anda momentum."
      : "You haven't completed anything yet today. This is a quick, low-friction win to break paralysis and build momentum.";
  }
  
  if (energy <= 2 && task.difficulty <= 2) {
    return isId
      ? "Energi Anda sedang rendah, dan tugas ini tidak membutuhkan banyak beban kognitif. Ini adalah langkah paling aman untuk tetap produktif tanpa memicu burnout."
      : "Your energy is low, and this task requires minimal cognitive load. It's the safest way to make progress without risking burnout.";
  }

  if (task.skipCount > 0) {
    return isId
      ? "Anda telah menghindari tugas ini beberapa kali. Semakin lama ditunda, semakin berat rasanya. Mari kita kerjakan sebagian kecilnya sekarang."
      : "You've been avoiding this. The longer you put it off, the heavier it feels. Let's just tackle a small piece of it right now.";
  }

  if (task.impact >= 4) {
    return isId
      ? "Tugas ini memiliki dampak strategis yang tinggi. Menyelesaikannya sekarang akan secara drastis mengurangi beban akademik Anda minggu ini."
      : "This is a high-impact task. Executing this now will significantly reduce your academic anxiety for the rest of the week.";
  }

  return isId 
    ? "Tugas ini memiliki probabilitas eksekusi tertinggi berdasarkan rasio energi dan waktu Anda saat ini." 
    : "This task has the highest execution probability based on your current energy and available time.";
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
