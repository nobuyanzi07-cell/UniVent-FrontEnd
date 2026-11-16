import { useState, useEffect, useCallback } from 'react';
import { searchEvents } from '../services/eventsApi';

export function useEvents({ keyword = '' } = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Debounce so we don't fetch on every keystroke
    const timer = setTimeout(() => {
      searchEvents({ keyword: keyword.trim() })
        .then((data) => {
          if (!cancelled) setEvents(data);
        })
        .catch((err) => {
          if (!cancelled) {
            setEvents([]);
            setError(err);
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [keyword, reloadCount]);

  const refetch = useCallback(() => setReloadCount((c) => c + 1), []);

  return { events, loading, error, refetch };
}