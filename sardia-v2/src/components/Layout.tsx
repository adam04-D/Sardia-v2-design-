/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Search, Menu, Instagram, Mail, Twitter, Youtube } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';

const SpotlightSearch = lazy(() => import('./SpotlightSearch'));

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
      <a href="#main-content" className="skip-link">تخطَّ إلى المحتوى الرئيسي</a>
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </Suspense>
      )}
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
            aria-label="سرديا - الصفحة الرئيسية"
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
              aria-label="فتح البحث (CMD + K)"
              className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/50 hover:bg-white/80 border border-stone-200 rounded-full transition-all duration-300 group"
            >
              <span className="font-sans text-[10px] font-bold text-stone-400 group-hover:text-stone-600 tracking-widest">CMD + K</span>
              <Search size={16} strokeWidth={2} className="text-accent" aria-hidden="true" />
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="فتح البحث"
              className="p-2.5 hover:bg-accent/5 rounded-full transition-all duration-300 text-accent md:hidden"
            >
              <Search size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
              aria-label="القائمة"
              className="p-2.5 hover:bg-accent/5 rounded-full transition-all duration-300 text-accent md:hidden"
            >
              <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.header>

      <main id="main-content" className={`${isReading ? 'pt-0' : ''}`}>
        {children}
      </main>

      {/* Premium Multi-Column Footer */}
      {!isReading && (
        <footer id="contact" className="w-full bg-[#523A28] text-[#FDFBF7] py-20 mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 mb-16 border-b border-white/10 pb-16">
              
              {/* Brand & Socials (Col 1) */}
              <div className="md:col-span-2 space-y-8">
                <div className="text-4xl font-serif font-bold text-white tracking-widest">آدم داودي</div>
                <div className="flex gap-4">
                  <a href="#" aria-label="إنستغرام" className="text-white/70 hover:text-white transition-colors duration-300">
                    <Instagram size={20} aria-hidden="true" />
                  </a>
                  <a href="#" aria-label="تويتر" className="text-white/70 hover:text-white transition-colors duration-300">
                    <Twitter size={20} aria-hidden="true" />
                  </a>
                  <a href="#" aria-label="يوتيوب" className="text-white/70 hover:text-white transition-colors duration-300">
                    <Youtube size={20} aria-hidden="true" />
                  </a>
                  <a href="mailto:adamdaoudi@gmail.com" aria-label="البريد الإلكتروني" className="text-white/70 hover:text-white transition-colors duration-300">
                    <Mail size={20} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Links (Cols 2-4) */}
              <div className="space-y-6">
                <h4 className="font-serif text-lg text-white mb-4">عن المؤلف</h4>
                <ul className="space-y-4 font-sans text-sm text-white/70">
                  <li><Link to="/about" className="hover:text-white transition-colors">قصتي</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors">الصحافة والإعلام</a></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-serif text-lg text-white mb-4">المكتبة</h4>
                <ul className="space-y-4 font-sans text-sm text-white/70">
                  <li><Link to="/reading" className="hover:text-white transition-colors">الكتب</Link></li>
                  <li><Link to="/reading" className="hover:text-white transition-colors">دراسات نقدية</Link></li>
                  <li><Link to="/reading" className="hover:text-white transition-colors">قصائد</Link></li>
                  <li><Link to="/reading" className="hover:text-white transition-colors">قصص قصيرة</Link></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-serif text-lg text-white mb-4">المساعدة</h4>
                <ul className="space-y-4 font-sans text-sm text-white/70">
                  <li><a href="mailto:adamdaoudi@gmail.com" className="hover:text-white transition-colors">التواصل الأكاديمي</a></li>
                  <li><a href="mailto:adamdaoudi@gmail.com" className="hover:text-white transition-colors">دعم القراء</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
                </ul>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs text-white/50">
              <p>© 2026 سرديا. جميع الحقوق محفوظة. تم تطوير الموقع بواسطة آدم داودي.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
                <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
              </div>
            </div>

          </div>
        </footer>
      )}
    </div>
  );
}
