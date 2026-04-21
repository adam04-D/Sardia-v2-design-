import Seo from '../components/Seo';

export default function PrivacyPage() {
  return (
    <>
      <Seo title="سياسة الخصوصية" description="سياسة خصوصية موقع سرديا." path="/privacy" />
      <article className="max-w-3xl mx-auto px-6 md:px-12 py-24 font-serif text-text-main leading-[2] text-right" dir="rtl">
        <h1 className="font-serif text-4xl md:text-5xl text-primary font-bold mb-10">سياسة الخصوصية</h1>
        <p className="font-sans text-sm text-text-muted mb-10">آخر تحديث: أبريل 2026</p>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary mt-8">البيانات التي نجمعها</h2>
          <p>
            عند ترك تعقيب أو الاشتراك في تجربة القراءة، نخزن اسمك ومحتوى التعقيب فقط. لا نطلب بريدك الإلكتروني أو أي بيانات شخصية أخرى.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">ملفات تعريف الارتباط (Cookies)</h2>
          <p>
            يستخدم الموقع ملف تعريف ارتباط واحد فقط، وهو ملف جلسة المدير (<code className="font-mono text-sm">sardia_admin_token</code>)، ويظهر فقط عند تسجيل الدخول إلى لوحة التحكم. لا نستخدم ملفات تعقّب إعلانية أو ملفات تحليلات.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">حقوقك</h2>
          <p>
            يمكنك طلب حذف أي تعقيب نشرته عبر مراسلتنا على البريد الإلكتروني
            {' '}<a href="mailto:adamdaoudi04@gmail.com" className="text-accent hover:underline">adamdaoudi04@gmail.com</a>
            {' '}وسنحذفه خلال سبعة أيام.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">التحديثات</h2>
          <p>قد نعدّل هذه السياسة من وقت لآخر. سيُنشر أي تعديل جوهري على هذه الصفحة.</p>
        </section>
      </article>
    </>
  );
}
