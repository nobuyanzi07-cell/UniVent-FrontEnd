import { useState, useEffect, useCallback } from 'react';
import { searchEvents } from '../services/eventsApi';

export function useEvents({ keyword = '', city = '', page = 0, size = 20 } = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    searchEvents({ keyword, city, page, size })
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

    return () => {
      cancelled = true;
    };
  }, [keyword, city, page, size, reloadCount]);

  const refetch = useCallback(() => setReloadCount((c) => c + 1), []);

  return { events, loading, error, refetch };
}