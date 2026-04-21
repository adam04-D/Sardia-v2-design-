import Seo from '../components/Seo';

export default function TermsPage() {
  return (
    <>
      <Seo title="شروط الاستخدام" description="شروط استخدام موقع سرديا." path="/terms" />
      <article className="max-w-3xl mx-auto px-6 md:px-12 py-24 font-serif text-text-main leading-[2] text-right" dir="rtl">
        <h1 className="font-serif text-4xl md:text-5xl text-primary font-bold mb-10">شروط الاستخدام</h1>
        <p className="font-sans text-sm text-text-muted mb-10">آخر تحديث: أبريل 2026</p>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary mt-8">المحتوى الأدبي</h2>
          <p>
            جميع الأعمال المنشورة على هذا الموقع من تأليف آدم داودي، ومحفوظة بحقوق المؤلف. يُسمح باقتباس فقرات قصيرة لأغراض نقدية أو تعليمية شرط الإشارة إلى المصدر.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">تعقيبات القراء</h2>
          <p>
            يظل القارئ مسؤولاً عمّا ينشره من تعقيبات. تحتفظ إدارة الموقع بحق رفض أو حذف أي تعقيب يتضمن إساءة أو محتوى ترويجياً أو مخالفاً للذوق العام، دون إشعار مسبق.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">حدود المسؤولية</h2>
          <p>
            يُقدَّم الموقع "كما هو". نبذل جهداً معقولاً لضمان استمرار الخدمة، لكن لا نضمن خلوها من الأعطال أو الانقطاعات.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">القانون المعمول به</h2>
          <p>تخضع هذه الشروط لقوانين المملكة المغربية، وأي نزاع يُعرض على محاكمها المختصة.</p>
        </section>
      </article>
    </>
  );
}
