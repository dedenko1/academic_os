import { createClient } from './client';
import { Task, Subtask } from '@/types';

// Supabase maps camelCase to snake_case usually, but we define the exact fields.
// For simplicity, we assume we fetch exact columns or we map them.
// The SQL schema uses snake_case, so we will map it.

const supabase = createClient();

export async function fetchTasksAPI(): Promise<Task[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data: tasksData, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id);

  if (tasksError) throw tasksError;

  const { data: subtasksData, error: subtasksError } = await supabase
    .from('subtasks')
    .select('*'); // RLS automatically filters subtasks for this user's tasks

  if (subtasksError) throw subtasksError;

  // Map database snake_case to frontend camelCase
  return (tasksData || []).map((t: any) => ({
    id: t.id,
    courseId: t.course_id,
    title: t.title,
    description: t.description || '',
    deadline: t.deadline,
    difficulty: t.difficulty,
    estimatedMinutes: t.estimated_minutes,
    impact: t.impact,
    status: t.status,
    priorityScore: t.priority_score,
    isFocusTask: t.is_focus_task,
    createdAt: t.created_at,
    completedAt: t.completed_at,
    skipCount: t.skip_count || 0,
    lastSkippedAt: t.last_skipped_at,
    subtasks: (subtasksData || [])
      .filter((st: any) => st.task_id === t.id)
      .map((st: any) => ({
        id: st.id,
        taskId: st.task_id,
        title: st.title,
        estimatedMinutes: st.estimated_minutes,
        sortOrder: st.sort_order,
        status: st.status,
        completedAt: st.completed_at,
      }))
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder),
  }));
}

export async function insertTaskAPI(task: Task) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase.from('tasks').insert({
    id: task.id,
    user_id: user.id,
    course_id: task.courseId,
    title: task.title,
    description: task.description,
    deadline: task.deadline,
    difficulty: task.difficulty,
    estimated_minutes: task.estimatedMinutes,
    impact: task.impact,
    status: task.status,
    priority_score: task.priorityScore,
    is_focus_task: task.isFocusTask,
    created_at: task.createdAt,
    completed_at: task.completedAt,
  });

  if (error) throw error;
  
  if (task.subtasks.length > 0) {
    await insertSubtasksAPI(task.subtasks);
  }
}

export async function updateTaskAPI(taskId: string, updates: Partial<Task>) {
  const dbUpdates: any = {};
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
  if (updates.isFocusTask !== undefined) dbUpdates.is_focus_task = updates.isFocusTask;
  if (updates.skipCount !== undefined) dbUpdates.skip_count = updates.skipCount;
  if (updates.lastSkippedAt !== undefined) dbUpdates.last_skipped_at = updates.lastSkippedAt;
  // Map other fields as needed

  const { error } = await supabase
    .from('tasks')
    .update(dbUpdates)
    .eq('id', taskId);

  if (error) throw error;
}

export async function deleteTaskAPI(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
}

export async function insertSubtasksAPI(subtasks: Subtask[]) {
  if (!subtasks.length) return;
  const dbSubtasks = subtasks.map(st => ({
    id: st.id,
    task_id: st.taskId,
    title: st.title,
    estimated_minutes: st.estimatedMinutes,
    sort_order: st.sortOrder,
    status: st.status,
    completed_at: st.completedAt,
  }));

  const { error } = await supabase.from('subtasks').insert(dbSubtasks);
  if (error) throw error;
}

export async function updateSubtaskAPI(subtaskId: string, updates: Partial<Subtask>) {
  const dbUpdates: any = {};
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;

  const { error } = await supabase
    .from('subtasks')
    .update(dbUpdates)
    .eq('id', subtaskId);

  if (error) throw error;
}
