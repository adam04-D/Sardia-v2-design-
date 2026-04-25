import { useState, type FormEvent } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../contexts/auth';

export default function AdminSettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل.');
      return;
    }
    if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('يجب أن تحتوي كلمة المرور على حرف واحد ورقم واحد على الأقل.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setSubmitting(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'فشل تغيير كلمة المرور.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="font-serif text-3xl font-bold text-primary">الإعدادات</h1>
        <p className="font-sans text-sm text-stone-500 mt-1">
          الحساب: <span className="font-bold text-stone-700">{user?.username}</span>
        </p>
      </header>

      <section className="bg-white rounded-xl border border-stone-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            <KeyRound size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-primary">تغيير كلمة المرور</h2>
            <p className="font-sans text-xs text-stone-500 mt-0.5">
              8 أحرف على الأقل، تتضمن حرفاً ورقماً.
            </p>
          </div>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 font-sans mb-4">
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3 font-sans mb-4">
            <ShieldCheck size={16} aria-hidden="true" />
            تم تحديث كلمة المرور بنجاح.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="currentPassword" className="font-sans text-xs font-bold text-stone-600 block mb-2">
              كلمة المرور الحالية
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="font-sans text-xs font-bold text-stone-600 block mb-2">
              كلمة المرور الجديدة
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="font-sans text-xs font-bold text-stone-600 block mb-2">
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-sans text-sm font-bold hover:bg-accent transition-colors disabled:opacity-60"
            >
              {submitting ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
