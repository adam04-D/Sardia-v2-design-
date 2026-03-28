/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { BookOpen, Bookmark, Maximize, Minimize, Type, Plus, Minus, Share2, List, X, Clock } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { RevealText } from '../components/RevealText';

// Ornamental Break for Novels/Essays
const OrnamentalBreak = () => (
  <div className="flex justify-center items-center gap-3 my-20 opacity-60">
    <span className="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
    <span className="w-2 h-2 rounded-full bg-accent/60"></span>
    <span className="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
  </div>
);

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
  const [isZenMode, setIsZenMode] = useState(false);
  const [fontSize, setFontSize] = useState(1); // multiplier: 1 = 100%, 1.2 = 120%, etc.
  const [isTocOpen, setIsTocOpen] = useState(false);
  
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yImage = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const opacityImage = useTransform(heroScroll, [0, 1], [1, 0.3]);

  const toggleZenMode = () => setIsZenMode(!isZenMode);
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 0.1, 1.5));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 0.1, 0.8));

  const chapters = [
    { id: "ch1", title: "الفصل الأول: النشأة والتكوين", time: "١٥ دقيقة" },
    { id: "ch2", title: "الفصل الثاني: رمزية الخمرة الروحية", time: "٢٢ دقيقة" },
    { id: "ch3", title: "الفصل الثالث: مقامات العشق", time: "١٨ دقيقة" },
    { id: "ch4", title: "الفصل الرابع: الفناء والبقاء", time: "٣٠ دقيقة" },
  ];

  // Effect to handle zen mode body classes
  useEffect(() => {
    if (isZenMode) {
      document.body.classList.add('zen-mode-active');
    } else {
      document.body.classList.remove('zen-mode-active');
    }
    return () => document.body.classList.remove('zen-mode-active');
  }, [isZenMode]);

  return (
    <div className={`transition-colors duration-1000 ${isZenMode ? 'bg-[#FDFBF7]' : ''}`}>
      <TopProgressBar />

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
                <button onClick={() => setIsTocOpen(false)} className="p-2 text-stone-400 hover:text-accent transition-colors rounded-full hover:bg-accent/5">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1">
                <div className="mb-8">
                  <p className="font-sans text-xs font-bold text-stone-400 tracking-wider uppercase mb-2">الكتاب</p>
                  <h3 className="font-serif text-xl text-primary">تجليات الصوفية في الشعر الأندلسي</h3>
                  <p className="font-sans text-sm text-accent mt-2 flex items-center gap-2">
                    <Clock size={14} />
                    إجمالي القراءة: ٣ ساعات و ٢٠ دقيقة
                  </p>
                </div>
                <ul className="space-y-1">
                  {chapters.map((chapter, idx) => (
                    <li key={chapter.id}>
                      <a 
                        href={`#${chapter.id}`}
                        onClick={() => setIsTocOpen(false)}
                        className={`block p-4 rounded-2xl transition-all duration-300 group ${idx === 1 ? 'bg-accent/5 border border-accent/10' : 'hover:bg-stone-50'}`}
                      >
                        <h4 className={`font-serif text-lg mb-1 transition-colors ${idx === 1 ? 'text-accent font-bold' : 'text-text-main group-hover:text-primary'}`}>
                          {chapter.title}
                        </h4>
                        <p className="font-sans text-xs text-stone-400">{chapter.time}</p>
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
        <header ref={heroRef} className={`relative h-[60vh] min-h-[500px] flex items-center justify-center mb-24 overflow-hidden rounded-[3rem] ${isZenMode ? 'mt-8' : ''}`}>
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: yImage, opacity: opacityImage }}
          >
            <img 
              src="https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=2000&auto=format&fit=crop" 
              alt="Hero" 
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
              text="تجليات الصوفية في الشعر الأندلسي" 
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-primary mb-8 leading-[1.2] justify-center"
            />
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl md:text-2xl text-text-muted leading-[2.0] font-sans max-w-2xl mx-auto"
            >
              دراسة معمقة في الرموز والإشارات التي شكلت الهوية الشعرية لمتصوفة الأندلس وعلاقتهم بالطبيعة والجمال.
            </motion.p>
          </div>
        </header>

        {/* Reading Content */}
        <article 
          className="max-w-3xl mx-auto font-serif text-text-main leading-[2.2] transition-all duration-500"
          style={{ fontSize: `${1.125 * fontSize}rem` }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-6 mb-16 pb-8 border-b border-accent/10"
          >
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" alt="Author" className="w-16 h-16 rounded-full object-cover grayscale" />
            <div>
              <h3 className="font-serif text-xl text-primary font-bold">د. أحمد الهاشمي</h3>
              <p className="font-sans text-sm text-text-muted">أستاذ الأدب الأندلسي</p>
            </div>
            <div className="mr-auto flex gap-3">
              <button className="p-2 rounded-full border border-stone-200 text-stone-400 hover:text-accent hover:border-accent transition-colors">
                <Share2 size={18} />
              </button>
              <button className="p-2 rounded-full border border-stone-200 text-stone-400 hover:text-accent hover:border-accent transition-colors">
                <Bookmark size={18} />
              </button>
            </div>
          </motion.div>

          <div className="space-y-12">
            {/* Chapter 1 */}
            <div id="ch1" className="scroll-mt-32">
              <h2 className="text-3xl md:text-4xl text-primary font-bold mb-12 text-center">الفصل الأول: النشأة والتكوين</h2>
              
              <p>
                لم يكن التصوف في الأندلس مجرد نزعة زهدية انعزالية، بل كان تفاعلاً حياً مع معطيات البيئة الأندلسية الخلابة. لقد وجد المتصوفة في طبيعة الأندلس مرآة تعكس الجمال الإلهي، فصاغوا أشعارهم بلغة رمزية مكثفة تمزج بين الوجد الروحي والوصف الحسي الدقيق.
              </p>

              <p>
                يبرز ابن عربي كأحد أهم أقطاب هذا التوجه، حيث تتجلى في نصوصه وحدة الوجود من خلال استنطاق عناصر الطبيعة. فالوردة ليست مجرد زهرة، بل هي تجلٍ للجمال المطلق، والنسيم ليس سوى نفحة من نفحات العناية الإلهية.
              </p>

              <p>
                وقد ساهم التنوع الثقافي في الأندلس، من تمازج بين الحضارات والأديان، في إثراء التجربة الصوفية وجعلها أكثر انفتاحاً وشمولية. لم يكن المتصوف الأندلسي منغلقاً في صومعته، بل كان مشاركاً في الحياة العامة، يعبر عن رؤاه الفلسفية والروحية من خلال الشعر والنثر، مما جعل الأدب الصوفي الأندلسي يتميز بنكهة خاصة تجمع بين عمق الفكرة وجمال العبارة.
              </p>
            </div>

            <OrnamentalBreak />

            {/* Chapter 2 */}
            <div id="ch2" className="scroll-mt-32">
              <h2 className="text-3xl md:text-4xl text-primary font-bold mb-12 text-center">الفصل الثاني: رمزية الخمرة الروحية</h2>
              
              <p>
                استعار الشعراء المتصوفة مصطلحات الغزل والخمر للتعبير عن حالات الوجد والسكر الروحي. هذا الاستخدام الرمزي أثار جدلاً واسعاً بين الفقهاء، لكنه أثرى المعجم الشعري العربي بدلالات جديدة تجاوزت المعنى الحرفي إلى آفاق أرحب من التأويل.
              </p>

              <motion.blockquote 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative p-10 my-16 bg-stone-50 rounded-3xl border-r-4 border-accent"
              >
                <span className="absolute top-4 right-6 text-6xl text-accent/20 font-serif leading-none">"</span>
                <p className="relative z-10 text-2xl md:text-3xl text-primary italic leading-[1.8] text-center">
                  كل جمال في الكون ما هو إلا قطرة من بحر الجمال الإلهي، ومن لم يرَ الله في خلقه، لم يعرفه حق المعرفة.
                </p>
                <footer className="mt-6 text-center font-sans text-sm text-text-muted font-bold">— محيي الدين ابن عربي</footer>
              </motion.blockquote>

              <p>
                فالخمرة في القاموس الصوفي ليست تلك التي تُذهب العقل، بل هي "خمرة المعرفة" التي تملأ القلب بنور اليقين وتُسكر الروح بحب الخالق. والكأس هي القلب المتهيئ لتلقي التجليات، والساقي هو المرشد أو الفيض الإلهي نفسه.
              </p>

              <motion.figure 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="my-16"
              >
                <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-4">
                  <img src="https://images.unsplash.com/photo-1584285418504-03f615822d56?q=80&w=1600&auto=format&fit=crop" alt="Andalusian Architecture" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                </div>
                <figcaption className="text-center font-sans text-sm text-text-muted">نقوش أندلسية تعكس التداخل بين الفن والروحانية</figcaption>
              </motion.figure>

              <p>
                إن دراسة الشعر الصوفي الأندلسي تتطلب قراءة مزدوجة: قراءة جمالية تستمتع بالصورة الفنية، وقراءة تأويلية تغوص في أعماق الرمز لاستخراج المعنى الباطن. إنها رحلة مستمرة لاكتشاف الذات والكون من خلال الكلمة.
              </p>
            </div>
            
            <OrnamentalBreak />
            
            <p className="text-center text-text-muted italic mb-24">نهاية الجزء المتاح للقراءة المجانية.</p>
          </div>
        </article>
      </div>

      {/* Floating Control Menu */}
      <motion.div 
        initial={{ y: 100, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-8 left-1/2 z-50 glass-panel rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl shadow-accent/10"
      >
        <button 
          onClick={() => setIsTocOpen(true)}
          className="p-2 text-text-muted hover:text-accent transition-colors rounded-full hover:bg-accent/5"
          title="الفهرس (Table of Contents)"
        >
          <List size={20} />
        </button>

        <div className="w-[1px] h-6 bg-stone-300"></div>

        <button 
          onClick={toggleZenMode}
          className={`p-2 rounded-full transition-colors ${isZenMode ? 'text-accent bg-accent/10' : 'text-text-muted hover:text-accent hover:bg-accent/5'}`}
          title="وضع القراءة (Zen Mode)"
        >
          {isZenMode ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        
        <div className="w-[1px] h-6 bg-stone-300"></div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={decreaseFontSize}
            className="p-1.5 text-text-muted hover:text-accent transition-colors"
            disabled={fontSize <= 0.8}
          >
            <Minus size={16} />
          </button>
          <Type size={18} className="text-primary" />
          <button 
            onClick={increaseFontSize}
            className="p-1.5 text-text-muted hover:text-accent transition-colors"
            disabled={fontSize >= 1.5}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="w-[1px] h-6 bg-stone-300"></div>

        <button className="p-2 text-text-muted hover:text-accent transition-colors">
          <Bookmark size={20} />
        </button>
      </motion.div>
    </div>
  );
}

