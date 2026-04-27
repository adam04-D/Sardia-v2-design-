import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import Seo from '../components/Seo';
import { EmptyState } from '../components/ui/EmptyState';
import { WorkCardSkeleton } from '../components/ui/Skeleton';
import { useBookmarks } from '../hooks/useBookmarks';
import { api } from '../lib/api';
import { cdnImage, cdnSrcSet } from '../lib/img';
import type { Work } from '../types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop';

// "Saved" page — the destination from the bookmark icon on ReadingPage.
// Bookmarks are local-only (see useBookmarks), so this page rehydrates by
// fetching each work individually. With realistic counts (<50) this is
// fine; if it grows we can add a /works?ids= endpoint later.

export default function SavedPage() {
  const { ids, remove } = useBookmarks();
  const [works, setWorks] = useState<Work[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Key the effect on the joined id list (string identity) instead of `ids`
  // (array identity) so calling `remove()` mid-effect — which mutates the
  // bookmark store and produces a new `ids` array — does not retrigger the
  // fetch loop. `remove` is also intentionally outside the dep list because
  // its identity changes whenever the store updates.
  const idsKey = ids.join(',');

  useEffect(() => {
    if (ids.length === 0) {
      setWorks([]);
      return;
    }
    let cancelled = false;
    setWorks(null);
    setError(null);
    Promise.allSettled(ids.map((id) => api.getWork(id)))
      .then((results) => {
        if (cancelled) return;
        const ok: Work[] = [];
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            ok.push(r.value.work);
          } else {
            // Work was deleted upstream — drop it from local bookmarks
            // so the page stays clean without a manual prune.
            remove(ids[i]);
          }
        });
        setWorks(ok);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return (
    <>
      <Seo
        title="إشاراتي المحفوظة"
        path="/saved"
        description="الأعمال التي حفظتها للعودة إليها لاحقاً على سرديا."
      />
      <section className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-16 max-w-3xl">
          <h1 className="font-serif text-5xl md:text-6xl text-primary leading-[1.2] mb-6">
            إشاراتي المحفوظة
          </h1>
          <p className="font-sans text-lg text-text-muted leading-[2.0]">
            الأعمال التي وضعتَ عليها إشارة للعودة إليها. تُحفظ على جهازك فقط.
          </p>
        </header>

        {works === null && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[0, 1, 2].map((i) => <WorkCardSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <p className="font-sans text-red-500 text-center py-20">
            تعذر تحميل المحفوظات: {error}
          </p>
        )}

        {works && works.length === 0 && (
          <EmptyState
            icon={Bookmark}
            title="لا توجد إشارات محفوظة بعد"
            description="افتح أحد الأعمال واضغط على أيقونة الإشارة لحفظه هنا."
          />
        )}

        {works && works.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {works.map((w) => (
              <Link to={`/reading/${w.id}`} key={w.id} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden rounded-[2rem] mb-8 bg-stone-100 relative">
                  <img
                    src={cdnImage(w.image_url, 800) || FALLBACK_IMAGE}
                    srcSet={cdnSrcSet(w.image_url, [400, 600, 800, 1200])}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    alt={w.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-2xl text-primary group-hover:text-accent transition-colors leading-snug mb-3">
                  {w.title}
                </h3>
                {w.excerpt && (
                  <p className="font-sans text-text-muted text-sm leading-relaxed line-clamp-3">
                    {w.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
