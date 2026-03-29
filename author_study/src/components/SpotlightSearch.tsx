/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, CornerDownLeft, ArrowUp, ArrowDown, BookOpen, ScrollText, FileText, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// These are the actual works that exist on the site
const allWorks = [
  {
    title: "فلسفة التراث",
    category: "إصدار مميز",
    author: "د. أحمد الهاشمي",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=200&auto=format&fit=crop"
  },
  {
    title: "أصداء المتنبي",
    category: "مختارات شعرية",
    author: "آدم داودي",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=200&auto=format&fit=crop"
  },
  {
    title: "أدب المهجر",
    category: "مقالات تحليلية",
    author: "آدم داودي",
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=200&auto=format&fit=crop"
  },
  {
    title: "عطر المدن",
    category: "قصة قصيرة",
    author: "آدم داودي",
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=200&auto=format&fit=crop"
  },
  {
    title: "تجليات الصوفية في الشعر الأندلسي",
    category: "دراسات نقدية",
    author: "د. أحمد الهاشمي",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=200&auto=format&fit=crop"
  },
  {
    title: "جماليات الخط الكوفي في المصاحف الأثرية",
    category: "مخطوطات",
    author: "آدم داودي",
    img: "https://images.unsplash.com/photo-1584285418504-03f615822d56?q=80&w=200&auto=format&fit=crop"
  },
  {
    title: "طه حسين: معارك التنوير والذاكرة",
    category: "سير أدبية",
    author: "آدم داودي",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop"
  },
];

// Extract unique categories from the works
const categories = [...new Set(allWorks.map(w => w.category))].slice(0, 4);

const categoryIcons: Record<string, typeof BookOpen> = {
  "إصدار مميز": BookOpen,
  "مختارات شعرية": ScrollText,
  "مقالات تحليلية": FileText,
  "قصة قصيرة": BookOpen,
  "دراسات نقدية": ScrollText,
  "مخطوطات": ScrollText,
  "سير أدبية": FileText,
};

