import { useState, useEffect, useCallback } from 'react';
import { getEventById } from '../services/eventsApi';

export function useEvent(id) {
  const [result, setResult] = useState({ key: null, event: null, error: null });
  const [reloadCount, setReloadCount] = useState(0);

  const requestKey = `${id}|${reloadCount}`;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    getEventById(id)
      .then((event) => {
        if (!cancelled) setResult({ key: requestKey, event, error: null });
      })
      .catch((error) => {
        if (!cancelled) setResult({ key: requestKey, event: null, error });
      });

    return () => {
      cancelled = true;
    };
  }, [id, requestKey]);

  const loading = Boolean(id) && result.key !== requestKey;
  const refetch = useCallback(() => setReloadCount((c) => c + 1), []);

  return {
    event: loading ? null : result.event,
    loading,
    error: loading ? null : result.error,
    refetch,
  };
}