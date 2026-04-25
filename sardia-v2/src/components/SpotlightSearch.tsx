/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, CornerDownLeft, ArrowUp, ArrowDown, BookOpen, X } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorks } from '../hooks/useWork';
import { api, ApiError } from '../lib/api';
import { cdnImage, cdnSrcSet } from '../lib/img';
import type { Work } from '../types';

export default function SpotlightSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showQuickLook, setShowQuickLook] = useState(false);
  const navigate = useNavigate();

  // Default list (no query) — newest 20 works
  const { works: recent, loading: recentLoading, error: recentError } = useWorks(1, 20);

  // Server-side search (debounced) when query has >=2 chars
  const [searchResults, setSearchResults] = useState<Work[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const q = query.trim();

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (q.length < 2) {
      setSearchResults(null);
      setSearching(false);
      setSearchError(null);
      return;
    }
    let cancelled = false;
    setSearching(true);
    setSearchError(null);
    const t = setTimeout(() => {
      api.searchWorks(q)
        .then((d) => { if (!cancelled) setSearchResults(d.works); })
        .catch((e) => {
          if (cancelled) return;
          setSearchError(e instanceof ApiError ? e.message : 'فشل البحث');
          setSearchResults([]);
        })
        .finally(() => { if (!cancelled) setSearching(false); });
    }, 200);
    return () => { cancelled = true; clearTimeout(t); };
  }, [q]);

  const filteredWorks = useMemo(
    () => (q.length >= 2 ? (searchResults ?? []) : recent),
    [q, searchResults, recent],
  );
  const loading = q.length >= 2 ? searching : recentLoading;
  const error = q.length >= 2 ? searchError : recentError;

  const handleSelect = useCallback(() => {
    const target = filteredWorks[selectedIndex];
    if (target) {
      navigate(`/reading/${target.id}`);
      onClose();
      setQuery('');
      setShowQuickLook(false);
    }
  }, [filteredWorks, selectedIndex, navigate, onClose]);

  const handleClose = useCallback(() => {
    onClose();
    setQuery('');
    setShowQuickLook(false);
  }, [onClose]);

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
  }, [isOpen, filteredWorks, selectedIndex, showQuickLook, handleClose, handleSelect]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 md:px-0"
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-label="البحث في الأعمال"
        >
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
                    aria-label="إغلاق المعاينة السريعة"
                    className="absolute top-8 left-8 p-2 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                  {filteredWorks[selectedIndex].image_url && (
                    <div className="aspect-[2/3] w-48 mx-auto mb-8 rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={cdnImage(filteredWorks[selectedIndex].image_url, 600)}
                        srcSet={cdnSrcSet(filteredWorks[selectedIndex].image_url, [400, 600, 800])}
                        sizes="192px"
                        alt={filteredWorks[selectedIndex].title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h2 className="font-serif text-4xl text-primary text-center mb-4">{filteredWorks[selectedIndex].title}</h2>
                  <p className="font-sans text-accent text-center font-bold mb-6 uppercase tracking-widest text-xs">
                    {filteredWorks[selectedIndex].likes_count} إعجاب
                  </p>
                  {filteredWorks[selectedIndex].excerpt && (
                    <p className="font-sans text-text-muted text-center leading-relaxed">
                      {filteredWorks[selectedIndex].excerpt}
                    </p>
                  )}
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
                aria-label="إغلاق البحث"
                className="w-3 h-3 rounded-full bg-[#FF5F56] border border-stone-900/10 hover:shadow-inner transition-all flex items-center justify-center group"
              >
                <X size={8} aria-hidden="true" className="text-[#4c0000] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-stone-900/10 shadow-sm opacity-60"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-stone-900/10 shadow-sm opacity-60"></div>
            </div>

            {/* Input Area */}
            <div className="flex items-center px-6 py-5 bg-stone-50/50 border-b border-accent/10 pt-2">
              <Search className="text-accent ml-4" size={24} aria-hidden="true" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="حقل البحث عن الأعمال الأدبية"
                className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-sans text-text-main placeholder:text-stone-400 outline-none"
                placeholder="ابحث عن عمل أدبي..."
                type="text"
              />
              <div className="flex items-center gap-3">
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="مسح حقل البحث"
                    className="p-1.5 hover:bg-stone-200 rounded-full transition-colors text-stone-400"
                  >
                    <X size={16} aria-hidden="true" />
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

                {loading ? (
                  <p className="font-sans text-sm text-stone-400 text-center py-12">جاري تحميل الأعمال...</p>
                ) : error ? (
                  <p className="font-sans text-sm text-red-500 text-center py-12">تعذر التحميل: {error}</p>
                ) : filteredWorks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-serif text-2xl text-stone-300 mb-3">لا توجد نتائج</p>
                    <p className="font-sans text-sm text-stone-400">جرّب البحث بكلمات أخرى</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {filteredWorks.map((item, i) => (
                      <motion.div
                        key={item.id}
                        onClick={handleSelect}
                        onMouseEnter={() => setSelectedIndex(i)}
                        whileTap={{ scale: 0.98 }}
                        className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer border ${selectedIndex === i ? 'bg-accent/5 border-accent/20 shadow-sm' : 'border-transparent hover:bg-stone-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 rounded-lg bg-stone-200 overflow-hidden shadow-sm flex items-center justify-center">
                            {item.image_url ? (
                              <img
                                src={cdnImage(item.image_url, 200)}
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookOpen size={18} className="text-stone-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-base font-serif font-bold text-primary leading-tight mb-1">{item.title}</h4>
                            {item.excerpt && (
                              <p className="text-xs font-sans text-text-muted line-clamp-1">{item.excerpt}</p>
                            )}
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
