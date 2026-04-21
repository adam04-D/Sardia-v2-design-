import { useState } from 'react';
import { Send } from 'lucide-react';
import Seo from '../components/Seo';
import { api, ApiError } from '../lib/api';

const NAME_MAX = 80;
const EMAIL_MAX = 160;
const MESSAGE_MAX = 4000;

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();
  const canSubmit =
    !submitting &&
    trimmedName.length > 0 &&
    trimmedEmail.length > 0 &&
    trimmedMessage.length >= 10 &&
    name.length <= NAME_MAX &&
    email.length <= EMAIL_MAX &&
    message.length <= MESSAGE_MAX;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setStatus(null);
    try {
      await api.submitContact({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        website,
      });
      setStatus({ kind: 'ok', msg: 'تم إرسال رسالتك. سنعود إليك قريباً.' });
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus({
        kind: 'err',
        msg: err instanceof ApiError ? err.message : 'تعذر إرسال الرسالة. حاول مرة أخرى.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="تواصل معنا" description="أرسل رسالتك إلى آدم داودي." path="/contact" />
      <section
        dir="rtl"
        className="max-w-2xl mx-auto px-6 md:px-12 py-24 text-right font-serif text-text-main"
      >
        <h1 className="font-serif text-4xl md:text-5xl text-primary font-bold mb-6">تواصل معنا</h1>
        <p className="font-sans text-text-muted leading-[2] mb-12">
          سواء كان سؤالاً، ملاحظةً على عمل، أو دعوةً للتعاون — اترك رسالتك وسنعود إليك في أقرب وقت.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="contact-name" className="block font-sans text-sm text-text-muted mb-2">
              الاسم
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              maxLength={NAME_MAX}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white font-sans text-sm focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block font-sans text-sm text-text-muted mb-2">
              البريد الإلكتروني
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              maxLength={EMAIL_MAX}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white font-sans text-sm focus:outline-none focus:border-accent transition-colors"
              required
              dir="ltr"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block font-sans text-sm text-text-muted mb-2">
              الرسالة
            </label>
            <textarea
              id="contact-message"
              value={message}
              maxLength={MESSAGE_MAX}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white font-sans text-sm leading-relaxed focus:outline-none focus:border-accent transition-colors resize-y"
              required
            />
            <p className="font-sans text-xs text-stone-400 mt-1">
              {message.length}/{MESSAGE_MAX}
            </p>
          </div>

          <div aria-hidden="true" className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-sans text-sm font-bold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} aria-hidden="true" />
            {submitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
          </button>

          {status && (
            <p className={`font-sans text-sm ${status.kind === 'ok' ? 'text-accent' : 'text-red-500'}`}>
              {status.msg}
            </p>
          )}
        </form>
      </section>
    </>
  );
}
