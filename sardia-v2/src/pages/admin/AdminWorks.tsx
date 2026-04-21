import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { Pagination, Work } from '../../types';

const PAGE_SIZE = 20;

export default function AdminWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const { works, pagination } = await api.listWorks(p, PAGE_SIZE);
      setWorks(works);
      setPagination(pagination);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const handleDelete = async (w: Work) => {
    if (!confirm(`حذف «${w.title}»؟ هذا الإجراء نهائي.`)) return;
    setDeletingId(w.id);
    try {
      await api.deleteWork(w.id);
      // If last item on a non-first page, step back; otherwise reload current page
      if (works.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await load(page);
      }
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'فشل الحذف');
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

      {loading ? (
        <p className="font-sans text-stone-500">جاري التحميل...</p>
      ) : error ? (
        <p className="font-sans text-red-600">{error}</p>
      ) : works.length === 0 ? (
        <p className="font-sans text-stone-400">لا توجد أعمال بعد.</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-stone-50 text-xs font-sans font-bold text-stone-500 uppercase">
                <tr>
                  <th className="px-4 py-3">العنوان</th>
                  <th className="px-4 py-3 w-24">إعجابات</th>
                  <th className="px-4 py-3 w-32">تاريخ الإضافة</th>
                  <th className="px-4 py-3 w-32">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {works.map((w) => (
                  <tr key={w.id} className="border-t border-stone-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {w.image_url && (
                          <img src={w.image_url} alt="" className="w-10 h-12 object-cover rounded" />
                        )}
                        <span className="font-sans text-sm text-stone-800">{w.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-stone-500">
                      <span className="inline-flex items-center gap-1"><Heart size={12} aria-hidden="true" /> {w.likes_count}</span>
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

          {pagination && pagination.totalPages > 1 && (
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
