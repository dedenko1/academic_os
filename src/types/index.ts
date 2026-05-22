// ============================================
// Academic OS — Core Types
// ============================================

export type TaskStatus = 'pending' | 'in_progress' | 'done';
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type Impact = 1 | 2 | 3 | 4 | 5;

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface Task {
  id: string;
  courseId: string | null;
  title: string;
  description: string;
  deadline: string | null; // ISO date string
  difficulty: Difficulty;
  estimatedMinutes: number;
  impact: Impact;
  status: TaskStatus;
  priorityScore: number;
  isFocusTask: boolean;
  createdAt: string;
  completedAt: string | null;
  subtasks: Subtask[];
  skipCount: number;
  lastSkippedAt: string | null;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  estimatedMinutes: number;
  sortOrder: number;
  status: TaskStatus;
  completedAt: string | null;
}

export interface EnergyLog {
  id: string;
  energyLevel: EnergyLevel;
  loggedAt: string;
}

export interface BurnoutScore {
  date: string;
  overdueCount: number;
  studyHours: number;
  sleepHours: number | null;
  workloadIntensity: number;
  burnoutScore: number;
}

export interface StudySession {
  id: string;
  taskId: string | null;
  date: string;
  durationMinutes: number;
  energyBefore: EnergyLevel | null;
  energyAfter: EnergyLevel | null;
}

export interface Recommendation {
  type: 'task' | 'break' | 'no_match';
  task: Task | null;
  suggestedSubtasks?: Subtask[]; // For knapsack batched subtasks
  message: string;
  reason: string;
}

export interface RecommendationEvent {
  id: string;
  userId: string;
  taskId: string | null;
  action: 'accepted' | 'skipped' | 'ignored';
  energyLevel: number;
  burnoutScore: number;
  contextNotes?: string;
  createdAt: string;
}

export interface DayBurnout {
  day: string; // Mon, Tue, etc.
  date: string;
  score: number;
  studyHours: number;
  overdueCount: number;
  sleepHours: number;
}
