import { useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { Pagination, Work } from '../types';

export function useWork(id: string | number | undefined) {
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getWork(id)
      .then(({ work }) => {
        if (!cancelled) setWork(work);
      })
      .catch((err: ApiError | Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { work, loading, error, setWork };
}

export function useWorks(page = 1, limit = 10) {
  const [works, setWorks] = useState<Work[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .listWorks(page, limit)
      .then(({ works, pagination }) => {
        if (cancelled) return;
        setWorks(works);
        setPagination(pagination);
      })
      .catch((err: ApiError | Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  return { works, pagination, loading, error };
}
