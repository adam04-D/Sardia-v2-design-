import { useCallback, useEffect, useState } from 'react';
import { Check, Mail, Trash2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { EmptyState } from '../../components/ui/EmptyState';

interface Msg {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { messages } = await api.listMessages();
      setMessages(messages);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (m: Msg) => {
    setBusyId(m.id);
    try {
      await api.markMessageRead(m.id);
      setMessages((prev) => prev.map((x) => x.id === m.id ? { ...x, is_read: true } : x));
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'فشل التحديث');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (m: Msg) => {
    if (!confirm('حذف هذه الرسالة نهائياً؟')) return;
    setBusyId(m.id);
    try {
      await api.deleteMessage(m.id);
      setMessages((prev) => prev.filter((x) => x.id !== m.id));
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'فشل الحذف');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl font-bold text-primary">رسائل التواصل</h1>
        <p className="font-sans text-sm text-stone-500 mt-1">الرسائل الواردة من نموذج الاتصال</p>
      </header>

      {loading ? (
        <p className="font-sans text-stone-500">جاري التحميل...</p>
      ) : error ? (
        <p className="font-sans text-red-600">{error}</p>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="لا توجد رسائل"
          description="ستظهر هنا أي رسالة يرسلها القراء عبر نموذج التواصل."
        />
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`bg-white rounded-xl border p-5 ${
                m.is_read ? 'border-stone-100' : 'border-accent/30 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-sans text-sm font-bold text-stone-800">{m.name}</span>
                    <a
                      href={`mailto:${m.email}`}
                      dir="ltr"
                      className="font-sans text-xs text-accent hover:underline"
                    >
                      {m.email}
                    </a>
                    {!m.is_read && (
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">
                        جديد
                      </span>
                    )}
                    <span className="font-sans text-xs text-stone-400">
                      {new Date(m.created_at).toLocaleDateString('ar')}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                    {m.message}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!m.is_read && (
                    <button
                      onClick={() => handleMarkRead(m)}
                      disabled={busyId === m.id}
                      aria-label="تعليم كمقروء"
                      className="p-2 rounded hover:bg-emerald-50 text-emerald-600 disabled:opacity-40"
                    >
                      <Check size={16} aria-hidden="true" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(m)}
                    disabled={busyId === m.id}
                    aria-label="حذف الرسالة"
                    className="p-2 rounded hover:bg-red-50 text-red-600 disabled:opacity-40"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
