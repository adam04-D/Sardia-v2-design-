/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Mail, BookOpen, Bookmark, Headphones, ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RevealText } from '../components/RevealText';
import Seo from '../components/Seo';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import { useWorks } from '../hooks/useWork';
import type { Work } from '../types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=800&auto=format&fit=crop';

function formatArabicDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ar', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scaleImage = useTransform(heroScroll, [0, 1], [1, 1.05]);

  const libraryRef = useRef(null);
  const { scrollYProgress: libScroll } = useScroll({ target: libraryRef, offset: ["start start", "end start"] });
  const yLibImage = useTransform(libScroll, [0, 1], ["0%", "15%"]);

  const { works: bentoWorks } = useWorks(1, 4);
  const featured = bentoWorks[0];
  const medium = bentoWorks[1];
  const small1 = bentoWorks[2];
  const small2 = bentoWorks[3];

  return (
    <>
      <Seo title="سرديا" path="/" />
      {/* ============================== */}
      {/* SECTION 1: المؤلف (Author)     */}
      {/* ============================== */}
      <section id="author" ref={heroRef} className="snap-section min-h-screen flex items-center pt-24">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center py-12 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div
            className="lg:col-span-5 relative group z-10"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="aspect-[3/4] overflow-hidden rounded-[2rem] shadow-2xl shadow-accent/10 relative">
              <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-1000 z-10 mix-blend-multiply"></div>
              <motion.img
                style={{ y: useTransform(heroScroll, [0, 1], ["0%", "15%"]), scale: scaleImage }}
                src="/adam.webp"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.endsWith('/adam.webp')) {
                    img.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop';
                  }
                }}
                alt="Adam Daoudi"
                className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000 relative"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -bottom-10 -left-10 glass-panel p-8 rounded-3xl max-w-[280px] z-20"
            >
              <Eyebrow className="mb-3">الاسم الأدبي</Eyebrow>
              <h1 className="font-serif text-4xl font-bold text-text-main">آدم داودي</h1>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-7 space-y-10 lg:pt-16 z-20">
            <div className="space-y-8">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-sans text-xs font-bold tracking-[0.2em] text-accent flex items-center gap-4"
              >
                <span className="w-12 h-[1px] bg-accent"></span>
                سيرة علمية وأدبية
              </motion.span>

              <RevealText
                text="مرحباً، أنا آدم داودي. أكتب القصص والأفكار التي تعكس نبض الحياة اليومية."
                className="font-serif text-4xl lg:text-5xl xl:text-6xl leading-[1.3] text-text-main"
                delay={0.4}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="font-sans text-lg text-text-muted leading-relaxed max-w-2xl"
              >
                هذا الموقع هو مساحتي الخاصة لمشاركة أعمالي الأدبية معكم. أسعى عبر "سرديا" لترجمة هذا الشغف إلى نصوص معاصرة تربط القارئ بجذوره العميقة. أكتبُ لا لأوثق الحقيقة فحسب، بل لأخلق عالماً يسكنه الخيال والتدبر.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap gap-4 pt-6"
            >
              <a href="#contact" className="group relative overflow-hidden bg-primary text-surface px-8 py-4 rounded-full font-sans text-sm font-bold transition-all hover:shadow-xl hover:shadow-primary/20 flex items-center gap-3">
                <span className="absolute inset-0 w-full h-full bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                <span className="relative z-10 flex items-center gap-3">
                  <Mail size={18} />
                  تواصل معي
                </span>
              </a>
              <a
                href="#library"
                className="group border border-accent/30 text-accent px-8 py-4 rounded-full font-sans text-sm font-bold transition-all hover:bg-accent hover:text-surface flex items-center gap-3"
              >
                استكشف أعمالي
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Divider */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="mx-6 md:mx-12 max-w-7xl lg:mx-auto rounded-[3rem] overflow-hidden h-[500px] relative group shadow-2xl shadow-accent/10 mt-16 mb-8"
      >
        <img
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop"
          alt="Library"
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1c] via-[#1a1c1c]/60 to-transparent opacity-90"></div>
        <div className="absolute bottom-20 right-10 md:right-20 max-w-3xl text-right">
          <RevealText
            text='"الكتابة هي التنفس الوحيد الذي لا يحتاج لرئتين، بل لقلب نابض بالحكايات."'
            className="font-serif italic text-3xl md:text-5xl text-white leading-[1.6] mb-10"
          />
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-sans text-sm text-accent font-bold tracking-[0.2em]"
          >
            — من مذكرات آدم داودي
          </motion.p>
        </div>
      </motion.section>

      {/* ============================== */}
      {/* SECTION 2: المكتبة (Library)    */}
      {/* ============================== */}
      <section id="library" ref={libraryRef} className="snap-section min-h-screen py-32">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">

          {/* Library Header */}
          <header className="mb-24 max-w-4xl relative z-10">
            <RevealText
              text="أثرُ الكلمة، في رحابِ المعنى."
              className="font-serif text-6xl md:text-7xl lg:text-8xl text-primary mb-8 leading-[1.2]"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-text-muted leading-[2.0] max-w-2xl font-sans"
            >
              مساحةٌ رقمية مهيأة للباحثين عن جودة النص وعمق الفكرة. نجمعُ لك نفائس الأدب العربي في قالبٍ يليقُ بجلالِ الحرف.
            </motion.p>
          </header>

          {/* Bento Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:grid-rows-2 mb-40">

            {/* Featured Card (Large) */}
            {featured && (
              <Link to={`/reading/${featured.id}`} className="md:col-span-2 md:row-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  whileHover={{ y: -12, scale: 1.01, boxShadow: "0 25px 50px -12px rgba(139, 94, 52, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full relative group overflow-hidden rounded-[2.5rem] bg-surface shadow-xl shadow-accent/5 min-h-[400px] md:min-h-[500px] border border-accent/5"
                >
                  <div className="absolute inset-0 z-0">
                    <motion.img
                      style={{ y: yLibImage }}
                      src={featured.image_url ?? FALLBACK_IMAGE}
                      alt={featured.title}
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
                  whileHover={{ y: -12, scale: 1.01, boxShadow: "0 25px 50px -12px rgba(139, 94, 52, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
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
                  whileHover={{ y: -12, scale: 1.01, boxShadow: "0 25px 50px -12px rgba(139, 94, 52, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="h-full relative group overflow-hidden rounded-[2.5rem] bg-white border border-stone-200/50 shadow-sm min-h-[240px]"
                >
                  <div className="p-8 h-full flex flex-col items-center text-center justify-center">
                    <div className="transition-all duration-700 group-hover:opacity-0 group-hover:scale-95">
                      <h4 className="font-serif text-3xl text-primary mb-3 line-clamp-2">{small1.title}</h4>
                      <p className="font-sans text-xs font-bold text-stone-400 tracking-wider">
                        {formatArabicDate(small1.created_at)}
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
                  whileHover={{ y: -12, scale: 1.01, boxShadow: "0 25px 50px -12px rgba(139, 94, 52, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
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
          </div>

          {/* Secondary Feed */}
          <div className="mb-20">
            <SectionHeading title="أحدث الإضافات" className="mb-12" />

            <LatestWorks />
          </div>
        </div>
      </section>
    </>
  );
}

function LatestWorks() {
  const [works, setWorks] = useState<Work[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.listWorks(1, 3)
      .then((d) => { if (!cancelled) setWorks(d.works); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);

  if (error) return null;

  if (works === null) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] rounded-[2rem] bg-stone-100 mb-8" />
            <div className="h-3 w-32 bg-stone-100 rounded mb-3" />
            <div className="h-6 w-4/5 bg-stone-100 rounded mb-3" />
            <div className="h-4 w-full bg-stone-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <p className="font-sans text-stone-400 text-center py-12">لا توجد أعمال منشورة بعد.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {works.map((w, i) => (
        <Link to={`/reading/${w.id}`} key={w.id}>
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.01 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: i * 0.2, ease: 'easeOut' }}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] mb-8 bg-stone-100 relative">
              <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-multiply" />
              <img
                src={w.image_url ?? FALLBACK_IMAGE}
                alt={w.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110"
              />
            </div>
            <div className="space-y-4 px-2">
              <div className="flex gap-4 font-sans text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                <span>{formatArabicDate(w.created_at)}</span>
                <span className="text-accent">•</span>
                <span>عمل أدبي</span>
              </div>
              <h4 className="font-serif text-3xl text-primary group-hover:text-accent transition-colors duration-300 leading-snug">
                {w.title}
              </h4>
              {w.excerpt && (
                <p className="font-sans text-text-muted text-sm leading-relaxed line-clamp-2">
                  {w.excerpt}
                </p>
              )}
            </div>
          </motion.article>
        </Link>
      ))}
    </div>
  );
}
