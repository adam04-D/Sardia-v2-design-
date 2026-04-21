import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/auth';
import { ApiError } from '../../lib/api';

type LocationState = { from?: { pathname?: string } };

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    const to = (location.state as LocationState)?.from?.pathname ?? '/admin';
    return <Navigate to={to} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'تعذر تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-100 p-10 space-y-6"
      >
        <div className="text-center">
          <p className="font-serif text-3xl font-bold text-primary">سرديا</p>
          <p className="font-sans text-sm text-stone-500 mt-2">تسجيل دخول المدير</p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 font-sans">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="font-sans text-xs font-bold text-stone-600 block mb-2">
            اسم المستخدم
          </label>
          <div className="relative">
            <UserIcon size={16} aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-stone-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="font-sans text-xs font-bold text-stone-600 block mb-2">
            كلمة المرور
          </label>
          <div className="relative">
            <Lock size={16} aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-stone-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white py-3 rounded-lg font-sans text-sm font-bold hover:bg-accent transition-colors disabled:opacity-60"
        >
          {submitting ? 'جاري التحقق...' : 'دخول'}
        </button>
      </form>
    </div>
  );
}
