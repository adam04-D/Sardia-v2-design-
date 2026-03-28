/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Search, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SpotlightSearch from './SpotlightSearch';

export function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6 z-40">
      <div className="h-64 w-[1px] bg-accent/20 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-accent"
          style={{ height }}
        />
      </div>
      <span className="text-[10px] font-sans font-bold text-accent tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
        مستوى التقدم
      </span>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isGallery = location.pathname === "/";
  const isAuthor = location.pathname === "/author";
  const isReading = location.pathname === "/reading";

  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
  
  return (
    <div className="min-h-screen selection:bg-accent/20 selection:text-accent bg-noise">
      <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ProgressRail />

      {/* Premium Glass Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 glass-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
          <Link to="/" className="text-3xl font-bold text-accent font-serif tracking-tight">سرديا</Link>
          <nav className="hidden md:flex gap-12 items-center">
            <Link 
              to="/" 
              className={`${isGallery ? 'text-accent font-bold' : 'text-text-muted hover:text-accent'} transition-colors duration-300 font-serif text-xl relative group`}
            >
              المكتبة
              <span className={`absolute -bottom-1 right-0 h-[1px] bg-accent transition-all duration-500 ${isGallery ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link 
              to="/author" 
              className={`${isAuthor ? 'text-accent font-bold' : 'text-text-muted hover:text-accent'} transition-colors duration-300 font-serif text-xl relative group`}
            >
              المؤلف
              <span className={`absolute -bottom-1 right-0 h-[1px] bg-accent transition-all duration-500 ${isAuthor ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link 
              to="/reading" 
              className={`${isReading ? 'text-accent font-bold' : 'text-text-muted hover:text-accent'} transition-colors duration-300 font-serif text-xl relative group`}
            >
              القراءة
              <span className={`absolute -bottom-1 right-0 h-[1px] bg-accent transition-all duration-500 ${isReading ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <a href="#" className="text-text-muted hover:text-accent transition-colors duration-300 font-serif text-xl relative group">
              إحصائيات
              <span className="absolute -bottom-1 right-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full"></span>
            </a>
          </nav>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/50 hover:bg-white/80 border border-stone-200 rounded-full transition-all duration-300 group"
            >
              <span className="font-sans text-[10px] font-bold text-stone-400 group-hover:text-stone-600 tracking-widest">CMD + K</span>
              <Search size={16} strokeWidth={2} className="text-accent" />
            </button>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 hover:bg-accent/5 rounded-full transition-all duration-300 text-accent md:hidden"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="p-2.5 hover:bg-accent/5 rounded-full transition-all duration-300 text-accent md:hidden">
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      <main className={`${isReading ? 'pt-0' : 'pt-40'} pb-24 px-6 md:px-12 max-w-7xl mx-auto`}>
        {children}
      </main>

      {/* Footer */}
      {!isReading && (
        <footer className="w-full py-12 border-t border-accent/10 glass-panel mt-20">
          <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 max-w-7xl mx-auto gap-6">
            <div className="text-2xl font-serif font-bold text-text-main">سرديا</div>
            <div className="flex gap-8">
              <a href="#" className="text-text-muted text-sm font-sans font-medium hover:text-accent transition-colors">الخصوصية</a>
              <a href="#" className="text-text-muted text-sm font-sans font-medium hover:text-accent transition-colors">تواصل معنا</a>
              <a href="#" className="text-text-muted text-sm font-sans font-medium hover:text-accent transition-colors">الأرشيف</a>
            </div>
            <p className="text-text-muted text-sm font-sans">© ٢٠٢٤ سرديا. جميع الحقوق محفوظة للمؤلف.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
