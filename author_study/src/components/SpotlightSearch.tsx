/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Search, Clock, Command, CornerDownLeft, ArrowUp, ArrowDown, History, BookOpen, ScrollText } from 'lucide-react';

export default function SpotlightSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
