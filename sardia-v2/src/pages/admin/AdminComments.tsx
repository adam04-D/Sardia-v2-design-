import { useCallback, useEffect, useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { Comment } from '../../types';

type Tab = 'pending' | 'all';

export default function AdminComments() {
  const [tab, setTab] = useState<Tab>('pending');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async (which: Tab) => {
    setLoading(true);
    try {
      const res = which === 'pending' ? await api.listPendingComments() : await api.listAllComments();
      setComments(res.comments);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(tab); }, [tab, load]);

  const handleApprove = async (c: Comment) => {
    setBusyId(c.id);
    try {
      await api.approveComment(c.id);
      setComments((prev) => tab === 'pending' ? prev.filter((x) => x.id !== c.id) : prev.map((x) => x.id === c.id ? { ...x, is_approved: true } : x));
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'فشلت الموافقة');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (c: Comment) => {
    if (!confirm('حذف هذا التعليق نهائياً؟')) return;
    setBusyId(c.id);
    try {
      await api.deleteComment(c.id);
      setComments((prev) => prev.filter((x) => x.id !== c.id));
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'فشل الحذف');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl font-bold text-primary">التعليقات</h1>
        <p className="font-sans text-sm text-stone-500 mt-1">مراجعة وإدارة تعليقات القراء</p>
      </header>

      <div role="tablist" className="flex gap-1 bg-stone-100 p-1 rounded-lg w-fit">
        {(['pending', 'all'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md font-sans text-sm transition-colors ${
              tab === t ? 'bg-white shadow-sm text-primary font-bold' : 'text-stone-500'
            }`}
          >
            {t === 'pending' ? 'بانتظار الموافقة' : 'جميع التعليقات'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-sans text-stone-500">جاري التحميل...</p>
      ) : error ? (
        <p className="font-sans text-red-600">{error}</p>
      ) : comments.length === 0 ? (
        <p className="font-sans text-stone-400">لا توجد تعليقات.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="bg-white rounded-xl border border-stone-100 p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-sans text-sm font-bold text-stone-800">{c.author_name}</span>
                    {c.is_approved ? (
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">معتمد</span>
                    ) : (
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">معلق</span>
                    )}
                    <span className="font-sans text-xs text-stone-400">
                      {new Date(c.created_at).toLocaleDateString('ar')}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-stone-700 whitespace-pre-wrap">{c.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!c.is_approved && (
                    <button
                      onClick={() => handleApprove(c)}
                      disabled={busyId === c.id}
                      aria-label="اعتماد التعليق"
                      className="p-2 rounded hover:bg-emerald-50 text-emerald-600 disabled:opacity-40"
                    >
                      <Check size={16} aria-hidden="true" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(c)}
                    disabled={busyId === c.id}
                    aria-label="حذف التعليق"
                    className="p-2 rounded hover:bg-red-50 text-red-600 disabled:opacity-40"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
