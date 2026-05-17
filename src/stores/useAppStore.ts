// ============================================
// Academic OS — Global Store (Zustand)
// ============================================

import { create } from 'zustand';
import { Task, Course, EnergyLevel, DayBurnout, Subtask } from '@/types';
import { Locale } from '@/lib/i18n';
import { MOCK_TASKS, MOCK_COURSES, MOCK_WEEKLY_BURNOUT } from '@/lib/mock-data';
import { recalculateAllPriorities } from '@/lib/priority-engine';
import { getCurrentBurnoutFromWeekly } from '@/lib/burnout-engine';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  // Data
  tasks: Task[];
  courses: Course[];
  weeklyBurnout: DayBurnout[];
  currentEnergy: EnergyLevel;
  availableMinutes: number;
  isDark: boolean;
  locale: Locale;
  activeTab: 'home' | 'tasks' | 'burnout';

  // Computed
  burnoutScore: number;
  focusTasksToday: Task[];

  // Actions
  setEnergy: (level: EnergyLevel) => void;
  setAvailableMinutes: (min: number) => void;
  toggleDark: () => void;
  toggleLocale: () => void;
  setActiveTab: (tab: 'home' | 'tasks' | 'burnout') => void;

  // Task CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'priorityScore' | 'subtasks' | 'status' | 'isFocusTask'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (taskId: string) => void;
  toggleFocusTask: (taskId: string) => boolean;
  addSubtasksToTask: (taskId: string, subtasks: Omit<Subtask, 'id' | 'taskId' | 'status' | 'completedAt'>[]) => void;
}

export const useAppStore = create<AppState>((set, get) => {
  const burnoutScore = getCurrentBurnoutFromWeekly(MOCK_WEEKLY_BURNOUT);
  const initialTasks = recalculateAllPriorities(MOCK_TASKS, burnoutScore);

  return {
    tasks: initialTasks,
    courses: MOCK_COURSES,
    weeklyBurnout: MOCK_WEEKLY_BURNOUT,
    currentEnergy: 3,
    availableMinutes: 60,
    isDark: false,
    locale: 'en' as Locale,
    activeTab: 'home',
    burnoutScore,
    focusTasksToday: initialTasks.filter(t => t.isFocusTask),

    setEnergy: (level) => set({ currentEnergy: level }),
    setAvailableMinutes: (min) => set({ availableMinutes: min }),
    toggleDark: () => set(s => {
      const newDark = !s.isDark;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', newDark);
      }
      return { isDark: newDark };
    }),
    toggleLocale: () => set(s => ({ locale: s.locale === 'en' ? 'id' as Locale : 'en' as Locale })),
    setActiveTab: (tab) => set({ activeTab: tab }),

    addTask: (taskData) => {
      const { burnoutScore } = get();
      const newTask: Task = {
        ...taskData,
        id: uuidv4(),
        status: 'pending',
        priorityScore: 0,
        isFocusTask: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        subtasks: [],
      };
      set(s => {
        const updated = recalculateAllPriorities([...s.tasks, newTask], burnoutScore);
        return { tasks: updated };
      });
    },

    updateTaskStatus: (taskId, status) =>
      set(s => ({
        tasks: s.tasks.map(t =>
          t.id === taskId
            ? { ...t, status, completedAt: status === 'done' ? new Date().toISOString() : null }
            : t
        ),
        focusTasksToday: s.tasks.filter(t => t.isFocusTask && t.id !== taskId || (t.id === taskId && status !== 'done' && t.isFocusTask)),
      })),

    toggleSubtask: (taskId, subtaskId) =>
      set(s => ({
        tasks: s.tasks.map(t =>
          t.id === taskId
            ? {
                ...t,
                subtasks: t.subtasks.map(st =>
                  st.id === subtaskId
                    ? {
                        ...st,
                        status: st.status === 'done' ? 'pending' as const : 'done' as const,
                        completedAt: st.status === 'done' ? null : new Date().toISOString(),
                      }
                    : st
                ),
              }
            : t
        ),
      })),

    deleteTask: (taskId) =>
      set(s => ({
        tasks: s.tasks.filter(t => t.id !== taskId),
        focusTasksToday: s.focusTasksToday.filter(t => t.id !== taskId),
      })),

    toggleFocusTask: (taskId) => {
      const state = get();
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return false;

      const currentFocusCount = state.tasks.filter(t => t.isFocusTask && t.status !== 'done').length;

      // Anti-overplanning: max 3 focus tasks
      if (!task.isFocusTask && currentFocusCount >= 3) {
        return false; // blocked
      }

      set(s => ({
        tasks: s.tasks.map(t =>
          t.id === taskId ? { ...t, isFocusTask: !t.isFocusTask } : t
        ),
      }));
      return true;
    },

    addSubtasksToTask: (taskId, newSubtasks) =>
      set(s => ({
        tasks: s.tasks.map(t =>
          t.id === taskId
            ? {
                ...t,
                subtasks: [
                  ...t.subtasks,
                  ...newSubtasks.map((st, i) => ({
                    ...st,
                    id: uuidv4(),
                    taskId,
                    status: 'pending' as const,
                    completedAt: null,
                  })),
                ],
              }
            : t
        ),
      })),
  };
});
