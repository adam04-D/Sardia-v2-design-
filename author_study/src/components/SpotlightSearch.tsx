/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, CornerDownLeft, ArrowUp, ArrowDown, BookOpen, ScrollText, FileText, X } from 'lucide-react';
import { useState } from 'react';
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
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=200&auto=format&fit=crop"
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
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop"
  },
  {
    title: "تجليات الصوفية في الشعر الأندلسي",
    category: "دراسات نقدية",
    author: "آدم داودي",
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
  const navigate = useNavigate();

  const filteredWorks = query.trim()
    ? allWorks.filter(w =>
        w.title.includes(query) ||
        w.author.includes(query) ||
        w.category.includes(query)
      )
    : allWorks;

  const handleSelect = () => {
    onClose();
    setQuery('');
    navigate('/reading');
  };

  const handleClose = () => {
    onClose();
    setQuery('');
  };

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
                      <div
                        key={i}
                        onClick={handleSelect}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-accent/5 transition-all cursor-pointer border border-transparent hover:border-accent/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 rounded-lg bg-stone-200 overflow-hidden shadow-sm">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-base font-serif font-bold text-primary leading-tight mb-1">{item.title}</h4>
                            <p className="text-xs font-sans text-text-muted">{item.author} • {item.category}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-sans text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          اقرأ <CornerDownLeft size={12} />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories - only show when not searching */}
              {!query.trim() && (
                <div className="px-6 py-6 bg-stone-50/50 border-t border-accent/5">
                  <h3 className="text-xs font-sans font-bold text-accent tracking-widest uppercase mb-4">تصنيفات أدبية</h3>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((cat, i) => {
                      const Icon = categoryIcons[cat] || BookOpen;
                      return (
                        <button
                          key={i}
                          onClick={() => setQuery(cat)}
                          className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-stone-200 hover:border-accent/30 hover:shadow-sm transition-all group"
                        >
                          <Icon className="text-accent group-hover:scale-110 transition-transform" size={18} />
                          <span className="text-sm font-sans font-medium text-text-main">{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
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
