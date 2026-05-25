import apiClient from '@/features/shared/infrastructure/http/apiClient';
import type { CurrentUser } from '@/features/users/domain/user';

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.get('/me');

  return response.data.data;
}
