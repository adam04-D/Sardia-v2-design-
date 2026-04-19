import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, Settings, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/admin', end: true, label: 'لوحة التحكم', icon: LayoutDashboard },
  { to: '/admin/works', label: 'الأعمال', icon: BookOpen },
  { to: '/admin/comments', label: 'التعليقات', icon: MessageSquare },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 flex">
      <aside className="w-64 bg-white border-l border-stone-200 flex flex-col">
        <div className="px-6 py-8 border-b border-stone-100">
          <p className="font-serif text-2xl font-bold text-primary">سرديا</p>
          <p className="font-sans text-xs text-stone-500 mt-1">لوحة الإدارة</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1" aria-label="التنقل الإداري">
          {navItems.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors ${
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
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} aria-hidden="true" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
