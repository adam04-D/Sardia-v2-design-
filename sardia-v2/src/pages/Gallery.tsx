/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { BookOpen, Bookmark, Headphones, ArrowLeft, Library } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { RevealText } from '../components/RevealText';
import { useWorks } from '../hooks/useWork';
import Seo from '../components/Seo';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import { EmptyState } from '../components/ui/EmptyState';
import { BentoSkeleton, WorkCardSkeleton } from '../components/ui/Skeleton';
import { cdnImage, cdnSrcSet } from '../lib/img';
import type { Work } from '../types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop';

export default function Gallery() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yImage = useTransform(heroScroll, [0, 1], ["0%", "15%"]);
  const { works, loading, error } = useWorks(1, 9);

  const featured = works[0];
  const medium = works[1];
  const small1 = works[2];
  const small2 = works[3];
  const rest = works.slice(4);

  return (
    <>
      <Seo
        title="المكتبة"
        path="/gallery"
        description="مكتبة سرديا: اكتشف أحدث الإصدارات، المختارات الشعرية، الدراسات النقدية والقصص القصيرة للأديب آدم داودي."
      />
      {/* Hero Section */}
      <header ref={heroRef} className="mb-24 max-w-4xl relative z-10">
        <RevealText
          text="أثرُ الكلمة، في رحابِ المعنى."
          className="font-serif text-6xl md:text-7xl lg:text-8xl text-primary mb-8 leading-[1.2]"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl text-text-muted leading-[2.0] max-w-2xl font-sans"
        >
          مساحةٌ رقمية مهيأة للباحثين عن جودة النص وعمق الفكرة. نجمعُ لك نفائس الأدب العربي في قالبٍ يليقُ بجلالِ الحرف.
        </motion.p>
      </header>

      {loading && (
        <>
          <BentoSkeleton />
          <section className="mb-40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[0, 1, 2].map((i) => <WorkCardSkeleton key={i} />)}
            </div>
          </section>
        </>
      )}
      {error && !loading && (
        <p className="font-sans text-red-500 text-center py-20">تعذر تحميل الأعمال: {error}</p>
      )}
      {!loading && !error && works.length === 0 && (
        <EmptyState
          icon={Library}
          title="لا توجد أعمال منشورة بعد"
          description="ستظهر الإصدارات الجديدة هنا فور نشرها. عُد قريباً لاستكشاف المكتبة."
        />
      )}

      {/* Bento Gallery Grid */}
      {!loading && !error && works.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 md:grid-rows-2 mb-40">

          {/* Featured Card (Large) */}
          {featured && (
            <Link to={`/reading/${featured.id}`} className="md:col-span-2 md:row-span-2">
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full relative group overflow-hidden rounded-[2.5rem] bg-surface shadow-xl shadow-accent/5 min-h-[400px] md:min-h-[500px]"
              >
                <div className="absolute inset-0 z-0">
                  <motion.img
                    style={{ y: yImage }}
                    src={cdnImage(featured.image_url, 1600) || FALLBACK_IMAGE}
                    srcSet={cdnSrcSet(featured.image_url, [800, 1200, 1600, 2000])}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    alt={featured.title}
                    loading="lazy"
                    className="w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-105 opacity-30 grayscale group-hover:grayscale-0 relative -top-[10%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
                </div>

                <div className="relative z-10 p-10 md:p-12 h-full flex flex-col justify-end">
                  <div className="transition-all duration-700 group-hover:opacity-0 group-hover:-translate-y-4">
                    <Eyebrow className="mb-4">إصدار مميز</Eyebrow>
                    <h2 className="font-serif text-5xl md:text-6xl text-primary mb-4">{featured.title}</h2>
                    {featured.excerpt && (
                      <p className="font-sans text-lg text-text-muted line-clamp-2">{featured.excerpt}</p>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-white/95 p-10 md:p-12 flex flex-col justify-center items-start opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
                    {featured.excerpt && (
                      <p className="font-serif text-2xl md:text-3xl leading-[1.8] text-primary mb-10 italic line-clamp-5">
                        "{featured.excerpt}"
                      </p>
                    )}
                    <span className="bg-primary text-surface px-8 py-4 rounded-full font-sans text-sm font-bold flex items-center gap-4 hover:bg-accent transition-colors shadow-lg shadow-primary/20">
                      اقرأ العمل كاملاً
                      <ArrowLeft size={18} />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

          {/* Medium Card */}
          {medium && (
            <Link to={`/reading/${medium.id}`} className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="h-full relative group overflow-hidden rounded-[2.5rem] bg-stone-100/80 border border-stone-200/50 min-h-[240px]"
              >
                <div className="p-10 h-full flex flex-col justify-between border-r-4 border-accent">
                  <div className="transition-all duration-700 group-hover:opacity-0 group-hover:-translate-y-4">
                    <BookOpen className="text-accent mb-6" size={28} strokeWidth={1.5} />
                    <h3 className="font-serif text-3xl md:text-4xl text-primary mb-3">{medium.title}</h3>
                    {medium.excerpt && (
                      <p className="font-sans text-text-muted line-clamp-2">{medium.excerpt}</p>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-accent p-10 flex flex-col justify-center text-white opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
                    {medium.excerpt && (
                      <p className="font-serif text-2xl leading-[1.8] mb-8 italic line-clamp-4">
                        "{medium.excerpt}"
                      </p>
                    )}
                    <span className="font-sans text-sm font-bold tracking-wider flex items-center gap-2 hover:text-stone-200 transition-colors">
                      اقرأ العمل
                      <ArrowLeft size={16} />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

          {/* Small Card 1 */}
          {small1 && (
            <Link to={`/reading/${small1.id}`} className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="h-full relative group overflow-hidden rounded-[2.5rem] bg-white border border-stone-200/50 shadow-sm min-h-[240px]"
              >
                <div className="p-8 h-full flex flex-col items-center text-center justify-center">
                  <div className="transition-all duration-700 group-hover:opacity-0 group-hover:scale-95">
                    <h4 className="font-serif text-3xl text-primary mb-3 line-clamp-2">{small1.title}</h4>
                    <p className="font-sans text-xs font-bold text-stone-400 tracking-wider">
                      {new Date(small1.created_at).toLocaleDateString('ar')}
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-surface p-8 flex flex-col justify-center items-center opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-[0.16,1,0.3,1]">
                    <Bookmark className="text-accent mb-4" size={24} strokeWidth={1.5} />
                    {small1.excerpt && (
                      <p className="font-sans text-sm text-text-muted mb-6 line-clamp-3">{small1.excerpt}</p>
                    )}
                    <span className="text-primary font-sans font-bold hover:text-accent transition-colors border-b border-primary hover:border-accent pb-1">ابدأ القراءة</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

          {/* Small Card 2 */}
          {small2 && (
            <Link to={`/reading/${small2.id}`} className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="h-full relative group overflow-hidden rounded-[2.5rem] bg-stone-100/50 min-h-[240px]"
              >
                <div className="p-8 h-full flex flex-col justify-between">
                  <div className="transition-all duration-700 group-hover:opacity-0 group-hover:-translate-x-4">
                    <span className="font-serif text-5xl text-accent/20 block mb-2">«</span>
                    <h4 className="font-serif text-3xl text-primary mb-2 line-clamp-2">{small2.title}</h4>
                    <p className="font-sans text-xs font-bold text-stone-400 tracking-wider">
                      {small2.likes_count} إعجاب
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-primary p-8 flex flex-col justify-center items-center text-white opacity-0 translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
                    {small2.excerpt && (
                      <p className="font-sans text-center text-sm leading-relaxed mb-6 line-clamp-4">{small2.excerpt}</p>
                    )}
                    <Headphones size={24} strokeWidth={1.5} className="text-stone-300" />
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

        </section>
      )}

      {/* Secondary Feed Section */}
      {!loading && !error && rest.length > 0 && (
        <section className="mb-40">
          <SectionHeading title="أحدث الإضافات" className="mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {rest.map((article: Work, i) => (
              <Link to={`/reading/${article.id}`} key={article.id}>
                <motion.article
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] mb-8 bg-stone-100 relative">
                    <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-multiply"></div>
                    <img
                      src={cdnImage(article.image_url, 800) || FALLBACK_IMAGE}
                      srcSet={cdnSrcSet(article.image_url, [400, 600, 800, 1200])}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-4 px-2">
                    <div className="flex gap-4 font-sans text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                      <span>{new Date(article.created_at).toLocaleDateString('ar')}</span>
                      <span className="text-accent">•</span>
                      <span>{article.likes_count} إعجاب</span>
                    </div>
                    <h4 className="font-serif text-3xl text-primary group-hover:text-accent transition-colors duration-300 leading-snug">
                      {article.title}
                    </h4>
                    {article.excerpt && (
                      <p className="font-sans text-text-muted text-sm leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
