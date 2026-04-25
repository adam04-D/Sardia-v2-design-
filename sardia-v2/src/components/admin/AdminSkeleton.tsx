// Skeleton matching AdminLayout: sidebar on the right (RTL), content area on the left.
// Shown while ProtectedRoute waits on the /me hydration so the screen doesn't flash
// to a generic spinner before snapping into the admin shell.
export default function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50 flex" dir="rtl">
      <aside className="hidden md:flex flex-col w-64 bg-white border-l border-stone-100">
        <div className="px-6 py-8 border-b border-stone-100">
          <div className="h-6 w-24 rounded bg-stone-200 animate-pulse" />
          <div className="mt-2 h-3 w-16 rounded bg-stone-100 animate-pulse" />
        </div>
        <div className="flex-1 px-4 py-6 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-stone-100 animate-pulse" />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 space-y-6">
        <div className="h-8 w-48 rounded bg-stone-200 animate-pulse" />
        <div className="h-4 w-64 rounded bg-stone-100 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-white border border-stone-100 animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-white border border-stone-100 animate-pulse" />
      </main>
    </div>
  );
}
