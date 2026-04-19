import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Heart } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { Work } from '../../types';

export default function AdminWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { works } = await api.listWorks(1, 100);
      setWorks(works);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (w: Work) => {
    if (!confirm(`حذف «${w.title}»؟ هذا الإجراء نهائي.`)) return;
    setDeletingId(w.id);
    try {
      await api.deleteWork(w.id);
      setWorks((prev) => prev.filter((x) => x.id !== w.id));
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
          <p className="font-sans text-sm text-stone-500 mt-1">إدارة المحتوى الأدبي</p>
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
      )}
    </div>
  );
}
