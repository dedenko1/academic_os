// ============================================
// Academic OS — Mock Data
// Realistic demo data for MVP
// ============================================

import { Course, Task, EnergyLog, DayBurnout, StudySession } from '@/types';

export const MOCK_COURSES: Course[] = [
  { id: 'c1', name: 'Data Structures', code: 'CS201', color: '#6366f1' },
  { id: 'c2', name: 'Academic Writing', code: 'ENG102', color: '#6b8f71' },
  { id: 'c3', name: 'Linear Algebra', code: 'MATH301', color: '#c9956b' },
  { id: 'c4', name: 'Database Systems', code: 'CS305', color: '#e05252' },
  { id: 'c5', name: 'Psychology', code: 'PSY201', color: '#8b5cf6' },
];

const now = new Date();
const addDays = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();
const addHours = (h: number) => new Date(now.getTime() + h * 3600000).toISOString();

export const MOCK_TASKS: any[] = [
  {
    id: 't1',
    courseId: 'c2',
    title: 'Research Essay: Climate Policy Impact',
    description: 'Write a 2000-word argumentative essay analyzing the effectiveness of carbon pricing policies in developing nations.',
    deadline: addDays(3),
    difficulty: 4,
    estimatedMinutes: 180,
    impact: 5,
    status: 'in_progress',
    priorityScore: 0.82,
    isFocusTask: true,
    createdAt: addDays(-5),
    completedAt: null,
    subtasks: [
      { id: 's1', taskId: 't1', title: 'Find 5 academic sources on carbon pricing', estimatedMinutes: 40, sortOrder: 0, status: 'done', completedAt: addDays(-1) },
      { id: 's2', taskId: 't1', title: 'Write thesis statement and outline', estimatedMinutes: 25, sortOrder: 1, status: 'done', completedAt: addDays(-1) },
      { id: 's3', taskId: 't1', title: 'Draft introduction and background section', estimatedMinutes: 45, sortOrder: 2, status: 'in_progress', completedAt: null },
      { id: 's4', taskId: 't1', title: 'Write main argument paragraphs', estimatedMinutes: 60, sortOrder: 3, status: 'pending', completedAt: null },
      { id: 's5', taskId: 't1', title: 'Write conclusion and proofread', estimatedMinutes: 30, sortOrder: 4, status: 'pending', completedAt: null },
    ],
  },
  {
    id: 't2',
    courseId: 'c1',
    title: 'Binary Search Tree Implementation',
    description: 'Implement a balanced BST with insert, delete, and search operations in Java.',
    deadline: addDays(2),
    difficulty: 4,
    estimatedMinutes: 120,
    impact: 4,
    status: 'pending',
    priorityScore: 0.78,
    isFocusTask: true,
    createdAt: addDays(-3),
    completedAt: null,
    subtasks: [
      { id: 's6', taskId: 't2', title: 'Review BST theory and balancing strategies', estimatedMinutes: 30, sortOrder: 0, status: 'pending', completedAt: null },
      { id: 's7', taskId: 't2', title: 'Implement Node class and insert method', estimatedMinutes: 40, sortOrder: 1, status: 'pending', completedAt: null },
      { id: 's8', taskId: 't2', title: 'Implement delete and search operations', estimatedMinutes: 40, sortOrder: 2, status: 'pending', completedAt: null },
      { id: 's9', taskId: 't2', title: 'Write unit tests and debug', estimatedMinutes: 30, sortOrder: 3, status: 'pending', completedAt: null },
    ],
  },
  {
    id: 't3',
    courseId: 'c3',
    title: 'Matrix Operations Problem Set',
    description: 'Complete problems 1-15 on eigenvalues, determinants, and matrix transformations.',
    deadline: addDays(1),
    difficulty: 3,
    estimatedMinutes: 90,
    impact: 3,
    status: 'pending',
    priorityScore: 0.71,
    isFocusTask: false,
    createdAt: addDays(-2),
    completedAt: null,
    subtasks: [
      { id: 's10', taskId: 't3', title: 'Solve problems 1-5 (determinants)', estimatedMinutes: 30, sortOrder: 0, status: 'pending', completedAt: null },
      { id: 's11', taskId: 't3', title: 'Solve problems 6-10 (eigenvalues)', estimatedMinutes: 30, sortOrder: 1, status: 'pending', completedAt: null },
      { id: 's12', taskId: 't3', title: 'Solve problems 11-15 (transformations)', estimatedMinutes: 30, sortOrder: 2, status: 'pending', completedAt: null },
    ],
  },
  {
    id: 't4',
    courseId: 'c4',
    title: 'ER Diagram for University Database',
    description: 'Design a complete ER diagram with normalization to 3NF for the university enrollment system.',
    deadline: addDays(5),
    difficulty: 2,
    estimatedMinutes: 60,
    impact: 3,
    status: 'pending',
    priorityScore: 0.45,
    isFocusTask: false,
    createdAt: addDays(-1),
    completedAt: null,
    subtasks: [],
  },
  {
    id: 't5',
    courseId: 'c5',
    title: 'Read Chapter 7: Cognitive Biases',
    description: 'Read and annotate Chapter 7 of "Thinking, Fast and Slow" for discussion next week.',
    deadline: addDays(6),
    difficulty: 1,
    estimatedMinutes: 45,
    impact: 2,
    status: 'pending',
    priorityScore: 0.32,
    isFocusTask: false,
    createdAt: addDays(-1),
    completedAt: null,
    subtasks: [],
  },
  {
    id: 't6',
    courseId: 'c1',
    title: 'Review Lecture Notes: Graph Algorithms',
    description: 'Review notes on BFS, DFS, and Dijkstra from weeks 8-10.',
    deadline: addHours(18),
    difficulty: 2,
    estimatedMinutes: 30,
    impact: 2,
    status: 'pending',
    priorityScore: 0.65,
    isFocusTask: false,
    createdAt: addDays(-2),
    completedAt: null,
    subtasks: [],
  },
  {
    id: 't7',
    courseId: 'c3',
    title: 'Quiz Prep: Vector Spaces',
    description: 'Study quiz topics: span, basis, dimension, linear independence.',
    deadline: addDays(4),
    difficulty: 3,
    estimatedMinutes: 60,
    impact: 4,
    status: 'done',
    priorityScore: 0.0,
    isFocusTask: false,
    createdAt: addDays(-7),
    completedAt: addDays(-1),
    subtasks: [],
  },
];

