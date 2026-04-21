import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, Mail, Settings, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/auth';

const navItems = [
  { to: '/admin', end: true, label: 'لوحة التحكم', icon: LayoutDashboard },
  { to: '/admin/works', label: 'الأعمال', icon: BookOpen },
  { to: '/admin/comments', label: 'التعليقات', icon: MessageSquare },
  { to: '/admin/messages', label: 'الرسائل', icon: Mail },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const sidebarContent = (
    <>
      <div className="px-6 py-8 border-b border-stone-100 flex items-center justify-between">
        <div>
          <p className="font-serif text-2xl font-bold text-primary">سرديا</p>
          <p className="font-sans text-xs text-stone-500 mt-1">لوحة الإدارة</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="إغلاق القائمة"
          className="md:hidden p-2 -mr-2 text-stone-500 hover:text-stone-700"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto" aria-label="التنقل الإداري">
        {navItems.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-sans transition-colors ${
                isActive ? 'bg-accent/10 text-accent font-bold' : 'text-stone-600 hover:bg-stone-100'
              }`
            }
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-stone-100 p-4 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-xs font-sans text-stone-500 hover:text-accent transition-colors"
        >
          <ExternalLink size={14} aria-hidden="true" />
          معاينة الموقع
        </a>
        {user && (
          <div className="px-3 py-2 text-xs font-sans text-stone-500">
            مرحباً، <span className="font-bold text-stone-700">{user.username}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-sans text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} aria-hidden="true" />
          تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 md:flex">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="فتح القائمة"
          className="p-2 -mr-2 text-stone-700 hover:text-accent"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
        <p className="font-serif text-lg font-bold text-primary">سرديا — الإدارة</p>
        <span className="w-10" aria-hidden="true" />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-l border-stone-200 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-stone-900/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white border-l border-stone-200 flex flex-col shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
