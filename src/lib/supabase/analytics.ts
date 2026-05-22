import { createClient } from './client';
import { RecommendationEvent } from '@/types';

const supabase = createClient();

export async function insertRecommendationEventAPI(
  taskId: string | null,
  action: 'accepted' | 'skipped' | 'ignored',
  energyLevel: number,
  burnoutScore: number,
  contextNotes?: string
): Promise<RecommendationEvent | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from('recommendation_events')
    .insert({
      user_id: userData.user.id,
      task_id: taskId,
      action,
      energy_level: energyLevel,
      burnout_score: burnoutScore,
      context_notes: contextNotes
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to insert recommendation event:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    taskId: data.task_id,
    action: data.action,
    energyLevel: data.energy_level,
    burnoutScore: data.burnout_score,
    contextNotes: data.context_notes,
    createdAt: data.created_at
  };
}