export const MOCK_ENERGY_LOGS: EnergyLog[] = [
  { id: 'e1', energyLevel: 3, loggedAt: addHours(-8) },
  { id: 'e2', energyLevel: 4, loggedAt: addHours(-4) },
  { id: 'e3', energyLevel: 2, loggedAt: addHours(-1) },
];

export const MOCK_WEEKLY_BURNOUT: DayBurnout[] = [
  { day: 'Mon', date: addDays(-6), score: 35, studyHours: 3, overdueCount: 0, sleepHours: 7.5 },
  { day: 'Tue', date: addDays(-5), score: 42, studyHours: 5, overdueCount: 1, sleepHours: 6.5 },
  { day: 'Wed', date: addDays(-4), score: 58, studyHours: 6.5, overdueCount: 1, sleepHours: 6 },
  { day: 'Thu', date: addDays(-3), score: 65, studyHours: 7, overdueCount: 2, sleepHours: 5.5 },
  { day: 'Fri', date: addDays(-2), score: 52, studyHours: 4, overdueCount: 1, sleepHours: 7 },
  { day: 'Sat', date: addDays(-1), score: 38, studyHours: 2, overdueCount: 1, sleepHours: 8 },
  { day: 'Sun', date: addDays(0), score: 62, studyHours: 5.5, overdueCount: 2, sleepHours: 6 },
];

export const MOCK_STUDY_SESSIONS: StudySession[] = [
  { id: 'ss1', taskId: 't1', date: addDays(-2), durationMinutes: 45, energyBefore: 4, energyAfter: 3 },
  { id: 'ss2', taskId: 't3', date: addDays(-1), durationMinutes: 30, energyBefore: 3, energyAfter: 2 },
  { id: 'ss3', taskId: 't1', date: addDays(0), durationMinutes: 60, energyBefore: 3, energyAfter: 2 },
];

import { useAppStore } from '@/stores/useAppStore';

export function getCourseName(courseId: string | null): string {
  if (!courseId) return 'General';
  const courses = useAppStore.getState().courses;
  return courses.find(c => c.id === courseId)?.name ?? 'Unknown';
}

export function getCourseCode(courseId: string | null): string {
  if (!courseId) return '';
  const courses = useAppStore.getState().courses;
  return courses.find(c => c.id === courseId)?.code ?? '';
}

export function getCourseColor(courseId: string | null): string {
  if (!courseId) return '#8a8a8a';
  const courses = useAppStore.getState().courses;
  return courses.find(c => c.id === courseId)?.color ?? '#8a8a8a';
}
