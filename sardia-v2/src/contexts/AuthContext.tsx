import { useEffect, useState, type ReactNode } from 'react';
import { api, tokenStore } from '../lib/api';
import type { AdminUser } from '../types';
import { AuthContext } from './auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    api.me()
      .then((d) => { if (!cancelled) setUser(d.user); })
      .catch(() => { tokenStore.clear(); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const login = async (username: string, password: string) => {
    const { token, user } = await api.login(username, password);
    tokenStore.set(token);
    setUser(user);
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
