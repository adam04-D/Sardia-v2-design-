/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Mail, BookOpen, Bookmark, Headphones, ArrowLeft } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { RevealText } from '../components/RevealText';
import Seo from '../components/Seo';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scaleImage = useTransform(heroScroll, [0, 1], [1, 1.05]);

  const libraryRef = useRef(null);
  const { scrollYProgress: libScroll } = useScroll({ target: libraryRef, offset: ["start start", "end start"] });
  const yLibImage = useTransform(libScroll, [0, 1], ["0%", "15%"]);

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
                alt="Author"
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
            <Link to="/reading">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              whileHover={{ y: -12, scale: 1.01, boxShadow: "0 25px 50px -12px rgba(139, 94, 52, 0.25)" }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-surface shadow-xl shadow-accent/5 min-h-[400px] md:min-h-[500px] border border-accent/5"
            >
              <div className="absolute inset-0 z-0">
                <motion.img
                  style={{ y: yLibImage }}
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop"
                  alt="Library"
                  className="w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-105 opacity-30 grayscale group-hover:grayscale-0 relative -top-[10%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
              </div>

              <div className="relative z-10 p-10 md:p-12 h-full flex flex-col justify-end">
                <div className="transition-all duration-700 group-hover:opacity-0 group-hover:-translate-y-4">
                  <Eyebrow className="mb-4">إصدار مميز</Eyebrow>
                  <h2 className="font-serif text-5xl md:text-6xl text-primary mb-4">فلسفة التراث</h2>
                  <p className="font-sans text-lg text-text-muted">للمؤلف د. أحمد الهاشمي</p>
                </div>

                <div className="absolute inset-0 bg-white/95 p-10 md:p-12 flex flex-col justify-center items-start opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
                  <p className="font-serif text-2xl md:text-3xl leading-[1.8] text-primary mb-10 italic">
                    "إن الحداثة لا تعني القطيعة مع الماضي، بل هي القدرة على استنطاق التراث بأدوات العصر..."
                  </p>
                  <span className="bg-primary text-surface px-8 py-4 rounded-full font-sans text-sm font-bold flex items-center gap-4 hover:bg-accent transition-colors shadow-lg shadow-primary/20">
                    اقرأ العمل كاملاً
                    <ArrowLeft size={18} />
                  </span>
                </div>
              </div>
            </motion.div>
            </Link>

            {/* Medium Card: Poetry */}
            <Link to="/reading">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              whileHover={{ y: -12, scale: 1.01, boxShadow: "0 25px 50px -12px rgba(139, 94, 52, 0.25)" }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="md:col-span-2 relative group overflow-hidden rounded-[2.5rem] bg-stone-100/80 border border-stone-200/50 min-h-[240px]"
            >
              <div className="p-10 h-full flex flex-col justify-between border-r-4 border-accent">
                <div className="transition-all duration-700 group-hover:opacity-0 group-hover:-translate-y-4">
                  <BookOpen className="text-accent mb-6" size={28} strokeWidth={1.5} />
                  <h3 className="font-serif text-3xl md:text-4xl text-primary mb-3">أصداء المتنبي</h3>
                  <p className="font-sans text-text-muted">مختارات شعرية مفسرة</p>
                </div>

                <div className="absolute inset-0 bg-accent p-10 flex flex-col justify-center text-white opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
                  <p className="font-serif text-2xl leading-[1.8] mb-8 italic">
                    "أنا الذي نظر الأعمى إلى أدبي.. وأسمعت كلماتي من به صممُ"
                  </p>
                  <span className="font-sans text-sm font-bold tracking-wider flex items-center gap-2 hover:text-stone-200 transition-colors">
                    استكشف المجموعة
                    <ArrowLeft size={16} />
                  </span>
                </div>
              </div>
            </motion.div>
            </Link>

            {/* Small Card: Essay */}
            <Link to="/reading">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              whileHover={{ y: -12, scale: 1.01, boxShadow: "0 25px 50px -12px rgba(139, 94, 52, 0.25)" }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="md:col-span-1 relative group overflow-hidden rounded-[2.5rem] bg-white border border-stone-200/50 shadow-sm min-h-[240px]"
            >
              <div className="p-8 h-full flex flex-col items-center text-center justify-center">
                <div className="transition-all duration-700 group-hover:opacity-0 group-hover:scale-95">
                  <h4 className="font-serif text-3xl text-primary mb-3">أدب المهجر</h4>
                  <p className="font-sans text-xs font-bold text-stone-400 tracking-wider">مقالات تحليلية</p>
                </div>

                <div className="absolute inset-0 bg-surface p-8 flex flex-col justify-center items-center opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-[0.16,1,0.3,1]">
                  <Bookmark className="text-accent mb-4" size={24} strokeWidth={1.5} />
                  <p className="font-sans text-sm font-bold text-text-muted mb-6">12 دقيقة للقراءة</p>
                  <span className="text-primary font-sans font-bold hover:text-accent transition-colors border-b border-primary hover:border-accent pb-1">ابدأ القراءة</span>
                </div>
              </div>
            </motion.div>
            </Link>

            {/* Small Card: Short Story */}
            <Link to="/reading">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              whileHover={{ y: -12, scale: 1.01, boxShadow: "0 25px 50px -12px rgba(139, 94, 52, 0.25)" }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="md:col-span-1 relative group overflow-hidden rounded-[2.5rem] bg-stone-100/50 min-h-[240px]"
            >
              <div className="p-8 h-full flex flex-col justify-between">
                <div className="transition-all duration-700 group-hover:opacity-0 group-hover:-translate-x-4">
                  <span className="font-serif text-5xl text-accent/20 block mb-2">«</span>
                  <h4 className="font-serif text-3xl text-primary mb-2">عطر المدن</h4>
                  <p className="font-sans text-xs font-bold text-stone-400 tracking-wider">قصة قصيرة</p>
                </div>

                <div className="absolute inset-0 bg-primary p-8 flex flex-col justify-center items-center text-white opacity-0 translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
                  <p className="font-sans text-center text-sm leading-relaxed mb-6">رحلة في أزقة قرطبة القديمة وتاريخها المنسي</p>
                  <Headphones size={24} strokeWidth={1.5} className="text-stone-300" />
                </div>
              </div>
            </motion.div>
            </Link>
          </div>

          {/* Secondary Feed */}
          <div className="mb-20">
            <SectionHeading title="أحدث الإضافات" className="mb-12" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  date: "14 مارس 2024",
                  category: "دراسات نقدية",
                  title: "تجليات الصوفية في الشعر الأندلسي",
                  desc: "دراسة معمقة في الرموز والإشارات التي شكلت الهوية الشعرية لمتصوفة الأندلس وعلاقتهم بالطبيعة والجمال.",
                  img: "https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=800&auto=format&fit=crop"
                },
                {
                  date: "10 مارس 2024",
                  category: "مخطوطات",
                  title: "جماليات الخط الكوفي في المصاحف الأثرية",
                  desc: "تتبع تطور الخط الكوفي من البساطة إلى التعقيد الهندسي والزخرفي عبر العصور الإسلامية المختلفة.",
                  img: "https://images.unsplash.com/photo-1584285418504-03f615822d56?q=80&w=800&auto=format&fit=crop"
                },
                {
                  date: "05 مارس 2024",
                  category: "سير أدبية",
                  title: "طه حسين: معارك التنوير والذاكرة",
                  desc: "وقوف على أهم المحطات الفكرية في حياة عميد الأدب العربي وأثر معاركه الأدبية في تشكيل العقل العربي الحديث.",
                  img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop"
                }
              ].map((article, i) => (
                <Link to="/reading" key={i}>
                <motion.article
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] mb-8 bg-stone-100 relative">
                    <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-multiply"></div>
                    <img
                      src={article.img}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-4 px-2">
                    <div className="flex gap-4 font-sans text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                      <span>{article.date}</span>
                      <span className="text-accent">•</span>
                      <span>{article.category}</span>
                    </div>
                    <h4 className="font-serif text-3xl text-primary group-hover:text-accent transition-colors duration-300 leading-snug">
                      {article.title}
                    </h4>
                    <p className="font-sans text-text-muted text-sm leading-relaxed line-clamp-2">
                      {article.desc}
                    </p>
                  </div>
                </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
