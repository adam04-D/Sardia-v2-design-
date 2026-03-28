/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Search, Menu, BookOpen, Bookmark, Headphones, ArrowUpLeft, ArrowLeft, Maximize, Minimize, Type, Plus, Minus, Share2, List, X, Clock, Command, CornerDownLeft, ArrowUp, ArrowDown, History, ScrollText } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// Premium Text Reveal Component
const RevealText = ({ text, className = "", delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const words = text.split(" ");
  return (
    <div className={`flex flex-wrap gap-x-3 gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden pb-2">
          <motion.div
            initial={{ y: "120%", opacity: 0, rotate: 2 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: delay + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block origin-bottom-left"
          >
            {word}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

function ProgressRail({ isZenMode }: { isZenMode: boolean }) {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <AnimatePresence>
      {!isZenMode && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6 z-40"
        >
          <div className="h-64 w-[1px] bg-accent/20 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-accent"
              style={{ height }}
            />
          </div>
          <span className="text-[10px] font-sans font-bold text-accent tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            مستوى التقدم
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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

// Ornamental Break for Novels/Essays
const OrnamentalBreak = () => (
  <div className="flex justify-center items-center gap-3 my-20 opacity-60">
    <span className="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
    <span className="w-2 h-2 rounded-full bg-accent/60"></span>
    <span className="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
  </div>
);

function SpotlightSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 md:px-0" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/20 backdrop-blur-md"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-2xl shadow-2xl overflow-hidden border border-accent/10 flex flex-col max-h-[80vh]"
          >
            {/* Input Area */}
            <div className="flex items-center px-6 py-5 bg-stone-50/50 border-b border-accent/10">
              <Search className="text-accent ml-4" size={24} />
              <input 
                autoFocus
                className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-sans text-text-main placeholder:text-stone-400 outline-none"
                placeholder="ابحث عن أثر أدبي، كاتب، أو فكرة..."
                type="text"
              />
              <div className="flex items-center gap-2 px-2 py-1 bg-white rounded-md border border-stone-200 shadow-sm">
                <span className="text-[10px] font-sans font-bold text-stone-500 uppercase tracking-tighter">ESC</span>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Recent Works */}
              <div className="px-6 py-6">
                <h3 className="text-xs font-sans font-bold text-accent tracking-widest uppercase mb-4">آخر الأعمال المُطلع عليها</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { title: "طوق الحمامة", author: "ابن حزم الأندلسي", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=200&auto=format&fit=crop" },
                    { title: "مقدمة ابن خلدون", author: "عبد الرحمن بن خلدون", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=200&auto=format&fit=crop" }
                  ].map((item, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 rounded-xl hover:bg-accent/5 transition-all cursor-pointer border border-transparent hover:border-accent/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded-lg bg-stone-200 overflow-hidden shadow-sm">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-base font-serif font-bold text-primary leading-tight mb-1">{item.title}</h4>
                          <p className="text-xs font-sans text-text-muted">{item.author}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-sans text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        إدخال <CornerDownLeft size={12} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="px-6 py-6 bg-stone-50/50 border-t border-accent/5">
                <h3 className="text-xs font-sans font-bold text-accent tracking-widest uppercase mb-4">تصنيفات أدبية</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { icon: History, label: "الشعر الجاهلي" },
                    { icon: BookOpen, label: "النقد الأدبي" },
                    { icon: ScrollText, label: "المخطوطات" }
                  ].map((cat, i) => (
                    <button key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 hover:border-accent/30 hover:shadow-sm transition-all group">
                      <cat.icon className="text-accent group-hover:scale-110 transition-transform" size={18} />
                      <span className="text-sm font-sans font-medium text-text-main">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="px-6 py-6 border-t border-accent/10">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-sans font-bold text-accent tracking-widest uppercase mb-2">إحصائيات القراءة</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif font-bold text-primary">٢٤</span>
                      <span className="text-sm font-sans text-text-muted">عمل تم إنجازه هذا الشهر</span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center md:border-r border-accent/10 md:pr-6">
                    <div className="text-right">
                      <p className="text-xs font-sans text-stone-400 mb-1">الوقت المستغرق</p>
                      <p className="text-lg font-serif font-bold text-primary">١٨ ساعة</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent flex items-center justify-center">
                       <Clock size={16} className="text-accent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Hints */}
            <div className="flex items-center justify-between px-6 py-3 bg-stone-100/50 text-[10px] font-sans text-stone-500 border-t border-accent/10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="bg-white px-1.5 py-0.5 rounded shadow-sm border border-stone-200 flex items-center"><CornerDownLeft size={10} /></span> 
                  للاختيار
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-white px-1.5 py-0.5 rounded shadow-sm border border-stone-200 flex items-center gap-0.5"><ArrowUp size={10}/><ArrowDown size={10}/></span> 
                  للتنقل
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-white px-1.5 py-0.5 rounded shadow-sm border border-stone-200 flex items-center gap-1 font-mono">
                  <Command size={10} /> K
                </span> 
                لإغلاق البحث
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [isZenMode, setIsZenMode] = useState(false);
  const [fontSize, setFontSize] = useState(1); // multiplier: 1 = 100%, 1.2 = 120%, etc.
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yImage = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const opacityImage = useTransform(heroScroll, [0, 1], [1, 0.3]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const toggleZenMode = () => setIsZenMode(!isZenMode);
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 0.1, 1.5));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 0.1, 0.8));

  const chapters = [
    { id: "ch1", title: "الفصل الأول: النشأة والتكوين", time: "١٥ دقيقة" },
    { id: "ch2", title: "الفصل الثاني: رمزية الخمرة الروحية", time: "٢٢ دقيقة" },
    { id: "ch3", title: "الفصل الثالث: مقامات العشق", time: "١٨ دقيقة" },
    { id: "ch4", title: "الفصل الرابع: الفناء والبقاء", time: "٣٠ دقيقة" },
  ];

  return (
    <div className={`min-h-screen selection:bg-accent/20 selection:text-accent bg-noise transition-colors duration-1000 ${isZenMode ? 'bg-[#FDFBF7]' : 'bg-transparent'}`} dir="rtl">
      <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <TopProgressBar />
      <ProgressRail isZenMode={isZenMode} />

      {/* Table of Contents Drawer */}
      <AnimatePresence>
        {isTocOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTocOpen(false)}
              className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[90%] max-w-sm bg-surface/95 backdrop-blur-xl border-l border-accent/10 z-[70] shadow-2xl flex flex-col"
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

      {/* Premium Glass Header */}
      <AnimatePresence>
        {!isZenMode && (
          <motion.header 
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto">
              <div className="text-3xl font-bold text-accent font-serif tracking-tight">سرديا</div>
              <nav className="hidden md:flex gap-12 items-center">
                <a href="#" className="text-text-muted hover:text-accent transition-colors duration-300 font-serif text-xl relative group">
                  المكتبة
                  <span className="absolute -bottom-1 right-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full"></span>
                </a>
                <a href="#" className="text-text-muted hover:text-accent transition-colors duration-300 font-serif text-xl relative group">
                  المؤلف
                  <span className="absolute -bottom-1 right-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full"></span>
                </a>
                <a href="#" className="text-accent font-bold font-serif text-xl relative">
                  القراءة
                  <span className="absolute -bottom-1 right-0 w-full h-[1px] bg-accent"></span>
                </a>
              </nav>
              <div className="flex gap-4 items-center">
                <button onClick={() => setIsSearchOpen(true)} className="p-2.5 hover:bg-accent/5 rounded-full transition-all duration-300 text-accent">
                  <Search size={20} strokeWidth={1.5} />
                </button>
                <button className="p-2.5 hover:bg-accent/5 rounded-full transition-all duration-300 text-accent md:hidden">
                  <Menu size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <main className={`pt-0 pb-32 transition-all duration-1000 ${isZenMode ? 'max-w-3xl mx-auto px-6 md:px-0' : 'max-w-7xl mx-auto px-6 md:px-12'}`}>
        
        {/* Immersive Hero Section */}
        <header ref={heroRef} className={`relative h-[80vh] min-h-[600px] flex items-center justify-center mb-24 overflow-hidden rounded-b-[3rem] ${isZenMode ? 'mx-[-1.5rem] md:mx-0 rounded-[3rem] mt-8' : 'mx-[-1.5rem] md:mx-[-3rem]'}`}>
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
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary mb-8 leading-[1.2] justify-center"
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
              
              <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-accent first-letter:mr-3 first-letter:float-right first-letter:leading-[0.8]">
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
            
            <p className="text-center text-text-muted italic">نهاية الجزء المتاح للقراءة المجانية.</p>
          </div>
        </article>
      </main>

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

      {/* Footer */}
      <AnimatePresence>
        {!isZenMode && (
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full py-12 border-t border-accent/10 glass-panel relative z-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 max-w-7xl mx-auto gap-6">
              <div className="text-2xl font-serif font-bold text-text-main">سرديا</div>
              <div className="flex gap-8">
                <a href="#" className="text-text-muted text-sm font-sans font-medium hover:text-accent transition-colors">الخصوصية</a>
                <a href="#" className="text-text-muted text-sm font-sans font-medium hover:text-accent transition-colors">تواصل معنا</a>
                <a href="#" className="text-text-muted text-sm font-sans font-medium hover:text-accent transition-colors">الأرشيف</a>
              </div>
              <p className="text-text-muted text-sm font-sans">© ٢٠٢٤ سرديا. جميع الحقوق محفوظة للمؤلف.</p>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}
