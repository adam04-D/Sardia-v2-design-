import type { AdminUser, ApiEnvelope, Comment, DashboardStats, Pagination, Work } from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5001';
const CSRF_KEY = 'sardia_csrf_token';

// CSRF token issued by /login or /me. Auth itself rides on an httpOnly cookie;
// this token is echoed via X-CSRF-Token on mutations so a cross-site form post
// (which the browser would attach the cookie to but cannot read this token) is
// rejected. sessionStorage is fine — we re-fetch from /me on hard reload.
export const csrfStore = {
  get: () => sessionStorage.getItem(CSRF_KEY),
  set: (t: string) => sessionStorage.setItem(CSRF_KEY, t),
  clear: () => sessionStorage.removeItem(CSRF_KEY),
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
    const csrf = csrfStore.get();
    if (csrf) finalHeaders['X-CSRF-Token'] = csrf;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    credentials: 'include', // send httpOnly auth cookie
  });
  const body = (await res.json().catch(() => ({}))) as ApiEnvelope<T> & { message?: string };

  if (!res.ok || body.success === false) {
    // Authenticated call rejected → cookie expired or CSRF token rotated.
    // Clear local state and let the AuthProvider redirect to /admin/login.
    if (auth && (res.status === 401 || res.status === 403)) {
      csrfStore.clear();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:expired', { detail: { status: res.status } }));
      }
    }
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
  recordView: (id: string | number) =>
    request<{ views_count: number; counted: boolean }>(`/api/works/${id}/view`, { method: 'POST' }),
  addComment: (id: string | number, payload: { content: string; author_name: string; website?: string }) =>
    request<{ comment: Comment }>(`/api/works/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Contact
  submitContact: (payload: { name: string; email: string; message: string; website?: string }) =>
    request<null>(`/api/contact`, { method: 'POST', body: JSON.stringify(payload) }),

  // Admin — contact messages
  listMessages: () =>
    request<{ messages: Array<{ id: number; name: string; email: string; message: string; is_read: boolean; created_at: string }> }>(
      `/api/admin/messages`,
      { auth: true },
    ),
  markMessageRead: (id: number) =>
    request<{ message: unknown }>(`/api/admin/messages/${id}/read`, { method: 'PUT', auth: true }),
  deleteMessage: (id: number) =>
    request<void>(`/api/admin/messages/${id}`, { method: 'DELETE', auth: true }),

  // Auth
  login: (username: string, password: string) =>
    request<{ csrfToken: string; user: AdminUser }>(`/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  me: () => request<{ user: AdminUser; csrfToken: string }>(`/api/auth/me`, { auth: true }),
  logout: () => request<null>(`/api/auth/logout`, { method: 'POST' }),
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
