import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';
import { api, ApiError } from '../../lib/api';

export default function AdminWorkForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    api.getWork(id!)
      .then(({ work }) => {
        if (cancelled) return;
        setTitle(work.title);
        setExcerpt(work.excerpt ?? '');
        setFullContent(work.full_content ?? '');
        setCurrentImage(work.image_url);
      })
      .catch((e) => { if (!cancelled) setError(e instanceof ApiError ? e.message : 'فشل التحميل'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('excerpt', excerpt);
    fd.append('full_content', fullContent);
    if (file) fd.append('image', file);

    try {
      if (isEdit) await api.updateWork(Number(id), fd);
      else await api.createWork(fd);
      navigate('/admin/works');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'فشل الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="font-sans text-stone-500">جاري التحميل...</p>;

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <Link to="/admin/works" className="font-sans text-xs text-stone-500 hover:text-accent inline-flex items-center gap-1 mb-3">
          <ArrowRight size={12} aria-hidden="true" />
          العودة إلى الأعمال
        </Link>
        <h1 className="font-serif text-3xl font-bold text-primary">
          {isEdit ? 'تعديل عمل' : 'عمل جديد'}
        </h1>
      </header>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-100 p-8 space-y-6">
        <div>
          <label htmlFor="title" className="font-sans text-xs font-bold text-stone-600 block mb-2">العنوان *</label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="font-sans text-xs font-bold text-stone-600 block mb-2">المقتطف</label>
          <textarea
            id="excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
          />
        </div>

        <div>
          <label htmlFor="full_content" className="font-sans text-xs font-bold text-stone-600 block mb-2">
            المحتوى الكامل
            <span className="font-normal text-stone-400 mr-2">(افصل بين الفقرات بسطر فارغ)</span>
          </label>
          <textarea
            id="full_content"
            rows={14}
            value={fullContent}
            onChange={(e) => setFullContent(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 font-serif text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
          />
        </div>

        <div>
          <label htmlFor="image" className="font-sans text-xs font-bold text-stone-600 block mb-2">صورة الغلاف</label>
          {currentImage && !file && (
            <div className="mb-3 flex items-center gap-3">
              <img src={currentImage} alt="الغلاف الحالي" className="w-20 h-28 object-cover rounded border border-stone-200" />
              <span className="font-sans text-xs text-stone-400">الغلاف الحالي. اختر ملفاً لاستبداله.</span>
            </div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-50 border border-dashed border-stone-300 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors">
            <Upload size={14} aria-hidden="true" />
            <span className="font-sans text-sm text-stone-600">
              {file ? file.name : 'اختر صورة...'}
            </span>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-sans text-sm font-bold hover:bg-accent transition-colors disabled:opacity-60"
          >
            {submitting ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء العمل'}
          </button>
          <Link to="/admin/works" className="font-sans text-sm text-stone-500 hover:text-stone-700">
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
