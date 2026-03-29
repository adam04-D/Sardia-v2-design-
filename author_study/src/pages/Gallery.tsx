/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { BookOpen, Bookmark, Headphones, ArrowUpLeft, ArrowLeft } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { RevealText } from '../components/RevealText';

export default function Gallery() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yImage = useTransform(heroScroll, [0, 1], ["0%", "15%"]);

  return (
    <>
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

      {/* Bento Gallery Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 md:grid-rows-2 mb-40">
        
        {/* Featured Card (Large) */}
        <Link to="/reading">
        <motion.div 
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-surface shadow-xl shadow-accent/5 min-h-[400px] md:min-h-[500px]"
        >
          <div className="absolute inset-0 z-0">
            <motion.img 
              style={{ y: yImage }}
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop" 
              alt="Library" 
              className="w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-105 opacity-30 grayscale group-hover:grayscale-0 relative -top-[10%]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 p-10 md:p-12 h-full flex flex-col justify-end">
            <div className="transition-all duration-700 group-hover:opacity-0 group-hover:-translate-y-4">
              <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-4 block">إصدار مميز</span>
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

      </section>

      {/* Secondary Feed Section */}
      <section className="mb-40">
        <div className="flex justify-between items-end border-b border-accent/10 pb-6 mb-12">
          <RevealText text="أحدث الإضافات" className="font-serif text-4xl font-bold text-text-main" />
          <a href="#" className="font-sans text-sm font-bold text-accent hover:text-primary transition-colors flex items-center gap-2 group">
            عرض كافة المجموعات
            <ArrowUpLeft size={16} className="group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform" />
          </a>
        </div>
        
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
      </section>
    </>
  );
}
