import type {
  CreatePostPayload,
  ListPostsParams,
  PaginatedPosts,
  Post,
} from '@/features/posts/domain/post';
import apiClient from '@/features/shared/infrastructure/http/apiClient';

export async function listPosts(params: ListPostsParams): Promise<PaginatedPosts> {
  const response = await apiClient.get('/posts', {
    params: {
      search: params.search ?? '',
      page: params.page ?? 1,
      skill_id: params.skillId,
      sort: params.sortBy ?? 'latest',
      bookmarked: params.bookmarkedOnly ? 1 : 0,
    },
  });

  return {
    data: response.data.data,
    hasMore: response.data.has_more,
  };
}

export async function createPost(payload: CreatePostPayload): Promise<void> {
  await apiClient.post('/posts', payload);
}

export async function listPostRecommendations(): Promise<Post[]> {
  const response = await apiClient.get('/posts/recommendations');

  return response.data.data;
}
