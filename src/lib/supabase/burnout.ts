import { createClient } from './client';
import { DayBurnout } from '@/types';

const supabase = createClient();

export async function fetchWeeklyBurnoutAPI(): Promise<DayBurnout[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Fetch the last 7 records ordered by date descending, then reverse them
  const { data, error } = await supabase
    .from('day_burnout')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(7);

  if (error) throw error;

  return (data || []).map((b: any) => ({
    day: b.day,
    date: b.date,
    score: parseFloat(b.score),
    studyHours: parseFloat(b.study_hours),
    overdueCount: b.overdue_count,
    sleepHours: parseFloat(b.sleep_hours),
  })).reverse(); // Oldest to newest
}

// Optional: Function to log today's burnout if the user completes a day or updates their sleep
export async function insertOrUpdateDayBurnoutAPI(burnout: DayBurnout) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase.from('day_burnout').upsert({
    user_id: user.id,
    day: burnout.day,
    date: burnout.date, // Note: For a real app, might want to enforce unique per date
    score: burnout.score,
    study_hours: burnout.studyHours,
    overdue_count: burnout.overdueCount,
    sleep_hours: burnout.sleepHours,
  });

  if (error) throw error;
}
