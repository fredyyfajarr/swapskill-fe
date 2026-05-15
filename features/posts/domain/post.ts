export interface SkillSummary {
  id?: number;
  name: string;
}

export interface PostAuthor {
  id: number;
  name: string;
  whatsapp_number: string;
}

export interface Post {
  id: number;
  description: string;
  user: PostAuthor;
  needed_skill: SkillSummary;
  offered_skill: SkillSummary;
  created_at: string;
  is_bookmarked?: boolean;
}

export interface ListPostsParams {
  search?: string;
  page?: number;
  skillId?: string;
  sortBy?: string;
  bookmarkedOnly?: boolean;
}

export interface PaginatedPosts {
  data: Post[];
  hasMore: boolean;
}

export interface CreatePostPayload {
  needed_skill: string;
  offered_skill: string;
  description: string;
}
