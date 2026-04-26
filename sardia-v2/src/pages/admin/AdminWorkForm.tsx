import { useCallback, useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams, Link, useBeforeUnload } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { api, ApiError } from '../../lib/api';
import { cdnImage } from '../../lib/img';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/m4a', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/ogg'];

type Snapshot = { title: string; excerpt: string; fullContent: string };
const EMPTY_SNAPSHOT: Snapshot = { title: '', excerpt: '', fullContent: '' };

export default function AdminWorkForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [removeAudio, setRemoveAudio] = useState(false);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Snapshot of last-saved values so dirty-detection works after the async load
  // on edit pages and resets cleanly after submit.
  const [savedSnapshot, setSavedSnapshot] = useState<Snapshot>(EMPTY_SNAPSHOT);
  const isDirty =
    title !== savedSnapshot.title ||
    excerpt !== savedSnapshot.excerpt ||
    fullContent !== savedSnapshot.fullContent ||
    file !== null ||
    audioFile !== null ||
    removeAudio;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) {
      setFile(null);
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(picked.type)) {
      setError('نوع الملف غير مدعوم. استخدم JPG أو PNG أو WEBP أو GIF.');
      e.target.value = '';
      return;
    }
    if (picked.size > MAX_IMAGE_BYTES) {
      setError('حجم الصورة يتجاوز 5 ميغابايت.');
      e.target.value = '';
      return;
    }
    setError(null);
    setFile(picked);
  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) {
      setAudioFile(null);
      return;
    }
    if (!ACCEPTED_AUDIO_TYPES.includes(picked.type)) {
      setError('نوع الملف الصوتي غير مدعوم. استخدم MP3 أو M4A أو AAC أو WAV أو OGG.');
      e.target.value = '';
      return;
    }
    if (picked.size > MAX_AUDIO_BYTES) {
      setError('حجم الملف الصوتي يتجاوز 25 ميغابايت.');
      e.target.value = '';
      return;
    }
    setError(null);
    setAudioFile(picked);
    setRemoveAudio(false); // overrides any prior "remove" intent
  };

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
        setCurrentAudio(work.audio_url ?? null);
        setSavedSnapshot({
          title: work.title,
          excerpt: work.excerpt ?? '',
          fullContent: work.full_content ?? '',
        });
      })
      .catch((e) => { if (!cancelled) setError(e instanceof ApiError ? e.message : 'فشل التحميل'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  // beforeunload guard — browser-native confirm on tab close / refresh / external
  // nav when there are unsaved changes. The message text is ignored by modern
  // browsers (they show their own); the boolean return is what triggers the prompt.
  useBeforeUnload(useCallback((e: BeforeUnloadEvent) => {
    if (isDirty && !submitting) {
      e.preventDefault();
      e.returnValue = '';
    }
  }, [isDirty, submitting]));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('excerpt', excerpt);
    fd.append('full_content', fullContent);
    if (file) fd.append('image', file);
    if (audioFile) fd.append('audio', audioFile);
    if (removeAudio && !audioFile) fd.append('remove_audio', 'true');

    try {
      if (isEdit) await api.updateWork(Number(id), fd);
      else await api.createWork(fd);
      // Reset dirty snapshot so beforeunload doesn't fire on the post-save nav.
      setSavedSnapshot({ title, excerpt, fullContent });
      setFile(null);
      setAudioFile(null);
      setRemoveAudio(false);
      toast.success(isEdit ? 'تم حفظ التعديلات.' : 'تم إنشاء العمل.');
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
            <span className="font-normal text-stone-400 mr-2">
              يدعم Markdown — استخدم # للعناوين، &gt; للاقتباس، **للتأكيد**، *للميل*، --- لفاصل، وسطراً فارغاً للفقرة الجديدة
            </span>
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
              <img src={cdnImage(currentImage, 240)} alt="الغلاف الحالي" loading="lazy" decoding="async" className="w-20 h-28 object-cover rounded border border-stone-200" />
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
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <p className="font-sans text-xs text-stone-400 mt-2">
            JPG / PNG / WEBP / GIF — الحد الأقصى 5 ميغابايت.
          </p>
        </div>

        <div>
          <label htmlFor="audio" className="font-sans text-xs font-bold text-stone-600 block mb-2">
            القراءة الصوتية
            <span className="font-normal text-stone-400 mr-2">(اختيارية)</span>
          </label>
          {currentAudio && !audioFile && !removeAudio && (
            <div className="mb-3 space-y-2">
              <audio controls preload="none" src={currentAudio} className="w-full">
                المتصفح لا يدعم تشغيل الصوت.
              </audio>
              <button
                type="button"
                onClick={() => setRemoveAudio(true)}
                className="font-sans text-xs text-red-600 hover:text-red-700 underline"
              >
                إزالة الملف الصوتي الحالي
              </button>
            </div>
          )}
          {removeAudio && (
            <div className="mb-3 flex items-center gap-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <span className="font-sans text-xs text-red-700">
                سيتم حذف الملف الصوتي الحالي عند الحفظ.
              </span>
              <button
                type="button"
                onClick={() => setRemoveAudio(false)}
                className="font-sans text-xs text-stone-600 hover:text-stone-800 underline mr-auto"
              >
                تراجع
              </button>
            </div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-50 border border-dashed border-stone-300 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors">
            <Upload size={14} aria-hidden="true" />
            <span className="font-sans text-sm text-stone-600">
              {audioFile ? audioFile.name : currentAudio ? 'استبدل الملف الصوتي...' : 'اختر ملفاً صوتياً...'}
            </span>
            <input
              id="audio"
              type="file"
              accept={ACCEPTED_AUDIO_TYPES.join(',')}
              className="hidden"
              onChange={handleAudioChange}
            />
          </label>
          <p className="font-sans text-xs text-stone-400 mt-2">
            MP3 / M4A / AAC / WAV / OGG — الحد الأقصى 25 ميغابايت.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-sans text-sm font-bold hover:bg-accent transition-colors disabled:opacity-60"
          >
            {submitting ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء العمل'}
          </button>
          <Link
            to="/admin/works"
            onClick={(e) => {
              if (isDirty && !confirm('لديك تغييرات غير محفوظة. هل تريد المتابعة بدون حفظ؟')) {
                e.preventDefault();
              }
            }}
            className="font-sans text-sm text-stone-500 hover:text-stone-700"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
