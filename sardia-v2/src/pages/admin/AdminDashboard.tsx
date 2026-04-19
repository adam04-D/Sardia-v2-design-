import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessageSquare, Clock, Heart } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { DashboardStats } from '../../types';

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.dashboardStats()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(e instanceof ApiError ? e.message : 'فشل التحميل'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="font-sans text-stone-500">جاري التحميل...</p>;
  if (error) return <p className="font-sans text-red-600">{error}</p>;
  if (!data) return null;

  const cards = [
    { label: 'الأعمال', value: data.stats.totalWorks, icon: BookOpen, color: 'text-accent' },
    { label: 'التعليقات المعتمدة', value: data.stats.approvedComments, icon: MessageSquare, color: 'text-emerald-600' },
    { label: 'بانتظار الموافقة', value: data.stats.pendingComments, icon: Clock, color: 'text-amber-600' },
    { label: 'إجمالي الإعجابات', value: data.stats.totalLikes, icon: Heart, color: 'text-rose-600' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-3xl font-bold text-primary">لوحة التحكم</h1>
        <p className="font-sans text-sm text-stone-500 mt-1">نظرة عامة على نشاط الموقع</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm">
            <Icon size={20} aria-hidden="true" className={color} />
            <p className="font-sans text-xs text-stone-500 mt-3">{label}</p>
            <p className="font-serif text-3xl font-bold text-primary mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-stone-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl font-bold text-primary">أحدث الأعمال</h2>
            <Link to="/admin/works" className="font-sans text-xs text-accent hover:underline">عرض الكل</Link>
          </div>
          {data.recentWorks.length === 0 ? (
            <p className="font-sans text-sm text-stone-400">لا توجد أعمال</p>
          ) : (
            <ul className="space-y-2">
              {data.recentWorks.map((w) => (
                <li key={w.id} className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0">
                  <span className="font-sans text-sm text-stone-700 truncate">{w.title}</span>
                  <span className="font-sans text-xs text-stone-400 flex items-center gap-1">
                    <Heart size={12} aria-hidden="true" /> {w.likes_count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-xl border border-stone-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl font-bold text-primary">تعليقات بانتظار الموافقة</h2>
            <Link to="/admin/comments" className="font-sans text-xs text-accent hover:underline">المراجعة</Link>
          </div>
          {data.recentPending.length === 0 ? (
            <p className="font-sans text-sm text-stone-400">لا توجد تعليقات معلقة</p>
          ) : (
            <ul className="space-y-3">
              {data.recentPending.map((c) => (
                <li key={c.id} className="border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                  <p className="font-sans text-xs text-stone-400 mb-1">
                    {c.author_name} على «{c.work?.title ?? '—'}»
                  </p>
                  <p className="font-sans text-sm text-stone-700 line-clamp-2">{c.content}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
