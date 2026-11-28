import { useState, useEffect, useCallback } from 'react';
import { searchEvents } from '../services/eventsApi';

export function useEvents({ keyword = '', clubId } = {}) {
  const [result, setResult] = useState({ key: null, events: [], error: null });
  const [reloadCount, setReloadCount] = useState(0);

  const term = keyword.trim();
  const requestKey = `${term}|${clubId ?? ''}|${reloadCount}`;

  useEffect(() => {
    let cancelled = false;

    // Debounce so we don't fetch on every keystroke
    const timer = setTimeout(() => {
      searchEvents({ keyword: term, clubId })
        .then((events) => {
          if (!cancelled) setResult({ key: requestKey, events, error: null });
        })
        .catch((error) => {
          if (!cancelled) setResult({ key: requestKey, events: [], error });
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term, clubId, requestKey]);

  const loading = result.key !== requestKey;
  const refetch = useCallback(() => setReloadCount((c) => c + 1), []);

  return {
    events: result.events,
    loading,
    error: loading ? null : result.error,
    refetch,
  };
}
