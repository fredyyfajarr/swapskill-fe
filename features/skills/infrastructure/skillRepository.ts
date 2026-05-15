import type { Skill } from '@/features/skills/domain/skill';
import apiClient from '@/features/shared/infrastructure/http/apiClient';

export async function listSkills(): Promise<Skill[]> {
  const response = await apiClient.get('/skills');

  return response.data.data;
}
