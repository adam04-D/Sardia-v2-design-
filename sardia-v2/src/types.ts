export interface Comment {
  id: number;
  content: string;
  author_name: string;
  is_approved: boolean;
  work_id: number;
  created_at: string;
  updated_at: string;
  work?: { id: number; title: string };
}

export interface Work {
  id: number;
  title: string;
  excerpt: string | null;
  full_content?: string | null;
  image_url: string | null;
  image_public_id?: string | null;
  audio_url?: string | null;
  audio_public_id?: string | null;
  likes_count: number;
  views_count?: number;
  created_at: string;
  updated_at?: string;
  comments_count?: number;
  comments?: Comment[];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AdminUser {
  id: number;
  username: string;
  created_at?: string;
}

export interface DashboardStats {
  stats: {
    totalWorks: number;
    totalComments: number;
    pendingComments: number;
    approvedComments: number;
    totalLikes: number;
    totalViews: number;
    unreadMessages: number;
    totalMessages: number;
  };
  topLikedWork: Pick<Work, 'id' | 'title' | 'likes_count'> | null;
  recentWorks: Array<Pick<Work, 'id' | 'title' | 'likes_count' | 'views_count' | 'created_at'>>;
  recentPending: Comment[];
}
