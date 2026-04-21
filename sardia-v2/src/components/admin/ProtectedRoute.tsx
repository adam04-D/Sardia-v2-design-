import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/auth';
import RouteFallback from '../RouteFallback';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <RouteFallback />;
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
