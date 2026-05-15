import apiClient from '@/features/shared/infrastructure/http/apiClient';

export interface CreateReviewPayload {
  reviewee_id: string;
  rating: number;
  comment: string;
}

export async function createReview(payload: CreateReviewPayload): Promise<void> {
  await apiClient.post('/reviews', payload);
}
