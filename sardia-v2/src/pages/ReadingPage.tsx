/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Bookmark, Maximize, Minimize, Type, Plus, Minus, Share2, List, X, ArrowRight, Heart, Send } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

const SITE_AUTHOR = {
  name: 'آدم داودي',
  role: 'أديب وكاتب',
  avatar: '/adam.webp',
};
const COMMENT_MAX_LENGTH = 2000;
const NAME_MAX_LENGTH = 80;
import { RevealText } from '../components/RevealText';
import { useWork } from '../hooks/useWork';
import { api } from '../lib/api';
import { cdnImage, cdnSrcSet } from '../lib/img';
import type { Comment as WorkComment, Work } from '../types';
import Seo from '../components/Seo';
import MarkdownContent from '../components/MarkdownContent';

// Reader Interaction Component
const ReaderInteraction = ({
  liked,
  onToggleLike,
  onSubmitComment,
  comments,
}: {
  liked: boolean;
  onToggleLike: () => void;
  onSubmitComment: (name: string, content: string, website: string) => Promise<string | null>;
  comments: WorkComment[];
}) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  // Honeypot — must stay empty. Hidden from users, visible to bots.
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  const trimmedName = name.trim();
  const trimmedComment = comment.trim();
  const overName = trimmedName.length > NAME_MAX_LENGTH;
  const overComment = trimmedComment.length > COMMENT_MAX_LENGTH;

  const handleSubmit = async () => {
    if (!trimmedName || !trimmedComment || submitting || overName || overComment) return;
    setSubmitting(true);
    setStatus(null);
    const err = await onSubmitComment(trimmedName, trimmedComment, website);
    setSubmitting(false);
    if (err) {
      setStatus({ kind: 'err', msg: err });
    } else {
      setStatus({ kind: 'ok', msg: 'تم إرسال التعقيب، سيظهر بعد الموافقة.' });
      setName("");
      setComment("");
      setWebsite("");
    }
  };

  return (
    <section className="mt-32 pt-16 border-t border-accent/10">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 text-center md:text-right">
          <div className="space-y-2">
            <h3 className="font-serif text-3xl text-primary font-bold">شاركنا أثر النص</h3>
            <p className="font-sans text-sm text-text-muted">اترك انطباعك أو كلمة للمؤلف</p>
          </div>
          <button
            onClick={onToggleLike}
            aria-label={liked ? 'تم تسجيل إعجابك' : 'أعجبني'}
            aria-pressed={liked}
            className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-500 border group ${liked ? 'bg-accent/5 border-accent text-accent shadow-lg shadow-accent/5' : 'bg-stone-50 border-stone-200 text-stone-400 hover:border-accent/30 hover:bg-stone-100'}`}
          >
            <Heart size={22} fill={liked ? "currentColor" : "none"} aria-hidden="true" className={`transition-transform duration-500 ${liked ? "scale-110" : "group-hover:scale-110"}`} />
            <span className="font-sans text-sm font-bold tracking-wide">{liked ? "أعجبك النص" : "أعجبني"}</span>
          </button>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-accent/10"></div>
          
          <div className="grid grid-cols-1 gap-8 relative z-10">
            <div className="space-y-3">
              <label className="font-sans text-[10px] font-bold text-accent uppercase tracking-[0.2em] mr-2 text-right block">الاسم</label>
              <input
                type="text"
                placeholder="الاسم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={NAME_MAX_LENGTH + 20}
                className="w-full bg-white/40 border border-stone-200 rounded-2xl px-6 py-4 font-sans text-text-main focus:outline-none focus:border-accent/30 focus:bg-white transition-all placeholder:text-stone-300 shadow-sm text-right"
              />
              {overName && (
                <p className="font-sans text-xs text-red-500 text-right">الاسم طويل جداً (الحد الأقصى {NAME_MAX_LENGTH} حرفاً).</p>
              )}
            </div>
            
            <div className="space-y-3">
              <label className="font-sans text-[10px] font-bold text-accent uppercase tracking-[0.2em] mr-2 text-right block">التعليق</label>
              <textarea
                rows={4}
                placeholder="ما الذي استوقفك في هذا العمل؟"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={COMMENT_MAX_LENGTH + 100}
                className="w-full bg-white/40 border border-stone-200 rounded-2xl px-6 py-4 font-sans text-text-main focus:outline-none focus:border-accent/30 focus:bg-white transition-all placeholder:text-stone-300 resize-none shadow-sm text-right"
              />
              <div className={`flex justify-between items-center font-sans text-xs ${overComment ? 'text-red-500' : 'text-stone-400'}`}>
                <span>{overComment ? 'تجاوزت الحد المسموح' : ''}</span>
                <span>{trimmedComment.length} / {COMMENT_MAX_LENGTH}</span>
              </div>
            </div>
          </div>

          {/* Honeypot — off-screen, tab-index -1, autocomplete off. Real users never see it. */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !trimmedName || !trimmedComment || overName || overComment}
            className="w-full group relative overflow-hidden bg-primary text-surface px-8 py-5 rounded-2xl font-sans text-sm font-bold transition-all hover:shadow-2xl hover:shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 w-full h-full bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]"></span>
            <span className="relative z-10 flex items-center gap-3">
              <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              {submitting ? 'جاري الإرسال...' : 'إرسال التعقيب'}
            </span>
          </button>

          {status && (
            <p className={`relative z-10 font-sans text-sm text-center ${status.kind === 'ok' ? 'text-accent' : 'text-red-500'}`}>
              {status.msg}
            </p>
          )}
        </div>

        <div className="mt-16 space-y-6">
          <h4 className="font-serif text-xl text-primary font-bold text-right">تعقيبات القراء</h4>
          {comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((c) => (
                <li key={c.id} className="glass-panel p-6 rounded-2xl text-right">
                  <p className="font-sans text-text-main leading-relaxed">{c.content}</p>
                  <div className="mt-3 flex justify-between items-center font-sans text-xs text-text-muted">
                    <span>— {c.author_name}</span>
                    <span>{new Date(c.created_at).toLocaleDateString('ar')}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-text-muted text-center py-8 text-sm">
              لا توجد تعقيبات بعد — كن أول من يترك أثراً على هذا العمل.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

function TopProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}

export default function ReadingPage() {
  const { id } = useParams<{ id: string }>();
  const { work, loading, error } = useWork(id);

  const [comments, setComments] = useState<WorkComment[]>([]);

  // Keyed on work?.id only so optimistic comment updates aren't overwritten
  useEffect(() => {
    setComments(work?.comments ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work?.id]);

  // Record a view once per work load (backend dedups by fingerprint+day)
  useEffect(() => {
    if (!work?.id) return;
    api.recordView(work.id).catch(() => {});
  }, [work?.id]);

  const [relatedWorks, setRelatedWorks] = useState<Work[]>([]);
  useEffect(() => {
    if (!work?.id) return;
    let cancelled = false;
    api.listWorks(1, 8)
      .then(({ works }) => {
        if (cancelled) return;
        setRelatedWorks(works.filter((w) => w.id !== work.id).slice(0, 3));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [work?.id]);

  const [shareToast, setShareToast] = useState<string | null>(null);
  const handleShare = async () => {
    const url = window.location.href;
    const title = work?.title ?? 'سرديا';
    try {
      if (navigator.share) {
        await navigator.share({ title, url, text: work?.excerpt ?? '' });
        return;
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareToast('تم نسخ الرابط');
      setTimeout(() => setShareToast(null), 2000);
    } catch {
      setShareToast('تعذر نسخ الرابط');
      setTimeout(() => setShareToast(null), 2000);
    }
  };

  // Always scroll to top when opening a new reading page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [isZenMode, setIsZenMode] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  useEffect(() => {
    setLikesCount(work?.likes_count ?? 0);
  }, [work?.likes_count]);
  const [fontSize, setFontSize] = useState(1);

  const handleLike = async () => {
    if (!id) {
      setLiked((v) => !v);
      return;
    }
    if (liked) return; // backend only increments
    setLiked(true);
    setLikesCount((n) => n + 1);
    try {
      const { likes_count } = await api.likeWork(id);
      setLikesCount(likes_count);
    } catch {
      setLiked(false);
      setLikesCount((n) => Math.max(0, n - 1));
    }
  };

  const handleSubmitComment = async (author_name: string, content: string, website: string): Promise<string | null> => {
    if (!id) return 'التعليقات متاحة فقط على الأعمال المنشورة.';
    try {
      await api.addComment(id, { author_name, content, website });
      return null;
    } catch (e) {
      return (e as Error).message || 'تعذر إرسال التعقيب.';
    }
  };

  // Derived display values (API data or neutral placeholder while loading)
  const displayTitle = work?.title ?? '';
  const displayExcerpt = work?.excerpt ?? '';
  const displayImage =
    work?.image_url ??
    'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=2000&auto=format&fit=crop';
  const fullContent = work?.full_content?.trim() || null;
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState('ch1');
  
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yImage = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const opacityImage = useTransform(heroScroll, [0, 1], [1, 0.3]);

  const toggleZenMode = async () => {
    try {
      if (!isZenMode) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else {
          setIsZenMode(true); // Fallback for browsers that block it
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        } else {
          setIsZenMode(false); // Fallback
        }
      }
    } catch {
      setIsZenMode(!isZenMode);
    }
  };

  // Sync state if user exits via ESC key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsZenMode(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 0.1, 1.5));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 0.1, 0.8));

  const [chapters, setChapters] = useState<{ id: string; title: string }[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Track if we are at the bottom of the page to hide the floating bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bodyHeight = document.body.offsetHeight;
      setIsAtBottom(bodyHeight - scrollPosition < 500); // Hide when within 500px of bottom margin
    };
    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount in case the page is short
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-detect chapters from the DOM and track the active one
  useEffect(() => {
    const chapterEls = document.querySelectorAll('[id^="ch"]');
    const detected: { id: string; title: string }[] = [];
    chapterEls.forEach((el) => {
      const heading = el.querySelector('h2');
      if (heading) {
        detected.push({ id: el.id, title: heading.textContent || '' });
      }
    });
    setChapters(detected);
    if (detected.length > 0) setActiveChapter(detected[0].id);

    const observers: IntersectionObserver[] = [];
    chapterEls.forEach((el) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveChapter(el.id);
          }
        },
        { rootMargin: '-20% 0px -60% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Effect to handle zen mode body classes
  useEffect(() => {
    if (isZenMode) {
      document.body.classList.add('zen-mode-active');
    } else {
      document.body.classList.remove('zen-mode-active');
    }
    return () => document.body.classList.remove('zen-mode-active');
  }, [isZenMode]);

  // Bare /reading with no work selected → send to the library (after all hooks)
  if (!id) return <Navigate to="/gallery" replace />;

  return (
    <div className={`transition-colors duration-1000 ${isZenMode ? 'bg-[#FDFBF7]' : ''}`}>
      <Seo
        title={displayTitle}
        description={displayExcerpt}
        path={id ? `/reading/${id}` : '/reading'}
        image={work?.image_url ?? undefined}
        type="article"
        article={{
          publishedTime: work?.created_at,
          modifiedTime: work?.updated_at ?? work?.created_at,
          author: SITE_AUTHOR.name,
        }}
      />
      <TopProgressBar />

      {/* Zen Mode Escape Button */}
      {isZenMode && (
        <div className="fixed top-0 right-0 p-8 z-[60] opacity-0 hover:opacity-100 transition-opacity duration-500">
          <Link to="/" className="flex items-center gap-2 text-stone-500 hover:text-accent font-sans text-sm font-bold bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-stone-200/50 hover:shadow-accent/10 transition-all">
            <ArrowRight size={16} />
            العودة للمكتبة
          </Link>
        </div>
      )}

      {/* Table of Contents Drawer */}
      <AnimatePresence>
        {isTocOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTocOpen(false)}
              className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[90%] max-w-sm bg-surface/95 backdrop-blur-xl border-l border-accent/10 z-[80] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-accent/10 flex justify-between items-center">
                <h2 className="font-serif text-2xl text-primary font-bold">الفهرس</h2>
                <button onClick={() => setIsTocOpen(false)} aria-label="إغلاق الفهرس" className="p-2 text-stone-400 hover:text-accent transition-colors rounded-full hover:bg-accent/5">
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1">
                <div className="mb-8">
                  <p className="font-sans text-xs font-bold text-stone-400 tracking-wider uppercase mb-2">الكتاب</p>
                  <h3 className="font-serif text-xl text-primary">{displayTitle || '—'}</h3>
                </div>
                <ul className="space-y-1">
                  {chapters.map((chapter) => (
                    <li key={chapter.id}>
                      <a 
                        href={`#${chapter.id}`}
                        onClick={() => setIsTocOpen(false)}
                        className={`block p-4 rounded-2xl transition-all duration-300 group ${activeChapter === chapter.id ? 'bg-accent/5 border border-accent/10' : 'hover:bg-stone-50'}`}
                      >
                        <h4 className={`font-serif text-lg mb-1 transition-colors ${activeChapter === chapter.id ? 'text-accent font-bold' : 'text-text-main group-hover:text-primary'}`}>
                          {chapter.title}
                        </h4>

                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-1000 ${isZenMode ? 'max-w-3xl mx-auto' : ''}`}>
        
        {/* Immersive Hero Section */}
        <header ref={heroRef} className={`relative h-[60vh] min-h-[500px] items-center justify-center mb-24 overflow-hidden rounded-[3rem] ${isZenMode ? 'hidden' : 'flex'}`}>
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: yImage, opacity: opacityImage }}
          >
            <img
              src={cdnImage(displayImage, 2000) || displayImage}
              srcSet={cdnSrcSet(displayImage, [800, 1200, 1600, 2000, 2400])}
              sizes="100vw"
              alt={displayTitle}
              fetchPriority="high"
              decoding="async"
              className="w-full h-[120%] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-surface/20 backdrop-blur-[2px]"></div>
          </motion.div>

          <div className="relative z-10 text-center max-w-4xl px-6 mt-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-accent">دراسات نقدية</span>
              <span className="w-12 h-[1px] bg-accent/30"></span>
              <span className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-stone-500">كتاب كامل</span>
            </motion.div>
            
            <RevealText
              text={displayTitle}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-primary mb-8 leading-[1.2] justify-center"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl md:text-2xl text-text-muted leading-[2.0] font-sans max-w-2xl mx-auto"
            >
              {displayExcerpt}
            </motion.p>

            {id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="mt-8 font-sans text-sm text-text-muted"
              >
                {loading ? 'جاري التحميل...' : error ? `تعذر تحميل العمل: ${error}` : `${likesCount} إعجاب`}
              </motion.div>
            )}
          </div>
        </header>

        {/* Reading Content */}
        <article 
          className={`max-w-3xl mx-auto font-serif text-text-main leading-[2.2] transition-all duration-500 ${isZenMode ? 'pt-24' : ''}`}
          style={{ fontSize: `${1.125 * fontSize}rem` }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-6 mb-16 pb-8 border-b border-accent/10"
          >
            <img
              src={SITE_AUTHOR.avatar}
              alt={SITE_AUTHOR.name}
              loading="lazy"
              decoding="async"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/favicon.svg'; }}
              className="w-16 h-16 rounded-full object-cover grayscale"
            />
            <div>
              <h3 className="font-serif text-xl text-primary font-bold">{SITE_AUTHOR.name}</h3>
              <p className="font-sans text-sm text-text-muted">{SITE_AUTHOR.role}</p>
            </div>
            <div className="mr-auto flex gap-3">
              <button
                type="button"
                onClick={handleShare}
                aria-label="مشاركة"
                className="p-2 rounded-full border border-stone-200 text-stone-400 hover:text-accent hover:border-accent transition-colors"
              >
                <Share2 size={18} aria-hidden="true" />
              </button>
              <button aria-label="حفظ في الإشارات المرجعية" className="p-2 rounded-full border border-stone-200 text-stone-400 hover:text-accent hover:border-accent transition-colors">
                <Bookmark size={18} aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          <div className="space-y-12">
            {fullContent && (
              <div id="ch1" className="scroll-mt-32">
                <h2 className="text-3xl md:text-4xl text-primary font-bold mb-12 text-center">{displayTitle}</h2>
                <MarkdownContent source={fullContent} />
              </div>
            )}
            {!fullContent && loading && (
              <div id="ch1" className="scroll-mt-32 space-y-4" aria-hidden="true">
                <div className="animate-pulse bg-stone-200 h-10 w-2/3 mx-auto rounded mb-8" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse bg-stone-100 h-4 rounded" style={{ width: `${85 + ((i * 7) % 15)}%` }} />
                ))}
              </div>
            )}
            {!fullContent && !loading && (
              <div id="ch1" className="scroll-mt-32 text-center py-16">
                <p className="font-sans text-text-muted">
                  {error ? `تعذر تحميل النص: ${error}` : 'لم يُضف محتوى هذا العمل بعد.'}
                </p>
              </div>
            )}

            <ReaderInteraction
              liked={liked}
              onToggleLike={handleLike}
              onSubmitComment={handleSubmitComment}
              comments={comments}
            />

            {relatedWorks.length > 0 && (
              <section className="mt-24 pt-16 border-t border-accent/10" aria-labelledby="related-heading">
                <h4 id="related-heading" className="font-serif text-2xl text-primary font-bold text-center mb-10">
                  قد يستوقفك أيضاً
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedWorks.map((rw) => (
                    <Link
                      key={rw.id}
                      to={`/reading/${rw.id}`}
                      className="group glass-panel rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-accent/10 transition-all"
                    >
                      {rw.image_url && (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={cdnImage(rw.image_url, 800) || rw.image_url}
                            srcSet={cdnSrcSet(rw.image_url, [400, 800, 1200])}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            alt={`غلاف ${rw.title}`}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      )}
                      <div className="p-6 text-right">
                        <h5 className="font-serif text-xl text-primary font-bold group-hover:text-accent transition-colors mb-2 line-clamp-2">
                          {rw.title}
                        </h5>
                        {rw.excerpt && (
                          <p className="font-sans text-sm text-text-muted line-clamp-3 leading-relaxed">
                            {rw.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>

        <AnimatePresence>
          {shareToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[90] bg-primary text-surface px-6 py-3 rounded-full font-sans text-sm shadow-xl"
              role="status"
            >
              {shareToast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Control Menu */}
      <motion.div 
        initial={{ y: 100, opacity: 0, x: "-50%" }}
        animate={{ y: isAtBottom ? 150 : 0, opacity: isAtBottom ? 0 : 1, x: "-50%" }}
        transition={{ delay: isAtBottom ? 0 : 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-8 left-1/2 z-50 glass-panel rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl shadow-accent/10"
      >
        <button
          onClick={() => setIsTocOpen(true)}
          aria-label="فتح الفهرس"
          className="p-2 text-text-muted hover:text-accent transition-colors rounded-full hover:bg-accent/5"
          title="الفهرس (Table of Contents)"
        >
          <List size={20} aria-hidden="true" />
        </button>

        <div className="w-[1px] h-6 bg-stone-300"></div>

        <button
          onClick={toggleZenMode}
          aria-label={isZenMode ? 'الخروج من وضع القراءة' : 'الدخول في وضع القراءة'}
          aria-pressed={isZenMode}
          className={`p-2 rounded-full transition-colors ${isZenMode ? 'text-accent bg-accent/10' : 'text-text-muted hover:text-accent hover:bg-accent/5'}`}
          title="وضع القراءة (Zen Mode)"
        >
          {isZenMode ? <Minimize size={20} aria-hidden="true" /> : <Maximize size={20} aria-hidden="true" />}
        </button>
        
        <div className="w-[1px] h-6 bg-stone-300"></div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={decreaseFontSize}
            aria-label="تصغير حجم الخط"
            className="p-1.5 text-text-muted hover:text-accent transition-colors"
            disabled={fontSize <= 0.8}
          >
            <Minus size={16} aria-hidden="true" />
          </button>
          <button
            onClick={() => setFontSize(1)}
            title="الحجم الافتراضي (Reset Size)"
            aria-label="إعادة ضبط حجم الخط"
            className={`p-1.5 transition-colors ${fontSize === 1 ? 'text-primary' : 'text-accent font-bold'}`}
          >
            <Type size={18} aria-hidden="true" />
          </button>
          <button
            onClick={increaseFontSize}
            aria-label="تكبير حجم الخط"
            className="p-1.5 text-text-muted hover:text-accent transition-colors"
            disabled={fontSize >= 1.5}
          >
            <Plus size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="w-[1px] h-6 bg-stone-300"></div>

        <button
          className={`p-2 transition-colors ${liked ? 'text-accent' : 'text-text-muted hover:text-accent'}`}
          onClick={handleLike}
          aria-label={liked ? 'تم تسجيل إعجابك' : 'أعجبني'}
          aria-pressed={liked}
          title={liked ? 'تم الإعجاب' : 'إعجاب'}
        >
          <Heart size={20} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" className={`transition-transform duration-300 ${liked ? 'scale-110' : 'hover:scale-110'}`} />
        </button>
      </motion.div>
    </div>
  );
}

