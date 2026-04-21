import type { AdminUser, ApiEnvelope, Comment, DashboardStats, Pagination, Work } from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5001';
const TOKEN_KEY = 'sardia_admin_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOpts = RequestInit & { auth?: boolean; multipart?: boolean };

async function request<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  const { auth, multipart, headers, ...rest } = opts;
  const finalHeaders: Record<string, string> = { ...(headers as Record<string, string> ?? {}) };
  if (!multipart) finalHeaders['Content-Type'] = 'application/json';
  if (auth) {
    const token = tokenStore.get();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers: finalHeaders });
  const body = (await res.json().catch(() => ({}))) as ApiEnvelope<T> & { message?: string };

  if (!res.ok || body.success === false) {
    throw new ApiError(body.message ?? `Request failed (${res.status})`, res.status);
  }
  return body.data as T;
}

export interface WorksListResponse {
  works: Work[];
  pagination: Pagination;
}

export const api = {
  // Public
  listWorks: (page = 1, limit = 10) =>
    request<WorksListResponse>(`/api/works?page=${page}&limit=${limit}`),
  searchWorks: (q: string) =>
    request<{ works: Work[]; query: string; count: number; pagination?: Pagination }>(
      `/api/works/search?q=${encodeURIComponent(q)}`,
    ),
  getWork: (id: string | number) => request<{ work: Work }>(`/api/works/${id}`),
  likeWork: (id: string | number) =>
    request<{ likes_count: number }>(`/api/works/${id}/like`, { method: 'POST' }),
  addComment: (id: string | number, payload: { content: string; author_name: string }) =>
    request<{ comment: Comment }>(`/api/works/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Auth
  login: (username: string, password: string) =>
    request<{ token: string; user: AdminUser }>(`/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  me: () => request<{ user: AdminUser }>(`/api/auth/me`, { auth: true }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<void>(`/api/auth/password`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Admin — works
  createWork: (fd: FormData) =>
    request<{ work: Work }>(`/api/works`, { method: 'POST', auth: true, multipart: true, body: fd }),
  updateWork: (id: number, fd: FormData) =>
    request<{ work: Work }>(`/api/works/${id}`, { method: 'PUT', auth: true, multipart: true, body: fd }),
  deleteWork: (id: number) =>
    request<void>(`/api/works/${id}`, { method: 'DELETE', auth: true }),

  // Admin — stats + comments
  dashboardStats: () => request<DashboardStats>(`/api/admin/stats`, { auth: true }),
  listAllComments: () => request<{ comments: Comment[] }>(`/api/admin/comments`, { auth: true }),
  listPendingComments: () => request<{ comments: Comment[] }>(`/api/admin/comments/pending`, { auth: true }),
  approveComment: (id: number) =>
    request<{ comment: Comment }>(`/api/admin/comments/${id}/approve`, { method: 'PUT', auth: true }),
  deleteComment: (id: number) =>
    request<void>(`/api/admin/comments/${id}`, { method: 'DELETE', auth: true }),
};
