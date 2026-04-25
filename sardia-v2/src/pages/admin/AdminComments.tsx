import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api, ApiError } from '../../lib/api';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Comment } from '../../types';

type Tab = 'pending' | 'all';

const PAGE_SIZE = 20;

export default function AdminComments() {
  const [tab, setTab] = useState<Tab>('pending');
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
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

  useEffect(() => { setPage(1); load(tab); }, [tab, load]);

  const totalPages = Math.max(1, Math.ceil(comments.length / PAGE_SIZE));
  const pageSlice = useMemo(
    () => comments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [comments, page],
  );

  // If the current page becomes empty after a delete, step back
  useEffect(() => {
    if (page > 1 && pageSlice.length === 0 && comments.length > 0) {
      setPage((p) => Math.max(1, p - 1));
    }
  }, [page, pageSlice.length, comments.length]);

  const handleApprove = async (c: Comment) => {
    setBusyId(c.id);
    try {
      await api.approveComment(c.id);
      setComments((prev) => tab === 'pending' ? prev.filter((x) => x.id !== c.id) : prev.map((x) => x.id === c.id ? { ...x, is_approved: true } : x));
      toast.success('تم اعتماد التعليق.');
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'فشلت الموافقة');
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
      toast.success('تم حذف التعليق.');
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'فشل الحذف');
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
        <EmptyState
          icon={MessageSquare}
          title={tab === 'pending' ? 'لا توجد تعليقات بانتظار الموافقة' : 'لا توجد تعليقات'}
          description={
            tab === 'pending'
              ? 'ستظهر هنا التعليقات الجديدة فور وصولها.'
              : 'لم يترك أي قارئ تعقيباً حتى الآن.'
          }
        />
      ) : (
        <ul className="space-y-3">
          {pageSlice.map((c) => (
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
                  {c.work && (
                    <p className="font-sans text-xs text-stone-400 mt-2">
                      على{' '}
                      <Link to={`/reading/${c.work.id}`} className="text-primary hover:underline">
                        «{c.work.title}»
                      </Link>
                    </p>
                  )}
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

      {!loading && !error && totalPages > 1 && (
        <nav className="flex items-center justify-between" aria-label="تصفّح التعليقات">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-stone-200 font-sans text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={14} aria-hidden="true" />
            السابق
          </button>
          <span className="font-sans text-sm text-stone-500">
            صفحة {page} من {totalPages} — {comments.length} تعليق
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-stone-200 font-sans text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            التالي
            <ChevronLeft size={14} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}
