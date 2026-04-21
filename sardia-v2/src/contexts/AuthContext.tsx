import { useEffect, useState, type ReactNode } from 'react';
import { api, tokenStore } from '../lib/api';
import type { AdminUser } from '../types';
import { AuthContext } from './auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth state lives in an httpOnly cookie. Ping /me to hydrate on mount;
  // if there's no cookie we just get a 401 and move on.
  useEffect(() => {
    let cancelled = false;
    api.me()
      .then((d) => { if (!cancelled) setUser(d.user); })
      .catch(() => { /* not logged in — fine */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const login = async (username: string, password: string) => {
    const { token, user } = await api.login(username, password);
    // Cookie is now set server-side. Keep token in localStorage as a
    // transitional fallback so legacy admin tabs still work.
    if (token) tokenStore.set(token);
    setUser(user);
  };

  const logout = async () => {
    try { await api.logout(); } catch { /* best-effort */ }
    tokenStore.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
