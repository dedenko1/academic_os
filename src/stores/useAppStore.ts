// ============================================
// Academic OS — Global Store (Zustand)
// ============================================

import { create } from 'zustand';
import { Task, Course, EnergyLevel, DayBurnout, Subtask } from '@/types';
import { Locale } from '@/lib/i18n';
import type { User } from '@supabase/supabase-js';
import { recalculateAllPriorities } from '@/lib/priority-engine';
import { getCurrentBurnoutFromWeekly } from '@/lib/burnout-engine';
import { v4 as uuidv4 } from 'uuid';
import { fetchTasksAPI, insertTaskAPI, updateTaskAPI, deleteTaskAPI, insertSubtasksAPI, updateSubtaskAPI } from '@/lib/supabase/tasks';
import { fetchCoursesAPI } from '@/lib/supabase/courses';
import { fetchWeeklyBurnoutAPI } from '@/lib/supabase/burnout';
import { insertRecommendationEventAPI } from '@/lib/supabase/analytics';

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
  user: User | null;
  isTasksLoading: boolean;
  isCoursesLoading: boolean;
  isBurnoutLoading: boolean;

  // Computed
  burnoutScore: number;
  focusTasksToday: Task[];

  // Actions
  setEnergy: (level: EnergyLevel) => void;
  setAvailableMinutes: (min: number) => void;
  toggleDark: () => void;
  toggleLocale: () => void;
  setActiveTab: (tab: 'home' | 'tasks' | 'burnout') => void;
  setUser: (user: User | null) => void;
  fetchTasks: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  fetchBurnoutData: () => Promise<void>;

  // Task CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'priorityScore' | 'subtasks' | 'status' | 'isFocusTask' | 'skipCount' | 'lastSkippedAt'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (taskId: string) => void;
  toggleFocusTask: (taskId: string) => boolean;
  addSubtasksToTask: (taskId: string, subtasks: Omit<Subtask, 'id' | 'taskId' | 'status' | 'completedAt'>[]) => void;
  
  // Recommendations
  skipRecommendation: (taskId: string) => Promise<void>;
  acceptRecommendation: (taskId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => {
  // Initial synchronous state is empty or 0, populated via async calls

  return {
    tasks: [],
    courses: [],
    weeklyBurnout: [],
    currentEnergy: 3,
    availableMinutes: 60,
    isDark: false,
    locale: 'en' as Locale,
    activeTab: 'home',
    user: null,
    isTasksLoading: false,
    isCoursesLoading: false,
    isBurnoutLoading: false,
    burnoutScore: 0,
    focusTasksToday: [],

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
    setUser: (user) => set({ user }),

    fetchTasks: async () => {
      const state = get();
      if (!state.user) return;
      set({ isTasksLoading: true });
      try {
        const data = await fetchTasksAPI();
        const updatedTasks = recalculateAllPriorities(data, state.burnoutScore);
        set({ 
          tasks: updatedTasks, 
          focusTasksToday: updatedTasks.filter(t => t.isFocusTask),
          isTasksLoading: false 
        });
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        set({ isTasksLoading: false });
      }
    },

    fetchCourses: async () => {
      const state = get();
      if (!state.user) return;
      set({ isCoursesLoading: true });
      try {
        const data = await fetchCoursesAPI();
        set({ courses: data, isCoursesLoading: false });
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        set({ isCoursesLoading: false });
      }
    },

    fetchBurnoutData: async () => {
      const state = get();
      if (!state.user) return;
      set({ isBurnoutLoading: true });
      try {
        let data = await fetchWeeklyBurnoutAPI();
        if (data.length === 0) {
          // Generate 7 days of empty data
          const emptyData: DayBurnout[] = [];
          const daysStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            emptyData.push({
              day: daysStr[d.getDay()],
              date: d.toISOString(),
              score: 0,
              studyHours: 0,
              overdueCount: 0,
              sleepHours: 0
            });
          }
          data = emptyData;
        }
        const burnoutScore = getCurrentBurnoutFromWeekly(data);
        
        // Update task priorities based on new burnout score
        const updatedTasks = recalculateAllPriorities(get().tasks, burnoutScore);
        
        set({ 
          weeklyBurnout: data, 
          burnoutScore, 
          tasks: updatedTasks,
          focusTasksToday: updatedTasks.filter(t => t.isFocusTask),
          isBurnoutLoading: false 
        });
      } catch (err) {
        console.error("Failed to fetch burnout data:", err);
        set({ isBurnoutLoading: false });
      }
    },

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
        skipCount: 0,
        lastSkippedAt: null,
      };
      set(s => {
        const updated = recalculateAllPriorities([...s.tasks, newTask], burnoutScore);
        return { tasks: updated };
      });
      // Supabase async call
      insertTaskAPI(newTask).catch(err => console.error('Failed to insert task:', err));
    },

    updateTaskStatus: (taskId, status) => {
      const completedAt = status === 'done' ? new Date().toISOString() : null;
      set(s => ({
        tasks: s.tasks.map(t =>
          t.id === taskId
            ? { ...t, status, completedAt }
            : t
        ),
        focusTasksToday: s.tasks.filter(t => t.isFocusTask && t.id !== taskId || (t.id === taskId && status !== 'done' && t.isFocusTask)),
      }));
      // Supabase async call
      updateTaskAPI(taskId, { status, completedAt }).catch(err => console.error('Failed to update status:', err));
    },

    toggleSubtask: (taskId, subtaskId) => {
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
      }));

      // Find new status for subtask to sync to backend
      const st = get().tasks.find(t => t.id === taskId)?.subtasks.find(s => s.id === subtaskId);
      if (st) {
        updateSubtaskAPI(subtaskId, { status: st.status, completedAt: st.completedAt }).catch(err => console.error(err));
      }
    },

    deleteTask: (taskId) => {
      set(s => ({
        tasks: s.tasks.filter(t => t.id !== taskId),
        focusTasksToday: s.focusTasksToday.filter(t => t.id !== taskId),
      }));
      // Supabase async call
      deleteTaskAPI(taskId).catch(err => console.error('Failed to delete task:', err));
    },

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
        focusTasksToday: s.tasks.map(t =>
          t.id === taskId ? { ...t, isFocusTask: !t.isFocusTask } : t
        ).filter(t => t.isFocusTask)
      }));
      
      const updatedIsFocus = get().tasks.find(t => t.id === taskId)?.isFocusTask;
      if (updatedIsFocus !== undefined) {
        updateTaskAPI(taskId, { isFocusTask: updatedIsFocus }).catch(err => console.error(err));
      }
      return true;
    },

    addSubtasksToTask: (taskId, newSubtasks) => {
      const generatedSubtasks = newSubtasks.map((st) => ({
        ...st,
        id: uuidv4(),
        taskId,
        status: 'pending' as const,
        completedAt: null,
      }));

      set(s => ({
        tasks: s.tasks.map(t =>
          t.id === taskId
            ? {
                ...t,
                subtasks: [
                  ...t.subtasks,
                  ...generatedSubtasks,
                ],
              }
            : t
        ),
      }));
      insertSubtasksAPI(generatedSubtasks).catch(err => console.error(err));
    },

    skipRecommendation: async (taskId: string) => {
      const state = get();
      if (!state.user) return;
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const newSkipCount = (task.skipCount || 0) + 1;
      const now = new Date().toISOString();
      
      // Update locally immediately (optimistic UI)
      set({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, skipCount: newSkipCount, lastSkippedAt: now } : t)
      });
      
      try {
        await updateTaskAPI(taskId, { skipCount: newSkipCount, lastSkippedAt: now });
        await insertRecommendationEventAPI(taskId, 'skipped', state.currentEnergy, state.burnoutScore);
      } catch (err) {
        console.error("Failed to skip recommendation:", err);
      }
    },
    
    acceptRecommendation: async (taskId: string) => {
      const state = get();
      if (!state.user) return;
      try {
        await insertRecommendationEventAPI(taskId, 'accepted', state.currentEnergy, state.burnoutScore);
      } catch (err) {
        console.error("Failed to accept recommendation:", err);
      }
    },
  };
});
