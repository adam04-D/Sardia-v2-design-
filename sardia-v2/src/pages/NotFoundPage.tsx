import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="الصفحة غير موجودة" description="الصفحة المطلوبة غير متاحة." path="/404" />
      <section
        dir="rtl"
        className="min-h-[70vh] flex items-center justify-center px-6 md:px-12 py-24 text-right"
      >
        <div className="max-w-xl">
          <p className="font-sans text-sm tracking-[0.3em] text-accent mb-6">٤٠٤</p>
          <h1 className="font-serif text-4xl md:text-5xl text-primary font-bold mb-6">
            الصفحة غير موجودة
          </h1>
          <p className="font-serif text-lg text-text-muted leading-[2] mb-10">
            يبدو أنّ الصفحة التي تبحث عنها قد انتقلت، أو لم تكن موجودة أصلاً. عُد إلى المكتبة
            لاستكشاف الأعمال المتاحة.
          </p>
          <div className="flex flex-wrap gap-4 font-sans">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              تصفّح المكتبة
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-stone-300 text-text-main hover:bg-stone-50 transition-colors"
            >
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
