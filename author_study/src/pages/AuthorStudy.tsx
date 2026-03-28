/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Mail, FileText, Edit3, Users, BookOpen, Eye, Heart, ArrowUpLeft } from 'lucide-react';
import { useRef } from 'react';
import { RevealText } from '../components/RevealText';

export default function AuthorStudy() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yImage = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const scaleImage = useTransform(heroScroll, [0, 1], [1, 1.05]);

  return (
    <>
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
              style={{ y: yImage, scale: scaleImage }}
              src="https://images.unsplash.com/photo-1478147424044-4873a5856b3c?q=80&w=1000&auto=format&fit=crop" 
              alt="Author" 
              className="w-full h-[120%] object-cover grayscale hover:grayscale-0 transition-all duration-1000 -top-[10%] relative" 
            />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute -bottom-10 -left-10 glass-panel p-8 rounded-3xl max-w-[280px] z-20"
          >
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-3">الاسم الأدبي</p>
            <h1 className="font-serif text-4xl font-bold text-text-main">د. مالك الوراق</h1>
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
              text="الباحث في ثنايا الكلمة، والمنقب عن جواهر التراث العربي في زمن الحداثة." 
              className="font-serif text-4xl lg:text-5xl xl:text-6xl leading-[1.3] text-text-main"
              delay={0.4}
            />
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="font-sans text-lg text-text-muted leading-relaxed max-w-2xl"
            >
              أفنيتُ عقدين في دراسة المخطوطات القديمة، وأسعى عبر "سرديا" لترجمة هذا الشغف إلى نصوص معاصرة تربط القارئ بجذوره العميقة. أكتبُ لا لأوثق الحقيقة فحسب، بل لأخلق عالماً يسكنه الخيال والتدبر.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-wrap gap-4 pt-6"
          >
            <button className="group relative overflow-hidden bg-primary text-surface px-8 py-4 rounded-full font-sans text-sm font-bold transition-all hover:shadow-xl hover:shadow-primary/20 flex items-center gap-3">
              <span className="absolute inset-0 w-full h-full bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
              <span className="relative z-10 flex items-center gap-3">
                <Mail size={18} />
                تواصل مع المؤلف
              </span>
            </button>
            <button className="glass-panel text-text-main px-8 py-4 rounded-full font-sans text-sm font-bold hover:bg-white/80 transition-all duration-300 flex items-center gap-3">
              <FileText size={18} />
              تحميل السيرة الذاتية
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Edit3, value: "١٢٤,٠٠٠", label: "كلمة منشورة", delay: 0 },
            { icon: Users, value: "٤٥,٠٠٠", label: "قارئ مستنير", delay: 0.1, featured: true },
            { icon: BookOpen, value: "١٨", label: "مؤلفاً أدبياً", delay: 0.2 },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: stat.delay, ease: "easeOut" }}
              className={`p-10 rounded-[2.5rem] flex flex-col justify-between items-start text-right transition-all duration-500 hover:-translate-y-2 group ${
                stat.featured 
                  ? 'glass-panel shadow-2xl shadow-accent/5' 
                  : 'bg-white/40 border border-white/20 hover:bg-white/60'
              }`}
            >
              <div className={`p-4 rounded-2xl mb-12 transition-colors duration-500 ${stat.featured ? 'bg-accent/10' : 'bg-stone-200/50 group-hover:bg-accent/10'}`}>
                <stat.icon className={`w-8 h-8 ${stat.featured ? 'text-accent' : 'text-text-muted group-hover:text-accent transition-colors duration-500'}`} strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-serif text-5xl font-bold text-text-main mb-4">{stat.value}</div>
                <div className="font-sans text-xs font-bold text-text-muted uppercase tracking-[0.15em]">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Publications Section */}
      <section className="space-y-16 mb-40">
        <div className="flex justify-between items-end border-b border-accent/10 pb-6">
          <RevealText text="أحدث الإصدارات" className="font-serif text-4xl font-bold text-text-main" />
          <a href="#" className="font-sans text-sm font-bold text-accent hover:text-primary transition-colors flex items-center gap-2 group">
            مشاهدة الكل
            <ArrowUpLeft size={16} className="group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {[
            {
              title: "ظلال المخطوطة القديمة",
              category: "رواية • ٢٠٢٣",
              desc: "رحلة في أعماق التاريخ الأندلسي، حيث تتقاطع الأقدار مع الكلمات الضائعة في زوايا المكتبات المنسية.",
              views: "١٢ ألف",
              likes: "٨٠٠",
              img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"
            },
            {
              title: "فلسفة الحبر والورق",
              category: "دراسات • ٢٠٢٢",
              desc: "دراسة نقدية حول تأثير الكتابة الورقية في عصر الرقمنة، وكيف يتشكل وعينا من خلال ملمس الكتاب.",
              views: "٨ آلاف",
              likes: "٤٥٠",
              img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop"
            }
          ].map((pub, i) => (
            <motion.article 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-8 group cursor-pointer"
            >
              <div className="w-full sm:w-52 shrink-0 overflow-hidden rounded-[2rem] shadow-xl aspect-[2/3] bg-stone-100 relative">
                <div className="absolute inset-0 bg-accent/20 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-multiply"></div>
                <img src={pub.img} alt={pub.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[0.16,1,0.3,1]" />
              </div>
              <div className="flex flex-col justify-center space-y-5">
                <span className="font-sans text-[10px] font-bold text-accent tracking-[0.2em]">{pub.category}</span>
                <h4 className="font-serif text-3xl font-bold text-text-main group-hover:text-accent transition-colors duration-300">{pub.title}</h4>
                <p className="font-sans text-base text-text-muted leading-relaxed line-clamp-3">
                  {pub.desc}
                </p>
                <div className="pt-4 flex items-center gap-6 text-sm font-sans font-medium text-stone-400">
                  <span className="flex items-center gap-2"><Eye size={16} className="text-accent/60" /> {pub.views}</span>
                  <span className="flex items-center gap-2"><Heart size={16} className="text-accent/60" /> {pub.likes}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

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
            — من مذكرات د. مالك الوراق
          </motion.p>
        </div>
      </motion.section>
    </>
  );
}
