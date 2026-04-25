import { useEffect, useState, type ReactNode } from 'react';
import { api, csrfStore } from '../lib/api';
import type { AdminUser } from '../types';
import { AuthContext } from './auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth state lives in an httpOnly cookie. Ping /me to hydrate user + CSRF
  // token on mount; a 401 just means we aren't logged in.
  useEffect(() => {
    let cancelled = false;
    api.me()
      .then((d) => {
        if (cancelled) return;
        csrfStore.set(d.csrfToken);
        setUser(d.user);
      })
      .catch(() => { /* not logged in — fine */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const login = async (username: string, password: string) => {
    const { csrfToken, user } = await api.login(username, password);
    csrfStore.set(csrfToken);
    setUser(user);
  };

  const logout = async () => {
    try { await api.logout(); } catch { /* best-effort */ }
    csrfStore.clear();
    setUser(null);
  };

  // Global session-expired handler. The api layer dispatches this whenever
  // an authed call returns 401/403, so a stale cookie on any page lands the
  // user on the login screen instead of silently failing.
  useEffect(() => {
    const onExpired = () => {
      csrfStore.clear();
      setUser(null);
      const onAdmin = window.location.pathname.startsWith('/admin');
      if (onAdmin && window.location.pathname !== '/admin/login') {
        window.location.assign('/admin/login');
      }
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
