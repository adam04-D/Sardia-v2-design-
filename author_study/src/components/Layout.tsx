/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Search, Menu, Instagram, Mail } from 'lucide-react';
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
  const isReading = location.pathname === "/reading";
  const isHome = location.pathname === "/";

  const [activeSection, setActiveSection] = useState('author');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll for header padding
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section with IntersectionObserver (only on home page)
  useEffect(() => {
    if (!isHome) return;
    
    const sections = document.querySelectorAll('.snap-section');
    if (sections.length === 0) return;

    const observers: IntersectionObserver[] = [];
    sections.forEach((section) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id);
          }
        },
        { rootMargin: '-30% 0px -30% 0px', threshold: 0.1 }
      );
      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isHome, location.pathname]);

  // Keyboard shortcut for search
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

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'author', label: 'المؤلف' },
    { id: 'library', label: 'المكتبة' },
    { id: 'contact', label: 'تواصل معنا' },
  ];
  
  return (
    <div className="min-h-screen selection:bg-accent/20 selection:text-accent bg-noise">
      <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ProgressRail />

      {/* Premium Glass Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 glass-nav transition-all duration-500"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={`flex justify-between items-center px-6 md:px-12 transition-all duration-500 max-w-7xl mx-auto ${isScrolled ? 'py-3' : 'py-5'}`}>
          <button 
            onClick={() => {
              if (isHome) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.location.href = '/';
              }
            }}
            className="text-3xl font-bold text-accent font-serif tracking-tight cursor-pointer"
          >
            سرديا
          </button>
          <nav className="hidden md:flex gap-12 items-center">
            {isHome ? (
              // On home page: smooth scroll anchors
              navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`${activeSection === item.id ? 'text-accent font-bold' : 'text-text-muted hover:text-accent'} transition-colors duration-300 font-serif text-xl relative group cursor-pointer bg-transparent border-none`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 right-0 h-[1px] bg-accent transition-all duration-500 ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              ))
            ) : (
              // On reading page: link back to home sections
              navItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/#${item.id}`}
                  className="text-text-muted hover:text-accent transition-colors duration-300 font-serif text-xl relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full"></span>
                </Link>
              ))
            )}
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

      <main className={`${isReading ? 'pt-0' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      {!isReading && (
        <footer id="contact" className="w-full py-16 border-t border-accent/10 glass-panel mt-20">
          <div className="flex flex-col items-center px-6 md:px-12 max-w-7xl mx-auto gap-8">
            <div className="text-3xl font-serif font-bold text-text-main">سرديا</div>
            <p className="font-sans text-text-muted text-center max-w-md leading-relaxed">تواصل معي عبر وسائل التواصل الاجتماعي أو البريد الإلكتروني</p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full border border-stone-200 text-stone-400 hover:text-accent hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
                <Instagram size={22} />
              </a>
              <a href="mailto:contact@sardia.com" className="p-3 rounded-full border border-stone-200 text-stone-400 hover:text-accent hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
                <Mail size={22} />
              </a>
            </div>
            <div className="w-full border-t border-accent/10 pt-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-text-muted text-sm font-sans">© 2026 سرديا. جميع الحقوق محفوظة للمؤلف.</p>
              <div className="flex gap-8">
                <a href="#" className="text-text-muted text-sm font-sans font-medium hover:text-accent transition-colors">الخصوصية</a>
                <a href="#" className="text-text-muted text-sm font-sans font-medium hover:text-accent transition-colors">الأرشيف</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
