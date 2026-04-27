import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Heart, Eye, ChevronRight, ChevronLeft, BookOpen, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { api, ApiError } from '../../lib/api';
import { cdnImage } from '../../lib/img';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Pagination, Work } from '../../types';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

export default function AdminWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  // debouncedQuery drives the actual server call; query drives the input value.
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // When in search mode, hit the server-side FTS endpoint so admins can find
  // any work — not just ones on the currently-loaded page. Empty query falls
  // back to paged listing.
  const load = useCallback(async (p: number, q: string) => {
    setLoading(true);
    try {
      if (q) {
        const { works } = await api.searchWorks(q);
        setWorks(works);
        setPagination(null);
      } else {
        const { works, pagination } = await api.listWorks(p, PAGE_SIZE);
        setWorks(works);
        setPagination(pagination);
      }
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, debouncedQuery); }, [load, page, debouncedQuery]);

  const handleDelete = async (w: Work) => {
    if (!confirm(`حذف «${w.title}»؟ هذا الإجراء نهائي.`)) return;
    setDeletingId(w.id);
    try {
      await api.deleteWork(w.id);
      // If last item on a non-first page (and not in search mode), step back;
      // otherwise reload the current view (page or search results).
      if (!debouncedQuery && works.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await load(page, debouncedQuery);
      }
      toast.success(`تم حذف «${w.title}».`);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'فشل الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">الأعمال</h1>
          <p className="font-sans text-sm text-stone-500 mt-1">
            {pagination ? `${pagination.totalItems} عمل` : 'إدارة المحتوى الأدبي'}
          </p>
        </div>
        <Link
          to="/admin/works/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-sans text-sm font-bold hover:bg-accent transition-colors"
        >
          <Plus size={16} aria-hidden="true" />
          عمل جديد
        </Link>
      </header>

      {!loading && !error && (works.length > 0 || debouncedQuery) && (
        <div className="relative max-w-md">
          <Search size={16} aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالعنوان أو المقتطف..."
            className="w-full pr-10 pl-10 py-2.5 rounded-lg border border-stone-200 bg-white font-sans text-sm focus:outline-none focus:border-accent transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="مسح البحث"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      {loading ? (
        <p className="font-sans text-stone-500">جاري التحميل...</p>
      ) : error ? (
        <p className="font-sans text-red-600">{error}</p>
      ) : works.length === 0 && !debouncedQuery ? (
        <EmptyState
          icon={BookOpen}
          title="لا توجد أعمال بعد"
          description="ابدأ بإضافة أول عمل لعرضه في المكتبة."
          action={
            <Link
              to="/admin/works/new"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-sans text-sm font-bold hover:bg-accent transition-colors"
            >
              <Plus size={16} aria-hidden="true" />
              عمل جديد
            </Link>
          }
        />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-stone-100 overflow-x-auto">
            <table className="w-full min-w-[560px] text-right">
              <thead className="bg-stone-50 text-xs font-sans font-bold text-stone-500 uppercase">
                <tr>
                  <th className="px-4 py-3">العنوان</th>
                  <th className="px-4 py-3 w-24">إعجابات</th>
                  <th className="px-4 py-3 w-24">مشاهدات</th>
                  <th className="px-4 py-3 w-32">تاريخ الإضافة</th>
                  <th className="px-4 py-3 w-32">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {works.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center font-sans text-sm text-stone-400">
                      لا نتائج مطابقة لـ «{debouncedQuery}».
                    </td>
                  </tr>
                )}
                {works.map((w) => (
                  <tr key={w.id} className="border-t border-stone-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {w.image_url && (
                          <img src={cdnImage(w.image_url, 120)} alt={`غلاف ${w.title}`} loading="lazy" decoding="async" className="w-10 h-12 object-cover rounded" />
                        )}
                        <span className="font-sans text-sm text-stone-800">{w.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-stone-500">
                      <span className="inline-flex items-center gap-1"><Heart size={12} aria-hidden="true" /> {w.likes_count}</span>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-stone-500">
                      <span className="inline-flex items-center gap-1"><Eye size={12} aria-hidden="true" /> {w.views_count ?? 0}</span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-stone-400">
                      {new Date(w.created_at).toLocaleDateString('ar')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/works/${w.id}/edit`}
                          aria-label={`تعديل ${w.title}`}
                          className="p-2 rounded hover:bg-stone-100 text-stone-600"
                        >
                          <Pencil size={14} aria-hidden="true" />
                        </Link>
                        <button
                          onClick={() => handleDelete(w)}
                          disabled={deletingId === w.id}
                          aria-label={`حذف ${w.title}`}
                          className="p-2 rounded hover:bg-red-50 text-red-600 disabled:opacity-40"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && !debouncedQuery && (
            <nav className="flex items-center justify-between" aria-label="تصفّح الصفحات">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-stone-200 font-sans text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} aria-hidden="true" />
                السابق
              </button>
              <span className="font-sans text-sm text-stone-500">
                صفحة {pagination.currentPage} من {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-stone-200 font-sans text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                التالي
                <ChevronLeft size={14} aria-hidden="true" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
