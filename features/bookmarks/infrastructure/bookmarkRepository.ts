import apiClient from '@/features/shared/infrastructure/http/apiClient';

export async function togglePostBookmark(postId: number): Promise<void> {
  await apiClient.post(`/posts/${postId}/bookmark`);
}
