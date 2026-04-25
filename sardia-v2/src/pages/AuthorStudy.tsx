/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Mail, Eye, Heart } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { RevealText } from '../components/RevealText';
import Seo from '../components/Seo';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useWorks } from '../hooks/useWork';
import { cdnImage, cdnSrcSet } from '../lib/img';

const PUBLICATION_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop';

export default function AuthorStudy() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scaleImage = useTransform(heroScroll, [0, 1], [1, 1.05]);
  const { works: publications } = useWorks(1, 4);

  return (
    <>
      <Seo
        title="مكتب المؤلف"
        path="/author"
        description="مكتب آدم داودي: مساحة فكرية تضم المقالات، المراسلات، والمشاريع الأدبية الجارية."
      />
      {/* Hero Section */}
      <section ref={heroRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-40 pt-12">
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
            <a
              href="mailto:adamdaoudi04@gmail.com"
              className="group relative overflow-hidden bg-primary text-surface px-8 py-4 rounded-full font-sans text-sm font-bold transition-all hover:shadow-xl hover:shadow-primary/20 flex items-center gap-3"
            >
              <span className="absolute inset-0 w-full h-full bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
              <span className="relative z-10 flex items-center gap-3">
                <Mail size={18} />
                تواصل معي
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Publications Section */}
      {publications.length > 0 && (
        <section className="space-y-16 mb-40">
          <SectionHeading title="أحدث الإصدارات" viewAllTo="/gallery" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {publications.slice(0, 4).map((pub, i) => (
              <Link to={`/reading/${pub.id}`} key={pub.id}>
                <motion.article
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                  className="flex flex-col sm:flex-row gap-8 group cursor-pointer"
                >
                  <div className="w-full sm:w-52 shrink-0 overflow-hidden rounded-[2rem] shadow-xl aspect-[2/3] bg-stone-100 relative">
                    <div className="absolute inset-0 bg-accent/20 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-multiply"></div>
                    <img
                      src={cdnImage(pub.image_url, 800) || PUBLICATION_FALLBACK_IMAGE}
                      srcSet={cdnSrcSet(pub.image_url, [400, 600, 800, 1200])}
                      sizes="(min-width: 640px) 208px, 100vw"
                      alt={pub.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[0.16,1,0.3,1]"
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-5">
                    <span className="font-sans text-[10px] font-bold text-accent tracking-[0.2em]">
                      {new Date(pub.created_at).toLocaleDateString('ar', { year: 'numeric', month: 'long' })}
                    </span>
                    <h4 className="font-serif text-3xl font-bold text-text-main group-hover:text-accent transition-colors duration-300">{pub.title}</h4>
                    {pub.excerpt && (
                      <p className="font-sans text-base text-text-muted leading-relaxed line-clamp-3">
                        {pub.excerpt}
                      </p>
                    )}
                    <div className="pt-4 flex items-center gap-6 text-sm font-sans font-medium text-stone-400">
                      <span className="flex items-center gap-2"><Eye size={16} className="text-accent/60" aria-hidden="true" /> {pub.comments_count ?? 0}</span>
                      <span className="flex items-center gap-2"><Heart size={16} className="text-accent/60" aria-hidden="true" /> {pub.likes_count}</span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quote Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 rounded-[3rem] overflow-hidden h-[600px] relative group shadow-2xl shadow-accent/10"
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
    </>
  );
}