export default function SpotlightSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showQuickLook, setShowQuickLook] = useState(false);
  const navigate = useNavigate();

  const filteredWorks = query.trim()
    ? allWorks.filter(w =>
        w.title.includes(query) ||
        w.author.includes(query) ||
        w.category.includes(query)
      )
    : allWorks;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = () => {
    if (filteredWorks[selectedIndex]) {
      navigate('/reading');
      onClose();
      setQuery('');
      setShowQuickLook(false);
    }
  };

  const handleClose = () => {
    onClose();
    setQuery('');
    setShowQuickLook(false);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredWorks.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredWorks.length) % filteredWorks.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect();
      } else if (e.key === ' ') {
        if (filteredWorks.length > 0 && !showQuickLook) {
          e.preventDefault();
          setShowQuickLook(true);
        } else if (showQuickLook) {
          e.preventDefault();
          setShowQuickLook(false);
        }
      } else if (e.key === 'Escape') {
        if (showQuickLook) {
          e.preventDefault();
          setShowQuickLook(false);
        } else {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredWorks, selectedIndex, showQuickLook]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 md:px-0" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-stone-900/20 backdrop-blur-md"
          />

          {/* Quick Look Modal (macOS style) */}
          <AnimatePresence>
            {showQuickLook && filteredWorks[selectedIndex] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute inset-0 z-[110] flex items-center justify-center p-6 pointer-events-none"
              >
                <div className="bg-white/90 backdrop-blur-2xl p-12 rounded-[3rem] shadow-2xl border border-white/50 max-w-lg w-full pointer-events-auto relative">
                  <button 
                    onClick={() => setShowQuickLook(false)}
                    className="absolute top-8 left-8 p-2 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <div className="aspect-[2/3] w-48 mx-auto mb-8 rounded-2xl overflow-hidden shadow-xl">
                    <img src={filteredWorks[selectedIndex].img} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="font-serif text-4xl text-primary text-center mb-4">{filteredWorks[selectedIndex].title}</h2>
                  <p className="font-sans text-accent text-center font-bold mb-6 uppercase tracking-widest text-xs">{filteredWorks[selectedIndex].category}</p>
                  <p className="font-sans text-text-muted text-center leading-relaxed">
                    نظرة سريعة على هذا العمل الأدبي المتميز من أرشيف آدم داودي. اضغط Enter للبدء في القراءة.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-2xl shadow-2xl overflow-hidden border border-accent/10 flex flex-col max-h-[80vh]"
          >
            {/* Traffic Lights (macOS Control) */}
            <div className="flex gap-2.5 px-6 pt-5 pb-2 bg-stone-50/50">
              <button 
                onClick={handleClose}
                className="w-3 h-3 rounded-full bg-[#FF5F56] border border-stone-900/10 hover:shadow-inner transition-all flex items-center justify-center group"
              >
                <X size={8} className="text-[#4c0000] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-stone-900/10 shadow-sm opacity-60"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-stone-900/10 shadow-sm opacity-60"></div>
            </div>

            {/* Input Area */}
            <div className="flex items-center px-6 py-5 bg-stone-50/50 border-b border-accent/10 pt-2">
              <Search className="text-accent ml-4" size={24} />
              <input 
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-sans text-text-main placeholder:text-stone-400 outline-none"
                placeholder="ابحث عن عمل أدبي..."
                type="text"
              />
              <div className="flex items-center gap-3">
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="p-1.5 hover:bg-stone-200 rounded-full transition-colors text-stone-400"
                  >
                    <X size={16} />
                  </button>
                )}
                <div className="flex items-center gap-2 px-2 py-1 bg-white rounded-md border border-stone-200 shadow-sm cursor-pointer" onClick={handleClose}>
                  <span className="text-[10px] font-sans font-bold text-stone-500 uppercase tracking-tighter">ESC</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Works Results */}
              <div className="px-6 py-6">
                <h3 className="text-xs font-sans font-bold text-accent tracking-widest uppercase mb-4">
                  {query.trim() ? `نتائج البحث (${filteredWorks.length})` : 'جميع الأعمال'}
                </h3>

                {filteredWorks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-serif text-2xl text-stone-300 mb-3">لا توجد نتائج</p>
                    <p className="font-sans text-sm text-stone-400">جرّب البحث بكلمات أخرى</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {filteredWorks.map((item, i) => (
                      <motion.div
                        key={i}
                        onClick={handleSelect}
                        onMouseEnter={() => setSelectedIndex(i)}
                        whileTap={{ scale: 0.98 }}
                        className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer border ${selectedIndex === i ? 'bg-accent/5 border-accent/20 shadow-sm' : 'border-transparent hover:bg-stone-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 rounded-lg bg-stone-200 overflow-hidden shadow-sm">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-base font-serif font-bold text-primary leading-tight mb-1">{item.title}</h4>
                            <p className="text-xs font-sans text-text-muted">{item.author}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-sans text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            إدخال <CornerDownLeft size={12} />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="px-6 py-6 bg-stone-50/50 border-t border-accent/5">
                <h3 className="text-xs font-sans font-bold text-accent tracking-widest uppercase mb-4">تصنيفات أدبية</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((cat, i) => {
                    const Icon = categoryIcons[cat] || BookOpen;
                    return (
                      <motion.button 
                        key={i} 
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 hover:border-accent/30 hover:shadow-sm transition-all group"
                      >
                        <Icon className="text-accent group-hover:scale-110 transition-transform" size={18} />
                        <span className="text-[10px] font-sans font-bold text-text-main truncate uppercase tracking-tighter">{cat}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Hints */}
            <div className="flex items-center justify-between px-6 py-3 bg-stone-100/50 text-[10px] font-sans text-stone-500 border-t border-accent/10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="bg-white px-1.5 py-0.5 rounded shadow-sm border border-stone-200 flex items-center gap-0.5"><ArrowUp size={10}/><ArrowDown size={10}/></span> 
                  للتنقل
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-white px-1.5 py-0.5 rounded shadow-sm border border-stone-200 flex items-center gap-1">
                    Space
                  </span> 
                  للمعاينة السريعة
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-white px-1.5 py-0.5 rounded shadow-sm border border-stone-200 flex items-center gap-1 font-mono">
                    <Command size={10} /> K
                  </span> 
                  لإغلاق البحث
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
