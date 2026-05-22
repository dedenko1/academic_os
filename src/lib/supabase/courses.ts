import { createClient } from './client';
import { Course } from '@/types';

const supabase = createClient();

export async function fetchCoursesAPI(): Promise<Course[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;

  return (data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    color: c.color,
  }));
}

export async function insertCourseAPI(course: Course) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase.from('courses').insert({
    id: course.id,
    user_id: user.id,
    name: course.name,
    code: course.code,
    color: course.color,
  });

  if (error) throw error;
}

export async function updateCourseAPI(courseId: string, updates: Partial<Course>) {
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.code !== undefined) dbUpdates.code = updates.code;
  if (updates.color !== undefined) dbUpdates.color = updates.color;

  const { error } = await supabase
    .from('courses')
    .update(dbUpdates)
    .eq('id', courseId);

  if (error) throw error;
}

export async function deleteCourseAPI(courseId: string) {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);

  if (error) throw error;
}
