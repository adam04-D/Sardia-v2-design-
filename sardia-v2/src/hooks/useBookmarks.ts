import { useCallback, useEffect, useState } from 'react';

// Bookmarks live in localStorage under a single JSON-encoded array of work IDs.
// No backend roundtrip — this is a personal-device feature, not a synced one.
// Cross-tab updates land via the `storage` event so toggling on one tab
// reflects on another within ms.

const KEY = 'sardia.bookmarks.v1';

type StoredId = number;

function readStore(): StoredId[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Coerce + dedup in case storage was hand-edited.
    return Array.from(new Set(parsed.map((v) => Number(v)).filter((n) => Number.isFinite(n) && n > 0)));
  } catch {
    return [];
  }
}

function writeStore(ids: StoredId[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Storage full / disabled — silent no-op. Bookmarks are best-effort.
  }
}

export function useBookmarks() {
  const [ids, setIds] = useState<StoredId[]>(() => readStore());

  // Keep state in sync with other tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      setIds(readStore());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const has = useCallback((id: number) => ids.includes(id), [ids]);

  const add = useCallback((id: number) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [id, ...prev];
      writeStore(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setIds((prev) => {
      if (!prev.includes(id)) return prev;
      const next = prev.filter((x) => x !== id);
      writeStore(next);
      return next;
    });
  }, []);

  const toggle = useCallback(
    (id: number) => {
      if (ids.includes(id)) remove(id);
      else add(id);
    },
    [ids, add, remove],
  );

  return { ids, has, add, remove, toggle };
}
